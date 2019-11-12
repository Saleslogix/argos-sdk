define('argos/Views/Link', ['module', 'exports', 'dojo/_base/declare', '../View'], function (module, exports, _declare, _View) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _View2 = _interopRequireDefault(_View);

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

  var __class = (0, _declare2.default)('argos.Views.Link', [_View2.default], {
    id: 'link_view',
    titleText: '',
    viewType: 'detail',
    link: '',
    cls: 'link-view',
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" data-title="{%= $.titleText %}" class="detail panel {%= $.cls %}">', '<iframe class="link-node" data-dojo-attach-point="linkNode"', 'sandbox="allow-scripts allow-forms allow-same-origin">', '</iframe>', '</div>']),
    _getLink: function _getLink() {
      var link = this.options.link;

      return link || this.link;
    },
    onTransitionTo: function onTransitionTo() {
      this.linkNode.contentWindow.location.replace(this._getLink());
    },
    onTransitionAway: function onTransitionAway() {
      this.linkNode.contentWindow.location.replace('about:blank');
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9MaW5rLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJpZCIsInRpdGxlVGV4dCIsInZpZXdUeXBlIiwibGluayIsImNscyIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJfZ2V0TGluayIsIm9wdGlvbnMiLCJvblRyYW5zaXRpb25UbyIsImxpbmtOb2RlIiwiY29udGVudFdpbmRvdyIsImxvY2F0aW9uIiwicmVwbGFjZSIsIm9uVHJhbnNpdGlvbkF3YXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsTUFBTUEsVUFBVSx1QkFBUSxrQkFBUixFQUE0QixnQkFBNUIsRUFBb0M7QUFDbERDLFFBQUksV0FEOEM7QUFFbERDLGVBQVcsRUFGdUM7QUFHbERDLGNBQVUsUUFId0M7QUFJbERDLFVBQU0sRUFKNEM7QUFLbERDLFNBQUssV0FMNkM7QUFNbERDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IsMEZBRDJCLEVBRTNCLDZEQUYyQixFQUczQix3REFIMkIsRUFJM0IsV0FKMkIsRUFLM0IsUUFMMkIsQ0FBYixDQU5rQztBQWFsREMsY0FBVSxTQUFTQSxRQUFULEdBQW9CO0FBQUEsVUFDcEJKLElBRG9CLEdBQ1gsS0FBS0ssT0FETSxDQUNwQkwsSUFEb0I7O0FBRTVCLGFBQU9BLFFBQVEsS0FBS0EsSUFBcEI7QUFDRCxLQWhCaUQ7QUFpQmxETSxvQkFBZ0IsU0FBU0EsY0FBVCxHQUEwQjtBQUN4QyxXQUFLQyxRQUFMLENBQWNDLGFBQWQsQ0FBNEJDLFFBQTVCLENBQXFDQyxPQUFyQyxDQUE2QyxLQUFLTixRQUFMLEVBQTdDO0FBQ0QsS0FuQmlEO0FBb0JsRE8sc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFdBQUtKLFFBQUwsQ0FBY0MsYUFBZCxDQUE0QkMsUUFBNUIsQ0FBcUNDLE9BQXJDLENBQTZDLGFBQTdDO0FBQ0Q7QUF0QmlELEdBQXBDLENBQWhCOztvQkF5QmVkLE8iLCJmaWxlIjoiTGluay5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4uL1ZpZXcnO1xyXG5cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlZpZXdzLkxpbmsnLCBbVmlld10sIHtcclxuICBpZDogJ2xpbmtfdmlldycsXHJcbiAgdGl0bGVUZXh0OiAnJyxcclxuICB2aWV3VHlwZTogJ2RldGFpbCcsXHJcbiAgbGluazogJycsXHJcbiAgY2xzOiAnbGluay12aWV3JyxcclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBkYXRhLXRpdGxlPVwieyU9ICQudGl0bGVUZXh0ICV9XCIgY2xhc3M9XCJkZXRhaWwgcGFuZWwgeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8aWZyYW1lIGNsYXNzPVwibGluay1ub2RlXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImxpbmtOb2RlXCInLFxyXG4gICAgJ3NhbmRib3g9XCJhbGxvdy1zY3JpcHRzIGFsbG93LWZvcm1zIGFsbG93LXNhbWUtb3JpZ2luXCI+JyxcclxuICAgICc8L2lmcmFtZT4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgX2dldExpbms6IGZ1bmN0aW9uIF9nZXRMaW5rKCkge1xyXG4gICAgY29uc3QgeyBsaW5rIH0gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICByZXR1cm4gbGluayB8fCB0aGlzLmxpbms7XHJcbiAgfSxcclxuICBvblRyYW5zaXRpb25UbzogZnVuY3Rpb24gb25UcmFuc2l0aW9uVG8oKSB7XHJcbiAgICB0aGlzLmxpbmtOb2RlLmNvbnRlbnRXaW5kb3cubG9jYXRpb24ucmVwbGFjZSh0aGlzLl9nZXRMaW5rKCkpO1xyXG4gIH0sXHJcbiAgb25UcmFuc2l0aW9uQXdheTogZnVuY3Rpb24gb25UcmFuc2l0aW9uQXdheSgpIHtcclxuICAgIHRoaXMubGlua05vZGUuY29udGVudFdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCdhYm91dDpibGFuaycpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19