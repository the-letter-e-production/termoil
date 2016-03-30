var Argument = require('./Argument');
/**
 * Option Object
 *
 * @extends Argument
 */
var Option = function(){
    Argument.apply(this, arguments);
};

Option.prototype = new Argument;
Option.prototype.constructor = Argument;

Option.Type = require('./Option/Type');

module.exports = Option;
