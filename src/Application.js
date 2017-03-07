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
import array from 'dojo/_base/array';
import connect from 'dojo/_base/connect';
import lang from 'dojo/_base/lang';
import win from 'dojo/_base/window';
import hash from 'dojo/hash';
import has from 'dojo/has';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import all from 'dojo/promise/all';
import snap from 'snap';
import ready from 'dojo/ready';
import util from './Utility';
import ModelManager from './Models/Manager';
import Toast from './Dialogs/Toast';
import { model } from './Model';
import { intent } from './Intent';
import { updateConnectionState } from './Intents/update-connection';
import Modal from './Dialogs/Modal';
import BusyIndicator from './Dialogs/BusyIndicator';
import Deferred from 'dojo/Deferred';
import ErrorManager from './ErrorManager';
import getResource from './I18n';
import { createStore } from 'redux';
import { sdk } from './reducers';
import Scene from './Scene';
import page from 'page';
import 'dojo/sniff';

// import moment from 'moment';
import Rx from 'rxjs';

const resource = getResource('sdkApplication');

has.add('html5-file-api', (global) => {
  if (has('ie')) {
    return false;
  }

  if (global.File && global.FileReader && global.FileList && global.Blob) {
    return true;
  }
  return false;
});

lang.extend(Function, {
  // TODO: Deprecate this in favor of the standard "bind"
  bindDelegate: function bindDelegate(scope) {
    const self = this;

    if (arguments.length === 1) {
      return function bound() {
        return self.apply(scope || this, arguments);
      };
    }

    const optional = Array.prototype.slice.call(arguments, 1);
    return function boundWArgs() {
      const called = Array.prototype.slice.call(arguments, 0);
      return self.apply(scope || this, called.concat(optional));
    };
  },
});

// Patching backwards compatablity so that customizations will not break and where moment
// was required.
// define('moment', [], function getMoment() { // eslint-disable-line
//   return moment;
// });

function applyLocalizationTo(object, localization) {
  if (!object) {
    return;
  }

  const target = object.prototype || object;
  for (const key in localization) {
    if (lang.isObject(localization[key])) {
      applyLocalizationTo(target[key], localization[key]);
    } else {
      target[key] = localization[key];
    }
  }
}

function localize(name, localization) {
  let target = lang.getObject(name);
  if (target && target.prototype) {
    target = target.prototype;
  }

  if (target) {
    applyLocalizationTo(target, localization);
  }
}

function mergeConfiguration(baseConfiguration, moduleConfiguration) {
  if (baseConfiguration) {
    if (baseConfiguration.modules && moduleConfiguration.modules) {
      baseConfiguration.modules = baseConfiguration.modules.concat(moduleConfiguration.modules);
    }

    if (baseConfiguration.connections && moduleConfiguration.connections) {
      baseConfiguration.connections = lang.mixin(baseConfiguration.connections, moduleConfiguration.connections);
    }
  }

  return baseConfiguration;
}

lang.mixin(win.global, {
  localize,
  mergeConfiguration,
});

/**
 * @class argos.Application
 * Application is a nexus that provides many routing and global application services that may be used
 * from anywhere within the app.
 *
 * It provides a shortcut alias to `window.App` (`App`) with the most common usage being `App.getView(id)`.
 *
 * @alternateClassName App
 */
