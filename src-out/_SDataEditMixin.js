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
 * @class argos._SDataEditMixin
 *
 * Enables SData for the Edit view.
 * Extends the SDataDetail Mixin by providing functions for $template requests.
 *
 * @alternateClassName _SDataEditMixin
 * @extends argos._SDataDetailMixin
 * @requires argos.SData
 */
define('argos/_SDataEditMixin', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'dojo/dom-class',
    'dojo/_base/connect',
    './Store/SData',
    './ErrorManager',
    './Convert',
    './_SDataDetailMixin'
], function (declare, lang, string, domClass, connect, SData, ErrorManager, convert, _SDataDetailMixin) {
    var __class = declare('argos._SDataEditMixin', [_SDataDetailMixin], {
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
        diffPropertyIgnores: [
            '$etag',
            '$updated'
        ],
        _buildRefreshMessage: function (entry, result) {
            var message = this.inherited(arguments);
            return lang.mixin(message, {
                resourceKind: this.resourceKind
            });
        },
        onRefresh: function () {
            this.entry = false;
        },
        onRefreshInsert: function () {
            if (this.options.template) {
                this.processTemplateEntry(this.options.template);
            }
            else {
                this.requestTemplate();
            }
        },
        createEntryForUpdate: function (values) {
            values = this.inherited(arguments);
            values = lang.mixin(values, {
                '$key': this.entry['$key'],
                '$etag': this.entry['$etag'],
                '$name': this.entry['$name']
            });
            if (!this._isConcurrencyCheckEnabled()) {
                delete values['$etag'];
            }
            return values;
        },
        createEntryForInsert: function (values) {
            values = this.inherited(arguments);
            return lang.mixin(values, {
                '$name': this.entityName
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
        applyContext: function (templateEntry) {
        },
        /**
         * Creates Sage.SData.Client.SDataTemplateResourceRequest instance and sets a number of known properties.
         *
         * List of properties used `this.property/this.options.property`:
         *
         * `resourceKind`, `querySelect`, `queryInclude`
         *
         * @return {Object} Sage.SData.Client.SDataTemplateResourceRequest instance.
         */
        createTemplateRequest: function () {
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
        requestTemplate: function () {
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
        onRequestTemplateFailure: function (response, o) {
            this.handleError(response);
        },
        /**
         * Handler when a request to SData is successful, calls processTemplateEntry
         * @param {Object} entry The SData response
         */
        onRequestTemplateSuccess: function (entry) {
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
        processTemplateEntry: function (templateEntry) {
            this.templateEntry = this.convertEntry(templateEntry || {});
            this.setValues(this.templateEntry, true);
            this.applyFieldDefaults();
            this.applyContext(this.templateEntry);
            // if an entry has been passed through options, apply it here, now that the template has been applied.
            // in this case, since we are doing an insert (only time template is used), the entry is applied as modified data.
            if (this.options.entry) {
                this.entry = this.convertEntry(this.options.entry);
                this.setValues(this.entry);
            }
            domClass.remove(this.domNode, 'panel-loading');
        },
        /**
         * Does the reverse of {@link #convertEntry convertEntry} in that it loops the payload being
         * sent back to SData and converts Date objects into SData date strings
         * @param {Object} values Payload
         * @return {Object} Entry with string dates
         */
        convertValues: function (values) {
            for (var n in values) {
                if (values[n] instanceof Date) {
                    values[n] = this.getService().isJsonEnabled()
                        ? convert.toJsonStringFromDate(values[n])
                        : convert.toIsoStringFromDate(values[n]);
                }
            }
            return values;
        },
        /**
         * Loops a given entry testing for SData date strings and converts them to javascript Date objects
         * @param {Object} entry SData entry
         * @return {Object} Entry with actual Date objects
         */
        convertEntry: function (entry) {
            for (var n in entry) {
                if (convert.isDateString(entry[n])) {
                    entry[n] = convert.toDateFromString(entry[n]);
                }
            }
            return entry;
        },
        _applyStateToPutOptions: function (putOptions) {
            var store = this.get('store');
            if (this._isConcurrencyCheckEnabled()) {
                // The SData store will take the version and apply it to the etag
                putOptions.version = store.getVersion(this.entry);
            }
            putOptions.entity = store.getEntity(this.entry) || this.entityName;
        },
        _applyStateToAddOptions: function (addOptions) {
            addOptions.entity = this.entityName;
        },
        _isConcurrencyCheckEnabled: function () {
            return App && App.enableConcurrencyCheck;
        }
    });
    lang.setObject('Sage.Platform.Mobile._SDataEditMixin', __class);
    return __class;
});
