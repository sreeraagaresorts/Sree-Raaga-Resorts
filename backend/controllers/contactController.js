const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Submit Contact Form
|--------------------------------------------------------------------------
*/

exports.sendMessage = async (req, res) => {

  try {

    const {
      name,
      email,
      subject,
      message
    } = req.body;

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO contacts
      (
        name,
        email,
        subject,
        message
      )
      VALUES(?,?,?,?)`,
      [
        name,
        email,
        subject,
        message
      ]
    );

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
      contactId: result.insertId
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed To Send Message"
    });
  }
};

exports.getAllMessages = async (req, res) => {

  try {

    const [messages] = await db.query(
      `SELECT *
       FROM contacts
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed To Fetch Messages"
    });
  }
};

exports.deleteMessage = async (req, res) => {

  try {

    await db.query(
      "DELETE FROM contacts WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Message Deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Delete Failed"
    });
  }
};