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

/**
 * @module argos/CultureInfo
 */
import lang from 'dojo/_base/lang';

/**
 * Gets the culture information from the regional context (l20n).
 */
export default function () {
  const localeContext = window.regionalContext;
  const entity = localeContext.getEntitySync('CultureInfo');

  if (!entity) {
    throw new Error('Failed loading CultureInfo.');
  }

  const parsed = JSON.parse(entity.value);
  lang.setObject('Mobile.CultureInfo', parsed);
}
