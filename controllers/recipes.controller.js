const { request, response } = require("express");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const getRecipes = async (req = request, res = response) => {

    const { ingredients = [] } = req.body;
    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No ingredients provided'
        });
    }

    if (!configuration.apiKey) {
        return res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
    }

    let prompt = `Write a recipe strictly based on these ingredients and give the instructions:\nIngredients:\n-${ingredients.join('\n-')}`;

    try {
        const recipe = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 1,
            max_tokens: 400,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        return res.status(200).json({
            ok: true,
            msg: 'Recipes retrieved successfully',
            prompt,
            result: recipe.data.choices[0].text
        });


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error while trying to get recipes',
            error
        });
    }


}


module.exports = {
    getRecipes
}