const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Ensure this path is correct
const { uploadImage } = require('../controllers/imageController');
const fileUploader = require('../configs/cloudinary.config');

// Routes with auth
router.post('/cloudinary-upload', fileUploader.single('file'), uploadImage);

// Export the router
module.exports = router;
