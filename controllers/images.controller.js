const { request, response } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { azureAnalyzeImage } = require('../helpers/analyzeImageAzure');
const { validateCategories, validateTags } = require('../helpers/validateAnalysis');
const { getFoodObjects } = require("../helpers/getImageObjects");


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

    // call to azure analyze image
    const response = await azureAnalyzeImage({ ...req.body });

    if (!response.ok) {
        return res.status(400).json({
            ok: false,
            msg: 'There was an error while image analysis'
        });
    }

    // validate if the image contains category food
    const { categories, description, objects } = response.data;

    // const isValidCategory = validateCategories(categories);
    // const isValidteTag = validateTags(description);    
    // if (!isValidCategory && !isValidteTag) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'The image does not contain food - categories/tags'
    //     });
    // }

    const foodFound = getFoodObjects(objects);

    if (!foodFound.length) {
        return res.status(200).json({
            ok: false,
            msg: 'The image does not contain food - objects'
        });
    }

    res.status(200).json({
        ok: true,
        msg: 'Image analyzed successfully',
        foodFound
    });


}


module.exports = {
    uploadImage,
    analizaImage
}