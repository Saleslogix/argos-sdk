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
   * @class argos.Store.SData
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

  var __class = (0, _declare2.default)('argos.Store.SData', null, /** @lends argos.Store.SData# */{
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
      var request = new Sage.SData.Client.SDataSingleResourceRequest(this.service);
      var id = object && object.$key;

      id = id || _Utility2.default.expand(this.scope || this.resourcePredicate);

      if (/(\s+)/.test(id)) {
        request.setResourceSelector(id);
      } else {
        request.setResourceSelector('\'' + id + '\'');
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
      var request = _Utility2.default.expand(this, getOptions.request || this.request);
      var id = identity;
      if (request) {
        request = request.clone();
      } else {
        id = id || _Utility2.default.expand(this.scope || this, getOptions.resourcePredicate || this.resourcePredicate);

        var contractName = _Utility2.default.expand(this.scope || this, getOptions.contractName || this.contractName);
        var resourceKind = _Utility2.default.expand(this.scope || this, getOptions.resourceKind || this.resourceKind);
        var dataSet = _Utility2.default.expand(this.scope || this, getOptions.dataSet || this.dataSet);
        var resourceProperty = _Utility2.default.expand(this.scope || this, getOptions.resourceProperty || this.resourceProperty);
        var resourcePredicate = void 0;

        if (id) {
          resourcePredicate = /\s+/.test(id) ? id : '\'' + id + '\'';
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

      var select = _Utility2.default.expand(this.scope || this, getOptions.select || this.select);
      var include = _Utility2.default.expand(this.scope || this, getOptions.include || this.include);

      if (select && select.length > 0) {
        request.setQueryArg('select', select.join(','));
      }

      if (include && include.length > 0) {
        request.setQueryArg('include', include.join(','));
      }

      return request;
    },
    _createFeedRequest: function _createFeedRequest(q, queryOptions) {
      var request = _Utility2.default.expand(this, queryOptions.request || this.request);
      if (request) {
        request = request.clone();
      } else {
        var queryName = _Utility2.default.expand(this.scope || this, queryOptions.queryName || this.queryName);
        var contractName = _Utility2.default.expand(this.scope || this, queryOptions.contractName || this.contractName);
        var resourceKind = _Utility2.default.expand(this.scope || this, queryOptions.resourceKind || this.resourceKind);
        var resourceProperty = _Utility2.default.expand(this.scope || this, queryOptions.resourceProperty || this.resourceProperty);
        var resourcePredicate = _Utility2.default.expand(this.scope || this, queryOptions.resourcePredicate || this.resourcePredicate);
        var applicationName = _Utility2.default.expand(this.scope || this, queryOptions.applicationName || this.applicationName);
        var dataSet = _Utility2.default.expand(this.scope || this, queryOptions.dataSet || this.dataSet);
        var queryArgs = _Utility2.default.expand(this.scope || this, queryOptions.queryArgs || this.queryArgs);

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
          for (var arg in queryArgs) {
            if (queryArgs.hasOwnProperty(arg)) {
              request.setQueryArg(arg, queryArgs[arg]);
            }
          }
        }
      }

      var select = _Utility2.default.expand(this.scope || this, queryOptions.select || this.select);
      var include = _Utility2.default.expand(this.scope || this, queryOptions.include || this.include);
      var orderBy = _Utility2.default.expand(this.scope || this, queryOptions.sort || this.orderBy);

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
          var order = [];
          orderBy.forEach(function forEach(v) {
            if (v.descending) {
              this.push(v.attribute + ' desc');
            } else {
              this.push(v.attribute);
            }
          }, order);

          request.setQueryArg('orderby', order.join(','));
        }
      }

      var where = _Utility2.default.expand(this.scope || this, queryOptions.where || this.where);
      var conditions = [];

      if (where) {
        conditions.push(where);
      }

      var query = _Utility2.default.expand(this.scope || this, q);

      if (query) {
        conditions.push(query);
      }

      if (conditions.length > 0) {
        request.setQueryArg('where', '(' + conditions.join(') and (') + ')');
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
        var items = _lang2.default.getObject(this.itemsProperty, false, feed);
        var total = typeof feed.$totalResults === 'number' ? feed.$totalResults : -1;

        queryDeferred.total = total;
        queryDeferred.resolve(items);
      } else {
        var error = new Error('The feed result is invalid.');
        queryDeferred.reject(error);
      }
    },
    _onRequestEntrySuccess: function _onRequestEntrySuccess(deferred, entry) {
      if (entry) {
        deferred.resolve(this.doDateConversion ? this._handleDateConversion(entry) : entry);
      } else {
        var error = new Error('The entry result is invalid.');
        deferred.reject(error);
      }
    },
    _onRequestFailure: function _onRequestFailure(deferred, xhr, xhrOptions) {
      var error = new Error('An error occurred requesting: ' + xhrOptions.url);

      error.xhr = xhr;
      error.status = xhr.status;
      error.aborted = false;
      error.url = xhrOptions.url;

      deferred.reject(error);
    },
    _onRequestAbort: function _onRequestAbort(deferred, xhr, xhrOptions) {
      var error = new Error('An error occurred requesting: ' + xhrOptions.url);

      error.xhr = xhr;
      error.status = 0;
      error.responseText = null;
      error.aborted = true;

      deferred.reject(error);
    },
    _handleDateConversion: function _handleDateConversion(entry) {
      for (var prop in entry) {
        if (_Convert2.default.isDateString(entry[prop])) {
          entry[prop] = _Convert2.default.toDateFromString(entry[prop]);
        }
      }

      return entry;
    },
    get: function get(id, getOptions /* sdata only */) {
      var handle = {};
      var deferred = new _Deferred2.default();
      var request = this._createEntryRequest(id, getOptions || {});
      var method = this.executeGetAs ? request[this.executeGetAs] : request.read;

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
    put: function put(object) {
      var putOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var id = putOptions.id || this.getIdentity(object);
      var entity = putOptions.entity || this.entityName;
      var version = putOptions.version || this.getVersion(object);
      var atom = !this.service.isJsonEnabled();

      if (id) {
        object.$key = id;
      }

      if (entity && atom) {
        object.$name = entity;
      }

      if (version) {
        object.$etag = version;
      }

      var handle = {};
      var deferred = new _Deferred2.default();
      var request = this._createEntryRequest(id, putOptions);
      var method = putOptions.overwrite ? request.update : request.create;

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
    add: function add(object) {
      var addOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
      var request = this._createRemoveRequest(object);
      var handle = {};
      var deferred = new _Deferred2.default();
      var method = request.delete;

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
      var handle = {};
      var queryDeferred = new _Deferred2.default(this._onCancel.bind(this, handle));
      var request = this._createFeedRequest(q, queryOptions || {});

      queryDeferred.total = -1;
      var options = {
        success: this._onRequestFeedSuccess.bind(this, queryDeferred),
        failure: this._onRequestFailure.bind(this, queryDeferred),
        aborted: this._onRequestAbort.bind(this, queryDeferred),
        httpMethodOverride: queryOptions && queryOptions.httpMethodOverride
      };

      var method = request.read;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdG9yZS9TRGF0YS5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwiZG9EYXRlQ29udmVyc2lvbiIsInNjb3BlIiwid2hlcmUiLCJzZWxlY3QiLCJpbmNsdWRlIiwib3JkZXJCeSIsInNlcnZpY2UiLCJyZXF1ZXN0IiwicXVlcnlOYW1lIiwicXVlcnlBcmdzIiwiZW50aXR5TmFtZSIsImNvbnRyYWN0TmFtZSIsInJlc291cmNlS2luZCIsInJlc291cmNlUHJvcGVydHkiLCJyZXNvdXJjZVByZWRpY2F0ZSIsImFwcGxpY2F0aW9uTmFtZSIsImRhdGFTZXQiLCJleGVjdXRlUXVlcnlBcyIsImV4ZWN1dGVHZXRBcyIsIml0ZW1zUHJvcGVydHkiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImVudGl0eVByb3BlcnR5IiwidmVyc2lvblByb3BlcnR5IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsIm1peGluIiwiX2NyZWF0ZVJlbW92ZVJlcXVlc3QiLCJjcmVhdGVSZW1vdmVSZXF1ZXN0Iiwib2JqZWN0IiwiU2FnZSIsIlNEYXRhIiwiQ2xpZW50IiwiU0RhdGFTaW5nbGVSZXNvdXJjZVJlcXVlc3QiLCJpZCIsIiRrZXkiLCJleHBhbmQiLCJ0ZXN0Iiwic2V0UmVzb3VyY2VTZWxlY3RvciIsInNldFJlc291cmNlS2luZCIsInNldENvbnRyYWN0TmFtZSIsIl9jcmVhdGVFbnRyeVJlcXVlc3QiLCJpZGVudGl0eSIsImdldE9wdGlvbnMiLCJjbG9uZSIsIlNEYXRhUmVzb3VyY2VQcm9wZXJ0eVJlcXVlc3QiLCJzZXRSZXNvdXJjZVByb3BlcnR5Iiwic2V0RGF0YVNldCIsImxlbmd0aCIsInNldFF1ZXJ5QXJnIiwiam9pbiIsIl9jcmVhdGVGZWVkUmVxdWVzdCIsInEiLCJxdWVyeU9wdGlvbnMiLCJTRGF0YU5hbWVkUXVlcnlSZXF1ZXN0Iiwic2V0UXVlcnlOYW1lIiwiZ2V0VXJpIiwic2V0Q29sbGVjdGlvblByZWRpY2F0ZSIsIlNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCIsInNldEFwcGxpY2F0aW9uTmFtZSIsImFyZyIsImhhc093blByb3BlcnR5Iiwic29ydCIsIm9yZGVyIiwiZm9yRWFjaCIsInYiLCJkZXNjZW5kaW5nIiwicHVzaCIsImF0dHJpYnV0ZSIsImNvbmRpdGlvbnMiLCJxdWVyeSIsInN0YXJ0IiwiU0RhdGFVcmkiLCJRdWVyeUFyZ05hbWVzIiwiU3RhcnRJbmRleCIsImNvdW50IiwiQ291bnQiLCJfb25DYW5jZWwiLCJfb25SZXF1ZXN0RmVlZFN1Y2Nlc3MiLCJxdWVyeURlZmVycmVkIiwiZmVlZCIsIml0ZW1zIiwiZ2V0T2JqZWN0IiwidG90YWwiLCIkdG90YWxSZXN1bHRzIiwicmVzb2x2ZSIsImVycm9yIiwiRXJyb3IiLCJyZWplY3QiLCJfb25SZXF1ZXN0RW50cnlTdWNjZXNzIiwiZGVmZXJyZWQiLCJlbnRyeSIsIl9oYW5kbGVEYXRlQ29udmVyc2lvbiIsIl9vblJlcXVlc3RGYWlsdXJlIiwieGhyIiwieGhyT3B0aW9ucyIsInVybCIsInN0YXR1cyIsImFib3J0ZWQiLCJfb25SZXF1ZXN0QWJvcnQiLCJyZXNwb25zZVRleHQiLCJwcm9wIiwiaXNEYXRlU3RyaW5nIiwidG9EYXRlRnJvbVN0cmluZyIsImdldCIsImhhbmRsZSIsIm1ldGhvZCIsInJlYWQiLCJ2YWx1ZSIsImNhbGwiLCJzdWNjZXNzIiwiYmluZCIsImZhaWx1cmUiLCJnZXRJZGVudGl0eSIsImdldExhYmVsIiwiZ2V0RW50aXR5IiwiZ2V0VmVyc2lvbiIsInB1dCIsInB1dE9wdGlvbnMiLCJlbnRpdHkiLCJ2ZXJzaW9uIiwiYXRvbSIsImlzSnNvbkVuYWJsZWQiLCIkbmFtZSIsIiRldGFnIiwib3ZlcndyaXRlIiwidXBkYXRlIiwiY3JlYXRlIiwiX29uVHJhbnNtaXRFbnRyeVN1Y2Nlc3MiLCJhZGQiLCJhZGRPcHRpb25zIiwicmVtb3ZlIiwiZGVsZXRlIiwib3B0aW9ucyIsImh0dHBNZXRob2RPdmVycmlkZSIsInJlYWRGZWVkIiwiU0RhdGFTZXJ2aWNlT3BlcmF0aW9uUmVxdWVzdCIsImV4ZWN1dGUiLCJ0cmFuc2FjdGlvbiIsImdldENoaWxkcmVuIiwiZ2V0TWV0YWRhdGEiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkE7Ozs7O0FBdEJBOzs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTUEsVUFBVSx1QkFBUSxtQkFBUixFQUE2QixJQUE3QixFQUFtQyxnQ0FBaUM7QUFDbEZDLHNCQUFrQixLQURnRTs7QUFHbEY7QUFDQUMsV0FBTyxJQUoyRTtBQUtsRkMsV0FBTyxJQUwyRTtBQU1sRkMsWUFBUSxJQU4wRTtBQU9sRkMsYUFBUyxJQVB5RTtBQVFsRkMsYUFBUyxJQVJ5RTtBQVNsRkMsYUFBUyxJQVR5RTtBQVVsRkMsYUFBUyxJQVZ5RTtBQVdsRkMsZUFBVyxJQVh1RTtBQVlsRkMsZUFBVyxJQVp1RTtBQWFsRkMsZ0JBQVksSUFic0U7QUFjbEZDLGtCQUFjLElBZG9FO0FBZWxGQyxrQkFBYyxJQWZvRTtBQWdCbEZDLHNCQUFrQixJQWhCZ0U7QUFpQmxGQyx1QkFBbUIsSUFqQitEO0FBa0JsRkMscUJBQWlCLElBbEJpRTtBQW1CbEZDLGFBQVMsSUFuQnlFO0FBb0JsRkMsb0JBQWdCLElBcEJrRTtBQXFCbEZDLGtCQUFjLElBckJvRTs7QUF1QmxGQyxtQkFBZSxZQXZCbUU7QUF3QmxGQyxnQkFBWSxNQXhCc0U7QUF5QmxGQyxtQkFBZSxhQXpCbUU7QUEwQmxGQyxvQkFBZ0IsT0ExQmtFO0FBMkJsRkMscUJBQWlCLE9BM0JpRTs7QUE2QmxGOzs7QUFHQUMsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDdkMscUJBQUtDLEtBQUwsQ0FBVyxJQUFYLEVBQWlCRCxLQUFqQjtBQUNELEtBbENpRjtBQW1DbEZFLDBCQUFzQixTQUFTQyxtQkFBVCxDQUE2QkMsTUFBN0IsRUFBcUM7QUFDekQsVUFBTXRCLFVBQVUsSUFBSXVCLEtBQUtDLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkMsMEJBQXRCLENBQWlE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QUFULEdBQXFCLG9CQUFzQixDQUFFLENBamJ3QjtBQWtibEY7Ozs7Ozs7Ozs7O0FBV0FDLGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUIvRyxNQUFyQixFQUE2QjtBQUN4QyxVQUFJQSxNQUFKLEVBQVk7QUFDVixlQUFPO0FBQ0xLLGNBQUksS0FBSytFLFdBQUwsQ0FBaUJwRixNQUFqQixDQURDO0FBRUxnSCxpQkFBTyxLQUFLM0IsUUFBTCxDQUFjckYsTUFBZCxDQUZGO0FBR0wwRixrQkFBUSxLQUFLSixTQUFMLENBQWV0RixNQUFmLENBSEg7QUFJTDJGLG1CQUFTLEtBQUtKLFVBQUwsQ0FBZ0J2RixNQUFoQjtBQUpKLFNBQVA7QUFNRDs7QUFFRCxhQUFPLElBQVA7QUFDRDtBQXhjaUYsR0FBcEUsQ0FBaEI7O29CQTJjZTlCLE8iLCJmaWxlIjoiU0RhdGEuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBEZWZlcnJlZCBmcm9tICdkb2pvL19iYXNlL0RlZmVycmVkJztcclxuaW1wb3J0IFF1ZXJ5UmVzdWx0cyBmcm9tICdkb2pvL3N0b3JlL3V0aWwvUXVlcnlSZXN1bHRzJztcclxuaW1wb3J0IGNvbnZlcnQgZnJvbSAnLi4vQ29udmVydCc7XHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4uL1V0aWxpdHknO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5TdG9yZS5TRGF0YVxyXG4gKiBAY2xhc3NkZXNjIFNEYXRhIGlzIGFuIGV4dGVuc2lvbiBvZiBkb2pvLnN0b3JlIHRoYXQgaXMgdGFpbG9yZWQgdG8gaGFuZGxpbmcgU0RhdGEgcGFyYW1ldGVycywgcmVxdWVzdHMsXHJcbiAqIGFuZCBwcmUtaGFuZGxpbmcgdGhlIHJlc3BvbnNlcy5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5TdG9yZS5TRGF0YScsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuU3RvcmUuU0RhdGEjICovIHtcclxuICBkb0RhdGVDb252ZXJzaW9uOiBmYWxzZSxcclxuXHJcbiAgLyogdG9kbzogaXMgdGhpcyB0aGUgYXBwcm9wcmlhdGUgbmFtZSBmb3IgdGhlIGV4cGFuc2lvbiBzY29wZT8gKi9cclxuICBzY29wZTogbnVsbCxcclxuICB3aGVyZTogbnVsbCxcclxuICBzZWxlY3Q6IG51bGwsXHJcbiAgaW5jbHVkZTogbnVsbCxcclxuICBvcmRlckJ5OiBudWxsLFxyXG4gIHNlcnZpY2U6IG51bGwsXHJcbiAgcmVxdWVzdDogbnVsbCxcclxuICBxdWVyeU5hbWU6IG51bGwsXHJcbiAgcXVlcnlBcmdzOiBudWxsLFxyXG4gIGVudGl0eU5hbWU6IG51bGwsXHJcbiAgY29udHJhY3ROYW1lOiBudWxsLFxyXG4gIHJlc291cmNlS2luZDogbnVsbCxcclxuICByZXNvdXJjZVByb3BlcnR5OiBudWxsLFxyXG4gIHJlc291cmNlUHJlZGljYXRlOiBudWxsLFxyXG4gIGFwcGxpY2F0aW9uTmFtZTogbnVsbCxcclxuICBkYXRhU2V0OiBudWxsLFxyXG4gIGV4ZWN1dGVRdWVyeUFzOiBudWxsLFxyXG4gIGV4ZWN1dGVHZXRBczogbnVsbCxcclxuXHJcbiAgaXRlbXNQcm9wZXJ0eTogJyRyZXNvdXJjZXMnLFxyXG4gIGlkUHJvcGVydHk6ICcka2V5JyxcclxuICBsYWJlbFByb3BlcnR5OiAnJGRlc2NyaXB0b3InLFxyXG4gIGVudGl0eVByb3BlcnR5OiAnJG5hbWUnLFxyXG4gIHZlcnNpb25Qcm9wZXJ0eTogJyRldGFnJyxcclxuXHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIGxhbmcubWl4aW4odGhpcywgcHJvcHMpO1xyXG4gIH0sXHJcbiAgX2NyZWF0ZVJlbW92ZVJlcXVlc3Q6IGZ1bmN0aW9uIGNyZWF0ZVJlbW92ZVJlcXVlc3Qob2JqZWN0KSB7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0KHRoaXMuc2VydmljZSk7XHJcbiAgICBsZXQgaWQgPSBvYmplY3QgJiYgb2JqZWN0LiRrZXk7XHJcblxyXG4gICAgaWQgPSBpZCB8fCB1dGlsaXR5LmV4cGFuZCh0aGlzLnNjb3BlIHx8IHRoaXMucmVzb3VyY2VQcmVkaWNhdGUpO1xyXG5cclxuICAgIGlmICgvKFxccyspLy50ZXN0KGlkKSkge1xyXG4gICAgICByZXF1ZXN0LnNldFJlc291cmNlU2VsZWN0b3IoaWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZVNlbGVjdG9yKGAnJHtpZH0nYCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZUtpbmQodGhpcy5yZXNvdXJjZUtpbmQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0Q29udHJhY3ROYW1lKHRoaXMuY29udHJhY3ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdDtcclxuICB9LFxyXG4gIF9jcmVhdGVFbnRyeVJlcXVlc3Q6IGZ1bmN0aW9uIF9jcmVhdGVFbnRyeVJlcXVlc3QoaWRlbnRpdHksIGdldE9wdGlvbnMpIHtcclxuICAgIGxldCByZXF1ZXN0ID0gdXRpbGl0eS5leHBhbmQodGhpcywgZ2V0T3B0aW9ucy5yZXF1ZXN0IHx8IHRoaXMucmVxdWVzdCk7XHJcbiAgICBsZXQgaWQgPSBpZGVudGl0eTtcclxuICAgIGlmIChyZXF1ZXN0KSB7XHJcbiAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZCA9IGlkIHx8IHV0aWxpdHkuZXhwYW5kKHRoaXMuc2NvcGUgfHwgdGhpcywgZ2V0T3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZSB8fCB0aGlzLnJlc291cmNlUHJlZGljYXRlKTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbnRyYWN0TmFtZSA9IHV0aWxpdHkuZXhwYW5kKHRoaXMuc2NvcGUgfHwgdGhpcywgZ2V0T3B0aW9ucy5jb250cmFjdE5hbWUgfHwgdGhpcy5jb250cmFjdE5hbWUpO1xyXG4gICAgICBjb25zdCByZXNvdXJjZUtpbmQgPSB1dGlsaXR5LmV4cGFuZCh0aGlzLnNjb3BlIHx8IHRoaXMsIGdldE9wdGlvbnMucmVzb3VyY2VLaW5kIHx8IHRoaXMucmVzb3VyY2VLaW5kKTtcclxuICAgICAgY29uc3QgZGF0YVNldCA9IHV0aWxpdHkuZXhwYW5kKHRoaXMuc2NvcGUgfHwgdGhpcywgZ2V0T3B0aW9ucy5kYXRhU2V0IHx8IHRoaXMuZGF0YVNldCk7XHJcbiAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydHkgPSB1dGlsaXR5LmV4cGFuZCh0aGlzLnNjb3BlIHx8IHRoaXMsIGdldE9wdGlvbnMucmVzb3VyY2VQcm9wZXJ0eSB8fCB0aGlzLnJlc291cmNlUHJvcGVydHkpO1xyXG4gICAgICBsZXQgcmVzb3VyY2VQcmVkaWNhdGU7XHJcblxyXG4gICAgICBpZiAoaWQpIHtcclxuICAgICAgICByZXNvdXJjZVByZWRpY2F0ZSA9IC9cXHMrLy50ZXN0KGlkKSA/IGlkIDogYCcke2lkfSdgO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVzb3VyY2VQcm9wZXJ0eSkge1xyXG4gICAgICAgIHJlcXVlc3QgPSBuZXcgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFSZXNvdXJjZVByb3BlcnR5UmVxdWVzdCh0aGlzLnNlcnZpY2UpXHJcbiAgICAgICAgICAuc2V0UmVzb3VyY2VQcm9wZXJ0eShyZXNvdXJjZVByb3BlcnR5KVxyXG4gICAgICAgICAgLnNldFJlc291cmNlU2VsZWN0b3IocmVzb3VyY2VQcmVkaWNhdGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcXVlc3QgPSBuZXcgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTaW5nbGVSZXNvdXJjZVJlcXVlc3QodGhpcy5zZXJ2aWNlKVxyXG4gICAgICAgICAgLnNldFJlc291cmNlU2VsZWN0b3IocmVzb3VyY2VQcmVkaWNhdGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY29udHJhY3ROYW1lKSB7XHJcbiAgICAgICAgcmVxdWVzdC5zZXRDb250cmFjdE5hbWUoY29udHJhY3ROYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlc291cmNlS2luZCkge1xyXG4gICAgICAgIHJlcXVlc3Quc2V0UmVzb3VyY2VLaW5kKHJlc291cmNlS2luZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkYXRhU2V0KSB7XHJcbiAgICAgICAgcmVxdWVzdC5zZXREYXRhU2V0KGRhdGFTZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBnZXRPcHRpb25zLnNlbGVjdCB8fCB0aGlzLnNlbGVjdCk7XHJcbiAgICBjb25zdCBpbmNsdWRlID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBnZXRPcHRpb25zLmluY2x1ZGUgfHwgdGhpcy5pbmNsdWRlKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0ICYmIHNlbGVjdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoJ3NlbGVjdCcsIHNlbGVjdC5qb2luKCcsJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbmNsdWRlICYmIGluY2x1ZGUubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXF1ZXN0LnNldFF1ZXJ5QXJnKCdpbmNsdWRlJywgaW5jbHVkZS5qb2luKCcsJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXF1ZXN0O1xyXG4gIH0sXHJcbiAgX2NyZWF0ZUZlZWRSZXF1ZXN0OiBmdW5jdGlvbiBfY3JlYXRlRmVlZFJlcXVlc3QocSwgcXVlcnlPcHRpb25zKSB7XHJcbiAgICBsZXQgcmVxdWVzdCA9IHV0aWxpdHkuZXhwYW5kKHRoaXMsIHF1ZXJ5T3B0aW9ucy5yZXF1ZXN0IHx8IHRoaXMucmVxdWVzdCk7XHJcbiAgICBpZiAocmVxdWVzdCkge1xyXG4gICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgcXVlcnlOYW1lID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMucXVlcnlOYW1lIHx8IHRoaXMucXVlcnlOYW1lKTtcclxuICAgICAgY29uc3QgY29udHJhY3ROYW1lID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMuY29udHJhY3ROYW1lIHx8IHRoaXMuY29udHJhY3ROYW1lKTtcclxuICAgICAgY29uc3QgcmVzb3VyY2VLaW5kID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMucmVzb3VyY2VLaW5kIHx8IHRoaXMucmVzb3VyY2VLaW5kKTtcclxuICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0eSA9IHV0aWxpdHkuZXhwYW5kKHRoaXMuc2NvcGUgfHwgdGhpcywgcXVlcnlPcHRpb25zLnJlc291cmNlUHJvcGVydHkgfHwgdGhpcy5yZXNvdXJjZVByb3BlcnR5KTtcclxuICAgICAgY29uc3QgcmVzb3VyY2VQcmVkaWNhdGUgPSB1dGlsaXR5LmV4cGFuZCh0aGlzLnNjb3BlIHx8IHRoaXMsIHF1ZXJ5T3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZSB8fCB0aGlzLnJlc291cmNlUHJlZGljYXRlKTtcclxuICAgICAgY29uc3QgYXBwbGljYXRpb25OYW1lID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMuYXBwbGljYXRpb25OYW1lIHx8IHRoaXMuYXBwbGljYXRpb25OYW1lKTtcclxuICAgICAgY29uc3QgZGF0YVNldCA9IHV0aWxpdHkuZXhwYW5kKHRoaXMuc2NvcGUgfHwgdGhpcywgcXVlcnlPcHRpb25zLmRhdGFTZXQgfHwgdGhpcy5kYXRhU2V0KTtcclxuICAgICAgY29uc3QgcXVlcnlBcmdzID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMucXVlcnlBcmdzIHx8IHRoaXMucXVlcnlBcmdzKTtcclxuXHJcbiAgICAgIGlmIChxdWVyeU5hbWUpIHtcclxuICAgICAgICByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhTmFtZWRRdWVyeVJlcXVlc3QodGhpcy5zZXJ2aWNlKVxyXG4gICAgICAgICAgLnNldFF1ZXJ5TmFtZShxdWVyeU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAocmVzb3VyY2VQcmVkaWNhdGUpIHtcclxuICAgICAgICAgIHJlcXVlc3QuZ2V0VXJpKCkuc2V0Q29sbGVjdGlvblByZWRpY2F0ZShyZXNvdXJjZVByZWRpY2F0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHJlc291cmNlUHJvcGVydHkpIHtcclxuICAgICAgICByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhUmVzb3VyY2VQcm9wZXJ0eVJlcXVlc3QodGhpcy5zZXJ2aWNlKVxyXG4gICAgICAgICAgLnNldFJlc291cmNlUHJvcGVydHkocmVzb3VyY2VQcm9wZXJ0eSlcclxuICAgICAgICAgIC5zZXRSZXNvdXJjZVNlbGVjdG9yKHJlc291cmNlUHJlZGljYXRlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCh0aGlzLnNlcnZpY2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY29udHJhY3ROYW1lKSB7XHJcbiAgICAgICAgcmVxdWVzdC5zZXRDb250cmFjdE5hbWUoY29udHJhY3ROYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlc291cmNlS2luZCkge1xyXG4gICAgICAgIHJlcXVlc3Quc2V0UmVzb3VyY2VLaW5kKHJlc291cmNlS2luZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhcHBsaWNhdGlvbk5hbWUpIHtcclxuICAgICAgICByZXF1ZXN0LnNldEFwcGxpY2F0aW9uTmFtZShhcHBsaWNhdGlvbk5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZGF0YVNldCkge1xyXG4gICAgICAgIHJlcXVlc3Quc2V0RGF0YVNldChkYXRhU2V0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHF1ZXJ5QXJncykge1xyXG4gICAgICAgIGZvciAoY29uc3QgYXJnIGluIHF1ZXJ5QXJncykge1xyXG4gICAgICAgICAgaWYgKHF1ZXJ5QXJncy5oYXNPd25Qcm9wZXJ0eShhcmcpKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoYXJnLCBxdWVyeUFyZ3NbYXJnXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMuc2VsZWN0IHx8IHRoaXMuc2VsZWN0KTtcclxuICAgIGNvbnN0IGluY2x1ZGUgPSB1dGlsaXR5LmV4cGFuZCh0aGlzLnNjb3BlIHx8IHRoaXMsIHF1ZXJ5T3B0aW9ucy5pbmNsdWRlIHx8IHRoaXMuaW5jbHVkZSk7XHJcbiAgICBjb25zdCBvcmRlckJ5ID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxdWVyeU9wdGlvbnMuc29ydCB8fCB0aGlzLm9yZGVyQnkpO1xyXG5cclxuICAgIGlmIChzZWxlY3QgJiYgc2VsZWN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZygnc2VsZWN0Jywgc2VsZWN0LmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGluY2x1ZGUgJiYgaW5jbHVkZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoJ2luY2x1ZGUnLCBpbmNsdWRlLmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9yZGVyQnkpIHtcclxuICAgICAgaWYgKHR5cGVvZiBvcmRlckJ5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoJ29yZGVyYnknLCBvcmRlckJ5KTtcclxuICAgICAgfSBlbHNlIGlmIChvcmRlckJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBvcmRlciA9IFtdO1xyXG4gICAgICAgIG9yZGVyQnkuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoKHYpIHtcclxuICAgICAgICAgIGlmICh2LmRlc2NlbmRpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKGAke3YuYXR0cmlidXRlfSBkZXNjYCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnB1c2godi5hdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9yZGVyKTtcclxuXHJcbiAgICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZygnb3JkZXJieScsIG9yZGVyLmpvaW4oJywnKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB3aGVyZSA9IHV0aWxpdHkuZXhwYW5kKHRoaXMuc2NvcGUgfHwgdGhpcywgcXVlcnlPcHRpb25zLndoZXJlIHx8IHRoaXMud2hlcmUpO1xyXG4gICAgY29uc3QgY29uZGl0aW9ucyA9IFtdO1xyXG5cclxuICAgIGlmICh3aGVyZSkge1xyXG4gICAgICBjb25kaXRpb25zLnB1c2god2hlcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5ID0gdXRpbGl0eS5leHBhbmQodGhpcy5zY29wZSB8fCB0aGlzLCBxKTtcclxuXHJcbiAgICBpZiAocXVlcnkpIHtcclxuICAgICAgY29uZGl0aW9ucy5wdXNoKHF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29uZGl0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoJ3doZXJlJywgYCgke2NvbmRpdGlvbnMuam9pbignKSBhbmQgKCcpfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHF1ZXJ5T3B0aW9ucy5zdGFydCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLlN0YXJ0SW5kZXgsIHF1ZXJ5T3B0aW9ucy5zdGFydCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcXVlcnlPcHRpb25zLmNvdW50ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXF1ZXN0LnNldFF1ZXJ5QXJnKFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhVXJpLlF1ZXJ5QXJnTmFtZXMuQ291bnQsIHF1ZXJ5T3B0aW9ucy5jb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlcXVlc3Q7XHJcbiAgfSxcclxuICBfb25DYW5jZWw6IGZ1bmN0aW9uIF9vbkNhbmNlbCgvKiBkZWZlcnJlZCovKSB7fSxcclxuICBfb25SZXF1ZXN0RmVlZFN1Y2Nlc3M6IGZ1bmN0aW9uIF9vblJlcXVlc3RGZWVkU3VjY2VzcyhxdWVyeURlZmVycmVkLCBmZWVkKSB7XHJcbiAgICBpZiAoZmVlZCkge1xyXG4gICAgICBjb25zdCBpdGVtcyA9IGxhbmcuZ2V0T2JqZWN0KHRoaXMuaXRlbXNQcm9wZXJ0eSwgZmFsc2UsIGZlZWQpO1xyXG4gICAgICBjb25zdCB0b3RhbCA9IHR5cGVvZiBmZWVkLiR0b3RhbFJlc3VsdHMgPT09ICdudW1iZXInID8gZmVlZC4kdG90YWxSZXN1bHRzIDogLTE7XHJcblxyXG4gICAgICBxdWVyeURlZmVycmVkLnRvdGFsID0gdG90YWw7XHJcbiAgICAgIHF1ZXJ5RGVmZXJyZWQucmVzb2x2ZShpdGVtcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignVGhlIGZlZWQgcmVzdWx0IGlzIGludmFsaWQuJyk7XHJcbiAgICAgIHF1ZXJ5RGVmZXJyZWQucmVqZWN0KGVycm9yKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9vblJlcXVlc3RFbnRyeVN1Y2Nlc3M6IGZ1bmN0aW9uIF9vblJlcXVlc3RFbnRyeVN1Y2Nlc3MoZGVmZXJyZWQsIGVudHJ5KSB7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0aGlzLmRvRGF0ZUNvbnZlcnNpb24gPyB0aGlzLl9oYW5kbGVEYXRlQ29udmVyc2lvbihlbnRyeSkgOiBlbnRyeSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignVGhlIGVudHJ5IHJlc3VsdCBpcyBpbnZhbGlkLicpO1xyXG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX29uUmVxdWVzdEZhaWx1cmU6IGZ1bmN0aW9uIF9vblJlcXVlc3RGYWlsdXJlKGRlZmVycmVkLCB4aHIsIHhock9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBBbiBlcnJvciBvY2N1cnJlZCByZXF1ZXN0aW5nOiAke3hock9wdGlvbnMudXJsfWApO1xyXG5cclxuICAgIGVycm9yLnhociA9IHhocjtcclxuICAgIGVycm9yLnN0YXR1cyA9IHhoci5zdGF0dXM7XHJcbiAgICBlcnJvci5hYm9ydGVkID0gZmFsc2U7XHJcbiAgICBlcnJvci51cmwgPSB4aHJPcHRpb25zLnVybDtcclxuXHJcbiAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xyXG4gIH0sXHJcbiAgX29uUmVxdWVzdEFib3J0OiBmdW5jdGlvbiBfb25SZXF1ZXN0QWJvcnQoZGVmZXJyZWQsIHhociwgeGhyT3B0aW9ucykge1xyXG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYEFuIGVycm9yIG9jY3VycmVkIHJlcXVlc3Rpbmc6ICR7eGhyT3B0aW9ucy51cmx9YCk7XHJcblxyXG4gICAgZXJyb3IueGhyID0geGhyO1xyXG4gICAgZXJyb3Iuc3RhdHVzID0gMDtcclxuICAgIGVycm9yLnJlc3BvbnNlVGV4dCA9IG51bGw7XHJcbiAgICBlcnJvci5hYm9ydGVkID0gdHJ1ZTtcclxuXHJcbiAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xyXG4gIH0sXHJcbiAgX2hhbmRsZURhdGVDb252ZXJzaW9uOiBmdW5jdGlvbiBfaGFuZGxlRGF0ZUNvbnZlcnNpb24oZW50cnkpIHtcclxuICAgIGZvciAoY29uc3QgcHJvcCBpbiBlbnRyeSkge1xyXG4gICAgICBpZiAoY29udmVydC5pc0RhdGVTdHJpbmcoZW50cnlbcHJvcF0pKSB7XHJcbiAgICAgICAgZW50cnlbcHJvcF0gPSBjb252ZXJ0LnRvRGF0ZUZyb21TdHJpbmcoZW50cnlbcHJvcF0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoaWQsIGdldE9wdGlvbnMgLyogc2RhdGEgb25seSAqLykge1xyXG4gICAgY29uc3QgaGFuZGxlID0ge307XHJcbiAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuX2NyZWF0ZUVudHJ5UmVxdWVzdChpZCwgZ2V0T3B0aW9ucyB8fCB7fSk7XHJcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzLmV4ZWN1dGVHZXRBcyA/IHJlcXVlc3RbdGhpcy5leGVjdXRlR2V0QXNdIDogcmVxdWVzdC5yZWFkO1xyXG5cclxuICAgIGhhbmRsZS52YWx1ZSA9IG1ldGhvZC5jYWxsKHJlcXVlc3QsIHtcclxuICAgICAgc3VjY2VzczogdGhpcy5fb25SZXF1ZXN0RW50cnlTdWNjZXNzLmJpbmQodGhpcywgZGVmZXJyZWQpLFxyXG4gICAgICBmYWlsdXJlOiB0aGlzLl9vblJlcXVlc3RGYWlsdXJlLmJpbmQodGhpcywgZGVmZXJyZWQpLFxyXG4gICAgICBhYm9ydGVkOiB0aGlzLl9vblJlcXVlc3RBYm9ydC5iaW5kKHRoaXMsIGRlZmVycmVkKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkZWZlcnJlZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gb2JqZWN0J3MgaWRlbnRpdHkgdXNpbmcgdGhpcy5pZFByb3BlcnR5XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGdldCB0aGUgaWRlbnRpdHkgZnJvbVxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmd8TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldElkZW50aXR5OiBmdW5jdGlvbiBnZXRJZGVudGl0eShvYmplY3QpIHtcclxuICAgIHJldHVybiBsYW5nLmdldE9iamVjdCh0aGlzLmlkUHJvcGVydHksIGZhbHNlLCBvYmplY3QpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBvYmplY3QncyBsYWJlbCB1c2luZyB0aGlzLmxhYmVsUHJvcGVydHlcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gZ2V0IHRoZSBsYWJlbCBmcm9tXHJcbiAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRMYWJlbDogZnVuY3Rpb24gZ2V0TGFiZWwob2JqZWN0KSB7XHJcbiAgICByZXR1cm4gbGFuZy5nZXRPYmplY3QodGhpcy5sYWJlbFByb3BlcnR5LCBmYWxzZSwgb2JqZWN0KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gb2JqZWN0J3MgZW50aXR5IHVzaW5nIHRoaXMuZW50aXR5UHJvcGVydHlcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gZ2V0IHRoZSBlbnRpdHkgZnJvbVxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmd8T2JqZWN0fVxyXG4gICAqL1xyXG4gIGdldEVudGl0eTogZnVuY3Rpb24gZ2V0RW50aXR5KG9iamVjdCkge1xyXG4gICAgcmV0dXJuIGxhbmcuZ2V0T2JqZWN0KHRoaXMuZW50aXR5UHJvcGVydHksIGZhbHNlLCBvYmplY3QpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBvYmplY3QncyB2ZXJzaW9uIHVzaW5nIHRoaXMudmVyc2lvblByb3BlcnR5XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGdldCB0aGUgdmVyc2lvbiBmcm9tXHJcbiAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRWZXJzaW9uOiBmdW5jdGlvbiBnZXRWZXJzaW9uKG9iamVjdCkge1xyXG4gICAgcmV0dXJuIGxhbmcuZ2V0T2JqZWN0KHRoaXMudmVyc2lvblByb3BlcnR5LCBmYWxzZSwgb2JqZWN0KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFN0b3JlcyBhbiBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHN0b3JlLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwdXRPcHRpb25zIEFkZGl0aW9uYWwgZGlyZWN0aXZlcyBmb3Igc3RvcmluZyBvYmplY3RzLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gcHV0T3B0aW9ucy5pZFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gcHV0T3B0aW9ucy5lbnRpdHlcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcHV0T3B0aW9ucy52ZXJzaW9uXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBwdXRPcHRpb25zLm92ZXJ3cml0ZVxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmd8TnVtYmVyfVxyXG4gICAqL1xyXG4gIHB1dDogZnVuY3Rpb24gcHV0KG9iamVjdCwgcHV0T3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBpZCA9IHB1dE9wdGlvbnMuaWQgfHwgdGhpcy5nZXRJZGVudGl0eShvYmplY3QpO1xyXG4gICAgY29uc3QgZW50aXR5ID0gcHV0T3B0aW9ucy5lbnRpdHkgfHwgdGhpcy5lbnRpdHlOYW1lO1xyXG4gICAgY29uc3QgdmVyc2lvbiA9IHB1dE9wdGlvbnMudmVyc2lvbiB8fCB0aGlzLmdldFZlcnNpb24ob2JqZWN0KTtcclxuICAgIGNvbnN0IGF0b20gPSAhdGhpcy5zZXJ2aWNlLmlzSnNvbkVuYWJsZWQoKTtcclxuXHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgb2JqZWN0LiRrZXkgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZW50aXR5ICYmIGF0b20pIHtcclxuICAgICAgb2JqZWN0LiRuYW1lID0gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2ZXJzaW9uKSB7XHJcbiAgICAgIG9iamVjdC4kZXRhZyA9IHZlcnNpb247XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaGFuZGxlID0ge307XHJcbiAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuX2NyZWF0ZUVudHJ5UmVxdWVzdChpZCwgcHV0T3B0aW9ucyk7XHJcbiAgICBjb25zdCBtZXRob2QgPSBwdXRPcHRpb25zLm92ZXJ3cml0ZSA/IHJlcXVlc3QudXBkYXRlIDogcmVxdWVzdC5jcmVhdGU7XHJcblxyXG4gICAgaGFuZGxlLnZhbHVlID0gbWV0aG9kLmNhbGwocmVxdWVzdCwgb2JqZWN0LCB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRoaXMuX29uVHJhbnNtaXRFbnRyeVN1Y2Nlc3MuYmluZCh0aGlzLCBkZWZlcnJlZCksXHJcbiAgICAgIGZhaWx1cmU6IHRoaXMuX29uUmVxdWVzdEZhaWx1cmUuYmluZCh0aGlzLCBkZWZlcnJlZCksXHJcbiAgICAgIGFib3J0ZWQ6IHRoaXMuX29uUmVxdWVzdEFib3J0LmJpbmQodGhpcywgZGVmZXJyZWQpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRlZmVycmVkO1xyXG4gIH0sXHJcbiAgX29uVHJhbnNtaXRFbnRyeVN1Y2Nlc3M6IGZ1bmN0aW9uIF9vblRyYW5zbWl0RW50cnlTdWNjZXNzKGRlZmVycmVkLCBlbnRyeSkge1xyXG4gICAgZGVmZXJyZWQucmVzb2x2ZSh0aGlzLmRvRGF0ZUNvbnZlcnNpb24gPyB0aGlzLl9oYW5kbGVEYXRlQ29udmVyc2lvbihlbnRyeSkgOiBlbnRyeSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIG9iamVjdCwgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBvYmplY3QgYWxyZWFkeSBleGlzdHMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHN0b3JlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGFkZE9wdGlvbnMgQWRkaXRpb25hbCBkaXJlY3RpdmVzIGZvciBjcmVhdGluZyBvYmplY3RzXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBhZGRPcHRpb25zLm92ZXJ3cml0ZVxyXG4gICAqL1xyXG4gIGFkZDogZnVuY3Rpb24gYWRkKG9iamVjdCwgYWRkT3B0aW9ucyA9IHt9KSB7XHJcbiAgICBhZGRPcHRpb25zLm92ZXJ3cml0ZSA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIHRoaXMucHV0KG9iamVjdCwgYWRkT3B0aW9ucyk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlcyBhbiBlbnRyeVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IFRoZSBlbnRyeSB0byBiZSByZW1vdmVkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW1vdmVPcHRpb25zIGFkZGl0aW9uYWwgZGlyZWN0aXZlcyBmb3IgcmVtb3Zpbmcgb3B0aW9ucy5cclxuICAgKlxyXG4gICAqL1xyXG4gIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG9iamVjdCkge1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuX2NyZWF0ZVJlbW92ZVJlcXVlc3Qob2JqZWN0KTtcclxuICAgIGNvbnN0IGhhbmRsZSA9IHt9O1xyXG4gICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IG1ldGhvZCA9IHJlcXVlc3QuZGVsZXRlO1xyXG5cclxuICAgIGhhbmRsZS52YWx1ZSA9IG1ldGhvZC5jYWxsKHJlcXVlc3QsIG9iamVjdCwge1xyXG4gICAgICBzdWNjZXNzOiB0aGlzLl9vblRyYW5zbWl0RW50cnlTdWNjZXNzLmJpbmQodGhpcywgZGVmZXJyZWQpLFxyXG4gICAgICBmYWlsdXJlOiB0aGlzLl9vblJlcXVlc3RGYWlsdXJlLmJpbmQodGhpcywgZGVmZXJyZWQpLFxyXG4gICAgICBhYm9ydGVkOiB0aGlzLl9vblJlcXVlc3RBYm9ydC5iaW5kKHRoaXMsIGRlZmVycmVkKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkZWZlcnJlZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFF1ZXJpZXMgdGhlIHN0b3JlIGZvciBvYmplY3RzLiBUaGlzIGRvZXMgbm90IGFsdGVyIHRoZSBzdG9yZSwgYnV0IHJldHVybnMgYVxyXG4gICAqIHNldCBvZiBkYXRhIGZyb20gdGhlIHN0b3JlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fEZ1bmN0aW9ufSBxdWVyeSBUaGUgcXVlcnkgdG8gdXNlIGZvciByZXRyaWV2aW5nIG9iamVjdHMgZnJvbSB0aGUgc3RvcmUuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5T3B0aW9uc1xyXG4gICAqIEByZXR1cm5zIHtkb2pvLnN0b3JlLmFwaS5TdG9yZS5RdWVyeVJlc3VsdHN9XHJcbiAgICpcclxuICAgKi9cclxuICBxdWVyeTogZnVuY3Rpb24gcXVlcnkocSwgcXVlcnlPcHRpb25zKSB7XHJcbiAgICBjb25zdCBoYW5kbGUgPSB7fTtcclxuICAgIGNvbnN0IHF1ZXJ5RGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQodGhpcy5fb25DYW5jZWwuYmluZCh0aGlzLCBoYW5kbGUpKTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLl9jcmVhdGVGZWVkUmVxdWVzdChxLCBxdWVyeU9wdGlvbnMgfHwge30pO1xyXG5cclxuICAgIHF1ZXJ5RGVmZXJyZWQudG90YWwgPSAtMTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRoaXMuX29uUmVxdWVzdEZlZWRTdWNjZXNzLmJpbmQodGhpcywgcXVlcnlEZWZlcnJlZCksXHJcbiAgICAgIGZhaWx1cmU6IHRoaXMuX29uUmVxdWVzdEZhaWx1cmUuYmluZCh0aGlzLCBxdWVyeURlZmVycmVkKSxcclxuICAgICAgYWJvcnRlZDogdGhpcy5fb25SZXF1ZXN0QWJvcnQuYmluZCh0aGlzLCBxdWVyeURlZmVycmVkKSxcclxuICAgICAgaHR0cE1ldGhvZE92ZXJyaWRlOiBxdWVyeU9wdGlvbnMgJiYgcXVlcnlPcHRpb25zLmh0dHBNZXRob2RPdmVycmlkZSxcclxuICAgIH07XHJcblxyXG4gICAgbGV0IG1ldGhvZCA9IHJlcXVlc3QucmVhZDtcclxuICAgIGlmICh0aGlzLmV4ZWN1dGVRdWVyeUFzKSB7XHJcbiAgICAgIG1ldGhvZCA9IHJlcXVlc3RbdGhpcy5leGVjdXRlUXVlcnlBc107XHJcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVJlc291cmNlUHJvcGVydHlSZXF1ZXN0KSB7XHJcbiAgICAgIG1ldGhvZCA9IHJlcXVlc3QucmVhZEZlZWQ7XHJcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNlcnZpY2VPcGVyYXRpb25SZXF1ZXN0KSB7XHJcbiAgICAgIG1ldGhvZCA9IHJlcXVlc3QuZXhlY3V0ZTtcclxuICAgICAgaGFuZGxlLnZhbHVlID0gbWV0aG9kLmNhbGwocmVxdWVzdCwgdGhpcy5lbnRyeSwgb3B0aW9ucyk7XHJcbiAgICAgIHJldHVybiBRdWVyeVJlc3VsdHMocXVlcnlEZWZlcnJlZCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUudmFsdWUgPSBtZXRob2QuY2FsbChyZXF1ZXN0LCBvcHRpb25zKTtcclxuICAgIHJldHVybiBRdWVyeVJlc3VsdHMocXVlcnlEZWZlcnJlZCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE5vdCBpbXBsZW1lbnRlZCBpbiB0aGlzIHN0b3JlLlxyXG4gICAqL1xyXG4gIHRyYW5zYWN0aW9uOiBmdW5jdGlvbiB0cmFuc2FjdGlvbigpIHt9LFxyXG4gIC8qKlxyXG4gICAqIE5vdCBpbXBsZW1lbnRlZCBpbiB0aGlzIHN0b3JlLlxyXG4gICAqL1xyXG4gIGdldENoaWxkcmVuOiBmdW5jdGlvbiBnZXRDaGlsZHJlbigvKiBwYXJlbnQsIG9wdGlvbnMqLykge30sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbnkgbWV0YWRhdGEgYWJvdXQgdGhlIG9iamVjdC4gVGhpcyBtYXkgaW5jbHVkZSBhdHRyaWJ1dGlvbixcclxuICAgKiBjYWNoZSBkaXJlY3RpdmVzLCBoaXN0b3J5LCBvciB2ZXJzaW9uIGluZm9ybWF0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHJldHVybiBtZXRhZGF0YSBmb3IuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgbWV0YWRhdGEuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfE51bWJlcn0gcmV0dXJuLmlkXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSByZXR1cm4ubGFiZWxcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd8T2JqZWN0fSByZXR1cm4uZW50aXR5XHJcbiAgICogQHJldHVybiB7U3RyaW5nfSByZXR1cm4udmVyc2lvblxyXG4gICAqL1xyXG4gIGdldE1ldGFkYXRhOiBmdW5jdGlvbiBnZXRNZXRhZGF0YShvYmplY3QpIHtcclxuICAgIGlmIChvYmplY3QpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpZDogdGhpcy5nZXRJZGVudGl0eShvYmplY3QpLFxyXG4gICAgICAgIGxhYmVsOiB0aGlzLmdldExhYmVsKG9iamVjdCksXHJcbiAgICAgICAgZW50aXR5OiB0aGlzLmdldEVudGl0eShvYmplY3QpLFxyXG4gICAgICAgIHZlcnNpb246IHRoaXMuZ2V0VmVyc2lvbihvYmplY3QpLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19