const jwt = require('jsonwebtoken');
const db = require('../db/db');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token || !token.startsWith('Bearer ')) {
            return res
                .status(401)
                .send({ error: 'Authorization token is required or invalid.' });
        }

        const cleanToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET_KEY);

        const result = await db.query('SELECT * FROM users WHERE id = $1', [
            decoded.id,
        ]);
        const user = result.rows[0];
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = cleanToken;
        next();
    } catch (error) {
        res.status(401).send({
            error: error.message || 'Please authenticate.',
        });
    }
};

module.exports = auth;
