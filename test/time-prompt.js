// Create a function in javascript that return a optimized prompt to create a recipe based on diferent types of selections.
const customizationOptions = {
    time: {
        minReadyTime: 0,
        maxReadyTime: 0,
        minCookTime: 0,
        maxCookTime: 0,
        minPrepTime: 0,
        maxPrepTime: 0,
        minTotalTime: 0,
        maxTotalTime: 0,
    }
}

// Example of differents selections:
const selection1 = {
}

const selection2 = {
    time: {
        maxReadyTime: 180,
        maxCookTime: 100,
        maxPrepTime: 80,
    }
};


function getRecipePrompt(userPreferences) {

    let prompt = "Please create a recipe that fits the following preferences: \n";
    // if userPreferences is empty, return empty string
    if (Object.keys(userPreferences).length === 0) return '';

    for (let [key, value] of Object.entries(userPreferences.time)) {
        if (value === 0) continue;
        prompt += `- ${key}: ${value} minutes\n`;
    }

    return prompt;
}


// test functions
console.clear();

console.log('\n*************************************')
console.log('Selection 1: ', getRecipePrompt(selection1));
console.log('\n*************************************')
console.log('Selection 2: ', getRecipePrompt(selection2));



