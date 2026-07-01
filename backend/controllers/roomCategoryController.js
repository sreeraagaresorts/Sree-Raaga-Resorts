const RoomCategory = require("../models/RoomCategory");
const Room = require("../models/Room");

const DEFAULT_CATEGORIES = [
  { name: "Villas", parent: null },
  { name: "Rooms", parent: null },
  { name: "Duplex Villas", parent: "Villas" },
  { name: "Compact Villas", parent: "Villas" },
  { name: "1BHK Villas", parent: "Villas" },
  { name: "Banquet Rooms", parent: "Rooms" },
  { name: "Executive Rooms", parent: "Rooms" }
];

exports.getRoomCategories = async (req, res) => {
  try {
    let categories = await RoomCategory.find({}).sort({ created_at: 1 });
    
    // Seed default categories if none exist in the database yet
    if (categories.length === 0) {
      console.log("Seeding default room categories...");
      await RoomCategory.insertMany(DEFAULT_CATEGORIES);
      categories = await RoomCategory.find({}).sort({ created_at: 1 });
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Failed to fetch room categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room categories"
    });
  }
};

exports.createRoomCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const trimmedName = name.trim();
    
    // Check if category already exists (case-insensitive)
    const existing = await RoomCategory.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = new RoomCategory({
      name: trimmedName,
      parent: parent || null
    });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    console.error("Failed to create room category:", error);
    res.status(500).json({
      success: false,
      message: "Category creation failed"
    });
  }
};

exports.updateRoomCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const trimmedName = name.trim();

    // Check if another category has the same name
    const existing = await RoomCategory.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Another category with this name already exists"
      });
    }

    const category = await RoomCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const oldName = category.name;
    category.name = trimmedName;
    category.parent = parent || null;
    await category.save();

    if (oldName !== trimmedName) {
      await Room.updateMany({ category: oldName }, { category: trimmedName });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    console.error("Failed to update room category:", error);
    res.status(500).json({
      success: false,
      message: "Category update failed"
    });
  }
};

exports.deleteRoomCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await RoomCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Prevent deletion if rooms are assigned to it
    const assignedRoom = await Room.findOne({ category: category.name });
    if (assignedRoom) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because rooms are assigned to it."
      });
    }

    await RoomCategory.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete room category:", error);
    res.status(500).json({
      success: false,
      message: "Category deletion failed"
    });
  }
};
