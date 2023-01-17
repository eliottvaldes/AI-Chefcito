// VALIDATIONS TO CHECK IF THE IMAGE ANALYSIS RESULT CONTAINS FOOD

const validateCategories = (categories) => {

    // find if in categories array contains one field that inclides the word 'food'...
    const food = categories.find(category => category.name.includes('food') && category.score > 0.5);

    // ternary operator to return false or object
    return food ? true : false;
}


const validateTags = (description) => {
    // validate if in data.description.tags contains one field that inclides the word 'food'...
    const { tags } = description;

    const food = tags.find(tag => tag.includes('food'));

    return food ? true : false;
}



module.exports = {
    validateCategories,
    validateTags
}

