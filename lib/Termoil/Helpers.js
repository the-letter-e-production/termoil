var EventEmitter = require('events');
var util = require('util');
var Helpers = function(){
    EventEmitter.call(this);
};
        

util.inherits(Helpers, EventEmitter);
Helpers.prototype.get = function(key){
    if( typeof key === "undefined" ){
        return this._data;
    }

    return this._data[key] || false;
};
       
Helpers.prototype.is = function(key){
    return ( this._data[key] === true );
};
 
Helpers.prototype.has = function(key, cb){
    var exists = (typeof this._data[key] !== "undefined");
    if( typeof cb !== "undefined" ){
        if( exists ){
            cb(this.get(key));
        }   
    }   

    return exists;
};
        
Helpers.prototype.has_all = function(keys, cb){
    var exists = false;
    var vals = []; 
    var ret = (typeof cb !== "undefined");
    for(var i=0; i<keys.length; i++){
        var exists = this.has(keys[i], function(val){
            if( ret ) vals.push(val);
        });  
    
        if( !exists ) return false;
    }    

    if( ret ) cb.apply(cb, vals);

    return exists;
};

module.exports = Helpers;
