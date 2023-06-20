const express = require('express');
const router = express.Router();
const { authMiddlerware, isAdmin } = require('../middlewares/authMiddleware');
const { 
    createCoupon, 
    getallCoupon, 
    updateCoupon,
    deleteCoupon
} = require('../controller/couponCtrl');


router.post('/', authMiddlerware, isAdmin, createCoupon);
router.get('/', authMiddlerware, isAdmin, getallCoupon);
router.put('/:id', authMiddlerware, isAdmin, updateCoupon);
router.delete('/:id', authMiddlerware, isAdmin, deleteCoupon);

module.exports = router;