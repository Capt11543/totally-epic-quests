/**
 * @param {Object} source 
 * @param {Object} target 
 */
function convertObject(source, target) {
    for(const key in Object.keys(source)) {
        if(key in target) {
            target[key] = source[key]
        }
    }
}

module.exports = convertObject