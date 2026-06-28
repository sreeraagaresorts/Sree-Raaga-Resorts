const Event = require("../models/Event");
const EventEnquiry = require("../models/EventEnquiry");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ id: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed To Fetch Events"
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ id: Number(req.params.id) });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event Not Found"
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      category,
      event_date,
      description,
      price,
      sqft,
      show_price
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const event = new Event({
      name,
      category: category || "",
      image,
      event_date: event_date || "",
      description,
      price: price ? Number(price) : 0,
      sqft: sqft || "",
      show_price: show_price === "true" || show_price === true
    });
    await event.save();

    res.status(201).json({
      success: true,
      message: "Event Created",
      eventId: event.id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Event Creation Failed"
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const {
      name,
      category,
      event_date,
      description,
      price,
      sqft,
      show_price
    } = req.body;

    const updateData = {
      name,
      category: category || "",
      event_date: event_date || "",
      description,
      price: price ? Number(price) : 0,
      sqft: sqft || "",
      show_price: show_price === "true" || show_price === true
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const event = await Event.findOneAndUpdate(
      { id: Number(req.params.id) },
      updateData,
      { returnDocument: "after" }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event Not Found"
      });
    }

    res.json({
      success: true,
      message: "Event Updated"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Update Failed"
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ id: Number(req.params.id) });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event Not Found"
      });
    }

    res.json({
      success: true,
      message: "Event Deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete Failed"
    });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, eventName, guests } = req.body;

    if (!name || !phone || !email || !eventName || !guests) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const enquiry = new EventEnquiry({
      name,
      phone,
      email,
      eventName,
      guests: Number(guests)
    });
    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Event Enquiry Submitted Successfully",
      enquiryId: enquiry.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry"
    });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await EventEnquiry.find({}).sort({ id: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries"
    });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const paramId = req.params.id;
    const mongoose = require("mongoose");
    const query = mongoose.Types.ObjectId.isValid(paramId)
      ? { _id: paramId }
      : { id: Number(paramId) };

    const enquiry = await EventEnquiry.findOneAndDelete(query);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry"
    });
  }
};

exports.markEnquiryAsRead = async (req, res) => {
  try {
    const paramId = req.params.id;
    const mongoose = require("mongoose");
    const query = mongoose.Types.ObjectId.isValid(paramId)
      ? { _id: paramId }
      : { id: Number(paramId) };

    const enquiry = await EventEnquiry.findOneAndUpdate(
      query,
      { status: "Read" },
      { returnDocument: "after" }
    );
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.json({
      success: true,
      message: "Enquiry marked as read successfully",
      data: enquiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to mark enquiry as read"
    });
  }
};