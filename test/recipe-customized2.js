const mealOptions = {
    preferences: {
        mealTime: [
            'no-preference', 'breakfast', 'lunch', 'dinner', 'snack', 'teatime'
        ],
        cuisine: [
            'no-preference', 'african', 'chinese', 'japanese', 'korean', 'vietnamese',
            'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish',
            'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic'
        ],
        diet: [
            'no-preference', 'balanced', 'high-protein', 'high-fiber', 'low-fat',
            'low-carb', 'low-sodium', 'low-sugar'
        ],
        mealType: [
            'no-preference', 'main course', 'side dish', 'dessert', 'appetizer',
            'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood',
            'snack', 'drink'
        ],
    },
    preparationTime: {
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
    kitchenForniture: {
        kitchenResources: [
            'no-preference', 'oven', 'blender', 'microwave', 'toaster', 'grill', 'griddle',
            'fryer', 'pressure cooker', 'slow cooker', 'food processor', 'juicer', 'spiralizer', 'coffee maker',
            'waffle maker', 'ice cream maker', 'stand mixer', 'hand mixer', 'food dehydrator', 'food scale',
            'measuring cups', 'measuring spoons', 'thermometer', 'colander', 'strainer', 'spatula', 'whisk',
            'peeler', 'can opener', 'bottle opener', 'corkscrew', 'ladle', 'tongs', 'masher', 'grater', 'zester',
            'sieve', 'chopper', 'slicer', 'knife', 'cutting board'
        ]

    },
    ingredient: [],
    diners: 1,
}

// Function to generate prompts for fields that contains multiple values
const arrayPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;

    for (let [key, value] of Object.entries(preferences)) {
        if (value === "no-preference") continue;
        if (Array.isArray(value)) value = value.join(', ');
        prompt += `\n- ${key}: ${value}`;
    }
    return prompt;
}

// Function to generate prompts for fields that contains number values
const numberPromt = (prompt, preferences) => {
    if (Object.keys(preferences).length === 0) return prompt;
    for (let [key, value] of Object.entries(preferences)) {
        if (value === 0) continue;
        prompt += `\n- ${key}: ${value}`;
    }
    return prompt;
}

// Function to generate prompts for fields that contains ingredients
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


// Function to generate a full prompt that matches the user preferences - Flexible Version
const createFlexiblePrompt = (prompt, userPreferences) => {
    if (Object.keys(userPreferences).length === 0) return prompt;
    const { preferences, preparationTime, nutrition, kitchenForniture, ingredients } = userPreferences;

    prompt = arrayPromt(prompt, { ...preferences });
    prompt = numberPromt(prompt, { ...preparationTime });
    prompt = numberPromt(prompt, { ...nutrition });
    prompt = arrayPromt(prompt, { ...kitchenForniture });
    prompt = dinersPrompt(prompt, userPreferences.diners);
    prompt = ingredientsPrompt(prompt, [...ingredients]);

    return prompt;
}


// Function to generate a full prompt that matches the user preferences - Strict Version
const createStrictPrompt = (userPreferences) => {
    const { preferences, preparationTime, nutrition, kitchenForniture, ingredients } = userPreferences;
    prompt = `Write a ${preferences.cuisine} ${preferences.mealTime} ${preferences.diet} ${preferences.mealType} recipe using ${ingredients} considering: `;
    prompt = numberPromt(prompt, { ...preparationTime });
    prompt = numberPromt(prompt, { ...nutrition });
    prompt = ingredientsPrompt(prompt, [...ingredients]);

    return prompt;
}


// example of user preferences
const user1 = {
    preferences: {
        mealTime: 'breakfast',
        cuisine: 'american',
        diet: ['balanced', 'low-carb', 'free-gluten'],
        mealType: 'main course',
    },
    preparationTime: {
        maxReadyTime: 80,
    },
    nutrition: {
        maxCalories: 500
    },
    kitchenForniture: {
        kitchenResources: ['oven'],
    },
    ingredients: ['eggs', 'bacon', 'milk', 'cheese'],
    diners: 2,
}

const user2 = {
    preferences: {
        mealTime: 'dinner',
        cuisine: 'italian',
        diet: 'low-carb',
        mealType: 'main course',
    },
    preparationTime: {
        maxPrepTime: 60
    },
    nutrition: {
        maxCalories: 500,
        maxFat: 20,
    },
    kitchenForniture: {
        kitchenResources: ['oven', 'microwave', 'blender', 'food processor'],
    },
    ingredients: ['eggs', 'bacon', 'milk', 'cheese'],
    diners: 1,
}




// Flexible Version
prompt = 'Write a recipe that fits the following preferences: ';
const prompt1 = createFlexiblePrompt(prompt, user1);
prompt = 'Write a recipe that fits the following preferences: ';
const prompt2 = createFlexiblePrompt(prompt, user2);

// Strict Version
const prompt3 = createStrictPrompt(user1);
const prompt4 = createStrictPrompt(user2);


console.clear();
console.log('\n***Prompt 1 - User 1: (Flexible Version)***');
console.log(prompt1);
console.log('\n***Prompt 2 - User 2: (Flexible Version)***');
console.log(prompt2);
console.log('\n***Prompt 3 - User 1: (Strict Version)***');
console.log(prompt3);
console.log('\n***Prompt 4 - User 2: (Strict Version)***');
console.log(prompt4);