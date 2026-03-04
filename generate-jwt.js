import jwt from 'jsonwebtoken';

const payload = {
  username: "admin",  // ใส่ชื่อผู้ใช้ที่ต้องการ
  password: "admin1234"  // ใส่รหัสผ่านที่ต้องการแปลงเป็น JWT
};

const secretKey = "mysecretkey";  // รหัสลับ (secret key) ใช้ในการเข้ารหัส

// สร้าง JWT
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log("Generated JWT Token: ", token);