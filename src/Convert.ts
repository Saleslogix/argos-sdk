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

const lang = require('dojo/_base/lang');

const convert = ICRMCommonSDK.convert;

export default class Convert {
  /**
   * Takes a string and checks to see if it is `true` or `T`, else returns false
   * @param {String} value String bool value
   * @return {Boolean} Returns true if string is `true` or `T`.
   */
  static toBoolean(param: string) {
    return convert.toBoolean(param);
  }
  /**
   * Takes a string and checks to see if it is an ISO formatted date or a JSON-string date
   *
   * ISO Date: `'2012-08-28'` or `'2012-05-28T08:30:00Z'`
   * JSON-string: `'/Date(1346189868885)/'`
   *
   * @param {String} value String to be checked to see if it's a date.
   * @return {Boolean} True if it matches ISO or JSON formats, false if not a string or doesn't match.
   */
  static isDateString(param: string) {
    return convert.isDateString(param);
  }
  /**
   * Takes a Date object and converts it to a ISO 8601 formatted string
   * @param {Date} value Date to be formatted
   * @return {String} ISO 8601 formatted date string
   */
  static toIsoStringFromDate(param: string) {
    return convert.toIsoStringFromDate(param);
  }
  /**
   * Takes a Date object and returns it in JSON-string format: `'/Date(milliseconds)/'`
   * @param {Date} value Date to stringify
   * @return {String} JSON string: `'/Date(milliseconds)/'`
   */
  static toJsonStringFromDate(param: string) {
    return convert.toJsonStringFromDate(param);
  }
  /**
   * Takes a string and tests it to see if its an ISO 8601 string or a JSON-string.
   * If a match is found it is parsed into a Date object and returned, else the original value is returned.
   * @param {String} value String in the ISO 8601 format `'2012-08-28T08:30:00Z'` or JSON-string format `'/Date(milliseconds)/'`
   * @return {Date} Date object from string or original object if not convertable.
   */
  static toDateFromString(param: string) {
    return convert.toDateFromString(param);
  }
}

lang.setObject('argos.Convert', Convert);