export default class Application {
  constructor(options) {
    /**
     * @property enableConcurrencyCheck {Boolean} Option to skip concurrency checks to avoid precondition/412 errors.
     */
    this.enableConcurrencyCheck = false;

    this.ReUI = {
      app: null,
      back: function back() {
        if (!this.app) {
          return;
        }
        if (this.app.context &&
              this.app.context.history &&
                this.app.context.history.length > 0) {
          // Note: PageJS will push the page back onto the stack once viewed
          const from = this.app.context.history.pop();
          page.len--;

          const returnTo = from.data && from.data.options && from.data.options.returnTo;

          if (returnTo) {
            let returnIndex = this.app.context.history.reverse()
                                  .findIndex(val => val.page === returnTo);
            // Since want to find last index of page, must reverse index
            if (returnIndex !== -1) {
              returnIndex = (this.app.context.history.length - 1) - returnIndex;
            }
            this.app.context.history.splice(returnIndex);
            page.redirect(returnTo);
            return;
          }

          const to = this.app.context.history.pop();
          page.redirect(to.page);
          return;
        }
        page.back(this.app.homeViewId);
      },
      context: {
        history: null,
      },
    };

    /**
     * @property viewShowOptions {Array} Array with one configuration object that gets pushed before showing a view.
     * Allows passing in options via routing. Value gets removed once the view is shown.
     */
    this.viewShowOptions = null;

    /**
     * Instance of a Snap.js object (https://github.com/jakiestfu/Snap.js/)
     */
    this.snapper = null;

    /**
     * @property {String}
     * Current orientation of the application. Can be landscape or portrait.
     */
    this.currentOrientation = 'portrait';

    /**
     * Array of all connections for App
     * @property {Object[]}
     * @private
     */
    this._connects = null;

    /**
     * Boolean for whether the application is an embedded app or not
     * @property {boolean}
     * @private
     */
    this._embedded = false;

    /**
     * Array of handles for App
     * @property {Object[]}
     * @private
     */
    this._signals = null;

    /**
     * @private
     * Array of all subscriptions for App
     */
    this._subscribes = null;

    /**
     * Array of promises to load app state
     * @property {Array}
     * @private
     */
    this._appStatePromises = null;

    /**
     * Signifies the App has been initialized
     * @property {Boolean}
     * @private
     */
    this._started = false;

    this._rootDomNode = null;
    this._containerNode = null;
    this.customizations = null;
    this.services = null; // TODO: Remove
    this._connections = null;
    this.modules = null;
    this.views = null;
    this.hash = hash;
    this.onLine = true;
    this._currentPage = null;
    /**
     * Toolbar instances by key name
     * @property {Object}
     */
    this.bars = null;
    this.enableCaching = false;
    /**
     * The default Sage.SData.Client.SDataService instance
     * @property {Object}
     */
    this.defaultService = null;
    this.resizeTimer = null;

    /**
     * The hash to redirect to after login.
     * @property {String}
     */
    this.redirectHash = '';
    /**
     * Signifies the maximum file size that can be uploaded in bytes
     * @property {int}
     */
    this.maxUploadFileSize = 4000000;

    /**
     * Timeout for the connection check.
     */
    this.PING_TIMEOUT = 3000;

    /**
     * Ping debounce time.
     */
    this.PING_DEBOUNCE = 1000;

    /**
     * Number of times to attempt to ping.
     */
    this.PING_RETRY = 5;

    /*
     * Static resource to request on the ping. Should be a small file.
     */
    this.PING_RESOURCE = 'ping.gif';
    /**
     * All options are mixed into App itself
     * @param {Object} options
     */
    this.ModelManager = null;
    this.isDynamicInitialized = false;

    this.checkOrientationTime = 100;
    this.orientationCheckHandle = null;
    this._connects = [];
    this._appStatePromises = [];
    this._signals = [];
    this._subscribes = [];

    this.customizations = {};
    this.services = {}; // TODO: Remove
    this._connections = {};
    this.modules = [];
    this.views = {};
    this.bars = {};

    this.context = {
      history: [],
    };
    this.viewShowOptions = [];
    // TODO: Replace these
    const actions = intent();
    this.state$ = model(actions);
    this.state$.subscribe(this._onStateChange.bind(this), this._onStateError.bind(this));

    // For routing need to know homeViewId
    this.ReUI.app = this;

    this.ModelManager = ModelManager;
    lang.mixin(this, options);
  }

  /**
   * Loops through and disconnections connections and unsubscribes subscriptions.
   * Also calls {@link #uninitialize uninitialize}.
   */
  destroy() {
    array.forEach(this._connects, (handle) => {
      connect.disconnect(handle);
    });

    array.forEach(this._subscribes, (handle) => {
      connect.unsubscribe(handle);
    });

    array.forEach(this._signals, (signal) => {
      signal.remove();
    });

    this.uninitialize();
  }

  /**
   * Shelled function that is called from {@link #destroy destroy}, may be used to release any further handles.
   */
  uninitialize() {
  }

  back() {
    if (!this._embedded) {
      ReUI.back();
    }
  }

  /**
   * Initialize the hash and save the redirect hash if any
   */
  initHash() {
    const h = this.hash();
    if (h !== '') {
      this.redirectHash = h;
    }

    if (!this._embedded) {
      location.hash = '';
    }

    // Backwards compatibility for global uses of ReUI
    window.ReUI = this.ReUI;
    window.ReUI.context.history = this.context.history;
  }

  _onOffline() {
    this.ping();
  }

  _onOnline() {
    this.ping();
  }

  _onStateChange(val) {
    this._updateConnectionState(val.connectionState);
    this.onStateChange(val);
  }

  _onStateError(error) {
    this.onStateError(error);
  }

  onStateChange(val) {} // eslint-disable-line
  onStateError(error) {} // eslint-disable-line
  _updateConnectionState(online) {
    // Don't fire the onConnectionChange if we are in the same state.
    if (this.onLine === online) {
      return;
    }

    this.onLine = online;
    this.onConnectionChange(online);
  }

  forceOnline() {
    updateConnectionState(true);
  }

  forceOffline() {
    updateConnectionState(false);
  }

  onConnectionChange(/* online*/) {}

