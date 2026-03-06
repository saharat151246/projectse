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
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end"
      onClick={() => setIsOpen(false)}
    >
      {/* Drawer */}
      <div
        className="w-96 bg-white h-full p-8 shadow-2xl flex flex-col rounded-l-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">🛒 ตะกร้า</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-3xl font-bold text-gray-600 hover:text-red-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto pr-2">
          {cart.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              ไม่มีสินค้าในตะกร้า
            </p>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="border-b pb-4 mb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.price} ฿
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  ลบ
                </button>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>

                <span className="ml-auto font-semibold">
                  {item.price * item.quantity} ฿
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>รวมทั้งหมด</span>
            <span>{totalPrice} ฿</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-lg text-white transition ${
              cart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            ไปชำระเงิน
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer