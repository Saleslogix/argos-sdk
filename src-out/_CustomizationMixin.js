define('argos/_CustomizationMixin', ['module', 'exports', 'dojo/_base/declare'], function (module, exports, _declare) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var customization = ICRMCustomizationSDK;

  /**
   * @class
   * @alias module:argos/_CustomizationMixin
   * @classdesc Customization Mixin is a general purpose Customization Engine. It takes a customization object and
   * a layout object and applies the customization defined to the layout.
   *
   * A customization object has the following properties:
   *
   * * `at`: `function(item)` - passes the current item in the list, the function should return true if this is the item being modified (or is at where you want to insert something).
   * * `at`: `{Number}` - May optionally define the index of the item instead of a function.
   * * `type`: `{String}` - enum of `insert`, `modify`, `replace` or `remove` that indicates the type of customization.
   * * `where`: `{String}` - enum of `before` or `after` only needed when type is `insert`.
   * * `value`: `{Object}` - the entire object to create (insert or replace) or the values to overwrite (modify), not needed for remove.
   * * `value`: `{Object[]}` - if inserting you may pass an array of items to create.
   *
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
   * @module argos/_CustomizationMixin
   */
  var __class = (0, _declare2.default)('argos._CustomizationMixin', null, /** @lends module:argos/_CustomizationMixin.prototype */{

    /**
     * id of object taking on customizations. In most cases this will be the view's id.
     * @type {String}
     */
    id: null,

    /**
     * Name of customization set
     * @type {String}
     */
    customizationSet: null,

    /**
     * Retrieves registered customizations from a global registry (App)
     * @param customizationSet
     * @param customizationSubSet
     * @param id
     * @private
     */
    _getCustomizationsFor: function _getCustomizationsFor(customizationSet, customizationSubSet, id) {
      var set = customizationSubSet ? customizationSet + '/' + customizationSubSet : customizationSet;
      return App.getCustomizationsFor(set, id);
    },

    /**
     * Applies registered customizations to the given layout.
     * @param {Array} layout
     * @param {String} customizationSubSet
     */
    _createCustomizedLayout: function _createCustomizedLayout(layout, customizationSubSet) {
      var customizations = this._getCustomizationsFor(this.customizationSet, customizationSubSet, this.id);
      if (this.enableCustomizations) {
        return customization.createCustomizedLayout(layout, customizations, this.customizationSet, this.id, customizationSubSet);
      }

      return layout;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});