define('argos/Application', ['module', 'exports', './Utility', './Models/Manager', './Dialogs/Toast', './Dialogs/Modal', './Dialogs/BusyIndicator', 'dojo/hash', 'dojo/_base/connect', './ErrorManager', './I18n', './reducers/index', './actions/connection', './Scene', './SohoIcons'], function (module, exports, _Utility, _Manager, _Toast, _Modal, _BusyIndicator, _hash, _connect, _ErrorManager, _I18n, _index, _connection, _Scene, _SohoIcons) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Utility2 = _interopRequireDefault(_Utility);

  var _Manager2 = _interopRequireDefault(_Manager);

  var _Toast2 = _interopRequireDefault(_Toast);

  var _Modal2 = _interopRequireDefault(_Modal);

  var _BusyIndicator2 = _interopRequireDefault(_BusyIndicator);

  var _hash2 = _interopRequireDefault(_hash);

  var _connect2 = _interopRequireDefault(_connect);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _I18n2 = _interopRequireDefault(_I18n);

  var _Scene2 = _interopRequireDefault(_Scene);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
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

  var resource = (0, _I18n2.default)('sdkApplication');

  Function.prototype.bindDelegate = function bindDelegate(scope) {
    //eslint-disable-line
    var self = this;

    if (arguments.length === 1) {
      return function bound() {
        return self.apply(scope || this, arguments);
      };
    }

    var optional = Array.prototype.slice.call(arguments, 1);
    return function boundWArgs() {
      var called = Array.prototype.slice.call(arguments, 0);
      return self.apply(scope || this, called.concat(optional));
    };
  };

  /**
   * @alias argos.Application
   * @classdesc Application is a nexus that provides many routing and global application services that may be used
   * from anywhere within the app.
   *
   * It provides a shortcut alias to `window.App` (`App`) with the most common usage being `App.getView(id)`.
   */

  var Application = function () {
    function Application() {
      _classCallCheck(this, Application);

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
          if (this.app.context && this.app.context.history && this.app.context.history.length > 0) {
            // Note: PageJS will push the page back onto the stack once viewed
            var from = this.app.context.history.pop();
            page.len--;

            var returnTo = from.data && from.data.options && from.data.options.returnTo;

            if (returnTo) {
              var returnIndex = [].concat(_toConsumableArray(this.app.context.history)).reverse().findIndex(function (val) {
                return val.page === returnTo;
              });
              // Since want to find last index of page, must reverse index
              if (returnIndex !== -1) {
                returnIndex = this.app.context.history.length - 1 - returnIndex;
              }
              this.app.context.history.splice(returnIndex);
              page.redirect(returnTo);
              return;
            }

            var to = this.app.context.history.pop();
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
      this.hash = _hash2.default;
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
        var h = location.hash;
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
        var _this = this;

        $(window).on('resize', this.onResize.bind(this));
        $('body').on('beforetransition', this._onBeforeTransition.bind(this));
        $('body').on('aftertransition', this._onAfterTransition.bind(this));
        $('body').on('show', this._onActivate.bind(this));
        $(document).ready(function () {
          window.addEventListener('online', _this._onOnline.bind(_this));
          window.addEventListener('offline', _this._onOffline.bind(_this));
        });

        this.ping();
      }
    }, {
      key: '_ping',
      value: function _ping() {
        var _this2 = this;

        return new Promise(function (resolve) {
          var xhr = new XMLHttpRequest();
          xhr.ontimeout = function () {
            return resolve(false);
          };
          xhr.onerror = function () {
            return resolve(false);
          };
          xhr.onload = function () {
            var DONE = 4;
            var HTTP_OK = 200;
            var HTTP_NOT_MODIFIED = 304;

            if (xhr.readyState === DONE) {
              if (xhr.status === HTTP_OK || xhr.status === HTTP_NOT_MODIFIED) {
                resolve(true);
              } else {
                resolve(false);
              }
            }
          };
          xhr.open('GET', _this2.PING_RESOURCE + '?cache=' + Math.random());
          xhr.timeout = _this2.PING_TIMEOUT;
          xhr.send();
        });
      }
    }, {
      key: 'initAppState',
      value: function initAppState() {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          var sequences = [];
          _this3._appStatePromises.forEach(function (item) {
            var seq = void 0;
            if (typeof item === 'function') {
              seq = sequences.find(function (x) {
                return x.seq === 0;
              });
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
                seq = sequences.find(function (x) {
                  return x.seq === (item.seq ? item.seq : 0);
                });
                if (seq) {
                  item.items.forEach(function (_item) {
                    seq.items.push(_item);
                  });
                } else {
                  sequences.push(item);
                }
              }
            }
          });
          // Sort the sequence ascending so we can processes them in the right order.
          sequences.sort(function (a, b) {
            if (a.seq > b.seq) {
              return 1;
            }

            if (a.seq < b.seq) {
              return -1;
            }

            return 0;
          });

          _this3._initAppStateSequence(0, sequences).then(function (results) {
            try {
              _this3.clearAppStatePromises();
              _this3.initModulesDynamic();
              resolve(results);
            } catch (e) {
              reject(e);
            }
          }, function (err) {
            _this3.clearAppStatePromises();
            reject(err);
          });
        });
      }
    }, {
      key: '_initAppStateSequence',
      value: function _initAppStateSequence(index, sequences) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          var seq = sequences[index];
          if (seq) {
            // We need to send an observable and get ride of the ui element.
            var indicator = new _BusyIndicator2.default({
              id: 'busyIndicator__appState_' + seq.seq,
              label: resource.initializingText + ' ' + seq.description
            });
            _this4.modal.disableClose = true;
            _this4.modal.showToolbar = false;
            _this4.modal.add(indicator);
            indicator.start();
            var promises = seq.items.map(function (item) {
              return item.fn();
            });

            Promise.all(promises).then(function () {
              indicator.complete(true);
              _this4.modal.disableClose = false;
              _this4.modal.hide();
              _this4._initAppStateSequence(index + 1, sequences).then(function (results) {
                resolve(results);
              }, function (err) {
                indicator.complete(true);
                _this4.modal.disableClose = false;
                _this4.modal.hide();
                reject(err);
              });
            }, function (err) {
              _ErrorManager2.default.addSimpleError(indicator.label, err);
              indicator.complete(true);
              _this4.modal.disableClose = false;
              _this4.modal.hide();
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
        for (var name in this.connections) {
          if (this.connections.hasOwnProperty(name)) {
            this.registerService(name, this.connections[name]);
          }
        }
      }
    }, {
      key: 'initModules',
      value: function initModules() {
        for (var i = 0; i < this.modules.length; i++) {
          this.modules[i].init(this);
        }
      }
    }, {
      key: 'initModulesDynamic',
      value: function initModulesDynamic() {
        if (this.isDynamicInitialized) {
          return;
        }
        for (var i = 0; i < this.modules.length; i++) {
          this.modules[i].initDynamic(this);
        }
        this.isDynamicInitialized = true;
      }
    }, {
      key: 'initToolbars',
      value: function initToolbars() {
        for (var n in this.bars) {
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
        this.updateSoho();
      }
    }, {
      key: 'initIcons',
      value: function initIcons() {
        (0, _SohoIcons.render)();
      }
    }, {
      key: 'initSoho',
      value: function initSoho() {
        var _this5 = this;

        var container = this.getAppContainerNode();
        var menu = $('.application-menu', container).first();
        var closeMenuHeader = $('.application-menu-header').first();

        menu.applicationmenu();
        this.applicationmenu = menu.data('applicationmenu');
        menu.on('applicationmenuopen', function () {
          _connect2.default.publish('/app/menuopen', [true]);
        });

        menu.on('applicationmenuclose', function () {
          _connect2.default.publish('/app/menuclose', [true]);
        });

        closeMenuHeader.on('click', function () {
          _this5.hideApplicationMenu();
        });

        var viewSettingsModal = $('.modal.view-settings', container).first();
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
        var state = this.store.getState();

        if (this.previousState === null) {
          this.previousState = state;
        }

        this.onStateChange(state);

        var sdkState = state && state.sdk;
        var previousSdkState = this.previousState && this.previousState.sdk;

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
        var _this6 = this;

        // Lite build, which will not have Rx, disable offline and ping
        if (!Rx) {
          this.ping = function () {
            _this6.store.dispatch((0, _connection.setConnectionState)(true));
          };
          this.enableOfflineSupport = false;
        }

        // this.ping will be set if ping was passed as an options to the ctor
        if (this.ping) {
          return;
        }

        this.ping = _Utility2.default.debounce(function () {
          _this6.toast.add({
            message: resource.checkingText,
            title: resource.connectionToastTitleText,
            toastTime: _this6.PING_TIMEOUT
          });
          var ping$ = Rx.Observable.interval(_this6.PING_TIMEOUT).flatMap(function () {
            return Rx.Observable.fromPromise(_this6._ping()).flatMap(function (online) {
              if (online) {
                return Rx.Observable.of(online);
              }

              return Rx.Observable.throw(new Error());
            });
          }).retry(_this6.PING_RETRY).take(1);

          ping$.subscribe(function () {
            _this6.store.dispatch((0, _connection.setConnectionState)(true));
          }, function () {
            _this6.store.dispatch((0, _connection.setConnectionState)(false));
          });
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
        for (var name in this.connections) {
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
      value: function registerService(name, service) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var instance = service instanceof Sage.SData.Client.SDataService ? service : new Sage.SData.Client.SDataService(service);

        this.services[name] = instance;

        instance.on('requesttimeout', this.onRequestTimeout, this);

        if (options.isDefault || service.isDefault || !this.defaultService) {
          this.defaultService = instance;
        }

        return this;
      }
    }, {
      key: 'registerConnection',
      value: function registerConnection(name, definition) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var instance = definition instanceof Sage.SData.Client.SDataService ? definition : new Sage.SData.Client.SDataService(definition);

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
        var defaultAppContainerId = 'rootNode';
        $('body').append('\n      <div id="' + defaultAppContainerId + '">\n      </div>\n    ');
        this._appContainerNode = $('#' + defaultAppContainerId).get(0);
      }
    }, {
      key: '_createViewContainerNode',
      value: function _createViewContainerNode() {
        if (!this._appContainerNode) {
          throw new Error('Set the app container node before creating the view container node.');
        }

        var defaultViewContainerId = 'viewContainer';
        var defaultViewContainerClasses = 'page-container viewContainer';
        $(this._appContainerNode).append('\n      <nav id="application-menu" data-open-on-large="false" class="application-menu show-shadow"\n        data-breakpoint="large">\n        <div class="application-menu-header">\n          <button type="button" class="btn-icon icon-close">\n              <svg role="presentation" aria-hidden="true" focusable="false" class="icon">\n                <use xlink:href="#icon-close"></use>\n              </svg>\n          </button>\n        </div>\n      </nav>\n      <div class="page-container scrollable tbarContainer">\n        <div id="' + defaultViewContainerId + '" class="' + defaultViewContainerClasses + '"></div>\n        <div class="modal view-settings" role="dialog" aria-modal="true" aria-hidden="false">\n          <div class="modal-content">\n            <div class="modal-header">\n              <h1>' + this.viewSettingsText + '</h1>\n            </div>\n            <div class="modal-body">\n            </div>\n            <div class="modal-buttonset">\n              <button type="button" class="btn-modal" style="width:100%">' + this.closeText + '</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ');

        this._viewContainerNode = $('#' + defaultViewContainerId).get(0);
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
      value: function registerView(view, domNode) {
        var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'first';

        var id = view.id;

        var node = domNode || this._viewContainerNode;
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
        var name = n;
        var tbar = t;

        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
          tbar = name;
          name = tbar.name;
        }

        this.bars[name] = tbar;

        if (this._started) {
          tbar.init();
        }

        var tbarNode = $('> .tbarContainer', this._appContainerNode).get(0);
        var node = domNode || tbarNode;
        tbar.placeAt(node, 'first');

        return this;
      }
    }, {
      key: 'getViews',
      value: function getViews() {
        var results = [];

        for (var view in this.views) {
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
        var root = $(this.getContainerNode());
        var currentOrient = root.attr('orient');
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
        var match = window.matchMedia('(orientation: portrait)');

        var checkMedia = function checkMedia(m) {
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
        var el = this.getCurrentPage();
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
          key: key,
          init: false
        });
      }
    }, {
      key: 'getView',
      value: function getView(key) {
        return this._internalGetView({
          key: key,
          init: true
        });
      }
    }, {
      key: 'getViewDetailOnly',
      value: function getViewDetailOnly(key) {
        return this._internalGetView({
          key: key,
          init: false
        });
      }
    }, {
      key: '_internalGetView',
      value: function _internalGetView(options) {
        var key = options && options.key;
        var init = options && options.init;

        if (key) {
          var view = void 0;
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
        var view = this._internalGetView({
          key: key,
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
        for (var n in this.bars) {
          if (this.bars.hasOwnProperty(n)) {
            if (this.bars[n].managed) {
              this.bars[n].set('title', title);

              // update soho toolbar when title is changed since it uses text length to calculate header width
              var header = $(this.bars.tbar.domNode);
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
        var view = this.getView(evt.target);
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
        var view = this.getView(evt.target);
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
        var view = this.getView(evt.target);
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

        for (var n in this.bars) {
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

        var tools = view.options && view.options.tools || view.getTools() || {};

        for (var n in this.bars) {
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
        var _this7 = this;

        var list = this.context.history || [];
        var filtered = list.filter(function (item) {
          return predicate.call(scope || _this7, item.data);
        });

        return filtered.map(function (item) {
          return item.data;
        });
      }
    }, {
      key: 'queryNavigationContext',
      value: function queryNavigationContext(predicate, d, s) {
        var scope = s;
        var depth = d;

        if (typeof depth !== 'number') {
          scope = depth;
          depth = 0;
        }

        var list = this.context.history || [];

        depth = depth || 0;

        for (var i = list.length - 2, j = 0; i >= 0 && (depth <= 0 || j < depth); i--, j++) {
          if (predicate.call(scope || this, list[i].data)) {
            return list[i].data;
          }
        }

        return false;
      }
    }, {
      key: 'isNavigationFromResourceKind',
      value: function isNavigationFromResourceKind(kind, predicate, scope) {
        var lookup = {};
        if (Array.isArray(kind)) {
          kind.forEach(function forEach(item) {
            this[item] = true;
          }, lookup);
        } else {
          lookup[kind] = true;
        }

        return this.queryNavigationContext(function queryNavigationContext(o) {
          var context = o.options && o.options.source || o;
          var resourceKind = context && context.resourceKind;

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
        var path = p;
        var spec = s;

        if (arguments.length > 2) {
          var customizationSet = arguments[0];
          var id = arguments[1];

          spec = arguments[2];
          path = id ? customizationSet + '#' + id : customizationSet;
        }

        var container = this.customizations[path] || (this.customizations[path] = []);
        if (container) {
          container.push(spec);
        }

        return this;
      }
    }, {
      key: 'getCustomizationsFor',
      value: function getCustomizationsFor(p) {
        var path = p;

        if (arguments.length > 1) {
          path = arguments[1] ? arguments[0] + '#' + arguments[1] : arguments[0];
        }

        var segments = path.split('#');
        var customizationSet = segments[0];
        var forPath = this.customizations[path] || [];
        var forSet = this.customizations[customizationSet] || [];

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
        for (var n in this.bars) {
          if (this.bars[n].managed) {
            this.bars[n].setMode(onLine);
          }
        }
      }
    }]);

    return Application;
  }();

  exports.default = Application;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwiYmluZERlbGVnYXRlIiwic2NvcGUiLCJzZWxmIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiYm91bmQiLCJhcHBseSIsIm9wdGlvbmFsIiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJib3VuZFdBcmdzIiwiY2FsbGVkIiwiY29uY2F0IiwiQXBwbGljYXRpb24iLCJlbmFibGVDb25jdXJyZW5jeUNoZWNrIiwiUmVVSSIsImFwcCIsImJhY2siLCJjb250ZXh0IiwiaGlzdG9yeSIsImZyb20iLCJwb3AiLCJwYWdlIiwibGVuIiwicmV0dXJuVG8iLCJkYXRhIiwib3B0aW9ucyIsInJldHVybkluZGV4IiwicmV2ZXJzZSIsImZpbmRJbmRleCIsInZhbCIsInNwbGljZSIsInJlZGlyZWN0IiwidG8iLCJob21lVmlld0lkIiwidmlld1Nob3dPcHRpb25zIiwiY3VycmVudE9yaWVudGF0aW9uIiwiX2VtYmVkZGVkIiwiX2FwcFN0YXRlUHJvbWlzZXMiLCJfc3RhcnRlZCIsIl9yb290RG9tTm9kZSIsIl9jb250YWluZXJOb2RlIiwiY3VzdG9taXphdGlvbnMiLCJzZXJ2aWNlcyIsIl9jb25uZWN0aW9ucyIsIm1vZHVsZXMiLCJ2aWV3cyIsImhhc2giLCJvbkxpbmUiLCJfY3VycmVudFBhZ2UiLCJiYXJzIiwiZW5hYmxlQ2FjaGluZyIsImRlZmF1bHRTZXJ2aWNlIiwicmVkaXJlY3RIYXNoIiwibWF4VXBsb2FkRmlsZVNpemUiLCJQSU5HX1RJTUVPVVQiLCJQSU5HX0RFQk9VTkNFIiwiUElOR19SRVRSWSIsIlBJTkdfUkVTT1VSQ0UiLCJNb2RlbE1hbmFnZXIiLCJpc0R5bmFtaWNJbml0aWFsaXplZCIsImFwcGxpY2F0aW9ubWVudSIsInZpZXdTZXR0aW5nc01vZGFsIiwicHJldmlvdXNTdGF0ZSIsInZpZXdTZXR0aW5nc1RleHQiLCJjbG9zZVRleHQiLCIkIiwid2luZG93Iiwib2ZmIiwib25SZXNpemUiLCJiaW5kIiwiX29uQmVmb3JlVHJhbnNpdGlvbiIsIl9vbkFmdGVyVHJhbnNpdGlvbiIsIl9vbkFjdGl2YXRlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9vbk9ubGluZSIsIl9vbk9mZmxpbmUiLCJ1bmluaXRpYWxpemUiLCJoIiwibG9jYXRpb24iLCJwaW5nIiwib25saW5lIiwib25Db25uZWN0aW9uQ2hhbmdlIiwic3RvcmUiLCJkaXNwYXRjaCIsIm9uIiwiZG9jdW1lbnQiLCJyZWFkeSIsImFkZEV2ZW50TGlzdGVuZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib250aW1lb3V0Iiwib25lcnJvciIsIm9ubG9hZCIsIkRPTkUiLCJIVFRQX09LIiwiSFRUUF9OT1RfTU9ESUZJRUQiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwib3BlbiIsIk1hdGgiLCJyYW5kb20iLCJ0aW1lb3V0Iiwic2VuZCIsInJlamVjdCIsInNlcXVlbmNlcyIsImZvckVhY2giLCJpdGVtIiwic2VxIiwiZmluZCIsIngiLCJkZXNjcmlwdGlvbiIsImxvYWRpbmdBcHBsaWNhdGlvblN0YXRlVGV4dCIsIml0ZW1zIiwicHVzaCIsIm5hbWUiLCJmbiIsIl9pdGVtIiwic29ydCIsImEiLCJiIiwiX2luaXRBcHBTdGF0ZVNlcXVlbmNlIiwidGhlbiIsInJlc3VsdHMiLCJjbGVhckFwcFN0YXRlUHJvbWlzZXMiLCJpbml0TW9kdWxlc0R5bmFtaWMiLCJlIiwiZXJyIiwiaW5kZXgiLCJpbmRpY2F0b3IiLCJpZCIsImxhYmVsIiwiaW5pdGlhbGl6aW5nVGV4dCIsIm1vZGFsIiwiZGlzYWJsZUNsb3NlIiwic2hvd1Rvb2xiYXIiLCJhZGQiLCJzdGFydCIsInByb21pc2VzIiwibWFwIiwiYWxsIiwiY29tcGxldGUiLCJoaWRlIiwiYWRkU2ltcGxlRXJyb3IiLCJwcm9taXNlIiwiY29ubmVjdGlvbnMiLCJoYXNPd25Qcm9wZXJ0eSIsInJlZ2lzdGVyU2VydmljZSIsImkiLCJpbml0IiwiaW5pdER5bmFtaWMiLCJuIiwiQXBwIiwiZG9tTm9kZSIsImluaXRJY29ucyIsImluaXRTdG9yZSIsImluaXRBcHBET00iLCJpbml0UHJlZmVyZW5jZXMiLCJpbml0U29obyIsImluaXRUb2FzdHMiLCJpbml0UGluZyIsImluaXRTZXJ2aWNlcyIsImluaXRDb25uZWN0cyIsIl9zdGFydHVwQ29ubmVjdGlvbnMiLCJpbml0TW9kdWxlcyIsImluaXRUb29sYmFycyIsImluaXRIYXNoIiwiaW5pdE1vZGFsIiwiaW5pdFNjZW5lIiwidXBkYXRlU29obyIsImNvbnRhaW5lciIsImdldEFwcENvbnRhaW5lck5vZGUiLCJtZW51IiwiZmlyc3QiLCJjbG9zZU1lbnVIZWFkZXIiLCJwdWJsaXNoIiwiaGlkZUFwcGxpY2F0aW9uTWVudSIsInVwZGF0ZWQiLCJzY2VuZSIsIlJlZHV4IiwiY3JlYXRlU3RvcmUiLCJnZXRSZWR1Y2VyIiwiZ2V0SW5pdGlhbFN0YXRlIiwiX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyIsInN1YnNjcmliZSIsIl9vblN0YXRlQ2hhbmdlIiwic3RhdGUiLCJnZXRTdGF0ZSIsIm9uU3RhdGVDaGFuZ2UiLCJzZGtTdGF0ZSIsInNkayIsInByZXZpb3VzU2RrU3RhdGUiLCJfdXBkYXRlQ29ubmVjdGlvblN0YXRlIiwic2V0dGluZ3MiLCJvcGVuT25MYXJnZSIsImlzTGFyZ2VyVGhhbkJyZWFrcG9pbnQiLCJvcGVuTWVudSIsImNsb3NlTWVudSIsInRvYXN0IiwiY29udGFpbmVyTm9kZSIsImdldENvbnRhaW5lck5vZGUiLCJSeCIsImVuYWJsZU9mZmxpbmVTdXBwb3J0IiwiZGVib3VuY2UiLCJtZXNzYWdlIiwiY2hlY2tpbmdUZXh0IiwidGl0bGUiLCJjb25uZWN0aW9uVG9hc3RUaXRsZVRleHQiLCJ0b2FzdFRpbWUiLCJwaW5nJCIsIk9ic2VydmFibGUiLCJpbnRlcnZhbCIsImZsYXRNYXAiLCJmcm9tUHJvbWlzZSIsIl9waW5nIiwib2YiLCJ0aHJvdyIsIkVycm9yIiwicmV0cnkiLCJ0YWtlIiwiX2xvYWRQcmVmZXJlbmNlcyIsInBsYWNlIiwiX2FwcENvbnRhaW5lck5vZGUiLCJKU09OIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiTW9iaWxlIiwiQ3VsdHVyZUluZm8iLCJkZWZhdWx0MjRIb3VyQ2xvY2siLCJ0b1N0cmluZyIsImlzMjRIb3VyQ2xvY2siLCJpc1JlZ2lvbk1ldHJpYyIsIkRvY3VtZW50VG91Y2giLCJpc0lFIiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsIkJsb2IiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInByZWZlcmVuY2VzIiwiY29uc29sZSIsImVycm9yIiwicmVnaXN0ZXJDb25uZWN0aW9uIiwicmVnaXN0ZXJPcmllbnRhdGlvbkNoZWNrIiwidXBkYXRlT3JpZW50YXRpb25Eb20iLCJoYXNoYmFuZyIsInVzaW5nVXJsIiwic2VydmljZSIsImluc3RhbmNlIiwiU2FnZSIsIlNEYXRhIiwiQ2xpZW50IiwiU0RhdGFTZXJ2aWNlIiwib25SZXF1ZXN0VGltZW91dCIsImlzRGVmYXVsdCIsImRlZmluaXRpb24iLCJkZWZhdWx0IiwiX3ZpZXdDb250YWluZXJOb2RlIiwiX2NyZWF0ZVZpZXdDb250YWluZXJOb2RlIiwiX2NyZWF0ZUFwcENvbnRhaW5lck5vZGUiLCJkZWZhdWx0QXBwQ29udGFpbmVySWQiLCJhcHBlbmQiLCJnZXQiLCJkZWZhdWx0Vmlld0NvbnRhaW5lcklkIiwiZGVmYXVsdFZpZXdDb250YWluZXJDbGFzc2VzIiwidmlldyIsInBvc2l0aW9uIiwibm9kZSIsIl9wbGFjZUF0IiwiX3BsYWNlUG9zaXRpb24iLCJyZWdpc3RlclZpZXdSb3V0ZSIsIm9uUmVnaXN0ZXJlZCIsImdldFJvdXRlIiwicm91dGVMb2FkIiwicm91dGVTaG93IiwidCIsInRiYXIiLCJ0YmFyTm9kZSIsInBsYWNlQXQiLCJnZXRQcmltYXJ5QWN0aXZlVmlldyIsInZhbHVlIiwicm9vdCIsImN1cnJlbnRPcmllbnQiLCJhdHRyIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIm9uU2V0T3JpZW50YXRpb24iLCJjYWxsYmFjayIsIm1hdGNoIiwibWF0Y2hNZWRpYSIsImNoZWNrTWVkaWEiLCJtIiwibWF0Y2hlcyIsImFkZExpc3RlbmVyIiwiZWwiLCJnZXRDdXJyZW50UGFnZSIsImdldFZpZXciLCJfcGFnZSIsImtleSIsIl9pbnRlcm5hbEdldFZpZXciLCJhY2Nlc3MiLCJnZXRTZWN1cml0eSIsIm1hbmFnZWQiLCJzZXQiLCJoZWFkZXIiLCJ0b29sYmFyIiwiZXZ0IiwidGFyZ2V0Iiwib3V0IiwiX2JlZm9yZVZpZXdUcmFuc2l0aW9uQXdheSIsIl9iZWZvcmVWaWV3VHJhbnNpdGlvblRvIiwiX3ZpZXdUcmFuc2l0aW9uQXdheSIsIl92aWV3VHJhbnNpdGlvblRvIiwiX3ZpZXdBY3RpdmF0ZSIsInRhZyIsIm9uQmVmb3JlVmlld1RyYW5zaXRpb25Bd2F5IiwiYmVmb3JlVHJhbnNpdGlvbkF3YXkiLCJvbkJlZm9yZVZpZXdUcmFuc2l0aW9uVG8iLCJjbGVhciIsImJlZm9yZVRyYW5zaXRpb25UbyIsIm9uVmlld1RyYW5zaXRpb25Bd2F5IiwidHJhbnNpdGlvbkF3YXkiLCJvblZpZXdUcmFuc2l0aW9uVG8iLCJ0b29scyIsImdldFRvb2xzIiwic2hvd1Rvb2xzIiwidHJhbnNpdGlvblRvIiwib25WaWV3QWN0aXZhdGUiLCJhY3RpdmF0ZSIsInByZWRpY2F0ZSIsImxpc3QiLCJmaWx0ZXJlZCIsImZpbHRlciIsImQiLCJzIiwiZGVwdGgiLCJqIiwia2luZCIsImxvb2t1cCIsImlzQXJyYXkiLCJxdWVyeU5hdmlnYXRpb25Db250ZXh0IiwibyIsInNvdXJjZSIsInJlc291cmNlS2luZCIsInAiLCJwYXRoIiwic3BlYyIsImN1c3RvbWl6YXRpb25TZXQiLCJzZWdtZW50cyIsInNwbGl0IiwiZm9yUGF0aCIsImZvclNldCIsInNldE1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsTUFBTUEsV0FBVyxvQkFBWSxnQkFBWixDQUFqQjs7QUFFQUMsV0FBU0MsU0FBVCxDQUFtQkMsWUFBbkIsR0FBa0MsU0FBU0EsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFBRTtBQUMvRCxRQUFNQyxPQUFPLElBQWI7O0FBRUEsUUFBSUMsVUFBVUMsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixhQUFPLFNBQVNDLEtBQVQsR0FBaUI7QUFDdEIsZUFBT0gsS0FBS0ksS0FBTCxDQUFXTCxTQUFTLElBQXBCLEVBQTBCRSxTQUExQixDQUFQO0FBQ0QsT0FGRDtBQUdEOztBQUVELFFBQU1JLFdBQVdDLE1BQU1ULFNBQU4sQ0FBZ0JVLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQlAsU0FBM0IsRUFBc0MsQ0FBdEMsQ0FBakI7QUFDQSxXQUFPLFNBQVNRLFVBQVQsR0FBc0I7QUFDM0IsVUFBTUMsU0FBU0osTUFBTVQsU0FBTixDQUFnQlUsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCUCxTQUEzQixFQUFzQyxDQUF0QyxDQUFmO0FBQ0EsYUFBT0QsS0FBS0ksS0FBTCxDQUFXTCxTQUFTLElBQXBCLEVBQTBCVyxPQUFPQyxNQUFQLENBQWNOLFFBQWQsQ0FBMUIsQ0FBUDtBQUNELEtBSEQ7QUFJRCxHQWREOztBQWdCQTs7Ozs7Ozs7TUFPTU8sVztBQUNKLDJCQUFjO0FBQUE7O0FBQ1o7OztBQUdBLFdBQUtDLHNCQUFMLEdBQThCLEtBQTlCOztBQUVBLFdBQUtDLElBQUwsR0FBWTtBQUNWQyxhQUFLLElBREs7QUFFVkMsY0FBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLGNBQUksQ0FBQyxLQUFLRCxHQUFWLEVBQWU7QUFDYjtBQUNEO0FBQ0QsY0FBSSxLQUFLQSxHQUFMLENBQVNFLE9BQVQsSUFDRSxLQUFLRixHQUFMLENBQVNFLE9BQVQsQ0FBaUJDLE9BRG5CLElBRUksS0FBS0gsR0FBTCxDQUFTRSxPQUFULENBQWlCQyxPQUFqQixDQUF5QmhCLE1BQXpCLEdBQWtDLENBRjFDLEVBRTZDO0FBQzNDO0FBQ0EsZ0JBQU1pQixPQUFPLEtBQUtKLEdBQUwsQ0FBU0UsT0FBVCxDQUFpQkMsT0FBakIsQ0FBeUJFLEdBQXpCLEVBQWI7QUFDQUMsaUJBQUtDLEdBQUw7O0FBRUEsZ0JBQU1DLFdBQVdKLEtBQUtLLElBQUwsSUFBYUwsS0FBS0ssSUFBTCxDQUFVQyxPQUF2QixJQUFrQ04sS0FBS0ssSUFBTCxDQUFVQyxPQUFWLENBQWtCRixRQUFyRTs7QUFFQSxnQkFBSUEsUUFBSixFQUFjO0FBQ1osa0JBQUlHLGNBQWMsNkJBQUksS0FBS1gsR0FBTCxDQUFTRSxPQUFULENBQWlCQyxPQUFyQixHQUE4QlMsT0FBOUIsR0FDZkMsU0FEZSxDQUNMO0FBQUEsdUJBQU9DLElBQUlSLElBQUosS0FBYUUsUUFBcEI7QUFBQSxlQURLLENBQWxCO0FBRUE7QUFDQSxrQkFBSUcsZ0JBQWdCLENBQUMsQ0FBckIsRUFBd0I7QUFDdEJBLDhCQUFlLEtBQUtYLEdBQUwsQ0FBU0UsT0FBVCxDQUFpQkMsT0FBakIsQ0FBeUJoQixNQUF6QixHQUFrQyxDQUFuQyxHQUF3Q3dCLFdBQXREO0FBQ0Q7QUFDRCxtQkFBS1gsR0FBTCxDQUFTRSxPQUFULENBQWlCQyxPQUFqQixDQUF5QlksTUFBekIsQ0FBZ0NKLFdBQWhDO0FBQ0FMLG1CQUFLVSxRQUFMLENBQWNSLFFBQWQ7QUFDQTtBQUNEOztBQUVELGdCQUFNUyxLQUFLLEtBQUtqQixHQUFMLENBQVNFLE9BQVQsQ0FBaUJDLE9BQWpCLENBQXlCRSxHQUF6QixFQUFYO0FBQ0FDLGlCQUFLVSxRQUFMLENBQWNDLEdBQUdYLElBQWpCO0FBQ0E7QUFDRDtBQUNEQSxlQUFLTCxJQUFMLENBQVUsS0FBS0QsR0FBTCxDQUFTa0IsVUFBbkI7QUFDRCxTQWhDUztBQWlDVmhCLGlCQUFTO0FBQ1BDLG1CQUFTO0FBREY7QUFqQ0MsT0FBWjs7QUFzQ0E7Ozs7QUFJQSxXQUFLZ0IsZUFBTCxHQUF1QixJQUF2Qjs7QUFFQTs7OztBQUlBLFdBQUtDLGtCQUFMLEdBQTBCLFVBQTFCOztBQUVBOzs7OztBQUtBLFdBQUtDLFNBQUwsR0FBaUIsS0FBakI7O0FBRUE7Ozs7O0FBS0EsV0FBS0MsaUJBQUwsR0FBeUIsSUFBekI7O0FBRUE7Ozs7O0FBS0EsV0FBS0MsUUFBTCxHQUFnQixLQUFoQjs7QUFFQSxXQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsV0FBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFdBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLElBQWhCLENBaEZZLENBZ0ZVO0FBQ3RCLFdBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxXQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFdBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsV0FBS0MsSUFBTDtBQUNBLFdBQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBOzs7O0FBSUEsV0FBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxXQUFLQyxhQUFMLEdBQXFCLEtBQXJCO0FBQ0E7Ozs7QUFJQSxXQUFLQyxjQUFMLEdBQXNCLElBQXRCOztBQUVBOzs7O0FBSUEsV0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBOzs7O0FBSUEsV0FBS0MsaUJBQUwsR0FBeUIsT0FBekI7O0FBRUE7OztBQUdBLFdBQUtDLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUE7OztBQUdBLFdBQUtDLGFBQUwsR0FBcUIsSUFBckI7O0FBRUE7OztBQUdBLFdBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7O0FBRUE7OztBQUdBLFdBQUtDLGFBQUwsR0FBcUIsVUFBckI7QUFDQTs7OztBQUlBLFdBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxXQUFLQyxvQkFBTCxHQUE0QixLQUE1Qjs7QUFFQSxXQUFLdEIsaUJBQUwsR0FBeUIsRUFBekI7O0FBRUEsV0FBS0ksY0FBTCxHQUFzQixFQUF0QjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0IsRUFBaEIsQ0EzSVksQ0EySVE7QUFDcEIsV0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFdBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsV0FBS0MsS0FBTCxHQUFhLEVBQWI7QUFDQSxXQUFLSSxJQUFMLEdBQVksRUFBWjs7QUFFQSxXQUFLaEMsT0FBTCxHQUFlO0FBQ2JDLGlCQUFTO0FBREksT0FBZjtBQUdBLFdBQUtnQixlQUFMLEdBQXVCLEVBQXZCOztBQUVBO0FBQ0EsV0FBS3BCLElBQUwsQ0FBVUMsR0FBVixHQUFnQixJQUFoQjs7QUFFQSxXQUFLMkMsWUFBTDs7QUFFQTs7O0FBR0EsV0FBS0UsZUFBTCxHQUF1QixJQUF2Qjs7QUFFQTs7Ozs7QUFLQSxXQUFLQyxpQkFBTCxHQUF5QixJQUF6Qjs7QUFFQSxXQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0E7OztBQUdBLFdBQUtDLGdCQUFMLEdBQXdCcEUsU0FBU29FLGdCQUFqQztBQUNBLFdBQUtDLFNBQUwsR0FBaUJyRSxTQUFTcUUsU0FBMUI7QUFDRDs7QUFFRDs7Ozs7Ozs7Z0NBSVU7QUFDUkMsVUFBRUMsTUFBRixFQUFVQyxHQUFWLENBQWMsUUFBZCxFQUF3QixLQUFLQyxRQUFMLENBQWNDLElBQWQsQ0FBbUIsSUFBbkIsQ0FBeEI7QUFDQUosVUFBRSxNQUFGLEVBQVVFLEdBQVYsQ0FBYyxrQkFBZCxFQUFrQyxLQUFLRyxtQkFBTCxDQUF5QkQsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBbEM7QUFDQUosVUFBRSxNQUFGLEVBQVVFLEdBQVYsQ0FBYyxpQkFBZCxFQUFpQyxLQUFLSSxrQkFBTCxDQUF3QkYsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FBakM7QUFDQUosVUFBRSxNQUFGLEVBQVVFLEdBQVYsQ0FBYyxNQUFkLEVBQXNCLEtBQUtLLFdBQUwsQ0FBaUJILElBQWpCLENBQXNCLElBQXRCLENBQXRCO0FBQ0FILGVBQU9PLG1CQUFQLENBQTJCLFFBQTNCLEVBQXFDLEtBQUtDLFNBQUwsQ0FBZUwsSUFBZixDQUFvQixJQUFwQixDQUFyQztBQUNBSCxlQUFPTyxtQkFBUCxDQUEyQixTQUEzQixFQUFzQyxLQUFLRSxVQUFMLENBQWdCTixJQUFoQixDQUFxQixJQUFyQixDQUF0Qzs7QUFFQSxhQUFLTyxZQUFMO0FBQ0Q7OztxQ0FLYyxDQUNkOzs7NkJBRU07QUFDTCxZQUFJLENBQUMsS0FBS3hDLFNBQVYsRUFBcUI7QUFDbkJ0QixlQUFLRSxJQUFMO0FBQ0Q7QUFDRjs7O2lDQUtVO0FBQ1QsWUFBTTZELElBQUlDLFNBQVNoQyxJQUFuQjtBQUNBLFlBQUkrQixNQUFNLEVBQVYsRUFBYztBQUNaLGVBQUt6QixZQUFMLEdBQW9CeUIsQ0FBcEI7QUFDRDs7QUFFRCxZQUFJLENBQUMsS0FBS3pDLFNBQVYsRUFBcUI7QUFDbkIwQyxtQkFBU2hDLElBQVQsR0FBZ0IsRUFBaEI7QUFDRDs7QUFFRDtBQUNBb0IsZUFBT3BELElBQVAsR0FBYyxLQUFLQSxJQUFuQjtBQUNBb0QsZUFBT3BELElBQVAsQ0FBWUcsT0FBWixDQUFvQkMsT0FBcEIsR0FBOEIsS0FBS0QsT0FBTCxDQUFhQyxPQUEzQztBQUNEOzs7bUNBRVk7QUFDWCxhQUFLNkQsSUFBTDtBQUNEOzs7a0NBRVc7QUFDVixhQUFLQSxJQUFMO0FBQ0Q7Ozs2Q0FFc0JDLE0sRUFBUTtBQUM3QjtBQUNBLFlBQUksS0FBS2pDLE1BQUwsS0FBZ0JpQyxNQUFwQixFQUE0QjtBQUMxQjtBQUNEOztBQUVELGFBQUtqQyxNQUFMLEdBQWNpQyxNQUFkO0FBQ0EsYUFBS0Msa0JBQUwsQ0FBd0JELE1BQXhCO0FBQ0Q7OztvQ0FFYTtBQUNaLGFBQUtFLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQixvQ0FBbUIsSUFBbkIsQ0FBcEI7QUFDRDs7O3FDQUVjO0FBQ2IsYUFBS0QsS0FBTCxDQUFXQyxRQUFYLENBQW9CLG9DQUFtQixLQUFuQixDQUFwQjtBQUNEOzs7MkNBRWtCLFdBQWEsQ0FBRTs7O3FDQUtuQjtBQUFBOztBQUNibEIsVUFBRUMsTUFBRixFQUFVa0IsRUFBVixDQUFhLFFBQWIsRUFBdUIsS0FBS2hCLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixJQUFuQixDQUF2QjtBQUNBSixVQUFFLE1BQUYsRUFBVW1CLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxLQUFLZCxtQkFBTCxDQUF5QkQsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBakM7QUFDQUosVUFBRSxNQUFGLEVBQVVtQixFQUFWLENBQWEsaUJBQWIsRUFBZ0MsS0FBS2Isa0JBQUwsQ0FBd0JGLElBQXhCLENBQTZCLElBQTdCLENBQWhDO0FBQ0FKLFVBQUUsTUFBRixFQUFVbUIsRUFBVixDQUFhLE1BQWIsRUFBcUIsS0FBS1osV0FBTCxDQUFpQkgsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBckI7QUFDQUosVUFBRW9CLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFNO0FBQ3RCcEIsaUJBQU9xQixnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxNQUFLYixTQUFMLENBQWVMLElBQWYsT0FBbEM7QUFDQUgsaUJBQU9xQixnQkFBUCxDQUF3QixTQUF4QixFQUFtQyxNQUFLWixVQUFMLENBQWdCTixJQUFoQixPQUFuQztBQUNELFNBSEQ7O0FBS0EsYUFBS1UsSUFBTDtBQUNEOzs7OEJBT087QUFBQTs7QUFDTixlQUFPLElBQUlTLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQWE7QUFDOUIsY0FBTUMsTUFBTSxJQUFJQyxjQUFKLEVBQVo7QUFDQUQsY0FBSUUsU0FBSixHQUFnQjtBQUFBLG1CQUFNSCxRQUFRLEtBQVIsQ0FBTjtBQUFBLFdBQWhCO0FBQ0FDLGNBQUlHLE9BQUosR0FBYztBQUFBLG1CQUFNSixRQUFRLEtBQVIsQ0FBTjtBQUFBLFdBQWQ7QUFDQUMsY0FBSUksTUFBSixHQUFhLFlBQU07QUFDakIsZ0JBQU1DLE9BQU8sQ0FBYjtBQUNBLGdCQUFNQyxVQUFVLEdBQWhCO0FBQ0EsZ0JBQU1DLG9CQUFvQixHQUExQjs7QUFFQSxnQkFBSVAsSUFBSVEsVUFBSixLQUFtQkgsSUFBdkIsRUFBNkI7QUFDM0Isa0JBQUlMLElBQUlTLE1BQUosS0FBZUgsT0FBZixJQUEwQk4sSUFBSVMsTUFBSixLQUFlRixpQkFBN0MsRUFBZ0U7QUFDOURSLHdCQUFRLElBQVI7QUFDRCxlQUZELE1BRU87QUFDTEEsd0JBQVEsS0FBUjtBQUNEO0FBQ0Y7QUFDRixXQVpEO0FBYUFDLGNBQUlVLElBQUosQ0FBUyxLQUFULEVBQW1CLE9BQUszQyxhQUF4QixlQUErQzRDLEtBQUtDLE1BQUwsRUFBL0M7QUFDQVosY0FBSWEsT0FBSixHQUFjLE9BQUtqRCxZQUFuQjtBQUNBb0MsY0FBSWMsSUFBSjtBQUNELFNBcEJNLENBQVA7QUFxQkQ7OztxQ0FpRGM7QUFBQTs7QUFDYixlQUFPLElBQUloQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVZ0IsTUFBVixFQUFxQjtBQUN0QyxjQUFNQyxZQUFZLEVBQWxCO0FBQ0EsaUJBQUtyRSxpQkFBTCxDQUF1QnNFLE9BQXZCLENBQStCLFVBQUNDLElBQUQsRUFBVTtBQUN2QyxnQkFBSUMsWUFBSjtBQUNBLGdCQUFJLE9BQU9ELElBQVAsS0FBZ0IsVUFBcEIsRUFBZ0M7QUFDOUJDLG9CQUFNSCxVQUFVSSxJQUFWLENBQWU7QUFBQSx1QkFBS0MsRUFBRUYsR0FBRixLQUFVLENBQWY7QUFBQSxlQUFmLENBQU47QUFDQSxrQkFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDUkEsc0JBQU07QUFDSkEsdUJBQUssQ0FERDtBQUVKRywrQkFBYXJILFNBQVNzSCwyQkFGbEI7QUFHSkMseUJBQU87QUFISCxpQkFBTjtBQUtBUiwwQkFBVVMsSUFBVixDQUFlTixHQUFmO0FBQ0Q7QUFDREEsa0JBQUlLLEtBQUosQ0FBVUMsSUFBVixDQUFlO0FBQ2JDLHNCQUFNLFNBRE87QUFFYkosNkJBQWEsRUFGQTtBQUdiSyxvQkFBSVQ7QUFIUyxlQUFmO0FBS0QsYUFmRCxNQWVPO0FBQ0wsa0JBQUlBLEtBQUtDLEdBQUwsSUFBWUQsS0FBS00sS0FBckIsRUFBNEI7QUFDMUJMLHNCQUFNSCxVQUFVSSxJQUFWLENBQWU7QUFBQSx5QkFBS0MsRUFBRUYsR0FBRixNQUFZRCxLQUFLQyxHQUFOLEdBQWFELEtBQUtDLEdBQWxCLEdBQXdCLENBQW5DLENBQUw7QUFBQSxpQkFBZixDQUFOO0FBQ0Esb0JBQUlBLEdBQUosRUFBUztBQUNQRCx1QkFBS00sS0FBTCxDQUFXUCxPQUFYLENBQW1CLFVBQUNXLEtBQUQsRUFBVztBQUM1QlQsd0JBQUlLLEtBQUosQ0FBVUMsSUFBVixDQUFlRyxLQUFmO0FBQ0QsbUJBRkQ7QUFHRCxpQkFKRCxNQUlPO0FBQ0xaLDRCQUFVUyxJQUFWLENBQWVQLElBQWY7QUFDRDtBQUNGO0FBQ0Y7QUFDRixXQTdCRDtBQThCQTtBQUNBRixvQkFBVWEsSUFBVixDQUFlLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQ3ZCLGdCQUFJRCxFQUFFWCxHQUFGLEdBQVFZLEVBQUVaLEdBQWQsRUFBbUI7QUFDakIscUJBQU8sQ0FBUDtBQUNEOztBQUVELGdCQUFJVyxFQUFFWCxHQUFGLEdBQVFZLEVBQUVaLEdBQWQsRUFBbUI7QUFDakIscUJBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUQsbUJBQU8sQ0FBUDtBQUNELFdBVkQ7O0FBWUEsaUJBQUthLHFCQUFMLENBQTJCLENBQTNCLEVBQThCaEIsU0FBOUIsRUFBeUNpQixJQUF6QyxDQUE4QyxVQUFDQyxPQUFELEVBQWE7QUFDekQsZ0JBQUk7QUFDRixxQkFBS0MscUJBQUw7QUFDQSxxQkFBS0Msa0JBQUw7QUFDQXJDLHNCQUFRbUMsT0FBUjtBQUNELGFBSkQsQ0FJRSxPQUFPRyxDQUFQLEVBQVU7QUFDVnRCLHFCQUFPc0IsQ0FBUDtBQUNEO0FBQ0YsV0FSRCxFQVFHLFVBQUNDLEdBQUQsRUFBUztBQUNWLG1CQUFLSCxxQkFBTDtBQUNBcEIsbUJBQU91QixHQUFQO0FBQ0QsV0FYRDtBQVlELFNBekRNLENBQVA7QUEwREQ7Ozs0Q0FPcUJDLEssRUFBT3ZCLFMsRUFBVztBQUFBOztBQUN0QyxlQUFPLElBQUlsQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVZ0IsTUFBVixFQUFxQjtBQUN0QyxjQUFNSSxNQUFNSCxVQUFVdUIsS0FBVixDQUFaO0FBQ0EsY0FBSXBCLEdBQUosRUFBUztBQUFFO0FBQ1QsZ0JBQU1xQixZQUFZLDRCQUFrQjtBQUNsQ0MsK0NBQStCdEIsSUFBSUEsR0FERDtBQUVsQ3VCLHFCQUFVekksU0FBUzBJLGdCQUFuQixTQUF1Q3hCLElBQUlHO0FBRlQsYUFBbEIsQ0FBbEI7QUFJQSxtQkFBS3NCLEtBQUwsQ0FBV0MsWUFBWCxHQUEwQixJQUExQjtBQUNBLG1CQUFLRCxLQUFMLENBQVdFLFdBQVgsR0FBeUIsS0FBekI7QUFDQSxtQkFBS0YsS0FBTCxDQUFXRyxHQUFYLENBQWVQLFNBQWY7QUFDQUEsc0JBQVVRLEtBQVY7QUFDQSxnQkFBTUMsV0FBVzlCLElBQUlLLEtBQUosQ0FBVTBCLEdBQVYsQ0FBYyxVQUFDaEMsSUFBRCxFQUFVO0FBQ3ZDLHFCQUFPQSxLQUFLUyxFQUFMLEVBQVA7QUFDRCxhQUZnQixDQUFqQjs7QUFJQTdCLG9CQUFRcUQsR0FBUixDQUFZRixRQUFaLEVBQXNCaEIsSUFBdEIsQ0FBMkIsWUFBTTtBQUMvQk8sd0JBQVVZLFFBQVYsQ0FBbUIsSUFBbkI7QUFDQSxxQkFBS1IsS0FBTCxDQUFXQyxZQUFYLEdBQTBCLEtBQTFCO0FBQ0EscUJBQUtELEtBQUwsQ0FBV1MsSUFBWDtBQUNBLHFCQUFLckIscUJBQUwsQ0FBMkJPLFFBQVEsQ0FBbkMsRUFBc0N2QixTQUF0QyxFQUFpRGlCLElBQWpELENBQXNELFVBQUNDLE9BQUQsRUFBYTtBQUNqRW5DLHdCQUFRbUMsT0FBUjtBQUNELGVBRkQsRUFFRyxVQUFDSSxHQUFELEVBQVM7QUFDVkUsMEJBQVVZLFFBQVYsQ0FBbUIsSUFBbkI7QUFDQSx1QkFBS1IsS0FBTCxDQUFXQyxZQUFYLEdBQTBCLEtBQTFCO0FBQ0EsdUJBQUtELEtBQUwsQ0FBV1MsSUFBWDtBQUNBdEMsdUJBQU91QixHQUFQO0FBQ0QsZUFQRDtBQVFELGFBWkQsRUFZRyxVQUFDQSxHQUFELEVBQVM7QUFDVixxQ0FBYWdCLGNBQWIsQ0FBNEJkLFVBQVVFLEtBQXRDLEVBQTZDSixHQUE3QztBQUNBRSx3QkFBVVksUUFBVixDQUFtQixJQUFuQjtBQUNBLHFCQUFLUixLQUFMLENBQVdDLFlBQVgsR0FBMEIsS0FBMUI7QUFDQSxxQkFBS0QsS0FBTCxDQUFXUyxJQUFYO0FBQ0F0QyxxQkFBT3VCLEdBQVA7QUFDRCxhQWxCRDtBQW1CRCxXQWhDRCxNQWdDTztBQUNMdkM7QUFDRDtBQUNGLFNBckNNLENBQVA7QUFzQ0Q7Ozs4Q0FNdUJ3RCxPLEVBQVM7QUFDL0IsYUFBSzVHLGlCQUFMLENBQXVCOEUsSUFBdkIsQ0FBNEI4QixPQUE1QjtBQUNBLGVBQU8sSUFBUDtBQUNEOzs7OENBRXVCO0FBQ3RCLGFBQUs1RyxpQkFBTCxHQUF5QixFQUF6QjtBQUNEOzs7eUNBRWdCLFVBQVksQ0FBRTs7O3FDQUtoQjtBQUNiLGFBQUssSUFBTStFLElBQVgsSUFBbUIsS0FBSzhCLFdBQXhCLEVBQXFDO0FBQ25DLGNBQUksS0FBS0EsV0FBTCxDQUFpQkMsY0FBakIsQ0FBZ0MvQixJQUFoQyxDQUFKLEVBQTJDO0FBQ3pDLGlCQUFLZ0MsZUFBTCxDQUFxQmhDLElBQXJCLEVBQTJCLEtBQUs4QixXQUFMLENBQWlCOUIsSUFBakIsQ0FBM0I7QUFDRDtBQUNGO0FBQ0Y7OztvQ0FLYTtBQUNaLGFBQUssSUFBSWlDLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLekcsT0FBTCxDQUFhMUMsTUFBakMsRUFBeUNtSixHQUF6QyxFQUE4QztBQUM1QyxlQUFLekcsT0FBTCxDQUFheUcsQ0FBYixFQUFnQkMsSUFBaEIsQ0FBcUIsSUFBckI7QUFDRDtBQUNGOzs7MkNBS29CO0FBQ25CLFlBQUksS0FBSzNGLG9CQUFULEVBQStCO0FBQzdCO0FBQ0Q7QUFDRCxhQUFLLElBQUkwRixJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS3pHLE9BQUwsQ0FBYTFDLE1BQWpDLEVBQXlDbUosR0FBekMsRUFBOEM7QUFDNUMsZUFBS3pHLE9BQUwsQ0FBYXlHLENBQWIsRUFBZ0JFLFdBQWhCLENBQTRCLElBQTVCO0FBQ0Q7QUFDRCxhQUFLNUYsb0JBQUwsR0FBNEIsSUFBNUI7QUFDRDs7O3FDQUtjO0FBQ2IsYUFBSyxJQUFNNkYsQ0FBWCxJQUFnQixLQUFLdkcsSUFBckIsRUFBMkI7QUFDekIsY0FBSSxLQUFLQSxJQUFMLENBQVVrRyxjQUFWLENBQXlCSyxDQUF6QixDQUFKLEVBQWlDO0FBQy9CLGlCQUFLdkcsSUFBTCxDQUFVdUcsQ0FBVixFQUFhRixJQUFiLEdBRCtCLENBQ1Y7QUFDdEI7QUFDRjtBQUNGOzs7aUNBS1U7QUFDVHBGLGVBQU91RixHQUFQLEdBQWEsSUFBYjtBQUNEOzs7MkJBS0lDLE8sRUFBUztBQUNaLGFBQUtDLFNBQUw7QUFDQSxhQUFLQyxTQUFMO0FBQ0EsYUFBS0MsVUFBTCxDQUFnQkgsT0FBaEI7QUFDQSxhQUFLSSxlQUFMO0FBQ0EsYUFBS0MsUUFBTDtBQUNBLGFBQUtDLFVBQUw7QUFDQSxhQUFLQyxRQUFMO0FBQ0EsYUFBS0MsWUFBTCxHQVJZLENBUVM7QUFDckIsYUFBS0MsWUFBTDtBQUNBLGFBQUtDLG1CQUFMO0FBQ0EsYUFBS0MsV0FBTDtBQUNBLGFBQUtDLFlBQUw7QUFDQSxhQUFLQyxRQUFMO0FBQ0EsYUFBS0MsU0FBTDtBQUNBLGFBQUtDLFNBQUw7QUFDQSxhQUFLQyxVQUFMO0FBQ0Q7OztrQ0FFVztBQUNWO0FBQ0Q7OztpQ0FFVTtBQUFBOztBQUNULFlBQU1DLFlBQVksS0FBS0MsbUJBQUwsRUFBbEI7QUFDQSxZQUFNQyxPQUFPNUcsRUFBRSxtQkFBRixFQUF1QjBHLFNBQXZCLEVBQWtDRyxLQUFsQyxFQUFiO0FBQ0EsWUFBTUMsa0JBQWtCOUcsRUFBRSwwQkFBRixFQUE4QjZHLEtBQTlCLEVBQXhCOztBQUVBRCxhQUFLakgsZUFBTDtBQUNBLGFBQUtBLGVBQUwsR0FBdUJpSCxLQUFLckosSUFBTCxDQUFVLGlCQUFWLENBQXZCO0FBQ0FxSixhQUFLekYsRUFBTCxDQUFRLHFCQUFSLEVBQStCLFlBQU07QUFDbkMsNEJBQVE0RixPQUFSLENBQWdCLGVBQWhCLEVBQWlDLENBQUMsSUFBRCxDQUFqQztBQUNELFNBRkQ7O0FBSUFILGFBQUt6RixFQUFMLENBQVEsc0JBQVIsRUFBZ0MsWUFBTTtBQUNwQyw0QkFBUTRGLE9BQVIsQ0FBZ0IsZ0JBQWhCLEVBQWtDLENBQUMsSUFBRCxDQUFsQztBQUNELFNBRkQ7O0FBSUFELHdCQUFnQjNGLEVBQWhCLENBQW1CLE9BQW5CLEVBQTRCLFlBQU07QUFDaEMsaUJBQUs2RixtQkFBTDtBQUNELFNBRkQ7O0FBSUEsWUFBTXBILG9CQUFvQkksRUFBRSxzQkFBRixFQUEwQjBHLFNBQTFCLEVBQXFDRyxLQUFyQyxFQUExQjtBQUNBakgsMEJBQWtCeUUsS0FBbEI7QUFDQSxhQUFLekUsaUJBQUwsR0FBeUJBLGtCQUFrQnJDLElBQWxCLENBQXVCLE9BQXZCLENBQXpCO0FBQ0Q7OzttQ0FLWTtBQUNYLGFBQUtvQyxlQUFMLENBQXFCc0gsT0FBckI7QUFDRDs7O2tDQUVXO0FBQ1YsYUFBS0MsS0FBTCxHQUFhLG9CQUFVLEtBQUtqRyxLQUFmLENBQWI7QUFDRDs7O2tDQUVXO0FBQ1YsYUFBS0EsS0FBTCxHQUFha0csTUFBTUMsV0FBTixDQUFrQixLQUFLQyxVQUFMLEVBQWxCLEVBQ1gsS0FBS0MsZUFBTCxFQURXLEVBRVhySCxPQUFPc0gsNEJBQVAsSUFBdUN0SCxPQUFPc0gsNEJBQVAsRUFGNUIsQ0FBYjtBQUdBLGFBQUt0RyxLQUFMLENBQVd1RyxTQUFYLENBQXFCLEtBQUtDLGNBQUwsQ0FBb0JySCxJQUFwQixDQUF5QixJQUF6QixDQUFyQjtBQUNEOzs7dUNBRWdCO0FBQ2YsWUFBTXNILFFBQVEsS0FBS3pHLEtBQUwsQ0FBVzBHLFFBQVgsRUFBZDs7QUFFQSxZQUFJLEtBQUs5SCxhQUFMLEtBQXVCLElBQTNCLEVBQWlDO0FBQy9CLGVBQUtBLGFBQUwsR0FBcUI2SCxLQUFyQjtBQUNEOztBQUVELGFBQUtFLGFBQUwsQ0FBbUJGLEtBQW5COztBQUVBLFlBQU1HLFdBQVdILFNBQVNBLE1BQU1JLEdBQWhDO0FBQ0EsWUFBTUMsbUJBQW1CLEtBQUtsSSxhQUFMLElBQXNCLEtBQUtBLGFBQUwsQ0FBbUJpSSxHQUFsRTs7QUFFQSxZQUFJRCxZQUFZRSxnQkFBWixJQUFnQ0YsU0FBUzlHLE1BQVQsS0FBb0JnSCxpQkFBaUJoSCxNQUF6RSxFQUFpRjtBQUMvRSxlQUFLaUgsc0JBQUwsQ0FBNEJILFNBQVM5RyxNQUFyQztBQUNEOztBQUVELGFBQUtsQixhQUFMLEdBQXFCNkgsS0FBckI7QUFDRDs7O29DQUVhQSxLLEVBQU8sQ0FBRTtBQUN0Qjs7O21EQUU0QjtBQUMzQjtBQUNBLGFBQUsvSCxlQUFMLENBQXFCc0ksUUFBckIsQ0FBOEJDLFdBQTlCLEdBQTRDLElBQTVDOztBQUVBLFlBQUksS0FBS3ZJLGVBQUwsQ0FBcUJ3SSxzQkFBckIsRUFBSixFQUFtRDtBQUNqRCxlQUFLeEksZUFBTCxDQUFxQnlJLFFBQXJCO0FBQ0Q7QUFDRjs7OzRDQUVxQjtBQUNwQixhQUFLekksZUFBTCxDQUFxQjBJLFNBQXJCLENBQStCLElBQS9CO0FBQ0Q7Ozs0Q0FFcUI7QUFDcEIsYUFBSzFJLGVBQUwsQ0FBcUJ5SSxRQUFyQjtBQUNEOzs7bUNBRVk7QUFDWDtBQUNEOzs7d0NBRWlCO0FBQ2hCLGVBQU8sRUFBUDtBQUNEOzs7bUNBRVk7QUFDWCxhQUFLRSxLQUFMLEdBQWEsb0JBQVU7QUFDckJDLHlCQUFlLEtBQUtDLGdCQUFMO0FBRE0sU0FBVixDQUFiO0FBR0Q7OztpQ0FFVTtBQUFBOztBQUNUO0FBQ0EsWUFBSSxDQUFDQyxFQUFMLEVBQVM7QUFDUCxlQUFLM0gsSUFBTCxHQUFZLFlBQU07QUFDaEIsbUJBQUtHLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQixvQ0FBbUIsSUFBbkIsQ0FBcEI7QUFDRCxXQUZEO0FBR0EsZUFBS3dILG9CQUFMLEdBQTRCLEtBQTVCO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJLEtBQUs1SCxJQUFULEVBQWU7QUFDYjtBQUNEOztBQUVELGFBQUtBLElBQUwsR0FBWSxrQkFBSzZILFFBQUwsQ0FBYyxZQUFNO0FBQzlCLGlCQUFLTCxLQUFMLENBQVc5RCxHQUFYLENBQWU7QUFDYm9FLHFCQUFTbE4sU0FBU21OLFlBREw7QUFFYkMsbUJBQU9wTixTQUFTcU4sd0JBRkg7QUFHYkMsdUJBQVcsT0FBSzNKO0FBSEgsV0FBZjtBQUtBLGNBQU00SixRQUFRUixHQUFHUyxVQUFILENBQWNDLFFBQWQsQ0FBdUIsT0FBSzlKLFlBQTVCLEVBQ1grSixPQURXLENBQ0gsWUFBTTtBQUNiLG1CQUFPWCxHQUFHUyxVQUFILENBQWNHLFdBQWQsQ0FBMEIsT0FBS0MsS0FBTCxFQUExQixFQUNKRixPQURJLENBQ0ksVUFBQ3JJLE1BQUQsRUFBWTtBQUNuQixrQkFBSUEsTUFBSixFQUFZO0FBQ1YsdUJBQU8wSCxHQUFHUyxVQUFILENBQWNLLEVBQWQsQ0FBaUJ4SSxNQUFqQixDQUFQO0FBQ0Q7O0FBRUQscUJBQU8wSCxHQUFHUyxVQUFILENBQWNNLEtBQWQsQ0FBb0IsSUFBSUMsS0FBSixFQUFwQixDQUFQO0FBQ0QsYUFQSSxDQUFQO0FBUUQsV0FWVyxFQVdYQyxLQVhXLENBV0wsT0FBS25LLFVBWEEsRUFZWG9LLElBWlcsQ0FZTixDQVpNLENBQWQ7O0FBY0FWLGdCQUFNekIsU0FBTixDQUFnQixZQUFNO0FBQ3BCLG1CQUFLdkcsS0FBTCxDQUFXQyxRQUFYLENBQW9CLG9DQUFtQixJQUFuQixDQUFwQjtBQUNELFdBRkQsRUFFRyxZQUFNO0FBQ1AsbUJBQUtELEtBQUwsQ0FBV0MsUUFBWCxDQUFvQixvQ0FBbUIsS0FBbkIsQ0FBcEI7QUFDRCxXQUpEO0FBS0QsU0F6QlcsRUF5QlQsS0FBSzVCLGFBekJJLENBQVo7QUEwQkQ7Ozt3Q0FFaUI7QUFDaEIsYUFBS3NLLGdCQUFMO0FBQ0Q7OztrQ0FFVztBQUNWLGFBQUt2RixLQUFMLEdBQWEscUJBQWI7QUFDQSxhQUFLQSxLQUFMLENBQVd3RixLQUFYLENBQWlCLEtBQUtDLGlCQUF0QixFQUNHaEYsSUFESDtBQUVEOzs7c0NBRWU7QUFDZCxlQUFRaUYsS0FBS0MsS0FBTCxDQUFXL0osT0FBT2dLLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLGdCQUE1QixLQUFpREMsT0FBT0MsV0FBUCxDQUFtQkMsa0JBQW5CLENBQXNDQyxRQUF0QyxFQUE1RCxNQUFrSCxJQUExSDtBQUNEOzs7c0NBRWU7QUFDZCxlQUFPLENBQUMsS0FBS0MsYUFBTCxFQUFSO0FBQ0Q7Ozs4Q0FFdUI7QUFDdEIsZUFBT0osT0FBT0MsV0FBUCxDQUFtQkksY0FBbkIsSUFBcUMsS0FBS0EsY0FBakQ7QUFDRDs7O3NDQU1lO0FBQ2Q7QUFDQSxlQUFRLGtCQUFrQnZLLE1BQW5CLElBQStCQSxPQUFPd0ssYUFBUCxJQUF3QnJKLG9CQUFvQm5CLE9BQU93SyxhQUF6RjtBQUNEOzs7d0NBRWlCO0FBQ2hCLFlBQUksS0FBS0MsSUFBTCxFQUFKLEVBQWlCO0FBQ2YsaUJBQU8sS0FBUDtBQUNEOztBQUVELFlBQUl6SyxPQUFPMEssSUFBUCxJQUFlMUssT0FBTzJLLFVBQXRCLElBQW9DM0ssT0FBTzRLLFFBQTNDLElBQXVENUssT0FBTzZLLElBQWxFLEVBQXdFO0FBQ3RFLGlCQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFPLEtBQVA7QUFDRDs7OzZCQUVNO0FBQ0wsZUFBTyxnQkFBZUMsSUFBZixDQUFvQjlLLE9BQU8rSyxTQUFQLENBQWlCQyxTQUFyQztBQUFQO0FBQ0Q7OzsyQ0FFb0I7QUFDbkIsWUFBSTtBQUNGLGNBQUloTCxPQUFPZ0ssWUFBWCxFQUF5QjtBQUN2QmhLLG1CQUFPZ0ssWUFBUCxDQUFvQmlCLE9BQXBCLENBQTRCLGFBQTVCLEVBQTJDbkIsS0FBS29CLFNBQUwsQ0FBZSxLQUFLQyxXQUFwQixDQUEzQztBQUNEO0FBQ0YsU0FKRCxDQUlFLE9BQU90SCxDQUFQLEVBQVU7QUFDVnVILGtCQUFRQyxLQUFSLENBQWN4SCxDQUFkLEVBRFUsQ0FDUTtBQUNuQjtBQUNGOzs7eUNBRWtCO0FBQ2pCLFlBQUk7QUFDRixjQUFJN0QsT0FBT2dLLFlBQVgsRUFBeUI7QUFDdkIsaUJBQUttQixXQUFMLEdBQW1CckIsS0FBS0MsS0FBTCxDQUFXL0osT0FBT2dLLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLGFBQTVCLENBQVgsQ0FBbkI7QUFDRDtBQUNGLFNBSkQsQ0FJRSxPQUFPcEcsQ0FBUCxFQUFVO0FBQ1Z1SCxrQkFBUUMsS0FBUixDQUFjeEgsQ0FBZCxFQURVLENBQ1E7QUFDbkI7QUFDRjs7OzRDQUtxQjtBQUNwQixhQUFLLElBQU1YLElBQVgsSUFBbUIsS0FBSzhCLFdBQXhCLEVBQXFDO0FBQ25DLGNBQUksS0FBS0EsV0FBTCxDQUFpQkMsY0FBakIsQ0FBZ0MvQixJQUFoQyxDQUFKLEVBQTJDO0FBQ3pDLGdCQUFJLEtBQUs4QixXQUFMLENBQWlCQyxjQUFqQixDQUFnQy9CLElBQWhDLENBQUosRUFBMkM7QUFDekMsbUJBQUtvSSxrQkFBTCxDQUF3QnBJLElBQXhCLEVBQThCLEtBQUs4QixXQUFMLENBQWlCOUIsSUFBakIsQ0FBOUI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxlQUFPLEtBQUs4QixXQUFaO0FBQ0Q7Ozs0QkFLSztBQUNKLGFBQUs1RyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS21OLHdCQUFMLENBQThCLEtBQUtDLG9CQUFMLENBQTBCckwsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBOUI7QUFDQWhELGFBQUs7QUFDSDhELG9CQUFVLEtBRFA7QUFFSHdLLG9CQUFVLElBRlA7QUFHSEMsb0JBQVUsQ0FBQyxLQUFLeE47QUFIYixTQUFMO0FBS0Q7OztpQ0FLVTtBQUNULGVBQU8sS0FBS1csTUFBWjtBQUNEOzs7c0NBT2UsQ0FBRTs7O3NDQVFGcUUsSSxFQUFNeUksTyxFQUF1QjtBQUFBLFlBQWRwTyxPQUFjLHVFQUFKLEVBQUk7O0FBQzNDLFlBQU1xTyxXQUFXRCxtQkFBbUJFLEtBQUtDLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkMsWUFBckMsR0FBb0RMLE9BQXBELEdBQThELElBQUlFLEtBQUtDLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkMsWUFBdEIsQ0FBbUNMLE9BQW5DLENBQS9FOztBQUVBLGFBQUtuTixRQUFMLENBQWMwRSxJQUFkLElBQXNCMEksUUFBdEI7O0FBRUFBLGlCQUFTMUssRUFBVCxDQUFZLGdCQUFaLEVBQThCLEtBQUsrSyxnQkFBbkMsRUFBcUQsSUFBckQ7O0FBRUEsWUFBSzFPLFFBQVEyTyxTQUFSLElBQXFCUCxRQUFRTyxTQUE5QixJQUE0QyxDQUFDLEtBQUtqTixjQUF0RCxFQUFzRTtBQUNwRSxlQUFLQSxjQUFMLEdBQXNCMk0sUUFBdEI7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDs7O3lDQVFrQjFJLEksRUFBTWlKLFUsRUFBMEI7QUFBQSxZQUFkNU8sT0FBYyx1RUFBSixFQUFJOztBQUNqRCxZQUFNcU8sV0FBV08sc0JBQXNCTixLQUFLQyxLQUFMLENBQVdDLE1BQVgsQ0FBa0JDLFlBQXhDLEdBQXVERyxVQUF2RCxHQUFvRSxJQUFJTixLQUFLQyxLQUFMLENBQVdDLE1BQVgsQ0FBa0JDLFlBQXRCLENBQW1DRyxVQUFuQyxDQUFyRjs7QUFFQSxhQUFLMU4sWUFBTCxDQUFrQnlFLElBQWxCLElBQTBCMEksUUFBMUI7O0FBRUFBLGlCQUFTMUssRUFBVCxDQUFZLGdCQUFaLEVBQThCLEtBQUsrSyxnQkFBbkMsRUFBcUQsSUFBckQ7O0FBRUEsWUFBSzFPLFFBQVEyTyxTQUFSLElBQXFCQyxXQUFXRCxTQUFqQyxJQUErQyxDQUFDLEtBQUt6TixZQUFMLENBQWtCMk4sT0FBdEUsRUFBK0U7QUFDN0UsZUFBSzNOLFlBQUwsQ0FBa0IyTixPQUFsQixHQUE0QlIsUUFBNUI7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDs7O3lDQUVrQjtBQUNqQixhQUFLL0ssSUFBTDtBQUNEOzs7aUNBTVVxQyxJLEVBQU07QUFDZixlQUFPLENBQUMsQ0FBQyxLQUFLMUUsUUFBTCxDQUFjMEUsSUFBZCxDQUFUO0FBQ0Q7OztpQ0FFVXNDLE8sRUFBUztBQUNsQixZQUFJLEtBQUs2RyxrQkFBTCxJQUEyQixLQUFLeEMsaUJBQXBDLEVBQXVEO0FBQ3JEO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJckUsT0FBSixFQUFhO0FBQ1gsZUFBS3FFLGlCQUFMLEdBQXlCckUsT0FBekI7QUFDQSxlQUFLOEcsd0JBQUw7QUFDQTtBQUNEOztBQUVEO0FBQ0EsYUFBS0MsdUJBQUw7QUFDQSxhQUFLRCx3QkFBTDtBQUNEOzs7Z0RBRXlCO0FBQ3hCLFlBQU1FLHdCQUF3QixVQUE5QjtBQUNBek0sVUFBRSxNQUFGLEVBQVUwTSxNQUFWLHVCQUNhRCxxQkFEYjtBQUlBLGFBQUszQyxpQkFBTCxHQUF5QjlKLFFBQU15TSxxQkFBTixFQUErQkUsR0FBL0IsQ0FBbUMsQ0FBbkMsQ0FBekI7QUFDRDs7O2lEQUUwQjtBQUN6QixZQUFJLENBQUMsS0FBSzdDLGlCQUFWLEVBQTZCO0FBQzNCLGdCQUFNLElBQUlMLEtBQUosQ0FBVSxxRUFBVixDQUFOO0FBQ0Q7O0FBRUQsWUFBTW1ELHlCQUF5QixlQUEvQjtBQUNBLFlBQU1DLDhCQUE4Qiw4QkFBcEM7QUFDQTdNLFVBQUUsS0FBSzhKLGlCQUFQLEVBQTBCNEMsTUFBMUIsaWlCQVllRSxzQkFaZixpQkFZaURDLDJCQVpqRCxrTkFnQmdCLEtBQUsvTSxnQkFoQnJCLGlOQXFCdUUsS0FBS0MsU0FyQjVFOztBQTRCQSxhQUFLdU0sa0JBQUwsR0FBMEJ0TSxRQUFNNE0sc0JBQU4sRUFBZ0NELEdBQWhDLENBQW9DLENBQXBDLENBQTFCO0FBQ0Q7Ozt5Q0FNa0I7QUFDakIsZUFBTyxLQUFLN0MsaUJBQUwsSUFBMEIsS0FBS3dDLGtCQUF0QztBQUNEOzs7NENBRXFCO0FBQ3BCLGVBQU8sS0FBS3hDLGlCQUFaO0FBQ0Q7Ozs2Q0FFc0I7QUFDckIsZUFBTyxLQUFLd0Msa0JBQVo7QUFDRDs7O21DQVFZUSxJLEVBQU1ySCxPLEVBQTZCO0FBQUEsWUFBcEJzSCxRQUFvQix1RUFBVCxPQUFTOztBQUM5QyxZQUFNN0ksS0FBSzRJLEtBQUs1SSxFQUFoQjs7QUFFQSxZQUFNOEksT0FBT3ZILFdBQVcsS0FBSzZHLGtCQUE3QjtBQUNBUSxhQUFLRyxRQUFMLEdBQWdCRCxJQUFoQjtBQUNBRixhQUFLSSxjQUFMLEdBQXNCSCxRQUF0QjtBQUNBLGFBQUtuTyxLQUFMLENBQVdzRixFQUFYLElBQWlCNEksSUFBakI7O0FBRUEsYUFBS0ssaUJBQUwsQ0FBdUJMLElBQXZCOztBQUVBLGFBQUtNLFlBQUwsQ0FBa0JOLElBQWxCOztBQUVBLGVBQU8sSUFBUDtBQUNEOzs7d0NBRWlCQSxJLEVBQU07QUFDdEIsWUFBSSxDQUFDQSxJQUFELElBQVMsT0FBT0EsS0FBS08sUUFBWixLQUF5QixVQUF0QyxFQUFrRDtBQUNoRDtBQUNEOztBQUVEalEsYUFBSzBQLEtBQUtPLFFBQUwsRUFBTCxFQUFzQlAsS0FBS1EsU0FBTCxDQUFlbE4sSUFBZixDQUFvQjBNLElBQXBCLENBQXRCLEVBQWlEQSxLQUFLUyxTQUFMLENBQWVuTixJQUFmLENBQW9CME0sSUFBcEIsQ0FBakQ7QUFDRDs7O3NDQVNldkgsQyxFQUFHaUksQyxFQUFHL0gsTyxFQUFTO0FBQzdCLFlBQUl0QyxPQUFPb0MsQ0FBWDtBQUNBLFlBQUlrSSxPQUFPRCxDQUFYOztBQUVBLFlBQUksUUFBT3JLLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUJzSyxpQkFBT3RLLElBQVA7QUFDQUEsaUJBQU9zSyxLQUFLdEssSUFBWjtBQUNEOztBQUVELGFBQUtuRSxJQUFMLENBQVVtRSxJQUFWLElBQWtCc0ssSUFBbEI7O0FBRUEsWUFBSSxLQUFLcFAsUUFBVCxFQUFtQjtBQUNqQm9QLGVBQUtwSSxJQUFMO0FBQ0Q7O0FBRUQsWUFBTXFJLFdBQVcxTixFQUFFLGtCQUFGLEVBQXNCLEtBQUs4SixpQkFBM0IsRUFBOEM2QyxHQUE5QyxDQUFrRCxDQUFsRCxDQUFqQjtBQUNBLFlBQU1LLE9BQU92SCxXQUFXaUksUUFBeEI7QUFDQUQsYUFBS0UsT0FBTCxDQUFhWCxJQUFiLEVBQW1CLE9BQW5COztBQUVBLGVBQU8sSUFBUDtBQUNEOzs7aUNBTVU7QUFDVCxZQUFNckosVUFBVSxFQUFoQjs7QUFFQSxhQUFLLElBQU1tSixJQUFYLElBQW1CLEtBQUtsTyxLQUF4QixFQUErQjtBQUM3QixjQUFJLEtBQUtBLEtBQUwsQ0FBV3NHLGNBQVgsQ0FBMEI0SCxJQUExQixDQUFKLEVBQXFDO0FBQ25Dbkosb0JBQVFULElBQVIsQ0FBYSxLQUFLdEUsS0FBTCxDQUFXa08sSUFBWCxDQUFiO0FBQ0Q7QUFDRjs7QUFFRCxlQUFPbkosT0FBUDtBQUNEOzs7bUNBT1ltSixJLEVBQU07QUFDakI7QUFDQSxlQUFRLEtBQUtjLG9CQUFMLE9BQWdDZCxJQUF4QztBQUNEOzs7MkNBRW9CZSxLLEVBQU87QUFDMUIsWUFBTUMsT0FBTzlOLEVBQUUsS0FBS3dJLGdCQUFMLEVBQUYsQ0FBYjtBQUNBLFlBQU11RixnQkFBZ0JELEtBQUtFLElBQUwsQ0FBVSxRQUFWLENBQXRCO0FBQ0EsWUFBSUgsVUFBVUUsYUFBZCxFQUE2QjtBQUMzQjtBQUNEOztBQUVERCxhQUFLRSxJQUFMLENBQVUsUUFBVixFQUFvQkgsS0FBcEI7O0FBRUEsWUFBSUEsVUFBVSxVQUFkLEVBQTBCO0FBQ3hCQyxlQUFLRyxXQUFMLENBQWlCLFdBQWpCO0FBQ0FILGVBQUtJLFFBQUwsQ0FBYyxVQUFkO0FBQ0QsU0FIRCxNQUdPLElBQUlMLFVBQVUsV0FBZCxFQUEyQjtBQUNoQ0MsZUFBS0csV0FBTCxDQUFpQixVQUFqQjtBQUNBSCxlQUFLSSxRQUFMLENBQWMsV0FBZDtBQUNELFNBSE0sTUFHQTtBQUNMSixlQUFLRyxXQUFMLENBQWlCLFVBQWpCO0FBQ0FILGVBQUtHLFdBQUwsQ0FBaUIsV0FBakI7QUFDRDs7QUFFRCxhQUFLL1Asa0JBQUwsR0FBMEIyUCxLQUExQjtBQUNBLGFBQUtNLGdCQUFMLENBQXNCTixLQUF0QjtBQUNBLDBCQUFROUcsT0FBUixDQUFnQixxQkFBaEIsRUFBdUMsQ0FBQzhHLEtBQUQsQ0FBdkM7QUFDRDs7OytDQUV3Qk8sUSxFQUFVO0FBQ2pDLFlBQU1DLFFBQVFwTyxPQUFPcU8sVUFBUCxDQUFrQix5QkFBbEIsQ0FBZDs7QUFFQSxZQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsQ0FBRCxFQUFPO0FBQ3hCLGNBQUlBLEVBQUVDLE9BQU4sRUFBZTtBQUNiTCxxQkFBUyxVQUFUO0FBQ0QsV0FGRCxNQUVPO0FBQ0xBLHFCQUFTLFdBQVQ7QUFDRDtBQUNGLFNBTkQ7QUFPQUMsY0FBTUssV0FBTixDQUFrQkgsVUFBbEI7QUFDQUEsbUJBQVdGLEtBQVg7QUFDRDs7OzZDQU1zQjtBQUNyQixZQUFNTSxLQUFLLEtBQUtDLGNBQUwsRUFBWDtBQUNBLFlBQUlELEVBQUosRUFBUTtBQUNOLGlCQUFPLEtBQUtFLE9BQUwsQ0FBYUYsRUFBYixDQUFQO0FBQ0Q7QUFDRjs7O3FDQU1jRyxLLEVBQU87QUFDcEIsYUFBSy9QLFlBQUwsR0FBb0IrUCxLQUFwQjtBQUNEOzs7dUNBTWdCO0FBQ2YsZUFBTyxLQUFLL1AsWUFBWjtBQUNEOzs7OEJBT09nUSxHLEVBQUs7QUFDWCxlQUFPLENBQUMsQ0FBQyxLQUFLQyxnQkFBTCxDQUFzQjtBQUM3QkQsa0JBRDZCO0FBRTdCMUosZ0JBQU07QUFGdUIsU0FBdEIsQ0FBVDtBQUlEOzs7OEJBT08wSixHLEVBQUs7QUFDWCxlQUFPLEtBQUtDLGdCQUFMLENBQXNCO0FBQzNCRCxrQkFEMkI7QUFFM0IxSixnQkFBTTtBQUZxQixTQUF0QixDQUFQO0FBSUQ7Ozt3Q0FDaUIwSixHLEVBQUs7QUFDckIsZUFBTyxLQUFLQyxnQkFBTCxDQUFzQjtBQUMzQkQsa0JBRDJCO0FBRTNCMUosZ0JBQU07QUFGcUIsU0FBdEIsQ0FBUDtBQUlEOzs7dUNBRWdCN0gsTyxFQUFTO0FBQ3hCLFlBQU11UixNQUFNdlIsV0FBV0EsUUFBUXVSLEdBQS9CO0FBQ0EsWUFBTTFKLE9BQU83SCxXQUFXQSxRQUFRNkgsSUFBaEM7O0FBRUEsWUFBSTBKLEdBQUosRUFBUztBQUNQLGNBQUlqQyxhQUFKO0FBQ0EsY0FBSSxPQUFPaUMsR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCakMsbUJBQU8sS0FBS2xPLEtBQUwsQ0FBV21RLEdBQVgsQ0FBUDtBQUNELFdBRkQsTUFFTyxJQUFJLE9BQU9BLElBQUk3SyxFQUFYLEtBQWtCLFFBQXRCLEVBQWdDO0FBQ3JDNEksbUJBQU8sS0FBS2xPLEtBQUwsQ0FBV21RLElBQUk3SyxFQUFmLENBQVA7QUFDRDs7QUFFRCxjQUFJbUIsUUFBUXlILElBQVIsSUFBZ0IsQ0FBQ0EsS0FBS3pPLFFBQTFCLEVBQW9DO0FBQ2xDeU8saUJBQUt6SCxJQUFMLENBQVUsS0FBS3BFLEtBQWY7QUFDQTZMLGlCQUFLYSxPQUFMLENBQWFiLEtBQUtHLFFBQWxCLEVBQTZCSCxLQUFLSSxjQUFMLElBQXVCLE9BQXBEO0FBQ0FKLGlCQUFLek8sUUFBTCxHQUFnQixJQUFoQjtBQUNBeU8saUJBQUtHLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDs7QUFFRCxpQkFBT0gsSUFBUDtBQUNEOztBQUVELGVBQU8sSUFBUDtBQUNEOzs7c0NBT2VpQyxHLEVBQUtFLE0sRUFBUTtBQUMzQixZQUFNbkMsT0FBTyxLQUFLa0MsZ0JBQUwsQ0FBc0I7QUFDakNELGtCQURpQztBQUVqQzFKLGdCQUFNO0FBRjJCLFNBQXRCLENBQWI7QUFJQSxlQUFReUgsUUFBUUEsS0FBS29DLFdBQUwsQ0FBaUJELE1BQWpCLENBQWhCO0FBQ0Q7OztpQ0FPVTlMLEksRUFBTTtBQUNmLFlBQUksT0FBT0EsSUFBUCxLQUFnQixRQUFoQixJQUE0QixLQUFLMUUsUUFBTCxDQUFjMEUsSUFBZCxDQUFoQyxFQUFxRDtBQUNuRCxpQkFBTyxLQUFLMUUsUUFBTCxDQUFjMEUsSUFBZCxDQUFQO0FBQ0Q7O0FBRUQsZUFBTyxLQUFLakUsY0FBWjtBQUNEOzs7b0NBTWFpRSxJLEVBQU07QUFDbEIsZUFBTyxDQUFDLENBQUMsS0FBS3pFLFlBQUwsQ0FBa0J5RSxJQUFsQixDQUFUO0FBQ0Q7OztvQ0FFYUEsSSxFQUFNO0FBQ2xCLFlBQUksS0FBS3pFLFlBQUwsQ0FBa0J5RSxJQUFsQixDQUFKLEVBQTZCO0FBQzNCLGlCQUFPLEtBQUt6RSxZQUFMLENBQWtCeUUsSUFBbEIsQ0FBUDtBQUNEOztBQUVELGVBQU8sS0FBS3pFLFlBQUwsQ0FBa0IyTixPQUF6QjtBQUNEOzs7c0NBTWV2RCxLLEVBQU87QUFDckIsYUFBSyxJQUFNdkQsQ0FBWCxJQUFnQixLQUFLdkcsSUFBckIsRUFBMkI7QUFDekIsY0FBSSxLQUFLQSxJQUFMLENBQVVrRyxjQUFWLENBQXlCSyxDQUF6QixDQUFKLEVBQWlDO0FBQy9CLGdCQUFJLEtBQUt2RyxJQUFMLENBQVV1RyxDQUFWLEVBQWE0SixPQUFqQixFQUEwQjtBQUN4QixtQkFBS25RLElBQUwsQ0FBVXVHLENBQVYsRUFBYTZKLEdBQWIsQ0FBaUIsT0FBakIsRUFBMEJ0RyxLQUExQjs7QUFFQTtBQUNBLGtCQUFNdUcsU0FBU3JQLEVBQUUsS0FBS2hCLElBQUwsQ0FBVXlPLElBQVYsQ0FBZWhJLE9BQWpCLENBQWY7QUFDQSxtQkFBSzZKLE9BQUwsR0FBZUQsT0FBT3hNLElBQVAsQ0FBWSxVQUFaLEVBQXdCdEYsSUFBeEIsQ0FBNkIsU0FBN0IsQ0FBZjtBQUNBLG1CQUFLK1IsT0FBTCxDQUFhckksT0FBYjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxlQUFPLElBQVA7QUFDRDs7O2lDQUtVLENBQ1Y7OztxQ0FFWSxTQUFXLENBQUU7OzttREFFQyxTQUFXLENBQUU7OztpREFFZixTQUFXLENBQUU7Ozs2Q0FFakIsU0FBVyxDQUFFOzs7MkNBRWYsU0FBVyxDQUFFOzs7dUNBRWpCLG9CQUFzQixDQUFFOzs7MENBRW5Cc0ksRyxFQUFLO0FBQ3ZCLFlBQU16QyxPQUFPLEtBQUsrQixPQUFMLENBQWFVLElBQUlDLE1BQWpCLENBQWI7QUFDQSxZQUFJMUMsSUFBSixFQUFVO0FBQ1IsY0FBSXlDLElBQUlFLEdBQVIsRUFBYTtBQUNYLGlCQUFLQyx5QkFBTCxDQUErQjVDLElBQS9CO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUs2Qyx1QkFBTCxDQUE2QjdDLElBQTdCO0FBQ0Q7QUFDRjtBQUNGOzs7eUNBRWtCeUMsRyxFQUFLO0FBQ3RCLFlBQU16QyxPQUFPLEtBQUsrQixPQUFMLENBQWFVLElBQUlDLE1BQWpCLENBQWI7QUFDQSxZQUFJMUMsSUFBSixFQUFVO0FBQ1IsY0FBSXlDLElBQUlFLEdBQVIsRUFBYTtBQUNYLGlCQUFLRyxtQkFBTCxDQUF5QjlDLElBQXpCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUsrQyxpQkFBTCxDQUF1Qi9DLElBQXZCO0FBQ0Q7QUFDRjtBQUNGOzs7a0NBRVd5QyxHLEVBQUs7QUFDZixZQUFNekMsT0FBTyxLQUFLK0IsT0FBTCxDQUFhVSxJQUFJQyxNQUFqQixDQUFiO0FBQ0EsWUFBSTFDLElBQUosRUFBVTtBQUNSLGVBQUtnRCxhQUFMLENBQW1CaEQsSUFBbkIsRUFBeUJ5QyxJQUFJUSxHQUE3QixFQUFrQ1IsSUFBSWhTLElBQXRDO0FBQ0Q7QUFDRjs7O2dEQUV5QnVQLEksRUFBTTtBQUM5QixhQUFLa0QsMEJBQUwsQ0FBZ0NsRCxJQUFoQzs7QUFFQUEsYUFBS21ELG9CQUFMO0FBQ0Q7Ozs4Q0FFdUJuRCxJLEVBQU07QUFDNUIsYUFBS29ELHdCQUFMLENBQThCcEQsSUFBOUI7O0FBRUEsYUFBSyxJQUFNdkgsQ0FBWCxJQUFnQixLQUFLdkcsSUFBckIsRUFBMkI7QUFDekIsY0FBSSxLQUFLQSxJQUFMLENBQVV1RyxDQUFWLEVBQWE0SixPQUFqQixFQUEwQjtBQUN4QixpQkFBS25RLElBQUwsQ0FBVXVHLENBQVYsRUFBYTRLLEtBQWI7QUFDRDtBQUNGOztBQUVEckQsYUFBS3NELGtCQUFMO0FBQ0Q7OzswQ0FFbUJ0RCxJLEVBQU07QUFDeEIsYUFBS3VELG9CQUFMLENBQTBCdkQsSUFBMUI7O0FBRUFBLGFBQUt3RCxjQUFMO0FBQ0Q7Ozt3Q0FFaUJ4RCxJLEVBQU07QUFDdEIsYUFBS3lELGtCQUFMLENBQXdCekQsSUFBeEI7O0FBRUEsWUFBTTBELFFBQVMxRCxLQUFLdFAsT0FBTCxJQUFnQnNQLEtBQUt0UCxPQUFMLENBQWFnVCxLQUE5QixJQUF3QzFELEtBQUsyRCxRQUFMLEVBQXhDLElBQTJELEVBQXpFOztBQUVBLGFBQUssSUFBTWxMLENBQVgsSUFBZ0IsS0FBS3ZHLElBQXJCLEVBQTJCO0FBQ3pCLGNBQUksS0FBS0EsSUFBTCxDQUFVdUcsQ0FBVixFQUFhNEosT0FBakIsRUFBMEI7QUFDeEIsaUJBQUtuUSxJQUFMLENBQVV1RyxDQUFWLEVBQWFtTCxTQUFiLENBQXVCRixNQUFNakwsQ0FBTixDQUF2QjtBQUNEO0FBQ0Y7O0FBRUR1SCxhQUFLNkQsWUFBTDtBQUNEOzs7b0NBRWE3RCxJLEVBQU1pRCxHLEVBQUt4UyxJLEVBQU07QUFDN0IsYUFBS3FULGNBQUwsQ0FBb0I5RCxJQUFwQjs7QUFFQUEsYUFBSytELFFBQUwsQ0FBY2QsR0FBZCxFQUFtQnhTLElBQW5CO0FBQ0Q7Ozs4Q0FTdUJ1VCxTLEVBQVdoVixLLEVBQU87QUFBQTs7QUFDeEMsWUFBTWlWLE9BQU8sS0FBSy9ULE9BQUwsQ0FBYUMsT0FBYixJQUF3QixFQUFyQztBQUNBLFlBQU0rVCxXQUFXRCxLQUFLRSxNQUFMLENBQVksVUFBQ3RPLElBQUQsRUFBVTtBQUNyQyxpQkFBT21PLFVBQVV2VSxJQUFWLENBQWVULGVBQWYsRUFBOEI2RyxLQUFLcEYsSUFBbkMsQ0FBUDtBQUNELFNBRmdCLENBQWpCOztBQUlBLGVBQU95VCxTQUFTck0sR0FBVCxDQUFhLFVBQUNoQyxJQUFELEVBQVU7QUFDNUIsaUJBQU9BLEtBQUtwRixJQUFaO0FBQ0QsU0FGTSxDQUFQO0FBR0Q7Ozs2Q0FVc0J1VCxTLEVBQVdJLEMsRUFBR0MsQyxFQUFHO0FBQ3RDLFlBQUlyVixRQUFRcVYsQ0FBWjtBQUNBLFlBQUlDLFFBQVFGLENBQVo7O0FBRUEsWUFBSSxPQUFPRSxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCdFYsa0JBQVFzVixLQUFSO0FBQ0FBLGtCQUFRLENBQVI7QUFDRDs7QUFFRCxZQUFNTCxPQUFPLEtBQUsvVCxPQUFMLENBQWFDLE9BQWIsSUFBd0IsRUFBckM7O0FBRUFtVSxnQkFBUUEsU0FBUyxDQUFqQjs7QUFFQSxhQUFLLElBQUloTSxJQUFJMkwsS0FBSzlVLE1BQUwsR0FBYyxDQUF0QixFQUF5Qm9WLElBQUksQ0FBbEMsRUFBcUNqTSxLQUFLLENBQUwsS0FBV2dNLFNBQVMsQ0FBVCxJQUFjQyxJQUFJRCxLQUE3QixDQUFyQyxFQUEwRWhNLEtBQUtpTSxHQUEvRSxFQUFvRjtBQUNsRixjQUFJUCxVQUFVdlUsSUFBVixDQUFlVCxTQUFTLElBQXhCLEVBQThCaVYsS0FBSzNMLENBQUwsRUFBUTdILElBQXRDLENBQUosRUFBaUQ7QUFDL0MsbUJBQU93VCxLQUFLM0wsQ0FBTCxFQUFRN0gsSUFBZjtBQUNEO0FBQ0Y7O0FBRUQsZUFBTyxLQUFQO0FBQ0Q7OzttREFTNEIrVCxJLEVBQU1SLFMsRUFBV2hWLEssRUFBTztBQUNuRCxZQUFNeVYsU0FBUyxFQUFmO0FBQ0EsWUFBSWxWLE1BQU1tVixPQUFOLENBQWNGLElBQWQsQ0FBSixFQUF5QjtBQUN2QkEsZUFBSzVPLE9BQUwsQ0FBYSxTQUFTQSxPQUFULENBQWlCQyxJQUFqQixFQUF1QjtBQUNsQyxpQkFBS0EsSUFBTCxJQUFhLElBQWI7QUFDRCxXQUZELEVBRUc0TyxNQUZIO0FBR0QsU0FKRCxNQUlPO0FBQ0xBLGlCQUFPRCxJQUFQLElBQWUsSUFBZjtBQUNEOztBQUVELGVBQU8sS0FBS0csc0JBQUwsQ0FBNEIsU0FBU0Esc0JBQVQsQ0FBZ0NDLENBQWhDLEVBQW1DO0FBQ3BFLGNBQU0xVSxVQUFXMFUsRUFBRWxVLE9BQUYsSUFBYWtVLEVBQUVsVSxPQUFGLENBQVVtVSxNQUF4QixJQUFtQ0QsQ0FBbkQ7QUFDQSxjQUFNRSxlQUFlNVUsV0FBV0EsUUFBUTRVLFlBQXhDOztBQUVBO0FBQ0EsY0FBSUwsT0FBT0ssWUFBUCxDQUFKLEVBQTBCO0FBQ3hCLGdCQUFJZCxTQUFKLEVBQWU7QUFDYixrQkFBSUEsVUFBVXZVLElBQVYsQ0FBZVQsU0FBUyxJQUF4QixFQUE4QjRWLENBQTlCLEVBQWlDMVUsT0FBakMsQ0FBSixFQUErQztBQUM3Qyx1QkFBTzBVLENBQVA7QUFDRDtBQUNGLGFBSkQsTUFJTztBQUNMLHFCQUFPQSxDQUFQO0FBQ0Q7QUFDRjtBQUNGLFNBZE0sQ0FBUDtBQWVEOzs7NENBdUJxQkcsQyxFQUFHVixDLEVBQUc7QUFDMUIsWUFBSVcsT0FBT0QsQ0FBWDtBQUNBLFlBQUlFLE9BQU9aLENBQVg7O0FBRUEsWUFBSW5WLFVBQVVDLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsY0FBTStWLG1CQUFtQmhXLFVBQVUsQ0FBVixDQUF6QjtBQUNBLGNBQU1rSSxLQUFLbEksVUFBVSxDQUFWLENBQVg7O0FBRUErVixpQkFBTy9WLFVBQVUsQ0FBVixDQUFQO0FBQ0E4VixpQkFBTzVOLEtBQVE4TixnQkFBUixTQUE0QjlOLEVBQTVCLEdBQW1DOE4sZ0JBQTFDO0FBQ0Q7O0FBRUQsWUFBTXRMLFlBQVksS0FBS2xJLGNBQUwsQ0FBb0JzVCxJQUFwQixNQUE4QixLQUFLdFQsY0FBTCxDQUFvQnNULElBQXBCLElBQTRCLEVBQTFELENBQWxCO0FBQ0EsWUFBSXBMLFNBQUosRUFBZTtBQUNiQSxvQkFBVXhELElBQVYsQ0FBZTZPLElBQWY7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDs7OzJDQVdvQkYsQyxFQUFHO0FBQ3RCLFlBQUlDLE9BQU9ELENBQVg7O0FBRUEsWUFBSTdWLFVBQVVDLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEI2VixpQkFBTzlWLFVBQVUsQ0FBVixJQUFrQkEsVUFBVSxDQUFWLENBQWxCLFNBQWtDQSxVQUFVLENBQVYsQ0FBbEMsR0FBbURBLFVBQVUsQ0FBVixDQUExRDtBQUNEOztBQUVELFlBQU1pVyxXQUFXSCxLQUFLSSxLQUFMLENBQVcsR0FBWCxDQUFqQjtBQUNBLFlBQU1GLG1CQUFtQkMsU0FBUyxDQUFULENBQXpCO0FBQ0EsWUFBTUUsVUFBVSxLQUFLM1QsY0FBTCxDQUFvQnNULElBQXBCLEtBQTZCLEVBQTdDO0FBQ0EsWUFBTU0sU0FBUyxLQUFLNVQsY0FBTCxDQUFvQndULGdCQUFwQixLQUF5QyxFQUF4RDs7QUFFQSxlQUFPRyxRQUFRelYsTUFBUixDQUFlMFYsTUFBZixDQUFQO0FBQ0Q7OztvQ0FFVyxhQUFlO0FBQ3pCLGVBQU8sSUFBUDtBQUNEOzs7dUNBS2dCO0FBQ2YsZUFBTyxJQUFQO0FBQ0Q7Ozt3Q0FLaUI7QUFDaEIsZUFBTyxJQUFQO0FBQ0Q7OztxQ0FFY3RULE0sRUFBUTtBQUNyQixhQUFLLElBQU15RyxDQUFYLElBQWdCLEtBQUt2RyxJQUFyQixFQUEyQjtBQUN6QixjQUFJLEtBQUtBLElBQUwsQ0FBVXVHLENBQVYsRUFBYTRKLE9BQWpCLEVBQTBCO0FBQ3hCLGlCQUFLblEsSUFBTCxDQUFVdUcsQ0FBVixFQUFhOE0sT0FBYixDQUFxQnZULE1BQXJCO0FBQ0Q7QUFDRjtBQUNGOzs7Ozs7b0JBR1luQyxXIiwiZmlsZSI6IkFwcGxpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCB1dGlsIGZyb20gJy4vVXRpbGl0eSc7XHJcbmltcG9ydCBNb2RlbE1hbmFnZXIgZnJvbSAnLi9Nb2RlbHMvTWFuYWdlcic7XHJcbmltcG9ydCBUb2FzdCBmcm9tICcuL0RpYWxvZ3MvVG9hc3QnO1xyXG5pbXBvcnQgTW9kYWwgZnJvbSAnLi9EaWFsb2dzL01vZGFsJztcclxuaW1wb3J0IEJ1c3lJbmRpY2F0b3IgZnJvbSAnLi9EaWFsb2dzL0J1c3lJbmRpY2F0b3InO1xyXG5pbXBvcnQgaGFzaCBmcm9tICdkb2pvL2hhc2gnO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcbmltcG9ydCB7IHNkayB9IGZyb20gJy4vcmVkdWNlcnMvaW5kZXgnO1xyXG5pbXBvcnQgeyBzZXRDb25uZWN0aW9uU3RhdGUgfSBmcm9tICcuL2FjdGlvbnMvY29ubmVjdGlvbic7XHJcbmltcG9ydCBTY2VuZSBmcm9tICcuL1NjZW5lJztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi9Tb2hvSWNvbnMnO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3Nka0FwcGxpY2F0aW9uJyk7XHJcblxyXG5GdW5jdGlvbi5wcm90b3R5cGUuYmluZERlbGVnYXRlID0gZnVuY3Rpb24gYmluZERlbGVnYXRlKHNjb3BlKSB7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kKCkge1xyXG4gICAgICByZXR1cm4gc2VsZi5hcHBseShzY29wZSB8fCB0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG9wdGlvbmFsID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICByZXR1cm4gZnVuY3Rpb24gYm91bmRXQXJncygpIHtcclxuICAgIGNvbnN0IGNhbGxlZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcbiAgICByZXR1cm4gc2VsZi5hcHBseShzY29wZSB8fCB0aGlzLCBjYWxsZWQuY29uY2F0KG9wdGlvbmFsKSk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAYWxpYXMgYXJnb3MuQXBwbGljYXRpb25cclxuICogQGNsYXNzZGVzYyBBcHBsaWNhdGlvbiBpcyBhIG5leHVzIHRoYXQgcHJvdmlkZXMgbWFueSByb3V0aW5nIGFuZCBnbG9iYWwgYXBwbGljYXRpb24gc2VydmljZXMgdGhhdCBtYXkgYmUgdXNlZFxyXG4gKiBmcm9tIGFueXdoZXJlIHdpdGhpbiB0aGUgYXBwLlxyXG4gKlxyXG4gKiBJdCBwcm92aWRlcyBhIHNob3J0Y3V0IGFsaWFzIHRvIGB3aW5kb3cuQXBwYCAoYEFwcGApIHdpdGggdGhlIG1vc3QgY29tbW9uIHVzYWdlIGJlaW5nIGBBcHAuZ2V0VmlldyhpZClgLlxyXG4gKi9cclxuY2xhc3MgQXBwbGljYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkgZW5hYmxlQ29uY3VycmVuY3lDaGVjayB7Qm9vbGVhbn0gT3B0aW9uIHRvIHNraXAgY29uY3VycmVuY3kgY2hlY2tzIHRvIGF2b2lkIHByZWNvbmRpdGlvbi80MTIgZXJyb3JzLlxyXG4gICAgICovXHJcbiAgICB0aGlzLmVuYWJsZUNvbmN1cnJlbmN5Q2hlY2sgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLlJlVUkgPSB7XHJcbiAgICAgIGFwcDogbnVsbCxcclxuICAgICAgYmFjazogZnVuY3Rpb24gYmFjaygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYXBwKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmFwcC5jb250ZXh0ICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5hcHAuY29udGV4dC5oaXN0b3J5ICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Lmhpc3RvcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgLy8gTm90ZTogUGFnZUpTIHdpbGwgcHVzaCB0aGUgcGFnZSBiYWNrIG9udG8gdGhlIHN0YWNrIG9uY2Ugdmlld2VkXHJcbiAgICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5hcHAuY29udGV4dC5oaXN0b3J5LnBvcCgpO1xyXG4gICAgICAgICAgcGFnZS5sZW4tLTtcclxuXHJcbiAgICAgICAgICBjb25zdCByZXR1cm5UbyA9IGZyb20uZGF0YSAmJiBmcm9tLmRhdGEub3B0aW9ucyAmJiBmcm9tLmRhdGEub3B0aW9ucy5yZXR1cm5UbztcclxuXHJcbiAgICAgICAgICBpZiAocmV0dXJuVG8pIHtcclxuICAgICAgICAgICAgbGV0IHJldHVybkluZGV4ID0gWy4uLnRoaXMuYXBwLmNvbnRleHQuaGlzdG9yeV0ucmV2ZXJzZSgpXHJcbiAgICAgICAgICAgICAgLmZpbmRJbmRleCh2YWwgPT4gdmFsLnBhZ2UgPT09IHJldHVyblRvKTtcclxuICAgICAgICAgICAgLy8gU2luY2Ugd2FudCB0byBmaW5kIGxhc3QgaW5kZXggb2YgcGFnZSwgbXVzdCByZXZlcnNlIGluZGV4XHJcbiAgICAgICAgICAgIGlmIChyZXR1cm5JbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICByZXR1cm5JbmRleCA9ICh0aGlzLmFwcC5jb250ZXh0Lmhpc3RvcnkubGVuZ3RoIC0gMSkgLSByZXR1cm5JbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Lmhpc3Rvcnkuc3BsaWNlKHJldHVybkluZGV4KTtcclxuICAgICAgICAgICAgcGFnZS5yZWRpcmVjdChyZXR1cm5Ubyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCB0byA9IHRoaXMuYXBwLmNvbnRleHQuaGlzdG9yeS5wb3AoKTtcclxuICAgICAgICAgIHBhZ2UucmVkaXJlY3QodG8ucGFnZSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhZ2UuYmFjayh0aGlzLmFwcC5ob21lVmlld0lkKTtcclxuICAgICAgfSxcclxuICAgICAgY29udGV4dDoge1xyXG4gICAgICAgIGhpc3Rvcnk6IG51bGwsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHZpZXdTaG93T3B0aW9ucyB7QXJyYXl9IEFycmF5IHdpdGggb25lIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRoYXQgZ2V0cyBwdXNoZWQgYmVmb3JlIHNob3dpbmcgYSB2aWV3LlxyXG4gICAgICogQWxsb3dzIHBhc3NpbmcgaW4gb3B0aW9ucyB2aWEgcm91dGluZy4gVmFsdWUgZ2V0cyByZW1vdmVkIG9uY2UgdGhlIHZpZXcgaXMgc2hvd24uXHJcbiAgICAgKi9cclxuICAgIHRoaXMudmlld1Nob3dPcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAgICogQ3VycmVudCBvcmllbnRhdGlvbiBvZiB0aGUgYXBwbGljYXRpb24uIENhbiBiZSBsYW5kc2NhcGUgb3IgcG9ydHJhaXQuXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY3VycmVudE9yaWVudGF0aW9uID0gJ3BvcnRyYWl0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJvb2xlYW4gZm9yIHdoZXRoZXIgdGhlIGFwcGxpY2F0aW9uIGlzIGFuIGVtYmVkZGVkIGFwcCBvciBub3RcclxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2VtYmVkZGVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcnJheSBvZiBwcm9taXNlcyB0byBsb2FkIGFwcCBzdGF0ZVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2FwcFN0YXRlUHJvbWlzZXMgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2lnbmlmaWVzIHRoZSBBcHAgaGFzIGJlZW4gaW5pdGlhbGl6ZWRcclxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLl9yb290RG9tTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLl9jb250YWluZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuY3VzdG9taXphdGlvbnMgPSBudWxsO1xyXG4gICAgdGhpcy5zZXJ2aWNlcyA9IG51bGw7IC8vIFRPRE86IFJlbW92ZVxyXG4gICAgdGhpcy5fY29ubmVjdGlvbnMgPSBudWxsO1xyXG4gICAgdGhpcy5tb2R1bGVzID0gbnVsbDtcclxuICAgIHRoaXMudmlld3MgPSBudWxsO1xyXG4gICAgdGhpcy5oYXNoID0gaGFzaDtcclxuICAgIHRoaXMub25MaW5lID0gdHJ1ZTtcclxuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogVG9vbGJhciBpbnN0YW5jZXMgYnkga2V5IG5hbWVcclxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICB0aGlzLmJhcnMgPSBudWxsO1xyXG4gICAgdGhpcy5lbmFibGVDYWNoaW5nID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBkZWZhdWx0IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2VydmljZSBpbnN0YW5jZVxyXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZGVmYXVsdFNlcnZpY2UgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGhhc2ggdG8gcmVkaXJlY3QgdG8gYWZ0ZXIgbG9naW4uXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5yZWRpcmVjdEhhc2ggPSAnJztcclxuICAgIC8qKlxyXG4gICAgICogU2lnbmlmaWVzIHRoZSBtYXhpbXVtIGZpbGUgc2l6ZSB0aGF0IGNhbiBiZSB1cGxvYWRlZCBpbiBieXRlc1xyXG4gICAgICogQHByb3BlcnR5IHtpbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMubWF4VXBsb2FkRmlsZVNpemUgPSA0MDAwMDAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGltZW91dCBmb3IgdGhlIGNvbm5lY3Rpb24gY2hlY2suXHJcbiAgICAgKi9cclxuICAgIHRoaXMuUElOR19USU1FT1VUID0gMzAwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBpbmcgZGVib3VuY2UgdGltZS5cclxuICAgICAqL1xyXG4gICAgdGhpcy5QSU5HX0RFQk9VTkNFID0gMTAwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBvZiB0aW1lcyB0byBhdHRlbXB0IHRvIHBpbmcuXHJcbiAgICAgKi9cclxuICAgIHRoaXMuUElOR19SRVRSWSA9IDU7XHJcblxyXG4gICAgLypcclxuICAgICAqIFN0YXRpYyByZXNvdXJjZSB0byByZXF1ZXN0IG9uIHRoZSBwaW5nLiBTaG91bGQgYmUgYSBzbWFsbCBmaWxlLlxyXG4gICAgICovXHJcbiAgICB0aGlzLlBJTkdfUkVTT1VSQ0UgPSAncGluZy5naWYnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBBbGwgb3B0aW9ucyBhcmUgbWl4ZWQgaW50byBBcHAgaXRzZWxmXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICB0aGlzLk1vZGVsTWFuYWdlciA9IG51bGw7XHJcbiAgICB0aGlzLmlzRHluYW1pY0luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5fYXBwU3RhdGVQcm9taXNlcyA9IFtdO1xyXG5cclxuICAgIHRoaXMuY3VzdG9taXphdGlvbnMgPSB7fTtcclxuICAgIHRoaXMuc2VydmljZXMgPSB7fTsgLy8gVE9ETzogUmVtb3ZlXHJcbiAgICB0aGlzLl9jb25uZWN0aW9ucyA9IHt9O1xyXG4gICAgdGhpcy5tb2R1bGVzID0gW107XHJcbiAgICB0aGlzLnZpZXdzID0ge307XHJcbiAgICB0aGlzLmJhcnMgPSB7fTtcclxuXHJcbiAgICB0aGlzLmNvbnRleHQgPSB7XHJcbiAgICAgIGhpc3Rvcnk6IFtdLFxyXG4gICAgfTtcclxuICAgIHRoaXMudmlld1Nob3dPcHRpb25zID0gW107XHJcblxyXG4gICAgLy8gRm9yIHJvdXRpbmcgbmVlZCB0byBrbm93IGhvbWVWaWV3SWRcclxuICAgIHRoaXMuUmVVSS5hcHAgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuTW9kZWxNYW5hZ2VyID0gTW9kZWxNYW5hZ2VyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFuY2Ugb2YgU29IbyBYaSBhcHBsaWNhdGlvbm1lbnUuXHJcbiAgICAgKi9cclxuICAgIHRoaXMuYXBwbGljYXRpb25tZW51ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc3RhbmNlIG9mIFNvSG8gWGkgbW9kYWwgZGlhbG9nIGZvciB2aWV3IHNldHRpbmdzLiBUaGlzIHdhcyBwcmV2aW91c2x5IGluXHJcbiAgICAgKiB0aGUgcmlnaHQgZHJhd2VyLlxyXG4gICAgICogQHR5cGUge01vZGFsfVxyXG4gICAgKi9cclxuICAgIHRoaXMudmlld1NldHRpbmdzTW9kYWwgPSBudWxsO1xyXG5cclxuICAgIHRoaXMucHJldmlvdXNTdGF0ZSA9IG51bGw7XHJcbiAgICAvKlxyXG4gICAgICogUmVzb3VyY2UgU3RyaW5nc1xyXG4gICAgICovXHJcbiAgICB0aGlzLnZpZXdTZXR0aW5nc1RleHQgPSByZXNvdXJjZS52aWV3U2V0dGluZ3NUZXh0O1xyXG4gICAgdGhpcy5jbG9zZVRleHQgPSByZXNvdXJjZS5jbG9zZVRleHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb29wcyB0aHJvdWdoIGFuZCBkaXNjb25uZWN0aW9ucyBjb25uZWN0aW9ucyBhbmQgdW5zdWJzY3JpYmVzIHN1YnNjcmlwdGlvbnMuXHJcbiAgICogQWxzbyBjYWxscyB7QGxpbmsgI3VuaW5pdGlhbGl6ZSB1bmluaXRpYWxpemV9LlxyXG4gICAqL1xyXG4gIGRlc3Ryb3koKSB7XHJcbiAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xyXG4gICAgJCgnYm9keScpLm9mZignYmVmb3JldHJhbnNpdGlvbicsIHRoaXMuX29uQmVmb3JlVHJhbnNpdGlvbi5iaW5kKHRoaXMpKTtcclxuICAgICQoJ2JvZHknKS5vZmYoJ2FmdGVydHJhbnNpdGlvbicsIHRoaXMuX29uQWZ0ZXJUcmFuc2l0aW9uLmJpbmQodGhpcykpO1xyXG4gICAgJCgnYm9keScpLm9mZignc2hvdycsIHRoaXMuX29uQWN0aXZhdGUuYmluZCh0aGlzKSk7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5fb25PbmxpbmUuYmluZCh0aGlzKSk7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMuX29uT2ZmbGluZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnVuaW5pdGlhbGl6ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hlbGxlZCBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBmcm9tIHtAbGluayAjZGVzdHJveSBkZXN0cm95fSwgbWF5IGJlIHVzZWQgdG8gcmVsZWFzZSBhbnkgZnVydGhlciBoYW5kbGVzLlxyXG4gICAqL1xyXG4gIHVuaW5pdGlhbGl6ZSgpIHtcclxuICB9XHJcblxyXG4gIGJhY2soKSB7XHJcbiAgICBpZiAoIXRoaXMuX2VtYmVkZGVkKSB7XHJcbiAgICAgIFJlVUkuYmFjaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgaGFzaCBhbmQgc2F2ZSB0aGUgcmVkaXJlY3QgaGFzaCBpZiBhbnlcclxuICAgKi9cclxuICBpbml0SGFzaCgpIHtcclxuICAgIGNvbnN0IGggPSBsb2NhdGlvbi5oYXNoO1xyXG4gICAgaWYgKGggIT09ICcnKSB7XHJcbiAgICAgIHRoaXMucmVkaXJlY3RIYXNoID0gaDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuX2VtYmVkZGVkKSB7XHJcbiAgICAgIGxvY2F0aW9uLmhhc2ggPSAnJztcclxuICAgIH1cclxuXHJcbiAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3IgZ2xvYmFsIHVzZXMgb2YgUmVVSVxyXG4gICAgd2luZG93LlJlVUkgPSB0aGlzLlJlVUk7XHJcbiAgICB3aW5kb3cuUmVVSS5jb250ZXh0Lmhpc3RvcnkgPSB0aGlzLmNvbnRleHQuaGlzdG9yeTtcclxuICB9XHJcblxyXG4gIF9vbk9mZmxpbmUoKSB7XHJcbiAgICB0aGlzLnBpbmcoKTtcclxuICB9XHJcblxyXG4gIF9vbk9ubGluZSgpIHtcclxuICAgIHRoaXMucGluZygpO1xyXG4gIH1cclxuXHJcbiAgX3VwZGF0ZUNvbm5lY3Rpb25TdGF0ZShvbmxpbmUpIHtcclxuICAgIC8vIERvbid0IGZpcmUgdGhlIG9uQ29ubmVjdGlvbkNoYW5nZSBpZiB3ZSBhcmUgaW4gdGhlIHNhbWUgc3RhdGUuXHJcbiAgICBpZiAodGhpcy5vbkxpbmUgPT09IG9ubGluZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkxpbmUgPSBvbmxpbmU7XHJcbiAgICB0aGlzLm9uQ29ubmVjdGlvbkNoYW5nZShvbmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgZm9yY2VPbmxpbmUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHNldENvbm5lY3Rpb25TdGF0ZSh0cnVlKSk7XHJcbiAgfVxyXG5cclxuICBmb3JjZU9mZmxpbmUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHNldENvbm5lY3Rpb25TdGF0ZShmYWxzZSkpO1xyXG4gIH1cclxuXHJcbiAgb25Db25uZWN0aW9uQ2hhbmdlKC8qIG9ubGluZSovKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBFc3RhYmxpc2hlcyB2YXJpb3VzIGNvbm5lY3Rpb25zIHRvIGV2ZW50cy5cclxuICAgKi9cclxuICBpbml0Q29ubmVjdHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUuYmluZCh0aGlzKSk7XHJcbiAgICAkKCdib2R5Jykub24oJ2JlZm9yZXRyYW5zaXRpb24nLCB0aGlzLl9vbkJlZm9yZVRyYW5zaXRpb24uYmluZCh0aGlzKSk7XHJcbiAgICAkKCdib2R5Jykub24oJ2FmdGVydHJhbnNpdGlvbicsIHRoaXMuX29uQWZ0ZXJUcmFuc2l0aW9uLmJpbmQodGhpcykpO1xyXG4gICAgJCgnYm9keScpLm9uKCdzaG93JywgdGhpcy5fb25BY3RpdmF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuX29uT25saW5lLmJpbmQodGhpcykpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMuX29uT2ZmbGluZS5iaW5kKHRoaXMpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucGluZygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHByb21pc2UuIFRoZSByZXN1bHRzIGFyZSB0cnVlIG9mIHRoZSByZXNvdXJjZSBjYW1lIGJhY2tcclxuICAgKiBiZWZvcmUgdGhlIFBJTkdfVElNRU9VVC4gVGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgaWYgdGhlcmUgaXMgdGltZW91dCBvclxyXG4gICAqIHRoZSByZXNwb25zZSBpcyBub3QgYSAyMDAgb3IgMzA0LlxyXG4gICAqL1xyXG4gIF9waW5nKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIub250aW1lb3V0ID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgIHhoci5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgRE9ORSA9IDQ7XHJcbiAgICAgICAgY29uc3QgSFRUUF9PSyA9IDIwMDtcclxuICAgICAgICBjb25zdCBIVFRQX05PVF9NT0RJRklFRCA9IDMwNDtcclxuXHJcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBET05FKSB7XHJcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gSFRUUF9PSyB8fCB4aHIuc3RhdHVzID09PSBIVFRQX05PVF9NT0RJRklFRCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICB4aHIub3BlbignR0VUJywgYCR7dGhpcy5QSU5HX1JFU09VUkNFfT9jYWNoZT0ke01hdGgucmFuZG9tKCl9YCk7XHJcbiAgICAgIHhoci50aW1lb3V0ID0gdGhpcy5QSU5HX1RJTUVPVVQ7XHJcbiAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVzIHRoZSBjaGFpbiBvZiBwcm9taXNlcyByZWdpc3RlcmVkIHdpdGggcmVnaXN0ZXJBcHBTdGF0ZVByb21pc2UuXHJcbiAgICogV2hlbiBhbGwgcHJvbWlzZXMgYXJlIGRvbmUsIGEgbmV3IHByb21pc2UgaXMgcmV0dXJuZWQgdG8gdGhlIGNhbGxlciwgYW5kIGFsbFxyXG4gICAqIHJlZ2lzdGVyZWQgcHJvbWlzZXMgYXJlIGZsdXNoZWQuXHJcbiAgICogRWFjaCBhcHAgc3RhdGUgY2FuIGJlIHByb2Nlc3NlZCBhbGwgYXQgb25jZSBvciBpbiBhIHNwZWNmaWMgc2VxZW5jZS5cclxuICAgKiBFeGFtcGxlOlxyXG4gICAqIFdlIGNhbiByZWdpc3RlciAgQXBwIHN0YXRlIHNlcWV1bmNlcyBhcyB0aGUgZm9sbG93aW5nLCB3aGVyZSBlYWNoIHNlcXVlbmNlXHJcbiAgICogaXMgcHJvY2Nlc3NlZCBpbiBhIGRlc2VuZGluZyBvcmRlciBmb3JtIDAgdG8gbi4gVGhlIGZpcnN0IHR3byBpbiB0aGlzIGV4YW1wbGUgYXJlIGRlZmV1bHRlZCB0byBhXHJcbiAgICogc2VxdWVuY2Ugb2YgemVybyAoMCkgYW5kIGFyZSBwcm9jY2VkIGZpcnN0IGluIHdoaWNoIGFmdGVyIHRoZSBuZXh0IHNlcXVlbmNlICgxKSBpcyBwcm9jY2Vzc2VkXHJcbiAgICogYW5kIG9uY2UgYWxsIG9mIGl0cyBpdGVtcyBhcmUgZmluc2hlZCB0aGVuIHRoZSBsYXN0IHNlcXVlbmNlIDIgd2lsbCBzdGFydCBhbmQgcHJvY2VzcyBhbGwgb2YgaXRzIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogSWYgdHdvIHNlcWVuY2VzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIHRoZW4gdGhheSB3aWxsIGdldCBjb21iaW5kZWQgYXMgaWYgdGhleSB3aGVyZSByZWdpc3RlcmQgdG9nZXRoZXIuXHJcbiAgICogQXNvIG5vdCBhbGwgaXRlbXMgd2hpdGggaW4gYSBwcm9jZXNzIGFyZSBwcm9jZXNzZWQgYW5kIGFuc3luYyBvZiBlYWNoIG90aGVyIGFuZCBtYXkgbm90IGZpbmlzaCBhdCB0aGUgc2FtZSB0aW1lLlxyXG4gICAqXHJcbiAgICogVG8gbWFrZSB0d28gaXRlbXMgcHJvY2VzcyBvbmUgYWZ0ZXIgdGhlIG90aGVyIHNpbXBsZXkgcHV0IHRoZW0gaW4gdG8gZGlmZnJlbnQgc2VxdWVuY2VzLlxyXG4gICAqXHJcbiAgICogICB0aGlzLnJlZ2lzdGVyQXBwU3RhdGVQcm9taXNlKCgpID0+IHtzb21lIGZ1bmN0aW9ucyB0aGF0IHJldHVybnMgYSBwcm9taXNlfSk7XHJcbiAgICogICB0aGlzLnJlZ2lzdGVyQXBwU3RhdGVQcm9taXNlKCgpID0+IHtzb21lIGZ1bmN0aW9ucyB0aGF0IHJldHVybnMgYSBwcm9taXNlfSk7XHJcbiAgICpcclxuICAgKiAgIHRoaXMucmVnaXN0ZXJBcHBTdGF0ZVByb21pc2Uoe1xyXG4gICAqICAgICBzZXE6IDEsXHJcbiAgICogICAgIGRlc2NyaXB0aW9uOiAnU2VxdWVuY2UgMScsXHJcbiAgICogICAgIGl0ZW1zOiBbe1xyXG4gICAqICAgICAgIG5hbWU6ICdpdGVtQScsXHJcbiAgICogICAgICAgZGVzY3JpcHRpb246ICdpdGVtIEEnLFxyXG4gICAqICAgICAgIGZuOiAoKSA9PiB7IHNvbWUgZnVuY3Rpb25zIHRoYXQgcmV0dXJucyBhIHByb21pc2UgfSxcclxuICAgKiAgICAgICB9LCB7XHJcbiAgICogICAgICAgICBuYW1lOiAnaXRlbWInLFxyXG4gICAqICAgICAgICAgZGVzY3JpcHRpb246ICdJdGVtIEInLFxyXG4gICAqICAgICAgICAgZm46ICgpID0+IHtzb21lIGZ1bmN0aW9ucyB0aGF0IHJldHVybnMgYSBwcm9taXNlfSxcclxuICAgKiAgICAgICB9XSxcclxuICAgKiAgIH0pO1xyXG4gICAqXHJcbiAgICogICB0aGlzLnJlZ2lzdGVyQXBwU3RhdGVQcm9taXNlKHtcclxuICAgKiAgICAgc2VxOiAyLFxyXG4gICAqICAgICBkZXNjcmlwdGlvbjogJ1NlcXVlbmNlIDInLFxyXG4gICAqICAgICBpdGVtczogW3tcclxuICAgKiAgICAgICBuYW1lOiAnaXRlbSBDJyxcclxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogJ2l0ZW0gQycsXHJcbiAgICogICAgICAgZm46ICgpID0+IHsgc29tZSBmdW5jdGlvbnMgdGhhdCByZXR1cm5zIGEgcHJvbWlzZSB9LFxyXG4gICAqICAgICAgIH0sXHJcbiAgICogICAgfSk7XHJcbiAgICpcclxuICAgKiBUaGVyZSBhcmUgdGhlcmUgQXBwIHN0YXRlIHNlcWVuY2VzIHJlXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxyXG4gICAqL1xyXG4gIGluaXRBcHBTdGF0ZSgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlcXVlbmNlcyA9IFtdO1xyXG4gICAgICB0aGlzLl9hcHBTdGF0ZVByb21pc2VzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICBsZXQgc2VxO1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgc2VxID0gc2VxdWVuY2VzLmZpbmQoeCA9PiB4LnNlcSA9PT0gMCk7XHJcbiAgICAgICAgICBpZiAoIXNlcSkge1xyXG4gICAgICAgICAgICBzZXEgPSB7XHJcbiAgICAgICAgICAgICAgc2VxOiAwLFxyXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNvdXJjZS5sb2FkaW5nQXBwbGljYXRpb25TdGF0ZVRleHQsXHJcbiAgICAgICAgICAgICAgaXRlbXM6IFtdLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZXF1ZW5jZXMucHVzaChzZXEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2VxLml0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lOiAnZGVmYXVsdCcsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcclxuICAgICAgICAgICAgZm46IGl0ZW0sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGl0ZW0uc2VxICYmIGl0ZW0uaXRlbXMpIHtcclxuICAgICAgICAgICAgc2VxID0gc2VxdWVuY2VzLmZpbmQoeCA9PiB4LnNlcSA9PT0gKChpdGVtLnNlcSkgPyBpdGVtLnNlcSA6IDApKTtcclxuICAgICAgICAgICAgaWYgKHNlcSkge1xyXG4gICAgICAgICAgICAgIGl0ZW0uaXRlbXMuZm9yRWFjaCgoX2l0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wdXNoKF9pdGVtKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzZXF1ZW5jZXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8vIFNvcnQgdGhlIHNlcXVlbmNlIGFzY2VuZGluZyBzbyB3ZSBjYW4gcHJvY2Vzc2VzIHRoZW0gaW4gdGhlIHJpZ2h0IG9yZGVyLlxyXG4gICAgICBzZXF1ZW5jZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGlmIChhLnNlcSA+IGIuc2VxKSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhLnNlcSA8IGIuc2VxKSB7XHJcbiAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLl9pbml0QXBwU3RhdGVTZXF1ZW5jZSgwLCBzZXF1ZW5jZXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdGhpcy5jbGVhckFwcFN0YXRlUHJvbWlzZXMoKTtcclxuICAgICAgICAgIHRoaXMuaW5pdE1vZHVsZXNEeW5hbWljKCk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICB0aGlzLmNsZWFyQXBwU3RhdGVQcm9taXNlcygpO1xyXG4gICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHJvY2VzcyBhIGFwcCBzdGF0ZSBzZXF1ZW5jZSBhbmQgc3RhcnQgdGhlIG5leHQgc2VxdW5jZSB3aGVuIGRvbmUuXHJcbiAgICogQHBhcmFtIHtpbmRleCkgdGhlIGluZGV4IG9mIHRoZSBzZXF1ZW5jZSB0byBzdGFydFxyXG4gICAqIEBwYXJhbSB7c2VxdWVuY2VzKSBhbiBhcnJheSBvZiBzZXF1ZW5jZXNcclxuICAgKi9cclxuICBfaW5pdEFwcFN0YXRlU2VxdWVuY2UoaW5kZXgsIHNlcXVlbmNlcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3Qgc2VxID0gc2VxdWVuY2VzW2luZGV4XTtcclxuICAgICAgaWYgKHNlcSkgeyAvLyBXZSBuZWVkIHRvIHNlbmQgYW4gb2JzZXJ2YWJsZSBhbmQgZ2V0IHJpZGUgb2YgdGhlIHVpIGVsZW1lbnQuXHJcbiAgICAgICAgY29uc3QgaW5kaWNhdG9yID0gbmV3IEJ1c3lJbmRpY2F0b3Ioe1xyXG4gICAgICAgICAgaWQ6IGBidXN5SW5kaWNhdG9yX19hcHBTdGF0ZV8ke3NlcS5zZXF9YCxcclxuICAgICAgICAgIGxhYmVsOiBgJHtyZXNvdXJjZS5pbml0aWFsaXppbmdUZXh0fSAke3NlcS5kZXNjcmlwdGlvbn1gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubW9kYWwuZGlzYWJsZUNsb3NlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm1vZGFsLnNob3dUb29sYmFyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5hZGQoaW5kaWNhdG9yKTtcclxuICAgICAgICBpbmRpY2F0b3Iuc3RhcnQoKTtcclxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHNlcS5pdGVtcy5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBpdGVtLmZuKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgIHRoaXMubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgIHRoaXMuX2luaXRBcHBTdGF0ZVNlcXVlbmNlKGluZGV4ICsgMSwgc2VxdWVuY2VzKS50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIGluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbC5kaXNhYmxlQ2xvc2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgRXJyb3JNYW5hZ2VyLmFkZFNpbXBsZUVycm9yKGluZGljYXRvci5sYWJlbCwgZXJyKTtcclxuICAgICAgICAgIGluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICAgIHRoaXMubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWdpc3RlcnMgYSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdoZW4gaW5pdEFwcFN0YXRlIGlzIGludm9rZWQuXHJcbiAgICogQHBhcmFtIHtQcm9taXNlfEZ1bmN0aW9ufSBwcm9taXNlIEEgcHJvbWlzZSBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2VcclxuICAgKi9cclxuICByZWdpc3RlckFwcFN0YXRlUHJvbWlzZShwcm9taXNlKSB7XHJcbiAgICB0aGlzLl9hcHBTdGF0ZVByb21pc2VzLnB1c2gocHJvbWlzZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGNsZWFyQXBwU3RhdGVQcm9taXNlcygpIHtcclxuICAgIHRoaXMuX2FwcFN0YXRlUHJvbWlzZXMgPSBbXTtcclxuICB9XHJcblxyXG4gIG9uU2V0T3JpZW50YXRpb24oLyogdmFsdWUqLykge31cclxuXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgdGhyb3VnaCBjb25uZWN0aW9ucyBhbmQgY2FsbHMge0BsaW5rICNyZWdpc3RlclNlcnZpY2UgcmVnaXN0ZXJTZXJ2aWNlfSBvbiBlYWNoLlxyXG4gICAqL1xyXG4gIGluaXRTZXJ2aWNlcygpIHtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNlcnZpY2UobmFtZSwgdGhpcy5jb25uZWN0aW9uc1tuYW1lXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIExvb3BzIHRocm91Z2ggbW9kdWxlcyBhbmQgY2FsbHMgdGhlaXIgYGluaXQoKWAgZnVuY3Rpb24uXHJcbiAgICovXHJcbiAgaW5pdE1vZHVsZXMoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLm1vZHVsZXNbaV0uaW5pdCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIExvb3BzIHRocm91Z2ggbW9kdWxlcyBhbmQgY2FsbHMgdGhlaXIgYGluaXREeW5hbWljKClgIGZ1bmN0aW9uLlxyXG4gICAqL1xyXG4gIGluaXRNb2R1bGVzRHluYW1pYygpIHtcclxuICAgIGlmICh0aGlzLmlzRHluYW1pY0luaXRpYWxpemVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMubW9kdWxlc1tpXS5pbml0RHluYW1pYyh0aGlzKTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNEeW5hbWljSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgdGhyb3VnaCAodG9vbCliYXJzIGFuZCBjYWxscyB0aGVpciBgaW5pdCgpYCBmdW5jdGlvbi5cclxuICAgKi9cclxuICBpbml0VG9vbGJhcnMoKSB7XHJcbiAgICBmb3IgKGNvbnN0IG4gaW4gdGhpcy5iYXJzKSB7XHJcbiAgICAgIGlmICh0aGlzLmJhcnMuaGFzT3duUHJvcGVydHkobikpIHtcclxuICAgICAgICB0aGlzLmJhcnNbbl0uaW5pdCgpOyAvLyB0b2RvOiBjaGFuZ2UgdG8gc3RhcnR1cFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBnbG9iYWwgdmFyaWFibGUgYEFwcGAgdG8gdGhpcyBpbnN0YW5jZS5cclxuICAgKi9cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIHdpbmRvdy5BcHAgPSB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZXMgdGhpcyBhcHBsaWNhdGlvbiBhcyB3ZWxsIGFzIHRoZSB0b29sYmFyIGFuZCBhbGwgY3VycmVudGx5IHJlZ2lzdGVyZWQgdmlld3MuXHJcbiAgICovXHJcbiAgaW5pdChkb21Ob2RlKSB7XHJcbiAgICB0aGlzLmluaXRJY29ucygpO1xyXG4gICAgdGhpcy5pbml0U3RvcmUoKTtcclxuICAgIHRoaXMuaW5pdEFwcERPTShkb21Ob2RlKTtcclxuICAgIHRoaXMuaW5pdFByZWZlcmVuY2VzKCk7XHJcbiAgICB0aGlzLmluaXRTb2hvKCk7XHJcbiAgICB0aGlzLmluaXRUb2FzdHMoKTtcclxuICAgIHRoaXMuaW5pdFBpbmcoKTtcclxuICAgIHRoaXMuaW5pdFNlcnZpY2VzKCk7IC8vIFRPRE86IFJlbW92ZVxyXG4gICAgdGhpcy5pbml0Q29ubmVjdHMoKTtcclxuICAgIHRoaXMuX3N0YXJ0dXBDb25uZWN0aW9ucygpO1xyXG4gICAgdGhpcy5pbml0TW9kdWxlcygpO1xyXG4gICAgdGhpcy5pbml0VG9vbGJhcnMoKTtcclxuICAgIHRoaXMuaW5pdEhhc2goKTtcclxuICAgIHRoaXMuaW5pdE1vZGFsKCk7XHJcbiAgICB0aGlzLmluaXRTY2VuZSgpO1xyXG4gICAgdGhpcy51cGRhdGVTb2hvKCk7XHJcbiAgfVxyXG5cclxuICBpbml0SWNvbnMoKSB7XHJcbiAgICByZW5kZXIoKTtcclxuICB9XHJcblxyXG4gIGluaXRTb2hvKCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5nZXRBcHBDb250YWluZXJOb2RlKCk7XHJcbiAgICBjb25zdCBtZW51ID0gJCgnLmFwcGxpY2F0aW9uLW1lbnUnLCBjb250YWluZXIpLmZpcnN0KCk7XHJcbiAgICBjb25zdCBjbG9zZU1lbnVIZWFkZXIgPSAkKCcuYXBwbGljYXRpb24tbWVudS1oZWFkZXInKS5maXJzdCgpO1xyXG5cclxuICAgIG1lbnUuYXBwbGljYXRpb25tZW51KCk7XHJcbiAgICB0aGlzLmFwcGxpY2F0aW9ubWVudSA9IG1lbnUuZGF0YSgnYXBwbGljYXRpb25tZW51Jyk7XHJcbiAgICBtZW51Lm9uKCdhcHBsaWNhdGlvbm1lbnVvcGVuJywgKCkgPT4ge1xyXG4gICAgICBjb25uZWN0LnB1Ymxpc2goJy9hcHAvbWVudW9wZW4nLCBbdHJ1ZV0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbWVudS5vbignYXBwbGljYXRpb25tZW51Y2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9tZW51Y2xvc2UnLCBbdHJ1ZV0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY2xvc2VNZW51SGVhZGVyLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5oaWRlQXBwbGljYXRpb25NZW51KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB2aWV3U2V0dGluZ3NNb2RhbCA9ICQoJy5tb2RhbC52aWV3LXNldHRpbmdzJywgY29udGFpbmVyKS5maXJzdCgpO1xyXG4gICAgdmlld1NldHRpbmdzTW9kYWwubW9kYWwoKTtcclxuICAgIHRoaXMudmlld1NldHRpbmdzTW9kYWwgPSB2aWV3U2V0dGluZ3NNb2RhbC5kYXRhKCdtb2RhbCcpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWxsb3cgdXMgdG8gdXBkYXRlIGFueSBzb2hvIGNvbXBvbmVudHMgYWZ0ZXIgYWxsIHRoZSBkb20gaXMgaW4gcGxhY2UuXHJcbiAgICovXHJcbiAgdXBkYXRlU29obygpIHtcclxuICAgIHRoaXMuYXBwbGljYXRpb25tZW51LnVwZGF0ZWQoKTtcclxuICB9XHJcblxyXG4gIGluaXRTY2VuZSgpIHtcclxuICAgIHRoaXMuc2NlbmUgPSBuZXcgU2NlbmUodGhpcy5zdG9yZSk7XHJcbiAgfVxyXG5cclxuICBpbml0U3RvcmUoKSB7XHJcbiAgICB0aGlzLnN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUodGhpcy5nZXRSZWR1Y2VyKCksXHJcbiAgICAgIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCksXHJcbiAgICAgIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fICYmIHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKCkpO1xyXG4gICAgdGhpcy5zdG9yZS5zdWJzY3JpYmUodGhpcy5fb25TdGF0ZUNoYW5nZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIF9vblN0YXRlQ2hhbmdlKCkge1xyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0b3JlLmdldFN0YXRlKCk7XHJcblxyXG4gICAgaWYgKHRoaXMucHJldmlvdXNTdGF0ZSA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnByZXZpb3VzU3RhdGUgPSBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uU3RhdGVDaGFuZ2Uoc3RhdGUpO1xyXG5cclxuICAgIGNvbnN0IHNka1N0YXRlID0gc3RhdGUgJiYgc3RhdGUuc2RrO1xyXG4gICAgY29uc3QgcHJldmlvdXNTZGtTdGF0ZSA9IHRoaXMucHJldmlvdXNTdGF0ZSAmJiB0aGlzLnByZXZpb3VzU3RhdGUuc2RrO1xyXG5cclxuICAgIGlmIChzZGtTdGF0ZSAmJiBwcmV2aW91c1Nka1N0YXRlICYmIHNka1N0YXRlLm9ubGluZSAhPT0gcHJldmlvdXNTZGtTdGF0ZS5vbmxpbmUpIHtcclxuICAgICAgdGhpcy5fdXBkYXRlQ29ubmVjdGlvblN0YXRlKHNka1N0YXRlLm9ubGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcmV2aW91c1N0YXRlID0gc3RhdGU7XHJcbiAgfVxyXG5cclxuICBvblN0YXRlQ2hhbmdlKHN0YXRlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9XHJcblxyXG4gIHNob3dBcHBsaWNhdGlvbk1lbnVPbkxhcmdlKCkge1xyXG4gICAgLy8gdG9kbzogb3Blbk9uTGFyZ2UgY2F1c2VzIHRoaXMgYnVnIFNPSE8tNjE5M1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbm1lbnUuc2V0dGluZ3Mub3Blbk9uTGFyZ2UgPSB0cnVlO1xyXG5cclxuICAgIGlmICh0aGlzLmFwcGxpY2F0aW9ubWVudS5pc0xhcmdlclRoYW5CcmVha3BvaW50KCkpIHtcclxuICAgICAgdGhpcy5hcHBsaWNhdGlvbm1lbnUub3Blbk1lbnUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGVBcHBsaWNhdGlvbk1lbnUoKSB7XHJcbiAgICB0aGlzLmFwcGxpY2F0aW9ubWVudS5jbG9zZU1lbnUodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBzaG93QXBwbGljYXRpb25NZW51KCkge1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbm1lbnUub3Blbk1lbnUoKTtcclxuICB9XHJcblxyXG4gIGdldFJlZHVjZXIoKSB7XHJcbiAgICByZXR1cm4gc2RrO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH1cclxuXHJcbiAgaW5pdFRvYXN0cygpIHtcclxuICAgIHRoaXMudG9hc3QgPSBuZXcgVG9hc3Qoe1xyXG4gICAgICBjb250YWluZXJOb2RlOiB0aGlzLmdldENvbnRhaW5lck5vZGUoKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdFBpbmcoKSB7XHJcbiAgICAvLyBMaXRlIGJ1aWxkLCB3aGljaCB3aWxsIG5vdCBoYXZlIFJ4LCBkaXNhYmxlIG9mZmxpbmUgYW5kIHBpbmdcclxuICAgIGlmICghUngpIHtcclxuICAgICAgdGhpcy5waW5nID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goc2V0Q29ubmVjdGlvblN0YXRlKHRydWUpKTtcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5lbmFibGVPZmZsaW5lU3VwcG9ydCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMucGluZyB3aWxsIGJlIHNldCBpZiBwaW5nIHdhcyBwYXNzZWQgYXMgYW4gb3B0aW9ucyB0byB0aGUgY3RvclxyXG4gICAgaWYgKHRoaXMucGluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5waW5nID0gdXRpbC5kZWJvdW5jZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMudG9hc3QuYWRkKHtcclxuICAgICAgICBtZXNzYWdlOiByZXNvdXJjZS5jaGVja2luZ1RleHQsXHJcbiAgICAgICAgdGl0bGU6IHJlc291cmNlLmNvbm5lY3Rpb25Ub2FzdFRpdGxlVGV4dCxcclxuICAgICAgICB0b2FzdFRpbWU6IHRoaXMuUElOR19USU1FT1VULFxyXG4gICAgICB9KTtcclxuICAgICAgY29uc3QgcGluZyQgPSBSeC5PYnNlcnZhYmxlLmludGVydmFsKHRoaXMuUElOR19USU1FT1VUKVxyXG4gICAgICAgIC5mbGF0TWFwKCgpID0+IHtcclxuICAgICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21Qcm9taXNlKHRoaXMuX3BpbmcoKSlcclxuICAgICAgICAgICAgLmZsYXRNYXAoKG9ubGluZSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChvbmxpbmUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLm9mKG9ubGluZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS50aHJvdyhuZXcgRXJyb3IoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnJldHJ5KHRoaXMuUElOR19SRVRSWSlcclxuICAgICAgICAudGFrZSgxKTtcclxuXHJcbiAgICAgIHBpbmckLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChzZXRDb25uZWN0aW9uU3RhdGUodHJ1ZSkpO1xyXG4gICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChzZXRDb25uZWN0aW9uU3RhdGUoZmFsc2UpKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCB0aGlzLlBJTkdfREVCT1VOQ0UpO1xyXG4gIH1cclxuXHJcbiAgaW5pdFByZWZlcmVuY2VzKCkge1xyXG4gICAgdGhpcy5fbG9hZFByZWZlcmVuY2VzKCk7XHJcbiAgfVxyXG5cclxuICBpbml0TW9kYWwoKSB7XHJcbiAgICB0aGlzLm1vZGFsID0gbmV3IE1vZGFsKCk7XHJcbiAgICB0aGlzLm1vZGFsLnBsYWNlKHRoaXMuX2FwcENvbnRhaW5lck5vZGUpXHJcbiAgICAgIC5oaWRlKCk7XHJcbiAgfVxyXG5cclxuICBpczI0SG91ckNsb2NrKCkge1xyXG4gICAgcmV0dXJuIChKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlMjRIb3VyQ2xvY2snKSB8fCBNb2JpbGUuQ3VsdHVyZUluZm8uZGVmYXVsdDI0SG91ckNsb2NrLnRvU3RyaW5nKCkpID09PSB0cnVlKTtcclxuICB9XHJcblxyXG4gIGlzMTJIb3VyQ2xvY2soKSB7XHJcbiAgICByZXR1cm4gIXRoaXMuaXMyNEhvdXJDbG9jaygpO1xyXG4gIH1cclxuXHJcbiAgaXNDdXJyZW50UmVnaW9uTWV0cmljKCkge1xyXG4gICAgcmV0dXJuIE1vYmlsZS5DdWx0dXJlSW5mby5pc1JlZ2lvbk1ldHJpYyB8fCB0aGlzLmlzUmVnaW9uTWV0cmljO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdG91Y2ggZXZlbnRzLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGN1cnJlbnQgYnJvd3NlciBzdXBwb3J0cyB0b3VjaCBldmVudHMsIGZhbHNlIG90aGVyd2lzZS5cclxuICAgKi9cclxuICBzdXBwb3J0c1RvdWNoKCkge1xyXG4gICAgLy8gVGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci8gKE1JVCBMaWNlbnNlZClcclxuICAgIHJldHVybiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCAod2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRUb3VjaCk7XHJcbiAgfVxyXG5cclxuICBzdXBwb3J0c0ZpbGVBUEkoKSB7XHJcbiAgICBpZiAodGhpcy5pc0lFKCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaXNJRSgpIHtcclxuICAgIHJldHVybiAvTVNJRXxUcmlkZW50Ly50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuICB9XHJcblxyXG4gIHBlcnNpc3RQcmVmZXJlbmNlcygpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmVmZXJlbmNlcycsIEpTT04uc3RyaW5naWZ5KHRoaXMucHJlZmVyZW5jZXMpKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfbG9hZFByZWZlcmVuY2VzKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgICB0aGlzLnByZWZlcmVuY2VzID0gSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZWZlcmVuY2VzJykpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVzdGFibGlzaGVzIHZhcmlvdXMgY29ubmVjdGlvbnMgdG8gZXZlbnRzLlxyXG4gICAqL1xyXG4gIF9zdGFydHVwQ29ubmVjdGlvbnMoKSB7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyQ29ubmVjdGlvbihuYW1lLCB0aGlzLmNvbm5lY3Rpb25zW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiB0b2RvOiBzaG91bGQgd2UgYmUgbWl4aW5nIHRoaXMgaW4/ICovXHJcbiAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9ucztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgYF9zdGFydGVkYCB0byB0cnVlLlxyXG4gICAqL1xyXG4gIHJ1bigpIHtcclxuICAgIHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5yZWdpc3Rlck9yaWVudGF0aW9uQ2hlY2sodGhpcy51cGRhdGVPcmllbnRhdGlvbkRvbS5iaW5kKHRoaXMpKTtcclxuICAgIHBhZ2Uoe1xyXG4gICAgICBkaXNwYXRjaDogZmFsc2UsXHJcbiAgICAgIGhhc2hiYW5nOiB0cnVlLFxyXG4gICAgICB1c2luZ1VybDogIXRoaXMuX2VtYmVkZGVkLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBgd2luZG93Lm5hdmlnYXRvci5vbkxpbmVgIHByb3BlcnR5IGZvciBkZXRlY3RpbmcgaWYgYW4gaW50ZXJuZXQgY29ubmVjdGlvbiBpcyBhdmFpbGFibGUuXHJcbiAgICovXHJcbiAgaXNPbmxpbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vbkxpbmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRydWUvZmFsc2UgaWYgdGhlIGN1cnJlbnQgdmlldyBpcyB0aGUgZmlyc3QvaW5pdGlhbCB2aWV3LlxyXG4gICAqIFRoaXMgaXMgdXNlZnVsIGZvciBkaXNhYmxpbmcgdGhlIGJhY2sgYnV0dG9uIChzbyB5b3UgZG9uJ3QgaGl0IHRoZSBsb2dpbiBwYWdlKS5cclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBpc09uRmlyc3RWaWV3KCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogT3B0aW9uYWwgY3JlYXRlcywgdGhlbiByZWdpc3RlcnMgYW4gU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTZXJ2aWNlIGFuZCBhZGRzIHRoZSByZXN1bHQgdG8gYEFwcC5zZXJ2aWNlc2AuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBzZXJ2aWNlLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXJ2aWNlIE1heSBiZSBhIFNEYXRhU2VydmljZSBpbnN0YW5jZSBvciBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzIHRvIGNyZWF0ZSBhIG5ldyBTRGF0YVNlcnZpY2UgaW5zdGFuY2UuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3MgZm9yIHRoZSByZWdpc3RlcmVkIHNlcnZpY2UuXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJTZXJ2aWNlKG5hbWUsIHNlcnZpY2UsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBzZXJ2aWNlIGluc3RhbmNlb2YgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTZXJ2aWNlID8gc2VydmljZSA6IG5ldyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNlcnZpY2Uoc2VydmljZSk7XHJcblxyXG4gICAgdGhpcy5zZXJ2aWNlc1tuYW1lXSA9IGluc3RhbmNlO1xyXG5cclxuICAgIGluc3RhbmNlLm9uKCdyZXF1ZXN0dGltZW91dCcsIHRoaXMub25SZXF1ZXN0VGltZW91dCwgdGhpcyk7XHJcblxyXG4gICAgaWYgKChvcHRpb25zLmlzRGVmYXVsdCB8fCBzZXJ2aWNlLmlzRGVmYXVsdCkgfHwgIXRoaXMuZGVmYXVsdFNlcnZpY2UpIHtcclxuICAgICAgdGhpcy5kZWZhdWx0U2VydmljZSA9IGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT3B0aW9uYWwgY3JlYXRlcywgdGhlbiByZWdpc3RlcnMgYW4gU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTZXJ2aWNlIGFuZCBhZGRzIHRoZSByZXN1bHQgdG8gYEFwcC5zZXJ2aWNlc2AuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBzZXJ2aWNlLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9uIE1heSBiZSBhIFNEYXRhU2VydmljZSBpbnN0YW5jZSBvciBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzIHRvIGNyZWF0ZSBhIG5ldyBTRGF0YVNlcnZpY2UgaW5zdGFuY2UuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3MgZm9yIHRoZSByZWdpc3RlcmVkIHNlcnZpY2UuXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJDb25uZWN0aW9uKG5hbWUsIGRlZmluaXRpb24sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBkZWZpbml0aW9uIGluc3RhbmNlb2YgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTZXJ2aWNlID8gZGVmaW5pdGlvbiA6IG5ldyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNlcnZpY2UoZGVmaW5pdGlvbik7XHJcblxyXG4gICAgdGhpcy5fY29ubmVjdGlvbnNbbmFtZV0gPSBpbnN0YW5jZTtcclxuXHJcbiAgICBpbnN0YW5jZS5vbigncmVxdWVzdHRpbWVvdXQnLCB0aGlzLm9uUmVxdWVzdFRpbWVvdXQsIHRoaXMpO1xyXG5cclxuICAgIGlmICgob3B0aW9ucy5pc0RlZmF1bHQgfHwgZGVmaW5pdGlvbi5pc0RlZmF1bHQpIHx8ICF0aGlzLl9jb25uZWN0aW9ucy5kZWZhdWx0KSB7XHJcbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb25zLmRlZmF1bHQgPSBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIG9uUmVxdWVzdFRpbWVvdXQoKSB7XHJcbiAgICB0aGlzLnBpbmcoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgdGhlIHRoZSBzcGVjaWZpZWQgc2VydmljZSBuYW1lIGlzIGZvdW5kIGluIHRoZSBBcHBzIHNlcnZpY2Ugb2JqZWN0LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIFNEYXRhU2VydmljZSB0byBkZXRlY3RcclxuICAgKi9cclxuICBoYXNTZXJ2aWNlKG5hbWUpIHtcclxuICAgIHJldHVybiAhIXRoaXMuc2VydmljZXNbbmFtZV07XHJcbiAgfVxyXG5cclxuICBpbml0QXBwRE9NKGRvbU5vZGUpIHtcclxuICAgIGlmICh0aGlzLl92aWV3Q29udGFpbmVyTm9kZSAmJiB0aGlzLl9hcHBDb250YWluZXJOb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBhIGRvbU5vZGUgaXMgcHJvdmlkZWQsIGNyZWF0ZSB0aGUgYXBwJ3MgZG9tIHVuZGVyIHRoaXNcclxuICAgIGlmIChkb21Ob2RlKSB7XHJcbiAgICAgIHRoaXMuX2FwcENvbnRhaW5lck5vZGUgPSBkb21Ob2RlO1xyXG4gICAgICB0aGlzLl9jcmVhdGVWaWV3Q29udGFpbmVyTm9kZSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTm90aGluZyB3YXMgcHJvdmlkZWQsIGNyZWF0ZSBhIGRlZmF1bHRcclxuICAgIHRoaXMuX2NyZWF0ZUFwcENvbnRhaW5lck5vZGUoKTtcclxuICAgIHRoaXMuX2NyZWF0ZVZpZXdDb250YWluZXJOb2RlKCk7XHJcbiAgfVxyXG5cclxuICBfY3JlYXRlQXBwQ29udGFpbmVyTm9kZSgpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRBcHBDb250YWluZXJJZCA9ICdyb290Tm9kZSc7XHJcbiAgICAkKCdib2R5JykuYXBwZW5kKGBcclxuICAgICAgPGRpdiBpZD1cIiR7ZGVmYXVsdEFwcENvbnRhaW5lcklkfVwiPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIGApO1xyXG4gICAgdGhpcy5fYXBwQ29udGFpbmVyTm9kZSA9ICQoYCMke2RlZmF1bHRBcHBDb250YWluZXJJZH1gKS5nZXQoMCk7XHJcbiAgfVxyXG5cclxuICBfY3JlYXRlVmlld0NvbnRhaW5lck5vZGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuX2FwcENvbnRhaW5lck5vZGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXQgdGhlIGFwcCBjb250YWluZXIgbm9kZSBiZWZvcmUgY3JlYXRpbmcgdGhlIHZpZXcgY29udGFpbmVyIG5vZGUuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVmYXVsdFZpZXdDb250YWluZXJJZCA9ICd2aWV3Q29udGFpbmVyJztcclxuICAgIGNvbnN0IGRlZmF1bHRWaWV3Q29udGFpbmVyQ2xhc3NlcyA9ICdwYWdlLWNvbnRhaW5lciB2aWV3Q29udGFpbmVyJztcclxuICAgICQodGhpcy5fYXBwQ29udGFpbmVyTm9kZSkuYXBwZW5kKGBcclxuICAgICAgPG5hdiBpZD1cImFwcGxpY2F0aW9uLW1lbnVcIiBkYXRhLW9wZW4tb24tbGFyZ2U9XCJmYWxzZVwiIGNsYXNzPVwiYXBwbGljYXRpb24tbWVudSBzaG93LXNoYWRvd1wiXHJcbiAgICAgICAgZGF0YS1icmVha3BvaW50PVwibGFyZ2VcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYXBwbGljYXRpb24tbWVudS1oZWFkZXJcIj5cclxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaWNvbi1jbG9zZVwiPlxyXG4gICAgICAgICAgICAgIDxzdmcgcm9sZT1cInByZXNlbnRhdGlvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGZvY3VzYWJsZT1cImZhbHNlXCIgY2xhc3M9XCJpY29uXCI+XHJcbiAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1jbG9zZVwiPjwvdXNlPlxyXG4gICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvbmF2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGFnZS1jb250YWluZXIgc2Nyb2xsYWJsZSB0YmFyQ29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBpZD1cIiR7ZGVmYXVsdFZpZXdDb250YWluZXJJZH1cIiBjbGFzcz1cIiR7ZGVmYXVsdFZpZXdDb250YWluZXJDbGFzc2VzfVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbCB2aWV3LXNldHRpbmdzXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1oaWRkZW49XCJmYWxzZVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgIDxoMT4ke3RoaXMudmlld1NldHRpbmdzVGV4dH08L2gxPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1idXR0b25zZXRcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1tb2RhbFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiPiR7dGhpcy5jbG9zZVRleHR9PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYCk7XHJcblxyXG4gICAgdGhpcy5fdmlld0NvbnRhaW5lck5vZGUgPSAkKGAjJHtkZWZhdWx0Vmlld0NvbnRhaW5lcklkfWApLmdldCgwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGRvbSBhc3NvY2lhdGVkIHRvIHRoZSBjb250YWluZXIgZWxlbWVudC5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIGdldENvbnRhaW5lck5vZGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXBwQ29udGFpbmVyTm9kZSB8fCB0aGlzLl92aWV3Q29udGFpbmVyTm9kZTtcclxuICB9XHJcblxyXG4gIGdldEFwcENvbnRhaW5lck5vZGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXBwQ29udGFpbmVyTm9kZTtcclxuICB9XHJcblxyXG4gIGdldFZpZXdDb250YWluZXJOb2RlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdDb250YWluZXJOb2RlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIGEgdmlldyB3aXRoIHRoZSBhcHBsaWNhdGlvbiBhbmQgcmVuZGVycyBpdCB0byBIVE1MLlxyXG4gICAqIElmIHRoZSBhcHBsaWNhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLCB0aGUgdmlldyBpcyBpbW1lZGlhdGVseSBpbml0aWFsaXplZCBhcyB3ZWxsLlxyXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyBBIHZpZXcgaW5zdGFuY2UgdG8gYmUgcmVnaXN0ZXJlZC5cclxuICAgKiBAcGFyYW0ge2RvbU5vZGV9IGRvbU5vZGUgT3B0aW9uYWwuIEEgRE9NIG5vZGUgdG8gcGxhY2UgdGhlIHZpZXcgaW4uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJWaWV3KHZpZXcsIGRvbU5vZGUsIHBvc2l0aW9uID0gJ2ZpcnN0Jykge1xyXG4gICAgY29uc3QgaWQgPSB2aWV3LmlkO1xyXG5cclxuICAgIGNvbnN0IG5vZGUgPSBkb21Ob2RlIHx8IHRoaXMuX3ZpZXdDb250YWluZXJOb2RlO1xyXG4gICAgdmlldy5fcGxhY2VBdCA9IG5vZGU7XHJcbiAgICB2aWV3Ll9wbGFjZVBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB0aGlzLnZpZXdzW2lkXSA9IHZpZXc7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlclZpZXdSb3V0ZSh2aWV3KTtcclxuXHJcbiAgICB0aGlzLm9uUmVnaXN0ZXJlZCh2aWV3KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyVmlld1JvdXRlKHZpZXcpIHtcclxuICAgIGlmICghdmlldyB8fCB0eXBlb2Ygdmlldy5nZXRSb3V0ZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgcGFnZSh2aWV3LmdldFJvdXRlKCksIHZpZXcucm91dGVMb2FkLmJpbmQodmlldyksIHZpZXcucm91dGVTaG93LmJpbmQodmlldykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIGEgdG9vbGJhciB3aXRoIHRoZSBhcHBsaWNhdGlvbiBhbmQgcmVuZGVycyBpdCB0byBIVE1MLlxyXG4gICAqIElmIHRoZSBhcHBsaWNhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLCB0aGUgdG9vbGJhciBpcyBpbW1lZGlhdGVseSBpbml0aWFsaXplZCBhcyB3ZWxsLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFVuaXF1ZSBuYW1lIG9mIHRoZSB0b29sYmFyXHJcbiAgICogQHBhcmFtIHtUb29sYmFyfSB0YmFyIFRvb2xiYXIgaW5zdGFuY2UgdG8gcmVnaXN0ZXJcclxuICAgKiBAcGFyYW0ge2RvbU5vZGV9IGRvbU5vZGUgT3B0aW9uYWwuIEEgRE9NIG5vZGUgdG8gcGxhY2UgdGhlIHZpZXcgaW4uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJUb29sYmFyKG4sIHQsIGRvbU5vZGUpIHtcclxuICAgIGxldCBuYW1lID0gbjtcclxuICAgIGxldCB0YmFyID0gdDtcclxuXHJcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHRiYXIgPSBuYW1lO1xyXG4gICAgICBuYW1lID0gdGJhci5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYmFyc1tuYW1lXSA9IHRiYXI7XHJcblxyXG4gICAgaWYgKHRoaXMuX3N0YXJ0ZWQpIHtcclxuICAgICAgdGJhci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGJhck5vZGUgPSAkKCc+IC50YmFyQ29udGFpbmVyJywgdGhpcy5fYXBwQ29udGFpbmVyTm9kZSkuZ2V0KDApO1xyXG4gICAgY29uc3Qgbm9kZSA9IGRvbU5vZGUgfHwgdGJhck5vZGU7XHJcbiAgICB0YmFyLnBsYWNlQXQobm9kZSwgJ2ZpcnN0Jyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGFsbCB0aGUgcmVnaXN0ZXJlZCB2aWV3cy5cclxuICAgKiBAcmV0dXJuIHtWaWV3W119IEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnRseSByZWdpc3RlcmVkIHZpZXdzLlxyXG4gICAqL1xyXG4gIGdldFZpZXdzKCkge1xyXG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgdmlldyBpbiB0aGlzLnZpZXdzKSB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdzLmhhc093blByb3BlcnR5KHZpZXcpKSB7XHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMudmlld3Nbdmlld10pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBwYXNzZWQgdmlldyBpbnN0YW5jZSBpcyB0aGUgY3VycmVudGx5IGFjdGl2ZSBvbmUgYnkgY29tcGFyaW5nIGl0IHRvIHtAbGluayAjZ2V0UHJpbWFyeUFjdGl2ZVZpZXcgcHJpbWFyeUFjdGl2ZVZpZXd9LlxyXG4gICAqIEBwYXJhbSB7Vmlld30gdmlld1xyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgdGhlIHBhc3NlZCB2aWV3IGlzIHRoZSBzYW1lIGFzIHRoZSBhY3RpdmUgdmlldy5cclxuICAgKi9cclxuICBpc1ZpZXdBY3RpdmUodmlldykge1xyXG4gICAgLy8gdG9kbzogYWRkIGNoZWNrIGZvciBtdWx0aXBsZSBhY3RpdmUgdmlld3MuXHJcbiAgICByZXR1cm4gKHRoaXMuZ2V0UHJpbWFyeUFjdGl2ZVZpZXcoKSA9PT0gdmlldyk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVPcmllbnRhdGlvbkRvbSh2YWx1ZSkge1xyXG4gICAgY29uc3Qgcm9vdCA9ICQodGhpcy5nZXRDb250YWluZXJOb2RlKCkpO1xyXG4gICAgY29uc3QgY3VycmVudE9yaWVudCA9IHJvb3QuYXR0cignb3JpZW50Jyk7XHJcbiAgICBpZiAodmFsdWUgPT09IGN1cnJlbnRPcmllbnQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJvb3QuYXR0cignb3JpZW50JywgdmFsdWUpO1xyXG5cclxuICAgIGlmICh2YWx1ZSA9PT0gJ3BvcnRyYWl0Jykge1xyXG4gICAgICByb290LnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcclxuICAgICAgcm9vdC5hZGRDbGFzcygncG9ydHJhaXQnKTtcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdsYW5kc2NhcGUnKSB7XHJcbiAgICAgIHJvb3QucmVtb3ZlQ2xhc3MoJ3BvcnRyYWl0Jyk7XHJcbiAgICAgIHJvb3QuYWRkQ2xhc3MoJ2xhbmRzY2FwZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcm9vdC5yZW1vdmVDbGFzcygncG9ydHJhaXQnKTtcclxuICAgICAgcm9vdC5yZW1vdmVDbGFzcygnbGFuZHNjYXBlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJyZW50T3JpZW50YXRpb24gPSB2YWx1ZTtcclxuICAgIHRoaXMub25TZXRPcmllbnRhdGlvbih2YWx1ZSk7XHJcbiAgICBjb25uZWN0LnB1Ymxpc2goJy9hcHAvc2V0T3JpZW50YXRpb24nLCBbdmFsdWVdKTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT3JpZW50YXRpb25DaGVjayhjYWxsYmFjaykge1xyXG4gICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG9yaWVudGF0aW9uOiBwb3J0cmFpdCknKTtcclxuXHJcbiAgICBjb25zdCBjaGVja01lZGlhID0gKG0pID0+IHtcclxuICAgICAgaWYgKG0ubWF0Y2hlcykge1xyXG4gICAgICAgIGNhbGxiYWNrKCdwb3J0cmFpdCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKCdsYW5kc2NhcGUnKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIG1hdGNoLmFkZExpc3RlbmVyKGNoZWNrTWVkaWEpO1xyXG4gICAgY2hlY2tNZWRpYShtYXRjaCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHBhZ2UgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVzdWx0IG9mIHtAbGluayAjZ2V0VmlldyBnZXRWaWV3KG5hbWUpfS5cclxuICAgKiBAcmV0dXJuIHtWaWV3fSBSZXR1cm5zIHRoZSBhY3RpdmUgdmlldyBpbnN0YW5jZSwgaWYgbm8gdmlldyBpcyBhY3RpdmUgcmV0dXJucyBudWxsLlxyXG4gICAqL1xyXG4gIGdldFByaW1hcnlBY3RpdmVWaWV3KCkge1xyXG4gICAgY29uc3QgZWwgPSB0aGlzLmdldEN1cnJlbnRQYWdlKCk7XHJcbiAgICBpZiAoZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VmlldyhlbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHBhZ2UoZG9tTm9kZSlcclxuICAgKiBAcGFyYW0ge0RPTU5vZGV9XHJcbiAgICovXHJcbiAgc2V0Q3VycmVudFBhZ2UoX3BhZ2UpIHtcclxuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gX3BhZ2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHBhZ2UoZG9tTm9kZSlcclxuICAgKiBAcmV0dXJucyB7RE9NTm9kZX1cclxuICAgKi9cclxuICBnZXRDdXJyZW50UGFnZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UGFnZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgYW55IHJlZ2lzdGVyZWQgdmlldyBoYXMgYmVlbiByZWdpc3RlcmVkIHdpdGggdGhlIHByb3ZpZGVkIGtleS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFVuaXF1ZSBpZCBvZiB0aGUgdmlldy5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZXJlIGlzIGEgcmVnaXN0ZXJlZCB2aWV3IG5hbWUgbWF0Y2hpbmcgdGhlIGtleS5cclxuICAgKi9cclxuICBoYXNWaWV3KGtleSkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5faW50ZXJuYWxHZXRWaWV3KHtcclxuICAgICAga2V5LFxyXG4gICAgICBpbml0OiBmYWxzZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcmVnaXN0ZXJlZCB2aWV3IGluc3RhbmNlIHdpdGggdGhlIGFzc29jaWF0ZWQga2V5LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL09iamVjdH0ga2V5IFRoZSBpZCBvZiB0aGUgdmlldyB0byByZXR1cm4sIGlmIG9iamVjdCB0aGVuIGBrZXkuaWRgIGlzIHVzZWQuXHJcbiAgICogQHJldHVybiB7Vmlld30gdmlldyBUaGUgcmVxdWVzdGVkIHZpZXcuXHJcbiAgICovXHJcbiAgZ2V0VmlldyhrZXkpIHtcclxuICAgIHJldHVybiB0aGlzLl9pbnRlcm5hbEdldFZpZXcoe1xyXG4gICAgICBrZXksXHJcbiAgICAgIGluaXQ6IHRydWUsXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZ2V0Vmlld0RldGFpbE9ubHkoa2V5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5faW50ZXJuYWxHZXRWaWV3KHtcclxuICAgICAga2V5LFxyXG4gICAgICBpbml0OiBmYWxzZSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2ludGVybmFsR2V0VmlldyhvcHRpb25zKSB7XHJcbiAgICBjb25zdCBrZXkgPSBvcHRpb25zICYmIG9wdGlvbnMua2V5O1xyXG4gICAgY29uc3QgaW5pdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5pbml0O1xyXG5cclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgbGV0IHZpZXc7XHJcbiAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHZpZXcgPSB0aGlzLnZpZXdzW2tleV07XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGtleS5pZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICB2aWV3ID0gdGhpcy52aWV3c1trZXkuaWRdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaW5pdCAmJiB2aWV3ICYmICF2aWV3Ll9zdGFydGVkKSB7XHJcbiAgICAgICAgdmlldy5pbml0KHRoaXMuc3RvcmUpO1xyXG4gICAgICAgIHZpZXcucGxhY2VBdCh2aWV3Ll9wbGFjZUF0LCAodmlldy5fcGxhY2VQb3NpdGlvbiB8fCAnZmlyc3QnKSk7XHJcbiAgICAgICAgdmlldy5fc3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgdmlldy5fcGxhY2VBdCA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB2aWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZGVmaW5lZCBzZWN1cml0eSBmb3IgYSBzcGVjaWZpYyB2aWV3XHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBJZCBvZiB0aGUgcmVnaXN0ZXJlZCB2aWV3IHRvIHF1ZXJ5LlxyXG4gICAqIEBwYXJhbSBhY2Nlc3NcclxuICAgKi9cclxuICBnZXRWaWV3U2VjdXJpdHkoa2V5LCBhY2Nlc3MpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9pbnRlcm5hbEdldFZpZXcoe1xyXG4gICAgICBrZXksXHJcbiAgICAgIGluaXQ6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gKHZpZXcgJiYgdmlldy5nZXRTZWN1cml0eShhY2Nlc3MpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJlZ2lzdGVyZWQgU0RhdGFTZXJ2aWNlIGluc3RhbmNlIGJ5IG5hbWUsIG9yIHJldHVybnMgdGhlIGRlZmF1bHQgc2VydmljZS5cclxuICAgKiBAcGFyYW0ge1N0cmluZy9Cb29sZWFufSBuYW1lIElmIHN0cmluZyBzZXJ2aWNlIGlzIGxvb2tlZCB1cCBieSBuYW1lLiBJZiBmYWxzZSwgZGVmYXVsdCBzZXJ2aWNlIGlzIHJldHVybmVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlZ2lzdGVyZWQgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFTZXJ2aWNlIGluc3RhbmNlLlxyXG4gICAqL1xyXG4gIGdldFNlcnZpY2UobmFtZSkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiB0aGlzLnNlcnZpY2VzW25hbWVdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNlcnZpY2VzW25hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRlZmF1bHRTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB0aGUgdGhlIHNwZWNpZmllZCBzZXJ2aWNlIG5hbWUgaXMgZm91bmQgaW4gdGhlIEFwcHMgc2VydmljZSBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgU0RhdGFTZXJ2aWNlIHRvIGRldGVjdFxyXG4gICAqL1xyXG4gIGhhc0Nvbm5lY3Rpb24obmFtZSkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5fY29ubmVjdGlvbnNbbmFtZV07XHJcbiAgfVxyXG5cclxuICBnZXRDb25uZWN0aW9uKG5hbWUpIHtcclxuICAgIGlmICh0aGlzLl9jb25uZWN0aW9uc1tuYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbnNbbmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLmRlZmF1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBhcHBsaWNhdGlvbnMgY3VycmVudCB0aXRsZS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgVGhlIG5ldyB0aXRsZS5cclxuICAgKi9cclxuICBzZXRQcmltYXJ5VGl0bGUodGl0bGUpIHtcclxuICAgIGZvciAoY29uc3QgbiBpbiB0aGlzLmJhcnMpIHtcclxuICAgICAgaWYgKHRoaXMuYmFycy5oYXNPd25Qcm9wZXJ0eShuKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmJhcnNbbl0ubWFuYWdlZCkge1xyXG4gICAgICAgICAgdGhpcy5iYXJzW25dLnNldCgndGl0bGUnLCB0aXRsZSk7XHJcblxyXG4gICAgICAgICAgLy8gdXBkYXRlIHNvaG8gdG9vbGJhciB3aGVuIHRpdGxlIGlzIGNoYW5nZWQgc2luY2UgaXQgdXNlcyB0ZXh0IGxlbmd0aCB0byBjYWxjdWxhdGUgaGVhZGVyIHdpZHRoXHJcbiAgICAgICAgICBjb25zdCBoZWFkZXIgPSAkKHRoaXMuYmFycy50YmFyLmRvbU5vZGUpO1xyXG4gICAgICAgICAgdGhpcy50b29sYmFyID0gaGVhZGVyLmZpbmQoJy50b29sYmFyJykuZGF0YSgndG9vbGJhcicpO1xyXG4gICAgICAgICAgdGhpcy50b29sYmFyLnVwZGF0ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2l6ZSBoYW5kbGVcclxuICAgKi9cclxuICBvblJlc2l6ZSgpIHtcclxuICB9XHJcblxyXG4gIG9uUmVnaXN0ZXJlZCgvKiB2aWV3Ki8pIHt9XHJcblxyXG4gIG9uQmVmb3JlVmlld1RyYW5zaXRpb25Bd2F5KC8qIHZpZXcqLykge31cclxuXHJcbiAgb25CZWZvcmVWaWV3VHJhbnNpdGlvblRvKC8qIHZpZXcqLykge31cclxuXHJcbiAgb25WaWV3VHJhbnNpdGlvbkF3YXkoLyogdmlldyovKSB7fVxyXG5cclxuICBvblZpZXdUcmFuc2l0aW9uVG8oLyogdmlldyovKSB7fVxyXG5cclxuICBvblZpZXdBY3RpdmF0ZSgvKiB2aWV3LCB0YWcsIGRhdGEqLykge31cclxuXHJcbiAgX29uQmVmb3JlVHJhbnNpdGlvbihldnQpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmdldFZpZXcoZXZ0LnRhcmdldCk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICBpZiAoZXZ0Lm91dCkge1xyXG4gICAgICAgIHRoaXMuX2JlZm9yZVZpZXdUcmFuc2l0aW9uQXdheSh2aWV3KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9iZWZvcmVWaWV3VHJhbnNpdGlvblRvKHZpZXcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfb25BZnRlclRyYW5zaXRpb24oZXZ0KSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5nZXRWaWV3KGV2dC50YXJnZXQpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgaWYgKGV2dC5vdXQpIHtcclxuICAgICAgICB0aGlzLl92aWV3VHJhbnNpdGlvbkF3YXkodmlldyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fdmlld1RyYW5zaXRpb25Ubyh2aWV3KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX29uQWN0aXZhdGUoZXZ0KSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5nZXRWaWV3KGV2dC50YXJnZXQpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdGhpcy5fdmlld0FjdGl2YXRlKHZpZXcsIGV2dC50YWcsIGV2dC5kYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9iZWZvcmVWaWV3VHJhbnNpdGlvbkF3YXkodmlldykge1xyXG4gICAgdGhpcy5vbkJlZm9yZVZpZXdUcmFuc2l0aW9uQXdheSh2aWV3KTtcclxuXHJcbiAgICB2aWV3LmJlZm9yZVRyYW5zaXRpb25Bd2F5KCk7XHJcbiAgfVxyXG5cclxuICBfYmVmb3JlVmlld1RyYW5zaXRpb25Ubyh2aWV3KSB7XHJcbiAgICB0aGlzLm9uQmVmb3JlVmlld1RyYW5zaXRpb25Ubyh2aWV3KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG4gaW4gdGhpcy5iYXJzKSB7XHJcbiAgICAgIGlmICh0aGlzLmJhcnNbbl0ubWFuYWdlZCkge1xyXG4gICAgICAgIHRoaXMuYmFyc1tuXS5jbGVhcigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmlldy5iZWZvcmVUcmFuc2l0aW9uVG8oKTtcclxuICB9XHJcblxyXG4gIF92aWV3VHJhbnNpdGlvbkF3YXkodmlldykge1xyXG4gICAgdGhpcy5vblZpZXdUcmFuc2l0aW9uQXdheSh2aWV3KTtcclxuXHJcbiAgICB2aWV3LnRyYW5zaXRpb25Bd2F5KCk7XHJcbiAgfVxyXG5cclxuICBfdmlld1RyYW5zaXRpb25Ubyh2aWV3KSB7XHJcbiAgICB0aGlzLm9uVmlld1RyYW5zaXRpb25Ubyh2aWV3KTtcclxuXHJcbiAgICBjb25zdCB0b29scyA9ICh2aWV3Lm9wdGlvbnMgJiYgdmlldy5vcHRpb25zLnRvb2xzKSB8fCB2aWV3LmdldFRvb2xzKCkgfHwge307XHJcblxyXG4gICAgZm9yIChjb25zdCBuIGluIHRoaXMuYmFycykge1xyXG4gICAgICBpZiAodGhpcy5iYXJzW25dLm1hbmFnZWQpIHtcclxuICAgICAgICB0aGlzLmJhcnNbbl0uc2hvd1Rvb2xzKHRvb2xzW25dKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZpZXcudHJhbnNpdGlvblRvKCk7XHJcbiAgfVxyXG5cclxuICBfdmlld0FjdGl2YXRlKHZpZXcsIHRhZywgZGF0YSkge1xyXG4gICAgdGhpcy5vblZpZXdBY3RpdmF0ZSh2aWV3KTtcclxuXHJcbiAgICB2aWV3LmFjdGl2YXRlKHRhZywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZWFyY2hlcyBBcHAuY29udGV4dC5oaXN0b3J5IGJ5IHBhc3NpbmcgYSBwcmVkaWNhdGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgcmV0dXJuIHRydWUgaWYgYSBtYXRjaCBpcyBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxyXG4gICAqIFRoaXMgaXMgc2ltaWxhciB0byBxdWVyeU5hdmlnYXRpb25Db250ZXh0LCBob3dldmVyLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIGZvdW5kIGl0ZW1zIGluc3RlYWQgb2YgYSBzaW5nbGUgaXRlbS5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGVcclxuICAgKiBAcmV0dXJuIHtBcnJheX0gY29udGV4dCBoaXN0b3J5IGZpbHRlcmVkIG91dCBieSB0aGUgcHJlZGljYXRlLlxyXG4gICAqL1xyXG4gIGZpbHRlck5hdmlnYXRpb25Db250ZXh0KHByZWRpY2F0ZSwgc2NvcGUpIHtcclxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbnRleHQuaGlzdG9yeSB8fCBbXTtcclxuICAgIGNvbnN0IGZpbHRlcmVkID0gbGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuIHByZWRpY2F0ZS5jYWxsKHNjb3BlIHx8IHRoaXMsIGl0ZW0uZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZmlsdGVyZWQubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBpdGVtLmRhdGE7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlYXJjaGVzIEFwcC5jb250ZXh0Lmhpc3RvcnkgYnkgcGFzc2luZyBhIHByZWRpY2F0ZSBmdW5jdGlvbiB0aGF0IHNob3VsZCByZXR1cm4gdHJ1ZVxyXG4gICAqIHdoZW4gYSBtYXRjaCBpcyBmb3VuZC5cclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgaW4gdGhlIHByb3ZpZGVkIHNjb3BlIHdpdGggdGhlIGN1cnJlbnQgaGlzdG9yeSBpdGVyYXRpb24uIEl0IHNob3VsZCByZXR1cm4gdHJ1ZSBpZiB0aGUgaGlzdG9yeSBpdGVtIGlzIHRoZSBkZXNpcmVkIGNvbnRleHQuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRlcHRoXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXHJcbiAgICogQHJldHVybiB7T2JqZWN0L0Jvb2xlYW59IGNvbnRleHQgSGlzdG9yeSBkYXRhIGNvbnRleHQgaWYgZm91bmQsIGZhbHNlIGlmIG5vdC5cclxuICAgKi9cclxuICBxdWVyeU5hdmlnYXRpb25Db250ZXh0KHByZWRpY2F0ZSwgZCwgcykge1xyXG4gICAgbGV0IHNjb3BlID0gcztcclxuICAgIGxldCBkZXB0aCA9IGQ7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkZXB0aCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgc2NvcGUgPSBkZXB0aDtcclxuICAgICAgZGVwdGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbnRleHQuaGlzdG9yeSB8fCBbXTtcclxuXHJcbiAgICBkZXB0aCA9IGRlcHRoIHx8IDA7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IGxpc3QubGVuZ3RoIC0gMiwgaiA9IDA7IGkgPj0gMCAmJiAoZGVwdGggPD0gMCB8fCBqIDwgZGVwdGgpOyBpLS0sIGorKykge1xyXG4gICAgICBpZiAocHJlZGljYXRlLmNhbGwoc2NvcGUgfHwgdGhpcywgbGlzdFtpXS5kYXRhKSkge1xyXG4gICAgICAgIHJldHVybiBsaXN0W2ldLmRhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG9ydGN1dCBtZXRob2QgdG8ge0BsaW5rICNxdWVyeU5hdmlnYXRpb25Db250ZXh0IHF1ZXJ5TmF2aWdhdGlvbkNvbnRleHR9IHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIHJlc291cmNlS2luZCBwcm92aWRlZFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL1N0cmluZ1tdfSBraW5kIFRoZSByZXNvdXJjZUtpbmQocykgdGhlIGhpc3RvcnkgaXRlbSBtdXN0IG1hdGNoXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIE9wdGlvbmFsLiBJZiBwcm92aWRlZCBpdCB3aWxsIGJlIGNhbGxlZCBvbiBtYXRjaGVzIHNvIHlvdSBtYXkgZG8gYW4gc2Vjb25kYXJ5IGNoZWNrIG9mIHRoZSBpdGVtIC0gcmV0dXJuaW5nIHRydWUgZm9yIGdvb2QgaXRlbXMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlIFNjb3BlIHRoZSBwcmVkaWNhdGUgc2hvdWxkIGJlIGNhbGxlZCBpbi5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGNvbnRleHQgSGlzdG9yeSBkYXRhIGNvbnRleHQgaWYgZm91bmQsIGZhbHNlIGlmIG5vdC5cclxuICAgKi9cclxuICBpc05hdmlnYXRpb25Gcm9tUmVzb3VyY2VLaW5kKGtpbmQsIHByZWRpY2F0ZSwgc2NvcGUpIHtcclxuICAgIGNvbnN0IGxvb2t1cCA9IHt9O1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoa2luZCkpIHtcclxuICAgICAga2luZC5mb3JFYWNoKGZ1bmN0aW9uIGZvckVhY2goaXRlbSkge1xyXG4gICAgICAgIHRoaXNbaXRlbV0gPSB0cnVlO1xyXG4gICAgICB9LCBsb29rdXApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9va3VwW2tpbmRdID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5xdWVyeU5hdmlnYXRpb25Db250ZXh0KGZ1bmN0aW9uIHF1ZXJ5TmF2aWdhdGlvbkNvbnRleHQobykge1xyXG4gICAgICBjb25zdCBjb250ZXh0ID0gKG8ub3B0aW9ucyAmJiBvLm9wdGlvbnMuc291cmNlKSB8fCBvO1xyXG4gICAgICBjb25zdCByZXNvdXJjZUtpbmQgPSBjb250ZXh0ICYmIGNvbnRleHQucmVzb3VyY2VLaW5kO1xyXG5cclxuICAgICAgLy8gaWYgYSBwcmVkaWNhdGUgaXMgZGVmaW5lZCwgYm90aCByZXNvdXJjZUtpbmQgQU5EIHByZWRpY2F0ZSBtdXN0IG1hdGNoLlxyXG4gICAgICBpZiAobG9va3VwW3Jlc291cmNlS2luZF0pIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoc2NvcGUgfHwgdGhpcywgbywgY29udGV4dCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWdpc3RlcnMgYSBjdXN0b21pemF0aW9uIHRvIGEgdGFyZ2V0IHBhdGguXHJcbiAgICpcclxuICAgKiBBIEN1c3RvbWl6YXRpb24gU3BlYyBpcyBhIHNwZWNpYWwgb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxyXG4gICAqXHJcbiAgICogKiBgYXRgOiBgZnVuY3Rpb24oaXRlbSlgIC0gcGFzc2VzIHRoZSBjdXJyZW50IGl0ZW0gaW4gdGhlIGxpc3QsIHRoZSBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgaWYgdGhpcyBpcyB0aGUgaXRlbSBiZWluZyBtb2RpZmllZCAob3IgaXMgYXQgd2hlcmUgeW91IHdhbnQgdG8gaW5zZXJ0IHNvbWV0aGluZykuXHJcbiAgICogKiBgYXRgOiBge051bWJlcn1gIC0gTWF5IG9wdGlvbmFsbHkgZGVmaW5lIHRoZSBpbmRleCBvZiB0aGUgaXRlbSBpbnN0ZWFkIG9mIGEgZnVuY3Rpb24uXHJcbiAgICogKiBgdHlwZWA6IGB7U3RyaW5nfWAgLSBlbnVtIG9mIGBpbnNlcnRgLCBgbW9kaWZ5YCwgYHJlcGxhY2VgIG9yIGByZW1vdmVgIHRoYXQgaW5kaWNhdGVzIHRoZSB0eXBlIG9mIGN1c3RvbWl6YXRpb24uXHJcbiAgICogKiBgd2hlcmVgOiBge1N0cmluZ31gIC0gZW51bSBvZiBgYmVmb3JlYCBvciBgYWZ0ZXJgIG9ubHkgbmVlZGVkIHdoZW4gdHlwZSBpcyBgaW5zZXJ0YC5cclxuICAgKiAqIGB2YWx1ZWA6IGB7T2JqZWN0fWAgLSB0aGUgZW50aXJlIG9iamVjdCB0byBjcmVhdGUgKGluc2VydCBvciByZXBsYWNlKSBvciB0aGUgdmFsdWVzIHRvIG92ZXJ3cml0ZSAobW9kaWZ5KSwgbm90IG5lZWRlZCBmb3IgcmVtb3ZlLlxyXG4gICAqICogYHZhbHVlYDogYHtPYmplY3RbXX1gIC0gaWYgaW5zZXJ0aW5nIHlvdSBtYXkgcGFzcyBhbiBhcnJheSBvZiBpdGVtcyB0byBjcmVhdGUuXHJcbiAgICpcclxuICAgKiBOb3RlOiBUaGlzIGFsc28gYWNjZXB0cyB0aGUgbGVnYWN5IHNpZ25hdHVyZTpcclxuICAgKiBgcmVnaXN0ZXJDdXN0b21pemF0aW9uKHBhdGgsIGlkLCBzcGVjKWBcclxuICAgKiBXaGVyZSB0aGUgcGF0aCBpcyBgbGlzdC90b29sc2AgYW5kIGBpZGAgaXMgdGhlIHZpZXcgaWRcclxuICAgKlxyXG4gICAqIEFsbCBjdXN0b21pemF0aW9ucyBhcmUgcmVnaXN0ZXJlZCB0byBgdGhpcy5jdXN0b21pemF0aW9uc1twYXRoXWAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBUaGUgY3VzdG9taXphdGlvbiBzZXQgc3VjaCBhcyBgbGlzdC90b29scyNhY2NvdW50X2xpc3RgIG9yIGBkZXRhaWwjY29udGFjdF9kZXRhaWxgLiBGaXJzdCBoYWxmIGJlaW5nIHRoZSB0eXBlIG9mIGN1c3RvbWl6YXRpb24gYW5kIHRoZSBzZWNvbmQgdGhlIHZpZXcgaWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNwZWMgVGhlIGN1c3RvbWl6YXRpb24gc3BlY2lmaWNhdGlvblxyXG4gICAqL1xyXG4gIHJlZ2lzdGVyQ3VzdG9taXphdGlvbihwLCBzKSB7XHJcbiAgICBsZXQgcGF0aCA9IHA7XHJcbiAgICBsZXQgc3BlYyA9IHM7XHJcblxyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XHJcbiAgICAgIGNvbnN0IGN1c3RvbWl6YXRpb25TZXQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgIGNvbnN0IGlkID0gYXJndW1lbnRzWzFdO1xyXG5cclxuICAgICAgc3BlYyA9IGFyZ3VtZW50c1syXTtcclxuICAgICAgcGF0aCA9IGlkID8gYCR7Y3VzdG9taXphdGlvblNldH0jJHtpZH1gIDogY3VzdG9taXphdGlvblNldDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmN1c3RvbWl6YXRpb25zW3BhdGhdIHx8ICh0aGlzLmN1c3RvbWl6YXRpb25zW3BhdGhdID0gW10pO1xyXG4gICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICBjb250YWluZXIucHVzaChzcGVjKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1c3RvbWl6YXRpb25zIHJlZ2lzdGVyZWQgZm9yIHRoZSBwcm92aWRlZCBwYXRoLlxyXG4gICAqXHJcbiAgICogTm90ZTogVGhpcyBhbHNvIGFjY2VwdHMgdGhlIGxlZ2FjeSBzaWduYXR1cmU6XHJcbiAgICogYGdldEN1c3RvbWl6YXRpb25zRm9yKHNldCwgaWQpYFxyXG4gICAqIFdoZXJlIHRoZSBwYXRoIGlzIGBsaXN0L3Rvb2xzYCBhbmQgYGlkYCBpcyB0aGUgdmlldyBpZFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIGN1c3RvbWl6YXRpb24gc2V0IHN1Y2ggYXMgYGxpc3QvdG9vbHMjYWNjb3VudF9saXN0YCBvciBgZGV0YWlsI2NvbnRhY3RfZGV0YWlsYC4gRmlyc3QgaGFsZiBiZWluZyB0aGUgdHlwZSBvZiBjdXN0b21pemF0aW9uIGFuZCB0aGUgc2Vjb25kIHRoZSB2aWV3IGlkLlxyXG4gICAqL1xyXG4gIGdldEN1c3RvbWl6YXRpb25zRm9yKHApIHtcclxuICAgIGxldCBwYXRoID0gcDtcclxuXHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgcGF0aCA9IGFyZ3VtZW50c1sxXSA/IGAke2FyZ3VtZW50c1swXX0jJHthcmd1bWVudHNbMV19YCA6IGFyZ3VtZW50c1swXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZWdtZW50cyA9IHBhdGguc3BsaXQoJyMnKTtcclxuICAgIGNvbnN0IGN1c3RvbWl6YXRpb25TZXQgPSBzZWdtZW50c1swXTtcclxuICAgIGNvbnN0IGZvclBhdGggPSB0aGlzLmN1c3RvbWl6YXRpb25zW3BhdGhdIHx8IFtdO1xyXG4gICAgY29uc3QgZm9yU2V0ID0gdGhpcy5jdXN0b21pemF0aW9uc1tjdXN0b21pemF0aW9uU2V0XSB8fCBbXTtcclxuXHJcbiAgICByZXR1cm4gZm9yUGF0aC5jb25jYXQoZm9yU2V0KTtcclxuICB9XHJcblxyXG4gIGhhc0FjY2Vzc1RvKC8qIHNlY3VyaXR5Ki8pIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiB0byBsb2FkIGEgdmlldyBpbiB0aGUgbGVmdCBkcmF3ZXIuXHJcbiAgICovXHJcbiAgc2hvd0xlZnREcmF3ZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gdG8gbG9hZCBhIHZpZXcgaW4gdGhlIHJpZ2h0IGRyYXdlci5cclxuICAgKi9cclxuICBzaG93UmlnaHREcmF3ZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNldFRvb2xCYXJNb2RlKG9uTGluZSkge1xyXG4gICAgZm9yIChjb25zdCBuIGluIHRoaXMuYmFycykge1xyXG4gICAgICBpZiAodGhpcy5iYXJzW25dLm1hbmFnZWQpIHtcclxuICAgICAgICB0aGlzLmJhcnNbbl0uc2V0TW9kZShvbkxpbmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvbjtcclxuIl19