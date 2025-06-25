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
            max_tokens: 3500,
        });

        console.log('systemContent', systemContent);
        console.log('userContent', userContent);
        console.log('completion.usage', completion.usage);
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
        const model = "gpt-4o";
        const systemContent = `You are a nutritionist expert in creating cooking recipes. 
        Your task is to generate a recipe based on the provided ingredients and customizations. You are allowed to use some or all of the provided ingredients, depending on the needs of the recipe. However, it is strictly forbidden to add any ingredients that are not on the list.
        The recipe must include:
        - A clear and descriptive title.
        - A list of ingredients used, each with quantities.
        - Extremely detailed and easy-to-follow step-by-step preparation instructions that can be executed by a non-expert.
        If any of the provided ingredients are not used, explicitly list them at the end of the response under a section titled "Unused Ingredients".
        `;
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
                'text': 'Identify all the food/ingredientes in the image. Do not include any non-food items. Generate a 5-word description and an array of the found food/ingredients. For each food/ingredient, explicitly mention the quantity found using a numeric value. If the exact quantity is unknown, provide an estimated numeric amount. All quantities must be in numeric format. Strictly respond with a text-plain object having the structure: {"imgDescription": description, "foodFound": []}. Do not provide anything else. Never parse this object into a json object, just return it as plain text. Example: {"imgDescription": "Grocery cart in the store", "foodFound": [ "1 Red Bell Pepper", "1 Broccoli", "2 Wine Bottles", "4 Bananas", ... ]}',
            },
            {
                'type': 'image_url',
                'image_url': {
                    "url": imageUrl,
                },
            }
        ];
        const model = 'gpt-4o';
        const systemContent = `You are an assistant specialized in analyzing images to identify only the food or ingredients visible in them. 
        Do not include any objects, utensils, or non-edible items. Your task is to return a concise five-word description of the image and an array of the identified foods or ingredients, each with a numeric quantity. If the exact quantity is unknown, provide an estimated numeric amount.
        All quantities must be expressed in numeric format.
        You must return the result strictly as a plain text object using the following structure (and nothing else):
        {"imgDescription": "Grocery cart in the store", "foodFound": [ "1 Red Bell Pepper", "1 Broccoli", "2 Wine Bottles", "4 Bananas", "1 Lettuce", "1 Zucchini" ]}.
        Never parse this object into a json object, just return it as plain text.
        `;
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