  /**
   * Establishes various connections to events.
   */
  initConnects() {
    this._connects.push(connect.connect(window, 'resize', this, this.onResize));
    this._connects.push(connect.connect(win.body(), 'beforetransition', this, this._onBeforeTransition));
    this._connects.push(connect.connect(win.body(), 'aftertransition', this, this._onAfterTransition));
    this._connects.push(connect.connect(win.body(), 'show', this, this._onActivate));
    ready(() => {
      window.addEventListener('online', this._onOnline.bind(this));
      window.addEventListener('offline', this._onOffline.bind(this));
    });

    this.ping();
  }

  /**
   * Returns a promise. The results are true of the resource came back
   * before the PING_TIMEOUT. The promise is rejected if there is timeout or
   * the response is not a 200 or 304.
   */
  _ping() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.ontimeout = () => resolve(false);
      xhr.onerror = () => resolve(false);
      xhr.onload = () => {
        const DONE = 4;
        const HTTP_OK = 200;
        const HTTP_NOT_MODIFIED = 304;

        if (xhr.readyState === DONE) {
          if (xhr.status === HTTP_OK || xhr.status === HTTP_NOT_MODIFIED) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      };
      xhr.open('GET', `${this.PING_RESOURCE}?cache=${Math.random()}`);
      xhr.timeout = this.PING_TIMEOUT;
      xhr.send();
    });
  }

  /**
   * Establishes signals/handles from dojo's newer APIs
   */
  initSignals() {
    return this;
  }

  /**
   * Executes the chain of promises registered with registerAppStatePromise.
   * When all promises are done, a new promise is returned to the caller, and all
   * registered promises are flushed.
   * Each app state can be processed all at once or in a specfic seqence.
   * Example:
   * We can register  App state seqeunces as the following, where each sequence
   * is proccessed in a desending order form 0 to n. The first two in this example are defeulted to a
   * sequence of zero (0) and are procced first in which after the next sequence (1) is proccessed
   * and once all of its items are finshed then the last sequence 2 will start and process all of its items.
   *
   * If two seqences have the same number then thay will get combinded as if they where registerd together.
   * Aso not all items whith in a process are processed and ansync of each other and may not finish at the same time.
   *
   * To make two items process one after the other simpley put them in to diffrent sequences.
   *
   *   this.registerAppStatePromise(() => {some functions that returns a promise});
   *   this.registerAppStatePromise(() => {some functions that returns a promise});
   *
   *   this.registerAppStatePromise({
   *     seq: 1,
   *     description: 'Sequence 1',
   *     items: [{
   *       name: 'itemA',
   *       description: 'item A',
   *       fn: () => { some functions that returns a promise },
   *       }, {
   *         name: 'itemb',
   *         description: 'Item B',
   *         fn: () => {some functions that returns a promise},
   *       }],
   *   });
   *
   *   this.registerAppStatePromise({
   *     seq: 2,
   *     description: 'Sequence 2',
   *     items: [{
   *       name: 'item C',
   *       description: 'item C',
   *       fn: () => { some functions that returns a promise },
   *       },
   *    });
   *
   * There are there App state seqences re
   *
   * @return {Promise}
   */
  initAppState() {
    const def = new Deferred();
    const sequences = [];
    this._appStatePromises.forEach((item) => {
      let seq;
      if (typeof item === 'function') {
        seq = sequences.find(x => x.seq === 0);
        if (!seq) {
          seq = {
            seq: 0,
            description: resource.loadingApplicationStateText,
            items: [],
          };
          sequences.push(seq);
        }
        seq.items.push({
          name: 'default',
          description: '',
          fn: item,
        });
      } else {
        if (item.seq && item.items) {
          seq = sequences.find(x => x.seq === ((item.seq) ? item.seq : 0));
          if (seq) {
            item.items.forEach((_item) => {
              seq.items.push(_item);
            });
          } else {
            sequences.push(item);
          }
        }
      }
    });
    // Sort the sequence ascending so we can processes them in the right order.
    sequences.sort((a, b) => {
      if (a.seq > b.seq) {
        return 1;
      }

      if (a.seq < b.seq) {
        return -1;
      }

      return 0;
    });

    this._initAppStateSequence(0, sequences).then((results) => {
      this.clearAppStatePromises();
      this.initModulesDynamic();
      def.resolve(results);
    }, (err) => {
      this.clearAppStatePromises();
      def.reject(err);
    });
    return def.promise;
  }

  /**
   * Process a app state sequence and start the next sequnce when done.
   * @param {index) the index of the sequence to start
   * @param {sequences) an array of sequences
   */
  _initAppStateSequence(index, sequences) {
    const def = new Deferred();
    const seq = sequences[index];

    if (seq) { // We need to send an observable and get ride of the ui element.
      const indicator = new BusyIndicator({
        id: `busyIndicator__appState_${seq.seq}`,
        label: `${resource.initializingText} ${seq.description}`,
      });
      this.modal.disableClose = true;
      this.modal.showToolbar = false;
      this.modal.add(indicator);
      indicator.start();
      const promises = array.map(seq.items, (item) => {
        return item.fn();
      });
      const odef = def;
      all(promises).then(() => {
        indicator.complete(true);
        this.modal.disableClose = false;
        this.modal.hide();
        this._initAppStateSequence(index + 1, sequences).then((results) => {
          odef.resolve(results);
        }, (err) => {
          indicator.complete(true);
          this.modal.disableClose = false;
          this.modal.hide();
          odef.reject(err);
        });
      }, (err) => {
        ErrorManager.addSimpleError(indicator.label, err);
        indicator.complete(true);
        this.modal.disableClose = false;
        this.modal.hide();
        def.reject(err);
      });
    } else {
      def.resolve();
    }
    return def.promise;
  }

  /**
   * Registers a promise that will resolve when initAppState is invoked.
   * @param {Promise|Function} promise A promise or a function that returns a promise
   */
  registerAppStatePromise(promise) {
    this._appStatePromises.push(promise);
    return this;
  }

  clearAppStatePromises() {
    this._appStatePromises = [];
  }

  onSetOrientation(/* value*/) {}

  /**
   * Loops through connections and calls {@link #registerService registerService} on each.
   */
  initServices() {
    for (const name in this.connections) {
      if (this.connections.hasOwnProperty(name)) {
        this.registerService(name, this.connections[name]);
      }
    }
  }

  /**
   * Loops through modules and calls their `init()` function.
   */
  initModules() {
    for (let i = 0; i < this.modules.length; i++) {
      this.modules[i].init(this);
    }
  }

  /**
   * Loops through modules and calls their `initDynamic()` function.
   */
  initModulesDynamic() {
    if (this.isDynamicInitialized) {
      return;
    }
    for (let i = 0; i < this.modules.length; i++) {
      this.modules[i].initDynamic(this);
    }
    this.isDynamicInitialized = true;
  }

  /**
   * Loops through (tool)bars and calls their `init()` function.
   */
  initToolbars() {
    for (const n in this.bars) {
      if (this.bars.hasOwnProperty(n)) {
        this.bars[n].init(); // todo: change to startup
      }
    }
  }

  /**
   * Sets the global variable `App` to this instance.
   */
  activate() {
    window.App = this;
  }

  /**
   * Initializes this application as well as the toolbar and all currently registered views.
   */
  init(domNode) {
    this.initStore();
    this._createViewContainers(domNode);
    this.initPreferences();
    this.initToasts();
    this.initPing();
    this.initConnects();
    this.initSignals();
    this.initServices(); // TODO: Remove
    this._startupConnections();
    this.initModules();
    this.initToolbars();
    this.initHash();
    this.startOrientationCheck();
    this.initModal();
    this.initScene();
  }

  initScene() {
    this.scene = new Scene(this.store);
  }

  initStore() {
    this.store = createStore(this.getReducer(),
      this.getInitialState(),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  getReducer() {
    return sdk;
  }

  getInitialState() {
    return {};
  }

  initToasts() {
    this.toast = new Toast();
    this.toast.show({
      rootElement: this._containerNode,
    });
  }

  initPing() {
    // this.ping will be set if ping was passed as an options to the ctor
    if (this.ping) {
      return;
    }

    this.ping = util.debounce(() => {
      this.toast.add({
        message: resource.checkingText,
        title: resource.connectionToastTitleText,
        toastTime: this.PING_TIMEOUT,
      });
      const ping$ = Rx.Observable.interval(this.PING_TIMEOUT)
        .flatMap(() => {
          return Rx.Observable.fromPromise(this._ping())
            .flatMap((online) => {
              if (online) {
                return Rx.Observable.of(online);
              }

              return Rx.Observable.throw(new Error());
            });
        })
        .retry(this.PING_RETRY)
        .take(1);

      ping$.subscribe(() => {
        updateConnectionState(true);
      }, () => {
        updateConnectionState(false);
      });
    }, this.PING_DEBOUNCE);
  }

  initPreferences() {
    this._loadPreferences();
  }

  initModal() {
    this.modal = new Modal();
    this.modal.place(this._containerNode)
      .hide();
  }

  is24HourClock() {
    return (JSON.parse(window.localStorage.getItem('use24HourClock') || Mobile.CultureInfo.default24HourClock.toString()) === true);
  }

  /**
   * Check if the browser supports touch events.
   * @return {Boolean} true if the current browser supports touch events, false otherwise.
   */
  supportsTouch() {
    // Taken from https://github.com/Modernizr/Modernizr/ (MIT Licensed)
    return ('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
  }

  persistPreferences() {
    try {
      if (window.localStorage) {
        window.localStorage.setItem('preferences', JSON.stringify(this.preferences));
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  _loadPreferences() {
    try {
      if (window.localStorage) {
        this.preferences = JSON.parse(window.localStorage.getItem('preferences'));
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  /**
   * Establishes various connections to events.
   */
  _startupConnections() {
    for (const name in this.connections) {
      if (this.connections.hasOwnProperty(name)) {
        if (this.connections.hasOwnProperty(name)) {
          this.registerConnection(name, this.connections[name]);
        }
      }
    }

    /* todo: should we be mixing this in? */
    delete this.connections;
  }

  /**
   * Sets `_started` to true.
   */
  run() {
    this._started = true;
    this.startOrientationCheck();
    page({
      dispatch: false,
      hashbang: true,
      usingUrl: !this._embedded,
    });
  }

  /**
   * Returns the `window.navigator.onLine` property for detecting if an internet connection is available.
   */
  isOnline() {
    return this.onLine;
  }

  /**
   * Returns true/false if the current view is the first/initial view.
   * This is useful for disabling the back button (so you don't hit the login page).
   * @returns {boolean}
   */
  isOnFirstView() {}

  /**
   * Optional creates, then registers an Sage.SData.Client.SDataService and adds the result to `App.services`.
   * @param {String} name Unique identifier for the service.
   * @param {Object} service May be a SDataService instance or constructor parameters to create a new SDataService instance.
   * @param {Object} options Optional settings for the registered service.
   */
  registerService(name, service, options = {}) {
    const instance = service instanceof Sage.SData.Client.SDataService ? service : new Sage.SData.Client.SDataService(service);

    this.services[name] = instance;

    instance.on('requesttimeout', this.onRequestTimeout, this);

    if ((options.isDefault || service.isDefault) || !this.defaultService) {
      this.defaultService = instance;
    }

    return this;
  }

  /**
   * Optional creates, then registers an Sage.SData.Client.SDataService and adds the result to `App.services`.
   * @param {String} name Unique identifier for the service.
   * @param {Object} definition May be a SDataService instance or constructor parameters to create a new SDataService instance.
   * @param {Object} options Optional settings for the registered service.
   */
  registerConnection(name, definition, options = {}) {
    const instance = definition instanceof Sage.SData.Client.SDataService ? definition : new Sage.SData.Client.SDataService(definition);

    this._connections[name] = instance;

    instance.on('requesttimeout', this.onRequestTimeout, this);

    if ((options.isDefault || definition.isDefault) || !this._connections.default) {
      this._connections.default = instance;
    }

    return this;
  }

  _onTimeout() {
    this.ping();
  }

  /**
   * Determines the the specified service name is found in the Apps service object.
   * @param {String} name Name of the SDataService to detect
   */
  hasService(name) {
    return !!this.services[name];
  }

  _createViewContainers(domNode) {
    // If a domNode is provided, create the app's dom under this
    if (domNode && !this._rootDomNode) {
      const contentDiv = domConstruct.create('div', {
        class: 'viewContainer',
      }, domNode);
      this._containerNode = domNode;
      this._rootDomNode = contentDiv;
      this._createDrawerDOM();
      return;
    }

    // Check for the default div id of "viewContainer" (multiple calls)
    const defaultAppID = 'viewContainer';
    const node = document.getElementById(defaultAppID);
    if (node) {
      this._rootDomNode = node;
      // Set containerNode to rootNode for backwards compatibility
      this._containerNode = this._rootDomNode;
      return;
    }

    // Nothing was provided, create a default
    if (this._rootDomNode === null || typeof this._rootDomNode === 'undefined') {
      this._rootDomNode = domConstruct.create('div', {
        id: defaultAppID,
        class: defaultAppID,
      }, win.body());

      this._createDrawerDOM();
    }
  }

  _createDrawerDOM() {
    const drawers = domConstruct.create('div', {
      class: 'drawers absolute',
    }, this._containerNode);

    domConstruct.create('div', {
      class: 'overthrow left-drawer absolute',
    }, drawers);

    domConstruct.create('div', {
      class: 'overthrow right-drawer absolute',
    }, drawers);
  }

  /**
   * Returns the dom associated to the container element
   */
  getContainerNode() {
    return this._containerNode || this._rootDomNode;
  }

  /**
   * Registers a view with the application and renders it to HTML.
   * If the application has already been initialized, the view is immediately initialized as well.
   * @param {View} view A view instance to be registered.
   * @param {domNode} domNode Optional. A DOM node to place the view in.
   */
  registerView(view, domNode) {
    const id = view.id;

    if (!domNode) {
      this._createViewContainers();
    }

    const node = domNode || this._rootDomNode;
    view._placeAt = node;
    this.views[id] = view;

    this.registerViewRoute(view);

    this.onRegistered(view);

    return this;
  }

  registerViewRoute(view) {
    if (!view || typeof view.getRoute !== 'function') {
      return;
    }

    page(view.getRoute(), view.routeLoad.bind(view), view.routeShow.bind(view));
  }

  /**
   * Registers a toolbar with the application and renders it to HTML.
   * If the application has already been initialized, the toolbar is immediately initialized as well.
   * @param {String} name Unique name of the toolbar
   * @param {Toolbar} tbar Toolbar instance to register
   * @param {domNode} domNode Optional. A DOM node to place the view in.
   */
  registerToolbar(n, t, domNode) {
    let name = n;
    let tbar = t;

    if (typeof name === 'object') {
      tbar = name;
      name = tbar.name;
    }

    this.bars[name] = tbar;

    if (this._started) {
      tbar.init();
    }

    if (!domNode) {
      this._createViewContainers();
    }

    tbar.placeAt(domNode || this._rootDomNode, 'last');

    return this;
  }

  /**
   * Returns all the registered views.
   * @return {View[]} An array containing the currently registered views.
   */
  getViews() {
    const results = [];

    for (const view in this.views) {
      if (this.views.hasOwnProperty(view)) {
        results.push(this.views[view]);
      }
    }

    return results;
  }

  /**
   * Checks to see if the passed view instance is the currently active one by comparing it to {@link #getPrimaryActiveView primaryActiveView}.
   * @param {View} view
   * @return {Boolean} True if the passed view is the same as the active view.
   */
  isViewActive(view) {
    // todo: add check for multiple active views.
    return (this.getPrimaryActiveView() === view);
  }

  updateOrientationDom(value) {
    const body = document.body;
    const currentOrient = body.getAttribute('orient');
    if (value === currentOrient) {
      return;
    }

    body.setAttribute('orient', value);

    if (value === 'portrait') {
      domClass.remove(body, 'landscape');
      domClass.add(body, 'portrait');
    } else if (value === 'landscape') {
      domClass.remove(body, 'portrait');
      domClass.add(body, 'landscape');
    } else {
      domClass.remove(body, 'portrait');
      domClass.remove(body, 'landscape');
    }

    this.currentOrientation = value;
    this.onSetOrientation(value);
    connect.publish('/app/setOrientation', [value]);
  }

  checkOrientation() {
    const context = this.context;
    // Check if screen dimensions changed. Ignore changes where only the height changes (the android keyboard will cause this)
    if (Math.abs(window.innerHeight - context.height) > 5 || Math.abs(window.innerWidth - context.width) > 5) {
      if (Math.abs(window.innerWidth - context.width) > 5) {
        this.updateOrientationDom(window.innerHeight < window.innerWidth ? 'landscape' : 'portrait');
      }

      context.height = window.innerHeight;
      context.width = window.innerWidth;
    }
  }

  startOrientationCheck() {
    this.orientationCheckHandle = window.setInterval(this.checkOrientation.bind(this), this.checkOrientationTime);
  }

  stopOrientationCheck() {
    window.clearInterval(this.orientationCheckHandle);
  }

  /**
   * Gets the current page and then returns the result of {@link #getView getView(name)}.
   * @return {View} Returns the active view instance, if no view is active returns null.
   */
  getPrimaryActiveView() {
    const el = this.getCurrentPage();
    if (el) {
      return this.getView(el);
    }
  }

  /**
   * Sets the current page(domNode)
   * @param {DOMNode}
   */
  setCurrentPage(_page) {
    this._currentPage = _page;
  }

  /**
   * Gets the current page(domNode)
   * @returns {DOMNode}
   */
  getCurrentPage() {
    return this._currentPage;
  }

  /**
   * Determines if any registered view has been registered with the provided key.
   * @param {String} key Unique id of the view.
   * @return {Boolean} True if there is a registered view name matching the key.
   */
  hasView(key) {
    return !!this._internalGetView({
      key,
      init: false,
    });
  }

  /**
   * Returns the registered view instance with the associated key.
   * @param {String/Object} key The id of the view to return, if object then `key.id` is used.
   * @return {View} view The requested view.
   */
  getView(key) {
    return this._internalGetView({
      key,
      init: true,
    });
  }

  _internalGetView(options) {
    const key = options && options.key;
    const init = options && options.init;

    if (key) {
      let view;
      if (typeof key === 'string') {
        view = this.views[key];
      } else if (typeof key.id === 'string') {
        view = this.views[key.id];
      }

      if (init && view && !view._started) {
        view.init(this.state$, this.store);
        view.placeAt(view._placeAt, 'first');
        view._started = true;
        view._placeAt = null;
      }

      return view;
    }

    return null;
  }

  /**
   * Returns the defined security for a specific view
   * @param {String} key Id of the registered view to query.
   * @param access
   */
  getViewSecurity(key, access) {
    const view = this._internalGetView({
      key,
      init: false,
    });
    return (view && view.getSecurity(access));
  }

  /**
   * Returns the registered SDataService instance by name, or returns the default service.
   * @param {String/Boolean} name If string service is looked up by name. If false, default service is returned.
   * @return {Object} The registered Sage.SData.Client.SDataService instance.
   */
  getService(name) {
    if (typeof name === 'string' && this.services[name]) {
      return this.services[name];
    }

    return this.defaultService;
  }

  /**
   * Determines the the specified service name is found in the Apps service object.
   * @param {String} name Name of the SDataService to detect
   */
  hasConnection(name) {
    return !!this._connections[name];
  }

  getConnection(name) {
    if (this._connections[name]) {
      return this._connections[name];
    }

    return this._connections.default;
  }

  /**
   * Sets the applications current title.
   * @param {String} title The new title.
   */
  setPrimaryTitle(title) {
    for (const n in this.bars) {
      if (this.bars.hasOwnProperty(n)) {
        if (this.bars[n].managed) {
          this.bars[n].set('title', title);
        }
      }
    }

    return this;
  }

  /**
   * Resize handle, publishes the global event `/app/resize` which views may subscribe to.
   */
  onResize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      connect.publish('/app/resize', []);
    }, 100);
  }

  onRegistered(/* view*/) {}

  onBeforeViewTransitionAway(/* view*/) {}

  onBeforeViewTransitionTo(/* view*/) {}

  onViewTransitionAway(/* view*/) {}

  onViewTransitionTo(/* view*/) {}

  onViewActivate(/* view, tag, data*/) {}

  _onBeforeTransition(evt) {
    const view = this.getView(evt.target);
    if (view) {
      if (evt.out) {
        this._beforeViewTransitionAway(view);
      } else {
        this._beforeViewTransitionTo(view);
      }
    }
  }

  _onAfterTransition(evt) {
    const view = this.getView(evt.target);
    if (view) {
      if (evt.out) {
        this._viewTransitionAway(view);
      } else {
        this._viewTransitionTo(view);
      }
    }
  }

  _onActivate(evt) {
    const view = this.getView(evt.target);
    if (view) {
      this._viewActivate(view, evt.tag, evt.data);
    }
  }

  _beforeViewTransitionAway(view) {
    this.onBeforeViewTransitionAway(view);

    view.beforeTransitionAway();
  }

  _beforeViewTransitionTo(view) {
    this.onBeforeViewTransitionTo(view);

    for (const n in this.bars) {
      if (this.bars[n].managed) {
        this.bars[n].clear();
      }
    }

    view.beforeTransitionTo();
  }

  _viewTransitionAway(view) {
    this.onViewTransitionAway(view);

    view.transitionAway();
  }

  _viewTransitionTo(view) {
    this.onViewTransitionTo(view);

    const tools = (view.options && view.options.tools) || view.getTools() || {};

    for (const n in this.bars) {
      if (this.bars[n].managed) {
        this.bars[n].showTools(tools[n]);
      }
    }

    view.transitionTo();
  }

  _viewActivate(view, tag, data) {
    this.onViewActivate(view);

    view.activate(tag, data);
  }

  /**
   * Searches App.context.history by passing a predicate function that should return true if a match is found, false otherwise.
   * This is similar to queryNavigationContext, however, this function will return an array of found items instead of a single item.
   * @param {Function} predicate
   * @param {Object} scope
   * @return {Array} context history filtered out by the predicate.
   */
  filterNavigationContext(predicate, scope) {
    const list = this.context.history || [];
    const filtered = array.filter(list, (item) => {
      return predicate.call(scope || this, item.data);
    });

    return array.map(filtered, (item) => {
      return item.data;
    });
  }

  /**
   * Searches App.context.history by passing a predicate function that should return true
   * when a match is found.
   * @param {Function} predicate Function that is called in the provided scope with the current history iteration. It should return true if the history item is the desired context.
   * @param {Number} depth
   * @param {Object} scope
   * @return {Object/Boolean} context History data context if found, false if not.
   */
  queryNavigationContext(predicate, d, s) {
    let scope = s;
    let depth = d;

    if (typeof depth !== 'number') {
      scope = depth;
      depth = 0;
    }

    const list = this.context.history || [];

    depth = depth || 0;

    for (let i = list.length - 2, j = 0; i >= 0 && (depth <= 0 || j < depth); i--, j++) {
      if (predicate.call(scope || this, list[i].data)) {
        return list[i].data;
      }
    }

    return false;
  }

  /**
   * Shortcut method to {@link #queryNavigationContext queryNavigationContext} that matches the specified resourceKind provided
   * @param {String/String[]} kind The resourceKind(s) the history item must match
   * @param {Function} predicate Optional. If provided it will be called on matches so you may do an secondary check of the item - returning true for good items.
   * @param {Object} scope Scope the predicate should be called in.
   * @return {Object} context History data context if found, false if not.
   */
  isNavigationFromResourceKind(kind, predicate, scope) {
    const lookup = {};
    if (lang.isArray(kind)) {
      array.forEach(kind, function forEach(item) {
        this[item] = true;
      }, lookup);
    } else {
      lookup[kind] = true;
    }

    return this.queryNavigationContext(function queryNavigationContext(o) {
      const context = (o.options && o.options.source) || o;
      const resourceKind = context && context.resourceKind;

      // if a predicate is defined, both resourceKind AND predicate must match.
      if (lookup[resourceKind]) {
        if (predicate) {
          if (predicate.call(scope || this, o, context)) {
            return o;
          }
        } else {
          return o;
        }
      }
    });
  }

  /**
   * Registers a customization to a target path.
   *
   * A Customization Spec is a special object with the following keys:
   *
   * * `at`: `function(item)` - passes the current item in the list, the function should return true if this is the item being modified (or is at where you want to insert something).
   * * `at`: `{Number}` - May optionally define the index of the item instead of a function.
   * * `type`: `{String}` - enum of `insert`, `modify`, `replace` or `remove` that indicates the type of customization.
   * * `where`: `{String}` - enum of `before` or `after` only needed when type is `insert`.
   * * `value`: `{Object}` - the entire object to create (insert or replace) or the values to overwrite (modify), not needed for remove.
   * * `value`: `{Object[]}` - if inserting you may pass an array of items to create.
   *
   * Note: This also accepts the legacy signature:
   * `registerCustomization(path, id, spec)`
   * Where the path is `list/tools` and `id` is the view id
   *
   * All customizations are registered to `this.customizations[path]`.
   *
   * @param {String} path The customization set such as `list/tools#account_list` or `detail#contact_detail`. First half being the type of customization and the second the view id.
   * @param {Object} spec The customization specification
   */
  registerCustomization(p, s) {
    let path = p;
    let spec = s;

    if (arguments.length > 2) {
      const customizationSet = arguments[0];
      const id = arguments[1];

      spec = arguments[2];
      path = id ? `${customizationSet}#${id}` : customizationSet;
    }

    const container = this.customizations[path] || (this.customizations[path] = []);
    if (container) {
      container.push(spec);
    }

    return this;
  }

  /**
   * Returns the customizations registered for the provided path.
   *
   * Note: This also accepts the legacy signature:
   * `getCustomizationsFor(set, id)`
   * Where the path is `list/tools` and `id` is the view id
   *
   * @param {String} path The customization set such as `list/tools#account_list` or `detail#contact_detail`. First half being the type of customization and the second the view id.
   */
  getCustomizationsFor(p) {
    let path = p;

    if (arguments.length > 1) {
      path = arguments[1] ? `${arguments[0]}#${arguments[1]}` : arguments[0];
    }

    const segments = path.split('#');
    const customizationSet = segments[0];
    const forPath = this.customizations[path] || [];
    const forSet = this.customizations[customizationSet] || [];

    return forPath.concat(forSet);
  }

  hasAccessTo(/* security*/) {
    return true;
  }

  /**
   * Override this function to load a view in the left drawer.
   */
  showLeftDrawer() {
    return this;
  }

  /**
   * Override this function to load a view in the right drawer.
   */
  showRightDrawer() {
    return this;
  }

  /**
   * Loads Snap.js and assigns the instance to App.snapper. This method would typically be called before navigating to the initial view, so the login page does not contain the menu.
   * @param {DOMNode} element Optional. Snap.js options.element property. If not provided defaults to the App's _rootDomNode.
   * @param {Object} options Optional. Snap.js options object. A default is provided if this is undefined. Providing options will override the element parameter.
   */
  loadSnapper(element, options) {
    // TODO: Provide a domNode param and default to viewContainer if not provided
    if (this.snapper) {
      return this;
    }

    let snapWidth = 266;
    const viewWidth = (this._containerNode && this._containerNode.offsetWidth) || 0;
    if (viewWidth <= snapWidth) {
      snapWidth = Math.floor(0.83 * viewWidth) - 1;
    }

    const snapper = new snap(options || { // eslint-disable-line
      element: element || this._rootDomNode,
      dragger: null,
      disable: 'none',
      addBodyClasses: true,
      hyperextensible: false,
      resistance: 0.1,
      flickThreshold: 50,
      transitionSpeed: 0.2,
      easing: 'ease',
      maxPosition: snapWidth,
      minPosition: -1 * snapWidth,
      tapToClose: has('ie') ? false : true, // causes issues on windows phones where tapping the close button causes snap.js endDrag to fire, closing the menu before we can check the state properly
      touchToDrag: false,
      slideIntent: 40,
      minDragDistance: 5,
    });

    this.snapper = snapper;

    this.showLeftDrawer();
    this.showRightDrawer();
    return this;
  }

  setToolBarMode(onLine) {
    for (const n in this.bars) {
      if (this.bars[n].managed) {
        this.bars[n].setMode(onLine);
      }
    }
  }
}
