

// const express = require("express");
// const router = express.Router();

// const {
//   createBooking,
//   getMyBookings,
//   confirmPayment,
//   cancelBooking,
//   createPaymentIntent
// } = require("../controllers/bookingController");

// const { protect } = require("../middleware/authMiddleware");

// router.post("/", protect, createBooking);
// router.get("/my", protect, getMyBookings);
// router.post("/confirm-payment", protect, confirmPayment);
// router.put("/cancel/:bookingId", protect, cancelBooking);
// router.post("/create-payment-intent", protect, createPaymentIntent);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  confirmPayment,
  createPaymentIntent,
  getBlockedSlots
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// create booking
router.post("/", protect, createBooking);

// get blocked slots
router.get("/booked-slots", protect, getBlockedSlots);

// get my bookings
router.get("/", protect, getMyBookings);

// cancel booking
router.put("/cancel/:bookingId", protect, cancelBooking);

// confirm payment
router.post("/confirm-payment", protect, confirmPayment);

// stripe payment intent
router.post("/create-payment-intent", protect, createPaymentIntent);

module.exports = router;