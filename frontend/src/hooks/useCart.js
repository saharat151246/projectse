import { useState, useEffect } from "react"

export default function useCart() {

  // Get current user ID for cart key
  const getCartKey = () => {
    const user = localStorage.getItem("user")
    const userId = user ? JSON.parse(user)._id : "guest"
    return `cart_${userId}`
  }

  const [cart, setCart] = useState(() => {
    const cartKey = getCartKey()
    const saved = localStorage.getItem(cartKey)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    const cartKey = getCartKey()
    localStorage.setItem(cartKey, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    // normalize id from backend (_id) or legacy id
    const id = product._id || product.id

    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === id)

      if (existing) {
        return prevCart.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevCart, { ...product, id, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const clearCart = () => {
    setCart([])
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    totalItems,
    totalPrice
  }
}