import { useNavigate } from "react-router-dom"

function Header({
  totalItems,
  searchTerm,
  setSearchTerm,
  setIsCartOpen,
  user,
  logout
}) {

  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-5 flex items-center gap-8 text-white shadow-lg">

      <div
        onClick={() => navigate("/")}
        className="text-4xl font-extrabold cursor-pointer hover:scale-105 transition-transform"
      >
        🥬 Fresh GO
      </div>

      <div className="flex-1">
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-full text-black shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* ถ้ายังไม่ Login */}
      {!user && (
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-400 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Register
          </button>
        </div>
      )}

      {/* ถ้า Login แล้ว */}
      {user && (
        <div className="flex items-center gap-4">
          <span className="font-semibold">👤 สวัสดี, {user.name}</span>

          {/* Admin Button - แสดงเฉพาะ admin */}
          {user.role === 'admin' && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 font-semibold transition"
            >
              ⚙️ Admin
            </button>
          )}

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}

      <div
        onClick={() => setIsCartOpen(true)}
        className="relative cursor-pointer text-4xl hover:scale-110 transition-transform"
      >
        🛒
        {totalItems > 0 && (
          <span className="absolute -top-3 -right-4 bg-yellow-300 text-black font-bold text-sm px-2.5 py-0.5 rounded-full shadow-lg animate-pulse">
            {totalItems}
          </span>
        )}
      </div>

    </div>
  )
}

export default Header