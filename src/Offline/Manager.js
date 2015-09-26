/**
 * @class argos.Offline.Manager
 *
 */
import Deferred from 'dojo/Deferred';
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
    const rvEntry = rvModel.createEntry(view, onlineModel);
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
  briefCaseEntity: function briefCaseEntity(entityName, entityId, options) {
    let onlineModel = null;
    let offlineModel = null;
    let entityPromise;
    const def = new Deferred();

    onlineModel = App.ModelManager.getModel(entityName, MODEL_TYPES.SDATA);
    offlineModel = App.ModelManager.getModel(entityName, MODEL_TYPES.OFFLINE);

    if (onlineModel && offlineModel) {
      entityPromise = onlineModel.getEntry(entityId, options);
      entityPromise.then(function(entity) {
        if (entity) {
          offlineModel.saveEntry(entity, options).then(function(result) {
            def.resolve(result);
          }, function(err) {
            def.reject(err);
          });
        }
      });
    } else {
      def.reject('model not found.');
    }
    return def;
  },
};

export default __class;
