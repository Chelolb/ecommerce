const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.ClOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
})

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolver) => {
        cloudinary.uploader.upload(fileToUploads, (result) =>{
            resolver(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: 'auto',
                }

            )
        })
    })
}

module.exports = cloudinaryUploadImg;