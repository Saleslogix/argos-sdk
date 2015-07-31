define('argos/ApplicationModule', ['exports', 'module', 'dojo/_base/array', 'dojo/_base/connect', 'dojo/_base/declare', 'dojo/_base/lang', './Application', './Views/ConfigureQuickActions'], function (exports, module, _dojo_baseArray, _dojo_baseConnect, _dojo_baseDeclare, _dojo_baseLang, _Application, _ViewsConfigureQuickActions) {
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

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _Application2 = _interopRequireDefault(_Application);

  var _ConfigureQuickActions = _interopRequireDefault(_ViewsConfigureQuickActions);

  /**
   * @class argos.ApplicationModule
   * ApplicationModule is intended to be extended in the resulting application so that it
   * references all the views, toolbars and customizations and registers them to App.
   *
   * You may think of ApplicationModule as "loader" or initializer.
   * @alternateClassName ApplicationModule
   * @requires argos.Application
   */
  var __class = (0, _declare['default'])('argos.ApplicationModule', null, {
    /**
     * @property {Array}
     * Array of dojo.connect bound to ApplicationModule
     */
    _connects: null,
    /**
     * @property {Array}
     * Array of dojo.subscribe bound to ApplicationModule
     */
    _subscribes: null,
    /**
     * @property {Object}
     * The {@link App App} instance for the application
     */
    application: null,
    /**
     * Mixes in the passed options object into itself
     * @param {Object} options Properties to be mixed in
     */
    constructor: function constructor(options) {
      this._connects = [];
      this._subscribes = [];

      _lang['default'].mixin(this, options);
    },
    /**
     * Destroy loops and disconnects all `_connect`s and unsubscribes all `_subscribe`s.
     * Also calls {@link #uninitialize uninitialize}
     */
    destroy: function destroy() {
      _array['default'].forEach(this._connects, function (handle) {
        _connect['default'].disconnect(handle);
      });

      _array['default'].forEach(this._subscribes, function (handle) {
        _connect['default'].unsubscribe(handle);
      });

      this.uninitialize();
    },
    /**
     * Performs any additional destruction requirements
     */
    uninitialize: function uninitialize() {},
    /**
     * Saves the passed application instance and calls:
     *
     * 1. {@link #loadCustomizations loadCustomizations}
     * 1. {@link #loadToolbars loadToolbars}
     * 1. {@link #loadViews loadViews}
     *
     * @param {Object} application
     */
    init: function init(application) {
      this.application = application;

      this.loadAppStatPromises();
      this.loadCustomizations();
      this.loadToolbars();
      this.loadViews();
    },
    /**
     * @template
     * This function should be overriden in the app and be used to register all app state promises.
     */
    loadAppStatPromises: function loadAppStatPromises() {},

    statics: {
      _customizationsLoaded: false,
      _viewsLoaded: false,
      _toolbarsLoaded: false
    },

    /**
     * @template
     * This function should be overriden in the app and be used to register all customizations.
     */
    loadCustomizations: function loadCustomizations() {
      if (this.statics._customizationsLoaded) {
        console.warn('Multiple calls to loadCustomizations detected. Ensure your customization is not calling this.inherited from loadCustomizations in the ApplicationModule.');
        return;
      }

      // Load base customizations

      this.statics._customizationsLoaded = true;
    },
    /**
     * @template
     * This function should be overriden in the app and be used to register all views.
     */
    loadViews: function loadViews() {
      if (this.statics._viewsLoaded) {
        console.warn('Multiple calls to loadViews detected. Ensure your customization is not calling this.inherited from loadViews in the ApplicationModule.');
        return;
      }

      // Load base views
      this.registerView(new _ConfigureQuickActions['default']());

      this.statics._viewsLoaded = true;
    },
    /**
     * @template
     * This function should be overriden in the app and be used to register all toolbars.
     */
    loadToolbars: function loadToolbars() {
      if (this.statics._toolbarsLoaded) {
        console.warn('Multiple calls to loadToolbars detected. Ensure your customization is not calling this.inherited from loadToolbars in the ApplicationModule.');
        return;
      }

      // Load base toolbars

      this.statics._toolbarsLoaded = true;
    },
    /**
     * Passes the view instance to {@link App#registerView App.registerView}.
     * @param {Object} view View instance to register
     * @param {DOMNode} domNode Optional. DOM node to place the view in.
     */
    registerView: function registerView(view, domNode) {
      if (this.application) {
        this.application.registerView(view, domNode);
      }
    },
    /**
     * Passes the toolbar instance to {@link App#registerToolbar App.registerToolbar}.
     * @param {String} name Unique name of the toolbar to register.
     * @param {Object} toolbar Toolbar instance to register.
     * @param {DOMNode} domNode Optional. DOM node to place the view in.
     */
    registerToolbar: function registerToolbar(name, toolbar, domNode) {
      if (this.application) {
        this.application.registerToolbar(name, toolbar, domNode);
      }
    },
    /**
     * Passes the customization instance to {@link App#registerCustomization App.registerCustomization}.
     * @param {String} set The customization set name, or type. Examples: `list`, `detail/tools`, `list/hashTagQueries`
     * @param {String} id The View id the customization will be applied to
     * @param {Object} spec The customization object containing at least `at` and `type`.
     */
    registerCustomization: function registerCustomization(set, id, spec) {
      if (this.application) {
        this.application.registerCustomization(set, id, spec);
      }
    },
    /**
     * Registers a promise that will resolve when initAppState is invoked.
     * @param {Promise|Function} promise A promise or a function that returns a promise
     */
    registerAppStatePromise: function registerAppStatePromise(promise) {
      if (this.application) {
        this.application.registerAppStatePromise(promise);
      }
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.ApplicationModule', __class);
  module.exports = __class;
});
