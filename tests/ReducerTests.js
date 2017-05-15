/*eslint-disable*/
define('tests/ReducerTests', [
  'argos/reducers/index',
  'argos/actions/index',
  'argos/actions/connection'
], function(
  reducer,
  indexActions,
  connectionActions
) {
  return describe('argos.reducers', function() {
    it('Can return a default state', function() {
      var state = reducer.sdk(undefined, {});
      expect(state).toEqual({
        online: false,
        viewports: 1,
        maxviewports: 2,
        viewset: [],
        history: [],
      })
    });
  });
});
