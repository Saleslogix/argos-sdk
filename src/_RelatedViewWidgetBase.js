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
    '<div class="busyIndicator__container busyIndicator--active" aria-live="polite">',
      '<div class="busyIndicator busyIndicator--large">',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--one"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--two"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--three"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--four"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--five"></div>',
      '</div>',
      '<span class="busyIndicator__label">{%: $.loadingText %}</span>',
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

lang.setObject('Sage.Platform.Mobile._RelatedViewWidgetBase', __class);
export default __class;
