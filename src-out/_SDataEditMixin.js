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
      var message = this.inherited(arguments);

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
      values = this.inherited(arguments);
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
      values = this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fU0RhdGFFZGl0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImVudHJ5IiwidGVtcGxhdGVFbnRyeSIsImRpZmZQcm9wZXJ0eUlnbm9yZXMiLCJfYnVpbGRSZWZyZXNoTWVzc2FnZSIsIm1lc3NhZ2UiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJtaXhpbiIsInJlc291cmNlS2luZCIsIm9uUmVmcmVzaCIsIm9uUmVmcmVzaEluc2VydCIsIm9wdGlvbnMiLCJ0ZW1wbGF0ZSIsInByb2Nlc3NUZW1wbGF0ZUVudHJ5IiwicmVxdWVzdFRlbXBsYXRlIiwiY3JlYXRlRW50cnlGb3JVcGRhdGUiLCJ2IiwidmFsdWVzIiwiJGtleSIsIiRldGFnIiwiJG5hbWUiLCJfaXNDb25jdXJyZW5jeUNoZWNrRW5hYmxlZCIsImNyZWF0ZUVudHJ5Rm9ySW5zZXJ0IiwiZW50aXR5TmFtZSIsImFwcGx5Q29udGV4dCIsImNyZWF0ZVRlbXBsYXRlUmVxdWVzdCIsInJlcXVlc3QiLCJTYWdlIiwiU0RhdGEiLCJDbGllbnQiLCJTRGF0YVRlbXBsYXRlUmVzb3VyY2VSZXF1ZXN0IiwiZ2V0U2VydmljZSIsInNldFJlc291cmNlS2luZCIsInF1ZXJ5U2VsZWN0Iiwic2V0UXVlcnlBcmciLCJTRGF0YVVyaSIsIlF1ZXJ5QXJnTmFtZXMiLCJTZWxlY3QiLCJqb2luIiwicXVlcnlJbmNsdWRlIiwiSW5jbHVkZSIsImNvbnRyYWN0TmFtZSIsInNldENvbnRyYWN0TmFtZSIsInJlYWQiLCJzdWNjZXNzIiwib25SZXF1ZXN0VGVtcGxhdGVTdWNjZXNzIiwiZmFpbHVyZSIsIm9uUmVxdWVzdFRlbXBsYXRlRmFpbHVyZSIsInNjb3BlIiwicmVzcG9uc2UiLCJoYW5kbGVFcnJvciIsImNvbnZlcnRFbnRyeSIsInJlc2V0SW50ZXJhY3Rpb25TdGF0ZSIsInNldFZhbHVlcyIsImFwcGx5RmllbGREZWZhdWx0cyIsIiQiLCJkb21Ob2RlIiwicmVtb3ZlQ2xhc3MiLCJjb252ZXJ0VmFsdWVzIiwibiIsIkRhdGUiLCJpc0pzb25FbmFibGVkIiwidG9Kc29uU3RyaW5nRnJvbURhdGUiLCJ0b0lzb1N0cmluZ0Zyb21EYXRlIiwiaXNEYXRlU3RyaW5nIiwidG9EYXRlRnJvbVN0cmluZyIsIl9wcmV2aW91c0ZpZWxkU3RhdGUiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJmaWVsZCIsImZpZWxkcyIsInByZXZpb3VzU3RhdGUiLCJkaXNhYmxlZCIsImRpc2FibGUiLCJlbmFibGUiLCJoaWRkZW4iLCJoaWRlIiwic2hvdyIsInByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHkiLCJwZXJtaXNzaW9ucyIsIiRwZXJtaXNzaW9ucyIsImxlbmd0aCIsInAiLCJuYW1lIiwiYWNjZXNzIiwiaXNEaXNhYmxlZCIsImlzSGlkZGVuIiwiX2FwcGx5U3RhdGVUb1B1dE9wdGlvbnMiLCJwdXRPcHRpb25zIiwic3RvcmUiLCJnZXQiLCJ2ZXJzaW9uIiwiZ2V0VmVyc2lvbiIsImVudGl0eSIsImdldEVudGl0eSIsIl9hcHBseVN0YXRlVG9BZGRPcHRpb25zIiwiYWRkT3B0aW9ucyIsIkFwcCIsImVuYWJsZUNvbmN1cnJlbmN5Q2hlY2siLCJpbml0TW9kZWwiLCJtb2RlbCIsImdldE1vZGVsIiwiX21vZGVsIiwiaW5pdCIsIk1vZGVsVHlwZSIsIlNEQVRBIiwiX2FwcGx5Vmlld1RvTW9kZWwiLCJxdWVyeU1vZGVsIiwiX2dldFF1ZXJ5TW9kZWxCeU5hbWUiLCJjb25zb2xlIiwid2FybiIsImNvbmNhdCIsImZpbHRlciIsIml0ZW0iLCJpbmRleE9mIiwicXVlcnlXaGVyZSIsInF1ZXJ5QXJncyIsInF1ZXJ5T3JkZXJCeSIsIkFycmF5IiwiaXNBcnJheSIsInJlc291cmNlUHJvcGVydHkiLCJyZXNvdXJjZVByZWRpY2F0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBLE1BQU1BLFVBQVUsdUJBQVEsdUJBQVIsRUFBaUMsNEJBQWpDLEVBQXNELG9DQUFvQztBQUN4Rzs7OztB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QUFXLEVBQVgsRUFBZXNHLFdBQVdTLFNBQTFCLEVBQXFDLEtBQUtBLFNBQTFDLENBQXZCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLQyxZQUFMLElBQXFCLEtBQUtBLFlBQUwsQ0FBa0JwQyxNQUEzQyxFQUFtRDtBQUNqRDtBQUNBNEIsZ0JBQVFDLElBQVI7QUFDQTtBQUNBLFlBQUlRLE1BQU1DLE9BQU4sQ0FBYyxLQUFLRixZQUFuQixDQUFKLEVBQXNDO0FBQ3BDLGNBQUksQ0FBQ1YsV0FBV1UsWUFBaEIsRUFBOEI7QUFDNUJWLHVCQUFXVSxZQUFYLEdBQTBCLEVBQTFCO0FBQ0Q7O0FBRURWLHFCQUFXVSxZQUFYLEdBQTBCVixXQUFXVSxZQUFYLENBQXdCTixNQUF4QixDQUErQixLQUFLTSxZQUFMLENBQWtCTCxNQUFsQixDQUF5QixVQUFDQyxJQUFELEVBQVU7QUFDMUYsbUJBQU9OLFdBQVdVLFlBQVgsQ0FBd0JILE9BQXhCLENBQWdDRCxJQUFoQyxJQUF3QyxDQUEvQztBQUNELFdBRndELENBQS9CLENBQTFCO0FBR0QsU0FSRCxNQVFPO0FBQ0xOLHFCQUFXVSxZQUFYLEdBQTBCLEtBQUtBLFlBQS9CO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJLEtBQUtHLGdCQUFULEVBQTJCO0FBQ3pCO0FBQ0FYLGdCQUFRQyxJQUFSO0FBQ0E7QUFDQUgsbUJBQVdhLGdCQUFYLEdBQThCLEtBQUtBLGdCQUFuQztBQUNEOztBQUVELFVBQUksS0FBS0MsaUJBQVQsRUFBNEI7QUFDMUI7QUFDQVosZ0JBQVFDLElBQVI7QUFDQTtBQUNBSCxtQkFBV2MsaUJBQVgsR0FBK0IsS0FBS0EsaUJBQXBDO0FBQ0Q7QUFDRjtBQXJXdUcsR0FBMUYsQ0FBaEIsQyxDQTdCQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7b0JBc1hlNUgsTyIsImZpbGUiOiJfU0RhdGFFZGl0TWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX1NEYXRhRWRpdE1peGluXHJcbiAqIEBjbGFzc2Rlc2MgRW5hYmxlcyBTRGF0YSBmb3IgdGhlIEVkaXQgdmlldy5cclxuICogRXh0ZW5kcyB0aGUgU0RhdGFEZXRhaWwgTWl4aW4gYnkgcHJvdmlkaW5nIGZ1bmN0aW9ucyBmb3IgJHRlbXBsYXRlIHJlcXVlc3RzLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fU0RhdGFEZXRhaWxNaXhpblxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuU0RhdGFcclxuICovXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcblxyXG5pbXBvcnQgY29udmVydCBmcm9tICcuL0NvbnZlcnQnO1xyXG5pbXBvcnQgX1NEYXRhRGV0YWlsTWl4aW4gZnJvbSAnLi9fU0RhdGFEZXRhaWxNaXhpbic7XHJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuL01vZGVscy9UeXBlcyc7XHJcblxyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX1NEYXRhRWRpdE1peGluJywgW19TRGF0YURldGFpbE1peGluXSwgLyoqIEBsZW5kcyBhcmdvcy5fU0RhdGFFZGl0TWl4aW4jICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBzYXZlZCBTRGF0YSByZXNwb25zZS5cclxuICAgKi9cclxuICBlbnRyeTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHNhdmVkIHRlbXBsYXRlIFNEYXRhIHJlc3BvbnNlLlxyXG4gICAqL1xyXG4gIHRlbXBsYXRlRW50cnk6IG51bGwsXHJcbiAgZGlmZlByb3BlcnR5SWdub3JlczogW1xyXG4gICAgJyRldGFnJyxcclxuICAgICckdXBkYXRlZCcsXHJcbiAgXSxcclxuXHJcbiAgX2J1aWxkUmVmcmVzaE1lc3NhZ2U6IGZ1bmN0aW9uIF9idWlsZFJlZnJlc2hNZXNzYWdlKCkge1xyXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcblxyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4obWVzc2FnZSwge1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBvblJlZnJlc2g6IGZ1bmN0aW9uIG9uUmVmcmVzaCgpIHtcclxuICAgIHRoaXMuZW50cnkgPSBmYWxzZTtcclxuICB9LFxyXG4gIG9uUmVmcmVzaEluc2VydDogZnVuY3Rpb24gb25SZWZyZXNoSW5zZXJ0KCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSkge1xyXG4gICAgICB0aGlzLnByb2Nlc3NUZW1wbGF0ZUVudHJ5KHRoaXMub3B0aW9ucy50ZW1wbGF0ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJlcXVlc3RUZW1wbGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3JlYXRlRW50cnlGb3JVcGRhdGU6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5Rm9yVXBkYXRlKHYpIHtcclxuICAgIGxldCB2YWx1ZXMgPSB2O1xyXG4gICAgdmFsdWVzID0gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHZhbHVlcyA9IGxhbmcubWl4aW4odmFsdWVzLCB7XHJcbiAgICAgICRrZXk6IHRoaXMuZW50cnkuJGtleSxcclxuICAgICAgJGV0YWc6IHRoaXMuZW50cnkuJGV0YWcsXHJcbiAgICAgICRuYW1lOiB0aGlzLmVudHJ5LiRuYW1lLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLl9pc0NvbmN1cnJlbmN5Q2hlY2tFbmFibGVkKCkpIHtcclxuICAgICAgZGVsZXRlIHZhbHVlcy4kZXRhZztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH0sXHJcbiAgY3JlYXRlRW50cnlGb3JJbnNlcnQ6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5Rm9ySW5zZXJ0KHYpIHtcclxuICAgIGxldCB2YWx1ZXMgPSB2O1xyXG4gICAgdmFsdWVzID0gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHJldHVybiBsYW5nLm1peGluKHZhbHVlcywge1xyXG4gICAgICAkbmFtZTogdGhpcy5lbnRpdHlOYW1lLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBBcHBseUNvbnRleHQgaXMgY2FsbGVkIGR1cmluZyB7QGxpbmsgI3Byb2Nlc3NUZW1wbGF0ZUVudHJ5IHByb2Nlc3NUZW1wbGF0ZUVudHJ5fSBhbmQgaXNcclxuICAgKiBpbnRlbmRlZCBhcyBhIGhvb2sgZm9yIHdoZW4geW91IGFyZSBpbnNlcnRpbmcgYSBuZXcgZW50cnkgKG5vdCBlZGl0aW5nKSBhbmQgd2lzaCB0byBhcHBseVxyXG4gICAqIHZhbHVlcyBmcm9tIGNvbnRleHQsIGllLCBmcm9tIGEgdmlldyBpbiB0aGUgaGlzdG9yeS5cclxuICAgKlxyXG4gICAqIFRoZSBjeWNsZSBvZiBhIHRlbXBsYXRlIHZhbHVlcyBpcyAoZmlyc3QgdG8gbGFzdCwgbGFzdCBiZWluZyB0aGUgb25lIHRoYXQgb3ZlcndyaXRlcyBhbGwpXHJcbiAgICpcclxuICAgKiAxXFwuIFNldCB0aGUgdmFsdWVzIG9mIHRoZSB0ZW1wbGF0ZSBTRGF0YSByZXNwb25zZVxyXG4gICAqIDJcXC4gU2V0IGFueSBmaWVsZCBkZWZhdWx0cyAodGhlIGZpZWxkcyBgZGVmYXVsdGAgcHJvcGVydHkpXHJcbiAgICogM1xcLiBBcHBseUNvbnRleHQgaXMgY2FsbGVkXHJcbiAgICogNFxcLiBJZiBgdGhpcy5vcHRpb25zLmVudHJ5YCBpcyBkZWZpbmVkLCBhcHBseSB0aG9zZSB2YWx1ZXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZUVudHJ5XHJcbiAgICovXHJcbiAgYXBwbHlDb250ZXh0OiBmdW5jdGlvbiBhcHBseUNvbnRleHQoLyogdGVtcGxhdGVFbnRyeSovKSB7fSxcclxuICAvKipcclxuICAgKiBDcmVhdGVzIFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhVGVtcGxhdGVSZXNvdXJjZVJlcXVlc3QgaW5zdGFuY2UgYW5kIHNldHMgYSBudW1iZXIgb2Yga25vd24gcHJvcGVydGllcy5cclxuICAgKlxyXG4gICAqIExpc3Qgb2YgcHJvcGVydGllcyB1c2VkIGB0aGlzLnByb3BlcnR5L3RoaXMub3B0aW9ucy5wcm9wZXJ0eWA6XHJcbiAgICpcclxuICAgKiBgcmVzb3VyY2VLaW5kYCwgYHF1ZXJ5U2VsZWN0YCwgYHF1ZXJ5SW5jbHVkZWBcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFUZW1wbGF0ZVJlc291cmNlUmVxdWVzdCBpbnN0YW5jZS5cclxuICAgKi9cclxuICBjcmVhdGVUZW1wbGF0ZVJlcXVlc3Q6IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlUmVxdWVzdCgpIHtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFUZW1wbGF0ZVJlc291cmNlUmVxdWVzdCh0aGlzLmdldFNlcnZpY2UoKSk7XHJcblxyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UmVzb3VyY2VLaW5kKHRoaXMucmVzb3VyY2VLaW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeVNlbGVjdCkge1xyXG4gICAgICByZXF1ZXN0LnNldFF1ZXJ5QXJnKFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhVXJpLlF1ZXJ5QXJnTmFtZXMuU2VsZWN0LCB0aGlzLnF1ZXJ5U2VsZWN0LmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlJbmNsdWRlKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5JbmNsdWRlLCB0aGlzLnF1ZXJ5SW5jbHVkZS5qb2luKCcsJykpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmNvbnRyYWN0TmFtZSkge1xyXG4gICAgICByZXF1ZXN0LnNldENvbnRyYWN0TmFtZSh0aGlzLmNvbnRyYWN0TmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlcXVlc3Q7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIFNEYXRhIHJlcXVlc3QgZm9yIHRoZSB0ZW1wbGF0ZSAoZGVmYXVsdCB2YWx1ZXMpLlxyXG4gICAqL1xyXG4gIHJlcXVlc3RUZW1wbGF0ZTogZnVuY3Rpb24gcmVxdWVzdFRlbXBsYXRlKCkge1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuY3JlYXRlVGVtcGxhdGVSZXF1ZXN0KCk7XHJcbiAgICBpZiAocmVxdWVzdCkge1xyXG4gICAgICByZXF1ZXN0LnJlYWQoe1xyXG4gICAgICAgIHN1Y2Nlc3M6IHRoaXMub25SZXF1ZXN0VGVtcGxhdGVTdWNjZXNzLFxyXG4gICAgICAgIGZhaWx1cmU6IHRoaXMub25SZXF1ZXN0VGVtcGxhdGVGYWlsdXJlLFxyXG4gICAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgd2hlbiBhbiBlcnJvciBvY2N1cnMgd2hpbGUgcmVxdWVzdCBkYXRhIGZyb20gdGhlIFNEYXRhIGVuZHBvaW50LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2Ugb2JqZWN0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvIFRoZSBvcHRpb25zIHRoYXQgd2VyZSBwYXNzZWQgd2hlbiBjcmVhdGluZyB0aGUgQWpheCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIG9uUmVxdWVzdFRlbXBsYXRlRmFpbHVyZTogZnVuY3Rpb24gb25SZXF1ZXN0VGVtcGxhdGVGYWlsdXJlKHJlc3BvbnNlLyogLCBvKi8pIHtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IocmVzcG9uc2UpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciB3aGVuIGEgcmVxdWVzdCB0byBTRGF0YSBpcyBzdWNjZXNzZnVsLCBjYWxscyBwcm9jZXNzVGVtcGxhdGVFbnRyeVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBUaGUgU0RhdGEgcmVzcG9uc2VcclxuICAgKi9cclxuICBvblJlcXVlc3RUZW1wbGF0ZVN1Y2Nlc3M6IGZ1bmN0aW9uIG9uUmVxdWVzdFRlbXBsYXRlU3VjY2VzcyhlbnRyeSkge1xyXG4gICAgdGhpcy5wcm9jZXNzVGVtcGxhdGVFbnRyeShlbnRyeSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBQcm9jZXNzZXMgdGhlIHJldHVybmVkIFNEYXRhIHRlbXBsYXRlIGVudHJ5IGJ5IHNhdmluZyBpdCB0byBgdGhpcy50ZW1wbGF0ZUVudHJ5YCBhbmQgYXBwbGllc1xyXG4gICAqIHRoZSBkZWZhdWx0IHZhbHVlcyB0byBmaWVsZHMgYnk6XHJcbiAgICpcclxuICAgKiBUaGUgY3ljbGUgb2YgYSB0ZW1wbGF0ZSB2YWx1ZXMgaXMgKGZpcnN0IHRvIGxhc3QsIGxhc3QgYmVpbmcgdGhlIG9uZSB0aGF0IG92ZXJ3cml0ZXMgYWxsKVxyXG4gICAqXHJcbiAgICogMVxcLiBTZXQgdGhlIHZhbHVlcyBvZiB0aGUgdGVtcGxhdGUgU0RhdGEgcmVzcG9uc2VcclxuICAgKiAyXFwuIFNldCBhbnkgZmllbGQgZGVmYXVsdHMgKHRoZSBmaWVsZHMgYGRlZmF1bHRgIHByb3BlcnR5KVxyXG4gICAqIDNcXC4gQXBwbHlDb250ZXh0IGlzIGNhbGxlZFxyXG4gICAqIDRcXC4gSWYgYHRoaXMub3B0aW9ucy5lbnRyeWAgaXMgZGVmaW5lZCwgYXBwbHkgdGhvc2UgdmFsdWVzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVFbnRyeSBTRGF0YSB0ZW1wbGF0ZSBlbnRyeVxyXG4gICAqL1xyXG4gIHByb2Nlc3NUZW1wbGF0ZUVudHJ5OiBmdW5jdGlvbiBwcm9jZXNzVGVtcGxhdGVFbnRyeSh0ZW1wbGF0ZUVudHJ5KSB7XHJcbiAgICB0aGlzLnRlbXBsYXRlRW50cnkgPSB0aGlzLmNvbnZlcnRFbnRyeSh0ZW1wbGF0ZUVudHJ5IHx8IHt9KTtcclxuICAgIHRoaXMucmVzZXRJbnRlcmFjdGlvblN0YXRlKCk7XHJcbiAgICB0aGlzLnNldFZhbHVlcyh0aGlzLnRlbXBsYXRlRW50cnksIHRydWUpO1xyXG4gICAgdGhpcy5hcHBseUZpZWxkRGVmYXVsdHMoKTtcclxuICAgIHRoaXMuYXBwbHlDb250ZXh0KHRoaXMudGVtcGxhdGVFbnRyeSk7XHJcblxyXG4gICAgLy8gaWYgYW4gZW50cnkgaGFzIGJlZW4gcGFzc2VkIHRocm91Z2ggb3B0aW9ucywgYXBwbHkgaXQgaGVyZSwgbm93IHRoYXQgdGhlIHRlbXBsYXRlIGhhcyBiZWVuIGFwcGxpZWQuXHJcbiAgICAvLyBpbiB0aGlzIGNhc2UsIHNpbmNlIHdlIGFyZSBkb2luZyBhbiBpbnNlcnQgKG9ubHkgdGltZSB0ZW1wbGF0ZSBpcyB1c2VkKSwgdGhlIGVudHJ5IGlzIGFwcGxpZWQgYXMgbW9kaWZpZWQgZGF0YS5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW50cnkpIHtcclxuICAgICAgdGhpcy5lbnRyeSA9IHRoaXMuY29udmVydEVudHJ5KHRoaXMub3B0aW9ucy5lbnRyeSk7XHJcbiAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuZW50cnkpO1xyXG4gICAgfVxyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRG9lcyB0aGUgcmV2ZXJzZSBvZiB7QGxpbmsgI2NvbnZlcnRFbnRyeSBjb252ZXJ0RW50cnl9IGluIHRoYXQgaXQgbG9vcHMgdGhlIHBheWxvYWQgYmVpbmdcclxuICAgKiBzZW50IGJhY2sgdG8gU0RhdGEgYW5kIGNvbnZlcnRzIERhdGUgb2JqZWN0cyBpbnRvIFNEYXRhIGRhdGUgc3RyaW5nc1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgUGF5bG9hZFxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gRW50cnkgd2l0aCBzdHJpbmcgZGF0ZXNcclxuICAgKi9cclxuICBjb252ZXJ0VmFsdWVzOiBmdW5jdGlvbiBjb252ZXJ0VmFsdWVzKHZhbHVlcykge1xyXG4gICAgZm9yIChjb25zdCBuIGluIHZhbHVlcykge1xyXG4gICAgICBpZiAodmFsdWVzW25dIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIHZhbHVlc1tuXSA9IHRoaXMuZ2V0U2VydmljZSgpLmlzSnNvbkVuYWJsZWQoKSA/IGNvbnZlcnQudG9Kc29uU3RyaW5nRnJvbURhdGUodmFsdWVzW25dKSA6IGNvbnZlcnQudG9Jc29TdHJpbmdGcm9tRGF0ZSh2YWx1ZXNbbl0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIExvb3BzIGEgZ2l2ZW4gZW50cnkgdGVzdGluZyBmb3IgU0RhdGEgZGF0ZSBzdHJpbmdzIGFuZCBjb252ZXJ0cyB0aGVtIHRvIGphdmFzY3JpcHQgRGF0ZSBvYmplY3RzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IFNEYXRhIGVudHJ5XHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBFbnRyeSB3aXRoIGFjdHVhbCBEYXRlIG9iamVjdHNcclxuICAgKi9cclxuICBjb252ZXJ0RW50cnk6IGZ1bmN0aW9uIGNvbnZlcnRFbnRyeShlbnRyeSkge1xyXG4gICAgZm9yIChjb25zdCBuIGluIGVudHJ5KSB7XHJcbiAgICAgIGlmIChjb252ZXJ0LmlzRGF0ZVN0cmluZyhlbnRyeVtuXSkpIHtcclxuICAgICAgICBlbnRyeVtuXSA9IGNvbnZlcnQudG9EYXRlRnJvbVN0cmluZyhlbnRyeVtuXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfSxcclxuICByZXNldEludGVyYWN0aW9uU3RhdGU6IGZ1bmN0aW9uIHJlc2V0SW50ZXJhY3Rpb25TdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLl9wcmV2aW91c0ZpZWxkU3RhdGUgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5fcHJldmlvdXNGaWVsZFN0YXRlID0ge307XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXN0b3JlIHRoZSBwcmV2aW91cyBzdGF0ZSBvZiBlYWNoIGZpZWxkIGJlZm9yZSB0aGUgc2VjdXJpdHkgd2FzIGFwcGxpZWRcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX3ByZXZpb3VzRmllbGRTdGF0ZSlcclxuICAgICAgLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW2tdO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSB0aGlzLl9wcmV2aW91c0ZpZWxkU3RhdGVba107XHJcblxyXG4gICAgICAgIGlmIChwcmV2aW91c1N0YXRlLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpZWxkLmVuYWJsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUuaGlkZGVuKSB7XHJcbiAgICAgICAgICBmaWVsZC5oaWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpZWxkLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3ByZXZpb3VzRmllbGRTdGF0ZSA9IHt9O1xyXG4gIH0sXHJcbiAgX3ByZXZpb3VzRmllbGRTdGF0ZTogbnVsbCxcclxuICBwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5OiBmdW5jdGlvbiBwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5KGVudHJ5KSB7XHJcbiAgICB0aGlzLnJlc2V0SW50ZXJhY3Rpb25TdGF0ZSgpO1xyXG4gICAgY29uc3QgeyAkcGVybWlzc2lvbnM6IHBlcm1pc3Npb25zIH0gPSBlbnRyeTtcclxuICAgIC8vIHBlcm1pc3Npb25zIGlzIGFuIGFycmF5IG9mIG9iamVjdHM6XHJcbiAgICAvLyB7IG5hbWU6IFwiRmllbGROYW1lXCIsIGFjY2VzczogXCJSZWFkT25seVwiIH1cclxuICAgIGlmIChwZXJtaXNzaW9ucyAmJiBwZXJtaXNzaW9ucy5sZW5ndGgpIHtcclxuICAgICAgcGVybWlzc2lvbnMuZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgYWNjZXNzIH0gPSBwO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbbmFtZV07XHJcbiAgICAgICAgaWYgKCFmaWVsZCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2FwdHVyZSB0aGUgY3VycmVudCBzdGF0ZSBiZWZvcmUgd2UgYXBwbHkgdGhlIGNoYW5nZXNcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0ZpZWxkU3RhdGVbbmFtZV0gPSB7XHJcbiAgICAgICAgICBkaXNhYmxlZDogZmllbGQuaXNEaXNhYmxlZCgpLFxyXG4gICAgICAgICAgaGlkZGVuOiBmaWVsZC5pc0hpZGRlbigpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChhY2Nlc3MgPT09ICdOb0FjY2VzcycpIHtcclxuICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcclxuICAgICAgICAgIGZpZWxkLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFjY2VzcyA9PT0gJ1JlYWRPbmx5Jykge1xyXG4gICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvUHV0T3B0aW9uczogZnVuY3Rpb24gX2FwcGx5U3RhdGVUb1B1dE9wdGlvbnMocHV0T3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuXHJcbiAgICBpZiAodGhpcy5faXNDb25jdXJyZW5jeUNoZWNrRW5hYmxlZCgpKSB7XHJcbiAgICAgIC8vIFRoZSBTRGF0YSBzdG9yZSB3aWxsIHRha2UgdGhlIHZlcnNpb24gYW5kIGFwcGx5IGl0IHRvIHRoZSBldGFnXHJcbiAgICAgIHB1dE9wdGlvbnMudmVyc2lvbiA9IHN0b3JlLmdldFZlcnNpb24odGhpcy5lbnRyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHV0T3B0aW9ucy5lbnRpdHkgPSBzdG9yZS5nZXRFbnRpdHkodGhpcy5lbnRyeSkgfHwgdGhpcy5lbnRpdHlOYW1lO1xyXG4gIH0sXHJcbiAgX2FwcGx5U3RhdGVUb0FkZE9wdGlvbnM6IGZ1bmN0aW9uIF9hcHBseVN0YXRlVG9BZGRPcHRpb25zKGFkZE9wdGlvbnMpIHtcclxuICAgIGFkZE9wdGlvbnMuZW50aXR5ID0gdGhpcy5lbnRpdHlOYW1lO1xyXG4gIH0sXHJcbiAgX2lzQ29uY3VycmVuY3lDaGVja0VuYWJsZWQ6IGZ1bmN0aW9uIF9pc0NvbmN1cnJlbmN5Q2hlY2tFbmFibGVkKCkge1xyXG4gICAgcmV0dXJuIEFwcCAmJiBBcHAuZW5hYmxlQ29uY3VycmVuY3lDaGVjaztcclxuICB9LFxyXG4gIGluaXRNb2RlbDogZnVuY3Rpb24gaW5pdE1vZGVsKCkge1xyXG4gICAgY29uc3QgbW9kZWwgPSB0aGlzLmdldE1vZGVsKCk7XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcclxuICAgICAgdGhpcy5fbW9kZWwuaW5pdCgpO1xyXG4gICAgICBpZiAodGhpcy5fbW9kZWwuTW9kZWxUeXBlID09PSBNT0RFTF9UWVBFUy5TREFUQSkge1xyXG4gICAgICAgIHRoaXMuX2FwcGx5Vmlld1RvTW9kZWwodGhpcy5fbW9kZWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBfYXBwbHlWaWV3VG9Nb2RlbDogZnVuY3Rpb24gX2FwcGx5Vmlld1RvTW9kZWwobW9kZWwpIHtcclxuICAgIGlmICghbW9kZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5TW9kZWwgPSBtb2RlbC5fZ2V0UXVlcnlNb2RlbEJ5TmFtZSgnZGV0YWlsJyk7XHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgbW9kZWwucmVzb3VyY2VLaW5kID0gdGhpcy5yZXNvdXJjZUtpbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFxdWVyeU1vZGVsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBdHRlbXB0IHRvIG1peGluIHRoZSB2aWV3J3MgcXVlcnlTZWxlY3QsIHF1ZXJ5SW5jbHVkZSwgcXVlcnlXaGVyZSxcclxuICAgIC8vIHF1ZXJ5QXJncywgcXVlcnlPcmRlckJ5LCByZXNvdXJjZVByb3BlcnR5LCByZXNvdXJjZVByZWRpY2F0ZSBwcm9wZXJ0aWVzXHJcbiAgICAvLyBpbnRvIHRoZSBsYXlvdXQuIFRoZSBwYXN0IG1ldGhvZCBvZiBleHRlbmRpbmcgYSBxdWVyeVNlbGVjdCBmb3IgZXhhbXBsZSxcclxuICAgIC8vIHdhcyB0byBtb2RpZnkgdGhlIHByb3RveXBlIG9mIHRoZSB2aWV3J3MgcXVlcnlTZWxlY3QgYXJyYXkuXHJcbiAgICBpZiAodGhpcy5xdWVyeVNlbGVjdCAmJiB0aGlzLnF1ZXJ5U2VsZWN0Lmxlbmd0aCkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHF1ZXJ5U2VsZWN0IGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIGlmICghcXVlcnlNb2RlbC5xdWVyeVNlbGVjdCkge1xyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlTZWxlY3QgPSBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcXVlcnlNb2RlbC5xdWVyeVNlbGVjdCA9IHF1ZXJ5TW9kZWwucXVlcnlTZWxlY3QuY29uY2F0KHRoaXMucXVlcnlTZWxlY3QuZmlsdGVyKChpdGVtKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5TW9kZWwucXVlcnlTZWxlY3QuaW5kZXhPZihpdGVtKSA8IDA7XHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUluY2x1ZGUgJiYgdGhpcy5xdWVyeUluY2x1ZGUubGVuZ3RoKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlJbmNsdWRlIGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIGlmICghcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUpIHtcclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZSA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZSA9IHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlLmNvbmNhdCh0aGlzLnF1ZXJ5SW5jbHVkZS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICByZXR1cm4gcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUuaW5kZXhPZihpdGVtKSA8IDA7XHJcbiAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeVdoZXJlKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlXaGVyZSBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBxdWVyeU1vZGVsLnF1ZXJ5V2hlcmUgPSB0aGlzLnF1ZXJ5V2hlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlBcmdzKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlBcmdzIGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlBcmdzID0gbGFuZy5taXhpbih7fSwgcXVlcnlNb2RlbC5xdWVyeUFyZ3MsIHRoaXMucXVlcnlBcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeU9yZGVyQnkgJiYgdGhpcy5xdWVyeU9yZGVyQnkubGVuZ3RoKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlPcmRlckJ5IGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucXVlcnlPcmRlckJ5KSkge1xyXG4gICAgICAgIGlmICghcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkpIHtcclxuICAgICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5ID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSA9IHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5LmNvbmNhdCh0aGlzLnF1ZXJ5T3JkZXJCeS5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeS5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgICB9KSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkgPSB0aGlzLnF1ZXJ5T3JkZXJCeTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc291cmNlUHJvcGVydHkpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyByZXNvdXJjZVByb3BlcnR5IGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIHF1ZXJ5TW9kZWwucmVzb3VyY2VQcm9wZXJ0eSA9IHRoaXMucmVzb3VyY2VQcm9wZXJ0eTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZVByZWRpY2F0ZSkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHJlc291cmNlUHJlZGljYXRlIGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIHF1ZXJ5TW9kZWwucmVzb3VyY2VQcmVkaWNhdGUgPSB0aGlzLnJlc291cmNlUHJlZGljYXRlO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19