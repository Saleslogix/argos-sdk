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

        constructor: function constructor(options) {
            _lang['default'].mixin(this, options);
        },
        formatQualifiedKey: function formatQualifiedKey(name, key) {
            if (key && key.indexOf(name) !== 0) {
                return name + '.' + key;
            }

            return key;
        },
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
        getItem: function getItem(key, options) {
            options = options || {};
            var value, encoded, store, serialized, fqKey;

            try {
                if (window.localStorage) {
                    if (this.singleObjectStore) {
                        if (this.allowCacheUse && sosCache[this.name]) {
                            store = sosCache[this.name];
                        } else {
                            encoded = window.localStorage.getItem(this.name);
                            store = _json['default'].fromJson(encoded);

                            if (this.allowCacheUse) {
                                sosCache[this.name] = store;
                            }
                        }

                        value = _utility['default'].getValue(store, key);

                        if (options.success) {
                            options.success.call(options.scope || this, value);
                        }

                        return value;
                    } else {
                        fqKey = this.formatQualifiedKey(this.name, key);
                        serialized = window.localStorage.getItem(fqKey);

                        value = this.serializeValues && options.serialize !== false ? this.deserializeValue(serialized) : serialized;

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
        setItem: function setItem(key, value, options) {
            var fqKey, encoded, store, serialized;

            options = options || {};
            try {
                if (window.localStorage) {
                    if (this.singleObjectStore) {
                        if (this.allowCacheUse && sosCache[this.name]) {
                            store = sosCache[this.name];
                        } else {
                            encoded = window.localStorage.getItem(this.name);
                            store = encoded && _json['default'].fromJson(encoded) || {};

                            if (this.allowCacheUse) {
                                sosCache[this.name] = store;
                            }
                        }

                        _utility['default'].setValue(store, key, value);

                        encoded = _json['default'].toJson(store);

                        window.localStorage.setItem(this.name, encoded);

                        if (options.success) {
                            options.success.call(options.scope || this);
                        }

                        return true;
                    } else {
                        fqKey = this.formatQualifiedKey(this.name, key);
                        serialized = this.serializeValues && options.serialize !== false ? this.serializeValue(value) : value;

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
        clearItem: function clearItem(key, options) {}
    });

    _lang['default'].setObject('Sage.Platform.Mobile.PersistentStorage', __class);
    module.exports = __class;
});
