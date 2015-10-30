/**
 * @class argos.Offline.Manager
 *
 */
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import MODEL_TYPES from '../Models/Types';

const __class = {
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
    rvModel.saveEntry(rvEntry).then(function onSuccess(rvResult) {
      const odef = def;
      offlineModel.saveEntry(view.entry).then(function onSaveEntitySuccess() {
        odef.resolve(rvResult);
      }, function onSaveEntityFailure(err) {
        odef.reject(err);
      });
    }, function onFailure(err) {
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
            odef.reject('Entity model not found:' + entityName);
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
          briefcaseModel.saveEntry(briefcaseEntry).then(function bcEntrySuccess() {
            const odef = def;
            offlineModel.saveEntry(entry, options).then(function bcEntitySuccess(result) {
              console.log('Briefcased entity:' + briefcaseEntry.entityName + ' entityId;' + briefcaseEntry.entityId); // eslint-disable-line
              odef.resolve(result);
              if (defProgress) {
                defProgress.progress();
              }
            }, function bcEntityFailure(err) {
              odef.reject(err);
            });
          }, function bcEntryFailure(err) {
            def.reject(err);
          });
        } else {
          def.reject('entity not found.' );
        }
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
      if (model && (model.entityName !== 'RecentlyViewed') && (model.entityName !== 'Briefcase')) {
        return model;
      }
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
    usage.entities = entityUsage;
    entityUsage.forEach((item) => {
      if (item) {
        usage.count = usage.count + item.count;
        usage.size = usage.size + item.size;
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

    const models = App.ModelManager.getModels(MODEL_TYPES.OFFLINE).filter((model) => {
      if (model && (model.entityName !== 'Authentication')) {
        return model;
      }
    });
    requests = models.map((model) => {
      return model.clearData(null, options);
    });
    if (requests.length > 0) {
      all(requests).then((results) => {
        def.resolve(results);
      }, (err) => {
        def.reject(err);
      });
    } else {
      def.resolve();
    }
    return def.promise;
  },
};

export default __class;
