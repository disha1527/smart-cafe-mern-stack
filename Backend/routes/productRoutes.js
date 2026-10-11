// const express = require("express");
// const router = express.Router();
// const { addProduct, getProducts } = require("../controllers/productController");
// const { protect } = require("../middleware/authMiddleware");

// // Protected route (Login required)
// // router.post("/", protect, addProduct);

// // Public route
// router.get("/", getProducts);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/productController");

// // User: Get all products
// router.get("/", productController.getProducts);

// module.exports = router;

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// GET all products
router.get("/", productController.getProducts);

// GET Single product
router.get("/:id", productController.getSingleProduct);

// POST Product review
router.post("/:id/reviews", protect, productController.createProductReview);

module.exports = router;