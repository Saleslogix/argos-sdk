define('argos/Models/_OfflineModelBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', '../Store/PouchDB', 'dojo/Deferred', 'dojo/promise/all', 'dojo/when', '../Utility', '../_CustomizationMixin', './_ModelBase', 'dojo/store/util/QueryResults', './Types', '../Convert'], function (module, exports, _declare, _lang, _PouchDB, _Deferred, _all, _when, _Utility, _CustomizationMixin2, _ModelBase2, _QueryResults, _Types, _Convert) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _PouchDB2 = _interopRequireDefault(_PouchDB);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _all2 = _interopRequireDefault(_all);

  var _when2 = _interopRequireDefault(_when);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  var _ModelBase3 = _interopRequireDefault(_ModelBase2);

  var _QueryResults2 = _interopRequireDefault(_QueryResults);

  var _Types2 = _interopRequireDefault(_Types);

  var _Convert2 = _interopRequireDefault(_Convert);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var databaseName = 'crm-offline';
  var _store = new _PouchDB2.default(databaseName);

  /**
   * @class argos.Models._OfflineModelBase
   */
  var __class = (0, _declare2.default)('argos.Models.Offline.OfflineModelBase', [_ModelBase3.default, _CustomizationMixin3.default], {

    store: null,
    modelType: _Types2.default.OFFLINE,
    init: function init() {
      this.inherited(arguments);
      this.createNamedQueries();
    },
    createNamedQueries: function createNamedQueries() {
      var store = this.getStore();
      // TODO: This is a shared named query, and probably doesn't belong here (will be called multiple times)
      store.createNamedQuery({
        _id: '_design/entities',
        _rev: '1',
        views: {
          by_name: {
            map: function map(doc) {
              emit(doc.entityName); // eslint-disable-line
            }.toString()
          }
        }
      });
    },
    getStore: function getStore() {
      if (!this.store) {
        this.store = _store;
      }
      return this.store;
    },
    getDocId: function getEntityId(entry) {
      return this.getEntityId(entry);
    },
    getEntry: function getEntry(entityId) {
      var _this = this;

      var def = new _Deferred2.default();
      this.getEntryDoc(entityId).then(function (doc) {
        def.resolve(_this.unWrap(doc));
      }, function (err) {
        def.reject(err);
      });
      return def;
    },
    getEntryDoc: function getEntry(entityId) {
      var store = this.getStore();
      var def = new _Deferred2.default();
      store.get(entityId).then(function (results) {
        def.resolve(results);
      }, function (err) {
        def.reject(err);
      });
      return def;
    },
    saveEntry: function saveEntity(entry, options) {
      var _this2 = this;

      var def = new _Deferred2.default();
      this.updateEntry(entry, options).then(function (updateResult) {
        var odef = def;
        _this2.saveRelatedEntries(entry, options).then(function () {
          odef.resolve(updateResult);
        }, function (err) {
          odef.reject(err);
        });
      }, function () {
        // Fetching the doc/entity failed, so we will insert a new doc instead.
        _this2.insertEntry(entry, options).then(function (insertResult) {
          var odef = def;
          _this2.saveRelatedEntries(entry, options).then(function () {
            odef.resolve(insertResult);
          }, function (err) {
            odef.reject(err);
          });
        }, function (err) {
          def.reject(err);
        });
      });
      return def.promise;
    },
    insertEntry: function insertEntry(entry, options) {
      var store = this.getStore();
      var def = new _Deferred2.default();
      var doc = this.wrap(entry, options);
      store.add(doc).then(function (result) {
        def.resolve(result);
      }, function (err) {
        def.reject('error inserting entity: ' + err);
      });
      return def.promise;
    },
    updateEntry: function updateEntity(entry, options) {
      var _this3 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var entityId = this.getEntityId(entry, options);
      this.getEntryDoc(entityId).then(function (doc) {
        var odef = def;
        doc.entity = entry;
        doc.modifyDate = moment().toDate();
        doc.description = _this3.getEntityDescription(entry);
        store.put(doc).then(function (result) {
          odef.resolve(result);
        }, function (err) {
          odef.reject('error updating entity: ' + err);
        });
      }, function (err) {
        def.reject('entity not found to update:' + err);
      });
      return def.promise;
    },
    createEntry: function createEntry() {
      var entry = {}; // need to dynamicly create Properties;
      entry.Id = null;
      entry.CreateDate = moment().toDate();
      entry.ModifyDate = moment().toDate();
      return entry;
    },
    deleteEntry: function deleteEntry(entityId) {
      var _this4 = this;

      var def = new _Deferred2.default();
      var store = this.getStore();
      store.get(entityId).then(function (doc) {
        var odef = def;
        _this4._removeDoc(doc).then(function (result) {
          _this4.onEntryDelete(entityId);
          odef.resolve(result);
        }, function (err) {
          odef.reject(err);
        });
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    _removeDoc: function _removeDoc(doc) {
      var def = new _Deferred2.default();
      var store = this.getStore();
      store.remove(doc._id, doc._rev).then(function (result) {
        def.resolve(result);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    onEntryDelete: function onEntryDelete() {},
    saveRelatedEntries: function saveRelatedEntries(parentEntry, options) {
      var entries = parentEntry && parentEntry.$relatedEntities ? parentEntry.$relatedEntities : [];
      var relatedPromises = [];
      var def = new _Deferred2.default();
      entries.forEach(function (related) {
        var model = App.ModelManager.getModel(related.entityName, _Types2.default.OFFLINE);
        if (model && related.entities) {
          relatedPromises = related.entities.map(function (relatedEntry) {
            return model.saveEntry(relatedEntry, options);
          });
        }
      });
      if (relatedPromises.length > 0) {
        (0, _all2.default)(relatedPromises).then(function (relatedResults) {
          def.resolve(relatedResults);
        }, function (err) {
          def.reject(err);
        });
      } else {
        def.resolve(parentEntry);
      }
      return def.promise;
    },
    wrap: function wrap(entry) {
      var doc = {
        _id: this.getDocId(entry),
        entity: entry,
        entityId: this.getEntityId(entry),
        createDate: moment().toDate(),
        modifyDate: moment().toDate(),
        resourceKind: this.resourceKind,
        description: this.getEntityDescription(entry),
        entityName: this.entityName,
        entityDisplayName: this.entityDisplayName
      };
      return doc;
    },
    unWrap: function unWrap(doc) {
      if (doc.entity) {
        doc.entity.$offlineDate = doc.modifyDate;
      }
      return doc.entity;
    },
    getEntries: function getEntries(query, options) {
      var _this5 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = this.buildQueryOptions();
      _lang2.default.mixin(queryOptions, options);
      var queryExpression = this.buildQueryExpression(query, queryOptions);
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var entities = _this5.processEntries(_this5.unWrapEntities(docs), queryOptions, docs);
        def.resolve(entities);
      }, function (err) {
        def.reject(err);
      });
      if (queryOptions && queryOptions.returnQueryResults) {
        return (0, _QueryResults2.default)(def.promise); // eslint-disable-line
      }
      return def.promise;
    },
    processEntries: function processEntries(entities, queryOptions, docs) {
      if (typeof queryOptions.filter === 'function') {
        return entities.filter(queryOptions.filter);
      }

      if (typeof queryOptions.filterDocs === 'function') {
        return docs.filter(queryOptions.filterDocs);
      }

      return entities;
    },
    buildQueryOptions: function buildQueryOptions() {
      return {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
    },
    buildQueryExpression: function buildQueryExpression(queryExpression, options) {
      // eslint-disable-line
      return 'entities/by_name';
    },
    unWrapEntities: function unWrapEntities(docs) {
      var _this6 = this;

      return docs.map(function (doc) {
        return _this6.unWrap(doc.doc);
      });
    },
    getRelatedCount: function getRelatedCount(relationship, entry) {
      var def = new _Deferred2.default();
      var model = App.ModelManager.getModel(relationship.relatedEntity, _Types2.default.OFFLINE);
      if (model) {
        var queryOptions = {
          returnQueryResults: true,
          include_docs: true,
          filter: this.buildRelatedQueryExpression(relationship, entry),
          key: relationship.relatedEntity
        };
        model.getEntries(null, queryOptions).then(function (result) {
          def.resolve(result.length);
        }, function () {
          def.resolve(-1);
        });
      } else {
        def.resolve(-1);
      }
      return def.promise;
    },
    buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) {
      var _this7 = this;

      return function (entity) {
        var parentDataPath = void 0;
        var relatedDataPath = void 0;
        var relatedValue = void 0;
        if (relationship.parentProperty) {
          parentDataPath = relationship.parentDataPath ? relationship.parentDataPath : relationship.parentProperty;
          if (relationship.parentPropertyType && relationship.parentPropertyType === 'object') {
            parentDataPath = relationship.parentProperty + '.$key';
          }
        } else {
          parentDataPath = _this7.idProperty;
        }

        if (relationship.relatedProperty) {
          relatedDataPath = relationship.relatedDataPath ? relationship.relatedDataPath : relationship.relatedProperty;
          if (relationship.relatedPropertyType && relationship.relatedPropertyType === 'object') {
            relatedDataPath = relationship.relatedProperty + '.$key';
          }
        } else {
          relatedDataPath = '$key';
        }

        var parentValue = _Utility2.default.getValue(entry, parentDataPath);
        if (entity) {
          relatedValue = _Utility2.default.getValue(entity, relatedDataPath);
        }
        if (parentValue && relatedValue && relatedValue === parentValue) {
          return true;
        }

        return false;
      };
    },
    getUsage: function getUsage() {
      var _this8 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = {
        include_docs: true,
        descending: false,
        key: this.entityName
      };

      var queryExpression = 'entities/by_name';
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var usage = {};
        var size = _this8._getDocSize(docs[0]);
        usage.iconClass = _this8.iconClass;
        usage.entityName = _this8.entityName;
        usage.description = _this8.entityDisplayNamePlural;
        usage.oldestDate = docs[0] ? moment(docs[0].doc.modifyDate).toDate() : null; // see decending = false;
        usage.newestDate = docs[docs.length - 1] ? moment(docs[docs.length - 1].doc.modifyDate).toDate() : null;
        usage.count = docs.length;
        usage.sizeAVG = size;
        usage.size = usage.count * (size ? size : 10);
        def.resolve(usage);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    _getDocSize: function _getDocSize(doc) {
      var size = 0;
      var charSize = 2; // 2 bytes
      if (doc) {
        var jsonString = JSON.stringify(doc);
        size = charSize * jsonString.length;
      }
      return size;
    },
    clearAllData: function clearAllData() {
      var _this9 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
      var queryExpression = 'entities/by_name';
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var odef = def;
        var deleteRequests = docs.map(function (doc) {
          return _this9._removeDoc(doc.doc);
        });
        if (deleteRequests.length > 0) {
          (0, _all2.default)(deleteRequests).then(function (results) {
            odef.resolve(results);
          }, function (err) {
            odef.reject(err);
          });
        } else {
          def.resolve();
        }
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    clearDataOlderThan: function clearAllData() {
      var _this10 = this;

      var days = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
      var queryExpression = 'entities/by_name';
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var odef = def;
        var deleteRequests = docs.filter(function (_ref) {
          var doc = _ref.doc;

          if (!doc.modifyDate) {
            return true;
          }

          if (days === 0) {
            return true;
          }

          var recordDate = moment(_Convert2.default.toDateFromString(doc.modifyDate));
          var currentDate = moment();
          var diff = currentDate.diff(recordDate, 'days');
          if (diff > days) {
            return true;
          }

          return false;
        }).map(function (doc) {
          return _this10._removeDoc(doc.doc);
        });

        if (deleteRequests.length > 0) {
          (0, _all2.default)(deleteRequests).then(function (results) {
            odef.resolve(results);
          }, function (err) {
            odef.reject(err);
          });
        } else {
          def.resolve();
        }
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    removeFromAuxiliaryEntities: function removeFromAuxiliaryEntities(entityId) {
      var def = new _Deferred2.default();
      var rvModel = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      var bcModel = App.ModelManager.getModel('Briefcase', _Types2.default.OFFLINE);
      if (rvModel) {
        rvModel.deleteEntryByEntityContext(entityId, this.entityName);
      }
      if (bcModel) {
        bcModel.deleteEntryByEntityContext(entityId, this.entityName);
      }
      def.resolve();
      return def.promise;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Nb2RlbHMvX09mZmxpbmVNb2RlbEJhc2UuanMiXSwibmFtZXMiOlsiZGF0YWJhc2VOYW1lIiwiX3N0b3JlIiwiX19jbGFzcyIsInN0b3JlIiwibW9kZWxUeXBlIiwiT0ZGTElORSIsImluaXQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJjcmVhdGVOYW1lZFF1ZXJpZXMiLCJnZXRTdG9yZSIsImNyZWF0ZU5hbWVkUXVlcnkiLCJfaWQiLCJfcmV2Iiwidmlld3MiLCJieV9uYW1lIiwibWFwIiwiZG9jIiwiZW1pdCIsImVudGl0eU5hbWUiLCJ0b1N0cmluZyIsImdldERvY0lkIiwiZ2V0RW50aXR5SWQiLCJlbnRyeSIsImdldEVudHJ5IiwiZW50aXR5SWQiLCJkZWYiLCJnZXRFbnRyeURvYyIsInRoZW4iLCJyZXNvbHZlIiwidW5XcmFwIiwiZXJyIiwicmVqZWN0IiwiZ2V0IiwicmVzdWx0cyIsInNhdmVFbnRyeSIsInNhdmVFbnRpdHkiLCJvcHRpb25zIiwidXBkYXRlRW50cnkiLCJ1cGRhdGVSZXN1bHQiLCJvZGVmIiwic2F2ZVJlbGF0ZWRFbnRyaWVzIiwiaW5zZXJ0RW50cnkiLCJpbnNlcnRSZXN1bHQiLCJwcm9taXNlIiwid3JhcCIsImFkZCIsInJlc3VsdCIsInVwZGF0ZUVudGl0eSIsImVudGl0eSIsIm1vZGlmeURhdGUiLCJtb21lbnQiLCJ0b0RhdGUiLCJkZXNjcmlwdGlvbiIsImdldEVudGl0eURlc2NyaXB0aW9uIiwicHV0IiwiY3JlYXRlRW50cnkiLCJJZCIsIkNyZWF0ZURhdGUiLCJNb2RpZnlEYXRlIiwiZGVsZXRlRW50cnkiLCJfcmVtb3ZlRG9jIiwib25FbnRyeURlbGV0ZSIsInJlbW92ZSIsInBhcmVudEVudHJ5IiwiZW50cmllcyIsIiRyZWxhdGVkRW50aXRpZXMiLCJyZWxhdGVkUHJvbWlzZXMiLCJmb3JFYWNoIiwicmVsYXRlZCIsIm1vZGVsIiwiQXBwIiwiTW9kZWxNYW5hZ2VyIiwiZ2V0TW9kZWwiLCJlbnRpdGllcyIsInJlbGF0ZWRFbnRyeSIsImxlbmd0aCIsInJlbGF0ZWRSZXN1bHRzIiwiY3JlYXRlRGF0ZSIsInJlc291cmNlS2luZCIsImVudGl0eURpc3BsYXlOYW1lIiwiJG9mZmxpbmVEYXRlIiwiZ2V0RW50cmllcyIsInF1ZXJ5IiwicXVlcnlPcHRpb25zIiwiYnVpbGRRdWVyeU9wdGlvbnMiLCJtaXhpbiIsInF1ZXJ5RXhwcmVzc2lvbiIsImJ1aWxkUXVlcnlFeHByZXNzaW9uIiwicXVlcnlSZXN1bHRzIiwiZG9jcyIsInByb2Nlc3NFbnRyaWVzIiwidW5XcmFwRW50aXRpZXMiLCJyZXR1cm5RdWVyeVJlc3VsdHMiLCJmaWx0ZXIiLCJmaWx0ZXJEb2NzIiwiaW5jbHVkZV9kb2NzIiwiZGVzY2VuZGluZyIsImtleSIsImdldFJlbGF0ZWRDb3VudCIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRFbnRpdHkiLCJidWlsZFJlbGF0ZWRRdWVyeUV4cHJlc3Npb24iLCJwYXJlbnREYXRhUGF0aCIsInJlbGF0ZWREYXRhUGF0aCIsInJlbGF0ZWRWYWx1ZSIsInBhcmVudFByb3BlcnR5IiwicGFyZW50UHJvcGVydHlUeXBlIiwiaWRQcm9wZXJ0eSIsInJlbGF0ZWRQcm9wZXJ0eSIsInJlbGF0ZWRQcm9wZXJ0eVR5cGUiLCJwYXJlbnRWYWx1ZSIsImdldFZhbHVlIiwiZ2V0VXNhZ2UiLCJ1c2FnZSIsInNpemUiLCJfZ2V0RG9jU2l6ZSIsImljb25DbGFzcyIsImVudGl0eURpc3BsYXlOYW1lUGx1cmFsIiwib2xkZXN0RGF0ZSIsIm5ld2VzdERhdGUiLCJjb3VudCIsInNpemVBVkciLCJjaGFyU2l6ZSIsImpzb25TdHJpbmciLCJKU09OIiwic3RyaW5naWZ5IiwiY2xlYXJBbGxEYXRhIiwiZGVsZXRlUmVxdWVzdHMiLCJjbGVhckRhdGFPbGRlclRoYW4iLCJkYXlzIiwicmVjb3JkRGF0ZSIsInRvRGF0ZUZyb21TdHJpbmciLCJjdXJyZW50RGF0ZSIsImRpZmYiLCJyZW1vdmVGcm9tQXV4aWxpYXJ5RW50aXRpZXMi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LFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BbkNEO0FBb0NBLGFBQU9MLElBQUlrQixPQUFYO0FBQ0QsS0EzWWlHO0FBNFlsRzJGLGlDQUE2QixTQUFTQSwyQkFBVCxDQUFxQzlHLFFBQXJDLEVBQStDO0FBQzFFLFVBQU1DLE1BQU0sd0JBQVo7QUFDQSxVQUFNOEcsVUFBVWpFLElBQUlDLFlBQUosQ0FBaUJDLFFBQWpCLENBQTBCLGdCQUExQixFQUE0QyxnQkFBWXBFLE9BQXhELENBQWhCO0FBQ0EsVUFBTW9JLFVBQVVsRSxJQUFJQyxZQUFKLENBQWlCQyxRQUFqQixDQUEwQixXQUExQixFQUF1QyxnQkFBWXBFLE9BQW5ELENBQWhCO0FBQ0EsVUFBSW1JLE9BQUosRUFBYTtBQUNYQSxnQkFBUUUsMEJBQVIsQ0FBbUNqSCxRQUFuQyxFQUE2QyxLQUFLTixVQUFsRDtBQUNEO0FBQ0QsVUFBSXNILE9BQUosRUFBYTtBQUNYQSxnQkFBUUMsMEJBQVIsQ0FBbUNqSCxRQUFuQyxFQUE2QyxLQUFLTixVQUFsRDtBQUNEO0FBQ0RPLFVBQUlHLE9BQUo7QUFDQSxhQUFPSCxJQUFJa0IsT0FBWDtBQUNEO0FBeFppRyxHQUFwRixDQUFoQjs7b0JBMlplMUMsTyIsImZpbGUiOiJfT2ZmbGluZU1vZGVsQmFzZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBQb3VjaERCU3RvcmUgZnJvbSAnLi4vU3RvcmUvUG91Y2hEQic7XHJcbmltcG9ydCBEZWZlcnJlZCBmcm9tICdkb2pvL0RlZmVycmVkJztcclxuaW1wb3J0IGFsbCBmcm9tICdkb2pvL3Byb21pc2UvYWxsJztcclxuaW1wb3J0IHdoZW4gZnJvbSAnZG9qby93aGVuJztcclxuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi4vVXRpbGl0eSc7XHJcbmltcG9ydCBfQ3VzdG9taXphdGlvbk1peGluIGZyb20gJy4uL19DdXN0b21pemF0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX01vZGVsQmFzZSBmcm9tICcuL19Nb2RlbEJhc2UnO1xyXG5pbXBvcnQgUXVlcnlSZXN1bHRzIGZyb20gJ2Rvam8vc3RvcmUvdXRpbC9RdWVyeVJlc3VsdHMnO1xyXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi9UeXBlcyc7XHJcbmltcG9ydCBjb252ZXJ0IGZyb20gJy4uL0NvbnZlcnQnO1xyXG5cclxuXHJcbmNvbnN0IGRhdGFiYXNlTmFtZSA9ICdjcm0tb2ZmbGluZSc7XHJcbmNvbnN0IF9zdG9yZSA9IG5ldyBQb3VjaERCU3RvcmUoZGF0YWJhc2VOYW1lKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuTW9kZWxzLl9PZmZsaW5lTW9kZWxCYXNlXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTW9kZWxzLk9mZmxpbmUuT2ZmbGluZU1vZGVsQmFzZScsIFtfTW9kZWxCYXNlLCBfQ3VzdG9taXphdGlvbk1peGluXSwge1xyXG5cclxuICBzdG9yZTogbnVsbCxcclxuICBtb2RlbFR5cGU6IE1PREVMX1RZUEVTLk9GRkxJTkUsXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLmNyZWF0ZU5hbWVkUXVlcmllcygpO1xyXG4gIH0sXHJcbiAgY3JlYXRlTmFtZWRRdWVyaWVzOiBmdW5jdGlvbiBjcmVhdGVOYW1lZFF1ZXJpZXMoKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIC8vIFRPRE86IFRoaXMgaXMgYSBzaGFyZWQgbmFtZWQgcXVlcnksIGFuZCBwcm9iYWJseSBkb2Vzbid0IGJlbG9uZyBoZXJlICh3aWxsIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcylcclxuICAgIHN0b3JlLmNyZWF0ZU5hbWVkUXVlcnkoe1xyXG4gICAgICBfaWQ6ICdfZGVzaWduL2VudGl0aWVzJyxcclxuICAgICAgX3JldjogJzEnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgIGJ5X25hbWU6IHtcclxuICAgICAgICAgIG1hcDogZnVuY3Rpb24gbWFwKGRvYykge1xyXG4gICAgICAgICAgICBlbWl0KGRvYy5lbnRpdHlOYW1lKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgICAgfS50b1N0cmluZygpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGdldFN0b3JlOiBmdW5jdGlvbiBnZXRTdG9yZSgpIHtcclxuICAgIGlmICghdGhpcy5zdG9yZSkge1xyXG4gICAgICB0aGlzLnN0b3JlID0gX3N0b3JlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmU7XHJcbiAgfSxcclxuICBnZXREb2NJZDogZnVuY3Rpb24gZ2V0RW50aXR5SWQoZW50cnkpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEVudGl0eUlkKGVudHJ5KTtcclxuICB9LFxyXG4gIGdldEVudHJ5OiBmdW5jdGlvbiBnZXRFbnRyeShlbnRpdHlJZCkge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICB0aGlzLmdldEVudHJ5RG9jKGVudGl0eUlkKS50aGVuKChkb2MpID0+IHtcclxuICAgICAgZGVmLnJlc29sdmUodGhpcy51bldyYXAoZG9jKSk7XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZjtcclxuICB9LFxyXG4gIGdldEVudHJ5RG9jOiBmdW5jdGlvbiBnZXRFbnRyeShlbnRpdHlJZCkge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIHN0b3JlLmdldChlbnRpdHlJZCkudGhlbigocmVzdWx0cykgPT4ge1xyXG4gICAgICBkZWYucmVzb2x2ZShyZXN1bHRzKTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmO1xyXG4gIH0sXHJcbiAgc2F2ZUVudHJ5OiBmdW5jdGlvbiBzYXZlRW50aXR5KGVudHJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIHRoaXMudXBkYXRlRW50cnkoZW50cnksIG9wdGlvbnMpLnRoZW4oKHVwZGF0ZVJlc3VsdCkgPT4ge1xyXG4gICAgICBjb25zdCBvZGVmID0gZGVmO1xyXG4gICAgICB0aGlzLnNhdmVSZWxhdGVkRW50cmllcyhlbnRyeSwgb3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgb2RlZi5yZXNvbHZlKHVwZGF0ZVJlc3VsdCk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICBvZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0sICgpID0+IHtcclxuICAgICAgLy8gRmV0Y2hpbmcgdGhlIGRvYy9lbnRpdHkgZmFpbGVkLCBzbyB3ZSB3aWxsIGluc2VydCBhIG5ldyBkb2MgaW5zdGVhZC5cclxuICAgICAgdGhpcy5pbnNlcnRFbnRyeShlbnRyeSwgb3B0aW9ucykudGhlbigoaW5zZXJ0UmVzdWx0KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb2RlZiA9IGRlZjtcclxuICAgICAgICB0aGlzLnNhdmVSZWxhdGVkRW50cmllcyhlbnRyeSwgb3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBvZGVmLnJlc29sdmUoaW5zZXJ0UmVzdWx0KTtcclxuICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBvZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgaW5zZXJ0RW50cnk6IGZ1bmN0aW9uIGluc2VydEVudHJ5KGVudHJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgZG9jID0gdGhpcy53cmFwKGVudHJ5LCBvcHRpb25zKTtcclxuICAgIHN0b3JlLmFkZChkb2MpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICBkZWYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgfSxcclxuICAgIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChgZXJyb3IgaW5zZXJ0aW5nIGVudGl0eTogJHtlcnJ9YCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIHVwZGF0ZUVudHJ5OiBmdW5jdGlvbiB1cGRhdGVFbnRpdHkoZW50cnksIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBlbnRpdHlJZCA9IHRoaXMuZ2V0RW50aXR5SWQoZW50cnksIG9wdGlvbnMpO1xyXG4gICAgdGhpcy5nZXRFbnRyeURvYyhlbnRpdHlJZCkudGhlbigoZG9jKSA9PiB7XHJcbiAgICAgIGNvbnN0IG9kZWYgPSBkZWY7XHJcbiAgICAgIGRvYy5lbnRpdHkgPSBlbnRyeTtcclxuICAgICAgZG9jLm1vZGlmeURhdGUgPSBtb21lbnQoKS50b0RhdGUoKTtcclxuICAgICAgZG9jLmRlc2NyaXB0aW9uID0gdGhpcy5nZXRFbnRpdHlEZXNjcmlwdGlvbihlbnRyeSk7XHJcbiAgICAgIHN0b3JlLnB1dChkb2MpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIG9kZWYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgb2RlZi5yZWplY3QoYGVycm9yIHVwZGF0aW5nIGVudGl0eTogJHtlcnJ9YCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGBlbnRpdHkgbm90IGZvdW5kIHRvIHVwZGF0ZToke2Vycn1gKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgY3JlYXRlRW50cnk6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5KCkge1xyXG4gICAgY29uc3QgZW50cnkgPSB7fTsgLy8gbmVlZCB0byBkeW5hbWljbHkgY3JlYXRlIFByb3BlcnRpZXM7XHJcbiAgICBlbnRyeS5JZCA9IG51bGw7XHJcbiAgICBlbnRyeS5DcmVhdGVEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICBlbnRyeS5Nb2RpZnlEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfSxcclxuICBkZWxldGVFbnRyeTogZnVuY3Rpb24gZGVsZXRlRW50cnkoZW50aXR5SWQpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICBzdG9yZS5nZXQoZW50aXR5SWQpLnRoZW4oKGRvYykgPT4ge1xyXG4gICAgICBjb25zdCBvZGVmID0gZGVmO1xyXG4gICAgICB0aGlzLl9yZW1vdmVEb2MoZG9jKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICB0aGlzLm9uRW50cnlEZWxldGUoZW50aXR5SWQpO1xyXG4gICAgICAgIG9kZWYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgb2RlZi5yZWplY3QoZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgX3JlbW92ZURvYzogZnVuY3Rpb24gX3JlbW92ZURvYyhkb2MpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICBzdG9yZS5yZW1vdmUoZG9jLl9pZCwgZG9jLl9yZXYpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICBkZWYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIG9uRW50cnlEZWxldGU6IGZ1bmN0aW9uIG9uRW50cnlEZWxldGUoKSB7XHJcbiAgfSxcclxuICBzYXZlUmVsYXRlZEVudHJpZXM6IGZ1bmN0aW9uIHNhdmVSZWxhdGVkRW50cmllcyhwYXJlbnRFbnRyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgZW50cmllcyA9IChwYXJlbnRFbnRyeSAmJiBwYXJlbnRFbnRyeS4kcmVsYXRlZEVudGl0aWVzKSA/IHBhcmVudEVudHJ5LiRyZWxhdGVkRW50aXRpZXMgOiBbXTtcclxuICAgIGxldCByZWxhdGVkUHJvbWlzZXMgPSBbXTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgZW50cmllcy5mb3JFYWNoKChyZWxhdGVkKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1vZGVsID0gQXBwLk1vZGVsTWFuYWdlci5nZXRNb2RlbChyZWxhdGVkLmVudGl0eU5hbWUsIE1PREVMX1RZUEVTLk9GRkxJTkUpO1xyXG4gICAgICBpZiAobW9kZWwgJiYgcmVsYXRlZC5lbnRpdGllcykge1xyXG4gICAgICAgIHJlbGF0ZWRQcm9taXNlcyA9IHJlbGF0ZWQuZW50aXRpZXMubWFwKChyZWxhdGVkRW50cnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiBtb2RlbC5zYXZlRW50cnkocmVsYXRlZEVudHJ5LCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVsYXRlZFByb21pc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgYWxsKHJlbGF0ZWRQcm9taXNlcykudGhlbihcclxuICAgICAgICAocmVsYXRlZFJlc3VsdHMpID0+IHtcclxuICAgICAgICAgIGRlZi5yZXNvbHZlKHJlbGF0ZWRSZXN1bHRzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRlZi5yZXNvbHZlKHBhcmVudEVudHJ5KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIHdyYXA6IGZ1bmN0aW9uIHdyYXAoZW50cnkpIHtcclxuICAgIGNvbnN0IGRvYyA9IHtcclxuICAgICAgX2lkOiB0aGlzLmdldERvY0lkKGVudHJ5KSxcclxuICAgICAgZW50aXR5OiBlbnRyeSxcclxuICAgICAgZW50aXR5SWQ6IHRoaXMuZ2V0RW50aXR5SWQoZW50cnkpLFxyXG4gICAgICBjcmVhdGVEYXRlOiBtb21lbnQoKS50b0RhdGUoKSxcclxuICAgICAgbW9kaWZ5RGF0ZTogbW9tZW50KCkudG9EYXRlKCksXHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmdldEVudGl0eURlc2NyaXB0aW9uKGVudHJ5KSxcclxuICAgICAgZW50aXR5TmFtZTogdGhpcy5lbnRpdHlOYW1lLFxyXG4gICAgICBlbnRpdHlEaXNwbGF5TmFtZTogdGhpcy5lbnRpdHlEaXNwbGF5TmFtZSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gZG9jO1xyXG4gIH0sXHJcbiAgdW5XcmFwOiBmdW5jdGlvbiB1bldyYXAoZG9jKSB7XHJcbiAgICBpZiAoZG9jLmVudGl0eSkge1xyXG4gICAgICBkb2MuZW50aXR5LiRvZmZsaW5lRGF0ZSA9IGRvYy5tb2RpZnlEYXRlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRvYy5lbnRpdHk7XHJcbiAgfSxcclxuICBnZXRFbnRyaWVzOiBmdW5jdGlvbiBnZXRFbnRyaWVzKHF1ZXJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0gdGhpcy5idWlsZFF1ZXJ5T3B0aW9ucygpO1xyXG4gICAgbGFuZy5taXhpbihxdWVyeU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgY29uc3QgcXVlcnlFeHByZXNzaW9uID0gdGhpcy5idWlsZFF1ZXJ5RXhwcmVzc2lvbihxdWVyeSwgcXVlcnlPcHRpb25zKTtcclxuICAgIGNvbnN0IHF1ZXJ5UmVzdWx0cyA9IHN0b3JlLnF1ZXJ5KHF1ZXJ5RXhwcmVzc2lvbiwgcXVlcnlPcHRpb25zKTtcclxuICAgIHdoZW4ocXVlcnlSZXN1bHRzLCAoZG9jcykgPT4ge1xyXG4gICAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMucHJvY2Vzc0VudHJpZXModGhpcy51bldyYXBFbnRpdGllcyhkb2NzKSwgcXVlcnlPcHRpb25zLCBkb2NzKTtcclxuICAgICAgZGVmLnJlc29sdmUoZW50aXRpZXMpO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIGlmIChxdWVyeU9wdGlvbnMgJiYgcXVlcnlPcHRpb25zLnJldHVyblF1ZXJ5UmVzdWx0cykge1xyXG4gICAgICByZXR1cm4gUXVlcnlSZXN1bHRzKGRlZi5wcm9taXNlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgcHJvY2Vzc0VudHJpZXM6IGZ1bmN0aW9uIHByb2Nlc3NFbnRyaWVzKGVudGl0aWVzLCBxdWVyeU9wdGlvbnMsIGRvY3MpIHtcclxuICAgIGlmICh0eXBlb2YgcXVlcnlPcHRpb25zLmZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gZW50aXRpZXMuZmlsdGVyKHF1ZXJ5T3B0aW9ucy5maWx0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcXVlcnlPcHRpb25zLmZpbHRlckRvY3MgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIGRvY3MuZmlsdGVyKHF1ZXJ5T3B0aW9ucy5maWx0ZXJEb2NzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW50aXRpZXM7XHJcbiAgfSxcclxuICBidWlsZFF1ZXJ5T3B0aW9uczogZnVuY3Rpb24gYnVpbGRRdWVyeU9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXHJcbiAgICAgIGRlc2NlbmRpbmc6IHRydWUsXHJcbiAgICAgIGtleTogdGhpcy5lbnRpdHlOYW1lLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJ1aWxkUXVlcnlFeHByZXNzaW9uOiBmdW5jdGlvbiBidWlsZFF1ZXJ5RXhwcmVzc2lvbihxdWVyeUV4cHJlc3Npb24sIG9wdGlvbnMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgcmV0dXJuICdlbnRpdGllcy9ieV9uYW1lJztcclxuICB9LFxyXG4gIHVuV3JhcEVudGl0aWVzOiBmdW5jdGlvbiB1bldyYXBFbnRpdGllcyhkb2NzKSB7XHJcbiAgICByZXR1cm4gZG9jcy5tYXAoZG9jID0+IHRoaXMudW5XcmFwKGRvYy5kb2MpKTtcclxuICB9LFxyXG4gIGdldFJlbGF0ZWRDb3VudDogZnVuY3Rpb24gZ2V0UmVsYXRlZENvdW50KHJlbGF0aW9uc2hpcCwgZW50cnkpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgbW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKHJlbGF0aW9uc2hpcC5yZWxhdGVkRW50aXR5LCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgIGlmIChtb2RlbCkge1xyXG4gICAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgICAgcmV0dXJuUXVlcnlSZXN1bHRzOiB0cnVlLFxyXG4gICAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZSxcclxuICAgICAgICBmaWx0ZXI6IHRoaXMuYnVpbGRSZWxhdGVkUXVlcnlFeHByZXNzaW9uKHJlbGF0aW9uc2hpcCwgZW50cnkpLFxyXG4gICAgICAgIGtleTogcmVsYXRpb25zaGlwLnJlbGF0ZWRFbnRpdHksXHJcbiAgICAgIH07XHJcbiAgICAgIG1vZGVsLmdldEVudHJpZXMobnVsbCwgcXVlcnlPcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICBkZWYucmVzb2x2ZShyZXN1bHQubGVuZ3RoKTtcclxuICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgIGRlZi5yZXNvbHZlKC0xKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWYucmVzb2x2ZSgtMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICBidWlsZFJlbGF0ZWRRdWVyeUV4cHJlc3Npb246IGZ1bmN0aW9uIGJ1aWxkUmVsYXRlZFF1ZXJ5RXhwcmVzc2lvbihyZWxhdGlvbnNoaXAsIGVudHJ5KSB7XHJcbiAgICByZXR1cm4gKGVudGl0eSkgPT4ge1xyXG4gICAgICBsZXQgcGFyZW50RGF0YVBhdGg7XHJcbiAgICAgIGxldCByZWxhdGVkRGF0YVBhdGg7XHJcbiAgICAgIGxldCByZWxhdGVkVmFsdWU7XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHkpIHtcclxuICAgICAgICBwYXJlbnREYXRhUGF0aCA9IChyZWxhdGlvbnNoaXAucGFyZW50RGF0YVBhdGgpID8gcmVsYXRpb25zaGlwLnBhcmVudERhdGFQYXRoIDogcmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5O1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHlUeXBlICYmIChyZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHlUeXBlID09PSAnb2JqZWN0JykpIHtcclxuICAgICAgICAgIHBhcmVudERhdGFQYXRoID0gYCR7cmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5fS4ka2V5YDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFyZW50RGF0YVBhdGggPSB0aGlzLmlkUHJvcGVydHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5KSB7XHJcbiAgICAgICAgcmVsYXRlZERhdGFQYXRoID0gKHJlbGF0aW9uc2hpcC5yZWxhdGVkRGF0YVBhdGgpID8gcmVsYXRpb25zaGlwLnJlbGF0ZWREYXRhUGF0aCA6IHJlbGF0aW9uc2hpcC5yZWxhdGVkUHJvcGVydHk7XHJcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcC5yZWxhdGVkUHJvcGVydHlUeXBlICYmIChyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5VHlwZSA9PT0gJ29iamVjdCcpKSB7XHJcbiAgICAgICAgICByZWxhdGVkRGF0YVBhdGggPSBgJHtyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5fS4ka2V5YDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVsYXRlZERhdGFQYXRoID0gJyRrZXknO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBwYXJlbnRWYWx1ZSA9IHV0aWxpdHkuZ2V0VmFsdWUoZW50cnksIHBhcmVudERhdGFQYXRoKTtcclxuICAgICAgaWYgKGVudGl0eSkge1xyXG4gICAgICAgIHJlbGF0ZWRWYWx1ZSA9IHV0aWxpdHkuZ2V0VmFsdWUoZW50aXR5LCByZWxhdGVkRGF0YVBhdGgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgocGFyZW50VmFsdWUgJiYgcmVsYXRlZFZhbHVlKSAmJiAocmVsYXRlZFZhbHVlID09PSBwYXJlbnRWYWx1ZSkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICB9LFxyXG4gIGdldFVzYWdlOiBmdW5jdGlvbiBnZXRVc2FnZSgpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZSxcclxuICAgICAgZGVzY2VuZGluZzogZmFsc2UsXHJcbiAgICAgIGtleTogdGhpcy5lbnRpdHlOYW1lLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBxdWVyeUV4cHJlc3Npb24gPSAnZW50aXRpZXMvYnlfbmFtZSc7XHJcbiAgICBjb25zdCBxdWVyeVJlc3VsdHMgPSBzdG9yZS5xdWVyeShxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICB3aGVuKHF1ZXJ5UmVzdWx0cywgKGRvY3MpID0+IHtcclxuICAgICAgY29uc3QgdXNhZ2UgPSB7fTtcclxuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2dldERvY1NpemUoZG9jc1swXSk7XHJcbiAgICAgIHVzYWdlLmljb25DbGFzcyA9IHRoaXMuaWNvbkNsYXNzO1xyXG4gICAgICB1c2FnZS5lbnRpdHlOYW1lID0gdGhpcy5lbnRpdHlOYW1lO1xyXG4gICAgICB1c2FnZS5kZXNjcmlwdGlvbiA9IHRoaXMuZW50aXR5RGlzcGxheU5hbWVQbHVyYWw7XHJcbiAgICAgIHVzYWdlLm9sZGVzdERhdGUgPSAoZG9jc1swXSkgPyBtb21lbnQoZG9jc1swXS5kb2MubW9kaWZ5RGF0ZSkudG9EYXRlKCkgOiBudWxsOyAvLyBzZWUgZGVjZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgIHVzYWdlLm5ld2VzdERhdGUgPSAoZG9jc1tkb2NzLmxlbmd0aCAtIDFdKSA/IG1vbWVudChkb2NzW2RvY3MubGVuZ3RoIC0gMV0uZG9jLm1vZGlmeURhdGUpLnRvRGF0ZSgpIDogbnVsbDtcclxuICAgICAgdXNhZ2UuY291bnQgPSBkb2NzLmxlbmd0aDtcclxuICAgICAgdXNhZ2Uuc2l6ZUFWRyA9IHNpemU7XHJcbiAgICAgIHVzYWdlLnNpemUgPSB1c2FnZS5jb3VudCAqIChzaXplID8gc2l6ZSA6IDEwKTtcclxuICAgICAgZGVmLnJlc29sdmUodXNhZ2UpO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIF9nZXREb2NTaXplOiBmdW5jdGlvbiBfZ2V0RG9jU2l6ZShkb2MpIHtcclxuICAgIGxldCBzaXplID0gMDtcclxuICAgIGNvbnN0IGNoYXJTaXplID0gMjsgLy8gMiBieXRlc1xyXG4gICAgaWYgKGRvYykge1xyXG4gICAgICBjb25zdCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZG9jKTtcclxuICAgICAgc2l6ZSA9IGNoYXJTaXplICoganNvblN0cmluZy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2l6ZTtcclxuICB9LFxyXG4gIGNsZWFyQWxsRGF0YTogZnVuY3Rpb24gY2xlYXJBbGxEYXRhKCkge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHtcclxuICAgICAgaW5jbHVkZV9kb2NzOiB0cnVlLFxyXG4gICAgICBkZXNjZW5kaW5nOiB0cnVlLFxyXG4gICAgICBrZXk6IHRoaXMuZW50aXR5TmFtZSxcclxuICAgIH07XHJcbiAgICBjb25zdCBxdWVyeUV4cHJlc3Npb24gPSAnZW50aXRpZXMvYnlfbmFtZSc7XHJcbiAgICBjb25zdCBxdWVyeVJlc3VsdHMgPSBzdG9yZS5xdWVyeShxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICB3aGVuKHF1ZXJ5UmVzdWx0cywgKGRvY3MpID0+IHtcclxuICAgICAgY29uc3Qgb2RlZiA9IGRlZjtcclxuICAgICAgY29uc3QgZGVsZXRlUmVxdWVzdHMgPSBkb2NzLm1hcCgoZG9jKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZURvYyhkb2MuZG9jKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmIChkZWxldGVSZXF1ZXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYWxsKGRlbGV0ZVJlcXVlc3RzKS50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICBvZGVmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgb2RlZi5yZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkZWYucmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgY2xlYXJEYXRhT2xkZXJUaGFuOiBmdW5jdGlvbiBjbGVhckFsbERhdGEoZGF5cyA9IDApIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZSxcclxuICAgICAgZGVzY2VuZGluZzogdHJ1ZSxcclxuICAgICAga2V5OiB0aGlzLmVudGl0eU5hbWUsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcXVlcnlFeHByZXNzaW9uID0gJ2VudGl0aWVzL2J5X25hbWUnO1xyXG4gICAgY29uc3QgcXVlcnlSZXN1bHRzID0gc3RvcmUucXVlcnkocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgd2hlbihxdWVyeVJlc3VsdHMsIChkb2NzKSA9PiB7XHJcbiAgICAgIGNvbnN0IG9kZWYgPSBkZWY7XHJcbiAgICAgIGNvbnN0IGRlbGV0ZVJlcXVlc3RzID0gZG9jcy5maWx0ZXIoKHsgZG9jIH0pID0+IHtcclxuICAgICAgICBpZiAoIWRvYy5tb2RpZnlEYXRlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlzID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY29yZERhdGUgPSBtb21lbnQoY29udmVydC50b0RhdGVGcm9tU3RyaW5nKGRvYy5tb2RpZnlEYXRlKSk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBtb21lbnQoKTtcclxuICAgICAgICBjb25zdCBkaWZmID0gY3VycmVudERhdGUuZGlmZihyZWNvcmREYXRlLCAnZGF5cycpO1xyXG4gICAgICAgIGlmIChkaWZmID4gZGF5cykge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pXHJcbiAgICAgICAgLm1hcCgoZG9jKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcmVtb3ZlRG9jKGRvYy5kb2MpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKGRlbGV0ZVJlcXVlc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBhbGwoZGVsZXRlUmVxdWVzdHMpLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgIG9kZWYucmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBvZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRlZi5yZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICByZW1vdmVGcm9tQXV4aWxpYXJ5RW50aXRpZXM6IGZ1bmN0aW9uIHJlbW92ZUZyb21BdXhpbGlhcnlFbnRpdGllcyhlbnRpdHlJZCkge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBydk1vZGVsID0gQXBwLk1vZGVsTWFuYWdlci5nZXRNb2RlbCgnUmVjZW50bHlWaWV3ZWQnLCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgIGNvbnN0IGJjTW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKCdCcmllZmNhc2UnLCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgIGlmIChydk1vZGVsKSB7XHJcbiAgICAgIHJ2TW9kZWwuZGVsZXRlRW50cnlCeUVudGl0eUNvbnRleHQoZW50aXR5SWQsIHRoaXMuZW50aXR5TmFtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoYmNNb2RlbCkge1xyXG4gICAgICBiY01vZGVsLmRlbGV0ZUVudHJ5QnlFbnRpdHlDb250ZXh0KGVudGl0eUlkLCB0aGlzLmVudGl0eU5hbWUpO1xyXG4gICAgfVxyXG4gICAgZGVmLnJlc29sdmUoKTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==