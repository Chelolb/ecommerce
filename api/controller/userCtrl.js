const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

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

const loginUserCtrl = asyncHandler(async (req, res) => {
    const{ email, password } = req.body;
    console.log( email, password);

})
module.exports = { createUser, loginUserCtrl };