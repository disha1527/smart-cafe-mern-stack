

// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const Cart = require("../models/Cart");

// exports.createCheckoutSession = async (req, res) => {
//   try {
//     const cartItems = await Cart.find({ user: req.user._id }).populate("product");

//     if (cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const line_items = cartItems.map(item => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.product.name
//         },
//         unit_amount: item.product.price * 100
//       },
//       quantity: item.quantity
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: "http://localhost:5173/order-success?payment=success",
//       cancel_url: "http://localhost:5173/checkout"
//     });

//     res.json({ url: session.url });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");

exports.createCheckoutSession = async (req, res) => {
  try {

    const cartItems = await Cart.find({ user: req.user._id }).populate("product");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const line_items = cartItems
      .filter(item => item.product) // product null avoid
      .map(item => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      }));


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      success_url:
        "http://localhost:5173/order-success?payment=success",

      cancel_url:
        "http://localhost:5173/checkout",
    });

    res.json({
      success: true,
      url: session.url
    });

  } catch (error) {

    console.log("Stripe Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};