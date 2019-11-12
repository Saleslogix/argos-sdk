define('argos/TimePicker', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', './_Templated', './Dropdown', './I18n'], function (module, exports, _declare, _WidgetBase2, _Templated2, _Dropdown, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _Dropdown2 = _interopRequireDefault(_Dropdown);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('timePicker');

  /**
   * @class argos.TimePicker
   */
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

  var __class = (0, _declare2.default)('argos.TimePicker', [_WidgetBase3.default, _Templated3.default], {
    widgetTemplate: new Simplate(['<div class="time-select panel">', '<div class="time-parts">', '{%! $.hourSelectTemplate %}', ' : ', '{%! $.minuteSelectTemplate %}', '{%! $.meridiemSelectTemplate %}', '</div>', '{% if ($.showSetTime) { %}', '<div class="button tertiary">{%= $.setTimeText %}</div>', '{% } %}', '</div>']),
    hourSelectTemplate: new Simplate(['<div data-dojo-attach-point="hourNode">', '</div>']),
    minuteSelectTemplate: new Simplate(['<div data-dojo-attach-point="minuteNode">', '</div>']),
    meridiemSelectTemplate: new Simplate(['<div class="switch" data-dojo-attach-point="meridiemNode">\n        <input\n          type="checkbox"\n          name="AMPMToggleNode"\n          id="AMPMToggleNode"\n          class="switch" />\n        <label class="toggleAMPM" for="AMPMToggleNode">{%= $.amText %}</label>\n      </div>']),
    listStartTemplate: new Simplate(['<ul class="list">']),
    listEndTemplate: new Simplate(['</ul>']),
    listItemTemplate: new Simplate(['<li class="list-item" data-action="{$.action}">', '{%= $.value }', '</li>']),

    amText: resource.amText,
    pmText: resource.pmText,
    setTimeText: resource.setTimeText,

    timeValue: null,
    _showAM: null,
    _hourDropdown: null,
    _hourValue: null,
    _minuteDropdown: null,
    _minuteValue: null,
    _selectedHour: null,
    _selectedMinute: null,
    _widgetName: 'timePicker',
    timeless: false,
    showSetTime: true,
    hourValues: null,
    minuteValues: null,
    createHourLayout: function createHourLayout() {
      if (!this.hourValues) {
        var totalHours = App.is24HourClock() ? 24 : 12;
        this.hourValues = [];
        this.hourValues = totalHours === 24 ? this.create24HourList(totalHours) : this.createHourList(totalHours);
      }
      return this.hourValues;
    },
    createHourList: function createHourList(totalHours) {
      var hourValues = [];
      for (var i = 0; i < totalHours; i++) {
        var dispVal = (i + 1).toString();
        hourValues.push({ value: dispVal, key: dispVal });
      }
      return hourValues;
    },
    create24HourList: function create24HourList(totalHours) {
      var hourValues = [];
      for (var i = 0; i < totalHours; i++) {
        var dispVal = ('' + i).padStart(2, '0');
        hourValues.push({ value: dispVal, key: dispVal });
      }
      return hourValues;
    },
    createMinuteLayout: function createMinuteLayout() {
      if (!this.minuteValues) {
        this.minuteValues = [];
        for (var i = 0; i < 60; i += 5) {
          var dispVal = ('' + i).padStart(2, '0');
          this.minuteValues.push({ value: dispVal, key: i.toString() });
        }
      }
      return this.minuteValues;
    },
    createHourDropdown: function createHourDropdown(initial) {
      if (!this._hourDropdown) {
        this.createHourLayout();
        this._hourDropdown = new _Dropdown2.default({ id: 'hour-dropdown', itemMustExist: true, dropdownClass: 'dropdown-mx' });
        this._hourDropdown.createList({ items: this.hourValues, defaultValue: '' + initial });
        $(this.hourNode).replaceWith(this._hourDropdown.domNode);
      }
      return this;
    },
    createMinuteDropdown: function createMinuteDropdown(initial) {
      var tempValue = Math.ceil(initial / 1) * 1;
      var value = initial;
      if (tempValue >= 60) {
        value = '59';
      }
      if (tempValue === 0) {
        value = '00';
      }

      if (!this._minuteDropdown) {
        this.createMinuteLayout();
        this._minuteDropdown = new _Dropdown2.default({ id: 'minute-modal', itemMustExist: true, dropdownClass: 'dropdown-mx' });
        this._minuteDropdown.createList({ items: this.minuteValues, defaultValue: '' + value });
        $(this.minuteNode).replaceWith(this._minuteDropdown.domNode);
      }
      return this;
    },
    destroy: function destroy() {
      this._hourDropdown.destroy();
      this._minuteDropdown.destroy();
      this.inherited(arguments);
    },
    getContent: function getContent() {
      this.setTimeValue();
      this.removeListeners();
      return this.timeValue;
    },
    removeListeners: function removeListeners() {
      $(this.meridiemNode.children[0]).off('click');
    },
    setMeridiem: function setMeridiem(value, target) {
      $(this.meridiemNode).toggleClass('toggleStateOn', value);
      if (target) {
        $(target).next().html(value ? this.pmText : this.amText);
        $(target).prop('checked', value);
      }
      return this;
    },
    setTimeValue: function setTimeValue() {
      if (!this._isTimeless()) {
        if (App.is24HourClock()) {
          var hourVal = parseInt(this._hourDropdown.getValue(), 10);
          var isPm = false;
          if (hourVal >= 12) {
            isPm = true;
          }
          this.timeValue.hours = hourVal;
          this.timeValue.minutes = parseInt(this._minuteDropdown.getValue(), 10);
          this.timeValue.isPM = isPm;
        } else {
          this.timeValue.hours = parseInt(this._hourDropdown.getValue(), 10);
          this.timeValue.minutes = parseInt(this._minuteDropdown.getValue(), 10);
          this.timeValue.isPM = $(this.meridiemNode).hasClass('toggleStateOn');
          this.timeValue.hours = this.timeValue.isPM ? this.timeValue.hours % 12 + 12 : this.timeValue.hours % 12;
        }
      }
      return this;
    },
    show: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.timeValue = {
        isPM: false
      };
      var date = moment(options.date) || moment();
      var hour = date.hours();
      var meridiemToggled = false;
      if (hour >= 12) {
        if (hour !== 12 && !App.is24HourClock()) {
          hour = hour % 12;
        }
        meridiemToggled = true;
      }
      if (hour === 0 && !App.is24HourClock()) {
        hour = 12;
      }
      var minutes = date.minutes() || 0;
      if (minutes < 10) {
        minutes = '' + minutes;
        minutes = Array(2).join('0') + minutes;
      }
      this.timeValue.seconds = date.seconds();
      (App.is24HourClock() ? this.createHourDropdown(('' + hour).padStart(2, '0')) : this.createHourDropdown('' + hour)).createMinuteDropdown('' + minutes);
      if (!App.is24HourClock()) {
        this.setMeridiem(meridiemToggled, this.meridiemNode.children[0]);
        $(this.meridiemNode.children[0]).on('click', this.toggleMeridiem.bind(this));
      } else {
        $(this.meridiemNode).hide();
      }
    },
    toggleMeridiem: function toggleMeridiem(_ref) {
      var target = _ref.target;

      this._showAM = !this._showAM;
      this.setMeridiem(this._showAM, target);
    },
    _isTimeless: function _isTimeless() {
      return this.options && this.options.timeless || this.timeless;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lUGlja2VyLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJob3VyU2VsZWN0VGVtcGxhdGUiLCJtaW51dGVTZWxlY3RUZW1wbGF0ZSIsIm1lcmlkaWVtU2VsZWN0VGVtcGxhdGUiLCJsaXN0U3RhcnRUZW1wbGF0ZSIsImxpc3RFbmRUZW1wbGF0ZSIsImxpc3RJdGVtVGVtcGxhdGUiLCJhbVRleHQiLCJwbVRleHQiLCJzZXRUaW1lVGV4dCIsInRpbWVWYWx1ZSIsIl9zaG93QU0iLCJfaG91ckRyb3Bkb3duIiwiX2hvdXJWYWx1ZSIsIl9taW51dGVEcm9wZG93biIsIl9taW51dGVWYWx1ZSIsIl9zZWxlY3RlZEhvdXIiLCJfc2VsZWN0ZWRNaW51dGUiLCJfd2lkZ2V0TmFtZSIsInRpbWVsZXNzIiwic2hvd1NldFRpbWUiLCJob3VyVmFsdWVzIiwibWludXRlVmFsdWVzIiwiY3JlYXRlSG91ckxheW91dCIsInRvdGFsSG91cnMiLCJBcHAiLCJpczI0SG91ckNsb2NrIiwiY3JlYXRlMjRIb3VyTGlzdCIsImNyZWF0ZUhvdXJMaXN0IiwiaSIsImRpc3BWYWwiLCJ0b1N0cmluZyIsInB1c2giLCJ2YWx1ZSIsImtleSIsInBhZFN0YXJ0IiwiY3JlYXRlTWludXRlTGF5b3V0IiwiY3JlYXRlSG91ckRyb3Bkb3duIiwiaW5pdGlhbCIsImlkIiwiaXRlbU11c3RFeGlzdCIsImRyb3Bkb3duQ2xhc3MiLCJjcmVhdGVMaXN0IiwiaXRlbXMiLCJkZWZhdWx0VmFsdWUiLCIkIiwiaG91ck5vZGUiLCJyZXBsYWNlV2l0aCIsImRvbU5vZGUiLCJjcmVhdGVNaW51dGVEcm9wZG93biIsInRlbXBWYWx1ZSIsIk1hdGgiLCJjZWlsIiwibWludXRlTm9kZSIsImRlc3Ryb3kiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRDb250ZW50Iiwic2V0VGltZVZhbHVlIiwicmVtb3ZlTGlzdGVuZXJzIiwibWVyaWRpZW1Ob2RlIiwiY2hpbGRyZW4iLCJvZmYiLCJzZXRNZXJpZGllbSIsInRhcmdldCIsInRvZ2dsZUNsYXNzIiwibmV4dCIsImh0bWwiLCJwcm9wIiwiX2lzVGltZWxlc3MiLCJob3VyVmFsIiwicGFyc2VJbnQiLCJnZXRWYWx1ZSIsImlzUG0iLCJob3VycyIsIm1pbnV0ZXMiLCJpc1BNIiwiaGFzQ2xhc3MiLCJzaG93Iiwib3B0aW9ucyIsImRhdGUiLCJtb21lbnQiLCJob3VyIiwibWVyaWRpZW1Ub2dnbGVkIiwiQXJyYXkiLCJqb2luIiwic2Vjb25kcyIsIm9uIiwidG9nZ2xlTWVyaWRpZW0iLCJiaW5kIiwiaGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTUMsVUFBVSx1QkFBUSxrQkFBUixFQUE0QiwyQ0FBNUIsRUFBdUQ7QUFDckVDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IsaUNBRDJCLEVBRTNCLDBCQUYyQixFQUczQiw2QkFIMkIsRUFJM0IsS0FKMkIsRUFLM0IsK0JBTDJCLEVBTTNCLGlDQU4yQixFQU8zQixRQVAyQixFQVEzQiw0QkFSMkIsRUFTM0IseURBVDJCLEVBVTNCLFNBVjJCLEVBVzNCLFFBWDJCLENBQWIsQ0FEcUQ7QUFjckVDLHdCQUFvQixJQUFJRCxRQUFKLENBQWEsQ0FDL0IseUNBRCtCLEVBRS9CLFFBRitCLENBQWIsQ0FkaUQ7QUFrQnJFRSwwQkFBc0IsSUFBSUYsUUFBSixDQUFhLENBQ2pDLDJDQURpQyxFQUVqQyxRQUZpQyxDQUFiLENBbEIrQztBQXNCckVHLDRCQUF3QixJQUFJSCxRQUFKLENBQWEsb1NBQWIsQ0F0QjZDO0FBZ0NyRUksdUJBQW1CLElBQUlKLFFBQUosQ0FBYSxDQUM5QixtQkFEOEIsQ0FBYixDQWhDa0Q7QUFtQ3JFSyxxQkFBaUIsSUFBSUwsUUFBSixDQUFhLENBQzVCLE9BRDRC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QUtBLE9BQXJCO0FBQ0EsV0FBS29ELFdBQUwsQ0FBaUIsS0FBS3BELE9BQXRCLEVBQStCcUQsTUFBL0I7QUFDRCxLQXZNb0U7QUF3TXJFSyxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLGFBQVEsS0FBS1UsT0FBTCxJQUFnQixLQUFLQSxPQUFMLENBQWE1RCxRQUE5QixJQUEyQyxLQUFLQSxRQUF2RDtBQUNEO0FBMU1vRSxHQUF2RCxDQUFoQjs7b0JBNk1lckIsTyIsImZpbGUiOiJUaW1lUGlja2VyLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IF9XaWRnZXRCYXNlIGZyb20gJ2Rpaml0L19XaWRnZXRCYXNlJztcclxuaW1wb3J0IF9UZW1wbGF0ZWQgZnJvbSAnLi9fVGVtcGxhdGVkJztcclxuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vRHJvcGRvd24nO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCd0aW1lUGlja2VyJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlRpbWVQaWNrZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5UaW1lUGlja2VyJywgW19XaWRnZXRCYXNlLCBfVGVtcGxhdGVkXSwge1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJ0aW1lLXNlbGVjdCBwYW5lbFwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cInRpbWUtcGFydHNcIj4nLFxyXG4gICAgJ3slISAkLmhvdXJTZWxlY3RUZW1wbGF0ZSAlfScsXHJcbiAgICAnIDogJyxcclxuICAgICd7JSEgJC5taW51dGVTZWxlY3RUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQubWVyaWRpZW1TZWxlY3RUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICd7JSBpZiAoJC5zaG93U2V0VGltZSkgeyAlfScsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1dHRvbiB0ZXJ0aWFyeVwiPnslPSAkLnNldFRpbWVUZXh0ICV9PC9kaXY+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGhvdXJTZWxlY3RUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJob3VyTm9kZVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBtaW51dGVTZWxlY3RUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJtaW51dGVOb2RlXCI+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIG1lcmlkaWVtU2VsZWN0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICBgPGRpdiBjbGFzcz1cInN3aXRjaFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJtZXJpZGllbU5vZGVcIj5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICBuYW1lPVwiQU1QTVRvZ2dsZU5vZGVcIlxyXG4gICAgICAgICAgaWQ9XCJBTVBNVG9nZ2xlTm9kZVwiXHJcbiAgICAgICAgICBjbGFzcz1cInN3aXRjaFwiIC8+XHJcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwidG9nZ2xlQU1QTVwiIGZvcj1cIkFNUE1Ub2dnbGVOb2RlXCI+eyU9ICQuYW1UZXh0ICV9PC9sYWJlbD5cclxuICAgICAgPC9kaXY+YCxcclxuICBdKSxcclxuICBsaXN0U3RhcnRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8dWwgY2xhc3M9XCJsaXN0XCI+JyxcclxuICBdKSxcclxuICBsaXN0RW5kVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPC91bD4nLFxyXG4gIF0pLFxyXG4gIGxpc3RJdGVtVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwibGlzdC1pdGVtXCIgZGF0YS1hY3Rpb249XCJ7JC5hY3Rpb259XCI+JyxcclxuICAgICd7JT0gJC52YWx1ZSB9JyxcclxuICAgICc8L2xpPicsXHJcbiAgXSksXHJcblxyXG4gIGFtVGV4dDogcmVzb3VyY2UuYW1UZXh0LFxyXG4gIHBtVGV4dDogcmVzb3VyY2UucG1UZXh0LFxyXG4gIHNldFRpbWVUZXh0OiByZXNvdXJjZS5zZXRUaW1lVGV4dCxcclxuXHJcbiAgdGltZVZhbHVlOiBudWxsLFxyXG4gIF9zaG93QU06IG51bGwsXHJcbiAgX2hvdXJEcm9wZG93bjogbnVsbCxcclxuICBfaG91clZhbHVlOiBudWxsLFxyXG4gIF9taW51dGVEcm9wZG93bjogbnVsbCxcclxuICBfbWludXRlVmFsdWU6IG51bGwsXHJcbiAgX3NlbGVjdGVkSG91cjogbnVsbCxcclxuICBfc2VsZWN0ZWRNaW51dGU6IG51bGwsXHJcbiAgX3dpZGdldE5hbWU6ICd0aW1lUGlja2VyJyxcclxuICB0aW1lbGVzczogZmFsc2UsXHJcbiAgc2hvd1NldFRpbWU6IHRydWUsXHJcbiAgaG91clZhbHVlczogbnVsbCxcclxuICBtaW51dGVWYWx1ZXM6IG51bGwsXHJcbiAgY3JlYXRlSG91ckxheW91dDogZnVuY3Rpb24gY3JlYXRlSG91ckxheW91dCgpIHtcclxuICAgIGlmICghdGhpcy5ob3VyVmFsdWVzKSB7XHJcbiAgICAgIGNvbnN0IHRvdGFsSG91cnMgPSAoQXBwLmlzMjRIb3VyQ2xvY2soKSkgPyAyNCA6IDEyO1xyXG4gICAgICB0aGlzLmhvdXJWYWx1ZXMgPSBbXTtcclxuICAgICAgdGhpcy5ob3VyVmFsdWVzID0gKHRvdGFsSG91cnMgPT09IDI0KSA/IHRoaXMuY3JlYXRlMjRIb3VyTGlzdCh0b3RhbEhvdXJzKSA6IHRoaXMuY3JlYXRlSG91ckxpc3QodG90YWxIb3Vycyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5ob3VyVmFsdWVzO1xyXG4gIH0sXHJcbiAgY3JlYXRlSG91ckxpc3Q6IGZ1bmN0aW9uIGNyZWF0ZUhvdXJMaXN0KHRvdGFsSG91cnMpIHtcclxuICAgIGNvbnN0IGhvdXJWYWx1ZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWxIb3VyczsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGRpc3BWYWwgPSAoaSArIDEpLnRvU3RyaW5nKCk7XHJcbiAgICAgIGhvdXJWYWx1ZXMucHVzaCh7IHZhbHVlOiBkaXNwVmFsLCBrZXk6IGRpc3BWYWwgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaG91clZhbHVlcztcclxuICB9LFxyXG4gIGNyZWF0ZTI0SG91ckxpc3Q6IGZ1bmN0aW9uIGNyZWF0ZTI0SG91ckxpc3QodG90YWxIb3Vycykge1xyXG4gICAgY29uc3QgaG91clZhbHVlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbEhvdXJzOyBpKyspIHtcclxuICAgICAgY29uc3QgZGlzcFZhbCA9IGAke2l9YC5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICBob3VyVmFsdWVzLnB1c2goeyB2YWx1ZTogZGlzcFZhbCwga2V5OiBkaXNwVmFsIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhvdXJWYWx1ZXM7XHJcbiAgfSxcclxuICBjcmVhdGVNaW51dGVMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZU1pbnV0ZUxheW91dCgpIHtcclxuICAgIGlmICghdGhpcy5taW51dGVWYWx1ZXMpIHtcclxuICAgICAgdGhpcy5taW51dGVWYWx1ZXMgPSBbXTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSArPSA1KSB7XHJcbiAgICAgICAgY29uc3QgZGlzcFZhbCA9IGAke2l9YC5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgIHRoaXMubWludXRlVmFsdWVzLnB1c2goeyB2YWx1ZTogZGlzcFZhbCwga2V5OiBpLnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm1pbnV0ZVZhbHVlcztcclxuICB9LFxyXG4gIGNyZWF0ZUhvdXJEcm9wZG93bjogZnVuY3Rpb24gY3JlYXRlSG91ckRyb3Bkb3duKGluaXRpYWwpIHtcclxuICAgIGlmICghdGhpcy5faG91ckRyb3Bkb3duKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlSG91ckxheW91dCgpO1xyXG4gICAgICB0aGlzLl9ob3VyRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oeyBpZDogJ2hvdXItZHJvcGRvd24nLCBpdGVtTXVzdEV4aXN0OiB0cnVlLCBkcm9wZG93bkNsYXNzOiAnZHJvcGRvd24tbXgnIH0pO1xyXG4gICAgICB0aGlzLl9ob3VyRHJvcGRvd24uY3JlYXRlTGlzdCh7IGl0ZW1zOiB0aGlzLmhvdXJWYWx1ZXMsIGRlZmF1bHRWYWx1ZTogYCR7aW5pdGlhbH1gIH0pO1xyXG4gICAgICAkKHRoaXMuaG91ck5vZGUpLnJlcGxhY2VXaXRoKHRoaXMuX2hvdXJEcm9wZG93bi5kb21Ob2RlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgY3JlYXRlTWludXRlRHJvcGRvd246IGZ1bmN0aW9uIGNyZWF0ZU1pbnV0ZURyb3Bkb3duKGluaXRpYWwpIHtcclxuICAgIGNvbnN0IHRlbXBWYWx1ZSA9IE1hdGguY2VpbChpbml0aWFsIC8gMSkgKiAxO1xyXG4gICAgbGV0IHZhbHVlID0gaW5pdGlhbDtcclxuICAgIGlmICh0ZW1wVmFsdWUgPj0gNjApIHtcclxuICAgICAgdmFsdWUgPSAnNTknO1xyXG4gICAgfVxyXG4gICAgaWYgKHRlbXBWYWx1ZSA9PT0gMCkge1xyXG4gICAgICB2YWx1ZSA9ICcwMCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLl9taW51dGVEcm9wZG93bikge1xyXG4gICAgICB0aGlzLmNyZWF0ZU1pbnV0ZUxheW91dCgpO1xyXG4gICAgICB0aGlzLl9taW51dGVEcm9wZG93biA9IG5ldyBEcm9wZG93bih7IGlkOiAnbWludXRlLW1vZGFsJywgaXRlbU11c3RFeGlzdDogdHJ1ZSwgZHJvcGRvd25DbGFzczogJ2Ryb3Bkb3duLW14JyB9KTtcclxuICAgICAgdGhpcy5fbWludXRlRHJvcGRvd24uY3JlYXRlTGlzdCh7IGl0ZW1zOiB0aGlzLm1pbnV0ZVZhbHVlcywgZGVmYXVsdFZhbHVlOiBgJHt2YWx1ZX1gIH0pO1xyXG4gICAgICAkKHRoaXMubWludXRlTm9kZSkucmVwbGFjZVdpdGgodGhpcy5fbWludXRlRHJvcGRvd24uZG9tTm9kZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLl9ob3VyRHJvcGRvd24uZGVzdHJveSgpO1xyXG4gICAgdGhpcy5fbWludXRlRHJvcGRvd24uZGVzdHJveSgpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGdldENvbnRlbnQ6IGZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XHJcbiAgICB0aGlzLnNldFRpbWVWYWx1ZSgpO1xyXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgIHJldHVybiB0aGlzLnRpbWVWYWx1ZTtcclxuICB9LFxyXG4gIHJlbW92ZUxpc3RlbmVyczogZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCkge1xyXG4gICAgJCh0aGlzLm1lcmlkaWVtTm9kZS5jaGlsZHJlblswXSkub2ZmKCdjbGljaycpO1xyXG4gIH0sXHJcbiAgc2V0TWVyaWRpZW06IGZ1bmN0aW9uIHNldE1lcmlkaWVtKHZhbHVlLCB0YXJnZXQpIHtcclxuICAgICQodGhpcy5tZXJpZGllbU5vZGUpLnRvZ2dsZUNsYXNzKCd0b2dnbGVTdGF0ZU9uJywgdmFsdWUpO1xyXG4gICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAkKHRhcmdldCkubmV4dCgpLmh0bWwodmFsdWUgPyB0aGlzLnBtVGV4dCA6IHRoaXMuYW1UZXh0KTtcclxuICAgICAgJCh0YXJnZXQpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHNldFRpbWVWYWx1ZTogZnVuY3Rpb24gc2V0VGltZVZhbHVlKCkge1xyXG4gICAgaWYgKCF0aGlzLl9pc1RpbWVsZXNzKCkpIHtcclxuICAgICAgaWYgKEFwcC5pczI0SG91ckNsb2NrKCkpIHtcclxuICAgICAgICBjb25zdCBob3VyVmFsID0gcGFyc2VJbnQodGhpcy5faG91ckRyb3Bkb3duLmdldFZhbHVlKCksIDEwKTtcclxuICAgICAgICBsZXQgaXNQbSA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChob3VyVmFsID49IDEyKSB7XHJcbiAgICAgICAgICBpc1BtID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lVmFsdWUuaG91cnMgPSBob3VyVmFsO1xyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLm1pbnV0ZXMgPSBwYXJzZUludCh0aGlzLl9taW51dGVEcm9wZG93bi5nZXRWYWx1ZSgpLCAxMCk7XHJcbiAgICAgICAgdGhpcy50aW1lVmFsdWUuaXNQTSA9IGlzUG07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy50aW1lVmFsdWUuaG91cnMgPSBwYXJzZUludCh0aGlzLl9ob3VyRHJvcGRvd24uZ2V0VmFsdWUoKSwgMTApO1xyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLm1pbnV0ZXMgPSBwYXJzZUludCh0aGlzLl9taW51dGVEcm9wZG93bi5nZXRWYWx1ZSgpLCAxMCk7XHJcbiAgICAgICAgdGhpcy50aW1lVmFsdWUuaXNQTSA9ICQodGhpcy5tZXJpZGllbU5vZGUpLmhhc0NsYXNzKCd0b2dnbGVTdGF0ZU9uJyk7XHJcbiAgICAgICAgdGhpcy50aW1lVmFsdWUuaG91cnMgPSB0aGlzLnRpbWVWYWx1ZS5pc1BNXHJcbiAgICAgICAgICA/ICh0aGlzLnRpbWVWYWx1ZS5ob3VycyAlIDEyKSArIDEyXHJcbiAgICAgICAgICA6ICh0aGlzLnRpbWVWYWx1ZS5ob3VycyAlIDEyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy50aW1lVmFsdWUgPSB7XHJcbiAgICAgIGlzUE06IGZhbHNlLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGRhdGUgPSBtb21lbnQob3B0aW9ucy5kYXRlKSB8fCBtb21lbnQoKTtcclxuICAgIGxldCBob3VyID0gZGF0ZS5ob3VycygpO1xyXG4gICAgbGV0IG1lcmlkaWVtVG9nZ2xlZCA9IGZhbHNlO1xyXG4gICAgaWYgKGhvdXIgPj0gMTIpIHtcclxuICAgICAgaWYgKGhvdXIgIT09IDEyICYmICFBcHAuaXMyNEhvdXJDbG9jaygpKSB7XHJcbiAgICAgICAgaG91ciA9IGhvdXIgJSAxMjtcclxuICAgICAgfVxyXG4gICAgICBtZXJpZGllbVRvZ2dsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKGhvdXIgPT09IDAgJiYgIUFwcC5pczI0SG91ckNsb2NrKCkpIHtcclxuICAgICAgaG91ciA9IDEyO1xyXG4gICAgfVxyXG4gICAgbGV0IG1pbnV0ZXMgPSBkYXRlLm1pbnV0ZXMoKSB8fCAwO1xyXG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xyXG4gICAgICBtaW51dGVzID0gYCR7bWludXRlc31gO1xyXG4gICAgICBtaW51dGVzID0gQXJyYXkoMikuam9pbignMCcpICsgbWludXRlcztcclxuICAgIH1cclxuICAgIHRoaXMudGltZVZhbHVlLnNlY29uZHMgPSBkYXRlLnNlY29uZHMoKTtcclxuICAgIChBcHAuaXMyNEhvdXJDbG9jaygpID8gdGhpcy5jcmVhdGVIb3VyRHJvcGRvd24oYCR7aG91cn1gLnBhZFN0YXJ0KDIsICcwJykpIDogdGhpcy5jcmVhdGVIb3VyRHJvcGRvd24oYCR7aG91cn1gKSlcclxuICAgICAgLmNyZWF0ZU1pbnV0ZURyb3Bkb3duKGAke21pbnV0ZXN9YCk7XHJcbiAgICBpZiAoIUFwcC5pczI0SG91ckNsb2NrKCkpIHtcclxuICAgICAgdGhpcy5zZXRNZXJpZGllbShtZXJpZGllbVRvZ2dsZWQsIHRoaXMubWVyaWRpZW1Ob2RlLmNoaWxkcmVuWzBdKTtcclxuICAgICAgJCh0aGlzLm1lcmlkaWVtTm9kZS5jaGlsZHJlblswXSkub24oJ2NsaWNrJywgdGhpcy50b2dnbGVNZXJpZGllbS5iaW5kKHRoaXMpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQodGhpcy5tZXJpZGllbU5vZGUpLmhpZGUoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHRvZ2dsZU1lcmlkaWVtOiBmdW5jdGlvbiB0b2dnbGVNZXJpZGllbSh7IHRhcmdldCB9KSB7XHJcbiAgICB0aGlzLl9zaG93QU0gPSAhdGhpcy5fc2hvd0FNO1xyXG4gICAgdGhpcy5zZXRNZXJpZGllbSh0aGlzLl9zaG93QU0sIHRhcmdldCk7XHJcbiAgfSxcclxuICBfaXNUaW1lbGVzczogZnVuY3Rpb24gX2lzVGltZWxlc3MoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudGltZWxlc3MpIHx8IHRoaXMudGltZWxlc3M7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=