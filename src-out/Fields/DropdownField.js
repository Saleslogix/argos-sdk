define('argos/Fields/DropdownField', ['module', 'exports', 'dojo/_base/declare', '../Dropdown', '../FieldManager', './_Field'], function (module, exports, _declare, _Dropdown, _FieldManager, _Field2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Dropdown2 = _interopRequireDefault(_Dropdown);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _Field3 = _interopRequireDefault(_Field2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.DropdownField
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

  var __class = (0, _declare2.default)('argos.DropdownField', [_Field3.default, _Dropdown2.default], /** @lends argos.Fields.DropdownField# */{
    widgetTemplate: new Simplate(['<div data-dojo-attach-point="dropdownNode">', '<label>{%: $.label %}</label>', '<input readOnly data-dojo-attach-point="dropdownInput"></input>', '<span class="{%: $.icon %}" style="position: absolute;color: #383838;font-size: 14px;height: 14px;width: 14px;margin-top: 15px;margin-left: -15px;tex-align: center;"></span>', '<select class="dropdown__select--hidden" data-dojo-attach-point="dropdownSelect"></select>', '</div>', '</div>']), // TODO: Remove the inline styling applied here... only organized way to override the nested styling occurring.
    onClick: function onClick(evt) {
      this.scrollToDropdown();
      this.show();
      evt.preventDefault();
      evt.stopPropagation();
    },
    renderTo: function renderTo() {
      this.createList({ items: this.items, defaultValue: this.defaultValue });
      this.inherited(renderTo, arguments);
      // TODO: Place in the getData function call and createList call here so the dropdown will be created with the relevant data
    },
    /**
     * Extends the parent implementation to connect the `onclick` event of the fields container
     * to {@link #_onClick _onClick}.
     */
    init: function init() {
      this.inherited(init, arguments);

      this.connect(this.containerNode, 'onclick', this.onClick);
    }
  });

  exports.default = _FieldManager2.default.register('dropdown', __class);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRHJvcGRvd25GaWVsZC5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsIm9uQ2xpY2siLCJldnQiLCJzY3JvbGxUb0Ryb3Bkb3duIiwic2hvdyIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwicmVuZGVyVG8iLCJjcmVhdGVMaXN0IiwiaXRlbXMiLCJkZWZhdWx0VmFsdWUiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJpbml0IiwiY29ubmVjdCIsImNvbnRhaW5lck5vZGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7O0FBcEJBOzs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsTUFBTUEsVUFBVSx1QkFBUSxxQkFBUixFQUErQixxQ0FBL0IsRUFBbUQseUNBQXlDO0FBQzFHQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLDZDQUQyQixFQUUzQiwrQkFGMkIsRUFHM0IsaUVBSDJCLEVBSTNCLCtLQUoyQixFQUszQiw0RkFMMkIsRUFNM0IsUUFOMkIsRUFPM0IsUUFQMkIsQ0FBYixDQUQwRixFQVN0RztBQUNKQyxhQUFTLFNBQVNBLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQzdCLFdBQUtDLGdCQUFMO0FBQ0EsV0FBS0MsSUFBTDtBQUNBRixVQUFJRyxjQUFKO0FBQ0FILFVBQUlJLGVBQUo7QUFDRCxLQWZ5RztBQWdCMUdDLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QixXQUFLQyxVQUFMLENBQWdCLEVBQUVDLE9BQU8sS0FBS0EsS0FBZCxFQUFxQkMsY0FBYyxLQUFLQSxZQUF4QyxFQUFoQjtBQUNBLFdBQUtDLFNBQUwsQ0FBZUosUUFBZixFQUF5QkssU0FBekI7QUFDQTtBQUNELEtBcEJ5RztBQXFCMUc7Ozs7QUFJQUMsVUFBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLFdBQUtGLFNBQUwsQ0FBZUUsSUFBZixFQUFxQkQsU0FBckI7O0FBRUEsV0FBS0UsT0FBTCxDQUFhLEtBQUtDLGFBQWxCLEVBQWlDLFNBQWpDLEVBQTRDLEtBQUtkLE9BQWpEO0FBQ0Q7QUE3QnlHLEdBQTVGLENBQWhCOztvQkFnQ2UsdUJBQWFlLFFBQWIsQ0FBc0IsVUFBdEIsRUFBa0NsQixPQUFsQyxDIiwiZmlsZSI6IkRyb3Bkb3duRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuLi9Ecm9wZG93bic7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuaW1wb3J0IF9GaWVsZCBmcm9tICcuL19GaWVsZCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5Ecm9wZG93bkZpZWxkXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuRHJvcGRvd25GaWVsZCcsIFtfRmllbGQsIERyb3Bkb3duXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuRHJvcGRvd25GaWVsZCMgKi97XHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZHJvcGRvd25Ob2RlXCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPGlucHV0IHJlYWRPbmx5IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJkcm9wZG93bklucHV0XCI+PC9pbnB1dD4nLFxyXG4gICAgJzxzcGFuIGNsYXNzPVwieyU6ICQuaWNvbiAlfVwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO2NvbG9yOiAjMzgzODM4O2ZvbnQtc2l6ZTogMTRweDtoZWlnaHQ6IDE0cHg7d2lkdGg6IDE0cHg7bWFyZ2luLXRvcDogMTVweDttYXJnaW4tbGVmdDogLTE1cHg7dGV4LWFsaWduOiBjZW50ZXI7XCI+PC9zcGFuPicsXHJcbiAgICAnPHNlbGVjdCBjbGFzcz1cImRyb3Bkb3duX19zZWxlY3QtLWhpZGRlblwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJkcm9wZG93blNlbGVjdFwiPjwvc2VsZWN0PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLCAvLyBUT0RPOiBSZW1vdmUgdGhlIGlubGluZSBzdHlsaW5nIGFwcGxpZWQgaGVyZS4uLiBvbmx5IG9yZ2FuaXplZCB3YXkgdG8gb3ZlcnJpZGUgdGhlIG5lc3RlZCBzdHlsaW5nIG9jY3VycmluZy5cclxuICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2dCkge1xyXG4gICAgdGhpcy5zY3JvbGxUb0Ryb3Bkb3duKCk7XHJcbiAgICB0aGlzLnNob3coKTtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH0sXHJcbiAgcmVuZGVyVG86IGZ1bmN0aW9uIHJlbmRlclRvKCkge1xyXG4gICAgdGhpcy5jcmVhdGVMaXN0KHsgaXRlbXM6IHRoaXMuaXRlbXMsIGRlZmF1bHRWYWx1ZTogdGhpcy5kZWZhdWx0VmFsdWUgfSk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChyZW5kZXJUbywgYXJndW1lbnRzKTtcclxuICAgIC8vIFRPRE86IFBsYWNlIGluIHRoZSBnZXREYXRhIGZ1bmN0aW9uIGNhbGwgYW5kIGNyZWF0ZUxpc3QgY2FsbCBoZXJlIHNvIHRoZSBkcm9wZG93biB3aWxsIGJlIGNyZWF0ZWQgd2l0aCB0aGUgcmVsZXZhbnQgZGF0YVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIGNvbm5lY3QgdGhlIGBvbmNsaWNrYCBldmVudCBvZiB0aGUgZmllbGRzIGNvbnRhaW5lclxyXG4gICAqIHRvIHtAbGluayAjX29uQ2xpY2sgX29uQ2xpY2t9LlxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChpbml0LCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY29ubmVjdCh0aGlzLmNvbnRhaW5lck5vZGUsICdvbmNsaWNrJywgdGhpcy5vbkNsaWNrKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkTWFuYWdlci5yZWdpc3RlcignZHJvcGRvd24nLCBfX2NsYXNzKTtcclxuIl19