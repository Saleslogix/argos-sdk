define('argos/_LegacySDataDetailMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/string', './ErrorManager'], function (module, exports, _declare, _string, _ErrorManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _string2 = _interopRequireDefault(_string);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/_LegacySDataDetailMixin
   * @classdesc Enables legacy SData operations for the Detail view.
   *
   */
  var __class = (0, _declare2.default)('argos._LegacySDataDetailMixin', null, /** @lends module:argos/_LegacySDataDetailMixin.prototype */{
    /**
     * Initiates the SData request.
     */
    requestData: function requestData() {
      var request = this.createRequest();

      if (request) {
        request.read({
          success: this.onRequestDataSuccess,
          failure: this.onRequestDataFailure,
          aborted: this.onRequestDataAborted,
          scope: this
        });
      }
    },
    /**
     * Creates Sage.SData.Client.SDataSingleResourceRequest instance and sets a number of known properties.
     *
     * List of properties used `this.property/this.options.property`:
     *
     * `/key`, `resourceKind`, `querySelect`, `queryInclude`, `queryOrderBy`, and `contractName`
     *
     * @return {Object} Sage.SData.Client.SDataSingleResourceRequest instance.
     */
    createRequest: function createRequest() {
      var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());

      /* test for complex selector */
      /* todo: more robust test required? */
      if (/(\s+)/.test(this.options.key)) {
        request.setResourceSelector(this.options.key);
      } else {
        request.setResourceSelector('\'' + this.options.key + '\'');
      }

      if (this.resourceKind) {
        request.setResourceKind(this.resourceKind);
      }

      if (this.querySelect) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, this.querySelect.join(','));
      }

      if (this.queryInclude) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, this.queryInclude.join(','));
      }

      if (this.queryOrderBy) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, this.queryOrderBy);
      }

      if (this.contractName) {
        request.setContractName(this.contractName);
      }

      return request;
    },
    /**
     * Saves the SData response to `this.entry` and invokes {@link #processLayout processLayout} by passing the customized
     * layout definition. If no entry is provided, empty the screen.
     * @param {Object} entry SData response
     */
    processEntry: function processEntry(entry) {
      this.entry = entry;

      if (this.entry) {
        this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
        if (this.isTabbed) {
          this.createTabs(this.tabs);
          this.placeDetailHeader(this.entry);
        }
      } else {
        this.set('detailContent', '');
      }
    },
    /**
     * Handler when a request to SData is successful
     * @param {Object} entry The SData response
     */
    onRequestDataSuccess: function onRequestDataSuccess(entry) {
      this.processEntry(entry);
      $(this.domNode).removeClass('panel-loading');
      this.isRefreshing = false;
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataFailure: function onRequestDataFailure(response, o) {
      if (response && response.status === 404) {
        $(this.contentNode).append(this.notAvailableTemplate.apply(this));
      } else {
        alert(_string2.default.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
        _ErrorManager2.default.addError('failure', response);
      }

      $(this.domNode).removeClass('panel-loading');
      this.isRefreshing = false;
    },
    /**
     * Handler when an a request is aborted from an SData endpoint.
     *
     * Clears the `this.options` object which will by default force a refresh of the view.
     *
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataAborted: function onRequestDataAborted(response /* , o*/) {
      this.options = false; // force a refresh
      _ErrorManager2.default.addError('aborted', response);
      $(this.domNode).removeClass('panel-loading');
      this.isRefreshing = false;
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
   * @module argos/_LegacySDataDetailMixin
   */
  exports.default = __class;
  module.exports = exports['default'];
});