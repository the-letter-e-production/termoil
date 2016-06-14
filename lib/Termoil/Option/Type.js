var util = require('util');
var Helpers = require('../Helpers');
/**
 * Option Type Object
 *
 * @extends Helpers
 * @param {string} key - (value|flag) are the only working options as of now
 * @param {boolean} required - Is this a required value
 * @param {boolean} repeating - Can this option have repeating values
 * @example
 * new Termoil.Option.Type('value', true, true); //myapp --option 1 2 3 4; #yields {option: [1, 2, 3, 4]}
 */
var Option_Type = function(key, required, repeating, positional){
    Helpers.call(this);
    this._data = {
        key: key,
        required: required,
        repeating: repeating,
        positional: positional
    };
};

util.inherits(Option_Type, Helpers);

/**
 * To String Override
 */
Option_Type.prototype.toString = function(){
    var output = this.get('key');
    if( !this.is('required') ){
        output = '[' + output + ']';
    }
    if( this.is('repeating') ){
        output += ' ...';
    }

    return output;
};

module.exports = Option_Type;
