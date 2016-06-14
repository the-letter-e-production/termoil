var util = require('util');
var chalk = require('chalk');
var Helpers = require('./Termoil/Helpers');
/**
 * Termoil Object
 *
 * @class
 * @return {Termoil}
 * @example
 * var termoil = new Termoil;
 */
var Termoil = function(_native){
    Helpers.call(this);
    /** @type {boolean} */
    this._first_pass = true;
    /** @type {string} */
    this._usage = null;
    /** @type {string} */
    this._name = '';
    /** @type {object} */
    this._versions = {
        active: new Termoil.Version('0.0.1')
    };
    /** @type {integer} */
    this._position = -1;
    /** @type {object} */
    this._options = {};
    /** @type {object} */
    this._pos_options = {};
    /** @type {object} */
    this._subroutines = {};
    /** @type {object} */
    this._data = {};
    /** @type {boolean} */
    this._native = _native || false;

    this._error_state = false;
    this._test_mode = false;

    this.stdin = new (require('./Termoil/Stdin'));
    this.stdout= new (require('./Termoil/Stdout'));
    this.stderr= new (require('./Termoil/Stderr'));

    return this;
};

util.inherits(Termoil, Helpers);

/**
 * Reset data to reparse
 *
 * @return {Termoil}
 * @example
 * termoil.reset();
 */
Termoil.prototype.reset = function(){
    this._data = {};
    this._error_state = false;
    this._first_pass = true;
    this._position = -1;

    return this;
};

/**
 * Merge data into subroutine
 *
 * @param {object} data - Object to merge into data
 * @return {Termoil}
 * @example
 * termoil.merge({foo: 'bar'});
 */
Termoil.prototype.merge = function(data){
    this._data = JSON.parse(JSON.stringify(data)) || {};

    return this;
};

/**
 * Skip initial array args
 *
 * @param {array} args - process args
 * @param {number} count - skip count
 * @return {array}
 * @example
 * termoil.parse(Termoil.Skip(process.argv, 2)); //skip node and filename args
 */
Termoil.Skip = function(args, count){
    args.splice(0, count);
    return args;
};

/**
 * Add a name for your app
 *
 * @param {string} name - Name text
 * @return {Termoil}
 * @example
 * termoil.name('My App');
 */
Termoil.prototype.name = function(name){
    this._name = name;

    return this;
};

/**
 * Add instructions for app usage
 *
 * @param {string} instruction - Instructions text
 * @return {Termoil}
 * @example
 * termoil.instruction('cmd [options]');
 */
Termoil.prototype.instructions = function(instructions){
    this._usage = instructions;
    
    return this;
};

Termoil.Version = require('./Termoil/Version');
/**
 * Add version to app
 *
 * @param {Version} Version - Version Object
 * @return {Termoil}
 * @example
 * termoil.addVersion(new Termoil.Version('1.0.0', true));
 */
Termoil.prototype.addVersion = function(Version){
    if( Version.is('active') ){
        this._versions['active'] = Version;

        return this;
    }
       
    this._versions[Version.get('key')] = Version;

    return this;
};
Termoil.Option = require('./Termoil/Option');
/**
 * Add option to app
 *
 * @param {Option} Option - Option Object
 * @return {Termoil}
 * @example
 * termoild.addOption(new Termoil.Option(['-f', '--flag'], 'myflag', 'flag'));
 */
Termoil.prototype.addOption = function(Option){
    var keys = Option.get('keys');
    if( keys.constructor === Array ){
        for(var i=0; i<keys.length; i++){
            this._options[keys[i]] = Option;
            this._data[Option.get('name')] = Option.get('default');
        }
    }else{
        this._pos_options[keys] = Option;
        this._data[Option.get('name')] = Option.get('default');
    }

    return this;
};
Termoil.SubRoutine = require('./Termoil/SubRoutine');
/**
 * Add subroutine to app
 *
 * @param {SubRoutine} SubRoutine - SubRoutine Object
 * @return {Termoil}
 * @example
 * termoil.addSubRoutine(new Termoil);
 */
Termoil.prototype.addSubRoutine = function(SubRoutine){
    var keys = SubRoutine.get('keys');
    for(var i=0; i<keys.length; i++){
        this._subroutines[keys[i]] = SubRoutine;
    }
    
    return this;
};

/**
 * Parse process.argv
 *
 * @param {array|string} args - process.arg or remainder
 * @example
 * termoil.parse(process.argv);
 */
Termoil.prototype.parse = function(args){
    this._position++;
    if( this._native ){
        return processNative.apply(this, [args]);
    }
    if( this._first_pass && args.length == 0 ){
        return showHelp.apply(this);
    }
    this._first_pass = false;
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
            }else if(this._pos_options.hasOwnProperty(this._position.toString()) && arg[0] != "-"){
                //process positional arg
                args = processOption.apply(this, [arg, args, this._position.toString()]);
            }else if( arg[0] == "-" ){
                //process as option
                if( arg[1] == "-" ){
                    if( arg == "--" ){
                        this._data._remainder = args;
                        return this.emit('parsed');
                    }else{
                        //single full name option
                        args = processOption.apply(this, [arg, args]);
                    }
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
                this.emit('parsed');
                return processSubRoutine.apply(this, [arg, args]);
            }

            if( typeof args !== "undefined" && args.length > 0 ) return this.parse(args);
    }
    
    this.emit('parsed');
}

/**
 * Show help handler
 */ 
