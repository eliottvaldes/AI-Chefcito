const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validateFields');

const { getRecipes, getCustomRecipes } = require('../controllers/recipes.controller');

const router = Router();

// Define all recipes-routes
router.post('/',
    [
        check('ingredients', 'Ingredients are required').not().isEmpty(),
        validateFields
    ]
    , getRecipes);

router.post('/custom',
    [
        check('ingredients', 'Ingredients are required').not().isEmpty(),
        check('customizations', 'Customizations are required').not().isEmpty(),
        validateFields
    ]
    , getCustomRecipes);


module.exports = router;