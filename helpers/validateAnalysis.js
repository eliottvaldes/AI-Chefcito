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


// validate if the image contains adult content. Return false if the image contains adult content
const validateAdultContent = (content) => {
    const { isAdultContent, isRacyContent, isGoryContent } = content;
    if (isAdultContent || isRacyContent || isGoryContent) {
        return false;
    }
    return true;
}


module.exports = {
    validateCategories,
    validateTags,
    validateAdultContent
}

