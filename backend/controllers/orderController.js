const FoodOrder = require("../models/FoodOrder");
const Room = require("../models/Room");

// Create Order (Public)
exports.createOrder = async (req, res) => {
  try {
    const { dishName, quantity, price, totalPrice, roomNumber, guestName, guestEmail: bodyGuestEmail, specialInstructions } = req.body;

    if (!dishName || !quantity || !price || !totalPrice || !roomNumber || !guestName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Verify room number exists
    const roomExists = await Room.findOne({ roomNumber });
    if (!roomExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid room number. Please select a valid room number."
      });
    }

    let guestEmail = bodyGuestEmail;

    // If guestEmail is not provided, look up the latest active booking for this room to find their email
    if (!guestEmail) {
      try {
        const Booking = require("../models/Booking");
        const User = require("../models/User");
        const booking = await Booking.findOne({
          room_id: roomExists.id,
          status: { $in: ["confirmed", "checked_in"] }
        }).sort({ id: -1 });

        if (booking) {
          const user = await User.findOne({ id: booking.user_id });
          if (user) {
            guestEmail = user.email;
          }
        }
      } catch (err) {
        console.error("[Order Controller] Failed to resolve guest email from booking:", err);
      }
    }

    const order = new FoodOrder({
      dishName,
      quantity: Number(quantity),
      price: Number(price),
      totalPrice: Number(totalPrice),
      roomNumber,
      guestName,
      guestEmail,
      specialInstructions
    });
    await order.save();

    // Send order confirmation email in the background
    try {
      const { sendFoodOrderCreatedEmail } = require("../utils/email");
      sendFoodOrderCreatedEmail(order).catch(err => {
        console.error("[Email Error] Failed to send food order created email:", err);
      });
    } catch (err) {
      console.error("[Email Error] Failed to trigger food order created email:", err);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to place order"
    });
  }
};

// Get All Orders (Admin only)
exports.getOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.find({}).sort({ id: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

// Update Order Status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "preparing", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await FoodOrder.findOneAndUpdate(
      { id: Number(req.params.id) },
      { status },
      { returnDocument: "after" }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Send order status update email in the background
    try {
      const { sendFoodOrderStatusUpdatedEmail } = require("../utils/email");
      sendFoodOrderStatusUpdatedEmail(order).catch(err => {
        console.error("[Email Error] Failed to send food order status update email:", err);
      });
    } catch (err) {
      console.error("[Email Error] Failed to trigger food order status update email:", err);
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};

// Delete Order (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findOneAndDelete({ id: Number(req.params.id) });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order"
    });
  }
};
