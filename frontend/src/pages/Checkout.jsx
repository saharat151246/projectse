import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import axios from "axios"
import orderService from "../services/orderService"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// ── Success Modal ──────────────────────────────────────────────────────────
function SuccessModal({ onGoHome, onGoOrders }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "white", borderRadius: "24px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: 800, color: "#1f2937" }}>สั่งซื้อสำเร็จแล้ว!</h2>
        <p style={{ margin: "0 0 32px 0", color: "#6b7280", fontSize: "15px", lineHeight: 1.6 }}>ขอบคุณสำหรับการสั่งซื้อ<br />เราจะดำเนินการจัดส่งให้เร็วที่สุด 🚚</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={onGoOrders} style={{ padding: "12px 24px", background: "#3337A9", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>📦 ดูประวัติสั่งซื้อ</button>
          <button onClick={onGoHome} style={{ padding: "12px 24px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🏠 กลับหน้าหลัก</button>
        </div>
      </div>
    </div>
  )
}

// ── QR Section ─────────────────────────────────────────────────────────────
function QRSection({ totalPrice }) {
  return (
    <div style={{ textAlign: "center", padding: "20px", background: "#f9fafb", borderRadius: "12px", marginBottom: "16px" }}>
      <p style={{ fontWeight: 700, marginBottom: "8px", color: "#374151" }}>โอนเงินมาที่ PromptPay</p>
      <div style={{ width: "180px", height: "180px", margin: "0 auto 12px", background: "white", border: "2px solid #e5e7eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#9ca3af" }}>📱 QR Code<br />PromptPay</div>
      <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0" }}>หมายเลข PromptPay: <strong>083-XXX-XXXX</strong></p>
      <p style={{ fontSize: "13px", color: "#6b7280" }}>ยอดโอน: <strong style={{ color: "#3337A9" }}>฿{totalPrice}</strong></p>
      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>* กด "ยืนยัน" เพื่อส่งออเดอร์ Admin จะตรวจสลิปและอัปเดตสถานะให้</p>
    </div>
  )
}

// ── Checkout ───────────────────────────────────────────────────────────────
function Checkout({ cartSystem }) {
  const { cart, totalPrice, clearCart } = cartSystem
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const stripeAvailable = !!stripe  // true only if Stripe loaded correctly

  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddrId, setSelectedAddrId] = useState(null) // "_new" = กรอกเอง
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [phoneError, setPhoneError] = useState("")

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        const res = await axios.get(`${API_URL}/api/auth/addresses`, { headers: { Authorization: `Bearer ${token}` } })
        setSavedAddresses(res.data)
        if (res.data.length > 0) {
          setSelectedAddrId(res.data[0]._id)
          setName(res.data[0].name)
          setPhone(res.data[0].phone)
          setAddress(res.data[0].address)
        } else {
          setSelectedAddrId("_new")
        }
      } catch { setSelectedAddrId("_new") }
    }
    fetchAddresses()
  }, [])

  const handleSelectAddress = (addr) => {
    setSelectedAddrId(addr._id)
    setName(addr.name)
    setPhone(addr.phone)
    setAddress(addr.address)
    setPhoneError("")
  }

  const validatePhone = (val) => {
    if (!/^\d{10}$/.test(val)) { setPhoneError("เบอร์โทรต้องเป็นตัวเลข 10 หลักเท่านั้น"); return false }
    setPhoneError(""); return true
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhone(val)
    if (val.length > 0) validatePhone(val)
    else setPhoneError("")
  }

  const handleConfirmOrder = async () => {
    if (!name || !phone || !address) { alert("กรุณากรอกข้อมูลให้ครบ"); return }
    if (!validatePhone(phone)) return
    if (cart.length === 0) { alert("ไม่มีสินค้าในตะกร้า"); return }

    setIsProcessing(true)
    try {
      const orderData = {
        items: cart.map(item => ({ id: item._id || item.id, quantity: item.quantity, price: item.price })),
        totalAmount: totalPrice,
        shippingAddress: { name, phone, address },
        paymentMethod: paymentMethod === "card" ? "CreditCard" : paymentMethod === "transfer" ? "Transfer" : paymentMethod === "qr" ? "QRCode" : "COD"
      }

      if (paymentMethod === "card") {
        if (!stripe || !elements) { alert("Stripe not loaded"); setIsProcessing(false); return }
        const { order } = await orderService.createOrder(orderData)
        const { clientSecret: secret } = await orderService.createPaymentIntent(cart, totalPrice)
        const { error, paymentIntent } = await stripe.confirmCardPayment(secret, { payment_method: { card: elements.getElement(CardElement), billing_details: { name } } })
        if (error) { alert(`การชำระเงินล้มเหลว: ${error.message}`); setIsProcessing(false); return }
        if (paymentIntent.status === 'succeeded') { await orderService.payOrder(order._id, "CreditCard", paymentIntent.id); clearCart(); setShowSuccess(true) }
      } else {
        await orderService.createOrder(orderData); clearCart(); setShowSuccess(true)
      }
    } catch (error) {
      alert(`เกิดข้อผิดพลาด: ${error.message || error}`)
    } finally { setIsProcessing(false) }
  }

  const paymentOptions = [
    // Only show card option if Stripe is actually loaded
    ...(stripeAvailable ? [{ value: "card", label: "💳 บัตรเครดิต/เดบิต" }] : []),
    { value: "transfer", label: "🏦 โอนผ่านธนาคาร" },
    { value: "qr",       label: "📱 QR Code / PromptPay" },
    { value: "cod",      label: "💵 ชำระเงินปลายทาง (COD)" },
  ]

  // Default to transfer if card was selected but Stripe not available
  useEffect(() => {
    if (!stripeAvailable && paymentMethod === "card") {
      setPaymentMethod("transfer")
    }
  }, [stripeAvailable, paymentMethod])

  return (
    <div style={{ minHeight: "100vh", background: "#f0f1ff", padding: "clamp(16px, 5vw, 40px)" }}>
      {showSuccess && <SuccessModal onGoHome={() => navigate("/")} onGoOrders={() => navigate("/orders")} />}

      <button onClick={() => navigate("/")} style={{ color: "#3337A9", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
        ← กลับหน้าหลัก
      </button>

      <h1 style={{ margin: "0 0 20px 0", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#1f2937" }}>💳 ชำระเงิน</h1>

      <div className="checkout-grid">

        {/* รายการสินค้า */}
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <h2 className="font-bold mb-6 text-xl pb-4" style={{ borderBottom: "2px solid #3337A9" }}>📦 รายการสินค้า</h2>
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: "#f0f1ff" }}>
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">× {item.quantity}</p>
                </div>
                <span className="font-bold" style={{ color: "#3337A9" }}>฿{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "2px solid #3337A9", paddingTop: "16px" }}>
            <div className="flex justify-between font-bold text-2xl" style={{ color: "#3337A9" }}>
              <span>รวม:</span><span>฿{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* ฟอร์ม */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4 text-lg">📍 ที่อยู่จัดส่ง</h2>

          {/* Saved addresses */}
          {savedAddresses.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>ที่อยู่ที่บันทึกไว้:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {savedAddresses.map(addr => (
                  <label key={addr._id} onClick={() => handleSelectAddress(addr)} style={{
                    display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px",
                    borderRadius: "10px", border: `2px solid ${selectedAddrId === addr._id ? "#3337A9" : "#e5e7eb"}`,
                    background: selectedAddrId === addr._id ? "#f0f1ff" : "white", cursor: "pointer"
                  }}>
                    <input type="radio" name="savedAddr" checked={selectedAddrId === addr._id} onChange={() => handleSelectAddress(addr)} style={{ marginTop: "3px" }} />
                    <div>
                      <span style={{ background: "#f0f1ff", color: "#3337A9", borderRadius: "4px", padding: "1px 8px", fontSize: "11px", fontWeight: 700 }}>{addr.label}</span>
                      <p style={{ margin: "4px 0 2px 0", fontWeight: 700, fontSize: "14px" }}>{addr.name}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{addr.phone} · {addr.address}</p>
                    </div>
                  </label>
                ))}
                <label onClick={() => setSelectedAddrId("_new")} style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px",
                  borderRadius: "10px", border: `2px solid ${selectedAddrId === "_new" ? "#3337A9" : "#e5e7eb"}`,
                  background: selectedAddrId === "_new" ? "#f0f1ff" : "white", cursor: "pointer"
                }}>
                  <input type="radio" name="savedAddr" checked={selectedAddrId === "_new"} onChange={() => setSelectedAddrId("_new")} />
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3337A9" }}>+ กรอกที่อยู่ใหม่</span>
                </label>
              </div>
            </div>
          )}

          {/* Manual entry if _new selected or no saved addresses */}
          {(selectedAddrId === "_new" || savedAddresses.length === 0) && (
            <>
              <input placeholder="ชื่อ-นามสกุล" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }} />
              <input placeholder="เบอร์โทร (10 หลัก)" value={phone} onChange={handlePhoneChange} maxLength={10} inputMode="numeric"
                style={{ width: "100%", border: `1.5px solid ${phoneError ? "#ef4444" : "#e5e7eb"}`, borderRadius: "10px", padding: "10px 14px", fontSize: "14px", marginBottom: phoneError ? "4px" : "12px", boxSizing: "border-box", outline: "none" }} />
              {phoneError && <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "12px", marginTop: 0 }}>⚠️ {phoneError}</p>}
              <textarea placeholder="ที่อยู่จัดส่ง" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", marginBottom: "20px", boxSizing: "border-box", outline: "none", minHeight: "80px" }} />
            </>
          )}

          <h2 className="font-semibold mb-3 text-lg">💳 วิธีชำระเงิน</h2>
          <div className="space-y-2 mb-6">
            {paymentOptions.map(opt => (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", border: `2px solid ${paymentMethod === opt.value ? "#3337A9" : "#e5e7eb"}`, background: paymentMethod === opt.value ? "#f0f1ff" : "white", cursor: "pointer" }}>
                <input type="radio" value={opt.value} checked={paymentMethod === opt.value} onChange={(e) => setPaymentMethod(e.target.value)} />
                {opt.label}
              </label>
            ))}
          </div>

          {paymentMethod === "card" && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">🔒 ข้อมูลบัตร</h3>
              <div style={{ border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "12px" }}>
                <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
              </div>
            </div>
          )}
          {paymentMethod === "qr" && <QRSection totalPrice={totalPrice} />}
          {paymentMethod === "cod" && (
            <div style={{ background: "#fef9c3", border: "1.5px solid #fde68a", borderRadius: "10px", padding: "14px", marginBottom: "16px", fontSize: "14px", color: "#92400e" }}>
              💵 ชำระเงินปลายทาง — พนักงานจัดส่งจะเก็บเงิน <strong>฿{totalPrice}</strong> เมื่อสินค้าถึงบ้าน
            </div>
          )}
          {paymentMethod === "transfer" && (
            <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "10px", padding: "14px", marginBottom: "16px", fontSize: "14px", color: "#1d4ed8" }}>
              🏦 กรุณาโอนเงิน <strong>฿{totalPrice}</strong> มาที่บัญชี:<br />
              <strong>ธนาคารกสิกรไทย 123-4-56789-0</strong><br />ชื่อบัญชี: Fresh GO Co., Ltd.
            </div>
          )}

          <button onClick={handleConfirmOrder} disabled={isProcessing}
            style={{ width: "100%", background: isProcessing ? "#9196d4" : "#3337A9", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: 700, cursor: isProcessing ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(51,55,169,0.35)" }}>
            {isProcessing ? "⏳ กำลังดำเนินการ..." : "✅ ยืนยันการสั่งซื้อ"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Checkout