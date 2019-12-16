define('argos/Models/_ModelBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/Evented', 'dojo/Stateful', '../Utility', '../_CustomizationMixin'], function (module, exports, _declare, _Evented, _Stateful, _Utility, _CustomizationMixin2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Evented2 = _interopRequireDefault(_Evented);

  var _Stateful2 = _interopRequireDefault(_Stateful);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _declare2.default)('argos.Models._ModelBase', [_Evented2.default, _Stateful2.default, _CustomizationMixin3.default], /** @lends argos.Models_ModelBase# */{
    id: null,
    customizationSet: 'models',
    app: null,
    resourceKind: null,
    itemsProperty: '$resources',
    idProperty: '$key',
    labelProperty: '$descriptor',
    entityProperty: '$name',
    versionProperty: '$etag',
    entityName: 'Entity',
    entityDisplayName: 'Entity',
    entityDisplayNamePlural: 'Entities',
    /**
     * @cfg {Boolean}
     * Enables the use of the customization engine on this model instance
     */
    enableCustomizations: true,
    modelName: null,
    modelType: null,
    iconClass: 'url',
    picklists: null,
    detailViewId: null,
    listViewId: null,
    editViewId: null,
    relationships: null,
    createRelationships: function createRelationships() {
      return [];
    },
    createPicklists: function createPicklists() {
      return [];
    },
    _appGetter: function _appGetter() {
      return this.app || window.App;
    },
    _appSetter: function _appSetter(value) {
      this.app = value;
    },

    /**
     * Initializes the model with options.
     * @param options
     */
    init: function init() {
      this.relationships = this.relationships || this._createCustomizedLayout(this.createRelationships(), 'relationships');
      this.picklists = this.picklists || this._createCustomizedLayout(this.createPicklists(), 'picklists');
      this.getPicklists();
    },
    getEntry: function getEntry(options) {// eslint-disable-line
    },
    getEntries: function getEntries(query, options) {// eslint-disable-line
    },
    getPicklists: function getPicklists() {},
    insertEntry: function insertEntry(entry, options) {// eslint-disable-line
    },
    updateEntry: function updateEntry(entry, options) {// eslint-disable-line
    },
    deleteEntry: function deleteEntry(entry, options) {// eslint-disable-line
    },
    saveEntry: function saveEntry(entry, options) {// eslint-disable-line
    },
    getIconClass: function getIconClass() {
      return this.iconClass;
    },
    getEntityDescription: function getEntityDescription(entry) {
      return _Utility2.default.getValue(entry, this.labelProperty);
    },
    getEntityId: function getEntityId(entry) {
      return _Utility2.default.getValue(entry, this.idProperty);
    },
    getPicklistNameByProperty: function getPicklistNameByProperty(property) {
      var picklist = this.picklists.find(function (pl) {
        return pl.property === property;
      });
      return picklist && picklist.name || null;
    },
    buildQueryExpression: function buildQueryExpression(query, options) {// eslint-disable-line
    },
    buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) {// eslint-disable-line
    }
  });
  module.exports = exports['default'];
});