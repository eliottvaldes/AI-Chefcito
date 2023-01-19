const { request, response } = require("express");
const { getRecipeOpenAI } = require("../helpers/getRecipeOpenAi");


const getRecipes = async (req = request, res = response) => {

    const { ingredients = [] } = req.body;

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No ingredients provided'
        });
    }


    const recipe = await getRecipeOpenAI(ingredients);

    if (!recipe.ok) {
        return res.status(400).json({
            ok: false,
            msg: 'Error trying to get recipes from OpenAI',
        });
    }

    return res.status(200).json(recipe);

}

const getCustomRecipes = async (req = request, res = response) => {

    const { ingredients = [], customizations = {} } = req.body;


    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No ingredients provided'
        });
    }

    if (!customizations || Object.keys(customizations).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No customizations provided'
        });
    }    

    return res.status(200).json(
        ingredients,
        customizations
    );
}

module.exports = {
    getRecipes,
    getCustomRecipes
}