import jwt from 'jsonwebtoken';
const secretKey = import.meta.env.VITE_JWT_SECRET;

// สร้าง JWT
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log("Generated JWT Token: ", token);