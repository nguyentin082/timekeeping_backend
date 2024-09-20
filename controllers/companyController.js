require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const createNewCompany = async (req, res) => {
    try {
        // Extract company name from the request body
        const { name } = req.body;

        // Validate the input
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'Invalid company name' });
        }

        // Insert the company into the database
        const result = await db.query(
            'INSERT INTO companies (name) VALUES ($1) RETURNING *',
            [name]
        );

        // Get the inserted company details
        const newCompany = result.rows[0];

        // Respond with the newly created company
        res.status(201).json({
            message: 'Company created successfully',
            company: newCompany,
        });
    } catch (error) {
        // Handle any errors
        console.error('Error creating company:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createNewCompany };
