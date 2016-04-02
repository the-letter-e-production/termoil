var util = require('util');
var Argument = require('./Argument');
/**
 * SubRoutine Object
 *
 * @extends Argument
 */
var SubRoutine = function(){
    Argument.apply(this, arguments);
};

SubRoutine.prototype = new Argument;
SubRoutine.prototype.constructor = Argument;

module.exports = SubRoutine;
