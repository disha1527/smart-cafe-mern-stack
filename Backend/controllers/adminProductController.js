// controllers/adminProductController.js
const Product = require("../models/Product");

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, countInStock } = req.body;
    const uploadedImage = req.file ? `/uploads/${req.file.filename}` : image;

    if (!uploadedImage) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: uploadedImage,
      countInStock,
      admin: req.adminId || req.admin?.id
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get admin product counts grouped by admin
exports.getProductCountsByAdmin = async (req, res) => {
  try {
    const counts = await Product.aggregate([
      {
        $group: {
          _id: "$admin",
          count: { $sum: 1 },
          products: {
            $push: {
              id: "$_id",
              name: "$name"
            }
          }
        }
      },
      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "_id",
          as: "adminInfo"
        }
      },
      {
        $unwind: {
          path: "$adminInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          adminId: "$_id",
          name: {
            $cond: {
              if: { $ifNull: ["$adminInfo.name", false] },
              then: "$adminInfo.name",
              else: "Unknown Admin"
            }
          },
          email: { $ifNull: ["$adminInfo.email", ""] },
          count: 1,
          products: 1
        }
      }
    ]);

    res.status(200).json({ success: true, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (category) updateData.category = category;
    if (countInStock !== undefined) updateData.countInStock = countInStock;

    // Handle image: if a new file is uploaded, use it; otherwise keep existing
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true } // return the updated product
    );
    if(!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if(!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};