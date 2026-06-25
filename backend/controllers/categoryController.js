const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  "Breakfast",
  "Starters",
  "Main Course",
  "Biryani",
  "Rice & Noodles",
  "Desserts",
  "Beverages"
];

exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find({}).sort({ created_at: 1 });
    
    // Seed default categories if none exist in the database yet
    if (categories.length === 0) {
      console.log("Seeding default categories...");
      const categoriesToInsert = DEFAULT_CATEGORIES.map(name => ({ name }));
      await Category.insertMany(categoriesToInsert);
      categories = await Category.find({}).sort({ created_at: 1 });
    }

    res.json({
      success: true,
      data: categories.map(cat => cat.name)
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const trimmedName = name.trim();
    
    // Check if category already exists (case-insensitive check is safer)
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = new Category({ name: trimmedName });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category.name
    });
  } catch (error) {
    console.error("Failed to create category:", error);
    res.status(500).json({
      success: false,
      message: "Category creation failed"
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOneAndDelete({ name });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete category:", error);
    res.status(500).json({
      success: false,
      message: "Category deletion failed"
    });
  }
};
