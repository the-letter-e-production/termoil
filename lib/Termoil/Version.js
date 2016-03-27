/**
 * Version Object
 *
 * @param {string} build - Version number
 * @param {boolean} active - Denotes the Active/Current Version
 */
var Version = function(build, active){
    this._data = {
        key: build,
        active: active
    };
};

/**
 * Is the boolean property true
 *
 * @param {string} key - Key of data attribute
 * @return {boolean}
 * @example
 * Version.is('active'); //true or false
 */
Version.prototype.is = function(key){
    if( this._data[key] === true ){
        return true;
    }

    return false;
};

/**
 * Data getter
 *
 * @param {string} key - Key of data attribute
 * @return {*}
 * @example
 * Version.get('build'); //1.0.0
 */
Version.prototype.get = function(key){
    return this._data[key] || false;
};

module.exports = Version;
