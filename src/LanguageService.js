/* Copyright 2017 Infor
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

import declare from 'dojo/_base/declare';

const __class = declare('argos.LanguageService', [], {
  getLanguage: function getLanguage() {
    return window.localStorage && window.localStorage.getItem('language');
  },
  getRegion: function getRegion() {
    return window.localStorage && window.localStorage.getItem('region');
  },
  setLanguage: function setLanguage(value) {
    const language = this.normalizeLocale(value) || value;
    return window.localStorage && window.localStorage.setItem('language', language);
  },
  setRegion: function setRegion(value) {
    const region = this.normalizeLocale(value) || value;
    return window.localStorage && window.localStorage.setItem('region', region);
  },
  normalizeLocale: function normalizeLanguageCode(locale) {
    let language = locale;
    if (language.length > 2) {
      const split = locale.split('-');
      if (split[0] === split[1]) {
        language = split[0];
      } else if (split[1]) {
        language = `${split[0]}-${split[1].toUpperCase()}`;
      }
    }
    return language;
  },
  getLanguages: function getLanguages() {
    return window.supportedLocales;
  },
  bestAvailableLocale: function BestAvailableLocale(availableLocales, locale) {
    let candidate = this.normalizeLocale(locale);
    if (availableLocales.indexOf(candidate) !== -1) {
      return candidate;
    }
    let pos = candidate.lastIndexOf('-');
    if (pos === -1) {
      return undefined;
    }
    if (pos >= 2 && candidate[pos - 2] === '-') {
      pos -= 2;
    }
    candidate = candidate.substring(0, pos);
    return candidate;
  },
});
export default __class;
