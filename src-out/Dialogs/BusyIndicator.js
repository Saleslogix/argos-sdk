define('argos/Dialogs/BusyIndicator', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', '../_Templated', '../I18n'], function (module, exports, _declare, _WidgetBase2, _Templated2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var resource = (0, _I18n2.default)('busyIndicator');

  /**
   * @class argos.Dialogs.BusyIndicator
   */
  var __class = (0, _declare2.default)('argos.Dialogs.BusyIndicator', [_WidgetBase3.default, _Templated3.default], /** @lends argos.Dialogs.BusyIndicator# */{
    widgetTemplate: new Simplate(['<div class="busyIndicator__container {%: $.containerClass %}" aria-live="polite" data-dojo-attach-point="busyIndicatorNode">', '{%! $.busyIndicatorTemplate %}', '{%! $.progressBarTemplate %}', '</div>']),
    busyIndicatorTemplate: new Simplate(['<div class="busy-{%: $.size %}" style="height: 100%; width: 100%;">', '<div class="busy-indicator-container" aria-live="polite" role="status">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span data-dojo-attach-point="labelNode">{%: $.label %}</span>', '</div>', '</div>']),
    progressBarTemplate: new Simplate(['<div class="busyIndicator__progress" data-dojo-attach-point="progressNode">', '</div>']),
    progressLabelTemplate: new Simplate(['<div class="busyIndicator__progress__label" style="text-align:center">{%: $.progressText %}</div>']),
    barTemplate: new Simplate(['<div class="busyIndicator__progress__bar"></div>']),

    _busyDeferred: null,
    _busyIndicator: null,
    _progressBar: null,
    containerClass: null,
    currentProgress: null,
    id: 'busyIndicator-template',
    isAsync: true,
    label: resource.loadingText,
    progressLabelNode: null,
    progressText: resource.progressText,
    size: '', // sm, xs, blank for normal
    totalProgress: null,

    complete: function complete() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      $(this.busyIndicatorNode).removeClass('busyIndicator--active');
      this._busyDeferred(result);
    },
    show: function show() {},
    start: function start() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve) {
        _this._busyDeferred = resolve;
        $(_this.busyIndicatorNode).addClass('busyIndicator--active');

        if (!_this.isAsync || options.isAsync !== undefined && !options.isAsync) {
          _this._progressBar = $(_this.barTemplate.apply(_this));
          _this.progressLabelNode = $(_this.progressLabelTemplate.apply(_this));
          $(_this.progressNode).append(_this.progressLabelNode);
          $(_this.progressNode).append(_this._progressBar);
          _this.currentProgress = options.current || 0;
          _this.totalProgress = options.total || options.count || 0;
        }
      });
    },
    updateProgress: function updateProgress() {
      this.currentProgress = this.currentProgress + 1;
      if (this._progressBar) {
        this._progressBar.css({
          width: 100 * this.currentProgress / this.totalProgress + '%'
        });
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9EaWFsb2dzL0J1c3lJbmRpY2F0b3IuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImJ1c3lJbmRpY2F0b3JUZW1wbGF0ZSIsInByb2dyZXNzQmFyVGVtcGxhdGUiLCJwcm9ncmVzc0xhYmVsVGVtcGxhdGUiLCJiYXJUZW1wbGF0ZSIsIl9idXN5RGVmZXJyZWQiLCJfYnVzeUluZGljYXRvciIsIl9wcm9ncmVzc0JhciIsImNvbnRhaW5lckNsYXNzIiwiY3VycmVudFByb2dyZXNzIiwiaWQiLCJpc0FzeW5jIiwibGFiZWwiLCJsb2FkaW5nVGV4dCIsInByb2dyZXNzTGFiZWxOb2RlIiwicHJvZ3Jlc3NUZXh0Iiwic2l6ZSIsInRvdGFsUHJvZ3Jlc3MiLCJjb21wbGV0ZSIsInJlc3VsdCIsIiQiLCJidXN5SW5kaWNhdG9yTm9kZSIsInJlbW92ZUNsYXNzIiwic2hvdyIsInN0YXJ0Iiwib3B0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwiYWRkQ2xhc3MiLCJ1bmRlZmluZWQiLCJhcHBseSIsInByb2dyZXNzTm9kZSIsImFwcGVuZCIsImN1cnJlbnQiLCJ0b3RhbCIsImNvdW50IiwidXBkYXRlUHJvZ3Jlc3MiLCJjc3MiLCJ3aWR0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTUEsV0FBVyxvQkFBWSxlQUFaLENBQWpCOztBQUVBOzs7QUFHQSxNQUFNQyxVQUFVLHVCQUFRLDZCQUFSLEVBQXVDLDJDQUF2QyxFQUFrRSwwQ0FBMEM7QUFDMUhDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IsOEhBRDJCLEVBRTNCLGdDQUYyQixFQUczQiw4QkFIMkIsRUFJM0IsUUFKMkIsQ0FBYixDQUQwRztBQU8xSEMsMkJBQXVCLElBQUlELFFBQUosQ0FBYSxDQUNsQyxxRUFEa0MsRUFFbEMseUVBRmtDLEVBR2xDLHFDQUhrQyxFQUlsQyw2QkFKa0MsRUFLbEMsNkJBTGtDLEVBTWxDLCtCQU5rQyxFQU9sQyw4QkFQa0MsRUFRbEMsOEJBUmtDLEVBU2xDLFFBVGtDLEVBVWxDLGdFQVZrQyxFQVdsQyxRQVhrQyxFQVlsQyxRQVprQyxDQUFiLENBUG1HO0FBcUIxSEUseUJBQXFCLElBQUlGLFFBQUosQ0FBYSxDQUNoQyw2RUFEZ0MsRUFFaEMsUUFGZ0MsQ0FBYixDQXJCcUc7QUF5QjFIRywyQkFBdUIsSUFBSUgsUUFBSixDQUFhLENBQ2xDLG1HQURrQyxDQUFiLENBekJtRztBQTRCMUhJLGlCQUFhLElBQUlKLFFBQUosQ0FBYSxDQUN4QixrREFEd0IsQ0FBYixDQTVCNkc7O0FBZ0MxSEssbUJBQWUsSUFoQzJHO0FBaUMxSEMsb0JBQWdCLElBakMwRztBQWtDMUhDLGtCQUFjLElBbEM0RztBQW1DMUhDLG9CQUFnQixJQW5DMEc7QUFvQzFIQyxxQkFBaUIsSUFwQ3lHO0FBcUMxSEMsUUFBSSx3QkFyQ3NIO0FBc0MxSEMsYUFBUyxJQXRDaUg7QUF1QzFIQyxXQUFPZixTQUFTZ0IsV0F2QzBHO0FBd0MxSEMsdUJBQW1CLElBeEN1RztBQXlDMUhDLGtCQUFjbEIsU0FBU2tCLFlBekNtRztBQTBDMUhDLFVBQU0sRUExQ29ILEVBMENoSDtBQUNWQyxtQkFBZSxJQTNDMkc7O0FBNkMxSEMsY0FBVSxTQUFTQSxRQUFULEdBQStCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUN2Q0MsUUFBRSxLQUFLQyxpQkFBUCxFQUEwQkMsV0FBMUIsQ0FBc0MsdUJBQXRDO0FBQ0EsV0FBS2pCLGFBQUwsQ0FBbUJjLE1BQW5CO0FBQ0QsS0FoRHlIO0FBaUQxSEksVUFBTSxTQUFTQSxJQUFULEdBQWdCLENBQUUsQ0FqRGtHO0FBa0QxSEMsV0FBTyxTQUFTQSxLQUFULEdBQTZCO0FBQUE7O0FBQUEsVUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUNsQyxhQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQWE7QUFDOUIsY0FBS3RCLGFBQUwsR0FBcUJzQixPQUFyQjtBQUNBUCxVQUFFLE1BQUtDLGlCQUFQLEVBQTBCTyxRQUExQixDQUFtQyx1QkFBbkM7O0FBRUEsWUFBSSxDQUFDLE1BQUtqQixPQUFOLElBQWtCYyxRQUFRZCxPQUFSLEtBQW9Ca0IsU0FBcEIsSUFBaUMsQ0FBQ0osUUFBUWQsT0FBaEUsRUFBMEU7QUFDeEUsZ0JBQUtKLFlBQUwsR0FBb0JhLEVBQUUsTUFBS2hCLFdBQUwsQ0FBaUIwQixLQUFqQixPQUFGLENBQXBCO0FBQ0EsZ0JBQUtoQixpQkFBTCxHQUF5Qk0sRUFBRSxNQUFLakIscUJBQUwsQ0FBMkIyQixLQUEzQixPQUFGLENBQXpCO0FBQ0FWLFlBQUUsTUFBS1csWUFBUCxFQUFxQkMsTUFBckIsQ0FBNEIsTUFBS2xCLGlCQUFqQztBQUNBTSxZQUFFLE1BQUtXLFlBQVAsRUFBcUJDLE1BQXJCLENBQTRCLE1BQUt6QixZQUFqQztBQUNBLGdCQUFLRSxlQUFMLEdBQXVCZ0IsUUFBUVEsT0FBUixJQUFtQixDQUExQztBQUNBLGdCQUFLaEIsYUFBTCxHQUFxQlEsUUFBUVMsS0FBUixJQUFpQlQsUUFBUVUsS0FBekIsSUFBa0MsQ0FBdkQ7QUFDRDtBQUNGLE9BWk0sQ0FBUDtBQWFELEtBaEV5SDtBQWlFMUhDLG9CQUFnQixTQUFTQSxjQUFULEdBQTBCO0FBQ3hDLFdBQUszQixlQUFMLEdBQXVCLEtBQUtBLGVBQUwsR0FBdUIsQ0FBOUM7QUFDQSxVQUFJLEtBQUtGLFlBQVQsRUFBdUI7QUFDckIsYUFBS0EsWUFBTCxDQUFrQjhCLEdBQWxCLENBQXNCO0FBQ3BCQyxpQkFBVSxNQUFNLEtBQUs3QixlQUFYLEdBQTZCLEtBQUtRLGFBQTVDO0FBRG9CLFNBQXRCO0FBR0Q7QUFDRjtBQXhFeUgsR0FBNUcsQ0FBaEI7O29CQTJFZW5CLE8iLCJmaWxlIjoiQnVzeUluZGljYXRvci5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcblxyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuLi9fVGVtcGxhdGVkJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uL0kxOG4nO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnYnVzeUluZGljYXRvcicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5EaWFsb2dzLkJ1c3lJbmRpY2F0b3JcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5EaWFsb2dzLkJ1c3lJbmRpY2F0b3InLCBbX1dpZGdldEJhc2UsIF9UZW1wbGF0ZWRdLCAvKiogQGxlbmRzIGFyZ29zLkRpYWxvZ3MuQnVzeUluZGljYXRvciMgKi97XHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3lJbmRpY2F0b3JfX2NvbnRhaW5lciB7JTogJC5jb250YWluZXJDbGFzcyAlfVwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJidXN5SW5kaWNhdG9yTm9kZVwiPicsXHJcbiAgICAneyUhICQuYnVzeUluZGljYXRvclRlbXBsYXRlICV9JyxcclxuICAgICd7JSEgJC5wcm9ncmVzc0JhclRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGJ1c3lJbmRpY2F0b3JUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS17JTogJC5zaXplICV9XCIgc3R5bGU9XCJoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlO1wiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yLWNvbnRhaW5lclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIHJvbGU9XCJzdGF0dXNcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvciBhY3RpdmVcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgb25lXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHR3b1wiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0aHJlZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmb3VyXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZpdmVcIj48L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPHNwYW4gZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImxhYmVsTm9kZVwiPnslOiAkLmxhYmVsICV9PC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHByb2dyZXNzQmFyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3lJbmRpY2F0b3JfX3Byb2dyZXNzXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInByb2dyZXNzTm9kZVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBwcm9ncmVzc0xhYmVsVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3lJbmRpY2F0b3JfX3Byb2dyZXNzX19sYWJlbFwiIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj57JTogJC5wcm9ncmVzc1RleHQgJX08L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGJhclRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5SW5kaWNhdG9yX19wcm9ncmVzc19fYmFyXCI+PC9kaXY+JyxcclxuICBdKSxcclxuXHJcbiAgX2J1c3lEZWZlcnJlZDogbnVsbCxcclxuICBfYnVzeUluZGljYXRvcjogbnVsbCxcclxuICBfcHJvZ3Jlc3NCYXI6IG51bGwsXHJcbiAgY29udGFpbmVyQ2xhc3M6IG51bGwsXHJcbiAgY3VycmVudFByb2dyZXNzOiBudWxsLFxyXG4gIGlkOiAnYnVzeUluZGljYXRvci10ZW1wbGF0ZScsXHJcbiAgaXNBc3luYzogdHJ1ZSxcclxuICBsYWJlbDogcmVzb3VyY2UubG9hZGluZ1RleHQsXHJcbiAgcHJvZ3Jlc3NMYWJlbE5vZGU6IG51bGwsXHJcbiAgcHJvZ3Jlc3NUZXh0OiByZXNvdXJjZS5wcm9ncmVzc1RleHQsXHJcbiAgc2l6ZTogJycsIC8vIHNtLCB4cywgYmxhbmsgZm9yIG5vcm1hbFxyXG4gIHRvdGFsUHJvZ3Jlc3M6IG51bGwsXHJcblxyXG4gIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZXN1bHQgPSB7fSkge1xyXG4gICAgJCh0aGlzLmJ1c3lJbmRpY2F0b3JOb2RlKS5yZW1vdmVDbGFzcygnYnVzeUluZGljYXRvci0tYWN0aXZlJyk7XHJcbiAgICB0aGlzLl9idXN5RGVmZXJyZWQocmVzdWx0KTtcclxuICB9LFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3coKSB7fSxcclxuICBzdGFydDogZnVuY3Rpb24gc3RhcnQob3B0aW9ucyA9IHt9KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgdGhpcy5fYnVzeURlZmVycmVkID0gcmVzb2x2ZTtcclxuICAgICAgJCh0aGlzLmJ1c3lJbmRpY2F0b3JOb2RlKS5hZGRDbGFzcygnYnVzeUluZGljYXRvci0tYWN0aXZlJyk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuaXNBc3luYyB8fCAob3B0aW9ucy5pc0FzeW5jICE9PSB1bmRlZmluZWQgJiYgIW9wdGlvbnMuaXNBc3luYykpIHtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzc0JhciA9ICQodGhpcy5iYXJUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzc0xhYmVsTm9kZSA9ICQodGhpcy5wcm9ncmVzc0xhYmVsVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgICAgICQodGhpcy5wcm9ncmVzc05vZGUpLmFwcGVuZCh0aGlzLnByb2dyZXNzTGFiZWxOb2RlKTtcclxuICAgICAgICAkKHRoaXMucHJvZ3Jlc3NOb2RlKS5hcHBlbmQodGhpcy5fcHJvZ3Jlc3NCYXIpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFByb2dyZXNzID0gb3B0aW9ucy5jdXJyZW50IHx8IDA7XHJcbiAgICAgICAgdGhpcy50b3RhbFByb2dyZXNzID0gb3B0aW9ucy50b3RhbCB8fCBvcHRpb25zLmNvdW50IHx8IDA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgdXBkYXRlUHJvZ3Jlc3M6IGZ1bmN0aW9uIHVwZGF0ZVByb2dyZXNzKCkge1xyXG4gICAgdGhpcy5jdXJyZW50UHJvZ3Jlc3MgPSB0aGlzLmN1cnJlbnRQcm9ncmVzcyArIDE7XHJcbiAgICBpZiAodGhpcy5fcHJvZ3Jlc3NCYXIpIHtcclxuICAgICAgdGhpcy5fcHJvZ3Jlc3NCYXIuY3NzKHtcclxuICAgICAgICB3aWR0aDogYCR7MTAwICogdGhpcy5jdXJyZW50UHJvZ3Jlc3MgLyB0aGlzLnRvdGFsUHJvZ3Jlc3N9JWAsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19