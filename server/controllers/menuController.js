
const MenuItem = require("../models/MenuItem");

// GET: Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

// GET: Get one menu item
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid menu item ID" });
  }
};

// POST: Create a menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      available,
    });

    res.status(201).json(item);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create menu item" });
  }
};

// PUT: Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid input or menu item ID" });
    }

    res.status(500).json({ message: "Failed to update menu item" });
  }
};

// DELETE: Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid menu item ID" });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};