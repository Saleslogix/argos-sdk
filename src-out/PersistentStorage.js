<<<<<<< HEAD
define('argos/PersistentStorage', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/json', './Convert', './Utility'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseJson, _Convert, _Utility) {
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

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _json = _interopRequireDefault(_dojo_baseJson);

    var _convert = _interopRequireDefault(_Convert);

    var _utility = _interopRequireDefault(_Utility);

    var sosCache, __class;
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
 * @class argos.PersistentStorage
 * @deprecated Not used.
 * @alternateClassName PersistentStorage
 */
define('argos/PersistentStorage', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/json',
    './Convert',
    './Utility'
], function(
    declare,
    lang,
    json,
    convert,
    utility
) {
    var sosCache,
        __class;
>>>>>>> develop

    sosCache = {};

    /**
     * @class argos.PersistentStorage
     * @deprecated Not used.
     * @alternateClassName PersistentStorage
     */
    __class = (0, _declare['default'])('argos.PersistentStorage', null, {
        name: false,
        singleObjectStore: false,
        allowCacheUse: true,
        serializeValues: true,

<<<<<<< HEAD
        constructor: function constructor(options) {
            _lang['default'].mixin(this, options);
        },
        formatQualifiedKey: function formatQualifiedKey(name, key) {
=======
        constructor: function(options) {
            lang.mixin(this, options);
        },
        formatQualifiedKey: function(name, key) {
>>>>>>> develop
            if (key && key.indexOf(name) !== 0) {
                return name + '.' + key;
            }

            return key;
        },
<<<<<<< HEAD
        serializeValue: function serializeValue(value) {
            return typeof value === 'object' ? _json['default'].toJson(value) : value && value.toString ? value.toString() : value;
        },
        deserializeValue: function deserializeValue(value) {
            if (value && value.indexOf('{') === 0 && value.lastIndexOf('}') === value.length - 1) {
                return _json['default'].fromJson(value);
            }

            if (value && value.indexOf('[') === 0 && value.lastIndexOf(']') === value.length - 1) {
                return _json['default'].fromJson(value);
            }

            if (_convert['default'].isDateString(value)) {
                return _convert['default'].toDateFromString(value);
=======
        serializeValue: function(value) {
            return typeof value === 'object'
                ? json.toJson(value)
                : value && value.toString
                    ? value.toString()
                    : value;
        },
        deserializeValue: function(value) {
            if (value && value.indexOf('{') === 0 && value.lastIndexOf('}') === (value.length - 1)) {
                return json.fromJson(value);
            }

            if (value && value.indexOf('[') === 0 && value.lastIndexOf(']') === (value.length - 1)) {
                return json.fromJson(value);
            }

            if (convert.isDateString(value)) {
                return convert.toDateFromString(value);
>>>>>>> develop
            }

            if (/^(true|false)$/.test(value)) {
                return value === 'true';
            }

            var numeric = parseFloat(value);
            if (!isNaN(numeric)) {
                return numeric;
            }

            return value;
        },
<<<<<<< HEAD
        getItem: function getItem(key, options) {
            options = options || {};
            var value, encoded, store, serialized, fqKey;
=======
        getItem: function(key, options) {
            options = options || {};
            var value,
                encoded,
                store,
                serialized,
                fqKey;
>>>>>>> develop

            try {
                if (window.localStorage) {
                    if (this.singleObjectStore) {
                        if (this.allowCacheUse && sosCache[this.name]) {
                            store = sosCache[this.name];
                        } else {
                            encoded = window.localStorage.getItem(this.name);
<<<<<<< HEAD
                            store = _json['default'].fromJson(encoded);
=======
                            store = json.fromJson(encoded);
>>>>>>> develop

                            if (this.allowCacheUse) {
                                sosCache[this.name] = store;
                            }
                        }

<<<<<<< HEAD
                        value = _utility['default'].getValue(store, key);
=======
                        value = utility.getValue(store, key);
>>>>>>> develop

                        if (options.success) {
                            options.success.call(options.scope || this, value);
                        }

                        return value;
                    } else {
                        fqKey = this.formatQualifiedKey(this.name, key);
                        serialized = window.localStorage.getItem(fqKey);

<<<<<<< HEAD
                        value = this.serializeValues && options.serialize !== false ? this.deserializeValue(serialized) : serialized;
=======
                        value = this.serializeValues && options.serialize !== false
                                ? this.deserializeValue(serialized)
                                : serialized;
>>>>>>> develop

                        if (options.success) {
                            options.success.call(options.scope || this, value);
                        }

                        return value;
                    }
                } else {
                    if (options.failure) {
                        options.failure.call(options.scope || this, false);
                    }
                }
            } catch (e) {
                if (options && options.failure) {
                    options.failure.call(options.scope || this, e);
                }
            }
        },
<<<<<<< HEAD
        setItem: function setItem(key, value, options) {
            var fqKey, encoded, store, serialized;
=======
        setItem: function(key, value, options) {
            var fqKey,
                encoded,
                store,
                serialized;
>>>>>>> develop

            options = options || {};
            try {
                if (window.localStorage) {
                    if (this.singleObjectStore) {
                        if (this.allowCacheUse && sosCache[this.name]) {
                            store = sosCache[this.name];
                        } else {
                            encoded = window.localStorage.getItem(this.name);
<<<<<<< HEAD
                            store = encoded && _json['default'].fromJson(encoded) || {};
=======
                            store = (encoded && json.fromJson(encoded)) || {};
>>>>>>> develop

                            if (this.allowCacheUse) {
                                sosCache[this.name] = store;
                            }
                        }

<<<<<<< HEAD
                        _utility['default'].setValue(store, key, value);

                        encoded = _json['default'].toJson(store);
=======
                        utility.setValue(store, key, value);

                        encoded = json.toJson(store);
>>>>>>> develop

                        window.localStorage.setItem(this.name, encoded);

                        if (options.success) {
                            options.success.call(options.scope || this);
                        }

                        return true;
                    } else {
                        fqKey = this.formatQualifiedKey(this.name, key);
<<<<<<< HEAD
                        serialized = this.serializeValues && options.serialize !== false ? this.serializeValue(value) : value;
=======
                        serialized = this.serializeValues && options.serialize !== false
                                ? this.serializeValue(value)
                                : value;
>>>>>>> develop

                        window.localStorage.setItem(fqKey, serialized);

                        if (options.success) {
                            options.success.call(options.scope || this);
                        }

                        return true;
                    }
                } else {
                    if (options.failure) {
                        options.failure.call(options.scope || this, false);
                    }

                    return false;
                }
            } catch (e) {
                if (options && options.failure) {
                    options.failure.call(options.scope || this, e);
                }

                return false;
            }
        },
<<<<<<< HEAD
        clearItem: function clearItem(key, options) {}
    });

    _lang['default'].setObject('Sage.Platform.Mobile.PersistentStorage', __class);
    module.exports = __class;
=======
        clearItem: function(key, options) {
        }
    });

    lang.setObject('Sage.Platform.Mobile.PersistentStorage', __class);
    return __class;
>>>>>>> develop
});
