/* Copyright (c) 2015 Infor. All rights reserved.
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
import SDataStore from './Store/SData';


/**
 * @class argos._SDataModeMixin
 * A mixin that provides SData specific methods and properties
 * @alternateClassName _SDataModelMixin
 */
export default declare('argos._SDataModelMixin',null, {
 
  /**
   * @cfg {String} resourceKind
   * The SData resource kind the view is responsible for.  This will be used as the default resource kind
   * for all SData requests.
   */
  resourceKind: '',
  /**
   * @cfg {String[]}
   * A list of fields to be selected in an SData request.
   */
  querySelect: [],
  /**
   * @cfg {String[]?}
   * A list of child properties to be included in an SData request.
   */
  queryInclude: [],
  /**
   * @cfg {String?/Function?}
   * The default resource property for an SData request.
   */
  resourceProperty: null,
  /**
   * @cfg {String?/Function?}
   * The default resource predicate for an SData request.
   */
  resourcePredicate: null,

  itemsProperty: '$resources',
  idProperty: '$key',
  labelProperty: '$descriptor',
  entityProperty: '$name',
  versionProperty: '$etag',
  /**
   * Initializes the model with options that are SData specific.
   * @param options
   */
  init: function(options){
    if(options){
      if (options.resourceKind) {
        this.resourceKind = options.resourceKind;
      }

      if (options.querySelect) {
        if (!this.querySelect) {
          this.querySelect = [];
        }

        this.querySelect.concat(options.querySelect);
      }

      if (options.queryInclude) {
        if (!this.queryInclude) {
          this.queryInclude = [];
        }

        this.queryInclude.concat(options.queryInclude);
      }

      if (options.resourceProperty) {
        this.resourceProperty = options.resourceProperty;
      }

      if (options.resourcePredicate) {
        this.resourcePredicate = options.resourcePredicate;
      }
    }  
  },
  getOptions: function getOptionsFn(options) {
    const getOptions = {};
    if (options) {
      if (options.select) getOptions.select = options.select;
      if (options.include) getOptions.include = options.include;
      if (options.contractName) getOptions.contractName = options.contractName;
      if (options.resourceKind) getOptions.resourceKind = options.resourceKind;
      if (options.resourceProperty) getOptions.resourceProperty = options.resourceProperty;
      if (options.resourcePredicate) getOptions.resourcePredicate = options.resourcePredicate;
    }

    return getOptions;
  },
  getId: function getId(options) {
    return options && (options.id || options.key);
  }, 
  createStore: function createStore(service) {
    const app = this.get('app');
    return new SDataStore({
      service: service || app.getService(false),
      contractName: this.contractName,
      resourceKind: this.resourceKind,
      resourceProperty: this.resourceProperty,
      resourcePredicate: this.resourcePredicate,
      include: this.queryInclude,
      select: this.querySelect,
      itemsProperty: this.itemsProperty,
      idProperty: this.idProperty,
      labelProperty: this.labelProperty,
      entityProperty: this.entityProperty,
      versionProperty: this.versionProperty,
      scope: this,
    });
  },
  getEntries: function getEntries(query) { // eslint-disable-line
    return {};
  },
  getEntry: function getEntry(options) {
    const store = this.createStore();
    return store.get(this.getId(options), this.getOptions(options));
  },
  insertEntry: function insertEntry(entry, options) {
    const store = this.createStore();
    return store.add(entry, options);
  },
  updateEntry: function updateEntry(entry, options) {
    const store = this.createStore();

    if (!store) {
      throw new Error('No store set.');
    }

    return this.validate(entry).then(function fulfilled() {
      return store.put(entry, options);
    }); // Since we left off the reject handler, it will propagate up if there is a validation error
  },
  /**
   * If an entry is valid, validate should return a promise that resolves to true. If the entry is not valid,
   * validate should return a reject promise with the error message.
   * @param entry
   * @returns Promise
   */
  validate: function validate(entry) {
    const def = new Deferred();
    if (entry) {
      def.resolve(true);
    }

    def.reject('The entry is null or undefined.');
    return def.promise;
  },
});
