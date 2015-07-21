<<<<<<< HEAD
define('argos/View', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/array', 'dijit/_WidgetBase', './_ActionMixin', './_CustomizationMixin', './_Templated', './_ErrorHandleMixin'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseArray, _dijit_WidgetBase, _ActionMixin2, _CustomizationMixin2, _Templated2, _ErrorHandleMixin2) {
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

    var _array = _interopRequireDefault(_dojo_baseArray);

    var _WidgetBase2 = _interopRequireDefault(_dijit_WidgetBase);

    var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

    var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

    var _Templated3 = _interopRequireDefault(_Templated2);

    var _ErrorHandleMixin3 = _interopRequireDefault(_ErrorHandleMixin2);

    /**
     * @class argos.View
     * View is the root Class for all views and incorporates all the base features,
     * events, and hooks needed to successfully render, hide, show, and transition.
     *
     * All Views are dijit Widgets, namely utilizing its: widgetTemplate, connections, and attributeMap
     * @alternateClassName View
     * @mixins argos._ActionMixin
     * @mixins argos._CustomizationMixin
     * @mixins argos._Templated
     * @mixins argos._ErrorHandleMixin
     */
    var __class = (0, _declare['default'])('argos.View', [_WidgetBase2['default'], _ActionMixin3['default'], _CustomizationMixin3['default'], _Templated3['default'], _ErrorHandleMixin3['default']], {
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
 * @class argos.View
 * View is the root Class for all views and incorporates all the base features,
 * events, and hooks needed to successfully render, hide, show, and transition.
 *
 * All Views are dijit Widgets, namely utilizing its: widgetTemplate, connections, and attributeMap
 * @alternateClassName View
 * @mixins argos._ActionMixin
 * @mixins argos._CustomizationMixin
 * @mixins argos._Templated
 * @mixins argos._ErrorHandleMixin
 */
define('argos/View', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dijit/_WidgetBase',
    './_ActionMixin',
    './_CustomizationMixin',
    './_Templated',
    './_ErrorHandleMixin'
], function(
    declare,
    lang,
    array,
    _WidgetBase,
    _ActionMixin,
    _CustomizationMixin,
    _Templated,
    _ErrorHandleMixin
) {
    var __class = declare('argos.View', [_WidgetBase, _ActionMixin, _CustomizationMixin, _Templated, _ErrorHandleMixin], {
>>>>>>> develop
        /**
         * This map provides quick access to HTML properties, most notably the selected property of the container
         */
        attributeMap: {
            'title': {
                node: 'domNode',
                type: 'attribute',
                attribute: 'title'
            },
            'selected': {
                node: 'domNode',
                type: 'attribute',
                attribute: 'selected'
            }
        },
        /**
         * The widgetTemplate is a Simplate that will be used as the main HTML markup of the View.
         * @property {Simplate}
         */
        widgetTemplate: new Simplate(['<ul id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow {%= $.cls %}">', '</ul>']),
        _loadConnect: null,
        /**
         * The id is used to uniquely define a view and is used in navigating, history and for HTML markup.
         * @property {String}
         */
        id: 'generic_view',
        /**
         * The titleText string will be applied to the top toolbar during {@link #show show}.
         */
        titleText: 'Generic View',
        /**
         * This views toolbar layout that defines all toolbar items in all toolbars.
         * @property {Object}
         */
        tools: null,
        /**
         * May be defined along with {@link App#hasAccessTo Application hasAccessTo} to incorporate View restrictions.
         */
        security: null,
        /**
         * A reference to the globa App object
         */
        app: null,
        /**
         * May be used to specify the service name to use for data requests. Setting false will force the use of the default service.
         * @property {String/Boolean}
         */
        serviceName: false,
        connectionName: false,
<<<<<<< HEAD
        constructor: function constructor(options) {
            this.app = options && options.app || window.App;
        },
        startup: function startup() {
=======
        constructor: function(options) {
            this.app = (options && options.app) || window.App;
        },
        startup: function() {
>>>>>>> develop
            this.inherited(arguments);
        },
        /**
         * Called from {@link App#_viewTransitionTo Applications view transition handler} and returns
         * the fully customized toolbar layout.
         * @return {Object} The toolbar layout
         */
<<<<<<< HEAD
        getTools: function getTools() {
=======
        getTools: function() {
>>>>>>> develop
            var tools = this._createCustomizedLayout(this.createToolLayout(), 'tools');
            this.onToolLayoutCreated(tools);
            return tools;
        },
        /**
         * Called after toolBar layout is created;
         *
         */
<<<<<<< HEAD
        onToolLayoutCreated: function onToolLayoutCreated(tools) {},
=======
        onToolLayoutCreated:function(tools) {
        },
>>>>>>> develop
        /**
         * Returns the tool layout that defines all toolbar items for the view
         * @return {Object} The toolbar layout
         */
<<<<<<< HEAD
        createToolLayout: function createToolLayout() {
=======
        createToolLayout: function() {
>>>>>>> develop
            return this.tools || {};
        },
        /**
         * Called on loading of the application.
         */
<<<<<<< HEAD
        init: function init() {
=======
        init: function() {
>>>>>>> develop
            this.startup();
            this.initConnects();
        },
        /**
         * Establishes this views connections to various events
         */
<<<<<<< HEAD
        initConnects: function initConnects() {
            var h;
            this._loadConnect = this.connect(this.domNode, 'onload', this._onLoad);
        },
        _onLoad: function _onLoad(evt, el, o) {
=======
        initConnects: function() {
            var h;
            this._loadConnect = this.connect(this.domNode, 'onload', this._onLoad);
        },
        _onLoad: function(evt, el, o) {
>>>>>>> develop
            this.disconnect(this._loadConnect);

            this.load(evt, el, o);
        },
        /**
         * Called once the first time the view is about to be transitioned to.
         * @deprecated
         */
<<<<<<< HEAD
        load: function load() {},
=======
        load: function() {
            // todo: remove load entirely?
        },
>>>>>>> develop
        /**
         * Called in {@link #show show()} before ReUI is invoked.
         * @param {Object} options Navigation options passed from the previous view.
         * @return {Boolean} True indicates view needs to be refreshed.
         */
<<<<<<< HEAD
        refreshRequiredFor: function refreshRequiredFor(options) {
=======
        refreshRequiredFor: function(options) {
>>>>>>> develop
            if (this.options) {
                return !!options; // if options provided, then refresh
            } else {
                return true;
            }
        },
        /**
         * Should refresh the view, such as but not limited to:
         * Emptying nodes, requesting data, rendering new content
         */
<<<<<<< HEAD
        refresh: function refresh() {},
=======
        refresh: function() {
        },
>>>>>>> develop
        /**
         * The onBeforeTransitionAway event.
         * @param self
         */
<<<<<<< HEAD
        onBeforeTransitionAway: function onBeforeTransitionAway(self) {},
=======
        onBeforeTransitionAway: function(self) {
        },
>>>>>>> develop
        /**
         * The onBeforeTransitionTo event.
         * @param self
         */
<<<<<<< HEAD
        onBeforeTransitionTo: function onBeforeTransitionTo(self) {},
=======
        onBeforeTransitionTo: function(self) {
        },
>>>>>>> develop
        /**
         * The onTransitionAway event.
         * @param self
         */
<<<<<<< HEAD
        onTransitionAway: function onTransitionAway(self) {},
=======
        onTransitionAway: function(self) {
        },
>>>>>>> develop
        /**
         * The onTransitionTo event.
         * @param self
         */
<<<<<<< HEAD
        onTransitionTo: function onTransitionTo(self) {},
=======
        onTransitionTo: function(self) {
        },
>>>>>>> develop
        /**
         * The onActivate event.
         * @param self
         */
<<<<<<< HEAD
        onActivate: function onActivate(self) {},
=======
        onActivate: function(self) {
        },
>>>>>>> develop
        /**
         * The onShow event.
         * @param self
         */
<<<<<<< HEAD
        onShow: function onShow(self) {},
        activate: function activate(tag, data) {
=======
        onShow: function(self) {
        },
        activate: function(tag, data) {
>>>>>>> develop
            // todo: use tag only?
            if (data && this.refreshRequiredFor(data.options)) {
                this.refreshRequired = true;
            }

<<<<<<< HEAD
            this.options = data && data.options || this.options || {};
=======
            this.options = (data && data.options) || this.options || {};
>>>>>>> develop

            if (this.options.title) {
                this.set('title', this.options.title);
            } else {
<<<<<<< HEAD
                this.set('title', this.get('title') || this.titleText);
=======
                this.set('title', (this.get('title') || this.titleText));
>>>>>>> develop
            }

            this.onActivate(this);
        },
<<<<<<< HEAD
        _getScrollerAttr: function _getScrollerAttr() {
=======
        _getScrollerAttr: function() {
>>>>>>> develop
            return this.scrollerNode || this.domNode;
        },
        /**
         * Shows the view using iUI in order to transition to the new element.
         * @param {Object} options The navigation options passed from the previous view.
         * @param transitionOptions {Object} Optional transition object that is forwarded to ReUI.
         */
<<<<<<< HEAD
        show: function show(options, transitionOptions) {
=======
        show: function(options, transitionOptions) {
>>>>>>> develop
            this.errorHandlers = this._createCustomizedLayout(this.createErrorHandlers(), 'errorHandlers');

            var tag, data;

            if (this.onShow(this) === false) {
                return;
            }

            if (this.refreshRequiredFor(options)) {
                this.refreshRequired = true;
            }

            this.options = options || this.options || {};

            if (this.options.title) {
                this.set('title', this.options.title);
            } else {
<<<<<<< HEAD
                this.set('title', this.get('title') || this.titleText);
=======
                this.set('title', (this.get('title') || this.titleText));
>>>>>>> develop
            }

            tag = this.getTag();
            data = this.getContext();

<<<<<<< HEAD
            transitionOptions = _lang['default'].mixin(transitionOptions || {}, { tag: tag, data: data });
=======
            transitionOptions = lang.mixin(transitionOptions || {}, {tag: tag, data: data});
>>>>>>> develop
            ReUI.show(this.domNode, transitionOptions);
        },
        /**
         * Expands the passed expression if it is a function.
         * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
         * @return {String} String expression.
         */
<<<<<<< HEAD
        expandExpression: function expandExpression(expression) {
=======
        expandExpression: function(expression) {
>>>>>>> develop
            if (typeof expression === 'function') {
                return expression.apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                return expression;
            }
        },
        /**
         * Called before the view is transitioned (slide animation complete) to.
         */
<<<<<<< HEAD
        beforeTransitionTo: function beforeTransitionTo() {
=======
        beforeTransitionTo: function() {
>>>>>>> develop
            this.onBeforeTransitionTo(this);
        },
        /**
         * Called before the view is transitioned (slide animation complete) away from.
         */
<<<<<<< HEAD
        beforeTransitionAway: function beforeTransitionAway() {
=======
        beforeTransitionAway: function() {
>>>>>>> develop
            this.onBeforeTransitionAway(this);
        },
        /**
         * Called after the view has been transitioned (slide animation complete) to.
         */
<<<<<<< HEAD
        transitionTo: function transitionTo() {
=======
        transitionTo: function() {
>>>>>>> develop
            if (this.refreshRequired) {
                this.refreshRequired = false;
                this.refresh();
            }

            this.onTransitionTo(this);
        },
        /**
         * Called after the view has been transitioned (slide animation complete) away from.
         */
<<<<<<< HEAD
        transitionAway: function transitionAway() {
=======
        transitionAway: function() {
>>>>>>> develop
            this.onTransitionAway(this);
        },
        /**
         * Returns the primary SDataService instance for the view.
         * @return {Object} The Sage.SData.Client.SDataService instance.
         */
<<<<<<< HEAD
        getService: function getService() {
            return this.app.getService(this.serviceName); /* if false is passed, the default service will be returned */
        },
        getConnection: function getConnection() {
            return this.getService();
        },
        getTag: function getTag() {},
=======
        getService: function() {
            return this.app.getService(this.serviceName); /* if false is passed, the default service will be returned */
        },
        getConnection: function() {
            return this.getService();
        },
        getTag: function() {
        },
>>>>>>> develop
        /**
         * Returns the options used for the View {@link #getContext getContext()}.
         * @return {Object} Options to be used for context.
         */
<<<<<<< HEAD
        getOptionsContext: function getOptionsContext() {
=======
        getOptionsContext: function() {
>>>>>>> develop
            if (this.options && this.options.negateHistory) {
                return { negateHistory: true };
            } else {
                return this.options;
            }
        },
        /**
         * Returns the context of the view which is a small summary of key properties.
         * @return {Object} Vital View properties.
         */
<<<<<<< HEAD
        getContext: function getContext() {
=======
        getContext: function() {
>>>>>>> develop
            // todo: should we track options?
            return {id: this.id, options: this.getOptionsContext()};
        },
        /**
         * Returns the defined security.
         * @param access
         */
<<<<<<< HEAD
        getSecurity: function getSecurity(access) {
=======
        getSecurity: function(access) {
>>>>>>> develop
            return this.security;
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.View', __class);
    module.exports = __class;
});

// todo: remove load entirely?
=======
    lang.setObject('Sage.Platform.Mobile.View', __class);
    return __class;
});

>>>>>>> develop
