var arg = require('./Argument');
/**
 * Option Object
 *
 * @extends Argument
 */
var Option = function(){
    arg.apply(this, arguments);
};

Option.prototype = new arg;
Option.prototype.constructor = arg;

module.exports = Option;
