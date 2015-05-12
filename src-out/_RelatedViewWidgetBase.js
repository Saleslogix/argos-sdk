/* see copyright file
 */
define('argos/_RelatedViewWidgetBase', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/_Widget',
    './_Templated'
], function (declare, lang, _Widget, _Templated) {
    var __class = declare('argos._RelatedViewWidgetBase', [_Widget, _Templated], {
        cls: null,
        loadingText: 'loading ... ',
        /**
         * @property {Simplate}
         * Simple that defines the HTML Markup
         */
        widgetTemplate: new Simplate([
            '<div class="related-view-widget-base {%: $$.cls %}">',
            '<div data-dojo-attach-point="containerNode" >',
            '{%! $$.relatedContentTemplate %}',
            '</div>',
            '</div>'
        ]),
        relatedContentTemplate: new Simplate([
            ''
        ]),
        loadingTemplate: new Simplate([
            '<div class="content-loading"><span>{%= $.loadingText %}</span></div>'
        ]),
        constructor: function (options) {
            lang.mixin(this, options);
        },
        onInit: function () {
            this.onLoad();
        },
        onLoad: function () {
        }
    });
    lang.setObject('Sage.Platform.Mobile._RelatedViewWidgetBase', __class);
    return __class;
});
