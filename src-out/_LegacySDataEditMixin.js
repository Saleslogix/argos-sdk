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
   * @classdesc Enables legacy SData operations for the Edit view.
   * @class argos._LegacySDataEditMixin
   *
   */
  var __class = (0, _declare2.default)('argos._LegacySDataEditMixin', [_SDataDetailMixin3.default], /** @lends argos._LegacySDataEditMixin# */{
    requestData: function requestData() {
      var request = this.createRequest();
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
      var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());
      var key = this.entry && this.entry.$key || this.options.key;

      if (key) {
        request.setResourceSelector('\'' + key + '\'');
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
      var entry = this.createEntryForUpdate(values);
      var request = this.createRequest();
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
      var values = this.getValues();
      return this.inserting ? this.createEntryForInsert(values) : this.createEntryForUpdate(values);
    },
    /**
     * Takes the values object and adds in $key, $etag and $name
     * @param {Object} values
     * @return {Object} Object with added properties
     */
    createEntryForUpdate: function createEntryForUpdate(v) {
      var values = this.convertValues(v);

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
      var values = this.convertValues(v);
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
      for (var n in values) {
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
      var entry = this.createEntryForInsert(values);
      var request = this.createRequest();

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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGVnYWN5U0RhdGFFZGl0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInJlcXVlc3REYXRhIiwicmVxdWVzdCIsImNyZWF0ZVJlcXVlc3QiLCJyZWFkIiwic3VjY2VzcyIsIm9uUmVxdWVzdERhdGFTdWNjZXNzIiwiZmFpbHVyZSIsIm9uUmVxdWVzdERhdGFGYWlsdXJlIiwic2NvcGUiLCJyZXNwb25zZSIsIm8iLCJhbGVydCIsInN1YnN0aXR1dGUiLCJyZXF1ZXN0RXJyb3JUZXh0IiwiYWRkRXJyb3IiLCJpc1JlZnJlc2hpbmciLCJlbnRyeSIsInByb2Nlc3NFbnRyeSIsIm9wdGlvbnMiLCJjaGFuZ2VzIiwic2V0VmFsdWVzIiwiU2FnZSIsIlNEYXRhIiwiQ2xpZW50IiwiU0RhdGFTaW5nbGVSZXNvdXJjZVJlcXVlc3QiLCJnZXRTZXJ2aWNlIiwia2V5IiwiJGtleSIsInNldFJlc291cmNlU2VsZWN0b3IiLCJjb250cmFjdE5hbWUiLCJzZXRDb250cmFjdE5hbWUiLCJyZXNvdXJjZUtpbmQiLCJzZXRSZXNvdXJjZUtpbmQiLCJxdWVyeVNlbGVjdCIsInNldFF1ZXJ5QXJnIiwiU0RhdGFVcmkiLCJRdWVyeUFyZ05hbWVzIiwiU2VsZWN0Iiwiam9pbiIsInF1ZXJ5SW5jbHVkZSIsIkluY2x1ZGUiLCJxdWVyeU9yZGVyQnkiLCJPcmRlckJ5Iiwib25VcGRhdGUiLCJ2YWx1ZXMiLCJjcmVhdGVFbnRyeUZvclVwZGF0ZSIsInVwZGF0ZSIsIm9uVXBkYXRlU3VjY2VzcyIsIm9uVXBkYXRlRmFpbHVyZSIsImVuYWJsZSIsInB1Ymxpc2giLCJkYXRhIiwib25VcGRhdGVDb21wbGV0ZWQiLCJvblJlcXVlc3RGYWlsdXJlIiwiY3JlYXRlRW50cnkiLCJnZXRWYWx1ZXMiLCJpbnNlcnRpbmciLCJjcmVhdGVFbnRyeUZvckluc2VydCIsInYiLCJjb252ZXJ0VmFsdWVzIiwibWl4aW4iLCIkZXRhZyIsIiRuYW1lIiwiZW50aXR5TmFtZSIsIm4iLCJEYXRlIiwiaXNKc29uRW5hYmxlZCIsInRvSnNvblN0cmluZ0Zyb21EYXRlIiwidG9Jc29TdHJpbmdGcm9tRGF0ZSIsImdldENvbnRleHQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJpbnNlcnQiLCJvbkluc2VydCIsImNyZWF0ZSIsIm9uSW5zZXJ0U3VjY2VzcyIsIm9uSW5zZXJ0RmFpbHVyZSIsIm9uSW5zZXJ0Q29tcGxldGVkIiwib25SZWZyZXNoVXBkYXRlIiwiY29udmVydEVudHJ5IiwiJCIsImRvbU5vZGUiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQTs7Ozs7QUFLQSxNQUFNQSxVQUFVLHVCQUFRLDZCQUFSLEVBQXVDLDRCQUF2QyxFQUE0RCwwQ0FBMEM7QUFDcEhDLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsVUFBTUMsVUFBVSxLQUFLQyxhQUFMLEVBQWhCO0FBQ0EsVUFBSUQsT0FBSixFQUFhO0FBQ1hBLGdCQUFRRSxJQUFSLENBQWE7QUFDWEMsbUJBQVMsS0FBS0Msb0JBREg7QUFFWEMsbUJBQVMsS0FBS0Msb0JBRkg7QUFHWEMsaUJBQU87QUFISSxTQUFiO0FBS0Q7QUFDRixLQVZtSDtBQVdwSDs7Ozs7QUFLQUQsMEJBQXNCLFNBQVNBLG9CQUFULENBQThCRSxRQUE5QixFQUF3Q0MsQ0FBeEMsRUFBMkM7QUFDL0RDLFlBQU0saUJBQU9DLFVBQVAsQ0FBa0IsS0FBS0MsZ0JBQXZCLEVBQXlDLENBQUNKLFFBQUQsRUFBV0MsQ0FBWCxDQUF6QyxDQUFOLEVBRCtELENBQ0M7QUFDaEUsNkJBQWFJLFFBQWIsQ0FBc0IsU0FBdEIsRUFBaUNMLFFBQWpDO0FBQ0EsV0FBS00sWUFBTCxHQUFvQixLQUFwQjtBQUNELEtBcEJtSDtBQXFCcEg7Ozs7QUFJQVYsMEJBQXNCLFNBQVNBLG9CQUFULENBQThCVyxLQUE5QixFQUFxQztBQUN6RCxXQUFLQyxZQUFMLENBQWtCRCxLQUFsQjs7QUFFQSxVQUFJLEtBQUtFLE9BQUwsQ0FBYUMs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Ozs7Ozs7Ozs7Ozs7b0JBd1JlbkYsTyIsImZpbGUiOiJfTGVnYWN5U0RhdGFFZGl0TWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IGNvbm5lY3QgZnJvbSAnZG9qby9fYmFzZS9jb25uZWN0JztcclxuXHJcbmltcG9ydCBFcnJvck1hbmFnZXIgZnJvbSAnLi9FcnJvck1hbmFnZXInO1xyXG5pbXBvcnQgY29udmVydCBmcm9tICcuL0NvbnZlcnQnO1xyXG5pbXBvcnQgX1NEYXRhRGV0YWlsTWl4aW4gZnJvbSAnLi9fU0RhdGFEZXRhaWxNaXhpbic7XHJcblxyXG4vKipcclxuICogQGNsYXNzZGVzYyBFbmFibGVzIGxlZ2FjeSBTRGF0YSBvcGVyYXRpb25zIGZvciB0aGUgRWRpdCB2aWV3LlxyXG4gKiBAY2xhc3MgYXJnb3MuX0xlZ2FjeVNEYXRhRWRpdE1peGluXHJcbiAqXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX0xlZ2FjeVNEYXRhRWRpdE1peGluJywgW19TRGF0YURldGFpbE1peGluXSwgLyoqIEBsZW5kcyBhcmdvcy5fTGVnYWN5U0RhdGFFZGl0TWl4aW4jICove1xyXG4gIHJlcXVlc3REYXRhOiBmdW5jdGlvbiByZXF1ZXN0RGF0YSgpIHtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmNyZWF0ZVJlcXVlc3QoKTtcclxuICAgIGlmIChyZXF1ZXN0KSB7XHJcbiAgICAgIHJlcXVlc3QucmVhZCh7XHJcbiAgICAgICAgc3VjY2VzczogdGhpcy5vblJlcXVlc3REYXRhU3VjY2VzcyxcclxuICAgICAgICBmYWlsdXJlOiB0aGlzLm9uUmVxdWVzdERhdGFGYWlsdXJlLFxyXG4gICAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcmVxdWVzdCBkYXRhIGZyb20gdGhlIFNEYXRhIGVuZHBvaW50LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvIFRoZSBvcHRpb25zIHRoYXQgd2VyZSBwYXNzZWQgd2hlbiBjcmVhdGluZyB0aGUgQWpheCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdERhdGFGYWlsdXJlOiBmdW5jdGlvbiBvblJlcXVlc3REYXRhRmFpbHVyZShyZXNwb25zZSwgbykge1xyXG4gICAgYWxlcnQoc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5yZXF1ZXN0RXJyb3JUZXh0LCBbcmVzcG9uc2UsIG9dKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcignZmFpbHVyZScsIHJlc3BvbnNlKTtcclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYSByZXF1ZXN0IHRvIFNEYXRhIGlzIHN1Y2Nlc3NmdWwsIGNhbGxzIHByb2Nlc3NFbnRyeVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBUaGUgU0RhdGEgcmVzcG9uc2VcclxuICAgKi9cclxuICBvblJlcXVlc3REYXRhU3VjY2VzczogZnVuY3Rpb24gb25SZXF1ZXN0RGF0YVN1Y2Nlc3MoZW50cnkpIHtcclxuICAgIHRoaXMucHJvY2Vzc0VudHJ5KGVudHJ5KTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmNoYW5nZXMpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VzID0gdGhpcy5vcHRpb25zLmNoYW5nZXM7XHJcbiAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuY2hhbmdlcyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNpbmdsZVJlc291cmNlUmVxdWVzdCBpbnN0YW5jZSBhbmQgc2V0cyBhIG51bWJlciBvZiBrbm93biBwcm9wZXJ0aWVzLlxyXG4gICAqXHJcbiAgICogTGlzdCBvZiBwcm9wZXJ0aWVzIHVzZWQgYHRoaXMucHJvcGVydHkvdGhpcy5vcHRpb25zLnByb3BlcnR5YDpcclxuICAgKlxyXG4gICAqIGBlbnRyeVsnJGtleSddL2tleWAsIGBjb250cmFjdE5hbWVgLCBgcmVzb3VyY2VLaW5kYCwgYHF1ZXJ5U2VsZWN0YCwgYHF1ZXJ5SW5jbHVkZWAsIGFuZCBgcXVlcnlPcmRlckJ5YFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNpbmdsZVJlc291cmNlUmVxdWVzdCBpbnN0YW5jZS5cclxuICAgKi9cclxuICBjcmVhdGVSZXF1ZXN0OiBmdW5jdGlvbiBjcmVhdGVSZXF1ZXN0KCkge1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNpbmdsZVJlc291cmNlUmVxdWVzdCh0aGlzLmdldFNlcnZpY2UoKSk7XHJcbiAgICBjb25zdCBrZXkgPSAodGhpcy5lbnRyeSAmJiB0aGlzLmVudHJ5LiRrZXkpIHx8IHRoaXMub3B0aW9ucy5rZXk7XHJcblxyXG4gICAgaWYgKGtleSkge1xyXG4gICAgICByZXF1ZXN0LnNldFJlc291cmNlU2VsZWN0b3IoYCcke2tleX0nYCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0Q29udHJhY3ROYW1lKHRoaXMuY29udHJhY3ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZUtpbmQodGhpcy5yZXNvdXJjZUtpbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0KSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5TZWxlY3QsIHRoaXMucXVlcnlTZWxlY3Quam9pbignLCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUluY2x1ZGUpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLkluY2x1ZGUsIHRoaXMucXVlcnlJbmNsdWRlLmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlPcmRlckJ5KSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5PcmRlckJ5LCB0aGlzLnF1ZXJ5T3JkZXJCeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlcXVlc3Q7XHJcbiAgfSxcclxuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUodmFsdWVzKSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuY3JlYXRlRW50cnlGb3JVcGRhdGUodmFsdWVzKTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmNyZWF0ZVJlcXVlc3QoKTtcclxuICAgIGlmIChyZXF1ZXN0KSB7XHJcbiAgICAgIHJlcXVlc3QudXBkYXRlKGVudHJ5LCB7XHJcbiAgICAgICAgc3VjY2VzczogdGhpcy5vblVwZGF0ZVN1Y2Nlc3MsXHJcbiAgICAgICAgZmFpbHVyZTogdGhpcy5vblVwZGF0ZUZhaWx1cmUsXHJcbiAgICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3Igd2hlbiB1cGRhdGUoKSBpcyBzdWNjZXNzZnVsbCwgcHVibGlzaGVzIHRoZSBnbG9iYWwgYC9hcHAvcmVmcmVzaGAgZXZlbnQgd2hpY2hcclxuICAgKiBmb3JjZXMgb3RoZXIgdmlld3MgbGlzdGVuaW5nIGZvciB0aGlzIHJlc291cmNlS2luZCB0byByZWZyZXNoLlxyXG4gICAqXHJcbiAgICogRmluaXNoZXMgdXAgYnkgY2FsbGluZyB7QGxpbmsgI29uVXBkYXRlQ29tcGxldGVkIG9uVXBkYXRlQ29tcGxldGVkfS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBlbnRyeVxyXG4gICAqL1xyXG4gIG9uVXBkYXRlU3VjY2VzczogZnVuY3Rpb24gb25VcGRhdGVTdWNjZXNzKGVudHJ5KSB7XHJcbiAgICB0aGlzLmVuYWJsZSgpO1xyXG5cclxuICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9yZWZyZXNoJywgW3tcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgICAga2V5OiBlbnRyeS4ka2V5LFxyXG4gICAgICBkYXRhOiBlbnRyeSxcclxuICAgIH1dKTtcclxuXHJcbiAgICB0aGlzLm9uVXBkYXRlQ29tcGxldGVkKGVudHJ5KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcmVxdWVzdCBkYXRhIGZyb20gdGhlIFNEYXRhIGVuZHBvaW50LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvIFRoZSBvcHRpb25zIHRoYXQgd2VyZSBwYXNzZWQgd2hlbiBjcmVhdGluZyB0aGUgQWpheCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIG9uVXBkYXRlRmFpbHVyZTogZnVuY3Rpb24gb25VcGRhdGVGYWlsdXJlKHJlc3BvbnNlLCBvKSB7XHJcbiAgICB0aGlzLmVuYWJsZSgpO1xyXG4gICAgdGhpcy5vblJlcXVlc3RGYWlsdXJlKHJlc3BvbnNlLCBvKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcmVxdWVzdCBkYXRhIGZyb20gdGhlIFNEYXRhIGVuZHBvaW50LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvIFRoZSBvcHRpb25zIHRoYXQgd2VyZSBwYXNzZWQgd2hlbiBjcmVhdGluZyB0aGUgQWpheCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdEZhaWx1cmU6IGZ1bmN0aW9uIG9uUmVxdWVzdEZhaWx1cmUocmVzcG9uc2UsIG8pIHtcclxuICAgIGFsZXJ0KHN0cmluZy5zdWJzdGl0dXRlKHRoaXMucmVxdWVzdEVycm9yVGV4dCwgW3Jlc3BvbnNlLCBvXSkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICBFcnJvck1hbmFnZXIuYWRkRXJyb3IoJ2ZhaWx1cmUnLCByZXNwb25zZSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHYXRoZXJzIHRoZSB2YWx1ZXMgZm9yIHRoZSBlbnRyeSB0byBzZW5kIGJhY2sgdG8gU0RhdGEgYW5kIHJldHVybnMgdGhlIGFwcHJvcHJpYXRlXHJcbiAgICogY3JlYXRlIGZvciBpbnNlcnRpbmcgb3IgdXBkYXRpbmcuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBTRGF0YSBlbnRyeS9wYXlsb2FkXHJcbiAgICovXHJcbiAgY3JlYXRlRW50cnk6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5KCkge1xyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcclxuICAgIHJldHVybiB0aGlzLmluc2VydGluZyA/IHRoaXMuY3JlYXRlRW50cnlGb3JJbnNlcnQodmFsdWVzKSA6IHRoaXMuY3JlYXRlRW50cnlGb3JVcGRhdGUodmFsdWVzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSB2YWx1ZXMgb2JqZWN0IGFuZCBhZGRzIGluICRrZXksICRldGFnIGFuZCAkbmFtZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXNcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCB3aXRoIGFkZGVkIHByb3BlcnRpZXNcclxuICAgKi9cclxuICBjcmVhdGVFbnRyeUZvclVwZGF0ZTogZnVuY3Rpb24gY3JlYXRlRW50cnlGb3JVcGRhdGUodikge1xyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5jb252ZXJ0VmFsdWVzKHYpO1xyXG5cclxuICAgIHJldHVybiBsYW5nLm1peGluKHZhbHVlcywge1xyXG4gICAgICAka2V5OiB0aGlzLmVudHJ5LiRrZXksXHJcbiAgICAgICRldGFnOiB0aGlzLmVudHJ5LiRldGFnLFxyXG4gICAgICAkbmFtZTogdGhpcy5lbnRyeS4kbmFtZSxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgdGhlIHZhbHVlcyBvYmplY3QgYW5kIGFkZHMgaW4gJG5hbWVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3Qgd2l0aCBhZGRlZCBwcm9wZXJ0aWVzXHJcbiAgICovXHJcbiAgY3JlYXRlRW50cnlGb3JJbnNlcnQ6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5Rm9ySW5zZXJ0KHYpIHtcclxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuY29udmVydFZhbHVlcyh2KTtcclxuICAgIHJldHVybiBsYW5nLm1peGluKHZhbHVlcywge1xyXG4gICAgICAkbmFtZTogdGhpcy5lbnRpdHlOYW1lLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEb2VzIHRoZSByZXZlcnNlIG9mIHtAbGluayAjY29udmVydEVudHJ5IGNvbnZlcnRFbnRyeX0gaW4gdGhhdCBpdCBsb29wcyB0aGUgcGF5bG9hZCBiZWluZ1xyXG4gICAqIHNlbnQgYmFjayB0byBTRGF0YSBhbmQgY29udmVydHMgRGF0ZSBvYmplY3RzIGludG8gU0RhdGEgZGF0ZSBzdHJpbmdzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBQYXlsb2FkXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBFbnRyeSB3aXRoIHN0cmluZyBkYXRlc1xyXG4gICAqL1xyXG4gIGNvbnZlcnRWYWx1ZXM6IGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZXModmFsdWVzKSB7XHJcbiAgICBmb3IgKGNvbnN0IG4gaW4gdmFsdWVzKSB7XHJcbiAgICAgIGlmICh2YWx1ZXNbbl0gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgdmFsdWVzW25dID0gdGhpcy5nZXRTZXJ2aWNlKCkuaXNKc29uRW5hYmxlZCgpID8gY29udmVydC50b0pzb25TdHJpbmdGcm9tRGF0ZSh2YWx1ZXNbbl0pIDogY29udmVydC50b0lzb1N0cmluZ0Zyb21EYXRlKHZhbHVlc1tuXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgZ2V0Q29udGV4dCBmdW5jdGlvbiB0byBhbHNvIGluY2x1ZGUgdGhlIGByZXNvdXJjZUtpbmRgIG9mIHRoZSB2aWV3LCBgaW5zZXJ0YFxyXG4gICAqIHN0YXRlIGFuZCBga2V5YCBvZiB0aGUgZW50cnkgKGZhbHNlIGlmIGluc2VydGluZylcclxuICAgKi9cclxuICBnZXRDb250ZXh0OiBmdW5jdGlvbiBnZXRDb250ZXh0KCkge1xyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odGhpcy5pbmhlcml0ZWQoZ2V0Q29udGV4dCwgYXJndW1lbnRzKSwge1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBpbnNlcnQ6IHRoaXMub3B0aW9ucy5pbnNlcnQsXHJcbiAgICAgIGtleTogdGhpcy5vcHRpb25zLmluc2VydCA/IGZhbHNlIDogdGhpcy5vcHRpb25zLmVudHJ5ICYmIHRoaXMub3B0aW9ucy5lbnRyeS4ka2V5LFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBvbkluc2VydDogZnVuY3Rpb24gb25JbnNlcnQodmFsdWVzKSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuY3JlYXRlRW50cnlGb3JJbnNlcnQodmFsdWVzKTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmNyZWF0ZVJlcXVlc3QoKTtcclxuXHJcbiAgICBpZiAocmVxdWVzdCkge1xyXG4gICAgICByZXF1ZXN0LmNyZWF0ZShlbnRyeSwge1xyXG4gICAgICAgIHN1Y2Nlc3M6IHRoaXMub25JbnNlcnRTdWNjZXNzLFxyXG4gICAgICAgIGZhaWx1cmU6IHRoaXMub25JbnNlcnRGYWlsdXJlLFxyXG4gICAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHdoZW4gaW5zZXJ0KCkgaXMgc3VjY2Vzc2Z1bGwsIHB1Ymxpc2hlcyB0aGUgZ2xvYmFsIGAvYXBwL3JlZnJlc2hgIGV2ZW50IHdoaWNoXHJcbiAgICogZm9yY2VzIG90aGVyIHZpZXdzIGxpc3RlbmluZyBmb3IgdGhpcyByZXNvdXJjZUtpbmQgdG8gcmVmcmVzaC5cclxuICAgKlxyXG4gICAqIEZpbmlzaGVzIHVwIGJ5IGNhbGxpbmcge0BsaW5rICNvbkluc2VydENvbXBsZXRlIG9uSW5zZXJ0Q29tcGxldGV9LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGVudHJ5XHJcbiAgICovXHJcbiAgb25JbnNlcnRTdWNjZXNzOiBmdW5jdGlvbiBvbkluc2VydFN1Y2Nlc3MoZW50cnkpIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcblxyXG4gICAgY29ubmVjdC5wdWJsaXNoKCcvYXBwL3JlZnJlc2gnLCBbe1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBrZXk6IGVudHJ5LiRrZXksXHJcbiAgICAgIGRhdGE6IGVudHJ5LFxyXG4gICAgfV0pO1xyXG5cclxuICAgIHRoaXMub25JbnNlcnRDb21wbGV0ZWQoZW50cnkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3Igd2hlbiBpbnN0ZXJ0KCkgZmFpbHMsIGVuYWJsZXMgdGhlIGZvcm0gYW5kIHBhc3NlcyB0aGUgcmVzdWx0cyB0byB0aGUgZGVmYXVsdFxyXG4gICAqIGVycm9yIGhhbmRsZXIgd2hpY2ggYWxlcnRzIHRoZSB1c2VyIG9mIGFuIGVycm9yLlxyXG4gICAqIEBwYXJhbSByZXNwb25zZVxyXG4gICAqIEBwYXJhbSBvXHJcbiAgICovXHJcbiAgb25JbnNlcnRGYWlsdXJlOiBmdW5jdGlvbiBvbkluc2VydEZhaWx1cmUocmVzcG9uc2UsIG8pIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcbiAgICB0aGlzLm9uUmVxdWVzdEZhaWx1cmUocmVzcG9uc2UsIG8pO1xyXG4gIH0sXHJcbiAgb25SZWZyZXNoVXBkYXRlOiBmdW5jdGlvbiBvblJlZnJlc2hVcGRhdGUoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmVudHJ5KSB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc0VudHJ5KHRoaXMub3B0aW9ucy5lbnRyeSk7XHJcblxyXG4gICAgICAvLyBhcHBseSBjaGFuZ2VzIGFzIG1vZGlmaWVkIGRhdGEsIHNpbmNlIHdlIHdhbnQgdGhpcyB0byBmZWVkLWJhY2sgdGhyb3VnaFxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNoYW5nZXMpIHtcclxuICAgICAgICB0aGlzLmNoYW5nZXMgPSB0aGlzLm9wdGlvbnMuY2hhbmdlcztcclxuICAgICAgICB0aGlzLnNldFZhbHVlcyh0aGlzLmNoYW5nZXMpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBpZiBrZXkgaXMgcGFzc2VkIHJlcXVlc3QgdGhhdCBrZXlzIGVudGl0eSBhbmQgcHJvY2Vzc1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmtleSkge1xyXG4gICAgICAgIHRoaXMucmVxdWVzdERhdGEoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgU0RhdGEgcmVzcG9uc2UgYnkgY29udmVydGluZyB0aGUgZGF0ZSBzdHJpbmdzIGFuZCBzdG9yaW5nIHRoZSBmaXhlZCBleHRyeSB0b1xyXG4gICAqIGB0aGlzLmVudHJ5YCBhbmQgYXBwbGllcyB0aGUgdmFsdWVzLlxyXG4gICAqIEBwYXJhbSBlbnRyeVxyXG4gICAqL1xyXG4gIHByb2Nlc3NFbnRyeTogZnVuY3Rpb24gcHJvY2Vzc0VudHJ5KGVudHJ5KSB7XHJcbiAgICB0aGlzLmVudHJ5ID0gdGhpcy5jb252ZXJ0RW50cnkoZW50cnkgfHwge30pO1xyXG4gICAgdGhpcy5zZXRWYWx1ZXModGhpcy5lbnRyeSwgdHJ1ZSk7XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=