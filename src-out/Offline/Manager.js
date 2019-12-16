define('argos/Offline/Manager', ['module', 'exports', 'dojo/Deferred', 'dojo/promise/all', '../Models/Types'], function (module, exports, _Deferred, _all, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _all2 = _interopRequireDefault(_all);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Offline.Manager
   */
  var __class = {

    defaultClearOlderThan: 2,
    /**
     *
     * @param view Required instance of a detail view
     * @returns {Promise}
     */
    saveDetailView: function saveDetailView(view) {
      var def = new _Deferred2.default();
      if (!view) {
        def.reject('A detail view must be specified.');
        return def.promise;
      }
      var onlineModel = view.getModel();
      var offlineModel = App.ModelManager.getModel(onlineModel.entityName, _Types2.default.OFFLINE);
      var rvModel = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      var rvEntry = rvModel.createEntry(view.id, view.entry, onlineModel);
      rvModel.saveEntry(rvEntry).then(function (rvResult) {
        var odef = def;
        offlineModel.saveEntry(view.entry).then(function () {
          odef.resolve(rvResult);
        }, function (err) {
          odef.reject(err);
        });
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    /**
     *
     * @param view
     * @returns {window.Promise}
     */
    removeDetailView: function removeDetailView(view) {
      var def = new _Deferred2.default();
      if (!view) {
        def.reject('A detail view must be specified.');
        return def.promise;
      }
      var id = view.entry[view.idProperty || '$key'];
      var rvModel = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      return rvModel.deleteEntry(id);
    },
    removeBriefcase: function removeBriefcase(briefcaseId) {
      var def = new _Deferred2.default();
      if (!briefcaseId) {
        def.reject('A briefcase id view must be specified.');
        return def.promise;
      }
      var bcModel = App.ModelManager.getModel('Briefcase', _Types2.default.OFFLINE);
      bcModel.getEntry(briefcaseId).then(function (briefcase) {
        if (briefcase) {
          var entityName = briefcase.entityName;
          var entityId = briefcase.entityId;
          var odef = def;
          bcModel.deleteEntry(briefcaseId).then(function () {
            var entityModel = App.ModelManager.getModel(entityName, _Types2.default.OFFLINE);
            var oodef = odef;
            if (entityModel) {
              entityModel.deleteEntry(entityId).then(function (result) {
                oodef.resolve(result);
              }, function (err) {
                oodef.reject(err);
              });
            } else {
              odef.reject('Entity model not found:' + entityName);
            }
          }, function (err) {
            def.reject(err);
          });
        } else {
          def.reject('briefcase not found');
        }
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    briefCaseEntity: function briefCaseEntity(entityName, entityId, options, defProgress) {
      var onlineModel = null;
      var offlineModel = null;
      var entityPromise = void 0;
      var def = new _Deferred2.default();

      onlineModel = App.ModelManager.getModel(entityName, _Types2.default.SDATA);
      offlineModel = App.ModelManager.getModel(entityName, _Types2.default.OFFLINE);

      if (onlineModel && offlineModel) {
        entityPromise = onlineModel.getEntry(entityId, options);
        entityPromise.then(function (entry) {
          if (entry) {
            var briefcaseModel = App.ModelManager.getModel('Briefcase', _Types2.default.OFFLINE);
            var briefcaseEntry = briefcaseModel.createEntry(entry, onlineModel, options);
            briefcaseModel.saveEntry(briefcaseEntry).then(function () {
              var odef = def;
              offlineModel.saveEntry(entry, options).then(function (result) {
                odef.resolve(result);
                if (defProgress) {
                  defProgress.progress();
                }
              }, function (err) {
                odef.reject(err);
              });
            }, function (err) {
              def.reject(err);
            });
          } else {
            def.reject('entity not found.');
          }
        }, function (err) {
          def.reject(err);
        });
      } else {
        def.reject('model not found.');
      }
      return def.promise;
    },
    briefCaseEntities: function briefCaseEntities(entities) {
      var _this = this;

      var def = new _Deferred2.default();
      var briefcaseRequests = [];
      briefcaseRequests = entities.map(function (entity) {
        var entityName = entity.entityName;
        var entityId = entity.entityId;
        var requestOptions = entity.options;
        return _this.briefCaseEntity(entityName, entityId, requestOptions, def);
      });
      if (briefcaseRequests.length > 0) {
        (0, _all2.default)(briefcaseRequests).then(function (results) {
          def.resolve(results);
        }, function (err) {
          def.reject(err);
        });
      } else {
        def.resolve();
      }
      return def.promise;
    },
    getUsage: function getUsage() {
      var _this2 = this;

      var def = new _Deferred2.default();
      var usageRequests = [];

      var models = App.ModelManager.getModels(_Types2.default.OFFLINE).filter(function (model) {
        return model && !model.isSystem;
      });

      usageRequests = models.map(function (model) {
        return model.getUsage();
      });

      if (usageRequests.length > 0) {
        (0, _all2.default)(usageRequests).then(function (results) {
          var usage = _this2._calculateUsage(results);
          def.resolve(usage);
        }, function (err) {
          def.reject(err);
        });
      } else {
        def.resolve();
      }
      return def.promise;
    },
    _calculateUsage: function _calculateUsage(entityUsage) {
      var usage = {};
      usage.count = 0;
      usage.size = 0;
      usage.sizeAVG = 0;
      usage.entities = entityUsage;
      usage.oldestDate = null;
      usage.newestDate = null;
      entityUsage.forEach(function (item) {
        if (item) {
          usage.count = usage.count + item.count;
          usage.size = usage.size + item.size;
          var avg = usage.size / usage.count;
          usage.sizeAVG = Number.isNaN(avg) ? 0 : avg;
          if (item.newestDate) {
            if (!usage.newestDate || usage.newestDate.valueOf() < item.newestDate.valueOf()) {
              usage.newestDate = item.newestDate;
            }
          }

          if (item.oldestDate) {
            if (!usage.oldestDate || item.oldestDate.valueOf() < usage.oldestDate.valueOf()) {
              usage.oldestDate = item.oldestDate;
            }
          }
        }
      });
      entityUsage.forEach(function (item) {
        if (item) {
          item.countPercent = usage.count ? item.count / usage.count : 0;
          item.sizePercent = usage.size ? item.size / usage.size : 0;
        }
      });
      return usage;
    },
    clearAllData: function clearAllData() {
      var _this3 = this;

      var def = new _Deferred2.default();
      var requests = [];
      var models = App.ModelManager.getModels(_Types2.default.OFFLINE).filter(function (model) {
        if (!model) {
          return false;
        }

        if (model.entityName !== 'Authentication') {
          return true;
        }

        return false;
      });
      requests = models.map(function (model) {
        return model.clearAllData();
      });
      if (requests.length > 0) {
        (0, _all2.default)(requests).then(function (results) {
          var prefOptions = _this3.getOptions();
          prefOptions.lastClearedDate = moment().toDate();
          _this3.saveOptions(prefOptions);
          def.resolve(results);
        }, function (err) {
          def.reject(err);
        });
      } else {
        def.resolve();
      }
      return def.promise;
    },
    getOlderThan: function getOlderThan(days) {
      var options = this.getOptions();
      var results = parseInt(days, 10);
      if (results >= 0) {
        return results;
      }

      return parseInt(options.clearOlderThan, 10);
    },
    clearRecentData: function clearRecentData(days) {
      var recentModel = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      return this.clearOlderThan(recentModel, days);
    },
    clearBriefcaseData: function clearBriefcaseData(days) {
      var briefcaseModel = App.ModelManager.getModel('Briefcase', _Types2.default.OFFLINE);
      return this.clearOlderThan(briefcaseModel, days);
    },
    clearOlderThan: function clearOlderThan(model, days) {
      var daysParsed = this.getOlderThan(days);
      return model.clearDataOlderThan(daysParsed);
    },
    getOptions: function getOptions() {
      var options = void 0;
      if (!App.preferences.offlineOptions) {
        options = this.getDefaultOptions();
        App.preferences.offlineOptions = options;
        App.persistPreferences();
      } else {
        options = App.preferences.offlineOptions;
      }

      return options;
    },
    saveOptions: function saveOptions(options) {
      if (options) {
        App.preferences.offlineOptions = options;
        App.persistPreferences();
      }
    },
    getDefaultOptions: function getDefaultOptions() {
      var options = {
        clearOlderThan: this.defaultClearOlderThan
      };
      return options;
    },
    getClearOlderThanValues: function getClearOlderThanValues() {
      var values = [{
        key: 0,
        value: 0
      }, {
        key: 1,
        value: 1
      }, {
        key: 2,
        value: 2
      }, {
        key: 3,
        value: 3
      }, {
        key: 4,
        value: 4
      }, {
        key: 5,
        value: 5
      }, {
        key: 6,
        value: 6
      }, {
        key: 7,
        value: 7
      }];

      return values;
    }
  }; /* Copyright 2017 Infor
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

  exports.default = __class;
  module.exports = exports['default'];
});