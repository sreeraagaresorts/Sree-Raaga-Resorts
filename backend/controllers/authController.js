const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuditLog = require("../models/AuditLog");

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required"
      });
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be a valid 10-digit number starting with +91"
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
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Log to AuditLog
    try {
      const adminUser = await User.findOne({ id: req.user.id });
      const adminName = adminUser ? adminUser.full_name : req.user.email;
      await AuditLog.create({
        adminName,
        actionType: "Role Change",
        details: `Changed role of user "${user.full_name}" (ID: #${user.id}) to ${role}`
      });
    } catch (logErr) {
      console.error("[AuditLog Error] Failed to create log:", logErr);
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

    // Log to AuditLog
    try {
      const adminUser = await User.findOne({ id: req.user.id });
      const adminName = adminUser ? adminUser.full_name : req.user.email;
      await AuditLog.create({
        adminName,
        actionType: "User Deletion",
        details: `Deleted user account "${user.full_name}" (ID: #${user.id}) and all associated bookings`
      });
    } catch (logErr) {
      console.error("[AuditLog Error] Failed to create log:", logErr);
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

exports.changePassword = async (req, res) => {
  console.log("[Change Password] req.user:", req.user);
  console.log("[Change Password] req.body:", req.body);
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      console.log("[Change Password] Missing fields");
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    const user = await User.findOne({ id: Number(req.user.id) });
    if (!user) {
      console.log("[Change Password] User not found for id:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      console.log("[Change Password] Password mismatch");
      return res.status(400).json({
        success: false,
        message: "Invalid current password"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("[Change Password] Password saved successfully");
    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update password"
    });
  }
};

exports.deleteOwnAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete your account."
      });
    }

    const user = await User.findOne({ id: Number(req.user.id) });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Account deletion aborted."
      });
    }

    await User.findOneAndDelete({ id: Number(req.user.id) });

    // Send account deleted email in background
    const { sendAccountDeletedEmail } = require("../utils/email");
    sendAccountDeletedEmail(user.toObject()).catch(err => {
      console.error("[Email Error] Failed to send account deleted email:", err);
    });

    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account"
    });
  }
};

// Admin-only: Get all audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ id: -1 });
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs."
    });
  }
};

// Get logged in user's wishlist rooms
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.user.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const Room = require("../models/Room");
    const wishlistRoomIds = user.wishlist || [];
    const rooms = await Room.find({ id: { $in: wishlistRoomIds } });
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
  }
};

// Toggle a room in user's wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.user.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const roomId = Number(req.body.roomId);
    if (!roomId) {
      return res.status(400).json({ success: false, message: "Room ID is required" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    let added = false;
    if (user.wishlist.includes(roomId)) {
      user.wishlist = user.wishlist.filter(id => id !== roomId);
    } else {
      user.wishlist.push(roomId);
      added = true;
    }

    await user.save();

    res.json({
      success: true,
      added,
      wishlist: user.wishlist,
      message: added ? "Added to wishlist" : "Removed from wishlist"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update wishlist" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone } = req.body;
    const userId = Number(req.user.id);

    if (email) {
      const existingUser = await User.findOne({ email, id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email address is already in use by another account."
        });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { $set: { full_name, email, phone } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        created_at: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile."
    });
  }
};