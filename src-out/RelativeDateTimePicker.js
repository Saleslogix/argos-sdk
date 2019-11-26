define('argos/RelativeDateTimePicker', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', './_Templated', './_ActionMixin', './_CustomizationMixin', './DateTimePicker', './I18n'], function (module, exports, _declare, _WidgetBase2, _Templated2, _ActionMixin2, _CustomizationMixin2, _DateTimePicker, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  var _DateTimePicker2 = _interopRequireDefault(_DateTimePicker);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('relativeDateTimePicker'); /* Copyright 2017 Infor
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

  var dtFormatResource = (0, _I18n2.default)('relativeDateTimePickerDateTimeFormat');

  /**
   * @class argos.DateTimePicker
   */
  var __class = (0, _declare2.default)('argos.RelativeDateTimePicker', [_WidgetBase3.default, _Templated3.default, _ActionMixin3.default, _CustomizationMixin3.default], {
    widgetTemplate: new Simplate(['<div class="relative-datetime-select" data-dojo-attach-point="relativeDateTimeNode">', '<div class="relative-datetime-select__title">{%: $.titleText %}</div>', '<ul class="simpleList" data-dojo-attach-point="listNode"></ul>', '</div>']),
    listItemTemplate: new Simplate(['<li class="simpleList__item" data-time="{%: $.time %}" data-action="select">', '<div class="item__text--left"><span>{%: $.textLeft %}</span></div>', '<div class="item__text--right"><span>{%: $.textRight %}</span></div>', '</li>']),

    _deferred: null,
    _selectedTime: null,
    _widgetName: 'relativeDateTimePicker',
    _dateTimeModal: null,
    customizationSet: 'relativeDateTimePicker',
    layout: null,
    morningHours: 8,
    eveningHours: 17,
    showThisEveningUntil: 12,
    isModal: false,
    showTimePicker: true,
    titleText: resource.titleText,
    pickDateTimeText: resource.pickDateTimeText,
    thisEveningText: resource.thisEveningText,
    tomorrowMorningText: resource.tomorrowMorningText,
    tomorrowAfternoonText: resource.tomorrowAfternoonText,
    nextWeekText: resource.nextWeekText,
    nextMonthText: resource.nextMonthText,
    hoursFormat: dtFormatResource.hoursFormat,
    dayHoursFormat: dtFormatResource.dayHoursFormat,
    hoursFormat24: dtFormatResource.hoursFormat24,
    dayHoursFormat24: dtFormatResource.dayHoursFormat24,

    createLayout: function createLayout() {
      return [{
        title: this.titleText,
        children: [{
          label: this.thisEveningText,
          time: moment().clone().hours(this.eveningHours).minutes(0).seconds(0),
          format: App.is24HourClock() ? this.hoursFormat24 : this.hoursFormat
        }, {
          label: this.tomorrowMorningText,
          time: moment().clone().add(1, 'days').hours(this.morningHours).minutes(0).seconds(0),
          format: App.is24HourClock() ? this.hoursFormat24 : this.hoursFormat
        }, {
          label: this.tomorrowAfternoonText,
          time: moment().clone().add(1, 'days').hours(this.eveningHours).minutes(0).seconds(0),
          format: App.is24HourClock() ? this.hoursFormat24 : this.hoursFormat
        }, {
          label: this.nextWeekText,
          time: moment().clone().startOf('week').add(7, 'days').hours(this.morningHours).minutes(0).seconds(0),
          format: App.is24HourClock() ? this.dayHoursFormat24 : this.dayHoursFormat
        }, {
          label: this.nextMonthText,
          time: moment().clone().startOf('month').add(1, 'month').hours(this.morningHours).minutes(0).seconds(0),
          format: App.is24HourClock() ? this.dayHoursFormat24 : this.dayHoursFormat
        }]
      }];
    },
    init: function init() {
      this.inherited(init, arguments);
    },
    getContent: function getContent() {
      return this._selectedTime;
    },
    makeItem: function makeItem(_ref) {
      var label = _ref.label,
          time = _ref.time,
          format = _ref.format;

      var item = $(this.listItemTemplate.apply({ textLeft: label, textRight: time.format(format) }));
      item[0].time = time;
      $(this.listNode).append(item);
    },
    makeListItems: function makeListItems(_ref2) {
      var title = _ref2.title,
          children = _ref2.children;

      var startIndex = 0;
      if (title === this.titleText) {
        var currentTime = moment();
        if (currentTime.hours() <= this.showThisEveningUntil) {
          this.makeItem(children[startIndex]);
        }
        startIndex++;
      }
      for (var i = startIndex; i < children.length; i++) {
        this.makeItem(children[i]);
      }
      return this;
    },
    processLayout: function processLayout() {
      for (var i = 0; i < this.layout.length; i++) {
        this.makeListItems(this.layout[i]);
      }
    },
    select: function select(evt) {
      this._selectedTime = evt.$source.time;
      if (this.isModal) {
        this._modalNode.resolveDeferred();
        this._selectedTime = null;
      }
    },
    show: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.options = options;
      this.showTimePicker = options.showTimePicker;
      this.layout = this.layout || this._createCustomizedLayout(this.createLayout());
      if (!this.listNode.children.length) {
        this.processLayout();
      }
      return;
    },
    toDateTimePicker: function toDateTimePicker() {
      App.modal.hide();
      var dateTimePicker = new _DateTimePicker2.default({ isModal: true });
      var toolbar = [{
        action: 'cancel',
        className: 'button--flat button--flat--split',
        text: resource.cancelText
      }, {
        action: 'resolve',
        className: 'button--flat button--flat--split',
        text: resource.confirmText
      }];
      App.modal.add(dateTimePicker, toolbar, this.options).then(this._deferred.resolve);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWxhdGl2ZURhdGVUaW1lUGlja2VyLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiZHRGb3JtYXRSZXNvdXJjZSIsIl9fY2xhc3MiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibGlzdEl0ZW1UZW1wbGF0ZSIsIl9kZWZlcnJlZCIsIl9zZWxlY3RlZFRpbWUiLCJfd2lkZ2V0TmFtZSIsIl9kYXRlVGltZU1vZGFsIiwiY3VzdG9taXphdGlvblNldCIsImxheW91dCIsIm1vcm5pbmdIb3VycyIsImV2ZW5pbmdIb3VycyIsInNob3dUaGlzRXZlbmluZ1VudGlsIiwiaXNNb2RhbCIsInNob3dUaW1lUGlja2VyIiwidGl0bGVUZXh0IiwicGlja0RhdGVUaW1lVGV4dCIsInRoaXNFdmVuaW5nVGV4dCIsInRvbW9ycm93TW9ybmluZ1RleHQiLCJ0b21vcnJvd0FmdGVybm9vblRleHQiLCJuZXh0V2Vla1RleHQiLCJuZXh0TW9udGhUZXh0IiwiaG91cnNGb3JtYXQiLCJkYXlIb3Vyc0Zvcm1hdCIsImhvdXJzRm9ybWF0MjQiLCJkYXlIb3Vyc0Zvcm1hdDI0IiwiY3JlYXRlTGF5b3V0IiwidGl0bGUiLCJjaGlsZHJlbiIsImxhYmVsIiwidGltZSIsIm1vbWVudCIsImNsb25lIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kcyIsImZvcm1hdCIsIkFwcCIsImlzMjRIb3VyQ2xvY2siLCJhZGQiLCJzdGFydE9mIiwiaW5pdCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImdldENvbnRlbnQiLCJtYWtlSXRlbSIsIml0ZW0iLCIkIiwiYXBwbHkiLCJ0ZXh0TGVmdCIsInRleHRSaWdodCIsImxpc3ROb2RlIiwiYXBwZW5kIiwibWFrZUxpc3RJdGVtcyIsInN0YXJ0SW5kZXgiLCJjdXJyZW50VGltZSIsImkiLCJsZW5ndGgiLCJwcm9jZXNzTGF5b3V0Iiwic2VsZWN0IiwiZXZ0IiwiJHNvdXJjZSIsIl9tb2RhbE5vZGUiLCJyZXNvbHZlRGVmZXJyZWQiLCJzaG93Iiwib3B0aW9ucyIsIl9jcmVhdGVDdXN0b21pemVkTGF5b3V0IiwidG9EYXRlVGltZVBpY2tlciIsIm1vZGFsIiwiaGlkZSIsImRhdGVUaW1lUGlja2VyIiwidG9vbGJhciIsImFjdGlvbiIsImNsYXNzTmFtZSIsInRleHQiLCJjYW5jZWxUZXh0IiwiY29uZmlybVRleHQiLCJ0aGVuIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxXQUFXLG9CQUFZLHdCQUFaLENBQWpCLEMsQ0F4QkE7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxNQUFNQyxtQkFBbUIsb0JBQVksc0NBQVosQ0FBekI7O0FBRUE7OztBQUdBLE1BQU1DLFVBQVUsdUJBQVEsOEJBQVIsRUFBd0MsZ0dBQXhDLEVBQXNHO0FBQ3BIQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLHNGQUQyQixFQUUzQix1RUFGMkIsRUFHM0IsZ0VBSDJCLEVBSTNCLFFBSjJCLENBQWIsQ0FEb0c7QUFPcEhDLHNCQUFrQixJQUFJRCxRQUFKLENBQWEsQ0FDN0IsOEVBRDZCLEVBRTdCLG9FQUY2QixFQUc3QixzRUFINkIsRUFJN0IsT0FKNkIsQ0FBYixDQVBrRzs7QUFjcEhFLGVBQVcsSUFkeUc7QUFlcEhDLG1CQUFlLElBZnFHO0FBZ0JwSEMsaUJBQWEsd0JBaEJ1RztBQWlCcEhDLG9CQUFnQixJQWpCb0c7QUFrQnBIQyxzQkFBa0Isd0JBbEJrRztBQW1CcEhDLFlBQVEsSUFuQjRHO0FBb0JwSEMsa0JBQWMsQ0FwQnNHO0FBcUJwSEMsa0JBQWMsRUFyQnNHO0FBc0JwSEMsMEJBQXNCLEVBdEI4RjtBQXVCcEhDLGFBQVMsS0F2QjJHO0FBd0JwSEMsb0JBQWdCLElBeEJvRztBQXlCcEhDLGVBQVdqQixTQUFTaUIsU0F6QmdHO0FBMEJwSEMsc0JBQWtCbEIsU0FBU2tCLGdCQTFCeUY7QUEyQnBIQyxxQkFBaUJuQixTQUFTbUIsZUEzQjBGO0FBNEJwSEMseUJBQXFCcEIsU0FBU29CLG1CQTVC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ZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4vX1RlbXBsYXRlZCc7XHJcbmltcG9ydCBfQWN0aW9uTWl4aW4gZnJvbSAnLi9fQWN0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX0N1c3RvbWl6YXRpb25NaXhpbiBmcm9tICcuL19DdXN0b21pemF0aW9uTWl4aW4nO1xyXG5pbXBvcnQgRGF0ZVRpbWVQaWNrZXIgZnJvbSAnLi9EYXRlVGltZVBpY2tlcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3JlbGF0aXZlRGF0ZVRpbWVQaWNrZXInKTtcclxuY29uc3QgZHRGb3JtYXRSZXNvdXJjZSA9IGdldFJlc291cmNlKCdyZWxhdGl2ZURhdGVUaW1lUGlja2VyRGF0ZVRpbWVGb3JtYXQnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRGF0ZVRpbWVQaWNrZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5SZWxhdGl2ZURhdGVUaW1lUGlja2VyJywgW19XaWRnZXRCYXNlLCBfVGVtcGxhdGVkLCBfQWN0aW9uTWl4aW4sIF9DdXN0b21pemF0aW9uTWl4aW5dLCB7XHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInJlbGF0aXZlLWRhdGV0aW1lLXNlbGVjdFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJyZWxhdGl2ZURhdGVUaW1lTm9kZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cInJlbGF0aXZlLWRhdGV0aW1lLXNlbGVjdF9fdGl0bGVcIj57JTogJC50aXRsZVRleHQgJX08L2Rpdj4nLFxyXG4gICAgJzx1bCBjbGFzcz1cInNpbXBsZUxpc3RcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibGlzdE5vZGVcIj48L3VsPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBsaXN0SXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cInNpbXBsZUxpc3RfX2l0ZW1cIiBkYXRhLXRpbWU9XCJ7JTogJC50aW1lICV9XCIgZGF0YS1hY3Rpb249XCJzZWxlY3RcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJpdGVtX190ZXh0LS1sZWZ0XCI+PHNwYW4+eyU6ICQudGV4dExlZnQgJX08L3NwYW4+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiaXRlbV9fdGV4dC0tcmlnaHRcIj48c3Bhbj57JTogJC50ZXh0UmlnaHQgJX08L3NwYW4+PC9kaXY+JyxcclxuICAgICc8L2xpPicsXHJcbiAgXSksXHJcblxyXG4gIF9kZWZlcnJlZDogbnVsbCxcclxuICBfc2VsZWN0ZWRUaW1lOiBudWxsLFxyXG4gIF93aWRnZXROYW1lOiAncmVsYXRpdmVEYXRlVGltZVBpY2tlcicsXHJcbiAgX2RhdGVUaW1lTW9kYWw6IG51bGwsXHJcbiAgY3VzdG9taXphdGlvblNldDogJ3JlbGF0aXZlRGF0ZVRpbWVQaWNrZXInLFxyXG4gIGxheW91dDogbnVsbCxcclxuICBtb3JuaW5nSG91cnM6IDgsXHJcbiAgZXZlbmluZ0hvdXJzOiAxNyxcclxuICBzaG93VGhpc0V2ZW5pbmdVbnRpbDogMTIsXHJcbiAgaXNNb2RhbDogZmFsc2UsXHJcbiAgc2hvd1RpbWVQaWNrZXI6IHRydWUsXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgcGlja0RhdGVUaW1lVGV4dDogcmVzb3VyY2UucGlja0RhdGVUaW1lVGV4dCxcclxuICB0aGlzRXZlbmluZ1RleHQ6IHJlc291cmNlLnRoaXNFdmVuaW5nVGV4dCxcclxuICB0b21vcnJvd01vcm5pbmdUZXh0OiByZXNvdXJjZS50b21vcnJvd01vcm5pbmdUZXh0LFxyXG4gIHRvbW9ycm93QWZ0ZXJub29uVGV4dDogcmVzb3VyY2UudG9tb3Jyb3dBZnRlcm5vb25UZXh0LFxyXG4gIG5leHRXZWVrVGV4dDogcmVzb3VyY2UubmV4dFdlZWtUZXh0LFxyXG4gIG5leHRNb250aFRleHQ6IHJlc291cmNlLm5leHRNb250aFRleHQsXHJcbiAgaG91cnNGb3JtYXQ6IGR0Rm9ybWF0UmVzb3VyY2UuaG91cnNGb3JtYXQsXHJcbiAgZGF5SG91cnNGb3JtYXQ6IGR0Rm9ybWF0UmVzb3VyY2UuZGF5SG91cnNGb3JtYXQsXHJcbiAgaG91cnNGb3JtYXQyNDogZHRGb3JtYXRSZXNvdXJjZS5ob3Vyc0Zvcm1hdDI0LFxyXG4gIGRheUhvdXJzRm9ybWF0MjQ6IGR0Rm9ybWF0UmVzb3VyY2UuZGF5SG91cnNGb3JtYXQyNCxcclxuXHJcblxyXG4gIGNyZWF0ZUxheW91dDogZnVuY3Rpb24gY3JlYXRlTGF5b3V0KCkge1xyXG4gICAgcmV0dXJuIFt7XHJcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlVGV4dCxcclxuICAgICAgY2hpbGRyZW46IFt7XHJcbiAgICAgICAgbGFiZWw6IHRoaXMudGhpc0V2ZW5pbmdUZXh0LFxyXG4gICAgICAgIHRpbWU6IG1vbWVudCgpXHJcbiAgICAgICAgICAuY2xvbmUoKVxyXG4gICAgICAgICAgLmhvdXJzKHRoaXMuZXZlbmluZ0hvdXJzKVxyXG4gICAgICAgICAgLm1pbnV0ZXMoMClcclxuICAgICAgICAgIC5zZWNvbmRzKDApLFxyXG4gICAgICAgIGZvcm1hdDogKEFwcC5pczI0SG91ckNsb2NrKCkpID8gdGhpcy5ob3Vyc0Zvcm1hdDI0IDogdGhpcy5ob3Vyc0Zvcm1hdCxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiB0aGlzLnRvbW9ycm93TW9ybmluZ1RleHQsXHJcbiAgICAgICAgdGltZTogbW9tZW50KClcclxuICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAuYWRkKDEsICdkYXlzJylcclxuICAgICAgICAgIC5ob3Vycyh0aGlzLm1vcm5pbmdIb3VycylcclxuICAgICAgICAgIC5taW51dGVzKDApXHJcbiAgICAgICAgICAuc2Vjb25kcygwKSxcclxuICAgICAgICBmb3JtYXQ6IChBcHAuaXMyNEhvdXJDbG9jaygpKSA/IHRoaXMuaG91cnNGb3JtYXQyNCA6IHRoaXMuaG91cnNGb3JtYXQsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogdGhpcy50b21vcnJvd0FmdGVybm9vblRleHQsXHJcbiAgICAgICAgdGltZTogbW9tZW50KClcclxuICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAuYWRkKDEsICdkYXlzJylcclxuICAgICAgICAgIC5ob3Vycyh0aGlzLmV2ZW5pbmdIb3VycylcclxuICAgICAgICAgIC5taW51dGVzKDApXHJcbiAgICAgICAgICAuc2Vjb25kcygwKSxcclxuICAgICAgICBmb3JtYXQ6IChBcHAuaXMyNEhvdXJDbG9jaygpKSA/IHRoaXMuaG91cnNGb3JtYXQyNCA6IHRoaXMuaG91cnNGb3JtYXQsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogdGhpcy5uZXh0V2Vla1RleHQsXHJcbiAgICAgICAgdGltZTogbW9tZW50KClcclxuICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAuc3RhcnRPZignd2VlaycpXHJcbiAgICAgICAgICAuYWRkKDcsICdkYXlzJylcclxuICAgICAgICAgIC5ob3Vycyh0aGlzLm1vcm5pbmdIb3VycylcclxuICAgICAgICAgIC5taW51dGVzKDApXHJcbiAgICAgICAgICAuc2Vjb25kcygwKSxcclxuICAgICAgICBmb3JtYXQ6IChBcHAuaXMyNEhvdXJDbG9jaygpKSA/IHRoaXMuZGF5SG91cnNGb3JtYXQyNCA6IHRoaXMuZGF5SG91cnNGb3JtYXQsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBsYWJlbDogdGhpcy5uZXh0TW9udGhUZXh0LFxyXG4gICAgICAgIHRpbWU6IG1vbWVudCgpXHJcbiAgICAgICAgICAuY2xvbmUoKVxyXG4gICAgICAgICAgLnN0YXJ0T2YoJ21vbnRoJylcclxuICAgICAgICAgIC5hZGQoMSwgJ21vbnRoJylcclxuICAgICAgICAgIC5ob3Vycyh0aGlzLm1vcm5pbmdIb3VycylcclxuICAgICAgICAgIC5taW51dGVzKDApXHJcbiAgICAgICAgICAuc2Vjb25kcygwKSxcclxuICAgICAgICBmb3JtYXQ6IChBcHAuaXMyNEhvdXJDbG9jaygpKSA/IHRoaXMuZGF5SG91cnNGb3JtYXQyNCA6IHRoaXMuZGF5SG91cnNGb3JtYXQsXHJcbiAgICAgIH1dLFxyXG4gICAgfV07XHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoaW5pdCwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGdldENvbnRlbnQ6IGZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRUaW1lO1xyXG4gIH0sXHJcbiAgbWFrZUl0ZW06IGZ1bmN0aW9uIG1ha2VJdGVtKHsgbGFiZWwsIHRpbWUsIGZvcm1hdCB9KSB7XHJcbiAgICBjb25zdCBpdGVtID0gJCh0aGlzLmxpc3RJdGVtVGVtcGxhdGUuYXBwbHkoeyB0ZXh0TGVmdDogbGFiZWwsIHRleHRSaWdodDogdGltZS5mb3JtYXQoZm9ybWF0KSB9KSk7XHJcbiAgICBpdGVtWzBdLnRpbWUgPSB0aW1lO1xyXG4gICAgJCh0aGlzLmxpc3ROb2RlKS5hcHBlbmQoaXRlbSk7XHJcbiAgfSxcclxuICBtYWtlTGlzdEl0ZW1zOiBmdW5jdGlvbiBtYWtlTGlzdEl0ZW1zKHsgdGl0bGUsIGNoaWxkcmVuIH0pIHtcclxuICAgIGxldCBzdGFydEluZGV4ID0gMDtcclxuICAgIGlmICh0aXRsZSA9PT0gdGhpcy50aXRsZVRleHQpIHtcclxuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBtb21lbnQoKTtcclxuICAgICAgaWYgKGN1cnJlbnRUaW1lLmhvdXJzKCkgPD0gdGhpcy5zaG93VGhpc0V2ZW5pbmdVbnRpbCkge1xyXG4gICAgICAgIHRoaXMubWFrZUl0ZW0oY2hpbGRyZW5bc3RhcnRJbmRleF0pO1xyXG4gICAgICB9XHJcbiAgICAgIHN0YXJ0SW5kZXgrKztcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5tYWtlSXRlbShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHByb2Nlc3NMYXlvdXQ6IGZ1bmN0aW9uIHByb2Nlc3NMYXlvdXQoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGF5b3V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMubWFrZUxpc3RJdGVtcyh0aGlzLmxheW91dFtpXSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBzZWxlY3Q6IGZ1bmN0aW9uIHNlbGVjdChldnQpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkVGltZSA9IGV2dC4kc291cmNlLnRpbWU7XHJcbiAgICBpZiAodGhpcy5pc01vZGFsKSB7XHJcbiAgICAgIHRoaXMuX21vZGFsTm9kZS5yZXNvbHZlRGVmZXJyZWQoKTtcclxuICAgICAgdGhpcy5fc2VsZWN0ZWRUaW1lID0gbnVsbDtcclxuICAgIH1cclxuICB9LFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3cob3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgdGhpcy5zaG93VGltZVBpY2tlciA9IG9wdGlvbnMuc2hvd1RpbWVQaWNrZXI7XHJcbiAgICB0aGlzLmxheW91dCA9IHRoaXMubGF5b3V0IHx8IHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVMYXlvdXQoKSk7XHJcbiAgICBpZiAoIXRoaXMubGlzdE5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc0xheW91dCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH0sXHJcbiAgdG9EYXRlVGltZVBpY2tlcjogZnVuY3Rpb24gdG9EYXRlVGltZVBpY2tlcigpIHtcclxuICAgIEFwcC5tb2RhbC5oaWRlKCk7XHJcbiAgICBjb25zdCBkYXRlVGltZVBpY2tlciA9IG5ldyBEYXRlVGltZVBpY2tlcih7IGlzTW9kYWw6IHRydWUgfSk7XHJcbiAgICBjb25zdCB0b29sYmFyID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgYWN0aW9uOiAnY2FuY2VsJyxcclxuICAgICAgICBjbGFzc05hbWU6ICdidXR0b24tLWZsYXQgYnV0dG9uLS1mbGF0LS1zcGxpdCcsXHJcbiAgICAgICAgdGV4dDogcmVzb3VyY2UuY2FuY2VsVGV4dCxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGFjdGlvbjogJ3Jlc29sdmUnLFxyXG4gICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICB0ZXh0OiByZXNvdXJjZS5jb25maXJtVGV4dCxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgICBBcHAubW9kYWwuYWRkKGRhdGVUaW1lUGlja2VyLCB0b29sYmFyLCB0aGlzLm9wdGlvbnMpLnRoZW4odGhpcy5fZGVmZXJyZWQucmVzb2x2ZSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=