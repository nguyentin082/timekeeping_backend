require('dotenv').config();
const cloudinary = require('cloudinary').v2; // Ensure Cloudinary is imported

// Save an image to the database to Cloudinary
const uploadImage = async (req, res, next) => {
    // Check image file
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }

    try {
        const { formattedDate, formattedTime, userEmail, status } = req.body;
        if (!formattedDate || !formattedTime || !userEmail || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const reFormattedDate = formattedDate.replace(/\//g, '-');
        const reFormattedTime = formattedTime.replace(/:/g, '-');

        // Upload to Cloudinary and specify a folder
        const result = await cloudinary.uploader.upload(req.file.path, {
            // public_id: req.body.imageName,
            // Custom filename with Date.Now in Vietnamese format
            public_id: `${userEmail}_${reFormattedTime}_${reFormattedDate}_${status}`,
            folder: 'TimeKeeping_App', // Replace with your Cloudinary folder name
        });

        // Return the secure URL of the uploaded image
        res.json({ secure_url: result.secure_url });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage,
};
