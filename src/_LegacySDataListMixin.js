/* Copyright 2017 Infor
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

import declare from 'dojo/_base/declare';
import ErrorManager from './ErrorManager';
import string from 'dojo/string';

/**
 * @class argos._LegacySDataListMixin
 * @classdesc Enables legacy SData operations for the List view.
 *
 * Adds the original SData operations to the view, use this in addition to _SDataListMixin.
 *
 */
const __class = declare('argos._LegacySDataListMixin', null, /** @lends argos._LegacySDataListMixin# */{
  feed: null,

  /**
   * Initiates the SData request.
   */
  requestData: function requestData() {
    $(this.domNode).addClass('list-loading');
    this.listLoading = true;

    const request = this.createRequest();
    request.read({
      success: this.onRequestDataSuccess,
      failure: this.onRequestDataFailure,
      aborted: this.onRequestDataAborted,
      scope: this,
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
    alert(string.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
    ErrorManager.addError('failure', response);
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
    ErrorManager.addError('aborted', response);

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
      const docfrag = document.createDocumentFragment();
      let row = [];
      const count = feed.$resources.length;
      for (let i = 0; i < count; i++) {
        const entry = feed.$resources[i];
        entry.$descriptor = entry.$descriptor || feed.$descriptor;
        this.entries[entry.$key] = entry;

        let rowNode;
        if (this.isCardView) {
          rowNode = $(this.rowTemplate.apply(entry, this));
        } else {
          rowNode = $(this.liRowTemplate.apply(entry, this));
        }

        if (this.isCardView && this.multiColumnView) {
          const column = $(`<div class="${this.multiColumnClass} columns">`).append(rowNode);
          row.push(column);
          if ((i + 1) % this.multiColumnCount === 0 || i === count - 1) {
            const rowTemplate = $('<div class="row"></div>');
            row.forEach((element) => {
              rowTemplate.append(element);
            });
            docfrag.appendChild(rowTemplate.get(0));
            row = [];
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
      const remaining = this.feed.$totalResults - (this.feed.$startIndex + this.feed.$itemsPerPage - 1);
      this.set('remainingContent', string.substitute(this.remainingText, [remaining]));
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
  createRequest: function createRequest(/* o*/) {
    const where = [];
    const options = this.options;
    const pageSize = this.pageSize;
    const startIndex = this.feed && this.feed.$startIndex > 0 && this.feed.$itemsPerPage > 0 ? this.feed.$startIndex + this.feed.$itemsPerPage : 1;

    const request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())
      .setCount(pageSize)
      .setStartIndex(startIndex);

    const contractName = this.expandExpression((options && options.contractName) || this.contractName);
    if (contractName) {
      request.setContractName(contractName);
    }

    const resourceKindExpr = this.expandExpression((options && options.resourceKind) || this.resourceKind);
    if (resourceKindExpr) {
      request.setResourceKind(resourceKindExpr);
    }

    const resourcePropertyExpr = this.expandExpression((options && options.resourceProperty) || this.resourceProperty);
    if (resourcePropertyExpr) {
      request
        .getUri()
        .setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, resourcePropertyExpr);
    }

    const resourcePredicateExpr = this.expandExpression((options && options.resourcePredicate) || this.resourcePredicate);
    if (resourcePredicateExpr) {
      request
        .getUri()
        .setCollectionPredicate(resourcePredicateExpr);
    }

    const querySelectExpr = this.expandExpression((options && options.select) || this.querySelect);
    if (querySelectExpr) {
      request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, querySelectExpr.join(','));
    }

    const queryIncludeExpr = this.expandExpression(this.queryInclude);
    if (queryIncludeExpr) {
      request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, queryIncludeExpr.join(','));
    }

    const queryOrderByExpr = this.expandExpression((options && options.orderBy) || this.queryOrderBy);
    if (queryOrderByExpr) {
      request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, queryOrderByExpr);
    }

    const queryWhereExpr = this.expandExpression((options && options.where) || this.queryWhere);
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
      const start = this.feed.$startIndex;
      const count = this.feed.$itemsPerPage;
      const total = this.feed.$totalResults;

      return (start + count <= total);
    }

    return true; // no way to determine, always assume more data
  },
});

export default __class;
