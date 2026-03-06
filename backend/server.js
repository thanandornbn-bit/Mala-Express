import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const app = express();
const client = new OAuth2Client("252649899378-e14ag845u9jq1ljeo2ggjj1mg038lj43.apps.googleusercontent.com");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('page'));
const port = 3000;
const JWT_SECRET = 'your_jwt_secret_key_here'; // แนะนำให้เก็บใน .env
let conn = null;

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'malaexpress',
        port: 3306
    });
}

//Middleware

// Middleware ตรวจสอบว่าเป็น Admin
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Middleware ตรวจสอบ token 
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// ========== USER QUERY ==========

// ดึงข้อมูล
app.get('/user', async (req, res) => {
    const result = await conn.query('SELECT * FROM user');
    res.json(result[0]);
})

app.post('/user', async (req, res) => {
    try {
        let user = req.body
        const [results] = await conn.query('INSERT INTO user SET ?', user)
        res.json({
            message: "User created successfully",
            data: results
        })
    } catch (err) {
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        })
    }
})
// แก้ไขข้อมูล
app.put('/user/:id', async (req, res) => {
    try {
        const { name, email } = req.body;
        const id = req.params.id;
        const result = await conn.query('UPDATE user SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        res.json({ id, name, email });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ดึงข้อมูลโดย id
app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const [results] = await conn.query('SELECT * FROM user WHERE id = ?', id);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//delete user   
app.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await conn.query('DELETE FROM user WHERE id = ?', id);
        if (result[0].affectedRows > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//update user   
app.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email } = req.body;
        const result = await conn.query('UPDATE user SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        if (result[0].affectedRows > 0) {
            res.json({ id, name, email });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ========== AUTH ENDPOINTS ==========

// Register
app.post('/register', async (req, res) => {
    try {
        const { username, email, password} = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบ
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Please provide username, email, and password'
            });
        }

        // ตรวจสอบว่า username หรือ email ซ้ำ
        const [existingUser] = await conn.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                error: 'Username or email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // บันทึกลงฐานข้อมูล
        const [result] = await conn.query(
            'INSERT INTO user (username, email,password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบ
        if (!username || !password) {
            return res.status(400).json({error: 'Please provide username and password' });
        }

        // หาผู้ใช้ในฐานข้อมูล
        const [user] = await conn.query('SELECT * FROM user WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // ตรวจสอบ password
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // สร้าง JWT token
        const token = jwt.sign(
            { id: user[0].id, username: user[0].username, email: user[0].email},
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email,
                role: user[0].role
            }
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ตัวอย่าง protected route - ต้องมี token
app.get('/profile', verifyToken, async (req, res) => {
    try {
        const [user] = await conn.query('SELECT id, username, email FROM user WHERE id = ?', [req.user.id]);
        res.json(user[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ========== FOOD ENDPOINTS ==========

// ดึงรายการอาหารทั้งหมด
app.get('/foods', async (req, res) => {
    try {
        const [foods] = await conn.query('SELECT * FROM foods');
        res.json(foods);
    } catch (err) {
        console.error('Error fetching foods:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ดึงอาหารตาม ID
app.get('/foods/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [foods] = await conn.query('SELECT * FROM foods WHERE id = ?', [id]);
        if (foods.length > 0) {
            res.json(foods[0]);
        } else {
            res.status(404).json({ error: 'Food not found' });
        }
    } catch (err) {
        console.error('Error fetching food:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// เพิ่มอาหารใหม่ (Admin only)
app.post('/foods', verifyAdmin, async (req, res) => {
    try {
        const { foodName, foodImage, foodType, foodAmount, foodPrice } = req.body;
        const [result] = await conn.query(
            'INSERT INTO foods (foodName, foodImage, foodType, foodAmount, foodPrice) VALUES (?, ?, ?, ?, ?)',
            [foodName, foodImage, foodType, foodAmount, foodPrice]
        );
        res.status(201).json({
            id: result.insertId,
            foodName, foodImage, foodType, foodAmount, foodPrice
        });
    } catch (err) {
        console.error('Error adding food:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// แก้ไขอาหาร (Admin only)
app.put('/foods/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { foodName, foodImage, foodType, foodAmount, foodPrice } = req.body;
        const [result] = await conn.query(
            'UPDATE foods SET foodName = ?, foodImage = ? , foodType= ? , foodAmount = ? , foodPrice = ? WHERE id = ?',
            [foodName, foodImage, foodType, foodAmount, foodPrice, id]
        );
        if (result.affectedRows > 0) {
            res.json({ id, foodName, foodImage, foodType, foodAmount, foodPrice});
        } else {
            res.status(404).json({ error: 'Food not found' });
        }
    } catch (err) {
        console.error('Error updating food:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// ลบอาหาร (Admin only)
app.delete('/foods/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conn.query('DELETE FROM foods WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Food deleted successfully' });
        } else {
            res.status(404).json({ error: 'Food not found' });
        }
    } catch (err) {
        console.error('Error deleting food:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//************API GOOGLE************//

app.post('/google-login', async (req, res) => {
    try {

        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "252649899378-e14ag845u9jq1ljeo2ggjj1mg038lj43.apps.googleusercontent.com"
        });

        const payload = ticket.getPayload();

        const email = payload.email;
        const name = payload.name;

        // ตรวจสอบว่ามี user ใน DB หรือยัง
        const [user] = await conn.query('SELECT * FROM user WHERE email = ?', [email]);

        let userId;

        if (user.length === 0) {

            // ถ้ายังไม่มี user ให้สร้างใหม่
            const [result] = await conn.query(
                'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
                [name, email, 'google_login']
            );

            userId = result.insertId;

        } else {
            userId = user[0].id;
        }

        // สร้าง JWT
        const jwtToken = jwt.sign(
            { id: userId, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: "Google login success",
            token: jwtToken,
            user: {
                id: userId,
                email,
                username: name,
                role: user[0]?.role || "user"
            }
        });

    } catch (err) {

        console.error(err);

        res.status(401).json({
            error: "Google login failed"
        });

    }
});


app.listen(port, async () => {
    await initMySQL();
    console.log(`Example app listening on port ${port}`);
});