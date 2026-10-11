const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        size: {
          type: String,
          default: "Regular"
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: false,
      default: "Not Provided"
    },
    deliveryName: {
      type: String,
      required: true
    },
    deliveryPhone: {
      type: String,
      required: true
    },
    deliveryEmail: {
      type: String,
      required: true
    },
    paymentMethod: { type: String, required: true },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);