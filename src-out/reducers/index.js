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