/* see copyright file
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';

const resource = window.localeContext.getEntitySync('relatedViewWidgetBase').attributes;

const __class = declare('argos._RelatedViewWidgetBase', [_Widget, _Templated], {
  cls: null,
  loadingText: resource.loadingText,
  /**
   * @property {Simplate}
   * Simple that defines the HTML Markup
   */
  widgetTemplate: new Simplate([
    '<div class="related-view-widget-base {%: $$.cls %}">',
    '<div data-dojo-attach-point="containerNode" >',
    '{%! $$.relatedContentTemplate %}',
    '</div>',
    '</div>',
  ]),
  relatedContentTemplate: new Simplate([
    '',
  ]),
  loadingTemplate: new Simplate([
    '<div class="content-loading"><span>{%= $.loadingText %}</span></div>',
  ]),
  constructor: function constructor(options) {
    lang.mixin(this, options);
  },
  onInit: function onInit() {
    this.onLoad();
  },
  onLoad: function onLoad() {},
});

lang.setObject('Sage.Platform.Mobile._RelatedViewWidgetBase', __class);
export default __class;
