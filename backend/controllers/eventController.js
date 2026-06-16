const Event = require("../models/Event");

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
      description
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const event = new Event({
      name,
      category,
      image,
      event_date,
      description
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
      description
    } = req.body;

    const updateData = {
      name,
      category,
      event_date,
      description
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