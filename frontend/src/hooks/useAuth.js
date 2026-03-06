import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

function useAuth() {

  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (!token) return

    try {

      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      // ⛔ token หมดอายุ
      if (decoded.exp < currentTime) {
        logout()
      }

      // ⏳ ตั้งเวลา logout อัตโนมัติ
      const timeLeft = (decoded.exp - currentTime) * 1000

      const timer = setTimeout(() => {
        logout()
      }, timeLeft)

      return () => clearTimeout(timer)

    } catch (err) {
      console.error(err)
      logout()
    }

  }, [])

  return { user, logout, setUser }
}

export default useAuth