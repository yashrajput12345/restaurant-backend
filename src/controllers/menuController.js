const MenuItem = require("../models/MenuItem");


// ===============================
// ADD MENU ITEM (ADMIN)
// ===============================
exports.createMenuItem = async (req, res) => {
  try {

    const { name, description, price, category, isTrending } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required"
      });
    }

    let image = "";
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    const newItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      isTrending: isTrending === "true" || isTrending === true,
      isAvailable: true
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
// GET MENU ITEMS (OPTIONAL CATEGORY FILTER)
// ===============================
exports.getMenuItems = async (req, res) => {
  try {

    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const items = await MenuItem.find(filter)
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
// GET TRENDING ITEMS
// ===============================
exports.getTrendingItems = async (req, res) => {
  try {

    const items = await MenuItem.find({
      isTrending: true
    })
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {

    console.error("TRENDING ITEMS ERROR:", error);

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


// ===============================
// UPDATE MENU ITEM (ADMIN)
// ===============================
exports.updateMenuItem = async (req, res) => {
  try {

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    const {
      name,
      description,
      price,
      category,
      isAvailable,
      isTrending
    } = req.body;

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (category !== undefined) item.category = category;

    if (isAvailable !== undefined) {
      item.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    if (isTrending !== undefined) {
      item.isTrending = isTrending === "true" || isTrending === true;
    }

    if (req.file) {
      item.image = req.file.path;
    }

    const updatedItem = await item.save();

    res.json(updatedItem);

  } catch (error) {

    console.error("UPDATE MENU ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};