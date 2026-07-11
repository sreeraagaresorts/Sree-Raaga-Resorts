const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const logAction = async (userId, actionType, details) => {
  try {
    const adminUser = await User.findOne({ id: userId });
    const adminName = adminUser ? adminUser.full_name : "System / Unknown Admin";
    await AuditLog.create({
      adminName,
      actionType,
      details
    });
  } catch (err) {
    console.error("[AuditLog Error] Failed to log admin action:", err);
  }
};

// 1. Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out, adults, children, user_id: bodyUserId, payment_method, rooms, room_number, booking_source } = req.body;
    let user_id = req.user.id;

    if (req.user.role === "admin" && bodyUserId) {
      user_id = bodyUserId;
    } else if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrators cannot book rooms "
      });
    }

    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Room ID, Check-in, and Check-out dates are required."
      });
    }

    // Fetch room price to compute or verify price
    const room = await Room.findOne({ id: Number(room_id) });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(room.price);

    // Calculate nights
    const start = new Date(check_in);
    const end = new Date(check_out);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid Check-in or Check-out date format."
      });
    }

    const differenceInTime = end.getTime() - start.getTime();
    if (differenceInTime <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after Check-in date."
      });
    }
    const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    const roomCount = Number(rooms) || 1;

    // Check specific room number availability if provided
    if (room_number) {
      const roomNumbers = room_number.split(",").map(num => num.trim());
      for (const num of roomNumbers) {
        const unit = room.roomStatuses.find(u => u.roomNumber === num);
        if (!unit) {
          return res.status(400).json({
            success: false,
            message: `Room unit "${num}" does not belong to category "${room.name}".`
          });
        }

        if (unit.status !== "Available") {
          return res.status(400).json({
            success: false,
            message: `Room unit "${num}" is currently marked as "${unit.status}" and cannot be booked.`
          });
        }
      }

      // Check for overlapping bookings on these specific room numbers
      const overlappingBookings = await Booking.find({
        status: { $ne: "cancelled" },
        $or: [
          { check_in: { $lt: end }, check_out: { $gt: start } }
        ]
      });

      for (const num of roomNumbers) {
        const isOverlapping = overlappingBookings.some(ob => {
          if (!ob.room_number) return false;
          const obRooms = ob.room_number.split(",").map(r => r.trim());
          return obRooms.includes(num);
        });
        if (isOverlapping) {
          return res.status(400).json({
            success: false,
            message: `Room unit "${num}" is already booked for these dates.`
          });
        }
      }
    }

    // Check category level availability
    const totalRooms = room.totalRooms || 1;

    const overlappingBookings = await Booking.find({
      room_id: room.id,
      status: { $ne: "cancelled" },
      $or: [
        { check_in: { $lt: end }, check_out: { $gt: start } }
      ]
    });

    let bookedRoomsCount = 0;
    overlappingBookings.forEach(b => {
      bookedRoomsCount += b.rooms || 1;
    });

    if (bookedRoomsCount + roomCount > totalRooms) {
      const availableCount = Math.max(0, totalRooms - bookedRoomsCount);
      return res.status(400).json({
        success: false,
        message: `Only ${availableCount} rooms are available for this category.`
      });
    }

    const total_price = nights * roomPrice * roomCount;

    const booking = new Booking({
      user_id: Number(user_id),
      room_id: Number(room_id),
      check_in: start,
      check_out: end,
      adults: adults || 1,
      children: children || 0,
      rooms: roomCount,
      room_number: room_number || null,
      total_price: req.body.total_price !== undefined ? Number(req.body.total_price) : total_price,
      subtotal: req.body.subtotal !== undefined ? Number(req.body.subtotal) : (nights * roomPrice * roomCount),
      services_price: req.body.services_price !== undefined ? Number(req.body.services_price) : 0,
      discount_price: req.body.discount_price !== undefined ? Number(req.body.discount_price) : 0,
      gst_amount: req.body.gst_amount !== undefined ? Number(req.body.gst_amount) : 0,
      coupon_code: req.body.coupon_code || null,
      status: 'confirmed',
      payment_method: payment_method || 'online',
      payment_status: req.body.payment_status !== undefined ? req.body.payment_status : (payment_method === 'pay_later' ? 'Unpaid' : 'Paid'),
      booking_source: (payment_method === 'online' || payment_method === 'razorpay')
        ? 'Website'
        : (booking_source === 'Direct' || booking_source === 'Walkin' ? 'Walk-in' : (booking_source || 'Walk-in')),
      is_manual: req.user.role === 'admin' || req.body.is_manual === true || false
    });
    await booking.save();

    // Increment coupon used_count if a coupon was applied
    if (req.body.coupon_code) {
      try {
        const Coupon = require("../models/Coupon");
        const updatedCoupon = await Coupon.findOneAndUpdate(
          { code: req.body.coupon_code.toUpperCase() },
          { $inc: { used_count: 1 } },
          { new: true }
        );
        // Auto-expire if usage limit reached
        if (updatedCoupon && updatedCoupon.used_count >= updatedCoupon.total_uses) {
          updatedCoupon.status = "expired";
          await updatedCoupon.save();
        }
      } catch (couponErr) {
        console.error("[Coupon] Failed to increment used_count:", couponErr);
      }
    }

    // Sync room unit status if room_number is specified
    if (booking.room_number) {
      await syncRoomUnitStatus(booking.room_id, booking.room_number, 'confirmed');
    }

    // Fetch details for email notification
    try {
      const user = await User.findOne({ id: Number(user_id) });
      const emailPayload = {
        ...booking.toObject(),
        room_name: room ? room.name : null,
        room_number: booking.room_number || "Not Assigned",
        guest_name: user ? user.full_name : null,
        guest_email: user ? user.email : null
      };

      const { sendBookingCreatedEmail } = require("../utils/email");
      sendBookingCreatedEmail(emailPayload).catch(err => {
        console.error("[Email Error] Failed to send booking created email:", err);
      });
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for creation notification:", err);
    }

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      bookingId: booking.id,
      total_price
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Booking submission failed."
    });
  }
};

