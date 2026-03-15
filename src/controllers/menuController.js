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

// Delete Menu Item (Admin)
exports.deleteMenuItem = async (req, res) => {
  try {

    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Menu item deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};