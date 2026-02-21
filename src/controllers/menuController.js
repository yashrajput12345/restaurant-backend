const MenuItem = require("../models/MenuItem");

// Add Menu Item (Admin)
exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Menu Items
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().populate("category");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};