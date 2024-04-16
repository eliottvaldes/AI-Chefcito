// f' to generate prompts for fields that contains multiple values
const arrayPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;

    for (let [key, value] of Object.entries(preferences)) {
        if (value === "sin-preferencia") continue;
        if (Array.isArray(value)) value = value.join(', ');
        prompt += `\n- ${key}: ${value}`;
    }
    return prompt;
}

// f' to generate prompts for fields that contains number values
const numberPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;
    for (let [key, value] of Object.entries(preferences)) {
        if (value === 0) continue;
        prompt += `\n- ${key}: ${value}`;
    }
    return prompt;
}

// f' to generate prompts for fields that contains ingredients
const ingredientsPrompt = (prompt, ingredients) => {
    if (ingredients.length === 0) return prompt;
    prompt += `\nLimitate estrictamente a usar únicamente todos o algunos de los siguientes ingredientes: `;
    prompt += `\n- ${ingredients.join(', ')}`;
    return prompt;

}

const dinersPrompt = (prompt, diners) => {
    if (diners === 0) return prompt;
    const qntDiners = diners === 1 ? 'persona' : 'personas';
    prompt += `\n- Cantidad de comensales: ${diners} ${qntDiners}`;
    return prompt;
}


// f' to generate a full prompt that matches the user preferences - Flexible Version
const createCustomizedPrompt = (ingredients, userPreferences ) => {
    if (Object.keys(userPreferences).length === 0) return prompt;
    const { preferences, preparationTime, nutrition, kitchenForniture } = userPreferences;
    let prompt = `Escribe una receta que cumpla estrictamente con las siguientes preferencias: `;
    prompt = arrayPromt(prompt, { ...preferences });
    prompt = numberPromt(prompt, { ...preparationTime });
    prompt = numberPromt(prompt, { ...nutrition });
    prompt = arrayPromt(prompt, { ...kitchenForniture });
    prompt = dinersPrompt(prompt, userPreferences.diners);
    prompt = ingredientsPrompt(prompt, [...ingredients]);
    prompt += '\n\nLa receta debe ser clara y concisa. Debe de mostrar los ingredientes ocupados y el procedimiento extendido de preparación.';

    return prompt;
}

const createBasicPrompt = (ingredients) => {
    let prompt = `Escribe una receta de cocina `;
    prompt += ingredientsPrompt(prompt, [...ingredients]);
    prompt += '\n\nLa receta debe ser clara y concisa. Debe de mostrar los ingredientes ocupados y el procedimiento extendido de preparación.';
    return prompt;
}


const generatePrompt = (ingredients = [], customizations = {}) => {

    if (!customizations || Object.keys(customizations).length === 0) {
        return createBasicPrompt(ingredients);
    }
    return createCustomizedPrompt(ingredients, customizations);
}

module.exports = {
    generatePrompt
}