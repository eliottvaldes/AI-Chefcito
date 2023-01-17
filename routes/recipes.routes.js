const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validateFields');

const { getRecipes } = require('../controllers/recipes.controller');

const router = Router();

// Define all recipes-routes
router.get('/',
    [
        check('ingredients', 'Ingredients are required').not().isEmpty(),
        validateFields
    ]
    , getRecipes);


module.exports = router;