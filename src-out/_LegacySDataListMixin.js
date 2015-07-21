<<<<<<< HEAD
define('argos/_LegacySDataListMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'argos/ErrorManager', 'dojo/dom-construct', 'dojo/dom-class', 'dojo/string'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _argosErrorManager, _dojoDomConstruct, _dojoDomClass, _dojoString) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    /*
     * Copyright (c) 1997-2014, SalesLogix, NA., LLC. All rights reserved.
     */

    /**
     * _LegacySDataListMixin enables legacy SData operations for the List view.
     *
     * Adds the original SData operations to the view, use this in addition to _SDataListMixin.
     *
     * @alternateClassName _LegacySDataListMixin
     */

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _ErrorManager = _interopRequireDefault(_argosErrorManager);

    var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _string = _interopRequireDefault(_dojoString);

    var __class = (0, _declare['default'])('argos._LegacySDataListMixin', null, {
=======
/*
 * Copyright (c) 1997-2014, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * _LegacySDataListMixin enables legacy SData operations for the List view.
 *
 * Adds the original SData operations to the view, use this in addition to _SDataListMixin.
 *
 * @alternateClassName _LegacySDataListMixin
 */
define('argos/_LegacySDataListMixin', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'argos/ErrorManager',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/string'
], function(
    declare,
    lang,
    ErrorManager,
    domConstruct,
    domClass,
    string
) {
    var __class = declare('argos._LegacySDataListMixin', null, {
>>>>>>> develop
        feed: null,

        /**
         * Initiates the SData request.
         */
<<<<<<< HEAD
        requestData: function requestData() {
            var request;

            _domClass['default'].add(this.domNode, 'list-loading');
=======
        requestData: function() {
            var request;

            domClass.add(this.domNode, 'list-loading');
>>>>>>> develop
            this.listLoading = true;

            request = this.createRequest();
            request.read({
                success: this.onRequestDataSuccess,
                failure: this.onRequestDataFailure,
                aborted: this.onRequestDataAborted,
                scope: this
            });
        },
        /**
         * Handler when a request to SData is successful
         * @param {Object} feed The SData response
         * @deprecated
         */
<<<<<<< HEAD
        onRequestDataSuccess: function onRequestDataSuccess(feed) {
            this.processFeed(feed);

            _domClass['default'].remove(this.domNode, 'list-loading');
=======
        onRequestDataSuccess: function(feed) {
            this.processFeed(feed);

            domClass.remove(this.domNode, 'list-loading');
>>>>>>> develop
            this.listLoading = false;

            if (!this._onScrollHandle && this.continuousScrolling) {
                this._onScrollHandle = this.connect(this.domNode, 'onscroll', this.onScroll);
            }
        },
        /**
         * Handler when an error occurs while request data from the SData endpoint.
         * @param {Object} response The response object.
         * @param {Object} o The options that were passed when creating the Ajax request.
         * @deprecated
         */
<<<<<<< HEAD
        onRequestDataFailure: function onRequestDataFailure(response, o) {
            alert(_string['default'].substitute(this.requestErrorText, [response, o]));
            _ErrorManager['default'].addError('failure', response);
            _domClass['default'].remove(this.domNode, 'list-loading');
=======
        onRequestDataFailure: function(response, o) {
            alert(string.substitute(this.requestErrorText, [response, o]));
            ErrorManager.addError('failure', response);
            domClass.remove(this.domNode, 'list-loading');
>>>>>>> develop
            this.listLoading = false;
        },
        /**
         * Handler when an a request is aborted from an SData endpoint.
         *
         * Clears the `this.options` object which will by default force a refresh of the view.
         *
         * @param {Object} response The response object.
         * @param {Object} o The options that were passed when creating the Ajax request.
         * @deprecated
         */
<<<<<<< HEAD
        onRequestDataAborted: function onRequestDataAborted(response, o) {
            this.options = false; // force a refresh
            _ErrorManager['default'].addError('aborted', response);

            _domClass['default'].remove(this.domNode, 'list-loading');
            this.listLoading = false;
        },
        clear: function clear() {
=======
        onRequestDataAborted: function(response, o) {
            this.options = false; // force a refresh
            ErrorManager.addError('aborted', response);

            domClass.remove(this.domNode, 'list-loading');
            this.listLoading = false;
        },
        clear: function() {
>>>>>>> develop
            this.inherited(arguments);
            this.feed = null;
            this.entries = {};
        },
        /**
         * Processes the feed result from the SData request and renders out the resource feed entries.
         *
         * Saves the feed to `this.feed` and saves each entry to the `this.entries` collection using the entries `$key`
         * as the key.
         *
         * @param {Object} feed The SData result
         * @deprecated
         */
<<<<<<< HEAD
        processFeed: function processFeed(feed) {
=======
        processFeed: function(feed) {
>>>>>>> develop
            var docfrag, entry, i, related, remaining, rowNode;

            if (!this.feed) {
                this.set('listContent', '');
            }

            this.feed = feed;

            if (this.feed['$totalResults'] === 0) {
                this.set('listContent', this.noDataTemplate.apply(this));
            } else if (feed['$resources']) {
                docfrag = document.createDocumentFragment();
                for (i = 0; i < feed['$resources'].length; i++) {
                    entry = feed['$resources'][i];
                    entry['$descriptor'] = entry['$descriptor'] || feed['$descriptor'];
                    this.entries[entry.$key] = entry;
                    rowNode = _domConstruct['default'].toDom(this.rowTemplate.apply(entry, this));
                    docfrag.appendChild(rowNode);
                    this.onApplyRowTemplate(entry, rowNode);
                    if (this.relatedViews.length > 0) {
                        this.onProcessRelatedViews(entry, rowNode, feed);
                    }

                }

                if (docfrag.childNodes.length > 0) {
                    _domConstruct['default'].place(docfrag, this.contentNode, 'last');
                }
            }

            // todo: add more robust handling when $totalResults does not exist, i.e., hide element completely
            if (typeof this.feed['$totalResults'] !== 'undefined') {
                remaining = this.feed['$totalResults'] - (this.feed['$startIndex'] + this.feed['$itemsPerPage'] - 1);
                this.set('remainingContent', _string['default'].substitute(this.remainingText, [remaining]));
            }

<<<<<<< HEAD
            _domClass['default'].toggle(this.domNode, 'list-has-more', this.hasMoreData());
=======
            domClass.toggle(this.domNode, 'list-has-more', this.hasMoreData());
>>>>>>> develop

            if (this.options.allowEmptySelection) {
                _domClass['default'].add(this.domNode, 'list-has-empty-opt');
            }

            this._loadPreviousSelections();
        },
        /**
         * Creates SDataResourceCollectionRequest instance and sets a number of known properties.
         *
         * List of properties used from `this.property/this.options.property`:
         *
         * `pageSize`, `contractName`, `resourceKind`, `resourceProperty`, `resourcePredicate`, `querySelect/select`,
         * `queryOrderBy/orderBy`, `queryInclude`, `queryWhere/where`, `query`
         *
         * The where parts are joined via `AND`.
         *
         * The Start Index is set by checking the saved `this.entries` and if its `$startIndex` and `$itemsPerPage` greater
         * than 0 -- then it adds them together to get the instead. If no feed or not greater than 0 then set the index
         * to 1.
         *
         * @param {object} o Optional request options.
         * @return {Object} Sage.SData.Client.SDataResourceCollectionRequest instance.
         * @deprecated
         */
<<<<<<< HEAD
        createRequest: function createRequest(o) {
=======
        createRequest: function(o) {
>>>>>>> develop
            var where = [],
                options = this.options,
                pageSize = this.pageSize,
                request,
                contractName,
                resourceKindExpr,
                resourcePropertyExpr,
                resourcePredicateExpr,
                querySelectExpr,
                queryIncludeExpr,
                queryOrderByExpr,
                queryWhereExpr,
<<<<<<< HEAD
                startIndex = this.feed && this.feed['$startIndex'] > 0 && this.feed['$itemsPerPage'] > 0 ? this.feed['$startIndex'] + this.feed['$itemsPerPage'] : 1;

            request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService()).setCount(pageSize).setStartIndex(startIndex);

            contractName = this.expandExpression(options && options.contractName || this.contractName);
=======
                startIndex = this.feed && this.feed['$startIndex'] > 0 && this.feed['$itemsPerPage'] > 0
                    ? this.feed['$startIndex'] + this.feed['$itemsPerPage']
                    : 1;

            request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())
                .setCount(pageSize)
                .setStartIndex(startIndex);

            contractName = this.expandExpression((options && options.contractName) || this.contractName);
>>>>>>> develop
            if (contractName) {
                request.setContractName(contractName);
            }

<<<<<<< HEAD
            resourceKindExpr = this.expandExpression(options && options.resourceKind || this.resourceKind);
=======
            resourceKindExpr = this.expandExpression((options && options.resourceKind) || this.resourceKind);
>>>>>>> develop
            if (resourceKindExpr) {
                request.setResourceKind(resourceKindExpr);
            }

<<<<<<< HEAD
            resourcePropertyExpr = this.expandExpression(options && options.resourceProperty || this.resourceProperty);
=======
            resourcePropertyExpr = this.expandExpression((options && options.resourceProperty) || this.resourceProperty);
>>>>>>> develop
            if (resourcePropertyExpr) {
                request.getUri().setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, resourcePropertyExpr);
            }

<<<<<<< HEAD
            resourcePredicateExpr = this.expandExpression(options && options.resourcePredicate || this.resourcePredicate);
=======
            resourcePredicateExpr = this.expandExpression((options && options.resourcePredicate) || this.resourcePredicate);
>>>>>>> develop
            if (resourcePredicateExpr) {
                request.getUri().setCollectionPredicate(resourcePredicateExpr);
            }

<<<<<<< HEAD
            querySelectExpr = this.expandExpression(options && options.select || this.querySelect);
=======
            querySelectExpr = this.expandExpression((options && options.select) || this.querySelect);
>>>>>>> develop
            if (querySelectExpr) {
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, querySelectExpr.join(','));
            }

            queryIncludeExpr = this.expandExpression(this.queryInclude);
            if (queryIncludeExpr) {
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, queryIncludeExpr.join(','));
            }

<<<<<<< HEAD
            queryOrderByExpr = this.expandExpression(options && options.orderBy || this.queryOrderBy);
=======
            queryOrderByExpr = this.expandExpression((options && options.orderBy) || this.queryOrderBy);
>>>>>>> develop
            if (queryOrderByExpr) {
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, queryOrderByExpr);
            }

<<<<<<< HEAD
            queryWhereExpr = this.expandExpression(options && options.where || this.queryWhere);
=======
            queryWhereExpr = this.expandExpression((options && options.where) || this.queryWhere);
>>>>>>> develop
            if (queryWhereExpr) {
                where.push(queryWhereExpr);
            }

            if (this.query) {
                where.push(this.query);
            }

            if (where.length > 0) {
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Where, where.join(' and '));
            }

            return request;
        },
<<<<<<< HEAD
        hasMoreData: function hasMoreData() {
=======
        hasMoreData: function() {
>>>>>>> develop
            var start, count, total;

            if (this.feed && this.feed['$startIndex'] > 0 && this.feed['$itemsPerPage'] > 0 && this.feed['$totalResults'] >= 0) {
                start = this.feed['$startIndex'];
                count = this.feed['$itemsPerPage'];
                total = this.feed['$totalResults'];

<<<<<<< HEAD
                return start + count <= total;
=======
                return (start + count <= total);
>>>>>>> develop
            } else {
                return true; // no way to determine, always assume more data
            }
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile._LegacySDataListMixin', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile._LegacySDataListMixin', __class);
    return __class;
>>>>>>> develop
});

