require('dotenv').config();
const db = require('../db/db');

// Get my timekeeping information
const getMyTimekeepingInfo = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM timekeeping WHERE user_id = $1',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new timekeeping entry
const addTimekeepingRecord = async (req, res) => {
    const { status, date, time, location, imageURL } = req.body; // Image data from request
    console.log(status, date, time, location, imageURL);

    // Check if all required fields are provided
    if (!status || !date || !time || !location || !imageURL) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO timekeeping (status, date, time, location, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [status, date, time, location, imageURL, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMyTimekeepingInfo,
    addTimekeepingRecord,
};
