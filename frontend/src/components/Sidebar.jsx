function Sidebar({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="w-64 bg-white rounded-xl shadow-md p-4">
      <h2 className="font-bold mb-4 text-lg">หมวดหมู่</h2>

      <ul className="space-y-3">
        {categories.map((category) => (
          <li
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`cursor-pointer ${
              selectedCategory === category
                ? "text-green-600 font-semibold"
                : "text-gray-700 hover:text-green-600"
            }`}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar