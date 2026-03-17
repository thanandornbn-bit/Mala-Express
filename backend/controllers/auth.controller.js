import { getDB } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key_here';

export const login = async (req, res) => {
    const conn = getDB();
    const { username, password } = req.body;

    const [user] = await conn.query(
        'SELECT * FROM user WHERE username = ?',
        [username]
    );

    if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid' });
    }

    const valid = await bcrypt.compare(password, user[0].password);

    if (!valid) {
        return res.status(401).json({ error: 'Invalid' });
    }

    const token = jwt.sign(
        { id: user[0].id },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token });
};