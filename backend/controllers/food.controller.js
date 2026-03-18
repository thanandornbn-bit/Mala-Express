import { getConnection } from "../config/db.js"

export const getFoods = async (req, res) => {
  const pool = getConnection()
  const [foods] = await pool.query("SELECT * FROM foods")
  res.json(foods)
}

export const getFoodById = async (req, res) => {
  const pool = getConnection()
  const [food] = await pool.query(
    "SELECT * FROM foods WHERE id=?",
    [req.params.id]
  )
  if (!food.length) return res.status(404).json({ error: "Not found" })
  res.json(food[0])
}

export const createFood = async (req, res) => {
  const pool = getConnection()
  const { foodName, foodImage, foodType, foodAmount, foodPrice } = req.body
  const [result] = await pool.query(
    "INSERT INTO foods (foodName,foodImage,foodType,foodAmount,foodPrice) VALUES (?,?,?,?,?)",
    [foodName, foodImage, foodType, foodAmount, foodPrice]
  )
  res.json({ id: result.insertId })
}

export const updateFood = async (req, res) => {
  const pool = getConnection()
  const { foodName, foodImage, foodType, foodAmount, foodPrice } = req.body
  await pool.query(
    "UPDATE foods SET foodName=?,foodImage=?,foodType=?,foodAmount=?,foodPrice=? WHERE id=?",
    [foodName, foodImage, foodType, foodAmount, foodPrice, req.params.id]
  )
  res.json({ message: "Updated" })
}

export const deleteFood = async (req, res) => {
  const pool = getConnection()
  await pool.query("DELETE FROM foods WHERE id=?", [req.params.id])
  res.json({ message: "Deleted" })
}