define('argos/_SDataEditMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'dojo/dom-class', 'dojo/_base/connect', './Store/SData', './ErrorManager', './Convert', './_SDataDetailMixin'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoString, _dojoDomClass, _dojo_baseConnect, _StoreSData, _ErrorManager, _Convert, _SDataDetailMixin2) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _string = _interopRequireDefault(_dojoString);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _connect = _interopRequireDefault(_dojo_baseConnect);

    var _SData = _interopRequireDefault(_StoreSData);

    var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

    var _convert = _interopRequireDefault(_Convert);

    var _SDataDetailMixin3 = _interopRequireDefault(_SDataDetailMixin2);

    var __class = (0, _declare['default'])('argos._SDataEditMixin', [_SDataDetailMixin3['default']], {
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

        _buildRefreshMessage: function _buildRefreshMessage(entry, result) {
            var message = this.inherited(arguments);

            return _lang['default'].mixin(message, {
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
        createEntryForUpdate: function createEntryForUpdate(values) {
            values = this.inherited(arguments);
            values = _lang['default'].mixin(values, {
                '$key': this.entry['$key'],
                '$etag': this.entry['$etag'],
                '$name': this.entry['$name']
            });

            if (!this._isConcurrencyCheckEnabled()) {
                delete values['$etag'];
            }

            return values;
        },
        createEntryForInsert: function createEntryForInsert(values) {
            values = this.inherited(arguments);
            return _lang['default'].mixin(values, {
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
        applyContext: function applyContext(templateEntry) {},
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
        onRequestTemplateFailure: function onRequestTemplateFailure(response, o) {
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

            this.setValues(this.templateEntry, true);
            this.applyFieldDefaults();
            this.applyContext(this.templateEntry);

            // if an entry has been passed through options, apply it here, now that the template has been applied.
            // in this case, since we are doing an insert (only time template is used), the entry is applied as modified data.
            if (this.options.entry) {
                this.entry = this.convertEntry(this.options.entry);
                this.setValues(this.entry);
            }

            _domClass['default'].remove(this.domNode, 'panel-loading');
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
                    values[n] = this.getService().isJsonEnabled() ? _convert['default'].toJsonStringFromDate(values[n]) : _convert['default'].toIsoStringFromDate(values[n]);
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
                if (_convert['default'].isDateString(entry[n])) {
                    entry[n] = _convert['default'].toDateFromString(entry[n]);
                }
            }

            return entry;
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
        }
    });

    _lang['default'].setObject('Sage.Platform.Mobile._SDataEditMixin', __class);
    module.exports = __class;
});
