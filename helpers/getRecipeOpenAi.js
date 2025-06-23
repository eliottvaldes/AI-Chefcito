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
            max_tokens: 1500,
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
        const model = "gpt-4.1-mini";
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
                'text': 'Identify all the foods in the image. Generate a 5-word description and an array of the found foods. For each food, explicitly mention the quantity found using a numeric value. If the exact quantity is unknown, provide an estimated numeric amount. All quantities must be in numeric format. Strictly respond with an object having the structure: {"imgDescription": description, "foodFound": []}. Do not provide anything else but the object in plain text format. Example: {"imgDescription": "Grocery cart in the store", "foodFound": [ "1 Red Bell Pepper", "1 Broccoli", "2 Wine Bottles", "4 Bananas", ... ]}',
            },
            {
                'type': 'image_url',
                'image_url': {
                    "url": imageUrl,
                },
            }
        ];
        const model = 'gpt-4o';
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