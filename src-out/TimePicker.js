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
      this.inherited(destroy, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UaW1lUGlja2VyLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJob3VyU2VsZWN0VGVtcGxhdGUiLCJtaW51dGVTZWxlY3RUZW1wbGF0ZSIsIm1lcmlkaWVtU2VsZWN0VGVtcGxhdGUiLCJsaXN0U3RhcnRUZW1wbGF0ZSIsImxpc3RFbmRUZW1wbGF0ZSIsImxpc3RJdGVtVGVtcGxhdGUiLCJhbVRleHQiLCJwbVRleHQiLCJzZXRUaW1lVGV4dCIsInRpbWVWYWx1ZSIsIl9zaG93QU0iLCJfaG91ckRyb3Bkb3duIiwiX2hvdXJWYWx1ZSIsIl9taW51dGVEcm9wZG93biIsIl9taW51dGVWYWx1ZSIsIl9zZWxlY3RlZEhvdXIiLCJfc2VsZWN0ZWRNaW51dGUiLCJfd2lkZ2V0TmFtZSIsInRpbWVsZXNzIiwic2hvd1NldFRpbWUiLCJob3VyVmFsdWVzIiwibWludXRlVmFsdWVzIiwiY3JlYXRlSG91ckxheW91dCIsInRvdGFsSG91cnMiLCJBcHAiLCJpczI0SG91ckNsb2NrIiwiY3JlYXRlMjRIb3VyTGlzdCIsImNyZWF0ZUhvdXJMaXN0IiwiaSIsImRpc3BWYWwiLCJ0b1N0cmluZyIsInB1c2giLCJ2YWx1ZSIsImtleSIsInBhZFN0YXJ0IiwiY3JlYXRlTWludXRlTGF5b3V0IiwiY3JlYXRlSG91ckRyb3Bkb3duIiwiaW5pdGlhbCIsImlkIiwiaXRlbU11c3RFeGlzdCIsImRyb3Bkb3duQ2xhc3MiLCJjcmVhdGVMaXN0IiwiaXRlbXMiLCJkZWZhdWx0VmFsdWUiLCIkIiwiaG91ck5vZGUiLCJyZXBsYWNlV2l0aCIsImRvbU5vZGUiLCJjcmVhdGVNaW51dGVEcm9wZG93biIsInRlbXBWYWx1ZSIsIk1hdGgiLCJjZWlsIiwibWludXRlTm9kZSIsImRlc3Ryb3kiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRDb250ZW50Iiwic2V0VGltZVZhbHVlIiwicmVtb3ZlTGlzdGVuZXJzIiwibWVyaWRpZW1Ob2RlIiwiY2hpbGRyZW4iLCJvZmYiLCJzZXRNZXJpZGllbSIsInRhcmdldCIsInRvZ2dsZUNsYXNzIiwibmV4dCIsImh0bWwiLCJwcm9wIiwiX2lzVGltZWxlc3MiLCJob3VyVmFsIiwicGFyc2VJbnQiLCJnZXRWYWx1ZSIsImlzUG0iLCJob3VycyIsIm1pbnV0ZXMiLCJpc1BNIiwiaGFzQ2xhc3MiLCJzaG93Iiwib3B0aW9ucyIsImRhdGUiLCJtb21lbnQiLCJob3VyIiwibWVyaWRpZW1Ub2dnbGVkIiwiQXJyYXkiLCJqb2luIiwic2Vjb25kcyIsIm9uIiwidG9nZ2xlTWVyaWRpZW0iLCJiaW5kIiwiaGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTUMsVUFBVSx1QkFBUSxrQkFBUixFQUE0QiwyQ0FBNUIsRUFBdUQ7QUFDckVDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IsaUNBRDJCLEVBRTNCLDBCQUYyQixFQUczQiw2QkFIMkIsRUFJM0IsS0FKMkIsRUFLM0IsK0JBTDJCLEVBTTNCLGlDQU4yQixFQU8zQixRQVAyQixFQVEzQiw0QkFSMkIsRUFTM0IseURBVDJCLEVBVTNCLFNBVjJCLEVBVzNCLFFBWDJCLENBQWIsQ0FEcUQ7QUFjckVDLHdCQUFvQixJQUFJRCxRQUFKLENBQWEsQ0FDL0IseUNBRCtCLEVBRS9CLFFBRitCLENBQWIsQ0FkaUQ7QUFrQnJFRSwwQkFBc0IsSUFBSUYsUUFBSixDQUFhLENBQ2pDLDJDQURpQyxFQUVqQyxRQUZpQyxDQUFiLENBbEIrQztBQXNCckVHLDRCQUF3QixJQUFJSCxRQUFKLENBQWEsb1NBQWIsQ0F0QjZDO0FBZ0NyRUksdUJBQW1CLElBQUlKLFFBQUosQ0FBYSxDQUM5QixtQkFEOEIsQ0FBYixDQWhDa0Q7QUFtQ3JFSyxxQkFBaUIsSUFBSUwsUUFBSixDQUFhLENBQzVCLE9BRDRC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LEdBQWUsQ0FBQyxLQUFLQSxPQUFyQjtBQUNBLFdBQUtvRCxXQUFMLENBQWlCLEtBQUtwRCxPQUF0QixFQUErQnFELE1BQS9CO0FBQ0QsS0F2TW9FO0FBd01yRUssaUJBQWEsU0FBU0EsV0FBVCxHQUF1QjtBQUNsQyxhQUFRLEtBQUtVLE9BQUwsSUFBZ0IsS0FBS0EsT0FBTCxDQUFhNUQsUUFBOUIsSUFBMkMsS0FBS0EsUUFBdkQ7QUFDRDtBQTFNb0UsR0FBdkQsQ0FBaEI7O29CQTZNZXJCLE8iLCJmaWxlIjoiVGltZVBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4vX1RlbXBsYXRlZCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL0Ryb3Bkb3duJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgndGltZVBpY2tlcicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5UaW1lUGlja2VyXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuVGltZVBpY2tlcicsIFtfV2lkZ2V0QmFzZSwgX1RlbXBsYXRlZF0sIHtcclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwidGltZS1zZWxlY3QgcGFuZWxcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ0aW1lLXBhcnRzXCI+JyxcclxuICAgICd7JSEgJC5ob3VyU2VsZWN0VGVtcGxhdGUgJX0nLFxyXG4gICAgJyA6ICcsXHJcbiAgICAneyUhICQubWludXRlU2VsZWN0VGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLm1lcmlkaWVtU2VsZWN0VGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAneyUgaWYgKCQuc2hvd1NldFRpbWUpIHsgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXR0b24gdGVydGlhcnlcIj57JT0gJC5zZXRUaW1lVGV4dCAlfTwvZGl2PicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBob3VyU2VsZWN0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaG91ck5vZGVcIj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgbWludXRlU2VsZWN0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibWludXRlTm9kZVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBtZXJpZGllbVNlbGVjdFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgYDxkaXYgY2xhc3M9XCJzd2l0Y2hcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibWVyaWRpZW1Ob2RlXCI+XHJcbiAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgbmFtZT1cIkFNUE1Ub2dnbGVOb2RlXCJcclxuICAgICAgICAgIGlkPVwiQU1QTVRvZ2dsZU5vZGVcIlxyXG4gICAgICAgICAgY2xhc3M9XCJzd2l0Y2hcIiAvPlxyXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cInRvZ2dsZUFNUE1cIiBmb3I9XCJBTVBNVG9nZ2xlTm9kZVwiPnslPSAkLmFtVGV4dCAlfTwvbGFiZWw+XHJcbiAgICAgIDwvZGl2PmAsXHJcbiAgXSksXHJcbiAgbGlzdFN0YXJ0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHVsIGNsYXNzPVwibGlzdFwiPicsXHJcbiAgXSksXHJcbiAgbGlzdEVuZFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzwvdWw+JyxcclxuICBdKSxcclxuICBsaXN0SXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cImxpc3QtaXRlbVwiIGRhdGEtYWN0aW9uPVwieyQuYWN0aW9ufVwiPicsXHJcbiAgICAneyU9ICQudmFsdWUgfScsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG5cclxuICBhbVRleHQ6IHJlc291cmNlLmFtVGV4dCxcclxuICBwbVRleHQ6IHJlc291cmNlLnBtVGV4dCxcclxuICBzZXRUaW1lVGV4dDogcmVzb3VyY2Uuc2V0VGltZVRleHQsXHJcblxyXG4gIHRpbWVWYWx1ZTogbnVsbCxcclxuICBfc2hvd0FNOiBudWxsLFxyXG4gIF9ob3VyRHJvcGRvd246IG51bGwsXHJcbiAgX2hvdXJWYWx1ZTogbnVsbCxcclxuICBfbWludXRlRHJvcGRvd246IG51bGwsXHJcbiAgX21pbnV0ZVZhbHVlOiBudWxsLFxyXG4gIF9zZWxlY3RlZEhvdXI6IG51bGwsXHJcbiAgX3NlbGVjdGVkTWludXRlOiBudWxsLFxyXG4gIF93aWRnZXROYW1lOiAndGltZVBpY2tlcicsXHJcbiAgdGltZWxlc3M6IGZhbHNlLFxyXG4gIHNob3dTZXRUaW1lOiB0cnVlLFxyXG4gIGhvdXJWYWx1ZXM6IG51bGwsXHJcbiAgbWludXRlVmFsdWVzOiBudWxsLFxyXG4gIGNyZWF0ZUhvdXJMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZUhvdXJMYXlvdXQoKSB7XHJcbiAgICBpZiAoIXRoaXMuaG91clZhbHVlcykge1xyXG4gICAgICBjb25zdCB0b3RhbEhvdXJzID0gKEFwcC5pczI0SG91ckNsb2NrKCkpID8gMjQgOiAxMjtcclxuICAgICAgdGhpcy5ob3VyVmFsdWVzID0gW107XHJcbiAgICAgIHRoaXMuaG91clZhbHVlcyA9ICh0b3RhbEhvdXJzID09PSAyNCkgPyB0aGlzLmNyZWF0ZTI0SG91ckxpc3QodG90YWxIb3VycykgOiB0aGlzLmNyZWF0ZUhvdXJMaXN0KHRvdGFsSG91cnMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaG91clZhbHVlcztcclxuICB9LFxyXG4gIGNyZWF0ZUhvdXJMaXN0OiBmdW5jdGlvbiBjcmVhdGVIb3VyTGlzdCh0b3RhbEhvdXJzKSB7XHJcbiAgICBjb25zdCBob3VyVmFsdWVzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsSG91cnM7IGkrKykge1xyXG4gICAgICBjb25zdCBkaXNwVmFsID0gKGkgKyAxKS50b1N0cmluZygpO1xyXG4gICAgICBob3VyVmFsdWVzLnB1c2goeyB2YWx1ZTogZGlzcFZhbCwga2V5OiBkaXNwVmFsIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGhvdXJWYWx1ZXM7XHJcbiAgfSxcclxuICBjcmVhdGUyNEhvdXJMaXN0OiBmdW5jdGlvbiBjcmVhdGUyNEhvdXJMaXN0KHRvdGFsSG91cnMpIHtcclxuICAgIGNvbnN0IGhvdXJWYWx1ZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWxIb3VyczsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGRpc3BWYWwgPSBgJHtpfWAucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgaG91clZhbHVlcy5wdXNoKHsgdmFsdWU6IGRpc3BWYWwsIGtleTogZGlzcFZhbCB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBob3VyVmFsdWVzO1xyXG4gIH0sXHJcbiAgY3JlYXRlTWludXRlTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVNaW51dGVMYXlvdXQoKSB7XHJcbiAgICBpZiAoIXRoaXMubWludXRlVmFsdWVzKSB7XHJcbiAgICAgIHRoaXMubWludXRlVmFsdWVzID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkgKz0gNSkge1xyXG4gICAgICAgIGNvbnN0IGRpc3BWYWwgPSBgJHtpfWAucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICB0aGlzLm1pbnV0ZVZhbHVlcy5wdXNoKHsgdmFsdWU6IGRpc3BWYWwsIGtleTogaS50b1N0cmluZygpIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5taW51dGVWYWx1ZXM7XHJcbiAgfSxcclxuICBjcmVhdGVIb3VyRHJvcGRvd246IGZ1bmN0aW9uIGNyZWF0ZUhvdXJEcm9wZG93bihpbml0aWFsKSB7XHJcbiAgICBpZiAoIXRoaXMuX2hvdXJEcm9wZG93bikge1xyXG4gICAgICB0aGlzLmNyZWF0ZUhvdXJMYXlvdXQoKTtcclxuICAgICAgdGhpcy5faG91ckRyb3Bkb3duID0gbmV3IERyb3Bkb3duKHsgaWQ6ICdob3VyLWRyb3Bkb3duJywgaXRlbU11c3RFeGlzdDogdHJ1ZSwgZHJvcGRvd25DbGFzczogJ2Ryb3Bkb3duLW14JyB9KTtcclxuICAgICAgdGhpcy5faG91ckRyb3Bkb3duLmNyZWF0ZUxpc3QoeyBpdGVtczogdGhpcy5ob3VyVmFsdWVzLCBkZWZhdWx0VmFsdWU6IGAke2luaXRpYWx9YCB9KTtcclxuICAgICAgJCh0aGlzLmhvdXJOb2RlKS5yZXBsYWNlV2l0aCh0aGlzLl9ob3VyRHJvcGRvd24uZG9tTm9kZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNyZWF0ZU1pbnV0ZURyb3Bkb3duOiBmdW5jdGlvbiBjcmVhdGVNaW51dGVEcm9wZG93bihpbml0aWFsKSB7XHJcbiAgICBjb25zdCB0ZW1wVmFsdWUgPSBNYXRoLmNlaWwoaW5pdGlhbCAvIDEpICogMTtcclxuICAgIGxldCB2YWx1ZSA9IGluaXRpYWw7XHJcbiAgICBpZiAodGVtcFZhbHVlID49IDYwKSB7XHJcbiAgICAgIHZhbHVlID0gJzU5JztcclxuICAgIH1cclxuICAgIGlmICh0ZW1wVmFsdWUgPT09IDApIHtcclxuICAgICAgdmFsdWUgPSAnMDAnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5fbWludXRlRHJvcGRvd24pIHtcclxuICAgICAgdGhpcy5jcmVhdGVNaW51dGVMYXlvdXQoKTtcclxuICAgICAgdGhpcy5fbWludXRlRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oeyBpZDogJ21pbnV0ZS1tb2RhbCcsIGl0ZW1NdXN0RXhpc3Q6IHRydWUsIGRyb3Bkb3duQ2xhc3M6ICdkcm9wZG93bi1teCcgfSk7XHJcbiAgICAgIHRoaXMuX21pbnV0ZURyb3Bkb3duLmNyZWF0ZUxpc3QoeyBpdGVtczogdGhpcy5taW51dGVWYWx1ZXMsIGRlZmF1bHRWYWx1ZTogYCR7dmFsdWV9YCB9KTtcclxuICAgICAgJCh0aGlzLm1pbnV0ZU5vZGUpLnJlcGxhY2VXaXRoKHRoaXMuX21pbnV0ZURyb3Bkb3duLmRvbU5vZGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5faG91ckRyb3Bkb3duLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuX21pbnV0ZURyb3Bkb3duLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRlc3Ryb3ksIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBnZXRDb250ZW50OiBmdW5jdGlvbiBnZXRDb250ZW50KCkge1xyXG4gICAgdGhpcy5zZXRUaW1lVmFsdWUoKTtcclxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lVmFsdWU7XHJcbiAgfSxcclxuICByZW1vdmVMaXN0ZW5lcnM6IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycygpIHtcclxuICAgICQodGhpcy5tZXJpZGllbU5vZGUuY2hpbGRyZW5bMF0pLm9mZignY2xpY2snKTtcclxuICB9LFxyXG4gIHNldE1lcmlkaWVtOiBmdW5jdGlvbiBzZXRNZXJpZGllbSh2YWx1ZSwgdGFyZ2V0KSB7XHJcbiAgICAkKHRoaXMubWVyaWRpZW1Ob2RlKS50b2dnbGVDbGFzcygndG9nZ2xlU3RhdGVPbicsIHZhbHVlKTtcclxuICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgJCh0YXJnZXQpLm5leHQoKS5odG1sKHZhbHVlID8gdGhpcy5wbVRleHQgOiB0aGlzLmFtVGV4dCk7XHJcbiAgICAgICQodGFyZ2V0KS5wcm9wKCdjaGVja2VkJywgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXRUaW1lVmFsdWU6IGZ1bmN0aW9uIHNldFRpbWVWYWx1ZSgpIHtcclxuICAgIGlmICghdGhpcy5faXNUaW1lbGVzcygpKSB7XHJcbiAgICAgIGlmIChBcHAuaXMyNEhvdXJDbG9jaygpKSB7XHJcbiAgICAgICAgY29uc3QgaG91clZhbCA9IHBhcnNlSW50KHRoaXMuX2hvdXJEcm9wZG93bi5nZXRWYWx1ZSgpLCAxMCk7XHJcbiAgICAgICAgbGV0IGlzUG0gPSBmYWxzZTtcclxuICAgICAgICBpZiAoaG91clZhbCA+PSAxMikge1xyXG4gICAgICAgICAgaXNQbSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLmhvdXJzID0gaG91clZhbDtcclxuICAgICAgICB0aGlzLnRpbWVWYWx1ZS5taW51dGVzID0gcGFyc2VJbnQodGhpcy5fbWludXRlRHJvcGRvd24uZ2V0VmFsdWUoKSwgMTApO1xyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLmlzUE0gPSBpc1BtO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLmhvdXJzID0gcGFyc2VJbnQodGhpcy5faG91ckRyb3Bkb3duLmdldFZhbHVlKCksIDEwKTtcclxuICAgICAgICB0aGlzLnRpbWVWYWx1ZS5taW51dGVzID0gcGFyc2VJbnQodGhpcy5fbWludXRlRHJvcGRvd24uZ2V0VmFsdWUoKSwgMTApO1xyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLmlzUE0gPSAkKHRoaXMubWVyaWRpZW1Ob2RlKS5oYXNDbGFzcygndG9nZ2xlU3RhdGVPbicpO1xyXG4gICAgICAgIHRoaXMudGltZVZhbHVlLmhvdXJzID0gdGhpcy50aW1lVmFsdWUuaXNQTVxyXG4gICAgICAgICAgPyAodGhpcy50aW1lVmFsdWUuaG91cnMgJSAxMikgKyAxMlxyXG4gICAgICAgICAgOiAodGhpcy50aW1lVmFsdWUuaG91cnMgJSAxMik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMudGltZVZhbHVlID0ge1xyXG4gICAgICBpc1BNOiBmYWxzZSxcclxuICAgIH07XHJcbiAgICBjb25zdCBkYXRlID0gbW9tZW50KG9wdGlvbnMuZGF0ZSkgfHwgbW9tZW50KCk7XHJcbiAgICBsZXQgaG91ciA9IGRhdGUuaG91cnMoKTtcclxuICAgIGxldCBtZXJpZGllbVRvZ2dsZWQgPSBmYWxzZTtcclxuICAgIGlmIChob3VyID49IDEyKSB7XHJcbiAgICAgIGlmIChob3VyICE9PSAxMiAmJiAhQXBwLmlzMjRIb3VyQ2xvY2soKSkge1xyXG4gICAgICAgIGhvdXIgPSBob3VyICUgMTI7XHJcbiAgICAgIH1cclxuICAgICAgbWVyaWRpZW1Ub2dnbGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmIChob3VyID09PSAwICYmICFBcHAuaXMyNEhvdXJDbG9jaygpKSB7XHJcbiAgICAgIGhvdXIgPSAxMjtcclxuICAgIH1cclxuICAgIGxldCBtaW51dGVzID0gZGF0ZS5taW51dGVzKCkgfHwgMDtcclxuICAgIGlmIChtaW51dGVzIDwgMTApIHtcclxuICAgICAgbWludXRlcyA9IGAke21pbnV0ZXN9YDtcclxuICAgICAgbWludXRlcyA9IEFycmF5KDIpLmpvaW4oJzAnKSArIG1pbnV0ZXM7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRpbWVWYWx1ZS5zZWNvbmRzID0gZGF0ZS5zZWNvbmRzKCk7XHJcbiAgICAoQXBwLmlzMjRIb3VyQ2xvY2soKSA/IHRoaXMuY3JlYXRlSG91ckRyb3Bkb3duKGAke2hvdXJ9YC5wYWRTdGFydCgyLCAnMCcpKSA6IHRoaXMuY3JlYXRlSG91ckRyb3Bkb3duKGAke2hvdXJ9YCkpXHJcbiAgICAgIC5jcmVhdGVNaW51dGVEcm9wZG93bihgJHttaW51dGVzfWApO1xyXG4gICAgaWYgKCFBcHAuaXMyNEhvdXJDbG9jaygpKSB7XHJcbiAgICAgIHRoaXMuc2V0TWVyaWRpZW0obWVyaWRpZW1Ub2dnbGVkLCB0aGlzLm1lcmlkaWVtTm9kZS5jaGlsZHJlblswXSk7XHJcbiAgICAgICQodGhpcy5tZXJpZGllbU5vZGUuY2hpbGRyZW5bMF0pLm9uKCdjbGljaycsIHRoaXMudG9nZ2xlTWVyaWRpZW0uYmluZCh0aGlzKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKHRoaXMubWVyaWRpZW1Ob2RlKS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICB0b2dnbGVNZXJpZGllbTogZnVuY3Rpb24gdG9nZ2xlTWVyaWRpZW0oeyB0YXJnZXQgfSkge1xyXG4gICAgdGhpcy5fc2hvd0FNID0gIXRoaXMuX3Nob3dBTTtcclxuICAgIHRoaXMuc2V0TWVyaWRpZW0odGhpcy5fc2hvd0FNLCB0YXJnZXQpO1xyXG4gIH0sXHJcbiAgX2lzVGltZWxlc3M6IGZ1bmN0aW9uIF9pc1RpbWVsZXNzKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnRpbWVsZXNzKSB8fCB0aGlzLnRpbWVsZXNzO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19