var util = require('util');
var Helpers = require('./Helpers');
/**
 * Argument Object
 *
 * @extends Helpers
 * @param {array} keys - Possible argument keys
 * @param {string} name - Argument store name
 * @param {string|object} type - Argument type or Object store
 * @param {string} description - Arbument description
 * @param {*} def - Default value
 * @param {function} filter - Filter function
 * @return {Argument}
 */
var Argument = function(keys, name, type, description, def, filter){
    Helpers.call(this);
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

util.inherits(Argument, Helpers);

module.exports = Argument;
