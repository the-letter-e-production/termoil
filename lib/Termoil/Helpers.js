var EventEmitter = require('events').EventEmitter;
var util = require('util');
/**
 * Helpers Object
 *
 * @extends EventEmitter
 */
var Helpers = function(){
    EventEmitter.call(this);
};
        
util.inherits(Helpers, EventEmitter);

/**
 * Get Method
 *
 * @param {string} key - The key to get a value of
 * @return {*} - Matched value or false
 */
Helpers.prototype.get = function(key){
    if( typeof key === "undefined" ){
        return this._data;
    }

    return this._data[key] || false;
};
  
/**
 * Is Method
 *
 * @param {string} key - The key to check if === true
 * @return {boolean}
 */     
Helpers.prototype.is = function(key){
    return ( this._data[key] === true );
};

/**
 * Has Method
 *
 * @param {string} key - The key to check if exists
 * @param {function} cb - The optional callback to return value if it exists
 * @return {boolean}
 */ 
Helpers.prototype.has = function(key, cb){
    var exists = (typeof this._data[key] !== "undefined");
    if( typeof cb !== "undefined" ){
        if( exists ){
            cb(this.get(key));
        }   
    }   

    return exists;
};
  
/**
 * Has All Method
 *
 * @param {array} keys - Array of keys to check if exist
 * @param {function} cb - The optional callback to return values if they exist
 * @return {boolean} - true if all keys exist
 */      
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
