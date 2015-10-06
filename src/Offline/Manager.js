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
  briefCaseEntity: function briefCaseEntity(entityName, entityId, options) {
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
      return this.briefCaseEntity(entityName, entityId, requestOptions);
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
};

export default __class;
