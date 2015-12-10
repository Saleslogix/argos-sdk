/* Copyright (c) 2014 Infor. All rights reserved.
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
import Evented from 'dojo/Evented';
import Stateful from 'dojo/Stateful';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';

/**
 * @class argos.Models._ModelBase
 * A base model class for views to consume
 * @alternateClassName _ModelBase
 */
export default declare('argos.Models._ModelBase', [Evented, Stateful, _CustomizationMixin], {
  app: null,
  resourceKind: null,
  itemsProperty: '$resources',
  idProperty: '$key',
  labelProperty: '$descriptor',
  entityProperty: '$name',
  versionProperty: '$etag',
  entityName: 'Entity',
  entityDisplayName: 'Entity',
  entityDisplayNamePlural: 'Entities',
  modelName: null,
  modelType: null,
  iconClass: 'fa fa-cloud fa-2x',
  detailViewId: null,
  listViewId: null,
  editViewId: null,
  relationships: null,
  createRelationships: function createRelationships() {
    return [];
  },
  _appGetter: function _appGetter() {
    return this.app || window.App;
  },
  _appSetter: function _appSetter(value) {
    this.app = value;
  },

  /**
   * Initializes the model with options.
   * @param options
   */
  init: function init() {
    this.relationships = this.relationships || this._createCustomizedLayout(this.createRelationships(), 'relationships');
  },
  getEntry: function getEntry(options) { // eslint-disable-line
  },
  getEntries: function getEntries(query, options) { // eslint-disable-line
  },
  insertEntry: function insertEntry(entry, options) {// eslint-disable-line
  },
  updateEntry: function updateEntry(entry, options) { // eslint-disable-line
  },
  deleteEntry: function deleteEntry(entry, options) { // eslint-disable-line
  },
  saveEntry: function saveEntry(entry, options) { // eslint-disable-line
  },
  getIconClass: function getIconClass() {
    return this.iconClass;
  },
  getEntityDescription: function getEntityDescription(entry) {
    return utility.getValue(entry, this.labelProperty);
  },
  getEntityId: function getEntityId(entry) {
    return utility.getValue(entry, this.idProperty);
  },
  buildQueryExpression: function buildQueryExpression(query, options) { // eslint-disable-line
  },
  buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) { // eslint-disable-line
  },
});
