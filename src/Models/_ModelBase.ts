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
const declare = require('dojo/_base/declare');
const Evented = require('dojo/Evented');
const Stateful = require('dojo/Stateful');
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';

/**
 * @class argos.Models._ModelBase
 * A base model class for views to consume
 * @alternateClassName _ModelBase
 */
export default declare('argos.Models._ModelBase', [Evented, Stateful, _CustomizationMixin], {
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
  iconClass: 'fa fa-cloud fa-2x',
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
    return this.app || (window as any).App;
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
  getEntry: function getEntry(options) {
  },
  getEntries: function getEntries(query, options) {
  },
  getPicklists: function getPicklists() {
  },
  insertEntry: function insertEntry(entry, options) {
  },
  updateEntry: function updateEntry(entry, options) {
  },
  deleteEntry: function deleteEntry(entry, options) {
  },
  saveEntry: function saveEntry(entry, options) {
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
  buildQueryExpression: function buildQueryExpression(query, options) {
  },
  buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) {
  },
});
