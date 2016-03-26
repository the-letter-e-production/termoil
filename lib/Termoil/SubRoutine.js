var arg = require('./Argument');
var SubRoutine = function(){
    arg.apply(this, arguments);
};

SubRoutine.prototype = new arg;
SubRoutine.prototype.constructor = arg;

module.exports = SubRoutine;
