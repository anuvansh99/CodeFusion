const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();


// GET /users
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// POST /users/getUserDetails
router.post('/getUserDetails', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

    let user = await User.findById(userId);
    if (!user) user = await User.findOne({ firebaseUid: userId });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userData = user.toObject();
    delete userData.password;
    res.json({ success: true, user: userData });

  } catch (err) {
    console.error("getUserDetails error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /users/google-login
router.post('/google-login', async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;
    if (!firebaseUid || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let user = await User.findOne({ firebaseUid });
    if (!user) user = await User.findOne({ email });

    if (user) {
      // Link Firebase UID if not already linked
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
    } else {
      user = await User.create({ email, name, firebaseUid });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ success: true, userId: user._id, token });

  } catch (err) {
    console.error("google-login error:", err);
    res.status(500).json({ success: false, message: "Server error during Google login" });
  }
});

module.exports = router;
