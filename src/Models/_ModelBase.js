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
 * @module argos/Models/_ModelBase
 */
import declare from 'dojo/_base/declare';
import Evented from 'dojo/Evented';
import Stateful from 'dojo/Stateful';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';

/**
 * @class
 * @alias module:argos/Models/_ModelBase
 * @extends module:argos/_CustomizationMixin
 */
export default declare('argos.Models._ModelBase', [Evented, Stateful, _CustomizationMixin], /** @lends module:argos/Models/_ModelBase.prototype */{
  id: null,
  customizationSet: 'models',
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
  /**
   * @cfg {Boolean}
   * Enables the use of the customization engine on this model instance
   */
  enableCustomizations: true,
  modelName: null,
  modelType: null,
  iconClass: 'url',
  picklists: null,
  detailViewId: null,
  listViewId: null,
  editViewId: null,
  relationships: null,
  createRelationships: function createRelationships() {
    return [];
  },
  createPicklists: function createPicklists() {
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
    this.picklists = this.picklists || this._createCustomizedLayout(this.createPicklists(), 'picklists');
    this.getPicklists();
  },
  getEntry: function getEntry(options) { // eslint-disable-line
  },
  getEntries: function getEntries(query, options) { // eslint-disable-line
  },
  getPicklists: function getPicklists() {
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
  getPicklistNameByProperty: function getPicklistNameByProperty(property) {
    const picklist = this.picklists.find(pl => pl.property === property);
    return (picklist && picklist.name) || null;
  },
  buildQueryExpression: function buildQueryExpression(query, options) { // eslint-disable-line
  },
  buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) { // eslint-disable-line
  },
});
