import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import orderService from "../services/orderService"

function Checkout({ cartSystem }) {

  const {
    cart,
    totalPrice,
    clearCart
  } = cartSystem

  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirmOrder = async () => {

    if (!name || !phone || !address) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return
    }

    if (cart.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า")
      return
    }

    setIsProcessing(true)

    try {
      // Prepare order data
      // convert to API-friendly orderData
      const orderData = {
        items: cart.map(item => ({
          id: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        shippingAddress: {
          name,
          phone,
          address
        },
        // map UI value to backend enum
        paymentMethod:
          paymentMethod === "card"
            ? "CreditCard"
            : paymentMethod === "transfer"
            ? "Transfer"
            : "COD"
      }

      if (paymentMethod === "card") {
        // Handle Stripe payment
        if (!stripe || !elements) {
          alert("Stripe not loaded")
          setIsProcessing(false)
          return
        }

        // Create order first
        const { order } = await orderService.createOrder(orderData)

        // Create payment intent
        const { clientSecret: secret } = await orderService.createPaymentIntent(cart, totalPrice)

        const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: name,
            },
          }
        })

        if (error) {
          alert(`Payment failed: ${error.message}`)
          setIsProcessing(false)
          return
        }

        if (paymentIntent.status === 'succeeded') {
          // Mark order as paid
          await orderService.payOrder(order._id, "CreditCard", paymentIntent.id)
          alert("สั่งซื้อและชำระเงินสำเร็จ 🎉")
          clearCart()
          navigate("/")
        }
      } else {
        // Handle other payment methods (cash, transfer)
        await orderService.createOrder(orderData)
        alert("สั่งซื้อสำเร็จ 🎉 กรุณาชำระเงินตามวิธีที่เลือก")
        clearCart()
        navigate("/")
      }
    } catch (error) {
      alert(`Error: ${error.message || error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-10">

      <button
        onClick={() => navigate("/")}
        className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2 mb-8"
      >
        ← กลับหน้าหลัก
      </button>

      <h1 className="text-4xl font-bold mb-10 text-gray-800">💳 ชำระเงิน</h1>

      <div className="grid grid-cols-3 gap-8">

        {/* รายการสินค้า */}
        <div className="col-span-1 bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="font-bold mb-6 text-xl border-b-2 pb-4">📦 รายการสินค้า</h2>

          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">× {item.quantity}</p>
                </div>
                <span className="font-bold text-green-600">฿{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 pt-4">
            <div className="flex justify-between font-bold text-2xl text-green-600">
              <span>รวม:</span>
              <span>฿{totalPrice}</span>
            </div>
          </div>

        </div>

        {/* ฟอร์ม + Payment */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">ข้อมูลลูกค้า</h2>

          <input
            placeholder="ชื่อ-นามสกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <input
            placeholder="เบอร์โทร"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <textarea
            placeholder="ที่อยู่จัดส่ง"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded mb-5"
          />

          <h2 className="font-semibold mb-3">วิธีชำระเงิน</h2>

          <div className="space-y-2 mb-6">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              บัตรเครดิต/เดบิต
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              โอนผ่านธนาคาร
            </label>

          </div>

          {paymentMethod === "card" && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">ข้อมูลบัตร</h3>
              <div className="border p-3 rounded">
                <CardElement options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }} />
              </div>
            </div>
          )}

          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing || !stripe}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "กำลังดำเนินการ..." : "ยืนยันการสั่งซื้อ"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default Checkout