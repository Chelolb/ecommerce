const Coupon = require ('../models/couponModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');

// create coupon
const createCoupon = asyncHandler ( async (req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    }
    catch (error){
        throw new Error (error);
    }
})

// get all coupon
const getallCoupon = asyncHandler ( async (req, res) => {
    try{
        const coupons = await Coupon.find();
        res.json(coupons);
    }
    catch (error){
        throw new Error (error);
    }
})

// update coupon
const updateCoupon = asyncHandler ( async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatecoupon);
    }
    catch (error){
        throw new Error (error);
    }
})

// update coupon
const deleteCoupon = asyncHandler ( async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    }
    catch (error){
        throw new Error (error);
    }
})

module.exports = { 
    createCoupon, 
    getallCoupon,
    updateCoupon,
    deleteCoupon };