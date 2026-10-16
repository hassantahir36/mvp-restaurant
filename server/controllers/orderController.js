
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

const createOrder = async (req, res) => {
  try {
    const { items, notes = "" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (
        !item.menuItem ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        return res.status(400).json({
          message: "Each item needs a valid menuItem ID and quantity",
        });
      }

      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem || !menuItem.available) {
        return res.status(400).json({
          message: "A menu item is unavailable or does not exist",
        });
      }

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
      });

      totalAmount += menuItem.price * quantity;
    }

    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    return res.status(500).json({
      message: "Could not create order",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    return res.status(500).json({
      message: "Could not fetch orders",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error.message);
    return res.status(500).json({
      message: "Could not fetch orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { returnDocument: "after", runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("Update order error:", error.message);
    return res.status(500).json({
      message: "Could not update order",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};