import { useEffect, useState } from "react"
import axios from "axios"
import orderService from "../services/orderService"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts"

/* eslint-disable react-hooks/set-state-in-effect */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#EEF0FF",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#1e1e2e",
    padding: "0",
  },
  header: {
    background: "#3337A9",
    borderBottom: "none",
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#ffffff",
  },
  content: {
    padding: "32px 40px",
  },
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
  },
  tabBtn: (active) => ({
    padding: "12px 28px",
    borderRadius: "50px",
    border: active ? "none" : "2px solid #3337A9",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    transition: "all 0.25s ease",
    background: active ? "#3337A9" : "white",
    color: active ? "#fff" : "#3337A9",
    boxShadow: active ? "0 4px 16px rgba(51,55,169,0.35)" : "none",
  }),
  card: {
    background: "white",
    border: "1px solid #e0e3ff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(51,55,169,0.08)",
    marginBottom: "32px",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "18px",
    fontWeight: 700,
    color: "#3337A9",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  summaryCard: {
    background: "white",
    border: "1px solid #e0e3ff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(51,55,169,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  summaryTitle: {
    fontSize: "15px",
    color: "#4b5563",
    fontWeight: 600,
    marginBottom: "8px",
  },
  summaryValue: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#1e1e2e",
  },
  summaryTrend: {
    fontSize: "13px",
    fontWeight: 600,
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  chartContainer: {
    background: "white",
    border: "1px solid #e0e3ff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(51,55,169,0.08)",
    marginBottom: "32px",
    height: "350px",
  },
  splitLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "32px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e0e3ff",
    color: "#4b5563",
    fontWeight: 600,
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f3f4f6",
    color: "#1e1e2e",
    fontSize: "14px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  input: {
    background: "white",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#1e1e2e",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  fileInput: {
    background: "rgba(255,255,255,0.05)",
    border: "1px dashed rgba(255,255,255,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#aaa",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  btnPrimary: {
    background: "#3337A9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(51,55,169,0.35)",
    transition: "all 0.2s ease",
  },
  btnSuccess: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    marginRight: "8px",
  },
  btnDanger: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnWarning: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    marginRight: "8px",
  },
  btnGhost: {
    background: "white",
    color: "#6b7280",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },
  productCard: {
    background: "white",
    border: "1px solid #e0e3ff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(51,55,169,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  productImg: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    display: "block",
  },
  productInfo: {
    padding: "14px",
  },
  productName: {
    margin: "0 0 6px 0",
    fontSize: "15px",
    fontWeight: 700,
    color: "#1e1e2e",
  },
  productMeta: {
    margin: "3px 0",
    fontSize: "13px",
    color: "#9ca3af",
  },
  productActions: {
    display: "flex",
    gap: "8px",
    padding: "0 14px 14px",
  },
  editForm: {
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  orderCard: {
    background: "white",
    border: "1px solid #e0e3ff",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "16px",
    boxShadow: "0 2px 12px rgba(51,55,169,0.07)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  orderId: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    color: "#3337A9",
  },
  badge: (status) => ({
    padding: "5px 14px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: 700,
    background:
      status === "Paid"
        ? "linear-gradient(135deg,#10b981,#059669)"
        : status === "Pending"
        ? "linear-gradient(135deg,#f59e0b,#d97706)"
        : "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  }),
  orderMeta: {
    fontSize: "14px",
    color: "#9ca3af",
    margin: "4px 0",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f0f1ff",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "8px",
  },
  orderItemImg: {
    width: "52px",
    height: "52px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  totalBox: {
    textAlign: "right",
    marginTop: "16px",
    padding: "12px 16px",
    background: "#eef0ff",
    borderRadius: "10px",
    border: "1px solid #c7caef",
    fontSize: "16px",
    fontWeight: 700,
    color: "#3337A9",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "14px 18px",
    color: "#dc2626",
    marginBottom: "16px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
    fontSize: "16px",
  },
}

export default function Admin() {

  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState(null)

  const [editingProduct, setEditingProduct] = useState(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editStock, setEditStock] = useState("")
  const [editImage, setEditImage] = useState(null)

  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [toast, setToast] = useState(null) // { msg, type: 'success' | 'error' }
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    console.log("Current user:", user)
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/api/products`)
    setProducts(res.data)
  }

  const fetchOrders = async () => {
    try {
      setOrdersError("")
      const ordersData = await orderService.getAdminOrders()
      setOrders(ordersData)
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || error.message || "Unknown error"
      console.error("Failed to fetch orders:", msg)
      setOrdersError(msg)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    try {
      await orderService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      showToast(`อัปเดตสถานะเป็น "${newStatus}" สำเร็จ`, "success")
    } catch (err) {
      showToast("อัปเดตสถานะล้มเหลว", "error")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const addProduct = async () => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("stock", stock)
      formData.append("image", image)
      await axios.post(`${API_URL}/api/products`, formData)
      fetchProducts()
      showToast(`✅ เพิ่มสินค้า "${name}" สำเร็จแล้ว!`)
    } catch (error) {
      showToast("❌ เพิ่มสินค้าไม่สำเร็จ: " + (error.response?.data?.message || error.message), "error")
    }
  }

  const startEdit = (product) => {
    setEditingProduct(product._id)
    setEditName(product.name)
    setEditPrice(product.price)
    setEditCategory(product.category)
    setEditStock(product.stock)
    setEditImage(null)
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditName("")
    setEditPrice("")
    setEditCategory("")
    setEditStock("")
    setEditImage(null)
  }

  const updateProduct = async () => {
    try {
      await axios.put(`${API_URL}/api/products/${editingProduct}`, {
        name: editName,
        price: editPrice,
        category: editCategory,
        stock: editStock
      })
      if (editImage) {
        const imageFormData = new FormData()
        imageFormData.append("image", editImage)
        await axios.post(`${API_URL}/api/products/${editingProduct}/image`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      fetchProducts()
      cancelEdit()
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message)
      alert("Failed to update product: " + (error.response?.data?.message || error.message))
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) {
      await axios.delete(`${API_URL}/api/products/${id}`)
      fetchProducts()
    }
  }

  return (
    <div style={styles.page}>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 9999,
          background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          color: toast.type === "error" ? "#dc2626" : "#16a34a",
          padding: "14px 20px",
          borderRadius: "14px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          maxWidth: "340px",
          animation: "slideIn 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          {toast.msg}
        </div>
      )}

      <datalist id="category-options">
        {uniqueCategories.map(cat => (
          <option key={cat} value={cat} />
        ))}
      </datalist>

      {/* Header */}
      <div style={styles.header}>
        <span style={{ fontSize: "28px" }}>🛠️</span>
        <h1 style={styles.headerTitle}>Admin Panel</h1>
      </div>

      <div style={styles.content}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("dashboard")}
            style={styles.tabBtn(activeTab === "dashboard")}
          >
            📊 แดชบอร์ด
          </button>
          <button
            onClick={() => setActiveTab("products")}
            style={styles.tabBtn(activeTab === "products")}
          >
            📦 จัดการสินค้า
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={styles.tabBtn(activeTab === "orders")}
          >
            📋 รายการสั่งซื้อ
          </button>
        </div>

        {/* ===== Dashboard Tab ===== */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
                📊 สรุปยอดขาย (Sales Summary)
              </h2>
            </div>
            
            {/* Summary Cards */}
            <div style={styles.dashboardGrid}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryTitle}>ยอดขายวันนี้</div>
                <div style={styles.summaryValue}>฿{
                  orders
                    .filter(o => {
                      const today = new Date().toDateString();
                      return new Date(o.createdAt).toDateString() === today && o.status !== "Cancelled";
                    })
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString()
                }</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryTitle}>ออเดอร์ใหม่ (Pending)</div>
                <div style={{ ...styles.summaryValue, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {orders.filter(o => o.status === "Pending").length}
                  <span style={{ fontSize: "20px", color: "#f59e0b" }}>⏳</span>
                </div>
              </div>
              <div style={{...styles.summaryCard, border: "1px solid #fecaca", background: "#fff5f5"}}>
                <div style={{...styles.summaryTitle, color: "#dc2626"}}>สินค้าสต็อกต่ำ &lt; 5</div>
                <div style={{ ...styles.summaryValue, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#dc2626" }}>
                  {products.filter(p => p.stock < 5).length}
                  <span style={{ fontSize: "20px" }}>⚠️</span>
                </div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryTitle}>ยอดคำสั่งซื้อสำเร็จ</div>
                <div style={{ ...styles.summaryValue, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#16a34a" }}>
                  {orders.filter(o => o.status === "Paid" || o.status === "Completed").length}
                  <span style={{ fontSize: "20px" }}>✅</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <h2 style={styles.sectionTitle}>📈 การวิเคราะห์ยอดขายและเทรนด์</h2>
            <div style={styles.splitLayout}>
              {/* Fake Hourly Sales Data */}
              <div style={styles.chartContainer}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", color: "#4b5563" }}>ยอดขายรายชั่วโมง (ตัวอย่าง)</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={[
                    { time: '0:00', sales: 1200 }, { time: '3:00', sales: 800 },
                    { time: '6:00', sales: 1500 }, { time: '9:00', sales: 5000 },
                    { time: '12:00', sales: 3000 }, { time: '15:00', sales: 4500 },
                    { time: '18:00', sales: 6000 }, { time: '21:00', sales: 2500 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Best Sellers Data */}
              <div style={styles.chartContainer}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", color: "#4b5563" }}>5 อันดับสินค้าขายดี (ตัวอย่าง)</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={[
                    { name: 'น้ำดื่ม', sold: 120 }, { name: 'มาม่า', sold: 98 },
                    { name: 'ข้าวสาร', sold: 86 }, { name: 'โกโก้', sold: 65 },
                    { name: 'น้ำส้ม', sold: 50 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="sold" fill="#3337A9" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Insights */}
            <div style={styles.splitLayout}>
              {/* Low Stock Table */}
              <div style={{ ...styles.chartContainer, height: "auto" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
                  ⚠️ รายการสินค้าสต็อกต่ำ
                </h3>
                {products.filter(p => p.stock < 5).length === 0 ? (
                  <p style={{ color: "#6b7280", textAlign: "center", padding: "20px 0" }}>ไม่มีสินค้าใกล้หมดสต็อก 🎉</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>รูปภาพ</th>
                          <th style={styles.th}>ชื่อสินค้า</th>
                          <th style={styles.th}>สต็อกคงเหลือ</th>
                          <th style={styles.th}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.filter(p => p.stock < 5).map(p => (
                          <tr key={p._id}>
                            <td style={styles.td}>
                              <img src={`${API_URL}${p.image}`} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                            </td>
                            <td style={styles.td}><strong>{p.name}</strong></td>
                            <td style={{ ...styles.td, color: "#dc2626", fontWeight: 700 }}>{p.stock}</td>
                            <td style={styles.td}>
                              <button 
                                style={{ ...styles.btnPrimary, padding: "6px 14px", fontSize: "12px", borderRadius: "6px" }}
                                onClick={() => {
                                  setActiveTab("products")
                                  setTimeout(() => startEdit(p), 100)
                                }}
                              >
                                สั่งเพิ่ม
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div style={{ ...styles.chartContainer, height: "auto" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#4b5563" }}>กิจกรรมล่าสุด</h3>
                <div>
                  {orders.slice(0, 5).map(order => (
                    <div key={`recent-order-${order._id}`} style={{ display: "flex", gap: "12px", marginBottom: "16px", borderLeft: "2px solid #e0e3ff", paddingLeft: "16px" }}>
                      <div style={{ minWidth: "60px", fontSize: "12px", color: "#9ca3af" }}>
                        {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <span style={{ color: "#3337A9", fontWeight: 600 }}>{order.user?.name || "ลูกค้า"}</span> สั่งซื้อ #{order._id.slice(-6).toUpperCase()}
                        <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px" }}>ยอด {order.totalAmount.toLocaleString()} บาท</div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p style={{ color: "#6b7280" }}>ยังไม่มีกิจกรรม</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Products Tab ===== */}
        {activeTab === "products" && (
          <>
            {/* Add Product Form */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>➕ เพิ่มสินค้าใหม่</h2>
              <div style={styles.formGrid}>
                <input style={styles.input} placeholder="ชื่อสินค้า" onChange={(e) => setName(e.target.value)} />
                <input style={styles.input} placeholder="ราคา (บาท)" type="number" onChange={(e) => setPrice(e.target.value)} />
                <input style={styles.input} list="category-options" placeholder="หมวดหมู่" onChange={(e) => setCategory(e.target.value)} />
                <input style={styles.input} placeholder="จำนวนสต็อก" type="number" onChange={(e) => setStock(e.target.value)} />
                <input style={styles.fileInput} type="file" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <button style={styles.btnPrimary} onClick={addProduct}>
                ✅ เพิ่มสินค้า
              </button>
            </div>

            {/* Product Grid */}
            <div style={styles.productGrid}>
              {products.map(p => (
                <div key={p._id} style={styles.productCard}>
                  {editingProduct === p._id ? (
                    <div style={styles.editForm}>
                      <p style={{ margin: "0 0 8px 0", fontWeight: 700, color: "#c4b5fd" }}>✏️ แก้ไขสินค้า</p>
                      <input style={styles.input} placeholder="ชื่อสินค้า" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <input style={styles.input} placeholder="ราคา" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                      <input style={styles.input} list="category-options" placeholder="หมวดหมู่" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                      <input style={styles.input} placeholder="สต็อก" type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} />
                      <input style={styles.fileInput} type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <button style={styles.btnSuccess} onClick={updateProduct}>💾 บันทึก</button>
                        <button style={styles.btnGhost} onClick={cancelEdit}>✖ ยกเลิก</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={`${API_URL}${p.image}`} alt={p.name} style={styles.productImg} />
                      <div style={styles.productInfo}>
                        <h3 style={styles.productName}>{p.name}</h3>
                        <p style={styles.productMeta}>💰 {p.price} บาท</p>
                        <p style={styles.productMeta}>📦 Stock: {p.stock}</p>
                        <p style={styles.productMeta}>🏷️ {p.category}</p>
                      </div>
                      <div style={styles.productActions}>
                        <button style={styles.btnWarning} onClick={() => startEdit(p)}>✏️ แก้ไข</button>
                        <button style={styles.btnDanger} onClick={() => deleteProduct(p._id)}>🗑️ ลบ</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== Orders Tab ===== */}
        {activeTab === "orders" && (
          <div>
            <h2 style={{ ...styles.sectionTitle, fontSize: "20px", marginBottom: "20px" }}>
              📋 รายการสั่งซื้อทั้งหมด ({orders.length} รายการ)
            </h2>

            {ordersError && (
              <div style={styles.errorBox}>⚠️ เกิดข้อผิดพลาด: {ordersError}</div>
            )}

            {orders.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                <p>ยังไม่มีรายการสั่งซื้อ</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <h3 style={styles.orderId}>🧾 Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <select
                        value={order.status}
                        disabled={updatingOrderId === order._id}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: "none",
                          fontWeight: 700,
                          fontSize: "13px",
                          cursor: "pointer",
                          background:
                            order.status === "Paid" ? "#10b981"
                            : order.status === "ตรวจสอบสลิปแล้ว" ? "#6366f1"
                            : order.status === "จัดส่งแล้ว" ? "#3b82f6"
                            : order.status === "ยกเลิก" ? "#ef4444"
                            : "#f59e0b",
                          color: "white",
                          opacity: updatingOrderId === order._id ? 0.6 : 1
                        }}
                      >
                        <option value="Pending">⏳ Pending — รอชำระเงิน</option>
                        <option value="Paid">✅ Paid — ชำระแล้ว</option>
                        <option value="ตรวจสอบสลิปแล้ว">🔍 ตรวจสอบสลิปแล้ว</option>
                        <option value="จัดส่งแล้ว">🚚 จัดส่งแล้ว</option>
                        <option value="ยกเลิก">❌ ยกเลิก</option>
                      </select>
                      {updatingOrderId === order._id && <span style={{ fontSize: "12px", color: "#9ca3af" }}>⏳</span>}
                    </div>
                  </div>

                  <p style={styles.orderMeta}>👤 <strong style={{ color: "#e0e0e0" }}>{order.user?.name}</strong> ({order.user?.email})</p>
                  <p style={styles.orderMeta}>📅 {new Date(order.createdAt).toLocaleString('th-TH')}</p>
                  <p style={styles.orderMeta}>💳 วิธีชำระ: {order.paymentMethod}</p>
                  <p style={styles.orderMeta}>🏠 ที่อยู่: {order.shippingAddress?.name}, {order.shippingAddress?.phone}, {order.shippingAddress?.address}</p>

                  <div style={{ marginTop: "16px" }}>
                    <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>รายการสินค้า</p>
                    {order.items.map((item, index) => (
                      <div key={index} style={styles.orderItem}>
                        <img
                          src={`${API_URL}${item.product?.image}`}
                          alt={item.product?.name}
                          style={styles.orderItemImg}
                        />
                        <div>
                          <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "14px" }}>{item.product?.name}</p>
                          <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px" }}>จำนวน: {item.quantity} | ราคา: {item.price} บาท</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.totalBox}>
                    💰 รวมทั้งสิ้น: {order.totalAmount.toLocaleString()} บาท
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}