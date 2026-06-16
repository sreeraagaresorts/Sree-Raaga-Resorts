const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email Already Exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const count = await User.countDocuments();
    const isFirstUser = count === 0;
    const role = isFirstUser ? "admin" : "user";

    const user = new User({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role
    });
    await user.save();

    // Trigger welcome email in background
    const { sendWelcomeEmail } = require("../utils/email");
    sendWelcomeEmail({ id: user.id, full_name, email, role }).catch(err => {
      console.error("[Email Error] Failed to send welcome email:", err);
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      userId: user.id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Trigger login alert in background
    const { sendLoginAlert } = require("../utils/email");
    sendLoginAlert(user.toObject()).catch(err => {
      console.error("[Email Error] Failed to send login alert:", err);
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.user.id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Admin-only: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'id full_name email phone role created_at').sort({ id: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users."
    });
  }
};

// Admin-only: Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (role !== "admin" && role !== "user") {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'admin' or 'user'."
      });
    }

    const user = await User.findOneAndUpdate(
      { id: Number(id) },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Send role updated email in background
    const { sendRoleUpdatedEmail } = require("../utils/email");
    sendRoleUpdatedEmail(user.toObject()).catch(err => {
      console.error("[Email Error] Failed to send role updated email:", err);
    });

    res.json({
      success: true,
      message: "User role updated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role."
    });
  }
};

// Admin-only: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account."
      });
    }

    const user = await User.findOneAndDelete({ id: Number(id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Send account deleted email in background
    const { sendAccountDeletedEmail } = require("../utils/email");
    sendAccountDeletedEmail(user.toObject()).catch(err => {
      console.error("[Email Error] Failed to send account deleted email:", err);
    });

    res.json({
      success: true,
      message: "User deleted successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user."
    });
  }
};