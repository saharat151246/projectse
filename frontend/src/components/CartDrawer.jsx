import { useNavigate } from "react-router-dom"

function CartDrawer({
  isOpen,
  setIsOpen,
  cart,
  totalPrice,
  increaseQty,
  decreaseQty,
  removeFromCart
}) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleCheckout = () => {
    setIsOpen(false)
    navigate("/checkout")
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}
      onClick={() => setIsOpen(false)}
    >
      {/* Drawer Panel */}
      <div
        style={{ width: "380px", background: "white", height: "100%", padding: "0", boxShadow: "-4px 0 30px rgba(51,55,169,0.15)", display: "flex", flexDirection: "column", borderRadius: "20px 0 0 20px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "#3337A9", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "20px 0 0 0" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "white" }}>🛒 ตะกร้าสินค้า</h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", fontSize: "18px", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {cart.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "60px", color: "#9ca3af" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
              <p>ไม่มีสินค้าในตะกร้า</p>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              style={{ borderBottom: "1px solid #f0f1ff", paddingBottom: "16px", marginBottom: "16px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#1e1e2e" }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{item.price} ฿</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: "#fef2f2", border: "none", color: "#ef4444", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", cursor: "pointer" }}
                >
                  ลบ
                </button>
              </div>

              {/* Quantity Control */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => decreaseQty(item.id)}
                  style={{ width: "30px", height: "30px", background: "#eef0ff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "16px", cursor: "pointer", color: "#3337A9" }}
                >
                  −
                </button>
                <span style={{ fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  style={{ width: "30px", height: "30px", background: "#3337A9", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "16px", cursor: "pointer", color: "white" }}
                >
                  +
                </button>
                <span style={{ marginLeft: "auto", fontWeight: 700, color: "#3337A9" }}>
                  {item.price * item.quantity} ฿
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 24px", borderTop: "2px solid #eef0ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "18px", marginBottom: "16px", color: "#1e1e2e" }}>
            <span>รวมทั้งหมด</span>
            <span style={{ color: "#3337A9" }}>฿{totalPrice}</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              fontSize: "15px",
              cursor: cart.length === 0 ? "not-allowed" : "pointer",
              background: cart.length === 0 ? "#d1d5db" : "#3337A9",
              color: "white",
              boxShadow: cart.length === 0 ? "none" : "0 4px 14px rgba(51,55,169,0.35)"
            }}
          >
            {cart.length === 0 ? "ตะกร้าว่าง" : "✅ ไปชำระเงิน"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer