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

      this.inherited(arguments);
    },
    startup: function startup() {
      var _this = this;

      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fVGVtcGxhdGVkLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJfc3RyaW5nUmVwbCIsInRtcGwiLCJidWlsZFJlbmRlcmluZyIsIndpZGdldFRlbXBsYXRlIiwiY29udGVudFRlbXBsYXRlIiwiRXJyb3IiLCJ0ZW1wbGF0ZVN0cmluZyIsImFwcGx5Iiwiam9pbiIsInJvb3QiLCIkIiwibGVuZ3RoIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwic3RhcnR1cCIsInNldFRpbWVvdXQiLCJpbml0U29obyIsInVwZGF0ZVNvaG8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7QUFuQkE7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxVQUFVLHVCQUFRLGtCQUFSLEVBQTRCLDBCQUE1QixFQUErQywrQkFBK0I7O0FBRTVGQyxpQkFBYSxTQUFTQSxXQUFULENBQXFCQyxJQUFyQixFQUEyQjtBQUN0QyxhQUFPQSxJQUFQO0FBQ0QsS0FKMkY7QUFLNUY7OztBQUdBQyxvQkFBZ0IsU0FBU0EsY0FBVCxHQUEwQjtBQUN4QyxVQUFJLEtBQUtDLGNBQUwsSUFBdUIsS0FBS0MsZUFBaEMsRUFBaUQ7QUFDL0MsY0FBTSxJQUFJQyxLQUFKLENBQVUsbUZBQVYsQ0FBTjtBQUNEOztBQUVELFVBQUksS0FBS0QsZUFBVCxFQUEwQjtBQUN4QixhQUFLRSxjQUFMLEdBQXNCLENBQUMsT0FBRCxFQUFVLEtBQUtGLGVBQUwsQ0FBcUJHLEtBQXJCLENBQTJCLElBQTNCLENBQVYsRUFBNEMsUUFBNUMsRUFBc0RDLElBQXRELENBQTJELEVBQTNELENBQXRCO0FBQ0QsT0FGRCxNQUVPLElBQUksS0FBS0wsY0FBVCxFQUF5QjtBQUM5QixhQUFLRyxjQUFMLEdBQXNCLEtBQUtILGNBQUwsQ0FBb0JJLEtBQXBCLENBQTBCLElBQTFCLENBQXRCO0FBQ0EsWUFBTUUsT0FBT0MsRUFBRSxLQUFLSixjQUFQLENBQWI7O0FBRUEsWUFBSUcsS0FBS0UsTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CLGVBQUtMLGNBQUwsR0FBc0IsQ0FBQyxPQUFELEVBQVUsS0FBS0EsY0FBZixFQUErQixRQUEvQixFQUF5Q0UsSUFBekMsQ0FBOEMsRUFBOUMsQ0FBdEI7QUFDRDtBQUNGOztBQUVELFdBQUtJLFNBQUwsQ0FBZUMsU0FBZjtBQUNELEtBekIyRjtBQTBCNUZDLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUFBOztBQUMxQixXQUFLRixTQUFMLENBQWVDLFNBQWY7QUFDQUUsaUJBQVcsWUFBTTtBQUNmLGNBQUtDLFFBQUw7QUFDRCxPQUZELEVBRUcsQ0FGSDtBQUdELEtBL0IyRjtBQWdDNUZBLGNBQVUsU0FBU0EsUUFBVCxHQUFvQixDQUM3QixDQWpDMkY7QUFrQzVGQyxnQkFBWSxTQUFTQSxVQUFULEdBQXNCLENBQ2pDO0FBbkMyRixHQUE5RSxDQUFoQjs7b0JBc0NlbEIsTyIsImZpbGUiOiJfVGVtcGxhdGVkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZE1peGluIGZyb20gJ2Rpaml0L19UZW1wbGF0ZWRNaXhpbic7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fVGVtcGxhdGVkXHJcbiAqIEBjbGFzc2Rlc2MgX1RlbXBsYXRlZCBzZXJ2ZXMgYXMgYW4gb3ZlcnJpZGUgZm9yIGRpaml0IFdpZGdldHMgdG8gZW5hYmxlIHRoZSB1c2Ugb2ZcclxuICogU2ltcGxhdGVzIGZvciB0ZW1wbGF0ZXMgaXQgYWxzbyBob2xkcyB0aGUgZnVuY3Rpb24gdG8gcHVsbCB0aGUgcmVzb3VyY2Ugc3RyaW5ncyBmcm9tIGwyMG4uXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX1RlbXBsYXRlZCcsIFtfVGVtcGxhdGVkTWl4aW5dLCAvKiogQGxlbmRzIGFyZ29zLl9UZW1wbGF0ZWQjICove1xyXG5cclxuICBfc3RyaW5nUmVwbDogZnVuY3Rpb24gX3N0cmluZ1JlcGwodG1wbCkge1xyXG4gICAgcmV0dXJuIHRtcGw7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBQcm9jZXNzZXMgYHRoaXMud2lkZ2V0VGVtcGxhdGVgIG9yIGB0aGlzLmNvbnRlbnRUZW1wbGF0ZWBcclxuICAgKi9cclxuICBidWlsZFJlbmRlcmluZzogZnVuY3Rpb24gYnVpbGRSZW5kZXJpbmcoKSB7XHJcbiAgICBpZiAodGhpcy53aWRnZXRUZW1wbGF0ZSAmJiB0aGlzLmNvbnRlbnRUZW1wbGF0ZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvdGggXCJ3aWRnZXRUZW1wbGF0ZVwiIGFuZCBcImNvbnRlbnRUZW1wbGF0ZVwiIGNhbm5vdCBiZSBzcGVjaWZpZWQgYXQgdGhlIHNhbWUgdGltZS4nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jb250ZW50VGVtcGxhdGUpIHtcclxuICAgICAgdGhpcy50ZW1wbGF0ZVN0cmluZyA9IFsnPGRpdj4nLCB0aGlzLmNvbnRlbnRUZW1wbGF0ZS5hcHBseSh0aGlzKSwgJzwvZGl2PiddLmpvaW4oJycpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLndpZGdldFRlbXBsYXRlKSB7XHJcbiAgICAgIHRoaXMudGVtcGxhdGVTdHJpbmcgPSB0aGlzLndpZGdldFRlbXBsYXRlLmFwcGx5KHRoaXMpO1xyXG4gICAgICBjb25zdCByb290ID0gJCh0aGlzLnRlbXBsYXRlU3RyaW5nKTtcclxuXHJcbiAgICAgIGlmIChyb290Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlU3RyaW5nID0gWyc8ZGl2PicsIHRoaXMudGVtcGxhdGVTdHJpbmcsICc8L2Rpdj4nXS5qb2luKCcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmluaXRTb2hvKCk7XHJcbiAgICB9LCAxKTtcclxuICB9LFxyXG4gIGluaXRTb2hvOiBmdW5jdGlvbiBpbml0U29obygpIHtcclxuICB9LFxyXG4gIHVwZGF0ZVNvaG86IGZ1bmN0aW9uIHVwZGF0ZVNvaG8oKSB7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=