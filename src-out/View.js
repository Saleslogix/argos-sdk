define('argos/View', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_WidgetBase', './_ActionMixin', './_CustomizationMixin', './_Templated', './Models/Adapter', './I18n', './actions/index'], function (module, exports, _declare, _lang, _WidgetBase2, _ActionMixin2, _CustomizationMixin2, _Templated2, _Adapter, _I18n, _index) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _Adapter2 = _interopRequireDefault(_Adapter);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('view');

  /**
   * @class argos.View
   * @classdesc View is the root Class for all views and incorporates all the base features,
   * events, and hooks needed to successfully render, hide, show, and transition.
   *
   * All Views are dijit Widgets, namely utilizing its: widgetTemplate, connections, and attributeMap
   * @mixins argos._ActionMixin
   * @mixins argos._CustomizationMixin
   * @mixins argos._Templated
   */
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

  var __class = (0, _declare2.default)('argos.View', [_WidgetBase3.default, _ActionMixin3.default, _CustomizationMixin3.default, _Templated3.default], /** @lends argos.View# */{
    /**
     * This map provides quick access to HTML properties, most notably the selected property of the container
     */
    attributeMap: {
      title: {
        node: 'domNode',
        type: 'attribute',
        attribute: 'data-title'
      },
      selected: {
        node: 'domNode',
        type: 'attribute',
        attribute: 'selected'
      }
    },
    /**
     * The widgetTemplate is a Simplate that will be used as the main HTML markup of the View.
     * @property {Simplate}
     */
    widgetTemplate: new Simplate(['<ul id="{%= $.id %}" data-title="{%= $.titleText %}" class="overthrow {%= $.cls %}">', '</ul>']),
    _loadConnect: null,
    /**
     * The id is used to uniquely define a view and is used in navigating, history and for HTML markup.
     * @property {String}
     */
    id: 'generic_view',
    /**
     * The titleText string will be applied to the top toolbar during {@link #show show}.
     */
    titleText: resource.titleText,
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
     * Registered model name to use.
     */
    modelName: '',

    /**
     * View type (detail, edit, list, etc)
     */
    viewType: 'view',
    /**
     * May be used to specify the service name to use for data requests. Setting false will force the use of the default service.
     * @property {String/Boolean}
     */
    serviceName: false,
    connectionName: false,
    connectionState: null,
    enableOfflineSupport: false,
    previousState: null,
    enableCustomizations: true,

    /**
     * @property {Object}
     * Localized error messages. One general error message, and messages by HTTP status code.
     */
    errorText: {
      general: resource.general,
      status: {}
    },
    /**
     * @property {Object}
     * Http Error Status codes. See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
     */
    HTTP_STATUS: {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTH_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      REQUEST_ENTITY_TOO_LARGE: 413,
      REQUEST_URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      REQUESTED_RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417
    },
    /**
     * @property {Array} errorHandlers
     * Array of objects that should contain a name string property, test function, and handle function.
     *
     */
    errorHandlers: null,
    constructor: function constructor(options) {
      this.app = options && options.app || window.App;
    },
    startup: function startup() {
      this.inherited(startup, arguments);
    },
    select: function select(node) {
      $(node).attr('selected', 'true');
    },
    unselect: function unselect(node) {
      $(node).removeAttr('selected');
    },
    /**
     * Called from {@link App#_viewTransitionTo Applications view transition handler} and returns
     * the fully customized toolbar layout.
     * @return {Object} The toolbar layout
     */
    getTools: function getTools() {
      var tools = this._createCustomizedLayout(this.createToolLayout(), 'tools');
      this.onToolLayoutCreated(tools);
      return tools;
    },
    /**
     * Called after toolBar layout is created;
     *
     */
    onToolLayoutCreated: function onToolLayoutCreated() /* tools*/{},
    /**
     * Returns the tool layout that defines all toolbar items for the view
     * @return {Object} The toolbar layout
     */
    createToolLayout: function createToolLayout() {
      return this.tools || {};
    },
    /**
     * Called on loading of the application.
     */
    init: function init(store) {
      this.initStore(store);
      this.startup();
      this.initConnects();
      this.initModel();
    },
    initStore: function initStore(store) {
      this.appStore = store;
      this.appStore.subscribe(this._onStateChange.bind(this));
    },
    _updateConnectionState: function _updateConnectionState(state) {
      if (this.connectionState === state) {
        return;
      }

      this.initModel();

      var oldState = this.connectionState;
      this.connectionState = state;
      if (oldState !== null) {
        this.onConnectionStateChange(state);
      }
    },
    onConnectionStateChange: function onConnectionStateChange(state) {// eslint-disable-line
    },
    _onStateChange: function _onStateChange() {
      var state = this.appStore.getState();
      this._updateConnectionState(state.sdk.online);
      this.onStateChange(state);
      this.previousState = state;
    },
    onStateChange: function onStateChange(val) {}, // eslint-disable-line
    /**
     * Initializes the model instance that is returned with the current view.
     */
    initModel: function initModel() {
      var model = this.getModel();
      if (model) {
        this._model = model;
        this._model.init();
      }
    },
    /**
     * Returns a new instance of a model for the view.
     */
    getModel: function getModel() {
      var model = _Adapter2.default.getModel(this.modelName);
      return model;
    },
    /**
     * Establishes this views connections to various events
     */
    initConnects: function initConnects() {
      this._loadConnect = this.connect(this.domNode, 'onload', this._onLoad);
    },
    _onLoad: function _onLoad(evt, el, o) {
      this.disconnect(this._loadConnect);
      this.load(evt, el, o);
    },
    /**
     * Called once the first time the view is about to be transitioned to.
     * @deprecated
     */
    load: function load() {
      // todo: remove load entirely?
    },
    /**
     * Called in {@link #show show()} before route is invoked.
     * @param {Object} options Navigation options passed from the previous view.
     * @return {Boolean} True indicates view needs to be refreshed.
     */
    refreshRequiredFor: function refreshRequiredFor(options) {
      if (this.options) {
        return !!options; // if options provided, then refresh
      }

      return true;
    },
    /**
     * @return {Array} Returns an array of error handlers
     */
    createErrorHandlers: function createErrorHandlers() {
      return this.errorHandlers || [];
    },
    /**
     * Starts matching and executing errorHandlers.
     * @param {Error} error Error to pass to the errorHandlers
     */
    handleError: function handleError(error) {
      var _this = this;

      if (!error) {
        return;
      }

      function noop() {}

      var matches = this.errorHandlers.filter(function (handler) {
        return handler.test && handler.test.call(_this, error);
      });

      var len = matches.length;

      var getNext = function getNext(index) {
        // next() chain has ended, return a no-op so calling next() in the last chain won't error
        if (index === len) {
          return noop;
        }

        // Return a closure with index and matches captured.
        // The handle function can call its "next" param to continue the chain.
        return function next() {
          var nextHandler = matches[index];
          var nextFn = nextHandler && nextHandler.handle;

          nextFn.call(this, error, getNext.call(this, index + 1));
        }.bind(this);
      }.bind(this);

      if (len > 0 && matches[0].handle) {
        // Start the handle chain, the handle can call next() to continue the iteration
        matches[0].handle.call(this, error, getNext.call(this, 1));
      }
    },
    /**
     * Gets the general error message, or the error message for the status code.
     */
    getErrorMessage: function getErrorMessage(error) {
      var message = this.errorText.general;

      if (error) {
        message = this.errorText.status[error.status] || this.errorText.general;
      }

      return message;
    },
    /**
     * Should refresh the view, such as but not limited to:
     * Emptying nodes, requesting data, rendering new content
     */
    refresh: function refresh() {},
    /**
     * The onBeforeTransitionAway event.
     * @param self
     */
    onBeforeTransitionAway: function onBeforeTransitionAway() /* self*/{},
    /**
     * The onBeforeTransitionTo event.
     * @param self
     */
    onBeforeTransitionTo: function onBeforeTransitionTo() /* self*/{},
    /**
     * The onTransitionAway event.
     * @param self
     */
    onTransitionAway: function onTransitionAway() /* self*/{},
    /**
     * The onTransitionTo event.
     * @param self
     */
    onTransitionTo: function onTransitionTo() /* self*/{},
    /**
     * The onActivate event.
     * @param self
     */
    onActivate: function onActivate() /* self*/{},
    /**
     * The onShow event.
     * @param self
     */
    onShow: function onShow() /* self*/{},
    activate: function activate(tag, data) {
      // todo: use tag only?
      if (data && this.refreshRequiredFor(data.options)) {
        this.refreshRequired = true;
      }

      this.options = data && data.options || this.options || {};

      if (this.options.title) {
        this.set('title', this.options.title);
      } else {
        this.set('title', this.titleText);
      }

      this.onActivate(this);
    },
    _getScrollerAttr: function _getScrollerAttr() {
      return this.scrollerNode || this.domNode;
    },
    _transitionOptions: null,
    /**
     * Shows the view using pagejs in order to transition to the new element.
     * @param {Object} options The navigation options passed from the previous view.
     * @param transitionOptions {Object} Optional transition object that is forwarded to open.
     */
    show: function show(options, transitionOptions) {
      this.errorHandlers = this._createCustomizedLayout(this.createErrorHandlers(), 'errorHandlers');

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
        this.set('title', this.titleText);
      }

      var tag = this.getTag();
      var data = this.getContext();

      var to = _lang2.default.mixin(transitionOptions || {}, {
        tag: tag,
        data: data
      });
      this._transitionOptions = to;
      page(this.buildRoute());
    },
    hashPrefix: '#!',
    currentHash: '',
    transitionComplete: function transitionComplete(_page, options) {
      if (options.track !== false) {
        this.currentHash = location.hash;

        if (options.trimmed !== true) {
          var data = {
            hash: this.currentHash,
            page: this.id,
            tag: options.tag,
            data: options.data
          };
          App.context.history.push(data);
          this.appStore.dispatch((0, _index.insertHistory)(data));
        }
      }
    },
    transition: function transition(from, to, options) {
      function complete() {
        this.transitionComplete(to, options);
        $('body').removeClass('transition');

        $(from).trigger({
          out: true,
          tag: options.tag,
          data: options.data,
          bubbles: true,
          cancelable: true,
          type: 'aftertransition'
        });
        $(to).trigger({
          out: false,
          tag: options.tag,
          data: options.data,
          bubbles: true,
          cancelable: true,
          type: 'aftertransition'
        });

        if (options.complete) {
          options.complete(from, to, options);
        }
      }

      $('body').addClass('transition');

      // dispatch an 'show' event to let the page be aware that is being show as the result of an external
      // event (i.e. browser back/forward navigation).
      if (options.external) {
        $(to).trigger({
          tag: options.tag,
          data: options.data,
          bubbles: true,
          cancelable: true,
          type: 'show'
        });
      }

      $(from).trigger({
        out: true,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
        type: 'beforetransition'
      });

      $(to).trigger({
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
        type: 'beforetransition'
      });

      this.unselect(from);
      this.select(to);
      complete.apply(this);
    },
    setPrimaryTitle: function setPrimaryTitle() {
      App.setPrimaryTitle(this.get('title'));
    },
    /**
    * Available Options:
    *   horizontal: True if the transition is horizontal, False otherwise.
    *   reverse: True if the transition is a reverse transition (right/down), False otherwise.
    *   track: False if the transition should not be tracked in history, True otherwise.
    *   update: False if the transition should not update title and back button, True otherwise.
    *   scroll: False if the transition should not scroll to the top, True otherwise.
    */
    open: function open() {
      var p = this.domNode;
      var options = this._transitionOptions || {};

      if (!p) {
        return;
      }

      this.setPrimaryTitle();

      if (options.track !== false) {
        var count = App.context.history.length;
        var position = count - 1;

        if (options.returnTo) {
          if (typeof options.returnTo === 'function') {
            for (position = count - 1; position >= 0; position--) {
              if (options.returnTo(App.context.history[position])) {
                break;
              }
            }
          } else if (options.returnTo < 0) {
            position = count - 1 + options.returnTo;
          }

          if (position > -1) {
            // we fix up the history, but do not flag as trimmed, since we do want the new view to be pushed.
            App.context.history = App.context.history.splice(0, position + 1);

            this.currentHash = App.context.history[App.context.history.length - 1] && App.context.history[App.context.history.length - 1].hash;
          }

          options.returnTo = null;
        }
      }

      // don't auto-scroll by default if reversing
      if (options.reverse && typeof options.scroll === 'undefined') {
        options.scroll = !options.reverse;
      }

      $(p).trigger({
        bubbles: false,
        cancelable: true,
        type: 'load'
      });

      var from = App.getCurrentPage();

      if (from) {
        $(from).trigger({
          bubbles: false,
          cancelable: true,
          type: 'blur'
        });
      }

      App.setCurrentPage(p);

      $(p).trigger({
        bubbles: false,
        cancelable: true,
        type: 'focus'
      });

      if (from && $(p).attr('selected') !== 'true') {
        if (options.reverse) {
          $(p).trigger({
            bubbles: false,
            cancelable: true,
            type: 'unload'
          });
        }

        window.setTimeout(this.transition.bind(this), App.checkOrientationTime, from, p, options);
      } else {
        $(p).trigger({
          out: false,
          tag: options.tag,
          data: options.data,
          bubbles: true,
          cancelable: true,
          type: 'beforetransition'
        });

        this.select(p);

        this.transitionComplete(p, options);

        $(p).trigger({
          out: false,
          tag: options.tag,
          data: options.data,
          bubbles: true,
          cancelable: true,
          type: 'aftertransition'
        });
      }
    },
    /**
     * Expands the passed expression if it is a function.
     * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
     * @return {String} String expression.
     */
    expandExpression: function expandExpression(expression) {
      if (typeof expression === 'function') {
        return expression.apply(this, Array.prototype.slice.call(arguments, 1));
      }

      return expression;
    },
    /**
     * Called before the view is transitioned (slide animation complete) to.
     */
    beforeTransitionTo: function beforeTransitionTo() {
      this.onBeforeTransitionTo(this);
    },
    /**
     * Called before the view is transitioned (slide animation complete) away from.
     */
    beforeTransitionAway: function beforeTransitionAway() {
      this.onBeforeTransitionAway(this);
    },
    /**
     * Called after the view has been transitioned (slide animation complete) to.
     */
    transitionTo: function transitionTo() {
      if (this.refreshRequired) {
        this.refreshRequired = false;
        this.isRefreshing = false;
        this.refresh();
      }

      this.onTransitionTo(this);
    },
    /**
     * Called after the view has been transitioned (slide animation complete) away from.
     */
    transitionAway: function transitionAway() {
      this.onTransitionAway(this);
    },
    /**
     * Returns the primary SDataService instance for the view.
     * @return {Object} The Sage.SData.Client.SDataService instance.
     */
    getService: function getService() {
      return this.app.getService(this.serviceName); /* if false is passed, the default service will be returned */
    },
    getConnection: function getConnection() {
      return this.getService();
    },
    getTag: function getTag() {},
    /**
     * Returns the options used for the View {@link #getContext getContext()}.
     * @return {Object} Options to be used for context.
     */
    getOptionsContext: function getOptionsContext() {
      if (this.options && this.options.negateHistory) {
        return {
          negateHistory: true
        };
      }
      return this.options;
    },
    /**
     * Returns the context of the view which is a small summary of key properties.
     * @return {Object} Vital View properties.
     */
    getContext: function getContext() {
      // todo: should we track options?
      return {
        id: this.id,
        options: this.getOptionsContext()
      };
    },
    /**
     * Returns the defined security.
     * @param access
     */
    getSecurity: function getSecurity() /* access*/{
      return this.security;
    },
    /**
    * @property {String}
    * Route passed into the router. RegEx expressions are also accepted.
    */
    route: '',
    /**
    * Gets the route associated with this view. Returns this.id if no route is defined.
    */
    getRoute: function getRoute() {
      if (typeof this.route === 'string' && this.route.length > 0 || this.route instanceof RegExp) {
        return this.route;
      }

      return this.id;
    },
    /**
    * Show method calls this to build a route that it can navigate to. If you add a custom route,
    * this should change to build a route that can match that.
    * @returns {String}
    */
    buildRoute: function buildRoute() {
      return this.id;
    },
    /**
    * Fires first when a route is triggered. Any pre-loading should happen here.
    * @param {Object} ctx
    * @param {Function} next
    */
    routeLoad: function routeLoad(ctx, next) {
      next();
    },
    /**
    * Fires second when a route is triggered. Any pre-loading should happen here.
    * @param {Object} ctx
    * @param {Function} next
    */
    routeShow: function routeShow(ctx, next) {
      // eslint-disable-line
      this.open();
    },
    /*
    * Required for binding to ScrollContainer which utilizes iScroll that requires to be refreshed when the
    * content (therefor scrollable area) changes.
    */
    onContentChange: function onContentChange() {},
    /**
     * Returns true if view is disabled.
     * @return {Boolean}.
     */
    isDisabled: function isDisabled() {
      return false;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WaWV3LmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsImF0dHJpYnV0ZU1hcCIsInRpdGxlIiwibm9kZSIsInR5cGUiLCJhdHRyaWJ1dGUiLCJzZWxlY3RlZCIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJfbG9hZENvbm5lY3QiLCJpZCIsInRpdGxlVGV4dCIsInRvb2xzIiwic2VjdXJpdHkiLCJhcHAiLCJtb2RlbE5hbWUiLCJ2aWV3VHlwZSIsInNlcnZpY2VOYW1lIiwiY29ubmVjdGlvbk5hbWUiLCJjb25uZWN0aW9uU3RhdGUiLCJlbmFibGVPZmZsaW5lU3VwcG9ydCIsInByZXZpb3VzU3RhdGUiLCJlbmFibGVDdXN0b21pemF0aW9ucyIsImVycm9yVGV4dCIsImdlbmVyYWwiLCJzdGF0dXMiLCJIVFRQX1NUQVRVUyIsIkJBRF9SRVFVRVNUIiwiVU5BVVRIT1JJWkVEIiwiUEFZTUVOVF9SRVFVSVJFRCIsIkZPUkJJRERFTiIsIk5PVF9GT1VORCIsIk1FVEhPRF9OT1RfQUxMT1dFRCIsIk5PVF9BQ0NFUFRBQkxFIiwiUFJPWFlfQVVUSF9SRVFVSVJFRCIsIlJFUVVFU1RfVElNRU9VVCIsIkNPTkZMSUNUIiwiR09ORSIsIkxFTkdUSF9SRVFVSVJFRCIsIlBSRUNPTkRJVElPTl9GQUlMRUQiLCJSRVFVRVNUX0VOVElUWV9UT09fTEFSR0UiLCJSRVFVRVNUX1VSSV9UT09fTE9ORyIsIlVOU1VQUE9SVEVEX01FRElBX1RZUEUiLCJSRVFVRVNURURfUkFOR0VfTk9UX1NBVElTRklBQkxFIiwiRVhQRUNUQVRJT05fRkFJTEVEIiwiZXJyb3JIYW5kbGVycyIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIndpbmRvdyIsIkFwcCIsInN0YXJ0dXAiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJzZWxlY3QiLCIkIiwiYXR0ciIsInVuc2VsZWN0IiwicmVtb3ZlQXR0ciIsImdldFRvb2xzIiwiX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQiLCJjcmVhdGVUb29sTGF5b3V0Iiwib25Ub29sTGF5b3V0Q3JlYXRlZCIsImluaXQiLCJzdG9yZSIsImluaXRTdG9yZSIsImluaXRDb25uZWN0cyIsImluaXRNb2RlbCIsImFwcFN0b3JlIiwic3Vic2NyaWJlIiwiX29uU3RhdGVDaGFuZ2UiLCJiaW5kIiwiX3VwZGF0ZUNvbm5lY3Rpb25TdGF0ZSIsInN0YXRlIiwib2xkU3RhdGUiLCJvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSIsImdldFN0YXRlIiwic2RrIiwib25saW5lIiwib25TdGF0ZUNoYW5nZSIsInZhbCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJfbW9kZWwiLCJjb25uZWN0IiwiZG9tTm9kZSIsIl9vbkxvYWQiLCJldnQiLCJlbCIsIm8iLCJkaXNjb25uZWN0IiwibG9hZCIsInJlZnJlc2hSZXF1aXJlZEZvciIsImNyZWF0ZUVycm9ySGFuZGxlcnMiLCJoYW5kbGVFcnJvciIsImVycm9yIiwibm9vcCIsIm1hdGNoZXMiLCJmaWx0ZXIiLCJoYW5kbGVyIiwidGVzdCIsImNhbGwiLCJsZW4iLCJsZW5ndGgiLCJnZXROZXh0IiwiaW5kZXgiLCJuZXh0IiwibmV4dEhhbmRsZXIiLCJuZXh0Rm4iLCJoYW5kbGUiLCJnZXRFcnJvck1lc3NhZ2UiLCJtZXNzYWdlIiwicmVmcmVzaCIsIm9uQmVmb3JlVHJhbnNpdGlvbkF3YXkiLCJvbkJlZm9yZVRyYW5zaXRpb25UbyIsIm9uVHJhbnNpdGlvbkF3YXkiLCJvblRyYW5zaXRpb25UbyIsIm9uQWN0aXZhdGUiLCJvblNob3ciLCJhY3RpdmF0ZSIsInRhZyIsImRhdGEiLCJyZWZyZXNoUmVxdWlyZWQiLCJzZXQiLCJfZ2V0U2Nyb2xsZXJBdHRyIiwic2Nyb2xsZXJOb2RlIiwiX3RyYW5zaXRpb25PcHRpb25zIiwic2hvdyIsInRyYW5zaXRpb25PcHRpb25zIiwiZ2V0VGFnIiwiZ2V0Q29udGV4dCIsInRvIiwibWl4aW4iLCJwYWdlIiwiYnVpbGRSb3V0ZSIsImhhc2hQcmVmaXgiLCJjdXJyZW50SGFzaCIsInRyYW5zaXRpb25Db21wbGV0ZSIsIl9wYWdlIiwidHJhY2siLCJsb2NhdGlvbiIsImhhc2giLCJ0cmltbWVkIiwiY29udGV4dCIsImhpc3RvcnkiLCJwdXNoIiwiZGlzcGF0Y2giLCJ0cmFuc2l0aW9uIiwiZnJvbSIsImNvbXBsZXRlIiwicmVtb3ZlQ2xhc3MiLCJ0cmlnZ2VyIiwib3V0IiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJhZGRDbGFzcyIsImV4dGVybmFsIiwiYXBwbHkiLCJzZXRQcmltYXJ5VGl0bGUiLCJnZXQiLCJvcGVuIiwicCIsImNvdW50IiwicG9zaXRpb24iLCJyZXR1cm5UbyIsInNwbGljZSIsInJldmVyc2UiLCJzY3JvbGwiLCJnZXRDdXJyZW50UGFnZSIsInNldEN1cnJlbnRQYWdlIiwic2V0VGltZW91dCIsImNoZWNrT3JpZW50YXRpb25UaW1lIiwiZXhwYW5kRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiYmVmb3JlVHJhbnNpdGlvblRvIiwiYmVmb3JlVHJhbnNpdGlvbkF3YXkiLCJ0cmFuc2l0aW9uVG8iLCJpc1JlZnJlc2hpbmciLCJ0cmFuc2l0aW9uQXdheSIsImdldFNlcnZpY2UiLCJnZXRDb25uZWN0aW9uIiwiZ2V0T3B0aW9uc0NvbnRleHQiLCJuZWdhdGVIaXN0b3J5IiwiZ2V0U2VjdXJpdHkiLCJyb3V0ZSIsImdldFJvdXRlIiwiUmVnRXhwIiwicm91dGVMb2FkIiwiY3R4Iiwicm91dGVTaG93Iiwib25Db250ZW50Q2hhbmdlIiwiaXNEaXNhYmxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLE1BQU1BLFdBQVcsb0JBQVksTUFBWixDQUFqQjs7QUFFQTs7Ozs7Ozs7OztBQTVCQTs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBLE1BQU1DLFVBQVUsdUJBQVEsWUFBUixFQUFzQixnR0FBdEIsRUFBb0YseUJBQXlCO0FBQzNIOzs7QUFHQUMsa0JBQWM7QUFDWkMsYUFBTztBQUNMQyxj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bkIwSDtBQXluQjNIOzs7O0FBSUFFLGlCQUFhLFNBQVNBLFdBQVQsR0FBcUIsV0FBYTtBQUM3QyxhQUFPLEtBQUs1SyxRQUFaO0FBQ0QsS0EvbkIwSDtBQWdvQjNIOzs7O0FBSUE2SyxXQUFPLEVBcG9Cb0g7QUFxb0IzSDs7O0FBR0FDLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QixVQUFLLE9BQU8sS0FBS0QsS0FBWixLQUFzQixRQUF0QixJQUFrQyxLQUFLQSxLQUFMLENBQVdwRixNQUFYLEdBQW9CLENBQXZELElBQTZELEtBQUtvRixLQUFMLFlBQXNCRSxNQUF2RixFQUErRjtBQUM3RixlQUFPLEtBQUtGLEtBQVo7QUFDRDs7QUFFRCxhQUFPLEtBQUtoTCxFQUFaO0FBQ0QsS0E5b0IwSDtBQStvQjNIOzs7OztBQUtBMkgsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxhQUFPLEtBQUszSCxFQUFaO0FBQ0QsS0F0cEIwSDtBQXVwQjNIOzs7OztBQUtBbUwsZUFBVyxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF3QnJGLElBQXhCLEVBQThCO0FBQ3ZDQTtBQUNELEtBOXBCMEg7QUErcEIzSDs7Ozs7QUFLQXNGLGVBQVcsU0FBU0EsU0FBVCxDQUFtQkQsR0FBbkIsRUFBd0JyRixJQUF4QixFQUE4QjtBQUFFO0FBQ3pDLFdBQUtzRCxJQUFMO0FBQ0QsS0F0cUIwSDtBQXVxQjNIOzs7O0FBSUFpQyxxQkFBaUIsU0FBU0EsZUFBVCxHQUEyQixDQUMzQyxDQTVxQjBIO0FBNnFCM0g7Ozs7QUFJQUMsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxhQUFPLEtBQVA7QUFDRDtBQW5yQjBILEdBQTdHLENBQWhCOztvQkFzckJlak0sTyIsImZpbGUiOiJWaWV3LmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX0FjdGlvbk1peGluIGZyb20gJy4vX0FjdGlvbk1peGluJztcclxuaW1wb3J0IF9DdXN0b21pemF0aW9uTWl4aW4gZnJvbSAnLi9fQ3VzdG9taXphdGlvbk1peGluJztcclxuaW1wb3J0IF9UZW1wbGF0ZWQgZnJvbSAnLi9fVGVtcGxhdGVkJztcclxuaW1wb3J0IEFkYXB0ZXIgZnJvbSAnLi9Nb2RlbHMvQWRhcHRlcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5pbXBvcnQgeyBpbnNlcnRIaXN0b3J5IH0gZnJvbSAnLi9hY3Rpb25zL2luZGV4JztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCd2aWV3Jyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlZpZXdcclxuICogQGNsYXNzZGVzYyBWaWV3IGlzIHRoZSByb290IENsYXNzIGZvciBhbGwgdmlld3MgYW5kIGluY29ycG9yYXRlcyBhbGwgdGhlIGJhc2UgZmVhdHVyZXMsXHJcbiAqIGV2ZW50cywgYW5kIGhvb2tzIG5lZWRlZCB0byBzdWNjZXNzZnVsbHkgcmVuZGVyLCBoaWRlLCBzaG93LCBhbmQgdHJhbnNpdGlvbi5cclxuICpcclxuICogQWxsIFZpZXdzIGFyZSBkaWppdCBXaWRnZXRzLCBuYW1lbHkgdXRpbGl6aW5nIGl0czogd2lkZ2V0VGVtcGxhdGUsIGNvbm5lY3Rpb25zLCBhbmQgYXR0cmlidXRlTWFwXHJcbiAqIEBtaXhpbnMgYXJnb3MuX0FjdGlvbk1peGluXHJcbiAqIEBtaXhpbnMgYXJnb3MuX0N1c3RvbWl6YXRpb25NaXhpblxyXG4gKiBAbWl4aW5zIGFyZ29zLl9UZW1wbGF0ZWRcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5WaWV3JywgW19XaWRnZXRCYXNlLCBfQWN0aW9uTWl4aW4sIF9DdXN0b21pemF0aW9uTWl4aW4sIF9UZW1wbGF0ZWRdLCAvKiogQGxlbmRzIGFyZ29zLlZpZXcjICove1xyXG4gIC8qKlxyXG4gICAqIFRoaXMgbWFwIHByb3ZpZGVzIHF1aWNrIGFjY2VzcyB0byBIVE1MIHByb3BlcnRpZXMsIG1vc3Qgbm90YWJseSB0aGUgc2VsZWN0ZWQgcHJvcGVydHkgb2YgdGhlIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgdGl0bGU6IHtcclxuICAgICAgbm9kZTogJ2RvbU5vZGUnLFxyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgYXR0cmlidXRlOiAnZGF0YS10aXRsZScsXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWQ6IHtcclxuICAgICAgbm9kZTogJ2RvbU5vZGUnLFxyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgYXR0cmlidXRlOiAnc2VsZWN0ZWQnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSB3aWRnZXRUZW1wbGF0ZSBpcyBhIFNpbXBsYXRlIHRoYXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBtYWluIEhUTUwgbWFya3VwIG9mIHRoZSBWaWV3LlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHVsIGlkPVwieyU9ICQuaWQgJX1cIiBkYXRhLXRpdGxlPVwieyU9ICQudGl0bGVUZXh0ICV9XCIgY2xhc3M9XCJvdmVydGhyb3cgeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8L3VsPicsXHJcbiAgXSksXHJcbiAgX2xvYWRDb25uZWN0OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIFRoZSBpZCBpcyB1c2VkIHRvIHVuaXF1ZWx5IGRlZmluZSBhIHZpZXcgYW5kIGlzIHVzZWQgaW4gbmF2aWdhdGluZywgaGlzdG9yeSBhbmQgZm9yIEhUTUwgbWFya3VwLlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGlkOiAnZ2VuZXJpY192aWV3JyxcclxuICAvKipcclxuICAgKiBUaGUgdGl0bGVUZXh0IHN0cmluZyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHRvcCB0b29sYmFyIGR1cmluZyB7QGxpbmsgI3Nob3cgc2hvd30uXHJcbiAgICovXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgLyoqXHJcbiAgICogVGhpcyB2aWV3cyB0b29sYmFyIGxheW91dCB0aGF0IGRlZmluZXMgYWxsIHRvb2xiYXIgaXRlbXMgaW4gYWxsIHRvb2xiYXJzLlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHRvb2xzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIE1heSBiZSBkZWZpbmVkIGFsb25nIHdpdGgge0BsaW5rIEFwcCNoYXNBY2Nlc3NUbyBBcHBsaWNhdGlvbiBoYXNBY2Nlc3NUb30gdG8gaW5jb3Jwb3JhdGUgVmlldyByZXN0cmljdGlvbnMuXHJcbiAgICovXHJcbiAgc2VjdXJpdHk6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhIEFwcCBvYmplY3RcclxuICAgKi9cclxuICBhcHA6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZ2lzdGVyZWQgbW9kZWwgbmFtZSB0byB1c2UuXHJcbiAgICovXHJcbiAgbW9kZWxOYW1lOiAnJyxcclxuXHJcbiAgLyoqXHJcbiAgICogVmlldyB0eXBlIChkZXRhaWwsIGVkaXQsIGxpc3QsIGV0YylcclxuICAgKi9cclxuICB2aWV3VHlwZTogJ3ZpZXcnLFxyXG4gIC8qKlxyXG4gICAqIE1heSBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIHNlcnZpY2UgbmFtZSB0byB1c2UgZm9yIGRhdGEgcmVxdWVzdHMuIFNldHRpbmcgZmFsc2Ugd2lsbCBmb3JjZSB0aGUgdXNlIG9mIHRoZSBkZWZhdWx0IHNlcnZpY2UuXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmcvQm9vbGVhbn1cclxuICAgKi9cclxuICBzZXJ2aWNlTmFtZTogZmFsc2UsXHJcbiAgY29ubmVjdGlvbk5hbWU6IGZhbHNlLFxyXG4gIGNvbm5lY3Rpb25TdGF0ZTogbnVsbCxcclxuICBlbmFibGVPZmZsaW5lU3VwcG9ydDogZmFsc2UsXHJcbiAgcHJldmlvdXNTdGF0ZTogbnVsbCxcclxuICBlbmFibGVDdXN0b21pemF0aW9uczogdHJ1ZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogTG9jYWxpemVkIGVycm9yIG1lc3NhZ2VzLiBPbmUgZ2VuZXJhbCBlcnJvciBtZXNzYWdlLCBhbmQgbWVzc2FnZXMgYnkgSFRUUCBzdGF0dXMgY29kZS5cclxuICAgKi9cclxuICBlcnJvclRleHQ6IHtcclxuICAgIGdlbmVyYWw6IHJlc291cmNlLmdlbmVyYWwsXHJcbiAgICBzdGF0dXM6IHt9LFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogSHR0cCBFcnJvciBTdGF0dXMgY29kZXMuIFNlZSBodHRwOi8vd3d3LnczLm9yZy9Qcm90b2NvbHMvcmZjMjYxNi9yZmMyNjE2LXNlYzEwLmh0bWxcclxuICAgKi9cclxuICBIVFRQX1NUQVRVUzoge1xyXG4gICAgQkFEX1JFUVVFU1Q6IDQwMCxcclxuICAgIFVOQVVUSE9SSVpFRDogNDAxLFxyXG4gICAgUEFZTUVOVF9SRVFVSVJFRDogNDAyLFxyXG4gICAgRk9SQklEREVOOiA0MDMsXHJcbiAgICBOT1RfRk9VTkQ6IDQwNCxcclxuICAgIE1FVEhPRF9OT1RfQUxMT1dFRDogNDA1LFxyXG4gICAgTk9UX0FDQ0VQVEFCTEU6IDQwNixcclxuICAgIFBST1hZX0FVVEhfUkVRVUlSRUQ6IDQwNyxcclxuICAgIFJFUVVFU1RfVElNRU9VVDogNDA4LFxyXG4gICAgQ09ORkxJQ1Q6IDQwOSxcclxuICAgIEdPTkU6IDQxMCxcclxuICAgIExFTkdUSF9SRVFVSVJFRDogNDExLFxyXG4gICAgUFJFQ09ORElUSU9OX0ZBSUxFRDogNDEyLFxyXG4gICAgUkVRVUVTVF9FTlRJVFlfVE9PX0xBUkdFOiA0MTMsXHJcbiAgICBSRVFVRVNUX1VSSV9UT09fTE9ORzogNDE0LFxyXG4gICAgVU5TVVBQT1JURURfTUVESUFfVFlQRTogNDE1LFxyXG4gICAgUkVRVUVTVEVEX1JBTkdFX05PVF9TQVRJU0ZJQUJMRTogNDE2LFxyXG4gICAgRVhQRUNUQVRJT05fRkFJTEVEOiA0MTcsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0FycmF5fSBlcnJvckhhbmRsZXJzXHJcbiAgICogQXJyYXkgb2Ygb2JqZWN0cyB0aGF0IHNob3VsZCBjb250YWluIGEgbmFtZSBzdHJpbmcgcHJvcGVydHksIHRlc3QgZnVuY3Rpb24sIGFuZCBoYW5kbGUgZnVuY3Rpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBlcnJvckhhbmRsZXJzOiBudWxsLFxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICB0aGlzLmFwcCA9IChvcHRpb25zICYmIG9wdGlvbnMuYXBwKSB8fCB3aW5kb3cuQXBwO1xyXG4gIH0sXHJcbiAgc3RhcnR1cDogZnVuY3Rpb24gc3RhcnR1cCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHN0YXJ0dXAsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBzZWxlY3Q6IGZ1bmN0aW9uIHNlbGVjdChub2RlKSB7XHJcbiAgICAkKG5vZGUpLmF0dHIoJ3NlbGVjdGVkJywgJ3RydWUnKTtcclxuICB9LFxyXG4gIHVuc2VsZWN0OiBmdW5jdGlvbiB1bnNlbGVjdChub2RlKSB7XHJcbiAgICAkKG5vZGUpLnJlbW92ZUF0dHIoJ3NlbGVjdGVkJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgZnJvbSB7QGxpbmsgQXBwI192aWV3VHJhbnNpdGlvblRvIEFwcGxpY2F0aW9ucyB2aWV3IHRyYW5zaXRpb24gaGFuZGxlcn0gYW5kIHJldHVybnNcclxuICAgKiB0aGUgZnVsbHkgY3VzdG9taXplZCB0b29sYmFyIGxheW91dC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB0b29sYmFyIGxheW91dFxyXG4gICAqL1xyXG4gIGdldFRvb2xzOiBmdW5jdGlvbiBnZXRUb29scygpIHtcclxuICAgIGNvbnN0IHRvb2xzID0gdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZVRvb2xMYXlvdXQoKSwgJ3Rvb2xzJyk7XHJcbiAgICB0aGlzLm9uVG9vbExheW91dENyZWF0ZWQodG9vbHMpO1xyXG4gICAgcmV0dXJuIHRvb2xzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGFmdGVyIHRvb2xCYXIgbGF5b3V0IGlzIGNyZWF0ZWQ7XHJcbiAgICpcclxuICAgKi9cclxuICBvblRvb2xMYXlvdXRDcmVhdGVkOiBmdW5jdGlvbiBvblRvb2xMYXlvdXRDcmVhdGVkKC8qIHRvb2xzKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHRvb2wgbGF5b3V0IHRoYXQgZGVmaW5lcyBhbGwgdG9vbGJhciBpdGVtcyBmb3IgdGhlIHZpZXdcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB0b29sYmFyIGxheW91dFxyXG4gICAqL1xyXG4gIGNyZWF0ZVRvb2xMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZVRvb2xMYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50b29scyB8fCB7fTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBvbiBsb2FkaW5nIG9mIHRoZSBhcHBsaWNhdGlvbi5cclxuICAgKi9cclxuICBpbml0OiBmdW5jdGlvbiBpbml0KHN0b3JlKSB7XHJcbiAgICB0aGlzLmluaXRTdG9yZShzdG9yZSk7XHJcbiAgICB0aGlzLnN0YXJ0dXAoKTtcclxuICAgIHRoaXMuaW5pdENvbm5lY3RzKCk7XHJcbiAgICB0aGlzLmluaXRNb2RlbCgpO1xyXG4gIH0sXHJcbiAgaW5pdFN0b3JlOiBmdW5jdGlvbiBpbml0U3RvcmUoc3RvcmUpIHtcclxuICAgIHRoaXMuYXBwU3RvcmUgPSBzdG9yZTtcclxuICAgIHRoaXMuYXBwU3RvcmUuc3Vic2NyaWJlKHRoaXMuX29uU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSk7XHJcbiAgfSxcclxuICBfdXBkYXRlQ29ubmVjdGlvblN0YXRlOiBmdW5jdGlvbiBfdXBkYXRlQ29ubmVjdGlvblN0YXRlKHN0YXRlKSB7XHJcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uU3RhdGUgPT09IHN0YXRlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXRNb2RlbCgpO1xyXG5cclxuICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5jb25uZWN0aW9uU3RhdGU7XHJcbiAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZSA9IHN0YXRlO1xyXG4gICAgaWYgKG9sZFN0YXRlICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMub25Db25uZWN0aW9uU3RhdGVDaGFuZ2Uoc3RhdGUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25Db25uZWN0aW9uU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uIG9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlKHN0YXRlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIF9vblN0YXRlQ2hhbmdlOiBmdW5jdGlvbiBfb25TdGF0ZUNoYW5nZSgpIHtcclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5hcHBTdG9yZS5nZXRTdGF0ZSgpO1xyXG4gICAgdGhpcy5fdXBkYXRlQ29ubmVjdGlvblN0YXRlKHN0YXRlLnNkay5vbmxpbmUpO1xyXG4gICAgdGhpcy5vblN0YXRlQ2hhbmdlKHN0YXRlKTtcclxuICAgIHRoaXMucHJldmlvdXNTdGF0ZSA9IHN0YXRlO1xyXG4gIH0sXHJcbiAgb25TdGF0ZUNoYW5nZTogZnVuY3Rpb24gb25TdGF0ZUNoYW5nZSh2YWwpIHt9LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZGVsIGluc3RhbmNlIHRoYXQgaXMgcmV0dXJuZWQgd2l0aCB0aGUgY3VycmVudCB2aWV3LlxyXG4gICAqL1xyXG4gIGluaXRNb2RlbDogZnVuY3Rpb24gaW5pdE1vZGVsKCkge1xyXG4gICAgY29uc3QgbW9kZWwgPSB0aGlzLmdldE1vZGVsKCk7XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcclxuICAgICAgdGhpcy5fbW9kZWwuaW5pdCgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIG5ldyBpbnN0YW5jZSBvZiBhIG1vZGVsIGZvciB0aGUgdmlldy5cclxuICAgKi9cclxuICBnZXRNb2RlbDogZnVuY3Rpb24gZ2V0TW9kZWwoKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IEFkYXB0ZXIuZ2V0TW9kZWwodGhpcy5tb2RlbE5hbWUpO1xyXG4gICAgcmV0dXJuIG1vZGVsO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXN0YWJsaXNoZXMgdGhpcyB2aWV3cyBjb25uZWN0aW9ucyB0byB2YXJpb3VzIGV2ZW50c1xyXG4gICAqL1xyXG4gIGluaXRDb25uZWN0czogZnVuY3Rpb24gaW5pdENvbm5lY3RzKCkge1xyXG4gICAgdGhpcy5fbG9hZENvbm5lY3QgPSB0aGlzLmNvbm5lY3QodGhpcy5kb21Ob2RlLCAnb25sb2FkJywgdGhpcy5fb25Mb2FkKTtcclxuICB9LFxyXG4gIF9vbkxvYWQ6IGZ1bmN0aW9uIF9vbkxvYWQoZXZ0LCBlbCwgbykge1xyXG4gICAgdGhpcy5kaXNjb25uZWN0KHRoaXMuX2xvYWRDb25uZWN0KTtcclxuICAgIHRoaXMubG9hZChldnQsIGVsLCBvKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBvbmNlIHRoZSBmaXJzdCB0aW1lIHRoZSB2aWV3IGlzIGFib3V0IHRvIGJlIHRyYW5zaXRpb25lZCB0by5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIGxvYWQ6IGZ1bmN0aW9uIGxvYWQoKSB7XHJcbiAgICAvLyB0b2RvOiByZW1vdmUgbG9hZCBlbnRpcmVseT9cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBpbiB7QGxpbmsgI3Nob3cgc2hvdygpfSBiZWZvcmUgcm91dGUgaXMgaW52b2tlZC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBOYXZpZ2F0aW9uIG9wdGlvbnMgcGFzc2VkIGZyb20gdGhlIHByZXZpb3VzIHZpZXcuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpbmRpY2F0ZXMgdmlldyBuZWVkcyB0byBiZSByZWZyZXNoZWQuXHJcbiAgICovXHJcbiAgcmVmcmVzaFJlcXVpcmVkRm9yOiBmdW5jdGlvbiByZWZyZXNoUmVxdWlyZWRGb3Iob3B0aW9ucykge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xyXG4gICAgICByZXR1cm4gISFvcHRpb25zOyAvLyBpZiBvcHRpb25zIHByb3ZpZGVkLCB0aGVuIHJlZnJlc2hcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGVycm9yIGhhbmRsZXJzXHJcbiAgICovXHJcbiAgY3JlYXRlRXJyb3JIYW5kbGVyczogZnVuY3Rpb24gY3JlYXRlRXJyb3JIYW5kbGVycygpIHtcclxuICAgIHJldHVybiB0aGlzLmVycm9ySGFuZGxlcnMgfHwgW107XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTdGFydHMgbWF0Y2hpbmcgYW5kIGV4ZWN1dGluZyBlcnJvckhhbmRsZXJzLlxyXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIEVycm9yIHRvIHBhc3MgdG8gdGhlIGVycm9ySGFuZGxlcnNcclxuICAgKi9cclxuICBoYW5kbGVFcnJvcjogZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IpIHtcclxuICAgIGlmICghZXJyb3IpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7fVxyXG5cclxuICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLmVycm9ySGFuZGxlcnMuZmlsdGVyKChoYW5kbGVyKSA9PiB7XHJcbiAgICAgIHJldHVybiBoYW5kbGVyLnRlc3QgJiYgaGFuZGxlci50ZXN0LmNhbGwodGhpcywgZXJyb3IpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbGVuID0gbWF0Y2hlcy5sZW5ndGg7XHJcblxyXG4gICAgY29uc3QgZ2V0TmV4dCA9IGZ1bmN0aW9uIGdldE5leHQoaW5kZXgpIHtcclxuICAgICAgLy8gbmV4dCgpIGNoYWluIGhhcyBlbmRlZCwgcmV0dXJuIGEgbm8tb3Agc28gY2FsbGluZyBuZXh0KCkgaW4gdGhlIGxhc3QgY2hhaW4gd29uJ3QgZXJyb3JcclxuICAgICAgaWYgKGluZGV4ID09PSBsZW4pIHtcclxuICAgICAgICByZXR1cm4gbm9vcDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUmV0dXJuIGEgY2xvc3VyZSB3aXRoIGluZGV4IGFuZCBtYXRjaGVzIGNhcHR1cmVkLlxyXG4gICAgICAvLyBUaGUgaGFuZGxlIGZ1bmN0aW9uIGNhbiBjYWxsIGl0cyBcIm5leHRcIiBwYXJhbSB0byBjb250aW51ZSB0aGUgY2hhaW4uXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgIGNvbnN0IG5leHRIYW5kbGVyID0gbWF0Y2hlc1tpbmRleF07XHJcbiAgICAgICAgY29uc3QgbmV4dEZuID0gbmV4dEhhbmRsZXIgJiYgbmV4dEhhbmRsZXIuaGFuZGxlO1xyXG5cclxuICAgICAgICBuZXh0Rm4uY2FsbCh0aGlzLCBlcnJvciwgZ2V0TmV4dC5jYWxsKHRoaXMsIGluZGV4ICsgMSkpO1xyXG4gICAgICB9LmJpbmQodGhpcyk7XHJcbiAgICB9LmJpbmQodGhpcyk7XHJcblxyXG4gICAgaWYgKGxlbiA+IDAgJiYgbWF0Y2hlc1swXS5oYW5kbGUpIHtcclxuICAgICAgLy8gU3RhcnQgdGhlIGhhbmRsZSBjaGFpbiwgdGhlIGhhbmRsZSBjYW4gY2FsbCBuZXh0KCkgdG8gY29udGludWUgdGhlIGl0ZXJhdGlvblxyXG4gICAgICBtYXRjaGVzWzBdLmhhbmRsZS5jYWxsKHRoaXMsIGVycm9yLCBnZXROZXh0LmNhbGwodGhpcywgMSkpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgZ2VuZXJhbCBlcnJvciBtZXNzYWdlLCBvciB0aGUgZXJyb3IgbWVzc2FnZSBmb3IgdGhlIHN0YXR1cyBjb2RlLlxyXG4gICAqL1xyXG4gIGdldEVycm9yTWVzc2FnZTogZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSB7XHJcbiAgICBsZXQgbWVzc2FnZSA9IHRoaXMuZXJyb3JUZXh0LmdlbmVyYWw7XHJcblxyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIG1lc3NhZ2UgPSB0aGlzLmVycm9yVGV4dC5zdGF0dXNbZXJyb3Iuc3RhdHVzXSB8fCB0aGlzLmVycm9yVGV4dC5nZW5lcmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtZXNzYWdlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2hvdWxkIHJlZnJlc2ggdGhlIHZpZXcsIHN1Y2ggYXMgYnV0IG5vdCBsaW1pdGVkIHRvOlxyXG4gICAqIEVtcHR5aW5nIG5vZGVzLCByZXF1ZXN0aW5nIGRhdGEsIHJlbmRlcmluZyBuZXcgY29udGVudFxyXG4gICAqL1xyXG4gIHJlZnJlc2g6IGZ1bmN0aW9uIHJlZnJlc2goKSB7fSxcclxuICAvKipcclxuICAgKiBUaGUgb25CZWZvcmVUcmFuc2l0aW9uQXdheSBldmVudC5cclxuICAgKiBAcGFyYW0gc2VsZlxyXG4gICAqL1xyXG4gIG9uQmVmb3JlVHJhbnNpdGlvbkF3YXk6IGZ1bmN0aW9uIG9uQmVmb3JlVHJhbnNpdGlvbkF3YXkoLyogc2VsZiovKSB7fSxcclxuICAvKipcclxuICAgKiBUaGUgb25CZWZvcmVUcmFuc2l0aW9uVG8gZXZlbnQuXHJcbiAgICogQHBhcmFtIHNlbGZcclxuICAgKi9cclxuICBvbkJlZm9yZVRyYW5zaXRpb25UbzogZnVuY3Rpb24gb25CZWZvcmVUcmFuc2l0aW9uVG8oLyogc2VsZiovKSB7fSxcclxuICAvKipcclxuICAgKiBUaGUgb25UcmFuc2l0aW9uQXdheSBldmVudC5cclxuICAgKiBAcGFyYW0gc2VsZlxyXG4gICAqL1xyXG4gIG9uVHJhbnNpdGlvbkF3YXk6IGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkF3YXkoLyogc2VsZiovKSB7fSxcclxuICAvKipcclxuICAgKiBUaGUgb25UcmFuc2l0aW9uVG8gZXZlbnQuXHJcbiAgICogQHBhcmFtIHNlbGZcclxuICAgKi9cclxuICBvblRyYW5zaXRpb25UbzogZnVuY3Rpb24gb25UcmFuc2l0aW9uVG8oLyogc2VsZiovKSB7fSxcclxuICAvKipcclxuICAgKiBUaGUgb25BY3RpdmF0ZSBldmVudC5cclxuICAgKiBAcGFyYW0gc2VsZlxyXG4gICAqL1xyXG4gIG9uQWN0aXZhdGU6IGZ1bmN0aW9uIG9uQWN0aXZhdGUoLyogc2VsZiovKSB7fSxcclxuICAvKipcclxuICAgKiBUaGUgb25TaG93IGV2ZW50LlxyXG4gICAqIEBwYXJhbSBzZWxmXHJcbiAgICovXHJcbiAgb25TaG93OiBmdW5jdGlvbiBvblNob3coLyogc2VsZiovKSB7fSxcclxuICBhY3RpdmF0ZTogZnVuY3Rpb24gYWN0aXZhdGUodGFnLCBkYXRhKSB7XHJcbiAgICAvLyB0b2RvOiB1c2UgdGFnIG9ubHk/XHJcbiAgICBpZiAoZGF0YSAmJiB0aGlzLnJlZnJlc2hSZXF1aXJlZEZvcihkYXRhLm9wdGlvbnMpKSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSAoZGF0YSAmJiBkYXRhLm9wdGlvbnMpIHx8IHRoaXMub3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlKSB7XHJcbiAgICAgIHRoaXMuc2V0KCd0aXRsZScsIHRoaXMub3B0aW9ucy50aXRsZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldCgndGl0bGUnLCB0aGlzLnRpdGxlVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkFjdGl2YXRlKHRoaXMpO1xyXG4gIH0sXHJcbiAgX2dldFNjcm9sbGVyQXR0cjogZnVuY3Rpb24gX2dldFNjcm9sbGVyQXR0cigpIHtcclxuICAgIHJldHVybiB0aGlzLnNjcm9sbGVyTm9kZSB8fCB0aGlzLmRvbU5vZGU7XHJcbiAgfSxcclxuICBfdHJhbnNpdGlvbk9wdGlvbnM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIHZpZXcgdXNpbmcgcGFnZWpzIGluIG9yZGVyIHRvIHRyYW5zaXRpb24gdG8gdGhlIG5ldyBlbGVtZW50LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgcGFzc2VkIGZyb20gdGhlIHByZXZpb3VzIHZpZXcuXHJcbiAgICogQHBhcmFtIHRyYW5zaXRpb25PcHRpb25zIHtPYmplY3R9IE9wdGlvbmFsIHRyYW5zaXRpb24gb2JqZWN0IHRoYXQgaXMgZm9yd2FyZGVkIHRvIG9wZW4uXHJcbiAgICovXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhvcHRpb25zLCB0cmFuc2l0aW9uT3B0aW9ucykge1xyXG4gICAgdGhpcy5lcnJvckhhbmRsZXJzID0gdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUVycm9ySGFuZGxlcnMoKSwgJ2Vycm9ySGFuZGxlcnMnKTtcclxuXHJcbiAgICBpZiAodGhpcy5vblNob3codGhpcykgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZWZyZXNoUmVxdWlyZWRGb3Iob3B0aW9ucykpIHtcclxuICAgICAgdGhpcy5yZWZyZXNoUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgdGhpcy5vcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGUpIHtcclxuICAgICAgdGhpcy5zZXQoJ3RpdGxlJywgdGhpcy5vcHRpb25zLnRpdGxlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0KCd0aXRsZScsIHRoaXMudGl0bGVUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0YWcgPSB0aGlzLmdldFRhZygpO1xyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0Q29udGV4dCgpO1xyXG5cclxuICAgIGNvbnN0IHRvID0gbGFuZy5taXhpbih0cmFuc2l0aW9uT3B0aW9ucyB8fCB7fSwge1xyXG4gICAgICB0YWcsXHJcbiAgICAgIGRhdGEsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuX3RyYW5zaXRpb25PcHRpb25zID0gdG87XHJcbiAgICBwYWdlKHRoaXMuYnVpbGRSb3V0ZSgpKTtcclxuICB9LFxyXG4gIGhhc2hQcmVmaXg6ICcjIScsXHJcbiAgY3VycmVudEhhc2g6ICcnLFxyXG4gIHRyYW5zaXRpb25Db21wbGV0ZTogZnVuY3Rpb24gdHJhbnNpdGlvbkNvbXBsZXRlKF9wYWdlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy50cmFjayAhPT0gZmFsc2UpIHtcclxuICAgICAgdGhpcy5jdXJyZW50SGFzaCA9IGxvY2F0aW9uLmhhc2g7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy50cmltbWVkICE9PSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICAgIGhhc2g6IHRoaXMuY3VycmVudEhhc2gsXHJcbiAgICAgICAgICBwYWdlOiB0aGlzLmlkLFxyXG4gICAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgICAgIGRhdGE6IG9wdGlvbnMuZGF0YSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFwcC5jb250ZXh0Lmhpc3RvcnkucHVzaChkYXRhKTtcclxuICAgICAgICB0aGlzLmFwcFN0b3JlLmRpc3BhdGNoKGluc2VydEhpc3RvcnkoZGF0YSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICB0cmFuc2l0aW9uOiBmdW5jdGlvbiB0cmFuc2l0aW9uKGZyb20sIHRvLCBvcHRpb25zKSB7XHJcbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcclxuICAgICAgdGhpcy50cmFuc2l0aW9uQ29tcGxldGUodG8sIG9wdGlvbnMpO1xyXG4gICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24nKTtcclxuXHJcbiAgICAgICQoZnJvbSkudHJpZ2dlcih7XHJcbiAgICAgICAgb3V0OiB0cnVlLFxyXG4gICAgICAgIHRhZzogb3B0aW9ucy50YWcsXHJcbiAgICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICB0eXBlOiAnYWZ0ZXJ0cmFuc2l0aW9uJyxcclxuICAgICAgfSk7XHJcbiAgICAgICQodG8pLnRyaWdnZXIoe1xyXG4gICAgICAgIG91dDogZmFsc2UsXHJcbiAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgICBkYXRhOiBvcHRpb25zLmRhdGEsXHJcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6ICdhZnRlcnRyYW5zaXRpb24nLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmNvbXBsZXRlKSB7XHJcbiAgICAgICAgb3B0aW9ucy5jb21wbGV0ZShmcm9tLCB0bywgb3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24nKTtcclxuXHJcbiAgICAvLyBkaXNwYXRjaCBhbiAnc2hvdycgZXZlbnQgdG8gbGV0IHRoZSBwYWdlIGJlIGF3YXJlIHRoYXQgaXMgYmVpbmcgc2hvdyBhcyB0aGUgcmVzdWx0IG9mIGFuIGV4dGVybmFsXHJcbiAgICAvLyBldmVudCAoaS5lLiBicm93c2VyIGJhY2svZm9yd2FyZCBuYXZpZ2F0aW9uKS5cclxuICAgIGlmIChvcHRpb25zLmV4dGVybmFsKSB7XHJcbiAgICAgICQodG8pLnRyaWdnZXIoe1xyXG4gICAgICAgIHRhZzogb3B0aW9ucy50YWcsXHJcbiAgICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICB0eXBlOiAnc2hvdycsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoZnJvbSkudHJpZ2dlcih7XHJcbiAgICAgIG91dDogdHJ1ZSxcclxuICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICB0eXBlOiAnYmVmb3JldHJhbnNpdGlvbicsXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHRvKS50cmlnZ2VyKHtcclxuICAgICAgb3V0OiBmYWxzZSxcclxuICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICB0eXBlOiAnYmVmb3JldHJhbnNpdGlvbicsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVuc2VsZWN0KGZyb20pO1xyXG4gICAgdGhpcy5zZWxlY3QodG8pO1xyXG4gICAgY29tcGxldGUuYXBwbHkodGhpcyk7XHJcbiAgfSxcclxuICBzZXRQcmltYXJ5VGl0bGU6IGZ1bmN0aW9uIHNldFByaW1hcnlUaXRsZSgpIHtcclxuICAgIEFwcC5zZXRQcmltYXJ5VGl0bGUodGhpcy5nZXQoJ3RpdGxlJykpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgKiBBdmFpbGFibGUgT3B0aW9uczpcclxuICAqICAgaG9yaXpvbnRhbDogVHJ1ZSBpZiB0aGUgdHJhbnNpdGlvbiBpcyBob3Jpem9udGFsLCBGYWxzZSBvdGhlcndpc2UuXHJcbiAgKiAgIHJldmVyc2U6IFRydWUgaWYgdGhlIHRyYW5zaXRpb24gaXMgYSByZXZlcnNlIHRyYW5zaXRpb24gKHJpZ2h0L2Rvd24pLCBGYWxzZSBvdGhlcndpc2UuXHJcbiAgKiAgIHRyYWNrOiBGYWxzZSBpZiB0aGUgdHJhbnNpdGlvbiBzaG91bGQgbm90IGJlIHRyYWNrZWQgaW4gaGlzdG9yeSwgVHJ1ZSBvdGhlcndpc2UuXHJcbiAgKiAgIHVwZGF0ZTogRmFsc2UgaWYgdGhlIHRyYW5zaXRpb24gc2hvdWxkIG5vdCB1cGRhdGUgdGl0bGUgYW5kIGJhY2sgYnV0dG9uLCBUcnVlIG90aGVyd2lzZS5cclxuICAqICAgc2Nyb2xsOiBGYWxzZSBpZiB0aGUgdHJhbnNpdGlvbiBzaG91bGQgbm90IHNjcm9sbCB0byB0aGUgdG9wLCBUcnVlIG90aGVyd2lzZS5cclxuICAqL1xyXG4gIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7XHJcbiAgICBjb25zdCBwID0gdGhpcy5kb21Ob2RlO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX3RyYW5zaXRpb25PcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmICghcCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRQcmltYXJ5VGl0bGUoKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy50cmFjayAhPT0gZmFsc2UpIHtcclxuICAgICAgY29uc3QgY291bnQgPSBBcHAuY29udGV4dC5oaXN0b3J5Lmxlbmd0aDtcclxuICAgICAgbGV0IHBvc2l0aW9uID0gY291bnQgLSAxO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucmV0dXJuVG8pIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMucmV0dXJuVG8gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIGZvciAocG9zaXRpb24gPSBjb3VudCAtIDE7IHBvc2l0aW9uID49IDA7IHBvc2l0aW9uLS0pIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmV0dXJuVG8oQXBwLmNvbnRleHQuaGlzdG9yeVtwb3NpdGlvbl0pKSB7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMucmV0dXJuVG8gPCAwKSB7XHJcbiAgICAgICAgICBwb3NpdGlvbiA9IChjb3VudCAtIDEpICsgb3B0aW9ucy5yZXR1cm5UbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwb3NpdGlvbiA+IC0xKSB7XHJcbiAgICAgICAgICAvLyB3ZSBmaXggdXAgdGhlIGhpc3RvcnksIGJ1dCBkbyBub3QgZmxhZyBhcyB0cmltbWVkLCBzaW5jZSB3ZSBkbyB3YW50IHRoZSBuZXcgdmlldyB0byBiZSBwdXNoZWQuXHJcbiAgICAgICAgICBBcHAuY29udGV4dC5oaXN0b3J5ID0gQXBwLmNvbnRleHQuaGlzdG9yeS5zcGxpY2UoMCwgcG9zaXRpb24gKyAxKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRIYXNoID0gQXBwLmNvbnRleHQuaGlzdG9yeVtBcHAuY29udGV4dC5oaXN0b3J5Lmxlbmd0aCAtIDFdICYmIEFwcC5jb250ZXh0Lmhpc3RvcnlbQXBwLmNvbnRleHQuaGlzdG9yeS5sZW5ndGggLSAxXS5oYXNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3B0aW9ucy5yZXR1cm5UbyA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBkb24ndCBhdXRvLXNjcm9sbCBieSBkZWZhdWx0IGlmIHJldmVyc2luZ1xyXG4gICAgaWYgKG9wdGlvbnMucmV2ZXJzZSAmJiB0eXBlb2Ygb3B0aW9ucy5zY3JvbGwgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIG9wdGlvbnMuc2Nyb2xsID0gIW9wdGlvbnMucmV2ZXJzZTtcclxuICAgIH1cclxuXHJcbiAgICAkKHApLnRyaWdnZXIoe1xyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgdHlwZTogJ2xvYWQnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZnJvbSA9IEFwcC5nZXRDdXJyZW50UGFnZSgpO1xyXG5cclxuICAgIGlmIChmcm9tKSB7XHJcbiAgICAgICQoZnJvbSkudHJpZ2dlcih7XHJcbiAgICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICB0eXBlOiAnYmx1cicsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIEFwcC5zZXRDdXJyZW50UGFnZShwKTtcclxuXHJcbiAgICAkKHApLnRyaWdnZXIoe1xyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgdHlwZTogJ2ZvY3VzJyxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChmcm9tICYmICQocCkuYXR0cignc2VsZWN0ZWQnKSAhPT0gJ3RydWUnKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnJldmVyc2UpIHtcclxuICAgICAgICAkKHApLnRyaWdnZXIoe1xyXG4gICAgICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgdHlwZTogJ3VubG9hZCcsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMudHJhbnNpdGlvbi5iaW5kKHRoaXMpLCBBcHAuY2hlY2tPcmllbnRhdGlvblRpbWUsIGZyb20sIHAsIG9wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChwKS50cmlnZ2VyKHtcclxuICAgICAgICBvdXQ6IGZhbHNlLFxyXG4gICAgICAgIHRhZzogb3B0aW9ucy50YWcsXHJcbiAgICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICB0eXBlOiAnYmVmb3JldHJhbnNpdGlvbicsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3QocCk7XHJcblxyXG4gICAgICB0aGlzLnRyYW5zaXRpb25Db21wbGV0ZShwLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICQocCkudHJpZ2dlcih7XHJcbiAgICAgICAgb3V0OiBmYWxzZSxcclxuICAgICAgICB0YWc6IG9wdGlvbnMudGFnLFxyXG4gICAgICAgIGRhdGE6IG9wdGlvbnMuZGF0YSxcclxuICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgdHlwZTogJ2FmdGVydHJhbnNpdGlvbicsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXhwYW5kcyB0aGUgcGFzc2VkIGV4cHJlc3Npb24gaWYgaXQgaXMgYSBmdW5jdGlvbi5cclxuICAgKiBAcGFyYW0ge1N0cmluZy9GdW5jdGlvbn0gZXhwcmVzc2lvbiBSZXR1cm5zIHN0cmluZyBkaXJlY3RseSwgaWYgZnVuY3Rpb24gaXQgaXMgY2FsbGVkIGFuZCB0aGUgcmVzdWx0IHJldHVybmVkLlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gU3RyaW5nIGV4cHJlc3Npb24uXHJcbiAgICovXHJcbiAgZXhwYW5kRXhwcmVzc2lvbjogZnVuY3Rpb24gZXhwYW5kRXhwcmVzc2lvbihleHByZXNzaW9uKSB7XHJcbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIGV4cHJlc3Npb24uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV4cHJlc3Npb247XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYmVmb3JlIHRoZSB2aWV3IGlzIHRyYW5zaXRpb25lZCAoc2xpZGUgYW5pbWF0aW9uIGNvbXBsZXRlKSB0by5cclxuICAgKi9cclxuICBiZWZvcmVUcmFuc2l0aW9uVG86IGZ1bmN0aW9uIGJlZm9yZVRyYW5zaXRpb25UbygpIHtcclxuICAgIHRoaXMub25CZWZvcmVUcmFuc2l0aW9uVG8odGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYmVmb3JlIHRoZSB2aWV3IGlzIHRyYW5zaXRpb25lZCAoc2xpZGUgYW5pbWF0aW9uIGNvbXBsZXRlKSBhd2F5IGZyb20uXHJcbiAgICovXHJcbiAgYmVmb3JlVHJhbnNpdGlvbkF3YXk6IGZ1bmN0aW9uIGJlZm9yZVRyYW5zaXRpb25Bd2F5KCkge1xyXG4gICAgdGhpcy5vbkJlZm9yZVRyYW5zaXRpb25Bd2F5KHRoaXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zaXRpb25lZCAoc2xpZGUgYW5pbWF0aW9uIGNvbXBsZXRlKSB0by5cclxuICAgKi9cclxuICB0cmFuc2l0aW9uVG86IGZ1bmN0aW9uIHRyYW5zaXRpb25UbygpIHtcclxuICAgIGlmICh0aGlzLnJlZnJlc2hSZXF1aXJlZCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uVHJhbnNpdGlvblRvKHRoaXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIHRyYW5zaXRpb25lZCAoc2xpZGUgYW5pbWF0aW9uIGNvbXBsZXRlKSBhd2F5IGZyb20uXHJcbiAgICovXHJcbiAgdHJhbnNpdGlvbkF3YXk6IGZ1bmN0aW9uIHRyYW5zaXRpb25Bd2F5KCkge1xyXG4gICAgdGhpcy5vblRyYW5zaXRpb25Bd2F5KHRoaXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcHJpbWFyeSBTRGF0YVNlcnZpY2UgaW5zdGFuY2UgZm9yIHRoZSB2aWV3LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2VydmljZSBpbnN0YW5jZS5cclxuICAgKi9cclxuICBnZXRTZXJ2aWNlOiBmdW5jdGlvbiBnZXRTZXJ2aWNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwLmdldFNlcnZpY2UodGhpcy5zZXJ2aWNlTmFtZSk7IC8qIGlmIGZhbHNlIGlzIHBhc3NlZCwgdGhlIGRlZmF1bHQgc2VydmljZSB3aWxsIGJlIHJldHVybmVkICovXHJcbiAgfSxcclxuICBnZXRDb25uZWN0aW9uOiBmdW5jdGlvbiBnZXRDb25uZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0U2VydmljZSgpO1xyXG4gIH0sXHJcbiAgZ2V0VGFnOiBmdW5jdGlvbiBnZXRUYWcoKSB7fSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBvcHRpb25zIHVzZWQgZm9yIHRoZSBWaWV3IHtAbGluayAjZ2V0Q29udGV4dCBnZXRDb250ZXh0KCl9LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gT3B0aW9ucyB0byBiZSB1c2VkIGZvciBjb250ZXh0LlxyXG4gICAqL1xyXG4gIGdldE9wdGlvbnNDb250ZXh0OiBmdW5jdGlvbiBnZXRPcHRpb25zQ29udGV4dCgpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm5lZ2F0ZUhpc3RvcnkpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBuZWdhdGVIaXN0b3J5OiB0cnVlLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGNvbnRleHQgb2YgdGhlIHZpZXcgd2hpY2ggaXMgYSBzbWFsbCBzdW1tYXJ5IG9mIGtleSBwcm9wZXJ0aWVzLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVml0YWwgVmlldyBwcm9wZXJ0aWVzLlxyXG4gICAqL1xyXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XHJcbiAgICAvLyB0b2RvOiBzaG91bGQgd2UgdHJhY2sgb3B0aW9ucz9cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICBvcHRpb25zOiB0aGlzLmdldE9wdGlvbnNDb250ZXh0KCksXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZGVmaW5lZCBzZWN1cml0eS5cclxuICAgKiBAcGFyYW0gYWNjZXNzXHJcbiAgICovXHJcbiAgZ2V0U2VjdXJpdHk6IGZ1bmN0aW9uIGdldFNlY3VyaXR5KC8qIGFjY2VzcyovKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWN1cml0eTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgKiBSb3V0ZSBwYXNzZWQgaW50byB0aGUgcm91dGVyLiBSZWdFeCBleHByZXNzaW9ucyBhcmUgYWxzbyBhY2NlcHRlZC5cclxuICAqL1xyXG4gIHJvdXRlOiAnJyxcclxuICAvKipcclxuICAqIEdldHMgdGhlIHJvdXRlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHZpZXcuIFJldHVybnMgdGhpcy5pZCBpZiBubyByb3V0ZSBpcyBkZWZpbmVkLlxyXG4gICovXHJcbiAgZ2V0Um91dGU6IGZ1bmN0aW9uIGdldFJvdXRlKCkge1xyXG4gICAgaWYgKCh0eXBlb2YgdGhpcy5yb3V0ZSA9PT0gJ3N0cmluZycgJiYgdGhpcy5yb3V0ZS5sZW5ndGggPiAwKSB8fCB0aGlzLnJvdXRlIGluc3RhbmNlb2YgUmVnRXhwKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgKiBTaG93IG1ldGhvZCBjYWxscyB0aGlzIHRvIGJ1aWxkIGEgcm91dGUgdGhhdCBpdCBjYW4gbmF2aWdhdGUgdG8uIElmIHlvdSBhZGQgYSBjdXN0b20gcm91dGUsXHJcbiAgKiB0aGlzIHNob3VsZCBjaGFuZ2UgdG8gYnVpbGQgYSByb3V0ZSB0aGF0IGNhbiBtYXRjaCB0aGF0LlxyXG4gICogQHJldHVybnMge1N0cmluZ31cclxuICAqL1xyXG4gIGJ1aWxkUm91dGU6IGZ1bmN0aW9uIGJ1aWxkUm91dGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICogRmlyZXMgZmlyc3Qgd2hlbiBhIHJvdXRlIGlzIHRyaWdnZXJlZC4gQW55IHByZS1sb2FkaW5nIHNob3VsZCBoYXBwZW4gaGVyZS5cclxuICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHRcclxuICAqL1xyXG4gIHJvdXRlTG9hZDogZnVuY3Rpb24gcm91dGVMb2FkKGN0eCwgbmV4dCkge1xyXG4gICAgbmV4dCgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgKiBGaXJlcyBzZWNvbmQgd2hlbiBhIHJvdXRlIGlzIHRyaWdnZXJlZC4gQW55IHByZS1sb2FkaW5nIHNob3VsZCBoYXBwZW4gaGVyZS5cclxuICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHRcclxuICAqL1xyXG4gIHJvdXRlU2hvdzogZnVuY3Rpb24gcm91dGVTaG93KGN0eCwgbmV4dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICB9LFxyXG4gIC8qXHJcbiAgKiBSZXF1aXJlZCBmb3IgYmluZGluZyB0byBTY3JvbGxDb250YWluZXIgd2hpY2ggdXRpbGl6ZXMgaVNjcm9sbCB0aGF0IHJlcXVpcmVzIHRvIGJlIHJlZnJlc2hlZCB3aGVuIHRoZVxyXG4gICogY29udGVudCAodGhlcmVmb3Igc2Nyb2xsYWJsZSBhcmVhKSBjaGFuZ2VzLlxyXG4gICovXHJcbiAgb25Db250ZW50Q2hhbmdlOiBmdW5jdGlvbiBvbkNvbnRlbnRDaGFuZ2UoKSB7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRydWUgaWYgdmlldyBpcyBkaXNhYmxlZC5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufS5cclxuICAgKi9cclxuICBpc0Rpc2FibGVkOiBmdW5jdGlvbiBpc0Rpc2FibGVkKCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19