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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Hcm91cGVkTGlzdC5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwiYWNjb3JkaW9uIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImdyb3VwVGVtcGxhdGUiLCJtb3JlVGVtcGxhdGUiLCJfZ3JvdXBCeVNlY3Rpb25zIiwiX2N1cnJlbnRHcm91cEJ5U2VjdGlvbiIsImdldEdyb3VwRm9yRW50cnkiLCJlbnRyeSIsInRpdGxlIiwic2VjdGlvbkRlZiIsInNlY3Rpb24iLCJnZXRTZWN0aW9uIiwiZGVzY3JpcHRpb24iLCJ0YWciLCJrZXkiLCJjb2xsYXBzZWQiLCJwcm9jZXNzRmVlZCIsImZlZWQiLCJnZXRHcm91cHNOb2RlIiwibWVtb2l6ZSIsImJpbmQiLCJlbnRyeUdyb3VwIiwic2V0IiwiJHRvdGFsUmVzdWx0cyIsIm5vRGF0YVRlbXBsYXRlIiwiYXBwbHkiLCIkcmVzb3VyY2VzIiwiaSIsImxlbmd0aCIsIiRncm91cFRhZyIsIiRncm91cFRpdGxlIiwiZW50cmllcyIsIiRrZXkiLCJyb3dOb2RlIiwiJCIsInJvd1RlbXBsYXRlIiwib25BcHBseVJvd1RlbXBsYXRlIiwiZ2V0IiwiYXBwZW5kIiwicmVtYWluaW5nIiwiJHN0YXJ0SW5kZXgiLCIkaXRlbXNQZXJQYWdlIiwic3Vic3RpdHV0ZSIsInJlbWFpbmluZ1RleHQiLCJkb21Ob2RlIiwidG9nZ2xlQ2xhc3MiLCJoYXNNb3JlRGF0YSIsInVwZGF0ZVNvaG8iLCJwcm9jZXNzRGF0YSIsImNvdW50Iiwic3RvcmUiLCJfcHJvY2Vzc0VudHJ5IiwiZ2V0SWRlbnRpdHkiLCJyZXN1bHRzIiwiY29udGVudE5vZGUiLCJzdGFydHVwIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX2luaXRHcm91cEJ5U2VjdGlvbnMiLCJnZXRHcm91cEJ5U2VjdGlvbnMiLCJzZXREZWZhdWx0R3JvdXBCeVNlY3Rpb24iLCJhcHBseUdyb3VwQnlPcmRlckJ5IiwiaXNEZWZhdWx0IiwiZ2V0R3JvdXBCeVNlY3Rpb24iLCJzZWN0aW9uSWQiLCJncm91cFNlY3Rpb24iLCJJZCIsInNldEN1cnJlbnRHcm91cEJ5U2VjdGlvbiIsInF1ZXJ5T3JkZXJCeSIsImdldE9yZGVyQnlRdWVyeSIsImluaXRTb2hvIiwiZGF0YSIsInVwZGF0ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7O0FBY0EsTUFBTUEsVUFBVSx1QkFBUSxtQkFBUixFQUE2QixnQkFBN0IsRUFBcUMsZ0NBQWdDO0FBQ25GQyxlQUFXLElBRHdFOztBQUduRjs7OztBQUlBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLDRMQUQyQixFQUUzQix3RkFGMkIsRUFHM0IsaURBSDJCLEVBSTNCLGlDQUoyQixFQUszQiw0RkFMMkIsRUFNM0IsdUJBTjJCLEVBTzNCLDZCQVAyQixFQVEzQixRQVIyQixFQVMzQixRQVQyQixDQUFiLENBUG1FO0FBa0JuRjs7OztBQUlBQyxtQkFBZSxJQUFJRCxRQUFKLENBQWEseVBBQWIsQ0F0Qm9FOztBQStCbkY7Ozs7Ozs7Ozs7Ozs7OztBQWVBRSxrQkFBYyxJQUFJRixRQUFKLENBQWEsQ0FDekIsMkRBRHlCLEVBRXpCLDJGQUZ5QixFQUd6Qix5Q0FIeUIsRUFJekIsZ0NBSnlCLEVBS3pCLFdBTHlCLEVBTXpCLFFBTnlCLENBQWIsQ0E5Q3FFO0FBc0RuRjs7Ozs7O0FBTUFHLHNCQUFrQixJQTVEaUU7QUE2RG5GQyw0QkFBd0IsSUE3RDJEO0FBOERuRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQUMsc0JBQWtCLFNBQVNBLGdCQUFULENBQTBCQyxLQUExQixFQUFpQztBQUNqRCxVQUFJLEtBQUtGLHNCQUFULEVBQWlDO0FBQy9CLFlBQUlHLGNBQUo7QUFDQSxZQUFNQyxhQUFhLEtBQUtKLHNCQUFMLENBQTRCSyxPQUE1QixDQUFvQ0MsVUFBcEMsQ0FBK0NKLEtBQS9DLENBQW5CO0FBQ0EsWUFBSSxLQUFLRixzQkFBTCxDQUE0Qk8sV0FBaEMsRUFBNkM7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eEIsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxVQUFJLEtBQUtoRCxTQUFULEVBQW9CO0FBQ2xCLGFBQUtBLFNBQUwsQ0FBZXlFLE9BQWY7QUFDRDtBQUNGO0FBcFBrRixHQUFyRSxDQUFoQjs7b0JBdVBlMUUsTyIsImZpbGUiOiJHcm91cGVkTGlzdC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5Hcm91cGVkTGlzdFxyXG4gKiBAY2xhc3NkZXNjIEdyb3VwZWQgTGlzdCBwcm92aWRlcyBhIGhvb2sgZm9yIGdyb3VwaW5nIHJvd3MgYmVmb3JlIHJlbmRlcmluZyB0aGVtIHRvIHRoZSBwYWdlLlxyXG4gKiBUaGUgZ3JvdXBpbmcgYWRkcyBhIGNvbnRhaW5lciBmb3IgdGhlIHNldCBvZiByb3dzIGFuZCBpcyBjb2xsYXBzaWJsZS5cclxuICogTm90ZSB0aGF0IGl0IGNvbnN0cnVjdHMgdGhlIHBhZ2Ugc2VxdWVudGlhbGx5IG1lYW5pbmcgdGhlIHJvd3Mgc2hvdWxkIGJlIGluIHRoZSBjb3JyZWN0XHJcbiAqIG9yZGVyIGJlZm9yZSBhdHRlbXB0aW5nIHRvIGdyb3VwLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5MaXN0XHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IExpc3QgZnJvbSAnLi9MaXN0JztcclxuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcclxuXHJcblxyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuR3JvdXBlZExpc3QnLCBbTGlzdF0sIC8qKiBAbGVuZHMgYXJnb3MuR3JvdXBlZExpc3QjICove1xyXG4gIGFjY29yZGlvbjogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIEhUTUwgTWFya3VwLiBUaGlzIG92ZXJyaWRlIGFkZHMgdGhlIG5lZWRlZCBzdHlsaW5nLlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JT0gJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cImxpc3QgZ3JvdXBlZC1saXN0IGxpc3R2aWV3LXNlYXJjaCB7JT0gJC5jbHMgJX1cIiB7JSBpZiAoJC5yZXNvdXJjZUtpbmQpIHsgJX1kYXRhLXJlc291cmNlLWtpbmQ9XCJ7JT0gJC5yZXNvdXJjZUtpbmQgJX1cInslIH0gJX0+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwic2Nyb2xsYWJsZVwiIGRhdGEtc2VsZWN0YWJsZT1cImZhbHNlXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInNjcm9sbGVyTm9kZVwiPicsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwic2VhcmNoTm9kZVwiPjwvZGl2PicsXHJcbiAgICAneyUhICQuZW1wdHlTZWxlY3Rpb25UZW1wbGF0ZSAlfScsXHJcbiAgICAnPGRpdiBjbGFzcz1cImFjY29yZGlvbiBwYW5lbCBpbnZlcnNlIGhhcy1pY29uc1wiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJjb250ZW50Tm9kZVwiPjwvZGl2PicsXHJcbiAgICAneyUhICQubW9yZVRlbXBsYXRlICV9JyxcclxuICAgICd7JSEgJC5saXN0QWN0aW9uVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgR3JvdXAgdGVtcGxhdGUgdGhhdCBpbmNsdWRlcyB0aGUgaGVhZGVyIGVsZW1lbnQgd2l0aCBjb2xsYXBzZSBidXR0b24gYW5kIHRoZSByb3cgY29udGFpbmVyXHJcbiAgICovXHJcbiAgZ3JvdXBUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24taGVhZGVyXCIgcm9sZT1cInByZXNlbnRhdGlvblwiIGRhdGEtdGFnPVwieyU9ICQudGFnICV9XCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNcIiByb2xlPVwiYnV0dG9uXCI+PHNwYW4+eyU6ICQudGl0bGUgJX08L3NwYW4+PC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lXCIgZGF0YS1ncm91cD1cInslPSAkLnRhZyAlfVwiPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgXSksXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSBwYWdlciBhdCB0aGUgYm90dG9tIG9mIHRoZSB2aWV3LiAgVGhpcyB0ZW1wbGF0ZSBpcyBub3QgZGlyZWN0bHkgcmVuZGVyZWQsIGJ1dCBpc1xyXG4gICAqIGluY2x1ZGVkIGluIHtAbGluayAjdmlld1RlbXBsYXRlfS5cclxuICAgKlxyXG4gICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIHVzZXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAqXHJcbiAgICogICAgICBuYW1lICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICogICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogICAgICBtb3JlVGV4dCAgICAgICAgICAgIFRoZSB0ZXh0IHRvIGRpc3BsYXkgb24gdGhlIG1vcmUgYnV0dG9uLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgZXhwb3NlcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XHJcbiAgICpcclxuICAgKiAqIG1vcmVcclxuICAgKi9cclxuICBtb3JlVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImxpc3QtbW9yZVwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJtb3JlTm9kZVwiPicsXHJcbiAgICAnPHAgY2xhc3M9XCJsaXN0LXJlbWFpbmluZ1wiPjxzcGFuIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJyZW1haW5pbmdDb250ZW50Tm9kZVwiPjwvc3Bhbj48L3A+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwiYnRuXCIgZGF0YS1hY3Rpb249XCJtb3JlXCI+JyxcclxuICAgICc8c3Bhbj57JT0gJC5tb3JlVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvYnV0dG9uPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgY3VycmVudCBncm91cCBvYmplY3QgdGhhdCBpcyBjb21wYXJlZCB0byB0aGUgbmV4dCBlbnRyaWVzIGdyb3VwIG9iamVjdFxyXG4gICAqIE11c3QgaGF2ZSBhIGB0YWdgIHByb3BlcnR5IHRoYXQgaWRlbnRpZmllcyB0aGUgZ3JvdXAuXHJcbiAgICogVGhlIGB0aXRsZWAgcHJvcGVydHkgd2lsbCBiZSBwbGFjZWQgaW50byB0aGUgYGdyb3VwVGVtcGxhdGVgIGZvciB0aGUgaGVhZGVyIHRleHQuXHJcbiAgICovXHJcbiAgX2dyb3VwQnlTZWN0aW9uczogbnVsbCxcclxuICBfY3VycmVudEdyb3VwQnlTZWN0aW9uOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIFwiZ3JvdXAgb2JqZWN0XCIuIFRoZSBncm91cCBvYmplY3QgbXVzdCBoYXZlIGEgdGFnIHByb3BlcnR5IHRoYXQgaXNcclxuICAgKiBiYXNlZCBvZmYgdGhlIHBhc3NlZCBlbnRyeSBhcyBpdCB3aWxsIGJlIHVzZWQgdG8gY29tcGFyZSB0byBvdGhlciBlbnRyaWVzLlxyXG4gICAqIFRoZSB0aXRsZSBzaG91bGQgYWxzbyByZWZsZWN0IHRoZSBjdXJyZW50IGVudHJ5IGFzIGl0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIGhlYWRlciB0ZXh0IGluIHRoZSBncm91cCBzcGxpdHRlci5cclxuICAgKlxyXG4gICAqIEFuIGV4YW1wbGUgZm9yIGEgWWVsbG93IFBhZ2UgdHlwZSBsaXN0OlxyXG4gICAqXHJcbiAgICogYGVudHJ5QSA9IHtmaXJzdDogJ0hlbnJ5JywgbGFzdDogJ1NtaXRoJywgcGhvbmU6ICcxMjMnfWBcclxuICAgKiBgZW50cnlCID0ge2ZpcnN0OiAnTWFyeScsIGxhc3Q6ICdTdWUnLCBwaG9uZTogJzM0NSd9YFxyXG4gICAqXHJcbiAgICogICAgIGdyb3VwR3JvdXBGb3JFbnRyeTogZnVuY3Rpb24oZW50cnkpIHtcclxuICAgKiAgICAgICAgIHZhciBsYXN0SW5pdGlhbCA9IGVudHJ5Lmxhc3Quc3Vic3RyKDAsMSkudG9VcHBwZXJDYXNlKCk7XHJcbiAgICogICAgICAgICByZXR1cm4ge1xyXG4gICAqICAgICAgICAgICAgIHRhZzogbGFzdEluaXRpYWwsXHJcbiAgICogICAgICAgICAgICAgdGl0bGU6IGxhc3RJbml0aWFsXHJcbiAgICogICAgICAgICB9O1xyXG4gICAqICAgICB9XHJcbiAgICpcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgVGhlIGN1cnJlbnQgZW50cnkgYmVpbmcgcHJvY2Vzc2VkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gT2JqZWN0IHRoYXQgY29udGFpbnMgYSB0YWcgYW5kIHRpdGxlIHByb3BlcnR5IHdoZXJlIHRhZyB3aWxsIGJlIHVzZWQgaW4gY29tcGFyaXNvbnNcclxuICAgKi9cclxuICBnZXRHcm91cEZvckVudHJ5OiBmdW5jdGlvbiBnZXRHcm91cEZvckVudHJ5KGVudHJ5KSB7XHJcbiAgICBpZiAodGhpcy5fY3VycmVudEdyb3VwQnlTZWN0aW9uKSB7XHJcbiAgICAgIGxldCB0aXRsZTtcclxuICAgICAgY29uc3Qgc2VjdGlvbkRlZiA9IHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbi5zZWN0aW9uLmdldFNlY3Rpb24oZW50cnkpO1xyXG4gICAgICBpZiAodGhpcy5fY3VycmVudEdyb3VwQnlTZWN0aW9uLmRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgdGl0bGUgPSBgJHt0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24uZGVzY3JpcHRpb259OiAke3NlY3Rpb25EZWYudGl0bGV9YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aXRsZSA9IHNlY3Rpb25EZWYudGl0bGU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0YWc6IHNlY3Rpb25EZWYua2V5LFxyXG4gICAgICAgIHRpdGxlLFxyXG4gICAgICAgIGNvbGxhcHNlZDogISFzZWN0aW9uRGVmLmNvbGxhcHNlZCxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0YWc6IDEsXHJcbiAgICAgIHRpdGxlOiAnRGVmYXVsdCcsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogT3ZlcndyaXRlcyB0aGUgcGFyZW50IHtAbGluayBMaXN0I3Byb2Nlc3NGZWVkIHByb2Nlc3NGZWVkfSB0byBpbnRyb2R1Y2UgZ3JvdXBpbmcgYnkgZ3JvdXAgdGFncywgc2VlIHtAbGluayAjZ2V0R3JvdXBGb3JFbnRyeSBnZXRHcm91cEZvckVudHJ5fS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZmVlZCBUaGUgU0RhdGEgZmVlZCByZXN1bHRcclxuICAgKiBAZGVwcmVjYXRlZCBVc2UgcHJvY2Vzc0RhdGEgaW5zdGVhZFxyXG4gICAqL1xyXG4gIHByb2Nlc3NGZWVkOiBmdW5jdGlvbiBwcm9jZXNzRmVlZChmZWVkKSB7XHJcbiAgICBjb25zdCBnZXRHcm91cHNOb2RlID0gVXRpbGl0eS5tZW1vaXplKHRoaXMuZ2V0R3JvdXBzTm9kZS5iaW5kKHRoaXMpLCAoZW50cnlHcm91cCkgPT4ge1xyXG4gICAgICByZXR1cm4gZW50cnlHcm91cC50YWc7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuZmVlZCkge1xyXG4gICAgICB0aGlzLnNldCgnbGlzdENvbnRlbnQnLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mZWVkID0gZmVlZDtcclxuXHJcbiAgICBpZiAodGhpcy5mZWVkLiR0b3RhbFJlc3VsdHMgPT09IDApIHtcclxuICAgICAgdGhpcy5zZXQoJ2xpc3RDb250ZW50JywgdGhpcy5ub0RhdGFUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICB9IGVsc2UgaWYgKGZlZWQuJHJlc291cmNlcykge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlZWQuJHJlc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gZmVlZC4kcmVzb3VyY2VzW2ldO1xyXG4gICAgICAgIGNvbnN0IGVudHJ5R3JvdXAgPSB0aGlzLmdldEdyb3VwRm9yRW50cnkoZW50cnkpO1xyXG5cclxuICAgICAgICBlbnRyeS4kZ3JvdXBUYWcgPSBlbnRyeUdyb3VwLnRhZztcclxuICAgICAgICBlbnRyeS4kZ3JvdXBUaXRsZSA9IGVudHJ5R3JvdXAudGl0bGU7XHJcblxyXG4gICAgICAgIHRoaXMuZW50cmllc1tlbnRyeS4ka2V5XSA9IGVudHJ5O1xyXG4gICAgICAgIGNvbnN0IHJvd05vZGUgPSAkKHRoaXMucm93VGVtcGxhdGUuYXBwbHkoZW50cnksIHRoaXMpKTtcclxuICAgICAgICB0aGlzLm9uQXBwbHlSb3dUZW1wbGF0ZShlbnRyeSwgcm93Tm9kZS5nZXQoMCkpO1xyXG4gICAgICAgICQoZ2V0R3JvdXBzTm9kZShlbnRyeUdyb3VwKSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9kbzogYWRkIG1vcmUgcm9idXN0IGhhbmRsaW5nIHdoZW4gJHRvdGFsUmVzdWx0cyBkb2VzIG5vdCBleGlzdCwgaS5lLiwgaGlkZSBlbGVtZW50IGNvbXBsZXRlbHlcclxuICAgIGlmICh0eXBlb2YgdGhpcy5mZWVkLiR0b3RhbFJlc3VsdHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMuZmVlZC4kdG90YWxSZXN1bHRzIC0gKHRoaXMuZmVlZC4kc3RhcnRJbmRleCArIHRoaXMuZmVlZC4kaXRlbXNQZXJQYWdlIC0gMSk7XHJcbiAgICAgIHRoaXMuc2V0KCdyZW1haW5pbmdDb250ZW50Jywgc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5yZW1haW5pbmdUZXh0LCBbcmVtYWluaW5nXSkpO1xyXG4gICAgfVxyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS50b2dnbGVDbGFzcygnbGlzdC1oYXMtbW9yZScsIHRoaXMuaGFzTW9yZURhdGEoKSk7XHJcbiAgICB0aGlzLnVwZGF0ZVNvaG8oKTtcclxuICB9LFxyXG4gIHByb2Nlc3NEYXRhOiBmdW5jdGlvbiBwcm9jZXNzRGF0YShlbnRyaWVzKSB7XHJcbiAgICBjb25zdCBjb3VudCA9IGVudHJpZXMubGVuZ3RoO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIGNvbnN0IGdldEdyb3Vwc05vZGUgPSBVdGlsaXR5Lm1lbW9pemUodGhpcy5nZXRHcm91cHNOb2RlLmJpbmQodGhpcyksIChlbnRyeUdyb3VwKSA9PiB7XHJcbiAgICAgIHJldHVybiBlbnRyeUdyb3VwLnRhZztcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLl9wcm9jZXNzRW50cnkoZW50cmllc1tpXSk7XHJcbiAgICAgICAgdGhpcy5lbnRyaWVzW3N0b3JlLmdldElkZW50aXR5KGVudHJ5KV0gPSBlbnRyeTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cnlHcm91cCA9IHRoaXMuZ2V0R3JvdXBGb3JFbnRyeShlbnRyeSk7XHJcblxyXG4gICAgICAgIGVudHJ5LiRncm91cFRhZyA9IGVudHJ5R3JvdXAudGFnO1xyXG4gICAgICAgIGVudHJ5LiRncm91cFRpdGxlID0gZW50cnlHcm91cC50aXRsZTtcclxuXHJcbiAgICAgICAgY29uc3Qgcm93Tm9kZSA9ICQodGhpcy5yb3dUZW1wbGF0ZS5hcHBseShlbnRyeSwgdGhpcykpO1xyXG4gICAgICAgIHRoaXMub25BcHBseVJvd1RlbXBsYXRlKGVudHJ5LCByb3dOb2RlLmdldCgwKSk7XHJcblxyXG4gICAgICAgICQoZ2V0R3JvdXBzTm9kZShlbnRyeUdyb3VwKSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVNvaG8oKTtcclxuICB9LFxyXG4gIGdldEdyb3Vwc05vZGU6IGZ1bmN0aW9uIGdldEdyb3Vwc05vZGUoZW50cnlHcm91cCkge1xyXG4gICAgbGV0IHJlc3VsdHMgPSAkKGBbZGF0YS1ncm91cD1cIiR7ZW50cnlHcm91cC50YWd9XCJdYCwgdGhpcy5jb250ZW50Tm9kZSk7XHJcbiAgICBpZiAocmVzdWx0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmdldCgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIERvZXMgbm90IGV4aXN0LCBsZXRzIGNyZWF0ZSBpdFxyXG4gICAgICByZXN1bHRzID0gJCh0aGlzLmdyb3VwVGVtcGxhdGUuYXBwbHkoZW50cnlHcm91cCwgdGhpcykpO1xyXG4gICAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZChyZXN1bHRzKTtcclxuICAgICAgLy8gcmUtcXVlcnkgd2hhdCB3ZSBqdXN0IHBsYWNlIGluICh3aGljaCB3YXMgYSBkb2MgZnJhZylcclxuICAgICAgcmVzdWx0cyA9ICQoYFtkYXRhLWdyb3VwPVwiJHtlbnRyeUdyb3VwLnRhZ31cIl1gLCB0aGlzLmNvbnRlbnROb2RlKS5nZXQoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgb24gYXBwbGljYXRpb24gc3RhcnR1cCB0byBjb25maWd1cmUgdGhlIHNlYXJjaCB3aWRnZXQgaWYgcHJlc2VudCBhbmQgY3JlYXRlIHRoZSBsaXN0IGFjdGlvbnMuXHJcbiAgICovXHJcbiAgc3RhcnR1cDogZnVuY3Rpb24gc3RhcnR1cCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLl9pbml0R3JvdXBCeVNlY3Rpb25zKCk7XHJcbiAgfSxcclxuICBfaW5pdEdyb3VwQnlTZWN0aW9uczogZnVuY3Rpb24gX2luaXRHcm91cEJ5U2VjdGlvbnMoKSB7XHJcbiAgICB0aGlzLl9ncm91cEJ5U2VjdGlvbnMgPSB0aGlzLmdldEdyb3VwQnlTZWN0aW9ucygpO1xyXG4gICAgdGhpcy5zZXREZWZhdWx0R3JvdXBCeVNlY3Rpb24oKTtcclxuICAgIHRoaXMuYXBwbHlHcm91cEJ5T3JkZXJCeSgpO1xyXG4gIH0sXHJcbiAgc2V0RGVmYXVsdEdyb3VwQnlTZWN0aW9uOiBmdW5jdGlvbiBzZXREZWZhdWx0R3JvdXBCeVNlY3Rpb24oKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgaWYgKHRoaXMuX2dyb3VwQnlTZWN0aW9ucykge1xyXG4gICAgICBjb3VudCA9IHRoaXMuX2dyb3VwQnlTZWN0aW9ucy5sZW5ndGg7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLl9ncm91cEJ5U2VjdGlvbnNbaV0uaXNEZWZhdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24gPSB0aGlzLl9ncm91cEJ5U2VjdGlvbnNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICgodGhpcy5fY3VycmVudEdyb3VwQnlTZWN0aW9uID09PSBudWxsKSAmJiAoY291bnQgPiAwKSkge1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbiA9IHRoaXMuX2dyb3VwQnlTZWN0aW9uc1swXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0R3JvdXBCeVNlY3Rpb246IGZ1bmN0aW9uIGdldEdyb3VwQnlTZWN0aW9uKHNlY3Rpb25JZCkge1xyXG4gICAgbGV0IGdyb3VwU2VjdGlvbiA9IG51bGw7XHJcbiAgICBpZiAodGhpcy5fZ3JvdXBCeVNlY3Rpb25zKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZ3JvdXBCeVNlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dyb3VwQnlTZWN0aW9uc1tpXS5JZCA9PT0gc2VjdGlvbklkKSB7XHJcbiAgICAgICAgICBncm91cFNlY3Rpb24gPSB0aGlzLl9ncm91cEJ5U2VjdGlvbnNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZ3JvdXBTZWN0aW9uO1xyXG4gIH0sXHJcbiAgc2V0Q3VycmVudEdyb3VwQnlTZWN0aW9uOiBmdW5jdGlvbiBzZXRDdXJyZW50R3JvdXBCeVNlY3Rpb24oc2VjdGlvbklkKSB7XHJcbiAgICB0aGlzLl9jdXJyZW50R3JvdXBCeVNlY3Rpb24gPSB0aGlzLmdldEdyb3VwQnlTZWN0aW9uKHNlY3Rpb25JZCk7XHJcbiAgICB0aGlzLmFwcGx5R3JvdXBCeU9yZGVyQnkoKTsgLy8gbmVlZCB0byByZWZyZXNoIHZpZXdcclxuICB9LFxyXG4gIGdldEdyb3VwQnlTZWN0aW9uczogZnVuY3Rpb24gZ2V0R3JvdXBCeVNlY3Rpb25zKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICBhcHBseUdyb3VwQnlPcmRlckJ5OiBmdW5jdGlvbiBhcHBseUdyb3VwQnlPcmRlckJ5KCkge1xyXG4gICAgaWYgKHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbikge1xyXG4gICAgICB0aGlzLnF1ZXJ5T3JkZXJCeSA9IHRoaXMuX2N1cnJlbnRHcm91cEJ5U2VjdGlvbi5zZWN0aW9uLmdldE9yZGVyQnlRdWVyeSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5pdFNvaG86IGZ1bmN0aW9uIGluaXRTb2hvKCkge1xyXG4gICAgY29uc3QgYWNjb3JkaW9uID0gJCgnLmFjY29yZGlvbi5wYW5lbCcsIHRoaXMuZG9tTm9kZSk7XHJcbiAgICBhY2NvcmRpb24uYWNjb3JkaW9uKCk7XHJcbiAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbi5kYXRhKCdhY2NvcmRpb24nKTtcclxuICB9LFxyXG4gIHVwZGF0ZVNvaG86IGZ1bmN0aW9uIHVwZGF0ZVNvaG8oKSB7XHJcbiAgICBpZiAodGhpcy5hY2NvcmRpb24pIHtcclxuICAgICAgdGhpcy5hY2NvcmRpb24udXBkYXRlZCgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19