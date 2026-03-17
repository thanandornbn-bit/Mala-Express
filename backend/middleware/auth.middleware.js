import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key_here';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        next();
    });
};