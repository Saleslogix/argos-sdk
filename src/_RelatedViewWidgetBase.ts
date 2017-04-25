/* see copyright file
 */
const declare = require('dojo/_base/declare');
const lang = require('dojo/_base/lang');
const _WidgetBase = require('dijit/_WidgetBase');
import _Templated from './_Templated';
import getResource from './I18n';

const resource = getResource('relatedViewWidgetBase');

const __class = declare('argos._RelatedViewWidgetBase', [_WidgetBase, _Templated], {
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
