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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9WaWV3LmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsImF0dHJpYnV0ZU1hcCIsInRpdGxlIiwibm9kZSIsInR5cGUiLCJhdHRyaWJ1dGUiLCJzZWxlY3RlZCIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJfbG9hZENvbm5lY3QiLCJpZCIsInRpdGxlVGV4dCIsInRvb2xzIiwic2VjdXJpdHkiLCJhcHAiLCJtb2RlbE5hbWUiLCJ2aWV3VHlwZSIsInNlcnZpY2VOYW1lIiwiY29ubmVjdGlvbk5hbWUiLCJjb25uZWN0aW9uU3RhdGUiLCJlbmFibGVPZmZsaW5lU3VwcG9ydCIsInByZXZpb3VzU3RhdGUiLCJlbmFibGVDdXN0b21pemF0aW9ucyIsImVycm9yVGV4dCIsImdlbmVyYWwiLCJzdGF0dXMiLCJIVFRQX1NUQVRVUyIsIkJBRF9SRVFVRVNUIiwiVU5BVVRIT1JJWkVEIiwiUEFZTUVOVF9SRVFVSVJFRCIsIkZPUkJJRERFTiIsIk5PVF9GT1VORCIsIk1FVEhPRF9OT1RfQUxMT1dFRCIsIk5PVF9BQ0NFUFRBQkxFIiwiUFJPWFlfQVVUSF9SRVFVSVJFRCIsIlJFUVVFU1RfVElNRU9VVCIsIkNPTkZMSUNUIiwiR09ORSIsIkxFTkdUSF9SRVFVSVJFRCIsIlBSRUNPTkRJVElPTl9GQUlMRUQiLCJSRVFVRVNUX0VOVElUWV9UT09fTEFSR0UiLCJSRVFVRVNUX1VSSV9UT09fTE9ORyIsIlVOU1VQUE9SVEVEX01FRElBX1RZUEUiLCJSRVFVRVNURURfUkFOR0VfTk9UX1NBVElTRklBQkxFIiwiRVhQRUNUQVRJT05fRkFJTEVEIiwiZXJyb3JIYW5kbGVycyIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIndpbmRvdyIsIkFwcCIsInN0YXJ0dXAiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJzZWxlY3QiLCIkIiwiYXR0ciIsInVuc2VsZWN0IiwicmVtb3ZlQXR0ciIsImdldFRvb2xzIiwiX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQiLCJjcmVhdGVUb29sTGF5b3V0Iiwib25Ub29sTGF5b3V0Q3JlYXRlZCIsImluaXQiLCJzdG9yZSIsImluaXRTdG9yZSIsImluaXRDb25uZWN0cyIsImluaXRNb2RlbCIsImFwcFN0b3JlIiwic3Vic2NyaWJlIiwiX29uU3RhdGVDaGFuZ2UiLCJiaW5kIiwiX3VwZGF0ZUNvbm5lY3Rpb25TdGF0ZSIsInN0YXRlIiwib2xkU3RhdGUiLCJvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSIsImdldFN0YXRlIiwic2RrIiwib25saW5lIiwib25TdGF0ZUNoYW5nZSIsInZhbCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJfbW9kZWwiLCJjb25uZWN0IiwiZG9tTm9kZSIsIl9vbkxvYWQiLCJldnQiLCJlbCIsIm8iLCJkaXNjb25uZWN0IiwibG9hZCIsInJlZnJlc2hSZXF1aXJlZEZvciIsImNyZWF0ZUVycm9ySGFuZGxlcnMiLCJoYW5kbGVFcnJvciIsImVycm9yIiwibm9vcCIsIm1hdGNoZXMiLCJmaWx0ZXIiLCJoYW5kbGVyIiwidGVzdCIsImNhbGwiLCJsZW4iLCJsZW5ndGgiLCJnZXROZXh0IiwiaW5kZXgiLCJuZXh0IiwibmV4dEhhbmRsZXIiLCJuZXh0Rm4iLCJoYW5kbGUiLCJnZXRFcnJvck1lc3NhZ2UiLCJtZXNzYWdlIiwicmVmcmVzaCIsIm9uQmVmb3JlVHJhbnNpdGlvbkF3YXkiLCJvbkJlZm9yZVRyYW5zaXRpb25UbyIsIm9uVHJhbnNpdGlvbkF3YXkiLCJvblRyYW5zaXRpb25UbyIsIm9uQWN0aXZhdGUiLCJvblNob3ciLCJhY3RpdmF0ZSIsInRhZyIsImRhdGEiLCJyZWZyZXNoUmVxdWlyZWQiLCJzZXQiLCJfZ2V0U2Nyb2xsZXJBdHRyIiwic2Nyb2xsZXJOb2RlIiwiX3RyYW5zaXRpb25PcHRpb25zIiwic2hvdyIsInRyYW5zaXRpb25PcHRpb25zIiwiZ2V0VGFnIiwiZ2V0Q29udGV4dCIsInRvIiwibWl4aW4iLCJwYWdlIiwiYnVpbGRSb3V0ZSIsImhhc2hQcmVmaXgiLCJjdXJyZW50SGFzaCIsInRyYW5zaXRpb25Db21wbGV0ZSIsIl9wYWdlIiwidHJhY2siLCJsb2NhdGlvbiIsImhhc2giLCJ0cmltbWVkIiwiY29udGV4dCIsImhpc3RvcnkiLCJwdXNoIiwiZGlzcGF0Y2giLCJ0cmFuc2l0aW9uIiwiZnJvbSIsImNvbXBsZXRlIiwicmVtb3ZlQ2xhc3MiLCJ0cmlnZ2VyIiwib3V0IiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJhZGRDbGFzcyIsImV4dGVybmFsIiwiYXBwbHkiLCJzZXRQcmltYXJ5VGl0bGUiLCJnZXQiLCJvcGVuIiwicCIsImNvdW50IiwicG9zaXRpb24iLCJyZXR1cm5UbyIsInNwbGljZSIsInJldmVyc2UiLCJzY3JvbGwiLCJnZXRDdXJyZW50UGFnZSIsInNldEN1cnJlbnRQYWdlIiwic2V0VGltZW91dCIsImNoZWNrT3JpZW50YXRpb25UaW1lIiwiZXhwYW5kRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiYmVmb3JlVHJhbnNpdGlvblRvIiwiYmVmb3JlVHJhbnNpdGlvbkF3YXkiLCJ0cmFuc2l0aW9uVG8iLCJpc1JlZnJlc2hpbmciLCJ0cmFuc2l0aW9uQXdheSIsImdldFNlcnZpY2UiLCJnZXRDb25uZWN0aW9uIiwiZ2V0T3B0aW9uc0NvbnRleHQiLCJuZWdhdGVIaXN0b3J5IiwiZ2V0U2VjdXJpdHkiLCJyb3V0ZSIsImdldFJvdXRlIiwiUmVnRXhwIiwicm91dGVMb2FkIiwiY3R4Iiwicm91dGVTaG93Iiwib25Db250ZW50Q2hhbmdlIiwiaXNEaXNhYmxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLE1BQU1BLFdBQVcsb0JBQVksTUFBWixDQUFqQjs7QUFFQTs7Ozs7Ozs7OztBQTVCQTs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBLE1BQU1DLFVBQVUsdUJBQVEsWUFBUixFQUFzQixnR0FBdEIsRUFBb0YseUJBQXlCO0FBQzNIOzs7QUFHQUMsa0JBQWM7QUFDWkMsYUFBTztBQUNMQyxj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Ozs7QUFJQUUsaUJBQWEsU0FBU0EsV0FBVCxHQUFxQixXQUFhO0FBQzdDLGFBQU8sS0FBSzVLLFFBQVo7QUFDRCxLQS9uQjBIO0FBZ29CM0g7Ozs7QUFJQTZLLFdBQU8sRUFwb0JvSDtBQXFvQjNIOzs7QUFHQUMsY0FBVSxTQUFTQSxRQUFULEdBQW9CO0FBQzVCLFVBQUssT0FBTyxLQUFLRCxLQUFaLEtBQXNCLFFBQXRCLElBQWtDLEtBQUtBLEtBQUwsQ0FBV3BGLE1BQVgsR0FBb0IsQ0FBdkQsSUFBNkQsS0FBS29GLEtBQUwsWUFBc0JFLE1BQXZGLEVBQStGO0FBQzdGLGVBQU8sS0FBS0YsS0FBWjtBQUNEOztBQUVELGFBQU8sS0FBS2hMLEVBQVo7QUFDRCxLQTlvQjBIO0FBK29CM0g7Ozs7O0FBS0EySCxnQkFBWSxTQUFTQSxVQUFULEdBQXNCO0FBQ2hDLGFBQU8sS0FBSzNILEVBQVo7QUFDRCxLQXRwQjBIO0FBdXBCM0g7Ozs7O0FBS0FtTCxlQUFXLFNBQVNBLFNBQVQsQ0FBbUJDLEdBQW5CLEVBQXdCckYsSUFBeEIsRUFBOEI7QUFDdkNBO0FBQ0QsS0E5cEIwSDtBQStwQjNIOzs7OztBQUtBc0YsZUFBVyxTQUFTQSxTQUFULENBQW1CRCxHQUFuQixFQUF3QnJGLElBQXhCLEVBQThCO0FBQUU7QUFDekMsV0FBS3NELElBQUw7QUFDRCxLQXRxQjBIO0FBdXFCM0g7Ozs7QUFJQWlDLHFCQUFpQixTQUFTQSxlQUFULEdBQTJCLENBQzNDLENBNXFCMEg7QUE2cUIzSDs7OztBQUlBQyxnQkFBWSxTQUFTQSxVQUFULEdBQXNCO0FBQ2hDLGFBQU8sS0FBUDtBQUNEO0FBbnJCMEgsR0FBN0csQ0FBaEI7O29CQXNyQmVqTSxPIiwiZmlsZSI6IlZpZXcuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCBfQWN0aW9uTWl4aW4gZnJvbSAnLi9fQWN0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX0N1c3RvbWl6YXRpb25NaXhpbiBmcm9tICcuL19DdXN0b21pemF0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuL19UZW1wbGF0ZWQnO1xyXG5pbXBvcnQgQWRhcHRlciBmcm9tICcuL01vZGVscy9BZGFwdGVyJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcbmltcG9ydCB7IGluc2VydEhpc3RvcnkgfSBmcm9tICcuL2FjdGlvbnMvaW5kZXgnO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3ZpZXcnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuVmlld1xyXG4gKiBAY2xhc3NkZXNjIFZpZXcgaXMgdGhlIHJvb3QgQ2xhc3MgZm9yIGFsbCB2aWV3cyBhbmQgaW5jb3Jwb3JhdGVzIGFsbCB0aGUgYmFzZSBmZWF0dXJlcyxcclxuICogZXZlbnRzLCBhbmQgaG9va3MgbmVlZGVkIHRvIHN1Y2Nlc3NmdWxseSByZW5kZXIsIGhpZGUsIHNob3csIGFuZCB0cmFuc2l0aW9uLlxyXG4gKlxyXG4gKiBBbGwgVmlld3MgYXJlIGRpaml0IFdpZGdldHMsIG5hbWVseSB1dGlsaXppbmcgaXRzOiB3aWRnZXRUZW1wbGF0ZSwgY29ubmVjdGlvbnMsIGFuZCBhdHRyaWJ1dGVNYXBcclxuICogQG1peGlucyBhcmdvcy5fQWN0aW9uTWl4aW5cclxuICogQG1peGlucyBhcmdvcy5fQ3VzdG9taXphdGlvbk1peGluXHJcbiAqIEBtaXhpbnMgYXJnb3MuX1RlbXBsYXRlZFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlZpZXcnLCBbX1dpZGdldEJhc2UsIF9BY3Rpb25NaXhpbiwgX0N1c3RvbWl6YXRpb25NaXhpbiwgX1RlbXBsYXRlZF0sIC8qKiBAbGVuZHMgYXJnb3MuVmlldyMgKi97XHJcbiAgLyoqXHJcbiAgICogVGhpcyBtYXAgcHJvdmlkZXMgcXVpY2sgYWNjZXNzIHRvIEhUTUwgcHJvcGVydGllcywgbW9zdCBub3RhYmx5IHRoZSBzZWxlY3RlZCBwcm9wZXJ0eSBvZiB0aGUgY29udGFpbmVyXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICB0aXRsZToge1xyXG4gICAgICBub2RlOiAnZG9tTm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICdkYXRhLXRpdGxlJyxcclxuICAgIH0sXHJcbiAgICBzZWxlY3RlZDoge1xyXG4gICAgICBub2RlOiAnZG9tTm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICdzZWxlY3RlZCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGhlIHdpZGdldFRlbXBsYXRlIGlzIGEgU2ltcGxhdGUgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIG1haW4gSFRNTCBtYXJrdXAgb2YgdGhlIFZpZXcuXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8dWwgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JT0gJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cIm92ZXJ0aHJvdyB7JT0gJC5jbHMgJX1cIj4nLFxyXG4gICAgJzwvdWw+JyxcclxuICBdKSxcclxuICBfbG9hZENvbm5lY3Q6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogVGhlIGlkIGlzIHVzZWQgdG8gdW5pcXVlbHkgZGVmaW5lIGEgdmlldyBhbmQgaXMgdXNlZCBpbiBuYXZpZ2F0aW5nLCBoaXN0b3J5IGFuZCBmb3IgSFRNTCBtYXJrdXAuXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICovXHJcbiAgaWQ6ICdnZW5lcmljX3ZpZXcnLFxyXG4gIC8qKlxyXG4gICAqIFRoZSB0aXRsZVRleHQgc3RyaW5nIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgdG9wIHRvb2xiYXIgZHVyaW5nIHtAbGluayAjc2hvdyBzaG93fS5cclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICAvKipcclxuICAgKiBUaGlzIHZpZXdzIHRvb2xiYXIgbGF5b3V0IHRoYXQgZGVmaW5lcyBhbGwgdG9vbGJhciBpdGVtcyBpbiBhbGwgdG9vbGJhcnMuXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICovXHJcbiAgdG9vbHM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogTWF5IGJlIGRlZmluZWQgYWxvbmcgd2l0aCB7QGxpbmsgQXBwI2hhc0FjY2Vzc1RvIEFwcGxpY2F0aW9uIGhhc0FjY2Vzc1RvfSB0byBpbmNvcnBvcmF0ZSBWaWV3IHJlc3RyaWN0aW9ucy5cclxuICAgKi9cclxuICBzZWN1cml0eTogbnVsbCxcclxuICAvKipcclxuICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmEgQXBwIG9iamVjdFxyXG4gICAqL1xyXG4gIGFwcDogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJlZCBtb2RlbCBuYW1lIHRvIHVzZS5cclxuICAgKi9cclxuICBtb2RlbE5hbWU6ICcnLFxyXG5cclxuICAvKipcclxuICAgKiBWaWV3IHR5cGUgKGRldGFpbCwgZWRpdCwgbGlzdCwgZXRjKVxyXG4gICAqL1xyXG4gIHZpZXdUeXBlOiAndmlldycsXHJcbiAgLyoqXHJcbiAgICogTWF5IGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgc2VydmljZSBuYW1lIHRvIHVzZSBmb3IgZGF0YSByZXF1ZXN0cy4gU2V0dGluZyBmYWxzZSB3aWxsIGZvcmNlIHRoZSB1c2Ugb2YgdGhlIGRlZmF1bHQgc2VydmljZS5cclxuICAgKiBAcHJvcGVydHkge1N0cmluZy9Cb29sZWFufVxyXG4gICAqL1xyXG4gIHNlcnZpY2VOYW1lOiBmYWxzZSxcclxuICBjb25uZWN0aW9uTmFtZTogZmFsc2UsXHJcbiAgY29ubmVjdGlvblN0YXRlOiBudWxsLFxyXG4gIGVuYWJsZU9mZmxpbmVTdXBwb3J0OiBmYWxzZSxcclxuICBwcmV2aW91c1N0YXRlOiBudWxsLFxyXG4gIGVuYWJsZUN1c3RvbWl6YXRpb25zOiB0cnVlLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBMb2NhbGl6ZWQgZXJyb3IgbWVzc2FnZXMuIE9uZSBnZW5lcmFsIGVycm9yIG1lc3NhZ2UsIGFuZCBtZXNzYWdlcyBieSBIVFRQIHN0YXR1cyBjb2RlLlxyXG4gICAqL1xyXG4gIGVycm9yVGV4dDoge1xyXG4gICAgZ2VuZXJhbDogcmVzb3VyY2UuZ2VuZXJhbCxcclxuICAgIHN0YXR1czoge30sXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBIdHRwIEVycm9yIFN0YXR1cyBjb2Rlcy4gU2VlIGh0dHA6Ly93d3cudzMub3JnL1Byb3RvY29scy9yZmMyNjE2L3JmYzI2MTYtc2VjMTAuaHRtbFxyXG4gICAqL1xyXG4gIEhUVFBfU1RBVFVTOiB7XHJcbiAgICBCQURfUkVRVUVTVDogNDAwLFxyXG4gICAgVU5BVVRIT1JJWkVEOiA0MDEsXHJcbiAgICBQQVlNRU5UX1JFUVVJUkVEOiA0MDIsXHJcbiAgICBGT1JCSURERU46IDQwMyxcclxuICAgIE5PVF9GT1VORDogNDA0LFxyXG4gICAgTUVUSE9EX05PVF9BTExPV0VEOiA0MDUsXHJcbiAgICBOT1RfQUNDRVBUQUJMRTogNDA2LFxyXG4gICAgUFJPWFlfQVVUSF9SRVFVSVJFRDogNDA3LFxyXG4gICAgUkVRVUVTVF9USU1FT1VUOiA0MDgsXHJcbiAgICBDT05GTElDVDogNDA5LFxyXG4gICAgR09ORTogNDEwLFxyXG4gICAgTEVOR1RIX1JFUVVJUkVEOiA0MTEsXHJcbiAgICBQUkVDT05ESVRJT05fRkFJTEVEOiA0MTIsXHJcbiAgICBSRVFVRVNUX0VOVElUWV9UT09fTEFSR0U6IDQxMyxcclxuICAgIFJFUVVFU1RfVVJJX1RPT19MT05HOiA0MTQsXHJcbiAgICBVTlNVUFBPUlRFRF9NRURJQV9UWVBFOiA0MTUsXHJcbiAgICBSRVFVRVNURURfUkFOR0VfTk9UX1NBVElTRklBQkxFOiA0MTYsXHJcbiAgICBFWFBFQ1RBVElPTl9GQUlMRUQ6IDQxNyxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXl9IGVycm9ySGFuZGxlcnNcclxuICAgKiBBcnJheSBvZiBvYmplY3RzIHRoYXQgc2hvdWxkIGNvbnRhaW4gYSBuYW1lIHN0cmluZyBwcm9wZXJ0eSwgdGVzdCBmdW5jdGlvbiwgYW5kIGhhbmRsZSBmdW5jdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGVycm9ySGFuZGxlcnM6IG51bGwsXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuYXBwID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hcHApIHx8IHdpbmRvdy5BcHA7XHJcbiAgfSxcclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KG5vZGUpIHtcclxuICAgICQobm9kZSkuYXR0cignc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG4gIH0sXHJcbiAgdW5zZWxlY3Q6IGZ1bmN0aW9uIHVuc2VsZWN0KG5vZGUpIHtcclxuICAgICQobm9kZSkucmVtb3ZlQXR0cignc2VsZWN0ZWQnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBmcm9tIHtAbGluayBBcHAjX3ZpZXdUcmFuc2l0aW9uVG8gQXBwbGljYXRpb25zIHZpZXcgdHJhbnNpdGlvbiBoYW5kbGVyfSBhbmQgcmV0dXJuc1xyXG4gICAqIHRoZSBmdWxseSBjdXN0b21pemVkIHRvb2xiYXIgbGF5b3V0LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHRvb2xiYXIgbGF5b3V0XHJcbiAgICovXHJcbiAgZ2V0VG9vbHM6IGZ1bmN0aW9uIGdldFRvb2xzKCkge1xyXG4gICAgY29uc3QgdG9vbHMgPSB0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlVG9vbExheW91dCgpLCAndG9vbHMnKTtcclxuICAgIHRoaXMub25Ub29sTGF5b3V0Q3JlYXRlZCh0b29scyk7XHJcbiAgICByZXR1cm4gdG9vbHM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYWZ0ZXIgdG9vbEJhciBsYXlvdXQgaXMgY3JlYXRlZDtcclxuICAgKlxyXG4gICAqL1xyXG4gIG9uVG9vbExheW91dENyZWF0ZWQ6IGZ1bmN0aW9uIG9uVG9vbExheW91dENyZWF0ZWQoLyogdG9vbHMqLykge30sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgdG9vbCBsYXlvdXQgdGhhdCBkZWZpbmVzIGFsbCB0b29sYmFyIGl0ZW1zIGZvciB0aGUgdmlld1xyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHRvb2xiYXIgbGF5b3V0XHJcbiAgICovXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRvb2xzIHx8IHt9O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIG9uIGxvYWRpbmcgb2YgdGhlIGFwcGxpY2F0aW9uLlxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoc3RvcmUpIHtcclxuICAgIHRoaXMuaW5pdFN0b3JlKHN0b3JlKTtcclxuICAgIHRoaXMuc3RhcnR1cCgpO1xyXG4gICAgdGhpcy5pbml0Q29ubmVjdHMoKTtcclxuICAgIHRoaXMuaW5pdE1vZGVsKCk7XHJcbiAgfSxcclxuICBpbml0U3RvcmU6IGZ1bmN0aW9uIGluaXRTdG9yZShzdG9yZSkge1xyXG4gICAgdGhpcy5hcHBTdG9yZSA9IHN0b3JlO1xyXG4gICAgdGhpcy5hcHBTdG9yZS5zdWJzY3JpYmUodGhpcy5fb25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMpKTtcclxuICB9LFxyXG4gIF91cGRhdGVDb25uZWN0aW9uU3RhdGU6IGZ1bmN0aW9uIF91cGRhdGVDb25uZWN0aW9uU3RhdGUoc3RhdGUpIHtcclxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25TdGF0ZSA9PT0gc3RhdGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdE1vZGVsKCk7XHJcblxyXG4gICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLmNvbm5lY3Rpb25TdGF0ZTtcclxuICAgIHRoaXMuY29ubmVjdGlvblN0YXRlID0gc3RhdGU7XHJcbiAgICBpZiAob2xkU3RhdGUgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy5vbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZShzdGF0ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZTogZnVuY3Rpb24gb25Db25uZWN0aW9uU3RhdGVDaGFuZ2Uoc3RhdGUpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIH0sXHJcbiAgX29uU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uIF9vblN0YXRlQ2hhbmdlKCkge1xyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmFwcFN0b3JlLmdldFN0YXRlKCk7XHJcbiAgICB0aGlzLl91cGRhdGVDb25uZWN0aW9uU3RhdGUoc3RhdGUuc2RrLm9ubGluZSk7XHJcbiAgICB0aGlzLm9uU3RhdGVDaGFuZ2Uoc3RhdGUpO1xyXG4gICAgdGhpcy5wcmV2aW91c1N0YXRlID0gc3RhdGU7XHJcbiAgfSxcclxuICBvblN0YXRlQ2hhbmdlOiBmdW5jdGlvbiBvblN0YXRlQ2hhbmdlKHZhbCkge30sIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAvKipcclxuICAgKiBJbml0aWFsaXplcyB0aGUgbW9kZWwgaW5zdGFuY2UgdGhhdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBjdXJyZW50IHZpZXcuXHJcbiAgICovXHJcbiAgaW5pdE1vZGVsOiBmdW5jdGlvbiBpbml0TW9kZWwoKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKTtcclxuICAgIGlmIChtb2RlbCkge1xyXG4gICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICB0aGlzLl9tb2RlbC5pbml0KCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIGEgbW9kZWwgZm9yIHRoZSB2aWV3LlxyXG4gICAqL1xyXG4gIGdldE1vZGVsOiBmdW5jdGlvbiBnZXRNb2RlbCgpIHtcclxuICAgIGNvbnN0IG1vZGVsID0gQWRhcHRlci5nZXRNb2RlbCh0aGlzLm1vZGVsTmFtZSk7XHJcbiAgICByZXR1cm4gbW9kZWw7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFc3RhYmxpc2hlcyB0aGlzIHZpZXdzIGNvbm5lY3Rpb25zIHRvIHZhcmlvdXMgZXZlbnRzXHJcbiAgICovXHJcbiAgaW5pdENvbm5lY3RzOiBmdW5jdGlvbiBpbml0Q29ubmVjdHMoKSB7XHJcbiAgICB0aGlzLl9sb2FkQ29ubmVjdCA9IHRoaXMuY29ubmVjdCh0aGlzLmRvbU5vZGUsICdvbmxvYWQnLCB0aGlzLl9vbkxvYWQpO1xyXG4gIH0sXHJcbiAgX29uTG9hZDogZnVuY3Rpb24gX29uTG9hZChldnQsIGVsLCBvKSB7XHJcbiAgICB0aGlzLmRpc2Nvbm5lY3QodGhpcy5fbG9hZENvbm5lY3QpO1xyXG4gICAgdGhpcy5sb2FkKGV2dCwgZWwsIG8pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIG9uY2UgdGhlIGZpcnN0IHRpbWUgdGhlIHZpZXcgaXMgYWJvdXQgdG8gYmUgdHJhbnNpdGlvbmVkIHRvLlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgbG9hZDogZnVuY3Rpb24gbG9hZCgpIHtcclxuICAgIC8vIHRvZG86IHJlbW92ZSBsb2FkIGVudGlyZWx5P1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGluIHtAbGluayAjc2hvdyBzaG93KCl9IGJlZm9yZSByb3V0ZSBpcyBpbnZva2VkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE5hdmlnYXRpb24gb3B0aW9ucyBwYXNzZWQgZnJvbSB0aGUgcHJldmlvdXMgdmlldy5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGluZGljYXRlcyB2aWV3IG5lZWRzIHRvIGJlIHJlZnJlc2hlZC5cclxuICAgKi9cclxuICByZWZyZXNoUmVxdWlyZWRGb3I6IGZ1bmN0aW9uIHJlZnJlc2hSZXF1aXJlZEZvcihvcHRpb25zKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIHJldHVybiAhIW9wdGlvbnM7IC8vIGlmIG9wdGlvbnMgcHJvdmlkZWQsIHRoZW4gcmVmcmVzaFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgZXJyb3IgaGFuZGxlcnNcclxuICAgKi9cclxuICBjcmVhdGVFcnJvckhhbmRsZXJzOiBmdW5jdGlvbiBjcmVhdGVFcnJvckhhbmRsZXJzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JIYW5kbGVycyB8fCBbXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFN0YXJ0cyBtYXRjaGluZyBhbmQgZXhlY3V0aW5nIGVycm9ySGFuZGxlcnMuXHJcbiAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgRXJyb3IgdG8gcGFzcyB0byB0aGUgZXJyb3JIYW5kbGVyc1xyXG4gICAqL1xyXG4gIGhhbmRsZUVycm9yOiBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvcikge1xyXG4gICAgaWYgKCFlcnJvcikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbm9vcCgpIHt9XHJcblxyXG4gICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMuZXJyb3JIYW5kbGVycy5maWx0ZXIoKGhhbmRsZXIpID0+IHtcclxuICAgICAgcmV0dXJuIGhhbmRsZXIudGVzdCAmJiBoYW5kbGVyLnRlc3QuY2FsbCh0aGlzLCBlcnJvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsZW4gPSBtYXRjaGVzLmxlbmd0aDtcclxuXHJcbiAgICBjb25zdCBnZXROZXh0ID0gZnVuY3Rpb24gZ2V0TmV4dChpbmRleCkge1xyXG4gICAgICAvLyBuZXh0KCkgY2hhaW4gaGFzIGVuZGVkLCByZXR1cm4gYSBuby1vcCBzbyBjYWxsaW5nIG5leHQoKSBpbiB0aGUgbGFzdCBjaGFpbiB3b24ndCBlcnJvclxyXG4gICAgICBpZiAoaW5kZXggPT09IGxlbikge1xyXG4gICAgICAgIHJldHVybiBub29wO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZXR1cm4gYSBjbG9zdXJlIHdpdGggaW5kZXggYW5kIG1hdGNoZXMgY2FwdHVyZWQuXHJcbiAgICAgIC8vIFRoZSBoYW5kbGUgZnVuY3Rpb24gY2FuIGNhbGwgaXRzIFwibmV4dFwiIHBhcmFtIHRvIGNvbnRpbnVlIHRoZSBjaGFpbi5cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dEhhbmRsZXIgPSBtYXRjaGVzW2luZGV4XTtcclxuICAgICAgICBjb25zdCBuZXh0Rm4gPSBuZXh0SGFuZGxlciAmJiBuZXh0SGFuZGxlci5oYW5kbGU7XHJcblxyXG4gICAgICAgIG5leHRGbi5jYWxsKHRoaXMsIGVycm9yLCBnZXROZXh0LmNhbGwodGhpcywgaW5kZXggKyAxKSk7XHJcbiAgICAgIH0uYmluZCh0aGlzKTtcclxuICAgIH0uYmluZCh0aGlzKTtcclxuXHJcbiAgICBpZiAobGVuID4gMCAmJiBtYXRjaGVzWzBdLmhhbmRsZSkge1xyXG4gICAgICAvLyBTdGFydCB0aGUgaGFuZGxlIGNoYWluLCB0aGUgaGFuZGxlIGNhbiBjYWxsIG5leHQoKSB0byBjb250aW51ZSB0aGUgaXRlcmF0aW9uXHJcbiAgICAgIG1hdGNoZXNbMF0uaGFuZGxlLmNhbGwodGhpcywgZXJyb3IsIGdldE5leHQuY2FsbCh0aGlzLCAxKSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBnZW5lcmFsIGVycm9yIG1lc3NhZ2UsIG9yIHRoZSBlcnJvciBtZXNzYWdlIGZvciB0aGUgc3RhdHVzIGNvZGUuXHJcbiAgICovXHJcbiAgZ2V0RXJyb3JNZXNzYWdlOiBmdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoZXJyb3IpIHtcclxuICAgIGxldCBtZXNzYWdlID0gdGhpcy5lcnJvclRleHQuZ2VuZXJhbDtcclxuXHJcbiAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgbWVzc2FnZSA9IHRoaXMuZXJyb3JUZXh0LnN0YXR1c1tlcnJvci5zdGF0dXNdIHx8IHRoaXMuZXJyb3JUZXh0LmdlbmVyYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTaG91bGQgcmVmcmVzaCB0aGUgdmlldywgc3VjaCBhcyBidXQgbm90IGxpbWl0ZWQgdG86XHJcbiAgICogRW1wdHlpbmcgbm9kZXMsIHJlcXVlc3RpbmcgZGF0YSwgcmVuZGVyaW5nIG5ldyBjb250ZW50XHJcbiAgICovXHJcbiAgcmVmcmVzaDogZnVuY3Rpb24gcmVmcmVzaCgpIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBvbkJlZm9yZVRyYW5zaXRpb25Bd2F5IGV2ZW50LlxyXG4gICAqIEBwYXJhbSBzZWxmXHJcbiAgICovXHJcbiAgb25CZWZvcmVUcmFuc2l0aW9uQXdheTogZnVuY3Rpb24gb25CZWZvcmVUcmFuc2l0aW9uQXdheSgvKiBzZWxmKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBvbkJlZm9yZVRyYW5zaXRpb25UbyBldmVudC5cclxuICAgKiBAcGFyYW0gc2VsZlxyXG4gICAqL1xyXG4gIG9uQmVmb3JlVHJhbnNpdGlvblRvOiBmdW5jdGlvbiBvbkJlZm9yZVRyYW5zaXRpb25UbygvKiBzZWxmKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBvblRyYW5zaXRpb25Bd2F5IGV2ZW50LlxyXG4gICAqIEBwYXJhbSBzZWxmXHJcbiAgICovXHJcbiAgb25UcmFuc2l0aW9uQXdheTogZnVuY3Rpb24gb25UcmFuc2l0aW9uQXdheSgvKiBzZWxmKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBvblRyYW5zaXRpb25UbyBldmVudC5cclxuICAgKiBAcGFyYW0gc2VsZlxyXG4gICAqL1xyXG4gIG9uVHJhbnNpdGlvblRvOiBmdW5jdGlvbiBvblRyYW5zaXRpb25UbygvKiBzZWxmKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBvbkFjdGl2YXRlIGV2ZW50LlxyXG4gICAqIEBwYXJhbSBzZWxmXHJcbiAgICovXHJcbiAgb25BY3RpdmF0ZTogZnVuY3Rpb24gb25BY3RpdmF0ZSgvKiBzZWxmKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBvblNob3cgZXZlbnQuXHJcbiAgICogQHBhcmFtIHNlbGZcclxuICAgKi9cclxuICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygvKiBzZWxmKi8pIHt9LFxyXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiBhY3RpdmF0ZSh0YWcsIGRhdGEpIHtcclxuICAgIC8vIHRvZG86IHVzZSB0YWcgb25seT9cclxuICAgIGlmIChkYXRhICYmIHRoaXMucmVmcmVzaFJlcXVpcmVkRm9yKGRhdGEub3B0aW9ucykpIHtcclxuICAgICAgdGhpcy5yZWZyZXNoUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IChkYXRhICYmIGRhdGEub3B0aW9ucykgfHwgdGhpcy5vcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGUpIHtcclxuICAgICAgdGhpcy5zZXQoJ3RpdGxlJywgdGhpcy5vcHRpb25zLnRpdGxlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0KCd0aXRsZScsIHRoaXMudGl0bGVUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQWN0aXZhdGUodGhpcyk7XHJcbiAgfSxcclxuICBfZ2V0U2Nyb2xsZXJBdHRyOiBmdW5jdGlvbiBfZ2V0U2Nyb2xsZXJBdHRyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsZXJOb2RlIHx8IHRoaXMuZG9tTm9kZTtcclxuICB9LFxyXG4gIF90cmFuc2l0aW9uT3B0aW9uczogbnVsbCxcclxuICAvKipcclxuICAgKiBTaG93cyB0aGUgdmlldyB1c2luZyBwYWdlanMgaW4gb3JkZXIgdG8gdHJhbnNpdGlvbiB0byB0aGUgbmV3IGVsZW1lbnQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG5hdmlnYXRpb24gb3B0aW9ucyBwYXNzZWQgZnJvbSB0aGUgcHJldmlvdXMgdmlldy5cclxuICAgKiBAcGFyYW0gdHJhbnNpdGlvbk9wdGlvbnMge09iamVjdH0gT3B0aW9uYWwgdHJhbnNpdGlvbiBvYmplY3QgdGhhdCBpcyBmb3J3YXJkZWQgdG8gb3Blbi5cclxuICAgKi9cclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMsIHRyYW5zaXRpb25PcHRpb25zKSB7XHJcbiAgICB0aGlzLmVycm9ySGFuZGxlcnMgPSB0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlRXJyb3JIYW5kbGVycygpLCAnZXJyb3JIYW5kbGVycycpO1xyXG5cclxuICAgIGlmICh0aGlzLm9uU2hvdyh0aGlzKSA9PT0gZmFsc2UpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlZnJlc2hSZXF1aXJlZEZvcihvcHRpb25zKSkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB0aGlzLm9wdGlvbnMgfHwge307XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZSkge1xyXG4gICAgICB0aGlzLnNldCgndGl0bGUnLCB0aGlzLm9wdGlvbnMudGl0bGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXQoJ3RpdGxlJywgdGhpcy50aXRsZVRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRhZyA9IHRoaXMuZ2V0VGFnKCk7XHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRDb250ZXh0KCk7XHJcblxyXG4gICAgY29uc3QgdG8gPSBsYW5nLm1peGluKHRyYW5zaXRpb25PcHRpb25zIHx8IHt9LCB7XHJcbiAgICAgIHRhZyxcclxuICAgICAgZGF0YSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fdHJhbnNpdGlvbk9wdGlvbnMgPSB0bztcclxuICAgIHBhZ2UodGhpcy5idWlsZFJvdXRlKCkpO1xyXG4gIH0sXHJcbiAgaGFzaFByZWZpeDogJyMhJyxcclxuICBjdXJyZW50SGFzaDogJycsXHJcbiAgdHJhbnNpdGlvbkNvbXBsZXRlOiBmdW5jdGlvbiB0cmFuc2l0aW9uQ29tcGxldGUoX3BhZ2UsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLnRyYWNrICE9PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRIYXNoID0gbG9jYXRpb24uaGFzaDtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLnRyaW1tZWQgIT09IHRydWUpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgaGFzaDogdGhpcy5jdXJyZW50SGFzaCxcclxuICAgICAgICAgIHBhZ2U6IHRoaXMuaWQsXHJcbiAgICAgICAgICB0YWc6IG9wdGlvbnMudGFnLFxyXG4gICAgICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgQXBwLmNvbnRleHQuaGlzdG9yeS5wdXNoKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuYXBwU3RvcmUuZGlzcGF0Y2goaW5zZXJ0SGlzdG9yeShkYXRhKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHRyYW5zaXRpb246IGZ1bmN0aW9uIHRyYW5zaXRpb24oZnJvbSwgdG8sIG9wdGlvbnMpIHtcclxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xyXG4gICAgICB0aGlzLnRyYW5zaXRpb25Db21wbGV0ZSh0bywgb3B0aW9ucyk7XHJcbiAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbicpO1xyXG5cclxuICAgICAgJChmcm9tKS50cmlnZ2VyKHtcclxuICAgICAgICBvdXQ6IHRydWUsXHJcbiAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgICBkYXRhOiBvcHRpb25zLmRhdGEsXHJcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6ICdhZnRlcnRyYW5zaXRpb24nLFxyXG4gICAgICB9KTtcclxuICAgICAgJCh0bykudHJpZ2dlcih7XHJcbiAgICAgICAgb3V0OiBmYWxzZSxcclxuICAgICAgICB0YWc6IG9wdGlvbnMudGFnLFxyXG4gICAgICAgIGRhdGE6IG9wdGlvbnMuZGF0YSxcclxuICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgdHlwZTogJ2FmdGVydHJhbnNpdGlvbicsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuY29tcGxldGUpIHtcclxuICAgICAgICBvcHRpb25zLmNvbXBsZXRlKGZyb20sIHRvLCBvcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcygndHJhbnNpdGlvbicpO1xyXG5cclxuICAgIC8vIGRpc3BhdGNoIGFuICdzaG93JyBldmVudCB0byBsZXQgdGhlIHBhZ2UgYmUgYXdhcmUgdGhhdCBpcyBiZWluZyBzaG93IGFzIHRoZSByZXN1bHQgb2YgYW4gZXh0ZXJuYWxcclxuICAgIC8vIGV2ZW50IChpLmUuIGJyb3dzZXIgYmFjay9mb3J3YXJkIG5hdmlnYXRpb24pLlxyXG4gICAgaWYgKG9wdGlvbnMuZXh0ZXJuYWwpIHtcclxuICAgICAgJCh0bykudHJpZ2dlcih7XHJcbiAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgICBkYXRhOiBvcHRpb25zLmRhdGEsXHJcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6ICdzaG93JyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJChmcm9tKS50cmlnZ2VyKHtcclxuICAgICAgb3V0OiB0cnVlLFxyXG4gICAgICB0YWc6IG9wdGlvbnMudGFnLFxyXG4gICAgICBkYXRhOiBvcHRpb25zLmRhdGEsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIHR5cGU6ICdiZWZvcmV0cmFuc2l0aW9uJyxcclxuICAgIH0pO1xyXG5cclxuICAgICQodG8pLnRyaWdnZXIoe1xyXG4gICAgICBvdXQ6IGZhbHNlLFxyXG4gICAgICB0YWc6IG9wdGlvbnMudGFnLFxyXG4gICAgICBkYXRhOiBvcHRpb25zLmRhdGEsXHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIHR5cGU6ICdiZWZvcmV0cmFuc2l0aW9uJyxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudW5zZWxlY3QoZnJvbSk7XHJcbiAgICB0aGlzLnNlbGVjdCh0byk7XHJcbiAgICBjb21wbGV0ZS5hcHBseSh0aGlzKTtcclxuICB9LFxyXG4gIHNldFByaW1hcnlUaXRsZTogZnVuY3Rpb24gc2V0UHJpbWFyeVRpdGxlKCkge1xyXG4gICAgQXBwLnNldFByaW1hcnlUaXRsZSh0aGlzLmdldCgndGl0bGUnKSk7XHJcbiAgfSxcclxuICAvKipcclxuICAqIEF2YWlsYWJsZSBPcHRpb25zOlxyXG4gICogICBob3Jpem9udGFsOiBUcnVlIGlmIHRoZSB0cmFuc2l0aW9uIGlzIGhvcml6b250YWwsIEZhbHNlIG90aGVyd2lzZS5cclxuICAqICAgcmV2ZXJzZTogVHJ1ZSBpZiB0aGUgdHJhbnNpdGlvbiBpcyBhIHJldmVyc2UgdHJhbnNpdGlvbiAocmlnaHQvZG93biksIEZhbHNlIG90aGVyd2lzZS5cclxuICAqICAgdHJhY2s6IEZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uIHNob3VsZCBub3QgYmUgdHJhY2tlZCBpbiBoaXN0b3J5LCBUcnVlIG90aGVyd2lzZS5cclxuICAqICAgdXBkYXRlOiBGYWxzZSBpZiB0aGUgdHJhbnNpdGlvbiBzaG91bGQgbm90IHVwZGF0ZSB0aXRsZSBhbmQgYmFjayBidXR0b24sIFRydWUgb3RoZXJ3aXNlLlxyXG4gICogICBzY3JvbGw6IEZhbHNlIGlmIHRoZSB0cmFuc2l0aW9uIHNob3VsZCBub3Qgc2Nyb2xsIHRvIHRoZSB0b3AsIFRydWUgb3RoZXJ3aXNlLlxyXG4gICovXHJcbiAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHtcclxuICAgIGNvbnN0IHAgPSB0aGlzLmRvbU5vZGU7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fdHJhbnNpdGlvbk9wdGlvbnMgfHwge307XHJcblxyXG4gICAgaWYgKCFwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFByaW1hcnlUaXRsZSgpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLnRyYWNrICE9PSBmYWxzZSkge1xyXG4gICAgICBjb25zdCBjb3VudCA9IEFwcC5jb250ZXh0Lmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICBsZXQgcG9zaXRpb24gPSBjb3VudCAtIDE7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5yZXR1cm5Ubykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZXR1cm5UbyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgZm9yIChwb3NpdGlvbiA9IGNvdW50IC0gMTsgcG9zaXRpb24gPj0gMDsgcG9zaXRpb24tLSkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZXR1cm5UbyhBcHAuY29udGV4dC5oaXN0b3J5W3Bvc2l0aW9uXSkpIHtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZXR1cm5UbyA8IDApIHtcclxuICAgICAgICAgIHBvc2l0aW9uID0gKGNvdW50IC0gMSkgKyBvcHRpb25zLnJldHVyblRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID4gLTEpIHtcclxuICAgICAgICAgIC8vIHdlIGZpeCB1cCB0aGUgaGlzdG9yeSwgYnV0IGRvIG5vdCBmbGFnIGFzIHRyaW1tZWQsIHNpbmNlIHdlIGRvIHdhbnQgdGhlIG5ldyB2aWV3IHRvIGJlIHB1c2hlZC5cclxuICAgICAgICAgIEFwcC5jb250ZXh0Lmhpc3RvcnkgPSBBcHAuY29udGV4dC5oaXN0b3J5LnNwbGljZSgwLCBwb3NpdGlvbiArIDEpO1xyXG5cclxuICAgICAgICAgIHRoaXMuY3VycmVudEhhc2ggPSBBcHAuY29udGV4dC5oaXN0b3J5W0FwcC5jb250ZXh0Lmhpc3RvcnkubGVuZ3RoIC0gMV0gJiYgQXBwLmNvbnRleHQuaGlzdG9yeVtBcHAuY29udGV4dC5oaXN0b3J5Lmxlbmd0aCAtIDFdLmhhc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvcHRpb25zLnJldHVyblRvID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRvbid0IGF1dG8tc2Nyb2xsIGJ5IGRlZmF1bHQgaWYgcmV2ZXJzaW5nXHJcbiAgICBpZiAob3B0aW9ucy5yZXZlcnNlICYmIHR5cGVvZiBvcHRpb25zLnNjcm9sbCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgb3B0aW9ucy5zY3JvbGwgPSAhb3B0aW9ucy5yZXZlcnNlO1xyXG4gICAgfVxyXG5cclxuICAgICQocCkudHJpZ2dlcih7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICB0eXBlOiAnbG9hZCcsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBmcm9tID0gQXBwLmdldEN1cnJlbnRQYWdlKCk7XHJcblxyXG4gICAgaWYgKGZyb20pIHtcclxuICAgICAgJChmcm9tKS50cmlnZ2VyKHtcclxuICAgICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6ICdibHVyJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgQXBwLnNldEN1cnJlbnRQYWdlKHApO1xyXG5cclxuICAgICQocCkudHJpZ2dlcih7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICB0eXBlOiAnZm9jdXMnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGZyb20gJiYgJChwKS5hdHRyKCdzZWxlY3RlZCcpICE9PSAndHJ1ZScpIHtcclxuICAgICAgaWYgKG9wdGlvbnMucmV2ZXJzZSkge1xyXG4gICAgICAgICQocCkudHJpZ2dlcih7XHJcbiAgICAgICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgICAgICB0eXBlOiAndW5sb2FkJyxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LnNldFRpbWVvdXQodGhpcy50cmFuc2l0aW9uLmJpbmQodGhpcyksIEFwcC5jaGVja09yaWVudGF0aW9uVGltZSwgZnJvbSwgcCwgb3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKHApLnRyaWdnZXIoe1xyXG4gICAgICAgIG91dDogZmFsc2UsXHJcbiAgICAgICAgdGFnOiBvcHRpb25zLnRhZyxcclxuICAgICAgICBkYXRhOiBvcHRpb25zLmRhdGEsXHJcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6ICdiZWZvcmV0cmFuc2l0aW9uJyxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdChwKTtcclxuXHJcbiAgICAgIHRoaXMudHJhbnNpdGlvbkNvbXBsZXRlKHAsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgJChwKS50cmlnZ2VyKHtcclxuICAgICAgICBvdXQ6IGZhbHNlLFxyXG4gICAgICAgIHRhZzogb3B0aW9ucy50YWcsXHJcbiAgICAgICAgZGF0YTogb3B0aW9ucy5kYXRhLFxyXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgICB0eXBlOiAnYWZ0ZXJ0cmFuc2l0aW9uJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHBhbmRzIHRoZSBwYXNzZWQgZXhwcmVzc2lvbiBpZiBpdCBpcyBhIGZ1bmN0aW9uLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL0Z1bmN0aW9ufSBleHByZXNzaW9uIFJldHVybnMgc3RyaW5nIGRpcmVjdGx5LCBpZiBmdW5jdGlvbiBpdCBpcyBjYWxsZWQgYW5kIHRoZSByZXN1bHQgcmV0dXJuZWQuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgZXhwcmVzc2lvbi5cclxuICAgKi9cclxuICBleHBhbmRFeHByZXNzaW9uOiBmdW5jdGlvbiBleHBhbmRFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcclxuICAgIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gZXhwcmVzc2lvbi5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgdHJhbnNpdGlvbmVkIChzbGlkZSBhbmltYXRpb24gY29tcGxldGUpIHRvLlxyXG4gICAqL1xyXG4gIGJlZm9yZVRyYW5zaXRpb25UbzogZnVuY3Rpb24gYmVmb3JlVHJhbnNpdGlvblRvKCkge1xyXG4gICAgdGhpcy5vbkJlZm9yZVRyYW5zaXRpb25Ubyh0aGlzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgdHJhbnNpdGlvbmVkIChzbGlkZSBhbmltYXRpb24gY29tcGxldGUpIGF3YXkgZnJvbS5cclxuICAgKi9cclxuICBiZWZvcmVUcmFuc2l0aW9uQXdheTogZnVuY3Rpb24gYmVmb3JlVHJhbnNpdGlvbkF3YXkoKSB7XHJcbiAgICB0aGlzLm9uQmVmb3JlVHJhbnNpdGlvbkF3YXkodGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIHZpZXcgaGFzIGJlZW4gdHJhbnNpdGlvbmVkIChzbGlkZSBhbmltYXRpb24gY29tcGxldGUpIHRvLlxyXG4gICAqL1xyXG4gIHRyYW5zaXRpb25UbzogZnVuY3Rpb24gdHJhbnNpdGlvblRvKCkge1xyXG4gICAgaWYgKHRoaXMucmVmcmVzaFJlcXVpcmVkKSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25UcmFuc2l0aW9uVG8odGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIHZpZXcgaGFzIGJlZW4gdHJhbnNpdGlvbmVkIChzbGlkZSBhbmltYXRpb24gY29tcGxldGUpIGF3YXkgZnJvbS5cclxuICAgKi9cclxuICB0cmFuc2l0aW9uQXdheTogZnVuY3Rpb24gdHJhbnNpdGlvbkF3YXkoKSB7XHJcbiAgICB0aGlzLm9uVHJhbnNpdGlvbkF3YXkodGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwcmltYXJ5IFNEYXRhU2VydmljZSBpbnN0YW5jZSBmb3IgdGhlIHZpZXcuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTZXJ2aWNlIGluc3RhbmNlLlxyXG4gICAqL1xyXG4gIGdldFNlcnZpY2U6IGZ1bmN0aW9uIGdldFNlcnZpY2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hcHAuZ2V0U2VydmljZSh0aGlzLnNlcnZpY2VOYW1lKTsgLyogaWYgZmFsc2UgaXMgcGFzc2VkLCB0aGUgZGVmYXVsdCBzZXJ2aWNlIHdpbGwgYmUgcmV0dXJuZWQgKi9cclxuICB9LFxyXG4gIGdldENvbm5lY3Rpb246IGZ1bmN0aW9uIGdldENvbm5lY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRTZXJ2aWNlKCk7XHJcbiAgfSxcclxuICBnZXRUYWc6IGZ1bmN0aW9uIGdldFRhZygpIHt9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIG9wdGlvbnMgdXNlZCBmb3IgdGhlIFZpZXcge0BsaW5rICNnZXRDb250ZXh0IGdldENvbnRleHQoKX0uXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPcHRpb25zIHRvIGJlIHVzZWQgZm9yIGNvbnRleHQuXHJcbiAgICovXHJcbiAgZ2V0T3B0aW9uc0NvbnRleHQ6IGZ1bmN0aW9uIGdldE9wdGlvbnNDb250ZXh0KCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMubmVnYXRlSGlzdG9yeSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5lZ2F0ZUhpc3Rvcnk6IHRydWUsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY29udGV4dCBvZiB0aGUgdmlldyB3aGljaCBpcyBhIHNtYWxsIHN1bW1hcnkgb2Yga2V5IHByb3BlcnRpZXMuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBWaXRhbCBWaWV3IHByb3BlcnRpZXMuXHJcbiAgICovXHJcbiAgZ2V0Q29udGV4dDogZnVuY3Rpb24gZ2V0Q29udGV4dCgpIHtcclxuICAgIC8vIHRvZG86IHNob3VsZCB3ZSB0cmFjayBvcHRpb25zP1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0T3B0aW9uc0NvbnRleHQoKSxcclxuICAgIH07XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBkZWZpbmVkIHNlY3VyaXR5LlxyXG4gICAqIEBwYXJhbSBhY2Nlc3NcclxuICAgKi9cclxuICBnZXRTZWN1cml0eTogZnVuY3Rpb24gZ2V0U2VjdXJpdHkoLyogYWNjZXNzKi8pIHtcclxuICAgIHJldHVybiB0aGlzLnNlY3VyaXR5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAqIFJvdXRlIHBhc3NlZCBpbnRvIHRoZSByb3V0ZXIuIFJlZ0V4IGV4cHJlc3Npb25zIGFyZSBhbHNvIGFjY2VwdGVkLlxyXG4gICovXHJcbiAgcm91dGU6ICcnLFxyXG4gIC8qKlxyXG4gICogR2V0cyB0aGUgcm91dGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdmlldy4gUmV0dXJucyB0aGlzLmlkIGlmIG5vIHJvdXRlIGlzIGRlZmluZWQuXHJcbiAgKi9cclxuICBnZXRSb3V0ZTogZnVuY3Rpb24gZ2V0Um91dGUoKSB7XHJcbiAgICBpZiAoKHR5cGVvZiB0aGlzLnJvdXRlID09PSAnc3RyaW5nJyAmJiB0aGlzLnJvdXRlLmxlbmd0aCA+IDApIHx8IHRoaXMucm91dGUgaW5zdGFuY2VvZiBSZWdFeHApIHtcclxuICAgICAgcmV0dXJuIHRoaXMucm91dGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaWQ7XHJcbiAgfSxcclxuICAvKipcclxuICAqIFNob3cgbWV0aG9kIGNhbGxzIHRoaXMgdG8gYnVpbGQgYSByb3V0ZSB0aGF0IGl0IGNhbiBuYXZpZ2F0ZSB0by4gSWYgeW91IGFkZCBhIGN1c3RvbSByb3V0ZSxcclxuICAqIHRoaXMgc2hvdWxkIGNoYW5nZSB0byBidWlsZCBhIHJvdXRlIHRoYXQgY2FuIG1hdGNoIHRoYXQuXHJcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gICovXHJcbiAgYnVpbGRSb3V0ZTogZnVuY3Rpb24gYnVpbGRSb3V0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgKiBGaXJlcyBmaXJzdCB3aGVuIGEgcm91dGUgaXMgdHJpZ2dlcmVkLiBBbnkgcHJlLWxvYWRpbmcgc2hvdWxkIGhhcHBlbiBoZXJlLlxyXG4gICogQHBhcmFtIHtPYmplY3R9IGN0eFxyXG4gICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dFxyXG4gICovXHJcbiAgcm91dGVMb2FkOiBmdW5jdGlvbiByb3V0ZUxvYWQoY3R4LCBuZXh0KSB7XHJcbiAgICBuZXh0KCk7XHJcbiAgfSxcclxuICAvKipcclxuICAqIEZpcmVzIHNlY29uZCB3aGVuIGEgcm91dGUgaXMgdHJpZ2dlcmVkLiBBbnkgcHJlLWxvYWRpbmcgc2hvdWxkIGhhcHBlbiBoZXJlLlxyXG4gICogQHBhcmFtIHtPYmplY3R9IGN0eFxyXG4gICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dFxyXG4gICovXHJcbiAgcm91dGVTaG93OiBmdW5jdGlvbiByb3V0ZVNob3coY3R4LCBuZXh0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIHRoaXMub3BlbigpO1xyXG4gIH0sXHJcbiAgLypcclxuICAqIFJlcXVpcmVkIGZvciBiaW5kaW5nIHRvIFNjcm9sbENvbnRhaW5lciB3aGljaCB1dGlsaXplcyBpU2Nyb2xsIHRoYXQgcmVxdWlyZXMgdG8gYmUgcmVmcmVzaGVkIHdoZW4gdGhlXHJcbiAgKiBjb250ZW50ICh0aGVyZWZvciBzY3JvbGxhYmxlIGFyZWEpIGNoYW5nZXMuXHJcbiAgKi9cclxuICBvbkNvbnRlbnRDaGFuZ2U6IGZ1bmN0aW9uIG9uQ29udGVudENoYW5nZSgpIHtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB2aWV3IGlzIGRpc2FibGVkLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59LlxyXG4gICAqL1xyXG4gIGlzRGlzYWJsZWQ6IGZ1bmN0aW9uIGlzRGlzYWJsZWQoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=