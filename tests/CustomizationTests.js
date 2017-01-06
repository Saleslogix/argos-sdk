/* eslint-disable */
define('tests/CustomizationTests', [
  'argos/Customization'
], function(customization) {
  return describe('argos.Customization', function() {
    it('should insert before', function() {
      var customizations = [{
        at: function() { return true; },
        type: 'insert',
        where: 'before',
        value: 10
      }];

      var layout = [
        1,
        2,
        3
      ];
      var results = customization.compileCustomizedLayout(customizations, layout);
      expect(results[0]).toEqual(10);
    });

    it('should insert after', function() {
      var customizations = [{
        at: function() { return true; },
        type: 'insert',
        value: 99
      }];

      var layout = [
        1,
        2,
        3
      ];
      var results = customization.compileCustomizedLayout(customizations, layout);
      expect(results[1]).toEqual(99);
    });

    it('should match the correct row', function() {
      var customizations = [{
        at: function(row) { return row === 3; },
        type: 'insert',
        value: 99
      }];

      var layout = [
        1,
        2,
        3
      ];
      var results = customization.compileCustomizedLayout(customizations, layout);
      expect(results[3]).toEqual(99);
    });

    it('should replace', function() {
      var customizations = [{
        at: function(row) { return row === 3; },
        type: 'replace',
        value: 99
      }];

      var layout = [
        1,
        2,
        3
      ];
      var results = customization.compileCustomizedLayout(customizations, layout);
      expect(results[2]).toEqual(99);
    });

    it('should modify', function() {
      var customizations = [{
        at: function(row) { return true; },
        type: 'modify',
        value: {
          prop1: '-one-'
        }
      }];

      var layout = [{
        prop1: 'one',
        prop2: 'two'
      }];

      var results = customization.compileCustomizedLayout(customizations, layout);
      expect(results[0].prop1).toEqual('-one-');
    });

    it('should remove', function() {
      var customizations = [{
        at: function(row) { return row === 2; },
        type: 'remove'
      }];

      var layout = [
        1,
        2,
        3
      ];
      var results = customization.compileCustomizedLayout(customizations, layout);
      expect(results.length).toEqual(2);
      expect(results[1]).toEqual(3);
    });
  });
})
