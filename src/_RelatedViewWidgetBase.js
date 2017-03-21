/* see copyright file
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import getResource from './I18n';

const resource = getResource('relatedViewWidgetBase');

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
    '<div class="busy-indicator-container" aria-live="polite">',
    '<div class="busy-indicator active">',
    '<div class="bar one"></div>',
    '<div class="bar two"></div>',
    '<div class="bar three"></div>',
    '<div class="bar four"></div>',
    '<div class="bar five"></div>',
    '</div>',
    '<span>{%: $.loadingText %}</span>',
    '</div>',
  ]),
  constructor: function constructor(options) {
    lang.mixin(this, options);
  },
  onInit: function onInit() {
    this.onLoad();
  },
  onLoad: function onLoad() {},
});

export default __class;
