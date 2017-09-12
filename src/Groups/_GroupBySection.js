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
import lang from 'dojo/_base/lang';

/**
 * @class argos.Groups._GroupSection
 */
const __class = declare('argos.Groups._GroupBySection', null, /** @lends argos.Groups._GroupSection# */{
  /**
   * @property {String}
   * The unique (within the current form) name of the field
   */
  name: null,
  /**
   * @property {String}
   * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
   */
  displayName: null,
  /**
   * @property {String}
   * The SData property that the field will be bound to.
   */
  groupByProperty: null,
  sortDirection: 'desc',
  sections: null,
  constructor: function constructor(o) {
    lang.mixin(this, o);
  },
  init: function init() {},
  getGroupSection: function getGroupSection(/* entry*/) {},
  getOrderByQuery: function getOrderByQuery() {
    return `${this.groupByProperty} ${this.sortDirection}`;
  },
});

export default __class;
