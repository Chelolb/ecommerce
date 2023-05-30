const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwToken');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('./emailCtrl');

// create user
const createUser = asyncHandler(async (req, res) =>{     
    const email = req.body.email;

    const findUser = await User.findOne({email: email});
    if(!findUser) { // create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else{ // user already exists
        throw new Error('User Allready Exists')
    }
})

// login user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const{ email, password } = req.body;
    // check if user exist
    const findUser = await User.findOne({email: email});
    if(findUser && ( await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, {new:true}
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }else{
        throw new Error('Invalid Credencials');
    }
})

// handler refresh token
const handlerRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    //console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error('No Refresh Token in DB or not matched');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error('There is something wrong with refresh token')
        }
        const accessToken = generateToken(user?.id);
        res.json({accessToken});
    })
    //res.json(user);
})

// Logout user
const logout = asyncHandler( async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);  // forbidden
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);  // forbidden
})


// Update user
const updateUser = asyncHandler(async (req, res) =>{     
    const { _id } = req.user;
    //console.log( `userUpdate'_id: ${_id}`)
    validateMongodbId(_id);
    // const { id }  = req.user;  
    // console.log('update user: ', id)
    try{
    const updatedUser = await User.findByIdAndUpdate(_id, 
        {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,   
        },
        {new: true}
    );
    res.json(updatedUser);
    } catch(error){ 
        throw new Error(error);
    }
})

// Get all users
const getAllUser = asyncHandler(async (req, res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
})

// Get single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //console.log('User ID: ', id);
    validateMongodbId(id);
    try{
        const getaUser = await User.findById(id);
        res.json(getaUser);
    }catch(error){
        throw new Error(error);
    }
})

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    validateMongodbId(id);
    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json(deleteaUser);
    }catch(error){
        throw new Error(error);
    }
})

// Block User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, 
            { 
                isBlocked: true, 
            }, 
            { 
                new: true
            }
        );
        res.json(
            {Message: 'User Blocked'}
        );
    }catch (error){
        throw new Error('error');
    }
})

// Unblock User
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, 
            { 
                isBlocked: false,
            }, 
            { new: true }
        );
        res.json(
            {Message: 'User Unblocked'}
        );
    }catch (error){
        throw new Error('error');
    }    
})

// Update user's password
const updatePassword = asyncHandler (async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    // console.log(`User's ID= ${_id}, new password= ${password}`);
    validateMongodbId (_id);
    const user = await User.findById(_id);
    // console.log(`User's Data= ${user}`);
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }else{
        res.json(user);
    }
});

// 
const forgotPasswordToken = asyncHandler (async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) throw new Error('User not found with this email');
    console.log(user);
    try{
        const token = await user.createPasswordResetToken();
        console.log(`token: ${token}`)
        await user.save();
        const resetURL = `Hi, please follow this link to reset Your Password. This link is valid till 10 min from now. <a href='http://localhost:5000/api/user/resetpassword/${token}'>Click Here</>`
        const data = {
            to: email,
            text: "Hey, User",
            subject: "Forgot Password Link",
            htm: resetURL,
        }
        sendEmail(data);
        res.json(token);
    }catch(error) {
        throw new Error(error);
    }
});

//
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

module.exports = { 
    createUser, 
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
    resetPassword };