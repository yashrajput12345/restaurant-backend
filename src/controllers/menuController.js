const MenuItem = require("../models/MenuItem");

// ===============================
// ADD MENU ITEM (ADMIN)
// ===============================
exports.createMenuItem = async (req, res) => {
  try {

    const { name, description, price, category } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required"
      });
    }

    // If image uploaded
    let image = "";
    if (req.file) {
      image = req.file.path;
    }

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image
    });

    res.status(201).json(item);

  } catch (error) {
    console.error("Create Menu Item Error:", error);

    res.status(500).json({
      message: error.message
    });
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

    console.error("Get Menu Items Error:", error);

    res.status(500).json({
      message: error.message
    });
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

    console.error("Delete Menu Item Error:", error);

    res.status(500).json({
      message: error.message
    });
  }
};