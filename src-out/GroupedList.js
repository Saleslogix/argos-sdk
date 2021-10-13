define('argos/GroupedList', ['module', 'exports', 'dojo/_base/declare', 'dojo/string', './List', './Utility'], function (module, exports, _declare, _string, _List, _Utility) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _string2 = _interopRequireDefault(_string);

  var _List2 = _interopRequireDefault(_List);

  var _Utility2 = _interopRequireDefault(_Utility);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/GroupedList
   * @classdesc Grouped List provides a hook for grouping rows before rendering them to the page.
   * The grouping adds a container for the set of rows and is collapsible.
   * Note that it constructs the page sequentially meaning the rows should be in the correct
   * order before attempting to group.
   * @extends module:argos/List
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

  /**
   * @module argos/GroupedList
   */
  var __class = (0, _declare2.default)('argos.GroupedList', [_List2.default], /** @lends module:argos/GroupedList.prototype */{
    accordion: null,

    /**
     * @property {Simplate}
     * Simplate that defines the HTML Markup. This override adds the needed styling.
     */
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" data-title="{%= $.titleText %}" class="list grouped-list listview-search {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>', '<div class="scrollable" data-selectable="false" data-dojo-attach-point="scrollerNode">', '<div data-dojo-attach-point="searchNode"></div>', '{%! $.emptySelectionTemplate %}', '<div class="accordion panel inverse has-icons" data-dojo-attach-point="contentNode"></div>', '{%! $.moreTemplate %}', '{%! $.listActionTemplate %}', '</div>', '</div>']),
    /**
     * @property {Simplate}
     * Simplate that defines the Group template that includes the header element with collapse button and the row container
     */
    groupTemplate: new Simplate(['\n      <div class="accordion-header" role="presentation" data-tag="{%= $.tag %}">\n        <a href="#" role="button"><span>{%: $.title %}</span></a>\n      </div>\n      <div class="accordion-pane" data-group="{%= $.tag %}">\n      </div>\n    ']),

    /**
     * @property {Simplate}
     * The template used to render the pager at the bottom of the view.  This template is not directly rendered, but is
     * included in {@link #viewTemplate}.
     *
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      moreText            The text to display on the more button.
     *
     * The default template exposes the following actions:
     *
     * * more
     */
    moreTemplate: new Simplate(['<div class="list-more" data-dojo-attach-point="moreNode">', '<p class="list-remaining"><span data-dojo-attach-point="remainingContentNode"></span></p>', '<button class="btn" data-action="more">', '<span>{%= $.moreText %}</span>', '</button>', '</div>']),
    /**
     * @property {Object}
     * The current group object that is compared to the next entries group object
     * Must have a `tag` property that identifies the group.
     * The `title` property will be placed into the `groupTemplate` for the header text.
     */
    _groupBySections: null,
    _currentGroupBySection: null,
    /**
     * Function that returns a "group object". The group object must have a tag property that is
     * based off the passed entry as it will be used to compare to other entries.
     * The title should also reflect the current entry as it will be used for the header text in the group splitter.
     *
     * An example for a Yellow Page type list:
     *
     * `entryA = {first: 'Henry', last: 'Smith', phone: '123'}`
     * `entryB = {first: 'Mary', last: 'Sue', phone: '345'}`
     *
     *     groupGroupForEntry: function(entry) {
     *         var lastInitial = entry.last.substr(0,1).toUppperCase();
     *         return {
     *             tag: lastInitial,
     *             title: lastInitial
     *         };
     *     }
     *
     * @template
     * @param {Object} entry The current entry being processed.
     * @return {Object} Object that contains a tag and title property where tag will be used in comparisons
     */
    getGroupForEntry: function getGroupForEntry(entry) {
      if (this._currentGroupBySection) {
        var title = void 0;
        var sectionDef = this._currentGroupBySection.section.getSection(entry);
        if (this._currentGroupBySection.description) {
          title = this._currentGroupBySection.description + ': ' + sectionDef.title;
        } else {
          title = sectionDef.title;
        }
        return {
          tag: sectionDef.key,
          title: title,
          collapsed: !!sectionDef.collapsed
        };
      }

      return {
        tag: 1,
        title: 'Default'
      };
    },
    /**
     * Overwrites the parent {@link List#processFeed processFeed} to introduce grouping by group tags, see {@link #getGroupForEntry getGroupForEntry}.
     * @param {Object} feed The SData feed result
     * @deprecated Use processData instead
     */
    processFeed: function processFeed(feed) {
      var getGroupsNode = _Utility2.default.memoize(this.getGroupsNode.bind(this), function (entryGroup) {
        return entryGroup.tag;
      });

      if (!this.feed) {
        this.set('listContent', '');
      }

      this.feed = feed;

      if (this.feed.$totalResults === 0) {
        this.set('listContent', this.noDataTemplate.apply(this));
      } else if (feed.$resources) {
        for (var i = 0; i < feed.$resources.length; i++) {
          var entry = feed.$resources[i];
          var entryGroup = this.getGroupForEntry(entry);

          entry.$groupTag = entryGroup.tag;
          entry.$groupTitle = entryGroup.title;

          this.entries[entry.$key] = entry;
          var rowNode = $(this.rowTemplate.apply(entry, this));
          this.onApplyRowTemplate(entry, rowNode.get(0));
          $(getGroupsNode(entryGroup)).append(rowNode);
        }
      }

      // todo: add more robust handling when $totalResults does not exist, i.e., hide element completely
      if (typeof this.feed.$totalResults !== 'undefined') {
        var remaining = this.feed.$totalResults - (this.feed.$startIndex + this.feed.$itemsPerPage - 1);
        this.set('remainingContent', _string2.default.substitute(this.remainingText, [remaining]));
      }

      $(this.domNode).toggleClass('list-has-more', this.hasMoreData());
      this.updateSoho();
    },
    processData: function processData(entries) {
      var count = entries.length;
      var store = this.get('store');
      var getGroupsNode = _Utility2.default.memoize(this.getGroupsNode.bind(this), function (entryGroup) {
        return entryGroup.tag;
      });

      if (count > 0) {
        for (var i = 0; i < count; i++) {
          var entry = this._processEntry(entries[i]);
          this.entries[store.getIdentity(entry)] = entry;

          var entryGroup = this.getGroupForEntry(entry);

          entry.$groupTag = entryGroup.tag;
          entry.$groupTitle = entryGroup.title;

          var rowNode = $(this.rowTemplate.apply(entry, this));
          this.onApplyRowTemplate(entry, rowNode.get(0));

          $(getGroupsNode(entryGroup)).append(rowNode);
        }
      }
      this.updateSoho();
    },
    getGroupsNode: function getGroupsNode(entryGroup) {
      var results = $('[data-group="' + entryGroup.tag + '"]', this.contentNode);
      if (results.length > 0) {
        results = results.get(0);
      } else {
        // Does not exist, lets create it
        results = $(this.groupTemplate.apply(entryGroup, this));
        $(this.contentNode).append(results);
        // re-query what we just place in (which was a doc frag)
        results = $('[data-group="' + entryGroup.tag + '"]', this.contentNode).get(0);
      }

      return results;
    },
    /**
     * Called on application startup to configure the search widget if present and create the list actions.
     */
    startup: function startup() {
      this.inherited(startup, arguments);
      this._initGroupBySections();
    },
    _initGroupBySections: function _initGroupBySections() {
      this._groupBySections = this.getGroupBySections();
      this.setDefaultGroupBySection();
      this.applyGroupByOrderBy();
    },
    setDefaultGroupBySection: function setDefaultGroupBySection() {
      var count = 0;
      if (this._groupBySections) {
        count = this._groupBySections.length;
        for (var i = 0; i < count; i++) {
          if (this._groupBySections[i].isDefault === true) {
            this._currentGroupBySection = this._groupBySections[i];
          }
        }
        if (this._currentGroupBySection === null && count > 0) {
          this._currentGroupBySection = this._groupBySections[0];
        }
      }
    },
    getGroupBySection: function getGroupBySection(sectionId) {
      var groupSection = null;
      if (this._groupBySections) {
        for (var i = 0; i < this._groupBySections.length; i++) {
          if (this._groupBySections[i].Id === sectionId) {
            groupSection = this._groupBySections[i];
          }
        }
      }
      return groupSection;
    },
    setCurrentGroupBySection: function setCurrentGroupBySection(sectionId) {
      this._currentGroupBySection = this.getGroupBySection(sectionId);
      this.applyGroupByOrderBy(); // need to refresh view
    },
    getGroupBySections: function getGroupBySections() {
      return null;
    },
    applyGroupByOrderBy: function applyGroupByOrderBy() {
      if (this._currentGroupBySection) {
        this.queryOrderBy = this._currentGroupBySection.section.getOrderByQuery();
      }
    },
    initSoho: function initSoho() {
      var accordion = $('.accordion.panel', this.domNode);
      accordion.accordion();
      this.accordion = accordion.data('accordion');
    },
    updateSoho: function updateSoho() {
      if (this.accordion) {
        this.accordion.updated();
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});