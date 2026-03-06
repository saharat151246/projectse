import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

export default function ProductDetail({ cartSystem }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { addToCart } = cartSystem

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!product) return null

  return (
    <div className="p-6">
      <Link to="/" className="text-green-600 hover:underline">
        ← กลับหน้าหลัก
      </Link>

      <div className="mt-4 flex flex-col md:flex-row gap-8">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="w-full max-w-md object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-green-600 mb-4">{product.price} บาท</p>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">ประเภท: {product.category}</p>
          <p className="mb-6">คงเหลือ: {product.stock}</p>

          <button
            onClick={() => addToCart(product)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            เพิ่มไปตะกร้า
          </button>
        </div>
      </div>
    </div>
  )
}