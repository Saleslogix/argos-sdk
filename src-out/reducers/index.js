define('argos/reducers/index', ['exports', '../actions/index', '../actions/connection'], function (exports, _index, _connection) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sdk = sdk;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var initialSDKState = {
    online: false,
    viewports: 1,
    maxviewports: 2,
    viewset: [],
    history: []
  };

  /*
  Viewsets (visible) | history
  
  Two viewports:
  [ 1 ] | [ { viewset: [ 1 ], viewports: 1 } ] <-- 1 viewport, go full screen (viewports < maxviewports)
  [ 1, 2 ] | [{ viewset: [ 1 ], viewports: 1 }, { viewset: [ 1, 2 ], viewports: 2 } ] <-- 2 viewports, go split (viewports === maxviewports)
  [ 2, 3 ] | [{ viewset: [ 1 ], viewports: 1 }, { viewset: [ 1, 2 ], viewports: 2 }, { viewset: [ 2, 3 ], viewports: 2 } ] <-- shift view 2 left and push 3 on
  -- Window resize, max viewport set to 1 --
  [ 2, 3 ] | [ { viewset: [ 1 ], viewports: 1 },
               { viewset: [ 1 , 2], viewports: 2 },
               { viewset: [ 2, 3 ], viewports: 1 } ] <-- Render the right most N item(s) in the viewset where N is the viewport
  
  Assume the rest of the history is an object containing the viewset and viewports
  -- User hits back
  [ 1, 2 ] | [ 1, 2 ] <-- Still 1 viewport
  -- User maxes Window
  [ 1, 2 ] | [ 1, 2 ] <-- no history changes, just render N right most supported views
  
  Three viewports:
  [ 1 ] | [ 1 ]
  [ 1, 2 ] | [ 1, 2 ] <-- Expand 2 to fill the remaining available viewports (viewports < maxviewports)
  [ 1, 2, 3 ] | [ 1, 2, 3] <-- 3 way split
  [ 2, 3, 4 ] | [ 1, 2, 3, 4 ] <-- Right N viewports rendered where N = maxviewports
  -- User hits back
  [ 1, 2, 3 ] | [ 1, 2, 3 ]
  -- User hits back
  [ 1, 2 ] | [1, 2]
  -- User hits back
  [1 ] | [ 1 ] <-- viewport filled again
  
  A view might want to indicate a new viewset should be created in the middle of navigating:
  [ 1 ] | [ 1 ]
  [ 1, 2 ] | [ 1, 2 ]
  [ 3 ] | [ { viewset: [ 1 ], viewports: 1 },
            { viewset: [ 1, 2 ], viewports: 2 },
            { viewset: [ 3 ], viewports: 1 } ] <-- New viewset triggered, viewports reset to 1
  [ 3, 4 ] | [ 1, 2, 3, 4 ]
  -- User hits back
  [ 3 ] | [ 1, 2, 3 ]
  */

  function sdk() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialSDKState;
    var action = arguments[1];
    var type = action.type,
        payload = action.payload,
        error = action.error,
        meta = action.meta;
    // eslint-disable-line
    switch (type) {
      case _index.SET_MAX_VIEWPORTS:
        return Object.assign({}, state, {
          maxviewports: payload.max
        });
      case _index.INSERT_HISTORY:
        return Object.assign({}, state, {
          history: [].concat(_toConsumableArray(state.history), [payload.data])
        });
      case _connection.SET_CONNECTION_STATE:
        return Object.assign({}, state, {
          online: payload.online
        });
      default:
        return state;
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzZGsiLCJpbml0aWFsU0RLU3RhdGUiLCJvbmxpbmUiLCJ2aWV3cG9ydHMiLCJtYXh2aWV3cG9ydHMiLCJ2aWV3c2V0IiwiaGlzdG9yeSIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSIsInBheWxvYWQiLCJlcnJvciIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJtYXgiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7O1VBbUVnQkEsRyxHQUFBQSxHOzs7Ozs7Ozs7Ozs7OztBQWpEaEIsTUFBTUMsa0JBQWtCO0FBQ3RCQyxZQUFRLEtBRGM7QUFFdEJDLGVBQVcsQ0FGVztBQUd0QkMsa0JBQWMsQ0FIUTtBQUl0QkMsYUFBUyxFQUphO0FBS3RCQyxhQUFTO0FBTGEsR0FBeEI7O0FBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNPLFdBQVNOLEdBQVQsR0FBOEM7QUFBQSxRQUFqQ08sS0FBaUMsdUVBQXpCTixlQUF5QjtBQUFBLFFBQVJPLE1BQVE7QUFBQSxRQUMzQ0MsSUFEMkMsR0FDWkQsTUFEWSxDQUMzQ0MsSUFEMkM7QUFBQSxRQUNyQ0MsT0FEcUMsR0FDWkYsTUFEWSxDQUNyQ0UsT0FEcUM7QUFBQSxRQUM1QkMsS0FENEIsR0FDWkgsTUFEWSxDQUM1QkcsS0FENEI7QUFBQSxRQUNyQkMsSUFEcUIsR0FDWkosTUFEWSxDQUNyQkksSUFEcUI7QUFDSjtBQUMvQyxZQUFRSCxJQUFSO0FBQ0U7QUFDRSxlQUFPSSxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQlAsS0FBbEIsRUFBeUI7QUFDOUJILHdCQUFjTSxRQUFRSztBQURRLFNBQXpCLENBQVA7QUFHRjtBQUNFLGVBQU9GLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCUCxLQUFsQixFQUF5QjtBQUM5QkQsZ0RBQWFDLE1BQU1ELE9BQW5CLElBQTRCSSxRQUFRTSxJQUFwQztBQUQ4QixTQUF6QixDQUFQO0FBR0Y7QUFDRSxlQUFPSCxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQlAsS0FBbEIsRUFBeUI7QUFDOUJMLGtCQUFRUSxRQUFRUjtBQURjLFNBQXpCLENBQVA7QUFHRjtBQUNFLGVBQU9LLEtBQVA7QUFkSjtBQWdCRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFNFVF9NQVhfVklFV1BPUlRTLCBJTlNFUlRfSElTVE9SWSB9IGZyb20gJy4uL2FjdGlvbnMvaW5kZXgnO1xyXG5pbXBvcnQgeyBTRVRfQ09OTkVDVElPTl9TVEFURSB9IGZyb20gJy4uL2FjdGlvbnMvY29ubmVjdGlvbic7XHJcblxyXG5jb25zdCBpbml0aWFsU0RLU3RhdGUgPSB7XHJcbiAgb25saW5lOiBmYWxzZSxcclxuICB2aWV3cG9ydHM6IDEsXHJcbiAgbWF4dmlld3BvcnRzOiAyLFxyXG4gIHZpZXdzZXQ6IFtdLFxyXG4gIGhpc3Rvcnk6IFtdLFxyXG59O1xyXG5cclxuLypcclxuVmlld3NldHMgKHZpc2libGUpIHwgaGlzdG9yeVxyXG5cclxuVHdvIHZpZXdwb3J0czpcclxuWyAxIF0gfCBbIHsgdmlld3NldDogWyAxIF0sIHZpZXdwb3J0czogMSB9IF0gPC0tIDEgdmlld3BvcnQsIGdvIGZ1bGwgc2NyZWVuICh2aWV3cG9ydHMgPCBtYXh2aWV3cG9ydHMpXHJcblsgMSwgMiBdIHwgW3sgdmlld3NldDogWyAxIF0sIHZpZXdwb3J0czogMSB9LCB7IHZpZXdzZXQ6IFsgMSwgMiBdLCB2aWV3cG9ydHM6IDIgfSBdIDwtLSAyIHZpZXdwb3J0cywgZ28gc3BsaXQgKHZpZXdwb3J0cyA9PT0gbWF4dmlld3BvcnRzKVxyXG5bIDIsIDMgXSB8IFt7IHZpZXdzZXQ6IFsgMSBdLCB2aWV3cG9ydHM6IDEgfSwgeyB2aWV3c2V0OiBbIDEsIDIgXSwgdmlld3BvcnRzOiAyIH0sIHsgdmlld3NldDogWyAyLCAzIF0sIHZpZXdwb3J0czogMiB9IF0gPC0tIHNoaWZ0IHZpZXcgMiBsZWZ0IGFuZCBwdXNoIDMgb25cclxuLS0gV2luZG93IHJlc2l6ZSwgbWF4IHZpZXdwb3J0IHNldCB0byAxIC0tXHJcblsgMiwgMyBdIHwgWyB7IHZpZXdzZXQ6IFsgMSBdLCB2aWV3cG9ydHM6IDEgfSxcclxuICAgICAgICAgICAgIHsgdmlld3NldDogWyAxICwgMl0sIHZpZXdwb3J0czogMiB9LFxyXG4gICAgICAgICAgICAgeyB2aWV3c2V0OiBbIDIsIDMgXSwgdmlld3BvcnRzOiAxIH0gXSA8LS0gUmVuZGVyIHRoZSByaWdodCBtb3N0IE4gaXRlbShzKSBpbiB0aGUgdmlld3NldCB3aGVyZSBOIGlzIHRoZSB2aWV3cG9ydFxyXG5cclxuQXNzdW1lIHRoZSByZXN0IG9mIHRoZSBoaXN0b3J5IGlzIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2aWV3c2V0IGFuZCB2aWV3cG9ydHNcclxuLS0gVXNlciBoaXRzIGJhY2tcclxuWyAxLCAyIF0gfCBbIDEsIDIgXSA8LS0gU3RpbGwgMSB2aWV3cG9ydFxyXG4tLSBVc2VyIG1heGVzIFdpbmRvd1xyXG5bIDEsIDIgXSB8IFsgMSwgMiBdIDwtLSBubyBoaXN0b3J5IGNoYW5nZXMsIGp1c3QgcmVuZGVyIE4gcmlnaHQgbW9zdCBzdXBwb3J0ZWQgdmlld3NcclxuXHJcblRocmVlIHZpZXdwb3J0czpcclxuWyAxIF0gfCBbIDEgXVxyXG5bIDEsIDIgXSB8IFsgMSwgMiBdIDwtLSBFeHBhbmQgMiB0byBmaWxsIHRoZSByZW1haW5pbmcgYXZhaWxhYmxlIHZpZXdwb3J0cyAodmlld3BvcnRzIDwgbWF4dmlld3BvcnRzKVxyXG5bIDEsIDIsIDMgXSB8IFsgMSwgMiwgM10gPC0tIDMgd2F5IHNwbGl0XHJcblsgMiwgMywgNCBdIHwgWyAxLCAyLCAzLCA0IF0gPC0tIFJpZ2h0IE4gdmlld3BvcnRzIHJlbmRlcmVkIHdoZXJlIE4gPSBtYXh2aWV3cG9ydHNcclxuLS0gVXNlciBoaXRzIGJhY2tcclxuWyAxLCAyLCAzIF0gfCBbIDEsIDIsIDMgXVxyXG4tLSBVc2VyIGhpdHMgYmFja1xyXG5bIDEsIDIgXSB8IFsxLCAyXVxyXG4tLSBVc2VyIGhpdHMgYmFja1xyXG5bMSBdIHwgWyAxIF0gPC0tIHZpZXdwb3J0IGZpbGxlZCBhZ2FpblxyXG5cclxuQSB2aWV3IG1pZ2h0IHdhbnQgdG8gaW5kaWNhdGUgYSBuZXcgdmlld3NldCBzaG91bGQgYmUgY3JlYXRlZCBpbiB0aGUgbWlkZGxlIG9mIG5hdmlnYXRpbmc6XHJcblsgMSBdIHwgWyAxIF1cclxuWyAxLCAyIF0gfCBbIDEsIDIgXVxyXG5bIDMgXSB8IFsgeyB2aWV3c2V0OiBbIDEgXSwgdmlld3BvcnRzOiAxIH0sXHJcbiAgICAgICAgICB7IHZpZXdzZXQ6IFsgMSwgMiBdLCB2aWV3cG9ydHM6IDIgfSxcclxuICAgICAgICAgIHsgdmlld3NldDogWyAzIF0sIHZpZXdwb3J0czogMSB9IF0gPC0tIE5ldyB2aWV3c2V0IHRyaWdnZXJlZCwgdmlld3BvcnRzIHJlc2V0IHRvIDFcclxuWyAzLCA0IF0gfCBbIDEsIDIsIDMsIDQgXVxyXG4tLSBVc2VyIGhpdHMgYmFja1xyXG5bIDMgXSB8IFsgMSwgMiwgMyBdXHJcbiovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2RrKHN0YXRlID0gaW5pdGlhbFNES1N0YXRlLCBhY3Rpb24pIHtcclxuICBjb25zdCB7IHR5cGUsIHBheWxvYWQsIGVycm9yLCBtZXRhIH0gPSBhY3Rpb247IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgU0VUX01BWF9WSUVXUE9SVFM6XHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgIG1heHZpZXdwb3J0czogcGF5bG9hZC5tYXgsXHJcbiAgICAgIH0pO1xyXG4gICAgY2FzZSBJTlNFUlRfSElTVE9SWTpcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgaGlzdG9yeTogWy4uLnN0YXRlLmhpc3RvcnksIHBheWxvYWQuZGF0YV0sXHJcbiAgICAgIH0pO1xyXG4gICAgY2FzZSBTRVRfQ09OTkVDVElPTl9TVEFURTpcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgb25saW5lOiBwYXlsb2FkLm9ubGluZSxcclxuICAgICAgfSk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gc3RhdGU7XHJcbiAgfVxyXG59XHJcbiJdfQ==