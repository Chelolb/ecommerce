const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

// Send Email to User
const sendEmail = asyncHandler ( async (data, req, res) => {
    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // host email server
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_ID, // email user
            pass: process.env.EMAIL_PASS, // email password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Hey 👻" <marcelolitwin@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
});

module.exports = sendEmail;

//https://www.youtube.com/watch?v=Zr2pqmyCgTQ  (Use and config nodemailer)
//https://www.youtube.com/watch?v=uVDq4VOBMNM ( Secure Password for app nodemailer)