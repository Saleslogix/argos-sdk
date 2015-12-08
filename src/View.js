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
import _WidgetBase from 'dijit/_WidgetBase';
import _ActionMixin from './_ActionMixin';
import _CustomizationMixin from './_CustomizationMixin';
import _Templated from './_Templated';
import _ErrorHandleMixin from './_ErrorHandleMixin';
import Adapter from './Models/Adapter';
import getResource from './I18n';

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
    'title': {
      node: 'domNode',
      type: 'attribute',
      attribute: 'title',
    },
    'selected': {
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
  onToolLayoutCreated: function onToolLayoutCreated(/*tools*/) {},
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
  init: function init(state$) {
    this.startup();
    this.initConnects();
    this.initModel();
    this.initState(state$);
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
   * Initializes the model instance that is return with the curernt view.
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
   * Called in {@link #show show()} before ReUI is invoked.
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
  onBeforeTransitionAway: function onBeforeTransitionAway(/*self*/) {},
  /**
   * The onBeforeTransitionTo event.
   * @param self
   */
  onBeforeTransitionTo: function onBeforeTransitionTo(/*self*/) {},
  /**
   * The onTransitionAway event.
   * @param self
   */
  onTransitionAway: function onTransitionAway(/*self*/) {},
  /**
   * The onTransitionTo event.
   * @param self
   */
  onTransitionTo: function onTransitionTo(/*self*/) {},
  /**
   * The onActivate event.
   * @param self
   */
  onActivate: function onActivate(/*self*/) {},
  /**
   * The onShow event.
   * @param self
   */
  onShow: function onShow(/*self*/) {},
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
  /**
   * Shows the view using iUI in order to transition to the new element.
   * @param {Object} options The navigation options passed from the previous view.
   * @param transitionOptions {Object} Optional transition object that is forwarded to ReUI.
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

    const newOptions = lang.mixin(transitionOptions || {}, {
      tag: tag,
      data: data,
    });
    ReUI.show(this.domNode, newOptions);
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
  getSecurity: function getSecurity(/*access*/) {
    return this.security;
  },
  /**
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
