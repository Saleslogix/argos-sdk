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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9PZmZsaW5lL01hbmFnZXIuanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImRlZmF1bHRDbGVhck9sZGVyVGhhbiIsInNhdmVEZXRhaWxWaWV3IiwidmlldyIsImRlZiIsInJlamVjdCIsInByb21pc2UiLCJvbmxpbmVNb2RlbCIsImdldE1vZGVsIiwib2ZmbGluZU1vZGVsIiwiQXBwIiwiTW9kZWxNYW5hZ2VyIiwiZW50aXR5TmFtZSIsIk9GRkxJTkUiLCJydk1vZGVsIiwicnZFbnRyeSIsImNyZWF0ZUVudHJ5IiwiaWQiLCJlbnRyeSIsInNhdmVFbnRyeSIsInRoZW4iLCJydlJlc3VsdCIsIm9kZWYiLCJyZXNvbHZlIiwiZXJyIiwicmVtb3ZlRGV0YWlsVmlldyIsImlkUHJvcGVydHkiLCJkZWxldGVFbnRyeSIsInJlbW92ZUJyaWVmY2FzZSIsImJyaWVmY2FzZUlkIiwiYmNNb2RlbCIsImdldEVudHJ5IiwiYnJpZWZjYXNlIiwiZW50aXR5SWQiLCJlbnRpdHlNb2RlbCIsIm9vZGVmIiwicmVzdWx0IiwiYnJpZWZDYXNlRW50aXR5Iiwib3B0aW9ucyIsImRlZlByb2dyZXNzIiwiZW50aXR5UHJvbWlzZSIsIlNEQVRBIiwiYnJpZWZjYXNlTW9kZWwiLCJicmllZmNhc2VFbnRyeSIsInByb2dyZXNzIiwiYnJpZWZDYXNlRW50aXRpZXMiLCJlbnRpdGllcyIsImJyaWVmY2FzZVJlcXVlc3RzIiwibWFwIiwiZW50aXR5IiwicmVxdWVzdE9wdGlvbnMiLCJsZW5ndGgiLCJyZXN1bHRzIiwiZ2V0VXNhZ2UiLCJ1c2FnZVJlcXVlc3RzIiwibW9kZWxzIiwiZ2V0TW9kZWxzIiwiZmlsdGVyIiwibW9kZWwiLCJpc1N5c3RlbSIsInVzYWdlIiwiX2NhbGN1bGF0ZVVzYWdlIiwiZW50aXR5VXNhZ2UiLCJjb3VudCIsInNpemUiLCJzaXplQVZHIiwib2xkZXN0RGF0ZSIsIm5ld2VzdERhdGUiLCJmb3JFYWNoIiwiaXRlbSIsImF2ZyIsIk51bWJlciIsImlzTmFOIiwidmFsdWVPZiIsImNvdW50UGVyY2VudCIsInNpemVQZXJjZW50IiwiY2xlYXJBbGxEYXRhIiwicmVxdWVzdHMiLCJwcmVmT3B0aW9ucyIsImdldE9wdGlvbnMiLCJsYXN0Q2xlYXJlZERhdGUiLCJtb21lbnQiLCJ0b0RhdGUiLCJzYXZlT3B0aW9ucyIsImdldE9sZGVyVGhhbiIsImRheXMiLCJwYXJzZUludCIsImNsZWFyT2xkZXJUaGFuIiwiY2xlYXJSZWNlbnREYXRhIiwicmVjZW50TW9kZWwiLCJjbGVhckJyaWVmY2FzZURhdGEiLCJkYXlzUGFyc2VkIiwiY2xlYXJEYXRhT2xkZXJUaGFuIiwicHJlZmVyZW5jZXMiLCJvZmZsaW5lT3B0aW9ucyIsImdldERlZmF1bHRPcHRpb25zIiwicGVyc2lzdFByZWZlcmVuY2VzIiwiZ2V0Q2xlYXJPbGRlclRoYW5WYWx1ZXMiLCJ2YWx1ZXMiLCJrZXkiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7OztBQUdBLE1BQU1BLFVBQVU7O0FBRWRDLDJCQUF1QixDQUZUO0FBR2Q7Ozs7O0FBS0FDLG9CQUFnQixTQUFTQSxjQUFULENBQXdCQyxJQUF4QixFQUE4QjtBQUM1QyxVQUFNQyxNQUFNLHdCQUFaO0FBQ0EsVUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDVEMsWUFBSUMsTUFBSixDQUFXLGtDQUFYO0FBQ0EsZUFBT0QsSUFBSUUsT0FBWDtBQUNEO0FBQ0QsVUFBTUMsY0FBY0osS0FBS0ssUUFBTCxFQUFwQjtBQUNBLFVBQU1DLGVBQWVDLElBQUlDLFlBQUosQ0FBaUJILFFBQWpCLENBQTBCRCxZQUFZSyxVQUF0QyxFQUFrRCxnQkFBWUMsT0FBOUQsQ0FBckI7QUFDQSxVQUFNQyxVQUFVSixJQUFJQyxZQUFKLENBQWlCSCxRQUFqQixDQUEwQixnQkFBMUIsRUFBNEMsZ0JBQVlLLE9BQXhELENBQWhCO0FBQ0EsVUFBTUUsVUFBVUQsUUFBUUUsV0FBUixDQUFvQmIsS0FBS2MsRUFBekIsRUFBNkJkLEtBQUtlLEtBQWxDLEVB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IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgRGVmZXJyZWQgZnJvbSAnZG9qby9EZWZlcnJlZCc7XHJcbmltcG9ydCBhbGwgZnJvbSAnZG9qby9wcm9taXNlL2FsbCc7XHJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9Nb2RlbHMvVHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5PZmZsaW5lLk1hbmFnZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSB7XHJcblxyXG4gIGRlZmF1bHRDbGVhck9sZGVyVGhhbjogMixcclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2aWV3IFJlcXVpcmVkIGluc3RhbmNlIG9mIGEgZGV0YWlsIHZpZXdcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cclxuICBzYXZlRGV0YWlsVmlldzogZnVuY3Rpb24gc2F2ZURldGFpbFZpZXcodmlldykge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBpZiAoIXZpZXcpIHtcclxuICAgICAgZGVmLnJlamVjdCgnQSBkZXRhaWwgdmlldyBtdXN0IGJlIHNwZWNpZmllZC4nKTtcclxuICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb25saW5lTW9kZWwgPSB2aWV3LmdldE1vZGVsKCk7XHJcbiAgICBjb25zdCBvZmZsaW5lTW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKG9ubGluZU1vZGVsLmVudGl0eU5hbWUsIE1PREVMX1RZUEVTLk9GRkxJTkUpO1xyXG4gICAgY29uc3QgcnZNb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwoJ1JlY2VudGx5Vmlld2VkJywgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICBjb25zdCBydkVudHJ5ID0gcnZNb2RlbC5jcmVhdGVFbnRyeSh2aWV3LmlkLCB2aWV3LmVudHJ5LCBvbmxpbmVNb2RlbCk7XHJcbiAgICBydk1vZGVsLnNhdmVFbnRyeShydkVudHJ5KS50aGVuKChydlJlc3VsdCkgPT4ge1xyXG4gICAgICBjb25zdCBvZGVmID0gZGVmO1xyXG4gICAgICBvZmZsaW5lTW9kZWwuc2F2ZUVudHJ5KHZpZXcuZW50cnkpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIG9kZWYucmVzb2x2ZShydlJlc3VsdCk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICBvZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2aWV3XHJcbiAgICogQHJldHVybnMge3dpbmRvdy5Qcm9taXNlfVxyXG4gICAqL1xyXG4gIHJlbW92ZURldGFpbFZpZXc6IGZ1bmN0aW9uIHJlbW92ZURldGFpbFZpZXcodmlldykge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBpZiAoIXZpZXcpIHtcclxuICAgICAgZGVmLnJlamVjdCgnQSBkZXRhaWwgdmlldyBtdXN0IGJlIHNwZWNpZmllZC4nKTtcclxuICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaWQgPSB2aWV3LmVudHJ5W3ZpZXcuaWRQcm9wZXJ0eSB8fCAnJGtleSddO1xyXG4gICAgY29uc3QgcnZNb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwoJ1JlY2VudGx5Vmlld2VkJywgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICByZXR1cm4gcnZNb2RlbC5kZWxldGVFbnRyeShpZCk7XHJcbiAgfSxcclxuICByZW1vdmVCcmllZmNhc2U6IGZ1bmN0aW9uIHJlbW92ZUJyaWVmY2FzZShicmllZmNhc2VJZCkge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBpZiAoIWJyaWVmY2FzZUlkKSB7XHJcbiAgICAgIGRlZi5yZWplY3QoJ0EgYnJpZWZjYXNlIGlkIHZpZXcgbXVzdCBiZSBzcGVjaWZpZWQuJyk7XHJcbiAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGJjTW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKCdCcmllZmNhc2UnLCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgIGJjTW9kZWwuZ2V0RW50cnkoYnJpZWZjYXNlSWQpLnRoZW4oKGJyaWVmY2FzZSkgPT4ge1xyXG4gICAgICBpZiAoYnJpZWZjYXNlKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGJyaWVmY2FzZS5lbnRpdHlOYW1lO1xyXG4gICAgICAgIGNvbnN0IGVudGl0eUlkID0gYnJpZWZjYXNlLmVudGl0eUlkO1xyXG4gICAgICAgIGNvbnN0IG9kZWYgPSBkZWY7XHJcbiAgICAgICAgYmNNb2RlbC5kZWxldGVFbnRyeShicmllZmNhc2VJZCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBlbnRpdHlNb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwoZW50aXR5TmFtZSwgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICAgICAgICBjb25zdCBvb2RlZiA9IG9kZWY7XHJcbiAgICAgICAgICBpZiAoZW50aXR5TW9kZWwpIHtcclxuICAgICAgICAgICAgZW50aXR5TW9kZWwuZGVsZXRlRW50cnkoZW50aXR5SWQpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIG9vZGVmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIG9vZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9kZWYucmVqZWN0KGBFbnRpdHkgbW9kZWwgbm90IGZvdW5kOiR7ZW50aXR5TmFtZX1gKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVmLnJlamVjdCgnYnJpZWZjYXNlIG5vdCBmb3VuZCcpO1xyXG4gICAgICB9XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgYnJpZWZDYXNlRW50aXR5OiBmdW5jdGlvbiBicmllZkNhc2VFbnRpdHkoZW50aXR5TmFtZSwgZW50aXR5SWQsIG9wdGlvbnMsIGRlZlByb2dyZXNzKSB7XHJcbiAgICBsZXQgb25saW5lTW9kZWwgPSBudWxsO1xyXG4gICAgbGV0IG9mZmxpbmVNb2RlbCA9IG51bGw7XHJcbiAgICBsZXQgZW50aXR5UHJvbWlzZTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cclxuICAgIG9ubGluZU1vZGVsID0gQXBwLk1vZGVsTWFuYWdlci5nZXRNb2RlbChlbnRpdHlOYW1lLCBNT0RFTF9UWVBFUy5TREFUQSk7XHJcbiAgICBvZmZsaW5lTW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKGVudGl0eU5hbWUsIE1PREVMX1RZUEVTLk9GRkxJTkUpO1xyXG5cclxuICAgIGlmIChvbmxpbmVNb2RlbCAmJiBvZmZsaW5lTW9kZWwpIHtcclxuICAgICAgZW50aXR5UHJvbWlzZSA9IG9ubGluZU1vZGVsLmdldEVudHJ5KGVudGl0eUlkLCBvcHRpb25zKTtcclxuICAgICAgZW50aXR5UHJvbWlzZS50aGVuKChlbnRyeSkgPT4ge1xyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgY29uc3QgYnJpZWZjYXNlTW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKCdCcmllZmNhc2UnLCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgICAgICAgIGNvbnN0IGJyaWVmY2FzZUVudHJ5ID0gYnJpZWZjYXNlTW9kZWwuY3JlYXRlRW50cnkoZW50cnksIG9ubGluZU1vZGVsLCBvcHRpb25zKTtcclxuICAgICAgICAgIGJyaWVmY2FzZU1vZGVsLnNhdmVFbnRyeShicmllZmNhc2VFbnRyeSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9kZWYgPSBkZWY7XHJcbiAgICAgICAgICAgIG9mZmxpbmVNb2RlbC5zYXZlRW50cnkoZW50cnksIG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIG9kZWYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgIGlmIChkZWZQcm9ncmVzcykge1xyXG4gICAgICAgICAgICAgICAgZGVmUHJvZ3Jlc3MucHJvZ3Jlc3MoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBvZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRlZi5yZWplY3QoJ2VudGl0eSBub3QgZm91bmQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRlZi5yZWplY3QoJ21vZGVsIG5vdCBmb3VuZC4nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGJyaWVmQ2FzZUVudGl0aWVzOiBmdW5jdGlvbiBicmllZkNhc2VFbnRpdGllcyhlbnRpdGllcykge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBsZXQgYnJpZWZjYXNlUmVxdWVzdHMgPSBbXTtcclxuICAgIGJyaWVmY2FzZVJlcXVlc3RzID0gZW50aXRpZXMubWFwKChlbnRpdHkpID0+IHtcclxuICAgICAgY29uc3QgZW50aXR5TmFtZSA9IGVudGl0eS5lbnRpdHlOYW1lO1xyXG4gICAgICBjb25zdCBlbnRpdHlJZCA9IGVudGl0eS5lbnRpdHlJZDtcclxuICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSBlbnRpdHkub3B0aW9ucztcclxuICAgICAgcmV0dXJuIHRoaXMuYnJpZWZDYXNlRW50aXR5KGVudGl0eU5hbWUsIGVudGl0eUlkLCByZXF1ZXN0T3B0aW9ucywgZGVmKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGJyaWVmY2FzZVJlcXVlc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgYWxsKGJyaWVmY2FzZVJlcXVlc3RzKS50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgZGVmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVmLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGdldFVzYWdlOiBmdW5jdGlvbiBnZXRVc2FnZSgpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgbGV0IHVzYWdlUmVxdWVzdHMgPSBbXTtcclxuXHJcbiAgICBjb25zdCBtb2RlbHMgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVscyhNT0RFTF9UWVBFUy5PRkZMSU5FKS5maWx0ZXIoKG1vZGVsKSA9PiB7XHJcbiAgICAgIHJldHVybiBtb2RlbCAmJiAhbW9kZWwuaXNTeXN0ZW07XHJcbiAgICB9KTtcclxuXHJcbiAgICB1c2FnZVJlcXVlc3RzID0gbW9kZWxzLm1hcCgobW9kZWwpID0+IHtcclxuICAgICAgcmV0dXJuIG1vZGVsLmdldFVzYWdlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodXNhZ2VSZXF1ZXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbCh1c2FnZVJlcXVlc3RzKS50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXNhZ2UgPSB0aGlzLl9jYWxjdWxhdGVVc2FnZShyZXN1bHRzKTtcclxuICAgICAgICBkZWYucmVzb2x2ZSh1c2FnZSk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVmLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIF9jYWxjdWxhdGVVc2FnZTogZnVuY3Rpb24gX2NhbGN1bGF0ZVVzYWdlKGVudGl0eVVzYWdlKSB7XHJcbiAgICBjb25zdCB1c2FnZSA9IHt9O1xyXG4gICAgdXNhZ2UuY291bnQgPSAwO1xyXG4gICAgdXNhZ2Uuc2l6ZSA9IDA7XHJcbiAgICB1c2FnZS5zaXplQVZHID0gMDtcclxuICAgIHVzYWdlLmVudGl0aWVzID0gZW50aXR5VXNhZ2U7XHJcbiAgICB1c2FnZS5vbGRlc3REYXRlID0gbnVsbDtcclxuICAgIHVzYWdlLm5ld2VzdERhdGUgPSBudWxsO1xyXG4gICAgZW50aXR5VXNhZ2UuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgIHVzYWdlLmNvdW50ID0gdXNhZ2UuY291bnQgKyBpdGVtLmNvdW50O1xyXG4gICAgICAgIHVzYWdlLnNpemUgPSB1c2FnZS5zaXplICsgaXRlbS5zaXplO1xyXG4gICAgICAgIGNvbnN0IGF2ZyA9IHVzYWdlLnNpemUgLyB1c2FnZS5jb3VudDtcclxuICAgICAgICB1c2FnZS5zaXplQVZHID0gTnVtYmVyLmlzTmFOKGF2ZykgPyAwIDogYXZnO1xyXG4gICAgICAgIGlmIChpdGVtLm5ld2VzdERhdGUpIHtcclxuICAgICAgICAgIGlmICghdXNhZ2UubmV3ZXN0RGF0ZSB8fCB1c2FnZS5uZXdlc3REYXRlLnZhbHVlT2YoKSA8IGl0ZW0ubmV3ZXN0RGF0ZS52YWx1ZU9mKCkpIHtcclxuICAgICAgICAgICAgdXNhZ2UubmV3ZXN0RGF0ZSA9IGl0ZW0ubmV3ZXN0RGF0ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpdGVtLm9sZGVzdERhdGUpIHtcclxuICAgICAgICAgIGlmICghdXNhZ2Uub2xkZXN0RGF0ZSB8fCBpdGVtLm9sZGVzdERhdGUudmFsdWVPZigpIDwgdXNhZ2Uub2xkZXN0RGF0ZS52YWx1ZU9mKCkpIHtcclxuICAgICAgICAgICAgdXNhZ2Uub2xkZXN0RGF0ZSA9IGl0ZW0ub2xkZXN0RGF0ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZW50aXR5VXNhZ2UuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgIGl0ZW0uY291bnRQZXJjZW50ID0gKHVzYWdlLmNvdW50KSA/IChpdGVtLmNvdW50IC8gdXNhZ2UuY291bnQpIDogMDtcclxuICAgICAgICBpdGVtLnNpemVQZXJjZW50ID0gKHVzYWdlLnNpemUpID8gKGl0ZW0uc2l6ZSAvIHVzYWdlLnNpemUpIDogMDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdXNhZ2U7XHJcbiAgfSxcclxuICBjbGVhckFsbERhdGE6IGZ1bmN0aW9uIGNsZWFyQWxsRGF0YSgpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgbGV0IHJlcXVlc3RzID0gW107XHJcbiAgICBjb25zdCBtb2RlbHMgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVscyhNT0RFTF9UWVBFUy5PRkZMSU5FKS5maWx0ZXIoKG1vZGVsKSA9PiB7XHJcbiAgICAgIGlmICghbW9kZWwpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChtb2RlbC5lbnRpdHlOYW1lICE9PSAnQXV0aGVudGljYXRpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgcmVxdWVzdHMgPSBtb2RlbHMubWFwKChtb2RlbCkgPT4ge1xyXG4gICAgICByZXR1cm4gbW9kZWwuY2xlYXJBbGxEYXRhKCk7XHJcbiAgICB9KTtcclxuICAgIGlmIChyZXF1ZXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFsbChyZXF1ZXN0cykudGhlbigocmVzdWx0cykgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByZWZPcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XHJcbiAgICAgICAgcHJlZk9wdGlvbnMubGFzdENsZWFyZWREYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlT3B0aW9ucyhwcmVmT3B0aW9ucyk7XHJcbiAgICAgICAgZGVmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVmLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGdldE9sZGVyVGhhbjogZnVuY3Rpb24gZ2V0T2xkZXJUaGFuKGRheXMpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBwYXJzZUludChkYXlzLCAxMCk7XHJcbiAgICBpZiAocmVzdWx0cyA+PSAwKSB7XHJcbiAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUludChvcHRpb25zLmNsZWFyT2xkZXJUaGFuLCAxMCk7XHJcbiAgfSxcclxuICBjbGVhclJlY2VudERhdGE6IGZ1bmN0aW9uIGNsZWFyUmVjZW50RGF0YShkYXlzKSB7XHJcbiAgICBjb25zdCByZWNlbnRNb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwoJ1JlY2VudGx5Vmlld2VkJywgTU9ERUxfVFlQRVMuT0ZGTElORSk7XHJcbiAgICByZXR1cm4gdGhpcy5jbGVhck9sZGVyVGhhbihyZWNlbnRNb2RlbCwgZGF5cyk7XHJcbiAgfSxcclxuICBjbGVhckJyaWVmY2FzZURhdGE6IGZ1bmN0aW9uIGNsZWFyQnJpZWZjYXNlRGF0YShkYXlzKSB7XHJcbiAgICBjb25zdCBicmllZmNhc2VNb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwoJ0JyaWVmY2FzZScsIE1PREVMX1RZUEVTLk9GRkxJTkUpO1xyXG4gICAgcmV0dXJuIHRoaXMuY2xlYXJPbGRlclRoYW4oYnJpZWZjYXNlTW9kZWwsIGRheXMpO1xyXG4gIH0sXHJcbiAgY2xlYXJPbGRlclRoYW46IGZ1bmN0aW9uIGNsZWFyT2xkZXJUaGFuKG1vZGVsLCBkYXlzKSB7XHJcbiAgICBjb25zdCBkYXlzUGFyc2VkID0gdGhpcy5nZXRPbGRlclRoYW4oZGF5cyk7XHJcbiAgICByZXR1cm4gbW9kZWwuY2xlYXJEYXRhT2xkZXJUaGFuKGRheXNQYXJzZWQpO1xyXG4gIH0sXHJcbiAgZ2V0T3B0aW9uczogZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcclxuICAgIGxldCBvcHRpb25zO1xyXG4gICAgaWYgKCFBcHAucHJlZmVyZW5jZXMub2ZmbGluZU9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IHRoaXMuZ2V0RGVmYXVsdE9wdGlvbnMoKTtcclxuICAgICAgQXBwLnByZWZlcmVuY2VzLm9mZmxpbmVPcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgQXBwLnBlcnNpc3RQcmVmZXJlbmNlcygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3B0aW9ucyA9IEFwcC5wcmVmZXJlbmNlcy5vZmZsaW5lT3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9LFxyXG4gIHNhdmVPcHRpb25zOiBmdW5jdGlvbiBzYXZlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICBBcHAucHJlZmVyZW5jZXMub2ZmbGluZU9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICBBcHAucGVyc2lzdFByZWZlcmVuY2VzKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXREZWZhdWx0T3B0aW9uczogZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBjbGVhck9sZGVyVGhhbjogdGhpcy5kZWZhdWx0Q2xlYXJPbGRlclRoYW4sXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgfSxcclxuICBnZXRDbGVhck9sZGVyVGhhblZhbHVlczogZnVuY3Rpb24gZ2V0Q2xlYXJPbGRlclRoYW5WYWx1ZXMoKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6IDAsXHJcbiAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgdmFsdWU6IDEsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDIsXHJcbiAgICAgICAgdmFsdWU6IDIsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDMsXHJcbiAgICAgICAgdmFsdWU6IDMsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDQsXHJcbiAgICAgICAgdmFsdWU6IDQsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDUsXHJcbiAgICAgICAgdmFsdWU6IDUsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDYsXHJcbiAgICAgICAgdmFsdWU6IDYsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBrZXk6IDcsXHJcbiAgICAgICAgdmFsdWU6IDcsXHJcbiAgICAgIH1dO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==