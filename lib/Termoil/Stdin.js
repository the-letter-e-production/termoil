var stream = require('stream');
var util = require('util');
var ps = stream.PassThrough;
var Termoil_Stdin = function(){
        ps.call(this, {objectMode: true});
    };
    util.inherits(Termoil_Stdin, ps);

    Termoil_Stdin.prototype._read = function(size){
        this.push(null);
    };

    Termoil_Stdin.prototype._write = function(chunk, encoding, callback){
        this.emit('data', chunk);
    };

module.exports = Termoil_Stdin;
