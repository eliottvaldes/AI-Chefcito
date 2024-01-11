require('dotenv').config();

const { generatePrompt } = require("./generatePromptOpenAI");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const apiRequest = async (model, systemContent, userContent) => {
    try {
        const completion = await openai.chat.completions.create({
            model,
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
            max_tokens: 600,
        });

        console.log(completion.usage);
        console.log(completion.choices[0]);

        return completion.choices[0].message.content ?? '';
    } catch (error) {
        console.log(`Error in apiRequest(): ${error}`);
        return '';
    }
}


const getRecipeOpenAI = async (ingredients = [], cutomizations = {}) => {

    try {
        const userContent = generatePrompt(ingredients, cutomizations);
        const model = "gpt-3.5-turbo";
        const systemContent = "You are a nutritionist expert in creating recipes for cooking.";
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



// Función para obtener los ingredientes de una imagen
const getIngredientsOpenAI = async (imageUrl) => {
    try {
        //const base64Image = await encodeImage(imageUrl);
        const userContent = [
            {
                'type': 'text',
                'text': 'Identify all the foods in the image. Generate a 5-word description and an array of the found foods. Strictly respond with an object having the structure: {"imgDescription": description, "foodFound": []}. Do not provide anything else but the object in plain text format.'
            },
            {
                'type': 'image_url',
                'image_url': {
                    "url": imageUrl,
                },
            }
        ];
        const model = 'gpt-4-vision-preview';
        const systemContent = 'You are a valuable assistant specialized in analyzing food images.';
        let ingredients = await apiRequest(model, systemContent, userContent);
        if (!ingredients) {
            return { ok: false };
        }

        return {
            ok: true,
            data: ingredients
        };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
};

module.exports = {
    getRecipeOpenAI,
    getIngredientsOpenAI,
}