// 2. Fetch logged-in user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookings = await Booking.find({ user_id: Number(user_id) }).sort({ id: -1 });

    const populatedBookings = await Promise.all(
      bookings.map(async (b) => {
        const room = await Room.findOne({ id: b.room_id });
        return {
          ...b.toObject(),
          room_name: room ? room.name : null,
          room_image: room ? room.image : null,
          room_price: room ? room.price : null,
          room_gst_percentage: room ? room.gst_percentage : 8
        };
      })
    );

    res.json({
      success: true,
      count: populatedBookings.length,
      data: populatedBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings."
    });
  }
};

// 3. Fetch all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ id: -1 });

    const populatedBookings = await Promise.all(
      bookings.map(async (b) => {
        const room = await Room.findOne({ id: b.room_id });
        const user = await User.findOne({ id: b.user_id });
        return {
          ...b.toObject(),
          room_name: room ? room.name : null,
          room_gst_percentage: room ? room.gst_percentage : 8,
          guest_name: user ? user.full_name : null,
          guest_email: user ? user.email : null,
          guest_phone: user ? user.phone : null
        };
      })
    );

    res.json({
      success: true,
      count: populatedBookings.length,
      data: populatedBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all bookings."
    });
  }
};

// Helper to update the physical room unit status in Rooms Management
const syncRoomUnitStatus = async (roomId, roomNumber, bookingStatus) => {
  if (!roomNumber) return;
  try {
    const room = await Room.findOne({ id: roomId });
    if (!room) return;
    
    const roomNumbers = roomNumber.split(",").map(num => num.trim());
    let updated = false;

    for (const num of roomNumbers) {
      const unit = room.roomStatuses.find(u => u.roomNumber === num);
      if (unit) {
        let newStatus = "Available";
        if (bookingStatus === "confirmed") {
          newStatus = "Reserved";
        } else if (bookingStatus === "checked_in") {
          newStatus = "Occupied";
        } else if (bookingStatus === "cancelled") {
          newStatus = "Available";
        }
        unit.status = newStatus;
        updated = true;
      }
    }
    
    if (updated) {
      await room.save();
    }
  } catch (err) {
    console.error("Failed to sync room unit status:", err);
  }
};

