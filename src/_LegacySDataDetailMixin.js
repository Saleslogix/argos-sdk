/*
 * Copyright (c) 1997-2014, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * _LegacySDataDetailMixin enables legacy SData operations for the Detail view.
 *
 * @alternateClassName _LegacySDataDetailMixin
 */
define('argos/_LegacySDataDetailMixin', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/string',
    './ErrorManager'
], function(
    declare,
    lang,
    domClass,
    domConstruct,
    string,
    ErrorManager
) {
    var __class = declare('argos._LegacySDataDetailMixin', null, {
        /**
         * Initiates the SData request.
         */
        requestData: function() {
            var request;
            request = this.createRequest();

            if (request) {
                request.read({
                    success: this.onRequestDataSuccess,
                    failure: this.onRequestDataFailure,
                    aborted: this.onRequestDataAborted,
                    scope: this
                });
            }
        },
        /**
         * Creates Sage.SData.Client.SDataSingleResourceRequest instance and sets a number of known properties.
         *
         * List of properties used `this.property/this.options.property`:
         *
         * `/key`, `resourceKind`, `querySelect`, `queryInclude`, `queryOrderBy`, and `contractName`
         *
         * @return {Object} Sage.SData.Client.SDataSingleResourceRequest instance.
         */
        createRequest: function() {
            var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());

            /* test for complex selector */
            /* todo: more robust test required? */
            if (/(\s+)/.test(this.options.key)) {
                request.setResourceSelector(this.options.key);
            } else {
                request.setResourceSelector(string.substitute("'${0}'", [this.options.key]));
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

            if (this.contractName) {
                request.setContractName(this.contractName);
            }

            return request;
        },
        /**
         * Saves the SData response to `this.entry` and invokes {@link #processLayout processLayout} by passing the customized
         * layout definition. If no entry is provided, empty the screen.
         * @param {Object} entry SData response
         */
        processEntry: function(entry) {
            this.entry = entry;

            if (this.entry) {
                this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
            } else {
                this.set('detailContent', '');
            }
        },
        /**
         * Handler when a request to SData is successful
         * @param {Object} entry The SData response
         */
        onRequestDataSuccess: function(entry) {
            this.processEntry(entry);
            domClass.remove(this.domNode, 'panel-loading');
        },
        /**
         * Handler when an error occurs while request data from the SData endpoint.
         * @param {Object} response The response object.
         * @param {Object} o The options that were passed when creating the Ajax request.
         */
        onRequestDataFailure: function(response, o) {
            if (response && response.status === 404) {
                domConstruct.place(this.notAvailableTemplate.apply(this), this.contentNode, 'last');
            } else {
                alert(string.substitute(this.requestErrorText, [response, o]));
                ErrorManager.addError('failure', response);
            }

            domClass.remove(this.domNode, 'panel-loading');
        },
        /**
         * Handler when an a request is aborted from an SData endpoint.
         *
         * Clears the `this.options` object which will by default force a refresh of the view.
         *
         * @param {Object} response The response object.
         * @param {Object} o The options that were passed when creating the Ajax request.
         */
        onRequestDataAborted: function(response, o) {
            this.options = false; // force a refresh
            ErrorManager.addError('aborted', response);
            domClass.remove(this.domNode, 'panel-loading');
        }
    });

    lang.setObject('Sage.Platform.Mobile._LegacySDataDetailMixin', __class);
    return __class;
});

