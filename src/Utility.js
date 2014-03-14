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
 * @class Sage.Platform.Mobile.Utility
 * Utility provides functions that are more javascript enhancers than application related code.
 * @alternateClassName Utility
 * @singleton
 */
define('Sage/Platform/Mobile/Utility', [
    'dojo/_base/lang',
    'dojo/_base/array'
], function(
    lang,
    array
) {
    var nameToPathCache = {};
    var nameToPath = function(name) {
        if (typeof name !== 'string' || name === '.' || name === '') return []; // '', for compatibility
        if (nameToPathCache[name]) return nameToPathCache[name];
        var parts = name.split('.');
        var path = [];
        for (var i = 0; i < parts.length; i++)
        {
            var match = parts[i].match(/([a-zA-Z0-9_$]+)\[([^\]]+)\]/);
            if (match)
            {
                path.push(match[1]);
                if (/^\d+$/.test(match[2]))
                    path.push(parseInt(match[2], 10));
                else
                    path.push(match[2]);
            }
            else
            {
                path.push(parts[i]);
            }
        }

        nameToPathCache[name] = path.reverse();
        return nameToPathCache[name];
    };

    return lang.setObject('Sage.Platform.Mobile.Utility', {
        memoize: function(fn, keyFn) {
            var cache = {};
            keyFn = keyFn || (function(value) { return value; });

            return function() {
                var key = keyFn.apply(this, arguments);
                if (cache[key]) {
                    return cache[key];
                } else {
                    cache[key] = fn.apply(this, arguments);
                    return cache[key];
                }
            };
        },
        getValue: function(o, name, defaultValue) {
            var path = nameToPath(name).slice(0);
            var current = o;
            while (current && path.length > 0)
            {
                var key = path.pop();
                if (typeof current[key] !== 'undefined')
                    current = current[key];
                else
                    return typeof defaultValue !== 'undefined' ? defaultValue : null;
            }
            return current;
        },
        setValue: function(o, name, val) {
            var current = o;
            var path = nameToPath(name).slice(0);
            while ((typeof current !== "undefined") && path.length > 1)
            {
                var key = path.pop();
                var next = path[path.length - 1];
                current = current[key] = (typeof current[key] !== "undefined")
                    ? current[key]
                    : (typeof next === "number")
                        ? []
                        : {};
            }
            if (typeof path[0] !== "undefined")
                current[path[0]] = val;
            return o;
        },
        expand: function(scope, expression) {
            if (typeof expression === 'function')
                return expression.apply(scope, Array.prototype.slice.call(arguments, 2));
            else
                return expression;
        },
        roundNumberTo: function(number, precision) {
            var k = Math.pow(10, precision);
            return (Math.round(number * k) / k);
        },
        /**
         * @function
         * Utility function to join fields within a Simplate template.
         */
        joinFields: function(seperator, fields) {
            var results;
            results = array.filter(fields, function(item) {
                return item !== null && typeof item !== 'undefined' && item !== '';
            });

            return results.join(seperator);
        }
    });
});
