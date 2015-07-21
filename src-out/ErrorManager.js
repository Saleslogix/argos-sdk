<<<<<<< HEAD
define('argos/ErrorManager', ['exports', 'module', 'dojo/json', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/string', 'moment', './Utility'], function (exports, module, _dojoJson, _dojo_baseLang, _dojo_baseConnect, _dojoString, _moment, _Utility) {
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

    var _json = _interopRequireDefault(_dojoJson);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _connect = _interopRequireDefault(_dojo_baseConnect);

    var _string = _interopRequireDefault(_dojoString);

    var _moment2 = _interopRequireDefault(_moment);

    var _utility = _interopRequireDefault(_Utility);

    var errors, __class;
=======
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
 * @class argos.ErrorManager
 * ErrorManager is a singleton that parses and stores SData error responses into localStorage.
 * @alternateClassName ErrorManager
 * @singleton
 */
define('argos/ErrorManager', [
    'dojo/json',
    'dojo/_base/lang',
    'dojo/_base/connect',
    'dojo/string',
    'moment',
    './Utility'
], function(
    json,
    lang,
    connect,
    string,
    moment,
    utility
) {
    var errors,
        __class;
>>>>>>> develop

    errors = [];

    try {
        if (window.localStorage) {
            errors = _json['default'].parse(window.localStorage.getItem('errorlog')) || [];
        }
<<<<<<< HEAD
    } catch (e) {}
    /**
     * @class argos.ErrorManager
     * ErrorManager is a singleton that parses and stores SData error responses into localStorage.
     * @alternateClassName ErrorManager
     * @singleton
     */
    __class = _lang['default'].setObject('argos.ErrorManager', {
=======
    } catch(e) {
    }

    __class = lang.setObject('argos.ErrorManager', {
>>>>>>> develop
        //Localization

        /**
         * Text used in place of statusText for aborted errors.
         */
        abortedText: 'Aborted',
        /**
         * Text put in place of the scope property to prevent circular references.
         */
        scopeSaveText: 'Scope is not saved in error report',

        /**
         * @property {Number}
         * Total amount of errors to keep
         */
        errorCacheSizeMax: 10,

        /**
         * Adds a custom error item and fires the onErrorAdd event
         * @param description Short title or description of the Error. Ex: Duplicate Found, Invalid Email
         * @param error Object The error object that will be JSON-stringified and stored for use.
         */
<<<<<<< HEAD
        addSimpleError: function addSimpleError(description, error) {
            var errorItem = {
                '$key': new Date().getTime(),
                'Date': (0, _moment2['default'])().format(),
                'Description': description,
                'Error': _json['default'].stringify(_utility['default'].sanitizeForJson(error))
            };
=======
        addSimpleError: function(description, error) {
            var errorItem = {
                    '$key': new Date().getTime(),
                    'Date': moment().format(),
                    'Description': description,
                    'Error': json.stringify(utility.sanitizeForJson(error))
                };
>>>>>>> develop

            this.checkCacheSize();
            errors.push(errorItem);
            this.onErrorAdd();
            this.save();
        },

        /**
         * Adds a custom error item by combining error message/options for easier tech support
         * @param {Object} serverResponse Full response from server, status, responsetext, etc.
         * @param {Object} requestOptions GET or POST options sent, only records the URL at this time
         * @param {Object} viewOptions The View Options of the view in which the error occurred
         * @param {String} failType Either "failure" or "aborted" as each response has different properties
         */
<<<<<<< HEAD
        addError: function addError(serverResponse, requestOptions, viewOptions, failType) {
=======
        addError: function(serverResponse, requestOptions, viewOptions, failType) {
>>>>>>> develop
            if (typeof serverResponse === 'string' && arguments.length === 2) {
                this.addSimpleError.apply(this, arguments);
                return;
            }

            var errorDate = new Date(),
                dateStamp = new Date().getTime(),
                errorItem = {
<<<<<<< HEAD
                '$key': dateStamp,
                'Date': (0, _moment2['default'])().format(),
                'Error': _json['default'].stringify(_utility['default'].sanitizeForJson({
                    serverResponse: serverResponse,
                    requestOptions: requestOptions,
                    viewOptions: viewOptions,
                    failType: failType
                }))
            };
=======
                    '$key': dateStamp,
                    'Date': moment().format(),
                    'Error': json.stringify(utility.sanitizeForJson({
                        serverResponse: serverResponse,
                        requestOptions: requestOptions,
                        viewOptions: viewOptions,
                        failType: failType
                    }))
                };
>>>>>>> develop

            this.checkCacheSize();
            errors.push(errorItem);
            this.onErrorAdd();
            this.save();
        },

        /**
         * Explicitly extract values due to how read-only objects are enforced
         * @param {Object} response XMLHttpRequest object sent back from server
         * @return {Object} Object with only relevant, standard properties
         */
<<<<<<< HEAD
        extractFailureResponse: function extractFailureResponse(response) {
=======
        extractFailureResponse: function(response) {
>>>>>>> develop
            var failureResponse = {
                '$descriptor': response.statusText,
                'serverResponse': {
                    'readyState': response.readyState,
                    'responseXML': response.responseXML,
                    'status': response.status,
                    'responseType': response.responseType,
                    'withCredentials': response.withCredentials,
                    'responseText': response.responseText ? this.fromJsonArray(response.responseText) : '',
                    'statusText': response.statusText
                }
            };
            return failureResponse;
        },

        /**
         * Attempts to parse a json string into a javascript object
         * The need for this function is the fallback in case of failure
         * @param {String} json Json formatted string or array.
         * @return {Object} Javascript object from json string.
         */
<<<<<<< HEAD
        fromJsonArray: function fromJsonArray(json) {
=======
        fromJsonArray: function(json) {
>>>>>>> develop
            var o;
            try {
                o = json.parse(json);
                o = o[0];
<<<<<<< HEAD
            } catch (e) {
=======
            } catch(e) {
>>>>>>> develop
                o = {
                    message: json,
                    severity: ''
                };
            }
            return o;
        },

        /**
         * Abort error is hardset due to exceptions from reading properties
         * FF 3.6: https://bugzilla.mozilla.org/show_bug.cgi?id=238559
         * @param {Object} response XMLHttpRequest object sent back from server
         * @return {Object} Object with hardset abort info
         */
<<<<<<< HEAD
        extractAbortResponse: function extractAbortResponse(response) {
=======
        extractAbortResponse: function(response) {
>>>>>>> develop
            var abortResponse = {
                '$descriptor': this.abortedText,
                'serverResponse': {
                    'readyState': 4,
                    'responseXML': '',
                    'status': 0,
                    'responseType': '',
                    'withCredentials': response.withCredentials,
                    'responseText': '',
                    'statusText': this.abortedText
                }
            };
            return abortResponse;
        },

        /**
         * Prepares an object for JSON serialization by recursively discarding non value keys
         * @param {Object} obj Object to be JSON serialized
         * @return {Object} Cleaned object for for JSON serialization
         */
<<<<<<< HEAD
        serializeValues: function serializeValues(obj) {
=======
        serializeValues: function(obj) {
>>>>>>> develop
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    switch (typeof obj[key]){
                        case 'undefined':
                            obj[key] = 'undefined';
                            break;
                        case 'function':
                            delete obj[key];
                            break;
                        case 'object':
                            if (obj[key] === null) {
                                obj[key] = 'null';
                                break;
                            }

<<<<<<< HEAD
                            if (key === 'scope') {
                                // eliminate recursive self call
=======
                            if (key === 'scope') { // eliminate recursive self call
>>>>>>> develop
                                obj[key] = this.scopeSaveText;
                                break;
                            }
                            obj[key] = this.serializeValues(obj[key]);
                            break;
                    }
                }
            }

            return obj;
        },

        /**
         * Ensures there is at least 1 open spot for a new error by checking against errorCacheSizeMax
         * and removing old errors as needed
         */
<<<<<<< HEAD
        checkCacheSize: function checkCacheSize() {
=======
        checkCacheSize: function() {
>>>>>>> develop
            var errLength = errors.length,
                cacheSizeIndex = this.errorCacheSizeMax - 1;

            if (errLength > cacheSizeIndex) {
                this.removeError(0, errLength - cacheSizeIndex);
            }
        },

        /**
         * Retrieve a error item that has the specified key|value pair
         * @param {String} key Property of error item to check, such as errorDate or url
         * @param {Number/String} value Value of the key to match against
         * @return {Object} Returns the first error item in the match set or null if none found
         */
<<<<<<< HEAD
        getError: function getError(key, value) {
            var errorList, i;
=======
        getError: function(key, value) {
            var errorList,
                i;
>>>>>>> develop

            errorList = this.getAllErrors();

            for (i = 0; i < errorList.length; i++) {
                if (errorList[i][key] === parseInt(value, 10)) {
                    return errorList[i];
                }
            }

            return null;
        },

        /**
         * Returns a copy of all errors.
         * @return {Object[]} Array of error objects.
         */
<<<<<<< HEAD
        getAllErrors: function getAllErrors() {
            return _lang['default'].clone(errors);
=======
        getAllErrors: function() {
            return lang.clone(errors);
>>>>>>> develop
        },

        /**
         * Removes the specified index from the error list.
         * @param {Number} index Index of error to remove.
         * @param {Number} amount Number of errors to remove from indexed point, if not provided defaults to 1.
         */
<<<<<<< HEAD
        removeError: function removeError(index, amount) {
=======
        removeError: function(index, amount) {
>>>>>>> develop
            errors.splice(index, amount || 1);
        },

        /**
         * Publishes the `/app/refresh` event to notify that an error has been added
         */
<<<<<<< HEAD
        onErrorAdd: function onErrorAdd() {
            _connect['default'].publish('/app/refresh', [{
=======
        onErrorAdd: function() {
            connect.publish('/app/refresh', [{
>>>>>>> develop
                resourceKind: 'errorlogs'
            }]);
        },

        /**
         * Attempts to save all errors into localStorage under the `errorlog` key.
         */
<<<<<<< HEAD
        save: function save() {
=======
        save: function() {
>>>>>>> develop
            try {
                if (window.localStorage) {
                    window.localStorage.setItem('errorlog', _json['default'].stringify(errors));
                }
<<<<<<< HEAD
            } catch (e) {
=======
            } catch(e) {
>>>>>>> develop
                console.error(e);
            }
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.ErrorManager', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.ErrorManager', __class);
    return __class;
>>>>>>> develop
});
