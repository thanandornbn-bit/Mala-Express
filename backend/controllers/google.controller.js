import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import { getConnection } from "../config/db.js"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const conn = getConnection()

    const [user] = await conn.query(
      "SELECT * FROM user WHERE email=?",
      [payload.email]
    )

    let userId
    let username
    let userRole

    if (!user.length) {
      const [result] = await conn.query(
        "INSERT INTO user (username,email,password,role) VALUES (?,?,?,?)",
        [payload.name, payload.email, "google_login", "user"]
      )
      userId = result.insertId
      username = payload.name
      userRole = "user"
    } else {
      userId = user[0].id
      username = user[0].username
      userRole = user[0].role || "user"
    }

    const tokenJWT = jwt.sign(
      { id: userId, email: payload.email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ 
      token: tokenJWT,
      user: {
        id: userId,
        username: username,
        email: payload.email,
        role: userRole
      }
    })

  } catch (err) {
    res.status(401).json({ error: "Google login failed" })
  }
}