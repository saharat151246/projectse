const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");


// 🛒 เพิ่มสินค้าเข้าตะกร้า (มีเช็ค stock)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({ message: "Not enough stock" });
        }

        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🛒 ดูตะกร้า (populate รายละเอียดสินค้า)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const Order = require("../models/Order");

// 📦 Checkout
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (let item of cart.items) {
      const product = item.product;

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // ✅ หัก stock จริง
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ สร้าง Order
    const order = new Order({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
    });

    await order.save();

    // ✅ ลบ cart
    await Cart.findByIdAndDelete(cart._id);

    res.json({
      message: "Checkout successful",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🗑 ลบสินค้าออกจากตะกร้า
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed from cart", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
