// Create a function in javascript that return a optimized prompt to create a recipe based on diferent types of selections.
const customizationOptions = {
    specialConsiderations: {
        fornitureAvaliable: ['no-preference', 'oven', 'stove-top', 'slow-cooker', 'blender', 'food-processor', 'spiralizer', 'pressure-cooker', 'instant-pot', 'toaster', 'grill', 'microwave', 'fryer', 'air-fryer', 'deep-fryer', 'wok', 'pan', 'skillet', 'pot', 'baking-sheet', 'baking-pan', 'baking-dish', 'baking-tray', 'baking-rack', 'baking-pot', 'baking-tin', 'baking-mold', 'baking-mould', 'baking-mat', 'baking-cake-pan', 'baking-cake-tin', 'baking-cake-mold', 'baking-cake-mould', 'baking-cake-mat', 'baking-bread-pan', 'baking-bread-tin', 'baking-bread-mold', 'baking-bread-mould', 'baking-bread-mat', 'baking-pie-pan', 'baking-pie-tin', 'baking-pie-mold', 'baking-pie-mould', 'baking-pie-mat', 'baking-muffin-pan', 'baking-muffin-tin', 'baking-muffin-mold', 'baking-muffin-mould', 'baking-muffin-mat', 'baking-cookie-pan', 'baking-cookie-tin', 'baking-cookie-mold', 'baking-cookie-mould', 'baking-cookie-mat', 'baking-cupcake-pan', 'baking-cupcake-tin', 'baking-cupcake-mold', 'baking-cupcake-mould', 'baking-cupcake-mat', 'baking-donut-pan', 'baking-donut-tin', 'baking-donut-mold', 'baking-donut-mould', 'baking-donut-mat', 'baking-cake-stand', 'baking-bread-stand', 'baking-pie-stand', 'baking-muffin-stand', 'baking-cookie-stand', 'baking-cupcake-stand', 'baking-donut-stand'],
        hasDisease: ['no-preference', 'diabetes', 'celiac', 'lactose-intolerance', 'nut-allergy', 'egg-allergy', 'fish-allergy', 'shellfish-allergy', 'soy-allergy', 'wheat-allergy', 'gluten-allergy', 'peanut-allergy', 'tree-nut-allergy', 'sulfite-allergy', 'milk-allergy', 'sesame-allergy', 'mustard-allergy', 'crustacean-allergy', 'mollusk-allergy', 'yeast-allergy', 'alcohol-allergy', 'caffeine-allergy', 'sugar-allergy', 'sodium-allergy', 'potassium-allergy', 'cholesterol-allergy']
    },
}

// Example of differents selections:
const selection1 = {
    specialConsiderations: {
        hasDisease: 'diabetes',
        fornitureAvaliable: ['oven', 'blender', 'microwave'],
    },
}

const selection2 = {
    specialConsiderations: {
        hasDisease: 'lactose-intolerance'
    },
};


function getRecipePrompt(userPreferences) {

    // if userPreferences is empty, return empty string
    if (Object.keys(userPreferences).length === 0) return '';

    let prompt = "Please create a recipe that fits the following preferences: \n";

    for (let [key, value] of Object.entries(userPreferences.specialConsiderations)) {
        if (value === "no-preference") continue;
        if (Array.isArray(value)) value = value.join(', ');
        prompt += `- ${key}: ${value} \n`;
    }
    return prompt;
}


// test functions
console.clear();

console.log('\n*************************************')
console.log('Selection 1: ', getRecipePrompt(selection1));
console.log('\n*************************************')
console.log('Selection 2: ', getRecipePrompt(selection2));



