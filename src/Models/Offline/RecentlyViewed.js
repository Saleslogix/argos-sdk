import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';

const __class = declare('argos.Models.Offline.RecentlyViewed', [_OfflineModelBase], {
  entityName: 'RecentlyViewed',
  modelName: 'RecentlyViewed',
  createEntry: function createEntity(viewId, entry, model) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = viewId + '_' + model.getEntityId(entry);
    entity.$descriptor = model.getEntityDescription(entry);
    entity.createDate = moment().toDate();
    entity.modifyDate = moment().toDate();
    entity.entityId = model.getEntityId(entry);
    entity.entityName = model.entityName;
    entity.description = model.getEntityDescription(entry);
    entity.entityDisplayName = model.entityDisplayName;
    entity.resourceKind = model.resourceKind;
    entity.viewId = viewId;
    entity.iconClass = model.getIconClass(entry);
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
