define('argos/I18n', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getResource;

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function getResource(id) {
    var _window = window,
        defaultLocaleContext = _window.defaultLocaleContext,
        localeContext = _window.localeContext,
        regionalContext = _window.regionalContext;

    if (!defaultLocaleContext || !localeContext) {
      return new Proxy({}, {
        properties: [],
        get: function get(target, name) {
          if (name in target) {
            return target[name];
          }
          return '';
        }
      });
    }

    var defaultAttributes = defaultLocaleContext.getEntitySync(id).attributes;
    var currentAttributes = localeContext.getEntitySync(id).attributes;
    var regionalattributes = regionalContext.getEntitySync(id).attributes;

    _lang2.default.mixin(defaultAttributes, currentAttributes);
    return _lang2.default.mixin(defaultAttributes, regionalattributes);
  } /* Copyright 2017 Infor
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

  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JMThuLmpzIl0sIm5hbWVzIjpbImdldFJlc291cmNlIiwiaWQiLCJ3aW5kb3ciLCJkZWZhdWx0TG9jYWxlQ29udGV4dCIsImxvY2FsZUNvbnRleHQiLCJyZWdpb25hbENvbnRleHQiLCJQcm94eSIsInByb3BlcnRpZXMiLCJnZXQiLCJ0YXJnZXQiLCJuYW1lIiwiZGVmYXVsdEF0dHJpYnV0ZXMiLCJnZXRFbnRpdHlTeW5jIiwiYXR0cmlidXRlcyIsImN1cnJlbnRBdHRyaWJ1dGVzIiwicmVnaW9uYWxhdHRyaWJ1dGVzIiwibWl4aW4iXSwibWFwcGluZ3MiOiI7Ozs7b0JBaUJ3QkEsVzs7Ozs7Ozs7OztBQUFULFdBQVNBLFdBQVQsQ0FBcUJDLEVBQXJCLEVBQXlCO0FBQUEsa0JBQzJCQyxNQUQzQjtBQUFBLFFBQzlCQyxvQkFEOEIsV0FDOUJBLG9CQUQ4QjtBQUFBLFFBQ1JDLGFBRFEsV0FDUkEsYUFEUTtBQUFBLFFBQ09DLGVBRFAsV0FDT0EsZUFEUDs7QUFFdEMsUUFBSSxDQUFDRixvQkFBRCxJQUF5QixDQUFDQyxhQUE5QixFQUE2QztBQUMzQyxhQUFPLElBQUlFLEtBQUosQ0FBVSxFQUFWLEVBQWM7QUFDbkJDLG9CQUFZLEVBRE87QUFFbkJDLFdBRm1CLGVBRWZDLE1BRmUsRUFFUEMsSUFGTyxFQUVEO0FBQ2hCLGNBQUlBLFFBQVFELE1BQVosRUFBb0I7QUFDbEIsbUJBQU9BLE9BQU9DLElBQVAsQ0FBUDtBQUNEO0FBQ0QsaUJBQU8sRUFBUDtBQUNEO0FBUGtCLE9BQWQsQ0FBUDtBQVNEOztBQUVELFFBQU1DLG9CQUFvQlIscUJBQXFCUyxhQUFyQixDQUFtQ1gsRUFBbkMsRUFBdUNZLFVBQWpFO0FBQ0EsUUFBTUMsb0JBQW9CVixjQUFjUSxhQUFkLENBQTRCWCxFQUE1QixFQUFnQ1ksVUFBMUQ7QUFDQSxRQUFNRSxxQkFBcUJWLGdCQUFnQk8sYUFBaEIsQ0FBOEJYLEVBQTlCLEVBQWtDWSxVQUE3RDs7QUFFQSxtQkFBS0csS0FBTCxDQUFXTCxpQkFBWCxFQUE4QkcsaUJBQTlCO0FBQ0EsV0FBTyxlQUFLRSxLQUFMLENBQVdMLGlCQUFYLEVBQThCSSxrQkFBOUIsQ0FBUDtBQUNELEcsQ0FyQ0QiLCJmaWxlIjoiSTE4bi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRSZXNvdXJjZShpZCkge1xyXG4gIGNvbnN0IHsgZGVmYXVsdExvY2FsZUNvbnRleHQsIGxvY2FsZUNvbnRleHQsIHJlZ2lvbmFsQ29udGV4dCB9ID0gd2luZG93O1xyXG4gIGlmICghZGVmYXVsdExvY2FsZUNvbnRleHQgfHwgIWxvY2FsZUNvbnRleHQpIHtcclxuICAgIHJldHVybiBuZXcgUHJveHkoe30sIHtcclxuICAgICAgcHJvcGVydGllczogW10sXHJcbiAgICAgIGdldCh0YXJnZXQsIG5hbWUpIHtcclxuICAgICAgICBpZiAobmFtZSBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGVmYXVsdEF0dHJpYnV0ZXMgPSBkZWZhdWx0TG9jYWxlQ29udGV4dC5nZXRFbnRpdHlTeW5jKGlkKS5hdHRyaWJ1dGVzO1xyXG4gIGNvbnN0IGN1cnJlbnRBdHRyaWJ1dGVzID0gbG9jYWxlQ29udGV4dC5nZXRFbnRpdHlTeW5jKGlkKS5hdHRyaWJ1dGVzO1xyXG4gIGNvbnN0IHJlZ2lvbmFsYXR0cmlidXRlcyA9IHJlZ2lvbmFsQ29udGV4dC5nZXRFbnRpdHlTeW5jKGlkKS5hdHRyaWJ1dGVzO1xyXG5cclxuICBsYW5nLm1peGluKGRlZmF1bHRBdHRyaWJ1dGVzLCBjdXJyZW50QXR0cmlidXRlcyk7XHJcbiAgcmV0dXJuIGxhbmcubWl4aW4oZGVmYXVsdEF0dHJpYnV0ZXMsIHJlZ2lvbmFsYXR0cmlidXRlcyk7XHJcbn1cclxuIl19