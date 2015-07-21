<<<<<<< HEAD
define('argos/SearchWidget', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/event', 'dojo/string', 'dojo/dom-class', 'dijit/_Widget', './_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseEvent, _dojoString, _dojoDomClass, _dijit_Widget, _Templated2) {
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

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _event = _interopRequireDefault(_dojo_baseEvent);

    var _string = _interopRequireDefault(_dojoString);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _Widget2 = _interopRequireDefault(_dijit_Widget);

    var _Templated3 = _interopRequireDefault(_Templated2);

    /**
     * @class argos.SearchWidget
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
     * @alternateClassName SearchWidget
     * @mixins argos._Templated
     */
    var __class = (0, _declare['default'])('argos.SearchWidget', [_Widget2['default'], _Templated3['default']], {
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
 * @class argos.SearchWidget
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
 * @alternateClassName SearchWidget
 * @mixins argos._Templated
 */
define('argos/SearchWidget', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/string',
    'dojo/dom-class',
    'dijit/_Widget',
    './_Templated'
], function(
    declare,
    lang,
    event,
    string,
    domClass,
    _Widget,
    _Templated
) {
    var __class = declare('argos.SearchWidget', [_Widget, _Templated], {
>>>>>>> develop
        /**
         * @property {Object}
         * Provides a setter for HTML node attributes, namely the value for search text
         */
        attributeMap: {
            queryValue: { node: 'queryNode', type: 'attribute', attribute: 'value' }
        },

        /**
         * @property {Boolean}
         * Flag to enable the clear and search buttons.
         */
        enableButtons: false,

        /**
         * @property {Simplate}
         * Simple that defines the HTML Markup
         */
<<<<<<< HEAD
        widgetTemplate: new Simplate(['<div class="search-widget">', '<div class="table-layout">', '<div><input type="text" placeholder="{%= $.searchText %}" name="query" class="query" autocorrect="off" autocapitalize="off" data-dojo-attach-point="queryNode" data-dojo-attach-event="onfocus:_onFocus,onblur:_onBlur,onkeypress:_onKeyPress, onmouseup: _onMouseUp" /></div>', '{% if ($.enableButtons) { %}', '<div class="hasButton"><button class="clear-button" tabindex="-1" data-dojo-attach-event="onclick: _onClearClick"></button></div>', '<div class="hasButton"><button class="subHeaderButton searchButton" data-dojo-attach-event="click: search">{%= $.searchText %}</button></div>', '{% } %}', '</div>', '</div>']),
=======
        widgetTemplate: new Simplate([
            '<div class="search-widget">',
                '<div class="table-layout">',
                    '<div><input type="text" placeholder="{%= $.searchText %}" name="query" class="query" autocorrect="off" autocapitalize="off" data-dojo-attach-point="queryNode" data-dojo-attach-event="onfocus:_onFocus,onblur:_onBlur,onkeypress:_onKeyPress, onmouseup: _onMouseUp" /></div>',

                    '{% if ($.enableButtons) { %}',
                        '<div class="hasButton"><button class="clear-button" tabindex="-1" data-dojo-attach-event="onclick: _onClearClick"></button></div>',
                        '<div class="hasButton"><button class="subHeaderButton searchButton" data-dojo-attach-event="click: search">{%= $.searchText %}</button></div>',
                    '{% } %}',

                '</div>',
            '</div>'
        ]),
>>>>>>> develop

        /**
         * @property {String}
         * Text that is used when no value is in the search box - "placeholder" text.
         */
        searchText: 'Search',

        /**
         * @property {RegExp}
         * The regular expression used to determine if a search query is a custom search expression.  A custom search
         * expression is not processed, and directly passed to SData.
         */
        customSearchRE: /^#!/,
        /**
         * @type {RegExp}
         * The regular expression used to determine if a search query is a hash tag search.
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
<<<<<<< HEAD
        clear: function clear() {
            _domClass['default'].remove(this.domNode, 'search-active');
=======
        clear: function() {
            domClass.remove(this.domNode, 'search-active');
>>>>>>> develop
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
<<<<<<< HEAD
        search: function search() {
=======
        search: function() {
>>>>>>> develop
            var formattedQuery;
            formattedQuery = this.getFormattedSearchQuery();
            this.onSearchExpression(formattedQuery, this);
        },
        /**
         * Returns an unmodified search query which allows a user
         * to type in their own where clause
         * @param {String} query Value of search box
         * @returns {String} query Unformatted query
         */
<<<<<<< HEAD
        customSearch: function customSearch(query) {
=======
        customSearch: function(query) {
>>>>>>> develop
            this.customSearchRE.lastIndex = 0;
            query = query.replace(this.customSearchRE, '');
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
<<<<<<< HEAD
        hashTagSearch: function hashTagSearch(query) {
=======
        hashTagSearch: function(query) {
>>>>>>> develop
            var hashLayout = this.hashTagQueries || [],
                hashQueries = [],
                match,
                hashTag,
                i,
                hashQueryExpression,
                additionalSearch = query;

            this.hashTagSearchRE.lastIndex = 0;

<<<<<<< HEAD
            while (match = this.hashTagSearchRE.exec(query)) {
=======
            while ((match = this.hashTagSearchRE.exec(query))) {
>>>>>>> develop
                hashTag = match[1];
                hashQueryExpression = null;

                // todo: can optimize later if necessary
                for (i = 0; i < hashLayout.length && !hashQueryExpression; i++) {
                    if (hashLayout[i].tag === hashTag) {
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

<<<<<<< HEAD
            query = _string['default'].substitute('(${0})', [hashQueries.join(') and (')]);
=======
            query = string.substitute('(${0})', [hashQueries.join(') and (')]);
>>>>>>> develop

            additionalSearch = additionalSearch.replace(/^\s+|\s+$/g, '');

            if (additionalSearch) {
                query += _string['default'].substitute(' and (${0})', [this.formatSearchQuery(additionalSearch)]);
            }

            return query;
        },
        /**
         * Configure allows the controller List view to overwrite properties as the passed object will be mixed in.
         * @param {Object} options Properties to be mixed into Search Widget
         */
<<<<<<< HEAD
        configure: function configure(options) {
=======
        configure: function(options) {
>>>>>>> develop
            // todo: for now, we simply mixin the options
            _lang['default'].mixin(this, options);
        },
        /**
         * Expands the passed expression if it is a function.
         * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
         * @return {String} String expression.
         */
<<<<<<< HEAD
        expandExpression: function expandExpression(expression) {
=======
        expandExpression: function(expression) {
>>>>>>> develop
            if (typeof expression === 'function') {
                return expression.apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                return expression;
            }
        },
        /**
         * Clears the search input text and attempts to re-open the keyboard
         * @param {Event} evt Click event
         */
<<<<<<< HEAD
        _onClearClick: function _onClearClick(evt) {
            _event['default'].stop(evt);
=======
        _onClearClick: function(evt) {
            event.stop(evt);
>>>>>>> develop
            this.clear();
            this.queryNode.focus();
            this.queryNode.click();
        },
        /**
         * Tests to see if the search input is empty and toggles the active styling
         */
<<<<<<< HEAD
        _onBlur: function _onBlur() {
            _domClass['default'].toggle(this.domNode, 'search-active', !!this.queryNode.value);
=======
        _onBlur: function() {
            domClass.toggle(this.domNode, 'search-active', !!this.queryNode.value);
>>>>>>> develop
        },
        /**
         * Adds the search active styling
         */
<<<<<<< HEAD
        _onFocus: function _onFocus() {
            _domClass['default'].add(this.domNode, 'search-active');
        },
        _onMouseUp: function _onMouseUp() {
            // Work around a chrome issue where mouseup after a focus will de-select the text
            setTimeout((function () {
=======
        _onFocus: function() {
            domClass.add(this.domNode, 'search-active');
        },
        _onMouseUp: function() {
            // Work around a chrome issue where mouseup after a focus will de-select the text
            setTimeout(function() {
>>>>>>> develop
                this.queryNode.setSelectionRange(0, 9999);
            }).bind(this), 50);
        },
        /**
         * Detects the enter/return key and fires {@link #search search}
         * @param {Event} evt Key press event
         */
<<<<<<< HEAD
        _onKeyPress: function _onKeyPress(evt) {
=======
        _onKeyPress: function(evt) {
>>>>>>> develop
            if (evt.keyCode === 13 || evt.keyCode === 10) {
                _event['default'].stop(evt);
                this.queryNode.blur();
                this.search();
            }
        },
        /**
         * The event that fires when the search widget provides a search query.
         * Listened to by the controlling {@link List#_onSearchExpression List View}
         * @param expression
         * @param widget
         */
<<<<<<< HEAD
        onSearchExpression: function onSearchExpression(expression, widget) {},
=======
        onSearchExpression: function(expression, widget) {

        },
>>>>>>> develop
        /**
        * Gets the current search expression as a formatted query.
        * * Gathers the inputted search text
        * * Determines if its a custom expression, hash tag, or normal search
        */
<<<<<<< HEAD
        getFormattedSearchQuery: function getFormattedSearchQuery() {
=======
        getFormattedSearchQuery: function() {
>>>>>>> develop
            var searchQuery = this.getSearchExpression(),
                formattedQuery,
                isCustomMatch = searchQuery && this.customSearchRE.test(searchQuery),
                isHashTagMatch = searchQuery && this.hashTagSearchRE.test(searchQuery);

            switch (true) {
                case isCustomMatch: formattedQuery = this.customSearch(searchQuery);
                    break;
                case isHashTagMatch: formattedQuery = this.hashTagSearch(searchQuery);
                    break;
                default:
                    formattedQuery = this.formatSearchQuery(searchQuery);
            }

<<<<<<< HEAD
            if (_lang['default'].trim(searchQuery) === '') {
=======
            if (lang.trim(searchQuery) === '') {
>>>>>>> develop
                formattedQuery = null;
            }
            return formattedQuery;
        },
        /**
<<<<<<< HEAD
        * Gets the current search expression.
        * * Gathers the inputted search text
        */
        getSearchExpression: function getSearchExpression() {
=======
       * Gets the current search expression.
       * * Gathers the inputted search text
       */
        getSearchExpression: function() {
>>>>>>> develop
            return this.queryNode.value;
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.SearchWidget', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.SearchWidget', __class);
    return __class;
>>>>>>> develop
});
