import axios from "axios"

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`

export const getProducts = () => axios.get(API)

export const createProduct = (data, token) =>
  axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const deleteProduct = (id, token) =>
  axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })