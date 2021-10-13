define('argos/Application', ['module', 'exports', './Utility', './Models/Manager', './Dialogs/Toast', './Dialogs/Modal', './Dialogs/BusyIndicator', 'dojo/_base/connect', './ErrorManager', './I18n', './reducers/index', './actions/connection', './Scene', './SohoIcons'], function (module, exports, _Utility, _Manager, _Toast, _Modal, _BusyIndicator, _connect, _ErrorManager, _I18n, _index, _connection, _Scene, _SohoIcons) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Utility2 = _interopRequireDefault(_Utility);

  var _Manager2 = _interopRequireDefault(_Manager);

  var _Toast2 = _interopRequireDefault(_Toast);

  var _Modal2 = _interopRequireDefault(_Modal);

  var _BusyIndicator2 = _interopRequireDefault(_BusyIndicator);

  var _connect2 = _interopRequireDefault(_connect);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _I18n2 = _interopRequireDefault(_I18n);

  var _Scene2 = _interopRequireDefault(_Scene);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  const resource = (0, _I18n2.default)('sdkApplication');

  Function.prototype.bindDelegate = function bindDelegate(scope) {
    //eslint-disable-line
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

  window.mergeConfiguration = function mergeConfiguration(baseConfiguration, moduleConfiguration) {
    console.warn('mergeConfiguration is deprecated. If you wish to modify the base configuration, see the argos-sample here: https://github.com/Saleslogix/argos-sample/blob/master/configuration/development.js'); // eslint-disable-line
    if (baseConfiguration) {
      if (baseConfiguration.modules && moduleConfiguration.modules) {
        baseConfiguration.modules = baseConfiguration.modules.concat(moduleConfiguration.modules);
      }

      if (baseConfiguration.connections && moduleConfiguration.connections) {
        baseConfiguration.connections = Object.assign(baseConfiguration.connections, moduleConfiguration.connections);
      }
    }

    return baseConfiguration;
  };

  /**
   * @alias module:argos/Application
   * @classdesc Application is a nexus that provides many routing and global application services that may be used
   * from anywhere within the app.
   *
   * It provides a shortcut alias to `window.App` (`App`) with the most common usage being `App.getView(id)`.
   */

  let Application = function () {
    function Application() {
      _classCallCheck(this, Application);

      /**
       * @property enableConcurrencyCheck {Boolean} Option to skip concurrency checks to avoid precondition/412 errors.
       */
      this.enableConcurrencyCheck = false;
      this.serviceWorkerPath = '';
      this.serviceWorkerRegistrationOptions = {};

      this.ReUI = {
        app: null,
        back: function back() {
          if (!this.app) {
            return;
          }
          if (this.app.context && this.app.context.history && this.app.context.history.length > 0) {
            // Note: PageJS will push the page back onto the stack once viewed
            const from = this.app.context.history.pop();
            page.len--;

            const returnTo = from.data && from.data.options && from.data.options.returnTo;

            if (returnTo) {
              let returnIndex = [...this.app.context.history].reverse().findIndex(val => val.page === returnTo);
              // Since want to find last index of page, must reverse index
              if (returnIndex !== -1) {
                returnIndex = this.app.context.history.length - 1 - returnIndex;
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
          history: null
        }
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
      this.PING_RETRY = 3;

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
        history: []
      };
      this.viewShowOptions = [];

      // For routing need to know homeViewId
      this.ReUI.app = this;

      this.ModelManager = _Manager2.default;

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
      /*
       * Resource Strings
       */
      this.viewSettingsText = resource.viewSettingsText;
      this.closeText = resource.closeText;
    }

    /**
     * Loops through and disconnections connections and unsubscribes subscriptions.
     * Also calls {@link #uninitialize uninitialize}.
     */


    _createClass(Application, [{
      key: 'destroy',
      value: function destroy() {
        $(window).off('resize', this.onResize.bind(this));
        $('body').off('beforetransition', this._onBeforeTransition.bind(this));
        $('body').off('aftertransition', this._onAfterTransition.bind(this));
        $('body').off('show', this._onActivate.bind(this));
        window.removeEventListener('online', this._onOnline.bind(this));
        window.removeEventListener('offline', this._onOffline.bind(this));

        this.uninitialize();
      }
    }, {
      key: 'uninitialize',
      value: function uninitialize() {}
    }, {
      key: 'back',
      value: function back() {
        if (!this._embedded) {
          ReUI.back();
        }
      }
    }, {
      key: 'initHash',
      value: function initHash() {
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
    }, {
      key: '_onOffline',
      value: function _onOffline() {
        this.ping();
      }
    }, {
      key: '_onOnline',
      value: function _onOnline() {
        this.ping();
      }
    }, {
      key: '_updateConnectionState',
      value: function _updateConnectionState(online) {
        // Don't fire the onConnectionChange if we are in the same state.
        if (this.onLine === online) {
          return;
        }

        this.onLine = online;
        this.onConnectionChange(online);
      }
    }, {
      key: 'forceOnline',
      value: function forceOnline() {
        this.store.dispatch((0, _connection.setConnectionState)(true));
      }
    }, {
      key: 'forceOffline',
      value: function forceOffline() {
        this.store.dispatch((0, _connection.setConnectionState)(false));
      }
    }, {
      key: 'onConnectionChange',
      value: function onConnectionChange() /* online*/{}
    }, {
      key: 'initConnects',
      value: function initConnects() {
        $(window).on('resize', this.onResize.bind(this));
        $('body').on('beforetransition', this._onBeforeTransition.bind(this));
        $('body').on('aftertransition', this._onAfterTransition.bind(this));
        $('body').on('show', this._onActivate.bind(this));
        $(document).ready(() => {
          window.addEventListener('online', this._onOnline.bind(this));
          window.addEventListener('offline', this._onOffline.bind(this));
        });

        this.ping();
      }
    }, {
      key: '_ping',
      value: function _ping() {
        return new Promise(resolve => {
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
    }, {
      key: 'initAppState',
      value: function initAppState() {
        return new Promise((resolve, reject) => {
          const sequences = [];
          this._appStatePromises.forEach(item => {
            let seq;
            if (typeof item === 'function') {
              seq = sequences.find(x => x.seq === 0);
              if (!seq) {
                seq = {
                  seq: 0,
                  description: resource.loadingApplicationStateText,
                  items: []
                };
                sequences.push(seq);
              }
              seq.items.push({
                name: 'default',
                description: '',
                fn: item
              });
            } else {
              if (item.seq && item.items) {
                seq = sequences.find(x => x.seq === (item.seq ? item.seq : 0));
                if (seq) {
                  item.items.forEach(_item => {
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

          this._initAppStateSequence(0, sequences).then(results => {
            try {
              this.clearAppStatePromises();
              this.initModulesDynamic();
              resolve(results);
            } catch (e) {
              reject(e);
            }
          }, err => {
            this.clearAppStatePromises();
            reject(err);
          });
        });
      }
    }, {
      key: '_initAppStateSequence',
      value: function _initAppStateSequence(index, sequences) {
        return new Promise((resolve, reject) => {
          const seq = sequences[index];
          if (seq) {
            // We need to send an observable and get ride of the ui element.
            const indicator = new _BusyIndicator2.default({
              id: `busyIndicator__appState_${seq.seq}`,
              label: `${resource.initializingText} ${seq.description}`
            });
            this.modal.disableClose = true;
            this.modal.showToolbar = false;
            this.modal.add(indicator);
            indicator.start();
            const promises = seq.items.map(item => {
              return item.fn();
            });

            Promise.all(promises).then(() => {
              indicator.complete(true);
              this.modal.disableClose = false;
              this.modal.hide();
              this._initAppStateSequence(index + 1, sequences).then(results => {
                resolve(results);
              }, err => {
                indicator.complete(true);
                this.modal.disableClose = false;
                this.modal.hide();
                reject(err);
              });
            }, err => {
              _ErrorManager2.default.addSimpleError(indicator.label, err);
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
    }, {
      key: 'registerAppStatePromise',
      value: function registerAppStatePromise(promise) {
        this._appStatePromises.push(promise);
        return this;
      }
    }, {
      key: 'clearAppStatePromises',
      value: function clearAppStatePromises() {
        this._appStatePromises = [];
      }
    }, {
      key: 'onSetOrientation',
      value: function onSetOrientation() /* value*/{}
    }, {
      key: 'initServices',
      value: function initServices() {
        for (const name in this.connections) {
          if (this.connections.hasOwnProperty(name)) {
            this.registerService(name, this.connections[name]);
          }
        }
      }
    }, {
      key: 'initModules',
      value: function initModules() {
        for (let i = 0; i < this.modules.length; i++) {
          this.modules[i].init(this);
        }
      }
    }, {
      key: 'initModulesDynamic',
      value: function initModulesDynamic() {
        if (this.isDynamicInitialized) {
          return;
        }
        for (let i = 0; i < this.modules.length; i++) {
          this.modules[i].initDynamic(this);
        }
        this.isDynamicInitialized = true;
      }
    }, {
      key: 'initToolbars',
      value: function initToolbars() {
        for (const n in this.bars) {
          if (this.bars.hasOwnProperty(n)) {
            this.bars[n].init(); // todo: change to startup
          }
        }
      }
    }, {
      key: 'activate',
      value: function activate() {
        window.App = this;
      }
    }, {
      key: 'init',
      value: function init(domNode) {
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
        this.initServiceWorker();
        this.updateSoho();
      }
    }, {
      key: 'initServiceWorker',
      value: function initServiceWorker() {
        try {
          if ('serviceWorker' in navigator && typeof this.serviceWorkerPath === 'string') {
            navigator.serviceWorker.register(this.serviceWorkerPath, this.serviceWorkerRegistrationOptions).then(registration => {
              console.log('Serviceworker registered with scope: ', registration.scope); // eslint-disable-line
            }, err => {
              console.error('Service worker registration failed: ', err); // eslint-disable-line
              _ErrorManager2.default.addSimpleError('Error in service worker registration', err);
              this.showServiceWorkerError();
            });

            navigator.serviceWorker.addEventListener('message', event => {
              this.onServiceWorkerMessage(event);
            });
          }
        } catch (err) {
          _ErrorManager2.default.addSimpleError('Error in initServiceWorker()', err);
          this.showServiceWorkerError();
        }
      }
    }, {
      key: 'onServiceWorkerMessage',
      value: function onServiceWorkerMessage(event) {} // eslint-disable-line


      /**
       * Send a data message to the service worker.
       * Returns a promise with the response message.
       * @param {Object} message
       */

    }, {
      key: 'sendServiceWorkerMessage',
      value: function sendServiceWorkerMessage(message) {
        return new Promise((resolve, reject) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = event => {
            resolve(event.data);
          };

          channel.port1.onerror = err => {
            reject(err);
          };

          navigator.serviceWorker.ready.then(reg => {
            const serviceWorker = reg.active;
            serviceWorker.postMessage(message, [channel.port2]);
          });
        });
      }
    }, {
      key: 'initIcons',
      value: function initIcons() {
        (0, _SohoIcons.render)();
      }
    }, {
      key: 'initSoho',
      value: function initSoho() {
        const container = this.getAppContainerNode();
        const menu = $('.application-menu', container).first();
        const closeMenuHeader = $('.application-menu-header').first();

        menu.applicationmenu();
        this.applicationmenu = menu.data('applicationmenu');
        menu.on('applicationmenuopen', () => {
          _connect2.default.publish('/app/menuopen', [true]);
        });

        menu.on('applicationmenuclose', () => {
          _connect2.default.publish('/app/menuclose', [true]);
        });

        closeMenuHeader.on('click', () => {
          this.hideApplicationMenu();
        });

        const viewSettingsModal = $('.modal.view-settings', container).first();
        viewSettingsModal.modal();
        this.viewSettingsModal = viewSettingsModal.data('modal');
      }
    }, {
      key: 'updateSoho',
      value: function updateSoho() {
        this.applicationmenu.updated();
      }
    }, {
      key: 'initScene',
      value: function initScene() {
        this.scene = new _Scene2.default(this.store);
      }
    }, {
      key: 'initStore',
      value: function initStore() {
        this.store = Redux.createStore(this.getReducer(), this.getInitialState(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
        this.store.subscribe(this._onStateChange.bind(this));
      }
    }, {
      key: '_onStateChange',
      value: function _onStateChange() {
        const state = this.store.getState();

        if (this.previousState === null) {
          this.previousState = state;
        }

        this.onStateChange(state);

        const sdkState = state && state.sdk;
        const previousSdkState = this.previousState && this.previousState.sdk;

        if (sdkState && previousSdkState && sdkState.online !== previousSdkState.online) {
          this._updateConnectionState(sdkState.online);
        }

        this.previousState = state;
      }
    }, {
      key: 'onStateChange',
      value: function onStateChange(state) {// eslint-disable-line
      }
    }, {
      key: 'showApplicationMenuOnLarge',
      value: function showApplicationMenuOnLarge() {
        // todo: openOnLarge causes this bug SOHO-6193
        this.applicationmenu.settings.openOnLarge = true;

        if (this.applicationmenu.isLargerThanBreakpoint()) {
          this.applicationmenu.openMenu();
        }
      }
    }, {
      key: 'hideApplicationMenu',
      value: function hideApplicationMenu() {
        this.applicationmenu.closeMenu(true);
      }
    }, {
      key: 'showApplicationMenu',
      value: function showApplicationMenu() {
        this.applicationmenu.openMenu();
      }
    }, {
      key: 'getReducer',
      value: function getReducer() {
        return _index.sdk;
      }
    }, {
      key: 'getInitialState',
      value: function getInitialState() {
        return {};
      }
    }, {
      key: 'initToasts',
      value: function initToasts() {
        this.toast = new _Toast2.default({
          containerNode: this.getContainerNode()
        });
      }
    }, {
      key: 'initPing',
      value: function initPing() {
        // this.ping will be set if ping was passed as an options to the ctor
        if (this.ping) {
          return;
        }

        this.ping = _Utility2.default.debounce(() => {
          this.toast.add({
            message: resource.checkingText,
            title: resource.connectionToastTitleText,
            toastTime: this.PING_TIMEOUT
          });

          let attempts = 1;
          const handle = setInterval(() => {
            this._ping().then(online => {
              if (online) {
                this.store.dispatch((0, _connection.setConnectionState)(true));
                clearInterval(handle);
                return;
              }

              attempts++;
              if (attempts > this.PING_RETRY) {
                this.store.dispatch((0, _connection.setConnectionState)(false));
                clearInterval(handle);
              }
            });
          }, this.PING_TIMEOUT);
        }, this.PING_DEBOUNCE);
      }
    }, {
      key: 'initPreferences',
      value: function initPreferences() {
        this._loadPreferences();
      }
    }, {
      key: 'initModal',
      value: function initModal() {
        this.modal = new _Modal2.default();
        this.modal.place(this._appContainerNode).hide();
      }
    }, {
      key: 'is24HourClock',
      value: function is24HourClock() {
        return JSON.parse(window.localStorage.getItem('use24HourClock') || Mobile.CultureInfo.default24HourClock.toString()) === true;
      }
    }, {
      key: 'is12HourClock',
      value: function is12HourClock() {
        return !this.is24HourClock();
      }
    }, {
      key: 'isCurrentRegionMetric',
      value: function isCurrentRegionMetric() {
        return Mobile.CultureInfo.isRegionMetric || this.isRegionMetric;
      }
    }, {
      key: 'supportsTouch',
      value: function supportsTouch() {
        // Taken from https://github.com/Modernizr/Modernizr/ (MIT Licensed)
        return 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
      }
    }, {
      key: 'supportsFileAPI',
      value: function supportsFileAPI() {
        if (this.isIE()) {
          return false;
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          return true;
        }

        return false;
      }
    }, {
      key: 'isIE',
      value: function isIE() {
        return (/MSIE|Trident/.test(window.navigator.userAgent)
        );
      }
    }, {
      key: 'persistPreferences',
      value: function persistPreferences() {
        try {
          if (window.localStorage) {
            window.localStorage.setItem('preferences', JSON.stringify(this.preferences));
          }
        } catch (e) {
          console.error(e); // eslint-disable-line
        }
      }
    }, {
      key: '_loadPreferences',
      value: function _loadPreferences() {
        try {
          if (window.localStorage) {
            this.preferences = JSON.parse(window.localStorage.getItem('preferences'));
          }
        } catch (e) {
          console.error(e); // eslint-disable-line
        }
      }
    }, {
      key: '_startupConnections',
      value: function _startupConnections() {
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
    }, {
      key: 'run',
      value: function run() {
        this._started = true;
        this.registerOrientationCheck(this.updateOrientationDom.bind(this));
        page({
          dispatch: false,
          hashbang: true,
          usingUrl: !this._embedded
        });
      }
    }, {
      key: 'isOnline',
      value: function isOnline() {
        return this.onLine;
      }
    }, {
      key: 'isOnFirstView',
      value: function isOnFirstView() {}
    }, {
      key: 'registerService',
      value: function registerService(name, service, options = {}) {
        const instance = service instanceof Sage.SData.Client.SDataService ? service : new Sage.SData.Client.SDataService(service);

        this.services[name] = instance;

        instance.on('requesttimeout', this.onRequestTimeout, this);

        if (options.isDefault || service.isDefault || !this.defaultService) {
          this.defaultService = instance;
        }

        return this;
      }
    }, {
      key: 'registerConnection',
      value: function registerConnection(name, definition, options = {}) {
        const instance = definition instanceof Sage.SData.Client.SDataService ? definition : new Sage.SData.Client.SDataService(definition);

        this._connections[name] = instance;

        instance.on('requesttimeout', this.onRequestTimeout, this);

        if (options.isDefault || definition.isDefault || !this._connections.default) {
          this._connections.default = instance;
        }

        return this;
      }
    }, {
      key: 'onRequestTimeout',
      value: function onRequestTimeout() {
        this.ping();
      }
    }, {
      key: 'hasService',
      value: function hasService(name) {
        return !!this.services[name];
      }
    }, {
      key: 'initAppDOM',
      value: function initAppDOM(domNode) {
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
    }, {
      key: '_createAppContainerNode',
      value: function _createAppContainerNode() {
        const defaultAppContainerId = 'rootNode';
        $('body').append(`
      <div id="${defaultAppContainerId}">
      </div>
    `);
        this._appContainerNode = $(`#${defaultAppContainerId}`).get(0);
      }
    }, {
      key: '_createViewContainerNode',
      value: function _createViewContainerNode() {
        if (!this._appContainerNode) {
          throw new Error('Set the app container node before creating the view container node.');
        }

        const defaultViewContainerId = 'viewContainer';
        const defaultViewContainerClasses = 'page-container viewContainer';
        $(this._appContainerNode).append(`
      <nav id="application-menu" data-open-on-large="false" class="application-menu show-shadow"
        data-breakpoint="large">
        <div class="application-menu-header">
          <button type="button" class="btn-icon icon-close" aria-label="${this.closeText}">
              <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
                <use xlink:href="#icon-close"></use>
              </svg>
          </button>
        </div>
      </nav>
      <div class="page-container scrollable tbarContainer">
        <div id="${defaultViewContainerId}" class="${defaultViewContainerClasses}"></div>
        <div class="modal view-settings" role="dialog" aria-modal="true" aria-hidden="false">
          <div class="modal-content">
            <div class="modal-header">
              <h1>${this.viewSettingsText}</h1>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-buttonset">
              <button type="button" class="btn-modal" style="width:100%">${this.closeText}</button>
            </div>
          </div>
        </div>
      </div>
    `);

        this._viewContainerNode = $(`#${defaultViewContainerId}`).get(0);
      }
    }, {
      key: 'getContainerNode',
      value: function getContainerNode() {
        return this._appContainerNode || this._viewContainerNode;
      }
    }, {
      key: 'getAppContainerNode',
      value: function getAppContainerNode() {
        return this._appContainerNode;
      }
    }, {
      key: 'getViewContainerNode',
      value: function getViewContainerNode() {
        return this._viewContainerNode;
      }
    }, {
      key: 'registerView',
      value: function registerView(view, domNode, position = 'first') {
        const id = view.id;

        const node = domNode || this._viewContainerNode;
        view._placeAt = node;
        view._placePosition = position;
        this.views[id] = view;

        this.registerViewRoute(view);

        this.onRegistered(view);

        return this;
      }
    }, {
      key: 'registerViewRoute',
      value: function registerViewRoute(view) {
        if (!view || typeof view.getRoute !== 'function') {
          return;
        }

        page(view.getRoute(), view.routeLoad.bind(view), view.routeShow.bind(view));
      }
    }, {
      key: 'registerToolbar',
      value: function registerToolbar(n, t, domNode) {
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
    }, {
      key: 'getViews',
      value: function getViews() {
        const results = [];

        for (const view in this.views) {
          if (this.views.hasOwnProperty(view)) {
            results.push(this.views[view]);
          }
        }

        return results;
      }
    }, {
      key: 'isViewActive',
      value: function isViewActive(view) {
        // todo: add check for multiple active views.
        return this.getPrimaryActiveView() === view;
      }
    }, {
      key: 'updateOrientationDom',
      value: function updateOrientationDom(value) {
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
        _connect2.default.publish('/app/setOrientation', [value]);
      }
    }, {
      key: 'registerOrientationCheck',
      value: function registerOrientationCheck(callback) {
        const match = window.matchMedia('(orientation: portrait)');

        const checkMedia = m => {
          if (m.matches) {
            callback('portrait');
          } else {
            callback('landscape');
          }
        };
        match.addListener(checkMedia);
        checkMedia(match);
      }
    }, {
      key: 'getPrimaryActiveView',
      value: function getPrimaryActiveView() {
        const el = this.getCurrentPage();
        if (el) {
          return this.getView(el);
        }
      }
    }, {
      key: 'setCurrentPage',
      value: function setCurrentPage(_page) {
        this._currentPage = _page;
      }
    }, {
      key: 'getCurrentPage',
      value: function getCurrentPage() {
        return this._currentPage;
      }
    }, {
      key: 'hasView',
      value: function hasView(key) {
        return !!this._internalGetView({
          key,
          init: false
        });
      }
    }, {
      key: 'getView',
      value: function getView(key, init = true) {
        return this._internalGetView({
          key,
          init
        });
      }
    }, {
      key: 'getViewDetailOnly',
      value: function getViewDetailOnly(key) {
        return this._internalGetView({
          key,
          init: false
        });
      }
    }, {
      key: '_internalGetView',
      value: function _internalGetView(options) {
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
            view.placeAt(view._placeAt, view._placePosition || 'first');
            view._started = true;
            view._placeAt = null;
          }

          return view;
        }

        return null;
      }
    }, {
      key: 'getViewSecurity',
      value: function getViewSecurity(key, access) {
        const view = this._internalGetView({
          key,
          init: false
        });
        return view && view.getSecurity(access);
      }
    }, {
      key: 'getService',
      value: function getService(name) {
        if (typeof name === 'string' && this.services[name]) {
          return this.services[name];
        }

        return this.defaultService;
      }
    }, {
      key: 'hasConnection',
      value: function hasConnection(name) {
        return !!this._connections[name];
      }
    }, {
      key: 'getConnection',
      value: function getConnection(name) {
        if (this._connections[name]) {
          return this._connections[name];
        }

        return this._connections.default;
      }
    }, {
      key: 'setPrimaryTitle',
      value: function setPrimaryTitle(title) {
        for (const n in this.bars) {
          if (this.bars.hasOwnProperty(n)) {
            if (this.bars[n].managed) {
              this.bars[n].set('title', title);

              // update soho toolbar when title is changed since it uses text length to calculate header width
              const header = $(this.bars.tbar.domNode);
              this.toolbar = header.find('.toolbar').data('toolbar');
              this.toolbar.updated();
            }
          }
        }

        return this;
      }
    }, {
      key: 'onResize',
      value: function onResize() {}
    }, {
      key: 'onRegistered',
      value: function onRegistered() /* view*/{}
    }, {
      key: 'onBeforeViewTransitionAway',
      value: function onBeforeViewTransitionAway() /* view*/{}
    }, {
      key: 'onBeforeViewTransitionTo',
      value: function onBeforeViewTransitionTo() /* view*/{}
    }, {
      key: 'onViewTransitionAway',
      value: function onViewTransitionAway() /* view*/{}
    }, {
      key: 'onViewTransitionTo',
      value: function onViewTransitionTo() /* view*/{}
    }, {
      key: 'onViewActivate',
      value: function onViewActivate() /* view, tag, data*/{}
    }, {
      key: '_onBeforeTransition',
      value: function _onBeforeTransition(evt) {
        const view = this.getView(evt.target);
        if (view) {
          if (evt.out) {
            this._beforeViewTransitionAway(view);
          } else {
            this._beforeViewTransitionTo(view);
          }
        }
      }
    }, {
      key: '_onAfterTransition',
      value: function _onAfterTransition(evt) {
        const view = this.getView(evt.target);
        if (view) {
          if (evt.out) {
            this._viewTransitionAway(view);
          } else {
            this._viewTransitionTo(view);
          }
        }
      }
    }, {
      key: '_onActivate',
      value: function _onActivate(evt) {
        const view = this.getView(evt.target);
        if (view) {
          this._viewActivate(view, evt.tag, evt.data);
        }
      }
    }, {
      key: '_beforeViewTransitionAway',
      value: function _beforeViewTransitionAway(view) {
        this.onBeforeViewTransitionAway(view);

        view.beforeTransitionAway();
      }
    }, {
      key: '_beforeViewTransitionTo',
      value: function _beforeViewTransitionTo(view) {
        this.onBeforeViewTransitionTo(view);

        for (const n in this.bars) {
          if (this.bars[n].managed) {
            this.bars[n].clear();
          }
        }

        view.beforeTransitionTo();
      }
    }, {
      key: '_viewTransitionAway',
      value: function _viewTransitionAway(view) {
        this.onViewTransitionAway(view);

        view.transitionAway();
      }
    }, {
      key: '_viewTransitionTo',
      value: function _viewTransitionTo(view) {
        this.onViewTransitionTo(view);

        const tools = view.options && view.options.tools || view.getTools() || {};

        for (const n in this.bars) {
          if (this.bars[n].managed) {
            this.bars[n].showTools(tools[n]);
          }
        }

        view.transitionTo();
      }
    }, {
      key: '_viewActivate',
      value: function _viewActivate(view, tag, data) {
        this.onViewActivate(view);

        view.activate(tag, data);
      }
    }, {
      key: 'filterNavigationContext',
      value: function filterNavigationContext(predicate, scope) {
        const list = this.context.history || [];
        const filtered = list.filter(item => {
          return predicate.call(scope || this, item.data);
        });

        return filtered.map(item => {
          return item.data;
        });
      }
    }, {
      key: 'queryNavigationContext',
      value: function queryNavigationContext(predicate, d, s) {
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
    }, {
      key: 'isNavigationFromResourceKind',
      value: function isNavigationFromResourceKind(kind, predicate, scope) {
        const lookup = {};
        if (Array.isArray(kind)) {
          kind.forEach(function forEach(item) {
            this[item] = true;
          }, lookup);
        } else {
          lookup[kind] = true;
        }

        return this.queryNavigationContext(function queryNavigationContext(o) {
          const context = o.options && o.options.source || o;
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
    }, {
      key: 'registerCustomization',
      value: function registerCustomization(p, s) {
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
    }, {
      key: 'getCustomizationsFor',
      value: function getCustomizationsFor(p) {
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
    }, {
      key: 'hasAccessTo',
      value: function hasAccessTo() /* security*/{
        return true;
      }
    }, {
      key: 'showLeftDrawer',
      value: function showLeftDrawer() {
        return this;
      }
    }, {
      key: 'showRightDrawer',
      value: function showRightDrawer() {
        return this;
      }
    }, {
      key: 'setToolBarMode',
      value: function setToolBarMode(onLine) {
        for (const n in this.bars) {
          if (this.bars[n].managed) {
            this.bars[n].setMode(onLine);
          }
        }
      }
    }, {
      key: 'showServiceWorkerError',
      value: function showServiceWorkerError() {
        if (this.toast) {
          this.toast.add({
            message: resource.serviceWorkerError,
            title: resource.serviceWorkerErrorTitle
          });
        } else {
          alert(resource.serviceWorkerError); // eslint-disable-line
        }
      }
    }]);

    return Application;
  }();

  exports.default = Application;
  module.exports = exports['default'];
});