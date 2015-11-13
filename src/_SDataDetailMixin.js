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
 * Enables SData for the Detail view.
 * Adds the SData store to the view and exposes the needed properties for creating a Entry request.
 *
 * @alternateClassName _SDataDetailMixin
 * @requires argos.SData
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import utility from './Utility';
import SData from './Store/SData';
import MODEL_TYPES from 'argos/Models/Types';

const __class = declare('argos._SDataDetailMixin', null, {

  /**
   * @cfg {String} resourceKind
   * The SData resource kind the view is responsible for.  This will be used as the default resource kind
   * for all SData requests.
   */
  resourceKind: '',
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
    return new SData({
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
      scope: this,
    });
  },
  _buildGetExpression: function _buildGetExpression() {
    const options = this.options;

    return options && (options.id || options.key);
  },
  _applyStateToGetOptions: function _applyStateToGetOptions(getOptions) {
    const options = this.options;
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
    let property = prop;
    property = property || '$key';
    return string.substitute(fmt, [utility.getValue(entry, property, '')]);
  },
  /**
   * Initializes the model instance that is return with the curernt view.
   */
  initModel: function initModel() {
    const model = this.getModel();
    if (model) {
      this._model = model;
      this._model.init();
      if (this._model.ModelType === MODEL_TYPES.SDATA) {
        this._applyViewToModel(this._model);
      }
    }
  },
  _applyViewToModel: function _applyViewToModel(model) {
    if (!model) {
      return;
    }

    const queryModel = model._getQueryModelByName('detail');
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
    if (this.querySelect) {
      /* eslint-disable */
      console.warn(`A view's querySelect is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      if (!queryModel.querySelect) {
        queryModel.querySelect = [];
      }

      queryModel.querySelect = queryModel.querySelect.concat(this.querySelect.filter( (item) => {
        return queryModel.querySelect.indexOf(item) < 0;
      }));
    }

    if (this.queryInclude) {
      /* eslint-disable */
      console.warn(`A view's queryInclude is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      if (!queryModel.queryInclude) {
        queryModel.queryInclude = [];
      }

      queryModel.queryInclude = queryModel.queryInclude.concat(this.queryInclude.filter( (item) => {
        return queryModel.queryInclude.indexOf(item) < 0;
      }));
    }

    if (this.queryWhere) {
      /* eslint-disable */
      console.warn(`A view's queryWhere is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.queryWhere = this.queryWhere;
    }

    if (this.queryArgs) {
      /* eslint-disable */
      console.warn(`A view's queryArgs is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.queryArgs = lang.mixin({}, queryModel.queryArgs, this.queryArgs);
    }

    if (this.queryOrderBy) {
      /* eslint-disable */
      console.warn(`A view's queryOrderBy is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      if (Array.isArray(this.queryOrderBy)) {
        if (!queryModel.queryOrderBy) {
          queryModel.queryOrderBy = [];
        }

        queryModel.queryOrderBy = queryModel.queryOrderBy.concat(this.queryOrderBy.filter( (item) => {
          return queryModel.queryOrderBy.indexOf(item) < 0;
        }));
      } else {
        queryModel.queryOrderBy = this.queryOrderBy;
      }
    }

    if (this.resourceProperty) {
      /* eslint-disable */
      console.warn(`A view's resourceProperty is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.resourceProperty = this.resourceProperty;
    }

    if (this.resourcePredicate) {
      /* eslint-disable */
      console.warn(`A view's resourcePredicate is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.resourcePredicate = this.resourcePredicate;
    }
  },
});

lang.setObject('Sage.Platform.Mobile._SDataDetailMixin', __class);
export default __class;
