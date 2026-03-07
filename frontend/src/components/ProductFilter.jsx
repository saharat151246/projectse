import { useState } from "react"

function ProductFilter({ categories, selectedCategory, handleCategoryClick, updateFilters }) {

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const applyFilter = () => {
    updateFilters({ category: selectedCategory, minPrice, maxPrice })
  }

  return (
    <div className="home-sidebar">

      <h2 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "15px", color: "#3337A9", whiteSpace: "nowrap" }}>
        📂 หมวดหมู่
      </h2>

      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryClick(e.target.value)}
        style={{ width: "100%", border: "1.5px solid #c7caef", padding: "9px 12px", marginBottom: "16px", borderRadius: "10px", outline: "none", fontSize: "14px", background: "white", color: "#1e1e2e", cursor: "pointer" }}
      >
        {categories.length === 0 ? (
          <option disabled>กำลังโหลด...</option>
        ) : (
          <>
            <option value="All">ทั้งหมด</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </>
        )}
      </select>

      <h3 style={{ fontWeight: 700, marginBottom: "10px", fontSize: "13px", color: "#3337A9", whiteSpace: "nowrap" }}>
        💰 กรองราคา
      </h3>

      <input
        placeholder="ราคาต่ำสุด"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        style={{ width: "100%", border: "1.5px solid #c7caef", padding: "8px 12px", marginBottom: "8px", borderRadius: "10px", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
      />
      <input
        placeholder="ราคาสูงสุด"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        style={{ width: "100%", border: "1.5px solid #c7caef", padding: "8px 12px", marginBottom: "12px", borderRadius: "10px", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
      />
      <button
        onClick={applyFilter}
        style={{ width: "100%", background: "#3337A9", color: "white", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
      >✓ กรอง</button>

    </div>
  )
}

export default ProductFilter