import { getConnection } from "../config/db.js"

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

export const getUserById = async (req, res) => {
  const pool = getConnection()
  const [user] = await pool.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id]
  )
  if (!user.length) return res.status(404).json({ error: "User not found" })
  res.json(user[0])
}

export const createUser = async (req, res) => {
  const pool = getConnection()
  const [result] = await pool.query("INSERT INTO user SET ?", req.body)
  res.json({ id: result.insertId })
}

export const updateUser = async (req, res) => {
  const pool = getConnection()
  await pool.query(
    "UPDATE user SET name=?, email=? WHERE id=?",
    [req.body.name, req.body.email, req.params.id]
  )
  res.json({ message: "Updated successfully" })
}

export const deleteUser = async (req, res) => {
  const pool = getConnection()
  await pool.query("DELETE FROM user WHERE id=?", [req.params.id])
  res.json({ message: "Deleted successfully" })
}