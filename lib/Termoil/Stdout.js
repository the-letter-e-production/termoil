var stream = require('stream');
var Writable = stream.Writable;
var util = require('util');
var Termoil_Stdout = function(){
        Writable.call(this, {objectMode: true});
    };

    util.inherits(Termoil_Stdout, Writable);

    Termoil_Stdout.prototype._write = function(chunk, encoding, callback){
        this.emit('data', chunk);
    };
module.exports = Termoil_Stdout;
