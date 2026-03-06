const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const multer = require("multer")
const path = require("path")

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })


// GET PRODUCTS + FILTER
router.get("/", async (req, res) => {
  try {

    const { search, category, minPrice, maxPrice } = req.query

    let filter = {}

    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    if (category && category !== "All") {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}

      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const products = await Product.find(filter)

    res.json(products)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET DISTINCT CATEGORIES
router.get("/categories", async (req, res) => {
  try {
    let categories = await Product.distinct("category")
    // If no categories in DB, provide defaults
    if (categories.length === 0) {
      categories = ["Tea", "Coffee", "Equipment"]
    }
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ===============================
// 🔹 Get single product
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// ADD PRODUCT
router.post("/", upload.single("image"), async (req, res) => {

  try {

    const { name, price, category, stock } = req.body

    const product = new Product({
      name,
      price,
      category,
      stock,
      image: req.file ? `/uploads/${req.file.filename}` : ""
    })

    await product.save()

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})


// UPDATE PRODUCT DATA
router.put("/:id", async (req, res) => {
  try {

    const { name, price, category, stock } = req.body

    const updateData = {
      name,
      price: Number(price),
      category,
      stock: Number(stock)
    }


    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })


    res.json(product)
  } catch (error) {
    console.error("Update data error:", error)
    res.status(500).json({ message: error.message })
  }
})

// UPDATE PRODUCT IMAGE
router.post("/:id/image", upload.single("image"), async (req, res) => {
  try {

    const updateData = { image: `/uploads/${req.file.filename}` }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })

    res.json(product)
  } catch (error) {
    console.error("Update image error:", error)
    res.status(500).json({ message: error.message })
  }
})

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router