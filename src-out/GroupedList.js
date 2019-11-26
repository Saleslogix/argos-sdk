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
   * @class argos.GroupedList
   * @classdesc Grouped List provides a hook for grouping rows before rendering them to the page.
   * The grouping adds a container for the set of rows and is collapsible.
   * Note that it constructs the page sequentially meaning the rows should be in the correct
   * order before attempting to group.
   * @extends argos.List
   */
  var __class = (0, _declare2.default)('argos.GroupedList', [_List2.default], /** @lends argos.GroupedList# */{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Hcm91cGVkTGlzdC5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwiYWNjb3JkaW9uIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImdyb3VwVGVtcGxhdGUiLCJtb3JlVGVtcGxhdGUiLCJfZ3JvdXBCeVNlY3Rpb25zIiwiX2N1cnJlbnRHcm91cEJ5U2VjdGlvbiIsImdldEdyb3VwRm9yRW50cnkiLCJlbnRyeSIsInRpdGxlIiwic2VjdGlvbkRlZiIsInNlY3Rpb24iLCJnZXRTZWN0aW9uIiwiZGVzY3JpcHRpb24iLCJ0YWciLCJrZXkiLCJjb2xsYXBzZWQiLCJwcm9jZXNzRmVlZCIsImZlZWQiLCJnZXRHcm91cHNOb2RlIiwibWVtb2l6ZSIsImJpbmQiLCJlbnRyeUdyb3VwIiwic2V0IiwiJHRvdGFsUmVzdWx0cyIsIm5vRGF0YVRlbXBsYXRlIiwiYXBwbHkiLCIkcmVzb3VyY2VzIiwiaSIsImxlbmd0aCIsIiRncm91cFRhZyIsIiRncm91cFRpdGxlIiwiZW50cmllcyIsIiRrZXkiLCJyb3dOb2RlIiwiJCIsInJvd1RlbXBsYXRlIiwib25BcHBseVJvd1RlbXBsYXRlIiwiZ2V0IiwiYXBwZW5kIiwicmVtYWluaW5nIiwiJHN0YXJ0SW5kZXgiLCIkaXRlbXNQZXJQYWdlIiwic3Vic3RpdHV0ZSIsInJlbWFpbmluZ1RleHQiLCJkb21Ob2RlIiwidG9nZ2xlQ2xhc3MiLCJoYXNNb3JlRGF0YSIsInVwZGF0ZVNvaG8iLCJwcm9jZXNzRGF0YSIsImNvdW50Iiwic3RvcmUiLCJfcHJvY2Vzc0VudHJ5IiwiZ2V0SWRlbnRpdHkiLCJyZXN1bHRzIiwiY29udGVudE5vZGUiLCJzdGFydHVwIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX2luaXRHcm91cEJ5U2VjdGlvbnMiLCJnZXRHcm91cEJ5U2VjdGlvbnMiLCJzZXREZWZhdWx0R3JvdXBCeVNlY3Rpb24iLCJhcHBseUdyb3VwQnlPcmRlckJ5IiwiaXNEZWZhdWx0IiwiZ2V0R3JvdXBCeVNlY3Rpb24iLCJzZWN0aW9uSWQiLCJncm91cFNlY3Rpb24iLCJJZCIsInNldEN1cnJlbnRHcm91cEJ5U2VjdGlvbiIsInF1ZXJ5T3JkZXJCeSIsImdldE9yZGVyQnlRdWVyeSIsImluaXRTb2hvIiwiZGF0YSIsInVwZGF0ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7O0FBY0EsTUFBTUEsVUFBVSx1QkFBUSxtQkFBUixFQUE2QixnQkFBN0IsRUFBcUMsZ0NBQWdDO0FBQ25GQyxlQUFXLElBRHdFOztBQUduRjs7OztBQUlBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLDRMQUQyQixFQUUzQix3RkFGMkIsRUFHM0IsaURBSDJCLEVBSTNCLGlDQUoyQixFQUszQiw0RkFMMkIsRUFNM0IsdUJBTjJCLEVBTzNCLDZCQVAyQixFQVEzQixRQVIyQixFQVMzQixRQVQyQixDQUFiLENBUG1FO0FBa0JuRjs7OztBQUlBQyxtQkFBZSxJQUFJRCxRQUFKLENBQWEseVBBQWIsQ0F0Qm9FOztBQStCbkY7Ozs7Ozs7Ozs7Ozs7OztBQWVBRSxrQkFBYyxJQUFJRixRQUFKLENBQWEsQ0FDekIsMkRBRHlCLEVBRXpCLDJGQUZ5QixFQUd6Qix5Q0FIeUIsRUFJekIsZ0NBSnlCLEVBS3pCLFdBTHlCLEVBTXpCLFFBTnlCLENBQWIsQ0E5Q3FFO0FBc0RuRjs7Ozs7O0FBTUFHLHNCQUFrQixJQTVEaUU7QUE2RG5GQyw0QkFBd0IsSUE3RDJEO0FBOERuRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQUMsc0JBQWtCLFNBQVNBLGdCQUFULENBQTBCQyxLQUExQixFQUFpQztBQUNqRCxVQUFJLEtBQUtGLHNCQUFULEVBQWlDO0FBQy9CLFlBQUlHLGNBQUo7QUFDQSxZQUFNQyxhQUFhLEtBQUtKLHNCQUFMLENBQTRCSyxPQUE1QixDQUFvQ0MsVUFBcEMsQ0FBK0NKLEtBQS9DLENBQW5CO0FBQ0EsWUFBSSxLQUFLRixzQkFBTCxDQUE0Qk8sV0FBaEMsRUFBNkM7QUFDM0NKLGtCQUFXLEtBQUtILHNCQUFMLENBQTRCTyxXQUF2QyxVQUF1REgsV0FBV0QsS0FBbEU7QUFDRCxTQUZELE1BRU87QUFDTEEsa0JBQVFDLFdBQVdELEtBQW5CO0FBQ0Q7QUFDRCxlQUFPO0FBQ0xLLGVBQUtKLFdBQVdLLEdBRFg7QUFFTE4sc0JBRks7QUFHTE8scUJBQVcsQ0FBQyxDQUFDTixXQUFXTTtBQUhuQixTQUFQO0FBS0Q7O0FBRUQsYUFBTztBQUNMRixhQUFLLENBREE7QUFFTEwsZUFBTztBQUZGLE9BQVA7QUFJRCxLQXhHa0Y7QUF5R25GOzs7OztBQUtBUSxpQkFBYSxTQUFTQSxXQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUN0QyxVQUFNQyxnQkFBZ0Isa0JBQVFDLE9BQVIsQ0FBZ0IsS0FBS0QsYUFBTCxDQUFtQkUsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBaEIsRUFBK0MsVUFBQ0MsVUFBRCxFQUFnQjtBQUNuRixlQUFPQSxXQUFXUixHQUFsQjtBQUNELE9BRnFCLENBQXRCOztBQUlBLFVBQUksQ0FBQyxLQUFLSSxJQUFWLEVBQWdCO0FBQ2QsYUFBS0ssR0FBTCxDQUFTLGFBQVQsRUFBd0IsRUFBeEI7QUFDRDs7QUFFRCxXQUFLTCxJQUFMLEdBQVlBLElBQVo7O0FBRUEsVUFBSSxLQUFLQSxJQUFMLENBQVVNLGFBQVYsS0FBNEIsQ0FBaEMsRUFBbUM7QUFDakMsYUFBS0QsR0FBTCxDQUFTLGFBQVQsRUFBd0IsS0FBS0UsY0FBTCxDQUFvQkMsS0FBcEIsQ0FBMEIsSUFBMUIsQ0FBeEI7QUFDRCxPQUZELE1BRU8sSUFBSVIsS0FBS1MsVUFBVCxFQUFxQjtBQUMxQixhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSVYsS0FBS1MsVUFBTCxDQUFnQkUsTUFBcEMsRUFBNENELEdBQTVDLEVBQWlEO0FBQy9DLGNBQU1wQixRQUFRVSxLQUFLUyxVQUFMLENBQWdCQyxDQUFoQixDQUFkO0FBQ0EsY0FBTU4sYUFBYSxLQUFLZixnQkFBTCxDQUFzQkMsS0FBdEIsQ0FBbkI7O0FBRUFBLGdCQUFNc0IsU0FBTixHQUFrQlIsV0FBV1IsR0FBN0I7QUFDQU4sZ0JBQU11QixXQUFOLEdBQW9CVCxXQUFXYixLQUEvQjs7QUFFQSxlQUFLdUIsT0FBTCxDQUFheEIsTUFBTXlCLElBQW5CLElBQTJCekIsS0FBM0I7QUFDQSxjQUFNMEIsVUFBVUMsRUFBRSxLQUFLQyxXQUFMLENBQWlCVixLQUFqQixDQUF1QmxCLEtBQXZCLEVBQThCLElBQTlCLENBQUYsQ0FBaEI7QUFDQSxlQUFLNkIsa0JBQUwsQ0FBd0I3QixLQUF4QixFQUErQjBCLFFBQVFJLEdBQVIsQ0FBWSxDQUFaLENBQS9CO0FBQ0FILFlBQUVoQixjQUFjRyxVQUFkLENBQUYsRUFBNkJpQixNQUE3QixDQUFvQ0wsT0FBcEM7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBSSxPQUFPLEtBQUtoQixJQUFMLENBQVVNLGFBQWpCLEtBQW1DLFdBQXZDLEVBQW9EO0FBQ2xELFlBQU1nQixZQUFZLEtBQUt0QixJQUFMLENBQVVNLGFBQVYsSUFBMkIsS0FBS04sSUFBTCxDQUFVdUIsV0FBVixHQUF3QixLQUFLdkIsSUFBTCxDQUFVd0IsYUFBbEMsR0FBa0QsQ0FBN0UsQ0FBbEI7QUFDQSxhQUFLbkIsR0FBTCxDQUFTLGtCQUFULEVBQTZCLGlCQUFPb0IsVUFBUCxDQUFrQixLQUFLQyxhQUF2QixFQUFzQyxDQUFDSixTQUFELENBQXRDLENBQTdCO0FBQ0Q7O0FBRURMLFFBQUUsS0FBS1UsT0FBUCxFQUFnQkMsV0FBaEIsQ0FBNEIsZUFBNUIsRUFBNkMsS0FBS0MsV0FBTCxFQUE3QztBQUNBLFdBQUtDLFVBQUw7QUFDRCxLQWxKa0Y7QUFtSm5GQyxpQkFBYSxTQUFTQSxXQUFULENBQXFCakIsT0FBckIsRUFBOEI7QUFDekMsVUFBTWtCLFFBQVFsQixRQUFRSCxNQUF0QjtBQUNBLFVBQU1zQixRQUFRLEtBQUtiLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQSxVQUFNbkIsZ0JBQWdCLGtCQUFRQyxPQUFSLENBQWdCLEtBQUtELGFBQUwsQ0FBbUJFLElBQW5CLENBQXdCLElBQXhCLENBQWhCLEVBQStDLFVBQUNDLFVBQUQsRUFBZ0I7QUFDbkYsZUFBT0EsV0FBV1IsR0FBbEI7QUFDRCxPQUZxQixDQUF0Qjs7QUFJQSxVQUFJb0MsUUFBUSxDQUFaLEVBQWU7QUFDYixhQUFLLElBQUl0QixJQUFJLENBQWIsRUFBZ0JBLElBQUlzQixLQUFwQixFQUEyQnRCLEdBQTNCLEVBQWdDO0FBQzlCLGNBQU1wQixRQUFRLEtBQUs0QyxhQUFMLENBQW1CcEIsUUFBUUosQ0FBUixDQUFuQixDQUFkO0FBQ0EsZUFBS0ksT0FBTCxDQUFhbUIsTUFBTUUsV0FBTixDQUFrQjdDLEtBQWxCLENBQWIsSUFBeUNBLEtBQXpDOztBQUVBLGNBQU1jLGFBQWEsS0FBS2YsZ0JBQUwsQ0FBc0JDLEtBQXRCLENBQW5COztBQUVBQSxnQkFBTXNCLFNBQU4sR0FBa0JSLFdBQVdSLEdBQTdCO0FBQ0FOLGdCQUFNdUIsV0FBTixHQUFvQlQsV0FBV2IsS0FBL0I7O0FBRUEsY0FBTXlCLFVBQVVDLEVBQUUsS0FBS0MsV0FBTCxDQUFpQlYsS0FBakIsQ0FBdUJsQixLQUF2QixFQUE4QixJQUE5QixDQUFGLENBQWhCO0FBQ0EsZUFBSzZCLGtCQUFMLENBQXdCN0IsS0FBeEIsRUFBK0IwQixRQUFRSSxHQUFSLENBQVksQ0FBWixDQUEvQjs7QUFFQUgsWUFBRWhCLGNBQWNHLFVBQWQsQ0FBRixFQUE2QmlCLE1BQTdCLENBQW9DTCxPQUFwQztBQUNEO0FBQ0Y7QUFDRCxXQUFLYyxVQUFMO0FBQ0QsS0EzS2tGO0FBNEtuRjdCLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJHLFVBQXZCLEVBQW1DO0FBQ2hELFVBQUlnQyxVQUFVbkIsb0JBQWtCYixXQUFXUixHQUE3QixTQUFzQyxLQUFLeUMsV0FBM0MsQ0FBZDtBQUNBLFVBQUlELFFBQVF6QixNQUFSLEdBQWlCLENBQXJCLEVBQXdCO0FBQ3RCeUIsa0JBQVVBLFFBQVFoQixHQUFSLENBQVksQ0FBWixDQUFWO0FBQ0QsT0FGRCxNQUVPO0FBQ0w7QUFDQWdCLGtCQUFVbkIsRUFBRSxLQUFLaEMsYUFBTCxDQUFtQnVCLEtBQW5CLENBQXlCSixVQUF6QixFQUFxQyxJQUFyQyxDQUFGLENBQVY7QUFDQWEsVUFBRSxLQUFLb0IsV0FBUCxFQUFvQmhCLE1BQXBCLENBQTJCZSxPQUEzQjtBQUNBO0FBQ0FBLGtCQUFVbkIsb0JBQWtCYixXQUFXUixHQUE3QixTQUFzQyxLQUFLeUMsV0FBM0MsRUFBd0RqQixHQUF4RCxDQUE0RCxDQUE1RCxDQUFWO0FBQ0Q7O0FBRUQsYUFBT2dCLE9BQVA7QUFDRCxLQXpMa0Y7QUEwTG5GOzs7QUFHQUUsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQzFCLFdBQUtDLFNBQUwsQ0FBZUQsT0FBZixFQUF3QkUsU0FBeEI7QUFDQSxXQUFLQyxvQkFBTDtBQUNELEtBaE1rRjtBQWlNbkZBLDBCQUFzQixTQUFTQSxvQkFBVCxHQUFnQztBQUNwRCxXQUFLdEQsZ0JBQUwsR0FBd0IsS0FBS3VELGtCQUFMLEVBQXhCO0FBQ0EsV0FBS0Msd0JBQUw7QUFDQSxXQUFLQyxtQkFBTDtBQUNELEtBck1rRjtBQXNNbkZELDhCQUEwQixTQUFTQSx3QkFBVCxHQUFvQztBQUM1RCxVQUFJWCxRQUFRLENBQVo7QUFDQSxVQUFJLEtBQUs3QyxnQkFBVCxFQUEyQjtBQUN6QjZDLGdCQUFRLEtBQUs3QyxnQkFBTCxDQUFzQndCLE1BQTlCO0FBQ0EsYUFBSyxJQUFJRCxJQUFJLENBQWIsRUFBZ0JBLElBQUlzQixLQUFwQixFQUEyQnRCLEdBQTNCLEVBQWdDO0FBQzlCLGNBQUksS0FBS3ZCLGdCQUFMLENBQXNCdUIsQ0FBdEIsRUFBeUJtQyxTQUF6QixLQUF1QyxJQUEzQyxFQUFpRDtBQUMvQyxpQkFBS3pELHNCQUFMLEdBQThCLEtBQUtELGdCQUFMLENBQXNCdUIsQ0FBdEIsQ0FBOUI7QUFDRDtBQUNGO0FBQ0QsWUFBSyxLQUFLdEIsc0JBQUwsS0FBZ0MsSUFBakMsSUFBMkM0QyxRQUFRLENBQXZELEVBQTJEO0FBQ3pELGVBQUs1QyxzQkFBTCxHQUE4QixLQUFLRCxnQkFBTCxDQUFzQixDQUF0QixDQUE5QjtBQUNEO0FBQ0Y7QUFDRixLQW5Oa0Y7QUFvTm5GMkQsdUJBQW1CLFNBQVNBLGlCQUFULENBQTJCQyxTQUEzQixFQUFzQztBQUN2RCxVQUFJQyxlQUFlLElBQW5CO0FBQ0EsVUFBSSxLQUFLN0QsZ0JBQVQsRUFBMkI7QUFDekIsYUFBSyxJQUFJdUIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUt2QixnQkFBTCxDQUFzQndCLE1BQTFDLEVBQWtERCxHQUFsRCxFQUF1RDtBQUNyRCxjQUFJLEtBQUt2QixnQkFBTCxDQUFzQnVCLENBQXRCLEVBQXlCdUMsRUFBekIsS0FBZ0NGLFNBQXBDLEVBQStDO0FBQzdDQywyQkFBZSxLQUFLN0QsZ0JBQUwsQ0FBc0J1QixDQUF0QixDQUFmO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsYUFBT3NDLFlBQVA7QUFDRCxLQTlOa0Y7QUErTm5GRSw4QkFBMEIsU0FBU0Esd0JBQVQsQ0FBa0NILFNBQWxDLEVBQTZDO0FBQ3JFLFdBQUszRCxzQkFBTCxHQUE4QixLQUFLMEQsaUJBQUwsQ0FBdUJDLFNBQXZCLENBQTlCO0FBQ0EsV0FBS0gsbUJBQUwsR0FGcUUsQ0FFekM7QUFDN0IsS0FsT2tGO0FBbU9uRkYsd0JBQW9CLFNBQVNBLGtCQUFULEdBQThCO0FBQ2hELGFBQU8sSUFBUDtBQUNELEtBck9rRjtBQXNPbkZFLHlCQUFxQixTQUFTQSxtQkFBVCxHQUErQjtBQUNsRCxVQUFJLEtBQUt4RCxzQkFBVCxFQUFpQztBQUMvQixhQUFLK0QsWUFBTCxHQUFvQixLQUFLL0Qsc0JBQUwsQ0FBNEJLLE9BQTVCLENBQW9DMkQsZUFBcEMsRUFBcEI7QUFDRDtBQUNGLEtBMU9rRjtBQTJPbkZDLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QixVQUFNdkUsWUFBWW1DLEVBQUUsa0JBQUYsRUFBc0IsS0FBS1UsT0FBM0IsQ0FBbEI7QUFDQTdDLGdCQUFVQSxTQUFWO0FBQ0EsV0FBS0EsU0FBTCxHQUFpQkEsVUFBVXdFLElBQVYsQ0FBZSxXQUFmLENBQWpCO0FBQ0QsS0EvT2tGO0FBZ1BuRnhCLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsVUFBSSxLQUFLaEQsU0FBVCxFQUFvQjtBQUNsQixhQUFLQSxTQUFMLENBQWV5RSxPQUFmO0FBQ0Q7QUFDRjtBQXBQa0YsR0FBckUsQ0FBaEI7O29CQXVQZTFFLE8iLCJmaWxlIjoiR3JvdXBlZExpc3QuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuR3JvdXBlZExpc3RcclxuICogQGNsYXNzZGVzYyBHcm91cGVkIExpc3QgcHJvdmlkZXMgYSBob29rIGZvciBncm91cGluZyByb3dzIGJlZm9yZSByZW5kZXJpbmcgdGhlbSB0byB0aGUgcGFnZS5cclxuICogVGhlIGdyb3VwaW5nIGFkZHMgYSBjb250YWluZXIgZm9yIHRoZSBzZXQgb2Ygcm93cyBhbmQgaXMgY29sbGFwc2libGUuXHJcbiAqIE5vdGUgdGhhdCBpdCBjb25zdHJ1Y3RzIHRoZSBwYWdlIHNlcXVlbnRpYWxseSBtZWFuaW5nIHRoZSByb3dzIHNob3VsZCBiZSBpbiB0aGUgY29ycmVjdFxyXG4gKiBvcmRlciBiZWZvcmUgYXR0ZW1wdGluZyB0byBncm91cC5cclxuICogQGV4dGVuZHMgYXJnb3MuTGlzdFxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IHN0cmluZyBmcm9tICdkb2pvL3N0cmluZyc7XHJcbmltcG9ydCBMaXN0IGZyb20gJy4vTGlzdCc7XHJcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XHJcblxyXG5cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkdyb3VwZWRMaXN0JywgW0xpc3RdLCAvKiogQGxlbmRzIGFyZ29zLkdyb3VwZWRMaXN0IyAqL3tcclxuICBhY2NvcmRpb246IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBIVE1MIE1hcmt1cC4gVGhpcyBvdmVycmlkZSBhZGRzIHRoZSBuZWVkZWQgc3R5bGluZy5cclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBkYXRhLXRpdGxlPVwieyU9ICQudGl0bGVUZXh0ICV9XCIgY2xhc3M9XCJsaXN0IGdyb3VwZWQtbGlzdCBsaXN0dmlldy1zZWFyY2ggeyU9ICQuY2xzICV9XCIgeyUgaWYgKCQucmVzb3VyY2VLaW5kKSB7ICV9ZGF0YS1yZXNvdXJjZS1raW5kPVwieyU9ICQucmVzb3VyY2VLaW5kICV9XCJ7JSB9ICV9PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cInNjcm9sbGFibGVcIiBkYXRhLXNlbGVjdGFibGU9XCJmYWxzZVwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJzY3JvbGxlck5vZGVcIj4nLFxyXG4gICAgJzxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInNlYXJjaE5vZGVcIj48L2Rpdj4nLFxyXG4gICAgJ3slISAkLmVtcHR5U2VsZWN0aW9uVGVtcGxhdGUgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJhY2NvcmRpb24gcGFuZWwgaW52ZXJzZSBoYXMtaWNvbnNcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIj48L2Rpdj4nLFxyXG4gICAgJ3slISAkLm1vcmVUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQubGlzdEFjdGlvblRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIEdyb3VwIHRlbXBsYXRlIHRoYXQgaW5jbHVkZXMgdGhlIGhlYWRlciBlbGVtZW50IHdpdGggY29sbGFwc2UgYnV0dG9uIGFuZCB0aGUgcm93IGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIGdyb3VwVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLWhlYWRlclwiIHJvbGU9XCJwcmVzZW50YXRpb25cIiBkYXRhLXRhZz1cInslPSAkLnRhZyAlfVwiPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjXCIgcm9sZT1cImJ1dHRvblwiPjxzcGFuPnslOiAkLnRpdGxlICV9PC9zcGFuPjwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tcGFuZVwiIGRhdGEtZ3JvdXA9XCJ7JT0gJC50YWcgJX1cIj5cclxuICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIF0pLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgcGFnZXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgdmlldy4gIFRoaXMgdGVtcGxhdGUgaXMgbm90IGRpcmVjdGx5IHJlbmRlcmVkLCBidXQgaXNcclxuICAgKiBpbmNsdWRlZCBpbiB7QGxpbmsgI3ZpZXdUZW1wbGF0ZX0uXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgbW9yZVRleHQgICAgICAgICAgICBUaGUgdGV4dCB0byBkaXNwbGF5IG9uIHRoZSBtb3JlIGJ1dHRvbi5cclxuICAgKlxyXG4gICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGV4cG9zZXMgdGhlIGZvbGxvd2luZyBhY3Rpb25zOlxyXG4gICAqXHJcbiAgICogKiBtb3JlXHJcbiAgICovXHJcbiAgbW9yZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LW1vcmVcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibW9yZU5vZGVcIj4nLFxyXG4gICAgJzxwIGNsYXNzPVwibGlzdC1yZW1haW5pbmdcIj48c3BhbiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicmVtYWluaW5nQ29udGVudE5vZGVcIj48L3NwYW4+PC9wPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtYWN0aW9uPVwibW9yZVwiPicsXHJcbiAgICAnPHNwYW4+eyU9ICQubW9yZVRleHQgJX08L3NwYW4+JyxcclxuICAgICc8L2J1dHRvbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGN1cnJlbnQgZ3JvdXAgb2JqZWN0IHRoYXQgaXMgY29tcGFyZWQgdG8gdGhlIG5leHQgZW50cmllcyBncm91cCBvYmplY3RcclxuICAgKiBNdXN0IGhhdmUgYSBgdGFnYCBwcm9wZXJ0eSB0aGF0IGlkZW50aWZpZXMgdGhlIGdyb3VwLlxyXG4gICAqIFRoZSBgdGl0bGVgIHByb3BlcnR5IHdpbGwgYmUgcGxhY2VkIGludG8gdGhlIGBncm91cFRlbXBsYXRlYCBmb3IgdGhlIGhlYWRlciB0ZXh0LlxyXG4gICAqL1xyXG4gIF9ncm91cEJ5U2VjdGlvbnM6IG51bGwsXHJcbiAgX2N1cnJlbnRHcm91cEJ5U2VjdGlvbjogbnVsbCxcclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBcImdyb3VwIG9iamVjdFwiLiBUaGUgZ3JvdXAgb2JqZWN0IG11c3QgaGF2ZSBhIHRhZyBwcm9wZXJ0eSB0aGF0IGlzXHJcbiAgICogYmFzZWQgb2ZmIHRoZSBwYXNzZWQgZW50cnkgYXMgaXQgd2lsbCBiZSB1c2VkIHRvIGNvbXBhcmUgdG8gb3RoZXIgZW50cmllcy5cclxuICAgKiBUaGUgdGl0bGUgc2hvdWxkIGFsc28gcmVmbGVjdCB0aGUgY3VycmVudCBlbnRyeSBhcyBpdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSBoZWFkZXIgdGV4dCBpbiB0aGUgZ3JvdXAgc3BsaXR0ZXIuXHJcbiAgICpcclxuICAgKiBBbiBleGFtcGxlIGZvciBhIFllbGxvdyBQYWdlIHR5cGUgbGlzdDpcclxuICAgKlxyXG4gICAqIGBlbnRyeUEgPSB7Zmlyc3Q6ICdIZW5yeScsIGxhc3Q6ICdTbWl0aCcsIHBob25lOiAnMTIzJ31gXHJcbiAgICogYGVudHJ5QiA9IHtmaXJzdDogJ01hcnknLCBsYXN0OiAnU3VlJywgcGhvbmU6ICczNDUnfWBcclxuICAgKlxyXG4gICAqICAgICBncm91cEdyb3VwRm9yRW50cnk6IGZ1bmN0aW9uKGVudHJ5KSB7XHJcbiAgICogICAgICAgICB2YXIgbGFzdEluaXRpYWwgPSBlbnRyeS5sYXN0LnN1YnN0cigwLDEpLnRvVXBwcGVyQ2FzZSgpO1xyXG4gICAqICAgICAgICAgcmV0dXJuIHtcclxuICAgKiAgICAgICAgICAgICB0YWc6IGxhc3RJbml0aWFsLFxyXG4gICAqICAgICAgICAgICAgIHRpdGxlOiBsYXN0SW5pdGlhbFxyXG4gICAqICAgICAgICAgfTtcclxuICAgKiAgICAgfVxyXG4gICAqXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IFRoZSBjdXJyZW50IGVudHJ5IGJlaW5nIHByb2Nlc3NlZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCB0aGF0IGNvbnRhaW5zIGEgdGFnIGFuZCB0aXRsZSBwcm9wZXJ0eSB3aGVyZSB0YWcgd2lsbCBiZSB1c2VkIGluIGNvbXBhcmlzb25zXHJcbiAgICovXHJcbiAgZ2V0R3JvdXBGb3JFbnRyeTogZnVuY3Rpb24gZ2V0R3JvdXBGb3JFbnRyeShlbnRyeSkge1xyXG4gICAgaWYgKHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbikge1xyXG4gICAgICBsZXQgdGl0bGU7XHJcbiAgICAgIGNvbnN0IHNlY3Rpb25EZWYgPSB0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24uc2VjdGlvbi5nZXRTZWN0aW9uKGVudHJ5KTtcclxuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbi5kZXNjcmlwdGlvbikge1xyXG4gICAgICAgIHRpdGxlID0gYCR7dGhpcy5fY3VycmVudEdyb3VwQnlTZWN0aW9uLmRlc2NyaXB0aW9ufTogJHtzZWN0aW9uRGVmLnRpdGxlfWA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGl0bGUgPSBzZWN0aW9uRGVmLnRpdGxlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiBzZWN0aW9uRGVmLmtleSxcclxuICAgICAgICB0aXRsZSxcclxuICAgICAgICBjb2xsYXBzZWQ6ICEhc2VjdGlvbkRlZi5jb2xsYXBzZWQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGFnOiAxLFxyXG4gICAgICB0aXRsZTogJ0RlZmF1bHQnLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE92ZXJ3cml0ZXMgdGhlIHBhcmVudCB7QGxpbmsgTGlzdCNwcm9jZXNzRmVlZCBwcm9jZXNzRmVlZH0gdG8gaW50cm9kdWNlIGdyb3VwaW5nIGJ5IGdyb3VwIHRhZ3MsIHNlZSB7QGxpbmsgI2dldEdyb3VwRm9yRW50cnkgZ2V0R3JvdXBGb3JFbnRyeX0uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGZlZWQgVGhlIFNEYXRhIGZlZWQgcmVzdWx0XHJcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHByb2Nlc3NEYXRhIGluc3RlYWRcclxuICAgKi9cclxuICBwcm9jZXNzRmVlZDogZnVuY3Rpb24gcHJvY2Vzc0ZlZWQoZmVlZCkge1xyXG4gICAgY29uc3QgZ2V0R3JvdXBzTm9kZSA9IFV0aWxpdHkubWVtb2l6ZSh0aGlzLmdldEdyb3Vwc05vZGUuYmluZCh0aGlzKSwgKGVudHJ5R3JvdXApID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5R3JvdXAudGFnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmZlZWQpIHtcclxuICAgICAgdGhpcy5zZXQoJ2xpc3RDb250ZW50JywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmVlZCA9IGZlZWQ7XHJcblxyXG4gICAgaWYgKHRoaXMuZmVlZC4kdG90YWxSZXN1bHRzID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdsaXN0Q29udGVudCcsIHRoaXMubm9EYXRhVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgfSBlbHNlIGlmIChmZWVkLiRyZXNvdXJjZXMpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZWVkLiRyZXNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbnRyeSA9IGZlZWQuJHJlc291cmNlc1tpXTtcclxuICAgICAgICBjb25zdCBlbnRyeUdyb3VwID0gdGhpcy5nZXRHcm91cEZvckVudHJ5KGVudHJ5KTtcclxuXHJcbiAgICAgICAgZW50cnkuJGdyb3VwVGFnID0gZW50cnlHcm91cC50YWc7XHJcbiAgICAgICAgZW50cnkuJGdyb3VwVGl0bGUgPSBlbnRyeUdyb3VwLnRpdGxlO1xyXG5cclxuICAgICAgICB0aGlzLmVudHJpZXNbZW50cnkuJGtleV0gPSBlbnRyeTtcclxuICAgICAgICBjb25zdCByb3dOb2RlID0gJCh0aGlzLnJvd1RlbXBsYXRlLmFwcGx5KGVudHJ5LCB0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5vbkFwcGx5Um93VGVtcGxhdGUoZW50cnksIHJvd05vZGUuZ2V0KDApKTtcclxuICAgICAgICAkKGdldEdyb3Vwc05vZGUoZW50cnlHcm91cCkpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvZG86IGFkZCBtb3JlIHJvYnVzdCBoYW5kbGluZyB3aGVuICR0b3RhbFJlc3VsdHMgZG9lcyBub3QgZXhpc3QsIGkuZS4sIGhpZGUgZWxlbWVudCBjb21wbGV0ZWx5XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuZmVlZC4kdG90YWxSZXN1bHRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBjb25zdCByZW1haW5pbmcgPSB0aGlzLmZlZWQuJHRvdGFsUmVzdWx0cyAtICh0aGlzLmZlZWQuJHN0YXJ0SW5kZXggKyB0aGlzLmZlZWQuJGl0ZW1zUGVyUGFnZSAtIDEpO1xyXG4gICAgICB0aGlzLnNldCgncmVtYWluaW5nQ29udGVudCcsIHN0cmluZy5zdWJzdGl0dXRlKHRoaXMucmVtYWluaW5nVGV4dCwgW3JlbWFpbmluZ10pKTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuZG9tTm9kZSkudG9nZ2xlQ2xhc3MoJ2xpc3QtaGFzLW1vcmUnLCB0aGlzLmhhc01vcmVEYXRhKCkpO1xyXG4gICAgdGhpcy51cGRhdGVTb2hvKCk7XHJcbiAgfSxcclxuICBwcm9jZXNzRGF0YTogZnVuY3Rpb24gcHJvY2Vzc0RhdGEoZW50cmllcykge1xyXG4gICAgY29uc3QgY291bnQgPSBlbnRyaWVzLmxlbmd0aDtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICBjb25zdCBnZXRHcm91cHNOb2RlID0gVXRpbGl0eS5tZW1vaXplKHRoaXMuZ2V0R3JvdXBzTm9kZS5iaW5kKHRoaXMpLCAoZW50cnlHcm91cCkgPT4ge1xyXG4gICAgICByZXR1cm4gZW50cnlHcm91cC50YWc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fcHJvY2Vzc0VudHJ5KGVudHJpZXNbaV0pO1xyXG4gICAgICAgIHRoaXMuZW50cmllc1tzdG9yZS5nZXRJZGVudGl0eShlbnRyeSldID0gZW50cnk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudHJ5R3JvdXAgPSB0aGlzLmdldEdyb3VwRm9yRW50cnkoZW50cnkpO1xyXG5cclxuICAgICAgICBlbnRyeS4kZ3JvdXBUYWcgPSBlbnRyeUdyb3VwLnRhZztcclxuICAgICAgICBlbnRyeS4kZ3JvdXBUaXRsZSA9IGVudHJ5R3JvdXAudGl0bGU7XHJcblxyXG4gICAgICAgIGNvbnN0IHJvd05vZGUgPSAkKHRoaXMucm93VGVtcGxhdGUuYXBwbHkoZW50cnksIHRoaXMpKTtcclxuICAgICAgICB0aGlzLm9uQXBwbHlSb3dUZW1wbGF0ZShlbnRyeSwgcm93Tm9kZS5nZXQoMCkpO1xyXG5cclxuICAgICAgICAkKGdldEdyb3Vwc05vZGUoZW50cnlHcm91cCkpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVTb2hvKCk7XHJcbiAgfSxcclxuICBnZXRHcm91cHNOb2RlOiBmdW5jdGlvbiBnZXRHcm91cHNOb2RlKGVudHJ5R3JvdXApIHtcclxuICAgIGxldCByZXN1bHRzID0gJChgW2RhdGEtZ3JvdXA9XCIke2VudHJ5R3JvdXAudGFnfVwiXWAsIHRoaXMuY29udGVudE5vZGUpO1xyXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXN1bHRzID0gcmVzdWx0cy5nZXQoMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBEb2VzIG5vdCBleGlzdCwgbGV0cyBjcmVhdGUgaXRcclxuICAgICAgcmVzdWx0cyA9ICQodGhpcy5ncm91cFRlbXBsYXRlLmFwcGx5KGVudHJ5R3JvdXAsIHRoaXMpKTtcclxuICAgICAgJCh0aGlzLmNvbnRlbnROb2RlKS5hcHBlbmQocmVzdWx0cyk7XHJcbiAgICAgIC8vIHJlLXF1ZXJ5IHdoYXQgd2UganVzdCBwbGFjZSBpbiAod2hpY2ggd2FzIGEgZG9jIGZyYWcpXHJcbiAgICAgIHJlc3VsdHMgPSAkKGBbZGF0YS1ncm91cD1cIiR7ZW50cnlHcm91cC50YWd9XCJdYCwgdGhpcy5jb250ZW50Tm9kZSkuZ2V0KDApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIG9uIGFwcGxpY2F0aW9uIHN0YXJ0dXAgdG8gY29uZmlndXJlIHRoZSBzZWFyY2ggd2lkZ2V0IGlmIHByZXNlbnQgYW5kIGNyZWF0ZSB0aGUgbGlzdCBhY3Rpb25zLlxyXG4gICAqL1xyXG4gIHN0YXJ0dXA6IGZ1bmN0aW9uIHN0YXJ0dXAoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChzdGFydHVwLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5faW5pdEdyb3VwQnlTZWN0aW9ucygpO1xyXG4gIH0sXHJcbiAgX2luaXRHcm91cEJ5U2VjdGlvbnM6IGZ1bmN0aW9uIF9pbml0R3JvdXBCeVNlY3Rpb25zKCkge1xyXG4gICAgdGhpcy5fZ3JvdXBCeVNlY3Rpb25zID0gdGhpcy5nZXRHcm91cEJ5U2VjdGlvbnMoKTtcclxuICAgIHRoaXMuc2V0RGVmYXVsdEdyb3VwQnlTZWN0aW9uKCk7XHJcbiAgICB0aGlzLmFwcGx5R3JvdXBCeU9yZGVyQnkoKTtcclxuICB9LFxyXG4gIHNldERlZmF1bHRHcm91cEJ5U2VjdGlvbjogZnVuY3Rpb24gc2V0RGVmYXVsdEdyb3VwQnlTZWN0aW9uKCkge1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGlmICh0aGlzLl9ncm91cEJ5U2VjdGlvbnMpIHtcclxuICAgICAgY291bnQgPSB0aGlzLl9ncm91cEJ5U2VjdGlvbnMubGVuZ3RoO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5fZ3JvdXBCeVNlY3Rpb25zW2ldLmlzRGVmYXVsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdGhpcy5fY3VycmVudEdyb3VwQnlTZWN0aW9uID0gdGhpcy5fZ3JvdXBCeVNlY3Rpb25zW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoKHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbiA9PT0gbnVsbCkgJiYgKGNvdW50ID4gMCkpIHtcclxuICAgICAgICB0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24gPSB0aGlzLl9ncm91cEJ5U2VjdGlvbnNbMF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGdldEdyb3VwQnlTZWN0aW9uOiBmdW5jdGlvbiBnZXRHcm91cEJ5U2VjdGlvbihzZWN0aW9uSWQpIHtcclxuICAgIGxldCBncm91cFNlY3Rpb24gPSBudWxsO1xyXG4gICAgaWYgKHRoaXMuX2dyb3VwQnlTZWN0aW9ucykge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2dyb3VwQnlTZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLl9ncm91cEJ5U2VjdGlvbnNbaV0uSWQgPT09IHNlY3Rpb25JZCkge1xyXG4gICAgICAgICAgZ3JvdXBTZWN0aW9uID0gdGhpcy5fZ3JvdXBCeVNlY3Rpb25zW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdyb3VwU2VjdGlvbjtcclxuICB9LFxyXG4gIHNldEN1cnJlbnRHcm91cEJ5U2VjdGlvbjogZnVuY3Rpb24gc2V0Q3VycmVudEdyb3VwQnlTZWN0aW9uKHNlY3Rpb25JZCkge1xyXG4gICAgdGhpcy5fY3VycmVudEdyb3VwQnlTZWN0aW9uID0gdGhpcy5nZXRHcm91cEJ5U2VjdGlvbihzZWN0aW9uSWQpO1xyXG4gICAgdGhpcy5hcHBseUdyb3VwQnlPcmRlckJ5KCk7IC8vIG5lZWQgdG8gcmVmcmVzaCB2aWV3XHJcbiAgfSxcclxuICBnZXRHcm91cEJ5U2VjdGlvbnM6IGZ1bmN0aW9uIGdldEdyb3VwQnlTZWN0aW9ucygpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbiAgYXBwbHlHcm91cEJ5T3JkZXJCeTogZnVuY3Rpb24gYXBwbHlHcm91cEJ5T3JkZXJCeSgpIHtcclxuICAgIGlmICh0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24pIHtcclxuICAgICAgdGhpcy5xdWVyeU9yZGVyQnkgPSB0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24uc2VjdGlvbi5nZXRPcmRlckJ5UXVlcnkoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGluaXRTb2hvOiBmdW5jdGlvbiBpbml0U29obygpIHtcclxuICAgIGNvbnN0IGFjY29yZGlvbiA9ICQoJy5hY2NvcmRpb24ucGFuZWwnLCB0aGlzLmRvbU5vZGUpO1xyXG4gICAgYWNjb3JkaW9uLmFjY29yZGlvbigpO1xyXG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb24uZGF0YSgnYWNjb3JkaW9uJyk7XHJcbiAgfSxcclxuICB1cGRhdGVTb2hvOiBmdW5jdGlvbiB1cGRhdGVTb2hvKCkge1xyXG4gICAgaWYgKHRoaXMuYWNjb3JkaW9uKSB7XHJcbiAgICAgIHRoaXMuYWNjb3JkaW9uLnVwZGF0ZWQoKTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==