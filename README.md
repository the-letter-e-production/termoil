TermOil
===================

[![Build Status](https://travis-ci.org/the-letter-e-production/termoil.svg?branch=master)](https://travis-ci.org/the-letter-e-production/termoil) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Percentage of issues still open") [![Doclets API](https://img.shields.io/badge/doclets-api-blue.svg)](https://doclets.io/the-letter-e-production/termoil/master)


##Well oiled terminal apps

>Termoil is built on the simple concept of recursive references to the __Termoil__ object. You create your main instance and then include sub instances *(SubRoutines)*.

```
npm install --save termoil
```

### Include the module

```
var Termoil = require('termoil');
```

### Create your app

```
var myapp = new Termoil;
```
### Add app name

```
myapp.name('Termoil App');
```

### Add usage instructions

> Usage info is shown when no options are passed or when passing *-h*, *-H* and *--help*

```
myapp.instructions('myapp [options]');
```

### Add version info

> Termoil allows you to associate multiple versions with your app and define the current active version. Right now the software only makes use of the active version info

```
myapp.addVersion(new Termoil.Version('1.0', true)) //add active version 1.0
```

> Version is shown by calling *-v*, *-V* and *--version*

### Add options

```
myapp.addOption(new Termoil.Option(['-n', '-N', '--name'], 'userName', new Termoil.Option.Type('value', true), 'User name field', 'John Smith', function(val){ return val.toLowerCase(); }));
```

__The Option Object:__

The option object is the most complex, customizable and useful class in the Termoil library. It extends the Argument class, which handles processing any arguments passed through *process.argv*

> Check out the Argument api for details on options: https://doclets.io/the-letter-e-production/termoil/master#dl-Argument

*Option Args:* `new Termoil.Option(keys, name, type, description, default, filter);`

 - keys - An array of (n) allowed keys
    - `var keys = ['-n', '-N', '--name'];`
 - name - The property name of this argument
   - `var name = 'name';`
 - type - Option type: (required|optional|flag)
    - `var type = 'required';`
    - required - This option must have a value passed after it
    - optional - This option may have a value passed after it, otherwise it will use the default value
    - flag - Flags are booleans, if passed they result in truth
 - description - A description for the option, used in help page
    - `var description = 'My description';`
 - default - A default value in the event no value is passed
    - `var default = 'Default Value';`
 - filter - A function to pass the option value through
    - `var filter = function(val){ return parseInt(val); };`

__The Option Type Object:__

The option type object allows you to determine the behavior of each option.

*Option Type Args:* `new Termoil.Option.Type(key, required, repeating);`

- key - The type of option to be used. Either 'value' or 'flag'.
    - value - An option that accepts a value
    - flag - An option that returns true when set
- required - A boolean used for value options to denote a required to be passed after the option
- repeating - A boolean used for value options to denote multiple values may be passed after the option
    - repeating values will be stored in an array

 
### Add A SubRoutine

> There is no limit to how deep you can nest sub routines *(inception style)*

```
var mysubapp = new Termoil;
    //define all app options here
myapp.addSubRoutine(new Termoil.SubRoutine(['sub'], 'sub', mysubapp));
```
> Usage info will show for subroutines with no options passed as well

    myapp sub; #this will show usage info for mysubapp

### Parse Argv
```
myapp.parse(Termoil.Skip(process.argv, 2));
```
> You only need to call `.parse` on your main app. Parsing of options for SubRoutines will be handled automatically

> Options will cascade through SubRoutines. However, they will not be available upstream. `mysubapp` gets a copy of options from `myapp`, but `myapp` doesn't see options passed to `mysubapp`

### Use Options
There are two main ways to make use of options

1. After calling parse - You can simply access the options using the Termoil getters after you've called `.parse`, since it's a synchronous method. This method can be annoying as you will have to write your own conditionals to handle whether or not options were in fact parsed or SubRoutines got called.
2. Attach to the `.on('parsed')` event - This is recommended as it will only run the callback if your app actually had options passed to it.

```
//after parse example
myapp.parse(Termoil.Skip(process.argv, 2));
console.log(myapp.get());

//on event example
myapp.on('parsed', function(){
    console.log(this.get());
}).parse(Termoil.Skip(process.argv, 2));
```
> Using the `.on('parsed')` callback will allow you to access the instance of your Termoil Object using `this`

### Helper Methods
There are 3 main helper methods you should use to make scripting with termoil easier

1. [.get](https://doclets.io/the-letter-e-production/termoil/master#dl-Termoil-get) - Get option(s)
2. [.has](https://doclets.io/the-letter-e-production/termoil/master#dl-Termoil-has) - Check for existence of option
3. [.has_all](https://doclets.io/the-letter-e-production/termoil/master#dl-Termoil-has_all) - Check for existence of options

```
myapp.on('parsed', function(){
    //get example
    var myopt = this.get('myopt'); //return option if exists, else returns false
    var opts = this.get(); //return json object of all options

    //has example
    var boolean = this.has('myopt'); //returns true if option exists, else returns false
    var boolean = this.has('myopt', function(myopt){ //returns callback if myopt exists
        console.log(myopt); //value of myopt
    }); //still returns same boolean
    
    //has all example
    var boolean = this.has_all(['myopt', 'youropt']); //return true if both opts exist, else return false
    var boolean = this.has_all(['myopt', 'youropt'], function(myopt, youropt){ //returns callback if both opts exist
        console.log(myopt, youropt); //values of myopt and youropt
    }); //still returns same boolean
}).parse(Termoil.Skip(process.argv, 2));
```

### New Features Roadmap
You can find a list of enhancements that are on the roadmap by [clicking here](https://github.com/the-letter-e-production/termoil/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

### Questions, Comments
We hope this documentation is sufficient to get you started with Termoil. However, if you have any questions or require help please open a ticket on [GitHub](https://github.com/the-letter-e-production/termoil)


----------


Built under the [ISC](http://opensource.org/licenses/ISC) License
