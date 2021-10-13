define('argos/_LegacySDataListMixin', ['module', 'exports', 'dojo/_base/declare', './ErrorManager', 'dojo/string'], function (module, exports, _declare, _ErrorManager, _string) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _string2 = _interopRequireDefault(_string);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/_LegacySDataListMixin
   * @classdesc Enables legacy SData operations for the List view.
   *
   * Adds the original SData operations to the view, use this in addition to _SDataListMixin.
   *
   */
  var __class = (0, _declare2.default)('argos._LegacySDataListMixin', null, /** @lends module:argos/_LegacySDataListMixin.prototype */{
    feed: null,

    /**
     * Initiates the SData request.
     */
    requestData: function requestData() {
      $(this.domNode).addClass('list-loading');
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

      $(this.domNode).removeClass('list-loading');
      this.listLoading = false;

      if (!this._onScrollHandle && this.continuousScrolling) {
        this._onScrollHandle = this.connect(this.domNode, 'onscroll', this.onScroll);
      }
      this.isRefreshing = false;
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     * @deprecated
     */
    onRequestDataFailure: function onRequestDataFailure(response, o) {
      alert(_string2.default.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
      _ErrorManager2.default.addError('failure', response);
      $(this.domNode).removeClass('list-loading');
      this.listLoading = false;
      this.isRefreshing = false;
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
      _ErrorManager2.default.addError('aborted', response);

      $(this.domNode).removeClass('list-loading');
      this.listLoading = false;
      this.isRefreshing = false;
    },
    clear: function clear() {
      this.inherited(clear, arguments);
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
        var row = [];
        var count = feed.$resources.length;
        for (var i = 0; i < count; i++) {
          var entry = feed.$resources[i];
          entry.$descriptor = entry.$descriptor || feed.$descriptor;
          this.entries[entry.$key] = entry;

          var rowNode = void 0;
          if (this.isCardView) {
            rowNode = $(this.rowTemplate.apply(entry, this));
          } else {
            rowNode = $(this.liRowTemplate.apply(entry, this));
          }

          if (this.isCardView && this.multiColumnView) {
            var column = $('<div class="' + this.multiColumnClass + ' columns">').append(rowNode);
            row.push(column);
            if ((i + 1) % this.multiColumnCount === 0 || i === count - 1) {
              (function () {
                var rowTemplate = $('<div class="row"></div>');
                row.forEach(function (element) {
                  rowTemplate.append(element);
                });
                docfrag.appendChild(rowTemplate.get(0));
                row = [];
              })();
            }
          } else {
            docfrag.appendChild(rowNode.get(0));
          }

          this.onApplyRowTemplate(entry, rowNode);
          if (this.relatedViews.length > 0) {
            this.onProcessRelatedViews(entry, rowNode, feed);
          }
        }

        if (docfrag.childNodes.length > 0) {
          $(this.contentNode).append(docfrag);
        }
      }

      // todo: add more robust handling when $totalResults does not exist, i.e., hide element completely
      if (typeof this.feed.$totalResults !== 'undefined') {
        var remaining = this.feed.$totalResults - (this.feed.$startIndex + this.feed.$itemsPerPage - 1);
        this.set('remainingContent', _string2.default.substitute(this.remainingText, [remaining]));
      }

      $(this.domNode).toggleClass('list-has-more', this.hasMoreData());

      if (this.options.allowEmptySelection) {
        $(this.domNode).addClass('list-has-empty-opt');
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
    createRequest: function createRequest() /* o*/{
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

  /**
   * @module argos/_LegacySDataListMixin
   */
  exports.default = __class;
  module.exports = exports['default'];
});