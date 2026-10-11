const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Retrieve current user's profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update profile (name/email/phone/password)
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updated = await user.save();
    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
