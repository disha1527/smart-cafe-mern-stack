// const Cart = require("../models/Cart");

// // Add to Cart
// exports.addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     // Check if product already in cart
//     const existingItem = await Cart.findOne({
//       user: req.user._id,
//       product: productId
//     });

//     if (existingItem) {
//       existingItem.quantity += quantity;
//       await existingItem.save();
//       return res.json(existingItem);
//     }

//     const cartItem = await Cart.create({
//       user: req.user._id,
//       product: productId,
//       quantity
//     });

//     res.status(201).json(cartItem);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get My Cart
// exports.getMyCart = async (req, res) => {
//   try {
//     const cart = await Cart.find({ user: req.user._id })
//       .populate("product");

//     res.json(cart);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const Cart = require("../models/Cart");

// Add To Cart
// exports.addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     if (!productId || !quantity) {
//       return res.status(400).json({ message: "Product & quantity required" });
//     }

//     const existingItem = await Cart.findOne({
//       user: req.user._id,
//       product: productId
//     });

//     if (existingItem) {
//       existingItem.quantity += quantity;
//       await existingItem.save();
//       return res.json(existingItem);
//     }

//     const cartItem = await Cart.create({
//       user: req.user._id,
//       product: productId,
//       quantity
//     });

//     res.status(201).json(cartItem);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    const userId = req.user._id;

    // Check existing item with the same size
    let item = await Cart.findOne({ user: userId, product: productId, size: size || "Regular" });

    if (item) {
      // ✅ Already exists → increase quantity
      item.quantity += quantity;
      await item.save();
    } else {
      // ✅ New item
      item = await Cart.create({
        user: userId,
        product: productId,
        quantity,
        size: size || "Regular"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated",
      item
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Cart
exports.getMyCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id })
      .populate("product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ message: "Cart Cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Remove single item
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    await Cart.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    res.json({ success: true, message: "Item removed" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};