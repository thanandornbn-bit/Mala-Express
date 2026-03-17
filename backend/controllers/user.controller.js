import { getDB } from '../config/db.js';

export const getUsers = async (req, res) => {
    const conn = getDB();
    const [rows] = await conn.query('SELECT * FROM user');
    res.json(rows);
};

export const getUserById = async (req, res) => {
    const conn = getDB();
    const [rows] = await conn.query(
        'SELECT * FROM user WHERE id = ?',
        [req.params.id]
    );

    if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
};

export const createUser = async (req, res) => {
    const conn = getDB();
    const [result] = await conn.query(
        'INSERT INTO user SET ?',
        req.body
    );

    res.json({ id: result.insertId });
};

export const updateUser = async (req, res) => {
    const conn = getDB();
    const { name, email } = req.body;

    await conn.query(
        'UPDATE user SET name=?, email=? WHERE id=?',
        [name, email, req.params.id]
    );

    res.json({ message: 'updated' });
};

export const deleteUser = async (req, res) => {
    const conn = getDB();

    await conn.query(
        'DELETE FROM user WHERE id=?',
        [req.params.id]
    );

    res.json({ message: 'deleted' });
};