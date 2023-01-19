const customizationOptions = {
    food: {
        mealType: ['no-preference', 'breakfast', 'lunch', 'dinner', 'snack', 'teatime'],
        diet: ['no-preference', 'balanced', 'high-protein', 'high-fiber', 'low-fat', 'low-carb', 'low-sodium', 'low-sugar'],
        specialDiet: ['no-preference', 'gluten-free', 'dairy-free', 'egg-free', 'peanut-free', 'tree-nut-free', 'soy-free', 'fish-free', 'shellfish-free', 'wheat-free', 'paleo', 'primal', 'whole30', 'vegan', 'vegetarian', 'pescatarian'],
        intolerances: ['no-preference', 'dairy', 'egg', 'gluten', 'grain', 'peanut', 'seafood', 'sesame', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat', 'celery', 'mustard', 'sesame', 'sulfite', 'lupine', 'mollusk'],
        foodType: ['no-preference', 'main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'],
        cuisine: ['no-preference', 'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic'],
    },
    time: {
        minReadyTime: 0,
        maxReadyTime: 0,
        minCookTime: 0,
        maxCookTime: 0,
        minPrepTime: 0,
        maxPrepTime: 0,
        minTotalTime: 0,
        maxTotalTime: 0,
    },
    nutrition: {
        minCarbs: 0,
        maxCarbs: 0,
        minFat: 0,
        maxFat: 0,
        minProtein: 0,
        maxProtein: 0,
        minSugar: 0,
        maxSugar: 0,
        minCalories: 0,
        maxCalories: 0,
    },
    specialConsiderations: {
        fornitureAvaliable: ['no-preference', 'oven', 'stove-top', 'slow-cooker', 'blender', 'food-processor', 'spiralizer', 'pressure-cooker', 'instant-pot', 'toaster', 'grill', 'microwave', 'fryer', 'air-fryer', 'deep-fryer', 'wok', 'pan', 'skillet', 'pot', 'baking-sheet', 'baking-pan', 'baking-dish', 'baking-tray', 'baking-rack', 'baking-pot', 'baking-tin', 'baking-mold', 'baking-mould', 'baking-mat', 'baking-cake-pan', 'baking-cake-tin', 'baking-cake-mold', 'baking-cake-mould', 'baking-cake-mat', 'baking-bread-pan', 'baking-bread-tin', 'baking-bread-mold', 'baking-bread-mould', 'baking-bread-mat', 'baking-pie-pan', 'baking-pie-tin', 'baking-pie-mold', 'baking-pie-mould', 'baking-pie-mat', 'baking-muffin-pan', 'baking-muffin-tin', 'baking-muffin-mold', 'baking-muffin-mould', 'baking-muffin-mat', 'baking-cookie-pan', 'baking-cookie-tin', 'baking-cookie-mold', 'baking-cookie-mould', 'baking-cookie-mat', 'baking-cupcake-pan', 'baking-cupcake-tin', 'baking-cupcake-mold', 'baking-cupcake-mould', 'baking-cupcake-mat', 'baking-donut-pan', 'baking-donut-tin', 'baking-donut-mold', 'baking-donut-mould', 'baking-donut-mat', 'baking-cake-stand', 'baking-bread-stand', 'baking-pie-stand', 'baking-muffin-stand', 'baking-cookie-stand', 'baking-cupcake-stand', 'baking-donut-stand'],
        hasDisease: ['no-preference', 'diabetes', 'celiac', 'lactose-intolerance', 'nut-allergy', 'egg-allergy', 'fish-allergy', 'shellfish-allergy', 'soy-allergy', 'wheat-allergy', 'gluten-allergy', 'peanut-allergy', 'tree-nut-allergy', 'sulfite-allergy', 'milk-allergy', 'sesame-allergy', 'mustard-allergy', 'crustacean-allergy', 'mollusk-allergy', 'yeast-allergy', 'alcohol-allergy', 'caffeine-allergy', 'sugar-allergy', 'sodium-allergy', 'potassium-allergy', 'cholesterol-allergy']
    },
    ingredients: {
        includeIngredients: [],
    }
}

// Example of differents selections:
const selection1 = {
    food: {
        specialDiet: 'gluten-free',
        intolerances: 'gluten',
        foodType: 'main course',
    },
    nutrition: {
        maxCalories: 2000,
        maxCarbs: 250,
    },
    specialConsiderations: {
        hasDisease: 'diabetes',
        fornitureAvaliable: ['oven', 'blender', 'microwave'],
    },
    ingredients: {
        includeIngredients: [
            'chicken',
            'broccoli',
            'rice',
            'potato',
            'carrot',
            'onion',
            'garlic',
        ]
    }
}

const selection2 = {
    food: {
        mealType: 'breakfast',
        diet: ['high-protein', 'high-fiber'],
        specialDiet: 'no-preference',
        cuisine: 'mexican',
    },
    time: {
        maxReadyTime: 180,
    },
    specialConsiderations: {
        hasDisease: 'lactose-intolerance'
    },
    ingredients: {
        includeIngredients: [
            'eggs',
            'avocado',
            'tomato',
            'onion',
        ]
    }
};


const arrayPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;

    for (let [key, value] of Object.entries(preferences)) {
        if (value === "no-preference") continue;
        if (Array.isArray(value)) value = value.join(', ');
        prompt += `- ${key}: ${value} \n`;
    }
    return prompt;
}

const numberPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;
    for (let [key, value] of Object.entries(preferences)) {
        if (value === 0) continue;
        prompt += `- ${key}: ${value}\n`;
    }
    return prompt;
}

// function to get a prompt to craete a recipe that fits the considerations
const createRecipePrompt = (prompt, userPreferences) => {

    // if no preferences are selected, return the prompt
    if (Object.keys(userPreferences).length === 0) return prompt;

    // for userPreferences.food and userPreferences.specialConsiderations use arrayPromt
    // for userPreferences.nutrition and userPreferences.time use numberPromt
    prompt = arrayPromt(prompt, { ...userPreferences.food });
    prompt = numberPromt(prompt, { ...userPreferences.time });
    prompt = numberPromt(prompt, { ...userPreferences.nutrition });
    prompt = arrayPromt(prompt, { ...userPreferences.specialConsiderations });

    return prompt;
}

// test functions
console.clear();

let prompt = '';

prompt = "Write a recipe that fits the following preferences: \n";
console.log('\n**********************************************************');
const finalPrompt1 = createRecipePrompt(prompt, selection1);
console.log('\tFinal Prompt of user1:\n', finalPrompt1);
console.log('\n**********************************************************');

prompt = "Write a recipe that fits the following preferences: \n";
console.log('\n**********************************************************');
const finalPrompt2 = createRecipePrompt(prompt, selection2);
console.log('\tFinal Prompt of user2:\n', finalPrompt2);
console.log('\n**********************************************************');