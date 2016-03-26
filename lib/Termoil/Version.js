var Version = function(build, active){
    this._data = {
        key: build,
        active: active
    };
};

Version.prototype.is = function(key){
    if( this._data[key] === true ){
        return true;
    }

    return false;
};

Version.prototype.get = function(key){
    return this._data[key] || false;
};

module.exports = Version;
