define('argos/ApplicationModule', ['module', 'exports', './Views/ConfigureQuickActions', './Views/Link', './CultureInfo', './Application', './Models/RecentlyViewed/Offline', './Models/Briefcase/Offline'], function (module, exports, _ConfigureQuickActions, _Link, _CultureInfo) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ConfigureQuickActions2 = _interopRequireDefault(_ConfigureQuickActions);

  var _Link2 = _interopRequireDefault(_Link);

  var _CultureInfo2 = _interopRequireDefault(_CultureInfo);

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

  let ApplicationModule = function () {
    _createClass(ApplicationModule, null, [{
      key: 'sdkViewsLoaded',
      get: function () {
        return ApplicationModule._sdkViewsLoaded;
      },
      set: function (val) {
        ApplicationModule._sdkViewsLoaded = val;
      }
    }]);

    function ApplicationModule(options = {}) {
      _classCallCheck(this, ApplicationModule);

      for (const config in options) {
        if (options.hasOwnProperty(config)) {
          this[config] = options[config];
        }
      }
      /**
       * @property {Object}
       * The {@link App App} instance for the application
       */
      this.application = null;
      this._viewsLoaded = false;
    }

    /**
     * Destroy loops and disconnects all `_connect`s and unsubscribes all `_subscribe`s.
     * Also calls {@link #uninitialize uninitialize}
     */


    _createClass(ApplicationModule, [{
      key: 'destroy',
      value: function destroy() {
        this.uninitialize();
      }
    }, {
      key: 'uninitialize',
      value: function uninitialize() {}
    }, {
      key: 'init',
      value: function init(application) {
        this.application = application;

        (0, _CultureInfo2.default)();
        this.loadAppStatePromises();
        this.loadCustomizations();
        this.loadToolbars();
        this.loadViews();
        this._loadSDKViews();
        this.loadCache();
      }
    }, {
      key: 'initDynamic',
      value: function initDynamic() {
        this.loadCustomizationsDynamic();
        this.loadToolbarsDynamic();
        this.loadViewsDynamic();
      }
    }, {
      key: 'loadAppStatPromises',
      value: function loadAppStatPromises() {
        this.loadAppStatePromises();
      }
    }, {
      key: 'loadAppStatePromises',
      value: function loadAppStatePromises() {}
    }, {
      key: 'loadCustomizations',
      value: function loadCustomizations() {}
    }, {
      key: 'loadCustomizationsDynamic',
      value: function loadCustomizationsDynamic() {}
    }, {
      key: 'loadToolbarsDynamic',
      value: function loadToolbarsDynamic() {}
    }, {
      key: 'loadViewsDynamic',
      value: function loadViewsDynamic() {}
    }, {
      key: 'loadViews',
      value: function loadViews() {}
    }, {
      key: '_loadSDKViews',
      value: function _loadSDKViews() {
        if (ApplicationModule.sdkViewsLoaded) {
          return;
        }

        this.registerView(new _ConfigureQuickActions2.default());
        this.registerView(new _Link2.default());
        ApplicationModule.sdkViewsLoaded = true;
      }
    }, {
      key: 'loadToolbars',
      value: function loadToolbars() {}
    }, {
      key: 'loadCache',
      value: function loadCache() {}
    }, {
      key: 'registerView',
      value: function registerView(view, domNode, position = 'first') {
        if (this.application) {
          this.application.registerView(view, domNode, position);
        }
      }
    }, {
      key: 'registerToolbar',
      value: function registerToolbar(name, toolbar, domNode) {
        if (this.application) {
          this.application.registerToolbar(name, toolbar, domNode);
        }
      }
    }, {
      key: 'registerCustomization',
      value: function registerCustomization(set, id, spec) {
        if (this.application) {
          this.application.registerCustomization(set, id, spec);
        }
      }
    }, {
      key: 'registerAppStatePromise',
      value: function registerAppStatePromise(promise) {
        if (this.application) {
          this.application.registerAppStatePromise(promise);
        }
      }
    }]);

    return ApplicationModule;
  }();

  exports.default = ApplicationModule;
  module.exports = exports['default'];
});