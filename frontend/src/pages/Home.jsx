import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductFilter from "../components/ProductFilter"

function Home({ productSystem, cartSystem, searchTerm }) {

  const { products, fetchProducts } = productSystem
  const { addToCart } = cartSystem

  const [currentFilters, setCurrentFilters] = useState({})
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // load category options on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/categories`)
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error("Failed to load categories", err)
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  // whenever searchTerm, filters, or selected category change, refetch products
  useEffect(() => {
    const filters = { ...currentFilters }
    if (searchTerm) filters.search = searchTerm
    if (selectedCategory && selectedCategory !== "All") {
      filters.category = selectedCategory
    }
    fetchProducts(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, currentFilters, selectedCategory])

  const updateFilters = (newFilters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
  }

  return (

    <div>

      <div className="flex">

        {/* Sidebar */}
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
          updateFilters={updateFilters}
        />

        {/* Product List */}

      <div className="flex-1 grid grid-cols-4 gap-6 p-8">

        {products.map((p) => (

          <div
            key={p._id}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
          >

            <Link to={`/product/${p._id || p.id}`} className="block">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`${API_URL}${p.image}`}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold mt-3 text-gray-800 truncate">
                {p.name}
              </h3>
              <p className="text-xl font-semibold text-green-600 mt-2">
                ฿{p.price}
              </p>
            </Link>

            <button
              onClick={() => addToCart(p)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Add to cart
            </button>

          </div>

        ))}

      </div>

    </div>

    </div>

  )

}

export default Home