const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

  try {

    const {
      full_name,
      email,
      phone,
      password
    } = req.body;

    if (
      !full_name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required"
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email Already Exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // If there are no users in the database, make the first registered user an admin
    const [countResult] = await db.query("SELECT COUNT(*) as count FROM users");
    const isFirstUser = countResult[0].count === 0;
    const role = isFirstUser ? "admin" : "user";

    const [result] = await db.query(
      `INSERT INTO users
      (
        full_name,
        email,
        phone,
        password,
        role
      )
      VALUES(?,?,?,?,?)`,
      [
        full_name,
        email,
        phone,
        hashedPassword,
        role
      ]
    );

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      userId: result.insertId
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

    const {
      email,
      password
    } = req.body;

    const [user] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email"
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user[0].password
      );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        role: user[0].role,
        email: user[0].email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user[0].id,
        full_name: user[0].full_name,
        email: user[0].email,
        phone: user[0].phone,
        role: user[0].role
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

    const [user] = await db.query(
      `SELECT
      id,
      full_name,
      email,
      phone,
      role,
      created_at
      FROM users
      WHERE id=?`,
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    res.json({
      success: true,
      user: user[0]
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
    const [users] = await db.query(
      "SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY id DESC"
    );

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

    const [result] = await db.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

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
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account."
      });
    }

    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

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