// 4. Update booking status or details (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, payment_method, room_number, check_in, check_out, payment_status } = req.body;
    const { id } = req.params;

    const booking = await Booking.findOne({ id: Number(id) });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    const updateFields = {};

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
      updateFields.status = status;
    }

    if (payment_method !== undefined) {
      const validMethods = ['cash', 'online', 'credit_card', 'bank_transfer', 'pay_later', 'upi'];
      if (!validMethods.includes(payment_method)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment method. Must be one of: ${validMethods.join(", ")}`
        });
      }
      updateFields.payment_method = payment_method;
      updateFields.payment_status = payment_method === "pay_later" ? "Unpaid" : "Paid";
    }

    if (payment_status !== undefined) {
      updateFields.payment_status = payment_status;
    }

    if (check_in !== undefined || check_out !== undefined) {
      const start = new Date(check_in !== undefined ? check_in : booking.check_in);
      const end = new Date(check_out !== undefined ? check_out : booking.check_out);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date format." });
      }
      if (start >= end) {
        return res.status(400).json({ success: false, message: "Check-out date must be after check-in date." });
      }

      updateFields.check_in = start;
      updateFields.check_out = end;

      // Recalculate price
      const Room = require("../models/Room");
      const room = await Room.findOne({ id: booking.room_id });
      if (room) {
        const diffTime = Math.abs(end - start);
        const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const roomPrice = Number(room.price) || 0;
        const roomCount = Number(booking.rooms) || 1;
        
        updateFields.subtotal = nights * roomPrice * roomCount;
        updateFields.total_price = updateFields.subtotal + (Number(booking.services_price) || 0) - (Number(booking.discount_price) || 0) + (Number(booking.gst_amount) || 0);
      }
    }

    if (room_number !== undefined) {
      if (booking.status === "checked_in" || booking.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Cannot assign or change room number after check-in or cancellation."
        });
      }
      if (room_number) {
        const room = await Room.findOne({ id: booking.room_id });
        if (!room) {
          return res.status(404).json({ success: false, message: "Room type not found." });
        }
        
        const roomNumbers = room_number.split(",").map(num => num.trim());
        
        // Validate each room number exists in this category
        for (const num of roomNumbers) {
          const unit = room.roomStatuses.find(u => u.roomNumber === num);
          if (!unit) {
            return res.status(400).json({ success: false, message: `Room unit "${num}" does not belong to category "${room.name}".` });
          }
        }
        
        // Check for overlapping bookings on these specific room numbers (excluding this booking itself)
        const overlappingBookings = await Booking.find({
          id: { $ne: booking.id },
          status: { $ne: "cancelled" },
          $or: [
            { check_in: { $lt: booking.check_out }, check_out: { $gt: booking.check_in } }
          ]
        });

        for (const num of roomNumbers) {
          const isOverlapping = overlappingBookings.some(ob => {
            if (!ob.room_number) return false;
            const obRooms = ob.room_number.split(",").map(r => r.trim());
            return obRooms.includes(num);
          });
          if (isOverlapping) {
            return res.status(400).json({
              success: false,
              message: `Room unit "${num}" is already booked for these dates.`
            });
          }
        }
      }
      updateFields.room_number = room_number || null;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update."
      });
    }

    // Sync old room status back to Available if room number changes
    const oldRoomNumber = booking.room_number;
    const finalRoomNumber = room_number !== undefined ? room_number : oldRoomNumber;
    if (room_number !== undefined && oldRoomNumber && oldRoomNumber !== room_number) {
      await syncRoomUnitStatus(booking.room_id, oldRoomNumber, "cancelled");
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { id: Number(id) },
      updateFields,
      { returnDocument: "after" }
    );

    // Sync new/current room status based on status
    const finalStatus = status !== undefined ? status : updatedBooking.status;
    if (finalRoomNumber) {
      await syncRoomUnitStatus(updatedBooking.room_id, finalRoomNumber, finalStatus);
    }

    // Fetch details for email notification
    try {
      const room = await Room.findOne({ id: updatedBooking.room_id });
      const user = await User.findOne({ id: updatedBooking.user_id });
      const emailPayload = {
        ...updatedBooking.toObject(),
        room_name: room ? room.name : null,
        room_number: updatedBooking.room_number || "Not Assigned",
        guest_name: user ? user.full_name : null,
        guest_email: user ? user.email : null
      };

      const { sendBookingUpdatedEmail } = require("../utils/email");
      sendBookingUpdatedEmail(emailPayload).catch(err => {
        console.error("[Email Error] Failed to send booking updated email:", err);
      });
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for update notification:", err);
    }

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Booking Update",
        `Updated booking #${updatedBooking.id} (Status: ${updatedBooking.status})`
      );
    }

    res.json({
      success: true,
      message: "Booking updated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking."
    });
  }
};

