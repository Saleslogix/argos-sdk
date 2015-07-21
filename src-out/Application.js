<<<<<<< HEAD
define('argos/Application', ['exports', 'module', 'dojo/json', 'dojo/_base/array', 'dojo/_base/connect', 'dojo/aspect', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/window', 'dojo/string', 'dojo/hash', 'dojo/has', 'dojo/dom-construct', 'dojo/promise/all', 'snap', 'dojo/sniff', './ReUI/main'], function (exports, module, _dojoJson, _dojo_baseArray, _dojo_baseConnect, _dojoAspect, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseWindow, _dojoString, _dojoHash, _dojoHas, _dojoDomConstruct, _dojoPromiseAll, _snap, _dojoSniff, _ReUIMain) {
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

    var _json = _interopRequireDefault(_dojoJson);

    var _array = _interopRequireDefault(_dojo_baseArray);

    var _connect = _interopRequireDefault(_dojo_baseConnect);

    var _aspect = _interopRequireDefault(_dojoAspect);

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _win = _interopRequireDefault(_dojo_baseWindow);

    var _string = _interopRequireDefault(_dojoString);

    var _hash = _interopRequireDefault(_dojoHash);

    var _has = _interopRequireDefault(_dojoHas);

    var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

    var _all = _interopRequireDefault(_dojoPromiseAll);

    var _snap2 = _interopRequireDefault(_snap);

    var _sniff = _interopRequireDefault(_dojoSniff);

    var _ReUI = _interopRequireDefault(_ReUIMain);

    var __class, localize, mergeConfiguration, applyLocalizationTo;
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
 * @class argos.Application
 * Application is a nexus that provides many routing and global application services that may be used
 * from anywhere within the app.
 *
 * It provides a shortcut alias to `window.App` (`App`) with the most common usage being `App.getView(id)`.
 *
 * @alternateClassName App
 */
define('argos/Application', [
    'dojo/json',
    'dojo/_base/array',
    'dojo/_base/connect',
    'dojo/aspect',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/window',
    'dojo/string',
    'dojo/hash',
    'dojo/has',
    'dojo/dom-construct',
    'dojo/promise/all',
    'snap',
    'dojo/sniff',
    './ReUI/main'
], function(
    json,
    array,
    connect,
    aspect,
    declare,
    lang,
    win,
    string,
    hash,
    has,
    domConstruct,
    all,
    snap,
    sniff,
    ReUI
) {
    var __class,
        localize,
        mergeConfiguration,
        applyLocalizationTo;
>>>>>>> develop

    // Polyfill for Funcion.bind, taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    /* jshint ignore:start */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                self = this,
<<<<<<< HEAD
                fNOP = function fNOP() {},
                fBound = function fBound() {
                return self.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
=======
                fNOP = function() {},
                fBound = function() {
                    return self.apply(this instanceof fNOP && oThis
                         ? this
                         : oThis,
                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };
>>>>>>> develop

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
    /* jshint ignore:end */

<<<<<<< HEAD
    _has['default'].add('html5-file-api', function (global, document) {
        if ((0, _has['default'])('ie')) {
=======
    has.add('html5-file-api', function(global, document) {
        if (has('ie')) {
>>>>>>> develop
            return false;
        }

        if (global.File && global.FileReader && global.FileList && global.Blob) {
            return true;
        } else {
            return false;
        }
    });

<<<<<<< HEAD
    _lang['default'].extend(Function, {
        // TODO: Deprecate this in favor of the standard "bind", using polyfill if necessary
        bindDelegate: function bindDelegate(scope) {
            var self, optional;
=======
    lang.extend(Function, {
        // TODO: Deprecate this in favor of the standard "bind", using polyfill if necessary
        bindDelegate: function(scope) {
            var self,
                optional;
>>>>>>> develop

            self = this;

            if (arguments.length === 1) {
                return function() {
                    return self.apply(scope || this, arguments);
                };
            }

            optional = Array.prototype.slice.call(arguments, 1);
            return function() {
                var called = Array.prototype.slice.call(arguments, 0);
                return self.apply(scope || this, called.concat(optional));
            };
        }
    });

<<<<<<< HEAD
    applyLocalizationTo = function (object, localization) {
=======
    applyLocalizationTo = function(object, localization) {
>>>>>>> develop
        if (!object) {
            return;
        }

<<<<<<< HEAD
        var target, key;
=======
        var target,
            key;
>>>>>>> develop

        target = object.prototype || object;
        for (key in localization) {
            if (_lang['default'].isObject(localization[key])) {
                applyLocalizationTo(target[key], localization[key]);
            } else {
                target[key] = localization[key];
            }
        }
    };

<<<<<<< HEAD
    localize = function (name, localization) {
        var target = _lang['default'].getObject(name);
=======
    localize = function(name, localization) {
        var target = lang.getObject(name);
>>>>>>> develop
        if (target && target.prototype) {
            target = target.prototype;
        }

        if (target) {
            applyLocalizationTo(target, localization);
        }
    };

<<<<<<< HEAD
    mergeConfiguration = function (baseConfiguration, moduleConfiguration) {
=======
    mergeConfiguration = function(baseConfiguration, moduleConfiguration) {
>>>>>>> develop
        if (baseConfiguration) {
            if (baseConfiguration.modules && moduleConfiguration.modules) {
                baseConfiguration.modules = baseConfiguration.modules.concat(moduleConfiguration.modules);
            }

            if (baseConfiguration.connections && moduleConfiguration.connections) {
                baseConfiguration.connections = _lang['default'].mixin(baseConfiguration.connections, moduleConfiguration.connections);
            }
        }

        return baseConfiguration;
    };

<<<<<<< HEAD
    _lang['default'].mixin(_win['default'].global, {
=======
    lang.mixin(win.global, {
>>>>>>> develop
        'localize': localize,
        'mergeConfiguration': mergeConfiguration
    });

<<<<<<< HEAD
    /**
     * @class argos.Application
     * Application is a nexus that provides many routing and global application services that may be used
     * from anywhere within the app.
     *
     * It provides a shortcut alias to `window.App` (`App`) with the most common usage being `App.getView(id)`.
     *
     * @alternateClassName App
     */
    __class = (0, _declare['default'])('argos.Application', null, {
=======
    __class = declare('argos.Application', null, {
>>>>>>> develop
        /**
         * @property enableConcurrencyCheck {Boolean} Option to skip concurrency checks to avoid precondition/412 errors.
         */
        enableConcurrencyCheck: false,

        /**
         * Instance of a ReUI
         */
<<<<<<< HEAD
        ReUI: _ReUI['default'],
=======
        ReUI: ReUI,
>>>>>>> develop

        /**
         * @property viewShowOptions {Array} Array with one configuration object that gets pushed before showing a view.
         * Allows passing in options via routing. Value gets removed once the view is shown.
         */
        viewShowOptions: null,

        /**
         * Instance of a Snap.js object (https://github.com/jakiestfu/Snap.js/)
         */
        snapper: null,

        /**
         * @property {String}
         * Current orientation of the application. Can be landscape or portrait.
         */
        currentOrientation: 'portrait',

        /**
         * Array of all connections for App
         * @property {Object[]}
         * @private
         */
        _connects: null,

        /**
         * Array of handles for App
         * @property {Object[]}
         * @private
         */
        _signals: null,

        /**
         * @private
         * Array of all subscriptions for App
         */
        _subscribes: null,

        /**
         * Array of promises to load app state
         * @property {Array}
         * @private
         */
        _appStatePromises: null,

        /**
         * Signifies the App has been initialized
         * @property {Boolean}
         * @private
         */
        _started: false,

        _rootDomNode: null,
        customizations: null,
<<<<<<< HEAD
        services: null, // TODO: Remove
=======
        services: null,// TODO: Remove
>>>>>>> develop
        _connections: null,
        modules: null,
        views: null,
        hash: _hash['default'],
        onLine: true,
        _currentPage: null,
        /**
         * Toolbar instances by key name
         * @property {Object}
         */
        bars: null,
        enableCaching: false,
        /**
         * The default Sage.SData.Client.SDataService instance
         * @property {Object}
         */
        defaultService: null,
        resizeTimer: null,

        /**
         * The hash to redirect to after login.
         * @property {String}
         */
        redirectHash: '',
        /**
        * Signifies the maximum file size that can be uploaded in bytes
         * @property {int}
         */
        maxUploadFileSize: 4000000,
        /**
         * All options are mixed into App itself
         * @param {Object} options
         */
<<<<<<< HEAD
        constructor: function constructor(options) {
=======
        constructor: function(options) {
>>>>>>> develop
            this._connects = [];
            this._appStatePromises = [];
            this._signals = [];
            this._subscribes = [];

            this.customizations = {};
            this.services = {};// TODO: Remove
            this._connections = {};
            this.modules = [];
            this.views = {};
            this.bars = {};

            this.context = {};
            this.viewShowOptions = [];

<<<<<<< HEAD
            _lang['default'].mixin(this, options);
=======
            lang.mixin(this, options);
>>>>>>> develop
        },
        /**
         * Loops through and disconnections connections and unsubscribes subscriptions.
         * Also calls {@link #uninitialize uninitialize}.
         */
<<<<<<< HEAD
        destroy: function destroy() {
            var name, connection;

            _array['default'].forEach(this._connects, function (handle) {
                _connect['default'].disconnect(handle);
            });

            _array['default'].forEach(this._subscribes, function (handle) {
                _connect['default'].unsubscribe(handle);
            });

            _array['default'].forEach(this._signals, function (signal) {
=======
        destroy: function() {
            var name,
                connection;

            array.forEach(this._connects, function(handle) {
                connect.disconnect(handle);
            });

            array.forEach(this._subscribes, function(handle) {
                connect.unsubscribe(handle);
            });

            array.forEach(this._signals, function(signal) {
>>>>>>> develop
                signal.remove();
            });

            for (name in this._connections) {
                if (this._connections.hasOwnProperty(name)) {
                    connection = this._connections[name];
                    if (connection) {
                        connection.un('beforerequest', this._loadSDataRequest, this);
                        connection.un('requestcomplete', this._cacheSDataRequest, this);
                    }
                }
            }

            this.uninitialize();
        },
        /**
         * Shelled function that is called from {@link #destroy destroy}, may be used to release any further handles.
         */
<<<<<<< HEAD
        uninitialize: function uninitialize() {},
        /**
         * Cleans up URL to prevent ReUI url handling and then invokes ReUI.
         */
        initReUI: function initReUI() {
=======
        uninitialize: function() {

        },
        /**
         * Cleans up URL to prevent ReUI url handling and then invokes ReUI.
         */
        initReUI: function() {
>>>>>>> develop
            // prevent ReUI from attempting to load the URLs view as we handle that ourselves.
            // todo: add support for handling the URL?
            var hash = this.hash();
            if (hash !== '') {
                this.redirectHash = hash;
            }

            location.hash = '';

<<<<<<< HEAD
            _ReUI['default'].init();
=======
            ReUI.init();
>>>>>>> develop
        },
        /**
         * If caching is enable and App is {@link #isOnline online} the empties the SData cache via {@link #_clearSDataRequestCache _clearSDataRequestCache}.
         */
<<<<<<< HEAD
        initCaching: function initCaching() {
=======
        initCaching: function() {
>>>>>>> develop
            if (this.enableCaching) {
                if (this.isOnline()) {
                    this._clearSDataRequestCache();
                }
            }
        },
<<<<<<< HEAD
        onOffline: function onOffline() {
            this.onLine = false;
        },
        onOnline: function onOnline() {
=======
        onOffline: function() {
            this.onLine = false;
        },
        onOnline: function() {
>>>>>>> develop
            this.onLine = true;
        },
        /**
         * Establishes various connections to events.
         */
<<<<<<< HEAD
        initConnects: function initConnects() {
            this._connects.push(_connect['default'].connect(window, 'resize', this, this.onResize));
            this._connects.push(_connect['default'].connect(_win['default'].body(), 'beforetransition', this, this._onBeforeTransition));
            this._connects.push(_connect['default'].connect(_win['default'].body(), 'aftertransition', this, this._onAfterTransition));
            this._connects.push(_connect['default'].connect(_win['default'].body(), 'show', this, this._onActivate));
            this._connects.push(_connect['default'].connect(window, 'offline', this, this.onOffline));
            this._connects.push(_connect['default'].connect(window, 'online', this, this.onOnline));
=======
        initConnects: function() {
            this._connects.push(connect.connect(window, 'resize', this, this.onResize));
            this._connects.push(connect.connect(win.body(), 'beforetransition', this, this._onBeforeTransition));
            this._connects.push(connect.connect(win.body(), 'aftertransition', this, this._onAfterTransition));
            this._connects.push(connect.connect(win.body(), 'show', this, this._onActivate));
            this._connects.push(connect.connect(window, 'offline', this, this.onOffline));
            this._connects.push(connect.connect(window, 'online', this, this.onOnline));
>>>>>>> develop

            this.onLine = navigator.onLine;
        },

        /**
         * Establishes signals/handles from dojo's newer APIs
         */
<<<<<<< HEAD
        initSignals: function initSignals() {
            this._signals.push(_aspect['default'].after(window.ReUI, 'setOrientation', (function (result, args) {
=======
        initSignals: function() {
            this._signals.push(aspect.after(window.ReUI, 'setOrientation', function(result, args) {
>>>>>>> develop
                var value;
                if (args && args.length > 0) {
                    value = args[0];
                    this.currentOrientation = value;
                    this.onSetOrientation(value);
                    _connect['default'].publish('/app/setOrientation', [value]);
                }
<<<<<<< HEAD
            }).bind(this)));
=======
            }.bind(this)));
>>>>>>> develop

            return this;
        },
        /**
         * Executes the chain of promises registered with registerAppStatePromise.
         * When all promises are done, a new promise is returned to the caller, and all
         * registered promises are flushed.
         * @return {Promise}
         */
<<<<<<< HEAD
        initAppState: function initAppState() {
            var promises = _array['default'].map(this._appStatePromises, function (item) {
=======
        initAppState: function() {
            var promises = array.map(this._appStatePromises, function(item) {
>>>>>>> develop
                var results = item;
                if (typeof item === 'function') {
                    results = item();
                }

                return results;
            });

<<<<<<< HEAD
            return (0, _all['default'])(promises).then((function (results) {
=======
            return all(promises).then(function(results) {
>>>>>>> develop
                this.clearAppStatePromises();
                return results;
            }).bind(this));
        },
        /**
         * Registers a promise that will resolve when initAppState is invoked.
         * @param {Promise|Function} promise A promise or a function that returns a promise
         */
<<<<<<< HEAD
        registerAppStatePromise: function registerAppStatePromise(promise) {
            this._appStatePromises.push(promise);
            return this;
        },
        clearAppStatePromises: function clearAppStatePromises() {
            this._appStatePromises = [];
        },
        onSetOrientation: function onSetOrientation(value) {},
        /**
         * Loops through connections and calls {@link #registerService registerService} on each.
         */
        initServices: function initServices() {
=======
        registerAppStatePromise: function(promise) {
            this._appStatePromises.push(promise);
            return this;
        },
        clearAppStatePromises: function() {
            this._appStatePromises = [];
        },
        onSetOrientation: function(value) {
        },
        /**
         * Loops through connections and calls {@link #registerService registerService} on each.
         */
        initServices: function() {
>>>>>>> develop
            // TODO: Remove this method
            for (var name in this.connections) {
                if (this.connections.hasOwnProperty(name)) {
                    this.registerService(name, this.connections[name]);
                }
            }
        },
        /**
         * Loops through modules and calls their `init()` function.
         */
<<<<<<< HEAD
        initModules: function initModules() {
=======
        initModules: function() {
>>>>>>> develop
            for (var i = 0; i < this.modules.length; i++) {
                this.modules[i].init(this);
            }
        },
        /**
         * Loops through (tool)bars and calls their `init()` function.
         */
<<<<<<< HEAD
        initToolbars: function initToolbars() {
=======
        initToolbars: function() {
>>>>>>> develop
            for (var n in this.bars) {
                if (this.bars.hasOwnProperty(n)) {
                    this.bars[n].init(); // todo: change to startup
                }
            }
        },
        /**
         * Sets the global variable `App` to this instance.
         */
<<<<<<< HEAD
        activate: function activate() {
=======
        activate: function() {
>>>>>>> develop
            window.App = this;
        },
        /**
         * Initializes this application as well as the toolbar and all currently registered views.
         */
<<<<<<< HEAD
        init: function init() {
=======
        init: function() {
>>>>>>> develop
            this.initPreferences();
            this.initConnects();
            this.initSignals();
            this.initCaching();
            this.initServices();// TODO: Remove
            this._startupConnections();
            this.initModules();
            this.initToolbars();
            this.initReUI();
        },
<<<<<<< HEAD
        initPreferences: function initPreferences() {
=======
        initPreferences: function() {
>>>>>>> develop
            this._loadPreferences();
        },
        /**
         * Check if the browser supports touch events.
         * @return {Boolean} true if the current browser supports touch events, false otherwise.
         */
<<<<<<< HEAD
        supportsTouch: function supportsTouch() {
=======
        supportsTouch: function() {
>>>>>>> develop
            // Taken from https://github.com/Modernizr/Modernizr/ (MIT Licensed)
            return 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
        },
<<<<<<< HEAD
        persistPreferences: function persistPreferences() {
=======
        persistPreferences: function() {
>>>>>>> develop
            try {
                if (window.localStorage) {
                    window.localStorage.setItem('preferences', _json['default'].stringify(this.preferences));
                }
<<<<<<< HEAD
            } catch (e) {
                console.error(e);
            }
        },
        _loadPreferences: function _loadPreferences() {
=======
            } catch(e) {
                console.error(e);
            }
        },
        _loadPreferences: function() {
>>>>>>> develop
            try {
                if (window.localStorage) {
                    this.preferences = _json['default'].parse(window.localStorage.getItem('preferences'));
                }
<<<<<<< HEAD
            } catch (e) {
=======
            } catch(e) {
>>>>>>> develop
                console.error(e);
            }
        },
        /**
         * Establishes various connections to events.
         */
<<<<<<< HEAD
        _startupConnections: function _startupConnections() {
=======
        _startupConnections: function() {
>>>>>>> develop
            for (var name in this.connections) {
                if (this.connections.hasOwnProperty(name)) {
                    if (this.connections.hasOwnProperty(name)) {
                        this.registerConnection(name, this.connections[name]);
                    }
                }
            }

            /* todo: should we be mixing this in? */
            delete this.connections;
        },
        /**
         * Sets `_started` to true.
         */
<<<<<<< HEAD
        run: function run() {
=======
        run: function() {
>>>>>>> develop
            this._started = true;
        },
        /**
         * Returns the `window.navigator.onLine` property for detecting if an internet connection is available.
         */
<<<<<<< HEAD
        isOnline: function isOnline() {
=======
        isOnline: function() {
>>>>>>> develop
            return window.navigator.onLine;
        },
        /**
         * Returns true/false if the current view is the first/initial view.
         * This is useful for disabling the back button (so you don't hit the login page).
         * @returns {boolean}
        */
<<<<<<< HEAD
        isOnFirstView: function isOnFirstView() {},
        /**
         * Removes all keys from localStorage that start with `sdata.cache`.
         */
        _clearSDataRequestCache: function _clearSDataRequestCache() {
            var check, i, key;

            check = function (k) {
                return /^sdata\.cache/i.test(k);
=======
        isOnFirstView: function() {
        },
        /**
         * Removes all keys from localStorage that start with `sdata.cache`.
         */
        _clearSDataRequestCache: function() {
            var check,
                i,
                key;

            check = function(k) {
                return (/^sdata\.cache/i).test(k);
>>>>>>> develop
            };

            if (window.localStorage) {
                /* todo: find a better way to detect */
                for (i = window.localStorage.length - 1; i >= 0 ; i--) {
                    key = window.localStorage.key(i);
                    if (check(key)) {
                        window.localStorage.removeItem(key);
                    }
                }
            }
        },
        /**
         * Creates a cache key based on the URL of the request
         * @param {Object} request Sage.SData.Client.SDataBaseRequest
         * @return {String} Key to be used for localStorage cache
         */
<<<<<<< HEAD
        _createCacheKey: function _createCacheKey(request) {
=======
        _createCacheKey: function(request) {
>>>>>>> develop
            return 'sdata.cache[' + request.build() + ']';
        },
        /**
         * If the app is {@link #isOnline offline} and cache is allowed this function will attempt to load the passed
         * request from localStorage by {@link #_createCacheKey creating} a key from the requested URL.
         * @param request Sage.SData.Client.SDataBaseRequest
         * @param o XHR object with namely the `result` property
         */
<<<<<<< HEAD
        _loadSDataRequest: function _loadSDataRequest(request, o) {
            var key, feed;
=======
        _loadSDataRequest: function(request, o) {
            var key,
                feed;
>>>>>>> develop

            // todo: find a better way of indicating that a request can prefer cache
            if (window.localStorage) {
                if (this.isOnline() && request.allowCacheUse !== true) {
                    return;
                }

                key = this._createCacheKey(request);
                feed = window.localStorage.getItem(key);
                if (feed) {
                    o.result = _json['default'].parse(feed);
                }
            }
        },
        /**
         * Attempts to store all GET request results into localStorage
         * @param request SData request
         * @param o XHR object
         * @param feed The data from the request to store
         */
<<<<<<< HEAD
        _cacheSDataRequest: function _cacheSDataRequest(request, o, feed) {
=======
        _cacheSDataRequest: function(request, o, feed) {
>>>>>>> develop
            /* todo: decide how to handle PUT/POST/DELETE */
            if (window.localStorage) {
                if (/get/i.test(o.method) && typeof feed === 'object') {
                    var key = this._createCacheKey(request);

                    window.localStorage.removeItem(key);
                    window.localStorage.setItem(key, _json['default'].stringify(feed));
                }
            }
        },
        /**
         * Optional creates, then registers an Sage.SData.Client.SDataService and adds the result to `App.services`.
         * @param {String} name Unique identifier for the service.
         * @param {Object} service May be a SDataService instance or constructor parameters to create a new SDataService instance.
         * @param {Object} options Optional settings for the registered service.
         */
<<<<<<< HEAD
        registerService: function registerService(name, service, options) {
            // TODO: Remove this method
            options = options || {};

            var instance = service instanceof Sage.SData.Client.SDataService ? service : new Sage.SData.Client.SDataService(service);
=======
        registerService: function(name, service, options) {
            // TODO: Remove this method
            options = options || {};

            var instance = service instanceof Sage.SData.Client.SDataService
                ? service
                : new Sage.SData.Client.SDataService(service);
>>>>>>> develop

            this.services[name] = instance;

            if (this.enableCaching && (options.offline || service.offline)) {
                instance.on('beforerequest', this._loadSDataRequest, this);
                instance.on('requestcomplete', this._cacheSDataRequest, this);
            }

<<<<<<< HEAD
            if (options.isDefault || service.isDefault || !this.defaultService) {
=======
            if ((options.isDefault || service.isDefault) || !this.defaultService) {
>>>>>>> develop
                this.defaultService = instance;
            }

            return this;
        },
        /**
         * Optional creates, then registers an Sage.SData.Client.SDataService and adds the result to `App.services`.
         * @param {String} name Unique identifier for the service.
         * @param {Object} definition May be a SDataService instance or constructor parameters to create a new SDataService instance.
         * @param {Object} options Optional settings for the registered service.
         */
<<<<<<< HEAD
        registerConnection: function registerConnection(name, definition, options) {
            options = options || {};

            var instance = definition instanceof Sage.SData.Client.SDataService ? definition : new Sage.SData.Client.SDataService(definition);
=======
        registerConnection: function(name, definition, options) {
            options = options || {};

            var instance = definition instanceof Sage.SData.Client.SDataService
                ? definition
                : new Sage.SData.Client.SDataService(definition);
>>>>>>> develop

            this._connections[name] = instance;

            if (this.enableCaching && (options.offline || definition.offline)) {
                instance.on('beforerequest', this._loadSDataRequest, this);
                instance.on('requestcomplete', this._cacheSDataRequest, this);
            }

<<<<<<< HEAD
            if (options.isDefault || definition.isDefault || !this._connections['default']) {
=======
            if ((options.isDefault || definition.isDefault) || !this._connections['default']) {
>>>>>>> develop
                this._connections['default'] = instance;
            }

            return this;
        },
        /**
         * Determines the the specified service name is found in the Apps service object.
         * @param {String} name Name of the SDataService to detect
         */
<<<<<<< HEAD
        hasService: function hasService(name) {
            // TODO: Remove this method
            return !!this.services[name];
        },
        _createViewContainers: function _createViewContainers() {
            var node = document.getElementById('viewContainer'),
                drawers;
=======
        hasService: function(name) {
            // TODO: Remove this method
            return !!this.services[name];
        },
        _createViewContainers: function() {
            var node = document.getElementById('viewContainer'), drawers;
>>>>>>> develop

            if (node) {
                this._rootDomNode = node;
                return;
            }

            if (this._rootDomNode === null || typeof this._rootDomNode === 'undefined') {
                this._rootDomNode = _domConstruct['default'].create('div', {
                    'id': 'viewContainer',
                    'class': 'viewContainer'
<<<<<<< HEAD
                }, _win['default'].body());

                drawers = _domConstruct['default'].create('div', {
                    'class': 'drawers absolute'
                }, _win['default'].body());

                _domConstruct['default'].create('div', {
                    'class': 'overthrow left-drawer absolute'
                }, drawers);

                _domConstruct['default'].create('div', {
=======
                }, win.body());

                drawers = domConstruct.create('div', {
                    'class': 'drawers absolute'
                }, win.body());

                domConstruct.create('div', {
                    'class': 'overthrow left-drawer absolute'
                }, drawers);

                domConstruct.create('div', {
>>>>>>> develop
                    'class': 'overthrow right-drawer absolute'
                }, drawers);

            }
        },
        /**
         * Registers a view with the application and renders it to HTML.
         * If the application has already been initialized, the view is immediately initialized as well.
         * @param {View} view A view instance to be registered.
         * @param {domNode} domNode Optional. A DOM node to place the view in.
         */
<<<<<<< HEAD
        registerView: function registerView(view, domNode) {
=======
        registerView: function(view, domNode) {
>>>>>>> develop
            this.views[view.id] = view;

            if (!domNode) {
                this._createViewContainers();
            }

            view._placeAt = domNode || this._rootDomNode;

            this.onRegistered(view);

            return this;
        },
        /**
         * Registers a toolbar with the application and renders it to HTML.
         * If the application has already been initialized, the toolbar is immediately initialized as well.
         * @param {String} name Unique name of the toolbar
         * @param {Toolbar} tbar Toolbar instance to register
         * @param {domNode} domNode Optional. A DOM node to place the view in.
         */
<<<<<<< HEAD
        registerToolbar: function registerToolbar(name, tbar, domNode) {
=======
        registerToolbar: function(name, tbar, domNode) {
>>>>>>> develop
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
        },
        /**
         * Returns all the registered views.
         * @return {View[]} An array containing the currently registered views.
         */
<<<<<<< HEAD
        getViews: function getViews() {
            var results, view;
=======
        getViews: function() {
            var results,
                view;
>>>>>>> develop

            results = [];

            for (view in this.views) {
                if (this.views.hasOwnProperty(view)) {
                    results.push(this.views[view]);
                }
            }

            return results;
        },
        /**
         * Checks to see if the passed view instance is the currently active one by comparing it to {@link #getPrimaryActiveView primaryActiveView}.
         * @param {View} view
         * @return {Boolean} True if the passed view is the same as the active view.
         */
<<<<<<< HEAD
        isViewActive: function isViewActive(view) {
=======
        isViewActive: function(view) {
>>>>>>> develop
            // todo: add check for multiple active views.
            return this.getPrimaryActiveView() === view;
        },
        /**
         * Talks to ReUI to get the current page or dialog name and then returns the result of {@link #getView getView(name)}.
         * @return {View} Returns the active view instance, if no view is active returns null.
         */
<<<<<<< HEAD
        getPrimaryActiveView: function getPrimaryActiveView() {
            var el = _ReUI['default'].getCurrentPage() || _ReUI['default'].getCurrentDialog();
=======
        getPrimaryActiveView: function() {
            var el = ReUI.getCurrentPage() || ReUI.getCurrentDialog();
>>>>>>> develop
            if (el) {
                return this.getView(el);
            }
        },
        /**
         * Determines if any registered view has been registered with the provided key.
         * @param {String} key Unique id of the view.
         * @return {Boolean} True if there is a registered view name matching the key.
         */
<<<<<<< HEAD
        hasView: function hasView(key) {
            return !!this._internalGetView({ key: key, init: false });
=======
        hasView: function(key) {
            return !!this._internalGetView({key: key, init: false});
>>>>>>> develop
        },
        /**
         * Returns the registered view instance with the associated key.
         * @param {String/Object} key The id of the view to return, if object then `key.id` is used.
         * @return {View} view The requested view.
         */
<<<<<<< HEAD
        getView: function getView(key) {
            return this._internalGetView({ key: key, init: true });
        },
        _internalGetView: function _internalGetView(options) {
=======
        getView: function(key) {
            return this._internalGetView({key: key, init: true});
        },
        _internalGetView: function(options) {
>>>>>>> develop
            var view, key, init;

            key = options && options.key;
            init = options && options.init;

            if (key) {
                if (typeof key === 'string') {
                    view = this.views[key];
                } else if (typeof key.id === 'string') {
                    view = this.views[key.id];
                }

                if (init && view && !view._started) {
                    view.init();
                    view.placeAt(view._placeAt, 'first');
                    view._started = true;
                    view._placeAt = null;
                }

                return view;
            }

            return null;
        },
        /**
         * Returns the defined security for a specific view
         * @param {String} key Id of the registered view to query.
         * @param access
         */
<<<<<<< HEAD
        getViewSecurity: function getViewSecurity(key, access) {
            var view = this._internalGetView({ key: key, init: false });
            return view && view.getSecurity(access);
=======
        getViewSecurity: function(key, access) {
            var view = this._internalGetView({key: key, init: false});
            return (view && view.getSecurity(access));
>>>>>>> develop
        },
        /**
         * Returns the registered SDataService instance by name, or returns the default service.
         * @param {String/Boolean} name If string service is looked up by name. If false, default service is returned.
         * @return {Object} The registered Sage.SData.Client.SDataService instance.
         */
<<<<<<< HEAD
        getService: function getService(name) {
=======
        getService: function(name) {
>>>>>>> develop
            // TODO: Remove this method
            if (typeof name === 'string' && this.services[name]) {
                return this.services[name];
            }

            return this.defaultService;
        },
        /**
         * Determines the the specified service name is found in the Apps service object.
         * @param {String} name Name of the SDataService to detect
         */
<<<<<<< HEAD
        hasConnection: function hasConnection(name) {
            return !!this._connections[name];
        },
        getConnection: function getConnection(name) {
=======
        hasConnection: function(name) {
            return !!this._connections[name];
        },
        getConnection: function(name) {
>>>>>>> develop
            if (this._connections[name]) {
                return this._connections[name];
            }

            return this._connections['default'];
        },
        /**
         * Sets the applications current title.
         * @param {String} title The new title.
         */
<<<<<<< HEAD
        setPrimaryTitle: function setPrimaryTitle(title) {
=======
        setPrimaryTitle: function(title) {
>>>>>>> develop
            for (var n in this.bars) {
                if (this.bars.hasOwnProperty(n)) {
                    if (this.bars[n].managed) {
                        this.bars[n].set('title', title);
                    }
                }
            }

            return this;
        },
        /**
         * Resize handle, publishes the global event `/app/resize` which views may subscribe to.
         */
<<<<<<< HEAD
        onResize: function onResize() {
=======
        onResize: function() {
>>>>>>> develop
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }

<<<<<<< HEAD
            this.resizeTimer = setTimeout(function () {
                _connect['default'].publish('/app/resize', []);
            }, 100);
        },
        onRegistered: function onRegistered(view) {},
        onBeforeViewTransitionAway: function onBeforeViewTransitionAway(view) {},
        onBeforeViewTransitionTo: function onBeforeViewTransitionTo(view) {},
        onViewTransitionAway: function onViewTransitionAway(view) {},
        onViewTransitionTo: function onViewTransitionTo(view) {},
        onViewActivate: function onViewActivate(view, tag, data) {},
        _onBeforeTransition: function _onBeforeTransition(evt) {
=======
            this.resizeTimer = setTimeout(function() {
                connect.publish('/app/resize', []);
            }, 100);
        },
        onRegistered: function(view) {
        },
        onBeforeViewTransitionAway: function(view) {
        },
        onBeforeViewTransitionTo: function(view) {
        },
        onViewTransitionAway: function(view) {
        },
        onViewTransitionTo: function(view) {
        },
        onViewActivate: function(view, tag, data) {
        },
        _onBeforeTransition: function(evt) {
>>>>>>> develop
            var view = this.getView(evt.target);
            if (view) {
                if (evt.out) {
                    this._beforeViewTransitionAway(view);
                } else {
                    this._beforeViewTransitionTo(view);
                }
            }
        },
<<<<<<< HEAD
        _onAfterTransition: function _onAfterTransition(evt) {
=======
        _onAfterTransition: function(evt) {
>>>>>>> develop
            var view = this.getView(evt.target);
            if (view) {
                if (evt.out) {
                    this._viewTransitionAway(view);
                } else {
                    this._viewTransitionTo(view);
                }
            }
        },
<<<<<<< HEAD
        _onActivate: function _onActivate(evt) {
=======
        _onActivate: function(evt) {
>>>>>>> develop
            var view = this.getView(evt.target);
            if (view) {
                this._viewActivate(view, evt.tag, evt.data);
            }
        },
<<<<<<< HEAD
        _beforeViewTransitionAway: function _beforeViewTransitionAway(view) {
=======
        _beforeViewTransitionAway: function(view) {
>>>>>>> develop
            this.onBeforeViewTransitionAway(view);

            view.beforeTransitionAway();
        },
<<<<<<< HEAD
        _beforeViewTransitionTo: function _beforeViewTransitionTo(view) {
=======
        _beforeViewTransitionTo: function(view) {
>>>>>>> develop
            this.onBeforeViewTransitionTo(view);

            for (var n in this.bars) {
                if (this.bars[n].managed) {
                    this.bars[n].clear();
                }
            }

            view.beforeTransitionTo();
        },
<<<<<<< HEAD
        _viewTransitionAway: function _viewTransitionAway(view) {
=======
        _viewTransitionAway: function(view) {
>>>>>>> develop
            this.onViewTransitionAway(view);

            view.transitionAway();
        },
<<<<<<< HEAD
        _viewTransitionTo: function _viewTransitionTo(view) {
            this.onViewTransitionTo(view);

            var tools, n;

            tools = view.options && view.options.tools || view.getTools() || {};
=======
        _viewTransitionTo: function(view) {
            this.onViewTransitionTo(view);

            var tools,
                n;

            tools = (view.options && view.options.tools) || view.getTools() || {};
>>>>>>> develop

            for (n in this.bars) {
                if (this.bars[n].managed) {
                    this.bars[n].showTools(tools[n]);
                }
            }

            view.transitionTo();
        },
<<<<<<< HEAD
        _viewActivate: function _viewActivate(view, tag, data) {
=======
        _viewActivate: function(view, tag, data) {
>>>>>>> develop
            this.onViewActivate(view);

            view.activate(tag, data);
        },
        /**
         * Searches ReUI.context.history by passing a predicate function that should return true if a match is found, false otherwise.
         * This is similar to queryNavigationContext, however, this function will return an array of found items instead of a single item.
         * @param {Function} predicate
         * @param {Object} scope
         * @return {Array} context history filtered out by the predicate.
         */
<<<<<<< HEAD
        filterNavigationContext: function filterNavigationContext(predicate, scope) {
            var list, filtered;
            list = _ReUI['default'].context.history || [];
            filtered = _array['default'].filter(list, (function (item) {
                return predicate.call(scope || this, item.data);
            }).bind(this));

            return _array['default'].map(filtered, function (item) {
=======
        filterNavigationContext: function(predicate, scope) {
            var list, filtered;
            list = ReUI.context.history || [];
            filtered = array.filter(list, function(item) {
                return predicate.call(scope || this, item.data);
            }.bind(this));

            return array.map(filtered, function(item) {
>>>>>>> develop
                return item.data;
            });
        },
        /**
         * Searches ReUI.context.history by passing a predicate function that should return true
         * when a match is found.
         * @param {Function} predicate Function that is called in the provided scope with the current history iteration. It should return true if the history item is the desired context.
         * @param {Number} depth
         * @param {Object} scope
         * @return {Object/Boolean} context History data context if found, false if not.
         */
<<<<<<< HEAD
        queryNavigationContext: function queryNavigationContext(predicate, depth, scope) {
=======
        queryNavigationContext: function(predicate, depth, scope) {
>>>>>>> develop
            var i, j, list;

            if (typeof depth !== 'number') {
                scope = depth;
                depth = 0;
            }

<<<<<<< HEAD
            list = _ReUI['default'].context.history || [];
=======
            list = ReUI.context.history || [];
>>>>>>> develop

            depth = depth || 0;

            for (i = list.length - 2, j = 0; i >= 0 && (depth <= 0 || j < depth); i--, j++) {
                if (predicate.call(scope || this, list[i].data)) {
                    return list[i].data;
                }
            }

            return false;
        },
        /**
         * Shortcut method to {@link #queryNavigationContext queryNavigationContext} that matches the specified resourceKind provided
         * @param {String/String[]} kind The resourceKind(s) the history item must match
         * @param {Function} predicate Optional. If provided it will be called on matches so you may do an secondary check of the item - returning true for good items.
         * @param {Object} scope Scope the predicate should be called in.
         * @return {Object} context History data context if found, false if not.
         */
<<<<<<< HEAD
        isNavigationFromResourceKind: function isNavigationFromResourceKind(kind, predicate, scope) {
            var lookup = {};
            if (_lang['default'].isArray(kind)) {
                _array['default'].forEach(kind, function (item) {
=======
        isNavigationFromResourceKind: function(kind, predicate, scope) {
            var lookup = {};
            if (lang.isArray(kind)) {
                array.forEach(kind, function(item) {
>>>>>>> develop
                    this[item] = true;
                }, lookup);
            } else {
                lookup[kind] = true;
            }

<<<<<<< HEAD
            return this.queryNavigationContext(function (o) {
                var context = o.options && o.options.source || o,
=======
            return this.queryNavigationContext(function(o) {
                var context = (o.options && o.options.source) || o,
>>>>>>> develop
                    resourceKind = context && context.resourceKind;

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
        },
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
<<<<<<< HEAD
        registerCustomization: function registerCustomization(path, spec) {
            var customizationSet, container, id;
=======
        registerCustomization: function(path, spec) {
            var customizationSet,
                container,
                id;
>>>>>>> develop

            if (arguments.length > 2) {
                customizationSet = arguments[0];
                id = arguments[1];

                spec = arguments[2];
                path = id ? customizationSet + '#' + id : customizationSet;
            }

            container = this.customizations[path] || (this.customizations[path] = []);
            if (container) {
                container.push(spec);
            }

            return this;
        },
        /**
         * Returns the customizations registered for the provided path.
         *
         * Note: This also accepts the legacy signature:
         * `getCustomizationsFor(set, id)`
         * Where the path is `list/tools` and `id` is the view id
         *
         * @param {String} path The customization set such as `list/tools#account_list` or `detail#contact_detail`. First half being the type of customization and the second the view id.
         */
<<<<<<< HEAD
        getCustomizationsFor: function getCustomizationsFor(path) {
            var forPath, segments, customizationSet, forSet;
=======
        getCustomizationsFor: function(path) {
            var forPath,
                segments,
                customizationSet,
                forSet;
>>>>>>> develop

            if (arguments.length > 1) {
                path = arguments[1] ? arguments[0] + '#' + arguments[1] : arguments[0];
            }

            segments = path.split('#');
            customizationSet = segments[0];

            forPath = this.customizations[path] || [];
            forSet = this.customizations[customizationSet] || [];

            return forPath.concat(forSet);
        },
<<<<<<< HEAD
        hasAccessTo: function hasAccessTo(security) {
=======
        hasAccessTo: function(security) {
>>>>>>> develop
            return true;
        },
        /**
         * Override this function to load a view in the left drawer.
         */
<<<<<<< HEAD
        showLeftDrawer: function showLeftDrawer() {
=======
        showLeftDrawer: function() {
>>>>>>> develop
            return this;
        },
        /**
         * Override this function to load a view in the right drawer.
         */
<<<<<<< HEAD
        showRightDrawer: function showRightDrawer() {
=======
        showRightDrawer: function() {
>>>>>>> develop
            return this;
        },
        /**
         * Loads Snap.js and assigns the instance to App.snapper. This method would typically be called before navigating to the initial view, so the login page does not contain the menu.
         * @param {DOMNode} element Optional. Snap.js options.element property. If not provided defaults to the "viewContaienr" DOMNode.
         * @param {Object} options Optional. Snap.js options object. A default is provided if this is undefined. Providing options will override the element parameter.
         */
<<<<<<< HEAD
        loadSnapper: function loadSnapper(element, options) {
=======
        loadSnapper: function(element, options) {
>>>>>>> develop
            // TODO: Provide a domNode param and default to viewContainer if not provided
            var snapper, view;

            if (this.snapper) {
                return;
            }

<<<<<<< HEAD
            snapper = new _snap2['default'](options || {
=======
            snapper = new snap(options || {
>>>>>>> develop
                element: element || document.getElementById('viewContainer'),
                dragger: null,
                disable: 'none',
                addBodyClasses: true,
                hyperextensible: false,
                resistance: 0.1,
                flickThreshold: 50,
                transitionSpeed: 0.2,
                easing: 'ease',
                maxPosition: 266,
                minPosition: -266,
<<<<<<< HEAD
                tapToClose: (0, _has['default'])('ie') ? false : true, // causes issues on windows phones where tapping the close button causes snap.js endDrag to fire, closing the menu before we can check the state properly
=======
                tapToClose: has('ie') ? false : true, // causes issues on windows phones where tapping the close button causes snap.js endDrag to fire, closing the menu before we can check the state properly
>>>>>>> develop
                touchToDrag: false,
                slideIntent: 40,
                minDragDistance: 5
            });

            this.snapper = snapper;

            this.showLeftDrawer();
            this.showRightDrawer();
            return this;
        }
    });

    // Backwards compatibility for custom modules still referencing the old declare global
    _lang['default'].setObject('Sage.Platform.Mobile.Application', __class);
    module.exports = __class;
});

