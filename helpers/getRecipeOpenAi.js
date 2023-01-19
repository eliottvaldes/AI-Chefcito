const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});



const getRecipeOpenAI = async (ingredients = [], cutomizations = {}) => {

    try {
        const openai = new OpenAIApi(configuration);

        const prompt = generatePropmt(ingredients, cutomizations);

        const { data } = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 1,
            max_tokens: 400,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        return {
            ok: true,
            msg: 'Recipes retrieved successfully',
            prompt,
            result: data.choices[0].text
        }


    } catch (error) {
        return {ok: false};
    }


}


const generatePropmt = (ingredients = [], customizations = {}) => {

    // TODO: Add customizations to prompt

    return `Write a recipe strictly based on these ingredients and give the instructions:\nIngredients:\n-${ingredients.join('\n-')}`;
}

module.exports = {
    getRecipeOpenAI
}