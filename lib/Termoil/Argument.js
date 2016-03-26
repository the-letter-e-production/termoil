var Argument = function(keys, name, type, description, def, filter){
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
    
Argument.prototype.get = function(key){
    return this._data[key] || false;
};

module.exports = Argument;
