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

    // Auto-heal/sync physical room unit statuses with database bookings
    for (const room of rooms) {
      const allBookings = await Booking.find({ room_id: room.id });
      let modified = false;

      for (const unit of room.roomStatuses) {
        if (unit.status === "Occupied") {
          const hasActiveCheckedIn = allBookings.some(
            b => b.status === "checked_in" && b.room_number && b.room_number.split(",").map(r => r.trim()).includes(unit.roomNumber)
          );
          if (!hasActiveCheckedIn) {
            unit.status = "Available";
            modified = true;
          }
        } else if (unit.status === "Reserved") {
          const hasActiveReserved = allBookings.some(
            b => ["confirmed", "pending"].includes(b.status) && b.room_number && b.room_number.split(",").map(r => r.trim()).includes(unit.roomNumber)
          );
          if (!hasActiveReserved) {
            unit.status = "Available";
            modified = true;
          }
        }
      }

      if (modified) {
        await room.save();
      }
    }

    const populatedRooms = await Promise.all(
      rooms.map(async (room) => {
        // Find active bookings (confirmed, checked_in) where checkout has not passed
        const activeBookings = await Booking.find({
          room_id: room.id,
          status: { $in: ["confirmed", "checked_in"] },
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
      status: { $in: ["confirmed", "checked_in"] },
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

const getUniqueRoomNumber = async (baseNum, prefix, isNum, currentRoomIdToIgnore = null) => {
  let candidate = isNum ? `${baseNum}` : `${prefix}-${baseNum}`;
  let suffix = baseNum;
  
  while (true) {
    const query = { "roomStatuses.roomNumber": candidate };
    if (currentRoomIdToIgnore !== null) {
      query.id = { $ne: currentRoomIdToIgnore };
    }
    const duplicate = await Room.findOne(query);
    if (!duplicate) {
      return candidate;
    }
    suffix++;
    candidate = isNum ? `${suffix}` : `${prefix}-${suffix}`;
  }
};

exports.createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      name,
      price,
      gst_percentage,
      category,
      area,
      beds,
      bathrooms,
      guests,
      children,
      allowExtraBed,
      description,
      totalRooms,
      view360Iframe
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

    // Generate roomStatuses
    const prefix = roomNumber || "RM";
    const statuses = [];
    const count = Number(totalRooms) || 1;
    const isNum = !isNaN(Number(prefix));
    let baseOffset = isNum ? Number(prefix) - 1 : 100;
    for (let i = 1; i <= count; i++) {
      const generatedNum = await getUniqueRoomNumber(baseOffset + i, prefix, isNum);
      statuses.push({
        roomNumber: generatedNum,
        status: "Available"
      });
      if (isNum) {
        const parsedGenerated = parseInt(generatedNum);
        if (!isNaN(parsedGenerated) && parsedGenerated >= baseOffset + i) {
          baseOffset = parsedGenerated - i;
        }
      }
    }

    const room = new Room({
      roomNumber,
      name,
      price: parseFloat(price),
      gst_percentage: Number(gst_percentage) || 8,
      image,
      images: extraImages,
      category: category || "Executive Rooms",
      totalRooms: count,
      roomStatuses: statuses,
      area: area || null,
      beds: beds || null,
      bathrooms: bathrooms || null,
      guests: guests || null,
      children: children || null,
      allowExtraBed: allowExtraBed === "true" || allowExtraBed === true,
      description,
      view360Iframe: view360Iframe || null
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
      gst_percentage,
      category,
      area,
      beds,
      bathrooms,
      guests,
      children,
      allowExtraBed,
      description,
      totalRooms,
      view360Iframe
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

    // Fetch the room to update to compare roomNumber and totalRooms
    let query = {};
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      query = { $or: [{ _id: idParam }, { id: isNaN(Number(idParam)) ? null : Number(idParam) }] };
    } else {
      query = { id: isNaN(Number(idParam)) ? null : Number(idParam) };
    }
    const currentRoomDoc = await Room.findOne(query);

    let updatedStatuses = [];
    const newTotal = Number(totalRooms) || 1;
    if (currentRoomDoc) {
      updatedStatuses = currentRoomDoc.roomStatuses || [];
      // Rebuild if total count or prefix roomNumber changes
      if (updatedStatuses.length !== newTotal || currentRoomDoc.roomNumber !== roomNumber) {
        const prefix = roomNumber || "RM";
        updatedStatuses = [];
        const isNum = !isNaN(Number(prefix));
        let baseOffset = isNum ? Number(prefix) - 1 : 100;
        for (let i = 1; i <= newTotal; i++) {
          const generatedNum = await getUniqueRoomNumber(baseOffset + i, prefix, isNum, currentRoomDoc.id);
          updatedStatuses.push({
            roomNumber: generatedNum,
            status: "Available"
          });
          if (isNum) {
            const parsedGenerated = parseInt(generatedNum);
            if (!isNaN(parsedGenerated) && parsedGenerated >= baseOffset + i) {
              baseOffset = parsedGenerated - i;
            }
          }
        }
      }
    }

    const updateData = {
      roomNumber,
      name,
      price: parseFloat(price),
      gst_percentage: Number(gst_percentage) || 8,
      category: category || "Executive Rooms",
      totalRooms: newTotal,
      roomStatuses: updatedStatuses,
      area: area || null,
      beds: beds || null,
      bathrooms: bathrooms || null,
      guests: guests || null,
      children: children || null,
      allowExtraBed: allowExtraBed === "true" || allowExtraBed === true,
      description,
      view360Iframe: view360Iframe || null
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
    const totalRooms = room.totalRooms || 1;

    const overlappingBookings = await Booking.find({
      room_id: room.id,
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

exports.updateRoomUnitStatus = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { roomNumber, status } = req.body;

    if (!roomNumber || !status) {
      return res.status(400).json({
        success: false,
        message: "roomNumber and status are required"
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
        message: "Room Not Found"
      });
    }

    const unit = room.roomStatuses.find(u => u.roomNumber === roomNumber);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: `Room Unit ${roomNumber} not found in this room type`
      });
    }

    unit.status = status;
    await room.save();

    res.json({
      success: true,
      message: `Room Unit ${roomNumber} status updated to ${status}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update room unit status"
    });
  }
};

exports.addRoomUnit = async (req, res) => {
  try {
    const { roomNumber, categoryName, price, status } = req.body;

    if (!roomNumber || !categoryName) {
      return res.status(400).json({
        success: false,
        message: "roomNumber and categoryName are required"
      });
    }

    const duplicateRoom = await Room.findOne({ "roomStatuses.roomNumber": roomNumber });
    if (duplicateRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists`
      });
    }

    const roomCategory = await Room.findOne({ name: categoryName });
    if (!roomCategory) {
      return res.status(404).json({
        success: false,
        message: `Room category "${categoryName}" not found`
      });
    }

    const floorVal = (req.body.floor === undefined || req.body.floor === null || req.body.floor === "") ? null : Number(req.body.floor);
    roomCategory.roomStatuses.push({
      roomNumber,
      status: status || "Available",
      floor: floorVal
    });

    roomCategory.totalRooms += 1;

    if (price) {
      roomCategory.price = parseFloat(price);
    }

    await roomCategory.save();

    res.json({
      success: true,
      message: `Room ${roomNumber} added to ${categoryName} successfully`,
      data: roomCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add room unit"
    });
  }
};

exports.updateRoomUnit = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { oldRoomNumber, newRoomNumber, floor, status } = req.body;

    if (!oldRoomNumber || !newRoomNumber) {
      return res.status(400).json({
        success: false,
        message: "oldRoomNumber and newRoomNumber are required"
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
        message: "Room Not Found"
      });
    }

    const unit = room.roomStatuses.find(u => u.roomNumber === oldRoomNumber);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: `Room unit ${oldRoomNumber} not found`
      });
    }

    // Check if new room number is already taken by a different unit
    if (oldRoomNumber !== newRoomNumber) {
      const duplicateRoom = await Room.findOne({ "roomStatuses.roomNumber": newRoomNumber });
      if (duplicateRoom) {
        return res.status(400).json({
          success: false,
          message: `Room number ${newRoomNumber} is already in use`
        });
      }
    }

    unit.roomNumber = newRoomNumber;
    if (floor !== undefined) unit.floor = (floor === null || floor === "") ? null : Number(floor);
    if (status !== undefined) unit.status = status;

    await room.save();

    res.json({
      success: true,
      message: `Room unit updated successfully`,
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update room unit"
    });
  }
};

exports.deleteRoomUnit = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { roomNumber } = req.params;

    if (!roomNumber) {
      return res.status(400).json({
        success: false,
        message: "roomNumber is required"
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
        message: "Room category not found"
      });
    }

    const originalLength = room.roomStatuses.length;
    room.roomStatuses = room.roomStatuses.filter(u => u.roomNumber !== roomNumber);

    if (room.roomStatuses.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: `Room unit ${roomNumber} not found in category`
      });
    }

    room.totalRooms = Math.max(0, room.totalRooms - 1);
    await room.save();

    res.json({
      success: true,
      message: `Room unit ${roomNumber} deleted successfully`,
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete room unit"
    });
  }
};