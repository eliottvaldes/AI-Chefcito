const { Configuration, OpenAIApi } = require("openai");
const { generatePrompt } = require("./generatePromptOpenAI");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});



const getRecipeOpenAI = async (ingredients = [], cutomizations = {}) => {

    try {
        const openai = new OpenAIApi(configuration);
        const prompt = generatePrompt(ingredients, cutomizations);        
        const { data } = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 1,
            max_tokens: 500,
            top_p: 8.0,
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


module.exports = {
    getRecipeOpenAI
}