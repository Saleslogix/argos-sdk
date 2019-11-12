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
      this.inherited(arguments);
      // TODO: Place in the getData function call and createList call here so the dropdown will be created with the relevant data
    },
    /**
     * Extends the parent implementation to connect the `onclick` event of the fields container
     * to {@link #_onClick _onClick}.
     */
    init: function init() {
      this.inherited(arguments);

      this.connect(this.containerNode, 'onclick', this.onClick);
    }
  });

  exports.default = _FieldManager2.default.register('dropdown', __class);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRHJvcGRvd25GaWVsZC5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsIm9uQ2xpY2siLCJldnQiLCJzY3JvbGxUb0Ryb3Bkb3duIiwic2hvdyIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwicmVuZGVyVG8iLCJjcmVhdGVMaXN0IiwiaXRlbXMiLCJkZWZhdWx0VmFsdWUiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJpbml0IiwiY29ubmVjdCIsImNvbnRhaW5lck5vZGUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7O0FBcEJBOzs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsTUFBTUEsVUFBVSx1QkFBUSxxQkFBUixFQUErQixxQ0FBL0IsRUFBbUQseUNBQXlDO0FBQzFHQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLDZDQUQyQixFQUUzQiwrQkFGMkIsRUFHM0IsaUVBSDJCLEVBSTNCLCtLQUoyQixFQUszQiw0RkFMMkIsRUFNM0IsUUFOMkIsRUFPM0IsUUFQMkIsQ0FBYixDQUQwRixFQVN0RztBQUNKQyxhQUFTLFNBQVNBLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQzdCLFdBQUtDLGdCQUFMO0FBQ0EsV0FBS0MsSUFBTDtBQUNBRixVQUFJRyxjQUFKO0FBQ0FILFVBQUlJLGVBQUo7QUFDRCxLQWZ5RztBQWdCMUdDLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QixXQUFLQyxVQUFMLENBQWdCLEVBQUVDLE9BQU8sS0FBS0EsS0FBZCxFQUFxQkMsY0FBYyxLQUFLQSxZQUF4QyxFQUFoQjtBQUNBLFdBQUtDLFNBQUwsQ0FBZUMsU0FBZjtBQUNBO0FBQ0QsS0FwQnlHO0FBcUIxRzs7OztBQUlBQyxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEIsV0FBS0YsU0FBTCxDQUFlQyxTQUFmOztBQUVBLFdBQUtFLE9BQUwsQ0FBYSxLQUFLQyxhQUFsQixFQUFpQyxTQUFqQyxFQUE0QyxLQUFLZCxPQUFqRDtBQUNEO0FBN0J5RyxHQUE1RixDQUFoQjs7b0JBZ0NlLHVCQUFhZSxRQUFiLENBQXNCLFVBQXRCLEVBQWtDbEIsT0FBbEMsQyIsImZpbGUiOiJEcm9wZG93bkZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi4vRHJvcGRvd24nO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcbmltcG9ydCBfRmllbGQgZnJvbSAnLi9fRmllbGQnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5GaWVsZHMuRHJvcGRvd25GaWVsZFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkRyb3Bkb3duRmllbGQnLCBbX0ZpZWxkLCBEcm9wZG93bl0sIC8qKiBAbGVuZHMgYXJnb3MuRmllbGRzLkRyb3Bkb3duRmllbGQjICove1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImRyb3Bkb3duTm9kZVwiPicsXHJcbiAgICAnPGxhYmVsPnslOiAkLmxhYmVsICV9PC9sYWJlbD4nLFxyXG4gICAgJzxpbnB1dCByZWFkT25seSBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZHJvcGRvd25JbnB1dFwiPjwvaW5wdXQ+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cInslOiAkLmljb24gJX1cIiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTtjb2xvcjogIzM4MzgzODtmb250LXNpemU6IDE0cHg7aGVpZ2h0OiAxNHB4O3dpZHRoOiAxNHB4O21hcmdpbi10b3A6IDE1cHg7bWFyZ2luLWxlZnQ6IC0xNXB4O3RleC1hbGlnbjogY2VudGVyO1wiPjwvc3Bhbj4nLFxyXG4gICAgJzxzZWxlY3QgY2xhc3M9XCJkcm9wZG93bl9fc2VsZWN0LS1oaWRkZW5cIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZHJvcGRvd25TZWxlY3RcIj48L3NlbGVjdD4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSwgLy8gVE9ETzogUmVtb3ZlIHRoZSBpbmxpbmUgc3R5bGluZyBhcHBsaWVkIGhlcmUuLi4gb25seSBvcmdhbml6ZWQgd2F5IHRvIG92ZXJyaWRlIHRoZSBuZXN0ZWQgc3R5bGluZyBvY2N1cnJpbmcuXHJcbiAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldnQpIHtcclxuICAgIHRoaXMuc2Nyb2xsVG9Ecm9wZG93bigpO1xyXG4gICAgdGhpcy5zaG93KCk7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIHJlbmRlclRvOiBmdW5jdGlvbiByZW5kZXJUbygpIHtcclxuICAgIHRoaXMuY3JlYXRlTGlzdCh7IGl0ZW1zOiB0aGlzLml0ZW1zLCBkZWZhdWx0VmFsdWU6IHRoaXMuZGVmYXVsdFZhbHVlIH0pO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIC8vIFRPRE86IFBsYWNlIGluIHRoZSBnZXREYXRhIGZ1bmN0aW9uIGNhbGwgYW5kIGNyZWF0ZUxpc3QgY2FsbCBoZXJlIHNvIHRoZSBkcm9wZG93biB3aWxsIGJlIGNyZWF0ZWQgd2l0aCB0aGUgcmVsZXZhbnQgZGF0YVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIGNvbm5lY3QgdGhlIGBvbmNsaWNrYCBldmVudCBvZiB0aGUgZmllbGRzIGNvbnRhaW5lclxyXG4gICAqIHRvIHtAbGluayAjX29uQ2xpY2sgX29uQ2xpY2t9LlxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY29ubmVjdCh0aGlzLmNvbnRhaW5lck5vZGUsICdvbmNsaWNrJywgdGhpcy5vbkNsaWNrKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkTWFuYWdlci5yZWdpc3RlcignZHJvcGRvd24nLCBfX2NsYXNzKTtcclxuIl19