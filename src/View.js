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
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import on from 'dojo/on';
import _WidgetBase from 'dijit/_WidgetBase';
import _ActionMixin from './_ActionMixin';
import _CustomizationMixin from './_CustomizationMixin';
import _Templated from './_Templated';
import _ErrorHandleMixin from './_ErrorHandleMixin';
import Adapter from './Models/Adapter';
import getResource from './I18n';
import { insertHistory } from './actions';
import page from 'page';
import $ from 'jquery';

const resource = getResource('view');

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
const __class = declare('argos.View', [_WidgetBase, _ActionMixin, _CustomizationMixin, _Templated, _ErrorHandleMixin], {
  /**
   * This map provides quick access to HTML properties, most notably the selected property of the container
   */
  attributeMap: {
    title: {
      node: 'domNode',
      type: 'attribute',
      attribute: 'title',
    },
    selected: {
      node: 'domNode',
      type: 'attribute',
      attribute: 'selected',
    },
  },
  /**
   * The widgetTemplate is a Simplate that will be used as the main HTML markup of the View.
   * @property {Simplate}
   */
  widgetTemplate: new Simplate([
    '<ul id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow {%= $.cls %}">',
    '</ul>',
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
  constructor: function constructor(options) {
    this.app = (options && options.app) || window.App;
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
    const tools = this._createCustomizedLayout(this.createToolLayout(), 'tools');
    this.onToolLayoutCreated(tools);
    return tools;
  },
  /**
   * Called after toolBar layout is created;
   *
   */
  onToolLayoutCreated: function onToolLayoutCreated(/* tools*/) {},
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
  init: function init(state$, store) {
    this.startup();
    this.initConnects();
    this.initModel();
    this.initState(state$);
    this.appStore = store;
  },
  initState: function initState(state$) {
    this.state$ = state$;
    this.state$.subscribe(this._onStateChange.bind(this), this._onStateError.bind(this));
  },
  _updateConnectionState: function _updateConnectionState(state) {
    if (this.connectionState === state) {
      return;
    }

    this.initModel();

    const oldState = this.connectionState;
    this.connectionState = state;
    if (oldState !== null) {
      this.onConnectionStateChange(state);
    }
  },
  onConnectionStateChange: function onConnectionStateChange(state) { // eslint-disable-line
  },
  _onStateChange: function _onStateChange(val) {
    this._updateConnectionState(val.connectionState);
    this.onStateChange(val);
  },
  _onStateError: function _onStateError(error) {
    this.onStateError(error);
  },
  onStateChange: function onStateChange(val) {}, // eslint-disable-line
  onStateError: function onStateError(error) {}, // eslint-disable-line
  /**
   * Initializes the model instance that is returned with the current view.
   */
  initModel: function initModel() {
    const model = this.getModel();
    if (model) {
      this._model = model;
      this._model.init();
    }
  },
  /**
   * Returns a new instance of a model for the view.
   */
  getModel: function getModel() {
    const model = Adapter.getModel(this.modelName);
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
   * Should refresh the view, such as but not limited to:
   * Emptying nodes, requesting data, rendering new content
   */
  refresh: function refresh() {},
  /**
   * The onBeforeTransitionAway event.
   * @param self
   */
  onBeforeTransitionAway: function onBeforeTransitionAway(/* self*/) {},
  /**
   * The onBeforeTransitionTo event.
   * @param self
   */
  onBeforeTransitionTo: function onBeforeTransitionTo(/* self*/) {},
  /**
   * The onTransitionAway event.
   * @param self
   */
  onTransitionAway: function onTransitionAway(/* self*/) {},
  /**
   * The onTransitionTo event.
   * @param self
   */
  onTransitionTo: function onTransitionTo(/* self*/) {},
  /**
   * The onActivate event.
   * @param self
   */
  onActivate: function onActivate(/* self*/) {},
  /**
   * The onShow event.
   * @param self
   */
  onShow: function onShow(/* self*/) {},
  activate: function activate(tag, data) {
    // todo: use tag only?
    if (data && this.refreshRequiredFor(data.options)) {
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
      this.set('title', (this.get('title') || this.titleText));
    }

    const tag = this.getTag();
    const data = this.getContext();

    const to = lang.mixin(transitionOptions || {}, {
      tag,
      data,
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
        const data = {
          hash: this.currentHash,
          page: this.id,
          tag: options.tag,
          data: options.data,
        };
        App.context.history.push(data);
        this.appStore.dispatch(insertHistory(data));
      }
    }
  },
  transition: function transition(from, to, options) {
    function complete() {
      this.transitionComplete(to, options);
      $('body').removeClass('transition');

      App.startOrientationCheck();
      on.emit(from, 'aftertransition', {
        out: true,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });
      on.emit(to, 'aftertransition', {
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });

      if (options.complete) {
        options.complete(from, to, options);
      }
    }

    App.stopOrientationCheck();
    $('body').addClass('transition');

    // dispatch an 'show' event to let the page be aware that is being show as the result of an external
    // event (i.e. browser back/forward navigation).
    if (options.external) {
      on.emit(to, 'show', {
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });
    }

    on.emit(from, 'beforetransition', {
      out: true,
      tag: options.tag,
      data: options.data,
      bubbles: true,
      cancelable: true,
    });
    on.emit(to, 'beforetransition', {
      out: false,
      tag: options.tag,
      data: options.data,
      bubbles: true,
      cancelable: true,
    });

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
  open: function open() {
    const p = this.domNode;
    const options = this._transitionOptions || {};

    if (!p) {
      return;
    }

    App.setPrimaryTitle(this.get('title'));

    if (options.track !== false) {
      const count = App.context.history.length;
      const hash = location.hash;
      let position = -1;

      // do loop and trim
      for (position = count - 1; position >= 0; position--) {
        if (App.context.history[position].hash === hash) {
          break;
        }
      }

      if ((position > -1) && (position === (count - 2))) {
        // Added check if history item is just one back.

        App.context.history = App.context.history.splice(0, position + 1);

        this.currentHash = hash;

        // indicate that context.history has already been taken care of (i.e. nothing needs to be pushed).
        options.trimmed = true;
        // trim up the browser history
        // if the requested hash does not equal the current location hash, trim up history.
        // location hash will not match requested hash when show is called directly, but will match
        // for detected location changes (i.e. the back button).
      } else if (options.returnTo) {
        if (typeof options.returnTo === 'function') {
          for (position = count - 1; position >= 0; position--) {
            if (options.returnTo(App.context.history[position])) {
              break;
            }
          }
        } else if (options.returnTo < 0) {
          position = (count - 1) + options.returnTo;
        }

        if (position > -1) {
          // we fix up the history, but do not flag as trimmed, since we do want the new view to be pushed.
          App.context.history = App.context.history.splice(0, position + 1);

          this.currentHash = App.context.history[App.context.history.length - 1] && App.context.history[App.context.history.length - 1].hash;
        }
      }
    }

    // don't auto-scroll by default if reversing
    if (options.reverse && typeof options.scroll === 'undefined') {
      options.scroll = !options.reverse;
    }

    on.emit(p, 'load', {
      bubbles: false,
      cancelable: true,
    });

    const from = App.getCurrentPage();

    if (from) {
      on.emit(from, 'blur', {
        bubbles: false,
        cancelable: true,
      });
    }

    App.setCurrentPage(p);

    on.emit(p, 'focus', {
      bubbles: false,
      cancelable: true,
    });

    if (from && $(p).attr('selected') !== 'true') {
      if (options.reverse) {
        on.emit(p, 'unload', {
          bubbles: false,
          cancelable: true,
        });
      }

      window.setTimeout(this.transition.bind(this), App.checkOrientationTime, from, p, options);
    } else {
      on.emit(p, 'beforetransition', {
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });

      this.select(p);

      this.transitionComplete(p, options);

      on.emit(p, 'aftertransition', {
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
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
        negateHistory: true,
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
      options: this.getOptionsContext(),
    };
  },
  /**
   * Returns the defined security.
   * @param access
   */
  getSecurity: function getSecurity(/* access*/) {
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
    if ((typeof this.route === 'string' && this.route.length > 0) || this.route instanceof RegExp) {
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
  routeShow: function routeShow(ctx, next) { // eslint-disable-line
    this.open();
  },
 /*
  * Required for binding to ScrollContainer which utilizes iScroll that requires to be refreshed when the
  * content (therefor scrollable area) changes.
  */
  onContentChange: function onContentChange() {
  },
  /**
   * Returns true if view is disabled.
   * @return {Boolean}.
   */
  isDisabled: function isDisabled() {
    return false;
  },
});

lang.setObject('Sage.Platform.Mobile.View', __class);
export default __class;
