define('argos/_LegacySDataEditMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'dojo/_base/connect', './ErrorManager', './Convert', './_SDataDetailMixin'], function (module, exports, _declare, _lang, _string, _connect, _ErrorManager, _Convert, _SDataDetailMixin2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _connect2 = _interopRequireDefault(_connect);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _Convert2 = _interopRequireDefault(_Convert);

  var _SDataDetailMixin3 = _interopRequireDefault(_SDataDetailMixin2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/_LegacySDataEditMixin
   * @classdesc Enables legacy SData operations for the Edit view.
   *
   */
  const __class = (0, _declare2.default)('argos._LegacySDataEditMixin', [_SDataDetailMixin3.default], /** @lends module:argos/_LegacySDataEditMixin.prototype */{
    requestData: function requestData() {
      const request = this.createRequest();
      if (request) {
        request.read({
          success: this.onRequestDataSuccess,
          failure: this.onRequestDataFailure,
          scope: this
        });
      }
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataFailure: function onRequestDataFailure(response, o) {
      alert(_string2.default.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
      _ErrorManager2.default.addError('failure', response);
      this.isRefreshing = false;
    },
    /**
     * Handler when a request to SData is successful, calls processEntry
     * @param {Object} entry The SData response
     */
    onRequestDataSuccess: function onRequestDataSuccess(entry) {
      this.processEntry(entry);

      if (this.options.changes) {
        this.changes = this.options.changes;
        this.setValues(this.changes);
      }
      this.isRefreshing = false;
    },
    /**
     * Creates Sage.SData.Client.SDataSingleResourceRequest instance and sets a number of known properties.
     *
     * List of properties used `this.property/this.options.property`:
     *
     * `entry['$key']/key`, `contractName`, `resourceKind`, `querySelect`, `queryInclude`, and `queryOrderBy`
     *
     * @return {Object} Sage.SData.Client.SDataSingleResourceRequest instance.
     */
    createRequest: function createRequest() {
      const request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());
      const key = this.entry && this.entry.$key || this.options.key;

      if (key) {
        request.setResourceSelector(`'${key}'`);
      }

      if (this.contractName) {
        request.setContractName(this.contractName);
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

      return request;
    },
    onUpdate: function onUpdate(values) {
      const entry = this.createEntryForUpdate(values);
      const request = this.createRequest();
      if (request) {
        request.update(entry, {
          success: this.onUpdateSuccess,
          failure: this.onUpdateFailure,
          scope: this
        });
      }
    },
    /**
     * Handler for when update() is successfull, publishes the global `/app/refresh` event which
     * forces other views listening for this resourceKind to refresh.
     *
     * Finishes up by calling {@link #onUpdateCompleted onUpdateCompleted}.
     *
     * @param entry
     */
    onUpdateSuccess: function onUpdateSuccess(entry) {
      this.enable();

      _connect2.default.publish('/app/refresh', [{
        resourceKind: this.resourceKind,
        key: entry.$key,
        data: entry
      }]);

      this.onUpdateCompleted(entry);
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onUpdateFailure: function onUpdateFailure(response, o) {
      this.enable();
      this.onRequestFailure(response, o);
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestFailure: function onRequestFailure(response, o) {
      alert(_string2.default.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
      _ErrorManager2.default.addError('failure', response);
    },
    /**
     * Gathers the values for the entry to send back to SData and returns the appropriate
     * create for inserting or updating.
     * @return {Object} SData entry/payload
     */
    createEntry: function createEntry() {
      const values = this.getValues();
      return this.inserting ? this.createEntryForInsert(values) : this.createEntryForUpdate(values);
    },
    /**
     * Takes the values object and adds in $key, $etag and $name
     * @param {Object} values
     * @return {Object} Object with added properties
     */
    createEntryForUpdate: function createEntryForUpdate(v) {
      const values = this.convertValues(v);

      return _lang2.default.mixin(values, {
        $key: this.entry.$key,
        $etag: this.entry.$etag,
        $name: this.entry.$name
      });
    },
    /**
     * Takes the values object and adds in $name
     * @param {Object} values
     * @return {Object} Object with added properties
     */
    createEntryForInsert: function createEntryForInsert(v) {
      const values = this.convertValues(v);
      return _lang2.default.mixin(values, {
        $name: this.entityName
      });
    },
    /**
     * Does the reverse of {@link #convertEntry convertEntry} in that it loops the payload being
     * sent back to SData and converts Date objects into SData date strings
     * @param {Object} values Payload
     * @return {Object} Entry with string dates
     */
    convertValues: function convertValues(values) {
      for (const n in values) {
        if (values[n] instanceof Date) {
          values[n] = this.getService().isJsonEnabled() ? _Convert2.default.toJsonStringFromDate(values[n]) : _Convert2.default.toIsoStringFromDate(values[n]);
        }
      }

      return values;
    },
    /**
     * Extends the getContext function to also include the `resourceKind` of the view, `insert`
     * state and `key` of the entry (false if inserting)
     */
    getContext: function getContext() {
      return _lang2.default.mixin(this.inherited(getContext, arguments), {
        resourceKind: this.resourceKind,
        insert: this.options.insert,
        key: this.options.insert ? false : this.options.entry && this.options.entry.$key
      });
    },
    onInsert: function onInsert(values) {
      const entry = this.createEntryForInsert(values);
      const request = this.createRequest();

      if (request) {
        request.create(entry, {
          success: this.onInsertSuccess,
          failure: this.onInsertFailure,
          scope: this
        });
      }
    },
    /**
     * Handler for when insert() is successfull, publishes the global `/app/refresh` event which
     * forces other views listening for this resourceKind to refresh.
     *
     * Finishes up by calling {@link #onInsertComplete onInsertComplete}.
     *
     * @param entry
     */
    onInsertSuccess: function onInsertSuccess(entry) {
      this.enable();

      _connect2.default.publish('/app/refresh', [{
        resourceKind: this.resourceKind,
        key: entry.$key,
        data: entry
      }]);

      this.onInsertCompleted(entry);
    },
    /**
     * Handler for when instert() fails, enables the form and passes the results to the default
     * error handler which alerts the user of an error.
     * @param response
     * @param o
     */
    onInsertFailure: function onInsertFailure(response, o) {
      this.enable();
      this.onRequestFailure(response, o);
    },
    onRefreshUpdate: function onRefreshUpdate() {
      if (this.options.entry) {
        this.processEntry(this.options.entry);

        // apply changes as modified data, since we want this to feed-back through
        if (this.options.changes) {
          this.changes = this.options.changes;
          this.setValues(this.changes);
        }
      } else {
        // if key is passed request that keys entity and process
        if (this.options.key) {
          this.requestData();
        }
      }
    },
    /**
     * Handles the SData response by converting the date strings and storing the fixed extry to
     * `this.entry` and applies the values.
     * @param entry
     */
    processEntry: function processEntry(entry) {
      this.entry = this.convertEntry(entry || {});
      this.setValues(this.entry, true);

      $(this.domNode).removeClass('panel-loading');
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
   * @module argos/_LegacySDataEditMixin
   */
  exports.default = __class;
  module.exports = exports['default'];
});