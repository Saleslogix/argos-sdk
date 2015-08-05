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
    feed: null,

    /**
     * Initiates the SData request.
     */
    requestData: function requestData() {
      _domClass['default'].add(this.domNode, 'list-loading');
      this.listLoading = true;

      var request = this.createRequest();
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
    onRequestDataSuccess: function onRequestDataSuccess(feed) {
      this.processFeed(feed);

      _domClass['default'].remove(this.domNode, 'list-loading');
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
    onRequestDataFailure: function onRequestDataFailure(response, o) {
      alert(_string['default'].substitute(this.requestErrorText, [response, o])); // eslint-disable-line
      _ErrorManager['default'].addError('failure', response);
      _domClass['default'].remove(this.domNode, 'list-loading');
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
    onRequestDataAborted: function onRequestDataAborted(response) {
      this.options = false; // force a refresh
      _ErrorManager['default'].addError('aborted', response);

      _domClass['default'].remove(this.domNode, 'list-loading');
      this.listLoading = false;
    },
    clear: function clear() {
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
    processFeed: function processFeed(feed) {
      if (!this.feed) {
        this.set('listContent', '');
      }

      this.feed = feed;

      if (this.feed.$totalResults === 0) {
        this.set('listContent', this.noDataTemplate.apply(this));
      } else if (feed.$resources) {
        var docfrag = document.createDocumentFragment();
        for (var i = 0; i < feed.$resources.length; i++) {
          var entry = feed.$resources[i];
          entry.$descriptor = entry.$descriptor || feed.$descriptor;
          this.entries[entry.$key] = entry;
          var rowNode = _domConstruct['default'].toDom(this.rowTemplate.apply(entry, this));
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
      if (typeof this.feed.$totalResults !== 'undefined') {
        var remaining = this.feed.$totalResults - (this.feed.$startIndex + this.feed.$itemsPerPage - 1);
        this.set('remainingContent', _string['default'].substitute(this.remainingText, [remaining]));
      }

      _domClass['default'].toggle(this.domNode, 'list-has-more', this.hasMoreData());

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
    createRequest: function createRequest() {
      var where = [];
      var options = this.options;
      var pageSize = this.pageSize;
      var startIndex = this.feed && this.feed.$startIndex > 0 && this.feed.$itemsPerPage > 0 ? this.feed.$startIndex + this.feed.$itemsPerPage : 1;

      var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService()).setCount(pageSize).setStartIndex(startIndex);

      var contractName = this.expandExpression(options && options.contractName || this.contractName);
      if (contractName) {
        request.setContractName(contractName);
      }

      var resourceKindExpr = this.expandExpression(options && options.resourceKind || this.resourceKind);
      if (resourceKindExpr) {
        request.setResourceKind(resourceKindExpr);
      }

      var resourcePropertyExpr = this.expandExpression(options && options.resourceProperty || this.resourceProperty);
      if (resourcePropertyExpr) {
        request.getUri().setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, resourcePropertyExpr);
      }

      var resourcePredicateExpr = this.expandExpression(options && options.resourcePredicate || this.resourcePredicate);
      if (resourcePredicateExpr) {
        request.getUri().setCollectionPredicate(resourcePredicateExpr);
      }

      var querySelectExpr = this.expandExpression(options && options.select || this.querySelect);
      if (querySelectExpr) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, querySelectExpr.join(','));
      }

      var queryIncludeExpr = this.expandExpression(this.queryInclude);
      if (queryIncludeExpr) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, queryIncludeExpr.join(','));
      }

      var queryOrderByExpr = this.expandExpression(options && options.orderBy || this.queryOrderBy);
      if (queryOrderByExpr) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, queryOrderByExpr);
      }

      var queryWhereExpr = this.expandExpression(options && options.where || this.queryWhere);
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
    hasMoreData: function hasMoreData() {
      if (this.feed && this.feed.$startIndex > 0 && this.feed.$itemsPerPage > 0 && this.feed.$totalResults >= 0) {
        var start = this.feed.$startIndex;
        var count = this.feed.$itemsPerPage;
        var total = this.feed.$totalResults;

        return start + count <= total;
      }

      return true; // no way to determine, always assume more data
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile._LegacySDataListMixin', __class);
  module.exports = __class;
});
/*o*/
