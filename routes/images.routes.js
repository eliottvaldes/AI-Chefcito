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

router.post('/analyze',
    [
        check('image', 'Image is required').not().isEmpty(),
        check('image', 'Image url must be valid').isURL(),
        validateFields
    ]
    , analizaImage);



module.exports = router;