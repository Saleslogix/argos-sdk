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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BcHBsaWNhdGlvbk1vZHVsZS5qcyJdLCJuYW1lcyI6WyJBcHBsaWNhdGlvbk1vZHVsZSIsIm9wdGlvbnMiLCJjb25maWciLCJoYXNPd25Qcm9wZXJ0eSIsImFwcGxpY2F0aW9uIiwidW5pbml0aWFsaXplIiwibG9hZEFwcFN0YXRlUHJvbWlzZXMiLCJsb2FkQ3VzdG9taXphdGlvbnMiLCJsb2FkVG9vbGJhcnMiLCJsb2FkVmlld3MiLCJsb2FkQ3VzdG9taXphdGlvbnNEeW5hbWljIiwibG9hZFRvb2xiYXJzRHluYW1pYyIsImxvYWRWaWV3c0R5bmFtaWMiLCJjdXN0b21pemF0aW9uc0xvYWRlZCIsImNvbnNvbGUiLCJ3YXJuIiwidmlld3NMb2FkZWQiLCJyZWdpc3RlclZpZXciLCJ0b29sYmFyc0xvYWRlZCIsInZpZXciLCJkb21Ob2RlIiwicG9zaXRpb24iLCJuYW1lIiwidG9vbGJhciIsInJlZ2lzdGVyVG9vbGJhciIsInNldCIsImlkIiwic3BlYyIsInJlZ2lzdGVyQ3VzdG9taXphdGlvbiIsInByb21pc2UiLCJyZWdpc3RlckFwcFN0YXRlUHJvbWlzZSIsIl9jdXN0b21pemF0aW9uc0xvYWRlZCIsInZhbHVlIiwiX3ZpZXdzTG9hZGVkIiwiX3Rvb2xiYXJzTG9hZGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTZCTUEsaUI7QUFDSixpQ0FBMEI7QUFBQSxVQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3hCLFdBQUssSUFBTUMsTUFBWCxJQUFxQkQsT0FBckIsRUFBOEI7QUFDNUIsWUFBSUEsUUFBUUUsY0FBUixDQUF1QkQsTUFBdkIsQ0FBSixFQUFvQztBQUNsQyxlQUFLQSxNQUFMLElBQWVELFFBQVFDLE1BQVIsQ0FBZjtBQUNEO0FBQ0Y7QUFDRDs7OztBQUlBLFdBQUtFLFdBQUwsR0FBbUIsSUFBbkI7QUFDRDs7OztnQ0E2QlM7QUFDUixhQUFLQyxZQUFMO0FBQ0Q7OztxQ0FLYyxDQUFFOzs7MkJBV1pELFcsRUFBYTtBQUNoQixhQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjs7QUFFQTtBQUNBLGFBQUtFLG9CQUFMO0FBQ0EsYUFBS0Msa0JBQUw7QUFDQSxhQUFLQyxZQUFMO0FBQ0EsYUFBS0MsU0FBTDtBQUNEOzs7b0NBS2E7QUFDWixhQUFLQyx5QkFBTDtBQUNBLGFBQUtDLG1CQUFMO0FBQ0EsYUFBS0MsZ0JBQUw7QUFDRDs7OzRDQUtxQjtBQUNwQixhQUFLTixvQkFBTDtBQUNEOzs7NkNBTXNCLENBQUU7OzsyQ0FNSjtBQUNuQixZQUFJTixrQkFBa0JhLG9CQUF0QixFQUE0QztBQUMxQ0Msa0JBQVFDLElBQVIsQ0FBYSwwSkFBYixFQUQwQyxDQUNnSTtBQUMxSztBQUNEOztBQUVEOztBQUVBZiwwQkFBa0JhLG9CQUFsQixHQUF5QyxJQUF6QztBQUNEOzs7a0RBTTJCLENBQzNCOzs7NENBTXFCLENBQ3JCOzs7eUNBTWtCLENBQ2xCOzs7a0NBS1c7QUFDVixZQUFJYixrQkFBa0JnQixXQUF0QixFQUFtQztBQUNqQ0Ysa0JBQVFDLElBQVIsQ0FBYSx3SUFBYixFQURpQyxDQUN1SDtBQUN4SjtBQUNEOztBQUVEO0FBQ0EsYUFBS0UsWUFBTCxDQUFrQixxQ0FBbEI7QUFDQSxhQUFLQSxZQUFMLENBQWtCLG9CQUFsQjs7QUFFQWpCLDBCQUFrQmdCLFdBQWxCLEdBQWdDLElBQWhDO0FBQ0Q7OztxQ0FLYztBQUNiLFlBQUloQixrQkFBa0JrQixjQUF0QixFQUFzQztBQUNwQ0osa0JBQVFDLElBQVIsQ0FBYSw4SUFBYixFQURvQyxDQUMwSDtBQUM5SjtBQUNEOztBQUVEOztBQUVBZiwwQkFBa0JrQixjQUFsQixHQUFtQyxJQUFuQztBQUNEOzs7bUNBT1lDLEksRUFBTUMsTyxFQUE2QjtBQUFBLFlBQXBCQyxRQUFvQix1RUFBVCxPQUFTOztBQUM5QyxZQUFJLEtBQUtqQixXQUFULEVBQXNCO0FBQ3BCLGVBQUtBLFdBQUwsQ0FBaUJhLFlBQWpCLENBQThCRSxJQUE5QixFQUFvQ0MsT0FBcEMsRUFBNkNDLFFBQTdDO0FBQ0Q7QUFDRjs7O3NDQU9lQyxJLEVBQU1DLE8sRUFBU0gsTyxFQUFTO0FBQ3RDLFlBQUksS0FBS2hCLFdBQVQsRUFBc0I7QUFDcEIsZUFBS0EsV0FBTCxDQUFpQm9CLGVBQWpCLENBQWlDRixJQUFqQyxFQUF1Q0MsT0FBdkMsRUFBZ0RILE9BQWhEO0FBQ0Q7QUFDRjs7OzRDQU9xQkssRyxFQUFLQyxFLEVBQUlDLEksRUFBTTtBQUNuQyxZQUFJLEtBQUt2QixXQUFULEVBQXNCO0FBQ3BCLGVBQUtBLFdBQUwsQ0FBaUJ3QixxQkFBakIsQ0FBdUNILEdBQXZDLEVBQTRDQyxFQUE1QyxFQUFnREMsSUFBaEQ7QUFDRDtBQUNGOzs7OENBS3VCRSxPLEVBQVM7QUFDL0IsWUFBSSxLQUFLekIsV0FBVCxFQUFzQjtBQUNwQixlQUFLQSxXQUFMLENBQWlCMEIsdUJBQWpCLENBQXlDRCxPQUF6QztBQUNEO0FBQ0Y7OzswQkF2TGlDO0FBQ2hDLGVBQU83QixrQkFBa0IrQixxQkFBekI7QUFDRCxPO3dCQUUrQkMsSyxFQUFPO0FBQ3JDaEMsMEJBQWtCK0IscUJBQWxCLEdBQTBDQyxLQUExQztBQUNEOzs7MEJBRXdCO0FBQ3ZCLGVBQU9oQyxrQkFBa0JpQyxZQUF6QjtBQUNELE87d0JBRXNCRCxLLEVBQU87QUFDNUJoQywwQkFBa0JpQyxZQUFsQixHQUFpQ0QsS0FBakM7QUFDRDs7OzBCQUUyQjtBQUMxQixlQUFPaEMsa0JBQWtCa0MsZUFBekI7QUFDRCxPO3dCQUV5QkYsSyxFQUFPO0FBQy9CaEMsMEJBQWtCa0MsZUFBbEIsR0FBb0NGLEtBQXBDO0FBQ0Q7Ozs7OztvQkFvS1loQyxpQiIsImZpbGUiOiJBcHBsaWNhdGlvbk1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IENvbmZpZ3VyZVF1aWNrQWN0aW9ucyBmcm9tICcuL1ZpZXdzL0NvbmZpZ3VyZVF1aWNrQWN0aW9ucyc7XHJcbmltcG9ydCBMaW5rVmlldyBmcm9tICcuL1ZpZXdzL0xpbmsnO1xyXG5pbXBvcnQgaW5pdEN1bHR1cmUgZnJvbSAnLi9DdWx0dXJlSW5mbyc7XHJcbmltcG9ydCAnLi9BcHBsaWNhdGlvbic7XHJcbmltcG9ydCAnLi9Nb2RlbHMvUmVjZW50bHlWaWV3ZWQvT2ZmbGluZSc7XHJcbmltcG9ydCAnLi9Nb2RlbHMvQnJpZWZjYXNlL09mZmxpbmUnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5BcHBsaWNhdGlvbk1vZHVsZVxyXG4gKiBAY2xhc3NkZXNjIEFwcGxpY2F0aW9uTW9kdWxlIGlzIGludGVuZGVkIHRvIGJlIGV4dGVuZGVkIGluIHRoZSByZXN1bHRpbmcgYXBwbGljYXRpb24gc28gdGhhdCBpdFxyXG4gKiByZWZlcmVuY2VzIGFsbCB0aGUgdmlld3MsIHRvb2xiYXJzIGFuZCBjdXN0b21pemF0aW9ucyBhbmQgcmVnaXN0ZXJzIHRoZW0gdG8gQXBwLlxyXG4gKlxyXG4gKiBZb3UgbWF5IHRoaW5rIG9mIEFwcGxpY2F0aW9uTW9kdWxlIGFzIFwibG9hZGVyXCIgb3IgaW5pdGlhbGl6ZXIuXHJcbiAqL1xyXG5jbGFzcyBBcHBsaWNhdGlvbk1vZHVsZSB7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcbiAgICBmb3IgKGNvbnN0IGNvbmZpZyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGNvbmZpZykpIHtcclxuICAgICAgICB0aGlzW2NvbmZpZ10gPSBvcHRpb25zW2NvbmZpZ107XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICAgKiBUaGUge0BsaW5rIEFwcCBBcHB9IGluc3RhbmNlIGZvciB0aGUgYXBwbGljYXRpb25cclxuICAgICAqL1xyXG4gICAgdGhpcy5hcHBsaWNhdGlvbiA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IGN1c3RvbWl6YXRpb25zTG9hZGVkKCkge1xyXG4gICAgcmV0dXJuIEFwcGxpY2F0aW9uTW9kdWxlLl9jdXN0b21pemF0aW9uc0xvYWRlZDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZXQgY3VzdG9taXphdGlvbnNMb2FkZWQodmFsdWUpIHtcclxuICAgIEFwcGxpY2F0aW9uTW9kdWxlLl9jdXN0b21pemF0aW9uc0xvYWRlZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCB2aWV3c0xvYWRlZCgpIHtcclxuICAgIHJldHVybiBBcHBsaWNhdGlvbk1vZHVsZS5fdmlld3NMb2FkZWQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0IHZpZXdzTG9hZGVkKHZhbHVlKSB7XHJcbiAgICBBcHBsaWNhdGlvbk1vZHVsZS5fdmlld3NMb2FkZWQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgdG9vbGJhcnNMb2FkZWQoKSB7XHJcbiAgICByZXR1cm4gQXBwbGljYXRpb25Nb2R1bGUuX3Rvb2xiYXJzTG9hZGVkO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldCB0b29sYmFyc0xvYWRlZCh2YWx1ZSkge1xyXG4gICAgQXBwbGljYXRpb25Nb2R1bGUuX3Rvb2xiYXJzTG9hZGVkID0gdmFsdWU7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIERlc3Ryb3kgbG9vcHMgYW5kIGRpc2Nvbm5lY3RzIGFsbCBgX2Nvbm5lY3RgcyBhbmQgdW5zdWJzY3JpYmVzIGFsbCBgX3N1YnNjcmliZWBzLlxyXG4gICAqIEFsc28gY2FsbHMge0BsaW5rICN1bmluaXRpYWxpemUgdW5pbml0aWFsaXplfVxyXG4gICAqL1xyXG4gIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLnVuaW5pdGlhbGl6ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybXMgYW55IGFkZGl0aW9uYWwgZGVzdHJ1Y3Rpb24gcmVxdWlyZW1lbnRzXHJcbiAgICovXHJcbiAgdW5pbml0aWFsaXplKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogU2F2ZXMgdGhlIHBhc3NlZCBhcHBsaWNhdGlvbiBpbnN0YW5jZSBhbmQgY2FsbHM6XHJcbiAgICpcclxuICAgKiAxLiB7QGxpbmsgI2xvYWRDdXN0b21pemF0aW9ucyBsb2FkQ3VzdG9taXphdGlvbnN9XHJcbiAgICogMS4ge0BsaW5rICNsb2FkVG9vbGJhcnMgbG9hZFRvb2xiYXJzfVxyXG4gICAqIDEuIHtAbGluayAjbG9hZFZpZXdzIGxvYWRWaWV3c31cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcHBsaWNhdGlvblxyXG4gICAqL1xyXG4gIGluaXQoYXBwbGljYXRpb24pIHtcclxuICAgIHRoaXMuYXBwbGljYXRpb24gPSBhcHBsaWNhdGlvbjtcclxuXHJcbiAgICBpbml0Q3VsdHVyZSgpO1xyXG4gICAgdGhpcy5sb2FkQXBwU3RhdGVQcm9taXNlcygpO1xyXG4gICAgdGhpcy5sb2FkQ3VzdG9taXphdGlvbnMoKTtcclxuICAgIHRoaXMubG9hZFRvb2xiYXJzKCk7XHJcbiAgICB0aGlzLmxvYWRWaWV3cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogaW5pdER5bmFtaWMgaXMgaW52b2tlZCBhZnRlciBhcHBTdGF0ZVByb21pc2VzIHJ1bi5cclxuICAgKi9cclxuICBpbml0RHluYW1pYygpIHtcclxuICAgIHRoaXMubG9hZEN1c3RvbWl6YXRpb25zRHluYW1pYygpO1xyXG4gICAgdGhpcy5sb2FkVG9vbGJhcnNEeW5hbWljKCk7XHJcbiAgICB0aGlzLmxvYWRWaWV3c0R5bmFtaWMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBkZXByZWNhdGVkIC0gdHlwbywgdXNlIGxvYWRBcHBTdGF0ZVByb21pc2VzIGluc3RlYWQuXHJcbiAgICovXHJcbiAgbG9hZEFwcFN0YXRQcm9taXNlcygpIHtcclxuICAgIHRoaXMubG9hZEFwcFN0YXRlUHJvbWlzZXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiB0aGUgYXBwIGFuZCBiZSB1c2VkIHRvIHJlZ2lzdGVyIGFsbCBhcHAgc3RhdGUgcHJvbWlzZXMuXHJcbiAgICovXHJcbiAgbG9hZEFwcFN0YXRlUHJvbWlzZXMoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIGFwcCBhbmQgYmUgdXNlZCB0byByZWdpc3RlciBhbGwgY3VzdG9taXphdGlvbnMuXHJcbiAgICovXHJcbiAgbG9hZEN1c3RvbWl6YXRpb25zKCkge1xyXG4gICAgaWYgKEFwcGxpY2F0aW9uTW9kdWxlLmN1c3RvbWl6YXRpb25zTG9hZGVkKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignTXVsdGlwbGUgY2FsbHMgdG8gbG9hZEN1c3RvbWl6YXRpb25zIGRldGVjdGVkLiBFbnN1cmUgeW91ciBjdXN0b21pemF0aW9uIGlzIG5vdCBjYWxsaW5nIHRoaXMuaW5oZXJpdGVkIGZyb20gbG9hZEN1c3RvbWl6YXRpb25zIGluIHRoZSBBcHBsaWNhdGlvbk1vZHVsZS4nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9hZCBiYXNlIGN1c3RvbWl6YXRpb25zXHJcblxyXG4gICAgQXBwbGljYXRpb25Nb2R1bGUuY3VzdG9taXphdGlvbnNMb2FkZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbG9hZEN1c3RvbWl6YXRpb25zRHluYW1pYyBpcyBpbnZva2VkIGFmdGVyIGFwcFN0YXRlUHJvbWlzZXMgcnVuLlxyXG4gICAqIEB2aXJ0dWFsXHJcbiAgICovXHJcbiAgbG9hZEN1c3RvbWl6YXRpb25zRHluYW1pYygpIHtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRUb29sYmFyc0R5bmFtaWMgaXMgaW52b2tlZCBhZnRlciBhcHBTdGF0ZVByb21pc2VzIHJ1bi5cclxuICAgKiBAdmlydHVhbFxyXG4gICAqL1xyXG4gIGxvYWRUb29sYmFyc0R5bmFtaWMoKSB7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBsb2FkVmlld3NEeW5hbWljIGlzIGludm9rZWQgYWZ0ZXIgYXBwU3RhdGVQcm9taXNlcyBydW4uXHJcbiAgICogQHZpcnR1YWxcclxuICAgKi9cclxuICBsb2FkVmlld3NEeW5hbWljKCkge1xyXG4gIH1cclxuICAvKipcclxuICAgKiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIGFwcCBhbmQgYmUgdXNlZCB0byByZWdpc3RlciBhbGwgdmlld3MuXHJcbiAgICogQHZpcnR1YWxcclxuICAgKi9cclxuICBsb2FkVmlld3MoKSB7XHJcbiAgICBpZiAoQXBwbGljYXRpb25Nb2R1bGUudmlld3NMb2FkZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNdWx0aXBsZSBjYWxscyB0byBsb2FkVmlld3MgZGV0ZWN0ZWQuIEVuc3VyZSB5b3VyIGN1c3RvbWl6YXRpb24gaXMgbm90IGNhbGxpbmcgdGhpcy5pbmhlcml0ZWQgZnJvbSBsb2FkVmlld3MgaW4gdGhlIEFwcGxpY2F0aW9uTW9kdWxlLicpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMb2FkIGJhc2Ugdmlld3NcclxuICAgIHRoaXMucmVnaXN0ZXJWaWV3KG5ldyBDb25maWd1cmVRdWlja0FjdGlvbnMoKSk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhuZXcgTGlua1ZpZXcoKSk7XHJcblxyXG4gICAgQXBwbGljYXRpb25Nb2R1bGUudmlld3NMb2FkZWQgPSB0cnVlO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIGFwcCBhbmQgYmUgdXNlZCB0byByZWdpc3RlciBhbGwgdG9vbGJhcnMuXHJcbiAgICogQHZpcnR1YWxcclxuICAgKi9cclxuICBsb2FkVG9vbGJhcnMoKSB7XHJcbiAgICBpZiAoQXBwbGljYXRpb25Nb2R1bGUudG9vbGJhcnNMb2FkZWQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNdWx0aXBsZSBjYWxscyB0byBsb2FkVG9vbGJhcnMgZGV0ZWN0ZWQuIEVuc3VyZSB5b3VyIGN1c3RvbWl6YXRpb24gaXMgbm90IGNhbGxpbmcgdGhpcy5pbmhlcml0ZWQgZnJvbSBsb2FkVG9vbGJhcnMgaW4gdGhlIEFwcGxpY2F0aW9uTW9kdWxlLicpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMb2FkIGJhc2UgdG9vbGJhcnNcclxuXHJcbiAgICBBcHBsaWNhdGlvbk1vZHVsZS50b29sYmFyc0xvYWRlZCA9IHRydWU7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIFBhc3NlcyB0aGUgdmlldyBpbnN0YW5jZSB0byB7QGxpbmsgQXBwI3JlZ2lzdGVyVmlldyBBcHAucmVnaXN0ZXJWaWV3fS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gdmlldyBWaWV3IGluc3RhbmNlIHRvIHJlZ2lzdGVyXHJcbiAgICogQHBhcmFtIHtET01Ob2RlfSBkb21Ob2RlIE9wdGlvbmFsLiBET00gbm9kZSB0byBwbGFjZSB0aGUgdmlldyBpbi5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcG9zaXRpb24gT3B0aW9uYWwuIFRoZSBwb3NpdGlvbiB0byBwbGFjZSBpbiB0aGUgZ2l2ZW4gRE9NIG5vZGUuIChmaXJzdCwgbGFzdClcclxuICAgKi9cclxuICByZWdpc3RlclZpZXcodmlldywgZG9tTm9kZSwgcG9zaXRpb24gPSAnZmlyc3QnKSB7XHJcbiAgICBpZiAodGhpcy5hcHBsaWNhdGlvbikge1xyXG4gICAgICB0aGlzLmFwcGxpY2F0aW9uLnJlZ2lzdGVyVmlldyh2aWV3LCBkb21Ob2RlLCBwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIFBhc3NlcyB0aGUgdG9vbGJhciBpbnN0YW5jZSB0byB7QGxpbmsgQXBwI3JlZ2lzdGVyVG9vbGJhciBBcHAucmVnaXN0ZXJUb29sYmFyfS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBVbmlxdWUgbmFtZSBvZiB0aGUgdG9vbGJhciB0byByZWdpc3Rlci5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9vbGJhciBUb29sYmFyIGluc3RhbmNlIHRvIHJlZ2lzdGVyLlxyXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZG9tTm9kZSBPcHRpb25hbC4gRE9NIG5vZGUgdG8gcGxhY2UgdGhlIHZpZXcgaW4uXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJUb29sYmFyKG5hbWUsIHRvb2xiYXIsIGRvbU5vZGUpIHtcclxuICAgIGlmICh0aGlzLmFwcGxpY2F0aW9uKSB7XHJcbiAgICAgIHRoaXMuYXBwbGljYXRpb24ucmVnaXN0ZXJUb29sYmFyKG5hbWUsIHRvb2xiYXIsIGRvbU5vZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvKipcclxuICAgKiBQYXNzZXMgdGhlIGN1c3RvbWl6YXRpb24gaW5zdGFuY2UgdG8ge0BsaW5rIEFwcCNyZWdpc3RlckN1c3RvbWl6YXRpb24gQXBwLnJlZ2lzdGVyQ3VzdG9taXphdGlvbn0uXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNldCBUaGUgY3VzdG9taXphdGlvbiBzZXQgbmFtZSwgb3IgdHlwZS4gRXhhbXBsZXM6IGBsaXN0YCwgYGRldGFpbC90b29sc2AsIGBsaXN0L2hhc2hUYWdRdWVyaWVzYFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgVmlldyBpZCB0aGUgY3VzdG9taXphdGlvbiB3aWxsIGJlIGFwcGxpZWQgdG9cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc3BlYyBUaGUgY3VzdG9taXphdGlvbiBvYmplY3QgY29udGFpbmluZyBhdCBsZWFzdCBgYXRgIGFuZCBgdHlwZWAuXHJcbiAgICovXHJcbiAgcmVnaXN0ZXJDdXN0b21pemF0aW9uKHNldCwgaWQsIHNwZWMpIHtcclxuICAgIGlmICh0aGlzLmFwcGxpY2F0aW9uKSB7XHJcbiAgICAgIHRoaXMuYXBwbGljYXRpb24ucmVnaXN0ZXJDdXN0b21pemF0aW9uKHNldCwgaWQsIHNwZWMpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvKipcclxuICAgKiBSZWdpc3RlcnMgYSBwcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdoZW4gaW5pdEFwcFN0YXRlIGlzIGludm9rZWQuXHJcbiAgICogQHBhcmFtIHtQcm9taXNlfEZ1bmN0aW9ufSBwcm9taXNlIEEgcHJvbWlzZSBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2VcclxuICAgKi9cclxuICByZWdpc3RlckFwcFN0YXRlUHJvbWlzZShwcm9taXNlKSB7XHJcbiAgICBpZiAodGhpcy5hcHBsaWNhdGlvbikge1xyXG4gICAgICB0aGlzLmFwcGxpY2F0aW9uLnJlZ2lzdGVyQXBwU3RhdGVQcm9taXNlKHByb21pc2UpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb25Nb2R1bGU7XHJcbiJdfQ==