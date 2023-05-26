const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Verify token valid
const authMiddlerware = asyncHandler( async (req, res, next) =>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ') [1];
        //console.log(`User's Token: ${token}`);
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log(`User's ID: ${decoded}`);
                const user = await User.findById(decoded?.id);
                req.user = user;
                console.log(`User's Data: ${user}`);
                next();
            }
        }catch(error){
            throw new Error('Not Authorized! token expired, please Login again')
        }
            
    }else {
        throw new Error('There is not token attachet to header')
    }
});

// Verify if is Admin
const isAdmin = asyncHandler(async (req, res, next) => {
    const{ email } = req.user;
    console.log(`User's email: ${email}`);
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== 'admin') {
        throw new Error('You are not an Admin')
    }else{
        next();
    }
});

module.exports = { authMiddlerware, isAdmin };