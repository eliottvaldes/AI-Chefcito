const { request, response } = require("express");

// import cloudinary package
const cloudinary = require('cloudinary').v2
// configure cloudinary account
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadImage = async (req = request, res = response) => {
    const { fileUpload } = req.files;

    if (!fileUpload) {
        return res.status(400).json({
            ok: false,
            msg: 'No image file found'
        });
    }

    try {
        const { tempFilePath } = req.files.fileUpload;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        return res.status(201).json({
            ok: true,
            msg: 'Image uploaded successfully',
            url: secure_url
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'There was an error while upload the image'
        });
    }

}

const analizaImage = (req = request, res = response) => {

}


module.exports = {
    uploadImage,
    analizaImage
}