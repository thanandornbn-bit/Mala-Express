import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getConnection } from "../config/db.js"

//login
export const login = async (req, res) => {
    const { username, password } = req.body
    const pool = getConnection()

    const [user] = await pool.query(
        "SELECT * FROM user WHERE username = ?",
        [username]
    )

    if (!user.length)
        return res.status(401).json({ error: "Invalid credentials" })

    const valid = await bcrypt.compare(password, user[0].password)
    if (!valid)
        return res.status(401).json({ error: "Invalid credentials" })

    const token = jwt.sign(
        {
            id: user[0].id,
            email: user[0].email,
            role: user[0].role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )

    res.json({ 
        token,
        user: {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role
        }
    })
}

//register
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        const pool = getConnection()

        if (!username || !email || !password || !role) {
            return res.status(400).json({
                error: "Please provide username email and password"
            })
        }

        // เช็ค email ซ้ำ
        const [existing] = await pool.query(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, role]
        );

        res.status(201).json({ message: "Register successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};