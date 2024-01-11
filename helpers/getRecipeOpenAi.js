require('dotenv').config();

const { generatePrompt } = require("./generatePromptOpenAI");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const apiRequest = async (model, systemContent, userContent) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemContent
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
            model,
        });

        return completion.choices[0].message.content ?? '';
    } catch (error) {
        return '';
    }
}


const getRecipeOpenAI = async (ingredients = [], cutomizations = {}) => {

    try {
        const userContent = generatePrompt(ingredients, cutomizations);
        const model = "gpt-3.5-turbo";
        const systemContent = "Respira profundo, lee lentamente y piensa paso a paso. Actua como un nutriologo. Debes de ser capaz de hacer una receta unica y exlcusivamente con los ingredientes que te proporcionen. Recuerda que unicamente debes ocupar los ingredientes proporcionados, no debes ocupar otros para las recetas.";
        const recipe = await apiRequest(model, systemContent, userContent);
        if (!recipe) {
            return { ok: false };
        }

        return {
            ok: true,
            msg: 'Recipes retrieved successfully',
            prompt: userContent,
            result: recipe
        }

    } catch (error) {
        console.log(error);
        return { ok: false };
    }

}


module.exports = {
    getRecipeOpenAI
}