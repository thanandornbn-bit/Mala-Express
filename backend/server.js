import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import foodRoutes from "./routes/food.routes.js"
import googleRoutes from "./routes/google.routes.js"

import { initMySQL } from "./config/db.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())

app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/foods", foodRoutes)
app.use("/api/google", googleRoutes)

const PORT = 3000

app.listen(PORT, async () => {
  await initMySQL()
  console.log(`Server running on port ${PORT}`)
})