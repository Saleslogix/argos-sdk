/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module argos/reducers
 */
import { SET_MAX_VIEWPORTS, INSERT_HISTORY } from '../actions/index';
import { SET_CONNECTION_STATE } from '../actions/connection';

const initialSDKState = {
  online: null,
  viewports: 1,
  maxviewports: 2,
  viewset: [],
  history: [],
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

/**
 * Root reducer function
 * @param {Object} state Current application state
 * @param {String} action.type
 * @param {Object} action.payload
 */
export function sdk(state = initialSDKState, action) {
  const { type, payload, error, meta } = action; // eslint-disable-line
  switch (type) {
    case SET_MAX_VIEWPORTS:
      return Object.assign({}, state, {
        maxviewports: payload.max,
      });
    case INSERT_HISTORY:
      return Object.assign({}, state, {
        history: [...state.history, payload.data],
      });
    case SET_CONNECTION_STATE:
      return Object.assign({}, state, {
        online: payload.online,
      });
    default:
      return state;
  }
}