function showHelp(){
    var pad = function(total, current){
        total = parseInt(total);
        if( current < total ){
            current = parseInt(current);
        }else{
            current = 0;
        }
        return Array(parseInt((total + 1) - current)).join(' ');
    };
    var help = {};
    help[chalk.bold('NAME') + "\n"] = true;
    help[pad(4, 0) + this._name + ' ' + this._versions['active'].get('key') +  "\n"] = true;
    help[chalk.bold('SYNOPSIS') + "\n"] = true;
    help[pad(4, 0) + this._usage + "\n"] = true;
    if( Object.keys(this._options).length ){
    help[chalk.bold('OPTIONS') + "\n"] = true;
    help[pad(4, 0) + 'The following options are available' + "\n"] = true;
    for(var key in this._options){
        help[pad(4, 0) + chalk.bold(this._options[key].get('keys').join(', ')) + pad(18, this._options[key].get('keys').join(', ').length) + chalk.dim(this._options[key].get('type').toString()) + pad(15, this._options[key].get('type').toString().length) + (this._options[key].get('description') ? this._options[key].get('description') : "")] = true;
    }
    }
    if( Object.keys(this._subroutines).length ){
        help["\n" + chalk.bold('COMMANDS') + "\n"] = true;
        help[pad(4, 0) + 'The following subroutines can be used. Each contains their own usage instructions' + "\n"] = true;
        for(var key in this._subroutines){
            help[pad(4, 0) + chalk.bold(this._subroutines[key].get('keys').join(', ')) + pad(18, this._subroutines[key].get('keys').join(', ').length) + (this._subroutines[key].get('description') ? this._subroutines[key].get('description') : "")] = true;
        }
    }

    for(var line in help){
        console.log(line);
    }

    return kill.apply(this, [0]);
}

/**
 * Process version handler
 *
 * @param {string} arg - Current arg name to process
 * @param {array|string} args - Remaining args
 * @return {null} - process.exit(0);
 */
function processVersion(arg, args){
    switch(args[0])
    {
        case 'active': console.log(this._versions['active'].get('key'));
        break;
        default: console.log(this._versions['active'].get('key'));
    }

    return kill.apply(this, [0]);
}

function processNative(args){
    var _this = this;
    var spawn = require('child_process').spawn;
    var _native = spawn(this._native, args);
    this.stdin.pipe(_native.stdin);
    _native.stdout.on('data', function(data){
        _this.stdout.write(data.toString());
    });
    _native.stderr.on('data', function(data){
        _this.stderr.write(data.toString());
    });
    _native.on('close', function(code){
        _this.emit('parsed');
        this.stdin.end();
    });
}

/**
 * Process subroutine handler
 *
 * @param {string} arg - Current arg name to process
 * @param {array|string} args - Remaining args
 */
function processSubRoutine(arg, args){
    if( this._subroutines.hasOwnProperty(arg) ){
        var subroutine = this._subroutines[arg].get('type');
        subroutine.merge(this._data).parse(args);
    }else{
        return consoleError.apply(this, ["Unknown subroutine:", arg]);
    }
}

/**
 * Process option handler
 *
 * @param {string} arg - Current arg name to process
 * @param {array|string} args - Remaining args
 * @return {array|string} - Return remainder args
 */
function processOption(arg, args, pos){
    if( typeof pos !== "undefined" ){
        this._data[this._pos_options[pos].get('name')] = arg || this._pos_options[pos].get('default');

        return args;
    }
    else if( this._options.hasOwnProperty(arg) ){
        var type = this._options[arg].get('type');
        if( type.get('key') == 'flag' ){
            processFlagOption.apply(this, [arg]);
        }else if( type.get('key') == 'value' ){
            if( type.is('required') ){
                args = processRequiredValOption.apply(this, [arg, args, type.is('repeating')]);
            }else{
                args = processOptionalValOption.apply(this, [arg, args, type.is('repeating')]);
            }
        }else{
            return consoleError.apply(this, ["Invalid option key (" + type.get('key')  + ") defined for option:", arg]);
        }

        return args;
    }else{
        return consoleError.apply(this, ["Unknown option:", arg]);
    }
}

/**
 * Process require val option handler
 *
 * @param {string} key - Current arg name to process
 * @param {array|string} args - Remaining args
 * @return {array|string} - Return remainder args
 */
function processRequiredValOption(key, args, repeating){
    if( args.length == 0 || args[0][0] == "-" ){
        return consoleError.apply(this, ["Missing required value for option:", key]);
    }
    if( repeating ){
        val = [];
        while( args.length && args[0][0] != "-" ){
            val.push(args.shift());
        }
    }else{
        val = args.shift();
    }
    if( typeof this._options[key].get('filter') == 'function' ){
        val = this._options[key].get('filter')(val);
    }
    this._data[this._options[key].get('name')] = val;

    return args;
}

/**
 * Process optional val option handler
 *
 * @param {string} key - Current arg name to process
 * @param {array|string} args - Remaining args
 * @return {array|string} - Return remainder args
 */
function processOptionalValOption(key, args, repeating){
    var val;
    if( args.length && args[0][0] != "-" ){
        if( repeating ){
            val = [];
            while( args.length && args[0][0] != "-" ){
                val.push(args.shift());
            }
        }else{
            val = args.shift();
        }
    }else{
        val = this._options[key].get('default');
    }
    if( typeof this._options[key].get('filter') == 'function' ){
        val = this._options[key].get('filter')(val);
    }
    this._data[this._options[key].get('name')] = val;

    return args;
}

/**
 * Process option handler
 *
 * @param {string} key - Current arg name to process
 */
function processFlagOption(key){
    this._data[this._options[key].get('name')] = true;
}

/**
 * Log error to console
 *
 * @param {...*}
 * @return {null} - process.exit(1);
 */
function consoleError(){
    console.error();
    console.error.apply(this, arguments);
    this._error_state = true;
    return kill.apply(this, [1]);
}

function kill(code){
    if( this._test_mode ){
        return code;
    }

    return process.exit(code);
} 


module.exports = Termoil;
