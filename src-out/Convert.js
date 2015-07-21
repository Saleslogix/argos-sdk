<<<<<<< HEAD
define('argos/Convert', ['exports', 'module', 'dojo/_base/lang', 'moment'], function (exports, module, _dojo_baseLang, _moment) {
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
     * @class argos.Convert
     * Convert provides a number of type transformation functions.
     * @alternateClassName convert
     * @singleton
     */

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _moment2 = _interopRequireDefault(_moment);

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
 * @class argos.Convert
 * Convert provides a number of type transformation functions.
 * @alternateClassName convert
 * @singleton
 */
define('argos/Convert', [
    'dojo/_base/lang',
    'moment'
], function(
    lang,
    moment
) {
>>>>>>> develop
    var trueRE = /^(true|T)$/i,
        isoDate = /(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|(-|\+)(\d{2}):(\d{2})))?/,
        jsonDate = /\/Date\((-?\d+)(?:(-|\+)(\d{2})(\d{2}))?\)\//,
        __class,
<<<<<<< HEAD
        pad = function pad(n) {
        return n < 10 ? '0' + n : n;
    };

    __class = _lang['default'].setObject('argos.Convert', {
=======
        pad = function(n) {
            return n < 10 ? '0' + n : n;
        };

    __class = lang.setObject('argos.Convert', {
>>>>>>> develop
        /**
         * Takes a string and checks to see if it is `true` or `T`, else returns false
         * @param {String} value String bool value
         * @return {Boolean} Returns true if string is `true` or `T`.
         */
<<<<<<< HEAD
        toBoolean: function toBoolean(value) {
=======
        toBoolean: function(value) {
>>>>>>> develop
            return trueRE.test(value);
        },
        /**
         * Takes a string and checks to see if it is an ISO formatted date or a JSON-string date
         *
         * ISO Date: `'2012-08-28'` or `'2012-05-28T08:30:00Z'`
         * JSON-string: `'/Date(1346189868885)/'`
         *
         * @param {String} value String to be checked to see if it's a date.
         * @return {Boolean} True if it matches ISO or JSON formats, false if not a string or doesn't match.
         */
<<<<<<< HEAD
        isDateString: function isDateString(value) {
=======
        isDateString: function(value) {
>>>>>>> develop
            if (typeof value !== 'string') {
                return false;
            }

            return isoDate.test(value) || jsonDate.test(value);
        },
        /**
         * Takes a Date object and converts it to a ISO 8601 formatted string
         * @param {Date} value Date to be formatted
         * @return {String} ISO 8601 formatted date string
         */
<<<<<<< HEAD
        toIsoStringFromDate: function toIsoStringFromDate(value) {
            // adapted from: https://developer.mozilla.org/en/JavaScript/Reference/global_objects/date
            return value.getUTCFullYear() + '-' + pad(value.getUTCMonth() + 1) + '-' + pad(value.getUTCDate()) + 'T' + pad(value.getUTCHours()) + ':' + pad(value.getUTCMinutes()) + ':' + pad(value.getUTCSeconds()) + 'Z';
=======
        toIsoStringFromDate: function(value) {
            // adapted from: https://developer.mozilla.org/en/JavaScript/Reference/global_objects/date
            return value.getUTCFullYear() + '-'
                + pad(value.getUTCMonth() + 1 ) + '-'
                + pad(value.getUTCDate()) + 'T'
                + pad(value.getUTCHours()) + ':'
                + pad(value.getUTCMinutes()) + ':'
                + pad(value.getUTCSeconds()) + 'Z';
>>>>>>> develop
        },
        /**
         * Takes a Date object and returns it in JSON-string format: `'/Date(milliseconds)/'`
         * @param {Date} value Date to stringify
         * @return {String} JSON string: `'/Date(milliseconds)/'`
         */
<<<<<<< HEAD
        toJsonStringFromDate: function toJsonStringFromDate(value) {
=======
        toJsonStringFromDate: function(value) {
>>>>>>> develop
            return '/Date(' + value.getTime() + ')/';
        },
        /**
         * Takes a string and tests it to see if its an ISO 8601 string or a JSON-string.
         * If a match is found it is parsed into a Date object and returned, else the original value is returned.
         * @param {String} value String in the ISO 8601 format `'2012-08-28T08:30:00Z'` or JSON-string format `'/Date(milliseconds)/'`
         * @return {Date} Date object from string or original object if not convertable.
         */
<<<<<<< HEAD
        toDateFromString: function toDateFromString(value) {
=======
        toDateFromString: function(value) {
>>>>>>> develop
            if (typeof value !== 'string') {
                return value;
            }

<<<<<<< HEAD
            var match, utc, h, m;

            if (match = jsonDate.exec(value)) {
=======
            var match,
                utc,
                h, m;

            if ((match = jsonDate.exec(value))) {
>>>>>>> develop
                utc = new Date(parseInt(match[1], 10));

                // todo: may not be needed
                /*
                if (match[2])
                {
                    h = parseInt(match[3]);
                    m = parseInt(match[4]);
                      if (match[2] === '-')
                        utc.addMinutes((h * 60) + m);
                    else
                        utc.addMinutes(-1 * ((h * 60) + m));
                }
                */

                value = utc;
<<<<<<< HEAD
            } else if (match = isoDate.exec(value)) {
                utc = (0, _moment2['default'])(new Date(Date.UTC(parseInt(match[1], 10), parseInt(match[2], 10) - 1, // zero based
                parseInt(match[3], 10), parseInt(match[4] || 0, 10), parseInt(match[5] || 0, 10), parseInt(match[6] || 0, 10))));
=======
            } else if ((match = isoDate.exec(value))) {
                utc = moment(new Date(Date.UTC(
                    parseInt(match[1], 10),
                    parseInt(match[2], 10) - 1, // zero based
                    parseInt(match[3], 10),
                    parseInt(match[4] || 0, 10),
                    parseInt(match[5] || 0, 10),
                    parseInt(match[6] || 0, 10)
                )));
>>>>>>> develop

                if (match[8] && match[8] !== 'Z') {
                    h = parseInt(match[10], 10);
                    m = parseInt(match[11], 10);

                    if (match[9] === '-') {
<<<<<<< HEAD
                        utc.add({ minutes: h * 60 + m });
                    } else {
                        utc.add({ minutes: -1 * (h * 60 + m) });
=======
                        utc.add({minutes:((h * 60) + m)});
                    } else {
                        utc.add({minutes:(-1 * ((h * 60) + m))});
>>>>>>> develop
                    }
                }

                value = utc.toDate();
            }

            return value;
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.Convert', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.Convert', __class);
    return __class;
>>>>>>> develop
});
