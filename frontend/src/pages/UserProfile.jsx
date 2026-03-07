import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Masked email helper
function maskEmail(email = "") {
  const [local, domain] = email.split("@")
  if (!domain) return email
  return local.slice(0, 1) + "•••••" + local.slice(-1) + "@" + domain
}

// Masked phone helper
function maskPhone(phone = "") {
  if (!phone) return "ตั้งค่า"
  return "•••••••" + phone.slice(-2)
}

// Profile Row
function ProfileRow({ label, value, placeholder = "ตั้งค่า", onClick, highlight }) {
  return (
    <button onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "white", border: "none", borderBottom: "1px solid #f3f4f6", width: "100%", cursor: "pointer", textAlign: "left" }}>
      <span style={{ fontSize: "16px", color: "#1f2937", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: "15px", color: value ? "#6b7280" : (highlight ? "#3337A9" : "#9ca3af"), display: "flex", alignItems: "center", gap: "6px" }}>
        {value || placeholder}
        <span style={{ color: "#9ca3af", fontSize: "12px" }}>›</span>
      </span>
    </button>
  )
}

// Edit Field Modal
function EditModal({ label, currentValue, type = "text", options, onClose, onSave }) {
  const [val, setVal] = useState(currentValue || "")
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "28px 24px", width: "100%", maxWidth: "480px", boxShadow: "0 -8px 32px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>แก้ไข {label}</h3>
        {options ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {options.map(opt => (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", border: `2px solid ${val === opt.value ? "#3337A9" : "#e5e7eb"}`, background: val === opt.value ? "#f0f1ff" : "white", cursor: "pointer" }}>
                <input type="radio" name="option" value={opt.value} checked={val === opt.value} onChange={() => setVal(opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        ) : (
          <input type={type} value={val} onChange={e => setVal(e.target.value)} placeholder={`กรอก${label}`}
            style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "12px 16px", fontSize: "16px", outline: "none", marginBottom: "24px" }}
          />
        )}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "#f3f4f6", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "15px" }}>ยกเลิก</button>
          <button onClick={() => onSave(val)} style={{ flex: 1, padding: "13px", background: "#3337A9", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>บันทึก</button>
        </div>
      </div>
    </div>
  )
}

// Add Address Modal
function AddAddressModal({ onClose, onSave }) {
  const [form, setForm] = useState({ label: "บ้าน", name: "", phone: "", address: "" })
  const [phoneError, setPhoneError] = useState("")
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inputStyle = { width: "100%", boxSizing: "border-box", border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "11px 14px", fontSize: "15px", outline: "none", marginBottom: "10px" }

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10)
    set("phone", val)
    if (val.length > 0 && val.length < 10) setPhoneError("เบอร์โทรต้องครบ 10 หลัก")
    else setPhoneError("")
  }

  const handleSave = () => {
    if (!form.name || !form.phone || !form.address) { setPhoneError(!form.phone ? "กรุณากรอกเบอร์โทร" : phoneError); return }
    if (form.phone.length !== 10) { setPhoneError("เบอร์โทรต้องครบ 10 หลัก"); return }
    onSave(form)
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "28px 24px", width: "100%", maxWidth: "480px", boxShadow: "0 -8px 32px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>➕ เพิ่มที่อยู่ใหม่</h3>

        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {["บ้าน", "ที่ทำงาน", "อื่นๆ"].map(l => (
            <button key={l} onClick={() => set("label", l)}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `2px solid ${form.label === l ? "#3337A9" : "#e5e7eb"}`, background: form.label === l ? "#f0f1ff" : "white", fontWeight: 600, cursor: "pointer", fontSize: "13px", color: form.label === l ? "#3337A9" : "#6b7280" }}
            >{l}</button>
          ))}
        </div>

        <input placeholder="ชื่อ-นามสกุล *" value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} />

        <input
          placeholder="เบอร์โทร * (10 หลัก)"
          value={form.phone}
          onChange={handlePhoneChange}
          inputMode="numeric"
          maxLength={10}
          style={{ ...inputStyle, border: `1.5px solid ${phoneError ? "#ef4444" : "#e5e7eb"}`, marginBottom: phoneError ? "4px" : "10px" }}
        />
        {phoneError && (
          <p style={{ color: "#ef4444", fontSize: "12px", margin: "0 0 10px 4px" }}>⚠️ {phoneError}</p>
        )}
        {!phoneError && form.phone.length > 0 && form.phone.length === 10 && (
          <p style={{ color: "#10b981", fontSize: "12px", margin: "-6px 0 10px 4px" }}>✅ เบอร์โทรถูกต้อง</p>
        )}

        <textarea placeholder="ที่อยู่จัดส่ง *" value={form.address} onChange={e => set("address", e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" }} />

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", background: "#f3f4f6", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "15px" }}>ยกเลิก</button>
          <button
            onClick={handleSave}
            style={{ flex: 1, padding: "13px", background: "#3337A9", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}
          >บันทึก</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function UserProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editField, setEditField] = useState(null)
  const [showAddAddr, setShowAddAddr] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000) }

  const token = () => localStorage.getItem("token")

  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, addrRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/profile`, { headers: { Authorization: `Bearer ${token()}` } }),
          axios.get(`${API_URL}/api/auth/addresses`, { headers: { Authorization: `Bearer ${token()}` } })
        ])
        setProfile(profRes.data)
        setAddresses(addrRes.data)
      } catch (err) {
        // Only redirect to login if actually unauthorized
        if (err.response?.status === 401 || !token()) {
          navigate("/login")
        } else {
          showToast("โหลดข้อมูลล้มเหลว กรุณาลองใหม่")
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const handleSaveField = async (value) => {
    if (!editField) return
    try {
      const updated = { ...profile, [editField.field]: value }
      const res = await axios.put(`${API_URL}/api/auth/profile`, updated, { headers: { Authorization: `Bearer ${token()}` } })
      setProfile(res.data.user)
      if (editField.field === "name") {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...storedUser, name: value }))
      }
      showToast("บันทึกสำเร็จ ✅")
    } catch { showToast("เกิดข้อผิดพลาด ❌") }
    setEditField(null)
  }

  const handleAddAddress = async (form) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/addresses`, form, { headers: { Authorization: `Bearer ${token()}` } })
      setAddresses(res.data.addresses)
      setShowAddAddr(false)
      showToast("เพิ่มที่อยู่สำเร็จ ✅")
    } catch { showToast("เกิดข้อผิดพลาด ❌") }
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("ต้องการลบที่อยู่นี้?")) return
    try {
      const res = await axios.delete(`${API_URL}/api/auth/addresses/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
      setAddresses(res.data.addresses)
      showToast("ลบที่อยู่แล้ว")
    } catch { showToast("เกิดข้อผิดพลาด ❌") }
  }

  const genderLabel = { male: "ชาย", female: "หญิง", other: "อื่นๆ" }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontSize: "18px", color: "#9ca3af" }}>⏳ กำลังโหลด...</div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif", paddingBottom: "40px" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", background: "#1f2937", color: "white", padding: "12px 24px", borderRadius: "50px", fontSize: "14px", fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "white", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#3337A9" }}>←</button>
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>โปรไฟล์ของฉัน</h1>
      </div>

      {/* Avatar */}
      <div style={{ background: "white", margin: "16px", borderRadius: "16px", padding: "32px 20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg, #3337A9, #6366f1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: "white", marginBottom: "12px" }}>
          {profile?.name?.charAt(0)?.toUpperCase() || "👤"}
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: 800, color: "#1f2937" }}>{profile?.name}</p>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#9ca3af" }}>{profile?.email}</p>
      </div>

      {/* ข้อมูลส่วนตัว */}
      <div style={{ margin: "0 16px 16px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ background: "#f9fafb", padding: "10px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>ข้อมูลส่วนตัว</p>
        </div>
        <ProfileRow label="ชื่อ" value={profile?.name} onClick={() => setEditField({ field: "name", label: "ชื่อ" })} />
        <ProfileRow label="ประวัติ" value={profile?.bio} onClick={() => setEditField({ field: "bio", label: "ประวัติ" })} />
        <ProfileRow label="เพศ" value={genderLabel[profile?.gender] || ""} placeholder="ตั้งค่า" highlight={!profile?.gender}
          onClick={() => setEditField({ field: "gender", label: "เพศ", options: [{ value: "male", label: "♂ ชาย" }, { value: "female", label: "♀ หญิง" }, { value: "other", label: "⚧ อื่นๆ" }] })} />
        <ProfileRow label="วันเกิด" value={profile?.birthday} placeholder="ตั้งค่า" highlight={!profile?.birthday}
          onClick={() => setEditField({ field: "birthday", label: "วันเกิด", type: "date" })} />
      </div>

      {/* ข้อมูลติดต่อ */}
      <div style={{ margin: "0 16px 16px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ background: "#f9fafb", padding: "10px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>ข้อมูลติดต่อ</p>
        </div>
        <ProfileRow label="โทรศัพท์" value={maskPhone(profile?.phone)} onClick={() => setEditField({ field: "phone", label: "เบอร์โทรศัพท์", type: "tel" })} />
        <ProfileRow label="อีเมล" value={maskEmail(profile?.email)} onClick={() => {}} />
      </div>

      {/* ที่อยู่ที่บันทึกไว้ */}
      <div style={{ margin: "0 16px 16px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ background: "#f9fafb", padding: "10px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>📍 ที่อยู่ที่บันทึกไว้</p>
          <button onClick={() => setShowAddAddr(true)} style={{ background: "#3337A9", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ เพิ่ม</button>
        </div>

        {addresses.length === 0 ? (
          <div style={{ background: "white", padding: "24px 20px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
            ยังไม่มีที่อยู่ที่บันทึกไว้<br />
            <button onClick={() => setShowAddAddr(true)} style={{ marginTop: "8px", background: "none", border: "1.5px dashed #3337A9", color: "#3337A9", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
              + เพิ่มที่อยู่แรก
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr._id} style={{ background: "white", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ background: "#f0f1ff", color: "#3337A9", borderRadius: "6px", padding: "2px 10px", fontSize: "12px", fontWeight: 700, marginBottom: "8px", display: "inline-block" }}>
                  {addr.label || "บ้าน"}
                </span>
                <p style={{ margin: "6px 0 2px 0", fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>{addr.name}</p>
                <p style={{ margin: "0 0 2px 0", fontSize: "13px", color: "#6b7280" }}>{addr.phone}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{addr.address}</p>
              </div>
              <button onClick={() => handleDeleteAddress(addr._id)}
                style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}>
                ลบ
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {editField && <EditModal {...editField} currentValue={profile?.[editField.field]} onClose={() => setEditField(null)} onSave={handleSaveField} />}
      {showAddAddr && <AddAddressModal onClose={() => setShowAddAddr(false)} onSave={handleAddAddress} />}
    </div>
  )
}
