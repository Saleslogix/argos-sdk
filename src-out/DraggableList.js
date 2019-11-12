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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EcmFnZ2FibGVMaXN0LmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJpc0NhcmRWaWV3IiwibGlSb3dUZW1wbGF0ZSIsIlNpbXBsYXRlIiwic2hvdyIsInNldHVwRHJhZ2dhYmxlIiwiY29udGVudE5vZGUiLCJzY3JvbGxlck5vZGUiLCJzZXRDbGFzcyIsInNldFBhcmVudENsYXNzVG9EcmFnIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7QUFRQSxNQUFNQSxVQUFVLHVCQUFRLHFCQUFSLEVBQStCLDZDQUEvQixFQUE0RDtBQUMxRUMsZ0JBQVksS0FEOEQ7QUFFMUVDLG1CQUFlLElBQUlDLFFBQUosQ0FBYSxDQUMxQiw0SkFEMEIsRUFFMUIsaUdBRjBCLHdKQU0xQixXQU4wQixFQU8xQiw2REFQMEIsRUFRMUIsT0FSMEIsQ0FBYixDQUYyRDtBQVkxRUMsVUFBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLFdBQUtDLGNBQUwsQ0FBb0IsS0FBS0MsV0FBekIsRUFBc0MsS0FBS0MsWUFBM0MsRUFDR0MsUUFESCxDQUNZLFdBRFosRUFFR0Msb0JBRkgsQ0FFd0IscUJBRnhCO0FBR0EsV0FBS0MsU0FBTCxDQUFlQyxTQUFmO0FBQ0Q7QUFqQnlFLEdBQTVELENBQWhCLEMsQ0EzQkE7Ozs7Ozs7Ozs7Ozs7OztvQkErQ2VYLE8iLCJmaWxlIjoiRHJhZ2dhYmxlTGlzdC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfTGlzdEJhc2UgZnJvbSAnLi9fTGlzdEJhc2UnO1xyXG5pbXBvcnQgX0RyYWdnYWJsZUJhc2UgZnJvbSAnLi9fRHJhZ2dhYmxlQmFzZSc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkRyYWdnYWJsZUxpc3RcclxuICogQGNsYXNzZGVzYyBMaXN0IGV4dGVuZHMgTGlzdCBhbmQgX0RyYWdnYWJsZUJhc2UgdG8gbWFrZSB0aGUgbGlzdCBkcmFnZ2FibGVcclxuICogQGV4dGVuZHMgYXJnb3MuTGlzdFxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fRHJhZ2dhYmxlQmFzZVxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuTGlzdFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuX0RyYWdnYWJsZUJhc2VcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5EcmFnZ2FibGVMaXN0JywgW19MaXN0QmFzZSwgX0RyYWdnYWJsZUJhc2VdLCB7XHJcbiAgaXNDYXJkVmlldzogZmFsc2UsXHJcbiAgbGlSb3dUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGkgcm9sZT1cIm9wdGlvblwiIGRhdGEtYWN0aW9uPVwiYWN0aXZhdGVFbnRyeVwiIGRhdGEta2V5PVwieyU9ICRbJCQuaWRQcm9wZXJ0eV0gJX1cIiBkYXRhLWRlc2NyaXB0b3I9XCJ7JTogJFskJC5sYWJlbFByb3BlcnR5XSAlfVwiIGNsYXNzPVwibGlzdC1pdGVtLWRyYWdnYWJsZVwiPicsXHJcbiAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4taWNvbiBoaWRlLWZvY3VzIGxpc3QtaXRlbS1zZWxlY3RvclwiIGRhdGEtYWN0aW9uPVwic2VsZWN0RW50cnlcIj4nLFxyXG4gICAgYDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24teyU9ICQkLnNlbGVjdEljb24gJX1cIiAvPlxyXG4gICAgICA8L3N2Zz5gLFxyXG4gICAgJzwvYnV0dG9uPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImxpc3QtaXRlbS1jb250ZW50XCI+eyUhICQkLml0ZW1UZW1wbGF0ZSAlfTwvZGl2PicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICB0aGlzLnNldHVwRHJhZ2dhYmxlKHRoaXMuY29udGVudE5vZGUsIHRoaXMuc2Nyb2xsZXJOb2RlKVxyXG4gICAgICAuc2V0Q2xhc3MoJ2RyYWdnYWJsZScpXHJcbiAgICAgIC5zZXRQYXJlbnRDbGFzc1RvRHJhZygnbGlzdC1pdGVtLWRyYWdnYWJsZScpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==