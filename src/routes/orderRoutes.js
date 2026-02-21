const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// User
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);

// Admin
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;