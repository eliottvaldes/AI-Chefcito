const { request, response } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { azureAnalyzeImage } = require('../helpers/analyzeImageAzure');
const { validateCategories, validateTags, validateAdultContent } = require('../helpers/validateAnalysis');
const { getFoodObjects } = require("../helpers/getImageObjects");
const { getIngredientsOpenAI } = require("../helpers/getRecipeOpenAi");


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

    const { categories, adult, description, objects } = response.data;

    const isValidAdultContent = validateAdultContent(adult);
    if (!isValidAdultContent) {
        return res.status(400).json({
            ok: false,
            msg: 'USER HAS BEEN BLOCKED - The image contains adult content'
        });
    }

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

    const imgDescription = description.captions[0].text ?? 'No description found';

    res.status(200).json({
        ok: true,
        msg: 'Image analyzed successfully',
        imgDescription,
        foodFound
    });


}

const analyzeImageOpenAI = async (req = request, res = response) => {

    const { image } = req.body;

    if (!image) {
        return res.status(400).json({
            ok: false,
            msg: 'No image url found'
        });
    }

    const response = await getIngredientsOpenAI(image);

    if (!response.ok) {
        return res.status(400).json({
            ok: false,
            msg: 'There was an error while image analysis'
        });
    }

    /* 
    // test data
    const response = {
        ok: true,
        msg: 'Recipes retrieved successfully',
        data: '{"imgDescription": "Variety fresh colorful food", "foodFound": ["watermelon", "banana", "pineapple", "strawberries", "melon", "pomegranate", "plum", "lemon", "bread", "pasta", "chicken breast", "steak", "fish", "cheese", "ham", "milk", "blackberries", "tomato", "green bell pepper", "onion", "potato", "carrot", "broccoli", "red cabbage", "green beans", "red bell pepper"]}'
    }     
    */

    const { imgDescription, foodFound } = parseJSONToObject(response.data);

    res.status(200).json({
        ok: true,
        msg: 'Image analyzed successfully',
        imgDescription,
        foodFound,
    });
}


const parseJSONToObject = (jsonString) => {
    try {
        const parsedObject = JSON.parse(jsonString);
        return parsedObject;
    } catch (error) {
        console.error('Error al parsear JSON:', error);
        return jsonString;
    }
}

module.exports = {
    uploadImage,
    analizaImage,
    analyzeImageOpenAI
}