// 5. Delete booking (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({ id: Number(id) });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    await Booking.findOneAndDelete({ id: Number(id) });

    // Release physical room status back to Available
    if (booking.room_number) {
      await syncRoomUnitStatus(booking.room_id, booking.room_number, "cancelled");
    }

    // Send cancel notification email in background
    try {
      const room = await Room.findOne({ id: booking.room_id });
      const user = await User.findOne({ id: booking.user_id });
      const emailPayload = {
        ...booking.toObject(),
        room_name: room ? room.name : null,
        room_number: room ? room.roomNumber : null,
        guest_name: user ? user.full_name : null,
        guest_email: user ? user.email : null
      };

      const { sendBookingDeletedEmail } = require("../utils/email");
      sendBookingDeletedEmail(emailPayload).catch(err => {
        console.error("[Email Error] Failed to send booking deleted email:", err);
      });
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for deletion notification:", err);
    }

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Booking Deletion",
        `Deleted booking #${booking.id} for guest ID #${booking.user_id}`
      );
    }

    res.json({
      success: true,
      message: "Booking deleted successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking."
    });
  }
};

// 6. Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrators cannot book rooms in the user interface."
      });
    }

    const { room_id, check_in, check_out, rooms, total_amount } = req.body;
    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Room ID, Check-in, and Check-out dates are required."
      });
    }

    // Fetch room price
    const room = await Room.findOne({ id: Number(room_id) });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(room.price);

    // Calculate nights
    const start = new Date(check_in);
    const end = new Date(check_out);
    const differenceInTime = end.getTime() - start.getTime();
    if (differenceInTime <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after Check-in date."
      });
    }
    const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    const Razorpay = require("razorpay");
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid12";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret12";

    const roomCount = Number(rooms) || 1;

    // Check availability
    const totalRooms = room.totalRooms || 1;

    const overlappingBookings = await Booking.find({
      room_id: room.id,
      status: { $ne: "cancelled" },
      $or: [
        { check_in: { $lt: end }, check_out: { $gt: start } }
      ]
    });

    let bookedRoomsCount = 0;
    overlappingBookings.forEach(b => {
      bookedRoomsCount += b.rooms || 1;
    });

    if (bookedRoomsCount + roomCount > totalRooms) {
      return res.status(400).json({
        success: false,
        message: `Only ${Math.max(0, totalRooms - bookedRoomsCount)} room(s) of type "${room.name}" are available for these dates.`
      });
    }

    const total_price = total_amount !== undefined ? Number(total_amount) : (nights * roomPrice * roomCount);

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount: Math.round(total_price * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate online payment order."
    });
  }
};

