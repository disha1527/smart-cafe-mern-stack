// const express = require("express");
// const router = express.Router();
// const adminAuth = require("../middleware/adminAuth");
// const { getAllOrders, updateOrderStatus } = require("../controllers/adminOrderController");

// // Protected admin routes
// router.get("/", adminAuth, getAllOrders);
// router.put("/update/:id", adminAuth, updateOrderStatus);

// module.exports = router;

const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getAllOrders,
  updateOrderPayment,
  deleteOrder,
} = require("../controllers/adminOrderController");

// Admin protected routes
router.get("/", adminAuth, getAllOrders);
router.put("/update/:id", adminAuth, updateOrderPayment);
router.delete("/:id", adminAuth, deleteOrder);

module.exports = router;