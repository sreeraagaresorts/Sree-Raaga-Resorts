const mongoose = require("mongoose");
const Room = require("../models/Room");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const logAction = async (userId, actionType, details) => {
  try {
    const adminUser = await User.findOne({ id: userId });
    const adminName = adminUser ? adminUser.full_name : "System / Unknown Admin";
    await AuditLog.create({
      adminName,
      actionType,
      details
    });
  } catch (err) {
    console.error("[AuditLog Error] Failed to log admin action:", err);
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ id: -1 });

    const Booking = require("../models/Booking");
    const populatedRooms = await Promise.all(
      rooms.map(async (room) => {
        // Find active bookings (pending, confirmed, checked_in) where checkout has not passed
        const activeBookings = await Booking.find({
          room_id: room.id,
          status: { $in: ["pending", "confirmed", "checked_in"] },
          check_out: { $gte: new Date() }
        });

        let bookedRoomsCount = 0;
        activeBookings.forEach((b) => {
          bookedRoomsCount += b.rooms || 1;
        });

        return {
          ...room.toObject(),
          bookedRoomsCount,
          availableRooms: Math.max(0, (room.totalRooms || 1) - bookedRoomsCount)
        };
      })
    );

    res.json({
      success: true,
      count: populatedRooms.length,
      data: populatedRooms
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

    const Booking = require("../models/Booking");
    const activeBookings = await Booking.find({
      room_id: room.id,
      status: { $in: ["pending", "confirmed", "checked_in"] },
      check_out: { $gte: new Date() }
    });

    let bookedRoomsCount = 0;
    activeBookings.forEach((b) => {
      bookedRoomsCount += b.rooms || 1;
    });

    const roomData = {
      ...room.toObject(),
      bookedRoomsCount,
      availableRooms: Math.max(0, (room.totalRooms || 1) - bookedRoomsCount)
    };

    res.json({
      success: true,
      data: roomData
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
      description,
      totalRooms
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
      totalRooms: Number(totalRooms) || 1,
      area: area || null,
      beds: beds || null,
      bathrooms: bathrooms || null,
      guests: guests || null,
      description
    });
    await room.save();

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Room Creation",
        `Created room "${room.name}" (Room Number: ${room.roomNumber})`
      );
    }

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
      description,
      totalRooms
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
      totalRooms: Number(totalRooms) || 1,
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

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Room Update",
        `Updated room "${room.name}" (Room Number: ${room.roomNumber})`
      );
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

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Room Deletion",
        `Deleted room "${room.name}" (Room Number: ${room.roomNumber})`
      );
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

exports.getRoomAvailability = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { check_in, check_out } = req.query;

    if (!check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "check_in and check_out dates are required"
      });
    }

    const start = new Date(check_in);
    const end = new Date(check_out);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "check_out must be after check_in"
      });
    }

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
        message: "Room not found"
      });
    }

    const Booking = require("../models/Booking");

    // Count how many total rooms exist in database with the same name
    const totalRooms = await Room.countDocuments({ name: room.name });

    // Find all overlapping bookings for rooms with this name
    const matchingRooms = await Room.find({ name: room.name });
    const roomIds = matchingRooms.map(r => r.id);

    const overlappingBookings = await Booking.find({
      room_id: { $in: roomIds },
      status: { $ne: "cancelled" },
      $or: [
        { check_in: { $lt: end }, check_out: { $gt: start } }
      ]
    });

    let bookedRoomsCount = 0;
    overlappingBookings.forEach(booking => {
      bookedRoomsCount += booking.rooms || 1;
    });

    const isAvailable = bookedRoomsCount < totalRooms;

    res.json({
      success: true,
      name: room.name,
      totalRooms,
      bookedRoomsCount,
      remainingRooms: Math.max(0, totalRooms - bookedRoomsCount),
      available: isAvailable
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error checking availability"
    });
  }
};