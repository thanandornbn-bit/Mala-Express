import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const app = express();

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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

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
        const [foods] = await conn.query('SELECT * FROM food');
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
        const [food] = await conn.query('SELECT * FROM food WHERE id = ?', [id]);
        if (food.length > 0) {
            res.json(food[0]);
        } else {
            res.status(404).json({ error: 'Food not found' });
        }
    } catch (err) {
        console.error('Error fetching food:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

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

// เพิ่มอาหารใหม่ (Admin only)
app.post('/foods', verifyAdmin, async (req, res) => {
    try {
        const { name, price, description, image } = req.body;
        const [result] = await conn.query(
            'INSERT INTO food (name, price, description, image) VALUES (?, ?, ?, ?)',
            [name, price, description, image]
        );
        res.status(201).json({
            id: result.insertId,
            name, price, description, image
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
        const { name, price, description, image } = req.body;
        const [result] = await conn.query(
            'UPDATE food SET name = ?, price = ?, description = ?, image = ? WHERE id = ?',
            [name, price, description, image, id]
        );
        if (result.affectedRows > 0) {
            res.json({ id, name, price, description, image });
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
        const [result] = await conn.query('DELETE FROM food WHERE id = ?', [id]);
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


app.listen(port, async () => {
    await initMySQL();
    console.log(`Example app listening on port ${port}`);
});