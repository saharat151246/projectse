const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ======================
// 🔹 Register
// ======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // เช็คว่ามี email ซ้ำไหม
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user" // ถ้าไม่ส่ง role มาให้เป็น "user"
    });

    res.status(201).json({
      message: "Register success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🔹 Login
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // เช็ครหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // สร้าง JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🔹 Create Admin User (for development)
// ======================
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // เช็คว่ามี email ซ้ำไหม
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================
// 🔹 Get My Profile
// ======================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🔹 Update My Profile
// ======================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, bio, gender, birthday } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio, gender, birthday },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🔹 Get Saved Addresses
// ======================
router.get("/addresses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🔹 Add a Saved Address
// ======================
router.post("/addresses", authMiddleware, async (req, res) => {
  try {
    const { label, name, phone, address } = req.body;
    if (!name || !phone || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await User.findById(req.user._id);
    user.addresses.push({ label: label || "บ้าน", name, phone, address });
    await user.save();
    res.status(201).json({ message: "Address added", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🔹 Delete a Saved Address
// ======================
router.delete("/addresses/:addressId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ message: "Address deleted", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;