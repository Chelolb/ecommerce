const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs')

const multerStorage = multer.diskStorage({ // Path and Name temp. image
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"))
    },
    filename: function (req, file, cb) {
        uniqueSuffix = Date.now() + "-" + Math.round((Math.random) * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {   // Test file's type
    if(file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(
            {
                message:"Unsupported file format"
            },
            false
        );
    }
};

const uploadPhoto = multer({ //  client sent file Manager
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 },
});


const productImgResize = async (req, res, next) => { // Resize Product's image
    if(!req.files) return next();
    await Promise.all(
        req.files.map( async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(`public/images/products${file.filename}`);
            fs.unlinkSync(`public/images/products${file.filename}`);
        })
    );
    next();
};


const blogImgResize = async (req, res, next) => { // Resize Product's image
    if(!req.files) return next();
    await Promise.all(
        req.files.map( async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(`public/images/blogs${file.filename}`);
            fs.unlinkSync(`public/images/blogs${file.filename}`);
        })
    );
    next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };