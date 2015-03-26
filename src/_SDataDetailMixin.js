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
define('argos/_SDataDetailMixin', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    './Utility',
    './Store/SData'
], function(
    declare,
    lang,
    string,
    utility,
    SData
) {
    var __class = declare('argos._SDataDetailMixin', null, {

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

        createStore: function() {
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
                scope: this
            });
        },
        _buildGetExpression: function() {
            var options = this.options;

            return options && (options.id || options.key);
        },
        _applyStateToGetOptions: function(getOptions) {
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
        formatRelatedQuery: function(entry, fmt, property) {
            property = property || '$key';
            return string.substitute(fmt, [utility.getValue(entry, property, '')]);
        }
    });

    lang.setObject('Sage.Platform.Mobile._SDataDetailMixin', __class);
    return __class;
});

