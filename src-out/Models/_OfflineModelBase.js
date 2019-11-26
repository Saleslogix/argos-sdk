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
      this.inherited(init, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Nb2RlbHMvX09mZmxpbmVNb2RlbEJhc2UuanMiXSwibmFtZXMiOlsiZGF0YWJhc2VOYW1lIiwiX3N0b3JlIiwiX19jbGFzcyIsInN0b3JlIiwibW9kZWxUeXBlIiwiT0ZGTElORSIsImluaXQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJjcmVhdGVOYW1lZFF1ZXJpZXMiLCJnZXRTdG9yZSIsImNyZWF0ZU5hbWVkUXVlcnkiLCJfaWQiLCJfcmV2Iiwidmlld3MiLCJieV9uYW1lIiwibWFwIiwiZG9jIiwiZW1pdCIsImVudGl0eU5hbWUiLCJ0b1N0cmluZyIsImdldERvY0lkIiwiZ2V0RW50aXR5SWQiLCJlbnRyeSIsImdldEVudHJ5IiwiZW50aXR5SWQiLCJkZWYiLCJnZXRFbnRyeURvYyIsInRoZW4iLCJyZXNvbHZlIiwidW5XcmFwIiwiZXJyIiwicmVqZWN0IiwiZ2V0IiwicmVzdWx0cyIsInNhdmVFbnRyeSIsInNhdmVFbnRpdHkiLCJvcHRpb25zIiwidXBkYXRlRW50cnkiLCJ1cGRhdGVSZXN1bHQiLCJvZGVmIiwic2F2ZVJlbGF0ZWRFbnRyaWVzIiwiaW5zZXJ0RW50cnkiLCJpbnNlcnRSZXN1bHQiLCJwcm9taXNlIiwid3JhcCIsImFkZCIsInJlc3VsdCIsInVwZGF0ZUVudGl0eSIsImVudGl0eSIsIm1vZGlmeURhdGUiLCJtb21lbnQiLCJ0b0RhdGUiLCJkZXNjcmlwdGlvbiIsImdldEVudGl0eURlc2NyaXB0aW9uIiwicHV0IiwiY3JlYXRlRW50cnkiLCJJZCIsIkNyZWF0ZURhdGUiLCJNb2RpZnlEYXRlIiwiZGVsZXRlRW50cnkiLCJfcmVtb3ZlRG9jIiwib25FbnRyeURlbGV0ZSIsInJlbW92ZSIsInBhcmVudEVudHJ5IiwiZW50cmllcyIsIiRyZWxhdGVkRW50aXRpZXMiLCJyZWxhdGVkUHJvbWlzZXMiLCJmb3JFYWNoIiwicmVsYXRlZCIsIm1vZGVsIiwiQXBwIiwiTW9kZWxNYW5hZ2VyIiwiZ2V0TW9kZWwiLCJlbnRpdGllcyIsInJlbGF0ZWRFbnRyeSIsImxlbmd0aCIsInJlbGF0ZWRSZXN1bHRzIiwiY3JlYXRlRGF0ZSIsInJlc291cmNlS2luZCIsImVudGl0eURpc3BsYXlOYW1lIiwiJG9mZmxpbmVEYXRlIiwiZ2V0RW50cmllcyIsInF1ZXJ5IiwicXVlcnlPcHRpb25zIiwiYnVpbGRRdWVyeU9wdGlvbnMiLCJtaXhpbiIsInF1ZXJ5RXhwcmVzc2lvbiIsImJ1aWxkUXVlcnlFeHByZXNzaW9uIiwicXVlcnlSZXN1bHRzIiwiZG9jcyIsInByb2Nlc3NFbnRyaWVzIiwidW5XcmFwRW50aXRpZXMiLCJyZXR1cm5RdWVyeVJlc3VsdHMiLCJmaWx0ZXIiLCJmaWx0ZXJEb2NzIiwiaW5jbHVkZV9kb2NzIiwiZGVzY2VuZGluZyIsImtleSIsImdldFJlbGF0ZWRDb3VudCIsInJlbGF0aW9uc2hpcCIsInJlbGF0ZWRFbnRpdHkiLCJidWlsZFJlbGF0ZWRRdWVyeUV4cHJlc3Npb24iLCJwYXJlbnREYXRhUGF0aCIsInJlbGF0ZWREYXRhUGF0aCIsInJlbGF0ZWRWYWx1ZSIsInBhcmVudFByb3BlcnR5IiwicGFyZW50UHJvcGVydHlUeXBlIiwiaWRQcm9wZXJ0eSIsInJlbGF0ZWRQcm9wZXJ0eSIsInJlbGF0ZWRQcm9wZXJ0eVR5cGUiLCJwYXJlbnRWYWx1ZSIsImdldFZhbHVlIiwiZ2V0VXNhZ2UiLCJ1c2FnZSIsInNpemUiLCJfZ2V0RG9jU2l6ZSIsImljb25DbGFzcyIsImVudGl0eURpc3BsYXlOYW1lUGx1cmFsIiwib2xkZXN0RGF0ZSIsIm5ld2VzdERhdGUiLCJjb3VudCIsInNpemVBVkciLCJjaGFyU2l6ZSIsImpzb25TdHJpbmciLCJKU09OIiwic3RyaW5naWZ5IiwiY2xlYXJBbGxEYXRhIiwiZGVsZXRlUmVxdWVzdHMiLCJjbGVhckRhdGFPbGRlclRoYW4iLCJkYXlzIiwicmVjb3JkRGF0ZSIsInRvRGF0ZUZyb21TdHJpbmciLCJjdXJyZW50RGF0ZSIsImRpZmYiLCJyZW1vdmVGcm9tQXV4aWxpYXJ5RW50aXRpZXMiLCJydk1vZGVsIiwiYmNNb2RlbCIsImRlbGV0ZUVudHJ5QnlFbnRpdHlDb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsTUFBTUEsZUFBZSxhQUFyQjtBQUNBLE1BQU1DLFNBQVMsc0JBQWlCRCxZQUFqQixDQUFmOztBQUVBOzs7QUFHQSxNQUFNRSxVQUFVLHVCQUFRLHVDQUFSLEVBQWlELG1EQUFqRCxFQUFvRjs7QUFFbEdDLFdBQU8sSUFGMkY7QUFHbEdDLGVBQVcsZ0JBQVlDLE9BSDJFO0FBSWxHQyxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEIsV0FBS0MsU0FBTCxDQUFlRCxJQUFmLEVBQXFCRSxTQUFyQjtBQUNBLFdBQUtDLGtCQUFMO0FBQ0QsS0FQaUc7QUFRbEdBLHdCQUFvQixTQUFTQSxrQkFBVCxHQUE4QjtBQUNoRCxVQUFNTixRQUFRLEtBQUtPLFFBQUwsRUFBZDtBQUNBO0FBQ0FQLFlBQU1RLGdCQUFOLENBQXVCO0FBQ3JCQyxhQUFLLGtCQURnQjtBQUVyQkMsY0FBTSxHQUZlO0FBR3JCQyxlQUFPO0FBQ0xDLG1CQUFTO0FBQ1BDLGlCQUFLLFNBQVNBLEdBQVQsQ0FBYUMsR0FBYixFQUFrQjtBQUNyQkMsbUJBQUtELElBQUlFLFVBQVQsRUFEcUIsQ0FDQztBQUN2QixhQUZJLENBRUhDLFFBRkc7QUFERTtBQURKO0FBSGMsT0FBdkI7QUFXRCxLQXRCaUc7QUF1QmxHVixjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUIsVUFBSSxDQUFDLEtBQUtQLEtBQVYsRUFBaUI7QUFDZixhQUFLQSxLQUFMLEdBQWFGLE1BQWI7QUFDRDtBQUNELGFBQU8sS0FBS0UsS0FBWjtBQUNELEtBNUJpRztBQTZCbEdrQixjQUFVLFNBQVNDLFdBQVQsQ0FBcUJDLEtBQXJCLEVBQTRCO0FBQ3BDLGFBQU8sS0FBS0QsV0FBTCxDQUFpQkMsS0FBakIsQ0FBUDtBQUNELEtBL0JpRztBQWdDbEdDLGNBQVUsU0FBU0EsUUFBVCxDQUFrQkMsUUFBbEIsRUFBNEI7QUFBQTs7QUFDcEMsVUFBTUMsTUFBTSx3QkFBWjtBQUNBLFdBQUtDLFdBQUwsQ0FBaUJGLFFBQWpCLEVBQTJCRyxJQUEzQixDQUFnQyxVQUFDWCxHQUFELEVBQVM7QUFDdkNTLFlBQUlHLE9BQUosQ0FBWSxNQUFLQyxNQUFMLENBQVliLEdBQVosQ0FBWjtBQUNELE9BRkQsRUFFRyxVQUFDYyxHQUFELEVBQVM7QUFDVkwsWUFBSU0sTUFBSixDQUFXRCxHQUFYO0FBQ0QsT0FKRDtBQUtBLGFBQU9MLEdBQVA7QUFDRCxLQXhDaUc7QUF5Q2xHQyxpQkFBYSxTQUFTSCxRQUFULENBQWtCQyxRQUFsQixFQUE0QjtBQUN2QyxVQUFNdEIsUUFBUSxLQUFLTyxRQUFMLEVBQWQ7QUFDQSxVQUFNZ0IsTUFBTSx3QkFBWjtBQUNBdkIsWUFBTThCLEdBQU4sQ0FBVVIsUUFBVixFQUFvQkcsSUFBcEIsQ0FBeUIsVUFBQ00sT0FBRCxFQUFhO0FBQ3BDUixZQUFJRyxPQUFKLENBQVlLLE9BQVo7QUFDRCxPQUZELEVBRUcsVUFBQ0gsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BSkQ7QUFLQSxhQUFPTCxHQUFQO0FBQ0QsS0FsRGlHO0FBbURsR1MsZUFBVyxTQUFTQyxVQUFULENBQW9CYixLQUFwQixFQUEyQmMsT0FBM0IsRUFBb0M7QUFBQTs7QUFDN0MsVUFBTVgsTUFBTSx3QkFBWjtBQUNBLFdBQUtZLFdBQUwsQ0FBaUJmLEtBQWpCLEVBQXdCYyxPQUF4QixFQUFpQ1QsSUFBakMsQ0FBc0MsVUFBQ1csWUFBRCxFQUFrQjtBQUN0RCxZQUFNQyxPQUFPZCxHQUFiO0FBQ0EsZUFBS2Usa0JBQUwsQ0FBd0JsQixLQUF4QixFQUErQmMsT0FBL0IsRUFBd0NULElBQXhDLENBQTZDLFlBQU07QUFDakRZLGVBQUtYLE9BQUwsQ0FBYVUsWUFBYjtBQUNELFNBRkQsRUFFRyxVQUFDUixHQUFELEVBQVM7QUFDVlMsZUFBS1IsTUFBTCxDQUFZRCxHQUFaO0FBQ0QsU0FKRDtBQUtELE9BUEQsRUFPRyxZQUFNO0FBQ1A7QUFDQSxlQUFLVyxXQUFMLENBQWlCbkIsS0FBakIsRUFBd0JjLE9BQXhCLEVBQWlDVCxJQUFqQyxDQUFzQyxVQUFDZSxZQUFELEVBQWtCO0FBQ3RELGNBQU1ILE9BQU9kLEdBQWI7QUFDQSxpQkFBS2Usa0JBQUwsQ0FBd0JsQixLQUF4QixFQUErQmMsT0FBL0IsRUFBd0NULElBQXhDLENBQTZDLFlBQU07QUFDakRZLGlCQUFLWCxPQUFMLENBQWFjLFlBQWI7QUFDRCxXQUZELEVBRUcsVUFBQ1osR0FBRCxFQUFTO0FBQ1ZTLGlCQUFLUixNQUFMLENBQVlELEdBQVo7QUFDRCxXQUpEO0FBS0QsU0FQRCxFQU9HLFVBQUNBLEdBQUQsRUFBUztBQUNWTCxjQUFJTSxNQUFKLENBQVdELEdBQVg7QUFDRCxTQVREO0FBVUQsT0FuQkQ7QUFvQkEsYUFBT0wsSUFBSWtCLE9BQVg7QUFDRCxLQTFFaUc7QUEyRWxHRixpQkFBYSxTQUFTQSxXQUFULENBQXFCbkIsS0FBckIsRUFBNEJjLE9BQTVCLEVBQXFDO0FBQ2hELFVBQU1sQyxRQUFRLEtBQUtPLFFBQUwsRUFBZDtBQUNBLFVBQU1nQixNQUFNLHdCQUFaO0FBQ0EsVUFBTVQsTUFBTSxLQUFLNEIsSUFBTCxDQUFVdEIsS0FBVixFQUFpQmMsT0FBakIsQ0FBWjtBQUNBbEMsWUFBTTJDLEdBQU4sQ0FBVTdCLEdBQVYsRUFBZVcsSUFBZixDQUFvQixVQUFDbUIsTUFBRCxFQUFZO0FBQzlCckIsWUFBSUcsT0FBSixDQUFZa0IsTUFBWjtBQUNELE9BRkQsRUFHQSxVQUFDaEIsR0FBRCxFQUFTO0FBQ1BMLFlBQUlNLE1BQUosOEJBQXNDRCxHQUF0QztBQUNELE9BTEQ7QUFNQSxhQUFPTCxJQUFJa0IsT0FBWDtBQUNELEtBdEZpRztBQXVGbEdOLGlCQUFhLFNBQVNVLFlBQVQsQ0FBc0J6QixLQUF0QixFQUE2QmMsT0FBN0IsRUFBc0M7QUFBQTs7QUFDakQsVUFBTWxDLFFBQVEsS0FBS08sUUFBTCxFQUFkO0FBQ0EsVUFBTWdCLE1BQU0sd0JBQVo7QUFDQSxVQUFNRCxXQUFXLEtBQUtILFdBQUwsQ0FBaUJDLEtBQWpCLEVBQXdCYyxPQUF4QixDQUFqQjtBQUNBLFdBQUtWLFdBQUwsQ0FBaUJGLFFBQWpCLEVBQTJCRyxJQUEzQixDQUFnQyxVQUFDWCxHQUFELEVBQVM7QUFDdkMsWUFBTXVCLE9BQU9kLEdBQWI7QUFDQVQsWUFBSWdDLE1BQUosR0FBYTFCLEtBQWI7QUFDQU4sWUFBSWlDLFVBQUosR0FBaUJDLFNBQVNDLE1BQVQsRUFBakI7QUFDQW5DLFlBQUlvQyxXQUFKLEdBQWtCLE9BQUtDLG9CQUFMLENBQTBCL0IsS0FBMUIsQ0FBbEI7QUFDQXBCLGNBQU1vRCxHQUFOLENBQVV0QyxHQUFWLEVBQWVXLElBQWYsQ0FBb0IsVUFBQ21CLE1BQUQsRUFBWTtBQUM5QlAsZUFBS1gsT0FBTCxDQUFha0IsTUFBYjtBQUNELFNBRkQsRUFFRyxVQUFDaEIsR0FBRCxFQUFTO0FBQ1ZTLGVBQUtSLE1BQUwsNkJBQXNDRCxHQUF0QztBQUNELFNBSkQ7QUFLRCxPQVZELEVBVUcsVUFBQ0EsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosaUNBQXlDRCxHQUF6QztBQUNELE9BWkQ7QUFhQSxhQUFPTCxJQUFJa0IsT0FBWDtBQUNELEtBekdpRztBQTBHbEdZLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsVUFBTWpDLFFBQVEsRUFBZCxDQURrQyxDQUNoQjtBQUNsQkEsWUFBTWtDLEVBQU4sR0FBVyxJQUFYO0FBQ0FsQyxZQUFNbUMsVUFBTixHQUFtQlAsU0FBU0MsTUFBVCxFQUFuQjtBQUNBN0IsWUFBTW9DLFVBQU4sR0FBbUJSLFNBQVNDLE1BQVQsRUFBbkI7QUFDQSxhQUFPN0IsS0FBUDtBQUNELEtBaEhpRztBQWlIbEdxQyxpQkFBYSxTQUFTQSxXQUFULENBQXFCbkMsUUFBckIsRUFBK0I7QUFBQTs7QUFDMUMsVUFBTUMsTUFBTSx3QkFBWjtBQUNBLFVBQU12QixRQUFRLEtBQUtPLFFBQUwsRUFBZDtBQUNBUCxZQUFNOEIsR0FBTixDQUFVUixRQUFWLEVBQW9CRyxJQUFwQixDQUF5QixVQUFDWCxHQUFELEVBQVM7QUFDaEMsWUFBTXVCLE9BQU9kLEdBQWI7QUFDQSxlQUFLbUMsVUFBTCxDQUFnQjVDLEdBQWhCLEVBQXFCVyxJQUFyQixDQUEwQixVQUFDbUIsTUFBRCxFQUFZO0FBQ3BDLGlCQUFLZSxhQUFMLENBQW1CckMsUUFBbkI7QUFDQWUsZUFBS1gsT0FBTCxDQUFha0IsTUFBYjtBQUNELFNBSEQsRUFHRyxVQUFDaEIsR0FBRCxFQUFTO0FBQ1ZTLGVBQUtSLE1BQUwsQ0FBWUQsR0FBWjtBQUNELFNBTEQ7QUFNRCxPQVJELEVBUUcsVUFBQ0EsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BVkQ7QUFXQSxhQUFPTCxJQUFJa0IsT0FBWDtBQUNELEtBaElpRztBQWlJbEdpQixnQkFBWSxTQUFTQSxVQUFULENBQW9CNUMsR0FBcEIsRUFBeUI7QUFDbkMsVUFBTVMsTUFBTSx3QkFBWjtBQUNBLFVBQU12QixRQUFRLEtBQUtPLFFBQUwsRUFBZDtBQUNBUCxZQUFNNEQsTUFBTixDQUFhOUMsSUFBSUwsR0FBakIsRUFBc0JLLElBQUlKLElBQTFCLEVBQWdDZSxJQUFoQyxDQUFxQyxVQUFDbUIsTUFBRCxFQUFZO0FBQy9DckIsWUFBSUcsT0FBSixDQUFZa0IsTUFBWjtBQUNELE9BRkQsRUFFRyxVQUFDaEIsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BSkQ7QUFLQSxhQUFPTCxJQUFJa0IsT0FBWDtBQUNELEtBMUlpRztBQTJJbEdrQixtQkFBZSxTQUFTQSxhQUFULEdBQXlCLENBQ3ZDLENBNUlpRztBQTZJbEdyQix3QkFBb0IsU0FBU0Esa0JBQVQsQ0FBNEJ1QixXQUE1QixFQUF5QzNCLE9BQXpDLEVBQWtEO0FBQ3BFLFVBQU00QixVQUFXRCxlQUFlQSxZQUFZRSxnQkFBNUIsR0FBZ0RGLFlBQVlFLGdCQUE1RCxHQUErRSxFQUEvRjtBQUNBLFVBQUlDLGtCQUFrQixFQUF0QjtBQUNBLFVBQU16QyxNQUFNLHdCQUFaO0FBQ0F1QyxjQUFRRyxPQUFSLENBQWdCLFVBQUNDLE9BQUQsRUFBYTtBQUMzQixZQUFNQyxRQUFRQyxJQUFJQyxZQUFKLENBQWlCQyxRQUFqQixDQUEwQkosUUFBUWxELFVBQWxDLEVBQThDLGdCQUFZZCxPQUExRCxDQUFkO0FBQ0EsWUFBSWlFLFNBQVNELFFBQVFLLFFBQXJCLEVBQStCO0FBQzdCUCw0QkFBa0JFLFFBQVFLLFFBQVIsQ0FBaUIxRCxHQUFqQixDQUFxQixVQUFDMkQsWUFBRCxFQUFrQjtBQUN2RCxtQkFBT0wsTUFBTW5DLFNBQU4sQ0FBZ0J3QyxZQUFoQixFQUE4QnRDLE9BQTlCLENBQVA7QUFDRCxXQUZpQixDQUFsQjtBQUdEO0FBQ0YsT0FQRDtBQVFBLFVBQUk4QixnQkFBZ0JTLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO0FBQzlCLDJCQUFJVCxlQUFKLEVBQXFCdkMsSUFBckIsQ0FDRSxVQUFDaUQsY0FBRCxFQUFvQjtBQUNsQm5ELGNBQUlHLE9BQUosQ0FBWWdELGNBQVo7QUFDRCxTQUhILEVBSUUsVUFBQzlDLEdBQUQsRUFBUztBQUNQTCxjQUFJTSxNQUFKLENBQVdELEdBQVg7QUFDRCxTQU5IO0FBT0QsT0FSRCxNQVFPO0FBQ0xMLFlBQUlHLE9BQUosQ0FBWW1DLFdBQVo7QUFDRDtBQUNELGFBQU90QyxJQUFJa0IsT0FBWDtBQUNELEtBcktpRztBQXNLbEdDLFVBQU0sU0FBU0EsSUFBVCxDQUFjdEIsS0FBZCxFQUFxQjtBQUN6QixVQUFNTixNQUFNO0FBQ1ZMLGFBQUssS0FBS1MsUUFBTCxDQUFjRSxLQUFkLENBREs7QUFFVjBCLGdCQUFRMUIsS0FGRTtBQUdWRSxrQkFBVSxLQUFLSCxXQUFMLENBQWlCQyxLQUFqQixDQUhBO0FBSVZ1RCxvQkFBWTNCLFNBQVNDLE1BQVQsRUFKRjtBQUtWRixvQkFBWUMsU0FBU0MsTUFBVCxFQUxGO0FBTVYyQixzQkFBYyxLQUFLQSxZQU5UO0FBT1YxQixxQkFBYSxLQUFLQyxvQkFBTCxDQUEwQi9CLEtBQTFCLENBUEg7QUFRVkosb0JBQVksS0FBS0EsVUFSUDtBQVNWNkQsMkJBQW1CLEtBQUtBO0FBVGQsT0FBWjtBQVdBLGFBQU8vRCxHQUFQO0FBQ0QsS0FuTGlHO0FBb0xsR2EsWUFBUSxTQUFTQSxNQUFULENBQWdCYixHQUFoQixFQUFxQjtBQUMzQixVQUFJQSxJQUFJZ0MsTUFBUixFQUFnQjtBQUNkaEMsWUFBSWdDLE1BQUosQ0FBV2dDLFlBQVgsR0FBMEJoRSxJQUFJaUMsVUFBOUI7QUFDRDtBQUNELGFBQU9qQyxJQUFJZ0MsTUFBWDtBQUNELEtBekxpRztBQTBMbEdpQyxnQkFBWSxTQUFTQSxVQUFULENBQW9CQyxLQUFwQixFQUEyQjlDLE9BQTNCLEVBQW9DO0FBQUE7O0FBQzlDLFVBQU1sQyxRQUFRLEtBQUtPLFFBQUwsRUFBZDtBQUNBLFVBQU1nQixNQUFNLHdCQUFaO0FBQ0EsVUFBTTBELGVBQWUsS0FBS0MsaUJBQUwsRUFBckI7QUFDQSxxQkFBS0MsS0FBTCxDQUFXRixZQUFYLEVBQXlCL0MsT0FBekI7QUFDQSxVQUFNa0Qsa0JBQWtCLEtBQUtDLG9CQUFMLENBQTBCTCxLQUExQixFQUFpQ0MsWUFBakMsQ0FBeEI7QUFDQSxVQUFNSyxlQUFldEYsTUFBTWdGLEtBQU4sQ0FBWUksZUFBWixFQUE2QkgsWUFBN0IsQ0FBckI7QUFDQSwwQkFBS0ssWUFBTCxFQUFtQixVQUFDQyxJQUFELEVBQVU7QUFDM0IsWUFBTWhCLFdBQVcsT0FBS2lCLGNBQUwsQ0FBb0IsT0FBS0MsY0FBTCxDQUFvQkYsSUFBcEIsQ0FBcEIsRUFBK0NOLFlBQS9DLEVBQTZETSxJQUE3RCxDQUFqQjtBQUNBaEUsWUFBSUcsT0FBSixDQUFZNkMsUUFBWjtBQUNELE9BSEQsRUFHRyxVQUFDM0MsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BTEQ7QUFNQSxVQUFJcUQsZ0JBQWdCQSxhQUFhUyxrQkFBakMsRUFBcUQ7QUFDbkQsZUFBTyw0QkFBYW5FLElBQUlrQixPQUFqQixDQUFQLENBRG1ELENBQ2pCO0FBQ25DO0FBQ0QsYUFBT2xCLElBQUlrQixPQUFYO0FBQ0QsS0EzTWlHO0FBNE1sRytDLG9CQUFnQixTQUFTQSxjQUFULENBQXdCakIsUUFBeEIsRUFBa0NVLFlBQWxDLEVBQWdETSxJQUFoRCxFQUFzRDtBQUNwRSxVQUFJLE9BQU9OLGFBQWFVLE1BQXBCLEtBQStCLFVBQW5DLEVBQStDO0FBQzdDLGVBQU9wQixTQUFTb0IsTUFBVCxDQUFnQlYsYUFBYVUsTUFBN0IsQ0FBUDtBQUNEOztBQUVELFVBQUksT0FBT1YsYUFBYVcsVUFBcEIsS0FBbUMsVUFBdkMsRUFBbUQ7QUFDakQsZUFBT0wsS0FBS0ksTUFBTCxDQUFZVixhQUFhVyxVQUF6QixDQUFQO0FBQ0Q7O0FBRUQsYUFBT3JCLFFBQVA7QUFDRCxLQXROaUc7QUF1TmxHVyx1QkFBbUIsU0FBU0EsaUJBQVQsR0FBNkI7QUFDOUMsYUFBTztBQUNMVyxzQkFBYyxJQURUO0FBRUxDLG9CQUFZLElBRlA7QUFHTEMsYUFBSyxLQUFLL0U7QUFITCxPQUFQO0FBS0QsS0E3TmlHO0FBOE5sR3FFLDBCQUFzQixTQUFTQSxvQkFBVCxDQUE4QkQsZUFBOUIsRUFBK0NsRCxPQUEvQyxFQUF3RDtBQUFFO0FBQzlFLGFBQU8sa0JBQVA7QUFDRCxLQWhPaUc7QUFpT2xHdUQsb0JBQWdCLFNBQVNBLGNBQVQsQ0FBd0JGLElBQXhCLEVBQThCO0FBQUE7O0FBQzVDLGFBQU9BLEtBQUsxRSxHQUFMLENBQVM7QUFBQSxlQUFPLE9BQUtjLE1BQUwsQ0FBWWIsSUFBSUEsR0FBaEIsQ0FBUDtBQUFBLE9BQVQsQ0FBUDtBQUNELEtBbk9pRztBQW9PbEdrRixxQkFBaUIsU0FBU0EsZUFBVCxDQUF5QkMsWUFBekIsRUFBdUM3RSxLQUF2QyxFQUE4QztBQUM3RCxVQUFNRyxNQUFNLHdCQUFaO0FBQ0EsVUFBTTRDLFFBQVFDLElBQUlDLFlBQUosQ0FBaUJDLFFBQWpCLENBQTBCMkIsYUFBYUMsYUFBdkMsRUFBc0QsZ0JBQVloRyxPQUFsRSxDQUFkO0FBQ0EsVUFBSWlFLEtBQUosRUFBVztBQUNULFlBQU1jLGVBQWU7QUFDbkJTLDhCQUFvQixJQUREO0FBRW5CRyx3QkFBYyxJQUZLO0FBR25CRixrQkFBUSxLQUFLUSwyQkFBTCxDQUFpQ0YsWUFBakMsRUFBK0M3RSxLQUEvQyxDQUhXO0FBSW5CMkUsZUFBS0UsYUFBYUM7QUFKQyxTQUFyQjtBQU1BL0IsY0FBTVksVUFBTixDQUFpQixJQUFqQixFQUF1QkUsWUFBdkIsRUFBcUN4RCxJQUFyQyxDQUEwQyxVQUFDbUIsTUFBRCxFQUFZO0FBQ3BEckIsY0FBSUcsT0FBSixDQUFZa0IsT0FBTzZCLE1BQW5CO0FBQ0QsU0FGRCxFQUVHLFlBQU07QUFDUGxELGNBQUlHLE9BQUosQ0FBWSxDQUFDLENBQWI7QUFDRCxTQUpEO0FBS0QsT0FaRCxNQVlPO0FBQ0xILFlBQUlHLE9BQUosQ0FBWSxDQUFDLENBQWI7QUFDRDtBQUNELGFBQU9ILElBQUlrQixPQUFYO0FBQ0QsS0F2UGlHO0FBd1BsRzBELGlDQUE2QixTQUFTQSwyQkFBVCxDQUFxQ0YsWUFBckMsRUFBbUQ3RSxLQUFuRCxFQUEwRDtBQUFBOztBQUNyRixhQUFPLFVBQUMwQixNQUFELEVBQVk7QUFDakIsWUFBSXNELHVCQUFKO0FBQ0EsWUFBSUMsd0JBQUo7QUFDQSxZQUFJQyxxQkFBSjtBQUNBLFlBQUlMLGFBQWFNLGNBQWpCLEVBQWlDO0FBQy9CSCwyQkFBa0JILGFBQWFHLGNBQWQsR0FBZ0NILGFBQWFHLGNBQTdDLEdBQThESCxhQUFhTSxjQUE1RjtBQUNBLGNBQUlOLGFBQWFPLGtCQUFiLElBQW9DUCxhQUFhTyxrQkFBYixLQUFvQyxRQUE1RSxFQUF1RjtBQUNyRkosNkJBQW9CSCxhQUFhTSxjQUFqQztBQUNEO0FBQ0YsU0FMRCxNQUtPO0FBQ0xILDJCQUFpQixPQUFLSyxVQUF0QjtBQUNEOztBQUVELFlBQUlSLGFBQWFTLGVBQWpCLEVBQWtDO0FBQ2hDTCw0QkFBbUJKLGFBQWFJLGVBQWQsR0FBaUNKLGFBQWFJLGVBQTlDLEdBQWdFSixhQUFhUyxlQUEvRjtBQUNBLGNBQUlULGFBQWFVLG1CQUFiLElBQXFDVixhQUFhVSxtQkFBYixLQUFxQyxRQUE5RSxFQUF5RjtBQUN2Rk4sOEJBQXFCSixhQUFhUyxlQUFsQztBQUNEO0FBQ0YsU0FMRCxNQUtPO0FBQ0xMLDRCQUFrQixNQUFsQjtBQUNEOztBQUVELFlBQU1PLGNBQWMsa0JBQVFDLFFBQVIsQ0FBaUJ6RixLQUFqQixFQUF3QmdGLGNBQXhCLENBQXBCO0FBQ0EsWUFBSXRELE1BQUosRUFBWTtBQUNWd0QseUJBQWUsa0JBQVFPLFFBQVIsQ0FBaUIvRCxNQUFqQixFQUF5QnVELGVBQXpCLENBQWY7QUFDRDtBQUNELFlBQUtPLGVBQWVOLFlBQWhCLElBQWtDQSxpQkFBaUJNLFdBQXZELEVBQXFFO0FBQ25FLGlCQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFPLEtBQVA7QUFDRCxPQS9CRDtBQWdDRCxLQXpSaUc7QUEwUmxHRSxjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFBQTs7QUFDNUIsVUFBTTlHLFFBQVEsS0FBS08sUUFBTCxFQUFkO0FBQ0EsVUFBTWdCLE1BQU0sd0JBQVo7QUFDQSxVQUFNMEQsZUFBZTtBQUNuQlksc0JBQWMsSUFESztBQUVuQkMsb0JBQVksS0FGTztBQUduQkMsYUFBSyxLQUFLL0U7QUFIUyxPQUFyQjs7QUFNQSxVQUFNb0Usa0JBQWtCLGtCQUF4QjtBQUNBLFVBQU1FLGVBQWV0RixNQUFNZ0YsS0FBTixDQUFZSSxlQUFaLEVBQTZCSCxZQUE3QixDQUFyQjtBQUNBLDBCQUFLSyxZQUFMLEVBQW1CLFVBQUNDLElBQUQsRUFBVTtBQUMzQixZQUFNd0IsUUFBUSxFQUFkO0FBQ0EsWUFBTUMsT0FBTyxPQUFLQyxXQUFMLENBQWlCMUIsS0FBSyxDQUFMLENBQWpCLENBQWI7QUFDQXdCLGNBQU1HLFNBQU4sR0FBa0IsT0FBS0EsU0FBdkI7QUFDQUgsY0FBTS9GLFVBQU4sR0FBbUIsT0FBS0EsVUFBeEI7QUFDQStGLGNBQU03RCxXQUFOLEdBQW9CLE9BQUtpRSx1QkFBekI7QUFDQUosY0FBTUssVUFBTixHQUFvQjdCLEtBQUssQ0FBTCxDQUFELEdBQVl2QyxPQUFPdUMsS0FBSyxDQUFMLEVBQVF6RSxHQUFSLENBQVlpQyxVQUFuQixFQUErQkUsTUFBL0IsRUFBWixHQUFzRCxJQUF6RSxDQU4yQixDQU1vRDtBQUMvRThELGNBQU1NLFVBQU4sR0FBb0I5QixLQUFLQSxLQUFLZCxNQUFMLEdBQWMsQ0FBbkIsQ0FBRCxHQUEwQnpCLE9BQU91QyxLQUFLQSxLQUFLZCxNQUFMLEdBQWMsQ0FBbkIsRUFBc0IzRCxHQUF0QixDQUEwQmlDLFVBQWpDLEVBQTZDRSxNQUE3QyxFQUExQixHQUFrRixJQUFyRztBQUNBOEQsY0FBTU8sS0FBTixHQUFjL0IsS0FBS2QsTUFBbkI7QUFDQXNDLGNBQU1RLE9BQU4sR0FBZ0JQLElBQWhCO0FBQ0FELGNBQU1DLElBQU4sR0FBYUQsTUFBTU8sS0FBTixJQUFlTixPQUFPQSxJQUFQLEdBQWMsRUFBN0IsQ0FBYjtBQUNBekYsWUFBSUcsT0FBSixDQUFZcUYsS0FBWjtBQUNELE9BWkQsRUFZRyxVQUFDbkYsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BZEQ7QUFlQSxhQUFPTCxJQUFJa0IsT0FBWDtBQUNELEtBclRpRztBQXNUbEd3RSxpQkFBYSxTQUFTQSxXQUFULENBQXFCbkcsR0FBckIsRUFBMEI7QUFDckMsVUFBSWtHLE9BQU8sQ0FBWDtBQUNBLFVBQU1RLFdBQVcsQ0FBakIsQ0FGcUMsQ0FFakI7QUFDcEIsVUFBSTFHLEdBQUosRUFBUztBQUNQLFlBQU0yRyxhQUFhQyxLQUFLQyxTQUFMLENBQWU3RyxHQUFmLENBQW5CO0FBQ0FrRyxlQUFPUSxXQUFXQyxXQUFXaEQsTUFBN0I7QUFDRDtBQUNELGFBQU91QyxJQUFQO0FBQ0QsS0E5VGlHO0FBK1RsR1ksa0JBQWMsU0FBU0EsWUFBVCxHQUF3QjtBQUFBOztBQUNwQyxVQUFNNUgsUUFBUSxLQUFLTyxRQUFMLEVBQWQ7QUFDQSxVQUFNZ0IsTUFBTSx3QkFBWjtBQUNBLFVBQU0wRCxlQUFlO0FBQ25CWSxzQkFBYyxJQURLO0FBRW5CQyxvQkFBWSxJQUZPO0FBR25CQyxhQUFLLEtBQUsvRTtBQUhTLE9BQXJCO0FBS0EsVUFBTW9FLGtCQUFrQixrQkFBeEI7QUFDQSxVQUFNRSxlQUFldEYsTUFBTWdGLEtBQU4sQ0FBWUksZUFBWixFQUE2QkgsWUFBN0IsQ0FBckI7QUFDQSwwQkFBS0ssWUFBTCxFQUFtQixVQUFDQyxJQUFELEVBQVU7QUFDM0IsWUFBTWxELE9BQU9kLEdBQWI7QUFDQSxZQUFNc0csaUJBQWlCdEMsS0FBSzFFLEdBQUwsQ0FBUyxVQUFDQyxHQUFELEVBQVM7QUFDdkMsaUJBQU8sT0FBSzRDLFVBQUwsQ0FBZ0I1QyxJQUFJQSxHQUFwQixDQUFQO0FBQ0QsU0FGc0IsQ0FBdkI7QUFHQSxZQUFJK0csZUFBZXBELE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDN0IsNkJBQUlvRCxjQUFKLEVBQW9CcEcsSUFBcEIsQ0FBeUIsVUFBQ00sT0FBRCxFQUFhO0FBQ3BDTSxpQkFBS1gsT0FBTCxDQUFhSyxPQUFiO0FBQ0QsV0FGRCxFQUVHLFVBQUNILEdBQUQsRUFBUztBQUNWUyxpQkFBS1IsTUFBTCxDQUFZRCxHQUFaO0FBQ0QsV0FKRDtBQUtELFNBTkQsTUFNTztBQUNMTCxjQUFJRyxPQUFKO0FBQ0Q7QUFDRixPQWRELEVBY0csVUFBQ0UsR0FBRCxFQUFTO0FBQ1ZMLFlBQUlNLE1BQUosQ0FBV0QsR0FBWDtBQUNELE9BaEJEO0FBaUJBLGFBQU9MLElBQUlrQixPQUFYO0FBQ0QsS0EzVmlHO0FBNFZsR3FGLHdCQUFvQixTQUFTRixZQUFULEdBQWdDO0FBQUE7O0FBQUEsVUFBVkcsSUFBVSx1RUFBSCxDQUFHOztBQUNsRCxVQUFNL0gsUUFBUSxLQUFLTyxRQUFMLEVBQWQ7QUFDQSxVQUFNZ0IsTUFBTSx3QkFBWjtBQUNBLFVBQU0wRCxlQUFlO0FBQ25CWSxzQkFBYyxJQURLO0FBRW5CQyxvQkFBWSxJQUZPO0FBR25CQyxhQUFLLEtBQUsvRTtBQUhTLE9BQXJCO0FBS0EsVUFBTW9FLGtCQUFrQixrQkFBeEI7QUFDQSxVQUFNRSxlQUFldEYsTUFBTWdGLEtBQU4sQ0FBWUksZUFBWixFQUE2QkgsWUFBN0IsQ0FBckI7QUFDQSwwQkFBS0ssWUFBTCxFQUFtQixVQUFDQyxJQUFELEVBQVU7QUFDM0IsWUFBTWxELE9BQU9kLEdBQWI7QUFDQSxZQUFNc0csaUJBQWlCdEMsS0FBS0ksTUFBTCxDQUFZLGdCQUFhO0FBQUEsY0FBVjdFLEdBQVUsUUFBVkEsR0FBVTs7QUFDOUMsY0FBSSxDQUFDQSxJQUFJaUMsVUFBVCxFQUFxQjtBQUNuQixtQkFBTyxJQUFQO0FBQ0Q7O0FBRUQsY0FBSWdGLFNBQVMsQ0FBYixFQUFnQjtBQUNkLG1CQUFPLElBQVA7QUFDRDs7QUFFRCxjQUFNQyxhQUFhaEYsT0FBTyxrQkFBUWlGLGdCQUFSLENBQXlCbkgsSUFBSWlDLFVBQTdCLENBQVAsQ0FBbkI7QUFDQSxjQUFNbUYsY0FBY2xGLFFBQXBCO0FBQ0EsY0FBTW1GLE9BQU9ELFlBQVlDLElBQVosQ0FBaUJILFVBQWpCLEVBQTZCLE1BQTdCLENBQWI7QUFDQSxjQUFJRyxPQUFPSixJQUFYLEVBQWlCO0FBQ2YsbUJBQU8sSUFBUDtBQUNEOztBQUVELGlCQUFPLEtBQVA7QUFDRCxTQWpCc0IsRUFrQnBCbEgsR0FsQm9CLENBa0JoQixVQUFDQyxHQUFELEVBQVM7QUFDWixpQkFBTyxRQUFLNEMsVUFBTCxDQUFnQjVDLElBQUlBLEdBQXBCLENBQVA7QUFDRCxTQXBCb0IsQ0FBdkI7O0FBc0JBLFlBQUkrRyxlQUFlcEQsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUM3Qiw2QkFBSW9ELGNBQUosRUFBb0JwRyxJQUFwQixDQUF5QixVQUFDTSxPQUFELEVBQWE7QUFDcENNLGlCQUFLWCxPQUFMLENBQWFLLE9BQWI7QUFDRCxXQUZELEVBRUcsVUFBQ0gsR0FBRCxFQUFTO0FBQ1ZTLGlCQUFLUixNQUFMLENBQVlELEdBQVo7QUFDRCxXQUpEO0FBS0QsU0FORCxNQU1PO0FBQ0xMLGNBQUlHLE9BQUo7QUFDRDtBQUNGLE9BakNELEVBaUNHLFVBQUNFLEdBQUQsRUFBUztBQUNWTCxZQUFJTSxNQUFKLENBQVdELEdBQVg7QUFDRCxPQW5DRDtBQW9DQSxhQUFPTCxJQUFJa0IsT0FBWDtBQUNELEtBM1lpRztBQTRZbEcyRixpQ0FBNkIsU0FBU0EsMkJBQVQsQ0FBcUM5RyxRQUFyQyxFQUErQztBQUMxRSxVQUFNQyxNQUFNLHdCQUFaO0FBQ0EsVUFBTThHLFVBQVVqRSxJQUFJQyxZQUFKLENBQWlCQyxRQUFqQixDQUEwQixnQkFBMUIsRUFBNEMsZ0JBQVlwRSxPQUF4RCxDQUFoQjtBQUNBLFVBQU1vSSxVQUFVbEUsSUFBSUMsWUFBSixDQUFpQkMsUUFBakIsQ0FBMEIsV0FBMUIsRUFBdUMsZ0JBQVlwRSxPQUFuRCxDQUFoQjtBQUNBLFVBQUltSSxPQUFKLEVBQWE7QUFDWEEsZ0JBQVFFLDBCQUFSLENBQW1DakgsUUFBbkMsRUFBNkMsS0FBS04sVUFBbEQ7QUFDRDtBQUNELFVBQUlzSCxPQUFKLEVBQWE7QUFDWEEsZ0JBQVFDLDBCQUFSLENBQW1DakgsUUFBbkMsRUFBNkMsS0FBS04sVUFBbEQ7QUFDRDtBQUNETyxVQUFJRyxPQUFKO0FBQ0EsYUFBT0gsSUFBSWtCLE9BQVg7QUFDRDtBQXhaaUcsR0FBcEYsQ0FBaEI7O29CQTJaZTFDLE8iLCJmaWxlIjoiX09mZmxpbmVNb2RlbEJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgUG91Y2hEQlN0b3JlIGZyb20gJy4uL1N0b3JlL1BvdWNoREInO1xyXG5pbXBvcnQgRGVmZXJyZWQgZnJvbSAnZG9qby9EZWZlcnJlZCc7XHJcbmltcG9ydCBhbGwgZnJvbSAnZG9qby9wcm9taXNlL2FsbCc7XHJcbmltcG9ydCB3aGVuIGZyb20gJ2Rvam8vd2hlbic7XHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4uL1V0aWxpdHknO1xyXG5pbXBvcnQgX0N1c3RvbWl6YXRpb25NaXhpbiBmcm9tICcuLi9fQ3VzdG9taXphdGlvbk1peGluJztcclxuaW1wb3J0IF9Nb2RlbEJhc2UgZnJvbSAnLi9fTW9kZWxCYXNlJztcclxuaW1wb3J0IFF1ZXJ5UmVzdWx0cyBmcm9tICdkb2pvL3N0b3JlL3V0aWwvUXVlcnlSZXN1bHRzJztcclxuaW1wb3J0IE1PREVMX1RZUEVTIGZyb20gJy4vVHlwZXMnO1xyXG5pbXBvcnQgY29udmVydCBmcm9tICcuLi9Db252ZXJ0JztcclxuXHJcblxyXG5jb25zdCBkYXRhYmFzZU5hbWUgPSAnY3JtLW9mZmxpbmUnO1xyXG5jb25zdCBfc3RvcmUgPSBuZXcgUG91Y2hEQlN0b3JlKGRhdGFiYXNlTmFtZSk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1vZGVscy5fT2ZmbGluZU1vZGVsQmFzZVxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLk1vZGVscy5PZmZsaW5lLk9mZmxpbmVNb2RlbEJhc2UnLCBbX01vZGVsQmFzZSwgX0N1c3RvbWl6YXRpb25NaXhpbl0sIHtcclxuXHJcbiAgc3RvcmU6IG51bGwsXHJcbiAgbW9kZWxUeXBlOiBNT0RFTF9UWVBFUy5PRkZMSU5FLFxyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChpbml0LCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5jcmVhdGVOYW1lZFF1ZXJpZXMoKTtcclxuICB9LFxyXG4gIGNyZWF0ZU5hbWVkUXVlcmllczogZnVuY3Rpb24gY3JlYXRlTmFtZWRRdWVyaWVzKCkge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICAvLyBUT0RPOiBUaGlzIGlzIGEgc2hhcmVkIG5hbWVkIHF1ZXJ5LCBhbmQgcHJvYmFibHkgZG9lc24ndCBiZWxvbmcgaGVyZSAod2lsbCBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMpXHJcbiAgICBzdG9yZS5jcmVhdGVOYW1lZFF1ZXJ5KHtcclxuICAgICAgX2lkOiAnX2Rlc2lnbi9lbnRpdGllcycsXHJcbiAgICAgIF9yZXY6ICcxJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICBieV9uYW1lOiB7XHJcbiAgICAgICAgICBtYXA6IGZ1bmN0aW9uIG1hcChkb2MpIHtcclxuICAgICAgICAgICAgZW1pdChkb2MuZW50aXR5TmFtZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICAgIH0udG9TdHJpbmcoKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXRTdG9yZTogZnVuY3Rpb24gZ2V0U3RvcmUoKSB7XHJcbiAgICBpZiAoIXRoaXMuc3RvcmUpIHtcclxuICAgICAgdGhpcy5zdG9yZSA9IF9zdG9yZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnN0b3JlO1xyXG4gIH0sXHJcbiAgZ2V0RG9jSWQ6IGZ1bmN0aW9uIGdldEVudGl0eUlkKGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRFbnRpdHlJZChlbnRyeSk7XHJcbiAgfSxcclxuICBnZXRFbnRyeTogZnVuY3Rpb24gZ2V0RW50cnkoZW50aXR5SWQpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgdGhpcy5nZXRFbnRyeURvYyhlbnRpdHlJZCkudGhlbigoZG9jKSA9PiB7XHJcbiAgICAgIGRlZi5yZXNvbHZlKHRoaXMudW5XcmFwKGRvYykpO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWY7XHJcbiAgfSxcclxuICBnZXRFbnRyeURvYzogZnVuY3Rpb24gZ2V0RW50cnkoZW50aXR5SWQpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBzdG9yZS5nZXQoZW50aXR5SWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgZGVmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZjtcclxuICB9LFxyXG4gIHNhdmVFbnRyeTogZnVuY3Rpb24gc2F2ZUVudGl0eShlbnRyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUVudHJ5KGVudHJ5LCBvcHRpb25zKS50aGVuKCh1cGRhdGVSZXN1bHQpID0+IHtcclxuICAgICAgY29uc3Qgb2RlZiA9IGRlZjtcclxuICAgICAgdGhpcy5zYXZlUmVsYXRlZEVudHJpZXMoZW50cnksIG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIG9kZWYucmVzb2x2ZSh1cGRhdGVSZXN1bHQpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgb2RlZi5yZWplY3QoZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCAoKSA9PiB7XHJcbiAgICAgIC8vIEZldGNoaW5nIHRoZSBkb2MvZW50aXR5IGZhaWxlZCwgc28gd2Ugd2lsbCBpbnNlcnQgYSBuZXcgZG9jIGluc3RlYWQuXHJcbiAgICAgIHRoaXMuaW5zZXJ0RW50cnkoZW50cnksIG9wdGlvbnMpLnRoZW4oKGluc2VydFJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9kZWYgPSBkZWY7XHJcbiAgICAgICAgdGhpcy5zYXZlUmVsYXRlZEVudHJpZXMoZW50cnksIG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgb2RlZi5yZXNvbHZlKGluc2VydFJlc3VsdCk7XHJcbiAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgb2RlZi5yZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGluc2VydEVudHJ5OiBmdW5jdGlvbiBpbnNlcnRFbnRyeShlbnRyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IGRvYyA9IHRoaXMud3JhcChlbnRyeSwgb3B0aW9ucyk7XHJcbiAgICBzdG9yZS5hZGQoZG9jKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgZGVmLnJlc29sdmUocmVzdWx0KTtcclxuICAgIH0sXHJcbiAgICAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoYGVycm9yIGluc2VydGluZyBlbnRpdHk6ICR7ZXJyfWApO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICB1cGRhdGVFbnRyeTogZnVuY3Rpb24gdXBkYXRlRW50aXR5KGVudHJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgZW50aXR5SWQgPSB0aGlzLmdldEVudGl0eUlkKGVudHJ5LCBvcHRpb25zKTtcclxuICAgIHRoaXMuZ2V0RW50cnlEb2MoZW50aXR5SWQpLnRoZW4oKGRvYykgPT4ge1xyXG4gICAgICBjb25zdCBvZGVmID0gZGVmO1xyXG4gICAgICBkb2MuZW50aXR5ID0gZW50cnk7XHJcbiAgICAgIGRvYy5tb2RpZnlEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICAgIGRvYy5kZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RW50aXR5RGVzY3JpcHRpb24oZW50cnkpO1xyXG4gICAgICBzdG9yZS5wdXQoZG9jKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICBvZGVmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIG9kZWYucmVqZWN0KGBlcnJvciB1cGRhdGluZyBlbnRpdHk6ICR7ZXJyfWApO1xyXG4gICAgICB9KTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChgZW50aXR5IG5vdCBmb3VuZCB0byB1cGRhdGU6JHtlcnJ9YCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGNyZWF0ZUVudHJ5OiBmdW5jdGlvbiBjcmVhdGVFbnRyeSgpIHtcclxuICAgIGNvbnN0IGVudHJ5ID0ge307IC8vIG5lZWQgdG8gZHluYW1pY2x5IGNyZWF0ZSBQcm9wZXJ0aWVzO1xyXG4gICAgZW50cnkuSWQgPSBudWxsO1xyXG4gICAgZW50cnkuQ3JlYXRlRGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgZW50cnkuTW9kaWZ5RGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgZGVsZXRlRW50cnk6IGZ1bmN0aW9uIGRlbGV0ZUVudHJ5KGVudGl0eUlkKSB7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgc3RvcmUuZ2V0KGVudGl0eUlkKS50aGVuKChkb2MpID0+IHtcclxuICAgICAgY29uc3Qgb2RlZiA9IGRlZjtcclxuICAgICAgdGhpcy5fcmVtb3ZlRG9jKGRvYykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkVudHJ5RGVsZXRlKGVudGl0eUlkKTtcclxuICAgICAgICBvZGVmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIG9kZWYucmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIF9yZW1vdmVEb2M6IGZ1bmN0aW9uIF9yZW1vdmVEb2MoZG9jKSB7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgc3RvcmUucmVtb3ZlKGRvYy5faWQsIGRvYy5fcmV2KS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgZGVmLnJlc29sdmUocmVzdWx0KTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICBvbkVudHJ5RGVsZXRlOiBmdW5jdGlvbiBvbkVudHJ5RGVsZXRlKCkge1xyXG4gIH0sXHJcbiAgc2F2ZVJlbGF0ZWRFbnRyaWVzOiBmdW5jdGlvbiBzYXZlUmVsYXRlZEVudHJpZXMocGFyZW50RW50cnksIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGVudHJpZXMgPSAocGFyZW50RW50cnkgJiYgcGFyZW50RW50cnkuJHJlbGF0ZWRFbnRpdGllcykgPyBwYXJlbnRFbnRyeS4kcmVsYXRlZEVudGl0aWVzIDogW107XHJcbiAgICBsZXQgcmVsYXRlZFByb21pc2VzID0gW107XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGVudHJpZXMuZm9yRWFjaCgocmVsYXRlZCkgPT4ge1xyXG4gICAgICBjb25zdCBtb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwocmVsYXRlZC5lbnRpdHlOYW1lLCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgICAgaWYgKG1vZGVsICYmIHJlbGF0ZWQuZW50aXRpZXMpIHtcclxuICAgICAgICByZWxhdGVkUHJvbWlzZXMgPSByZWxhdGVkLmVudGl0aWVzLm1hcCgocmVsYXRlZEVudHJ5KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gbW9kZWwuc2F2ZUVudHJ5KHJlbGF0ZWRFbnRyeSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYgKHJlbGF0ZWRQcm9taXNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbChyZWxhdGVkUHJvbWlzZXMpLnRoZW4oXHJcbiAgICAgICAgKHJlbGF0ZWRSZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICBkZWYucmVzb2x2ZShyZWxhdGVkUmVzdWx0cyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkZWYucmVzb2x2ZShwYXJlbnRFbnRyeSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICB3cmFwOiBmdW5jdGlvbiB3cmFwKGVudHJ5KSB7XHJcbiAgICBjb25zdCBkb2MgPSB7XHJcbiAgICAgIF9pZDogdGhpcy5nZXREb2NJZChlbnRyeSksXHJcbiAgICAgIGVudGl0eTogZW50cnksXHJcbiAgICAgIGVudGl0eUlkOiB0aGlzLmdldEVudGl0eUlkKGVudHJ5KSxcclxuICAgICAgY3JlYXRlRGF0ZTogbW9tZW50KCkudG9EYXRlKCksXHJcbiAgICAgIG1vZGlmeURhdGU6IG1vbWVudCgpLnRvRGF0ZSgpLFxyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5nZXRFbnRpdHlEZXNjcmlwdGlvbihlbnRyeSksXHJcbiAgICAgIGVudGl0eU5hbWU6IHRoaXMuZW50aXR5TmFtZSxcclxuICAgICAgZW50aXR5RGlzcGxheU5hbWU6IHRoaXMuZW50aXR5RGlzcGxheU5hbWUsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRvYztcclxuICB9LFxyXG4gIHVuV3JhcDogZnVuY3Rpb24gdW5XcmFwKGRvYykge1xyXG4gICAgaWYgKGRvYy5lbnRpdHkpIHtcclxuICAgICAgZG9jLmVudGl0eS4kb2ZmbGluZURhdGUgPSBkb2MubW9kaWZ5RGF0ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBkb2MuZW50aXR5O1xyXG4gIH0sXHJcbiAgZ2V0RW50cmllczogZnVuY3Rpb24gZ2V0RW50cmllcyhxdWVyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHRoaXMuYnVpbGRRdWVyeU9wdGlvbnMoKTtcclxuICAgIGxhbmcubWl4aW4ocXVlcnlPcHRpb25zLCBvcHRpb25zKTtcclxuICAgIGNvbnN0IHF1ZXJ5RXhwcmVzc2lvbiA9IHRoaXMuYnVpbGRRdWVyeUV4cHJlc3Npb24ocXVlcnksIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICBjb25zdCBxdWVyeVJlc3VsdHMgPSBzdG9yZS5xdWVyeShxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICB3aGVuKHF1ZXJ5UmVzdWx0cywgKGRvY3MpID0+IHtcclxuICAgICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLnByb2Nlc3NFbnRyaWVzKHRoaXMudW5XcmFwRW50aXRpZXMoZG9jcyksIHF1ZXJ5T3B0aW9ucywgZG9jcyk7XHJcbiAgICAgIGRlZi5yZXNvbHZlKGVudGl0aWVzKTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAocXVlcnlPcHRpb25zICYmIHF1ZXJ5T3B0aW9ucy5yZXR1cm5RdWVyeVJlc3VsdHMpIHtcclxuICAgICAgcmV0dXJuIFF1ZXJ5UmVzdWx0cyhkZWYucHJvbWlzZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIHByb2Nlc3NFbnRyaWVzOiBmdW5jdGlvbiBwcm9jZXNzRW50cmllcyhlbnRpdGllcywgcXVlcnlPcHRpb25zLCBkb2NzKSB7XHJcbiAgICBpZiAodHlwZW9mIHF1ZXJ5T3B0aW9ucy5maWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIGVudGl0aWVzLmZpbHRlcihxdWVyeU9wdGlvbnMuZmlsdGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHF1ZXJ5T3B0aW9ucy5maWx0ZXJEb2NzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHJldHVybiBkb2NzLmZpbHRlcihxdWVyeU9wdGlvbnMuZmlsdGVyRG9jcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVudGl0aWVzO1xyXG4gIH0sXHJcbiAgYnVpbGRRdWVyeU9wdGlvbnM6IGZ1bmN0aW9uIGJ1aWxkUXVlcnlPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaW5jbHVkZV9kb2NzOiB0cnVlLFxyXG4gICAgICBkZXNjZW5kaW5nOiB0cnVlLFxyXG4gICAgICBrZXk6IHRoaXMuZW50aXR5TmFtZSxcclxuICAgIH07XHJcbiAgfSxcclxuICBidWlsZFF1ZXJ5RXhwcmVzc2lvbjogZnVuY3Rpb24gYnVpbGRRdWVyeUV4cHJlc3Npb24ocXVlcnlFeHByZXNzaW9uLCBvcHRpb25zKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIHJldHVybiAnZW50aXRpZXMvYnlfbmFtZSc7XHJcbiAgfSxcclxuICB1bldyYXBFbnRpdGllczogZnVuY3Rpb24gdW5XcmFwRW50aXRpZXMoZG9jcykge1xyXG4gICAgcmV0dXJuIGRvY3MubWFwKGRvYyA9PiB0aGlzLnVuV3JhcChkb2MuZG9jKSk7XHJcbiAgfSxcclxuICBnZXRSZWxhdGVkQ291bnQ6IGZ1bmN0aW9uIGdldFJlbGF0ZWRDb3VudChyZWxhdGlvbnNoaXAsIGVudHJ5KSB7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGNvbnN0IG1vZGVsID0gQXBwLk1vZGVsTWFuYWdlci5nZXRNb2RlbChyZWxhdGlvbnNoaXAucmVsYXRlZEVudGl0eSwgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgY29uc3QgcXVlcnlPcHRpb25zID0ge1xyXG4gICAgICAgIHJldHVyblF1ZXJ5UmVzdWx0czogdHJ1ZSxcclxuICAgICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXHJcbiAgICAgICAgZmlsdGVyOiB0aGlzLmJ1aWxkUmVsYXRlZFF1ZXJ5RXhwcmVzc2lvbihyZWxhdGlvbnNoaXAsIGVudHJ5KSxcclxuICAgICAgICBrZXk6IHJlbGF0aW9uc2hpcC5yZWxhdGVkRW50aXR5LFxyXG4gICAgICB9O1xyXG4gICAgICBtb2RlbC5nZXRFbnRyaWVzKG51bGwsIHF1ZXJ5T3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgZGVmLnJlc29sdmUocmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgIH0sICgpID0+IHtcclxuICAgICAgICBkZWYucmVzb2x2ZSgtMSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVmLnJlc29sdmUoLTEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgYnVpbGRSZWxhdGVkUXVlcnlFeHByZXNzaW9uOiBmdW5jdGlvbiBidWlsZFJlbGF0ZWRRdWVyeUV4cHJlc3Npb24ocmVsYXRpb25zaGlwLCBlbnRyeSkge1xyXG4gICAgcmV0dXJuIChlbnRpdHkpID0+IHtcclxuICAgICAgbGV0IHBhcmVudERhdGFQYXRoO1xyXG4gICAgICBsZXQgcmVsYXRlZERhdGFQYXRoO1xyXG4gICAgICBsZXQgcmVsYXRlZFZhbHVlO1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5KSB7XHJcbiAgICAgICAgcGFyZW50RGF0YVBhdGggPSAocmVsYXRpb25zaGlwLnBhcmVudERhdGFQYXRoKSA/IHJlbGF0aW9uc2hpcC5wYXJlbnREYXRhUGF0aCA6IHJlbGF0aW9uc2hpcC5wYXJlbnRQcm9wZXJ0eTtcclxuICAgICAgICBpZiAocmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5VHlwZSAmJiAocmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5VHlwZSA9PT0gJ29iamVjdCcpKSB7XHJcbiAgICAgICAgICBwYXJlbnREYXRhUGF0aCA9IGAke3JlbGF0aW9uc2hpcC5wYXJlbnRQcm9wZXJ0eX0uJGtleWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhcmVudERhdGFQYXRoID0gdGhpcy5pZFByb3BlcnR5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRpb25zaGlwLnJlbGF0ZWRQcm9wZXJ0eSkge1xyXG4gICAgICAgIHJlbGF0ZWREYXRhUGF0aCA9IChyZWxhdGlvbnNoaXAucmVsYXRlZERhdGFQYXRoKSA/IHJlbGF0aW9uc2hpcC5yZWxhdGVkRGF0YVBhdGggOiByZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5O1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5VHlwZSAmJiAocmVsYXRpb25zaGlwLnJlbGF0ZWRQcm9wZXJ0eVR5cGUgPT09ICdvYmplY3QnKSkge1xyXG4gICAgICAgICAgcmVsYXRlZERhdGFQYXRoID0gYCR7cmVsYXRpb25zaGlwLnJlbGF0ZWRQcm9wZXJ0eX0uJGtleWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlbGF0ZWREYXRhUGF0aCA9ICcka2V5JztcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcGFyZW50VmFsdWUgPSB1dGlsaXR5LmdldFZhbHVlKGVudHJ5LCBwYXJlbnREYXRhUGF0aCk7XHJcbiAgICAgIGlmIChlbnRpdHkpIHtcclxuICAgICAgICByZWxhdGVkVmFsdWUgPSB1dGlsaXR5LmdldFZhbHVlKGVudGl0eSwgcmVsYXRlZERhdGFQYXRoKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoKHBhcmVudFZhbHVlICYmIHJlbGF0ZWRWYWx1ZSkgJiYgKHJlbGF0ZWRWYWx1ZSA9PT0gcGFyZW50VmFsdWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgfSxcclxuICBnZXRVc2FnZTogZnVuY3Rpb24gZ2V0VXNhZ2UoKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0ge1xyXG4gICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXHJcbiAgICAgIGRlc2NlbmRpbmc6IGZhbHNlLFxyXG4gICAgICBrZXk6IHRoaXMuZW50aXR5TmFtZSxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcXVlcnlFeHByZXNzaW9uID0gJ2VudGl0aWVzL2J5X25hbWUnO1xyXG4gICAgY29uc3QgcXVlcnlSZXN1bHRzID0gc3RvcmUucXVlcnkocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgd2hlbihxdWVyeVJlc3VsdHMsIChkb2NzKSA9PiB7XHJcbiAgICAgIGNvbnN0IHVzYWdlID0ge307XHJcbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLl9nZXREb2NTaXplKGRvY3NbMF0pO1xyXG4gICAgICB1c2FnZS5pY29uQ2xhc3MgPSB0aGlzLmljb25DbGFzcztcclxuICAgICAgdXNhZ2UuZW50aXR5TmFtZSA9IHRoaXMuZW50aXR5TmFtZTtcclxuICAgICAgdXNhZ2UuZGVzY3JpcHRpb24gPSB0aGlzLmVudGl0eURpc3BsYXlOYW1lUGx1cmFsO1xyXG4gICAgICB1c2FnZS5vbGRlc3REYXRlID0gKGRvY3NbMF0pID8gbW9tZW50KGRvY3NbMF0uZG9jLm1vZGlmeURhdGUpLnRvRGF0ZSgpIDogbnVsbDsgLy8gc2VlIGRlY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICB1c2FnZS5uZXdlc3REYXRlID0gKGRvY3NbZG9jcy5sZW5ndGggLSAxXSkgPyBtb21lbnQoZG9jc1tkb2NzLmxlbmd0aCAtIDFdLmRvYy5tb2RpZnlEYXRlKS50b0RhdGUoKSA6IG51bGw7XHJcbiAgICAgIHVzYWdlLmNvdW50ID0gZG9jcy5sZW5ndGg7XHJcbiAgICAgIHVzYWdlLnNpemVBVkcgPSBzaXplO1xyXG4gICAgICB1c2FnZS5zaXplID0gdXNhZ2UuY291bnQgKiAoc2l6ZSA/IHNpemUgOiAxMCk7XHJcbiAgICAgIGRlZi5yZXNvbHZlKHVzYWdlKTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICBfZ2V0RG9jU2l6ZTogZnVuY3Rpb24gX2dldERvY1NpemUoZG9jKSB7XHJcbiAgICBsZXQgc2l6ZSA9IDA7XHJcbiAgICBjb25zdCBjaGFyU2l6ZSA9IDI7IC8vIDIgYnl0ZXNcclxuICAgIGlmIChkb2MpIHtcclxuICAgICAgY29uc3QganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRvYyk7XHJcbiAgICAgIHNpemUgPSBjaGFyU2l6ZSAqIGpzb25TdHJpbmcubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNpemU7XHJcbiAgfSxcclxuICBjbGVhckFsbERhdGE6IGZ1bmN0aW9uIGNsZWFyQWxsRGF0YSgpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgIGluY2x1ZGVfZG9jczogdHJ1ZSxcclxuICAgICAgZGVzY2VuZGluZzogdHJ1ZSxcclxuICAgICAga2V5OiB0aGlzLmVudGl0eU5hbWUsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcXVlcnlFeHByZXNzaW9uID0gJ2VudGl0aWVzL2J5X25hbWUnO1xyXG4gICAgY29uc3QgcXVlcnlSZXN1bHRzID0gc3RvcmUucXVlcnkocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgd2hlbihxdWVyeVJlc3VsdHMsIChkb2NzKSA9PiB7XHJcbiAgICAgIGNvbnN0IG9kZWYgPSBkZWY7XHJcbiAgICAgIGNvbnN0IGRlbGV0ZVJlcXVlc3RzID0gZG9jcy5tYXAoKGRvYykgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW1vdmVEb2MoZG9jLmRvYyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoZGVsZXRlUmVxdWVzdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGFsbChkZWxldGVSZXF1ZXN0cykudGhlbigocmVzdWx0cykgPT4ge1xyXG4gICAgICAgICAgb2RlZi5yZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgIG9kZWYucmVqZWN0KGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVmLnJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGNsZWFyRGF0YU9sZGVyVGhhbjogZnVuY3Rpb24gY2xlYXJBbGxEYXRhKGRheXMgPSAwKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0ge1xyXG4gICAgICBpbmNsdWRlX2RvY3M6IHRydWUsXHJcbiAgICAgIGRlc2NlbmRpbmc6IHRydWUsXHJcbiAgICAgIGtleTogdGhpcy5lbnRpdHlOYW1lLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IHF1ZXJ5RXhwcmVzc2lvbiA9ICdlbnRpdGllcy9ieV9uYW1lJztcclxuICAgIGNvbnN0IHF1ZXJ5UmVzdWx0cyA9IHN0b3JlLnF1ZXJ5KHF1ZXJ5RXhwcmVzc2lvbiwgcXVlcnlPcHRpb25zKTtcclxuICAgIHdoZW4ocXVlcnlSZXN1bHRzLCAoZG9jcykgPT4ge1xyXG4gICAgICBjb25zdCBvZGVmID0gZGVmO1xyXG4gICAgICBjb25zdCBkZWxldGVSZXF1ZXN0cyA9IGRvY3MuZmlsdGVyKCh7IGRvYyB9KSA9PiB7XHJcbiAgICAgICAgaWYgKCFkb2MubW9kaWZ5RGF0ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5cyA9PT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWNvcmREYXRlID0gbW9tZW50KGNvbnZlcnQudG9EYXRlRnJvbVN0cmluZyhkb2MubW9kaWZ5RGF0ZSkpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbW9tZW50KCk7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IGN1cnJlbnREYXRlLmRpZmYocmVjb3JkRGF0ZSwgJ2RheXMnKTtcclxuICAgICAgICBpZiAoZGlmZiA+IGRheXMpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KVxyXG4gICAgICAgIC5tYXAoKGRvYykgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW92ZURvYyhkb2MuZG9jKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChkZWxldGVSZXF1ZXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYWxsKGRlbGV0ZVJlcXVlc3RzKS50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICBvZGVmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgb2RlZi5yZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkZWYucmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgcmVtb3ZlRnJvbUF1eGlsaWFyeUVudGl0aWVzOiBmdW5jdGlvbiByZW1vdmVGcm9tQXV4aWxpYXJ5RW50aXRpZXMoZW50aXR5SWQpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgcnZNb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwoJ1JlY2VudGx5Vmlld2VkJywgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICBjb25zdCBiY01vZGVsID0gQXBwLk1vZGVsTWFuYWdlci5nZXRNb2RlbCgnQnJpZWZjYXNlJywgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICBpZiAocnZNb2RlbCkge1xyXG4gICAgICBydk1vZGVsLmRlbGV0ZUVudHJ5QnlFbnRpdHlDb250ZXh0KGVudGl0eUlkLCB0aGlzLmVudGl0eU5hbWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGJjTW9kZWwpIHtcclxuICAgICAgYmNNb2RlbC5kZWxldGVFbnRyeUJ5RW50aXR5Q29udGV4dChlbnRpdHlJZCwgdGhpcy5lbnRpdHlOYW1lKTtcclxuICAgIH1cclxuICAgIGRlZi5yZXNvbHZlKCk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=