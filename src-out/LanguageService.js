define('argos/LanguageService', ['module', 'exports', 'dojo/_base/declare'], function (module, exports, _declare) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/LanguageService
   */
  var __class = (0, _declare2.default)('argos.LanguageService', [], /** @lends module:argos/LanguageService.prototype */{

    /**
     *
     */
    getLanguage: function getLanguage() {
      return window.localStorage && window.localStorage.getItem('language');
    },

    /**
     *
     */
    getRegion: function getRegion() {
      return window.localStorage && window.localStorage.getItem('region');
    },

    /**
     *
     */
    setLanguage: function setLanguage(value) {
      var language = this.normalizeLocale(value) || value;
      return window.localStorage && window.localStorage.setItem('language', language);
    },

    /**
     *
     */
    setRegion: function setRegion(value) {
      var region = this.normalizeLocale(value) || value;
      return window.localStorage && window.localStorage.setItem('region', region);
    },

    /**
     *
     */
    normalizeLocale: function normalizeLanguageCode(locale) {
      var language = locale;
      if (language.length > 2) {
        var split = locale.split('-');
        if (split[0] === split[1]) {
          language = split[0];
        } else if (split[1]) {
          language = split[0] + '-' + split[1].toUpperCase();
        }
      }
      return language;
    },
    /**
     * Gets a list of supported locales.
     */
    getLanguages: function getLanguages() {
      return window.supportedLocales;
    },

    /**
     *
     */
    bestAvailableLocale: function BestAvailableLocale(availableLocales, locale) {
      var candidate = this.normalizeLocale(locale);
      if (availableLocales.indexOf(candidate) !== -1) {
        return candidate;
      }
      var pos = candidate.lastIndexOf('-');
      if (pos === -1) {
        return undefined;
      }
      if (pos >= 2 && candidate[pos - 2] === '-') {
        pos -= 2;
      }
      candidate = candidate.substring(0, pos);
      return candidate;
    }
  }); /* Copyright 2017 Infor
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *    http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

  /**
   * @module argos/LanguageService
   */
  exports.default = __class;
  module.exports = exports['default'];
});