import { useState, useEffect } from "react"

/* eslint-disable react-hooks/set-state-in-effect */

function useProducts() {

  const [products, setProducts] = useState([])

  const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`

  const fetchProducts = async (filters = {}) => {

    const query = new URLSearchParams(filters).toString()

    const res = await fetch(`${API}?${query}`)

    const data = await res.json()

    setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    fetchProducts
  }
}

export default useProducts