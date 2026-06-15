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
        "user"
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