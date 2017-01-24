import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import MODEL_TYPES from '../Models/Types';
import convert from 'argos/Convert';

import moment from 'moment';

/**
 * @class argos.Offline.Manager
 *
 */
const __class = {

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
  clearData: function clearData(options) {
    const def = new Deferred();
    let requests = [];
    let defaultOptions = options;
    if (!defaultOptions) {
      defaultOptions = this.getOptions();
    }
    const queryExpression = this.getClearDataQueryExpression(defaultOptions);
    const models = App.ModelManager.getModels(MODEL_TYPES.OFFLINE).filter((model) => {
      if (!model) {
        return false;
      }

      if (Array.isArray(defaultOptions.skipModels)) {
        return defaultOptions.skipModels.indexOf(model.entityName) === -1;
      }

      if (model.entityName !== 'Authentication') {
        return true;
      }

      return false;
    });
    requests = models.map((model) => {
      return model.clearData(queryExpression, options);
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
  getClearDataQueryExpression: function getClearDataQueryExpression(options) {
    const { clearAll, recent, briefcased } = options;

    if (clearAll) {
      return null;
    }

    if (recent) {
      return (doc, emit) => {
        if (this.isDocOlderThan(doc, options) && doc.entityName === 'RecentlyViewed') {
          emit(doc.modifyDate);
        }
      };
    } else if (briefcased) {
      return (doc, emit) => {
        if (this.isDocOlderThan(doc, options) && doc.entityName === 'Briefcase') {
          emit(doc.modifyDate);
        }
      };
    }

    return (doc, emit) => {
      if (this.isDocOlderThan(doc, options)) {
        emit(doc.modifyDate);
      }
    };
  },
  isDocOlderThan: function isDocOlderThan(doc, options) {
    let olderThan = 0;
    if (options && options.clearOlderThan) {
      olderThan = (typeof options.clearOlderThan === 'string') ? parseInt(options.clearOlderThan, 10) : options.clearOlderThan;
    }
    if (!doc.modifyDate) {
      return true;
    }
    if (olderThan === 0) {
      return true;
    }
    const recordDate = moment(convert.toDateFromString(doc.modifyDate));
    const currentDate = moment();
    const days = currentDate.diff(recordDate, 'days');
    if (days > olderThan) {
      return true;
    }
    return false;
  },
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
  saveOptions: function saveOptions(options) {
    if (options) {
      App.preferences.offlineOptions = options;
      App.persistPreferences();
    }
  },
  getDefaultOptions: function getDefaultOptions() {
    const options = {
      clearOlderThan: this.defaultClearOlderThan,
    };
    return options;
  },
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
