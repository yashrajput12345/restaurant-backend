const express = require("express");
const router = express.Router();
const { createCategory, getCategories } =
  require("../controllers/categoryController");
const { protect, admin } =
  require("../middleware/authMiddleware");

router.route("/")
  .post(protect, admin, createCategory)
  .get(getCategories);

module.exports = router;