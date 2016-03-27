TermOil
===================

[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Percentage of issues still open") [![Doclets API](https://img.shields.io/badge/doclets-api-blue.svg)](https://doclets.io/the-letter-e-production/termoil/master)


##Well oiled terminal apps

>Termoil is built on the simple concept of recursive references to the __Termoil__ object. You create your main instance and then include sub instances *(SubRoutines)*.


### Include the module

```
var Termoil = require('termoil');
```

### Create your app

```
var myapp = new Termoil;
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

> Check out the Argument api for details on options: https://doclets.io/the-letter-e-production/termoil/master#dl-Argument

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
We hope this documentation is sufficient to get you started with Express MVC. However, if you have any questions or require help please open a ticket on [GitHub](https://github.com/the-letter-e-production/termoil)


----------


Built under the [ISC](http://opensource.org/licenses/ISC) License
