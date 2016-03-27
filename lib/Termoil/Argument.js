/**
 * Argument Object
 *
 * @param {array} keys - Possible argument keys
 * @param {string} name - Argument store name
 * @param {string|object} type - Argument type or Object store
 * @param {string} description - Arbument description
 * @param {*} def - Default value
 * @param {function} filter - Filter function
 * @return {Argument}
 */
var Argument = function(keys, name, type, description, def, filter){
    this._data = {
        keys: keys,
        name: name,
        type: type,
        description: description,
        default: def,
        filter: filter
    };

    return this;
};
  
/**
 * Get argument option
 *
 * @param {string} key - Option name
 * @retrn {*|boolean}
 */  
Argument.prototype.get = function(key){
    return this._data[key] || false;
};

module.exports = Argument;
