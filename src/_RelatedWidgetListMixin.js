/*
 * See copyright file.
 */

define('argos/_RelatedWidgetListMixin', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/query',
    './RelatedViewManager'
], function(
    declare,
    array,
    lang,
    aspect,
    domConstruct,
    query,
    RelatedViewManager
) {
    var __class = declare('argos._RelatedWidgetListMixin', null, {
        /**
         * The related view definitions for related views for each row.
         */
         relatedViews: null,
        /**
         * The related view managers for each related view definition.
         */
        relatedViewManagers: null,
        startup: function() {
            this.relatedViews = this._createCustomizedLayout(this.createRelatedViewLayout(), 'relatedViews');
            this.inherited(arguments);
        },
        /**
        * Sets and returns the related view definition, this method should be overriden in the view
        * so that you may define the related views that will be add to each row in the list.
        * @return {Object} this.relatedViews
        */
        createRelatedViewLayout: function() {
            return this.relatedViews || (this.relatedViews = {});
        },
        onApplyRowTemplate:function(entry, rowNode){
             if (this.relatedViews.length > 0) {
                 this.onProcessRelatedViews(entry, rowNode);
             }
             this.inherited(arguments);
        },
        /**
        * Gets the related view manager for a related view definition.
        * If a manager is not found a new Related View Manager is created and returned.
        * @return {Object} RelatedViewManager
        */
        getRelatedViewManager: function(relatedView) {
            var relatedViewManager, options, relatedViewOptions;
            if (!this.relatedViewManagers) {
                this.relatedViewManagers = {};
            }
            if (this.relatedViewManagers[relatedView.id]) {
                relatedViewManager = this.relatedViewManagers[relatedView.id];
            } else {
                relatedView.id = this.id + '_' + relatedView.id;
                relatedViewOptions = {
                };
                lang.mixin(relatedViewOptions, relatedView);

                options = {
                    id: relatedView.id,
                    relatedViewConfig: relatedViewOptions
                };
                relatedViewManager = new RelatedViewManager(options);
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
         onProcessRelatedViews: function(entry, rowNode) {
            var relatedViewManager, i;
            if (this.options && this.options.simpleMode && (this.options.simpleMode === true)) {
                return;
            }
            if (this.relatedViews.length > 0) {
                try {
                    for (i = 0; i < this.relatedViews.length; i++) {
                        if (this.relatedViews[i].enabled) {
                            relatedViewManager = this.getRelatedViewManager(this.relatedViews[i]);
                            if (relatedViewManager) {
                                if (!entry.$key) {
                                    entry.$key = this.store.getIdentity(entry);
                                }
                                relatedViewManager.addView(entry, rowNode, this);
                            }
                        }
                    }
                }
                catch (error) {
                    console.log('Error processing related views:' + error);

                }
            }
        },
        /**
         *  Destroys all of the related view widgets, that was added.
         */
        destroyRelatedViewWidgets: function() {
            if (this.relatedViewManagers) {
                for (var relatedViewId in this.relatedViewManagers) {
                    this.relatedViewManagers[relatedViewId].destroyViews();
                }
            }
        },
        /**
         * Extends dijit Widget to destroy the search widget before destroying the view.
         */
        destroy: function() {
            this.destroyRelatedViewWidgets();
            this.inherited(arguments);
        },
        clear: function(all) {
            this.inherited(arguments);
            this.destroyRelatedViewWidgets();
        },
        /**
         * Returns a rendered html snap shot of the entry.
         */
        getContextSnapShot: function(options) {
            var snapShot, entry = this.entries[options.key];
            if (entry) {
                snapShot = this.itemTemplate.apply(entry, this);
            }
            return snapShot;
        }
    });
    return __class
});

