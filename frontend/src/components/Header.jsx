import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"

function Header({ totalItems, searchTerm, setSearchTerm, setIsCartOpen, user, logout }) {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="header-wrap">

      {/* Logo */}
      <div className="header-logo" onClick={() => navigate("/")}>🥬 Fresh GO</div>

      {/* Search — hidden on small mobile, shown on tablet+ */}
      <div className="header-search rsp-hide-mobile" style={{ display: "block" }}>
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right side actions */}
      <div className="header-actions">

        {/* Not logged in */}
        {!user && (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.5)", color: "white", padding: "8px 14px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" }}
            >เข้าสู่ระบบ</button>
            <button
              onClick={() => navigate("/register")}
              className="rsp-hide-mobile"
              style={{ background: "white", border: "none", color: "#3337A9", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px", display: "block" }}
            >สมัครสมาชิก</button>
          </>
        )}

        {/* Logged in */}
        {user && (
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ color: "white", fontWeight: 600, fontSize: "13px", cursor: "pointer", padding: "7px 10px", borderRadius: "8px", background: isDropdownOpen ? "rgba(255,255,255,0.15)" : "transparent", whiteSpace: "nowrap", maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              👤 {user.name} ▾
            </div>

            {isDropdownOpen && (
              <div style={{ position: "absolute", top: "120%", right: 0, background: "white", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", overflow: "hidden", minWidth: "170px", zIndex: 300, display: "flex", flexDirection: "column" }}>
                {[
                  { label: "👤 โปรไฟล์ของฉัน", path: "/profile", color: "#3337A9" },
                  { label: "📦 ประวัติการสั่งซื้อ", path: "/orders", color: "#3337A9" },
                ].map(item => (
                  <button key={item.path}
                    onClick={() => { setIsDropdownOpen(false); navigate(item.path) }}
                    style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: "1px solid #f3f4f6", textAlign: "left", fontSize: "14px", fontWeight: 600, color: item.color, cursor: "pointer" }}
                    onMouseOver={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                  >{item.label}</button>
                ))}
                <button
                  onClick={() => { setIsDropdownOpen(false); logout() }}
                  style={{ padding: "12px 20px", background: "transparent", border: "none", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#ef4444", cursor: "pointer" }}
                  onMouseOver={e => e.currentTarget.style.background = "#fee2e2"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}
                >🚪 ออกจากระบบ</button>
              </div>
            )}
          </div>
        )}

        {/* Admin button */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", color: "white", padding: "7px 12px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap" }}
          >⚙️ Admin</button>
        )}

        {/* Cart */}
        {(!user || user.role !== "admin") && (
          <div onClick={() => setIsCartOpen(true)} style={{ position: "relative", cursor: "pointer", fontSize: "26px", flexShrink: 0 }}>
            🛒
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-12px", background: "#facc15", color: "#1e1e2e", fontWeight: 700, fontSize: "11px", padding: "2px 6px", borderRadius: "50px" }}>
                {totalItems}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mobile search row - shows below header on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-search-row { display: flex !important; }
        }
      `}</style>
      <div className="mobile-search-row" style={{ display: "none", position: "absolute", top: "100%", left: 0, right: 0, padding: "8px 14px", background: "#3337A9", borderTop: "1px solid rgba(255,255,255,0.1)", zIndex: 199 }}>
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "9px 18px", borderRadius: "50px", border: "none", fontSize: "14px", outline: "none", background: "white", color: "#1f2937" }}
        />
      </div>

    </div>
  )
}

export default Header