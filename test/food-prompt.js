// create a function that returns a prompt to create a recipe based on the different user's preferences
const customizationOptions = {
    food: {
        mealType: ['no-preference', 'breakfast', 'lunch', 'dinner', 'snack', 'teatime'],
        diet: ['no-preference', 'balanced', 'high-protein', 'high-fiber', 'low-fat', 'low-carb', 'low-sodium', 'low-sugar'],
        specialDiet: ['no-preference', 'gluten-free', 'dairy-free', 'egg-free', 'peanut-free', 'tree-nut-free', 'soy-free', 'fish-free', 'shellfish-free', 'wheat-free', 'paleo', 'primal', 'whole30', 'vegan', 'vegetarian', 'pescatarian'],
        intolerances: ['no-preference', 'dairy', 'egg', 'gluten', 'grain', 'peanut', 'seafood', 'sesame', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat', 'celery', 'mustard', 'sesame', 'sulfite', 'lupine', 'mollusk'],
        foodType: ['no-preference', 'main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'],
        cuisine: ['no-preference', 'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic'],
    }
}
const testUserPreference1 = {
    food: {
        specialDiet: 'gluten-free',
        intolerances: ['gluten', 'egg', 'peanut'],
        foodType: 'main course',
    }
}

const testUserPreference2 = {
    food: {
        mealType: 'breakfast',
        diet: ['high-protein', 'high-fiber'],
        specialDiet: 'no-preference',
        cuisine: 'mexican',
    }
}


function createRecipePrompt(userPreferences) {
    let prompt = ''
    for (const [key, value] of Object.entries(userPreferences.food)) {
        if (value === "no-preference") continue;

        if (key === 'diet') {
            if (Array.isArray(value)) {
                prompt += `- ${key}: ${value.join(' and ')} \n`;
                continue;
            }
            prompt += `- ${key}: ${value} \n`;

            continue;

        }
        if (key === 'specialDiet') {
            if (Array.isArray(value)) {
                prompt += `- ${key}: ${value.join(' and ')} \n`;
                continue;
            }
            prompt += `- ${key}: ${value} \n`;
            continue;
        }

        if (key === 'intolerances') {
            if (Array.isArray(value)) {
                prompt += `- ${key}: ${value.join(' and ')} \n`;
                continue;
            }
            prompt += `- ${key}: ${value} \n`;
            continue;
        }
        prompt += `- ${key}: ${value} \n`;

    }
    return prompt;
}


function createRecipePromptOptimized(userPreferences) {
    let prompt = "Please create a recipe that fits the following preferences: \n";
    for (let [key, value] of Object.entries(userPreferences.food)) {
        if (value === "no-preference") continue;
        if (Array.isArray(value)) value = value.join(', ');
        prompt += `- ${key}: ${value} \n`;
    }
    return prompt;
}



// test functions
console.clear();

console.log('\n*************************************')
console.log('createRecipePrompt: ');
console.log(createRecipePrompt(testUserPreference1));
console.log(createRecipePrompt(testUserPreference2));

console.log('\n*************************************')
console.log('createRecipePrompt Optimized: ');
console.log(createRecipePromptOptimized(testUserPreference1));
console.log(createRecipePromptOptimized(testUserPreference2));