const express = require('express');
const router = express.Router();
const {
    getMyTimekeepingInfo,
    addTimekeepingRecord,
} = require('../controllers/timekeepingController');
const auth = require('../middlewares/auth'); // Ensure this path is correct

// Routes with auth
router.get('/', auth, getMyTimekeepingInfo);
router.post('/', auth, addTimekeepingRecord);

// Export the router
module.exports = router;
