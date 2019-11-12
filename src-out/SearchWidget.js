define('argos/SearchWidget', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_WidgetBase', './_Templated', './I18n'], function (module, exports, _declare, _lang, _WidgetBase2, _Templated2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('searchWidget');

  /**
   * @class argos.SearchWidget
   * @classdesc
   * Search Widget is an SData-enabled search component that {@link List List} uses by default for search.
   *
   * The search widget is a dijit Widget with all the Widget aspects.
   *
   * It supports two types of shortcuts:
   *
   * 1\. `#text` - The key `text` will be replaced with the matching expression. This is a "hashtag".
  
   * 2\. `#!Name eq 'John'` - The `Name eq 'John'` will be inserted directly, avoiding {@link List#formatSearchQuery formatSearchQuery}. This is a "custom expression".
   *
   * Multiple hashtags is supported as well as hashtags with additional text that gets sent through {@link List#formatSearchQuery formatSearchQuery}.
   *
   * To go through a full example, take this expression:
   * `#open #urgent Bob`
   *
   * `#open` is replaced with: `TicketStatus eq 1`
   *
   * `#urgent` is replaced with: `TicketUrgency gt 3`
   *
   * `Bob` is passed to `formatSearchQuery` which returns `TicketId eq ("Bob") or TicketOwner like "Bob"
   *
   * The final result is "anded" together, resulting in this final where clause:
   * `where=(TicketStatus eq 1) and (TicketUrgency gt 3) and (TicketId eq ("Bob") or TicketOwner like "Bob")
   *
   * See the [Defining Hash Tags guide](#!/guides/v2_beyond_the_guide_defining_hashtags) for more information and how it supports localization.
   * @mixins argos._Templated
   */
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

  var __class = (0, _declare2.default)('argos.SearchWidget', [_WidgetBase3.default, _Templated3.default], /** @lends argos.SearchWidget.prototype */{
    /**
     * Provides a setter for HTML node attributes, namely the value for search text
     * @property {Object}
     * @memberof argos.SearchWidget
     */
    attributeMap: {
      queryValue: {
        node: 'queryNode',
        type: 'attribute',
        attribute: 'value'
      }
    },

    /**
     * Simple that defines the HTML Markup
     * @property {Simplate}
     * @memberof argos.SearchWidget
     */
    widgetTemplate: new Simplate(['\n    <span class="searchfield-wrapper">\n      <input type="text" title="{%= $.searchText %}" placeholder="{%= $.searchText %}" name="query" class="searchfield" autocorrect="off" autocapitalize="off" data-dojo-attach-point="queryNode" data-dojo-attach-event="onkeypress:_onKeyPress"  />\n      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-search"></use>\n      </svg>\n    </span>\n    ']),

    /**
     * Text that is used when no value is in the search box - "placeholder" text.
     * @property {String}
     */
    searchText: resource.searchText,

    /**
     * @property {RegExp}
     * The regular expression used to determine if a search query is a custom search expression.  A custom search
     * expression is not processed, and directly passed to SData.
     * @memberof argos.SearchWidget
     */
    customSearchRE: /^#!/,
    /**
     * The regular expression used to determine if a search query is a hash tag search.
     * @type {RegExp}
     * @memberof argos.SearchWidget
     */
    hashTagSearchRE: /(?:#|;|,|\.)([^\s]+)/g,
    /**
     * @property {Object[]}
     * Array of hash tag definitions
     */
    hashTagQueries: null,
    /**
     * Dojo attach point to the search input
     */
    queryNode: null,

    /**
     * Sets search text to empty and removes active styling
     */
    clear: function clear() {
      this.set('queryValue', '');
    },
    /**
     * This function is invoked from the search button and it:
     *
     * * Gathers the inputted search text
     * * Determines if its a custom expression, hash tag, or normal search
     * * Calls the appropriate handler
     * * Fires the {@link #onSearchExpression onSearchExpression} event which {@link List#_onSearchExpression listens to}.
     */
    search: function search() {
      var formattedQuery = this.getFormattedSearchQuery();
      this.onSearchExpression(formattedQuery, this);
    },
    /**
     * Returns an unmodified search query which allows a user
     * to type in their own where clause
     * @param {String} query Value of search box
     * @returns {String} query Unformatted query
     */
    customSearch: function customSearch(queryValue) {
      this.customSearchRE.lastIndex = 0;
      var query = queryValue.replace(this.customSearchRE, '');
      return query;
    },
    /**
     * Returns the search query based on a hash selector
     * Any hash tags in the search are replaced by predefined search statements
     * Remaining text not preceded by a hash will receive
     * that views normal search formatting
     * @param {String} query Value of search box
     * @returns {String} query Hash resolved query
     */
    hashTagSearch: function hashTagSearch(query) {
      var hashLayout = this.hashTagQueries || [];
      var hashQueries = [];
      var additionalSearch = query;

      this.hashTagSearchRE.lastIndex = 0;
      var newQuery = query;
      var match = void 0;

      while (match = this.hashTagSearchRE.exec(newQuery)) {
        // eslint-disable-line
        var hashQueryExpression = null;
        var hashTag = match[1];

        // todo: can optimize later if necessary
        for (var i = 0; i < hashLayout.length && !hashQueryExpression; i++) {
          if (hashLayout[i].tag.substr(1) === hashTag || hashLayout[i].key === hashTag) {
            hashQueryExpression = hashLayout[i].query;
          }
        }

        if (!hashQueryExpression) {
          continue;
        }

        hashQueries.push(this.expandExpression(hashQueryExpression));
        additionalSearch = additionalSearch.replace(match[0], '');
      }

      if (hashQueries.length < 1) {
        return this.formatSearchQuery(query);
      }

      newQuery = '(' + hashQueries.join(') and (') + ')';

      additionalSearch = additionalSearch.replace(/^\s+|\s+$/g, '');

      if (additionalSearch) {
        newQuery += ' and (' + this.formatSearchQuery(additionalSearch) + ')';
      }

      return newQuery;
    },
    /**
     * Configure allows the controller List view to overwrite properties as the passed object will be mixed in.
     * @param {Object} options Properties to be mixed into Search Widget
     */
    configure: function configure(options) {
      // todo: for now, we simply mixin the options
      _lang2.default.mixin(this, options);
    },
    /**
     * Expands the passed expression if it is a function.
     * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
     * @return {String} String expression.
     */
    expandExpression: function expandExpression(expression) {
      if (typeof expression === 'function') {
        return expression.apply(this, Array.prototype.slice.call(arguments, 1));
      }

      return expression;
    },
    /**
     * Detects the enter/return key and fires {@link #search search}
     * @param {Event} evt Key press event
     */
    _onKeyPress: function _onKeyPress(evt) {
      if (evt.keyCode === 13 || evt.keyCode === 10) {
        evt.preventDefault();
        evt.stopPropagation();
        this.queryNode.blur();
        this.search();
      }
    },
    /**
     * @deprecated
     */
    _onClearClick: function _onClearClick() {
      console.warn('This method is deprecated.'); // eslint-disable-line
    },
    /**
     * The event that fires when the search widget provides a search query.
     * Listened to by the controlling {@link List#_onSearchExpression List View}
     * @param expression
     * @param widget
     */
    onSearchExpression: function onSearchExpression() /* expression, widget*/{},
    /**
     * Gets the current search expression as a formatted query.
     * * Gathers the inputted search text
     * * Determines if its a custom expression, hash tag, or normal search
     */
    getFormattedSearchQuery: function getFormattedSearchQuery() {
      var searchQuery = this.getSearchExpression();
      var isCustomMatch = searchQuery && this.customSearchRE.test(searchQuery);
      var isHashTagMatch = searchQuery && this.hashTagSearchRE.test(searchQuery);

      var formattedQuery = void 0;

      switch (true) {
        case isCustomMatch:
          formattedQuery = this.customSearch(searchQuery);
          break;
        case isHashTagMatch:
          formattedQuery = this.hashTagSearch(searchQuery);
          break;
        default:
          formattedQuery = this.formatSearchQuery(searchQuery);
      }

      if (_lang2.default.trim(searchQuery) === '') {
        formattedQuery = null;
      }
      return formattedQuery;
    },
    /**
     * Gets the current search expression.
     * * Gathers the inputted search text
     */
    getSearchExpression: function getSearchExpression() {
      return this.queryNode.value;
    },
    disable: function disable() {
      if (this.queryNode) {
        this.queryNode.disabled = true;
        $(this.domNode).addClass('disabled');
      }
    },
    enable: function enable() {
      if (this.queryNode) {
        this.queryNode.disabled = false;
        $(this.domNode).removeClass('disabled');
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TZWFyY2hXaWRnZXQuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiYXR0cmlidXRlTWFwIiwicXVlcnlWYWx1ZSIsIm5vZGUiLCJ0eXBlIiwiYXR0cmlidXRlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInNlYXJjaFRleHQiLCJjdXN0b21TZWFyY2hSRSIsImhhc2hUYWdTZWFyY2hSRSIsImhhc2hUYWdRdWVyaWVzIiwicXVlcnlOb2RlIiwiY2xlYXIiLCJzZXQiLCJzZWFyY2giLCJmb3JtYXR0ZWRRdWVyeSIsImdldEZvcm1hdHRlZFNlYXJjaFF1ZXJ5Iiwib25TZWFyY2hFeHByZXNzaW9uIiwiY3VzdG9tU2VhcmNoIiwibGFzdEluZGV4IiwicXVlcnkiLCJyZXBsYWNlIiwiaGFzaFRhZ1NlYXJjaCIsImhhc2hMYXlvdXQiLCJoYXNoUXVlcmllcyIsImFkZGl0aW9uYWxTZWFyY2giLCJuZXdRdWVyeSIsIm1hdGNoIiwiZXhlYyIsImhhc2hRdWVyeUV4cHJlc3Npb24iLCJoYXNoVGFnIiwiaSIsImxlbmd0aCIsInRhZyIsInN1YnN0ciIsImtleSIsInB1c2giLCJleHBhbmRFeHByZXNzaW9uIiwiZm9ybWF0U2VhcmNoUXVlcnkiLCJqb2luIiwiY29uZmlndXJlIiwib3B0aW9ucyIsIm1peGluIiwiZXhwcmVzc2lvbiIsImFwcGx5IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJfb25LZXlQcmVzcyIsImV2dCIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImJsdXIiLCJfb25DbGVhckNsaWNrIiwiY29uc29sZSIsIndhcm4iLCJzZWFyY2hRdWVyeSIsImdldFNlYXJjaEV4cHJlc3Npb24iLCJpc0N1c3RvbU1hdGNoIiwidGVzdCIsImlzSGFzaFRhZ01hdGNoIiwidHJpbSIsInZhbHVlIiwiZGlzYWJsZSIsImRpc2FibGVkIiwiJCIsImRv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RUFBb0I7QUFDbEIsYUFBS0EsU0FBTCxDQUFld0QsUUFBZixHQUEwQixLQUExQjtBQUNBQyxVQUFFLEtBQUtDLE9BQVAsRUFBZ0JHLFdBQWhCLENBQTRCLFVBQTVCO0FBQ0Q7QUFDRjtBQXJPaUgsR0FBcEcsQ0FBaEI7O29CQXdPZXpFLE8iLCJmaWxlIjoiU2VhcmNoV2lkZ2V0LmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuL19UZW1wbGF0ZWQnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3NlYXJjaFdpZGdldCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5TZWFyY2hXaWRnZXRcclxuICogQGNsYXNzZGVzY1xyXG4gKiBTZWFyY2ggV2lkZ2V0IGlzIGFuIFNEYXRhLWVuYWJsZWQgc2VhcmNoIGNvbXBvbmVudCB0aGF0IHtAbGluayBMaXN0IExpc3R9IHVzZXMgYnkgZGVmYXVsdCBmb3Igc2VhcmNoLlxyXG4gKlxyXG4gKiBUaGUgc2VhcmNoIHdpZGdldCBpcyBhIGRpaml0IFdpZGdldCB3aXRoIGFsbCB0aGUgV2lkZ2V0IGFzcGVjdHMuXHJcbiAqXHJcbiAqIEl0IHN1cHBvcnRzIHR3byB0eXBlcyBvZiBzaG9ydGN1dHM6XHJcbiAqXHJcbiAqIDFcXC4gYCN0ZXh0YCAtIFRoZSBrZXkgYHRleHRgIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgbWF0Y2hpbmcgZXhwcmVzc2lvbi4gVGhpcyBpcyBhIFwiaGFzaHRhZ1wiLlxyXG5cclxuICogMlxcLiBgIyFOYW1lIGVxICdKb2huJ2AgLSBUaGUgYE5hbWUgZXEgJ0pvaG4nYCB3aWxsIGJlIGluc2VydGVkIGRpcmVjdGx5LCBhdm9pZGluZyB7QGxpbmsgTGlzdCNmb3JtYXRTZWFyY2hRdWVyeSBmb3JtYXRTZWFyY2hRdWVyeX0uIFRoaXMgaXMgYSBcImN1c3RvbSBleHByZXNzaW9uXCIuXHJcbiAqXHJcbiAqIE11bHRpcGxlIGhhc2h0YWdzIGlzIHN1cHBvcnRlZCBhcyB3ZWxsIGFzIGhhc2h0YWdzIHdpdGggYWRkaXRpb25hbCB0ZXh0IHRoYXQgZ2V0cyBzZW50IHRocm91Z2gge0BsaW5rIExpc3QjZm9ybWF0U2VhcmNoUXVlcnkgZm9ybWF0U2VhcmNoUXVlcnl9LlxyXG4gKlxyXG4gKiBUbyBnbyB0aHJvdWdoIGEgZnVsbCBleGFtcGxlLCB0YWtlIHRoaXMgZXhwcmVzc2lvbjpcclxuICogYCNvcGVuICN1cmdlbnQgQm9iYFxyXG4gKlxyXG4gKiBgI29wZW5gIGlzIHJlcGxhY2VkIHdpdGg6IGBUaWNrZXRTdGF0dXMgZXEgMWBcclxuICpcclxuICogYCN1cmdlbnRgIGlzIHJlcGxhY2VkIHdpdGg6IGBUaWNrZXRVcmdlbmN5IGd0IDNgXHJcbiAqXHJcbiAqIGBCb2JgIGlzIHBhc3NlZCB0byBgZm9ybWF0U2VhcmNoUXVlcnlgIHdoaWNoIHJldHVybnMgYFRpY2tldElkIGVxIChcIkJvYlwiKSBvciBUaWNrZXRPd25lciBsaWtlIFwiQm9iXCJcclxuICpcclxuICogVGhlIGZpbmFsIHJlc3VsdCBpcyBcImFuZGVkXCIgdG9nZXRoZXIsIHJlc3VsdGluZyBpbiB0aGlzIGZpbmFsIHdoZXJlIGNsYXVzZTpcclxuICogYHdoZXJlPShUaWNrZXRTdGF0dXMgZXEgMSkgYW5kIChUaWNrZXRVcmdlbmN5IGd0IDMpIGFuZCAoVGlja2V0SWQgZXEgKFwiQm9iXCIpIG9yIFRpY2tldE93bmVyIGxpa2UgXCJCb2JcIilcclxuICpcclxuICogU2VlIHRoZSBbRGVmaW5pbmcgSGFzaCBUYWdzIGd1aWRlXSgjIS9ndWlkZXMvdjJfYmV5b25kX3RoZV9ndWlkZV9kZWZpbmluZ19oYXNodGFncykgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGhvdyBpdCBzdXBwb3J0cyBsb2NhbGl6YXRpb24uXHJcbiAqIEBtaXhpbnMgYXJnb3MuX1RlbXBsYXRlZFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlNlYXJjaFdpZGdldCcsIFtfV2lkZ2V0QmFzZSwgX1RlbXBsYXRlZF0sIC8qKiBAbGVuZHMgYXJnb3MuU2VhcmNoV2lkZ2V0LnByb3RvdHlwZSAqLyB7XHJcbiAgLyoqXHJcbiAgICogUHJvdmlkZXMgYSBzZXR0ZXIgZm9yIEhUTUwgbm9kZSBhdHRyaWJ1dGVzLCBuYW1lbHkgdGhlIHZhbHVlIGZvciBzZWFyY2ggdGV4dFxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIEBtZW1iZXJvZiBhcmdvcy5TZWFyY2hXaWRnZXRcclxuICAgKi9cclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIHF1ZXJ5VmFsdWU6IHtcclxuICAgICAgbm9kZTogJ3F1ZXJ5Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICd2YWx1ZScsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFNpbXBsZSB0aGF0IGRlZmluZXMgdGhlIEhUTUwgTWFya3VwXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBAbWVtYmVyb2YgYXJnb3MuU2VhcmNoV2lkZ2V0XHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPHNwYW4gY2xhc3M9XCJzZWFyY2hmaWVsZC13cmFwcGVyXCI+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHRpdGxlPVwieyU9ICQuc2VhcmNoVGV4dCAlfVwiIHBsYWNlaG9sZGVyPVwieyU9ICQuc2VhcmNoVGV4dCAlfVwiIG5hbWU9XCJxdWVyeVwiIGNsYXNzPVwic2VhcmNoZmllbGRcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwib2ZmXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInF1ZXJ5Tm9kZVwiIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbmtleXByZXNzOl9vbktleVByZXNzXCIgIC8+XHJcbiAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4bGluazpocmVmPVwiI2ljb24tc2VhcmNoXCI+PC91c2U+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgPC9zcGFuPlxyXG4gICAgYCxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogVGV4dCB0aGF0IGlzIHVzZWQgd2hlbiBubyB2YWx1ZSBpcyBpbiB0aGUgc2VhcmNoIGJveCAtIFwicGxhY2Vob2xkZXJcIiB0ZXh0LlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIHNlYXJjaFRleHQ6IHJlc291cmNlLnNlYXJjaFRleHQsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7UmVnRXhwfVxyXG4gICAqIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byBkZXRlcm1pbmUgaWYgYSBzZWFyY2ggcXVlcnkgaXMgYSBjdXN0b20gc2VhcmNoIGV4cHJlc3Npb24uICBBIGN1c3RvbSBzZWFyY2hcclxuICAgKiBleHByZXNzaW9uIGlzIG5vdCBwcm9jZXNzZWQsIGFuZCBkaXJlY3RseSBwYXNzZWQgdG8gU0RhdGEuXHJcbiAgICogQG1lbWJlcm9mIGFyZ29zLlNlYXJjaFdpZGdldFxyXG4gICAqL1xyXG4gIGN1c3RvbVNlYXJjaFJFOiAvXiMhLyxcclxuICAvKipcclxuICAgKiBUaGUgcmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGEgc2VhcmNoIHF1ZXJ5IGlzIGEgaGFzaCB0YWcgc2VhcmNoLlxyXG4gICAqIEB0eXBlIHtSZWdFeHB9XHJcbiAgICogQG1lbWJlcm9mIGFyZ29zLlNlYXJjaFdpZGdldFxyXG4gICAqL1xyXG4gIGhhc2hUYWdTZWFyY2hSRTogLyg/OiN8O3wsfFxcLikoW15cXHNdKykvZyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdFtdfVxyXG4gICAqIEFycmF5IG9mIGhhc2ggdGFnIGRlZmluaXRpb25zXHJcbiAgICovXHJcbiAgaGFzaFRhZ1F1ZXJpZXM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogRG9qbyBhdHRhY2ggcG9pbnQgdG8gdGhlIHNlYXJjaCBpbnB1dFxyXG4gICAqL1xyXG4gIHF1ZXJ5Tm9kZTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyBzZWFyY2ggdGV4dCB0byBlbXB0eSBhbmQgcmVtb3ZlcyBhY3RpdmUgc3R5bGluZ1xyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuc2V0KCdxdWVyeVZhbHVlJywgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBpbnZva2VkIGZyb20gdGhlIHNlYXJjaCBidXR0b24gYW5kIGl0OlxyXG4gICAqXHJcbiAgICogKiBHYXRoZXJzIHRoZSBpbnB1dHRlZCBzZWFyY2ggdGV4dFxyXG4gICAqICogRGV0ZXJtaW5lcyBpZiBpdHMgYSBjdXN0b20gZXhwcmVzc2lvbiwgaGFzaCB0YWcsIG9yIG5vcm1hbCBzZWFyY2hcclxuICAgKiAqIENhbGxzIHRoZSBhcHByb3ByaWF0ZSBoYW5kbGVyXHJcbiAgICogKiBGaXJlcyB0aGUge0BsaW5rICNvblNlYXJjaEV4cHJlc3Npb24gb25TZWFyY2hFeHByZXNzaW9ufSBldmVudCB3aGljaCB7QGxpbmsgTGlzdCNfb25TZWFyY2hFeHByZXNzaW9uIGxpc3RlbnMgdG99LlxyXG4gICAqL1xyXG4gIHNlYXJjaDogZnVuY3Rpb24gc2VhcmNoKCkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmdldEZvcm1hdHRlZFNlYXJjaFF1ZXJ5KCk7XHJcbiAgICB0aGlzLm9uU2VhcmNoRXhwcmVzc2lvbihmb3JtYXR0ZWRRdWVyeSwgdGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGFuIHVubW9kaWZpZWQgc2VhcmNoIHF1ZXJ5IHdoaWNoIGFsbG93cyBhIHVzZXJcclxuICAgKiB0byB0eXBlIGluIHRoZWlyIG93biB3aGVyZSBjbGF1c2VcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVmFsdWUgb2Ygc2VhcmNoIGJveFxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHF1ZXJ5IFVuZm9ybWF0dGVkIHF1ZXJ5XHJcbiAgICovXHJcbiAgY3VzdG9tU2VhcmNoOiBmdW5jdGlvbiBjdXN0b21TZWFyY2gocXVlcnlWYWx1ZSkge1xyXG4gICAgdGhpcy5jdXN0b21TZWFyY2hSRS5sYXN0SW5kZXggPSAwO1xyXG4gICAgY29uc3QgcXVlcnkgPSBxdWVyeVZhbHVlLnJlcGxhY2UodGhpcy5jdXN0b21TZWFyY2hSRSwgJycpO1xyXG4gICAgcmV0dXJuIHF1ZXJ5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc2VhcmNoIHF1ZXJ5IGJhc2VkIG9uIGEgaGFzaCBzZWxlY3RvclxyXG4gICAqIEFueSBoYXNoIHRhZ3MgaW4gdGhlIHNlYXJjaCBhcmUgcmVwbGFjZWQgYnkgcHJlZGVmaW5lZCBzZWFyY2ggc3RhdGVtZW50c1xyXG4gICAqIFJlbWFpbmluZyB0ZXh0IG5vdCBwcmVjZWRlZCBieSBhIGhhc2ggd2lsbCByZWNlaXZlXHJcbiAgICogdGhhdCB2aWV3cyBub3JtYWwgc2VhcmNoIGZvcm1hdHRpbmdcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgVmFsdWUgb2Ygc2VhcmNoIGJveFxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHF1ZXJ5IEhhc2ggcmVzb2x2ZWQgcXVlcnlcclxuICAgKi9cclxuICBoYXNoVGFnU2VhcmNoOiBmdW5jdGlvbiBoYXNoVGFnU2VhcmNoKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBoYXNoTGF5b3V0ID0gdGhpcy5oYXNoVGFnUXVlcmllcyB8fCBbXTtcclxuICAgIGNvbnN0IGhhc2hRdWVyaWVzID0gW107XHJcbiAgICBsZXQgYWRkaXRpb25hbFNlYXJjaCA9IHF1ZXJ5O1xyXG5cclxuICAgIHRoaXMuaGFzaFRhZ1NlYXJjaFJFLmxhc3RJbmRleCA9IDA7XHJcbiAgICBsZXQgbmV3UXVlcnkgPSBxdWVyeTtcclxuICAgIGxldCBtYXRjaDtcclxuXHJcbiAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy5oYXNoVGFnU2VhcmNoUkUuZXhlYyhuZXdRdWVyeSkpKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgbGV0IGhhc2hRdWVyeUV4cHJlc3Npb24gPSBudWxsO1xyXG4gICAgICBjb25zdCBoYXNoVGFnID0gbWF0Y2hbMV07XHJcblxyXG4gICAgICAvLyB0b2RvOiBjYW4gb3B0aW1pemUgbGF0ZXIgaWYgbmVjZXNzYXJ5XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFzaExheW91dC5sZW5ndGggJiYgIWhhc2hRdWVyeUV4cHJlc3Npb247IGkrKykge1xyXG4gICAgICAgIGlmIChoYXNoTGF5b3V0W2ldLnRhZy5zdWJzdHIoMSkgPT09IGhhc2hUYWcgfHwgaGFzaExheW91dFtpXS5rZXkgPT09IGhhc2hUYWcpIHtcclxuICAgICAgICAgIGhhc2hRdWVyeUV4cHJlc3Npb24gPSBoYXNoTGF5b3V0W2ldLnF1ZXJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFoYXNoUXVlcnlFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhhc2hRdWVyaWVzLnB1c2godGhpcy5leHBhbmRFeHByZXNzaW9uKGhhc2hRdWVyeUV4cHJlc3Npb24pKTtcclxuICAgICAgYWRkaXRpb25hbFNlYXJjaCA9IGFkZGl0aW9uYWxTZWFyY2gucmVwbGFjZShtYXRjaFswXSwgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChoYXNoUXVlcmllcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdFNlYXJjaFF1ZXJ5KHF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBuZXdRdWVyeSA9IGAoJHtoYXNoUXVlcmllcy5qb2luKCcpIGFuZCAoJyl9KWA7XHJcblxyXG4gICAgYWRkaXRpb25hbFNlYXJjaCA9IGFkZGl0aW9uYWxTZWFyY2gucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG5cclxuICAgIGlmIChhZGRpdGlvbmFsU2VhcmNoKSB7XHJcbiAgICAgIG5ld1F1ZXJ5ICs9IGAgYW5kICgke3RoaXMuZm9ybWF0U2VhcmNoUXVlcnkoYWRkaXRpb25hbFNlYXJjaCl9KWA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld1F1ZXJ5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ29uZmlndXJlIGFsbG93cyB0aGUgY29udHJvbGxlciBMaXN0IHZpZXcgdG8gb3ZlcndyaXRlIHByb3BlcnRpZXMgYXMgdGhlIHBhc3NlZCBvYmplY3Qgd2lsbCBiZSBtaXhlZCBpbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBQcm9wZXJ0aWVzIHRvIGJlIG1peGVkIGludG8gU2VhcmNoIFdpZGdldFxyXG4gICAqL1xyXG4gIGNvbmZpZ3VyZTogZnVuY3Rpb24gY29uZmlndXJlKG9wdGlvbnMpIHtcclxuICAgIC8vIHRvZG86IGZvciBub3csIHdlIHNpbXBseSBtaXhpbiB0aGUgb3B0aW9uc1xyXG4gICAgbGFuZy5taXhpbih0aGlzLCBvcHRpb25zKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4cGFuZHMgdGhlIHBhc3NlZCBleHByZXNzaW9uIGlmIGl0IGlzIGEgZnVuY3Rpb24uXHJcbiAgICogQHBhcmFtIHtTdHJpbmcvRnVuY3Rpb259IGV4cHJlc3Npb24gUmV0dXJucyBzdHJpbmcgZGlyZWN0bHksIGlmIGZ1bmN0aW9uIGl0IGlzIGNhbGxlZCBhbmQgdGhlIHJlc3VsdCByZXR1cm5lZC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFN0cmluZyBleHByZXNzaW9uLlxyXG4gICAqL1xyXG4gIGV4cGFuZEV4cHJlc3Npb246IGZ1bmN0aW9uIGV4cGFuZEV4cHJlc3Npb24oZXhwcmVzc2lvbikge1xyXG4gICAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHJldHVybiBleHByZXNzaW9uLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGV0ZWN0cyB0aGUgZW50ZXIvcmV0dXJuIGtleSBhbmQgZmlyZXMge0BsaW5rICNzZWFyY2ggc2VhcmNofVxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBLZXkgcHJlc3MgZXZlbnRcclxuICAgKi9cclxuICBfb25LZXlQcmVzczogZnVuY3Rpb24gX29uS2V5UHJlc3MoZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDEzIHx8IGV2dC5rZXlDb2RlID09PSAxMCkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLnF1ZXJ5Tm9kZS5ibHVyKCk7XHJcbiAgICAgIHRoaXMuc2VhcmNoKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIF9vbkNsZWFyQ2xpY2s6IGZ1bmN0aW9uIF9vbkNsZWFyQ2xpY2soKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ1RoaXMgbWV0aG9kIGlzIGRlcHJlY2F0ZWQuJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSBldmVudCB0aGF0IGZpcmVzIHdoZW4gdGhlIHNlYXJjaCB3aWRnZXQgcHJvdmlkZXMgYSBzZWFyY2ggcXVlcnkuXHJcbiAgICogTGlzdGVuZWQgdG8gYnkgdGhlIGNvbnRyb2xsaW5nIHtAbGluayBMaXN0I19vblNlYXJjaEV4cHJlc3Npb24gTGlzdCBWaWV3fVxyXG4gICAqIEBwYXJhbSBleHByZXNzaW9uXHJcbiAgICogQHBhcmFtIHdpZGdldFxyXG4gICAqL1xyXG4gIG9uU2VhcmNoRXhwcmVzc2lvbjogZnVuY3Rpb24gb25TZWFyY2hFeHByZXNzaW9uKC8qIGV4cHJlc3Npb24sIHdpZGdldCovKSB7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHNlYXJjaCBleHByZXNzaW9uIGFzIGEgZm9ybWF0dGVkIHF1ZXJ5LlxyXG4gICAqICogR2F0aGVycyB0aGUgaW5wdXR0ZWQgc2VhcmNoIHRleHRcclxuICAgKiAqIERldGVybWluZXMgaWYgaXRzIGEgY3VzdG9tIGV4cHJlc3Npb24sIGhhc2ggdGFnLCBvciBub3JtYWwgc2VhcmNoXHJcbiAgICovXHJcbiAgZ2V0Rm9ybWF0dGVkU2VhcmNoUXVlcnk6IGZ1bmN0aW9uIGdldEZvcm1hdHRlZFNlYXJjaFF1ZXJ5KCkge1xyXG4gICAgY29uc3Qgc2VhcmNoUXVlcnkgPSB0aGlzLmdldFNlYXJjaEV4cHJlc3Npb24oKTtcclxuICAgIGNvbnN0IGlzQ3VzdG9tTWF0Y2ggPSBzZWFyY2hRdWVyeSAmJiB0aGlzLmN1c3RvbVNlYXJjaFJFLnRlc3Qoc2VhcmNoUXVlcnkpO1xyXG4gICAgY29uc3QgaXNIYXNoVGFnTWF0Y2ggPSBzZWFyY2hRdWVyeSAmJiB0aGlzLmhhc2hUYWdTZWFyY2hSRS50ZXN0KHNlYXJjaFF1ZXJ5KTtcclxuXHJcbiAgICBsZXQgZm9ybWF0dGVkUXVlcnk7XHJcblxyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgIGNhc2UgaXNDdXN0b21NYXRjaDpcclxuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuY3VzdG9tU2VhcmNoKHNlYXJjaFF1ZXJ5KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBpc0hhc2hUYWdNYXRjaDpcclxuICAgICAgICBmb3JtYXR0ZWRRdWVyeSA9IHRoaXMuaGFzaFRhZ1NlYXJjaChzZWFyY2hRdWVyeSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgZm9ybWF0dGVkUXVlcnkgPSB0aGlzLmZvcm1hdFNlYXJjaFF1ZXJ5KHNlYXJjaFF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobGFuZy50cmltKHNlYXJjaFF1ZXJ5KSA9PT0gJycpIHtcclxuICAgICAgZm9ybWF0dGVkUXVlcnkgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZvcm1hdHRlZFF1ZXJ5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgY3VycmVudCBzZWFyY2ggZXhwcmVzc2lvbi5cclxuICAgKiAqIEdhdGhlcnMgdGhlIGlucHV0dGVkIHNlYXJjaCB0ZXh0XHJcbiAgICovXHJcbiAgZ2V0U2VhcmNoRXhwcmVzc2lvbjogZnVuY3Rpb24gZ2V0U2VhcmNoRXhwcmVzc2lvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnF1ZXJ5Tm9kZS52YWx1ZTtcclxuICB9LFxyXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICBpZiAodGhpcy5xdWVyeU5vZGUpIHtcclxuICAgICAgdGhpcy5xdWVyeU5vZGUuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgIGlmICh0aGlzLnF1ZXJ5Tm9kZSkge1xyXG4gICAgICB0aGlzLnF1ZXJ5Tm9kZS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=