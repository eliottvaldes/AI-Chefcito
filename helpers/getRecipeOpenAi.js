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



// Función para obtener los ingredientes de una imagen
const getIngredientsOpenAI = async (imageUrl) => {
    try {
        //const base64Image = await encodeImage(imageUrl);
        const userContent = [
            {
                'type': 'text',
                'text': 'Identifica todos los alimentos que hay en la imagen. Genera una descripción de 5 palabras y un arreglo de los alimentos encontrados. responde estrictamente con un objeto que tenga la estructura: {"imgDescription": description, "foodFound": []}. No respondas nada más que el objeto pero en formato de texto plano.'
            },
            {
                'type': 'image_url',
                'image_url': {
                    "url": imageUrl,
                },
            }
        ];
        const model = 'gpt-4-vision-preview';
        const systemContent = 'Eres un valioso asistente especializado en analizar imagenes de comida.';
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