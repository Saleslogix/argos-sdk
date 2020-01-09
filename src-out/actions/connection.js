define('argos/actions/connection', ['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setConnectionState = setConnectionState;
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
   * @module argos/actions/connection
   */

  // action Types
  var SET_CONNECTION_STATE = exports.SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';

  /*
  
  See: https://github.com/acdlite/flux-standard-action
  
  An action MUST
  + be a plain JavaScript object.
  + have a type property.
  
   An action MAY
  + have an error property.
  + have a payload property.
  + have a meta property.
  
  An action MUST NOT
  + include properties other than type, payload, error, and meta.
  */

  /**
   * Action creator for connection state. Returns a
   * reducer action of SET_CONNECTION_STATE with payload
   * online set to the param.
   * @param {Boolean} online
   */
  function setConnectionState(online) {
    return {
      type: SET_CONNECTION_STATE,
      payload: {
        online: online
      }
    };
  }
});