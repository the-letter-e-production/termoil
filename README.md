
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/the-letter-e-production/termoil.svg)](http://isitmaintained.com/project/the-letter-e-production/Express-MVC "Percentage of issues still open") [![Doclets API](https://img.shields.io/badge/doclets-api-blue.svg)](https://doclets.io/the-letter-e-production/termoil/master)

##Well oiled terminal apps


_Example_:

```
#!/usr/bin/env node
var Termoil = require('termoil');
var termoil = new Termoil; //main
    termoil.instructions('cmd [options|subroutines]');
    termoil.addVersion(new Termoil.Version('0.0.2', true));
    termoil.addOption(new Termoil.Option(['-t', '--type'], 'type', 'required'));
    termoil.addOption(new Termoil.Option(['-o', '--opt'], 'opt', 'optional'));
    termoil.addOption(new Termoil.Option(['-f', '--flag'], 'flag', 'flag'));
    termoil.addOption(new Termoil.Option(['-d', '--door'], 'door', 'flag'));
    termoil.addOption(new Termoil.Option(['-n', '--nob'], 'nob', 'required'));
var termoil_sub = new Termoil; //sub
    termoil.instructions('cmd build [options]');
    termoil_sub.addOption(new Termoil.Option(['-s', '--sub'], 'sub', 'optional'));
    termoil.addSubRoutine(new Termoil.SubRoutine(['build'], 'build', termoil_sub));
    termoil.parse(Termoil.Skip(process.argv, 2));

termoil.has_all(['type', 'opt'], function(type, opt){
    console.log(type, opt);
});

console.log(termoil.get());
console.log(termoil_sub.get());
```
