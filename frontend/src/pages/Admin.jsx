import { useEffect, useState } from "react"
import axios from "axios"
import orderService from "../services/orderService"

/* eslint-disable react-hooks/set-state-in-effect */

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

  // Orders state
  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState("")
  const [activeTab, setActiveTab] = useState("products") // "products" or "orders"

  // Debug: Check user info
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

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])



  const addProduct = async () => {

    const formData = new FormData()

    formData.append("name", name)
    formData.append("price", price)
    formData.append("category", category)
    formData.append("stock", stock)
    formData.append("image", image)

    await axios.post(`${API_URL}/api/products`, formData)

    fetchProducts()

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

      // ส่งข้อมูล
      await axios.put(`${API_URL}/api/products/${editingProduct}`, {
        name: editName,
        price: editPrice,
        category: editCategory,
        stock: editStock
      })

      // ถ้ามีรูปภาพ, ส่งรูปภาพ
      if (editImage) {
        const imageFormData = new FormData()
        imageFormData.append("image", editImage)
        await axios.post(`${API_URL}/api/products/${editingProduct}/image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`${API_URL}/api/products/${id}`)
      fetchProducts()
    }
  }



  return (

    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>Admin Panel</h1>

      {/* Tabs */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "products" ? "#007bff" : "#f8f9fa",
            color: activeTab === "products" ? "white" : "black",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          📦 จัดการสินค้า
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "orders" ? "#007bff" : "#f8f9fa",
            color: activeTab === "orders" ? "white" : "black",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          📋 รายการสั่งซื้อ
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          {/* ADD PRODUCT */}
          <div style={{ border: "1px solid #ddd", padding: 20, marginBottom: 40 }}>

            <h2>Add Product</h2>

            <input
              placeholder="Product Name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Price"
              type="number"
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              placeholder="Category"
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              placeholder="Stock"
              type="number"
              onChange={(e) => setStock(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button onClick={addProduct}>
              Add Product
            </button>

          </div>



          {/* PRODUCT LIST */}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 20
          }}>

            {products.map(p => (

              <div key={p._id}
                style={{
                  border: "1px solid #ddd",
                  padding: 15
                }}>

                {editingProduct === p._id ? (
                  <div>
                    <input
                      placeholder="Product Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      placeholder="Price"
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                    <input
                      placeholder="Category"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                    <input
                      placeholder="Stock"
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                    />
                    <input
                      type="file"
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                    <button onClick={updateProduct}>Update</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <img
                      src={`${API_URL}${p.image}`}
                      width="100%"
                    />
                    <h3>{p.name}</h3>
                    <p>💰 {p.price} บาท</p>
                    <p>📦 Stock: {p.stock}</p>
                    <p>🏷 {p.category}</p>
                    <button onClick={() => startEdit(p)}>Edit</button>
                    <button onClick={() => deleteProduct(p._id)}>Delete</button>
                  </>
                )}

              </div>

            ))}

          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2>รายการสั่งซื้อทั้งหมด</h2>

          {ordersError && (
            <p style={{ color: "red" }}>เกิดข้อผิดพลาด: {ordersError}</p>
          )}

          {orders.length === 0 ? (
            <p>ยังไม่มีรายการสั่งซื้อ</p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {orders.map(order => (
                <div key={order._id} style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <span style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: order.status === "Paid" ? "#28a745" : order.status === "Pending" ? "#ffc107" : "#dc3545",
                      color: "white",
                      fontSize: "12px"
                    }}>
                      {order.status}
                    </span>
                  </div>

                  <p><strong>ลูกค้า:</strong> {order.user?.name} ({order.user?.email})</p>
                  <p><strong>วันที่สั่ง:</strong> {new Date(order.createdAt).toLocaleString('th-TH')}</p>
                  <p><strong>วิธีการชำระ:</strong> {order.paymentMethod}</p>
                  <p><strong>ที่อยู่จัดส่ง:</strong> {order.shippingAddress?.name}, {order.shippingAddress?.phone}, {order.shippingAddress?.address}</p>

                  <div style={{ marginTop: "15px" }}>
                    <h4>รายการสินค้า:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        padding: "10px",
                        backgroundColor: "white",
                        borderRadius: "5px"
                      }}>
                        <img
                          src={`${API_URL}${item.product?.image}`}
                          alt={item.product?.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                        />
                        <div>
                          <p><strong>{item.product?.name}</strong></p>
                          <p>จำนวน: {item.quantity} | ราคา: {item.price} บาท</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "15px", textAlign: "right" }}>
                    <p><strong>รวมทั้งสิ้น: {order.totalAmount} บาท</strong></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>

  )

}