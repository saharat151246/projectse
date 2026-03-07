import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!name || !email || !password) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      setLoading(false)
      return
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        setLoading(false)
        return
      }

      alert("สมัครสมาชิกสำเร็จ 🎉")
      navigate("/login")

    } catch (err) {
      console.error(err)
      alert("Server error")
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF0FF" }}>

      <form
        onSubmit={handleRegister}
        style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(51,55,169,0.12)", width: "380px", border: "1px solid rgba(51,55,169,0.1)" }}
      >

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📝</div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#1e1e2e" }}>สมัครสมาชิก</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>สร้างบัญชีใหม่เพื่อเริ่มต้น</p>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>ชื่อ-นามสกุล</label>
          <input
            placeholder="กรอกชื่อของคุณ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>อีเมล</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
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
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", background: loading ? "#9196d4" : "#3337A9", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(51,55,169,0.35)" }}
        >
          {loading ? "⏳ กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          มีบัญชีอยู่แล้ว? <a href="/login" style={{ color: "#3337A9", fontWeight: 600, textDecoration: "none" }}>เข้าสู่ระบบ</a>
        </p>

      </form>

    </div>
  )
}

export default Register