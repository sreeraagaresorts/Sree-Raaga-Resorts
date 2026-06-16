const db = require("../config/db");

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
    const [rooms] = await db.query("SELECT price FROM rooms WHERE id = ?", [room_id]);
    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(rooms[0].price);

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

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, adults, children, total_price, status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [user_id, room_id, check_in, check_out, adults || 1, children || 0, total_price, payment_method || 'online']
    );

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      bookingId: result.insertId,
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
    const [bookings] = await db.query(
      `SELECT b.*, r.name as room_name, r.image as room_image, r.price as room_price
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [user_id]
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
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
    const [bookings] = await db.query(
      `SELECT b.*, r.name as room_name, u.full_name as guest_name, u.email as guest_email, u.phone as guest_phone
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.id DESC`
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all bookings."
    });
  }
};

// 4. Update booking status (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'confirmed', 'checked_in', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const [result] = await db.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }



    res.json({
      success: true,
      message: "Booking status updated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status."
    });
  }
};

// 5. Delete booking (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
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
