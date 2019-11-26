define('argos/_SDataEditMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './Convert', './_SDataDetailMixin', './Models/Types'], function (module, exports, _declare, _lang, _Convert, _SDataDetailMixin2, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _Convert2 = _interopRequireDefault(_Convert);

  var _SDataDetailMixin3 = _interopRequireDefault(_SDataDetailMixin2);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var __class = (0, _declare2.default)('argos._SDataEditMixin', [_SDataDetailMixin3.default], /** @lends argos._SDataEditMixin# */{
    /**
     * @property {Object}
     * The saved SData response.
     */
    entry: null,

    /**
     * @property {Object}
     * The saved template SData response.
     */
    templateEntry: null,
    diffPropertyIgnores: ['$etag', '$updated'],

    _buildRefreshMessage: function _buildRefreshMessage() {
      var message = this.inherited(_buildRefreshMessage, arguments);

      return _lang2.default.mixin(message, {
        resourceKind: this.resourceKind
      });
    },
    onRefresh: function onRefresh() {
      this.entry = false;
    },
    onRefreshInsert: function onRefreshInsert() {
      if (this.options.template) {
        this.processTemplateEntry(this.options.template);
      } else {
        this.requestTemplate();
      }
    },
    createEntryForUpdate: function createEntryForUpdate(v) {
      var values = v;
      values = this.inherited(createEntryForUpdate, arguments);
      values = _lang2.default.mixin(values, {
        $key: this.entry.$key,
        $etag: this.entry.$etag,
        $name: this.entry.$name
      });

      if (!this._isConcurrencyCheckEnabled()) {
        delete values.$etag;
      }

      return values;
    },
    createEntryForInsert: function createEntryForInsert(v) {
      var values = v;
      values = this.inherited(createEntryForInsert, arguments);
      return _lang2.default.mixin(values, {
        $name: this.entityName
      });
    },
    /**
     * ApplyContext is called during {@link #processTemplateEntry processTemplateEntry} and is
     * intended as a hook for when you are inserting a new entry (not editing) and wish to apply
     * values from context, ie, from a view in the history.
     *
     * The cycle of a template values is (first to last, last being the one that overwrites all)
     *
     * 1\. Set the values of the template SData response
     * 2\. Set any field defaults (the fields `default` property)
     * 3\. ApplyContext is called
     * 4\. If `this.options.entry` is defined, apply those values
     *
     * @param templateEntry
     */
    applyContext: function applyContext() /* templateEntry*/{},
    /**
     * Creates Sage.SData.Client.SDataTemplateResourceRequest instance and sets a number of known properties.
     *
     * List of properties used `this.property/this.options.property`:
     *
     * `resourceKind`, `querySelect`, `queryInclude`
     *
     * @return {Object} Sage.SData.Client.SDataTemplateResourceRequest instance.
     */
    createTemplateRequest: function createTemplateRequest() {
      var request = new Sage.SData.Client.SDataTemplateResourceRequest(this.getService());

      if (this.resourceKind) {
        request.setResourceKind(this.resourceKind);
      }

      if (this.querySelect) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, this.querySelect.join(','));
      }

      if (this.queryInclude) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, this.queryInclude.join(','));
      }

      if (this.contractName) {
        request.setContractName(this.contractName);
      }

      return request;
    },
    /**
     * Initiates the SData request for the template (default values).
     */
    requestTemplate: function requestTemplate() {
      var request = this.createTemplateRequest();
      if (request) {
        request.read({
          success: this.onRequestTemplateSuccess,
          failure: this.onRequestTemplateFailure,
          scope: this
        });
      }
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestTemplateFailure: function onRequestTemplateFailure(response /* , o*/) {
      this.handleError(response);
    },
    /**
     * Handler when a request to SData is successful, calls processTemplateEntry
     * @param {Object} entry The SData response
     */
    onRequestTemplateSuccess: function onRequestTemplateSuccess(entry) {
      this.processTemplateEntry(entry);
    },
    /**
     * Processes the returned SData template entry by saving it to `this.templateEntry` and applies
     * the default values to fields by:
     *
     * The cycle of a template values is (first to last, last being the one that overwrites all)
     *
     * 1\. Set the values of the template SData response
     * 2\. Set any field defaults (the fields `default` property)
     * 3\. ApplyContext is called
     * 4\. If `this.options.entry` is defined, apply those values
     *
     * @param {Object} templateEntry SData template entry
     */
    processTemplateEntry: function processTemplateEntry(templateEntry) {
      this.templateEntry = this.convertEntry(templateEntry || {});
      this.resetInteractionState();
      this.setValues(this.templateEntry, true);
      this.applyFieldDefaults();
      this.applyContext(this.templateEntry);

      // if an entry has been passed through options, apply it here, now that the template has been applied.
      // in this case, since we are doing an insert (only time template is used), the entry is applied as modified data.
      if (this.options.entry) {
        this.entry = this.convertEntry(this.options.entry);
        this.setValues(this.entry);
      }

      $(this.domNode).removeClass('panel-loading');
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
     * Loops a given entry testing for SData date strings and converts them to javascript Date objects
     * @param {Object} entry SData entry
     * @return {Object} Entry with actual Date objects
     */
    convertEntry: function convertEntry(entry) {
      for (var n in entry) {
        if (_Convert2.default.isDateString(entry[n])) {
          entry[n] = _Convert2.default.toDateFromString(entry[n]);
        }
      }

      return entry;
    },
    resetInteractionState: function resetInteractionState() {
      var _this = this;

      if (this._previousFieldState === null) {
        this._previousFieldState = {};
        return;
      }

      // Restore the previous state of each field before the security was applied
      Object.keys(this._previousFieldState).forEach(function (k) {
        var field = _this.fields[k];
        var previousState = _this._previousFieldState[k];

        if (previousState.disabled) {
          field.disable();
        } else {
          field.enable();
        }

        if (previousState.hidden) {
          field.hide();
        } else {
          field.show();
        }
      });

      this._previousFieldState = {};
    },
    _previousFieldState: null,
    processFieldLevelSecurity: function processFieldLevelSecurity(entry) {
      var _this2 = this;

      this.resetInteractionState();
      var permissions = entry.$permissions;

      // permissions is an array of objects:
      // { name: "FieldName", access: "ReadOnly" }
      if (permissions && permissions.length) {
        permissions.forEach(function (p) {
          var name = p.name,
              access = p.access;

          var field = _this2.fields[name];
          if (!field) {
            return;
          }

          // Capture the current state before we apply the changes
          _this2._previousFieldState[name] = {
            disabled: field.isDisabled(),
            hidden: field.isHidden()
          };

          if (access === 'NoAccess') {
            field.disable();
            field.hide();
          } else if (access === 'ReadOnly') {
            field.disable();
          }
        });
      }
    },
    _applyStateToPutOptions: function _applyStateToPutOptions(putOptions) {
      var store = this.get('store');

      if (this._isConcurrencyCheckEnabled()) {
        // The SData store will take the version and apply it to the etag
        putOptions.version = store.getVersion(this.entry);
      }

      putOptions.entity = store.getEntity(this.entry) || this.entityName;
    },
    _applyStateToAddOptions: function _applyStateToAddOptions(addOptions) {
      addOptions.entity = this.entityName;
    },
    _isConcurrencyCheckEnabled: function _isConcurrencyCheckEnabled() {
      return App && App.enableConcurrencyCheck;
    },
    initModel: function initModel() {
      var model = this.getModel();
      if (model) {
        this._model = model;
        this._model.init();
        if (this._model.ModelType === _Types2.default.SDATA) {
          this._applyViewToModel(this._model);
        }
      }
    },
    _applyViewToModel: function _applyViewToModel(model) {
      if (!model) {
        return;
      }

      var queryModel = model._getQueryModelByName('detail');
      if (this.resourceKind) {
        model.resourceKind = this.resourceKind;
      }

      if (!queryModel) {
        return;
      }

      // Attempt to mixin the view's querySelect, queryInclude, queryWhere,
      // queryArgs, queryOrderBy, resourceProperty, resourcePredicate properties
      // into the layout. The past method of extending a querySelect for example,
      // was to modify the protoype of the view's querySelect array.
      if (this.querySelect && this.querySelect.length) {
        /* eslint-disable */
        console.warn('A view\'s querySelect is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        if (!queryModel.querySelect) {
          queryModel.querySelect = [];
        }

        queryModel.querySelect = queryModel.querySelect.concat(this.querySelect.filter(function (item) {
          return queryModel.querySelect.indexOf(item) < 0;
        }));
      }

      if (this.queryInclude && this.queryInclude.length) {
        /* eslint-disable */
        console.warn('A view\'s queryInclude is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        if (!queryModel.queryInclude) {
          queryModel.queryInclude = [];
        }

        queryModel.queryInclude = queryModel.queryInclude.concat(this.queryInclude.filter(function (item) {
          return queryModel.queryInclude.indexOf(item) < 0;
        }));
      }

      if (this.queryWhere) {
        /* eslint-disable */
        console.warn('A view\'s queryWhere is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.queryWhere = this.queryWhere;
      }

      if (this.queryArgs) {
        /* eslint-disable */
        console.warn('A view\'s queryArgs is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.queryArgs = _lang2.default.mixin({}, queryModel.queryArgs, this.queryArgs);
      }

      if (this.queryOrderBy && this.queryOrderBy.length) {
        /* eslint-disable */
        console.warn('A view\'s queryOrderBy is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        if (Array.isArray(this.queryOrderBy)) {
          if (!queryModel.queryOrderBy) {
            queryModel.queryOrderBy = [];
          }

          queryModel.queryOrderBy = queryModel.queryOrderBy.concat(this.queryOrderBy.filter(function (item) {
            return queryModel.queryOrderBy.indexOf(item) < 0;
          }));
        } else {
          queryModel.queryOrderBy = this.queryOrderBy;
        }
      }

      if (this.resourceProperty) {
        /* eslint-disable */
        console.warn('A view\'s resourceProperty is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.resourceProperty = this.resourceProperty;
      }

      if (this.resourcePredicate) {
        /* eslint-disable */
        console.warn('A view\'s resourcePredicate is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.resourcePredicate = this.resourcePredicate;
      }
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

  /**
   * @class argos._SDataEditMixin
   * @classdesc Enables SData for the Edit view.
   * Extends the SDataDetail Mixin by providing functions for $template requests.
   * @extends argos._SDataDetailMixin
   * @requires argos.SData
   */
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fU0RhdGFFZGl0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImVudHJ5IiwidGVtcGxhdGVFbnRyeSIsImRpZmZQcm9wZXJ0eUlnbm9yZXMiLCJfYnVpbGRSZWZyZXNoTWVzc2FnZSIsIm1lc3NhZ2UiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJtaXhpbiIsInJlc291cmNlS2luZCIsIm9uUmVmcmVzaCIsIm9uUmVmcmVzaEluc2VydCIsIm9wdGlvbnMiLCJ0ZW1wbGF0ZSIsInByb2Nlc3NUZW1wbGF0ZUVudHJ5IiwicmVxdWVzdFRlbXBsYXRlIiwiY3JlYXRlRW50cnlGb3JVcGRhdGUiLCJ2IiwidmFsdWVzIiwiJGtleSIsIiRldGFnIiwiJG5hbWUiLCJfaXNDb25jdXJyZW5jeUNoZWNrRW5hYmxlZCIsImNyZWF0ZUVudHJ5Rm9ySW5zZXJ0IiwiZW50aXR5TmFtZSIsImFwcGx5Q29udGV4dCIsImNyZWF0ZVRlbXBsYXRlUmVxdWVzdCIsInJlcXVlc3QiLCJTYWdlIiwiU0RhdGEiLCJDbGllbnQiLCJTRGF0YVRlbXBsYXRlUmVzb3VyY2VSZXF1ZXN0IiwiZ2V0U2VydmljZSIsInNldFJlc291cmNlS2luZCIsInF1ZXJ5U2VsZWN0Iiwic2V0UXVlcnlBcmciLCJTRGF0YVVyaSIsIlF1ZXJ5QXJnTmFtZXMiLCJTZWxlY3QiLCJqb2luIiwicXVlcnlJbmNsdWRlIiwiSW5jbHVkZSIsImNvbnRyYWN0TmFtZSIsInNldENvbnRyYWN0TmFtZSIsInJlYWQiLCJzdWNjZXNzIiwib25SZXF1ZXN0VGVtcGxhdGVTdWNjZXNzIiwiZmFpbHVyZSIsIm9uUmVxdWVzdFRlbXBsYXRlRmFpbHVyZSIsInNjb3BlIiwicmVzcG9uc2UiLCJoYW5kbGVFcnJvciIsImNvbnZlcnRFbnRyeSIsInJlc2V0SW50ZXJhY3Rpb25TdGF0ZSIsInNldFZhbHVlcyIsImFwcGx5RmllbGREZWZhdWx0cyIsIiQiLCJkb21Ob2RlIiwicmVtb3ZlQ2xhc3MiLCJjb252ZXJ0VmFsdWVzIiwibiIsIkRhdGUiLCJpc0pzb25FbmFibGVkIiwidG9Kc29uU3RyaW5nRnJvbURhdGUiLCJ0b0lzb1N0cmluZ0Zyb21EYXRlIiwiaXNEYXRlU3RyaW5nIiwidG9EYXRlRnJvbVN0cmluZyIsIl9wcmV2aW91c0ZpZWxkU3RhdGUiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJmaWVsZCIsImZpZWxkcyIsInByZXZpb3VzU3RhdGUiLCJkaXNhYmxlZCIsImRpc2FibGUiLCJlbmFibGUiLCJoaWRkZW4iLCJoaWRlIiwic2hvdyIsInByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHkiLCJwZXJtaXNzaW9ucyIsIiRwZXJtaXNzaW9ucyIsImxlbmd0aCIsInAiLCJuYW1lIiwiYWNjZXNzIiwiaXNEaXNhYmxlZCIsImlzSGlkZGVuIiwiX2FwcGx5U3RhdGVUb1B1dE9wdGlvbnMiLCJwdXRPcHRpb25zIiwic3RvcmUiLCJnZXQiLCJ2ZXJzaW9uIiwiZ2V0VmVyc2lvbiIsImVudGl0eSIsImdldEVudGl0eSIsIl9hcHBseVN0YXRlVG9BZGRPcHRpb25zIiwiYWRkT3B0aW9ucyIsIkFwcCIsImVuYWJsZUNvbmN1cnJlbmN5Q2hlY2siLCJpbml0TW9kZWwiLCJtb2RlbCIsImdldE1vZGVsIiwiX21vZGVsIiwiaW5pdCIsIk1vZGVsVHlwZSIsIlNEQVRBIiwiX2FwcGx5Vmlld1RvTW9kZWwiLCJxdWVyeU1vZGVsIiwiX2dldFF1ZXJ5TW9kZWxCeU5hbWUiLCJjb25zb2xlIiwid2FybiIsImNvbmNhdCIsImZpbHRlciIsIml0ZW0iLCJpbmRleE9mIiwicXVlcnlXaGVyZSIsInF1ZXJ5QXJncyIsInF1ZXJ5T3JkZXJCeSIsIkFycmF5IiwiaXNBcnJheSIsInJlc291cmNlUHJvcGVydHkiLCJyZXNvdXJjZVByZWRpY2F0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBLE1BQU1BLFVBQVUsdUJBQVEsdUJBQVIsRUFBaUMsNEJBQWpDLEVBQXNELG9DQUFvQztBQUN4Rzs7OztB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b3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fU0RhdGFFZGl0TWl4aW5cclxuICogQGNsYXNzZGVzYyBFbmFibGVzIFNEYXRhIGZvciB0aGUgRWRpdCB2aWV3LlxyXG4gKiBFeHRlbmRzIHRoZSBTRGF0YURldGFpbCBNaXhpbiBieSBwcm92aWRpbmcgZnVuY3Rpb25zIGZvciAkdGVtcGxhdGUgcmVxdWVzdHMuXHJcbiAqIEBleHRlbmRzIGFyZ29zLl9TRGF0YURldGFpbE1peGluXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5TRGF0YVxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuXHJcbmltcG9ydCBjb252ZXJ0IGZyb20gJy4vQ29udmVydCc7XHJcbmltcG9ydCBfU0RhdGFEZXRhaWxNaXhpbiBmcm9tICcuL19TRGF0YURldGFpbE1peGluJztcclxuaW1wb3J0IE1PREVMX1RZUEVTIGZyb20gJy4vTW9kZWxzL1R5cGVzJztcclxuXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fU0RhdGFFZGl0TWl4aW4nLCBbX1NEYXRhRGV0YWlsTWl4aW5dLCAvKiogQGxlbmRzIGFyZ29zLl9TRGF0YUVkaXRNaXhpbiMgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHNhdmVkIFNEYXRhIHJlc3BvbnNlLlxyXG4gICAqL1xyXG4gIGVudHJ5OiBudWxsLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgc2F2ZWQgdGVtcGxhdGUgU0RhdGEgcmVzcG9uc2UuXHJcbiAgICovXHJcbiAgdGVtcGxhdGVFbnRyeTogbnVsbCxcclxuICBkaWZmUHJvcGVydHlJZ25vcmVzOiBbXHJcbiAgICAnJGV0YWcnLFxyXG4gICAgJyR1cGRhdGVkJyxcclxuICBdLFxyXG5cclxuICBfYnVpbGRSZWZyZXNoTWVzc2FnZTogZnVuY3Rpb24gX2J1aWxkUmVmcmVzaE1lc3NhZ2UoKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5pbmhlcml0ZWQoX2J1aWxkUmVmcmVzaE1lc3NhZ2UsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4obWVzc2FnZSwge1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBvblJlZnJlc2g6IGZ1bmN0aW9uIG9uUmVmcmVzaCgpIHtcclxuICAgIHRoaXMuZW50cnkgPSBmYWxzZTtcclxuICB9LFxyXG4gIG9uUmVmcmVzaEluc2VydDogZnVuY3Rpb24gb25SZWZyZXNoSW5zZXJ0KCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSkge1xyXG4gICAgICB0aGlzLnByb2Nlc3NUZW1wbGF0ZUVudHJ5KHRoaXMub3B0aW9ucy50ZW1wbGF0ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJlcXVlc3RUZW1wbGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3JlYXRlRW50cnlGb3JVcGRhdGU6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5Rm9yVXBkYXRlKHYpIHtcclxuICAgIGxldCB2YWx1ZXMgPSB2O1xyXG4gICAgdmFsdWVzID0gdGhpcy5pbmhlcml0ZWQoY3JlYXRlRW50cnlGb3JVcGRhdGUsIGFyZ3VtZW50cyk7XHJcbiAgICB2YWx1ZXMgPSBsYW5nLm1peGluKHZhbHVlcywge1xyXG4gICAgICAka2V5OiB0aGlzLmVudHJ5LiRrZXksXHJcbiAgICAgICRldGFnOiB0aGlzLmVudHJ5LiRldGFnLFxyXG4gICAgICAkbmFtZTogdGhpcy5lbnRyeS4kbmFtZSxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdGhpcy5faXNDb25jdXJyZW5jeUNoZWNrRW5hYmxlZCgpKSB7XHJcbiAgICAgIGRlbGV0ZSB2YWx1ZXMuJGV0YWc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9LFxyXG4gIGNyZWF0ZUVudHJ5Rm9ySW5zZXJ0OiBmdW5jdGlvbiBjcmVhdGVFbnRyeUZvckluc2VydCh2KSB7XHJcbiAgICBsZXQgdmFsdWVzID0gdjtcclxuICAgIHZhbHVlcyA9IHRoaXMuaW5oZXJpdGVkKGNyZWF0ZUVudHJ5Rm9ySW5zZXJ0LCBhcmd1bWVudHMpO1xyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odmFsdWVzLCB7XHJcbiAgICAgICRuYW1lOiB0aGlzLmVudGl0eU5hbWUsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEFwcGx5Q29udGV4dCBpcyBjYWxsZWQgZHVyaW5nIHtAbGluayAjcHJvY2Vzc1RlbXBsYXRlRW50cnkgcHJvY2Vzc1RlbXBsYXRlRW50cnl9IGFuZCBpc1xyXG4gICAqIGludGVuZGVkIGFzIGEgaG9vayBmb3Igd2hlbiB5b3UgYXJlIGluc2VydGluZyBhIG5ldyBlbnRyeSAobm90IGVkaXRpbmcpIGFuZCB3aXNoIHRvIGFwcGx5XHJcbiAgICogdmFsdWVzIGZyb20gY29udGV4dCwgaWUsIGZyb20gYSB2aWV3IGluIHRoZSBoaXN0b3J5LlxyXG4gICAqXHJcbiAgICogVGhlIGN5Y2xlIG9mIGEgdGVtcGxhdGUgdmFsdWVzIGlzIChmaXJzdCB0byBsYXN0LCBsYXN0IGJlaW5nIHRoZSBvbmUgdGhhdCBvdmVyd3JpdGVzIGFsbClcclxuICAgKlxyXG4gICAqIDFcXC4gU2V0IHRoZSB2YWx1ZXMgb2YgdGhlIHRlbXBsYXRlIFNEYXRhIHJlc3BvbnNlXHJcbiAgICogMlxcLiBTZXQgYW55IGZpZWxkIGRlZmF1bHRzICh0aGUgZmllbGRzIGBkZWZhdWx0YCBwcm9wZXJ0eSlcclxuICAgKiAzXFwuIEFwcGx5Q29udGV4dCBpcyBjYWxsZWRcclxuICAgKiA0XFwuIElmIGB0aGlzLm9wdGlvbnMuZW50cnlgIGlzIGRlZmluZWQsIGFwcGx5IHRob3NlIHZhbHVlc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHRlbXBsYXRlRW50cnlcclxuICAgKi9cclxuICBhcHBseUNvbnRleHQ6IGZ1bmN0aW9uIGFwcGx5Q29udGV4dCgvKiB0ZW1wbGF0ZUVudHJ5Ki8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFUZW1wbGF0ZVJlc291cmNlUmVxdWVzdCBpbnN0YW5jZSBhbmQgc2V0cyBhIG51bWJlciBvZiBrbm93biBwcm9wZXJ0aWVzLlxyXG4gICAqXHJcbiAgICogTGlzdCBvZiBwcm9wZXJ0aWVzIHVzZWQgYHRoaXMucHJvcGVydHkvdGhpcy5vcHRpb25zLnByb3BlcnR5YDpcclxuICAgKlxyXG4gICAqIGByZXNvdXJjZUtpbmRgLCBgcXVlcnlTZWxlY3RgLCBgcXVlcnlJbmNsdWRlYFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVRlbXBsYXRlUmVzb3VyY2VSZXF1ZXN0IGluc3RhbmNlLlxyXG4gICAqL1xyXG4gIGNyZWF0ZVRlbXBsYXRlUmVxdWVzdDogZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVSZXF1ZXN0KCkge1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVRlbXBsYXRlUmVzb3VyY2VSZXF1ZXN0KHRoaXMuZ2V0U2VydmljZSgpKTtcclxuXHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZUtpbmQodGhpcy5yZXNvdXJjZUtpbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0KSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5TZWxlY3QsIHRoaXMucXVlcnlTZWxlY3Quam9pbignLCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUluY2x1ZGUpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLkluY2x1ZGUsIHRoaXMucXVlcnlJbmNsdWRlLmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0Q29udHJhY3ROYW1lKHRoaXMuY29udHJhY3ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEluaXRpYXRlcyB0aGUgU0RhdGEgcmVxdWVzdCBmb3IgdGhlIHRlbXBsYXRlIChkZWZhdWx0IHZhbHVlcykuXHJcbiAgICovXHJcbiAgcmVxdWVzdFRlbXBsYXRlOiBmdW5jdGlvbiByZXF1ZXN0VGVtcGxhdGUoKSB7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5jcmVhdGVUZW1wbGF0ZVJlcXVlc3QoKTtcclxuICAgIGlmIChyZXF1ZXN0KSB7XHJcbiAgICAgIHJlcXVlc3QucmVhZCh7XHJcbiAgICAgICAgc3VjY2VzczogdGhpcy5vblJlcXVlc3RUZW1wbGF0ZVN1Y2Nlc3MsXHJcbiAgICAgICAgZmFpbHVyZTogdGhpcy5vblJlcXVlc3RUZW1wbGF0ZUZhaWx1cmUsXHJcbiAgICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciB3aGVuIGFuIGVycm9yIG9jY3VycyB3aGlsZSByZXF1ZXN0IGRhdGEgZnJvbSB0aGUgU0RhdGEgZW5kcG9pbnQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZSBvYmplY3QuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG8gVGhlIG9wdGlvbnMgdGhhdCB3ZXJlIHBhc3NlZCB3aGVuIGNyZWF0aW5nIHRoZSBBamF4IHJlcXVlc3QuXHJcbiAgICovXHJcbiAgb25SZXF1ZXN0VGVtcGxhdGVGYWlsdXJlOiBmdW5jdGlvbiBvblJlcXVlc3RUZW1wbGF0ZUZhaWx1cmUocmVzcG9uc2UvKiAsIG8qLykge1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihyZXNwb25zZSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYSByZXF1ZXN0IHRvIFNEYXRhIGlzIHN1Y2Nlc3NmdWwsIGNhbGxzIHByb2Nlc3NUZW1wbGF0ZUVudHJ5XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IFRoZSBTRGF0YSByZXNwb25zZVxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdFRlbXBsYXRlU3VjY2VzczogZnVuY3Rpb24gb25SZXF1ZXN0VGVtcGxhdGVTdWNjZXNzKGVudHJ5KSB7XHJcbiAgICB0aGlzLnByb2Nlc3NUZW1wbGF0ZUVudHJ5KGVudHJ5KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFByb2Nlc3NlcyB0aGUgcmV0dXJuZWQgU0RhdGEgdGVtcGxhdGUgZW50cnkgYnkgc2F2aW5nIGl0IHRvIGB0aGlzLnRlbXBsYXRlRW50cnlgIGFuZCBhcHBsaWVzXHJcbiAgICogdGhlIGRlZmF1bHQgdmFsdWVzIHRvIGZpZWxkcyBieTpcclxuICAgKlxyXG4gICAqIFRoZSBjeWNsZSBvZiBhIHRlbXBsYXRlIHZhbHVlcyBpcyAoZmlyc3QgdG8gbGFzdCwgbGFzdCBiZWluZyB0aGUgb25lIHRoYXQgb3ZlcndyaXRlcyBhbGwpXHJcbiAgICpcclxuICAgKiAxXFwuIFNldCB0aGUgdmFsdWVzIG9mIHRoZSB0ZW1wbGF0ZSBTRGF0YSByZXNwb25zZVxyXG4gICAqIDJcXC4gU2V0IGFueSBmaWVsZCBkZWZhdWx0cyAodGhlIGZpZWxkcyBgZGVmYXVsdGAgcHJvcGVydHkpXHJcbiAgICogM1xcLiBBcHBseUNvbnRleHQgaXMgY2FsbGVkXHJcbiAgICogNFxcLiBJZiBgdGhpcy5vcHRpb25zLmVudHJ5YCBpcyBkZWZpbmVkLCBhcHBseSB0aG9zZSB2YWx1ZXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZUVudHJ5IFNEYXRhIHRlbXBsYXRlIGVudHJ5XHJcbiAgICovXHJcbiAgcHJvY2Vzc1RlbXBsYXRlRW50cnk6IGZ1bmN0aW9uIHByb2Nlc3NUZW1wbGF0ZUVudHJ5KHRlbXBsYXRlRW50cnkpIHtcclxuICAgIHRoaXMudGVtcGxhdGVFbnRyeSA9IHRoaXMuY29udmVydEVudHJ5KHRlbXBsYXRlRW50cnkgfHwge30pO1xyXG4gICAgdGhpcy5yZXNldEludGVyYWN0aW9uU3RhdGUoKTtcclxuICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMudGVtcGxhdGVFbnRyeSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmFwcGx5RmllbGREZWZhdWx0cygpO1xyXG4gICAgdGhpcy5hcHBseUNvbnRleHQodGhpcy50ZW1wbGF0ZUVudHJ5KTtcclxuXHJcbiAgICAvLyBpZiBhbiBlbnRyeSBoYXMgYmVlbiBwYXNzZWQgdGhyb3VnaCBvcHRpb25zLCBhcHBseSBpdCBoZXJlLCBub3cgdGhhdCB0aGUgdGVtcGxhdGUgaGFzIGJlZW4gYXBwbGllZC5cclxuICAgIC8vIGluIHRoaXMgY2FzZSwgc2luY2Ugd2UgYXJlIGRvaW5nIGFuIGluc2VydCAob25seSB0aW1lIHRlbXBsYXRlIGlzIHVzZWQpLCB0aGUgZW50cnkgaXMgYXBwbGllZCBhcyBtb2RpZmllZCBkYXRhLlxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5lbnRyeSkge1xyXG4gICAgICB0aGlzLmVudHJ5ID0gdGhpcy5jb252ZXJ0RW50cnkodGhpcy5vcHRpb25zLmVudHJ5KTtcclxuICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5lbnRyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEb2VzIHRoZSByZXZlcnNlIG9mIHtAbGluayAjY29udmVydEVudHJ5IGNvbnZlcnRFbnRyeX0gaW4gdGhhdCBpdCBsb29wcyB0aGUgcGF5bG9hZCBiZWluZ1xyXG4gICAqIHNlbnQgYmFjayB0byBTRGF0YSBhbmQgY29udmVydHMgRGF0ZSBvYmplY3RzIGludG8gU0RhdGEgZGF0ZSBzdHJpbmdzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBQYXlsb2FkXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBFbnRyeSB3aXRoIHN0cmluZyBkYXRlc1xyXG4gICAqL1xyXG4gIGNvbnZlcnRWYWx1ZXM6IGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZXModmFsdWVzKSB7XHJcbiAgICBmb3IgKGNvbnN0IG4gaW4gdmFsdWVzKSB7XHJcbiAgICAgIGlmICh2YWx1ZXNbbl0gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgdmFsdWVzW25dID0gdGhpcy5nZXRTZXJ2aWNlKCkuaXNKc29uRW5hYmxlZCgpID8gY29udmVydC50b0pzb25TdHJpbmdGcm9tRGF0ZSh2YWx1ZXNbbl0pIDogY29udmVydC50b0lzb1N0cmluZ0Zyb21EYXRlKHZhbHVlc1tuXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgYSBnaXZlbiBlbnRyeSB0ZXN0aW5nIGZvciBTRGF0YSBkYXRlIHN0cmluZ3MgYW5kIGNvbnZlcnRzIHRoZW0gdG8gamF2YXNjcmlwdCBEYXRlIG9iamVjdHNcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgU0RhdGEgZW50cnlcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEVudHJ5IHdpdGggYWN0dWFsIERhdGUgb2JqZWN0c1xyXG4gICAqL1xyXG4gIGNvbnZlcnRFbnRyeTogZnVuY3Rpb24gY29udmVydEVudHJ5KGVudHJ5KSB7XHJcbiAgICBmb3IgKGNvbnN0IG4gaW4gZW50cnkpIHtcclxuICAgICAgaWYgKGNvbnZlcnQuaXNEYXRlU3RyaW5nKGVudHJ5W25dKSkge1xyXG4gICAgICAgIGVudHJ5W25dID0gY29udmVydC50b0RhdGVGcm9tU3RyaW5nKGVudHJ5W25dKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9LFxyXG4gIHJlc2V0SW50ZXJhY3Rpb25TdGF0ZTogZnVuY3Rpb24gcmVzZXRJbnRlcmFjdGlvblN0YXRlKCkge1xyXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzRmllbGRTdGF0ZSA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLl9wcmV2aW91c0ZpZWxkU3RhdGUgPSB7fTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlc3RvcmUgdGhlIHByZXZpb3VzIHN0YXRlIG9mIGVhY2ggZmllbGQgYmVmb3JlIHRoZSBzZWN1cml0eSB3YXMgYXBwbGllZFxyXG4gICAgT2JqZWN0LmtleXModGhpcy5fcHJldmlvdXNGaWVsZFN0YXRlKVxyXG4gICAgICAuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNba107XHJcbiAgICAgICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IHRoaXMuX3ByZXZpb3VzRmllbGRTdGF0ZVtrXTtcclxuXHJcbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUuZGlzYWJsZWQpIHtcclxuICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmllbGQuZW5hYmxlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJldmlvdXNTdGF0ZS5oaWRkZW4pIHtcclxuICAgICAgICAgIGZpZWxkLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmllbGQuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5fcHJldmlvdXNGaWVsZFN0YXRlID0ge307XHJcbiAgfSxcclxuICBfcHJldmlvdXNGaWVsZFN0YXRlOiBudWxsLFxyXG4gIHByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHk6IGZ1bmN0aW9uIHByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHkoZW50cnkpIHtcclxuICAgIHRoaXMucmVzZXRJbnRlcmFjdGlvblN0YXRlKCk7XHJcbiAgICBjb25zdCB7ICRwZXJtaXNzaW9uczogcGVybWlzc2lvbnMgfSA9IGVudHJ5O1xyXG4gICAgLy8gcGVybWlzc2lvbnMgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0czpcclxuICAgIC8vIHsgbmFtZTogXCJGaWVsZE5hbWVcIiwgYWNjZXNzOiBcIlJlYWRPbmx5XCIgfVxyXG4gICAgaWYgKHBlcm1pc3Npb25zICYmIHBlcm1pc3Npb25zLmxlbmd0aCkge1xyXG4gICAgICBwZXJtaXNzaW9ucy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBuYW1lLCBhY2Nlc3MgfSA9IHA7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tuYW1lXTtcclxuICAgICAgICBpZiAoIWZpZWxkKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDYXB0dXJlIHRoZSBjdXJyZW50IHN0YXRlIGJlZm9yZSB3ZSBhcHBseSB0aGUgY2hhbmdlc1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzRmllbGRTdGF0ZVtuYW1lXSA9IHtcclxuICAgICAgICAgIGRpc2FibGVkOiBmaWVsZC5pc0Rpc2FibGVkKCksXHJcbiAgICAgICAgICBoaWRkZW46IGZpZWxkLmlzSGlkZGVuKCksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGFjY2VzcyA9PT0gJ05vQWNjZXNzJykge1xyXG4gICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgZmllbGQuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYWNjZXNzID09PSAnUmVhZE9ubHknKSB7XHJcbiAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9QdXRPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvUHV0T3B0aW9ucyhwdXRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG5cclxuICAgIGlmICh0aGlzLl9pc0NvbmN1cnJlbmN5Q2hlY2tFbmFibGVkKCkpIHtcclxuICAgICAgLy8gVGhlIFNEYXRhIHN0b3JlIHdpbGwgdGFrZSB0aGUgdmVyc2lvbiBhbmQgYXBwbHkgaXQgdG8gdGhlIGV0YWdcclxuICAgICAgcHV0T3B0aW9ucy52ZXJzaW9uID0gc3RvcmUuZ2V0VmVyc2lvbih0aGlzLmVudHJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdXRPcHRpb25zLmVudGl0eSA9IHN0b3JlLmdldEVudGl0eSh0aGlzLmVudHJ5KSB8fCB0aGlzLmVudGl0eU5hbWU7XHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvQWRkT3B0aW9uczogZnVuY3Rpb24gX2FwcGx5U3RhdGVUb0FkZE9wdGlvbnMoYWRkT3B0aW9ucykge1xyXG4gICAgYWRkT3B0aW9ucy5lbnRpdHkgPSB0aGlzLmVudGl0eU5hbWU7XHJcbiAgfSxcclxuICBfaXNDb25jdXJyZW5jeUNoZWNrRW5hYmxlZDogZnVuY3Rpb24gX2lzQ29uY3VycmVuY3lDaGVja0VuYWJsZWQoKSB7XHJcbiAgICByZXR1cm4gQXBwICYmIEFwcC5lbmFibGVDb25jdXJyZW5jeUNoZWNrO1xyXG4gIH0sXHJcbiAgaW5pdE1vZGVsOiBmdW5jdGlvbiBpbml0TW9kZWwoKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKTtcclxuICAgIGlmIChtb2RlbCkge1xyXG4gICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICB0aGlzLl9tb2RlbC5pbml0KCk7XHJcbiAgICAgIGlmICh0aGlzLl9tb2RlbC5Nb2RlbFR5cGUgPT09IE1PREVMX1RZUEVTLlNEQVRBKSB7XHJcbiAgICAgICAgdGhpcy5fYXBwbHlWaWV3VG9Nb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIF9hcHBseVZpZXdUb01vZGVsOiBmdW5jdGlvbiBfYXBwbHlWaWV3VG9Nb2RlbChtb2RlbCkge1xyXG4gICAgaWYgKCFtb2RlbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXVlcnlNb2RlbCA9IG1vZGVsLl9nZXRRdWVyeU1vZGVsQnlOYW1lKCdkZXRhaWwnKTtcclxuICAgIGlmICh0aGlzLnJlc291cmNlS2luZCkge1xyXG4gICAgICBtb2RlbC5yZXNvdXJjZUtpbmQgPSB0aGlzLnJlc291cmNlS2luZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXF1ZXJ5TW9kZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEF0dGVtcHQgdG8gbWl4aW4gdGhlIHZpZXcncyBxdWVyeVNlbGVjdCwgcXVlcnlJbmNsdWRlLCBxdWVyeVdoZXJlLFxyXG4gICAgLy8gcXVlcnlBcmdzLCBxdWVyeU9yZGVyQnksIHJlc291cmNlUHJvcGVydHksIHJlc291cmNlUHJlZGljYXRlIHByb3BlcnRpZXNcclxuICAgIC8vIGludG8gdGhlIGxheW91dC4gVGhlIHBhc3QgbWV0aG9kIG9mIGV4dGVuZGluZyBhIHF1ZXJ5U2VsZWN0IGZvciBleGFtcGxlLFxyXG4gICAgLy8gd2FzIHRvIG1vZGlmeSB0aGUgcHJvdG95cGUgb2YgdGhlIHZpZXcncyBxdWVyeVNlbGVjdCBhcnJheS5cclxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0ICYmIHRoaXMucXVlcnlTZWxlY3QubGVuZ3RoKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlTZWxlY3QgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0KSB7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeVNlbGVjdCA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0ID0gcXVlcnlNb2RlbC5xdWVyeVNlbGVjdC5jb25jYXQodGhpcy5xdWVyeVNlbGVjdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICByZXR1cm4gcXVlcnlNb2RlbC5xdWVyeVNlbGVjdC5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5SW5jbHVkZSAmJiB0aGlzLnF1ZXJ5SW5jbHVkZS5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeUluY2x1ZGUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZSkge1xyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUuY29uY2F0KHRoaXMucXVlcnlJbmNsdWRlLmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZS5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5V2hlcmUpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeVdoZXJlIGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlXaGVyZSA9IHRoaXMucXVlcnlXaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUFyZ3MpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeUFyZ3MgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5xdWVyeUFyZ3MgPSBsYW5nLm1peGluKHt9LCBxdWVyeU1vZGVsLnF1ZXJ5QXJncywgdGhpcy5xdWVyeUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5T3JkZXJCeSAmJiB0aGlzLnF1ZXJ5T3JkZXJCeS5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeU9yZGVyQnkgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5xdWVyeU9yZGVyQnkpKSB7XHJcbiAgICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSkge1xyXG4gICAgICAgICAgcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5ID0gcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkuY29uY2F0KHRoaXMucXVlcnlPcmRlckJ5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5LmluZGV4T2YoaXRlbSkgPCAwO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSA9IHRoaXMucXVlcnlPcmRlckJ5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VQcm9wZXJ0eSkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHJlc291cmNlUHJvcGVydHkgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5yZXNvdXJjZVByb3BlcnR5ID0gdGhpcy5yZXNvdXJjZVByb3BlcnR5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc291cmNlUHJlZGljYXRlKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcmVzb3VyY2VQcmVkaWNhdGUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5yZXNvdXJjZVByZWRpY2F0ZSA9IHRoaXMucmVzb3VyY2VQcmVkaWNhdGU7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=