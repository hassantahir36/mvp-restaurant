
const express = require("express");
const router = express.Router();

const { protect, managerOnly } = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// Customers create orders and view their own orders
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// Managers view all orders and update their status
router.get("/", protect, managerOnly, getAllOrders);
router.patch("/:id/status", protect, managerOnly, updateOrderStatus);

module.exports = router;