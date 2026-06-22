const Contact = require("../models/Contact");

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

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });
    await contact.save();

    // Trigger email notification to support desk in background
    const { sendContactSubmissionEmail } = require("../utils/email");
    sendContactSubmissionEmail(contact.toObject()).catch(err => {
      console.error("[Email Error] Failed to send contact submission email:", err);
    });

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
      contactId: contact.id
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
    const messages = await Contact.find({}).sort({ id: -1 });

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
    const contact = await Contact.findOneAndDelete({ id: Number(req.params.id) });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message Not Found"
      });
    }

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