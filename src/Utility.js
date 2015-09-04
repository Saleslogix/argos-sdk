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
import lang from 'dojo/_base/lang';
import array from 'dojo/_base/array';
import json from 'dojo/json';

let __class;
const nameToPathCache = {};
const nameToPath = function nameToPath(name) {
  if (typeof name !== 'string' || name === '.' || name === '') {
    return []; // '', for compatibility
  }

  if (nameToPathCache[name]) {
    return nameToPathCache[name];
  }

  const parts = name.split('.');
  const path = [];

  for (let i = 0; i < parts.length; i++) {
    const match = parts[i].match(/([a-zA-Z0-9_$]+)\[([^\]]+)\]/);
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

/**
 * @class argos.Utility
 * Utility provides functions that are more javascript enhancers than application related code.
 * @alternateClassName Utility
 * @singleton
 */
__class = lang.setObject('argos.Utility', {
  /**
   * Replaces a single `"` with two `""` for proper SData query expressions.
   * @param {String} searchQuery Search expression to be escaped.
   * @return {String}
   */
  escapeSearchQuery: function escapeSearchQuery(searchQuery) {
    return (searchQuery || '').replace(/"/g, '""');
  },
  memoize: function memoize(fn, keyFn) {
    const cache = {};
    const _keyFn = keyFn || ((value) => {
      return value;
    });

    return function cached() {
      const key = _keyFn.apply(this, arguments);
      if (cache[key]) {
        return cache[key];
      }

      cache[key] = fn.apply(this, arguments);
      return cache[key];
    };
  },
  getValue: function getValue(o, name, defaultValue) {
    const path = nameToPath(name).slice(0);
    let current = o;
    while (current && path.length > 0) {
      const key = path.pop();
      if (typeof current[key] !== 'undefined') {
        current = current[key];
      } else {
        return typeof defaultValue !== 'undefined' ? defaultValue : null;
      }
    }
    return current;
  },
  setValue: function setValue(o, name, val) {
    let current = o;
    const path = nameToPath(name).slice(0);
    while ((typeof current !== 'undefined') && path.length > 1) {
      const key = path.pop();
      const next = path[path.length - 1];
      if (typeof current[key] !== 'undefined') {
        current = current[key] = current[key];
      } else if (typeof next === 'number') {
        current = current[key] = [];
      } else {
        current = current[key] = {};
      }
    }

    if (typeof path[0] !== 'undefined') {
      current[path[0]] = val;
    }

    return o;
  },
  expand: function expand(scope, expression) {
    if (typeof expression === 'function') {
      return expression.apply(scope, Array.prototype.slice.call(arguments, 2));
    }

    return expression;
  },
  roundNumberTo: function roundNumberTo(number, precision) {
    const k = Math.pow(10, precision);
    return (Math.round(number * k) / k);
  },
  /**
   * @function
   * Utility function to join fields within a Simplate template.
   */
  joinFields: function joinFields(seperator, fields) {
    const results = array.filter(fields, (item) => {
      return item !== null && typeof item !== 'undefined' && item !== '';
    });

    return results.join(seperator);
  },
  /**
   * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
   * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
   * @return {Object} Object ready to be JSON.stringified.
   */
  sanitizeForJson: function sanitizeForJson(obj) {
    let type;

    obj.__visited__ = true;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        try {
          type = typeof obj[key];
        } catch (e) {
          delete obj[key];
          continue;
        }

        switch (type) {//eslint-disable-line
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
            // break circular references
            if (obj[key].__visited__) {
              obj[key] = 'null';
              break;
            }
            obj[key] = this.sanitizeForJson(obj[key]);
            break;
          case 'string':
            try {
              obj[key] = json.parse(obj[key]);

              if (typeof obj[key] === 'object') {
                obj[key] = this.sanitizeForJson(obj[key]);
              }
            } catch (e) {}//eslint-disable-line
            break;
        }
      }
    }

    delete obj.__visited__;
    return obj;
  },
});

lang.setObject('Sage.Platform.Mobile.Utility', __class);
export default __class;
