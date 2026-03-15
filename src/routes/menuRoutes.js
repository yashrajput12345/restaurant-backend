const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem
} = require("../controllers/menuController");

const { protect, admin } =
  require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

router.route("/")
  .post(protect, admin, upload.single("image"), createMenuItem)
  .get(getMenuItems);

router.route("/:id")
  .put(protect, admin, upload.single("image"), updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

module.exports = router;