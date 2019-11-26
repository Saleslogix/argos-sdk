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

import declare from 'dojo/_base/declare';
import SelectionModel from './SelectionModel';

/**
 * @class argos.ConfigurableSelectionModel
 * @classdesc The ConfigurableSelectionModel adds the logic to the SelectionModel to only have one item selected at a time via the `singleSelection` flag.
 * @extends argos.SelectionModel
 */
const __class = declare('argos.ConfigurableSelectionModel', [SelectionModel], /** @lends argos.ConfigurableSelectionModel# */{
  /**
   * @property {Boolean}
   * Flag that controls if only one item is selectable at a time. Meaning if this is true
   * then when a selection is made it first {@link SelectionModel#clear clears} the store.
   */
  singleSelection: false,
  /**
   * This function is called in Lists {@link List#beforeTransitionTo beforeTransitionTo} and
   * it is always passed the Lists navigation options `singleSelect`.
   *
   * It then sets the flag `singleSelection` to the value if the passed value.
   *
   * @param {Boolean} val The state that `singleSelection` should be in.
   */
  useSingleSelection: function useSingleSelection(val) {
    if (val && typeof val !== 'undefined' && val !== null) {
      this.singleSelection = true;
    } else {
      this.singleSelection = false;
    }
  },
  /**
   * Extends the base {@link SelectionModel#select select} by first clearing out the entire
   * store if `singleSelection` is true and there are items already in the store.
   * @param {String} key Unique identifier string
   * @param {Object} data The item being selected
   * @param tag
   */
  select: function select(key/* , data, tag*/) {
    if (this.singleSelection) {
      if (!this.isSelected(key) || (this.count >= 1)) {
        this.clear();
      }
    }

    this.inherited(select, arguments);
  },
});

export default __class;
