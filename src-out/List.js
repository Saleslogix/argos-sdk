define('argos/List', ['module', 'exports', 'dojo/_base/declare', './_ListBase', './_SDataListMixin', './_RelatedViewWidgetListMixin'], function (module, exports, _declare, _ListBase2, _SDataListMixin2, _RelatedViewWidgetListMixin) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _ListBase3 = _interopRequireDefault(_ListBase2);

  var _SDataListMixin3 = _interopRequireDefault(_SDataListMixin2);

  var _RelatedViewWidgetListMixin2 = _interopRequireDefault(_RelatedViewWidgetListMixin);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.List
   * @classdesc List extends _ListBase and mixes in _SDataListMixin to provide backwards compatibility for consumers.
   * @extends argos._ListBase
   * @requires argos._ListBase
   * @requires argos._SDataListMixin
   * @mixins argos._RelateViewdWidgetListMixin
   */
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

  var __class = (0, _declare2.default)('argos.List', [_ListBase3.default, _SDataListMixin3.default, _RelatedViewWidgetListMixin2.default], {});
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MaXN0LmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7Ozs7O0FBcEJBOzs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsTUFBTUEsVUFBVSx1QkFBUSxZQUFSLEVBQXNCLG9GQUF0QixFQUE2RSxFQUE3RSxDQUFoQjtvQkFDZUEsTyIsImZpbGUiOiJMaXN0LmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX0xpc3RCYXNlIGZyb20gJy4vX0xpc3RCYXNlJztcclxuaW1wb3J0IF9TRGF0YUxpc3RNaXhpbiBmcm9tICcuL19TRGF0YUxpc3RNaXhpbic7XHJcbmltcG9ydCBfUmVsYXRlZFdpZGdldExpc3RNaXhpbiBmcm9tICcuL19SZWxhdGVkVmlld1dpZGdldExpc3RNaXhpbic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkxpc3RcclxuICogQGNsYXNzZGVzYyBMaXN0IGV4dGVuZHMgX0xpc3RCYXNlIGFuZCBtaXhlcyBpbiBfU0RhdGFMaXN0TWl4aW4gdG8gcHJvdmlkZSBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3IgY29uc3VtZXJzLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fTGlzdEJhc2VcclxuICogQHJlcXVpcmVzIGFyZ29zLl9MaXN0QmFzZVxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuX1NEYXRhTGlzdE1peGluXHJcbiAqIEBtaXhpbnMgYXJnb3MuX1JlbGF0ZVZpZXdkV2lkZ2V0TGlzdE1peGluXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTGlzdCcsIFtfTGlzdEJhc2UsIF9TRGF0YUxpc3RNaXhpbiwgX1JlbGF0ZWRXaWRnZXRMaXN0TWl4aW5dLCB7fSk7XHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==