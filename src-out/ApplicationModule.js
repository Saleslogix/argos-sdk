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

  var ApplicationModule = function () {
    function ApplicationModule() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ApplicationModule);

      for (var config in options) {
        if (options.hasOwnProperty(config)) {
          this[config] = options[config];
        }
      }
      /**
       * @property {Object}
       * The {@link App App} instance for the application
       */
      this.application = null;
    }

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
      value: function loadCustomizations() {
        if (ApplicationModule.customizationsLoaded) {
          console.warn('Multiple calls to loadCustomizations detected. Ensure your customization is not calling this.inherited from loadCustomizations in the ApplicationModule.'); // eslint-disable-line
          return;
        }

        // Load base customizations

        ApplicationModule.customizationsLoaded = true;
      }
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
      value: function loadViews() {
        if (ApplicationModule.viewsLoaded) {
          console.warn('Multiple calls to loadViews detected. Ensure your customization is not calling this.inherited from loadViews in the ApplicationModule.'); // eslint-disable-line
          return;
        }

        // Load base views
        this.registerView(new _ConfigureQuickActions2.default());
        this.registerView(new _Link2.default());

        ApplicationModule.viewsLoaded = true;
      }
    }, {
      key: 'loadToolbars',
      value: function loadToolbars() {
        if (ApplicationModule.toolbarsLoaded) {
          console.warn('Multiple calls to loadToolbars detected. Ensure your customization is not calling this.inherited from loadToolbars in the ApplicationModule.'); // eslint-disable-line
          return;
        }

        // Load base toolbars

        ApplicationModule.toolbarsLoaded = true;
      }
    }, {
      key: 'registerView',
      value: function registerView(view, domNode) {
        var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'first';

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
    }], [{
      key: 'customizationsLoaded',
      get: function get() {
        return ApplicationModule._customizationsLoaded;
      },
      set: function set(value) {
        ApplicationModule._customizationsLoaded = value;
      }
    }, {
      key: 'viewsLoaded',
      get: function get() {
        return ApplicationModule._viewsLoaded;
      },
      set: function set(value) {
        ApplicationModule._viewsLoaded = value;
      }
    }, {
      key: 'toolbarsLoaded',
      get: function get() {
        return ApplicationModule._toolbarsLoaded;
      },
      set: function set(value) {
        ApplicationModule._toolbarsLoaded = value;
      }
    }]);

    return ApplicationModule;
  }();

  exports.default = ApplicationModule;
  module.exports = exports['default'];
});