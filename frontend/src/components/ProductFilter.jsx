import { useState } from "react"

function ProductFilter({ categories, selectedCategory, handleCategoryClick, updateFilters }) {


  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const applyFilter = () => {

    updateFilters({
      category: selectedCategory,
      minPrice,
      maxPrice
    })

  }

  return (

    <div className="w-64 p-6 border-r border-gray-200 bg-gray-50 shadow-sm">

      <h2 className="font-bold mb-4 text-lg text-gray-800">
        📂 หมวดหมู่
      </h2>

      {/* Category dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryClick(e.target.value)}
        className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        {categories.length === 0 ? (
          <option disabled>Loading categories...</option>
        ) : (
          <>
            <option value="All">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </>
        )}
      </select>


      {/* Price Filter */}
      <h3 className="font-semibold mt-6 mb-3 text-gray-800">💰 ราคา</h3>

      <input
        placeholder="ราคาต่ำสุด"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="w-full border border-gray-300 p-2 mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        placeholder="ราคาสูงสุด"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="w-full border border-gray-300 p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        onClick={applyFilter}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md"
      >
        ✓ เลือก
      </button>

    </div>

  )

}

export default ProductFilter