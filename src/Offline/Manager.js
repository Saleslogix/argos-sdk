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
 * @module argos/Offline/Manager
 */
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import MODEL_TYPES from '../Models/Types';

/**
 * @class
 * @alias module:argos/Offline/Manager
 */
const __class = /** @lends module:argos/Offline/Manager */{

  defaultClearOlderThan: 2,
  /**
   *
   * @param view Required instance of a detail view
   * @returns {Promise}
   */
  saveDetailView: function saveDetailView(view) {
    const def = new Deferred();
    if (!view) {
      def.reject('A detail view must be specified.');
      return def.promise;
    }
    const onlineModel = view.getModel();
    const offlineModel = App.ModelManager.getModel(onlineModel.entityName, MODEL_TYPES.OFFLINE);
    const rvModel = App.ModelManager.getModel('RecentlyViewed', MODEL_TYPES.OFFLINE);
    const rvEntry = rvModel.createEntry(view.id, view.entry, onlineModel);
    rvModel.saveEntry(rvEntry).then((rvResult) => {
      const odef = def;
      offlineModel.saveEntry(view.entry).then(() => {
        odef.resolve(rvResult);
      }, (err) => {
        odef.reject(err);
      });
    }, (err) => {
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
    const def = new Deferred();
    if (!view) {
      def.reject('A detail view must be specified.');
      return def.promise;
    }
    const id = view.entry[view.idProperty || '$key'];
    const rvModel = App.ModelManager.getModel('RecentlyViewed', MODEL_TYPES.OFFLINE);
    return rvModel.deleteEntry(id);
  },
  /**
   * @param {String} briefcaseId
   */
  removeBriefcase: function removeBriefcase(briefcaseId) {
    const def = new Deferred();
    if (!briefcaseId) {
      def.reject('A briefcase id view must be specified.');
      return def.promise;
    }
    const bcModel = App.ModelManager.getModel('Briefcase', MODEL_TYPES.OFFLINE);
    bcModel.getEntry(briefcaseId).then((briefcase) => {
      if (briefcase) {
        const entityName = briefcase.entityName;
        const entityId = briefcase.entityId;
        const odef = def;
        bcModel.deleteEntry(briefcaseId).then(() => {
          const entityModel = App.ModelManager.getModel(entityName, MODEL_TYPES.OFFLINE);
          const oodef = odef;
          if (entityModel) {
            entityModel.deleteEntry(entityId).then((result) => {
              oodef.resolve(result);
            }, (err) => {
              oodef.reject(err);
            });
          } else {
            odef.reject(`Entity model not found:${entityName}`);
          }
        }, (err) => {
          def.reject(err);
        });
      } else {
        def.reject('briefcase not found');
      }
    }, (err) => {
      def.reject(err);
    });
    return def.promise;
  },
  /**
   *
   */
  briefCaseEntity: function briefCaseEntity(entityName, entityId, options, defProgress) {
    let onlineModel = null;
    let offlineModel = null;
    let entityPromise;
    const def = new Deferred();

    onlineModel = App.ModelManager.getModel(entityName, MODEL_TYPES.SDATA);
    offlineModel = App.ModelManager.getModel(entityName, MODEL_TYPES.OFFLINE);

    if (onlineModel && offlineModel) {
      entityPromise = onlineModel.getEntry(entityId, options);
      entityPromise.then((entry) => {
        if (entry) {
          const briefcaseModel = App.ModelManager.getModel('Briefcase', MODEL_TYPES.OFFLINE);
          const briefcaseEntry = briefcaseModel.createEntry(entry, onlineModel, options);
          briefcaseModel.saveEntry(briefcaseEntry).then(() => {
            const odef = def;
            offlineModel.saveEntry(entry, options).then((result) => {
              odef.resolve(result);
              if (defProgress) {
                defProgress.progress();
              }
            }, (err) => {
              odef.reject(err);
            });
          }, (err) => {
            def.reject(err);
          });
        } else {
          def.reject('entity not found.');
        }
      }, (err) => {
        def.reject(err);
      });
    } else {
      def.reject('model not found.');
    }
    return def.promise;
  },
  /**
   *
   */
  briefCaseEntities: function briefCaseEntities(entities) {
    const def = new Deferred();
    let briefcaseRequests = [];
    briefcaseRequests = entities.map((entity) => {
      const entityName = entity.entityName;
      const entityId = entity.entityId;
      const requestOptions = entity.options;
      return this.briefCaseEntity(entityName, entityId, requestOptions, def);
    });
    if (briefcaseRequests.length > 0) {
      all(briefcaseRequests).then((results) => {
        def.resolve(results);
      }, (err) => {
        def.reject(err);
      });
    } else {
      def.resolve();
    }
    return def.promise;
  },
  /**
   *
   */
  getUsage: function getUsage() {
    const def = new Deferred();
    let usageRequests = [];

    const models = App.ModelManager.getModels(MODEL_TYPES.OFFLINE).filter((model) => {
      return model && !model.isSystem;
    });

    usageRequests = models.map((model) => {
      return model.getUsage();
    });

    if (usageRequests.length > 0) {
      all(usageRequests).then((results) => {
        const usage = this._calculateUsage(results);
        def.resolve(usage);
      }, (err) => {
        def.reject(err);
      });
    } else {
      def.resolve();
    }
    return def.promise;
  },
  _calculateUsage: function _calculateUsage(entityUsage) {
    const usage = {};
    usage.count = 0;
    usage.size = 0;
    usage.sizeAVG = 0;
    usage.entities = entityUsage;
    usage.oldestDate = null;
    usage.newestDate = null;
    entityUsage.forEach((item) => {
      if (item) {
        usage.count = usage.count + item.count;
        usage.size = usage.size + item.size;
        const avg = usage.size / usage.count;
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
    entityUsage.forEach((item) => {
      if (item) {
        item.countPercent = (usage.count) ? (item.count / usage.count) : 0;
        item.sizePercent = (usage.size) ? (item.size / usage.size) : 0;
      }
    });
    return usage;
  },
  /**
   *
   */
  clearAllData: function clearAllData() {
    const def = new Deferred();
    let requests = [];
    const models = App.ModelManager.getModels(MODEL_TYPES.OFFLINE).filter((model) => {
      if (!model) {
        return false;
      }

      if (model.entityName !== 'Authentication') {
        return true;
      }

      return false;
    });
    requests = models.map((model) => {
      return model.clearAllData();
    });
    if (requests.length > 0) {
      all(requests).then((results) => {
        const prefOptions = this.getOptions();
        prefOptions.lastClearedDate = moment().toDate();
        this.saveOptions(prefOptions);
        def.resolve(results);
      }, (err) => {
        def.reject(err);
      });
    } else {
      def.resolve();
    }
    return def.promise;
  },
  /**
   *
   */
  getOlderThan: function getOlderThan(days) {
    const options = this.getOptions();
    const results = parseInt(days, 10);
    if (results >= 0) {
      return results;
    }

    return parseInt(options.clearOlderThan, 10);
  },
  /**
   *
   */
  clearRecentData: function clearRecentData(days) {
    const recentModel = App.ModelManager.getModel('RecentlyViewed', MODEL_TYPES.OFFLINE);
    return this.clearOlderThan(recentModel, days);
  },
  /**
   *
   */
  clearBriefcaseData: function clearBriefcaseData(days) {
    const briefcaseModel = App.ModelManager.getModel('Briefcase', MODEL_TYPES.OFFLINE);
    return this.clearOlderThan(briefcaseModel, days);
  },
  /**
   *
   */
  clearOlderThan: function clearOlderThan(model, days) {
    const daysParsed = this.getOlderThan(days);
    return model.clearDataOlderThan(daysParsed);
  },
  /**
   *
   */
  getOptions: function getOptions() {
    let options;
    if (!App.preferences.offlineOptions) {
      options = this.getDefaultOptions();
      App.preferences.offlineOptions = options;
      App.persistPreferences();
    } else {
      options = App.preferences.offlineOptions;
    }

    return options;
  },
  /**
   *
   */
  saveOptions: function saveOptions(options) {
    if (options) {
      App.preferences.offlineOptions = options;
      App.persistPreferences();
    }
  },
  /**
   *
   */
  getDefaultOptions: function getDefaultOptions() {
    const options = {
      clearOlderThan: this.defaultClearOlderThan,
    };
    return options;
  },
  /**
   *
   */
  getClearOlderThanValues: function getClearOlderThanValues() {
    const values = [
      {
        key: 0,
        value: 0,
      }, {
        key: 1,
        value: 1,
      }, {
        key: 2,
        value: 2,
      }, {
        key: 3,
        value: 3,
      }, {
        key: 4,
        value: 4,
      }, {
        key: 5,
        value: 5,
      }, {
        key: 6,
        value: 6,
      }, {
        key: 7,
        value: 7,
      }];

    return values;
  },
};

export default __class;
