const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Ensure this file exists and is named correctly
const timekeepingRoutes = require('./routes/timekeepingRoutes'); // Ensure this file exists and is named correctly
const companyRoutes = require('./routes/companyRoutes'); // Ensure this file exists and is named correctly
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use user-related routes
app.use('/user', userRoutes);

// Use timekeeping-related routes
app.use('/timekeeping', timekeepingRoutes);

// Use company routes
app.use('/company', companyRoutes);

// Use image routes
app.use('/image', imageRoutes);

const port = process.env.PORT || 3000; // Allow port to be set from environment variables
app.listen(port, function (error) {
    if (error) {
        console.log('Error occurred: ' + error);
    } else {
        console.log('Server is running on port: ' + port);
    }
});
