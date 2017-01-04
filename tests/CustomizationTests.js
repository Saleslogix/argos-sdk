/* eslint-disable */
define('tests/CustomizationTests', [
  'argos/Customization'
], function(customization) {
  console.dir(customization);
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
  });
})
