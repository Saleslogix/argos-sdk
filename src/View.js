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
 */
define('argos/View', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dijit/_WidgetBase',
    './_ActionMixin',
    './_CustomizationMixin',
    './_Templated'
], function(
    declare,
    lang,
    on,
    dom,
    domClass,
    domAttr,
    _WidgetBase,
    _ActionMixin,
    _CustomizationMixin,
    _Templated
) {
    var __class = declare('argos.View', [_WidgetBase, _ActionMixin, _CustomizationMixin, _Templated], {
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
        widgetTemplate: new Simplate([
            '<ul id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow {%= $.cls %}">',
            '</ul>'
        ]),
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
         * May be used to specify the service name to use for data requests. Setting false will force the use of the default service.
         * @property {String/Boolean}
         */
        serviceName: false,
        connectionName: false,
        constructor: function() {
        },
        select: function(node) {
            domAttr.set(node, 'selected', 'true');
        },
        unselect: function(node) {
            domAttr.remove(node, 'selected');
        },
        /**
         * Called from {@link App#_viewTransitionTo Applications view transition handler} and returns
         * the fully customized toolbar layout.
         * @return {Object} The toolbar layout
         */
        getTools: function() {
            var tools = this._createCustomizedLayout(this.createToolLayout(), 'tools');
            this.onToolLayoutCreated(tools);
            return tools;
        },
        /**
         * Called after toolBar layout is created;
         *
         */
        onToolLayoutCreated:function(tools){
        },
        /**
         * Returns the tool layout that defines all toolbar items for the view
         * @return {Object} The toolbar layout
         */
        createToolLayout: function() {
            return this.tools || {};
        },
        /**
         * Called on loading of the application.
         */
        init: function() {
            this.startup();
            this.initConnects();
        },
        /**
         * Establishes this views connections to various events
         */
        initConnects: function() {
            var h;
            this._loadConnect = this.connect(this.domNode, 'onload', this._onLoad);
        },
        _onLoad: function(evt, el, o) {
            this.disconnect(this._loadConnect);

            this.load(evt, el, o);
        },
        /**
         * Called once the first time the view is about to be transitioned to.
         * @deprecated
         */
        load: function() {
            // todo: remove load entirely?
        },
        /**
         * Called in {@link #show show()} before ReUI is invoked.
         * @param {Object} options Navigation options passed from the previous view.
         * @return {Boolean} True indicates view needs to be refreshed.
         */
        refreshRequiredFor: function(options) {
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
        refresh: function() {
        },
        /**
         * The onBeforeTransitionAway event.
         * @param self
         */
        onBeforeTransitionAway: function(self) {
        },
        /**
         * The onBeforeTransitionTo event.
         * @param self
         */
        onBeforeTransitionTo: function(self) {
        },
        /**
         * The onTransitionAway event.
         * @param self
         */
        onTransitionAway: function(self) {
        },
        /**
         * The onTransitionTo event.
         * @param self
         */
        onTransitionTo: function(self) {
        },
        /**
         * The onActivate event.
         * @param self
         */
        onActivate: function(self) {
        },
        /**
         * The onShow event.
         * @param self
         */
        onShow: function(self) {
        },
        activate: function(tag, data) {
            // todo: use tag only?
            if (data && this.refreshRequiredFor(data.options))
            {
                this.refreshRequired = true;
            }

            this.options = (data && data.options) || this.options || {};

            if (this.options.title) {
                this.set('title', this.options.title);
            } else {
                this.set('title', (this.get('title') || this.titleText));
            }

            this.onActivate(this);
        },
        _getScrollerAttr: function() {
            return this.scrollerNode || this.domNode;
        },
        _transitionOptions: null,
        /**
         * Shows the view using iUI in order to transition to the new element.
         * @param {Object} options The navigation options passed from the previous view.
         * @param transitionOptions {Object} Optional transition object that is forwarded to ReUI.
         */
        show: function(options, transitionOptions) {
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
                this.set('title', (this.get('title') || this.titleText));
            }

            tag = this.getTag();
            data = this.getContext();

            transitionOptions = lang.mixin(transitionOptions || {}, {tag: tag, data: data});
            this._transitionOptions = transitionOptions;
            page(this.id);
            //this._open(transitionOptions); // TODO: invoke route change here, have the route change call _open
        },
        hashPrefix: '#!',
        currentHash: '',
        formatHashForPage: function(options) {
            var segments = options && options.tag
                ? [this.id].concat(options.tag)
                : [this.id];
            return this.hashPrefix + segments.join(';');
        },
        transitionComplete: function(page, o) {
            if (o.track !== false) {
                this.currentHash = this.formatHashForPage(o);

                if (o.trimmed !== true) {
                    App.context.history.push({
                        hash: this.currentHash,
                        page: this.id,
                        tag: o.tag,
                        data: o.data
                    });
                }
            }
        },
        transition: function(from, to, o) {
            function complete() {
                this.transitionComplete(to, o);
                domClass.remove(document.body, 'transition');

                App.startOrientationCheck();
                on.emit(from, 'aftertransition', {out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true});
                on.emit(to, 'aftertransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});

                if (o.complete) {
                    o.complete(from, to, o);
                }
            }

            App.stopOrientationCheck();
            domClass.add(document.body, 'transition');

            // dispatch an 'show' event to let the page be aware that is being show as the result of an external
            // event (i.e. browser back/forward navigation).
            if (o.external) {
                on.emit(to, 'show', {tag: o.tag, data: o.data, bubbles: true, cancelable: true});
            }

            on.emit(from, 'beforetransition', {out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true});
            on.emit(to, 'beforetransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});

            this.unselect(from);
            this.select(to);
            complete.apply(this);
        },
        /**
         * Available Options:
         *   horizontal: True if the transition is horizontal, False otherwise.
         *   reverse: True if the transition is a reverse transition (right/down), False otherwise.
         *   track: False if the transition should not be tracked in history, True otherwise.
         *   update: False if the transition should not update title and back button, True otherwise.
         *   scroll: False if the transition should not scroll to the top, True otherwise.
        */
        _open: function(o) {
            var count, hash, position, from, page;

            page = this.domNode;

            o = o || this._transitionOptions || {};

            if (!page) {
                return;
            }

            if (this.currentHash === this.formatHashForPage(o)) {
                return;
            }

            if (o.track !== false) {
                count = App.context.history.length;
                hash = this.formatHashForPage(o);
                position = -1;

                // do loop and trim
                for (position = count - 1; position >= 0; position--) {
                    if (App.context.history[position].hash == hash) {
                        break;
                    }
                }

                if ((position > -1) && (position === (count-2))) {
                     //Added check if history item is just one back.

                    App.context.history = App.context.history.splice(0, position + 1);

                    this.currentHash = hash;

                    // indicate that context.history has already been taken care of (i.e. nothing needs to be pushed).
                    o.trimmed = true;
                    // trim up the browser history
                    // if the requested hash does not equal the current location hash, trim up history.
                    // location hash will not match requested hash when show is called directly, but will match
                    // for detected location changes (i.e. the back button).
                    if (location.hash != hash) {
                        history.go(position - (count - 1));
                    }
                } else if (o.returnTo) {
                    if (typeof o.returnTo === 'function') {
                        for (position = count - 1; position >= 0; position--) {
                            if (o.returnTo(App.context.history[position])) {
                                break;
                            }
                        }
                    } else if (o.returnTo < 0) {
                        position = (count - 1) + o.returnTo;
                    }

                    if (position > -1) {
                        // we fix up the history, but do not flag as trimmed, since we do want the new view to be pushed.
                        App.context.history = App.context.history.splice(0, position + 1);

                        this.currentHash = App.context.history[App.context.history.length - 1] && App.context.history[App.context.history.length - 1].hash;

                        if (location.hash != hash) {
                            history.go(position - (count - 1));
                        }
                    }
                }
            }

            // don't auto-scroll by default if reversing
            if (o.reverse && typeof o.scroll === 'undefined') {
                o.scroll = !o.reverse;
            }

            on.emit(page, 'load', {bubbles: false, cancelable: true});

            from = App.getCurrentPage();

            if (from) {
                on.emit(from, 'blur', {bubbles: false, cancelable: true});
            }

            App.setCurrentPage(page);

            on.emit(page, 'focus', {bubbles: false, cancelable: true});

            if (from && domAttr.get(page, 'selected') !== 'true') {
                if (o.reverse) {
                    on.emit(page, 'unload', {bubbles: false, cancelable: true});
                }

                window.setTimeout(this.transition.bind(this), App.checkOrientationTime, from, page, o);
            } else {
                on.emit(page, 'beforetransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});

                this.select(page);

                this.transitionComplete(page, o);

                on.emit(page, 'aftertransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});
            }
        },
        /**
         * Expands the passed expression if it is a function.
         * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
         * @return {String} String expression.
         */
        expandExpression: function(expression) {
            if (typeof expression === 'function')
                return expression.apply(this, Array.prototype.slice.call(arguments, 1));
            else
                return expression;
        },
        /**
         * Called before the view is transitioned (slide animation complete) to.
         */
        beforeTransitionTo: function() {
            this.onBeforeTransitionTo(this);
        },
        /**
         * Called before the view is transitioned (slide animation complete) away from.
         */
        beforeTransitionAway: function() {
            this.onBeforeTransitionAway(this);
        },
        /**
         * Called after the view has been transitioned (slide animation complete) to.
         */
        transitionTo: function() {
            if (this.refreshRequired)
            {
                this.refreshRequired = false;
                this.refresh();
            }

            this.onTransitionTo(this);
        },
        /**
         * Called after the view has been transitioned (slide animation complete) away from.
         */
        transitionAway: function() {
            this.onTransitionAway(this);
        },
        /**
         * Returns the primary SDataService instance for the view.
         * @return {Object} The Sage.SData.Client.SDataService instance.
         */
        getService: function() {
            return App.getService(this.serviceName); /* if false is passed, the default service will be returned */
        },
        getConnection: function() {
            return this.getService();
        },
        getTag: function() {
        },
        /**
         * Returns the options used for the View {@link #getContext getContext()}.
         * @return {Object} Options to be used for context.
         */
        getOptionsContext: function() {
            if (this.options && this.options.negateHistory)
                return { negateHistory: true };
            else
                return this.options;
        },
        /**
         * Returns the context of the view which is a small summary of key properties.
         * @return {Object} Vital View properties.
         */
        getContext: function() {
            // todo: should we track options?
            return {id: this.id, options: this.getOptionsContext()};
        },
        /**
         * Returns the defined security.
         * @param access
         */
        getSecurity: function(access) {
            return this.security;
        },
        route: ':viewId',
        routeLoad: function(ctx, next) {
            console.log('View::routeLoad');
            console.dir(ctx);
            ctx.view = window.App.getView(ctx.params.viewId);
            next();
        },
        routeShow: function(ctx, next) {
            console.log('View::routeShow');
            console.dir(ctx);
            if (ctx.view) {
                ctx.view._open();
            }
        }
    });

    lang.setObject('Sage.Platform.Mobile.View', __class);
    return __class;
});

