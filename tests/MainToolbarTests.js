/*eslint-disable*/
define('tests/MainToolbarTests', [
  'dojo/on',
  'dojo/query',
  'dojo/dom-construct',
  'dojo/dom-class',
  'argos/MainToolbar'
], function(
  on,
  query,
  domConstruct,
  domClass,
  MainToolbar
) {
  return describe('Sage.Platform.Mobile.MainToolbar', function() {
    var mockApp = {
      onLine: true
    };

    it('Can handle no tools', function() {
      var bar = new MainToolbar({app: mockApp});

      bar.showTools();
      expect(bar.size)
        .toEqual(0);
    });
  });
});
