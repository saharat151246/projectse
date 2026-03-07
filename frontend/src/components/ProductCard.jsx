import { Link } from "react-router-dom"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function ProductCard({ product, addToCart }) {

  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const p = product

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(51,55,169,0.08)",
      border: "1px solid #e0e3ff",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(51,55,169,0.16)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(51,55,169,0.08)" }}
    >
      {/* Image */}
      <Link to={`/product/${p._id || p.id}`} style={{ display: "block", overflow: "hidden" }}>
        <img
          src={`${API_URL}${p.image}`}
          alt={p.name}
          style={{ width: "100%", height: "180px", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
      </Link>

      {/* Info */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Category badge */}
          {p.category && (
            <span style={{ fontSize: "11px", fontWeight: 600, background: "#eef0ff", color: "#3337A9", padding: "3px 10px", borderRadius: "50px", display: "inline-block", marginBottom: "8px" }}>
              {p.category}
            </span>
          )}

          <Link to={`/product/${p._id || p.id}`} style={{ textDecoration: "none" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 700, color: "#1e1e2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {p.name}
            </h3>
          </Link>

          <p style={{ margin: "0 0 12px", fontSize: "20px", fontWeight: 700, color: "#3337A9" }}>
            ฿{p.price?.toLocaleString()}
          </p>
        </div>

        {/* Stock */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: p.stock > 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
            {p.stock > 0 ? `📦 เหลือ ${p.stock}` : "❌ สินค้าหมด"}
          </span>

          <button
            onClick={handleAdd}
            disabled={p.stock === 0}
            style={{
              flex: 1,
              background: added ? "#16a34a" : p.stock === 0 ? "#d1d5db" : "#3337A9",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "9px 12px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: p.stock === 0 ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
              boxShadow: p.stock === 0 ? "none" : "0 3px 10px rgba(51,55,169,0.25)"
            }}
          >
            {added ? "✅ เพิ่มแล้ว!" : "🛒 add"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard