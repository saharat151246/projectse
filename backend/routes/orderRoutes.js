const express = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ===============================
// 🔹 Create Order (reserve stock)
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // map items and check stock atomically
    const orderItems = [];
    for (const item of items) {
      // attempt to decrement stock in a single atomic operation
      const updated = await Product.findOneAndUpdate(
        { _id: item.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        return res.status(400).json({ message: `Not enough stock for product ${item.id}` });
      }

      orderItems.push({
        product: updated._id,
        quantity: item.quantity,
        price: item.price
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "Pending",
      paymentMethod: paymentMethod || "COD"
    });

    await order.save();

    // Populate product details
    await order.populate('items.product');

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// 🔹 Create Payment Intent
// ===============================
router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects amount in cents
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// 🔹 Pay Order
// ===============================
router.post("/:id/pay", authMiddleware, async (req, res) => {
  try {
    const { paymentMethod, paymentIntentId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status === "Paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    order.status = "Paid";
    order.paymentMethod = paymentMethod;
    order.paidAt = Date.now();
    order.transactionId = paymentIntentId || "TXN" + Date.now();

    await order.save();

    res.json({
      message: "Payment successful",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Order routes working" });
});

// ===============================
// 🔹 Admin: Get All Orders
// ===============================
router.get("/admin-orders", authMiddleware, adminMiddleware, async (req, res) => {
  console.log("Admin orders route called"); // Debug
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;