


const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create COD Order
exports.createCODOrder = async (req, res) => {
  try {
    const { address, deliveryName, deliveryPhone, deliveryEmail } = req.body;

    if (!address || !deliveryName || !deliveryPhone || !deliveryEmail) {
      return res.status(400).json({ message: "Delivery address, name, phone, and email are required" });
    }

    const cartItems = await Cart.find({ user: req.user._id }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size
    }));

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
      address,
      deliveryName,
      deliveryPhone,
      deliveryEmail,
      paymentMethod: "COD",
      isPaid: false
    });

    // Clear cart after order
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Stripe Order (After Payment Success)
exports.createStripeOrder = async (req, res) => {
  try {
    const { address, deliveryName, deliveryPhone, deliveryEmail } = req.body;

    if (!address || !deliveryName || !deliveryPhone || !deliveryEmail) {
      return res.status(400).json({ message: "Delivery address, name, phone, and email are required" });
    }

    const cartItems = await Cart.find({ user: req.user._id }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size
    }));

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
      address,
      deliveryName,
      deliveryPhone,
      deliveryEmail,
      paymentMethod: "Stripe",
      isPaid: true
    });

    // Clear cart
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};