const mongoose = require("mongoose");
const Room = require("../models/Room");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ id: -1 });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed To Fetch Rooms"
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const idParam = req.params.id;
    let query = {};
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      query = { $or: [{ _id: idParam }, { id: isNaN(Number(idParam)) ? null : Number(idParam) }] };
    } else {
      query = { id: isNaN(Number(idParam)) ? null : Number(idParam) };
    }
    const room = await Room.findOne(query);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room Not Found"
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      name,
      price,
      category,
      area,
      beds,
      bathrooms,
      guests,
      description
    } = req.body;

    if (!roomNumber) {
      return res.status(400).json({
        success: false,
        message: "Room number is required"
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room number already exists"
      });
    }

    let image = null;

    if (req.file) {
      image = req.file.filename;
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      image = req.files['image'][0].filename;
    }

    let extraImages = [];
    if (req.files && req.files['extraImages']) {
      extraImages = req.files['extraImages'].map(f => f.filename);
    }

    const room = new Room({
      roomNumber,
      name,
      price: parseFloat(price),
      image,
      images: extraImages,
      category: category || "Executive Rooms",
      area: area || null,
      beds: beds || null,
      bathrooms: bathrooms || null,
      guests: guests || null,
      description
    });
    await room.save();

    res.status(201).json({
      success: true,
      message: "Room Created",
      roomId: room.id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Room Creation Failed"
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      name,
      price,
      category,
      area,
      beds,
      bathrooms,
      guests,
      description
    } = req.body;

    if (!roomNumber) {
      return res.status(400).json({
        success: false,
        message: "Room number is required"
      });
    }

    const idParam = req.params.id;
    let existingQuery = { roomNumber };
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      existingQuery._id = { $ne: idParam };
    } else {
      existingQuery.id = { $ne: Number(idParam) };
    }

    const existingRoom = await Room.findOne(existingQuery);
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room number already in use by another room"
      });
    }

    const updateData = {
      roomNumber,
      name,
      price: parseFloat(price),
      category: category || "Executive Rooms",
      area: area || null,
      beds: beds || null,
      bathrooms: bathrooms || null,
      guests: guests || null,
      description
    };

    if (req.file) {
      updateData.image = req.file.filename;
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      updateData.image = req.files['image'][0].filename;
    }

    let existingImages = [];
    if (req.body.existingExtraImages) {
      try {
        existingImages = JSON.parse(req.body.existingExtraImages);
      } catch (e) {
        if (typeof req.body.existingExtraImages === 'string') {
          existingImages = [req.body.existingExtraImages];
        }
      }
    }

    let newExtraImages = [];
    if (req.files && req.files['extraImages']) {
      newExtraImages = req.files['extraImages'].map(f => f.filename);
    }

    if (req.body.existingExtraImages !== undefined || (req.files && req.files['extraImages'])) {
      updateData.images = [...existingImages, ...newExtraImages];
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      query = { $or: [{ _id: idParam }, { id: isNaN(Number(idParam)) ? null : Number(idParam) }] };
    } else {
      query = { id: isNaN(Number(idParam)) ? null : Number(idParam) };
    }

    const room = await Room.findOneAndUpdate(
      query,
      updateData,
      { returnDocument: "after" }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room Not Found"
      });
    }

    res.json({
      success: true,
      message: "Room Updated"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Update Failed"
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const idParam = req.params.id;
    let query = {};
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      query = { $or: [{ _id: idParam }, { id: isNaN(Number(idParam)) ? null : Number(idParam) }] };
    } else {
      query = { id: isNaN(Number(idParam)) ? null : Number(idParam) };
    }
    const room = await Room.findOneAndDelete(query);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room Not Found"
      });
    }

    res.json({
      success: true,
      message: "Room Deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete Failed"
    });
  }
};