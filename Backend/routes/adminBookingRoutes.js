const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { getAllBookings, updateBooking, deleteBooking } = require("../controllers/adminBookingController");

// Protected admin routes
router.get("/", adminAuth, getAllBookings);
router.put("/update/:id", adminAuth, updateBooking);
router.delete("/delete/:id", adminAuth, deleteBooking);

module.exports = router;