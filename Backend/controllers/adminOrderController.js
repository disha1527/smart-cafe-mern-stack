


const Order = require("../models/Order");

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email") // user info
      .populate("orderItems.product", "name price"); // product info
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order payment status (admin)
exports.updateOrderPayment = async (req, res) => {
  try {
    const { isPaid } = req.body;
    if (typeof isPaid !== "boolean") {
      return res.status(400).json({ success: false, message: "isPaid must be boolean" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.isPaid = isPaid;
    order.paidAt = isPaid ? new Date() : undefined;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an order (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    await order.deleteOne();

    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};