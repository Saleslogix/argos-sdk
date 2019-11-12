define('argos/Detail', ['module', 'exports', 'dojo/_base/declare', './_DetailBase', './_SDataDetailMixin', './_RelatedViewWidgetDetailMixin', './Offline/_DetailOfflineMixin'], function (module, exports, _declare, _DetailBase2, _SDataDetailMixin2, _RelatedViewWidgetDetailMixin, _DetailOfflineMixin2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _DetailBase3 = _interopRequireDefault(_DetailBase2);

  var _SDataDetailMixin3 = _interopRequireDefault(_SDataDetailMixin2);

  var _RelatedViewWidgetDetailMixin2 = _interopRequireDefault(_RelatedViewWidgetDetailMixin);

  var _DetailOfflineMixin3 = _interopRequireDefault(_DetailOfflineMixin2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Detail
   * @classdesc Extends _DetailBase and mixes in _SDataDetailMixin to provide backwards compatibility to consumers.
   * @extends argos._DetailBase
   * @requires argos._DetailBase
   * @requires argos._SDataDetailMixin
   * @mixins argos._SDataDetailMixin
   * @mixins argos._RelatedViewWidgetDetailMixin
   */
  var __class = (0, _declare2.default)('argos.Detail', [_DetailBase3.default, _SDataDetailMixin3.default, _RelatedViewWidgetDetailMixin2.default, _DetailOfflineMixin3.default], {}); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZXRhaWwuanMiXSwibmFtZXMiOlsiX19jbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOzs7Ozs7Ozs7QUFTQSxNQUFNQSxVQUFVLHVCQUFRLGNBQVIsRUFBd0Isd0hBQXhCLEVBQTBHLEVBQTFHLENBQWhCLEMsQ0E5QkE7Ozs7Ozs7Ozs7Ozs7OztvQkFnQ2VBLE8iLCJmaWxlIjoiRGV0YWlsLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX0RldGFpbEJhc2UgZnJvbSAnLi9fRGV0YWlsQmFzZSc7XHJcbmltcG9ydCBfU0RhdGFEZXRhaWxNaXhpbiBmcm9tICcuL19TRGF0YURldGFpbE1peGluJztcclxuaW1wb3J0IF9SZWxhdGVkV2lkZ2V0RGV0YWlsTWl4aW4gZnJvbSAnLi9fUmVsYXRlZFZpZXdXaWRnZXREZXRhaWxNaXhpbic7XHJcbmltcG9ydCBfRGV0YWlsT2ZmbGluZU1peGluIGZyb20gJy4vT2ZmbGluZS9fRGV0YWlsT2ZmbGluZU1peGluJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRGV0YWlsXHJcbiAqIEBjbGFzc2Rlc2MgRXh0ZW5kcyBfRGV0YWlsQmFzZSBhbmQgbWl4ZXMgaW4gX1NEYXRhRGV0YWlsTWl4aW4gdG8gcHJvdmlkZSBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB0byBjb25zdW1lcnMuXHJcbiAqIEBleHRlbmRzIGFyZ29zLl9EZXRhaWxCYXNlXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5fRGV0YWlsQmFzZVxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuX1NEYXRhRGV0YWlsTWl4aW5cclxuICogQG1peGlucyBhcmdvcy5fU0RhdGFEZXRhaWxNaXhpblxyXG4gKiBAbWl4aW5zIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldERldGFpbE1peGluXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuRGV0YWlsJywgW19EZXRhaWxCYXNlLCBfU0RhdGFEZXRhaWxNaXhpbiwgX1JlbGF0ZWRXaWRnZXREZXRhaWxNaXhpbiwgX0RldGFpbE9mZmxpbmVNaXhpbl0sIHt9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==