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
import declare from 'dojo/_base/declare';

const __class = declare('argos.LanguageService', [], {
  getLanguage: function getLanguage() {
    return window.localStorage && window.localStorage.getItem('language');
  },
  getRegion: function getRegion() {
    return window.localStorage && window.localStorage.getItem('region');
  },
  setLanguage: function setLanguage(value) {
    return window.localStorage && window.localStorage.setItem('language', value);
  },
  setRegion: function setRegion(value) {
    return window.localStorage && window.localStorage.setItem('region', value);
  },
  getLanguages: function getLanguages() {
    return window.supportedLocales;
  },
});
export default __class;
