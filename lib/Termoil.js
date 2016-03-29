var chalk = require('chalk');
var EventEmitter = require('events');
var util = require('util');
/**
 * Termoil Object
 *
 * @class
 * @return {Termoil}
 * @example
 * var termoil = new Termoil;
 */
var Termoil = function(){
    EventEmitter.call(this);
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
    /** @type {object} */
    this._options = {};
    /** @type {object} */
    this._subroutines = {};
    /** @type {object} */
    this._data = {};

    this._error_state = false;
    this._test_mode = false;

    return this;
};

util.inherits(Termoil, EventEmitter);

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
    for(var i=0; i<keys.length; i++){
        this._options[keys[i]] = Option;
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
 * Get option data
 *
 * @param {string} key - Option name
 * @return {string|boolen}
 * @example
 * termoil.get('myflag'); //true or false
 */
Termoil.prototype.get = function(key){
    if( typeof key == "undefined" ){
        return this._data;
    }

    return this._data[key] || false;
};

/**
 * Check if app has option passed
 *
 * @param {string} key - Option name
 * @param {function} cb - Callback, passes checked arg if exists, otherwise not called
 * @return {boolen}
 * @example
 * termoil.has('flag', function(flag){
 *     console.log(flag);
 * });
 */
Termoil.prototype.has = function(key, cb){
    var exists = (typeof this._data[key] !== "undefined");
    if( typeof cb !== "undefined" ){
        if( exists ){
            cb(this.get(key));
        }
    }

    return exists;
};

/**
 * Check is app has list of options passed
 *
 * @param {array} keys - Array of option names
 * @param {function} cb - Callback, passes checked args if all exist, otherwise not called
 * @return {boolean}
 * @example
 * termoil.has_all(['flag', 'other'], function(flag, other){
 *     console.log(flag, other);
 * });
 */
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

/**
 * Parse process.argv
 *
 * @param {array|string} args - process.arg or remainder
 * @example
 * termoil.parse(process.argv);
 */
Termoil.prototype.parse = function(args){
    this.emit('parsed');
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

            if( typeof args !== "undefined" && args.length > 0 ) return this.parse(args);
    }
}

/**
 * Show help handler
 */ 
function showHelp(){
    var help = {};
    help[chalk.bold('NAME') + "\n"] = true;
    help['    ' + this._name + ' ' + this._versions['active'].get('key') +  "\n"] = true;
    help[chalk.bold('SYNOPSIS') + "\n"] = true;
    help['    ' + this._usage + "\n"] = true;
    help[chalk.bold('OPTIONS') + "\n"] = true;
    help['    The following options are available' + "\n"] = true;
    for(var key in this._options){
        help['    ' + chalk.bold(this._options[key].get('keys').join(', ')) + ' ' + chalk.dim(this._options[key].get('type')) + ' ' + (this._options[key].get('description') ? this._options[key].get('description') : "")] = true;
    }
    if( Object.keys(this._subroutines).length ){
        help["\n" + chalk.bold('COMMANDS') + "\n"] = true;
        help['    The following subroutines can be used. Each contains their own usage instructions' + "\n"] = true;
        for(var key in this._subroutines){
            help['    ' + chalk.bold(this._subroutines[key].get('keys').join(', ')) + ' ' + (this._subroutines[key].get('description') ? this._subroutines[key].get('description') : "")] = true;
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
function processRequiredValOption(key, args){
    if( args.length == 0 || args[0][0] == "-" ){
        return consoleError.apply(this, ["Missing required value for option:", key]);
    }
    val = args.shift();
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
function processOptionalValOption(key, args){
    var val;
    if( args.length && args[0][0] != "-" ){
        val = args.shift();
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
    kill.apply(this, [1]);
}

function kill(code){
    if( this._test_mode ){
        return code;
    }

    return process.exit(code);
} 


module.exports = Termoil;
