const express = require('express');
const { register,
    regenerateOtp,
    verifyOtp,
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
    google,

} = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/checkAuth', verifyToken, checkAuth)

router.post('/register', register);
router.post('/google', google);

router.post('/regenerateOtp', regenerateOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);




module.exports = router;