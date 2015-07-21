<<<<<<< HEAD
define('argos/Utility', ['exports', 'module', 'dojo/_base/lang', 'dojo/_base/array', 'dojo/json'], function (exports, module, _dojo_baseLang, _dojo_baseArray, _dojoJson) {
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

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _array = _interopRequireDefault(_dojo_baseArray);

    var _json = _interopRequireDefault(_dojoJson);

    var nameToPathCache, __class, nameToPath;
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
 * @class argos.Utility
 * Utility provides functions that are more javascript enhancers than application related code.
 * @alternateClassName Utility
 * @singleton
 */
define('argos/Utility', [
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/json'
], function(
    lang,
    array,
    json
) {
    var nameToPathCache,
        __class,
        nameToPath;
>>>>>>> develop

    nameToPathCache = {};
    nameToPath = function(name) {
        var parts, path, i, match;

        if (typeof name !== 'string' || name === '.' || name === '') {
            return []; // '', for compatibility
        }

        if (nameToPathCache[name]) {
            return nameToPathCache[name];
        }

        parts = name.split('.');
        path = [];

        for (i = 0; i < parts.length; i++) {
            match = parts[i].match(/([a-zA-Z0-9_$]+)\[([^\]]+)\]/);
            if (match) {
                path.push(match[1]);
                if (/^\d+$/.test(match[2])) {
                    path.push(parseInt(match[2], 10));
                } else {
                    path.push(match[2]);
                }
            } else {
                path.push(parts[i]);
            }
        }

        nameToPathCache[name] = path.reverse();
        return nameToPathCache[name];
    };

<<<<<<< HEAD
    /**
     * @class argos.Utility
     * Utility provides functions that are more javascript enhancers than application related code.
     * @alternateClassName Utility
     * @singleton
     */
    __class = _lang['default'].setObject('argos.Utility', {
=======
    __class = lang.setObject('argos.Utility', {
>>>>>>> develop
        /**
         * Replaces a single `"` with two `""` for proper SData query expressions.
         * @param {String} searchQuery Search expression to be escaped.
         * @return {String}
         */
<<<<<<< HEAD
        escapeSearchQuery: function escapeSearchQuery(searchQuery) {
            return (searchQuery || '').replace(/"/g, '""');
        },
        memoize: function memoize(fn, keyFn) {
            var cache = {};
            keyFn = keyFn || function (value) {
                return value;
            };

            return function () {
=======
        escapeSearchQuery: function(searchQuery) {
            return (searchQuery || '').replace(/"/g, '""');
        },
        memoize: function(fn, keyFn) {
            var cache = {};
            keyFn = keyFn || (function(value) {
                return value;
            });

            return function() {
>>>>>>> develop
                var key = keyFn.apply(this, arguments);
                if (cache[key]) {
                    return cache[key];
                } else {
                    cache[key] = fn.apply(this, arguments);
                    return cache[key];
                }
            };
        },
<<<<<<< HEAD
        getValue: function getValue(o, name, defaultValue) {
=======
        getValue: function(o, name, defaultValue) {
>>>>>>> develop
            var path, current, key;

            path = nameToPath(name).slice(0);
            current = o;
            while (current && path.length > 0) {
                key = path.pop();
                if (typeof current[key] !== 'undefined') {
                    current = current[key];
                } else {
                    return typeof defaultValue !== 'undefined' ? defaultValue : null;
                }
            }
            return current;
        },
<<<<<<< HEAD
        setValue: function setValue(o, name, val) {
=======
        setValue: function(o, name, val) {
>>>>>>> develop
            var current, path, key, next;

            current = o;
            path = nameToPath(name).slice(0);
            while (typeof current !== 'undefined' && path.length > 1) {
                key = path.pop();
                next = path[path.length - 1];
                current = current[key] = typeof current[key] !== 'undefined' ? current[key] : typeof next === 'number' ? [] : {};
            }
            if (typeof path[0] !== 'undefined') {
                current[path[0]] = val;
            }

            return o;
        },
<<<<<<< HEAD
        expand: function expand(scope, expression) {
=======
        expand: function(scope, expression) {
>>>>>>> develop
            if (typeof expression === 'function') {
                return expression.apply(scope, Array.prototype.slice.call(arguments, 2));
            } else {
                return expression;
            }
        },
<<<<<<< HEAD
        roundNumberTo: function roundNumberTo(number, precision) {
=======
        roundNumberTo: function(number, precision) {
>>>>>>> develop
            var k = Math.pow(10, precision);
            return Math.round(number * k) / k;
        },
        /**
         * @function
         * Utility function to join fields within a Simplate template.
         */
<<<<<<< HEAD
        joinFields: function joinFields(seperator, fields) {
            var results;
            results = _array['default'].filter(fields, function (item) {
=======
        joinFields: function(seperator, fields) {
            var results;
            results = array.filter(fields, function(item) {
>>>>>>> develop
                return item !== null && typeof item !== 'undefined' && item !== '';
            });

            return results.join(seperator);
        },
        /**
         * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
         * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
         * @return {Object} Object ready to be JSON.stringified.
         */
<<<<<<< HEAD
        sanitizeForJson: function sanitizeForJson(obj) {
=======
        sanitizeForJson: function(obj) {
>>>>>>> develop
            var type, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    try {
                        type = typeof obj[key];
<<<<<<< HEAD
                    } catch (e) {
=======
                    } catch(e) {
>>>>>>> develop
                        delete obj[key];
                        continue;
                    }

                    switch (type) {
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
                            if (key === 'scope') {
                                obj[key] = 'null';
                                break;
                            }
                            obj[key] = this.sanitizeForJson(obj[key]);
                            break;
                        case 'string':
                            try {
<<<<<<< HEAD
                                obj[key] = _json['default'].parse(obj[key]);
=======
                                obj[key] = json.parse(obj[key]);
>>>>>>> develop

                                if (typeof obj[key] === 'object') {
                                    obj[key] = this.sanitizeForJson(obj[key]);
                                }
<<<<<<< HEAD
                            } catch (e) {}
=======
                            } catch(e) {}
>>>>>>> develop
                            break;
                    }
                }
            }
            return obj;
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.Utility', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.Utility', __class);
    return __class;
>>>>>>> develop
});
