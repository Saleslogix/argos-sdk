define('argos/Store/SData', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/Deferred', 'dojo/store/util/QueryResults', '../Convert', '../Utility'], function (module, exports, _declare, _lang, _Deferred, _QueryResults, _Convert, _Utility) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _QueryResults2 = _interopRequireDefault(_QueryResults);

  var _Convert2 = _interopRequireDefault(_Convert);

  var _Utility2 = _interopRequireDefault(_Utility);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Store/SData
   * @classdesc SData is an extension of dojo.store that is tailored to handling SData parameters, requests,
   * and pre-handling the responses.
   */
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
   * @module argos/Store/SData
   */
  const __class = (0, _declare2.default)('argos.Store.SData', null, /** @lends module:argos/Store/SData.prototype */{
    doDateConversion: false,

    /* todo: is this the appropriate name for the expansion scope? */
    scope: null,
    where: null,
    select: null,
    include: null,
    orderBy: null,
    service: null,
    request: null,
    queryName: null,
    queryArgs: null,
    entityName: null,
    contractName: null,
    resourceKind: null,
    resourceProperty: null,
    resourcePredicate: null,
    applicationName: null,
    dataSet: null,
    executeQueryAs: null,
    executeGetAs: null,

    itemsProperty: '$resources',
    idProperty: '$key',
    labelProperty: '$descriptor',
    entityProperty: '$name',
    versionProperty: '$etag',

    /**
     * @constructs
     */
    constructor: function constructor(props) {
      _lang2.default.mixin(this, props);
    },
    _createRemoveRequest: function createRemoveRequest(object) {
      const request = new Sage.SData.Client.SDataSingleResourceRequest(this.service);
      let id = object && object.$key;

      id = id || _Utility2.default.expand(this.scope || this.resourcePredicate);

      if (/(\s+)/.test(id)) {
        request.setResourceSelector(id);
      } else {
        request.setResourceSelector(`'${id}'`);
      }
      if (this.resourceKind) {
        request.setResourceKind(this.resourceKind);
      }
      if (this.contractName) {
        request.setContractName(this.contractName);
      }

      return request;
    },
    _createEntryRequest: function _createEntryRequest(identity, getOptions) {
      let request = _Utility2.default.expand(this, getOptions.request || this.request);
      let id = identity;
      if (request) {
        request = request.clone();
      } else {
        id = id || _Utility2.default.expand(this.scope || this, getOptions.resourcePredicate || this.resourcePredicate);

        const contractName = _Utility2.default.expand(this.scope || this, getOptions.contractName || this.contractName);
        const resourceKind = _Utility2.default.expand(this.scope || this, getOptions.resourceKind || this.resourceKind);
        const dataSet = _Utility2.default.expand(this.scope || this, getOptions.dataSet || this.dataSet);
        const resourceProperty = _Utility2.default.expand(this.scope || this, getOptions.resourceProperty || this.resourceProperty);
        let resourcePredicate;

        if (id) {
          resourcePredicate = /\s+/.test(id) ? id : `'${id}'`;
        }

        if (resourceProperty) {
          request = new Sage.SData.Client.SDataResourcePropertyRequest(this.service).setResourceProperty(resourceProperty).setResourceSelector(resourcePredicate);
        } else {
          request = new Sage.SData.Client.SDataSingleResourceRequest(this.service).setResourceSelector(resourcePredicate);
        }

        if (contractName) {
          request.setContractName(contractName);
        }

        if (resourceKind) {
          request.setResourceKind(resourceKind);
        }

        if (dataSet) {
          request.setDataSet(dataSet);
        }
      }

      const select = _Utility2.default.expand(this.scope || this, getOptions.select || this.select);
      const include = _Utility2.default.expand(this.scope || this, getOptions.include || this.include);

      if (select && select.length > 0) {
        request.setQueryArg('select', select.join(','));
      }

      if (include && include.length > 0) {
        request.setQueryArg('include', include.join(','));
      }

      return request;
    },
    _createFeedRequest: function _createFeedRequest(q, queryOptions) {
      let request = _Utility2.default.expand(this, queryOptions.request || this.request);
      if (request) {
        request = request.clone();
      } else {
        const queryName = _Utility2.default.expand(this.scope || this, queryOptions.queryName || this.queryName);
        const contractName = _Utility2.default.expand(this.scope || this, queryOptions.contractName || this.contractName);
        const resourceKind = _Utility2.default.expand(this.scope || this, queryOptions.resourceKind || this.resourceKind);
        const resourceProperty = _Utility2.default.expand(this.scope || this, queryOptions.resourceProperty || this.resourceProperty);
        const resourcePredicate = _Utility2.default.expand(this.scope || this, queryOptions.resourcePredicate || this.resourcePredicate);
        const applicationName = _Utility2.default.expand(this.scope || this, queryOptions.applicationName || this.applicationName);
        const dataSet = _Utility2.default.expand(this.scope || this, queryOptions.dataSet || this.dataSet);
        const queryArgs = _Utility2.default.expand(this.scope || this, queryOptions.queryArgs || this.queryArgs);

        if (queryName) {
          request = new Sage.SData.Client.SDataNamedQueryRequest(this.service).setQueryName(queryName);

          if (resourcePredicate) {
            request.getUri().setCollectionPredicate(resourcePredicate);
          }
        } else if (resourceProperty) {
          request = new Sage.SData.Client.SDataResourcePropertyRequest(this.service).setResourceProperty(resourceProperty).setResourceSelector(resourcePredicate);
        } else {
          request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service);
        }

        if (contractName) {
          request.setContractName(contractName);
        }

        if (resourceKind) {
          request.setResourceKind(resourceKind);
        }

        if (applicationName) {
          request.setApplicationName(applicationName);
        }

        if (dataSet) {
          request.setDataSet(dataSet);
        }

        if (queryArgs) {
          for (const arg in queryArgs) {
            if (queryArgs.hasOwnProperty(arg)) {
              request.setQueryArg(arg, queryArgs[arg]);
            }
          }
        }
      }

      const select = _Utility2.default.expand(this.scope || this, queryOptions.select || this.select);
      const include = _Utility2.default.expand(this.scope || this, queryOptions.include || this.include);
      const orderBy = _Utility2.default.expand(this.scope || this, queryOptions.sort || this.orderBy);

      if (select && select.length > 0) {
        request.setQueryArg('select', select.join(','));
      }

      if (include && include.length > 0) {
        request.setQueryArg('include', include.join(','));
      }

      if (orderBy) {
        if (typeof orderBy === 'string') {
          request.setQueryArg('orderby', orderBy);
        } else if (orderBy.length > 0) {
          const order = [];
          orderBy.forEach(function forEach(v) {
            if (v.descending) {
              this.push(`${v.attribute} desc`);
            } else {
              this.push(v.attribute);
            }
          }, order);

          request.setQueryArg('orderby', order.join(','));
        }
      }

      const where = _Utility2.default.expand(this.scope || this, queryOptions.where || this.where);
      const conditions = [];

      if (where) {
        conditions.push(where);
      }

      const query = _Utility2.default.expand(this.scope || this, q);

      if (query) {
        conditions.push(query);
      }

      if (conditions.length > 0) {
        request.setQueryArg('where', `(${conditions.join(') and (')})`);
      }

      if (typeof queryOptions.start !== 'undefined') {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.StartIndex, queryOptions.start + 1);
      }

      if (typeof queryOptions.count !== 'undefined') {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Count, queryOptions.count);
      }

      return request;
    },
    _onCancel: function _onCancel() /* deferred*/{},
    _onRequestFeedSuccess: function _onRequestFeedSuccess(queryDeferred, feed) {
      if (feed) {
        const items = _lang2.default.getObject(this.itemsProperty, false, feed);
        const total = typeof feed.$totalResults === 'number' ? feed.$totalResults : -1;

        queryDeferred.total = total;
        queryDeferred.resolve(items);
      } else {
        const error = new Error('The feed result is invalid.');
        queryDeferred.reject(error);
      }
    },
    _onRequestEntrySuccess: function _onRequestEntrySuccess(deferred, entry) {
      if (entry) {
        deferred.resolve(this.doDateConversion ? this._handleDateConversion(entry) : entry);
      } else {
        const error = new Error('The entry result is invalid.');
        deferred.reject(error);
      }
    },
    _onRequestFailure: function _onRequestFailure(deferred, xhr, xhrOptions) {
      const error = new Error(`An error occurred requesting: ${xhrOptions.url}`);

      error.xhr = xhr;
      error.status = xhr.status;
      error.aborted = false;
      error.url = xhrOptions.url;

      deferred.reject(error);
    },
    _onRequestAbort: function _onRequestAbort(deferred, xhr, xhrOptions) {
      const error = new Error(`An error occurred requesting: ${xhrOptions.url}`);

      error.xhr = xhr;
      error.status = 0;
      error.responseText = null;
      error.aborted = true;

      deferred.reject(error);
    },
    _handleDateConversion: function _handleDateConversion(entry) {
      for (const prop in entry) {
        if (_Convert2.default.isDateString(entry[prop])) {
          entry[prop] = _Convert2.default.toDateFromString(entry[prop]);
        }
      }

      return entry;
    },
    get: function get(id, getOptions /* sdata only */) {
      const handle = {};
      const deferred = new _Deferred2.default();
      const request = this._createEntryRequest(id, getOptions || {});
      const method = this.executeGetAs ? request[this.executeGetAs] : request.read;

      handle.value = method.call(request, {
        success: this._onRequestEntrySuccess.bind(this, deferred),
        failure: this._onRequestFailure.bind(this, deferred),
        aborted: this._onRequestAbort.bind(this, deferred)
      });

      return deferred;
    },
    /**
     * Returns an object's identity using this.idProperty
     * @param {Object} object The object to get the identity from
     * @returns {String|Number}
     */
    getIdentity: function getIdentity(object) {
      return _lang2.default.getObject(this.idProperty, false, object);
    },
    /**
     * Returns an object's label using this.labelProperty
     * @param {Object} object The object to get the label from
     * @returns {String}
     */
    getLabel: function getLabel(object) {
      return _lang2.default.getObject(this.labelProperty, false, object);
    },
    /**
     * Returns an object's entity using this.entityProperty
     * @param {Object} object The object to get the entity from
     * @returns {String|Object}
     */
    getEntity: function getEntity(object) {
      return _lang2.default.getObject(this.entityProperty, false, object);
    },
    /**
     * Returns an object's version using this.versionProperty
     * @param {Object} object The object to get the version from
     * @returns {String}
     */
    getVersion: function getVersion(object) {
      return _lang2.default.getObject(this.versionProperty, false, object);
    },
    /**
     * Stores an object.
     * @param {Object} object The object to store.
     * @param {Object} putOptions Additional directives for storing objects.
     * @param {String|Number} putOptions.id
     * @param {String|Object} putOptions.entity
     * @param {String} putOptions.version
     * @param {Boolean} putOptions.overwrite
     * @returns {String|Number}
     */
    put: function put(object, putOptions = {}) {
      const id = putOptions.id || this.getIdentity(object);
      const entity = putOptions.entity || this.entityName;
      const version = putOptions.version || this.getVersion(object);
      const atom = !this.service.isJsonEnabled();

      if (id) {
        object.$key = id;
      }

      if (entity && atom) {
        object.$name = entity;
      }

      if (version) {
        object.$etag = version;
      }

      const handle = {};
      const deferred = new _Deferred2.default();
      const request = this._createEntryRequest(id, putOptions);
      const method = putOptions.overwrite ? request.update : request.create;

      handle.value = method.call(request, object, {
        success: this._onTransmitEntrySuccess.bind(this, deferred),
        failure: this._onRequestFailure.bind(this, deferred),
        aborted: this._onRequestAbort.bind(this, deferred)
      });

      return deferred;
    },
    _onTransmitEntrySuccess: function _onTransmitEntrySuccess(deferred, entry) {
      deferred.resolve(this.doDateConversion ? this._handleDateConversion(entry) : entry);
    },
    /**
     * Creates an object, throws an error if the object already exists.
     * @param {Object} object The object to store
     * @param {Object} addOptions Additional directives for creating objects
     * @param {Boolean} addOptions.overwrite
     */
    add: function add(object, addOptions = {}) {
      addOptions.overwrite = false;
      return this.put(object, addOptions);
    },

    /**
     * Deletes an entry
     *
     * @param {Object} entry The entry to be removed.
     * @param {Object} removeOptions additional directives for removing options.
     *
     */
    remove: function remove(object) {
      const request = this._createRemoveRequest(object);
      const handle = {};
      const deferred = new _Deferred2.default();
      const method = request.delete;

      handle.value = method.call(request, object, {
        success: this._onTransmitEntrySuccess.bind(this, deferred),
        failure: this._onRequestFailure.bind(this, deferred),
        aborted: this._onRequestAbort.bind(this, deferred)
      });

      return deferred;
    },
    /**
     * Queries the store for objects. This does not alter the store, but returns a
     * set of data from the store.
     *
     * @param {String|Object|Function} query The query to use for retrieving objects from the store.
     * @param {Object} queryOptions
     * @returns {dojo.store.api.Store.QueryResults}
     *
     */
    query: function query(q, queryOptions) {
      const handle = {};
      const queryDeferred = new _Deferred2.default(this._onCancel.bind(this, handle));
      const request = this._createFeedRequest(q, queryOptions || {});

      queryDeferred.total = -1;
      const options = {
        success: this._onRequestFeedSuccess.bind(this, queryDeferred),
        failure: this._onRequestFailure.bind(this, queryDeferred),
        aborted: this._onRequestAbort.bind(this, queryDeferred),
        httpMethodOverride: queryOptions && queryOptions.httpMethodOverride
      };

      let method = request.read;
      if (this.executeQueryAs) {
        method = request[this.executeQueryAs];
      } else if (request instanceof Sage.SData.Client.SDataResourcePropertyRequest) {
        method = request.readFeed;
      } else if (request instanceof Sage.SData.Client.SDataServiceOperationRequest) {
        method = request.execute;
        handle.value = method.call(request, this.entry, options);
        return (0, _QueryResults2.default)(queryDeferred); // eslint-disable-line
      }

      handle.value = method.call(request, options);
      return (0, _QueryResults2.default)(queryDeferred); // eslint-disable-line
    },
    /**
     * Not implemented in this store.
     */
    transaction: function transaction() {},
    /**
     * Not implemented in this store.
     */
    getChildren: function getChildren() /* parent, options*/{},
    /**
     * Returns any metadata about the object. This may include attribution,
     * cache directives, history, or version information.
     *
     * @param {Object} object The object to return metadata for.
     * @return {Object} Object containing the metadata.
     * @return {String|Number} return.id
     * @return {String} return.label
     * @return {String|Object} return.entity
     * @return {String} return.version
     */
    getMetadata: function getMetadata(object) {
      if (object) {
        return {
          id: this.getIdentity(object),
          label: this.getLabel(object),
          entity: this.getEntity(object),
          version: this.getVersion(object)
        };
      }

      return null;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});