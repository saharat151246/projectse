import { useState } from "react"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    try {

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Login failed")
        setLoading(false)
        return
      }

      // save token
      localStorage.setItem("token", data.token)

      // save user
      localStorage.setItem("user", JSON.stringify(data.user))

      // reload page
      if (data.user.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }

    } catch (err) {
      console.error(err)
      setError("Server error")
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF0FF" }}>

      <form
        onSubmit={handleLogin}
        style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(51,55,169,0.12)", width: "380px", border: "1px solid rgba(51,55,169,0.1)" }}
      >

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔐</div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#1e1e2e" }}>เข้าสู่ระบบ</h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>ยินดีต้อนรับกลับมา</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>อีเมล</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>รหัสผ่าน</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", background: loading ? "#9196d4" : "#3337A9", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(51,55,169,0.35)", transition: "all 0.2s" }}
        >
          {loading ? "⏳ กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          ยังไม่มีบัญชี? <a href="/register" style={{ color: "#3337A9", fontWeight: 600, textDecoration: "none" }}>สมัครสมาชิก</a>
        </p>

      </form>

    </div>
  )
}

export default Login