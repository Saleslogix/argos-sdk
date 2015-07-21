<<<<<<< HEAD
define('argos/_DetailBase', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/Deferred', 'dojo/query', 'dojo/string', 'dojo/dom', 'dojo/dom-class', 'dojo/dom-construct', './Format', './Utility', './ErrorManager', './View'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseDeferred, _dojoQuery, _dojoString, _dojoDom, _dojoDomClass, _dojoDomConstruct, _Format, _Utility, _ErrorManager, _View) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _Deferred = _interopRequireDefault(_dojo_baseDeferred);

    var _query = _interopRequireDefault(_dojoQuery);

    var _string = _interopRequireDefault(_dojoString);

    var _dom = _interopRequireDefault(_dojoDom);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

    var _format = _interopRequireDefault(_Format);

    var _utility = _interopRequireDefault(_Utility);

    var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

    var _View2 = _interopRequireDefault(_View);

    /**
     * @class argos._DetailBase
     * A Detail View represents a single record and should display all the info the user may need about the entry.
     *
     * A Detail entry is identified by its key (idProperty) which is how it requests the data via the endpoint.
     *
     * @alternateClassName _DetailBase
     * @extends argos.View
     * @requires argos.Format
     * @requires argos.Utility
     * @requires argos.ErrorManager
     */
    var __class = (0, _declare['default'])('argos._DetailBase', [_View2['default']], {
=======
/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @class argos._DetailBase
 * A Detail View represents a single record and should display all the info the user may need about the entry.
 *
 * A Detail entry is identified by its key (idProperty) which is how it requests the data via the endpoint.
 *
 * @alternateClassName _DetailBase
 * @extends argos.View
 * @requires argos.Format
 * @requires argos.Utility
 * @requires argos.ErrorManager
 */
define('argos/_DetailBase', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/Deferred',
    'dojo/query',
    'dojo/string',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-construct',
    './Format',
    './Utility',
    './ErrorManager',
    './View'
], function(
    declare,
    lang,
    Deferred,
    query,
    string,
    dom,
    domClass,
    domConstruct,
    format,
    utility,
    ErrorManager,
    View
) {

    var __class = declare('argos._DetailBase', [View], {
>>>>>>> develop
        /**
         * @property {Object}
         * Creates a setter map to html nodes, namely:
         *
         * * detailContent => contentNode's innerHTML
         *
         */
        attributeMap: {
            detailContent: { node: 'contentNode', type: 'innerHTML' }
        },
        /**
         * @property {Simplate}
         * The template used to render the view's main DOM element when the view is initialized.
         * This template includes loadingTemplate.
         *
         * The default template uses the following properties:
         *
         *      name                description
         *      ----------------------------------------------------------------
         *      id                   main container div id
         *      title                main container div title attr
         *      cls                  additional class string added to the main container div
         *      resourceKind         set to data-resource-kind
         *
         */
        widgetTemplate: new Simplate(['<div id="{%= $.id %}" title="{%= $.titleText %}" class="detail panel {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>', '{%! $.loadingTemplate %}', '<div class="panel-content" data-dojo-attach-point="contentNode"></div>', '</div>']),
        /**
         * @property {Simplate}
         * HTML shown when no data is available.
         */
        emptyTemplate: new Simplate([
        ]),
        /**
         * @property {Simplate}
         * HTML shown when data is being loaded.
         *
         * `$` => the view instance
         */
        loadingTemplate: new Simplate(['<div class="panel-loading-indicator">', '<div class="row"><span class="fa fa-spinner fa-spin"></span><div>{%: $.loadingText %}</div></div>', '</div>']),
        /**
         * @property {Simplate}
         * HTML that starts a new section including the collapsible header
         *
         * `$` => the view instance
         */
        sectionBeginTemplate: new Simplate(['<h2 data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">', '<button class="{% if ($.collapsed) { %}{%: $$.toggleExpandClass %}{% } else { %}{%: $$.toggleCollapseClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>', '{%: ($.title || $.options.title) %}', '</h2>', '{% if ($.list || $.options.list) { %}', '<ul class="{%= ($.cls || $.options.cls) %}">', '{% } else { %}', '<div class="{%= ($.cls || $.options.cls) %}">', '{% } %}']),
        /**
         * @property {Simplate}
         * HTML that ends a section
         *
         * `$` => the view instance
         */
        sectionEndTemplate: new Simplate(['{% if ($.list || $.options.list) { %}', '</ul>', '{% } else { %}', '</div>', '{% } %}']),
        /**
         * @property {Simplate}
         * HTML that is used for a property in the detail layout
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
<<<<<<< HEAD
        propertyTemplate: new Simplate(['<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}" data-property="{%= $.property || $.name %}">', '<label>{%: $.label %}</label>', '<span>{%= $.value %}</span>', // todo: create a way to allow the value to not be surrounded with a span tag
        '</div>']),
=======
        propertyTemplate: new Simplate([
            '<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}" data-property="{%= $.property || $.name %}">',
            '<label>{%: $.label %}</label>',
            '<span>{%= $.value %}</span>', // todo: create a way to allow the value to not be surrounded with a span tag
            '</div>'
        ]),
>>>>>>> develop
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that point to related views, includes a label and links the value text
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        relatedPropertyTemplate: new Simplate(['<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}">', '<label>{%: $.label %}</label>', '<span>', '<a data-action="activateRelatedEntry" data-view="{%= $.view %}" data-context="{%: $.context %}" data-descriptor="{%: $.descriptor || $.value %}">', '{%= $.value %}', '</a>', '</span>', '</div>']),
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that point to related views, displayed as an icon and text
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
<<<<<<< HEAD
        relatedTemplate: new Simplate(['<li class="{%= $.cls %}">', '<a data-action="activateRelatedList" data-view="{%= $.view %}" data-context="{%: $.context %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">', '{% if ($.icon) { %}', '<img src="{%= $.icon %}" alt="icon" class="icon" />', '{% } else if ($.iconClass) { %}', '<div class="{%= $.iconClass %}" alt="icon"></div>', '{% } %}', '<span class="related-item-label">{%: $.label %}</span>', '</a>', '</li>']),
=======
        relatedTemplate: new Simplate([
            '<li class="{%= $.cls %}">',
                '<a data-action="activateRelatedList" data-view="{%= $.view %}" data-context="{%: $.context %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
                    '{% if ($.icon) { %}',
                        '<img src="{%= $.icon %}" alt="icon" class="icon" />',
                    '{% } else if ($.iconClass) { %}',
                        '<div class="{%= $.iconClass %}" alt="icon"></div>',
                    '{% } %}',
                    '<span class="related-item-label">{%: $.label %}</span>',
                '</a>',
            '</li>'
        ]),
>>>>>>> develop
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that fire an action, displayed with label and property value
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        actionPropertyTemplate: new Simplate(['<div class="row {%= $.cls %}">', '<label>{%: $.label %}</label>', '<span>', '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">', '{%= $.value %}', '</a>', '</span>', '</div>']),
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that fire an action, displayed as an icon and text
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
<<<<<<< HEAD
        actionTemplate: new Simplate(['<li class="{%= $.cls %}{% if ($.disabled) { %} disabled{% } %}">', '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">', '{% if ($.icon) { %}', '<img src="{%= $.icon %}" alt="icon" class="icon" />', '{% } else if ($.iconClass) { %}', '<div class="{%= $.iconClass %}" alt="icon"></div>', '{% } %}', '<label>{%: $.label %}</label>', '<span>{%= $.value %}</span>', '</a>', '</li>']),
=======
        actionTemplate: new Simplate([
            '<li class="{%= $.cls %}{% if ($.disabled) { %} disabled{% } %}">',
            '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
            '{% if ($.icon) { %}',
                '<img src="{%= $.icon %}" alt="icon" class="icon" />',
            '{% } else if ($.iconClass) { %}',
                '<div class="{%= $.iconClass %}" alt="icon"></div>',
            '{% } %}',
            '<label>{%: $.label %}</label>',
            '<span>{%= $.value %}</span>',
            '</a>',
            '</li>'
        ]),
>>>>>>> develop
        /**
         * @property {Simplate}
         * HTML that is shown when not available
         *
         * `$` => the view instance
         */
        notAvailableTemplate: new Simplate(['<div class="not-available">{%: $.notAvailableText %}</div>']),
        /**
         * @property {String}
         * The unique identifier of the view
         */
        id: 'generic_detail',
        /**
         * @property {Object}
         * The dojo store this view will use for data exchange.
         */
        store: null,
        /**
         * @property {Object}
         * The data entry
         */
        entry: null,
        /**
         * @property {Object}
         * The layout definition that constructs the detail view with sections and rows
         */
        layout: null,
        /**
         * @cfg {String/Object}
         * May be used for verifying the view is accessible
         */
        security: false,
        /**
         * @property {String}
         * The customization identifier for this class. When a customization is registered it is passed
         * a path/identifier which is then matched to this property.
         */
        customizationSet: 'detail',
        /**
         * @property {Boolean}
         * Controls if the view should be exposed
         */
        expose: false,
        /**
         * @deprecated
         */
        editText: 'Edit',
        /**
         * @cfg {String}
         * Default title text shown in the top toolbar
         */
        titleText: 'Detail',
        /**
         * @property {String}
         * Helper string for a basic section header text
         */
        detailsText: 'Details',
        /**
         * @property {String}
         * Text shown while loading and used in loadingTemplate
         */
        loadingText: 'loading...',
        /**
         * @property {String}
         * Text used in the notAvailableTemplate
         */
        notAvailableText: 'The requested data is not available.',
        /**
         * @property {String}
         * ARIA label text for a collapsible section header
         */
        toggleCollapseText: 'toggle collapse',
        /**
         * @property {String}
         * CSS class for the collapse button when in a expanded state
         */
        toggleCollapseClass: 'fa fa-chevron-down',
        /**
         * @property {String}
         * CSS class for the collapse button when in a collapsed state
         */
        toggleExpandClass: 'fa fa-chevron-right',
        /**
         * @cfg {String}
         * The view id to be taken to when the Edit button is pressed in the toolbar
         */
        editView: false,
        /**
         * @property {Object[]}
         * Store for mapping layout options to an index on the HTML node
         */
        _navigationOptions: null,

        // Store properties
        itemsProperty: '',
        idProperty: '',
        labelProperty: '',
        entityProperty: '',
        versionProperty: '',

        /**
         * Extends the dijit widget postCreate to subscribe to the global `/app/refresh` event and clear the view.
         */
<<<<<<< HEAD
        postCreate: function postCreate() {
=======
        postCreate: function() {
>>>>>>> develop
            this.inherited(arguments);
            this.subscribe('/app/refresh', this._onRefresh);
            this.clear();
        },
<<<<<<< HEAD
        createErrorHandlers: function createErrorHandlers() {
            this.errorHandlers = this.errorHandlers || [{
                name: 'Aborted',
                test: function test(error) {
                    return error.aborted;
                },
                handle: function handle(error, next) {
                    this.options = false; // force a refresh
                    next();
                }
            }, {
                name: 'AlertError',
                test: function test(error) {
                    return error.status !== this.HTTP_STATUS.NOT_FOUND && !error.aborted;
                },
                handle: function handle(error, next) {
                    alert(this.getErrorMessage(error));
                    next();
                }
            }, {
                name: 'NotFound',
                test: function test(error) {
                    return error.status === this.HTTP_STATUS.NOT_FOUND;
                },
                handle: function handle(error, next) {
                    _domConstruct['default'].place(this.notAvailableTemplate.apply(this), this.contentNode, 'only');
                    next();
                }
            }, {
                name: 'CatchAll',
                test: function test(error) {
                    return true;
                },
                handle: function handle(error, next) {
=======
        createErrorHandlers: function() {
            this.errorHandlers = this.errorHandlers || [{
                name: 'Aborted',
                test: function(error) {
                    return error.aborted;
                },
                handle: function(error, next) {
                    this.options = false; // force a refresh
                    next();
                }
            }, {
                name: 'AlertError',
                test: function(error) {
                    return error.status !== this.HTTP_STATUS.NOT_FOUND && !error.aborted;
                },
                handle: function(error, next) {
                    alert(this.getErrorMessage(error));
                    next();
                }
            }, {
                name: 'NotFound',
                test: function(error) {
                    return error.status === this.HTTP_STATUS.NOT_FOUND;
                },
                handle: function(error, next) {
                    domConstruct.place(this.notAvailableTemplate.apply(this), this.contentNode, 'only');
                    next();
                }
            }, {
                name: 'CatchAll',
                test: function(error) {
                    return true;
                },
                handle: function(error, next) {
>>>>>>> develop
                    var errorItem = {
                        viewOptions: this.options,
                        serverError: error
                    };

<<<<<<< HEAD
                    _ErrorManager2['default'].addError(this.getErrorMessage(error), errorItem);
                    _domClass['default'].remove(this.domNode, 'panel-loading');
                    next();
                }
            }];
=======
                    ErrorManager.addError(this.getErrorMessage(error), errorItem);
                    domClass.remove(this.domNode, 'panel-loading');
                    next();
                }
            }
            ];
>>>>>>> develop

            return this.errorHandlers;
        },
        /**
         * Sets and returns the toolbar item layout definition, this method should be overriden in the view
         * so that you may define the views toolbar items.
         * @return {Object} this.tools
         * @template
         */
<<<<<<< HEAD
        createToolLayout: function createToolLayout() {
=======
        createToolLayout: function() {
>>>>>>> develop
            return this.tools || (this.tools = {
                'tbar': [{
                    id: 'edit',
                    cls: 'fa fa-pencil fa-fw fa-lg',
                    action: 'navigateToEditView',
                    security: App.getViewSecurity(this.editView, 'update')
                }, {
                    id: 'refresh',
                    cls: 'fa fa-refresh fa-fw fa-lg',
                    action: '_refreshClicked'
                }]
            });
        },
<<<<<<< HEAD
        _refreshClicked: function _refreshClicked() {
=======
        _refreshClicked: function() {
>>>>>>> develop
            this.clear();
            this.refreshRequired = true;
            this.refresh();

            this.onRefreshClicked();
        },
        /**
         * Called when the user clicks the refresh toolbar button.
         */
<<<<<<< HEAD
        onRefreshClicked: function onRefreshClicked() {},
=======
        onRefreshClicked: function() {
        },
>>>>>>> develop
        /**
         * Extends the {@link _ActionMixin#invokeAction mixins invokeAction} to stop if `data-disableAction` is true
         * @param name
         * @param {Object} parameters Collection of `data-` attributes from the node
         * @param {Event} evt
         * @param {HTMLElement} el
         */
<<<<<<< HEAD
        invokeAction: function invokeAction(name, parameters, evt, el) {
=======
        invokeAction: function(name, parameters, evt, el) {
>>>>>>> develop
            if (parameters && /true/i.test(parameters['disableAction'])) {
                return;
            }
            return this.inherited(arguments);
        },
        /**
         * Toggles the collapsed state of the section.
         */
<<<<<<< HEAD
        toggleSection: function toggleSection(params) {
            var node = _dom['default'].byId(params.$source),
                button = null;
=======
        toggleSection: function(params) {
            var node = dom.byId(params.$source), button = null;
>>>>>>> develop
            if (node) {
                _domClass['default'].toggle(node, 'collapsed');
                button = (0, _query['default'])('button', node)[0];
                if (button) {
                    _domClass['default'].toggle(button, this.toggleCollapseClass);
                    _domClass['default'].toggle(button, this.toggleExpandClass);
                }
            }
        },
        /**
         * Handler for the global `/app/refresh` event. Sets `refreshRequired` to true if the key matches.
         * @param {Object} options The object published by the event.
         * @private
         */
<<<<<<< HEAD
        _onRefresh: function _onRefresh(o) {
=======
        _onRefresh: function(o) {
>>>>>>> develop
            var descriptor = o.data && o.data[this.labelProperty];

            if (this.options && this.options.key === o.key) {
                this.refreshRequired = true;

                if (descriptor) {
                    this.options.title = descriptor;
                    this.set('title', descriptor);
                }
            }
        },
        /**
         * Handler for the related entry action, navigates to the defined `data-view` passing the `data-context`.
         * @param {Object} params Collection of `data-` attributes from the source node.
         */
<<<<<<< HEAD
        activateRelatedEntry: function activateRelatedEntry(params) {
=======
        activateRelatedEntry: function(params) {
>>>>>>> develop
            if (params.context) {
                this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
            }
        },
        /**
         * Handler for the related list action, navigates to the defined `data-view` passing the `data-context`.
         * @param {Object} params Collection of `data-` attributes from the source node.
         */
<<<<<<< HEAD
        activateRelatedList: function activateRelatedList(params) {
=======
        activateRelatedList: function(params) {
>>>>>>> develop
            if (params.context) {
                this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
            }
        },
        /**
         * Navigates to the defined `this.editView` passing the current `this.entry` as default data.
         * @param {HTMLElement} el
         */
<<<<<<< HEAD
        navigateToEditView: function navigateToEditView(el) {
=======
        navigateToEditView: function(el) {
>>>>>>> develop
            var view, entry;
            view = App.getView(this.editView);
            if (view) {
                entry = this.entry;
                view.show({ entry: entry, fromContext:this });
            }
        },
        /**
         * Navigates to a given view id passing the options retrieved using the slot index to `this._navigationOptions`.
         * @param {String} id View id to go to
         * @param {Number} slot Index of the context to use in `this._navigationOptions`.
         * @param {String} descriptor Optional descriptor option that is mixed in.
         */
<<<<<<< HEAD
        navigateToRelatedView: function navigateToRelatedView(id, slot, descriptor) {
=======
        navigateToRelatedView: function(id, slot, descriptor) {
>>>>>>> develop
            var options = this._navigationOptions[slot],
                view = App.getView(id);

            if (descriptor && options) {
                options['descriptor'] = descriptor;
            }

            if (this.entry) {
                options.selectedEntry = this.entry;
            }
            options.fromContext = this;
            if (view && options) {
                view.show(options);
            }
        },
        /**
         * Sets and returns the Detail view layout by following a standard for section and rows:
         *
         * The `this.layout` itself is an array of section objects where a section object is defined as such:
         *
         *     {
         *        name: 'String', // Required. unique name for identification/customization purposes
         *        title: 'String', // Required. Text shown in the section header
         *        list: boolean, // Optional. Default false. Controls if the group container for child rows should be a div (false) or ul (true)
         *        children: [], // Array of child row objects
         *     }
         *
         * A child row object has:
         *
         *     {
         *        name: 'String', // Required. unique name for identification/customization purposes
         *        property: 'String', // Optional. The property of the current entity to bind to
         *        label: 'String', // Optional. Text shown in the label to the left of the property
         *        onCreate: function(), // Optional. You may pass a function to be called when the row is added to the DOM
         *        include: boolean, // Optional. If false the row will not be included in the layout
         *        exclude: boolean, // Optional. If true the row will not be included in the layout
         *        template: Simplate, // Optional. Override the HTML Simplate used for rendering the value (not the row) where `$` is the row object
         *        tpl: Simplate, // Optional. Same as template.
         *        renderer: function(), // Optional. Pass a function that receives the current value and returns a value to be rendered
         *        encode: boolean, // Optional. If true it will encode HTML entities
         *        cls: 'String', // Optional. Additional CSS class string to be added to the row div
         *        use: Simplate, // Optional. Override the HTML Simplate used for rendering the row (not value)
         *        provider: function(entry, propertyName), // Optional. Function that accepts the data entry and the property name and returns the extracted value. By default simply extracts directly.
         *        value: Any // Optional. Provide a value directly instead of binding
         *     }
         *
         * @return {Object[]} Detail layout definition
         */
<<<<<<< HEAD
        createLayout: function createLayout() {
=======
        createLayout: function() {
>>>>>>> develop
            return this.layout || [];
        },
        /**
         * Processes the given layout definition using the data entry response by rendering and inserting the HTML nodes and
         * firing any onCreate events defined.
         * @param {Object[]} layout Layout definition
         * @param {Object} entry data response
         */
<<<<<<< HEAD
        processLayout: function processLayout(layout, entry) {
            var rows = layout['children'] || layout['as'] || layout,
                options = layout['options'] || (layout['options'] = {
                title: this.detailsText
            }),
=======
        processLayout: function(layout, entry) {
            var rows = (layout['children'] || layout['as'] || layout),
                options = layout['options'] || (layout['options'] = {
                    title: this.detailsText
                }),
>>>>>>> develop
                sectionQueue = [],
                sectionStarted = false,
                callbacks = [],
                current,
                i,
                section,
                sectionNode,
                include,
                exclude,
                provider,
                property,
                value,
                rendered,
                formatted,
                data,
                hasAccess,
                context,
                useListTemplate,
                template,
                rowNode,
                rowHtml,
                item;

            for (i = 0; i < rows.length; i++) {
                current = rows[i];
                include = this.expandExpression(current['include'], entry);
                exclude = this.expandExpression(current['exclude'], entry);

                if (include !== undefined && !include) {
                    continue;
                }

                if (exclude !== undefined && exclude) {
                    continue;
                }

                if (current['children'] || current['as']) {
                    if (sectionStarted) {
                        sectionQueue.push(current);
                    } else {
                        this.processLayout(current, entry);
                    }

                    continue;
                }

                if (!sectionStarted) {
                    sectionStarted = true;
                    section = _domConstruct['default'].toDom(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
                    sectionNode = section.childNodes[1];
                    _domConstruct['default'].place(section, this.contentNode);
                }

<<<<<<< HEAD
                provider = current['provider'] || _utility['default'].getValue;
                property = typeof current['property'] === 'string' ? current['property'] : current['name'];
                value = typeof current['value'] === 'undefined' ? provider(entry, property, entry) : current['value'];
=======
                provider = current['provider'] || utility.getValue;
                property = typeof current['property'] === 'string'
                    ? current['property']
                    : current['name'];
                value = typeof current['value'] === 'undefined'
                    ? provider(entry, property, entry)
                    : current['value'];
>>>>>>> develop

                if (current['template'] || current['tpl']) {
                    rendered = (current['template'] || current['tpl']).apply(value, this);
                    formatted = current['encode'] === true ? _format['default'].encode(rendered) : rendered;
                } else if (current['renderer'] && typeof current['renderer'] === 'function') {
                    rendered = current['renderer'].call(this, value);
<<<<<<< HEAD
                    formatted = current['encode'] === true ? _format['default'].encode(rendered) : rendered;
                } else {
                    formatted = current['encode'] !== false ? _format['default'].encode(value) : value;
                }

                data = _lang['default'].mixin({}, {
=======
                    formatted = current['encode'] === true
                        ? format.encode(rendered)
                        : rendered;
                } else {
                    formatted = current['encode'] !== false
                        ? format.encode(value)
                        : value;
                }

                data = lang.mixin({}, {
>>>>>>> develop
                    entry: entry,
                    value: formatted,
                    raw: value
                }, current);

                if (current['descriptor']) {
                    data['descriptor'] = typeof current['descriptor'] === 'function' ? this.expandExpression(current['descriptor'], entry, value) : provider(entry, current['descriptor']);
                }

                if (current['action']) {
                    data['action'] = this.expandExpression(current['action'], entry, value);
                }

                hasAccess = App.hasAccessTo(current['security']);

                if (current['security']) {
                    data['disabled'] = !hasAccess;
                }

                if (current['disabled'] && hasAccess) {
                    data['disabled'] = this.expandExpression(current['disabled'], entry, value);
                }

                if (current['view']) {
<<<<<<< HEAD
                    context = _lang['default'].mixin({}, current['options']);
=======
                    context = lang.mixin({}, current['options']);
>>>>>>> develop

                    if (current['key']) {
                        context['key'] = typeof current['key'] === 'function' ? this.expandExpression(current['key'], entry) : provider(entry, current['key']);
                    }
                    if (current['where']) {
                        context['where'] = this.expandExpression(current['where'], entry);
                    }
                    if (current['resourceKind']) {
                        context['resourceKind'] = this.expandExpression(current['resourceKind'], entry);
                    }
                    if (current['resourceProperty']) {
                        context['resourceProperty'] = this.expandExpression(current['resourceProperty'], entry);
                    }
                    if (current['resourcePredicate']) {
                        context['resourcePredicate'] = this.expandExpression(current['resourcePredicate'], entry);
                    }
                    if (current['dataSet']) {
                        context['dataSet'] = this.expandExpression(current['dataSet'], entry);
                    }
                    if (current['title']) {
                        context['title'] = current['title'];
                    }

                    if (current['resetSearch']) {
                        context['resetSearch'] = current['resetSearch'];
                    } else {
                        context['resetSearch'] = true;
                    }

                    data['view'] = current['view'];
                    data['context'] = this._navigationOptions.push(context) - 1;
                }

<<<<<<< HEAD
                useListTemplate = layout['list'] || options['list'];
=======
                useListTemplate = (layout['list'] || options['list']);
>>>>>>> develop

                // priority: use > (relatedPropertyTemplate | relatedTemplate) > (actionPropertyTemplate | actionTemplate) > propertyTemplate
                if (current['use']) {
                    template = current['use'];
                } else if (current['view'] && useListTemplate) {
                    template = this.relatedTemplate;
                    current['relatedItem'] = true;
                } else if (current['view']) {
                    template = this.relatedPropertyTemplate;
                } else if (current['action'] && useListTemplate) {
                    template = this.actionTemplate;
                } else if (current['action']) {
                    template = this.actionPropertyTemplate;
                } else {
                    template = this.propertyTemplate;
                }

                rowNode = this.createRowNode(current, sectionNode, entry, template, data);
                if (current['relatedItem']) {
                    try {
                        this._processRelatedItem(data, context, rowNode);
                    } catch (e) {
                        //error processing related node
                        console.error(e);
                    }
                }

                if (current['onCreate']) {
                    callbacks.push({ row: current, node: rowNode, value: value, entry: entry });
                }
            }

            for (i = 0; i < callbacks.length; i++) {
                item = callbacks[i];
                item.row['onCreate'].apply(this, [item.row, item.node, item.value, item.entry]);
            }

            for (i = 0; i < sectionQueue.length; i++) {
                current = sectionQueue[i];

                this.processLayout(current, entry);
            }
        },
<<<<<<< HEAD
        createRowNode: function createRowNode(layout, sectionNode, entry, template, data) {
            return _domConstruct['default'].place(template.apply(data, this), sectionNode);
        },
        _getStoreAttr: function _getStoreAttr() {
=======
        createRowNode: function(layout, sectionNode, entry, template, data) {
            return domConstruct.place(template.apply(data, this), sectionNode);
        },
        _getStoreAttr: function() {
>>>>>>> develop
            return this.store || (this.store = this.createStore());
        },
        /**
         * CreateStore is the core of the data handling for Detail Views. By default it is empty but it should return
         * a dojo store of your choosing. There are {@link _SDataDetailMixin Mixins} available for SData.
         * @return {*}
         */
<<<<<<< HEAD
        createStore: function createStore() {
=======
        createStore: function() {
>>>>>>> develop
            return null;
        },
        /**
         * Required for binding to ScrollContainer which utilizes iScroll that requires to be refreshed when the
         * content (therefor scrollable area) changes.
         */
<<<<<<< HEAD
        onContentChange: function onContentChange() {},
=======
        onContentChange: function() {
        },
>>>>>>> develop
        /**
         * @template
         * Optional processing of the returned entry before it gets processed into layout.
         * @param {Object} entry Entry from data store
         * @return {Object} By default does not do any processing
         */
<<<<<<< HEAD
        preProcessEntry: function preProcessEntry(entry) {
=======
        preProcessEntry: function(entry) {
>>>>>>> develop
            return entry;
        },
        /**
         * Takes the entry from the data store, applies customization, applies any custom item process and then
         * passes it to process layout.
         * @param {Object} entry Entry from data store
         */
<<<<<<< HEAD
        processEntry: function processEntry(entry) {
=======
        processEntry: function(entry) {
>>>>>>> develop
            this.entry = this.preProcessEntry(entry);

            if (this.entry) {
                this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
            } else {
                this.set('detailContent', '');
            }
        },
<<<<<<< HEAD
        _onGetComplete: function _onGetComplete(entry) {
=======
        _onGetComplete: function(entry) {
>>>>>>> develop
            try {
                if (entry) {
                    this.processEntry(entry);
                } else {
<<<<<<< HEAD
                    _domConstruct['default'].place(this.notAvailableTemplate.apply(this), this.contentNode, 'only');
                }

                _domClass['default'].remove(this.domNode, 'panel-loading');
=======
                    domConstruct.place(this.notAvailableTemplate.apply(this), this.contentNode, 'only');
                }

                domClass.remove(this.domNode, 'panel-loading');
>>>>>>> develop

                /* this must take place when the content is visible */
                this.onContentChange();
            } catch (e) {
                console.error(e);
            }
        },
<<<<<<< HEAD
        _onGetError: function _onGetError(getOptions, error) {
=======
        _onGetError: function(getOptions, error) {
>>>>>>> develop
            this.handleError(error);
        },
        /**
         * Initiates the request.
         */
<<<<<<< HEAD
        requestData: function requestData() {
            var request, store, getExpression, getResults, getOptions;

            _domClass['default'].add(this.domNode, 'panel-loading');
=======
        requestData: function() {
            var request, store, getExpression, getResults, getOptions;

            domClass.add(this.domNode, 'panel-loading');
>>>>>>> develop

            store = this.get('store');
            if (store) {
                getOptions = {};

                this._applyStateToGetOptions(getOptions);

                getExpression = this._buildGetExpression() || null;
                getResults = store.get(getExpression, getOptions);

<<<<<<< HEAD
                _Deferred['default'].when(getResults, this._onGetComplete.bind(this), this._onGetError.bind(this, getOptions));
=======
                Deferred.when(getResults,
                    this._onGetComplete.bind(this),
                    this._onGetError.bind(this, getOptions)
                );
>>>>>>> develop

                return getResults;
            }

            console.warn('Error requesting data, no store was defined. Did you mean to mixin _SDataDetailMixin to your detail view?');
        },
<<<<<<< HEAD
        _buildGetExpression: function _buildGetExpression() {
=======
        _buildGetExpression: function() {
>>>>>>> develop
            var options = this.options;

            return options && (options.id || options.key);
        },
<<<<<<< HEAD
        _applyStateToGetOptions: function _applyStateToGetOptions(getOptions) {},
=======
        _applyStateToGetOptions: function(getOptions) {
        },
>>>>>>> develop
        /**
         * Determines if the view should be refresh by inspecting and comparing the passed navigation option key with current key.
         * @param {Object} options Passed navigation options.
         * @return {Boolean} True if the view should be refreshed, false if not.
         */
<<<<<<< HEAD
        refreshRequiredFor: function refreshRequiredFor(options) {
=======
        refreshRequiredFor: function(options) {
>>>>>>> develop
            if (this.options) {
                if (options) {
                    if (this.options.key !== options.key) {
                        return true;
                    }
                }

                return false;
            } else {
                return this.inherited(arguments);
            }
        },
        /**
         * Extends the {@link View#activate parent implementation} to set the nav options title attribute to the descriptor
         * @param tag
         * @param data
         */
<<<<<<< HEAD
        activate: function activate(tag, data) {
=======
        activate: function(tag, data) {
>>>>>>> develop
            var options = data && data.options;
            if (options && options.descriptor) {
                options.title = options.title || options.descriptor;
            }

            this.inherited(arguments);
        },
<<<<<<< HEAD
        show: function show(options) {
=======
        show: function(options) {
>>>>>>> develop
            if (options && options.descriptor) {
                options.title = options.title || options.descriptor;
            }

            this.inherited(arguments);
        },
        /**
         * Returns the view key
         * @return {String} View key
         */
<<<<<<< HEAD
        getTag: function getTag() {
=======
        getTag: function() {
>>>>>>> develop
            return this.options && this.options.key;
        },
        /**
         * Extends the {@link View#getContext parent implementation} to also set the resourceKind, key and descriptor
         * @return {Object} View context object
         */
<<<<<<< HEAD
        getContext: function getContext() {
            return _lang['default'].mixin(this.inherited(arguments), {
=======
        getContext: function() {
            return lang.mixin(this.inherited(arguments), {
>>>>>>> develop
                resourceKind: this.resourceKind,
                key: this.options.key,
                descriptor: this.options.descriptor
            });
        },
        /**
         * Extends the {@link View#beforeTransitionTo parent implementation} to also clear the view if `refreshRequired` is true
         * @return {Object} View context object
         */
<<<<<<< HEAD
        beforeTransitionTo: function beforeTransitionTo() {
=======
        beforeTransitionTo: function() {
>>>>>>> develop
            this.inherited(arguments);

            if (this.refreshRequired) {
                this.clear();
            }
        },
        /**
         * If a security breach is detected it sets the content to the notAvailableTemplate, otherwise it calls
         * {@link #requestData requestData} which starts the process sequence.
         */
<<<<<<< HEAD
        refresh: function refresh() {
=======
        refresh: function() {
>>>>>>> develop
            if (this.security && !App.hasAccessTo(this.expandExpression(this.security))) {
                _domConstruct['default'].place(this.notAvailableTemplate.apply(this), this.contentNode, 'last');
                return;
            }

            this.requestData();
        },
        /**
         * Clears the view by replacing the content with the empty template and emptying the stored row contexts.
         */
<<<<<<< HEAD
        clear: function clear() {
=======
        clear: function() {
>>>>>>> develop
            this.set('detailContent', this.emptyTemplate.apply(this));

            this._navigationOptions = [];
        },
<<<<<<< HEAD
        _processRelatedItem: function _processRelatedItem(data, context, rowNode) {
            var view = App.getView < _ListBase > data['view'],
                options = {};
=======
        _processRelatedItem: function(data, context, rowNode) {
            var view = App.getView(data['view']), options = {};
>>>>>>> develop

            if (view) {
                options.where = context ? context['where'] : '';
                view.getListCount(options).then(function(result) {
                    var labelNode, html;

                    if (result >= 0) {
                        labelNode = (0, _query['default'])('.related-item-label', rowNode)[0];
                        if (labelNode) {
                            html = '<span class="related-item-count">' + result + '</span>';
<<<<<<< HEAD
                            _domConstruct['default'].place(html, labelNode, 'before');
=======
                            domConstruct.place(html, labelNode, 'before');
>>>>>>> develop
                        } else {
                            console.warn('Missing the "related-item-label" dom node.');
                        }
                    }
                });
            }
        },
<<<<<<< HEAD
        destroy: function destroy() {
=======
        destroy: function() {
>>>>>>> develop
            this.inherited(arguments);
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile._DetailBase', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile._DetailBase', __class);
    return __class;
>>>>>>> develop
});
