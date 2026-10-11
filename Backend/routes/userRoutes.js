const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// get the logged in user's profile
router.get("/profile", protect, getUserProfile);

// update profile information
router.put("/profile", protect, updateUserProfile);

module.exports = router;
