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
 * @class argos._CustomizationMixin
 * Customization Mixin is a general purpose Customization Engine. It takes a customization object and
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
 * @alternateClassName _CustomizationMixin
 */
import declare from 'dojo/_base/declare';
import * as customization from '@infor/icrm-js-customization';

const __class = declare('argos._CustomizationMixin', null, {
  id: null,
  customizationSet: null,

  _getCustomizationsFor: function _getCustomizationsFor(customizationSet, customizationSubSet, id) {
    const set = customizationSubSet ? `${customizationSet}/${customizationSubSet}` : customizationSet;
    return App.getCustomizationsFor(set, id);
  },
  _createCustomizedLayout: function _createCustomizedLayout(layout, customizationSubSet) {
    const customizations = this._getCustomizationsFor(this.customizationSet, customizationSubSet, this.id);
    if (this.enableCustomizations) {
      return customization.createCustomizedLayout(layout, customizations, this.customizationSet, this.id, customizationSubSet);
    }

    return layout;
  },
});

export default __class;