// 7. Verify Razorpay Payment and create Booking
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrators cannot book rooms in the user interface."
      });
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      room_id,
      check_in,
      check_out,
      adults,
      children,
      rooms,
      total_price: req_total_price,
      subtotal,
      services_price,
      discount_price,
      gst_amount,
      coupon_code
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters or booking details."
      });
    }

    const crypto = require("crypto");
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret12";
    
    // Verify signature
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Invalid transaction."
      });
    }

    const user_id = req.user.id;

    // Fetch room price to compute price
    const room = await Room.findOne({ id: Number(room_id) });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(room.price);

    // Calculate nights
    const start = new Date(check_in);
    const end = new Date(check_out);
    const differenceInTime = end.getTime() - start.getTime();
    const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    const roomCount = Number(rooms) || 1;

    // Check availability
    const totalRooms = room.totalRooms || 1;

    const overlappingBookings = await Booking.find({
      room_id: room.id,
      status: { $ne: "cancelled" },
      $or: [
        { check_in: { $lt: end }, check_out: { $gt: start } }
      ]
    });

    let bookedRoomsCount = 0;
    overlappingBookings.forEach(b => {
      bookedRoomsCount += b.rooms || 1;
    });

    if (bookedRoomsCount + roomCount > totalRooms) {
      return res.status(400).json({
        success: false,
        message: `Only ${Math.max(0, totalRooms - bookedRoomsCount)} room(s) of type "${room.name}" are available for these dates.`
      });
    }

    const computed_price = nights * roomPrice * roomCount;
    const final_total_price = req_total_price !== undefined ? Number(req_total_price) : computed_price;

    const booking = new Booking({
      user_id: Number(user_id),
      room_id: Number(room_id),
      check_in: start,
      check_out: end,
      adults: adults || 1,
      children: children || 0,
      rooms: roomCount,
      total_price: final_total_price,
      subtotal: subtotal !== undefined ? Number(subtotal) : computed_price,
      services_price: services_price !== undefined ? Number(services_price) : 0,
      discount_price: discount_price !== undefined ? Number(discount_price) : 0,
      gst_amount: gst_amount !== undefined ? Number(gst_amount) : 0,
      coupon_code: coupon_code || null,
      status: 'confirmed',
      payment_method: 'online',
      razorpay_payment_id: razorpay_payment_id
    });
    await booking.save();

    // Increment coupon used_count if a coupon was applied
    if (coupon_code) {
      try {
        const Coupon = require("../models/Coupon");
        const updatedCoupon = await Coupon.findOneAndUpdate(
          { code: coupon_code.toUpperCase() },
          { $inc: { used_count: 1 } },
          { new: true }
        );
        // Auto-expire if usage limit reached
        if (updatedCoupon && updatedCoupon.used_count >= updatedCoupon.total_uses) {
          updatedCoupon.status = "expired";
          await updatedCoupon.save();
        }
      } catch (couponErr) {
        console.error("[Coupon] Failed to increment used_count:", couponErr);
      }
    }

    // Fetch details for email notification (confirmed online)
    try {
      const user = await User.findOne({ id: Number(user_id) });
      const emailPayload = {
        ...booking.toObject(),
        room_name: room ? room.name : null,
        room_number: booking.room_number || "Not Assigned",
        guest_name: user ? user.full_name : null,
        guest_email: user ? user.email : null
      };

      const { sendBookingUpdatedEmail } = require("../utils/email");
      sendBookingUpdatedEmail(emailPayload).catch(err => {
        console.error("[Email Error] Failed to send booking confirmed email:", err);
      });
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for confirmation notification:", err);
    }

    res.status(201).json({
      success: true,
      message: "Online payment verified and booking confirmed successfully.",
      bookingId: booking.id,
      total_price: final_total_price
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed."
    });
  }
};
