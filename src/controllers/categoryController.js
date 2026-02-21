const Category = require("../models/Category");

// Add Category (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.create({ name, image });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};