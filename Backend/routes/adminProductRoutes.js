// const express = require("express");
// const router = express.Router();
// const productController = require("../controllers/productController");
// const adminAuth = require("../middleware/adminAuth");

// // Admin can add a product
// router.post("/", adminAuth, productController.addProduct);

// // Optionally expose listing for admin too
// router.get("/", adminAuth, productController.getProducts);

// module.exports = router;

const express = require("express");
const router = express.Router();
const adminProductController = require("../controllers/adminProductController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const extension = path.extname(file.originalname);
		cb(null, `${uniqueSuffix}${extension}`);
	}
});

const upload = multer({ storage });

// CRUD routes (Protected)
router.post("/add", adminAuth, upload.single("imageFile"), adminProductController.addProduct);
router.get("/", adminAuth, adminProductController.getAllProducts);
router.get("/counts-by-admin", adminAuth, adminProductController.getProductCountsByAdmin);
router.get("/:id", adminAuth, adminProductController.getProductById);
router.put("/update/:id", adminAuth, upload.single("imageFile"), adminProductController.updateProduct);
router.delete("/delete/:id", adminAuth, adminProductController.deleteProduct);

module.exports = router;