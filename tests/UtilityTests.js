define('tests/UtilityTests', ['dojo/_base/lang', 'argos/Utility'], function(lang, utility) {
return describe('Sage.Platform.Mobile.Utility', function() {

    it('Can get single level property of object', function() {
        var testObj = {
            level1: 'test'
        };

        expect(utility.getValue(testObj, 'level1')).toEqual('test');
    });
    it('Can get many level property of object via string notation', function() {
        var testObj = {
            level1: {
                level2: {
                    level3: {
                        level4: {
                            level5: 'test'
                        }
                    }
                }
            }
        };
        expect(utility.getValue(testObj, 'level1.level2.level3.level4.level5')).toEqual('test');
    });
    it('Can return null for undefined property and no default fallback', function() {
        var testObj = {};

        expect(utility.getValue(testObj, 'level1')).toEqual(null);
    });
    it('Can return default fallback for undefined property', function() {
        var testObj = {};

        expect(utility.getValue(testObj, 'level1', 'testFallback')).toEqual('testFallback');
    });

    it('Can not set an invalid property', function() {
        var testObj = {
            test: null
        };

        expect(utility.setValue(testObj, '', '').test).toEqual(null);
        expect(utility.setValue(testObj, '.', '').test).toEqual(null);
    });

    it('Can memoize', function() {
        var spy, mem;

        spy = {
            adder: function(a, b) {
                return a + b;
            }
        };

        spyOn(spy, 'adder').and.callThrough();

        mem = utility.memoize(spy.adder);
        mem(1, 2);
        mem(1, 2);
        expect(spy.adder.calls.count()).toEqual(1);
    });

    it('Can debounce', function(done) {
      var count = 0;
      var fn = utility.debounce(function() {
        count++;
      }, 1000);
      fn();
      fn();
      fn();
      expect(count).toEqual(0);
      setTimeout(function() {
        expect(count).toEqual(1);
        done();
      }, 1000);
    });

    it('Can debounce with args', function(done) {
      var fn = utility.debounce(function(a,b,c) {
        expect(a).toEqual('a');
        expect(b).toEqual('b');
        expect(c).toEqual('c');
        done();
      }, 1000);
      fn('a', 'b', 'c');
    });

    it('Can expand an expression', function() {
        expect(utility.expand(null, function() {
            return '123';
        })).toEqual('123');
    });

    it('Can set nested properties', function() {
        var testObj = {
            test1: {
                test2: {
                    name: ''
                }
            }
        };

        expect(utility.setValue(testObj, 'test1.test2.name', 'John Doe').test1.test2.name).toEqual('John Doe');
        expect(utility.setValue({test1: { test2: {}}}, 'test1[test2]', 'Jane Doe')).toEqual({ test1: { test2: 'Jane Doe' }});
        expect(utility.setValue({test1: {}}, 'test2[0]', 'Jane Doe')).toEqual({ test1: { }, test2: ['Jane Doe'] });
    });

    it('Can set an existing single level property of object', function() {
        var testObj = {
            level1: null
        };

        utility.setValue(testObj, 'level1', 'test');

        expect(testObj.level1).toEqual('test');
    });
    it('Can create a single level property of object', function() {
        var testObj = {};

        utility.setValue(testObj, 'level1', 'test');

        expect(testObj.level1).toEqual('test');
    });

    it('Can set an existing many level property of object', function() {
        var testObj = {
            level1: {
                level2: {
                    level3: null
                }
            }
        };

        utility.setValue(testObj, 'level1.level2.level3', 'test');

        expect(testObj.level1.level2.level3).toEqual('test');
    });
    it('Can create a many level property of object', function() {
        var testObj = {
            level1: {
                leve2: {}
            }
        };

        utility.setValue(testObj, 'level1.level2.level3', 'test');

        expect(testObj.level1.level2.level3).toEqual('test');
    });
    it('Can join fields filtering out null, undefined, and empty strings', function() {
        var test = [undefined, '', null, 'john.doe'];
        expect(utility.joinFields(',', test)).toEqual('john.doe');
        test.push('manager');
        expect(utility.joinFields(',', test)).toEqual('john.doe,manager');
    });
});
});
