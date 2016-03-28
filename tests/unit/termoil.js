define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var q = require('intern/dojo/node!q');

    /**
     * override console.log, console.error and process.exit
     */
    process.exit = function(code){
        return code;
    };

    var Termoil, termoil, version, option, subapp, subroutine;
    registerSuite({
        name: 'Termoil',
        'Can Require': function () {
            Termoil = require('intern/dojo/node!../../index');
        },
        'Is Function': function(){
            assert.isFunction(Termoil, 'Termol is a `function`');
        },
        'Instance Is Object': function(){
            termoil = new Termoil;
            assert.isObject(termoil, 'Termoil Instance is an `object`');
        },
        'Can Set Name': function(){
            termoil.name('My App');
            assert.equal(termoil._name, 'My App', 'termoil._name == \'My App\'');
        },
        'Can Set Instructions': function(){
            termoil.instructions('myapp [options]');
            assert.equal(termoil._usage, 'myapp [options]', 'termoil._usage == \'myapp [options]\'');
        },
        'Can Reset': function(){
            termoil.reset();
            assert.equal(JSON.stringify(termoil._data), JSON.stringify({}), 'Termoil data was reset');
        },
        'Can Merge': function(){
            termoil.reset();
            termoil.merge({foo: 'bar'});
            assert.equal(JSON.stringify(termoil._data), JSON.stringify({foo: 'bar'}), 'Termoil _data is merged');
        },
        'Can Skip': function(){
            assert.equal(JSON.stringify([2, 3]), JSON.stringify(Termoil.Skip([0, 1, 2, 3], 2)), 'Skip returns truncated array');
        },
        'Version': {
            'Can Create Active': function(){
                version = new Termoil.Version('0.0.1', true);
                assert.isObject(version, 'Version Object created');
            },
            'Can Create Non Active': function(){
                var version = new Termoil.Version('0.0.0', false);
                assert.isObject(version, 'Version Object created');
            },
            'Can Add': function(){
                termoil.addVersion(version);
                assert.strictEqual(termoil._versions.active, version, 'Version was added');
            },
            'Check Is Active': function(){
                assert.isTrue(version.is('active'), 'Version is active');
            },
            'Get Version Number': function(){
                assert.equal(version.get('key'), '0.0.1', 'Version is 0.0.1');
            },
            'Get With Option': function(){
                termoil.reset();
                var code = termoil.parse(['-v']);
                assert.equal(code, '0', 'Exited with code 0');
            }
        },
        'Option': {
            'Can Create': function(){
                option = new Termoil.Option(['-f', '--foo'], 'foo', 'optional');
                assert.isObject(option, 'Option Object created');
            },
            'Can Add': { 
                'Optional': function(){
                    termoil.addOption(option);
                    assert.strictEqual(termoil._options[option.get('keys')[0]], option, 'Option was added');
                },
                'Required': function(){
                    var req_option = new Termoil.Option(['-r', '--required'], 'req', 'required');
                    termoil.addOption(req_option);
                    assert.strictEqual(termoil._options[req_option.get('keys')[0]], req_option, 'Option was added');
                },
                'Flag': function(){
                    var flg_option = new Termoil.Option(['-n', '--new-flag'], 'newFlag', 'flag');
                    termoil.addOption(flg_option);
                    assert.strictEqual(termoil._options[flg_option.get('keys')[0]], flg_option, 'Option was added');
                }
            }
        },
        'SubRoutine': {
            'Can Create': function(){
                subapp = new Termoil;
                subapp.name('Sub');
                subapp.instructions('myapp [options] sub [options]');
                subapp.addVersion(new Termoil.Version('1.0', true));
                subapp.addOption(new Termoil.Option(['-b', '--bar'], 'bar', 'optional', 'My bar', 'default', function(val){ return val; }));
                subapp.addOption(new Termoil.Option(['-f', '--flag'], 'flag', 'flag')); 
                subroutine = new Termoil.SubRoutine(['sub'], 'sub', subapp);
                assert.isObject(subroutine, 'SubRoutine is ans `object`');
            },
            'Can Add': function(){
                termoil.addSubRoutine(subroutine);
                assert.strictEqual(termoil._subroutines[subroutine.get('keys')[0]], subroutine.get('type'), 'SubRoutine was added');
            }
        },
        'Parse': {
            'Main': function(){
                termoil.reset();
                termoil.parse(['-f', 'foo']);
                assert.equal(JSON.stringify(termoil.get()), JSON.stringify({foo: 'foo'}), 'Main options parsed');
            },
            'Sub': function(){
                termoil.reset();
                termoil.parse(['sub', '-b', 'bar']);
                assert.equal(JSON.stringify(subapp.get()), JSON.stringify({bar: 'bar'}), 'Sub options parsed');
            },
            'Both': function(){
                termoil.reset();
                termoil.parse(['-f', 'foo', '-r', 'required', 'sub', '-b', 'bar', '-f']);
                assert.equal(JSON.stringify(termoil.get()), JSON.stringify({foo: 'foo', req: 'required'}), 'Main options parsed');
                assert.equal(JSON.stringify(subapp.get()), JSON.stringify({foo: 'foo', req: 'required', bar: 'bar', flag: true}), 'Sub options parsed');
            },
            'Option': {
                'Optional': function(){
                    assert.equal(termoil.get('foo'), 'foo', 'foo == foo');
                },
                'Required': function(){
                    assert.equal(termoil.get('req'), 'required', 'required == required');
                },
                'Flag': function(){
                    assert.isTrue(subapp.get('flag'), 'flag === true');
                }
            }
        },
        'Get': function(){
            assert.equal(termoil.get('foo'), 'foo', 'foo == foo');
        },
        'Has': function(){
            assert.isTrue(termoil.has('foo'), 'myapp has foo');
        },
        'Has Callback': function(){
            var deferred = q.defer();

            termoil.has('foo', function(foo){
                if( foo == 'foo' ){
                   return deferred.resolve(true);
                }

                return deferred.reject(false);
            });

            return deferred.promise;
        },
        'Has All': function(){
            assert.isTrue(subapp.has_all(['foo', 'bar']), 'subapp has foo and bar');
        },
        'Has All Callback': function(){
            var deferred = q.defer();

            subapp.has_all(['foo', 'bar'], function(foo, bar){
                if( foo == 'foo' && bar == 'bar' ){
                    return deferred.resolve(true);
                }

                return deferred.reject(false);
            });

            return deferred.promise;
        },
        'Usage': {
            'Get with no options': function(){
                termoil.reset();
                var code = termoil.parse([]);
                assert.equal(code, '0', 'Exited with code 0');
            },
            'Get With Option': function(){
                termoil.reset();
                var code = termoil.parse(['-h']);
                assert.equal(code, '0', 'Exited with code 0');
            }
        },
        'Error': {
            'Required Option': function(){
                termoil.reset();
                termoil.parse(['-r']);
                assert.isTrue(termoil._error_state, 'Exited with code 1');
            },
            'Unknown Option': function(){
                termoil.reset();
                var code = termoil.parse(['-no-opt']);
                assert.isTrue(termoil._error_state, 'Exited with code 1');
            }
        }
    });
});
