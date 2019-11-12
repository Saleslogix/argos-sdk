define('argos/actions/index', ['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setMaxViewPorts = setMaxViewPorts;
  exports.insertHistory = insertHistory;
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

  // action Types
  var SET_MAX_VIEWPORTS = exports.SET_MAX_VIEWPORTS = 'SET_MAX_VIEWPORTS';
  var INSERT_HISTORY = exports.INSERT_HISTORY = 'INSERT_HISTORY';

  /*
  
  See: https://github.com/acdlite/flux-standard-action
  
  An action MUST
  + be a plain JavaScript object.
  + have a type property.
  
   An action MAY
  + have an error property.
  + have a payload property.
  + have a meta property.
  
  An action MUST NOT
  + include properties other than type, payload, error, and meta.
  */

  // creators
  function setMaxViewPorts(max) {
    return {
      type: SET_MAX_VIEWPORTS,
      payload: {
        max: max
      }
    };
  }

  function insertHistory(data) {
    return {
      type: INSERT_HISTORY,
      payload: {
        data: data
      }
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2luZGV4LmpzIl0sIm5hbWVzIjpbInNldE1heFZpZXdQb3J0cyIsImluc2VydEhpc3RvcnkiLCJTRVRfTUFYX1ZJRVdQT1JUUyIsIklOU0VSVF9ISVNUT1JZIiwibWF4IiwidHlwZSIsInBheWxvYWQiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7O1VBcUNnQkEsZSxHQUFBQSxlO1VBU0FDLGEsR0FBQUEsYTtBQTlDaEI7Ozs7Ozs7Ozs7Ozs7OztBQWVBO0FBQ08sTUFBTUMsZ0RBQW9CLG1CQUExQjtBQUNBLE1BQU1DLDBDQUFpQixnQkFBdkI7O0FBRVA7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBO0FBQ08sV0FBU0gsZUFBVCxDQUF5QkksR0FBekIsRUFBOEI7QUFDbkMsV0FBTztBQUNMQyxZQUFNSCxpQkFERDtBQUVMSSxlQUFTO0FBQ1BGO0FBRE87QUFGSixLQUFQO0FBTUQ7O0FBRU0sV0FBU0gsYUFBVCxDQUF1Qk0sSUFBdkIsRUFBNkI7QUFDbEMsV0FBTztBQUNMRixZQUFNRixjQUREO0FBRUxHLGVBQVM7QUFDUEM7QUFETztBQUZKLEtBQVA7QUFNRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8vIGFjdGlvbiBUeXBlc1xyXG5leHBvcnQgY29uc3QgU0VUX01BWF9WSUVXUE9SVFMgPSAnU0VUX01BWF9WSUVXUE9SVFMnO1xyXG5leHBvcnQgY29uc3QgSU5TRVJUX0hJU1RPUlkgPSAnSU5TRVJUX0hJU1RPUlknO1xyXG5cclxuLypcclxuXHJcblNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FjZGxpdGUvZmx1eC1zdGFuZGFyZC1hY3Rpb25cclxuXHJcbkFuIGFjdGlvbiBNVVNUXHJcbisgYmUgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdC5cclxuKyBoYXZlIGEgdHlwZSBwcm9wZXJ0eS5cclxuXHJcbiBBbiBhY3Rpb24gTUFZXHJcbisgaGF2ZSBhbiBlcnJvciBwcm9wZXJ0eS5cclxuKyBoYXZlIGEgcGF5bG9hZCBwcm9wZXJ0eS5cclxuKyBoYXZlIGEgbWV0YSBwcm9wZXJ0eS5cclxuXHJcbkFuIGFjdGlvbiBNVVNUIE5PVFxyXG4rIGluY2x1ZGUgcHJvcGVydGllcyBvdGhlciB0aGFuIHR5cGUsIHBheWxvYWQsIGVycm9yLCBhbmQgbWV0YS5cclxuKi9cclxuXHJcbi8vIGNyZWF0b3JzXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRNYXhWaWV3UG9ydHMobWF4KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IFNFVF9NQVhfVklFV1BPUlRTLFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICBtYXgsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRIaXN0b3J5KGRhdGEpIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogSU5TRVJUX0hJU1RPUlksXHJcbiAgICBwYXlsb2FkOiB7XHJcbiAgICAgIGRhdGEsXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIl19