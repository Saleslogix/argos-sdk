define('argos/_RelatedViewWidgetListMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './RelatedViewManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _RelatedViewManager) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /*
   * See copyright file.
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _RelatedViewManager2 = _interopRequireDefault(_RelatedViewManager);

  var __class = (0, _declare['default'])('argos._RelatedViewWidgetListMixin', null, {
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
    listActionTemplate: new Simplate(['<li data-dojo-attach-point="actionsNode" class="actions-row">', '<div data-dojo-attach-point="relatedActionsNode" class="related-view-list-action"></div></li>']),
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

      var relatedViewManager = undefined;
      if (this.relatedViewManagers[relatedView.id]) {
        relatedViewManager = this.relatedViewManagers[relatedView.id];
      } else {
        relatedView.id = this.id + '_' + relatedView.id;
        var relatedViewOptions = {};
        _lang['default'].mixin(relatedViewOptions, relatedView);

        var options = {
          id: relatedView.id,
          relatedViewConfig: relatedViewOptions
        };
        relatedViewManager = new _RelatedViewManager2['default'](options);
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
      var snapShot = undefined;
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
        options = _lang['default'].mixin(options, additionalOptions);
      }

      if (view) {
        view.show(options);
      }
    }
  });
  module.exports = __class;
});
