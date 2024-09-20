const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db/db');

// Create new user
const createUser = async (req, res) => {
    try {
        // Check if all fields are provided
        const { name, email, password, date_of_birth, position } = req.body;
        if (!name || !email || !password || !date_of_birth || !position) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if email already exists
        const emailExists = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (emailExists.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        // Hash the password before inserting it into the database
        const hashed_password = await bcrypt.hash(password, 10);
        // Insert the new user into the database
        const result = await db.query(
            'INSERT INTO users (name, email, hashed_password, date_of_birth, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashed_password, date_of_birth, position]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Email and password are required' });
    }
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
            email,
        ]);
        const user = result.rows[0];
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.hashed_password
        );
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '5m',
        });
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '30d' }
        );

        // Lưu refreshToken vào database
        await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [
            refreshToken,
            user.id,
        ]);

        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
            refreshToken,
        });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy id từ auth middleware

        // Xoá refresh token trong database
        await db.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [
            userId,
        ]);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Forget password
const updateForgetPassword = async (req, res) => {
    const { email, new_password } = req.body;
    if (!email || !new_password) {
        return res
            .status(400)
            .json({ message: 'Email and new password are required' });
    }
    try {
        const hashed_password = await bcrypt.hash(new_password, 10);
        const result = await db.query(
            'UPDATE users SET hashed_password = $1 WHERE email = $2 RETURNING *',
            [hashed_password, email]
        );
        if (result.rowCount === 0) {
            return res
                .status(404)
                .json({ message: 'User not found or email does not match' });
        }
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMyInfo = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from JWT by the auth middleware

        const result = await db.query(
            `SELECT 
                users.id,
                users.name,
                users.email,
                users.date_of_birth,
                users.position,
                users.last_status,
                companies.name AS company_name
             FROM users
             LEFT JOIN companies ON users.company_id = companies.id
             WHERE users.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user info:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    try {
        // Verify refreshToken
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

        // Check refreshToken in the database
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1 AND refresh_token = $2',
            [decoded.id, refreshToken]
        );
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new token
        const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '5m', // Consider a longer expiry for the token
        });

        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token: newToken,
            // If you want to rotate the refresh token:
            // refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateForgetPassword,
    getMyInfo,
    getAllUsers,
    refreshToken,
};
