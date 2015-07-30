define('argos/RelatedViewManager', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/event', 'dojo/string', 'dojo/dom-class', 'dojo/when', 'dojo/dom-construct', 'dojo/query', 'dojo/_base/array', './Store/SData', './_RelatedViewWidgetBase'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseEvent, _dojoString, _dojoDomClass, _dojoWhen, _dojoDomConstruct, _dojoQuery, _dojo_baseArray, _StoreSData, _RelatedViewWidgetBase) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /*
   * See copyright file.
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _event = _interopRequireDefault(_dojo_baseEvent);

  var _string = _interopRequireDefault(_dojoString);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _when = _interopRequireDefault(_dojoWhen);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _query = _interopRequireDefault(_dojoQuery);

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _SDataStore = _interopRequireDefault(_StoreSData);

  var _RelatedViewWidget = _interopRequireDefault(_RelatedViewWidgetBase);

  var _widgetTypes, __class;

  _widgetTypes = {};
  __class = (0, _declare['default'])('argos.RelatedViewManager', null, {
    id: 'relatedViewManager',
    relatedViews: null,
    relatedViewConfig: null,
    widgetTypes: _widgetTypes,
    enabled: true,
    constructor: function constructor(options) {
      this.relatedViews = {};
      _lang['default'].mixin(this, options);
      this.registerType('default', _RelatedViewWidget['default']);
    },
    destroyViews: function destroyViews() {
      for (var relatedViewId in this.relatedViews) {
        if (this.relatedViews.hasOwnProperty(relatedViewId)) {
          this.relatedViews[relatedViewId].destroy();
        }
      }
      this.relatedViews = {};
    },
    registerType: function registerType(widgetTypeName, ctor) {
      this.widgetTypes[widgetTypeName] = ctor;
    },
    getWidgetType: function getWidgetType(widgetTypeName) {
      var widgetType;
      widgetType = this.widgetTypes[widgetTypeName];
      if (!widgetType) {
        widgetType = _RelatedViewWidget['default'];
      }
      return widgetType;
    },
    addView: function addView(entry, contentNode, owner) {
      var relatedContentNode, relatedViewNode, relatedViewWidget, relatedResults, options;
      try {
        if (contentNode) {
          if (this.enabled) {
            options = {};
            if (!this.relatedViewConfig.widgetType) {
              this.relatedViewConfig.widgetType = _RelatedViewWidget['default'];
            }
            if (typeof this.relatedViewConfig.widgetType === 'string') {
              this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
            }
            _lang['default'].mixin(options, this.relatedViewConfig);
            options.id = this.id + '_' + entry.$key;
            relatedViewWidget = new this.relatedViewConfig.widgetType(options);
            relatedViewWidget.parentEntry = entry;
            relatedViewWidget.parentResourceKind = owner.resourceKind;
            relatedViewWidget.owner = owner;
            relatedViewWidget.parentNode = contentNode;
            this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
            relatedViewWidget.onInit();
            relatedViewWidget.placeAt(contentNode, 'last');
          }
        }
      } catch (error) {
        console.log('Error adding related view widgets:' + error);
      }
    }
  });
  // Backwards compatibility for custom modules still referencing the old declare global
  _lang['default'].setObject('Sage.Platform.Mobile.RelatedViewManager', __class);
  module.exports = __class;
});
