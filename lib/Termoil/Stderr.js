var stream = require('stream');
var util = require('util');
var Writable = stream.Writable;
var Termoil_Stderr = function(){
        Writable.call(this, {objectMode: true});
    };
    util.inherits(Termoil_Stderr, Writable);
    Termoil_Stderr.prototype._write = function(chunk, encoding, callback) {
        this.emit(chunk);
        callback();
    };

module.exports = Termoil_Stderr;
