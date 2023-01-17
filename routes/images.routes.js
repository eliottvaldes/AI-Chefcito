const { Router } = require('express');

const { 
    uploadImage,
    analizaImage
} = require('../controllers/images.controller');

const router = Router();

// Define all images-routes
router.put('/upload', uploadImage);
router.get('/analize', analizaImage );



module.exports = router;