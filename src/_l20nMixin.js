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
import declare from 'dojo/_base/declare';

/**
 * @class argos._Templated
 * _Templated serves as an override for dijit Widgets to enable the use of
 * Simplates for templates it also holds the function to pull the resource strings from l20n.
 *
 * @alternateClassName _Templated
 */
const __class = declare('argos._l20nMixin', null, {
  /**
   * Localization ID for identifying the objects needed strings
   */
  localeId: '',

  constructor: function constructor() {
    this.loadStrings();
  },
  /**
   * Loads the views strings from l20n
   */
  loadStrings: function loadStrings() {
    if (window.localeContext) {
      const entity = window.localeContext.getEntitySync(this.localeId);
      for (const attribute in entity.attributes) {
        if (entity.attributes.hasOwnProperty(attribute)) {
          this[attribute] = entity.attributes[attribute];
        }
      }
    }
  },
});

export default __class;
