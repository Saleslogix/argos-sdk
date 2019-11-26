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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGVnYWN5U0RhdGFMaXN0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImZlZWQiLCJyZXF1ZXN0RGF0YSIsIiQiLCJkb21Ob2RlIiwiYWRkQ2xhc3MiLCJsaXN0TG9hZGluZyIsInJlcXVlc3QiLCJjcmVhdGVSZXF1ZXN0IiwicmVhZCIsInN1Y2Nlc3MiLCJvblJlcXVlc3REYXRhU3VjY2VzcyIsImZhaWx1cmUiLCJvblJlcXVlc3REYXRhRmFpbHVyZSIsImFib3J0ZWQiLCJvblJlcXVlc3REYXRhQWJvcnRlZCIsInNjb3BlIiwicHJvY2Vzc0ZlZWQiLCJyZW1vdmVDbGFzcyIsIl9vblNjcm9sbEhhbmRsZSIsImNvbnRpbnVvdXNTY3JvbGxpbmciLCJjb25uZWN0Iiwib25TY3JvbGwiLCJpc1JlZnJlc2hpbmciLCJyZXNwb25zZSIsIm8iLCJhbGVydCIsInN1YnN0aXR1dGUiLCJyZXF1ZXN0RXJyb3JUZXh0IiwiYWRkRXJyb3IiLCJvcHRpb25zIiwiY2xlYXIiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJlbnRyaWVzIiwic2V0IiwiJHRvdGFsUmVzdWx0cyIsIm5vRGF0YVRlbXBsYXRlIiwiYXBwbHkiLCIkcmVzb3VyY2VzIiwiZG9jZnJhZyIsImRvY3VtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInJvdyIsImNvdW50IiwibGVuZ3RoIiwiaSIsImVudHJ5IiwiJGRlc2NyaXB0b3IiLCIka2V5Iiwicm93Tm9kZSIsImlzQ2FyZFZpZXciLCJyb3dUZW1wbGF0ZSIsImxpUm93VGVtcGxhdGUiLCJtdWx0aUNvbHVtblZpZXciLCJjb2x1bW4iLCJtdWx0aUNvbHVtbkNsYXNzIiwiYXBwZW5kIiwicHVzaCIsIm11bHRpQ29sdW1uQ291bnQiLCJmb3JFYWNoIiwiZWxlbWVudCIsImFwcGVuZENoaWxkIiwiZ2V0Iiwib25BcHBseVJvd1RlbXBsYXRlIiwicmVsYXRlZFZpZXdzIiwib25Qcm9jZXNzUmVsYXRlZFZpZXdzIiwiY2hpbGROb2RlcyIsImNvbnRlbnROb2RlIiwicmVtYWluaW5nIiwiJHN0YXJ0SW5kZXgiLCIkaXRlbXNQZXJQYWdlIiwicmVtYWluaW5nVGV4dCIsInRvZ2dsZUNsYXNzIiwiaGFzTW9yZURhdGEiLCJhbGxvd0VtcHR5U2VsZWN0aW9uIiwiX2xvYWRQcmV2aW91c1NlbGVjdGlvbnMiLCJ3aGVyZSIsInBhZ2VTaXplIiwic3RhcnRJbmRleCIsIlNhZ2UiLCJTRGF0YSIsIkNsaWVudCIsIlNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCIsImdldFNlcnZpY2UiLCJzZXRDb3VudCIsInNldFN0YXJ0SW5kZXgiLCJjb250cmFjdE5hbWUiLCJleHBhbmRFeHByZXNzaW9uIiwic2V0Q29udHJhY3ROYW1lIiwicmVzb3VyY2VLaW5kRXhwciIsInJlc291cmNlS2luZCIsInNldFJlc291cmNlS2luZCIsInJlc291cmNlUHJvcGVydHlFeHByIiwicmVzb3VyY2VQcm9wZXJ0eSIsImdldFVyaSIsInNldFBhdGhTZWdtZW50IiwiU0RhdGFVcmkiLCJSZXNvdXJjZVByb3BlcnR5SW5kZXgiLCJyZXNvdXJjZVByZWRpY2F0ZUV4cHIiLCJyZXNvdXJjZVByZWRpY2F0ZSIsInNldENvbGxlY3Rpb25QcmVkaWNhdGUiLCJxdWVyeVNlbGVjdEV4cHIiLCJzZWxlY3QiLCJxdWVyeVNlbGVjdCIsInNldFF1ZXJ5QXJnIiwiUXVlcnlBcmdOYW1lcyIsIlNlbGVjdCIsImpvaW4iLCJxdWVyeUluY2x1ZGVFeHByIiwicXVlcnlJbmNsdWRlIiwiSW5jbHVkZSIsInF1ZXJ5T3JkZXJCeUV4cHIiLCJvcmRlckJ5IiwicXVlcnlPcmRlckJ5IiwiT3JkZXJCeSIsInF1ZXJ5V2hlcmVFeHByIiwicXVlcnlXaGVyZSIsInF1ZXJ5IiwiV2hlcmUiLCJzdGFydCIsInRvdGFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7OztBQU9BLE1BQU1BLFVBQVUsdUJBQVEsNkJBQVIsRUFBdUMsSUFBdkMsRUFBNkMsMENB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QUNBLFVBQUlELGNBQUosRUFBb0I7QUFDbEJ2QyxjQUFNbkIsSUFBTixDQUFXMEQsY0FBWDtBQUNEOztBQUVELFVBQUksS0FBS0UsS0FBVCxFQUFnQjtBQUNkekMsY0FBTW5CLElBQU4sQ0FBVyxLQUFLNEQsS0FBaEI7QUFDRDs7QUFFRCxVQUFJekMsTUFBTWhDLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQnRDLGdCQUFRa0csV0FBUixDQUFvQnpCLEtBQUtDLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQmUsUUFBbEIsQ0FBMkJTLGFBQTNCLENBQXlDYSxLQUE3RCxFQUFvRTFDLE1BQU0rQixJQUFOLENBQVcsT0FBWCxDQUFwRTtBQUNEOztBQUVELGFBQU9yRyxPQUFQO0FBQ0QsS0FoT29HO0FBaU9yR21FLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsVUFBSSxLQUFLekUsSUFBTCxJQUFhLEtBQUtBLElBQUwsQ0FBVXFFLFdBQVYsR0FBd0IsQ0FBckMsSUFBMEMsS0FBS3JFLElBQUwsQ0FBVXNFLGFBQVYsR0FBMEIsQ0FBcEUsSUFBeUUsS0FBS3RFLElBQUwsQ0FBVW1DLGFBQVYsSUFBMkIsQ0FBeEcsRUFBMkc7QUFDekcsWUFBTW9GLFFBQVEsS0FBS3ZILElBQUwsQ0FBVXFFLFdBQXhCO0FBQ0EsWUFBTTFCLFFBQVEsS0FBSzNDLElBQUwsQ0FBVXNFLGFBQXhCO0FBQ0EsWUFBTWtELFFBQVEsS0FBS3hILElBQUwsQ0FBVW1DLGFBQXhCOztBQUVBLGVBQVFvRixRQUFRNUUsS0FBUixJQUFpQjZFLEtBQXpCO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQLENBVGtDLENBU3JCO0FBQ2Q7QUEzT29HLEdBQXZGLENBQWhCLEMsQ0ExQkE7Ozs7Ozs7Ozs7Ozs7OztvQkF3UWV6SCxPIiwiZmlsZSI6Il9MZWdhY3lTRGF0YUxpc3RNaXhpbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBFcnJvck1hbmFnZXIgZnJvbSAnLi9FcnJvck1hbmFnZXInO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX0xlZ2FjeVNEYXRhTGlzdE1peGluXHJcbiAqIEBjbGFzc2Rlc2MgRW5hYmxlcyBsZWdhY3kgU0RhdGEgb3BlcmF0aW9ucyBmb3IgdGhlIExpc3Qgdmlldy5cclxuICpcclxuICogQWRkcyB0aGUgb3JpZ2luYWwgU0RhdGEgb3BlcmF0aW9ucyB0byB0aGUgdmlldywgdXNlIHRoaXMgaW4gYWRkaXRpb24gdG8gX1NEYXRhTGlzdE1peGluLlxyXG4gKlxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLl9MZWdhY3lTRGF0YUxpc3RNaXhpbicsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuX0xlZ2FjeVNEYXRhTGlzdE1peGluIyAqL3tcclxuICBmZWVkOiBudWxsLFxyXG5cclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdsaXN0LWxvYWRpbmcnKTtcclxuICAgIHRoaXMubGlzdExvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmNyZWF0ZVJlcXVlc3QoKTtcclxuICAgIHJlcXVlc3QucmVhZCh7XHJcbiAgICAgIHN1Y2Nlc3M6IHRoaXMub25SZXF1ZXN0RGF0YVN1Y2Nlc3MsXHJcbiAgICAgIGZhaWx1cmU6IHRoaXMub25SZXF1ZXN0RGF0YUZhaWx1cmUsXHJcbiAgICAgIGFib3J0ZWQ6IHRoaXMub25SZXF1ZXN0RGF0YUFib3J0ZWQsXHJcbiAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYSByZXF1ZXN0IHRvIFNEYXRhIGlzIHN1Y2Nlc3NmdWxcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZmVlZCBUaGUgU0RhdGEgcmVzcG9uc2VcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdERhdGFTdWNjZXNzOiBmdW5jdGlvbiBvblJlcXVlc3REYXRhU3VjY2VzcyhmZWVkKSB7XHJcbiAgICB0aGlzLnByb2Nlc3NGZWVkKGZlZWQpO1xyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgICB0aGlzLmxpc3RMb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKCF0aGlzLl9vblNjcm9sbEhhbmRsZSAmJiB0aGlzLmNvbnRpbnVvdXNTY3JvbGxpbmcpIHtcclxuICAgICAgdGhpcy5fb25TY3JvbGxIYW5kbGUgPSB0aGlzLmNvbm5lY3QodGhpcy5kb21Ob2RlLCAnb25zY3JvbGwnLCB0aGlzLm9uU2Nyb2xsKTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYW4gZXJyb3Igb2NjdXJzIHdoaWxlIHJlcXVlc3QgZGF0YSBmcm9tIHRoZSBTRGF0YSBlbmRwb2ludC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gbyBUaGUgb3B0aW9ucyB0aGF0IHdlcmUgcGFzc2VkIHdoZW4gY3JlYXRpbmcgdGhlIEFqYXggcmVxdWVzdC5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdERhdGFGYWlsdXJlOiBmdW5jdGlvbiBvblJlcXVlc3REYXRhRmFpbHVyZShyZXNwb25zZSwgbykge1xyXG4gICAgYWxlcnQoc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5yZXF1ZXN0RXJyb3JUZXh0LCBbcmVzcG9uc2UsIG9dKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcignZmFpbHVyZScsIHJlc3BvbnNlKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgICB0aGlzLmxpc3RMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciB3aGVuIGFuIGEgcmVxdWVzdCBpcyBhYm9ydGVkIGZyb20gYW4gU0RhdGEgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBDbGVhcnMgdGhlIGB0aGlzLm9wdGlvbnNgIG9iamVjdCB3aGljaCB3aWxsIGJ5IGRlZmF1bHQgZm9yY2UgYSByZWZyZXNoIG9mIHRoZSB2aWV3LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG8gVGhlIG9wdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCB3aGVuIGNyZWF0aW5nIHRoZSBBamF4IHJlcXVlc3QuXHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKi9cclxuICBvblJlcXVlc3REYXRhQWJvcnRlZDogZnVuY3Rpb24gb25SZXF1ZXN0RGF0YUFib3J0ZWQocmVzcG9uc2UpIHtcclxuICAgIHRoaXMub3B0aW9ucyA9IGZhbHNlOyAvLyBmb3JjZSBhIHJlZnJlc2hcclxuICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcignYWJvcnRlZCcsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ2xpc3QtbG9hZGluZycpO1xyXG4gICAgdGhpcy5saXN0TG9hZGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGNsZWFyLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5mZWVkID0gbnVsbDtcclxuICAgIHRoaXMuZW50cmllcyA9IHt9O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUHJvY2Vzc2VzIHRoZSBmZWVkIHJlc3VsdCBmcm9tIHRoZSBTRGF0YSByZXF1ZXN0IGFuZCByZW5kZXJzIG91dCB0aGUgcmVzb3VyY2UgZmVlZCBlbnRyaWVzLlxyXG4gICAqXHJcbiAgICogU2F2ZXMgdGhlIGZlZWQgdG8gYHRoaXMuZmVlZGAgYW5kIHNhdmVzIGVhY2ggZW50cnkgdG8gdGhlIGB0aGlzLmVudHJpZXNgIGNvbGxlY3Rpb24gdXNpbmcgdGhlIGVudHJpZXMgYCRrZXlgXHJcbiAgICogYXMgdGhlIGtleS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmZWVkIFRoZSBTRGF0YSByZXN1bHRcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIHByb2Nlc3NGZWVkOiBmdW5jdGlvbiBwcm9jZXNzRmVlZChmZWVkKSB7XHJcbiAgICBpZiAoIXRoaXMuZmVlZCkge1xyXG4gICAgICB0aGlzLnNldCgnbGlzdENvbnRlbnQnLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mZWVkID0gZmVlZDtcclxuXHJcbiAgICBpZiAodGhpcy5mZWVkLiR0b3RhbFJlc3VsdHMgPT09IDApIHtcclxuICAgICAgdGhpcy5zZXQoJ2xpc3RDb250ZW50JywgdGhpcy5ub0RhdGFUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICB9IGVsc2UgaWYgKGZlZWQuJHJlc291cmNlcykge1xyXG4gICAgICBjb25zdCBkb2NmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgIGNvbnN0IGNvdW50ID0gZmVlZC4kcmVzb3VyY2VzLmxlbmd0aDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZW50cnkgPSBmZWVkLiRyZXNvdXJjZXNbaV07XHJcbiAgICAgICAgZW50cnkuJGRlc2NyaXB0b3IgPSBlbnRyeS4kZGVzY3JpcHRvciB8fCBmZWVkLiRkZXNjcmlwdG9yO1xyXG4gICAgICAgIHRoaXMuZW50cmllc1tlbnRyeS4ka2V5XSA9IGVudHJ5O1xyXG5cclxuICAgICAgICBsZXQgcm93Tm9kZTtcclxuICAgICAgICBpZiAodGhpcy5pc0NhcmRWaWV3KSB7XHJcbiAgICAgICAgICByb3dOb2RlID0gJCh0aGlzLnJvd1RlbXBsYXRlLmFwcGx5KGVudHJ5LCB0aGlzKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJvd05vZGUgPSAkKHRoaXMubGlSb3dUZW1wbGF0ZS5hcHBseShlbnRyeSwgdGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNDYXJkVmlldyAmJiB0aGlzLm11bHRpQ29sdW1uVmlldykge1xyXG4gICAgICAgICAgY29uc3QgY29sdW1uID0gJChgPGRpdiBjbGFzcz1cIiR7dGhpcy5tdWx0aUNvbHVtbkNsYXNzfSBjb2x1bW5zXCI+YCkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICAgICAgcm93LnB1c2goY29sdW1uKTtcclxuICAgICAgICAgIGlmICgoaSArIDEpICUgdGhpcy5tdWx0aUNvbHVtbkNvdW50ID09PSAwIHx8IGkgPT09IGNvdW50IC0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByb3dUZW1wbGF0ZSA9ICQoJzxkaXYgY2xhc3M9XCJyb3dcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICByb3dUZW1wbGF0ZS5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2NmcmFnLmFwcGVuZENoaWxkKHJvd1RlbXBsYXRlLmdldCgwKSk7XHJcbiAgICAgICAgICAgIHJvdyA9IFtdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkb2NmcmFnLmFwcGVuZENoaWxkKHJvd05vZGUuZ2V0KDApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub25BcHBseVJvd1RlbXBsYXRlKGVudHJ5LCByb3dOb2RlKTtcclxuICAgICAgICBpZiAodGhpcy5yZWxhdGVkVmlld3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5vblByb2Nlc3NSZWxhdGVkVmlld3MoZW50cnksIHJvd05vZGUsIGZlZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRvY2ZyYWcuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJCh0aGlzLmNvbnRlbnROb2RlKS5hcHBlbmQoZG9jZnJhZyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB0b2RvOiBhZGQgbW9yZSByb2J1c3QgaGFuZGxpbmcgd2hlbiAkdG90YWxSZXN1bHRzIGRvZXMgbm90IGV4aXN0LCBpLmUuLCBoaWRlIGVsZW1lbnQgY29tcGxldGVseVxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmZlZWQuJHRvdGFsUmVzdWx0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgY29uc3QgcmVtYWluaW5nID0gdGhpcy5mZWVkLiR0b3RhbFJlc3VsdHMgLSAodGhpcy5mZWVkLiRzdGFydEluZGV4ICsgdGhpcy5mZWVkLiRpdGVtc1BlclBhZ2UgLSAxKTtcclxuICAgICAgdGhpcy5zZXQoJ3JlbWFpbmluZ0NvbnRlbnQnLCBzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLnJlbWFpbmluZ1RleHQsIFtyZW1haW5pbmddKSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnRvZ2dsZUNsYXNzKCdsaXN0LWhhcy1tb3JlJywgdGhpcy5oYXNNb3JlRGF0YSgpKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmFsbG93RW1wdHlTZWxlY3Rpb24pIHtcclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdsaXN0LWhhcy1lbXB0eS1vcHQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9sb2FkUHJldmlvdXNTZWxlY3Rpb25zKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDcmVhdGVzIFNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCBpbnN0YW5jZSBhbmQgc2V0cyBhIG51bWJlciBvZiBrbm93biBwcm9wZXJ0aWVzLlxyXG4gICAqXHJcbiAgICogTGlzdCBvZiBwcm9wZXJ0aWVzIHVzZWQgZnJvbSBgdGhpcy5wcm9wZXJ0eS90aGlzLm9wdGlvbnMucHJvcGVydHlgOlxyXG4gICAqXHJcbiAgICogYHBhZ2VTaXplYCwgYGNvbnRyYWN0TmFtZWAsIGByZXNvdXJjZUtpbmRgLCBgcmVzb3VyY2VQcm9wZXJ0eWAsIGByZXNvdXJjZVByZWRpY2F0ZWAsIGBxdWVyeVNlbGVjdC9zZWxlY3RgLFxyXG4gICAqIGBxdWVyeU9yZGVyQnkvb3JkZXJCeWAsIGBxdWVyeUluY2x1ZGVgLCBgcXVlcnlXaGVyZS93aGVyZWAsIGBxdWVyeWBcclxuICAgKlxyXG4gICAqIFRoZSB3aGVyZSBwYXJ0cyBhcmUgam9pbmVkIHZpYSBgQU5EYC5cclxuICAgKlxyXG4gICAqIFRoZSBTdGFydCBJbmRleCBpcyBzZXQgYnkgY2hlY2tpbmcgdGhlIHNhdmVkIGB0aGlzLmVudHJpZXNgIGFuZCBpZiBpdHMgYCRzdGFydEluZGV4YCBhbmQgYCRpdGVtc1BlclBhZ2VgIGdyZWF0ZXJcclxuICAgKiB0aGFuIDAgLS0gdGhlbiBpdCBhZGRzIHRoZW0gdG9nZXRoZXIgdG8gZ2V0IHRoZSBpbnN0ZWFkLiBJZiBubyBmZWVkIG9yIG5vdCBncmVhdGVyIHRoYW4gMCB0aGVuIHNldCB0aGUgaW5kZXhcclxuICAgKiB0byAxLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IG8gT3B0aW9uYWwgcmVxdWVzdCBvcHRpb25zLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFSZXNvdXJjZUNvbGxlY3Rpb25SZXF1ZXN0IGluc3RhbmNlLlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgY3JlYXRlUmVxdWVzdDogZnVuY3Rpb24gY3JlYXRlUmVxdWVzdCgvKiBvKi8pIHtcclxuICAgIGNvbnN0IHdoZXJlID0gW107XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgcGFnZVNpemUgPSB0aGlzLnBhZ2VTaXplO1xyXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMuZmVlZCAmJiB0aGlzLmZlZWQuJHN0YXJ0SW5kZXggPiAwICYmIHRoaXMuZmVlZC4kaXRlbXNQZXJQYWdlID4gMCA/IHRoaXMuZmVlZC4kc3RhcnRJbmRleCArIHRoaXMuZmVlZC4kaXRlbXNQZXJQYWdlIDogMTtcclxuXHJcbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhUmVzb3VyY2VDb2xsZWN0aW9uUmVxdWVzdCh0aGlzLmdldFNlcnZpY2UoKSlcclxuICAgICAgLnNldENvdW50KHBhZ2VTaXplKVxyXG4gICAgICAuc2V0U3RhcnRJbmRleChzdGFydEluZGV4KTtcclxuXHJcbiAgICBjb25zdCBjb250cmFjdE5hbWUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oKG9wdGlvbnMgJiYgb3B0aW9ucy5jb250cmFjdE5hbWUpIHx8IHRoaXMuY29udHJhY3ROYW1lKTtcclxuICAgIGlmIChjb250cmFjdE5hbWUpIHtcclxuICAgICAgcmVxdWVzdC5zZXRDb250cmFjdE5hbWUoY29udHJhY3ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNvdXJjZUtpbmRFeHByID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKChvcHRpb25zICYmIG9wdGlvbnMucmVzb3VyY2VLaW5kKSB8fCB0aGlzLnJlc291cmNlS2luZCk7XHJcbiAgICBpZiAocmVzb3VyY2VLaW5kRXhwcikge1xyXG4gICAgICByZXF1ZXN0LnNldFJlc291cmNlS2luZChyZXNvdXJjZUtpbmRFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNvdXJjZVByb3BlcnR5RXhwciA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbigob3B0aW9ucyAmJiBvcHRpb25zLnJlc291cmNlUHJvcGVydHkpIHx8IHRoaXMucmVzb3VyY2VQcm9wZXJ0eSk7XHJcbiAgICBpZiAocmVzb3VyY2VQcm9wZXJ0eUV4cHIpIHtcclxuICAgICAgcmVxdWVzdFxyXG4gICAgICAgIC5nZXRVcmkoKVxyXG4gICAgICAgIC5zZXRQYXRoU2VnbWVudChTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5SZXNvdXJjZVByb3BlcnR5SW5kZXgsIHJlc291cmNlUHJvcGVydHlFeHByKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNvdXJjZVByZWRpY2F0ZUV4cHIgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZSkgfHwgdGhpcy5yZXNvdXJjZVByZWRpY2F0ZSk7XHJcbiAgICBpZiAocmVzb3VyY2VQcmVkaWNhdGVFeHByKSB7XHJcbiAgICAgIHJlcXVlc3RcclxuICAgICAgICAuZ2V0VXJpKClcclxuICAgICAgICAuc2V0Q29sbGVjdGlvblByZWRpY2F0ZShyZXNvdXJjZVByZWRpY2F0ZUV4cHIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5U2VsZWN0RXhwciA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbigob3B0aW9ucyAmJiBvcHRpb25zLnNlbGVjdCkgfHwgdGhpcy5xdWVyeVNlbGVjdCk7XHJcbiAgICBpZiAocXVlcnlTZWxlY3RFeHByKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5TZWxlY3QsIHF1ZXJ5U2VsZWN0RXhwci5qb2luKCcsJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5SW5jbHVkZUV4cHIgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24odGhpcy5xdWVyeUluY2x1ZGUpO1xyXG4gICAgaWYgKHF1ZXJ5SW5jbHVkZUV4cHIpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLkluY2x1ZGUsIHF1ZXJ5SW5jbHVkZUV4cHIuam9pbignLCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdWVyeU9yZGVyQnlFeHByID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKChvcHRpb25zICYmIG9wdGlvbnMub3JkZXJCeSkgfHwgdGhpcy5xdWVyeU9yZGVyQnkpO1xyXG4gICAgaWYgKHF1ZXJ5T3JkZXJCeUV4cHIpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLk9yZGVyQnksIHF1ZXJ5T3JkZXJCeUV4cHIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5V2hlcmVFeHByID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKChvcHRpb25zICYmIG9wdGlvbnMud2hlcmUpIHx8IHRoaXMucXVlcnlXaGVyZSk7XHJcbiAgICBpZiAocXVlcnlXaGVyZUV4cHIpIHtcclxuICAgICAgd2hlcmUucHVzaChxdWVyeVdoZXJlRXhwcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnkpIHtcclxuICAgICAgd2hlcmUucHVzaCh0aGlzLnF1ZXJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2hlcmUubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXF1ZXN0LnNldFF1ZXJ5QXJnKFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhVXJpLlF1ZXJ5QXJnTmFtZXMuV2hlcmUsIHdoZXJlLmpvaW4oJyBhbmQgJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXF1ZXN0O1xyXG4gIH0sXHJcbiAgaGFzTW9yZURhdGE6IGZ1bmN0aW9uIGhhc01vcmVEYXRhKCkge1xyXG4gICAgaWYgKHRoaXMuZmVlZCAmJiB0aGlzLmZlZWQuJHN0YXJ0SW5kZXggPiAwICYmIHRoaXMuZmVlZC4kaXRlbXNQZXJQYWdlID4gMCAmJiB0aGlzLmZlZWQuJHRvdGFsUmVzdWx0cyA+PSAwKSB7XHJcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5mZWVkLiRzdGFydEluZGV4O1xyXG4gICAgICBjb25zdCBjb3VudCA9IHRoaXMuZmVlZC4kaXRlbXNQZXJQYWdlO1xyXG4gICAgICBjb25zdCB0b3RhbCA9IHRoaXMuZmVlZC4kdG90YWxSZXN1bHRzO1xyXG5cclxuICAgICAgcmV0dXJuIChzdGFydCArIGNvdW50IDw9IHRvdGFsKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTsgLy8gbm8gd2F5IHRvIGRldGVybWluZSwgYWx3YXlzIGFzc3VtZSBtb3JlIGRhdGFcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==