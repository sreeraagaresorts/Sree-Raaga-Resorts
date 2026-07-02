const Dish = require("../models/Dish");
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

exports.getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({}).sort({ id: 1 });
    res.json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dishes"
    });
  }
};

exports.getDish = async (req, res) => {
  try {
    const dish = await Dish.findOne({ id: Number(req.params.id) });
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }
    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.createDish = async (req, res) => {
  try {
    const { name, price, category, description, isVegetarian, isAvailable, isDrink } = req.body;
    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    const dish = new Dish({
      name,
      price: parseFloat(price),
      category,
      description,
      image,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      isAvailable: isAvailable === "true" || isAvailable === true,
      isDrink: isDrink === "true" || isDrink === true
    });
    await dish.save();

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Dish Creation",
        `Created dish "${dish.name}" (Category: ${dish.category}, Price: ₹${dish.price})`
      );
    }

    res.status(201).json({
      success: true,
      message: "Dish created successfully",
      dishId: dish.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Dish creation failed"
    });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { name, price, category, description, isVegetarian, isAvailable, isDrink } = req.body;

    const updateData = {
      name,
      price: parseFloat(price),
      category,
      description,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      isAvailable: isAvailable === "true" || isAvailable === true,
      isDrink: isDrink === "true" || isDrink === true
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const dish = await Dish.findOneAndUpdate(
      { id: Number(req.params.id) },
      updateData,
      { returnDocument: "after" }
    );

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Dish Update",
        `Updated dish "${dish.name}" (Category: ${dish.category}, Price: ₹${dish.price})`
      );
    }

    res.json({
      success: true,
      message: "Dish updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findOneAndDelete({ id: Number(req.params.id) });
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    // Log to AuditLog
    if (req.user) {
      logAction(
        req.user.id,
        "Dish Deletion",
        `Deleted dish "${dish.name}" (ID: #${dish.id})`
      );
    }

    res.json({
      success: true,
      message: "Dish deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};
