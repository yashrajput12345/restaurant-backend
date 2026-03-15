const MenuItem = require("../models/MenuItem");

// ===============================
// ADD MENU ITEM (ADMIN)
// ===============================
exports.createMenuItem = async (req, res) => {
  try {

    const { name, description, price, category } = req.body;

    // image uploaded to cloudinary
    const image = req.file ? req.file.path : "";

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// GET ALL MENU ITEMS
// ===============================
exports.getMenuItems = async (req, res) => {
  try {

    const items = await MenuItem.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// DELETE MENU ITEM (ADMIN)
// ===============================
exports.deleteMenuItem = async (req, res) => {
  try {

    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json({
      message: "Menu item deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};