define('argos/_Templated', ['module', 'exports', 'dojo/_base/declare', 'dijit/_TemplatedMixin'], function (module, exports, _declare, _TemplatedMixin2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TemplatedMixin3 = _interopRequireDefault(_TemplatedMixin2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos._Templated
   * @classdesc _Templated serves as an override for dijit Widgets to enable the use of
   * Simplates for templates it also holds the function to pull the resource strings from l20n.
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

  var __class = (0, _declare2.default)('argos._Templated', [_TemplatedMixin3.default], /** @lends argos._Templated# */{

    _stringRepl: function _stringRepl(tmpl) {
      return tmpl;
    },
    /**
     * Processes `this.widgetTemplate` or `this.contentTemplate`
     */
    buildRendering: function buildRendering() {
      if (this.widgetTemplate && this.contentTemplate) {
        throw new Error('Both "widgetTemplate" and "contentTemplate" cannot be specified at the same time.');
      }

      if (this.contentTemplate) {
        this.templateString = ['<div>', this.contentTemplate.apply(this), '</div>'].join('');
      } else if (this.widgetTemplate) {
        this.templateString = this.widgetTemplate.apply(this);
        var root = $(this.templateString);

        if (root.length > 1) {
          this.templateString = ['<div>', this.templateString, '</div>'].join('');
        }
      }

      this.inherited(buildRendering, arguments);
    },
    startup: function startup() {
      var _this = this;

      this.inherited(startup, arguments);
      setTimeout(function () {
        _this.initSoho();
      }, 1);
    },
    initSoho: function initSoho() {},
    updateSoho: function updateSoho() {}
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fVGVtcGxhdGVkLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJfc3RyaW5nUmVwbCIsInRtcGwiLCJidWlsZFJlbmRlcmluZyIsIndpZGdldFRlbXBsYXRlIiwiY29udGVudFRlbXBsYXRlIiwiRXJyb3IiLCJ0ZW1wbGF0ZVN0cmluZyIsImFwcGx5Iiwiam9pbiIsInJvb3QiLCIkIiwibGVuZ3RoIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwic3RhcnR1cCIsInNldFRpbWVvdXQiLCJpbml0U29obyIsInVwZGF0ZVNvaG8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7QUFuQkE7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxVQUFVLHVCQUFRLGtCQUFSLEVBQTRCLDBCQUE1QixFQUErQywrQkFBK0I7O0FBRTVGQyxpQkFBYSxTQUFTQSxXQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUN0QyxhQUFPQSxJQUFQO0FBQ0QsS0FKMkY7QUFLNUY7OztBQUdBQyxvQkFBZ0IsU0FBU0EsY0FBVCxHQUEwQjtBQUN4QyxVQUFJLEtBQUtDLGNBQUwsSUFBdUIsS0FBS0MsZUFBaEMsRUFBaUQ7QUFDL0MsY0FBTSxJQUFJQyxLQUFKLENBQVUsbUZBQVYsQ0FBTjtBQUNEOztBQUVELFVBQUksS0FBS0QsZUFBVCxFQUEwQjtBQUN4QixhQUFLRSxjQUFMLEdBQXNCLENBQUMsT0FBRCxFQUFVLEtBQUtGLGVBQUwsQ0FBcUJHLEtBQXJCLENBQTJCLElBQTNCLENBQVYsRUFBNEMsUUFBNUMsRUFBc0RDLElBQXRELENBQTJELEVBQTNELENBQXRCO0FBQ0QsT0FGRCxNQUVPLElBQUksS0FBS0wsY0FBVCxFQUF5QjtBQUM5QixhQUFLRyxjQUFMLEdBQXNCLEtBQUtILGNBQUwsQ0FBb0JJLEtBQXBCLENBQTBCLElBQTFCLENBQXRCO0FBQ0EsWUFBTUUsT0FBT0MsRUFBRSxLQUFLSixjQUFQLENBQWI7O0FBRUEsWUFBSUcsS0FBS0UsTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CLGVBQUtMLGNBQUwsR0FBc0IsQ0FBQyxPQUFELEVBQVUsS0FBS0EsY0FBZixFQUErQixRQUEvQixFQUF5Q0UsSUFBekMsQ0FBOEMsRUFBOUMsQ0FBdEI7QUFDRDtBQUNGOztBQUVELFdBQUtJLFNBQUwsQ0FBZVYsY0FBZixFQUErQlcsU0FBL0I7QUFDRCxLQXpCMkY7QUEwQjVGQyxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFBQTs7QUFDMUIsV0FBS0YsU0FBTCxDQUFlRSxPQUFmLEVBQXdCRCxTQUF4QjtBQUNBRSxpQkFBVyxZQUFNO0FBQ2YsY0FBS0MsUUFBTDtBQUNELE9BRkQsRUFFRyxDQUZIO0FBR0QsS0EvQjJGO0FBZ0M1RkEsY0FBVSxTQUFTQSxRQUFULEdBQW9CLENBQzdCLENBakMyRjtBQWtDNUZDLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0IsQ0FDakM7QUFuQzJGLEdBQTlFLENBQWhCOztvQkFzQ2VsQixPIiwiZmlsZSI6Il9UZW1wbGF0ZWQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfVGVtcGxhdGVkTWl4aW4gZnJvbSAnZGlqaXQvX1RlbXBsYXRlZE1peGluJztcclxuXHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9UZW1wbGF0ZWRcclxuICogQGNsYXNzZGVzYyBfVGVtcGxhdGVkIHNlcnZlcyBhcyBhbiBvdmVycmlkZSBmb3IgZGlqaXQgV2lkZ2V0cyB0byBlbmFibGUgdGhlIHVzZSBvZlxyXG4gKiBTaW1wbGF0ZXMgZm9yIHRlbXBsYXRlcyBpdCBhbHNvIGhvbGRzIHRoZSBmdW5jdGlvbiB0byBwdWxsIHRoZSByZXNvdXJjZSBzdHJpbmdzIGZyb20gbDIwbi5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fVGVtcGxhdGVkJywgW19UZW1wbGF0ZWRNaXhpbl0sIC8qKiBAbGVuZHMgYXJnb3MuX1RlbXBsYXRlZCMgKi97XHJcblxyXG4gIF9zdHJpbmdSZXBsOiBmdW5jdGlvbiBfc3RyaW5nUmVwbCh0bXBsKSB7XHJcbiAgICByZXR1cm4gdG1wbDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFByb2Nlc3NlcyBgdGhpcy53aWRnZXRUZW1wbGF0ZWAgb3IgYHRoaXMuY29udGVudFRlbXBsYXRlYFxyXG4gICAqL1xyXG4gIGJ1aWxkUmVuZGVyaW5nOiBmdW5jdGlvbiBidWlsZFJlbmRlcmluZygpIHtcclxuICAgIGlmICh0aGlzLndpZGdldFRlbXBsYXRlICYmIHRoaXMuY29udGVudFRlbXBsYXRlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQm90aCBcIndpZGdldFRlbXBsYXRlXCIgYW5kIFwiY29udGVudFRlbXBsYXRlXCIgY2Fubm90IGJlIHNwZWNpZmllZCBhdCB0aGUgc2FtZSB0aW1lLicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmNvbnRlbnRUZW1wbGF0ZSkge1xyXG4gICAgICB0aGlzLnRlbXBsYXRlU3RyaW5nID0gWyc8ZGl2PicsIHRoaXMuY29udGVudFRlbXBsYXRlLmFwcGx5KHRoaXMpLCAnPC9kaXY+J10uam9pbignJyk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMud2lkZ2V0VGVtcGxhdGUpIHtcclxuICAgICAgdGhpcy50ZW1wbGF0ZVN0cmluZyA9IHRoaXMud2lkZ2V0VGVtcGxhdGUuYXBwbHkodGhpcyk7XHJcbiAgICAgIGNvbnN0IHJvb3QgPSAkKHRoaXMudGVtcGxhdGVTdHJpbmcpO1xyXG5cclxuICAgICAgaWYgKHJvb3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVTdHJpbmcgPSBbJzxkaXY+JywgdGhpcy50ZW1wbGF0ZVN0cmluZywgJzwvZGl2PiddLmpvaW4oJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQoYnVpbGRSZW5kZXJpbmcsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc3RhcnR1cCwgYXJndW1lbnRzKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmluaXRTb2hvKCk7XHJcbiAgICB9LCAxKTtcclxuICB9LFxyXG4gIGluaXRTb2hvOiBmdW5jdGlvbiBpbml0U29obygpIHtcclxuICB9LFxyXG4gIHVwZGF0ZVNvaG86IGZ1bmN0aW9uIHVwZGF0ZVNvaG8oKSB7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=