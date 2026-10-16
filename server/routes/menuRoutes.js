
const express = require("express");
const router = express.Router();

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const {
  protect,
  managerOnly,
} = require("../middleware/authMiddleware");

// Reading menu is public
router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);

// Only logged-in managers can change menu items
router.post("/", protect, managerOnly, createMenuItem);
router.put("/:id", protect, managerOnly, updateMenuItem);
router.delete("/:id", protect, managerOnly, deleteMenuItem);

module.exports = router;