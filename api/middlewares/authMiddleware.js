const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddlerware = asyncHandler( async (req, res, next) =>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ') [1];
        //console.log(token);
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('Admin ID(token): ', decoded);
                const user = await User.findById(decoded?.id);
                req.user = user;
                console.log("Admin Data: ", user);
                next();
            }
        }catch(error){
            throw new Error('Not Authorized! token expired, please Login again')
        }
            
    }else {
        throw new Error('There is not token attachet to header')
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    // console.log('isAdmin: ', req.user);
    const{ email } = req.user;
    console.log('admin email: ', email);
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== 'admin') {
        throw new Error('You are not an Admin')
    }else{
        next();
    }
});

module.exports = { authMiddlerware, isAdmin };