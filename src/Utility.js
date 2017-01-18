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
import lang from 'dojo/_base/lang';
import { utility as util } from '@infor/icrm-js-common';

/**
 * @class argos.Utility
 * Utility provides functions that are more javascript enhancers than application related code.
 * @alternateClassName Utility
 * @singleton
 */
const __class = lang.setObject('argos.Utility', {
  /**
   * Replaces a single `"` with two `""` for proper SData query expressions.
   * @param {String} searchQuery Search expression to be escaped.
   * @return {String}
   */
  escapeSearchQuery: util.escapeSearchQuery,
  memoize: util.memoize,
  debounce: util.debounce,
  getValue: util.getValue,
  setValue: util.setValue,
  expand: util.expand,
  roundNumberTo: util.roundNumberTo,
  /**
   * @function
   * Utility function to join fields within a Simplate template.
   */
  joinFields: util.joinFields,
  /**
   * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
   * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
   * @return {Object} Object ready to be JSON.stringified.
   */
  sanitizeForJson: util.sanitizeForJson,
});

lang.setObject('Sage.Platform.Mobile.Utility', __class);
export default __class;
