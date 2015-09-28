import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';

const __class = declare('argos.Models.Offline.RecentlyViewed', [_OfflineModelBase], {
  entityName: 'RecentlyViewed',
  modelName: 'RecentlyViewed',
  createEntry: function createEntity(view, viewsModel) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = view.id + '_' + view.entry[view.idProperty || '$key'];
    entity.$descriptor = viewsModel.getEntityDescription(view.entry);
    entity.createDate = moment().toDate();
    entity.modifyDate = moment().toDate();
    entity.entityId = viewsModel.getEntityId(view.entry);
    entity.entityName = viewsModel.entityName;
    entity.description = viewsModel.getEntityDescription(view.entry);
    entity.entityDisplayName = viewsModel.entityDisplayName;
    entity.resourceKind = viewsModel.resourceKind;
    entity.storedBy = view.id;
    entity.viewId = view.id;
    entity.iconClass = view.getOfflineIcon();
    return entity;
  },
  xbuildQueryExpression: function xbuildQueryExpression() {
    const filters = this.getActiveEntityFilters();
    return function queryFn(doc, emit) {
      // If the user has entity filters stored in preferences, filter based on that
      if (App.preferences && App.preferences.offlineEntityFilters) {
        filters.forEach((f) => {
          if ((doc.entity.entityName === f.name) && (doc.entityName === 'RecentlyViewed')) {
            emit(doc.modifyDate);
          }
        });
      } else {
        // User has no entity filter preferences (from right drawer)
        if (doc.entityName === 'RecentlyViewed') {
          emit(doc.modifyDate);
        }
      }
    };
  },
  getActiveEntityFilters: function getActiveEntityFilters() {
    return Object.keys(this.entityMappings)
      .map((entityName) => {
        const prefs = App.preferences && App.preferences.offlineEntityFilters || [];
        const entityPref = prefs.filter((pref) => {
          return pref.name === entityName;
        });
        return entityPref[0];
      })
      .filter((f) => f && f.enabled);
  },
  entityMappings: {
    'Contact': {
      iconClass: 'fa-user',
    },
    'Account': {
      iconClass: 'fa-building-o',
    },
    'Opportunity': {
      iconClass: 'fa-money',
    },
    'Ticket': {
      iconClass: 'fa-clipboard',
    },
    'Lead': {
      iconClass: 'fa-filter',
    },
    'Activity': {
      iconClass: 'fa-calendar-o',
    },
    'History': {
      iconClass: 'fa-history',
    },
  },
});

Manager.register('RecentlyViewed', MODEL_TYPES.OFFLINE, __class);
export default __class;
