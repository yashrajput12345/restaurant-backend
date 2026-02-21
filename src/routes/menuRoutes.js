const express = require("express");
const router = express.Router();
const { createMenuItem, getMenuItems } =
  require("../controllers/menuController");
const { protect, admin } =
  require("../middleware/authMiddleware");

router.route("/")
  .post(protect, admin, createMenuItem)
  .get(getMenuItems);

module.exports = router;