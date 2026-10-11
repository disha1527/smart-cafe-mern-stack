const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createCheckoutSession } = require("../controllers/paymentController");
const { createCODOrder } = require("../controllers/orderController");

router.post("/online", protect, createCheckoutSession);
router.post("/cod", protect, createCODOrder);

module.exports = router;