define('argos/Edit', ['module', 'exports', 'dojo/_base/declare', './_EditBase', './_SDataEditMixin', './_RelatedViewWidgetEditMixin'], function (module, exports, _declare, _EditBase2, _SDataEditMixin2, _RelatedViewWidgetEditMixin) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _EditBase3 = _interopRequireDefault(_EditBase2);

  var _SDataEditMixin3 = _interopRequireDefault(_SDataEditMixin2);

  var _RelatedViewWidgetEditMixin2 = _interopRequireDefault(_RelatedViewWidgetEditMixin);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Edit
   * @classdesc Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
   * @extends argos._EditBase
   * @requires argos._EditBase
   * @requires argos._SDataEditMixin
   * @mixins argos._SDataEditMixin
   * @requires argos._RelatedViewWidgetEditMixin
   * @mixins argos._RelatedViewWidgetEditMixin
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

  var __class = (0, _declare2.default)('argos.Edit', [_EditBase3.default, _SDataEditMixin3.default, _RelatedViewWidgetEditMixin2.default], {});
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FZGl0LmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7Ozs7Ozs7QUFwQkE7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNQSxVQUFVLHVCQUFRLFlBQVIsRUFBc0Isb0ZBQXRCLEVBQTZFLEVBQTdFLENBQWhCO29CQUNlQSxPIiwiZmlsZSI6IkVkaXQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfRWRpdEJhc2UgZnJvbSAnLi9fRWRpdEJhc2UnO1xyXG5pbXBvcnQgX1NEYXRhRWRpdE1peGluIGZyb20gJy4vX1NEYXRhRWRpdE1peGluJztcclxuaW1wb3J0IF9SZWxhdGVkV2lkZ2V0RWRpdE1peGluIGZyb20gJy4vX1JlbGF0ZWRWaWV3V2lkZ2V0RWRpdE1peGluJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRWRpdFxyXG4gKiBAY2xhc3NkZXNjIEVkaXQgZXh0ZW5kcyBfRWRpdEJhc2UgYW5kIG1peGVzIGluIF9TRGF0YUVkaXRNaXhpbiB0byBwcm92aWRlIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciBjb25zdW1lcnMuXHJcbiAqIEBleHRlbmRzIGFyZ29zLl9FZGl0QmFzZVxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuX0VkaXRCYXNlXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5fU0RhdGFFZGl0TWl4aW5cclxuICogQG1peGlucyBhcmdvcy5fU0RhdGFFZGl0TWl4aW5cclxuICogQHJlcXVpcmVzIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldEVkaXRNaXhpblxyXG4gKiBAbWl4aW5zIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldEVkaXRNaXhpblxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkVkaXQnLCBbX0VkaXRCYXNlLCBfU0RhdGFFZGl0TWl4aW4sIF9SZWxhdGVkV2lkZ2V0RWRpdE1peGluXSwge30pO1xyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=