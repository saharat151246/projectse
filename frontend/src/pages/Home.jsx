import { useState, useEffect } from "react"
import ProductFilter from "../components/ProductFilter"
import ProductCard from "../components/ProductCard"

function Home({ productSystem, cartSystem, searchTerm }) {

  const { products, fetchProducts } = productSystem
  const { addToCart } = cartSystem

  const [currentFilters, setCurrentFilters] = useState({})
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/categories`)
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error("Failed to load categories", err)
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const filters = { ...currentFilters }
    if (searchTerm) filters.search = searchTerm
    if (selectedCategory && selectedCategory !== "All") {
      filters.category = selectedCategory
    }
    fetchProducts(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, currentFilters, selectedCategory])

  const updateFilters = (newFilters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
  }

  return (
    <div className="home-layout">

      {/* Sidebar */}
      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryClick={handleCategoryClick}
        updateFilters={updateFilters}
      />

      {/* Main Content */}
      <div className="home-content">

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#1e1e2e" }}>🛍️ สินค้าทั้งหมด</h1>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#9ca3af" }}>
              {products.length} รายการ
              {selectedCategory !== "All" && ` · ${selectedCategory}`}
              {searchTerm && ` · ค้นหา "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "80px", color: "#9ca3af" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📭</div>
            <p style={{ fontSize: "18px", fontWeight: 600 }}>ไม่พบสินค้า</p>
            <p style={{ fontSize: "14px" }}>ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              addToCart={addToCart}
            />
          ))}
        </div>

      </div>

    </div>
  )

}

export default Home