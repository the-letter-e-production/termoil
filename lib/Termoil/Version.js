var util = require('util');
var Helpers = require('./Helpers');
/**
 * Version Object
 *
 * @param {string} build - Version number
 * @param {boolean} active - Denotes the Active/Current Version
 */
var Version = function(build, active){
    Helpers.call(this);
    this._data = {
        key: build,
        active: active
    };
};

util.inherits(Version, Helpers);

module.exports = Version;
