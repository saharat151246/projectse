import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import Header from "./components/Header"
import CartDrawer from "./components/CartDrawer"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail"
import Checkout from "./pages/Checkout"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Admin from "./pages/Admin"

import useCart from "./hooks/useCart"
import useAuth from "./hooks/useAuth"
import useProducts from "./hooks/useProducts"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_...");

function App() {

  const cartSystem = useCart()
  const { totalItems } = cartSystem

  const auth = useAuth()
  const productSystem = useProducts()

  const [searchTerm, setSearchTerm] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <Elements stripe={stripePromise}>
      <div>

        <Header
          totalItems={totalItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsCartOpen={setIsCartOpen}
          user={auth.user}
          logout={auth.logout}
        />

        <Routes>

          <Route
            path="/"
            element={
              <Home
                searchTerm={searchTerm}
                cartSystem={cartSystem}
                productSystem={productSystem}
              />
            }
          />

          <Route
            path="/product/:id"
            element={<ProductDetail cartSystem={cartSystem} />}
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute user={auth.user}>
                <Checkout cartSystem={cartSystem} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute user={auth.user}>
                <Admin productSystem={productSystem} />
              </AdminRoute>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

        </Routes>

        <CartDrawer
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          cart={cartSystem.cart}
          totalPrice={cartSystem.totalPrice}
          increaseQty={cartSystem.increaseQty}
          decreaseQty={cartSystem.decreaseQty}
          removeFromCart={cartSystem.removeFromCart}
        />

      </div>
    </Elements>
  )
}

export default App