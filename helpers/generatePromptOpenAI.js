// f' to generate prompts for fields that contains multiple values
const arrayPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;

    for (let [key, value] of Object.entries(preferences)) {
        if (value === "no-preference") continue;
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
    prompt += `\nUse only some of the following ingredients: `;
    prompt += `\n- ${ingredients.join(', ')}`;
    return prompt;

}

const dinersPrompt = (prompt, diners) => {
    if (diners === 0) return prompt;
    const qntDiners = diners === 1 ? 'person' : 'people';
    prompt += `\n- diners: ${diners} ${qntDiners}`;
    return prompt;
}


// f' to generate a full prompt that matches the user preferences - Flexible Version
const createCustomizedPrompt = (ingredients, userPreferences ) => {
    if (Object.keys(userPreferences).length === 0) return prompt;
    const { preferences, preparationTime, nutrition, kitchenForniture } = userPreferences;

    let prompt = `Write a recipe that fits the following preferences: `;
    prompt = arrayPromt(prompt, { ...preferences });
    prompt = numberPromt(prompt, { ...preparationTime });
    prompt = numberPromt(prompt, { ...nutrition });
    prompt = arrayPromt(prompt, { ...kitchenForniture });
    prompt = dinersPrompt(prompt, userPreferences.diners);
    prompt = ingredientsPrompt(prompt, [...ingredients]);

    return prompt;
}

const createBasicPrompt = (ingredients) => {
    let prompt = `Write a recipe `;
    return ingredientsPrompt(prompt, [...ingredients]);
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