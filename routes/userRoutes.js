const express = require('express');
const router = express.Router();
const {
    createUser,
    loginUser,
    logoutUser,
    updateForgetPassword,
    getMyInfo,
    getAllUsers,
    refreshToken,
} = require('../controllers/userController');

const auth = require('../middlewares/auth');

// Routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/update-password', updateForgetPassword);
router.post('/refresh-token', refreshToken);

// Routes with auth
router.get('/my-info', auth, getMyInfo);
router.get('/users', auth, getAllUsers);
router.post('/logout', auth, logoutUser);

module.exports = router;
