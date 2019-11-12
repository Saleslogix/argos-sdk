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

  var __class = (0, _declare2.default)('argos.LanguageService', [], {
    getLanguage: function getLanguage() {
      return window.localStorage && window.localStorage.getItem('language');
    },
    getRegion: function getRegion() {
      return window.localStorage && window.localStorage.getItem('region');
    },
    setLanguage: function setLanguage(value) {
      var language = this.normalizeLocale(value) || value;
      return window.localStorage && window.localStorage.setItem('language', language);
    },
    setRegion: function setRegion(value) {
      var region = this.normalizeLocale(value) || value;
      return window.localStorage && window.localStorage.setItem('region', region);
    },
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
    getLanguages: function getLanguages() {
      return window.supportedLocales;
    },
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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MYW5ndWFnZVNlcnZpY2UuanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImdldExhbmd1YWdlIiwid2luZG93IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImdldFJlZ2lvbiIsInNldExhbmd1YWdlIiwidmFsdWUiLCJsYW5ndWFnZSIsIm5vcm1hbGl6ZUxvY2FsZSIsInNldEl0ZW0iLCJzZXRSZWdpb24iLCJyZWdpb24iLCJub3JtYWxpemVMYW5ndWFnZUNvZGUiLCJsb2NhbGUiLCJsZW5ndGgiLCJzcGxpdCIsInRvVXBwZXJDYXNlIiwiZ2V0TGFuZ3VhZ2VzIiwic3VwcG9ydGVkTG9jYWxlcyIsImJlc3RBdmFpbGFibGVMb2NhbGUiLCJCZXN0QXZhaWxhYmxlTG9jYWxlIiwiYXZhaWxhYmxlTG9jYWxlcyIsImNhbmRpZGF0ZSIsImluZGV4T2YiLCJwb3MiLCJsYXN0SW5kZXhPZiIsInVuZGVmaW5lZCIsInN1YnN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFNQSxVQUFVLHVCQUFRLHVCQUFSLEVBQWlDLEVBQWpDLEVBQXFDO0FBQ25EQyxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLGFBQU9DLE9BQU9DLFlBQVAsSUFBdUJELE9BQU9DLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLENBQTlCO0FBQ0QsS0FIa0Q7QUFJbkRDLGVBQVcsU0FBU0EsU0FBVCxHQUFxQjtBQUM5QixhQUFPSCxPQUFPQyxZQUFQLElBQXVCRCxPQUFPQyxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixRQUE1QixDQUE5QjtBQUNELEtBTmtEO0FBT25ERSxpQkFBYSxTQUFTQSxXQUFULENBQXFCQyxLQUFyQixFQUE0QjtBQUN2QyxVQUFNQyxXQUFXLEtBQUtDLGVBQUwsQ0FBcUJGLEtBQXJCLEtBQStCQSxLQUFoRDtBQUNBLGFBQU9MLE9BQU9DLFlBQVAsSUFBdUJELE9BQU9DLFlBQVAsQ0FBb0JPLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDRixRQUF4QyxDQUE5QjtBQUNELEtBVmtEO0FBV25ERyxlQUFXLFNBQVNBLFNBQVQsQ0FBbUJKLEtBQW5CLEVBQTBCO0FBQ25DLFVBQU1LLFNBQVMsS0FBS0gsZUFBTCxDQUFxQkYsS0FBckIsS0FBK0JBLEtBQTlDO0FBQ0EsYUFBT0wsT0FBT0MsWUFBUCxJQUF1QkQsT0FBT0MsWUFBUCxDQUFvQk8sT0FBcEIsQ0FBNEIsUUFBNUIsRUFBc0NFLE1BQXRDLENBQTlCO0FBQ0QsS0Fka0Q7QUFlbkRILHFCQUFpQixTQUFTSSxxQkFBVCxDQUErQkMsTUFBL0IsRUFBdUM7QUFDdEQsVUFBSU4sV0FBV00sTUFBZjtBQUNBLFVBQUlOLFNBQVNPLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsWUFBTUMsUUFBUUYsT0FBT0UsS0FBUCxDQUFhLEdBQWIsQ0FBZDtBQUNBLFlBQUlBLE1BQU0sQ0FBTixNQUFhQSxNQUFNLENBQU4sQ0FBakIsRUFBMkI7QUFDekJSLHFCQUFXUSxNQUFNLENBQU4sQ0FBWDtBQUNELFNBRkQsTUFFTyxJQUFJQSxNQUFNLENBQU4sQ0FBSixFQUFjO0FBQ25CUixxQkFBY1EsTUFBTSxDQUFOLENBQWQsU0FBMEJBLE1BQU0sQ0FBTixFQUFTQyxXQUFULEVBQTFCO0FBQ0Q7QUFDRjtBQUNELGFBQU9ULFFBQVA7QUFDRCxLQTFCa0Q7QUEyQm5EVSxrQkFBYyxTQUFTQSxZQUFULEdBQXdCO0FBQ3BDLGFBQU9oQixPQUFPaUIsZ0JBQWQ7QUFDRCxLQTdCa0Q7QUE4Qm5EQyx5QkFBcUIsU0FBU0MsbUJBQVQsQ0FBNkJDLGdCQUE3QixFQUErQ1IsTUFBL0MsRUFBdUQ7QUFDMUUsVUFBSVMsWUFBWSxLQUFLZCxlQUFMLENBQXFCSyxNQUFyQixDQUFoQjtBQUNBLFVBQUlRLGlCQUFpQkUsT0FBakIsQ0FBeUJELFNBQXpCLE1BQXdDLENBQUMsQ0FBN0MsRUFBZ0Q7QUFDOUMsZUFBT0EsU0FBUDtBQUNEO0FBQ0QsVUFBSUUsTUFBTUYsVUFBVUcsV0FBVixDQUFzQixHQUF0QixDQUFWO0FBQ0EsVUFBSUQsUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDZCxlQUFPRSxTQUFQO0FBQ0Q7QUFDRCxVQUFJRixPQUFPLENBQVAsSUFBWUYsVUFBVUUsTUFBTSxDQUFoQixNQUF1QixHQUF2QyxFQUE0QztBQUMxQ0EsZUFBTyxDQUFQO0FBQ0Q7QUFDREYsa0JBQVlBLFVBQVVLLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBdUJILEdBQXZCLENBQVo7QUFDQSxhQUFPRixTQUFQO0FBQ0Q7QUE1Q2tELEdBQXJDLENBQWhCLEMsQ0FqQkE7Ozs7Ozs7Ozs7Ozs7OztvQkErRGV2QixPIiwiZmlsZSI6Ikxhbmd1YWdlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcblxyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTGFuZ3VhZ2VTZXJ2aWNlJywgW10sIHtcclxuICBnZXRMYW5ndWFnZTogZnVuY3Rpb24gZ2V0TGFuZ3VhZ2UoKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhbmd1YWdlJyk7XHJcbiAgfSxcclxuICBnZXRSZWdpb246IGZ1bmN0aW9uIGdldFJlZ2lvbigpIHtcclxuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVnaW9uJyk7XHJcbiAgfSxcclxuICBzZXRMYW5ndWFnZTogZnVuY3Rpb24gc2V0TGFuZ3VhZ2UodmFsdWUpIHtcclxuICAgIGNvbnN0IGxhbmd1YWdlID0gdGhpcy5ub3JtYWxpemVMb2NhbGUodmFsdWUpIHx8IHZhbHVlO1xyXG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UgJiYgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYW5ndWFnZScsIGxhbmd1YWdlKTtcclxuICB9LFxyXG4gIHNldFJlZ2lvbjogZnVuY3Rpb24gc2V0UmVnaW9uKHZhbHVlKSB7XHJcbiAgICBjb25zdCByZWdpb24gPSB0aGlzLm5vcm1hbGl6ZUxvY2FsZSh2YWx1ZSkgfHwgdmFsdWU7XHJcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZSAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZ2lvbicsIHJlZ2lvbik7XHJcbiAgfSxcclxuICBub3JtYWxpemVMb2NhbGU6IGZ1bmN0aW9uIG5vcm1hbGl6ZUxhbmd1YWdlQ29kZShsb2NhbGUpIHtcclxuICAgIGxldCBsYW5ndWFnZSA9IGxvY2FsZTtcclxuICAgIGlmIChsYW5ndWFnZS5sZW5ndGggPiAyKSB7XHJcbiAgICAgIGNvbnN0IHNwbGl0ID0gbG9jYWxlLnNwbGl0KCctJyk7XHJcbiAgICAgIGlmIChzcGxpdFswXSA9PT0gc3BsaXRbMV0pIHtcclxuICAgICAgICBsYW5ndWFnZSA9IHNwbGl0WzBdO1xyXG4gICAgICB9IGVsc2UgaWYgKHNwbGl0WzFdKSB7XHJcbiAgICAgICAgbGFuZ3VhZ2UgPSBgJHtzcGxpdFswXX0tJHtzcGxpdFsxXS50b1VwcGVyQ2FzZSgpfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBsYW5ndWFnZTtcclxuICB9LFxyXG4gIGdldExhbmd1YWdlczogZnVuY3Rpb24gZ2V0TGFuZ3VhZ2VzKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5zdXBwb3J0ZWRMb2NhbGVzO1xyXG4gIH0sXHJcbiAgYmVzdEF2YWlsYWJsZUxvY2FsZTogZnVuY3Rpb24gQmVzdEF2YWlsYWJsZUxvY2FsZShhdmFpbGFibGVMb2NhbGVzLCBsb2NhbGUpIHtcclxuICAgIGxldCBjYW5kaWRhdGUgPSB0aGlzLm5vcm1hbGl6ZUxvY2FsZShsb2NhbGUpO1xyXG4gICAgaWYgKGF2YWlsYWJsZUxvY2FsZXMuaW5kZXhPZihjYW5kaWRhdGUpICE9PSAtMSkge1xyXG4gICAgICByZXR1cm4gY2FuZGlkYXRlO1xyXG4gICAgfVxyXG4gICAgbGV0IHBvcyA9IGNhbmRpZGF0ZS5sYXN0SW5kZXhPZignLScpO1xyXG4gICAgaWYgKHBvcyA9PT0gLTEpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGlmIChwb3MgPj0gMiAmJiBjYW5kaWRhdGVbcG9zIC0gMl0gPT09ICctJykge1xyXG4gICAgICBwb3MgLT0gMjtcclxuICAgIH1cclxuICAgIGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZS5zdWJzdHJpbmcoMCwgcG9zKTtcclxuICAgIHJldHVybiBjYW5kaWRhdGU7XHJcbiAgfSxcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==