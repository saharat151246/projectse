import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function ProductDetail({ cartSystem }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)

  const { addToCart } = cartSystem

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#3337A9", fontSize: "18px" }}>
      ⏳ กำลังโหลด...
    </div>
  )

  if (error) return (
    <div style={{ padding: "40px", background: "#fef2f2", color: "#dc2626", borderRadius: "12px", margin: "40px" }}>
      ⚠️ {error}
    </div>
  )

  if (!product) return null

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8ff", padding: "40px" }}>

      <Link to="/" style={{ color: "#3337A9", fontWeight: 600, textDecoration: "none", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
        ← กลับหน้าหลัก
      </Link>

      <div style={{ display: "flex", flexDirection: "row", gap: "48px", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* Product Image */}
        <div style={{ flex: "0 0 420px" }}>
          <img
            src={product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`}
            alt={product.name}
            style={{ width: "100%", borderRadius: "20px", objectFit: "cover", boxShadow: "0 8px 32px rgba(51,55,169,0.15)" }}
          />
        </div>

        {/* Product Info */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <h1 style={{ margin: "0 0 12px", fontSize: "32px", fontWeight: 800, color: "#1e1e2e" }}>
            {product.name}
          </h1>

          <p style={{ fontSize: "28px", fontWeight: 700, color: "#3337A9", margin: "0 0 20px" }}>
            ฿{product.price.toLocaleString()}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            <div style={{ background: "#eef0ff", padding: "10px 16px", borderRadius: "10px", fontSize: "14px", color: "#374151" }}>
              🏷️ ประเภท: <strong>{product.category}</strong>
            </div>
            <div style={{ background: product.stock > 0 ? "#f0fdf4" : "#fef2f2", padding: "10px 16px", borderRadius: "10px", fontSize: "14px", color: product.stock > 0 ? "#16a34a" : "#dc2626" }}>
              📦 คงเหลือ: <strong>{product.stock} ชิ้น</strong>
            </div>
          </div>

          {product.description && (
            <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>
              {product.description}
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: "14px 36px",
              background: added ? "#16a34a" : product.stock === 0 ? "#d1d5db" : "#3337A9",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "16px",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              boxShadow: product.stock === 0 ? "none" : "0 4px 16px rgba(51,55,169,0.35)",
              transition: "all 0.3s ease"
            }}
          >
            {product.stock === 0 ? "สินค้าหมด" : added ? "✅ เพิ่มแล้ว!" : "🛒 เพิ่มลงตะกร้า"}
          </button>
        </div>

      </div>
    </div>
  )
}