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
 * @class Sage.Platform.Mobile._SDataListMixin
 *
 * Enables SData for the List view.
 * Adds the SData store to the view and exposes the needed properties for creating a Feed request.
 *
 * @alternateClassName _SDataListMixin
 * @requires Sage.Platform.Mobile.SData
 * @requires Sage.Platform.Mobile.Utility
 */
define('Sage/Platform/Mobile/_SDataListMixin', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'Sage/Platform/Mobile/Store/SData',
    'Sage/Platform/Mobile/Utility',
    'Sage/Platform/Mobile/ErrorManager',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/string'
], function(
    declare,
    lang,
    SData,
    utility,
    ErrorManager,
    domConstruct,
    domClass,
    string
) {
    return declare('Sage.Platform.Mobile._SDataListMixin', null, {

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
        querySelect: null,
        /**
         * @cfg {String[]?}
         * A list of child properties to be included in an SData request.
         */
        queryInclude: null,
        /**
         * @cfg {String}
         * The default order by expression for an SData request.
         */
        queryOrderBy: null,
        /**
         * @cfg {String/Function}
         * The default where expression for an SData request.
         */
        queryWhere: null,
        /**
         * @cfg {Object}
         * Key/value map of additional query arguments to add to the request.
         * Example:
         *     queryArgs: { _filter: 'Active' }
         *
         *     /sdata/app/dynamic/-/resource?_filter=Active&where=""&format=json
         */
        queryArgs: null,
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

        /**
         * Constructs a where expression using the provided format string and extracting the needed property from entry
         * @param {Object} entry Data point to extract from.
         * @param {String} fmt Format string to be replaced where `${0}` will be the extracted property.
         * @param {String} property Property name to extract from the entry. May be a path: `'Address.City'`.
         * @return {String}
         */
        formatRelatedQuery: function(entry, fmt, property) {
            return string.substitute(fmt, [lang.getObject(property || '$key', false, entry)]);
        },
        getContext: function() {
            return lang.mixin(this.inherited(arguments), {
                resourceKind: this.resourceKind
            });
        },
        _onRefresh: function(options) {
            if (this.resourceKind && options.resourceKind === this.resourceKind) {
                this.refreshRequired = true;
            }
        },
        createStore: function() {
            return new SData({
                service: this.getConnection(),
                contractName: this.contractName,
                resourceKind: this.resourceKind,
                resourceProperty: this.resourceProperty,
                resourcePredicate: this.resourcePredicate,
                include: this.queryInclude,
                select: this.querySelect,
                where: this.queryWhere,
                queryArgs: this.queryArgs,
                orderBy: this.queryOrderBy,
                itemsProperty: this.itemsProperty,
                idProperty: this.idProperty,
                labelProperty: this.labelProperty,
                entityProperty: this.entityProperty,
                versionProperty: this.versionProperty,
                scope: this
            });
        },
        _buildQueryExpression: function() {
            var options = this.options,
                passed = options && (options.query || options.where);

            return passed
                ? this.query
                    ? '(' + utility.expand(this, passed) + ') and (' + this.query + ')'
                    : '(' + utility.expand(this, passed) + ')'
                : this.query;
        },
        _applyStateToQueryOptions: function(queryOptions) {
            var options = this.options;
            if (options) {
                if (options.select) queryOptions.select = options.select;
                if (options.include) queryOptions.include = options.include;
                if (options.orderBy) queryOptions.sort = options.orderBy;
                if (options.contractName) queryOptions.contractName = options.contractName;
                if (options.resourceKind) queryOptions.resourceKind = options.resourceKind;
                if (options.resourceProperty) queryOptions.resourceProperty = options.resourceProperty;
                if (options.resourcePredicate) queryOptions.resourcePredicate = options.resourcePredicate;
                if (options.queryArgs) queryOptions.queryArgs = options.queryArgs;
            }
        },
        formatSearchQuery: function(query) {
            return query;
        },
        escapeSearchQuery: function(query) {
            return (query || '').replace(/"/g, '""');
        },
        hasMoreData: function() {
            var start, count, total;
            start = this.position;
            count = this.pageSize;
            total = this.total;

            if (start > 0 && count > 0 && total >= 0) {
                return (start + count <= total);
            } else {
                return true; // no way to determine, always assume more data
            }
        }
    });
});
