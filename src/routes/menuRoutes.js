const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
  getTrendingItems
} = require("../controllers/menuController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


// ===============================
// MENU ROUTES
// ===============================

// CREATE + GET MENU ITEMS
router.route("/")
  .post(protect, admin, upload.single("image"), createMenuItem)
  .get(getMenuItems);


// ===============================
// TRENDING ITEMS
// ===============================
router.get("/trending", getTrendingItems);


// ===============================
// UPDATE / DELETE MENU ITEM
// ===============================
router.route("/:id")
  .put(protect, admin, upload.single("image"), updateMenuItem)
  .patch(protect, admin, upload.single("image"), updateMenuItem)
  .delete(protect, admin, deleteMenuItem);


module.exports = router;