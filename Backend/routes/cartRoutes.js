// const express = require("express");
// const router = express.Router();
// const { addToCart, getMyCart } = require("../controllers/cartController");
// const { protect } = require("../middleware/authMiddleware");

// router.post("/", protect, addToCart);
// router.get("/", protect, getMyCart);


// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  addToCart,
  getMyCart,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToCart);
router.get("/", protect, getMyCart);

// ✅ ADD THESE
router.delete("/:productId", protect, removeFromCart);
router.delete("/clear/all", protect, clearCart);

module.exports = router;