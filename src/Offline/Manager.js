/**
 * @class argos.Offline.Manager
 *
 */
import Store from '../Store/PouchDB';
import Deferred from 'dojo/Deferred';
import MODEL_TYPES from '../Models/Types';

const store = new Store({
  databaseName: 'crm-offline',
});

const __class = {
  getAllIds: function getAllIds() {
    // The results from this query should just get cached/updated/stored
    // globally when the application goes offline. This will
    // prevent some timing issues with calling this async on list loads.
    return store.query(function queryFn(doc, emit) {
      emit(doc._id);
    });
  },
  /**
   * @returns {PouchDB Store}
   */
  getStore: function getStore() {
    return store;
  },
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

    const model = view.getModel();
    const id = view.entry[view.idProperty || '$key'];
    let doc;

    // Try to fetch the previously cached doc/entity
    return store.get(id).then(function querySuccess(results) {
      // Refresh the offline store with the latest info
      results.entity = view.entry;
      results.modifyDate = moment().toDate();
      results.entityName = model.entityName;
      results.description = view.getOfflineDescription();
      results.entityName = model.entityName;
      results.entityDisplayName = model.entityDisplayName;

      return store.put(results);
    }, function queryError() {
      // Fetching the doc/entity failed, so we will insert a new doc instead.
      doc = {
        _id: id,
        type: 'detail',
        entity: view.entry,
        createDate: moment().toDate(),
        modifyDate: moment().toDate(),
        resourceKind: this.resourceKind,
        storedBy: view.id,
        viewId: view.id,
        iconClass: view.getOfflineIcon(),
        description: view.getOfflineDescription(),
        entityName: model.entityName,
        entityDisplayName: model.entityDisplayName,
      };

      return store.add(doc);
    });
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

    return store.remove(id);
  },
  briefCaseEntity: function briefCaseEntity(entityName, entityId, options) {
    let onlineModel = null;
    let offlineModel = null;
    let entityPromise;
    const def = new Deferred();

    onlineModel = App.ModelManager.getModel(entityName, MODEL_TYPES.SDATA);
    offlineModel = App.ModelManager.getModel(entityName, MODEL_TYPES.OFFLINE);

    if (onlineModel && offlineModel) {
      entityPromise = onlineModel.getEntity(entityId, options);
      entityPromise.then(function(entry) {
        if (entry) {
          offlineModel.saveEntry(entry, options).then(function(result) {
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
