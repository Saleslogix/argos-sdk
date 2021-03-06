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
 * @module argos/ApplicationModule
 */
import ConfigureQuickActions from './Views/ConfigureQuickActions';
import LinkView from './Views/Link';
import initCulture from './CultureInfo';
import './Application';
import './Models/RecentlyViewed/Offline';
import './Models/Briefcase/Offline';

/**
 * @class
 * @alias module:argos/ApplicationModule
 * @abstract
 * @classdesc ApplicationModule is intended to be extended in the resulting application so that it
 * references all the views, toolbars and customizations and registers them to App.
 *
 * You may think of ApplicationModule as "loader" or initializer.
 */
class ApplicationModule {
  static get sdkViewsLoaded() {
    return ApplicationModule._sdkViewsLoaded;
  }

  static set sdkViewsLoaded(val) {
    ApplicationModule._sdkViewsLoaded = val;
  }

  constructor(options = {}) {
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
  destroy() {
    this.uninitialize();
  }

  /**
   * Performs any additional destruction requirements
   */
  uninitialize() {}

  /**
   * Saves the passed application instance and calls:
   *
   * 1. {@link #loadCustomizations loadCustomizations}
   * 1. {@link #loadToolbars loadToolbars}
   * 1. {@link #loadViews loadViews}
   *
   * @param {Object} application
   */
  init(application) {
    this.application = application;

    initCulture();
    this.loadAppStatePromises();
    this.loadCustomizations();
    this.loadToolbars();
    this.loadViews();
    this._loadSDKViews();
    this.loadCache();
  }

  /**
   * initDynamic is invoked after appStatePromises run.
   */
  initDynamic() {
    this.loadCustomizationsDynamic();
    this.loadToolbarsDynamic();
    this.loadViewsDynamic();
  }

  /**
   * @deprecated - typo, use loadAppStatePromises instead.
   */
  loadAppStatPromises() {
    this.loadAppStatePromises();
  }

  /**
   * @template
   * This function should be overriden in the app and be used to register all app state promises.
   */
  loadAppStatePromises() {}

  /**
   * @template
   * This function should be overriden in the app and be used to register all customizations.
   */
  loadCustomizations() {
  }

  /**
   * loadCustomizationsDynamic is invoked after appStatePromises run.
   * @virtual
   */
  loadCustomizationsDynamic() {
  }

  /**
   * loadToolbarsDynamic is invoked after appStatePromises run.
   * @virtual
   */
  loadToolbarsDynamic() {
  }

  /**
   * loadViewsDynamic is invoked after appStatePromises run.
   * @virtual
   */
  loadViewsDynamic() {
  }
  /**
   * This function should be overriden in the app and be used to register all views.
   * @virtual
   */
  loadViews() {
  }
  _loadSDKViews() {
    if (ApplicationModule.sdkViewsLoaded) {
      return;
    }

    this.registerView(new ConfigureQuickActions());
    this.registerView(new LinkView());
    ApplicationModule.sdkViewsLoaded = true;
  }
  /**
   * This function should be overriden in the app and be used to register all toolbars.
   * @virtual
   */
  loadToolbars() {
  }

  /**
   * Loading cache resource should happen here.
   * @virtual
   */
  loadCache() {
  }
  /**
   * Passes the view instance to {@link App#registerView App.registerView}.
   * @param {Object} view View instance to register
   * @param {DOMNode} domNode Optional. DOM node to place the view in.
   * @param {String} position Optional. The position to place in the given DOM node. (first, last)
   */
  registerView(view, domNode, position = 'first') {
    if (this.application) {
      this.application.registerView(view, domNode, position);
    }
  }
  /**
   * Passes the toolbar instance to {@link App#registerToolbar App.registerToolbar}.
   * @param {String} name Unique name of the toolbar to register.
   * @param {Object} toolbar Toolbar instance to register.
   * @param {DOMNode} domNode Optional. DOM node to place the view in.
   */
  registerToolbar(name, toolbar, domNode) {
    if (this.application) {
      this.application.registerToolbar(name, toolbar, domNode);
    }
  }
  /**
   * Passes the customization instance to {@link App#registerCustomization App.registerCustomization}.
   * @param {String} set The customization set name, or type. Examples: `list`, `detail/tools`, `list/hashTagQueries`
   * @param {String} id The View id the customization will be applied to
   * @param {Object} spec The customization object containing at least `at` and `type`.
   */
  registerCustomization(set, id, spec) {
    if (this.application) {
      this.application.registerCustomization(set, id, spec);
    }
  }
  /**
   * Registers a promise that will resolve when initAppState is invoked.
   * @param {Promise|Function} promise A promise or a function that returns a promise
   */
  registerAppStatePromise(promise) {
    if (this.application) {
      this.application.registerAppStatePromise(promise);
    }
  }
}

export default ApplicationModule;
