import jwt from "jsonwebtoken"

//ตรวจสอบ Token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "No token provided" })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" })
    req.user = decoded
    next()
  })
}

//ตรวจสอบว่าเป็น Admin หรือไม่
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only" })
    }
    next()
  })
}