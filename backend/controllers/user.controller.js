import { getConnection } from "../config/db.js"

//ดึง User ทั้งหมด
export const getAllUsers = async (req, res) => {
  try {
    const pool = getConnection()
    const [users] = await pool.query("SELECT * FROM user")
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
}

//ดึง User โดย ID
export const getUserById = async (req, res) => {
  const pool = getConnection()
  const [user] = await pool.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id]
  )
  if (!user.length) return res.status(404).json({ error: "User not found" })
  res.json(user[0])
}

//สร้าง User
export const createUser = async (req, res) => {
  const pool = getConnection()
  const [result] = await pool.query("INSERT INTO user SET ?", req.body)
  res.json({ id: result.insertId })
}

//อัพเดท User
export const updateUser = async (req, res) => {
  const pool = getConnection()
  await pool.query(
    "UPDATE user SET name=?, email=? WHERE id=?",
    [req.body.name, req.body.email, req.params.id]
  )
  res.json({ message: "Updated successfully" })
}

//ลบ User จาก ID
export const deleteUser = async (req, res) => {
  const pool = getConnection()
  await pool.query("DELETE FROM user WHERE id=?", [req.params.id])
  res.json({ message: "Deleted successfully" })
}

//ลบ User ทั้งหมด
export const deleteAllUsers = async (req, res) => {
  const pool = getConnection()
  await pool.query("DELETE FROM user")
  res.json({ message: "All users deleted successfully" })
}