/* 
 * See copyright file.
 */

define('argos/RelatedViewDetailWidget', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/on',
    'dojo/string',
    'dojo/dom-class',
    'dojo/when',
    'dojo/_base/Deferred',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/dom-attr',
    'dojo/_base/connect',
    'dojo/_base/array',
    './Utility',
    './Format',
    'dijit/_Widget',
    './_Templated'
    
], function(
    declare,
    lang,
    event,
    on,
    string,
    domClass,
    when,
    Deferred,
    domConstruct,
    query,
    domAttr,
    connect,
    array,
    utility,
    format,
    _Widget,
    _Templated

) {
    var __class = declare('argos.RelatedViewDetailWidget', [_Widget, _Templated], {

        id: 'related-detail-view',
        lodingNode: null,
        parentEntry: null,
        parentKey:null,
        owner: null,
        resourceKind: null,
        entityName: null,
        /**
         * @property {Simplate}
         * Simple that defines the HTML Markup
         */
        widgetTemplate: new Simplate([
            '<div class="related-view-detail-widget {%: $$.cls %}">',
                    '<div class="content-panel" data-dojo-attach-point="contentNode"></div>',
            '</div>'
        ]),
        loadingTemplate: new Simplate([
           '<div class="content-loading"><span>{%= $.loadingText %}</span></div>'
        ]),
        constructor: function(options) {
            lang.mixin(this, options);
            this.fields = {};
            this._subscribes = [];
            this._subscribes.push(connect.subscribe('/app/refresh', this, this._onAppRefresh));
        },
        postCreate:function(){

        },
        onInit: function (options) {
            this._isInitLoad = true;
            this.parentEntry = this.owner.entry;
            this.parentKey = this.owner.entry.$key;
            this.resourceKind = this.owner.resourceKind;
            this.entityName = this.owner.entityName;
            this.onLoad();
        },
        onLoad: function () {
            if (!this.loadingNode) {
                this.loadingNode = domConstruct.toDom(this.loadingTemplate.apply(this));
                domConstruct.place(this.loadingNode, this.contentNode, 'last', this);
            }
            domClass.toggle(this.loadingNode, 'loading');
            if (this.parentEntry) {
                this.processEntry(this.parentEntry);

            }
            domClass.toggle(this.loadingNode, 'loading');
        },
        processEntry:function(entry){

        },
        onRefreshView: function(evt) {
            this._onRefreshView();
            evt.stopPropagation();
        },
       _onRefreshView: function() {
            this.onLoad();
        },
        _onAppRefresh: function(data) {
            if (data && data.data) {
                if(data.resourceKind === this.resourceKind){
                    if (this.parentEntry && (this.parentEntry[this.parentProperty] === utility.getValue(data.data, this.relatedProperty, ''))) {
                        this._onRefreshView();
                    } else {
                        if(this.editViewId === data.id){
                            this._onRefreshView();
                        }
                        if (this.editViewId === data.id) {
                            this._onRefreshView();
                        }
                    }
                }
            }
        },
        destroy: function() {
            array.forEach(this._subscribes, function(handle) {
                connect.unsubscribe(handle);
            });
           this.inherited(arguments);
        }
    });
    // Backwards compatibility for custom modules still referencing the old declare global
    lang.setObject('Sage.Platform.Mobile.RelatedViewDetailWidget', __class);
    return __class;
});
