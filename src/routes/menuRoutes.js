const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems,
  deleteMenuItem
} = require("../controllers/menuController");

const { protect, admin } =
  require("../middleware/authMiddleware");

router.route("/")
  .post(protect, admin, createMenuItem)
  .get(getMenuItems);

router.route("/:id")
  .delete(protect, admin, deleteMenuItem);

module.exports = router;