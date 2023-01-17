/**
 * Function to get all item from objects that contains 
 * the the property 'object' equal to 'food' 
 * and the confidence is greater than 0.5
 */
const getFoodObjectsSimple = (objects) => {
    return objects.filter((item) => {
        return item.object === 'Food' && item.confidence > 0.5;
    });
}

/**
 * Function to get all items taht contains 
 * the property 'object' equal to 'food' 
 * in the item 
 * or in the parent 
 * or in the parent of the parent
 * 
 */
const getFoodObjects = (objects) => {
    return objects.filter((item) => {
        if (item.object === 'Food') {
            return true;
        } else if (item.parent && item.parent.object === 'Food') {
            return true;
        } else if (item.parent && item.parent.parent && item.parent.parent.object === 'Food') {
            return true;
        }
        return false;
    });
}

module.exports = {
    getFoodObjects,
    getFoodObjectsSimple
}