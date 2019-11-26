define('argos/DraggableList', ['module', 'exports', 'dojo/_base/declare', './_ListBase', './_DraggableBase'], function (module, exports, _declare, _ListBase2, _DraggableBase2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _ListBase3 = _interopRequireDefault(_ListBase2);

  var _DraggableBase3 = _interopRequireDefault(_DraggableBase2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.DraggableList
   * @classdesc List extends List and _DraggableBase to make the list draggable
   * @extends argos.List
   * @extends argos._DraggableBase
   * @requires argos.List
   * @requires argos._DraggableBase
   */
  var __class = (0, _declare2.default)('argos.DraggableList', [_ListBase3.default, _DraggableBase3.default], {
    isCardView: false,
    liRowTemplate: new Simplate(['<li role="option" data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $[$$.labelProperty] %}" class="list-item-draggable">', '<button type="button" class="btn-icon hide-focus list-item-selector" data-action="selectEntry">', '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xlink:href="#icon-{%= $$.selectIcon %}" />\n      </svg>', '</button>', '<div class="list-item-content">{%! $$.itemTemplate %}</div>', '</li>']),
    show: function show() {
      this.setupDraggable(this.contentNode, this.scrollerNode).setClass('draggable').setParentClassToDrag('list-item-draggable');
      this.inherited(show, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EcmFnZ2FibGVMaXN0LmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJpc0NhcmRWaWV3IiwibGlSb3dUZW1wbGF0ZSIsIlNpbXBsYXRlIiwic2hvdyIsInNldHVwRHJhZ2dhYmxlIiwiY29udGVudE5vZGUiLCJzY3JvbGxlck5vZGUiLCJzZXRDbGFzcyIsInNldFBhcmVudENsYXNzVG9EcmFnIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7QUFRQSxNQUFNQSxVQUFVLHVCQUFRLHFCQUFSLEVBQStCLDZDQUEvQixFQUE0RDtBQUMxRUMsZ0JBQVksS0FEOEQ7QUFFMUVDLG1CQUFlLElBQUlDLFFBQUosQ0FBYSxDQUMxQiw0SkFEMEIsRUFFMUIsaUdBRjBCLHdKQU0xQixXQU4wQixFQU8xQiw2REFQMEIsRUFRMUIsT0FSMEIsQ0FBYixDQUYyRDtBQVkxRUMsVUFBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLFdBQUtDLGNBQUwsQ0FBb0IsS0FBS0MsV0FBekIsRUFBc0MsS0FBS0MsWUFBM0MsRUFDR0MsUUFESCxDQUNZLFdBRFosRUFFR0Msb0JBRkgsQ0FFd0IscUJBRnhCO0FBR0EsV0FBS0MsU0FBTCxDQUFlTixJQUFmLEVBQXFCTyxTQUFyQjtBQUNEO0FBakJ5RSxHQUE1RCxDQUFoQixDLENBM0JBOzs7Ozs7Ozs7Ozs7Ozs7b0JBK0NlWCxPIiwiZmlsZSI6IkRyYWdnYWJsZUxpc3QuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX0xpc3RCYXNlIGZyb20gJy4vX0xpc3RCYXNlJztcclxuaW1wb3J0IF9EcmFnZ2FibGVCYXNlIGZyb20gJy4vX0RyYWdnYWJsZUJhc2UnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5EcmFnZ2FibGVMaXN0XHJcbiAqIEBjbGFzc2Rlc2MgTGlzdCBleHRlbmRzIExpc3QgYW5kIF9EcmFnZ2FibGVCYXNlIHRvIG1ha2UgdGhlIGxpc3QgZHJhZ2dhYmxlXHJcbiAqIEBleHRlbmRzIGFyZ29zLkxpc3RcclxuICogQGV4dGVuZHMgYXJnb3MuX0RyYWdnYWJsZUJhc2VcclxuICogQHJlcXVpcmVzIGFyZ29zLkxpc3RcclxuICogQHJlcXVpcmVzIGFyZ29zLl9EcmFnZ2FibGVCYXNlXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuRHJhZ2dhYmxlTGlzdCcsIFtfTGlzdEJhc2UsIF9EcmFnZ2FibGVCYXNlXSwge1xyXG4gIGlzQ2FyZFZpZXc6IGZhbHNlLFxyXG4gIGxpUm93VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIHJvbGU9XCJvcHRpb25cIiBkYXRhLWFjdGlvbj1cImFjdGl2YXRlRW50cnlcIiBkYXRhLWtleT1cInslPSAkWyQkLmlkUHJvcGVydHldICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICRbJCQubGFiZWxQcm9wZXJ0eV0gJX1cIiBjbGFzcz1cImxpc3QtaXRlbS1kcmFnZ2FibGVcIj4nLFxyXG4gICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaGlkZS1mb2N1cyBsaXN0LWl0ZW0tc2VsZWN0b3JcIiBkYXRhLWFjdGlvbj1cInNlbGVjdEVudHJ5XCI+JyxcclxuICAgIGA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXslPSAkJC5zZWxlY3RJY29uICV9XCIgLz5cclxuICAgICAgPC9zdmc+YCxcclxuICAgICc8L2J1dHRvbj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0tY29udGVudFwiPnslISAkJC5pdGVtVGVtcGxhdGUgJX08L2Rpdj4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KCkge1xyXG4gICAgdGhpcy5zZXR1cERyYWdnYWJsZSh0aGlzLmNvbnRlbnROb2RlLCB0aGlzLnNjcm9sbGVyTm9kZSlcclxuICAgICAgLnNldENsYXNzKCdkcmFnZ2FibGUnKVxyXG4gICAgICAuc2V0UGFyZW50Q2xhc3NUb0RyYWcoJ2xpc3QtaXRlbS1kcmFnZ2FibGUnKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHNob3csIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=