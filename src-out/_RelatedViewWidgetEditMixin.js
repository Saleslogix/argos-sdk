define('argos/_RelatedViewWidgetEditMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/query', './RelatedViewManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoQuery, _RelatedViewManager) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /*
   * See copyright file.
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _query = _interopRequireDefault(_dojoQuery);

  var _RelatedViewManager2 = _interopRequireDefault(_RelatedViewManager);

  var __class = (0, _declare['default'])('argos._RelatedViewWidgetEditMixin', null, {
    cls: null,
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    relatedContentViewsTemplate: new Simplate(['<div id="{%= $.id %}" class="related-view-edit-content {%= $.cls %}"></div>']),
    createRowContent: function createRowContent(layout, content) {
      if (layout.relatedView) {
        content.push(this.relatedContentViewsTemplate.apply(layout.relatedView, this));
      } else {
        this.inherited(arguments);
      }
    },
    processData: function processData(entry) {
      this.destroyRelatedViewWidgets();
      this.createRelatedViews(this.layout, entry);
      this.inherited(arguments);
    },
    createRelatedViews: function createRelatedViews(layout, entry) {
      var _this = this;

      layout.forEach((function (item) {
        if (item.relatedView) {
          var node = (0, _query['default'])('#' + item.relatedView.id, _this.contentNode)[0];
          if (node) {
            _this.onProcessRelatedViews(item.relatedView, node, entry);
          }
        }
        if (item.children) {
          _this.createRelatedViews(item.children, entry);
        }
      }).bind(this));
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
    onProcessRelatedViews: function onProcessRelatedViews(relatedView, rowNode, entry) {
      try {
        if (typeof relatedView.enabled === 'undefined') {
          relatedView.enabled = true;
        }

        if (relatedView.enabled) {
          var relatedViewManager = this.getRelatedViewManager(relatedView);
          if (relatedViewManager) {
            relatedViewManager.addView(entry, rowNode, this);
          }
        }
      } catch (error) {
        console.log('Error processing related view:' + error); // eslint-disable-line
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
    }
  });
  module.exports = __class;
});
