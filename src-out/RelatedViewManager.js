define('argos/RelatedViewManager', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './_RelatedViewWidgetBase'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _RelatedViewWidgetBase) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /*
   * See copyright file.
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _RelatedViewWidget = _interopRequireDefault(_RelatedViewWidgetBase);

  var _widgetTypes = {};
  var __class = (0, _declare['default'])('argos.RelatedViewManager', null, {
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
      var widgetType = this.widgetTypes[widgetTypeName];
      if (!widgetType) {
        widgetType = _RelatedViewWidget['default'];
      }
      return widgetType;
    },
    addView: function addView(entry, contentNode, owner) {
      try {
        if (contentNode) {
          if (this.enabled) {
            var options = {};
            if (!this.relatedViewConfig.widgetType) {
              this.relatedViewConfig.widgetType = _RelatedViewWidget['default'];
            }
            if (typeof this.relatedViewConfig.widgetType === 'string') {
              this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
            }
            _lang['default'].mixin(options, this.relatedViewConfig);
            options.id = this.id + '_' + entry.$key;
            var relatedViewWidget = new this.relatedViewConfig.widgetType(options); //eslint-disable-line
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
        console.log('Error adding related view widgets:' + error); //eslint-disable-line
      }
    }
  });
  // Backwards compatibility for custom modules still referencing the old declare global
  _lang['default'].setObject('Sage.Platform.Mobile.RelatedViewManager', __class);
  module.exports = __class;
});
