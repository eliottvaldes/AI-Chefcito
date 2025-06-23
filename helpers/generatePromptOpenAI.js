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
    prompt += `\nYou must use only the ingredients provided below. You can use some or all of them according to the recipe, but it is strictly forbidden to add any ingredients not listed.`;
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

    let prompt = `Write a recipe that strictly fits the following preferences without adding any extra information. Respond with the recipe's name, ingredients, and instructions to prepare it.`;
    prompt = arrayPromt(prompt, { ...preferences });
    prompt = numberPromt(prompt, { ...preparationTime });
    prompt = numberPromt(prompt, { ...nutrition });
    prompt = arrayPromt(prompt, { ...kitchenForniture });
    prompt = dinersPrompt(prompt, userPreferences.diners);
    prompt = ingredientsPrompt(prompt, [...ingredients]);

    return prompt;
}

const createBasicPrompt = (ingredients) => {
    let prompt = `Write a recipe strictly using only the ingredients provided without adding any extra ingredients or information. Respond with the recipe's name, ingredients, and instructions to prepare it.`;
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