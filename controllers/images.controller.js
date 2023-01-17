const { request, response } = require("express");
const axios = require('axios');

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

const analizaImage = async (req = request, res = response) => {

    // call to azure analize image
    const response = await azureAnalizeImage({ ...req.body });

    if (!response.ok) {
        return res.status(400).json({
            ok: false,
            msg: 'There was an error while analize the image'
        });
    }

    res.status(200).json({
        ok: true,
        msg: 'Image analized successfully',
        data: response.data
    });


}


const azureAnalizeImage = async (bodyRequest) => {

    const { image, description, objects } = bodyRequest;
    let urlRequest = `${process.env.AZURE_CS_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Categories,`;

    description ? urlRequest += 'Description,' : null;
    objects ? urlRequest += 'Objects,' : null;

    const body = { "url": image };

    const response = await axios.post(urlRequest, body, {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_CS_KEY
        }
    }).then((response) => {
        return {
            ok: true,
            data: response.data
        }
    }).catch((error) => {
        return { ok: false };
    });

    return response;

}



module.exports = {
    uploadImage,
    analizaImage
}