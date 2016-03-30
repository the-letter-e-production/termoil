var Option_Type = function(key, required, repeating){
    this._data = {
        key: key,
        required: required,
        repeating: repeating
    };
};

Option_Type.prototype.get = function(key){
    return this._data[key] || false;
};

Option_Type.prototype.is = function(key){
    return this._data[key] == true ? true : false;
};

module.exports = Option_Type;
