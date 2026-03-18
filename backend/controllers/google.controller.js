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

    if (!user.length) {
      const [result] = await conn.query(
        "INSERT INTO user (username,email,password) VALUES (?,?,?)",
        [payload.name, payload.email, "google_login"]
      )
      userId = result.insertId
    } else {
      userId = user[0].id
    }

    const tokenJWT = jwt.sign(
      { id: userId, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token: tokenJWT })

  } catch (err) {
    res.status(401).json({ error: "Google login failed" })
  }
}