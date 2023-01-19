// Create a function in javascript that return a optimized prompt to create a recipe based on diferent types of selections.
const customizationOptions = {
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
}

// Example of differents selections:
const selection1 = {
     nutrition: {
        maxCalories: 2000,
        maxCarbs: 250,
    },
}

const selection2 = {
    
};


function getRecipePrompt(userPreferences) {

    let prompt = "Please create a recipe that fits the following preferences: \n";
    // if userPreferences is empty, return empty string
    if (Object.keys(userPreferences).length === 0) return '';

    for (let [key, value] of Object.entries(userPreferences.nutrition)) {
        if (value === 0) continue;
        prompt += `- ${key}: ${value}\n`;
    }

    return prompt;
}


// test functions
console.clear();

console.log('\n*************************************')
console.log('Selection 1: ', getRecipePrompt(selection1));
console.log('\n*************************************')
console.log('Selection 2: ', getRecipePrompt(selection2));



