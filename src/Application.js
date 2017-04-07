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
import util from './Utility';
import ModelManager from './Models/Manager';
import Toast from './Dialogs/Toast';
import Modal from './Dialogs/Modal';
import BusyIndicator from './Dialogs/BusyIndicator';
import ErrorManager from './ErrorManager';
import getResource from './I18n';
import { sdk } from './reducers/index';
import { setConnectionState } from './actions/connection';
import Scene from './Scene';
import { render } from './SohoIcons';


const resource = getResource('sdkApplication');

Function.prototype.bindDelegate = function bindDelegate(scope) { //eslint-disable-line
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
};

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
  constructor() {
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
     * @property {String}
     * Current orientation of the application. Can be landscape or portrait.
     */
    this.currentOrientation = 'portrait';

    /**
     * Boolean for whether the application is an embedded app or not
     * @property {boolean}
     * @private
     */
    this._embedded = false;

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

    this._appStatePromises = [];

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

    // For routing need to know homeViewId
    this.ReUI.app = this;

    this.ModelManager = ModelManager;

    /**
     * Instance of SoHo Xi applicationmenu.
     */
    this.applicationmenu = null;

    /**
     * Instance of SoHo Xi modal dialog for view settings. This was previously in
     * the right drawer.
     * @type {Modal}
    */
    this.viewSettingsModal = null;

    this.previousState = null;
  }

  /**
   * Loops through and disconnections connections and unsubscribes subscriptions.
   * Also calls {@link #uninitialize uninitialize}.
   */
  destroy() {
    $(window).off('resize', this.onResize.bind(this));
    $('body').off('beforetransition', this._onBeforeTransition.bind(this));
    $('body').off('aftertransition', this._onAfterTransition.bind(this));
    $('body').off('show', this._onActivate.bind(this));
    $(window).off('online', this._onOnline.bind(this));
    $(window).off('offline', this._onOffline.bind(this));
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
    const h = location.hash;
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

  _updateConnectionState(online) {
    // Don't fire the onConnectionChange if we are in the same state.
    if (this.onLine === online) {
      return;
    }

    this.onLine = online;
    this.onConnectionChange(online);
  }

  forceOnline() {
    this.store.dispatch(setConnectionState(true));
  }

  forceOffline() {
    this.store.dispatch(setConnectionState(false));
  }

  onConnectionChange(/* online*/) {}

  /**
   * Establishes various connections to events.
   */
  initConnects() {
    $(window).on('resize', this.onResize.bind(this));
    $('body').on('beforetransition', this._onBeforeTransition.bind(this));
    $('body').on('aftertransition', this._onAfterTransition.bind(this));
    $('body').on('show', this._onActivate.bind(this));
    $.ready(() => {
      $(window).on('online', this._onOnline.bind(this));
      $(window).on('offline', this._onOffline.bind(this));
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
    return new Promise((resolve, reject) => {
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
        resolve(results);
      }, (err) => {
        this.clearAppStatePromises();
        reject(err);
      });
    });
  }

  /**
   * Process a app state sequence and start the next sequnce when done.
   * @param {index) the index of the sequence to start
   * @param {sequences) an array of sequences
   */
  _initAppStateSequence(index, sequences) {
    return new Promise((resolve, reject) => {
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
        const promises = seq.items.map((item) => {
          return item.fn();
        });

        Promise.all(promises).then(() => {
          indicator.complete(true);
          this.modal.disableClose = false;
          this.modal.hide();
          this._initAppStateSequence(index + 1, sequences).then((results) => {
            resolve(results);
          }, (err) => {
            indicator.complete(true);
            this.modal.disableClose = false;
            this.modal.hide();
            reject(err);
          });
        }, (err) => {
          ErrorManager.addSimpleError(indicator.label, err);
          indicator.complete(true);
          this.modal.disableClose = false;
          this.modal.hide();
          reject(err);
        });
      } else {
        resolve();
      }
    });
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
    this.initIcons();
    this.initStore();
    this.initAppDOM(domNode);
    this.initPreferences();
    this.initSoho();
    this.initToasts();
    this.initPing();
    this.initServices(); // TODO: Remove
    this.initConnects();
    this._startupConnections();
    this.initModules();
    this.initToolbars();
    this.initHash();
    this.initModal();
    this.initScene();
  }

  initIcons() {
    render();
  }

  initSoho() {
    const container = this.getAppContainerNode();
    const menu = $('.application-menu', container).first();
    menu.applicationmenu();
    this.applicationmenu = menu.data('applicationmenu');

    const viewSettingsModal = $('.modal.view-settings', container).first();
    viewSettingsModal.modal();
    this.viewSettingsModal = viewSettingsModal.data('modal');
  }

  initScene() {
    this.scene = new Scene(this.store);
  }

  initStore() {
    this.store = Redux.createStore(this.getReducer(),
      this.getInitialState(),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    this.store.subscribe(this._onStateChange.bind(this));
  }

  _onStateChange() {
    const state = this.store.getState();

    if (this.previousState === null) {
      this.previousState = state;
    }

    this.onStateChange(state);

    if (this.previousState.online !== state.online) {
      this._updateConnectionState(state.online);
    }

    this.previousState = state;
  }

  onStateChange(state) { // eslint-disable-line
  }

  showApplicationMenuOnLarge() {
    this.applicationmenu.settings.openOnLarge = true;
    if (this.applicationmenu.isLargerThanBreakpoint()) {
      this.applicationmenu.openMenu();
    }
  }

  hideApplicationMenuOnLarge() {
    this.applicationmenu.settings.openOnLarge = true;
    if (this.applicationmenu.isLargerThanBreakpoint()) {
      this.applicationmenu.closeMenu();
    }
  }

  getReducer() {
    return sdk;
  }

  getInitialState() {
    return {};
  }

  initToasts() {
    this.toast = new Toast({
      containerNode: this.getContainerNode(),
    });
  }

  initPing() {
    // Lite build, which will not have Rx, disable offline and ping
    if (!Rx) {
      this.ping = () => {
        this.store.dispatch(setConnectionState(true));
      };
      this.enableOfflineSupport = false;
    }

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
        this.store.dispatch(setConnectionState(true));
      }, () => {
        this.store.dispatch(setConnectionState(false));
      });
    }, this.PING_DEBOUNCE);
  }

  initPreferences() {
    this._loadPreferences();
  }

  initModal() {
    this.modal = new Modal();
    this.modal.place(this._appContainerNode)
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

  supportsFileAPI() {
    if (this.isIE()) {
      return false;
    }

    if (window.File && window.FileReader && window.FileList && window.Blob) {
      return true;
    }

    return false;
  }

  isIE() {
    return /MSIE|Trident/.test(window.navigator.userAgent);
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
    this.registerOrientationCheck(this.updateOrientationDom.bind(this));
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

  initAppDOM(domNode) {
    if (this._viewContainerNode && this._appContainerNode) {
      return;
    }

    // If a domNode is provided, create the app's dom under this
    if (domNode) {
      this._appContainerNode = domNode;
      this._createViewContainerNode();
      return;
    }

    // Nothing was provided, create a default
    this._createAppContainerNode();
    this._createViewContainerNode();
  }

  _createAppContainerNode() {
    const defaultAppContainerId = 'rootNode';
    $('body').append(`
      <div id="${defaultAppContainerId}">
      </div>
    `);
    this._appContainerNode = $(`#${defaultAppContainerId}`).get(0);
  }

  _createViewContainerNode() {
    if (!this._appContainerNode) {
      throw new Error('Set the app container node before creating the view container node.');
    }

    const defaultViewContainerId = 'viewContainer';
    const defaultViewContainerClasses = 'page-container scrollable viewContainer';
    $(this._appContainerNode).append(`
      <nav id="application-menu" data-open-on-large="false" class="application-menu show-shadow"
        data-breakpoint="tablet">
      </nav>
      <div class="page-container scrollable tbarContainer">
        <div id="${defaultViewContainerId}" class="${defaultViewContainerClasses}"></div>
        <div class="modal view-settings" role="dialog" aria-modal="true" aria-hidden="false">
          <div class="modal-content">
            <div class="modal-header">
              <h1>View Settings</h1>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-buttonset">
              <button type="button" class="btn-modal" style="width:100%">Close</button>
            </div>
          </div>
        </div>
      </div>
    `);

    this._viewContainerNode = $(`#${defaultViewContainerId}`).get(0);
  }

  /**
   * Returns the dom associated to the container element.
   * @deprecated
   */
  getContainerNode() {
    return this._appContainerNode || this._viewContainerNode;
  }

  getAppContainerNode() {
    return this._appContainerNode;
  }

  getViewContainerNode() {
    return this._viewContainerNode;
  }

  /**
   * Registers a view with the application and renders it to HTML.
   * If the application has already been initialized, the view is immediately initialized as well.
   * @param {View} view A view instance to be registered.
   * @param {domNode} domNode Optional. A DOM node to place the view in.
   */
  registerView(view, domNode) {
    const id = view.id;

    const node = domNode || this._viewContainerNode;
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

    const tbarNode = $('> .tbarContainer', this._appContainerNode).get(0);
    const node = domNode || tbarNode;
    tbar.placeAt(node, 'first');

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
    const root = $(this.getContainerNode());
    const currentOrient = root.attr('orient');
    if (value === currentOrient) {
      return;
    }

    root.attr('orient', value);

    if (value === 'portrait') {
      root.removeClass('landscape');
      root.addClass('portrait');
    } else if (value === 'landscape') {
      root.removeClass('portrait');
      root.addClass('landscape');
    } else {
      root.removeClass('portrait');
      root.removeClass('landscape');
    }

    this.currentOrientation = value;
    this.onSetOrientation(value);
    // connect.publish('/app/setOrientation', [value]); // TODO: Push this state into redux
  }

  registerOrientationCheck(callback) {
    const match = window.matchMedia('(orientation: portrait)');

    const checkMedia = (m) => {
      if (m.matches) {
        callback('portrait');
      } else {
        callback('landscape');
      }
    };
    match.addListener(checkMedia);
    checkMedia(match);
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
  getViewDetailOnly(key) {
    return this._internalGetView({
      key,
      init: false,
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
        view.init(this.store);
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
   * Resize handle
   */
  onResize() {
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
    const filtered = list.filter((item) => {
      return predicate.call(scope || this, item.data);
    });

    return filtered.map((item) => {
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
    if (Array.isArray(kind)) {
      kind.forEach(function forEach(item) {
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

  setToolBarMode(onLine) {
    for (const n in this.bars) {
      if (this.bars[n].managed) {
        this.bars[n].setMode(onLine);
      }
    }
  }
}
