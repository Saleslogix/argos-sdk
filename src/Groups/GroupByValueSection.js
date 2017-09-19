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
 * @class argos.Groups.GroupByValueSection
 */
import declare from 'dojo/_base/declare';
import Utility from '../Utility';
import _GroupBySection from './_GroupBySection';
import getResource from '../I18n';

const resource = getResource('groupByValueSection');

const __class = declare('argos.Groups.GroupByValueSection', [_GroupBySection], {
  name: 'DateTimeSectionFilter',
  displayNameText: resource.displayNameText,
  width: 0,
  constructor: function constructor(o) {
    this.groupByProperty = o.groupByProperty;
    this.sortDirection = o.sortDirection;
    if (o.width) {
      this.width = o.width;
    }
    this.init();
  },
  init: function init() {
    this.sections = [];
  },
  getSection: function getSection(entry) {
    if ((this.groupByProperty) && (entry)) {
      let value = Utility.getValue(entry, this.groupByProperty);
      value = this._getValueFromWidth(value, this.width);
      if (value) {
        return {
          key: value,
          title: value,
        };
      }
      return this.getDefaultSection();
    }
    return null;
  },
  getDefaultSection: function getDefaultSection() {
    return {
      key: 'Unknown',
      title: 'Unknown',
    };
  },
  _getValueFromWidth: function _getValueFromWidth(value, width) {
    if (value) {
      if (width > 0) {
        return value.toString().substring(0, width);
      }
    }
    return value;
  },
});

export default __class;
