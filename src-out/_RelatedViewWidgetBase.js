define('argos/_RelatedViewWidgetBase', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_Widget', './_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dijit_Widget, _Templated2) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /* see copyright file
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _Widget2 = _interopRequireDefault(_dijit_Widget);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var __class = (0, _declare['default'])('argos._RelatedViewWidgetBase', [_Widget2['default'], _Templated3['default']], {
    cls: null,
    loadingText: 'loading ... ',
    /**
     * @property {Simplate}
     * Simple that defines the HTML Markup
     */
    widgetTemplate: new Simplate(['<div class="related-view-widget-base {%: $$.cls %}">', '<div data-dojo-attach-point="containerNode" >', '{%! $$.relatedContentTemplate %}', '</div>', '</div>']),
    relatedContentTemplate: new Simplate(['']),
    loadingTemplate: new Simplate(['<div class="content-loading"><span>{%= $.loadingText %}</span></div>']),
    constructor: function constructor(options) {
      _lang['default'].mixin(this, options);
    },
    onInit: function onInit() {
      this.onLoad();
    },
    onLoad: function onLoad() {}
  });

  _lang['default'].setObject('Sage.Platform.Mobile._RelatedViewWidgetBase', __class);
  module.exports = __class;
});
