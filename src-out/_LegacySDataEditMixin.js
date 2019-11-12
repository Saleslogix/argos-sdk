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
      return _lang2.default.mixin(this.inherited(arguments), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGVnYWN5U0RhdGFFZGl0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInJlcXVlc3REYXRhIiwicmVxdWVzdCIsImNyZWF0ZVJlcXVlc3QiLCJyZWFkIiwic3VjY2VzcyIsIm9uUmVxdWVzdERhdGFTdWNjZXNzIiwiZmFpbHVyZSIsIm9uUmVxdWVzdERhdGFGYWlsdXJlIiwic2NvcGUiLCJyZXNwb25zZSIsIm8iLCJhbGVydCIsInN1YnN0aXR1dGUiLCJyZXF1ZXN0RXJyb3JUZXh0IiwiYWRkRXJyb3IiLCJpc1JlZnJlc2hpbmciLCJlbnRyeSIsInByb2Nlc3NFbnRyeSIsIm9wdGlvbnMiLCJjaGFuZ2VzIiwic2V0VmFsdWVzIiwiU2FnZSIsIlNEYXRhIiwiQ2xpZW50IiwiU0RhdGFTaW5nbGVSZXNvdXJjZVJlcXVlc3QiLCJnZXRTZXJ2aWNlIiwia2V5IiwiJGtleSIsInNldFJlc291cmNlU2VsZWN0b3IiLCJjb250cmFjdE5hbWUiLCJzZXRDb250cmFjdE5hbWUiLCJyZXNvdXJjZUtpbmQiLCJzZXRSZXNvdXJjZUtpbmQiLCJxdWVyeVNlbGVjdCIsInNldFF1ZXJ5QXJnIiwiU0RhdGFVcmkiLCJRdWVyeUFyZ05hbWVzIiwiU2VsZWN0Iiwiam9pbiIsInF1ZXJ5SW5jbHVkZSIsIkluY2x1ZGUiLCJxdWVyeU9yZGVyQnkiLCJPcmRlckJ5Iiwib25VcGRhdGUiLCJ2YWx1ZXMiLCJjcmVhdGVFbnRyeUZvclVwZGF0ZSIsInVwZGF0ZSIsIm9uVXBkYXRlU3VjY2VzcyIsIm9uVXBkYXRlRmFpbHVyZSIsImVuYWJsZSIsInB1Ymxpc2giLCJkYXRhIiwib25VcGRhdGVDb21wbGV0ZWQiLCJvblJlcXVlc3RGYWlsdXJlIiwiY3JlYXRlRW50cnkiLCJnZXRWYWx1ZXMiLCJpbnNlcnRpbmciLCJjcmVhdGVFbnRyeUZvckluc2VydCIsInYiLCJjb252ZXJ0VmFsdWVzIiwibWl4aW4iLCIkZXRhZyIsIiRuYW1lIiwiZW50aXR5TmFtZSIsIm4iLCJEYXRlIiwiaXNKc29uRW5hYmxlZCIsInRvSnNvblN0cmluZ0Zyb21EYXRlIiwidG9Jc29TdHJpbmdGcm9tRGF0ZSIsImdldENvbnRleHQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJpbnNlcnQiLCJvbkluc2VydCIsImNyZWF0ZSIsIm9uSW5zZXJ0U3VjY2VzcyIsIm9uSW5zZXJ0RmFpbHVyZSIsIm9uSW5zZXJ0Q29tcGxldGVkIiwib25SZWZyZXNoVXBkYXRlIiwiY29udmVydEVudHJ5IiwiJCIsImRvbU5vZGUiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQTs7Ozs7QUFLQSxNQUFNQSxVQUFVLHVCQUFRLDZCQUFSLEVBQXVDLDRCQUF2QyxFQUE0RCwwQ0FBMEM7QUFDcEhDLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsVUFBTUMsVUFBVSxLQUFLQyxhQUFMLEVBQWhCO0FBQ0EsVUFBSUQsT0FBSixFQUFhO0FBQ1hBLGdCQUFRRSxJQUFSLENBQWE7QUFDWEMsbUJBQVMsS0FBS0Msb0JBREg7QUFFWEMsbUJBQVMsS0FBS0Msb0JBRkg7QUFHWEMsaUJBQU87QUFISSxTQUFiO0FBS0Q7QUFDRixLQVZtSDtBQVdwSDs7Ozs7QUFLQUQsMEJBQXNCLFNBQVNBLG9CQUFULENBQThCRSxRQUE5QixFQUF3Q0MsQ0FBeEMsRUFBMkM7QUFDL0RDLFlBQU0saUJBQU9DLFVBQVAsQ0FBa0IsS0FBS0MsZ0JBQXZCLEVBQXlDLENBQUNKLFFBQUQsRUFBV0MsQ0FBWCxDQUF6QyxDQUFOLEVBRCtELENBQ0M7QUFDaEUsNkJBQWFJLFFBQWIsQ0FBc0IsU0FBdEIsRUFBaUNMLFFBQWpDO0FBQ0EsV0FBS00sWUFBTCxHQUFvQixLQUFwQjtBQUNELEtBcEJtSDtBQXFCcEg7Ozs7QUFJQVYsMEJBQXNCLFNBQVNBLG9CQUFULENBQThCVyxLQUE5QixFQUFxQztBQUN6RCxXQUFLQyxZQUFMLENBQWtCRCxLQUFsQjs7QUFFQSxVQUFJLEtBQUtFLE9BQUwsQ0FBYUMs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QkF3UmVuRixPIiwiZmlsZSI6Il9MZWdhY3lTRGF0YUVkaXRNaXhpbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5cclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBjb252ZXJ0IGZyb20gJy4vQ29udmVydCc7XHJcbmltcG9ydCBfU0RhdGFEZXRhaWxNaXhpbiBmcm9tICcuL19TRGF0YURldGFpbE1peGluJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3NkZXNjIEVuYWJsZXMgbGVnYWN5IFNEYXRhIG9wZXJhdGlvbnMgZm9yIHRoZSBFZGl0IHZpZXcuXHJcbiAqIEBjbGFzcyBhcmdvcy5fTGVnYWN5U0RhdGFFZGl0TWl4aW5cclxuICpcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fTGVnYWN5U0RhdGFFZGl0TWl4aW4nLCBbX1NEYXRhRGV0YWlsTWl4aW5dLCAvKiogQGxlbmRzIGFyZ29zLl9MZWdhY3lTRGF0YUVkaXRNaXhpbiMgKi97XHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuY3JlYXRlUmVxdWVzdCgpO1xyXG4gICAgaWYgKHJlcXVlc3QpIHtcclxuICAgICAgcmVxdWVzdC5yZWFkKHtcclxuICAgICAgICBzdWNjZXNzOiB0aGlzLm9uUmVxdWVzdERhdGFTdWNjZXNzLFxyXG4gICAgICAgIGZhaWx1cmU6IHRoaXMub25SZXF1ZXN0RGF0YUZhaWx1cmUsXHJcbiAgICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciB3aGVuIGFuIGVycm9yIG9jY3VycyB3aGlsZSByZXF1ZXN0IGRhdGEgZnJvbSB0aGUgU0RhdGEgZW5kcG9pbnQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG8gVGhlIG9wdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCB3aGVuIGNyZWF0aW5nIHRoZSBBamF4IHJlcXVlc3QuXHJcbiAgICovXHJcbiAgb25SZXF1ZXN0RGF0YUZhaWx1cmU6IGZ1bmN0aW9uIG9uUmVxdWVzdERhdGFGYWlsdXJlKHJlc3BvbnNlLCBvKSB7XHJcbiAgICBhbGVydChzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLnJlcXVlc3RFcnJvclRleHQsIFtyZXNwb25zZSwgb10pKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKCdmYWlsdXJlJywgcmVzcG9uc2UpO1xyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhIHJlcXVlc3QgdG8gU0RhdGEgaXMgc3VjY2Vzc2Z1bCwgY2FsbHMgcHJvY2Vzc0VudHJ5XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IFRoZSBTRGF0YSByZXNwb25zZVxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdERhdGFTdWNjZXNzOiBmdW5jdGlvbiBvblJlcXVlc3REYXRhU3VjY2VzcyhlbnRyeSkge1xyXG4gICAgdGhpcy5wcm9jZXNzRW50cnkoZW50cnkpO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2hhbmdlcykge1xyXG4gICAgICB0aGlzLmNoYW5nZXMgPSB0aGlzLm9wdGlvbnMuY2hhbmdlcztcclxuICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5jaGFuZ2VzKTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDcmVhdGVzIFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0IGluc3RhbmNlIGFuZCBzZXRzIGEgbnVtYmVyIG9mIGtub3duIHByb3BlcnRpZXMuXHJcbiAgICpcclxuICAgKiBMaXN0IG9mIHByb3BlcnRpZXMgdXNlZCBgdGhpcy5wcm9wZXJ0eS90aGlzLm9wdGlvbnMucHJvcGVydHlgOlxyXG4gICAqXHJcbiAgICogYGVudHJ5Wycka2V5J10va2V5YCwgYGNvbnRyYWN0TmFtZWAsIGByZXNvdXJjZUtpbmRgLCBgcXVlcnlTZWxlY3RgLCBgcXVlcnlJbmNsdWRlYCwgYW5kIGBxdWVyeU9yZGVyQnlgXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0IGluc3RhbmNlLlxyXG4gICAqL1xyXG4gIGNyZWF0ZVJlcXVlc3Q6IGZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3QoKSB7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0KHRoaXMuZ2V0U2VydmljZSgpKTtcclxuICAgIGNvbnN0IGtleSA9ICh0aGlzLmVudHJ5ICYmIHRoaXMuZW50cnkuJGtleSkgfHwgdGhpcy5vcHRpb25zLmtleTtcclxuXHJcbiAgICBpZiAoa2V5KSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UmVzb3VyY2VTZWxlY3RvcihgJyR7a2V5fSdgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jb250cmFjdE5hbWUpIHtcclxuICAgICAgcmVxdWVzdC5zZXRDb250cmFjdE5hbWUodGhpcy5jb250cmFjdE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc291cmNlS2luZCkge1xyXG4gICAgICByZXF1ZXN0LnNldFJlc291cmNlS2luZCh0aGlzLnJlc291cmNlS2luZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlTZWxlY3QpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLlNlbGVjdCwgdGhpcy5xdWVyeVNlbGVjdC5qb2luKCcsJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5SW5jbHVkZSkge1xyXG4gICAgICByZXF1ZXN0LnNldFF1ZXJ5QXJnKFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhVXJpLlF1ZXJ5QXJnTmFtZXMuSW5jbHVkZSwgdGhpcy5xdWVyeUluY2x1ZGUuam9pbignLCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeU9yZGVyQnkpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLk9yZGVyQnksIHRoaXMucXVlcnlPcmRlckJ5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdDtcclxuICB9LFxyXG4gIG9uVXBkYXRlOiBmdW5jdGlvbiBvblVwZGF0ZSh2YWx1ZXMpIHtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5jcmVhdGVFbnRyeUZvclVwZGF0ZSh2YWx1ZXMpO1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuY3JlYXRlUmVxdWVzdCgpO1xyXG4gICAgaWYgKHJlcXVlc3QpIHtcclxuICAgICAgcmVxdWVzdC51cGRhdGUoZW50cnksIHtcclxuICAgICAgICBzdWNjZXNzOiB0aGlzLm9uVXBkYXRlU3VjY2VzcyxcclxuICAgICAgICBmYWlsdXJlOiB0aGlzLm9uVXBkYXRlRmFpbHVyZSxcclxuICAgICAgICBzY29wZTogdGhpcyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB3aGVuIHVwZGF0ZSgpIGlzIHN1Y2Nlc3NmdWxsLCBwdWJsaXNoZXMgdGhlIGdsb2JhbCBgL2FwcC9yZWZyZXNoYCBldmVudCB3aGljaFxyXG4gICAqIGZvcmNlcyBvdGhlciB2aWV3cyBsaXN0ZW5pbmcgZm9yIHRoaXMgcmVzb3VyY2VLaW5kIHRvIHJlZnJlc2guXHJcbiAgICpcclxuICAgKiBGaW5pc2hlcyB1cCBieSBjYWxsaW5nIHtAbGluayAjb25VcGRhdGVDb21wbGV0ZWQgb25VcGRhdGVDb21wbGV0ZWR9LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGVudHJ5XHJcbiAgICovXHJcbiAgb25VcGRhdGVTdWNjZXNzOiBmdW5jdGlvbiBvblVwZGF0ZVN1Y2Nlc3MoZW50cnkpIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcblxyXG4gICAgY29ubmVjdC5wdWJsaXNoKCcvYXBwL3JlZnJlc2gnLCBbe1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBrZXk6IGVudHJ5LiRrZXksXHJcbiAgICAgIGRhdGE6IGVudHJ5LFxyXG4gICAgfV0pO1xyXG5cclxuICAgIHRoaXMub25VcGRhdGVDb21wbGV0ZWQoZW50cnkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciB3aGVuIGFuIGVycm9yIG9jY3VycyB3aGlsZSByZXF1ZXN0IGRhdGEgZnJvbSB0aGUgU0RhdGEgZW5kcG9pbnQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG8gVGhlIG9wdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCB3aGVuIGNyZWF0aW5nIHRoZSBBamF4IHJlcXVlc3QuXHJcbiAgICovXHJcbiAgb25VcGRhdGVGYWlsdXJlOiBmdW5jdGlvbiBvblVwZGF0ZUZhaWx1cmUocmVzcG9uc2UsIG8pIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcbiAgICB0aGlzLm9uUmVxdWVzdEZhaWx1cmUocmVzcG9uc2UsIG8pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciB3aGVuIGFuIGVycm9yIG9jY3VycyB3aGlsZSByZXF1ZXN0IGRhdGEgZnJvbSB0aGUgU0RhdGEgZW5kcG9pbnQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG8gVGhlIG9wdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCB3aGVuIGNyZWF0aW5nIHRoZSBBamF4IHJlcXVlc3QuXHJcbiAgICovXHJcbiAgb25SZXF1ZXN0RmFpbHVyZTogZnVuY3Rpb24gb25SZXF1ZXN0RmFpbHVyZShyZXNwb25zZSwgbykge1xyXG4gICAgYWxlcnQoc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5yZXF1ZXN0RXJyb3JUZXh0LCBbcmVzcG9uc2UsIG9dKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcignZmFpbHVyZScsIHJlc3BvbnNlKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEdhdGhlcnMgdGhlIHZhbHVlcyBmb3IgdGhlIGVudHJ5IHRvIHNlbmQgYmFjayB0byBTRGF0YSBhbmQgcmV0dXJucyB0aGUgYXBwcm9wcmlhdGVcclxuICAgKiBjcmVhdGUgZm9yIGluc2VydGluZyBvciB1cGRhdGluZy5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFNEYXRhIGVudHJ5L3BheWxvYWRcclxuICAgKi9cclxuICBjcmVhdGVFbnRyeTogZnVuY3Rpb24gY3JlYXRlRW50cnkoKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xyXG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0aW5nID8gdGhpcy5jcmVhdGVFbnRyeUZvckluc2VydCh2YWx1ZXMpIDogdGhpcy5jcmVhdGVFbnRyeUZvclVwZGF0ZSh2YWx1ZXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgdGhlIHZhbHVlcyBvYmplY3QgYW5kIGFkZHMgaW4gJGtleSwgJGV0YWcgYW5kICRuYW1lXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlc1xyXG4gICAqIEByZXR1cm4ge09iamVjdH0gT2JqZWN0IHdpdGggYWRkZWQgcHJvcGVydGllc1xyXG4gICAqL1xyXG4gIGNyZWF0ZUVudHJ5Rm9yVXBkYXRlOiBmdW5jdGlvbiBjcmVhdGVFbnRyeUZvclVwZGF0ZSh2KSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmNvbnZlcnRWYWx1ZXModik7XHJcblxyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odmFsdWVzLCB7XHJcbiAgICAgICRrZXk6IHRoaXMuZW50cnkuJGtleSxcclxuICAgICAgJGV0YWc6IHRoaXMuZW50cnkuJGV0YWcsXHJcbiAgICAgICRuYW1lOiB0aGlzLmVudHJ5LiRuYW1lLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyB0aGUgdmFsdWVzIG9iamVjdCBhbmQgYWRkcyBpbiAkbmFtZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXNcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCB3aXRoIGFkZGVkIHByb3BlcnRpZXNcclxuICAgKi9cclxuICBjcmVhdGVFbnRyeUZvckluc2VydDogZnVuY3Rpb24gY3JlYXRlRW50cnlGb3JJbnNlcnQodikge1xyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5jb252ZXJ0VmFsdWVzKHYpO1xyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odmFsdWVzLCB7XHJcbiAgICAgICRuYW1lOiB0aGlzLmVudGl0eU5hbWUsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERvZXMgdGhlIHJldmVyc2Ugb2Yge0BsaW5rICNjb252ZXJ0RW50cnkgY29udmVydEVudHJ5fSBpbiB0aGF0IGl0IGxvb3BzIHRoZSBwYXlsb2FkIGJlaW5nXHJcbiAgICogc2VudCBiYWNrIHRvIFNEYXRhIGFuZCBjb252ZXJ0cyBEYXRlIG9iamVjdHMgaW50byBTRGF0YSBkYXRlIHN0cmluZ3NcclxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIFBheWxvYWRcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEVudHJ5IHdpdGggc3RyaW5nIGRhdGVzXHJcbiAgICovXHJcbiAgY29udmVydFZhbHVlczogZnVuY3Rpb24gY29udmVydFZhbHVlcyh2YWx1ZXMpIHtcclxuICAgIGZvciAoY29uc3QgbiBpbiB2YWx1ZXMpIHtcclxuICAgICAgaWYgKHZhbHVlc1tuXSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICB2YWx1ZXNbbl0gPSB0aGlzLmdldFNlcnZpY2UoKS5pc0pzb25FbmFibGVkKCkgPyBjb252ZXJ0LnRvSnNvblN0cmluZ0Zyb21EYXRlKHZhbHVlc1tuXSkgOiBjb252ZXJ0LnRvSXNvU3RyaW5nRnJvbURhdGUodmFsdWVzW25dKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBnZXRDb250ZXh0IGZ1bmN0aW9uIHRvIGFsc28gaW5jbHVkZSB0aGUgYHJlc291cmNlS2luZGAgb2YgdGhlIHZpZXcsIGBpbnNlcnRgXHJcbiAgICogc3RhdGUgYW5kIGBrZXlgIG9mIHRoZSBlbnRyeSAoZmFsc2UgaWYgaW5zZXJ0aW5nKVxyXG4gICAqL1xyXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XHJcbiAgICByZXR1cm4gbGFuZy5taXhpbih0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpLCB7XHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICAgIGluc2VydDogdGhpcy5vcHRpb25zLmluc2VydCxcclxuICAgICAga2V5OiB0aGlzLm9wdGlvbnMuaW5zZXJ0ID8gZmFsc2UgOiB0aGlzLm9wdGlvbnMuZW50cnkgJiYgdGhpcy5vcHRpb25zLmVudHJ5LiRrZXksXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIG9uSW5zZXJ0OiBmdW5jdGlvbiBvbkluc2VydCh2YWx1ZXMpIHtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5jcmVhdGVFbnRyeUZvckluc2VydCh2YWx1ZXMpO1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuY3JlYXRlUmVxdWVzdCgpO1xyXG5cclxuICAgIGlmIChyZXF1ZXN0KSB7XHJcbiAgICAgIHJlcXVlc3QuY3JlYXRlKGVudHJ5LCB7XHJcbiAgICAgICAgc3VjY2VzczogdGhpcy5vbkluc2VydFN1Y2Nlc3MsXHJcbiAgICAgICAgZmFpbHVyZTogdGhpcy5vbkluc2VydEZhaWx1cmUsXHJcbiAgICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3Igd2hlbiBpbnNlcnQoKSBpcyBzdWNjZXNzZnVsbCwgcHVibGlzaGVzIHRoZSBnbG9iYWwgYC9hcHAvcmVmcmVzaGAgZXZlbnQgd2hpY2hcclxuICAgKiBmb3JjZXMgb3RoZXIgdmlld3MgbGlzdGVuaW5nIGZvciB0aGlzIHJlc291cmNlS2luZCB0byByZWZyZXNoLlxyXG4gICAqXHJcbiAgICogRmluaXNoZXMgdXAgYnkgY2FsbGluZyB7QGxpbmsgI29uSW5zZXJ0Q29tcGxldGUgb25JbnNlcnRDb21wbGV0ZX0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZW50cnlcclxuICAgKi9cclxuICBvbkluc2VydFN1Y2Nlc3M6IGZ1bmN0aW9uIG9uSW5zZXJ0U3VjY2VzcyhlbnRyeSkge1xyXG4gICAgdGhpcy5lbmFibGUoKTtcclxuXHJcbiAgICBjb25uZWN0LnB1Ymxpc2goJy9hcHAvcmVmcmVzaCcsIFt7XHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICAgIGtleTogZW50cnkuJGtleSxcclxuICAgICAgZGF0YTogZW50cnksXHJcbiAgICB9XSk7XHJcblxyXG4gICAgdGhpcy5vbkluc2VydENvbXBsZXRlZChlbnRyeSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB3aGVuIGluc3RlcnQoKSBmYWlscywgZW5hYmxlcyB0aGUgZm9ybSBhbmQgcGFzc2VzIHRoZSByZXN1bHRzIHRvIHRoZSBkZWZhdWx0XHJcbiAgICogZXJyb3IgaGFuZGxlciB3aGljaCBhbGVydHMgdGhlIHVzZXIgb2YgYW4gZXJyb3IuXHJcbiAgICogQHBhcmFtIHJlc3BvbnNlXHJcbiAgICogQHBhcmFtIG9cclxuICAgKi9cclxuICBvbkluc2VydEZhaWx1cmU6IGZ1bmN0aW9uIG9uSW5zZXJ0RmFpbHVyZShyZXNwb25zZSwgbykge1xyXG4gICAgdGhpcy5lbmFibGUoKTtcclxuICAgIHRoaXMub25SZXF1ZXN0RmFpbHVyZShyZXNwb25zZSwgbyk7XHJcbiAgfSxcclxuICBvblJlZnJlc2hVcGRhdGU6IGZ1bmN0aW9uIG9uUmVmcmVzaFVwZGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW50cnkpIHtcclxuICAgICAgdGhpcy5wcm9jZXNzRW50cnkodGhpcy5vcHRpb25zLmVudHJ5KTtcclxuXHJcbiAgICAgIC8vIGFwcGx5IGNoYW5nZXMgYXMgbW9kaWZpZWQgZGF0YSwgc2luY2Ugd2Ugd2FudCB0aGlzIHRvIGZlZWQtYmFjayB0aHJvdWdoXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlcyA9IHRoaXMub3B0aW9ucy5jaGFuZ2VzO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuY2hhbmdlcyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGlmIGtleSBpcyBwYXNzZWQgcmVxdWVzdCB0aGF0IGtleXMgZW50aXR5IGFuZCBwcm9jZXNzXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMua2V5KSB7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0RGF0YSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBTRGF0YSByZXNwb25zZSBieSBjb252ZXJ0aW5nIHRoZSBkYXRlIHN0cmluZ3MgYW5kIHN0b3JpbmcgdGhlIGZpeGVkIGV4dHJ5IHRvXHJcbiAgICogYHRoaXMuZW50cnlgIGFuZCBhcHBsaWVzIHRoZSB2YWx1ZXMuXHJcbiAgICogQHBhcmFtIGVudHJ5XHJcbiAgICovXHJcbiAgcHJvY2Vzc0VudHJ5OiBmdW5jdGlvbiBwcm9jZXNzRW50cnkoZW50cnkpIHtcclxuICAgIHRoaXMuZW50cnkgPSB0aGlzLmNvbnZlcnRFbnRyeShlbnRyeSB8fCB7fSk7XHJcbiAgICB0aGlzLnNldFZhbHVlcyh0aGlzLmVudHJ5LCB0cnVlKTtcclxuXHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==