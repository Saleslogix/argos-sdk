define('argos/_SDataDetailMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', './Utility', './Store/SData', './Models/Types'], function (module, exports, _declare, _lang, _string, _Utility, _SData, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _SData2 = _interopRequireDefault(_SData);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @class argos._SDataDetailMixin
   *
   * @classdesc Enables SData for the Detail view.
   * Adds the SData store to the view and exposes the needed properties for creating a Entry request.
   * @requires argos.SData
   */
  var __class = (0, _declare2.default)('argos._SDataDetailMixin', null, /** @lends argos._SDataDetailMixin# */{

    /**
     * @cfg {String} resourceKind
     * The SData resource kind the view is responsible for.  This will be used as the default resource kind
     * for all SData requests.
     */
    resourceKind: '',

    contractName: 'dynamic',

    /**
     * @cfg {String[]}
     * A list of fields to be selected in an SData request.
     */
    querySelect: [],
    /**
     * @cfg {String[]?}
     * A list of child properties to be included in an SData request.
     */
    queryInclude: [],
    /**
     * @cfg {String?/Function?}
     * The default resource property for an SData request.
     */
    resourceProperty: null,
    /**
     * @cfg {String?/Function?}
     * The default resource predicate for an SData request.
     */
    resourcePredicate: null,

    itemsProperty: '$resources',
    idProperty: '$key',
    labelProperty: '$descriptor',
    entityProperty: '$name',
    versionProperty: '$etag',

    createStore: function createStore() {
      return new _SData2.default({
        service: this.getConnection(),
        contractName: this.contractName,
        resourceKind: this.resourceKind,
        resourceProperty: this.resourceProperty,
        resourcePredicate: this.resourcePredicate,
        include: this.queryInclude,
        select: this.querySelect,
        itemsProperty: this.itemsProperty,
        idProperty: this.idProperty,
        labelProperty: this.labelProperty,
        entityProperty: this.entityProperty,
        versionProperty: this.versionProperty,
        scope: this
      });
    },
    _buildGetExpression: function _buildGetExpression() {
      var options = this.options;

      return options && (options.id || options.key);
    },
    _applyStateToGetOptions: function _applyStateToGetOptions(getOptions) {
      var options = this.options;
      if (options) {
        if (options.select) {
          getOptions.select = options.select;
        }

        if (options.include) {
          getOptions.include = options.include;
        }

        if (options.contractName) {
          getOptions.contractName = options.contractName;
        }

        if (options.resourceKind) {
          getOptions.resourceKind = options.resourceKind;
        }

        if (options.resourceProperty) {
          getOptions.resourceProperty = options.resourceProperty;
        }

        if (options.resourcePredicate) {
          getOptions.resourcePredicate = options.resourcePredicate;
        }
      }
    },
    /**
     * Applies the entries property to a format string
     * @param {Object} entry Data entry
     * @param {String} fmt Where expression to be formatted, `${0}` will be the extracted property.
     * @param {String} property Property name to extract from the entry, may be a path: `Address.City`.
     * @return {String}
     */
    formatRelatedQuery: function formatRelatedQuery(entry, fmt, prop) {
      var property = prop;
      property = property || '$key';
      var rawValue = _Utility2.default.getValue(entry, property, '');
      if (typeof rawValue !== 'undefined' && rawValue !== null) {
        return _string2.default.substitute(fmt, [rawValue]);
      }

      return '';
    },
    /**
     * Initializes the model instance that is return with the curernt view.
     */
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
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fU0RhdGFEZXRhaWxNaXhpbi5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwicmVzb3VyY2VLaW5kIiwiY29udHJhY3ROYW1lIiwicXVlcnlTZWxlY3QiLCJxdWVyeUluY2x1ZGUiLCJyZXNvdXJjZVByb3BlcnR5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJpdGVtc1Byb3BlcnR5IiwiaWRQcm9wZXJ0eSIsImxhYmVsUHJvcGVydHkiLCJlbnRpdHlQcm9wZXJ0eSIsInZlcnNpb25Qcm9wZXJ0eSIsImNyZWF0ZVN0b3JlIiwic2VydmljZSIsImdldENvbm5lY3Rpb24iLCJpbmNsdWRlIiwic2VsZWN0Iiwic2NvcGUiLCJfYnVpbGRHZXRFeHByZXNzaW9uIiwib3B0aW9ucyIsImlkIiwia2V5IiwiX2FwcGx5U3RhdGVUb0dldE9wdGlvbnMiLCJnZXRPcHRpb25zIiwiZm9ybWF0UmVsYXRlZFF1ZXJ5IiwiZW50cnkiLCJmbXQiLCJwcm9wIiwicHJvcGVydHkiLCJyYXdWYWx1ZSIsImdldFZhbHVlIiwic3Vic3RpdHV0ZSIsImluaXRNb2RlbCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJfbW9kZWwiLCJpbml0IiwiTW9kZWxUeXBlIiwiU0RBVEEiLCJfYXBwbHlWaWV3VG9Nb2RlbCIsInF1ZXJ5TW9kZWwiLCJfZ2V0UXVlcnlNb2RlbEJ5TmFtZSIsImxlbmd0aCIsImNvbnNvbGUiLCJ3YXJuIiwiY29uY2F0IiwiZmlsdGVyIiwiaXRlbSIsImluZGV4T2YiLCJxdWVyeVdoZXJlIiwicXVlcnlBcmdzIiwibWl4aW4iLCJxdWVyeU9yZGVyQnkiLCJBcnJheSIsImlzQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7O0FBY0EsTUFBTUEsVUFBVSx1QkFBUSx5QkFBUixFQUFtQyxJQUFuQyxFQUF5QyxzQ0FBc0M7O0FBRTdGOzs7OztBQUtBQyxrQkFBYyxFQVArRTs7QUFTN0ZDLGtCQUFj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QUFDRjs7QUFFRCxVQUFJLEtBQUsvQyxnQkFBVCxFQUEyQjtBQUN6QjtBQUNBc0MsZ0JBQVFDLElBQVI7QUFDQTtBQUNBSixtQkFBV25DLGdCQUFYLEdBQThCLEtBQUtBLGdCQUFuQztBQUNEOztBQUVELFVBQUksS0FBS0MsaUJBQVQsRUFBNEI7QUFDMUI7QUFDQXFDLGdCQUFRQyxJQUFSO0FBQ0E7QUFDQUosbUJBQVdsQyxpQkFBWCxHQUErQixLQUFLQSxpQkFBcEM7QUFDRDtBQUNGO0FBOU00RixHQUEvRSxDQUFoQjs7b0JBaU5lTixPIiwiZmlsZSI6Il9TRGF0YURldGFpbE1peGluLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9TRGF0YURldGFpbE1peGluXHJcbiAqXHJcbiAqIEBjbGFzc2Rlc2MgRW5hYmxlcyBTRGF0YSBmb3IgdGhlIERldGFpbCB2aWV3LlxyXG4gKiBBZGRzIHRoZSBTRGF0YSBzdG9yZSB0byB0aGUgdmlldyBhbmQgZXhwb3NlcyB0aGUgbmVlZGVkIHByb3BlcnRpZXMgZm9yIGNyZWF0aW5nIGEgRW50cnkgcmVxdWVzdC5cclxuICogQHJlcXVpcmVzIGFyZ29zLlNEYXRhXHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcclxuaW1wb3J0IFNEYXRhIGZyb20gJy4vU3RvcmUvU0RhdGEnO1xyXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi9Nb2RlbHMvVHlwZXMnO1xyXG5cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLl9TRGF0YURldGFpbE1peGluJywgbnVsbCwgLyoqIEBsZW5kcyBhcmdvcy5fU0RhdGFEZXRhaWxNaXhpbiMgKi97XHJcblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ30gcmVzb3VyY2VLaW5kXHJcbiAgICogVGhlIFNEYXRhIHJlc291cmNlIGtpbmQgdGhlIHZpZXcgaXMgcmVzcG9uc2libGUgZm9yLiAgVGhpcyB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgcmVzb3VyY2Uga2luZFxyXG4gICAqIGZvciBhbGwgU0RhdGEgcmVxdWVzdHMuXHJcbiAgICovXHJcbiAgcmVzb3VyY2VLaW5kOiAnJyxcclxuXHJcbiAgY29udHJhY3ROYW1lOiAnZHluYW1pYycsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ1tdfVxyXG4gICAqIEEgbGlzdCBvZiBmaWVsZHMgdG8gYmUgc2VsZWN0ZWQgaW4gYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICBxdWVyeVNlbGVjdDogW10sXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nW10/fVxyXG4gICAqIEEgbGlzdCBvZiBjaGlsZCBwcm9wZXJ0aWVzIHRvIGJlIGluY2x1ZGVkIGluIGFuIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcXVlcnlJbmNsdWRlOiBbXSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmc/L0Z1bmN0aW9uP31cclxuICAgKiBUaGUgZGVmYXVsdCByZXNvdXJjZSBwcm9wZXJ0eSBmb3IgYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXNvdXJjZVByb3BlcnR5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZz8vRnVuY3Rpb24/fVxyXG4gICAqIFRoZSBkZWZhdWx0IHJlc291cmNlIHByZWRpY2F0ZSBmb3IgYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXNvdXJjZVByZWRpY2F0ZTogbnVsbCxcclxuXHJcbiAgaXRlbXNQcm9wZXJ0eTogJyRyZXNvdXJjZXMnLFxyXG4gIGlkUHJvcGVydHk6ICcka2V5JyxcclxuICBsYWJlbFByb3BlcnR5OiAnJGRlc2NyaXB0b3InLFxyXG4gIGVudGl0eVByb3BlcnR5OiAnJG5hbWUnLFxyXG4gIHZlcnNpb25Qcm9wZXJ0eTogJyRldGFnJyxcclxuXHJcbiAgY3JlYXRlU3RvcmU6IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBTRGF0YSh7XHJcbiAgICAgIHNlcnZpY2U6IHRoaXMuZ2V0Q29ubmVjdGlvbigpLFxyXG4gICAgICBjb250cmFjdE5hbWU6IHRoaXMuY29udHJhY3ROYW1lLFxyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICByZXNvdXJjZVByb3BlcnR5OiB0aGlzLnJlc291cmNlUHJvcGVydHksXHJcbiAgICAgIHJlc291cmNlUHJlZGljYXRlOiB0aGlzLnJlc291cmNlUHJlZGljYXRlLFxyXG4gICAgICBpbmNsdWRlOiB0aGlzLnF1ZXJ5SW5jbHVkZSxcclxuICAgICAgc2VsZWN0OiB0aGlzLnF1ZXJ5U2VsZWN0LFxyXG4gICAgICBpdGVtc1Byb3BlcnR5OiB0aGlzLml0ZW1zUHJvcGVydHksXHJcbiAgICAgIGlkUHJvcGVydHk6IHRoaXMuaWRQcm9wZXJ0eSxcclxuICAgICAgbGFiZWxQcm9wZXJ0eTogdGhpcy5sYWJlbFByb3BlcnR5LFxyXG4gICAgICBlbnRpdHlQcm9wZXJ0eTogdGhpcy5lbnRpdHlQcm9wZXJ0eSxcclxuICAgICAgdmVyc2lvblByb3BlcnR5OiB0aGlzLnZlcnNpb25Qcm9wZXJ0eSxcclxuICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIF9idWlsZEdldEV4cHJlc3Npb246IGZ1bmN0aW9uIF9idWlsZEdldEV4cHJlc3Npb24oKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgIHJldHVybiBvcHRpb25zICYmIChvcHRpb25zLmlkIHx8IG9wdGlvbnMua2V5KTtcclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9HZXRPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucyhnZXRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0KSB7XHJcbiAgICAgICAgZ2V0T3B0aW9ucy5zZWxlY3QgPSBvcHRpb25zLnNlbGVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaW5jbHVkZSkge1xyXG4gICAgICAgIGdldE9wdGlvbnMuaW5jbHVkZSA9IG9wdGlvbnMuaW5jbHVkZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgICAgZ2V0T3B0aW9ucy5jb250cmFjdE5hbWUgPSBvcHRpb25zLmNvbnRyYWN0TmFtZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgICAgZ2V0T3B0aW9ucy5yZXNvdXJjZUtpbmQgPSBvcHRpb25zLnJlc291cmNlS2luZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucmVzb3VyY2VQcm9wZXJ0eSkge1xyXG4gICAgICAgIGdldE9wdGlvbnMucmVzb3VyY2VQcm9wZXJ0eSA9IG9wdGlvbnMucmVzb3VyY2VQcm9wZXJ0eTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGUpIHtcclxuICAgICAgICBnZXRPcHRpb25zLnJlc291cmNlUHJlZGljYXRlID0gb3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQXBwbGllcyB0aGUgZW50cmllcyBwcm9wZXJ0eSB0byBhIGZvcm1hdCBzdHJpbmdcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgRGF0YSBlbnRyeVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmbXQgV2hlcmUgZXhwcmVzc2lvbiB0byBiZSBmb3JtYXR0ZWQsIGAkezB9YCB3aWxsIGJlIHRoZSBleHRyYWN0ZWQgcHJvcGVydHkuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IFByb3BlcnR5IG5hbWUgdG8gZXh0cmFjdCBmcm9tIHRoZSBlbnRyeSwgbWF5IGJlIGEgcGF0aDogYEFkZHJlc3MuQ2l0eWAuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGZvcm1hdFJlbGF0ZWRRdWVyeTogZnVuY3Rpb24gZm9ybWF0UmVsYXRlZFF1ZXJ5KGVudHJ5LCBmbXQsIHByb3ApIHtcclxuICAgIGxldCBwcm9wZXJ0eSA9IHByb3A7XHJcbiAgICBwcm9wZXJ0eSA9IHByb3BlcnR5IHx8ICcka2V5JztcclxuICAgIGNvbnN0IHJhd1ZhbHVlID0gdXRpbGl0eS5nZXRWYWx1ZShlbnRyeSwgcHJvcGVydHksICcnKTtcclxuICAgIGlmICh0eXBlb2YgcmF3VmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHJhd1ZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RpdHV0ZShmbXQsIFtyYXdWYWx1ZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnJztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemVzIHRoZSBtb2RlbCBpbnN0YW5jZSB0aGF0IGlzIHJldHVybiB3aXRoIHRoZSBjdXJlcm50IHZpZXcuXHJcbiAgICovXHJcbiAgaW5pdE1vZGVsOiBmdW5jdGlvbiBpbml0TW9kZWwoKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKTtcclxuICAgIGlmIChtb2RlbCkge1xyXG4gICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICB0aGlzLl9tb2RlbC5pbml0KCk7XHJcbiAgICAgIGlmICh0aGlzLl9tb2RlbC5Nb2RlbFR5cGUgPT09IE1PREVMX1RZUEVTLlNEQVRBKSB7XHJcbiAgICAgICAgdGhpcy5fYXBwbHlWaWV3VG9Nb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIF9hcHBseVZpZXdUb01vZGVsOiBmdW5jdGlvbiBfYXBwbHlWaWV3VG9Nb2RlbChtb2RlbCkge1xyXG4gICAgaWYgKCFtb2RlbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXVlcnlNb2RlbCA9IG1vZGVsLl9nZXRRdWVyeU1vZGVsQnlOYW1lKCdkZXRhaWwnKTtcclxuICAgIGlmICh0aGlzLnJlc291cmNlS2luZCkge1xyXG4gICAgICBtb2RlbC5yZXNvdXJjZUtpbmQgPSB0aGlzLnJlc291cmNlS2luZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXF1ZXJ5TW9kZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEF0dGVtcHQgdG8gbWl4aW4gdGhlIHZpZXcncyBxdWVyeVNlbGVjdCwgcXVlcnlJbmNsdWRlLCBxdWVyeVdoZXJlLFxyXG4gICAgLy8gcXVlcnlBcmdzLCBxdWVyeU9yZGVyQnksIHJlc291cmNlUHJvcGVydHksIHJlc291cmNlUHJlZGljYXRlIHByb3BlcnRpZXNcclxuICAgIC8vIGludG8gdGhlIGxheW91dC4gVGhlIHBhc3QgbWV0aG9kIG9mIGV4dGVuZGluZyBhIHF1ZXJ5U2VsZWN0IGZvciBleGFtcGxlLFxyXG4gICAgLy8gd2FzIHRvIG1vZGlmeSB0aGUgcHJvdG95cGUgb2YgdGhlIHZpZXcncyBxdWVyeVNlbGVjdCBhcnJheS5cclxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0ICYmIHRoaXMucXVlcnlTZWxlY3QubGVuZ3RoKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlTZWxlY3QgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0KSB7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeVNlbGVjdCA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0ID0gcXVlcnlNb2RlbC5xdWVyeVNlbGVjdC5jb25jYXQodGhpcy5xdWVyeVNlbGVjdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICByZXR1cm4gcXVlcnlNb2RlbC5xdWVyeVNlbGVjdC5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5SW5jbHVkZSAmJiB0aGlzLnF1ZXJ5SW5jbHVkZS5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeUluY2x1ZGUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZSkge1xyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUuY29uY2F0KHRoaXMucXVlcnlJbmNsdWRlLmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZS5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5V2hlcmUpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeVdoZXJlIGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlXaGVyZSA9IHRoaXMucXVlcnlXaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUFyZ3MpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeUFyZ3MgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5xdWVyeUFyZ3MgPSBsYW5nLm1peGluKHt9LCBxdWVyeU1vZGVsLnF1ZXJ5QXJncywgdGhpcy5xdWVyeUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5T3JkZXJCeSAmJiB0aGlzLnF1ZXJ5T3JkZXJCeS5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeU9yZGVyQnkgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5xdWVyeU9yZGVyQnkpKSB7XHJcbiAgICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSkge1xyXG4gICAgICAgICAgcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5ID0gcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkuY29uY2F0KHRoaXMucXVlcnlPcmRlckJ5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5LmluZGV4T2YoaXRlbSkgPCAwO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSA9IHRoaXMucXVlcnlPcmRlckJ5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VQcm9wZXJ0eSkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHJlc291cmNlUHJvcGVydHkgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5yZXNvdXJjZVByb3BlcnR5ID0gdGhpcy5yZXNvdXJjZVByb3BlcnR5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc291cmNlUHJlZGljYXRlKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcmVzb3VyY2VQcmVkaWNhdGUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5yZXNvdXJjZVByZWRpY2F0ZSA9IHRoaXMucmVzb3VyY2VQcmVkaWNhdGU7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=