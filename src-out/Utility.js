define('argos/Utility', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var util = ICRMCommonSDK.utility;

  /**
   * @class
   * @alias module:argos/Utility
   * @classdesc Utility provides functions that are more javascript enhancers than application related code.
   */
  /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * @module argos/Utility
   */
  var __class = _lang2.default.setObject('argos.Utility', /** @lends module:argos/Utility */{
    /**
     * Replaces a single `"` with two `""` for proper SData query expressions.
     * @param {String} searchQuery Search expression to be escaped.
     * @return {String}
     */
    escapeSearchQuery: util.escapeSearchQuery,

    /**
     *
     */
    memoize: util.memoize,

    /**
     *
     */
    debounce: util.debounce,

    /**
     *
     */
    getValue: util.getValue,

    /**
     *
     */
    setValue: util.setValue,

    /**
     *
     */
    expand: util.expand,

    /**
     *
     */
    roundNumberTo: util.roundNumberTo,

    /**
     * Utility function to join fields within a Simplate template.
     */
    joinFields: util.joinFields,
    /**
     * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
     * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
     * @return {Object} Object ready to be JSON.stringified.
     */
    sanitizeForJson: util.sanitizeForJson
  });

  exports.default = __class;
  module.exports = exports['default'];
});