<<<<<<< HEAD
define('argos/Fields/SelectField', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './LookupField', '../FieldManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _LookupField, _FieldManager) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _LookupField2 = _interopRequireDefault(_LookupField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  /**
   * @class argos.Fields.SelectField
   * The SelectField is a minor extension to te LookupField in that it explicitly hides search and actions.
   *
   * It may also optionally pass the `data` option which a view may optionally use instead of requesting data.
   *
   * ###Example:
   *     {
   *         name: 'State',
   *         property: 'State',
   *         label: this.stateText,
   *         type: 'select',
   *         view: 'state_list'
   *     }
   *
   * @alternateClassName SelectField
   * @extends argos.Fields.LookupField
   * @requires argos.FieldManager
   */
  var control = (0, _declare['default'])('argos.Fields.SelectField', [_LookupField2['default']], {
=======
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

define('argos/Fields/SelectField', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    './LookupField',
    '../FieldManager'
], function(
    declare,
    lang,
    LookupField,
    FieldManager
) {
>>>>>>> develop
    /**
     * @property {Boolean}
     * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
     * the view to use the currentValue instead of a key/descriptor
     */
<<<<<<< HEAD
    valueKeyProperty: false,
    /**
     * @property {Boolean}
     * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
     * the view to use the currentValue instead of a key/descriptor
     */
    valueTextProperty: false,
    /**
     * @property {Object/Object[]/Function}
     * If defined will be expanded (if function) and passed in the navigation options to the lookup view
     */
    data: null,
    /**
     * Overides the {@link LookupField#createNavigationOptions parent implementation} to set search and actions to
     * hidden and optionally pass data defined on the field.
     */
    createNavigationOptions: function createNavigationOptions() {
      var options = this.inherited(arguments);
      options.hideSearch = true;
      options.enableActions = false;
      options.data = this.expandExpression(this.data);
      return options;
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Fields.SelectField', control);
  module.exports = _FieldManager2['default'].register('select', control);
=======
    var control = declare('argos.Fields.SelectField', [LookupField], {
        /**
         * @property {Boolean}
         * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
         * the view to use the currentValue instead of a key/descriptor
         */
        valueKeyProperty: false,
        /**
         * @property {Boolean}
         * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
         * the view to use the currentValue instead of a key/descriptor
         */
        valueTextProperty: false,
        /**
         * @property {Object/Object[]/Function}
         * If defined will be expanded (if function) and passed in the navigation options to the lookup view
         */
        data: null,
        /**
         * Overides the {@link LookupField#createNavigationOptions parent implementation} to set search and actions to
         * hidden and optionally pass data defined on the field.
         */
        createNavigationOptions: function() {
            var options = this.inherited(arguments);
            options.hideSearch = true;
            options.enableActions = false;
            options.data = this.expandExpression(this.data);
            return options;
        }
    });

    lang.setObject('Sage.Platform.Mobile.Fields.SelectField', control);
    return FieldManager.register('select', control);
>>>>>>> develop
});
