const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validateFields');
const { validateFileToUpload } = require('../middlewares/validateFile');

const {
    uploadImage,
    analizaImage
} = require('../controllers/images.controller');

const router = Router();

// Define all images-routes
router.put('/upload',
    [
        validateFileToUpload,
        validateFields
    ]
    , uploadImage);

router.get('/analize',
    [
        validateFields
    ]
    , analizaImage);



module.exports = router;