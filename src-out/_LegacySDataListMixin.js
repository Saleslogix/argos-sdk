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
   * @class argos._LegacySDataListMixin
   * @classdesc Enables legacy SData operations for the List view.
   *
   * Adds the original SData operations to the view, use this in addition to _SDataListMixin.
   *
   */
  var __class = (0, _declare2.default)('argos._LegacySDataListMixin', null, /** @lends argos._LegacySDataListMixin# */{
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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGVnYWN5U0RhdGFMaXN0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImZlZWQiLCJyZXF1ZXN0RGF0YSIsIiQiLCJkb21Ob2RlIiwiYWRkQ2xhc3MiLCJsaXN0TG9hZGluZyIsInJlcXVlc3QiLCJjcmVhdGVSZXF1ZXN0IiwicmVhZCIsInN1Y2Nlc3MiLCJvblJlcXVlc3REYXRhU3VjY2VzcyIsImZhaWx1cmUiLCJvblJlcXVlc3REYXRhRmFpbHVyZSIsImFib3J0ZWQiLCJvblJlcXVlc3REYXRhQWJvcnRlZCIsInNjb3BlIiwicHJvY2Vzc0ZlZWQiLCJyZW1vdmVDbGFzcyIsIl9vblNjcm9sbEhhbmRsZSIsImNvbnRpbnVvdXNTY3JvbGxpbmciLCJjb25uZWN0Iiwib25TY3JvbGwiLCJpc1JlZnJlc2hpbmciLCJyZXNwb25zZSIsIm8iLCJhbGVydCIsInN1YnN0aXR1dGUiLCJyZXF1ZXN0RXJyb3JUZXh0IiwiYWRkRXJyb3IiLCJvcHRpb25zIiwiY2xlYXIiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJlbnRyaWVzIiwic2V0IiwiJHRvdGFsUmVzdWx0cyIsIm5vRGF0YVRlbXBsYXRlIiwiYXBwbHkiLCIkcmVzb3VyY2VzIiwiZG9jZnJhZyIsImRvY3VtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInJvdyIsImNvdW50IiwibGVuZ3RoIiwiaSIsImVudHJ5IiwiJGRlc2NyaXB0b3IiLCIka2V5Iiwicm93Tm9kZSIsImlzQ2FyZFZpZXciLCJyb3dUZW1wbGF0ZSIsImxpUm93VGVtcGxhdGUiLCJtdWx0aUNvbHVtblZpZXciLCJjb2x1bW4iLCJtdWx0aUNvbHVtbkNsYXNzIiwiYXBwZW5kIiwicHVzaCIsIm11bHRpQ29sdW1uQ291bnQiLCJmb3JFYWNoIiwiZWxlbWVudCIsImFwcGVuZENoaWxkIiwiZ2V0Iiwib25BcHBseVJvd1RlbXBsYXRlIiwicmVsYXRlZFZpZXdzIiwib25Qcm9jZXNzUmVsYXRlZFZpZXdzIiwiY2hpbGROb2RlcyIsImNvbnRlbnROb2RlIiwicmVtYWluaW5nIiwiJHN0YXJ0SW5kZXgiLCIkaXRlbXNQZXJQYWdlIiwicmVtYWluaW5nVGV4dCIsInRvZ2dsZUNsYXNzIiwiaGFzTW9yZURhdGEiLCJhbGxvd0VtcHR5U2VsZWN0aW9uIiwiX2xvYWRQcmV2aW91c1NlbGVjdGlvbnMiLCJ3aGVyZSIsInBhZ2VTaXplIiwic3RhcnRJbmRleCIsIlNhZ2UiLCJTRGF0YSIsIkNsaWVudCIsIlNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCIsImdldFNlcnZpY2UiLCJzZXRDb3VudCIsInNldFN0YXJ0SW5kZXgiLCJjb250cmFjdE5hbWUiLCJleHBhbmRFeHByZXNzaW9uIiwic2V0Q29udHJhY3ROYW1lIiwicmVzb3VyY2VLaW5kRXhwciIsInJlc291cmNlS2luZCIsInNldFJlc291cmNlS2luZCIsInJlc291cmNlUHJvcGVydHlFeHByIiwicmVzb3VyY2VQcm9wZXJ0eSIsImdldFVyaSIsInNldFBhdGhTZWdtZW50IiwiU0RhdGFVcmkiLCJSZXNvdXJjZVByb3BlcnR5SW5kZXgiLCJyZXNvdXJjZVByZWRpY2F0ZUV4cHIiLCJyZXNvdXJjZVByZWRpY2F0ZSIsInNldENvbGxlY3Rpb25QcmVkaWNhdGUiLCJxdWVyeVNlbGVjdEV4cHIiLCJzZWxlY3QiLCJxdWVyeVNlbGVjdCIsInNldFF1ZXJ5QXJnIiwiUXVlcnlBcmdOYW1lcyIsIlNlbGVjdCIsImpvaW4iLCJxdWVyeUluY2x1ZGVFeHByIiwicXVlcnlJbmNsdWRlIiwiSW5jbHVkZSIsInF1ZXJ5T3JkZXJCeUV4cHIiLCJvcmRlckJ5IiwicXVlcnlPcmRlckJ5IiwiT3JkZXJCeSIsInF1ZXJ5V2hlcmVFeHByIiwicXVlcnlXaGVyZSIsInF1ZXJ5IiwiV2hlcmUiLCJzdGFydCIsInRvdGFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7OztBQU9BLE1BQU1BLFVBQVUsdUJBQVEsNkJBQVIsRUFBdUMsSUFBdkMsRUFBNkMsMENB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SixFQUFvQjtBQUNsQnZDLGNBQU1uQixJQUFOLENBQVcwRCxjQUFYO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLRSxLQUFULEVBQWdCO0FBQ2R6QyxjQUFNbkIsSUFBTixDQUFXLEtBQUs0RCxLQUFoQjtBQUNEOztBQUVELFVBQUl6QyxNQUFNaEMsTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ3BCdEMsZ0JBQVFrRyxXQUFSLENBQW9CekIsS0FBS0MsS0FBTCxDQUFXQyxNQUFYLENBQWtCZSxRQUFsQixDQUEyQlMsYUFBM0IsQ0FBeUNhLEtBQTdELEVBQW9FMUMsTUFBTStCLElBQU4sQ0FBVyxPQUFYLENBQXBFO0FBQ0Q7O0FBRUQsYUFBT3JHLE9BQVA7QUFDRCxLQWhPb0c7QUFpT3JHbUUsaUJBQWEsU0FBU0EsV0FBVCxHQUF1QjtBQUNsQyxVQUFJLEtBQUt6RSxJQUFMLElBQWEsS0FBS0EsSUFBTCxDQUFVcUUsV0FBVixHQUF3QixDQUFyQyxJQUEwQyxLQUFLckUsSUFBTCxDQUFVc0UsYUFBVixHQUEwQixDQUFwRSxJQUF5RSxLQUFLdEUsSUFBTCxDQUFVbUMsYUFBVixJQUEyQixDQUF4RyxFQUEyRztBQUN6RyxZQUFNb0YsUUFBUSxLQUFLdkgsSUFBTCxDQUFVcUUsV0FBeEI7QUFDQSxZQUFNMUIsUUFBUSxLQUFLM0MsSUFBTCxDQUFVc0UsYUFBeEI7QUFDQSxZQUFNa0QsUUFBUSxLQUFLeEgsSUFBTCxDQUFVbUMsYUFBeEI7O0FBRUEsZUFBUW9GLFFBQVE1RSxLQUFSLElBQWlCNkUsS0FBekI7QUFDRDs7QUFFRCxhQUFPLElBQVAsQ0FUa0MsQ0FTckI7QUFDZDtBQTNPb0csR0FBdkYsQ0FBaEIsQyxDQTFCQTs7Ozs7Ozs7Ozs7Ozs7O29CQXdRZXpILE8iLCJmaWxlIjoiX0xlZ2FjeVNEYXRhTGlzdE1peGluLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fTGVnYWN5U0RhdGFMaXN0TWl4aW5cclxuICogQGNsYXNzZGVzYyBFbmFibGVzIGxlZ2FjeSBTRGF0YSBvcGVyYXRpb25zIGZvciB0aGUgTGlzdCB2aWV3LlxyXG4gKlxyXG4gKiBBZGRzIHRoZSBvcmlnaW5hbCBTRGF0YSBvcGVyYXRpb25zIHRvIHRoZSB2aWV3LCB1c2UgdGhpcyBpbiBhZGRpdGlvbiB0byBfU0RhdGFMaXN0TWl4aW4uXHJcbiAqXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX0xlZ2FjeVNEYXRhTGlzdE1peGluJywgbnVsbCwgLyoqIEBsZW5kcyBhcmdvcy5fTGVnYWN5U0RhdGFMaXN0TWl4aW4jICove1xyXG4gIGZlZWQ6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYXRlcyB0aGUgU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXF1ZXN0RGF0YTogZnVuY3Rpb24gcmVxdWVzdERhdGEoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ2xpc3QtbG9hZGluZycpO1xyXG4gICAgdGhpcy5saXN0TG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuY3JlYXRlUmVxdWVzdCgpO1xyXG4gICAgcmVxdWVzdC5yZWFkKHtcclxuICAgICAgc3VjY2VzczogdGhpcy5vblJlcXVlc3REYXRhU3VjY2VzcyxcclxuICAgICAgZmFpbHVyZTogdGhpcy5vblJlcXVlc3REYXRhRmFpbHVyZSxcclxuICAgICAgYWJvcnRlZDogdGhpcy5vblJlcXVlc3REYXRhQWJvcnRlZCxcclxuICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhIHJlcXVlc3QgdG8gU0RhdGEgaXMgc3VjY2Vzc2Z1bFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmZWVkIFRoZSBTRGF0YSByZXNwb25zZVxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgb25SZXF1ZXN0RGF0YVN1Y2Nlc3M6IGZ1bmN0aW9uIG9uUmVxdWVzdERhdGFTdWNjZXNzKGZlZWQpIHtcclxuICAgIHRoaXMucHJvY2Vzc0ZlZWQoZmVlZCk7XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdsaXN0LWxvYWRpbmcnKTtcclxuICAgIHRoaXMubGlzdExvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoIXRoaXMuX29uU2Nyb2xsSGFuZGxlICYmIHRoaXMuY29udGludW91c1Njcm9sbGluZykge1xyXG4gICAgICB0aGlzLl9vblNjcm9sbEhhbmRsZSA9IHRoaXMuY29ubmVjdCh0aGlzLmRvbU5vZGUsICdvbnNjcm9sbCcsIHRoaXMub25TY3JvbGwpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcmVxdWVzdCBkYXRhIGZyb20gdGhlIFNEYXRhIGVuZHBvaW50LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvIFRoZSBvcHRpb25zIHRoYXQgd2VyZSBwYXNzZWQgd2hlbiBjcmVhdGluZyB0aGUgQWpheCByZXF1ZXN0LlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgb25SZXF1ZXN0RGF0YUZhaWx1cmU6IGZ1bmN0aW9uIG9uUmVxdWVzdERhdGFGYWlsdXJlKHJlc3BvbnNlLCBvKSB7XHJcbiAgICBhbGVydChzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLnJlcXVlc3RFcnJvclRleHQsIFtyZXNwb25zZSwgb10pKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKCdmYWlsdXJlJywgcmVzcG9uc2UpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdsaXN0LWxvYWRpbmcnKTtcclxuICAgIHRoaXMubGlzdExvYWRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYW4gYSByZXF1ZXN0IGlzIGFib3J0ZWQgZnJvbSBhbiBTRGF0YSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIENsZWFycyB0aGUgYHRoaXMub3B0aW9uc2Agb2JqZWN0IHdoaWNoIHdpbGwgYnkgZGVmYXVsdCBmb3JjZSBhIHJlZnJlc2ggb2YgdGhlIHZpZXcuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gbyBUaGUgb3B0aW9ucyB0aGF0IHdlcmUgcGFzc2VkIHdoZW4gY3JlYXRpbmcgdGhlIEFqYXggcmVxdWVzdC5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdERhdGFBYm9ydGVkOiBmdW5jdGlvbiBvblJlcXVlc3REYXRhQWJvcnRlZChyZXNwb25zZSkge1xyXG4gICAgdGhpcy5vcHRpb25zID0gZmFsc2U7IC8vIGZvcmNlIGEgcmVmcmVzaFxyXG4gICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKCdhYm9ydGVkJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgICB0aGlzLmxpc3RMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHRoaXMuZmVlZCA9IG51bGw7XHJcbiAgICB0aGlzLmVudHJpZXMgPSB7fTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFByb2Nlc3NlcyB0aGUgZmVlZCByZXN1bHQgZnJvbSB0aGUgU0RhdGEgcmVxdWVzdCBhbmQgcmVuZGVycyBvdXQgdGhlIHJlc291cmNlIGZlZWQgZW50cmllcy5cclxuICAgKlxyXG4gICAqIFNhdmVzIHRoZSBmZWVkIHRvIGB0aGlzLmZlZWRgIGFuZCBzYXZlcyBlYWNoIGVudHJ5IHRvIHRoZSBgdGhpcy5lbnRyaWVzYCBjb2xsZWN0aW9uIHVzaW5nIHRoZSBlbnRyaWVzIGAka2V5YFxyXG4gICAqIGFzIHRoZSBrZXkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZmVlZCBUaGUgU0RhdGEgcmVzdWx0XHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKi9cclxuICBwcm9jZXNzRmVlZDogZnVuY3Rpb24gcHJvY2Vzc0ZlZWQoZmVlZCkge1xyXG4gICAgaWYgKCF0aGlzLmZlZWQpIHtcclxuICAgICAgdGhpcy5zZXQoJ2xpc3RDb250ZW50JywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmVlZCA9IGZlZWQ7XHJcblxyXG4gICAgaWYgKHRoaXMuZmVlZC4kdG90YWxSZXN1bHRzID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdsaXN0Q29udGVudCcsIHRoaXMubm9EYXRhVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgfSBlbHNlIGlmIChmZWVkLiRyZXNvdXJjZXMpIHtcclxuICAgICAgY29uc3QgZG9jZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgbGV0IHJvdyA9IFtdO1xyXG4gICAgICBjb25zdCBjb3VudCA9IGZlZWQuJHJlc291cmNlcy5sZW5ndGg7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gZmVlZC4kcmVzb3VyY2VzW2ldO1xyXG4gICAgICAgIGVudHJ5LiRkZXNjcmlwdG9yID0gZW50cnkuJGRlc2NyaXB0b3IgfHwgZmVlZC4kZGVzY3JpcHRvcjtcclxuICAgICAgICB0aGlzLmVudHJpZXNbZW50cnkuJGtleV0gPSBlbnRyeTtcclxuXHJcbiAgICAgICAgbGV0IHJvd05vZGU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDYXJkVmlldykge1xyXG4gICAgICAgICAgcm93Tm9kZSA9ICQodGhpcy5yb3dUZW1wbGF0ZS5hcHBseShlbnRyeSwgdGhpcykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByb3dOb2RlID0gJCh0aGlzLmxpUm93VGVtcGxhdGUuYXBwbHkoZW50cnksIHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzQ2FyZFZpZXcgJiYgdGhpcy5tdWx0aUNvbHVtblZpZXcpIHtcclxuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9ICQoYDxkaXYgY2xhc3M9XCIke3RoaXMubXVsdGlDb2x1bW5DbGFzc30gY29sdW1uc1wiPmApLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgICAgIHJvdy5wdXNoKGNvbHVtbik7XHJcbiAgICAgICAgICBpZiAoKGkgKyAxKSAlIHRoaXMubXVsdGlDb2x1bW5Db3VudCA9PT0gMCB8fCBpID09PSBjb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm93VGVtcGxhdGUgPSAkKCc8ZGl2IGNsYXNzPVwicm93XCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgcm93VGVtcGxhdGUuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jZnJhZy5hcHBlbmRDaGlsZChyb3dUZW1wbGF0ZS5nZXQoMCkpO1xyXG4gICAgICAgICAgICByb3cgPSBbXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZG9jZnJhZy5hcHBlbmRDaGlsZChyb3dOb2RlLmdldCgwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9uQXBwbHlSb3dUZW1wbGF0ZShlbnRyeSwgcm93Tm9kZSk7XHJcbiAgICAgICAgaWYgKHRoaXMucmVsYXRlZFZpZXdzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRoaXMub25Qcm9jZXNzUmVsYXRlZFZpZXdzKGVudHJ5LCByb3dOb2RlLCBmZWVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkb2NmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQodGhpcy5jb250ZW50Tm9kZSkuYXBwZW5kKGRvY2ZyYWcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9kbzogYWRkIG1vcmUgcm9idXN0IGhhbmRsaW5nIHdoZW4gJHRvdGFsUmVzdWx0cyBkb2VzIG5vdCBleGlzdCwgaS5lLiwgaGlkZSBlbGVtZW50IGNvbXBsZXRlbHlcclxuICAgIGlmICh0eXBlb2YgdGhpcy5mZWVkLiR0b3RhbFJlc3VsdHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMuZmVlZC4kdG90YWxSZXN1bHRzIC0gKHRoaXMuZmVlZC4kc3RhcnRJbmRleCArIHRoaXMuZmVlZC4kaXRlbXNQZXJQYWdlIC0gMSk7XHJcbiAgICAgIHRoaXMuc2V0KCdyZW1haW5pbmdDb250ZW50Jywgc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5yZW1haW5pbmdUZXh0LCBbcmVtYWluaW5nXSkpO1xyXG4gICAgfVxyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS50b2dnbGVDbGFzcygnbGlzdC1oYXMtbW9yZScsIHRoaXMuaGFzTW9yZURhdGEoKSk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd0VtcHR5U2VsZWN0aW9uKSB7XHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygnbGlzdC1oYXMtZW1wdHktb3B0Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fbG9hZFByZXZpb3VzU2VsZWN0aW9ucygpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBTRGF0YVJlc291cmNlQ29sbGVjdGlvblJlcXVlc3QgaW5zdGFuY2UgYW5kIHNldHMgYSBudW1iZXIgb2Yga25vd24gcHJvcGVydGllcy5cclxuICAgKlxyXG4gICAqIExpc3Qgb2YgcHJvcGVydGllcyB1c2VkIGZyb20gYHRoaXMucHJvcGVydHkvdGhpcy5vcHRpb25zLnByb3BlcnR5YDpcclxuICAgKlxyXG4gICAqIGBwYWdlU2l6ZWAsIGBjb250cmFjdE5hbWVgLCBgcmVzb3VyY2VLaW5kYCwgYHJlc291cmNlUHJvcGVydHlgLCBgcmVzb3VyY2VQcmVkaWNhdGVgLCBgcXVlcnlTZWxlY3Qvc2VsZWN0YCxcclxuICAgKiBgcXVlcnlPcmRlckJ5L29yZGVyQnlgLCBgcXVlcnlJbmNsdWRlYCwgYHF1ZXJ5V2hlcmUvd2hlcmVgLCBgcXVlcnlgXHJcbiAgICpcclxuICAgKiBUaGUgd2hlcmUgcGFydHMgYXJlIGpvaW5lZCB2aWEgYEFORGAuXHJcbiAgICpcclxuICAgKiBUaGUgU3RhcnQgSW5kZXggaXMgc2V0IGJ5IGNoZWNraW5nIHRoZSBzYXZlZCBgdGhpcy5lbnRyaWVzYCBhbmQgaWYgaXRzIGAkc3RhcnRJbmRleGAgYW5kIGAkaXRlbXNQZXJQYWdlYCBncmVhdGVyXHJcbiAgICogdGhhbiAwIC0tIHRoZW4gaXQgYWRkcyB0aGVtIHRvZ2V0aGVyIHRvIGdldCB0aGUgaW5zdGVhZC4gSWYgbm8gZmVlZCBvciBub3QgZ3JlYXRlciB0aGFuIDAgdGhlbiBzZXQgdGhlIGluZGV4XHJcbiAgICogdG8gMS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvIE9wdGlvbmFsIHJlcXVlc3Qgb3B0aW9ucy5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCBpbnN0YW5jZS5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIGNyZWF0ZVJlcXVlc3Q6IGZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3QoLyogbyovKSB7XHJcbiAgICBjb25zdCB3aGVyZSA9IFtdO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuICAgIGNvbnN0IHBhZ2VTaXplID0gdGhpcy5wYWdlU2l6ZTtcclxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLmZlZWQgJiYgdGhpcy5mZWVkLiRzdGFydEluZGV4ID4gMCAmJiB0aGlzLmZlZWQuJGl0ZW1zUGVyUGFnZSA+IDAgPyB0aGlzLmZlZWQuJHN0YXJ0SW5kZXggKyB0aGlzLmZlZWQuJGl0ZW1zUGVyUGFnZSA6IDE7XHJcblxyXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVJlc291cmNlQ29sbGVjdGlvblJlcXVlc3QodGhpcy5nZXRTZXJ2aWNlKCkpXHJcbiAgICAgIC5zZXRDb3VudChwYWdlU2l6ZSlcclxuICAgICAgLnNldFN0YXJ0SW5kZXgoc3RhcnRJbmRleCk7XHJcblxyXG4gICAgY29uc3QgY29udHJhY3ROYW1lID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKChvcHRpb25zICYmIG9wdGlvbnMuY29udHJhY3ROYW1lKSB8fCB0aGlzLmNvbnRyYWN0TmFtZSk7XHJcbiAgICBpZiAoY29udHJhY3ROYW1lKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0Q29udHJhY3ROYW1lKGNvbnRyYWN0TmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzb3VyY2VLaW5kRXhwciA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbigob3B0aW9ucyAmJiBvcHRpb25zLnJlc291cmNlS2luZCkgfHwgdGhpcy5yZXNvdXJjZUtpbmQpO1xyXG4gICAgaWYgKHJlc291cmNlS2luZEV4cHIpIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZUtpbmQocmVzb3VyY2VLaW5kRXhwcik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0eUV4cHIgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXNvdXJjZVByb3BlcnR5KSB8fCB0aGlzLnJlc291cmNlUHJvcGVydHkpO1xyXG4gICAgaWYgKHJlc291cmNlUHJvcGVydHlFeHByKSB7XHJcbiAgICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0VXJpKClcclxuICAgICAgICAuc2V0UGF0aFNlZ21lbnQoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUmVzb3VyY2VQcm9wZXJ0eUluZGV4LCByZXNvdXJjZVByb3BlcnR5RXhwcik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzb3VyY2VQcmVkaWNhdGVFeHByID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKChvcHRpb25zICYmIG9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGUpIHx8IHRoaXMucmVzb3VyY2VQcmVkaWNhdGUpO1xyXG4gICAgaWYgKHJlc291cmNlUHJlZGljYXRlRXhwcikge1xyXG4gICAgICByZXF1ZXN0XHJcbiAgICAgICAgLmdldFVyaSgpXHJcbiAgICAgICAgLnNldENvbGxlY3Rpb25QcmVkaWNhdGUocmVzb3VyY2VQcmVkaWNhdGVFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdWVyeVNlbGVjdEV4cHIgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oKG9wdGlvbnMgJiYgb3B0aW9ucy5zZWxlY3QpIHx8IHRoaXMucXVlcnlTZWxlY3QpO1xyXG4gICAgaWYgKHF1ZXJ5U2VsZWN0RXhwcikge1xyXG4gICAgICByZXF1ZXN0LnNldFF1ZXJ5QXJnKFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhVXJpLlF1ZXJ5QXJnTmFtZXMuU2VsZWN0LCBxdWVyeVNlbGVjdEV4cHIuam9pbignLCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdWVyeUluY2x1ZGVFeHByID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMucXVlcnlJbmNsdWRlKTtcclxuICAgIGlmIChxdWVyeUluY2x1ZGVFeHByKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5JbmNsdWRlLCBxdWVyeUluY2x1ZGVFeHByLmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXVlcnlPcmRlckJ5RXhwciA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbigob3B0aW9ucyAmJiBvcHRpb25zLm9yZGVyQnkpIHx8IHRoaXMucXVlcnlPcmRlckJ5KTtcclxuICAgIGlmIChxdWVyeU9yZGVyQnlFeHByKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5PcmRlckJ5LCBxdWVyeU9yZGVyQnlFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdWVyeVdoZXJlRXhwciA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbigob3B0aW9ucyAmJiBvcHRpb25zLndoZXJlKSB8fCB0aGlzLnF1ZXJ5V2hlcmUpO1xyXG4gICAgaWYgKHF1ZXJ5V2hlcmVFeHByKSB7XHJcbiAgICAgIHdoZXJlLnB1c2gocXVlcnlXaGVyZUV4cHIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5KSB7XHJcbiAgICAgIHdoZXJlLnB1c2godGhpcy5xdWVyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdoZXJlLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLldoZXJlLCB3aGVyZS5qb2luKCcgYW5kICcpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdDtcclxuICB9LFxyXG4gIGhhc01vcmVEYXRhOiBmdW5jdGlvbiBoYXNNb3JlRGF0YSgpIHtcclxuICAgIGlmICh0aGlzLmZlZWQgJiYgdGhpcy5mZWVkLiRzdGFydEluZGV4ID4gMCAmJiB0aGlzLmZlZWQuJGl0ZW1zUGVyUGFnZSA+IDAgJiYgdGhpcy5mZWVkLiR0b3RhbFJlc3VsdHMgPj0gMCkge1xyXG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuZmVlZC4kc3RhcnRJbmRleDtcclxuICAgICAgY29uc3QgY291bnQgPSB0aGlzLmZlZWQuJGl0ZW1zUGVyUGFnZTtcclxuICAgICAgY29uc3QgdG90YWwgPSB0aGlzLmZlZWQuJHRvdGFsUmVzdWx0cztcclxuXHJcbiAgICAgIHJldHVybiAoc3RhcnQgKyBjb3VudCA8PSB0b3RhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7IC8vIG5vIHdheSB0byBkZXRlcm1pbmUsIGFsd2F5cyBhc3N1bWUgbW9yZSBkYXRhXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=