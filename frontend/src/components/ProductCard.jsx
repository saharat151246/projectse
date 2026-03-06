function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-2">
          {product.brand}
        </p>

        <p className="text-[#145c43] font-bold text-xl mb-4">
          ฿ {product.price}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-[#145c43] text-white py-2 rounded-full hover:bg-[#0f3d2e] transition"
        >
          เพิ่มลงตะกร้า
        </button>

      </div>

    </div>
  )
}

export default ProductCard