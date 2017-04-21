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
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import when from 'dojo/when';
import format from './Format';
import utility from './Utility';
import ErrorManager from './ErrorManager';
import View from './View';
import TabWidget from './TabWidget';
import getResource from './I18n';


const resource = getResource('detailBase');

/**
 * @class argos._DetailBase
 * A Detail View represents a single record and should display all the info the user may need about the entry.
 *
 * A Detail entry is identified by its key (idProperty) which is how it requests the data via the endpoint.
 *
 * @alternateClassName _DetailBase
 * @extends argos.View
 * @requires argos.Format
 * @requires argos.Utility
 * @requires argos.ErrorManager
 */
const __class = declare('argos._DetailBase', [View, TabWidget], {
  /**
   * @property {Object}
   * Creates a setter map to html nodes, namely:
   *
   * * detailContent => contentNode's innerHTML
   *
   */
  attributeMap: {
    detailContent: {
      node: 'contentNode',
      type: 'innerHTML',
    },
  },
  /**
   * @property {Simplate}
   * The template used to render the view's main DOM element when the view is initialized.
   * This template includes loadingTemplate.
   *
   * The default template uses the following properties:
   *
   *      name                description
   *      ----------------------------------------------------------------
   *      id                   main container div id
   *      title                main container div title attr
   *      cls                  additional class string added to the main container div
   *      resourceKind         set to data-resource-kind
   *
   */
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" title="{%= $.titleText %}" class="detail panel scrollable {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
    '{%! $.loadingTemplate %}',
    '{%! $.quickActionTemplate %}',
    '<div class="column" data-dojo-attach-point="contentNode">',
    '{%! $.tabContentTemplate %}',
    '</div>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML shown when no data is available.
   */
  emptyTemplate: new Simplate([]),
  /**
   * @property {Simplate}
   * HTML shown when data is being loaded.
   *
   * `$` => the view instance
   */
  loadingTemplate: new Simplate([
    '<div class="panel-loading-indicator">',
    '<div class="busy-indicator-container blocked-ui" aria-live="polite">',
    '<div class="busy-indicator active">',
    '<div class="bar one"></div>',
    '<div class="bar two"></div>',
    '<div class="bar three"></div>',
    '<div class="bar four"></div>',
    '<div class="bar five"></div>',
    '</div>',
    '<span>{%: $.loadingText %}</span>',
    '</div>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that creates the quick action list
   */
  quickActionTemplate: new Simplate([
    '<div class="quick-actions" data-dojo-attach-point="quickActions"></div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that creates the detail header displaying information about the tab list
   *
   * `$` => the view instance
   */
  detailHeaderTemplate: new Simplate([
    '<div class="detail-header">',
    '{%: $.value %}',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that starts a new section
   *
   * `$` => the view instance
   */
  sectionBeginTemplate: new Simplate([
    '{% if (!$$.isTabbed) { %}',
    '<h2 data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">',
    '<button class="{% if ($.collapsed) { %}{%: $$.toggleExpandClass %}{% } else { %}{%: $$.toggleCollapseClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>',
    '{%: ($.title || $.options.title) %}',
    '</h2>',
    '{% } %}',
    '{% if ($.list || $.options.list) { %}',
    '{% if ($.cls || $.options.cls) { %}',
    '<ul class="{%= ($.cls || $.options.cls) %}" id="{%: $$.id %}_{%: $.name %}">',
    '{% } else { %}',
    '<ul class="detailContent tab-panel listview" id="{%: $$.id %}_{%: $.name %}">',
    '{% } %}',
    '{% } else { %}',
    '{% if ($.cls || $.options.cls) { %}',
    '<div class="tab-panel {%= ($.cls || $.options.cls) %}" id="{%: $$.id %}_{%: $.name %}">',
    '{% } else { %}',
    '<div class="detailContent tab-panel summary-form" id="{%: $$.id %}_{%: $.name %}">',
    '{% } %}',
    '{% } %}',
  ]),
  /**
   * @property {Simplate}
   * HTML that ends a section
   *
   * `$` => the view instance
   */
  sectionEndTemplate: new Simplate([
    '{% if ($.list || $.options.list) { %}',
    '</ul>',
    '{% } else { %}',
    '</div>',
    '{% } %}',
  ]),
  /**
   * @property {Simplate}
   * HTML that is used for a property in the detail layout
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  propertyTemplate: new Simplate([
    '<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}" data-property="{%= $.property || $.name %}">',
    '<label>{%: $.label %}</label>',
    '<span class="data">{%= $.value %}</span>', // todo: create a way to allow the value to not be surrounded with a span tag
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that is used for detail layout items that point to related views, includes a label and links the value text
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  relatedPropertyTemplate: new Simplate([
    '<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}">',
    '<label>{%: $.label %}</label>',
    '<span class="data">',
    '<a class="hyperlink" data-action="activateRelatedEntry" data-view="{%= $.view %}" data-context="{%: $.context %}" data-descriptor="{%: $.descriptor || $.value %}">',
    '{%= $.value %}',
    '</a>',
    '</span>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that is used for detail layout items that point to related views, displayed as an icon and text
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  relatedTemplate: new Simplate([
    '<li class="relatedviewitem {%= $.cls %}" data-action="activateRelatedList" data-view="{%= $.view %}" data-context="{%: $.context %}" {% if ($.disabled) { %}data-disable-action="true"{% } %}>',
    '<a class="{% if ($.disabled) { %}disabled{% } %}">',
    '{% if ($.icon) { %}',
    '<img src="{%= $.icon %}" alt="icon" class="icon" />',
    '{% } else if ($.iconClass) { %}',
    '<div class="{%= $.iconClass %}" alt="icon"></div>',
    '{% } %}',
    '<span class="related-item-label">',
    '<div class="busy-xs badge"',
    '<div class="busy-indicator-container" aria-live="polite">',
    '<div class="busy-indicator active">',
    '<div class="bar one"></div>',
    '<div class="bar two"></div>',
    '<div class="bar three"></div>',
    '<div class="bar four"></div>',
    '<div class="bar five"></div>',
    '</div>',
    '</div>',
    '</div>',
    '{%: $.label %}</span>',
    '</a>',
    '</li>',
  ]),
  /**
   * @property {Simplate}
   * HTML that is used for detail layout items that fire an action, displayed with label and property value
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  actionPropertyTemplate: new Simplate([
    '<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}">',
    '<label>{%: $.label %}</label>',
    '<span class="data">',
    '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
    '{%= $.value %}',
    '</a>',
    '</span>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that is used for detail layout items that fire an action, displayed as an icon and text
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  actionTemplate: new Simplate([
    '<li class="{%= $.cls %}{% if ($.disabled) { %} disabled{% } %}">',
    '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
    '{% if ($.icon) { %}',
    '<img src="{%= $.icon %}" alt="icon" class="icon" />',
    '{% } else if ($.iconClass) { %}',
    `<button type="button" class="btn-icon hide-focus">
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>
      </svg>
    </button>`,
    '{% } %}',
    '<label>{%: $.label %}</label>',
    '<span class="data">{%= $.value %}</span>',
    '</a>',
    '</li>',
  ]),
  /**
   * @property {Simplate}
   * HTML that is shown when not available
   *
   * `$` => the view instance
   */
  notAvailableTemplate: new Simplate([
    '<p class="not-available">{%: $.notAvailableText %}</p>',
  ]),
  /**
   * @property {String}
   * The unique identifier of the view
   */
  id: 'generic_detail',
  /**
   * @property {Object}
   * The dojo store this view will use for data exchange.
   */
  store: null,
  /**
   * @property {Object}
   * The data entry
   */
  entry: null,
  /**
   * @property {Object}
   * The layout definition that constructs the detail view with sections and rows
   */
  layout: null,
  /**
   * @cfg {String/Object}
   * May be used for verifying the view is accessible
   */
  security: false,
  /**
   * @property {String}
   * The customization identifier for this class. When a customization is registered it is passed
   * a path/identifier which is then matched to this property.
   */
  customizationSet: 'detail',
  /**
   * @property {Boolean}
   * Controls if the view should be exposed
   */
  expose: false,
  /**
   * @property {Boolean}
   * Controls whether the view will render as a tab view or the previous list view
   */
  isTabbed: true,
  /**
   * @property {String}
   * Controls how the view determines the quick action section by mapping this string with that on the detail view (should be overwritten)
   */
  quickActionSection: 'QuickActionsSection',
  /**
   * @deprecated
   */
  editText: resource.editText,
  /**
   * @cfg {String}
   * Font awesome icon to be used by the more list item
   */
  icon: 'fa fa-chevron',

  viewType: 'detail',
  /**
   * @cfg {String}
   * Information text that is concatenated with the entity type
   */
  informationText: resource.informationText,
  /**
   * @cfg {String}
   * Default title text shown in the top toolbar
   */
  titleText: resource.titleText,
  /**
   * @cfg {String}
   * Default text used in the header title, followed by information
   */
  entityText: resource.entityText,
  /**
   * @property {String}
   * Helper string for a basic section header text
   */
  detailsText: resource.detailsText,
  /**
   * @property {String}
   * Text shown while loading and used in loadingTemplate
   */
  loadingText: resource.loadingText,
  /**
   * @property {String}
   * Text used in the notAvailableTemplate
   */
  notAvailableText: resource.notAvailableText,
  /**
   * @property {String}
   * ARIA label text for a collapsible section header
   */
  toggleCollapseText: resource.toggleCollapseText,
  /**
   * @property {String}
   * CSS class for the collapse button when in a expanded state
   */
  toggleCollapseClass: 'fa fa-chevron-down',
  /**
   * @property {String}
   * CSS class for the collapse button when in a collapsed state
   */
  toggleExpandClass: 'fa fa-chevron-right',
  /**
   * @cfg {String}
   * The view id to be taken to when the Edit button is pressed in the toolbar
   */
  editView: false,
  /**
   * @property {Object[]}
   * Store for mapping layout options to an index on the HTML node
   */
  _navigationOptions: null,
  /**
   * @property {Boolean}
   * Flag to signal that the interface is loading and clicking refresh will be ignored to prevent double entity loading
   */
  isRefreshing: false,

  // Store properties
  itemsProperty: '',
  idProperty: '',
  labelProperty: '',
  entityProperty: '',
  versionProperty: '',

  /**
   * Extends the dijit widget postCreate to subscribe to the global `/app/refresh` event and clear the view.
   */
  postCreate: function postCreate() {
    this.inherited(arguments);
    this.subscribe('/app/refresh', this._onRefresh);
    this.clear();
  },
  createErrorHandlers: function createErrorHandlers() {
    this.errorHandlers = this.errorHandlers || [{
      name: 'Aborted',
      test: (error) => {
        return error.aborted;
      },
      handle: (error, next) => {
        this.options = false; // force a refresh
        next();
      },
    }, {
      name: 'AlertError',
      test: (error) => {
        return error.status !== this.HTTP_STATUS.NOT_FOUND && !error.aborted;
      },
      handle: (error, next) => {
        alert(this.getErrorMessage(error)); //eslint-disable-line
        next();
      },
    }, {
      name: 'NotFound',
      test: (error) => {
        return error.status === this.HTTP_STATUS.NOT_FOUND;
      },
      handle: (error, next) => {
        $(this.contentNode).empty().append(this.notAvailableTemplate.apply(this));
        next();
      },
    }, {
      name: 'CatchAll',
      test: () => true,
      handle: (error, next) => {
        const fromContext = this.options.fromContext;
        this.options.fromContext = null;
        const errorItem = {
          viewOptions: this.options,
          serverError: error,
        };

        ErrorManager.addError(this.getErrorMessage(error), errorItem);
        this.options.fromContext = fromContext;
        $(this.domNode).removeClass('panel-loading');
        next();
      },
    }];

    return this.errorHandlers;
  },
  /**
   * Sets and returns the toolbar item layout definition, this method should be overriden in the view
   * so that you may define the views toolbar items.
   * @return {Object} this.tools
   * @template
   */
  createToolLayout: function createToolLayout() {
    const tools = [];

    if (this.editView) {
      tools.push({
        id: 'edit',
        svg: 'edit',
        action: 'navigateToEditView',
        security: App.getViewSecurity(this.editView, 'update'),
      });
    }

    tools.push({
      id: 'refresh',
      svg: 'refresh',
      action: '_refreshClicked',
    });

    return this.tools || (this.tools = {
      tbar: tools,
    });
  },
  _refreshClicked: function _refreshClicked() {
    // If the user has hit refresh already, let the interface load first set of assets
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.clear();
    this.refreshRequired = true;
    this.refresh();

    this.onRefreshClicked();
  },
  /**
   * Called when the user clicks the refresh toolbar button.
   */
  onRefreshClicked: function onRefreshClicked() {},
  /**
   * Extends the {@link _ActionMixin#invokeAction mixins invokeAction} to stop if `data-disableAction` is true
   * @param name
   * @param {Object} parameters Collection of `data-` attributes from the node
   * @param {Event} evt
   * @param {HTMLElement} el
   */
  invokeAction: function invokeAction(name, parameters /* , evt, el*/) {
    if (parameters && /true/i.test(parameters.disableAction)) {
      return null;
    }
    return this.inherited(arguments);
  },
  /**
   * Toggles the collapsed state of the section.
   */
  toggleSection: function toggleSection(params) {
    const node = $(`#${params.$source}`);
    if (node.length) {
      node.toggleClass('collapsed');
      const button = $('button', node).first();
      if (button.length) {
        button.toggleClass(this.toggleCollapseClass);
        button.toggleClass(this.toggleExpandClass);
      }
    }
  },
  /**
   * Handler for the getting the detail resource type from the id and placing the header into the detail view..
   * @private
   */
  placeDetailHeader: function placeDetailHeader() {
    const value = `${this.entityText} ${this.informationText}`;
    $(this.tabContainer).before(this.detailHeaderTemplate.apply({ value }, this));
  },
  /**
   * Handler for the global `/app/refresh` event. Sets `refreshRequired` to true if the key matches.
   * @param {Object} options The object published by the event.
   * @private
   */
  _onRefresh: function _onRefresh(o) {
    const descriptor = o.data && o.data[this.labelProperty];

    if (this.options && this.options.key === o.key) {
      this.refreshRequired = true;

      if (descriptor) {
        this.options.title = descriptor;
        this.set('title', descriptor);
      }
    }
  },
  /**
   * Handler for the related entry action, navigates to the defined `data-view` passing the `data-context`.
   * @param {Object} params Collection of `data-` attributes from the source node.
   */
  activateRelatedEntry: function activateRelatedEntry(params) {
    if (params.context) {
      this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
    }
  },
  /**
   * Handler for the related list action, navigates to the defined `data-view` passing the `data-context`.
   * @param {Object} params Collection of `data-` attributes from the source node.
   */
  activateRelatedList: function activateRelatedList(params) {
    if (params.context) {
      this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
    }
  },
  /**
   * Navigates to the defined `this.editView` passing the current `this.entry` as default data.
   * @param {HTMLElement} el
   */
  navigateToEditView: function navigateToEditView(/* el*/) {
    const view = App.getView(this.editView);
    if (view) {
      const entry = this.entry;
      view.show({
        entry,
        fromContext: this,
      });
    }
  },
  /**
   * Navigates to a given view id passing the options retrieved using the slot index to `this._navigationOptions`.
   * @param {String} id View id to go to
   * @param {Number} slot Index of the context to use in `this._navigationOptions`.
   * @param {String} descriptor Optional descriptor option that is mixed in.
   */
  navigateToRelatedView: function navigateToRelatedView(id, slot, descriptor) {
    const options = this._navigationOptions[slot];
    const view = App.getView(id);

    if (descriptor && options) {
      options.descriptor = descriptor;
    }

    if (this.entry) {
      options.selectedEntry = this.entry;
    }

    options.fromContext = this;
    if (view && options) {
      view.show(options);
    }
  },
  /**
   * Sets and returns the Detail view layout by following a standard for section and rows:
   *
   * The `this.layout` itself is an array of section objects where a section object is defined as such:
   *
   *     {
   *        name: 'String', // Required. unique name for identification/customization purposes
   *        title: 'String', // Required. Text shown in the section header
   *        list: boolean, // Optional. Default false. Controls if the group container for child rows should be a div (false) or ul (true)
   *        children: [], // Array of child row objects
   *     }
   *
   * A child row object has:
   *
   *     {
   *        name: 'String', // Required. unique name for identification/customization purposes
   *        property: 'String', // Optional. The property of the current entity to bind to
   *        label: 'String', // Optional. Text shown in the label to the left of the property
   *        onCreate: function(), // Optional. You may pass a function to be called when the row is added to the DOM
   *        include: boolean, // Optional. If false the row will not be included in the layout
   *        exclude: boolean, // Optional. If true the row will not be included in the layout
   *        template: Simplate, // Optional. Override the HTML Simplate used for rendering the value (not the row) where `$` is the row object
   *        tpl: Simplate, // Optional. Same as template.
   *        renderer: function(), // Optional. Pass a function that receives the current value and returns a value to be rendered
   *        encode: boolean, // Optional. If true it will encode HTML entities
   *        cls: 'String', // Optional. Additional CSS class string to be added to the row div
   *        use: Simplate, // Optional. Override the HTML Simplate used for rendering the row (not value)
   *        provider: function(entry, propertyName), // Optional. Function that accepts the data entry and the property name and returns the extracted value. By default simply extracts directly.
   *        value: Any // Optional. Provide a value directly instead of binding
   *     }
   *
   * @return {Object[]} Detail layout definition
   */
  createLayout: function createLayout() {
    return this.layout || [];
  },
  /**
   * Processes the given layout definition using the data entry response by rendering and inserting the HTML nodes and
   * firing any onCreate events defined.
   * @param {Object[]} layout Layout definition
   * @param {Object} entry data response
   */
  processLayout: function processLayout(layout, entry) {
    const rows = (layout.children || layout.as || layout);
    const options = layout.options || (layout.options = {
      title: this.detailsText,
    });
    const sectionQueue = [];
    let sectionStarted = false;
    const callbacks = [];

    let sectionNode;

    if (this.isTabbed) {
      this.placeTabList(this.contentNode);
    }

    for (let i = 0; i < rows.length; i++) {
      const current = rows[i];
      const include = this.expandExpression(current.include, entry);
      const exclude = this.expandExpression(current.exclude, entry);
      let context;

      if (include !== undefined && !include) {
        continue;
      }

      if (exclude !== undefined && exclude) {
        continue;
      }

      if (current.children || current.as) {
        if (sectionStarted) {
          sectionQueue.push(current);
        } else {
          this.processLayout(current, entry);
        }

        continue;
      }

      if (!sectionStarted) {
        let section;
        sectionStarted = true;
        if (this.isTabbed) {
          if (layout.name === this.quickActionSection) {
            section = $(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
            sectionNode = section.get(0);
            $(this.quickActions).append(section);
          } else {
            const tab = $(this.tabListItemTemplate.apply(layout, this)).get(0);
            section = $(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
            sectionNode = section.get(0);
            this.tabMapping.push(section.get(0));
            this.tabs.push(tab);
            $(this.tabContainer).append(section);
          }
        } else {
          section = $(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
          sectionNode = section.get(0).childNodes[1];
          $(this.tabContainer).append(section);
        }
      }

      const provider = current.provider || utility.getValue;
      const property = typeof current.property === 'string' ? current.property : current.name;
      const value = typeof current.value === 'undefined' ? provider(entry, property, entry) : current.value;
      let rendered;
      let formatted;
      if (current.template || current.tpl) {
        rendered = (current.template || current.tpl).apply(value, this);
        formatted = current.encode === true ? format.encode(rendered) : rendered;
      } else if (current.renderer && typeof current.renderer === 'function') {
        rendered = current.renderer.call(this, value);
        formatted = current.encode === true ? format.encode(rendered) : rendered;
      } else {
        formatted = current.encode !== false ? format.encode(value) : value;
      }

      const data = lang.mixin({}, {
        entry,
        value: formatted,
        raw: value,
      }, current);

      if (current.descriptor) {
        data.descriptor = typeof current.descriptor === 'function' ? this.expandExpression(current.descriptor, entry, value) : provider(entry, current.descriptor);
      }

      if (current.action) {
        data.action = this.expandExpression(current.action, entry, value);
      }

      const hasAccess = App.hasAccessTo(current.security);

      if (current.security) {
        data.disabled = !hasAccess;
      }

      if (current.disabled && hasAccess) {
        data.disabled = this.expandExpression(current.disabled, entry, value);
      }

      if (current.view) {
        context = lang.mixin({}, current.options);

        if (current.key) {
          context.key = typeof current.key === 'function' ? this.expandExpression(current.key, entry) : provider(entry, current.key);
        }
        if (current.where) {
          context.where = this.expandExpression(current.where, entry);
          if (context.where === '') {
            data.disabled = true;
          }
        }
        if (current.resourceKind) {
          context.resourceKind = this.expandExpression(current.resourceKind, entry);
        }
        if (current.resourceProperty) {
          context.resourceProperty = this.expandExpression(current.resourceProperty, entry);
        }
        if (current.resourcePredicate) {
          context.resourcePredicate = this.expandExpression(current.resourcePredicate, entry);
        }
        if (current.dataSet) {
          context.dataSet = this.expandExpression(current.dataSet, entry);
        }
        if (current.title) {
          context.title = current.title;
        }

        if (current.resetSearch) {
          context.resetSearch = current.resetSearch;
        } else {
          context.resetSearch = true;
        }

        data.view = current.view;
        data.context = (this._navigationOptions.push(context) - 1);
      }

      const useListTemplate = (layout.list || options.list);

      let template;
      // priority: use > (relatedPropertyTemplate | relatedTemplate) > (actionPropertyTemplate | actionTemplate) > propertyTemplate
      if (current.use) {
        template = current.use;
      } else if (current.view && useListTemplate) {
        template = this.relatedTemplate;
        current.relatedItem = true;
      } else if (current.view) {
        template = this.relatedPropertyTemplate;
      } else if (current.action && useListTemplate) {
        template = this.actionTemplate;
      } else if (current.action) {
        template = this.actionPropertyTemplate;
      } else {
        template = this.propertyTemplate;
      }

      const rowNode = this.createRowNode(current, sectionNode, entry, template, data);
      if (current.relatedItem) {
        try {
          this._processRelatedItem(data, context, rowNode);
        } catch (e) {
          // error processing related node
          console.error(e); //eslint-disable-line
        }
      }

      if (current.onCreate) {
        callbacks.push({
          row: current,
          node: rowNode,
          value,
          entry,
        });
      }
    }

    for (let i = 0; i < callbacks.length; i++) {
      const item = callbacks[i];
      item.row.onCreate.apply(this, [item.row, item.node, item.value, item.entry]);
    }

    for (let i = 0; i < sectionQueue.length; i++) {
      const current = sectionQueue[i];
      this.processLayout(current, entry);
    }
    this.isRefreshing = false;
  },
  createRowNode: function createRowNode(layout, sectionNode, entry, template, data) {
    const frag = $(template.apply(data, this));
    $(sectionNode).append(frag);
    return frag.get(0);
  },
  _getStoreAttr: function _getStoreAttr() {
    return this.store || (this.store = this.createStore());
  },
  /**
   * CreateStore is the core of the data handling for Detail Views. By default it is empty but it should return
   * a dojo store of your choosing. There are {@link _SDataDetailMixin Mixins} available for SData.
   * @return {*}
   */
  createStore: function createStore() {
    return null;
  },
  /**
   * @template
   * Optional processing of the returned entry before it gets processed into layout.
   * @param {Object} entry Entry from data store
   * @return {Object} By default does not do any processing
   */
  preProcessEntry: function preProcessEntry(entry) {
    return entry;
  },
  /**
   * Takes the entry from the data store, applies customization, applies any custom item process and then
   * passes it to process layout.
   * @param {Object} entry Entry from data store
   */
  processEntry: function processEntry(entry) {
    this.entry = this.preProcessEntry(entry);

    if (this.entry) {
      this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
      if (this.isTabbed) {
        this.createTabs(this.tabs);
        this.placeDetailHeader(this.entry);
      }
    } else {
      this.set('detailContent', '');
    }
  },
  _onGetComplete: function _onGetComplete(entry) {
    try {
      if (entry) {
        this.processEntry(entry);
      } else {
        $(this.contentNode).empty().append(this.notAvailableTemplate.apply(this));
      }

      $(this.domNode).removeClass('panel-loading');

      /* this must take place when the content is visible */
      this.onContentChange();
    } catch (e) {
      console.error(e); //eslint-disable-line
    } finally {
      this.isRefreshing = false;
    }
  },
  _onGetError: function _onGetError(getOptions, error) {
    this.handleError(error);
    this.isRefreshing = false;
  },
  /**
   * Initiates the request.
   */
  requestData: function requestData() {
    $(this.domNode).addClass('panel-loading');

    const store = this.get('store');

    if (this._model) {
      return this.requestDataUsingModel().then((data) => {
        this._onGetComplete(data);
      }, (err) => {
        this._onGetError(null, err);
      });
    } else if (store) {
      const getOptions = {};

      this._applyStateToGetOptions(getOptions);

      const getExpression = this._buildGetExpression() || null;
      const getResults = this.requestDataUsingStore(getExpression, getOptions);

      when(getResults,
        this._onGetComplete.bind(this),
        this._onGetError.bind(this, getOptions)
      );

      return getResults;
    }

    throw new Error('requestData called without a model or store defined.');
  },
  requestDataUsingModel: function requestDataUsingModel() {
    const key = this._buildGetExpression();
    return this._model.getEntry(key, this.options);
  },
  requestDataUsingStore: function requestDataUsingStore(getExpression, getOptions) {
    const store = this.get('store');
    return store.get(getExpression, getOptions);
  },
  _buildGetExpression: function _buildGetExpression() {
    const options = this.options;
    return options && (options.id || options.key);
  },
  _applyStateToGetOptions: function _applyStateToGetOptions(/* getOptions*/) {},
  /**
   * Determines if the view should be refresh by inspecting and comparing the passed navigation option key with current key.
   * @param {Object} options Passed navigation options.
   * @return {Boolean} True if the view should be refreshed, false if not.
   */
  refreshRequiredFor: function refreshRequiredFor(options) {
    if (this.options) {
      if (options) {
        if (this.options.key !== options.key) {
          return true;
        }
      }

      return false;
    }

    return this.inherited(arguments);
  },
  /**
   * Extends the {@link View#activate parent implementation} to set the nav options title attribute to the descriptor
   * @param tag
   * @param data
   */
  activate: function activate(tag, data) {
    const options = data && data.options;
    if (options && options.descriptor) {
      options.title = options.title || options.descriptor;
    }

    this.inherited(arguments);
  },
  show: function show(options) {
    if (options && options.descriptor) {
      options.title = options.title || options.descriptor;
    }

    this.inherited(arguments);
  },
  /**
   * Returns the view key
   * @return {String} View key
   */
  getTag: function getTag() {
    return this.options && this.options.key;
  },
  /**
   * Extends the {@link View#getContext parent implementation} to also set the resourceKind, key and descriptor
   * @return {Object} View context object
   */
  getContext: function getContext() {
    return lang.mixin(this.inherited(arguments), {
      resourceKind: this.resourceKind,
      key: this.options.key,
      descriptor: this.options.descriptor,
    });
  },
  /**
   * Extends the {@link View#beforeTransitionTo parent implementation} to also clear the view if `refreshRequired` is true
   * @return {Object} View context object
   */
  beforeTransitionTo: function beforeTransitionTo() {
    this.inherited(arguments);

    if (this.refreshRequired) {
      this.clear();
    }
  },
  /**
   * If a security breach is detected it sets the content to the notAvailableTemplate, otherwise it calls
   * {@link #requestData requestData} which starts the process sequence.
   */
  refresh: function refresh() {
    if (this.security && !App.hasAccessTo(this.expandExpression(this.security))) {
      $(this.contentNode).append(this.notAvailableTemplate.apply(this));
      return;
    }

    this.requestData();
  },
  /**
   * Clears the view by replacing the content with the empty template and emptying the stored row contexts.
   */
  clear: function clear() {
    this.set('detailContent', this.emptyTemplate.apply(this));
    this.clearTabs();
    if (this.quickActions) {
      $(this.quickActions).empty();
    }

    this._navigationOptions = [];
  },
  _processRelatedItem: function _processRelatedItem(data, context, rowNode) {
    const view = App.getView(data.view);
    const options = {};

    const renderRelated = (result) => {
      if (result >= 0) {
        const labelNode = $('.related-item-label', rowNode).first();
        if (labelNode.length) {
          $('.busy-xs', labelNode).remove();
          labelNode.before(`<span class="info badge">${result}</span>`);
        } else {
          console.warn('Missing the "related-item-label" dom node.'); //eslint-disable-line
        }
      }
    };

    if (view && context && context.where) {
      options.where = context.where;
      view.getListCount(options)
        .then(renderRelated);
    } else {
      renderRelated(0);
    }
  },
  destroy: function destroy() {
    this.inherited(arguments);
  },
});

export default __class;
