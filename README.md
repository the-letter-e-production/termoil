TermOil
===================

[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Percentage of issues still open") [![Doclets API](https://img.shields.io/badge/doclets-api-blue.svg)](https://doclets.io/the-letter-e-production/termoil/master)


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
myapp.addOption(new Termoil.Option(['-n', '-N', '--name'], 'userName', 'required', 'User name field', 'John Smith', function(val){ return val.toLowerCase(); }));
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

 
### Add A SubRoutine

> There is no limit to how deep you can nest sub routines *(inception style)*

```
var mysubapp = new Termoil;
    //define all app options here
myapp.addSubRoutine(new Termoil.SubRoutine(['sub'], 'sub', mysubapp));
```
> Usage info will show for subroutines with no options passed as well

    myapp sub; #this will show usage info for mysubapp

### Questions, Comments
We hope this documentation is sufficient to get you started with Termoil. However, if you have any questions or require help please open a ticket on [GitHub](https://github.com/the-letter-e-production/termoil)


----------


Built under the [ISC](http://opensource.org/licenses/ISC) License
