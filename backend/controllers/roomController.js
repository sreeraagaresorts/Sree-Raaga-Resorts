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
    const room = await Room.findOne({ id: Number(req.params.id) });

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
      name,
      price,
      area,
      beds,
      bathrooms,
      description
    } = req.body;

    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const room = new Room({
      name,
      price: parseFloat(price),
      image,
      area: area ? parseInt(area) : null,
      beds: beds ? parseInt(beds) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
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
      name,
      price,
      area,
      beds,
      bathrooms,
      description
    } = req.body;

    const updateData = {
      name,
      price: parseFloat(price),
      area: area ? parseInt(area) : null,
      beds: beds ? parseInt(beds) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      description
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const room = await Room.findOneAndUpdate(
      { id: Number(req.params.id) },
      updateData,
      { new: true }
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
    const room = await Room.findOneAndDelete({ id: Number(req.params.id) });
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