// const express = require("express");
// const router = express.Router();
// const { createOrder, getMyOrders } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");

// router.post("/", protect, createOrder);
// router.get("/", protect, getMyOrders);


// module.exports = router;

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// COD Order
router.post("/cod", protect, orderController.createCODOrder);

// Stripe Order (after payment success)
router.post("/stripe", protect, orderController.createStripeOrder);

// Get My Orders
router.get("/my", protect, orderController.getMyOrders);

module.exports = router;