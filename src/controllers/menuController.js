const MenuItem = require("../models/MenuItem");

// ===============================
// ADD MENU ITEM (ADMIN)
// ===============================
exports.createMenuItem = async (req, res) => {
  try {

    const { name, description, price, category } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required"
      });
    }

    // Handle image upload safely
    let image = "";
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    const newItem = new MenuItem({
      name,
      description,
      price,
      category,
      image
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);

  } catch (error) {

    console.error("MENU CREATE ERROR:", error);

    res.status(500).json({
      message: "Failed to create menu item",
      error: error.message
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

    console.error("GET MENU ERROR:", error);

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

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    await item.deleteOne();

    res.json({
      message: "Menu item deleted successfully"
    });

  } catch (error) {

    console.error("DELETE MENU ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};