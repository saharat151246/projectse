import { useEffect, useState } from "react"
import orderService from "../services/orderService"

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#1e1e2e",
    padding: "clamp(20px, 5vw, 40px)",
    boxSizing: "border-box",
    overflowX: "hidden",
    width: "100%",
  },
  title: {
    margin: "0 0 30px 0",
    fontSize: "28px",
    fontWeight: 800,
    color: "#3337A9",
  },
  orderCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: "16px",
  },
  orderId: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
  },
  badge: (status) => ({
    padding: "6px 16px",
    borderRadius: "50px",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    display: "inline-block",
    background:
      status === "Paid"
        ? "#dcfce7"
        : status === "Pending"
        ? "#fef3c7"
        : "#fee2e2",
    color:
      status === "Paid"
        ? "#16a34a"
        : status === "Pending"
        ? "#d97706"
        : "#dc2626",
  }),
  orderMeta: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0",
    wordBreak: "break-word",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "10px",
  },
  orderItemImg: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  totalBox: {
    textAlign: "right",
    marginTop: "20px",
    padding: "16px",
    background: "#eff6ff",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1e40af",
  },
  emptyBox: {
    textAlign: "center",
    padding: "80px 20px",
    background: "white",
    borderRadius: "16px",
    border: "1px dashed #d1d5db",
  },
  loadingBox: {
    textAlign: "center",
    padding: "100px 20px",
    fontSize: "18px",
    color: "#6b7280",
  }
}

export default function UserOrders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders()
        setOrders(data)
      } catch (err) {
        setError(err.message || "Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <div style={styles.loadingBox}>⏳ กำลังโหลดประวัติการสั่งซื้อ...</div>
  if (error) return <div style={{ ...styles.page, color: "red" }}>⚠️ {error}</div>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📦 ประวัติการสั่งซื้อของฉัน</h1>

      {orders.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={{ fontSize: "50px", marginBottom: "16px" }}>📭</div>
          <h2 style={{ margin: "0 0 8px 0", color: "#374151" }}>ยังไม่มีประวัติการสั่งซื้อ</h2>
          <p style={{ margin: 0, color: "#9ca3af" }}>เริ่มสั่งซื้อสินค้าเพื่อดูประวัติที่นี่</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3 style={styles.orderId}>🧾 คำสั่งซื้อ #{order._id.slice(-8).toUpperCase()}</h3>
                <p style={styles.orderMeta}>📅 {new Date(order.createdAt).toLocaleString('th-TH')}</p>
              </div>
              <span style={styles.badge(order.status)}>
                {order.status === "Pending" ? "⏳ รอชำระเงิน" : 
                 order.status === "Paid" ? "✅ ชำระเงินแล้ว/กำลังจัดส่ง" : 
                 order.status}
              </span>
            </div>

            <p style={styles.orderMeta}>🏠 <strong>ที่อยู่จัดส่ง:</strong> {order.shippingAddress?.name}, {order.shippingAddress?.address}</p>
            <p style={styles.orderMeta}>💳 <strong>ชำระผ่าน:</strong> {order.paymentMethod}</p>

            <div style={{ marginTop: "24px" }}>
              <p style={{ color: "#4b5563", fontSize: "14px", marginBottom: "12px", fontWeight: 700 }}>รายการสินค้า:</p>
              {order.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <img
                    src={item.product?.image?.startsWith('http') ? item.product.image : `${API_URL}${item.product?.image}`}
                    alt={item.product?.name}
                    style={styles.orderItemImg}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>{item.product?.name}</p>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{item.quantity} x {item.price} บาท</p>
                  </div>
                  <div style={{ fontWeight: 700, color: "#374151" }}>
                    {(item.quantity * item.price).toLocaleString()} บาท
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.totalBox}>
              ยอดสุทธิ: {order.totalAmount.toLocaleString()} บาท
            </div>
          </div>
        ))
      )}
    </div>
  )
}
