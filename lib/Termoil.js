var chalk = require('chalk');
var Termoil = function(){
    this.first_pass = true;
    this._usage = null;
    this._versions = {
        active: new Termoil.Version('0.0.1')
    };
    this._options = {};
    this._subroutines = {};
    this._data = {};
};

Termoil.prototype.merge = function(data){
    this._data = JSON.parse(JSON.stringify(data)) || {};

    return this;
};

Termoil.Skip = function(args, count){
    args.splice(0, count);
    return args;
};

Termoil.prototype.instructions = function(instructions){
    this._usage = instructions;
    
    return this;
};

Termoil.Version = require('./Termoil/Version');
Termoil.prototype.addVersion = function(Version){
    if( Version.is('active') ){
        this._versions['active'] = Version;

        return this;
    }
       
    this._versions[Version.get('key')] = Version;

    return this;
};
Termoil.Option = require('./Termoil/Option');
Termoil.prototype.addOption = function(Option){
    var keys = Option.get('keys');
    for(var i=0; i<keys.length; i++){
        this._options[keys[i]] = Option;
    }

    return this;
};
Termoil.SubRoutine = require('./Termoil/SubRoutine');
Termoil.prototype.addSubRoutine = function(SubRoutine){
    var keys = SubRoutine.get('keys');
    for(var i=0; i<keys.length; i++){
        this._subroutines[keys[i]] = SubRoutine.get('type');
    }
    
    return this;
};

Termoil.prototype.get = function(key){
    if( typeof key == "undefined" ){
        return this._data;
    }

    return this._data[key] || false;
};

Termoil.prototype.has = function(key, cb){
    var exists = (typeof this._data[key] !== "undefined");
    if( typeof cb !== "undefined" ){
        if( exists ){
            cb(this.get(key));
        }
    }

    return exists;
};

Termoil.prototype.has_all = function(keys, cb){
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

Termoil.prototype.parse = function(args){
    if( this.first_pass && args.length == 0 ){
        return showHelp.apply(this);
    }
    this.first_pass = false;
    if( typeof args !== "undefined" ){
            if( args.constructor === Array ){
                if( args.length > 0 ){
                    var arg = args.shift();
                }else{
                    return false;
                }
            }else{
                var arg = args;
            }
            if( ['-v', '-V', '--version'].indexOf(arg) > -1 ){
                return processVersion.apply(this, [arg, args]);
            }else if( ['-h', '-H', '--help'].indexOf(arg) > -1){
                return showHelp.apply(this);
            }else if( arg[0] == "-" ){
                //process as option
                if( arg[1] == "-" ){
                    //single full name option
                    args = processOption.apply(this, [arg, args]);
                }else{
                    //letter based options
                    if( arg.length > 2 ){
                        var flags = arg.split('');
                        flags.shift();
                        for(var i=0; i<flags.length; i++){
                           flags[i] = '-' + flags[i]; 
                        }
                        args = flags.concat.apply(flags, args);
                    }else{
                        args = processOption.apply(this, [arg, args]);
                    }
                }
            }else{
                return processSubRoutine.apply(this, [arg, args]);
            }

            if( args.length > 0 ) this.parse(args);
    }
}

function showHelp(){
    var help = {};
    help[chalk.bold('USAGE: ') + this._usage] = true;
    help["\n" + chalk.bold('OPTIONS:') + "\n"] = true;
    help['    The following options are available' + "\n"] = true;
    for(var key in this._options){
        help['    ' + chalk.bold(this._options[key].get('keys').join(', ')) + ' ' + chalk.dim(this._options[key].get('type')) + ' ' + (this._options[key].get('description') == true ? this._options[key].get('description') : "")] = true;
    }
    if( this._subroutines.length ){
        help["\n" + chalk.bold('SUBROUTINES:') + "\n"] = true;
        help['    The following subroutines can be used. Each contains their own usage instructions' + "\n"] = true;
        for(var key in this._subroutines){
            help['    ' + chalk.bold(key) + ' ' + (this._subroutines[key].get('description') == true ? this._subroutines[key].get('description') : "")] = true;
        }
    }

    for(var line in help){
        console.log(line);
    }
}

function processVersion(arg, args){
    switch(args[0])
    {
        case 'active': console.log(this._versions['active'].get('key'));
        break;
        default: console.log(this._versions['active'].get('key'));
    }

    return process.exit(0);
}

function processSubRoutine(arg, args){
    if( this._subroutines.hasOwnProperty(arg) ){
        var subroutine = this._subroutines[arg];
        subroutine.merge(this._data).parse(args);
    }else{
        return consoleError("Unknown subroutine:", arg);
    }
}

function processOption(arg, args){
    if( this._options.hasOwnProperty(arg) ){
        switch(this._options[arg].get('type'))
        {
            case 'required': args = processRequiredValOption.apply(this, [arg, args]);
            break;
            case 'optional': args = processOptionalValOption.apply(this, [arg, args]);
            break;
            case 'flag': processFlagOption.apply(this, [arg]);
            break;
        }

        return args;
    }else{
        return consoleError("Unknown option:", arg);
    }
}

function processRequiredValOption(key, args){
    if( args.length == 0 || args[0][0] == "-" ){
        return consoleError("Missing required value for option:", key);
    }
    val = args.shift();
    this._data[this._options[key].get('name')] = val;

    return args;
}

function processOptionalValOption(key, args){
    var val;
    if( args.length && args[0][0] != "-" ){
        val = args.shift();
    }
    this._data[this._options[key].get('name')] = val;

    return args;
}

function processFlagOption(key){
    this._data[this._options[key].get('name')] = true;
}

function consoleError(){
    console.error();
    console.error.apply(this, arguments);
    process.exit(1);
}


module.exports = Termoil;
