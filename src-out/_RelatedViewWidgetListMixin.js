define('argos/_RelatedViewWidgetListMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './RelatedViewManager'], function (module, exports, _declare, _lang, _RelatedViewManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _RelatedViewManager2 = _interopRequireDefault(_RelatedViewManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos._RelatedViewWidgetListMixin
   */
  var __class = (0, _declare2.default)('argos._RelatedViewWidgetListMixin', null, /** @lends argos._RelatedViewWidgetListMixin# */{
    /**
     * The related view definitions for related views for each row.
     */
    relatedViews: null,
    /**
     * The related view managers for each related view definition.
     */
    relatedViewManagers: null,
    /**
     * @property {Simplate}
     * The template used to render the single list action row.
     */
    listActionTemplate: new Simplate(['<ul data-dojo-attach-point="actionsNode" id="popupmenu-{%= $$.getItemActionKey($) %}" class="actions-row popupmenu actions top">{%! $$.loadingTemplate %}</ul>\n    <div data-dojo-attach-point="relatedActionsNode" class="related-view-list-action"><a></a></div>']),
    startup: function startup() {
      this.relatedViews = this._createCustomizedLayout(this.createRelatedViewLayout(), 'relatedViews');
      this.inherited(startup, arguments);
    },
    /**
     * Sets and returns the related view definition, this method should be overriden in the view
     * so that you may define the related views that will be add to each row in the list.
     * @return {Object} this.relatedViews
     */
    createRelatedViewLayout: function createRelatedViewLayout() {
      return this.relatedViews || (this.relatedViews = {});
    },
    onApplyRowTemplate: function onApplyRowTemplate(entry, rowNode) {
      if (this.relatedViews.length > 0) {
        this.onProcessRelatedViews(entry, rowNode);
      }
      this.inherited(onApplyRowTemplate, arguments);
    },
    selectEntry: function selectEntry() {
      this.destroyRelatedView(this.currentRelatedView);
      this.currentRelatedView = null;
      this.inherited(selectEntry, arguments);
    },
    /**
     * Gets the related view manager for a related view definition.
     * If a manager is not found a new Related View Manager is created and returned.
     * @return {Object} RelatedViewManager
     */
    getRelatedViewManager: function getRelatedViewManager(relatedView) {
      if (!this.relatedViewManagers) {
        this.relatedViewManagers = {};
      }

      var relatedViewManager = void 0;
      if (this.relatedViewManagers[relatedView.id]) {
        relatedViewManager = this.relatedViewManagers[relatedView.id];
      } else {
        relatedView.id = this.id + '_' + relatedView.id;
        var relatedViewOptions = {};
        _lang2.default.mixin(relatedViewOptions, relatedView);

        var options = {
          id: relatedView.id,
          relatedViewConfig: relatedViewOptions
        };
        relatedViewManager = new _RelatedViewManager2.default(options);
        this.relatedViewManagers[relatedView.id] = relatedViewManager;
      }
      return relatedViewManager;
    },
    /**
     *
     * Add the each entry and row to the RelateView manager wich in turn creates the new related view and renders its content with in the current row.`
     *
     * @param {Object} entry the current entry from the data.
     * @param {Object} rownode the current dom node to add the widget to.
     * @param {Object} entries the data.
     */
    onProcessRelatedViews: function onProcessRelatedViews(entry, rowNode) {
      if (this.options && this.options.simpleMode && this.options.simpleMode === true) {
        return;
      }
      if (this.relatedViews.length > 0) {
        try {
          for (var i = 0; i < this.relatedViews.length; i++) {
            if (this.relatedViews[i].enabled) {
              var relatedViewManager = this.getRelatedViewManager(this.relatedViews[i]);
              if (relatedViewManager) {
                if (!entry.$key) {
                  entry.$key = this.store.getIdentity(entry);
                }
                relatedViewManager.addView(entry, rowNode, this);
              }
            }
          }
        } catch (error) {
          console.log('Error processing related views:' + error); // eslint-disable-line
        }
      }
    },
    /**
     *  Destroys all of the related view widgets, that was added.
     */
    destroyRelatedViewWidgets: function destroyRelatedViewWidgets() {
      if (this.relatedViewManagers) {
        for (var relatedViewId in this.relatedViewManagers) {
          if (this.relatedViewManagers.hasOwnProperty(relatedViewId)) {
            this.relatedViewManagers[relatedViewId].destroyViews();
          }
        }
      }
    },
    /**
     * Extends dijit Widget to destroy the search widget before destroying the view.
     */
    destroy: function destroy() {
      this.destroyRelatedViewWidgets();
      this.inherited(destroy, arguments);
    },
    clear: function clear() {
      this.inherited(clear, arguments);
      this.destroyRelatedViewWidgets();
    },
    /**
     * Returns a rendered html snap shot of the entry.
     */
    getContextSnapShot: function getContextSnapShot(options) {
      var entry = this.entries[options.key];
      var snapShot = void 0;
      if (entry) {
        snapShot = this.itemTemplate.apply(entry, this);
      }
      return snapShot;
    },
    destroyRelatedView: function destroyRelatedView(relatedView) {
      if (relatedView) {
        var relatedViewManager = this.getRelatedViewManager(relatedView);
        if (relatedViewManager) {
          relatedViewManager.destroyViews();
        }
      }
    },
    invokeRelatedViewAction: function invokeRelatedViewAction(action, selection) {
      var addView = true;
      var relatedView = action.relatedView;
      if (!relatedView) {
        return;
      }

      var relatedViewManager = this.getRelatedViewManager(relatedView);
      if (!relatedViewManager) {
        return;
      }

      if (!relatedView.hasOwnProperty('enabled')) {
        relatedView.enabled = true;
      }

      if (relatedView.enabled) {
        if (this.currentRelatedView) {
          if (this.currentRelatedView.id === relatedView.id) {
            addView = false;
          }
          // Destroy the current related view;
          this.destroyRelatedView(this.currentRelatedView);
          this.currentRelatedView = null;
        }

        if (addView) {
          this.currentRelatedView = relatedView;
          var entry = selection.data;
          if (!entry.$key) {
            entry.$key = this.store.getIdentity(entry);
          }

          // get selected row
          var selectedItems = this.get('selectionModel').getSelections();
          var selectedRow = null;
          for (var key in selectedItems) {
            if (selectedItems.hasOwnProperty(key)) {
              selectedRow = selectedItems[key];
              break;
            }
          }

          // lets set scroller to the current row.
          if (selectedRow && selectedRow.tag) {
            // Add the related view to the selected row
            relatedViewManager.addView(entry, selectedRow.tag, this);

            // lets set scroller to the current row.
            var scrollerNode = this.get('scroller');
            if (scrollerNode) {
              scrollerNode.scrollTop = selectedRow.tag.offsetTop;
            }
          }
        }
      }
    },
    navigateToQuickEdit: function navigateToQuickEdit(action, selection, additionalOptions) {
      var view = App.getView(action.editView || this.quickEditView || this.editView || this.insertView);
      var key = selection.data[this.idProperty];
      var options = {
        key: key,
        selectedEntry: selection.data,
        fromContext: this
      };

      if (!action.hasOwnProperty('enabled')) {
        action.enabled = true;
      }

      if (!action.enabled) {
        return;
      }

      if (additionalOptions) {
        options = _lang2.default.mixin(options, additionalOptions);
      }

      if (view) {
        view.show(options);
      }
    }
  }); /* Copyright 2017 Infor
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *    http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUmVsYXRlZFZpZXdXaWRnZXRMaXN0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInJlbGF0ZWRWaWV3cyIsInJlbGF0ZWRWaWV3TWFuYWdlcnMiLCJsaXN0QWN0aW9uVGVtcGxhdGUiLCJTaW1wbGF0ZSIsInN0YXJ0dXAiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZVJlbGF0ZWRWaWV3TGF5b3V0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwib25BcHBseVJvd1RlbXBsYXRlIiwiZW50cnkiLCJyb3dOb2RlIiwibGVuZ3RoIiwib25Qcm9jZXNzUmVsYXRlZFZpZXdzIiwic2VsZWN0RW50cnkiLCJkZXN0cm95UmVsYXRlZFZpZXciLCJjdXJyZW50UmVsYXRlZFZpZXciLCJnZXRSZWxhdGVkVmlld01hbmFnZXIiLCJyZWxhdGVkVmlldyIsInJlbGF0ZWRWaWV3TWFuYWdlciIsImlkIiwicmVsYXRlZFZpZXdPcHRpb25zIiwibWl4aW4iLCJvcHRpb25zIiwicmVsYXRlZFZpZXdDb25maWciLCJzaW1wbGVNb2RlIiwiaSIsImVuYWJsZWQiLCIka2V5Iiwic3RvcmUiLCJnZXRJZGVudGl0eSIsImFkZFZpZXciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzIiwicmVsYXRlZFZpZXdJZCIsImhhc093blByb3BlcnR5IiwiZGVzdHJveVZpZXdzIiwiZGVzdHJveSIsImNsZWFyIiwiZ2V0Q29udGV4dFNuYXBTaG90IiwiZW50cmllcyIsImtleSIsInNuYXBTaG90IiwiaXRlbVRlbXBsYXRlIiwiYXBwbHkiLCJpbnZva2VSZWxhdGVkVmlld0FjdGlvbiIsImFjdGlvbiIsInNlbGVjdGlvbiIsImRhdGEiLCJzZWxlY3RlZEl0ZW1zIiwiZ2V0IiwiZ2V0U2VsZWN0aW9ucyIsInNlbGVjdGVkUm93IiwidGFnIiwic2Nyb2xsZXJOb2RlIiwic2Nyb2xsVG9wIiwib2Zmc2V0VG9wIiwibmF2aWdhdGVUb1F1aWNrRWRpdCIsImFkZGl0aW9uYWxPcHRpb25zIiwidmlldyIsIkFwcCIsImdldFZpZXciLCJlZGl0VmlldyIsInF1aWNrRWRpdFZpZXciLCJpbnNlcnRWaWV3IiwiaWRQcm9wZXJ0eSIsInNlbGVjdGVkRW50cnkiLCJmcm9tQ29udGV4dCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7QUFHQSxNQUFNQSxVQUFVLHVCQUFRLG1DQUFSLEVBQTZDLElBQTdDLEVBQW1ELGdEQUFnRDtBQUNqSDs7O0FBR0FDLGtCQUFjLElBSm1HO0FBS2pIOzs7QUFHQUMseUJBQXFCLElBUjRGO0FBU2pIOzs7O0FBSUFDLHdCQUFvQixJQUFJQyxRQUFKLENBQWEsdVFBQWIsQ0FiNkY7QUFpQmpIQyxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBS0osWUFBTCxHQUFvQixLQUFLSyx1QkFBTCxDQUE2QixLQUFLQyx1QkFBTCxFQUE3QixFQUE2RCxjQUE3RCxDQUFwQjtBQUNBLFdBQUtDLFNBQUwsQ0FBZUgsT0FBZixFQUF3QkksU0FBeEI7QUFDRCxLQXBCZ0g7QUFxQmpIOzs7OztBQUtBRiw2QkFBeUIsU0FBU0EsdUJBQVQsR0FBbUM7QUFDMUQsYUFBTyxLQUFLTixZQUFMLEtBQXNCLEtBQUtBLFlBQUwsR0FBb0IsRUFBMUMsQ0FBUDtBQUNELEtBNUJnSDtBQTZCakhTLHdCQUFvQixTQUFTQSxrQkFBVCxDQUE0QkMsS0FBNUIsRUFBbUNDLE9BQW5DLEVBQTRDO0FBQzlELFVBQUksS0FBS1gsWUFBTCxDQUFrQlksTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsYUFBS0MscUJBQUwsQ0FBMkJILEtBQTNCLEVBQWtDQyxPQUFsQztBQUNEO0FBQ0QsV0FBS0osU0FBTCxDQUFlRSxrQkFBZixFQUFtQ0QsU0FBbkM7QUFDRCxLQWxDZ0g7QUFtQ2pITSxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLFdBQUtDLGtCQUFMLENBQXdCLEtBQUtDLGtCQUE3QjtBQUNB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Z0RXLGlCQUFoRCxFQUFtRTtBQUN0RixVQUFNQyxPQUFPQyxJQUFJQyxPQUFKLENBQVlmLE9BQU9nQixRQUFQLElBQW1CLEtBQUtDLGFBQXhCLElBQXlDLEtBQUtELFFBQTlDLElBQTBELEtBQUtFLFVBQTNFLENBQWI7QUFDQSxVQUFNdkIsTUFBTU0sVUFBVUMsSUFBVixDQUFlLEtBQUtpQixVQUFwQixDQUFaO0FBQ0EsVUFBSTVDLFVBQVU7QUFDWm9CLGdCQURZO0FBRVp5Qix1QkFBZW5CLFVBQVVDLElBRmI7QUFHWm1CLHFCQUFhO0FBSEQsT0FBZDs7QUFNQSxVQUFJLENBQUNyQixPQUFPWCxjQUFQLENBQXNCLFNBQXRCLENBQUwsRUFBdUM7QUFDckNXLGVBQU9yQixPQUFQLEdBQWlCLElBQWpCO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDcUIsT0FBT3JCLE9BQVosRUFBcUI7QUFDbkI7QUFDRDs7QUFFRCxVQUFJaUMsaUJBQUosRUFBdUI7QUFDckJyQyxrQkFBVSxlQUFLRCxLQUFMLENBQVdDLE9BQVgsRUFBb0JxQyxpQkFBcEIsQ0FBVjtBQUNEOztBQUVELFVBQUlDLElBQUosRUFBVTtBQUNSQSxhQUFLUyxJQUFMLENBQVUvQyxPQUFWO0FBQ0Q7QUFDRjtBQTVOZ0gsR0FBbkcsQ0FBaEIsQyxDQXRCQTs7Ozs7Ozs7Ozs7Ozs7O29CQW9QZXhCLE8iLCJmaWxlIjoiX1JlbGF0ZWRWaWV3V2lkZ2V0TGlzdE1peGluLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuaW1wb3J0IFJlbGF0ZWRWaWV3TWFuYWdlciBmcm9tICcuL1JlbGF0ZWRWaWV3TWFuYWdlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldExpc3RNaXhpblxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLl9SZWxhdGVkVmlld1dpZGdldExpc3RNaXhpbicsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuX1JlbGF0ZWRWaWV3V2lkZ2V0TGlzdE1peGluIyAqL3tcclxuICAvKipcclxuICAgKiBUaGUgcmVsYXRlZCB2aWV3IGRlZmluaXRpb25zIGZvciByZWxhdGVkIHZpZXdzIGZvciBlYWNoIHJvdy5cclxuICAgKi9cclxuICByZWxhdGVkVmlld3M6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogVGhlIHJlbGF0ZWQgdmlldyBtYW5hZ2VycyBmb3IgZWFjaCByZWxhdGVkIHZpZXcgZGVmaW5pdGlvbi5cclxuICAgKi9cclxuICByZWxhdGVkVmlld01hbmFnZXJzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSBzaW5nbGUgbGlzdCBhY3Rpb24gcm93LlxyXG4gICAqL1xyXG4gIGxpc3RBY3Rpb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGA8dWwgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImFjdGlvbnNOb2RlXCIgaWQ9XCJwb3B1cG1lbnUteyU9ICQkLmdldEl0ZW1BY3Rpb25LZXkoJCkgJX1cIiBjbGFzcz1cImFjdGlvbnMtcm93IHBvcHVwbWVudSBhY3Rpb25zIHRvcFwiPnslISAkJC5sb2FkaW5nVGVtcGxhdGUgJX08L3VsPlxyXG4gICAgPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicmVsYXRlZEFjdGlvbnNOb2RlXCIgY2xhc3M9XCJyZWxhdGVkLXZpZXctbGlzdC1hY3Rpb25cIj48YT48L2E+PC9kaXY+YCxcclxuICBdKSxcclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5yZWxhdGVkVmlld3MgPSB0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlUmVsYXRlZFZpZXdMYXlvdXQoKSwgJ3JlbGF0ZWRWaWV3cycpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc3RhcnR1cCwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW5kIHJldHVybnMgdGhlIHJlbGF0ZWQgdmlldyBkZWZpbml0aW9uLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHRoZSB2aWV3XHJcbiAgICogc28gdGhhdCB5b3UgbWF5IGRlZmluZSB0aGUgcmVsYXRlZCB2aWV3cyB0aGF0IHdpbGwgYmUgYWRkIHRvIGVhY2ggcm93IGluIHRoZSBsaXN0LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhpcy5yZWxhdGVkVmlld3NcclxuICAgKi9cclxuICBjcmVhdGVSZWxhdGVkVmlld0xheW91dDogZnVuY3Rpb24gY3JlYXRlUmVsYXRlZFZpZXdMYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWxhdGVkVmlld3MgfHwgKHRoaXMucmVsYXRlZFZpZXdzID0ge30pO1xyXG4gIH0sXHJcbiAgb25BcHBseVJvd1RlbXBsYXRlOiBmdW5jdGlvbiBvbkFwcGx5Um93VGVtcGxhdGUoZW50cnksIHJvd05vZGUpIHtcclxuICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMub25Qcm9jZXNzUmVsYXRlZFZpZXdzKGVudHJ5LCByb3dOb2RlKTtcclxuICAgIH1cclxuICAgIHRoaXMuaW5oZXJpdGVkKG9uQXBwbHlSb3dUZW1wbGF0ZSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIHNlbGVjdEVudHJ5OiBmdW5jdGlvbiBzZWxlY3RFbnRyeSgpIHtcclxuICAgIHRoaXMuZGVzdHJveVJlbGF0ZWRWaWV3KHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3KTtcclxuICAgIHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3ID0gbnVsbDtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHNlbGVjdEVudHJ5LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgcmVsYXRlZCB2aWV3IG1hbmFnZXIgZm9yIGEgcmVsYXRlZCB2aWV3IGRlZmluaXRpb24uXHJcbiAgICogSWYgYSBtYW5hZ2VyIGlzIG5vdCBmb3VuZCBhIG5ldyBSZWxhdGVkIFZpZXcgTWFuYWdlciBpcyBjcmVhdGVkIGFuZCByZXR1cm5lZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFJlbGF0ZWRWaWV3TWFuYWdlclxyXG4gICAqL1xyXG4gIGdldFJlbGF0ZWRWaWV3TWFuYWdlcjogZnVuY3Rpb24gZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyKHJlbGF0ZWRWaWV3KSB7XHJcbiAgICBpZiAoIXRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICB0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVsYXRlZFZpZXdNYW5hZ2VyO1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlldy5pZF0pIHtcclxuICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyID0gdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3LmlkXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlbGF0ZWRWaWV3LmlkID0gYCR7dGhpcy5pZH1fJHtyZWxhdGVkVmlldy5pZH1gO1xyXG4gICAgICBjb25zdCByZWxhdGVkVmlld09wdGlvbnMgPSB7fTtcclxuICAgICAgbGFuZy5taXhpbihyZWxhdGVkVmlld09wdGlvbnMsIHJlbGF0ZWRWaWV3KTtcclxuXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgaWQ6IHJlbGF0ZWRWaWV3LmlkLFxyXG4gICAgICAgIHJlbGF0ZWRWaWV3Q29uZmlnOiByZWxhdGVkVmlld09wdGlvbnMsXHJcbiAgICAgIH07XHJcbiAgICAgIHJlbGF0ZWRWaWV3TWFuYWdlciA9IG5ldyBSZWxhdGVkVmlld01hbmFnZXIob3B0aW9ucyk7XHJcbiAgICAgIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlldy5pZF0gPSByZWxhdGVkVmlld01hbmFnZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVsYXRlZFZpZXdNYW5hZ2VyO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBBZGQgdGhlIGVhY2ggZW50cnkgYW5kIHJvdyB0byB0aGUgUmVsYXRlVmlldyBtYW5hZ2VyIHdpY2ggaW4gdHVybiBjcmVhdGVzIHRoZSBuZXcgcmVsYXRlZCB2aWV3IGFuZCByZW5kZXJzIGl0cyBjb250ZW50IHdpdGggaW4gdGhlIGN1cnJlbnQgcm93LmBcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSB0aGUgY3VycmVudCBlbnRyeSBmcm9tIHRoZSBkYXRhLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByb3dub2RlIHRoZSBjdXJyZW50IGRvbSBub2RlIHRvIGFkZCB0aGUgd2lkZ2V0IHRvLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyaWVzIHRoZSBkYXRhLlxyXG4gICAqL1xyXG4gIG9uUHJvY2Vzc1JlbGF0ZWRWaWV3czogZnVuY3Rpb24gb25Qcm9jZXNzUmVsYXRlZFZpZXdzKGVudHJ5LCByb3dOb2RlKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5zaW1wbGVNb2RlICYmICh0aGlzLm9wdGlvbnMuc2ltcGxlTW9kZSA9PT0gdHJ1ZSkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVsYXRlZFZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5yZWxhdGVkVmlld3NbaV0uZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBjb25zdCByZWxhdGVkVmlld01hbmFnZXIgPSB0aGlzLmdldFJlbGF0ZWRWaWV3TWFuYWdlcih0aGlzLnJlbGF0ZWRWaWV3c1tpXSk7XHJcbiAgICAgICAgICAgIGlmIChyZWxhdGVkVmlld01hbmFnZXIpIHtcclxuICAgICAgICAgICAgICBpZiAoIWVudHJ5LiRrZXkpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5LiRrZXkgPSB0aGlzLnN0b3JlLmdldElkZW50aXR5KGVudHJ5KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyLmFkZFZpZXcoZW50cnksIHJvd05vZGUsIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBwcm9jZXNzaW5nIHJlbGF0ZWQgdmlld3M6JyArIGVycm9yKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiAgRGVzdHJveXMgYWxsIG9mIHRoZSByZWxhdGVkIHZpZXcgd2lkZ2V0cywgdGhhdCB3YXMgYWRkZWQuXHJcbiAgICovXHJcbiAgZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0czogZnVuY3Rpb24gZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0cygpIHtcclxuICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMpIHtcclxuICAgICAgZm9yIChjb25zdCByZWxhdGVkVmlld0lkIGluIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMuaGFzT3duUHJvcGVydHkocmVsYXRlZFZpZXdJZCkpIHtcclxuICAgICAgICAgIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlld0lkXS5kZXN0cm95Vmlld3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgZGlqaXQgV2lkZ2V0IHRvIGRlc3Ryb3kgdGhlIHNlYXJjaCB3aWRnZXQgYmVmb3JlIGRlc3Ryb3lpbmcgdGhlIHZpZXcuXHJcbiAgICovXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIHRoaXMuZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0cygpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZGVzdHJveSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGNsZWFyLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5kZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcmVuZGVyZWQgaHRtbCBzbmFwIHNob3Qgb2YgdGhlIGVudHJ5LlxyXG4gICAqL1xyXG4gIGdldENvbnRleHRTbmFwU2hvdDogZnVuY3Rpb24gZ2V0Q29udGV4dFNuYXBTaG90KG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5lbnRyaWVzW29wdGlvbnMua2V5XTtcclxuICAgIGxldCBzbmFwU2hvdDtcclxuICAgIGlmIChlbnRyeSkge1xyXG4gICAgICBzbmFwU2hvdCA9IHRoaXMuaXRlbVRlbXBsYXRlLmFwcGx5KGVudHJ5LCB0aGlzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzbmFwU2hvdDtcclxuICB9LFxyXG4gIGRlc3Ryb3lSZWxhdGVkVmlldzogZnVuY3Rpb24gZGVzdHJveVJlbGF0ZWRWaWV3KHJlbGF0ZWRWaWV3KSB7XHJcbiAgICBpZiAocmVsYXRlZFZpZXcpIHtcclxuICAgICAgY29uc3QgcmVsYXRlZFZpZXdNYW5hZ2VyID0gdGhpcy5nZXRSZWxhdGVkVmlld01hbmFnZXIocmVsYXRlZFZpZXcpO1xyXG4gICAgICBpZiAocmVsYXRlZFZpZXdNYW5hZ2VyKSB7XHJcbiAgICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyLmRlc3Ryb3lWaWV3cygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnZva2VSZWxhdGVkVmlld0FjdGlvbjogZnVuY3Rpb24gaW52b2tlUmVsYXRlZFZpZXdBY3Rpb24oYWN0aW9uLCBzZWxlY3Rpb24pIHtcclxuICAgIGxldCBhZGRWaWV3ID0gdHJ1ZTtcclxuICAgIGNvbnN0IHJlbGF0ZWRWaWV3ID0gYWN0aW9uLnJlbGF0ZWRWaWV3O1xyXG4gICAgaWYgKCFyZWxhdGVkVmlldykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVsYXRlZFZpZXdNYW5hZ2VyID0gdGhpcy5nZXRSZWxhdGVkVmlld01hbmFnZXIocmVsYXRlZFZpZXcpO1xyXG4gICAgaWYgKCFyZWxhdGVkVmlld01hbmFnZXIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghcmVsYXRlZFZpZXcuaGFzT3duUHJvcGVydHkoJ2VuYWJsZWQnKSkge1xyXG4gICAgICByZWxhdGVkVmlldy5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVsYXRlZFZpZXcuZW5hYmxlZCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50UmVsYXRlZFZpZXcpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UmVsYXRlZFZpZXcuaWQgPT09IHJlbGF0ZWRWaWV3LmlkKSB7XHJcbiAgICAgICAgICBhZGRWaWV3ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERlc3Ryb3kgdGhlIGN1cnJlbnQgcmVsYXRlZCB2aWV3O1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVJlbGF0ZWRWaWV3KHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3KTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSZWxhdGVkVmlldyA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhZGRWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UmVsYXRlZFZpZXcgPSByZWxhdGVkVmlldztcclxuICAgICAgICBjb25zdCBlbnRyeSA9IHNlbGVjdGlvbi5kYXRhO1xyXG4gICAgICAgIGlmICghZW50cnkuJGtleSkge1xyXG4gICAgICAgICAgZW50cnkuJGtleSA9IHRoaXMuc3RvcmUuZ2V0SWRlbnRpdHkoZW50cnkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2V0IHNlbGVjdGVkIHJvd1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldCgnc2VsZWN0aW9uTW9kZWwnKS5nZXRTZWxlY3Rpb25zKCk7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkUm93ID0gbnVsbDtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzZWxlY3RlZEl0ZW1zKSB7XHJcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkUm93ID0gc2VsZWN0ZWRJdGVtc1trZXldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGxldHMgc2V0IHNjcm9sbGVyIHRvIHRoZSBjdXJyZW50IHJvdy5cclxuICAgICAgICBpZiAoc2VsZWN0ZWRSb3cgJiYgc2VsZWN0ZWRSb3cudGFnKSB7XHJcbiAgICAgICAgICAvLyBBZGQgdGhlIHJlbGF0ZWQgdmlldyB0byB0aGUgc2VsZWN0ZWQgcm93XHJcbiAgICAgICAgICByZWxhdGVkVmlld01hbmFnZXIuYWRkVmlldyhlbnRyeSwgc2VsZWN0ZWRSb3cudGFnLCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAvLyBsZXRzIHNldCBzY3JvbGxlciB0byB0aGUgY3VycmVudCByb3cuXHJcbiAgICAgICAgICBjb25zdCBzY3JvbGxlck5vZGUgPSB0aGlzLmdldCgnc2Nyb2xsZXInKTtcclxuICAgICAgICAgIGlmIChzY3JvbGxlck5vZGUpIHtcclxuICAgICAgICAgICAgc2Nyb2xsZXJOb2RlLnNjcm9sbFRvcCA9IHNlbGVjdGVkUm93LnRhZy5vZmZzZXRUb3A7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBuYXZpZ2F0ZVRvUXVpY2tFZGl0OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvUXVpY2tFZGl0KGFjdGlvbiwgc2VsZWN0aW9uLCBhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KGFjdGlvbi5lZGl0VmlldyB8fCB0aGlzLnF1aWNrRWRpdFZpZXcgfHwgdGhpcy5lZGl0VmlldyB8fCB0aGlzLmluc2VydFZpZXcpO1xyXG4gICAgY29uc3Qga2V5ID0gc2VsZWN0aW9uLmRhdGFbdGhpcy5pZFByb3BlcnR5XTtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBrZXksXHJcbiAgICAgIHNlbGVjdGVkRW50cnk6IHNlbGVjdGlvbi5kYXRhLFxyXG4gICAgICBmcm9tQ29udGV4dDogdGhpcyxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCFhY3Rpb24uaGFzT3duUHJvcGVydHkoJ2VuYWJsZWQnKSkge1xyXG4gICAgICBhY3Rpb24uZW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFhY3Rpb24uZW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFkZGl0aW9uYWxPcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBsYW5nLm1peGluKG9wdGlvbnMsIGFkZGl0aW9uYWxPcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==