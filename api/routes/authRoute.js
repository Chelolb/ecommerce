const express = require('express');
const { createUser, 
    loginUserCtrl, 
    getAllUser, 
    getUser, 
    deleteUser, 
    updateUser,
    blockUser,
    unblockUser,
    handlerRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken, 
    resetPassword
} = require('../controller/userCtrl');
const { authMiddlerware, isAdmin }  = require('../middlewares/authMiddleware');


const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/forgotpasswordtoken', forgotPasswordToken);
router.put('/resetpassword/:token', resetPassword);
router.put('/password', authMiddlerware, updatePassword);
router.get('/allusers', getAllUser);
router.get('/refresh', handlerRefreshToken);
router.get('/logout', logout)
router.get('/:id', authMiddlerware, isAdmin, getUser);
router.delete('/:id', deleteUser);
router.put('/edituser', authMiddlerware, updateUser);
router.put('/blockuser/:id', authMiddlerware, isAdmin, blockUser);
router.put('/unblockuser/:id', authMiddlerware, isAdmin, unblockUser);


module.exports = router;