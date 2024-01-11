require('dotenv').config();

const { generatePrompt } = require("./generatePromptOpenAI");
const OpenAI = require("openai");

// Inicializa OpenAI con la API key desde las variables de entorno
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const apiRequest = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Respira profundo, lee lentamente y piensa paso a paso. Actua como un nutriologo. Debes de ser capaz de hacer una receta unica y exlcusivamente con los ingredientes que te proporcionen. Recuerda que unicamente debes ocupar los ingredientes proporcionados, no debes ocupar otros para las recetas."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-3.5-turbo",
        });

        return completion.choices[0].message.content ?? '';
    } catch (error) {
        return '';
    }
}


const getRecipeOpenAI = async (ingredients = [], cutomizations = {}) => {

    try {
        const prompt = generatePrompt(ingredients, cutomizations);
        const recipe = await apiRequest(prompt);
        if (!recipe) {
            return { ok: false };
        }

        return {
            ok: true,
            msg: 'Recipes retrieved successfully',
            prompt,
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