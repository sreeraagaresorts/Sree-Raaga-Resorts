const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

// 1. Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out, adults, children, user_id: bodyUserId, payment_method } = req.body;
    let user_id = req.user.id;

    if (req.user.role === "admin" && bodyUserId) {
      user_id = bodyUserId;
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
    const total_price = nights * roomPrice;

    const booking = new Booking({
      user_id: Number(user_id),
      room_id: Number(room_id),
      check_in: start,
      check_out: end,
      adults: adults || 1,
      children: children || 0,
      total_price,
      status: 'pending',
      payment_method: payment_method || 'online'
    });
    await booking.save();

    // Fetch details for email notification
    try {
      const user = await User.findOne({ id: Number(user_id) });
      const emailPayload = {
        ...booking.toObject(),
        room_name: room ? room.name : null,
        room_number: room ? room.roomNumber : null,
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
          room_price: room ? room.price : null
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

// 4. Update booking status or details (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, payment_method } = req.body;
    const { id } = req.params;

    const updateFields = {};

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'checked_in', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
      updateFields.status = status;
    }

    if (payment_method !== undefined) {
      const validMethods = ['cash', 'online'];
      if (!validMethods.includes(payment_method)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment method. Must be one of: ${validMethods.join(", ")}`
        });
      }
      updateFields.payment_method = payment_method;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update."
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { id: Number(id) },
      updateFields,
      { returnDocument: "after" }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // Fetch details for email notification
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

      const { sendBookingUpdatedEmail } = require("../utils/email");
      sendBookingUpdatedEmail(emailPayload).catch(err => {
        console.error("[Email Error] Failed to send booking updated email:", err);
      });
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for update notification:", err);
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
    const { room_id, check_in, check_out } = req.body;
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
    const total_price = nights * roomPrice;

    const Razorpay = require("razorpay");
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid12";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret12";

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
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      room_id,
      check_in,
      check_out,
      adults,
      children
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
    const total_price = nights * roomPrice;

    const booking = new Booking({
      user_id: Number(user_id),
      room_id: Number(room_id),
      check_in: start,
      check_out: end,
      adults: adults || 1,
      children: children || 0,
      total_price,
      status: 'confirmed',
      payment_method: 'online'
    });
    await booking.save();

    // Fetch details for email notification (confirmed online)
    try {
      const user = await User.findOne({ id: Number(user_id) });
      const emailPayload = {
        ...booking.toObject(),
        room_name: room ? room.name : null,
        room_number: room ? room.roomNumber : null,
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
      total_price
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed."
    });
  }
};
