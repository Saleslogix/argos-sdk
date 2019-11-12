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
      this.inherited(arguments);
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
      this.inherited(arguments);
    },
    selectEntry: function selectEntry() {
      this.destroyRelatedView(this.currentRelatedView);
      this.currentRelatedView = null;
      this.inherited(arguments);
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
      this.inherited(arguments);
    },
    clear: function clear() {
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUmVsYXRlZFZpZXdXaWRnZXRMaXN0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInJlbGF0ZWRWaWV3cyIsInJlbGF0ZWRWaWV3TWFuYWdlcnMiLCJsaXN0QWN0aW9uVGVtcGxhdGUiLCJTaW1wbGF0ZSIsInN0YXJ0dXAiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZVJlbGF0ZWRWaWV3TGF5b3V0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwib25BcHBseVJvd1RlbXBsYXRlIiwiZW50cnkiLCJyb3dOb2RlIiwibGVuZ3RoIiwib25Qcm9jZXNzUmVsYXRlZFZpZXdzIiwic2VsZWN0RW50cnkiLCJkZXN0cm95UmVsYXRlZFZpZXciLCJjdXJyZW50UmVsYXRlZFZpZXciLCJnZXRSZWxhdGVkVmlld01hbmFnZXIiLCJyZWxhdGVkVmlldyIsInJlbGF0ZWRWaWV3TWFuYWdlciIsImlkIiwicmVsYXRlZFZpZXdPcHRpb25zIiwibWl4aW4iLCJvcHRpb25zIiwicmVsYXRlZFZpZXdDb25maWciLCJzaW1wbGVNb2RlIiwiaSIsImVuYWJsZWQiLCIka2V5Iiwic3RvcmUiLCJnZXRJZGVudGl0eSIsImFkZFZpZXciLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzIiwicmVsYXRlZFZpZXdJZCIsImhhc093blByb3BlcnR5IiwiZGVzdHJveVZpZXdzIiwiZGVzdHJveSIsImNsZWFyIiwiZ2V0Q29udGV4dFNuYXBTaG90IiwiZW50cmllcyIsImtleSIsInNuYXBTaG90IiwiaXRlbVRlbXBsYXRlIiwiYXBwbHkiLCJpbnZva2VSZWxhdGVkVmlld0FjdGlvbiIsImFjdGlvbiIsInNlbGVjdGlvbiIsImRhdGEiLCJzZWxlY3RlZEl0ZW1zIiwiZ2V0IiwiZ2V0U2VsZWN0aW9ucyIsInNlbGVjdGVkUm93IiwidGFnIiwic2Nyb2xsZXJOb2RlIiwic2Nyb2xsVG9wIiwib2Zmc2V0VG9wIiwibmF2aWdhdGVUb1F1aWNrRWRpdCIsImFkZGl0aW9uYWxPcHRpb25zIiwidmlldyIsIkFwcCIsImdldFZpZXciLCJlZGl0VmlldyIsInF1aWNrRWRpdFZpZXciLCJpbnNlcnRWaWV3IiwiaWRQcm9wZXJ0eSIsInNlbGVjdGVkRW50cnkiLCJmcm9tQ29udGV4dCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7QUFHQSxNQUFNQSxVQUFVLHVCQUFRLG1DQUFSLEVBQTZDLElBQTdDLEVBQW1ELGdEQUFnRDtBQUNqSDs7O0FBR0FDLGtCQUFjLElBSm1HO0FBS2pIOzs7QUFHQUMseUJBQXFCLElBUjRGO0FBU2pIOzs7O0FBSUFDLHdCQUFvQixJQUFJQyxRQUFKLENBQWEsdVFBQWIsQ0FiNkY7QUFpQmpIQyxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBS0osWUFBTCxHQUFvQixLQUFLSyx1QkFBTCxDQUE2QixLQUFLQyx1QkFBTCxFQUE3QixFQUE2RCxjQUE3RCxDQUFwQjtBQUNBLFdBQUtDLFNBQUwsQ0FBZUMsU0FBZjtBQUNELEtBcEJnSDtBQXFCakg7Ozs7O0FBS0FGLDZCQUF5QixTQUFTQSx1QkFBVCxHQUFtQztBQUMxRCxhQUFPLEtBQUtOLFlBQUwsS0FBc0IsS0FBS0EsWUFBTCxHQUFvQixFQUExQyxDQUFQO0FBQ0QsS0E1QmdIO0FBNkJqSFMsd0JBQW9CLFNBQVNBLGtCQUFULENBQTRCQyxLQUE1QixFQUFtQ0MsT0FBbkMsRUFBNEM7QUFDOUQsVUFBSSxLQUFLWCxZQUFMLENBQWtCWSxNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUNoQyxhQUFLQyxxQkFBTCxDQUEyQkgsS0FBM0IsRUFBa0NDLE9BQWxDO0FBQ0Q7QUFDRCxXQUFLSixTQUFMLENBQWVDLFNBQWY7QUFDRCxLQWxDZ0g7QUFtQ2pITSxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLFdBQUtDLGtCQUFMLENBQXdCLEtBQUtDLGtCQUE3QjtBQUNBLFdBQUtBLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsV0FBS1QsU0FBTCxDQUFlQyxTQUFmO0FBQ0QsS0F2Q2dIO0FBd0NqSDs7Ozs7QUFLQVMsMkJBQXVCLFNBQVNBLHFCQUFULENBQStCQyxXQUEvQixFQUE0QztBQUNqRSxVQUFJLENBQUMsS0FBS2pCLG1CQUFWLEVBQStCO0FBQzdCLGFBQUtBLG1CQUFMLEdBQTJCLEVBQTNCO0FBQ0Q7O0FBRUQsVUFBSWtCLDJCQUFKO0FBQ0EsVUFBSSxLQUFLbEIsbUJBQUwsQ0FBeUJpQixZQUFZRSxFQUFyQyxDQUFKLEVBQThDO0FBQzVDRCw2QkFBcUIsS0FBS2xCLG1CQUFMLENBQXlCaUIsWUFBWUUsRUFBckMsQ0FBckI7QUFDRCxPQUZELE1BRU87QUFDTEYsb0JBQVlFLEVBQVosR0FBb0IsS0FBS0EsRUFBekIsU0FBK0JGLFlBQVlFLEVBQTNDO0FBQ0EsWUFBTUMscUJBQXFCLEVBQTNCO0FBQ0EsdUJBQUtDLEtBQUwsQ0FBV0Qsa0JBQVgsRUFBK0JILFdBQS9COztBQUVBLFlBQU1LLFVBQVU7QUFDZEgsY0FBSUYsWUFBWUUsRUFERjtBQUVkSSw2QkFBbUJIO0FBRkwsU0FBaEI7QUFJQUYsNkJBQXFCLGlDQUF1QkksT0FBdkIsQ0FBckI7QUFDQSxhQUFLdEIsbUJBQUwsQ0FBeUJpQixZQUFZRSxFQUFyQyxJQUEyQ0Qsa0JBQTNDO0FBQ0Q7QUFDRCxhQUFPQSxrQkFBUDtBQUNELEtBbEVnSDtBQW1Fakg7Ozs7Ozs7O0FBUUFOLDJCQUF1QixTQUFTQSxxQkFBVCxDQUErQkgsS0FBL0IsRUFBc0NDLE9BQXRDLEVBQStDO0FBQ3BFLFVBQUksS0FBS1ksT0FBTCxJQUFnQixLQUFLQSxPQUFMLENBQWFFLFVBQTdCLElBQTRDLEtBQUtGLE9BQUwsQ0FBYUUsVUFBYixLQUE0QixJQUE1RSxFQUFtRjtBQUNqRjtBQUNEO0FBQ0QsVUFBSSxLQUFLekIsWUFBTCxDQUFrQlksTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsWUFBSTtBQUNGLGVBQUssSUFBSWMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUsxQixZQUFMLENBQWtCWSxNQUF0QyxFQUE4Q2MsR0FBOUMsRUFBbUQ7QUFDakQsZ0JBQUksS0FBSzFCLFlBQUwsQ0FBa0IwQixDQUFsQixFQUFxQkMsT0FBekIsRUFBa0M7QUFDaEMsa0JBQU1SLHFCQUFxQixLQUFLRixxQkFBTCxDQUEyQixLQUFLakIsWUFBTCxDQUFrQjBCLENBQWxCLENBQTNCLENBQTNCO0FBQ0Esa0JBQUlQLGtCQUFKLEVBQXdCO0FBQ3RCLG9CQUFJLENBQUNULE1BQU1rQixJQUFYLEVBQWlCO0FBQ2ZsQix3QkFBTWtCLElBQU4sR0FBYSxLQUFLQyxLQUFMLENBQVdDLFdBQVgsQ0FBdUJwQixLQUF2QixDQUFiO0FBQ0Q7QUFDRFMsbUNBQW1CWSxPQUFuQixDQUEyQnJCLEtBQTNCLEVBQWtDQyxPQUFsQyxFQUEyQyxJQUEzQztBQUNEO0FBQ0Y7QUFDRjtBQUNGLFNBWkQsQ0FZRSxPQUFPcUIsS0FBUCxFQUFjO0FBQ2RDLGtCQUFRQyxHQUFSLENBQVksb0NBQW9DRixLQUFoRCxFQURjLENBQzBDO0FBQ3pEO0FBQ0Y7QUFDRixLQWhHZ0g7QUFpR2pIOzs7QUFHQUcsK0JBQTJCLFNBQVNBLHlCQUFULEdBQXFDO0FBQzlELFVBQUksS0FBS2xDLG1CQUFULEVBQThCO0FBQzVCLGFBQUssSUFBTW1DLGFBQVgsSUFBNEIsS0FBS25DLG1CQUFqQyxFQUFzRDtBQUNwRCxjQUFJLEtBQUtBLG1CQUFMLENBQXlCb0MsY0FBekIsQ0FBd0NELGFBQXhDLENBQUosRUFBNEQ7QUFDMUQsaUJBQUtuQyxtQkFBTCxDQUF5Qm1DLGFBQXpCLEVBQXdDRSxZQUF4QztBQUNEO0FBQ0Y7QUFDRjtBQUNGLEtBNUdnSDtBQTZHakg7OztBQUdBQyxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBS0oseUJBQUw7QUFDQSxXQUFLNUIsU0FBTCxDQUFlQyxTQUFmO0FBQ0QsS0FuSGdIO0FBb0hqSGdDLFdBQU8sU0FBU0EsS0FBVCxHQUFpQjtBQUN0QixXQUFLakMsU0FBTCxDQUFlQyxTQUFmO0FBQ0EsV0FBSzJCLHlCQUFMO0FBQ0QsS0F2SGdIO0FBd0hqSDs7O0FBR0FNLHdCQUFvQixTQUFTQSxrQkFBVCxDQUE0QmxCLE9BQTVCLEVBQXFDO0FBQ3ZELFVBQU1iLFFBQVEsS0FBS2dDLE9BQUwsQ0FBYW5CLFFBQVFvQixHQUFyQixDQUFkO0FBQ0EsVUFBSUMsaUJBQUo7QUFDQSxVQUFJbEMsS0FBSixFQUFXO0FBQ1RrQyxtQkFBVyxLQUFLQyxZQUFMLENBQWtCQyxLQUFsQixDQUF3QnBDLEtBQXhCLEVBQStCLElBQS9CLENBQVg7QUFDRDtBQUNELGFBQU9rQyxRQUFQO0FBQ0QsS0FsSWdIO0FBbUlqSDdCLHdCQUFvQixTQUFTQSxrQkFBVCxDQUE0QkcsV0FBNUIsRUFBeUM7QUFDM0QsVUFBSUEsV0FBSixFQUFpQjtBQUNmLFlBQU1DLHFCQUFxQixLQUFLRixxQkFBTCxDQUEyQkMsV0FBM0IsQ0FBM0I7QUFDQSxZQUFJQyxrQkFBSixFQUF3QjtBQUN0QkEsNkJBQW1CbUIsWUFBbkI7QUFDRDtBQUNGO0FBQ0YsS0ExSWdIO0FBMklqSFMsNkJBQXlCLFNBQVNBLHVCQUFULENBQWlDQyxNQUFqQyxFQUF5Q0MsU0FBekMsRUFBb0Q7QUFDM0UsVUFBSWxCLFVBQVUsSUFBZDtBQUNBLFVBQU1iLGNBQWM4QixPQUFPOUIsV0FBM0I7QUFDQSxVQUFJLENBQUNBLFdBQUwsRUFBa0I7QUFDaEI7QUFDRDs7QUFFRCxVQUFNQyxxQkFBcUIsS0FBS0YscUJBQUwsQ0FBMkJDLFdBQTNCLENBQTNCO0FBQ0EsVUFBSSxDQUFDQyxrQkFBTCxFQUF5QjtBQUN2QjtBQUNEOztBQUVELFVBQUksQ0FBQ0QsWUFBWW1CLGNBQVosQ0FBMkIsU0FBM0IsQ0FBTCxFQUE0QztBQUMxQ25CLG9CQUFZUyxPQUFaLEdBQXNCLElBQXRCO0FBQ0Q7O0FBRUQsVUFBSVQsWUFBWVMsT0FBaEIsRUFBeUI7QUFDdkIsWUFBSSxLQUFLWCxrQkFBVCxFQUE2QjtBQUMzQixjQUFJLEtBQUtBLGtCQUFMLENBQXdCSSxFQUF4QixLQUErQkYsWUFBWUUsRUFBL0MsRUFBbUQ7QUFDakRXLHNCQUFVLEtBQVY7QUFDRDtBQUNEO0FBQ0EsZUFBS2hCLGtCQUFMLENBQXdCLEtBQUtDLGtCQUE3QjtBQUNBLGVBQUtBLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0Q7O0FBRUQsWUFBSWUsT0FBSixFQUFhO0FBQ1gsZUFBS2Ysa0JBQUwsR0FBMEJFLFdBQTFCO0FBQ0EsY0FBTVIsUUFBUXVDLFVBQVVDLElBQXhCO0FBQ0EsY0FBSSxDQUFDeEMsTUFBTWtCLElBQVgsRUFBaUI7QUFDZmxCLGtCQUFNa0IsSUFBTixHQUFhLEtBQUtDLEtBQUwsQ0FBV0MsV0FBWCxDQUF1QnBCLEtBQXZCLENBQWI7QUFDRDs7QUFFRDtBQUNBLGNBQU15QyxnQkFBZ0IsS0FBS0MsR0FBTCxDQUFTLGdCQUFULEVBQTJCQyxhQUEzQixFQUF0QjtBQUNBLGNBQUlDLGNBQWMsSUFBbEI7QUFDQSxlQUFLLElBQU1YLEdBQVgsSUFBa0JRLGFBQWxCLEVBQWlDO0FBQy9CLGdCQUFJQSxjQUFjZCxjQUFkLENBQTZCTSxHQUE3QixDQUFKLEVBQXVDO0FBQ3JDVyw0QkFBY0gsY0FBY1IsR0FBZCxDQUFkO0FBQ0E7QUFDRDtBQUNGOztBQUVEO0FBQ0EsY0FBSVcsZUFBZUEsWUFBWUMsR0FBL0IsRUFBb0M7QUFDbEM7QUFDQXBDLCtCQUFtQlksT0FBbkIsQ0FBMkJyQixLQUEzQixFQUFrQzRDLFlBQVlDLEdBQTlDLEVBQW1ELElBQW5EOztBQUVBO0FBQ0EsZ0JBQU1DLGVBQWUsS0FBS0osR0FBTCxDQUFTLFVBQVQsQ0FBckI7QUFDQSxnQkFBSUksWUFBSixFQUFrQjtBQUNoQkEsMkJBQWFDLFNBQWIsR0FBeUJILFlBQVlDLEdBQVosQ0FBZ0JHLFNBQXpDO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRixLQW5NZ0g7QUFvTWpIQyx5QkFBcUIsU0FBU0EsbUJBQVQsQ0FBNkJYLE1BQTdCLEVBQXFDQyxTQUFyQyxFQUFnRFcsaUJBQWhELEVBQW1FO0FBQ3RGLFVBQU1DLE9BQU9DLElBQUlDLE9BQUosQ0FBWWYsT0FBT2dCLFFBQVAsSUFBbUIsS0FBS0MsYUFBeEIsSUFBeUMsS0FBS0QsUUFBOUMsSUFBMEQsS0FBS0UsVUFBM0UsQ0FBYjtBQUNBLFVBQU12QixNQUFNTSxVQUFVQyxJQUFWLENBQWUsS0FBS2lCLFVBQXBCLENBQVo7QUFDQSxVQUFJNUMsVUFBVTtBQUNab0IsZ0JBRFk7QUFFWnlCLHVCQUFlbkIsVUFBVUMsSUFGYjtBQUdabUIscUJBQWE7QUFIRCxPQUFkOztBQU1BLFVBQUksQ0FBQ3JCLE9BQU9YLGNBQVAsQ0FBc0IsU0FBdEIsQ0FBTCxFQUF1QztBQUNyQ1csZUFBT3JCLE9BQVAsR0FBaUIsSUFBakI7QUFDRDs7QUFFRCxVQUFJLENBQUNxQixPQUFPckIsT0FBWixFQUFxQjtBQUNuQjtBQUNEOztBQUVELFVBQUlpQyxpQkFBSixFQUF1QjtBQUNyQnJDLGtCQUFVLGVBQUtELEtBQUwsQ0FBV0MsT0FBWCxFQUFvQnFDLGlCQUFwQixDQUFWO0FBQ0Q7O0FBRUQsVUFBSUMsSUFBSixFQUFVO0FBQ1JBLGFBQUtTLElBQUwsQ0FBVS9DLE9BQVY7QUFDRDtBQUNGO0FBNU5nSCxHQUFuRyxDQUFoQixDLENBdEJBOzs7Ozs7Ozs7Ozs7Ozs7b0JBb1BleEIsTyIsImZpbGUiOiJfUmVsYXRlZFZpZXdXaWRnZXRMaXN0TWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgUmVsYXRlZFZpZXdNYW5hZ2VyIGZyb20gJy4vUmVsYXRlZFZpZXdNYW5hZ2VyJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX1JlbGF0ZWRWaWV3V2lkZ2V0TGlzdE1peGluXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX1JlbGF0ZWRWaWV3V2lkZ2V0TGlzdE1peGluJywgbnVsbCwgLyoqIEBsZW5kcyBhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRMaXN0TWl4aW4jICove1xyXG4gIC8qKlxyXG4gICAqIFRoZSByZWxhdGVkIHZpZXcgZGVmaW5pdGlvbnMgZm9yIHJlbGF0ZWQgdmlld3MgZm9yIGVhY2ggcm93LlxyXG4gICAqL1xyXG4gIHJlbGF0ZWRWaWV3czogbnVsbCxcclxuICAvKipcclxuICAgKiBUaGUgcmVsYXRlZCB2aWV3IG1hbmFnZXJzIGZvciBlYWNoIHJlbGF0ZWQgdmlldyBkZWZpbml0aW9uLlxyXG4gICAqL1xyXG4gIHJlbGF0ZWRWaWV3TWFuYWdlcnM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBUaGUgdGVtcGxhdGUgdXNlZCB0byByZW5kZXIgdGhlIHNpbmdsZSBsaXN0IGFjdGlvbiByb3cuXHJcbiAgICovXHJcbiAgbGlzdEFjdGlvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgYDx1bCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiYWN0aW9uc05vZGVcIiBpZD1cInBvcHVwbWVudS17JT0gJCQuZ2V0SXRlbUFjdGlvbktleSgkKSAlfVwiIGNsYXNzPVwiYWN0aW9ucy1yb3cgcG9wdXBtZW51IGFjdGlvbnMgdG9wXCI+eyUhICQkLmxvYWRpbmdUZW1wbGF0ZSAlfTwvdWw+XHJcbiAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJyZWxhdGVkQWN0aW9uc05vZGVcIiBjbGFzcz1cInJlbGF0ZWQtdmlldy1saXN0LWFjdGlvblwiPjxhPjwvYT48L2Rpdj5gLFxyXG4gIF0pLFxyXG4gIHN0YXJ0dXA6IGZ1bmN0aW9uIHN0YXJ0dXAoKSB7XHJcbiAgICB0aGlzLnJlbGF0ZWRWaWV3cyA9IHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVSZWxhdGVkVmlld0xheW91dCgpLCAncmVsYXRlZFZpZXdzJyk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgcmVsYXRlZCB2aWV3IGRlZmluaXRpb24sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIHZpZXdcclxuICAgKiBzbyB0aGF0IHlvdSBtYXkgZGVmaW5lIHRoZSByZWxhdGVkIHZpZXdzIHRoYXQgd2lsbCBiZSBhZGQgdG8gZWFjaCByb3cgaW4gdGhlIGxpc3QuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLnJlbGF0ZWRWaWV3c1xyXG4gICAqL1xyXG4gIGNyZWF0ZVJlbGF0ZWRWaWV3TGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVSZWxhdGVkVmlld0xheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlbGF0ZWRWaWV3cyB8fCAodGhpcy5yZWxhdGVkVmlld3MgPSB7fSk7XHJcbiAgfSxcclxuICBvbkFwcGx5Um93VGVtcGxhdGU6IGZ1bmN0aW9uIG9uQXBwbHlSb3dUZW1wbGF0ZShlbnRyeSwgcm93Tm9kZSkge1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5vblByb2Nlc3NSZWxhdGVkVmlld3MoZW50cnksIHJvd05vZGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIHNlbGVjdEVudHJ5OiBmdW5jdGlvbiBzZWxlY3RFbnRyeSgpIHtcclxuICAgIHRoaXMuZGVzdHJveVJlbGF0ZWRWaWV3KHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3KTtcclxuICAgIHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3ID0gbnVsbDtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHZXRzIHRoZSByZWxhdGVkIHZpZXcgbWFuYWdlciBmb3IgYSByZWxhdGVkIHZpZXcgZGVmaW5pdGlvbi5cclxuICAgKiBJZiBhIG1hbmFnZXIgaXMgbm90IGZvdW5kIGEgbmV3IFJlbGF0ZWQgVmlldyBNYW5hZ2VyIGlzIGNyZWF0ZWQgYW5kIHJldHVybmVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gUmVsYXRlZFZpZXdNYW5hZ2VyXHJcbiAgICovXHJcbiAgZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyOiBmdW5jdGlvbiBnZXRSZWxhdGVkVmlld01hbmFnZXIocmVsYXRlZFZpZXcpIHtcclxuICAgIGlmICghdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzKSB7XHJcbiAgICAgIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2VycyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZWxhdGVkVmlld01hbmFnZXI7XHJcbiAgICBpZiAodGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3LmlkXSkge1xyXG4gICAgICByZWxhdGVkVmlld01hbmFnZXIgPSB0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnNbcmVsYXRlZFZpZXcuaWRdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVsYXRlZFZpZXcuaWQgPSBgJHt0aGlzLmlkfV8ke3JlbGF0ZWRWaWV3LmlkfWA7XHJcbiAgICAgIGNvbnN0IHJlbGF0ZWRWaWV3T3B0aW9ucyA9IHt9O1xyXG4gICAgICBsYW5nLm1peGluKHJlbGF0ZWRWaWV3T3B0aW9ucywgcmVsYXRlZFZpZXcpO1xyXG5cclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBpZDogcmVsYXRlZFZpZXcuaWQsXHJcbiAgICAgICAgcmVsYXRlZFZpZXdDb25maWc6IHJlbGF0ZWRWaWV3T3B0aW9ucyxcclxuICAgICAgfTtcclxuICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyID0gbmV3IFJlbGF0ZWRWaWV3TWFuYWdlcihvcHRpb25zKTtcclxuICAgICAgdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3LmlkXSA9IHJlbGF0ZWRWaWV3TWFuYWdlcjtcclxuICAgIH1cclxuICAgIHJldHVybiByZWxhdGVkVmlld01hbmFnZXI7XHJcbiAgfSxcclxuICAvKipcclxuICAgKlxyXG4gICAqIEFkZCB0aGUgZWFjaCBlbnRyeSBhbmQgcm93IHRvIHRoZSBSZWxhdGVWaWV3IG1hbmFnZXIgd2ljaCBpbiB0dXJuIGNyZWF0ZXMgdGhlIG5ldyByZWxhdGVkIHZpZXcgYW5kIHJlbmRlcnMgaXRzIGNvbnRlbnQgd2l0aCBpbiB0aGUgY3VycmVudCByb3cuYFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IHRoZSBjdXJyZW50IGVudHJ5IGZyb20gdGhlIGRhdGEuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJvd25vZGUgdGhlIGN1cnJlbnQgZG9tIG5vZGUgdG8gYWRkIHRoZSB3aWRnZXQgdG8uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJpZXMgdGhlIGRhdGEuXHJcbiAgICovXHJcbiAgb25Qcm9jZXNzUmVsYXRlZFZpZXdzOiBmdW5jdGlvbiBvblByb2Nlc3NSZWxhdGVkVmlld3MoZW50cnksIHJvd05vZGUpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnNpbXBsZU1vZGUgJiYgKHRoaXMub3B0aW9ucy5zaW1wbGVNb2RlID09PSB0cnVlKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5yZWxhdGVkVmlld3MubGVuZ3RoID4gMCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZWxhdGVkVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3c1tpXS5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZWRWaWV3TWFuYWdlciA9IHRoaXMuZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyKHRoaXMucmVsYXRlZFZpZXdzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHJlbGF0ZWRWaWV3TWFuYWdlcikge1xyXG4gICAgICAgICAgICAgIGlmICghZW50cnkuJGtleSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkuJGtleSA9IHRoaXMuc3RvcmUuZ2V0SWRlbnRpdHkoZW50cnkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZWxhdGVkVmlld01hbmFnZXIuYWRkVmlldyhlbnRyeSwgcm93Tm9kZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHByb2Nlc3NpbmcgcmVsYXRlZCB2aWV3czonICsgZXJyb3IpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqICBEZXN0cm95cyBhbGwgb2YgdGhlIHJlbGF0ZWQgdmlldyB3aWRnZXRzLCB0aGF0IHdhcyBhZGRlZC5cclxuICAgKi9cclxuICBkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzOiBmdW5jdGlvbiBkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCkge1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICBmb3IgKGNvbnN0IHJlbGF0ZWRWaWV3SWQgaW4gdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycy5oYXNPd25Qcm9wZXJ0eShyZWxhdGVkVmlld0lkKSkge1xyXG4gICAgICAgICAgdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3SWRdLmRlc3Ryb3lWaWV3cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBkaWppdCBXaWRnZXQgdG8gZGVzdHJveSB0aGUgc2VhcmNoIHdpZGdldCBiZWZvcmUgZGVzdHJveWluZyB0aGUgdmlldy5cclxuICAgKi9cclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5kZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHRoaXMuZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0cygpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHJlbmRlcmVkIGh0bWwgc25hcCBzaG90IG9mIHRoZSBlbnRyeS5cclxuICAgKi9cclxuICBnZXRDb250ZXh0U25hcFNob3Q6IGZ1bmN0aW9uIGdldENvbnRleHRTbmFwU2hvdChvcHRpb25zKSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuZW50cmllc1tvcHRpb25zLmtleV07XHJcbiAgICBsZXQgc25hcFNob3Q7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgc25hcFNob3QgPSB0aGlzLml0ZW1UZW1wbGF0ZS5hcHBseShlbnRyeSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc25hcFNob3Q7XHJcbiAgfSxcclxuICBkZXN0cm95UmVsYXRlZFZpZXc6IGZ1bmN0aW9uIGRlc3Ryb3lSZWxhdGVkVmlldyhyZWxhdGVkVmlldykge1xyXG4gICAgaWYgKHJlbGF0ZWRWaWV3KSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0ZWRWaWV3TWFuYWdlciA9IHRoaXMuZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyKHJlbGF0ZWRWaWV3KTtcclxuICAgICAgaWYgKHJlbGF0ZWRWaWV3TWFuYWdlcikge1xyXG4gICAgICAgIHJlbGF0ZWRWaWV3TWFuYWdlci5kZXN0cm95Vmlld3MoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW52b2tlUmVsYXRlZFZpZXdBY3Rpb246IGZ1bmN0aW9uIGludm9rZVJlbGF0ZWRWaWV3QWN0aW9uKGFjdGlvbiwgc2VsZWN0aW9uKSB7XHJcbiAgICBsZXQgYWRkVmlldyA9IHRydWU7XHJcbiAgICBjb25zdCByZWxhdGVkVmlldyA9IGFjdGlvbi5yZWxhdGVkVmlldztcclxuICAgIGlmICghcmVsYXRlZFZpZXcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlbGF0ZWRWaWV3TWFuYWdlciA9IHRoaXMuZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyKHJlbGF0ZWRWaWV3KTtcclxuICAgIGlmICghcmVsYXRlZFZpZXdNYW5hZ2VyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXJlbGF0ZWRWaWV3Lmhhc093blByb3BlcnR5KCdlbmFibGVkJykpIHtcclxuICAgICAgcmVsYXRlZFZpZXcuZW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlbGF0ZWRWaWV3LmVuYWJsZWQpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3LmlkID09PSByZWxhdGVkVmlldy5pZCkge1xyXG4gICAgICAgICAgYWRkVmlldyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEZXN0cm95IHRoZSBjdXJyZW50IHJlbGF0ZWQgdmlldztcclxuICAgICAgICB0aGlzLmRlc3Ryb3lSZWxhdGVkVmlldyh0aGlzLmN1cnJlbnRSZWxhdGVkVmlldyk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UmVsYXRlZFZpZXcgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYWRkVmlldykge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJlbGF0ZWRWaWV3ID0gcmVsYXRlZFZpZXc7XHJcbiAgICAgICAgY29uc3QgZW50cnkgPSBzZWxlY3Rpb24uZGF0YTtcclxuICAgICAgICBpZiAoIWVudHJ5LiRrZXkpIHtcclxuICAgICAgICAgIGVudHJ5LiRrZXkgPSB0aGlzLnN0b3JlLmdldElkZW50aXR5KGVudHJ5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCBzZWxlY3RlZCByb3dcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5nZXQoJ3NlbGVjdGlvbk1vZGVsJykuZ2V0U2VsZWN0aW9ucygpO1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFJvdyA9IG51bGw7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2VsZWN0ZWRJdGVtcykge1xyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICBzZWxlY3RlZFJvdyA9IHNlbGVjdGVkSXRlbXNba2V5XTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsZXRzIHNldCBzY3JvbGxlciB0byB0aGUgY3VycmVudCByb3cuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkUm93ICYmIHNlbGVjdGVkUm93LnRhZykge1xyXG4gICAgICAgICAgLy8gQWRkIHRoZSByZWxhdGVkIHZpZXcgdG8gdGhlIHNlbGVjdGVkIHJvd1xyXG4gICAgICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyLmFkZFZpZXcoZW50cnksIHNlbGVjdGVkUm93LnRhZywgdGhpcyk7XHJcblxyXG4gICAgICAgICAgLy8gbGV0cyBzZXQgc2Nyb2xsZXIgdG8gdGhlIGN1cnJlbnQgcm93LlxyXG4gICAgICAgICAgY29uc3Qgc2Nyb2xsZXJOb2RlID0gdGhpcy5nZXQoJ3Njcm9sbGVyJyk7XHJcbiAgICAgICAgICBpZiAoc2Nyb2xsZXJOb2RlKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbGVyTm9kZS5zY3JvbGxUb3AgPSBzZWxlY3RlZFJvdy50YWcub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbmF2aWdhdGVUb1F1aWNrRWRpdDogZnVuY3Rpb24gbmF2aWdhdGVUb1F1aWNrRWRpdChhY3Rpb24sIHNlbGVjdGlvbiwgYWRkaXRpb25hbE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHZpZXcgPSBBcHAuZ2V0VmlldyhhY3Rpb24uZWRpdFZpZXcgfHwgdGhpcy5xdWlja0VkaXRWaWV3IHx8IHRoaXMuZWRpdFZpZXcgfHwgdGhpcy5pbnNlcnRWaWV3KTtcclxuICAgIGNvbnN0IGtleSA9IHNlbGVjdGlvbi5kYXRhW3RoaXMuaWRQcm9wZXJ0eV07XHJcbiAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAga2V5LFxyXG4gICAgICBzZWxlY3RlZEVudHJ5OiBzZWxlY3Rpb24uZGF0YSxcclxuICAgICAgZnJvbUNvbnRleHQ6IHRoaXMsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICghYWN0aW9uLmhhc093blByb3BlcnR5KCdlbmFibGVkJykpIHtcclxuICAgICAgYWN0aW9uLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghYWN0aW9uLmVuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zID0gbGFuZy5taXhpbihvcHRpb25zLCBhZGRpdGlvbmFsT3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdmlldy5zaG93KG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=