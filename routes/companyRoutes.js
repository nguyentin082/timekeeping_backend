const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createNewCompany } = require('../controllers/companyController');

// Routes
router.get('/create', createNewCompany);

module.exports = router;
