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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h1 className="text-2xl font-bold mb-6 text-center">
          สมัครสมาชิก
        </h1>

        <input
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-5"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

      </form>

    </div>
  )
}

export default Register