


const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  guests: {
    type: Number,
    required: true
  },

  tableLocation: {
    type: String,
    required: true,
    enum: ["Window View", "Quiet Corner", "Center Hall", "Outdoor Patio"],
    default: "Center Hall"
  },

  paymentIntentId: {
    type: String
  },

  bookingAmount: {
    type: Number,
    default: 200 // ₹200 fixed booking charge
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  refundAmount: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);