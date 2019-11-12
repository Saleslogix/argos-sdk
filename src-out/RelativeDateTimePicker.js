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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWxhdGl2ZURhdGVUaW1lUGlja2VyLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiZHRGb3JtYXRSZXNvdXJjZSIsIl9fY2xhc3MiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibGlzdEl0ZW1UZW1wbGF0ZSIsIl9kZWZlcnJlZCIsIl9zZWxlY3RlZFRpbWUiLCJfd2lkZ2V0TmFtZSIsIl9kYXRlVGltZU1vZGFsIiwiY3VzdG9taXphdGlvblNldCIsImxheW91dCIsIm1vcm5pbmdIb3VycyIsImV2ZW5pbmdIb3VycyIsInNob3dUaGlzRXZlbmluZ1VudGlsIiwiaXNNb2RhbCIsInNob3dUaW1lUGlja2VyIiwidGl0bGVUZXh0IiwicGlja0RhdGVUaW1lVGV4dCIsInRoaXNFdmVuaW5nVGV4dCIsInRvbW9ycm93TW9ybmluZ1RleHQiLCJ0b21vcnJvd0FmdGVybm9vblRleHQiLCJuZXh0V2Vla1RleHQiLCJuZXh0TW9udGhUZXh0IiwiaG91cnNGb3JtYXQiLCJkYXlIb3Vyc0Zvcm1hdCIsImhvdXJzRm9ybWF0MjQiLCJkYXlIb3Vyc0Zvcm1hdDI0IiwiY3JlYXRlTGF5b3V0IiwidGl0bGUiLCJjaGlsZHJlbiIsImxhYmVsIiwidGltZSIsIm1vbWVudCIsImNsb25lIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kcyIsImZvcm1hdCIsIkFwcCIsImlzMjRIb3VyQ2xvY2siLCJhZGQiLCJzdGFydE9mIiwiaW5pdCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImdldENvbnRlbnQiLCJtYWtlSXRlbSIsIml0ZW0iLCIkIiwiYXBwbHkiLCJ0ZXh0TGVmdCIsInRleHRSaWdodCIsImxpc3ROb2RlIiwiYXBwZW5kIiwibWFrZUxpc3RJdGVtcyIsInN0YXJ0SW5kZXgiLCJjdXJyZW50VGltZSIsImkiLCJsZW5ndGgiLCJwcm9jZXNzTGF5b3V0Iiwic2VsZWN0IiwiZXZ0IiwiJHNvdXJjZSIsIl9tb2RhbE5vZGUiLCJyZXNvbHZlRGVmZXJyZWQiLCJzaG93Iiwib3B0aW9ucyIsIl9jcmVhdGVDdXN0b21pemVkTGF5b3V0IiwidG9EYXRlVGltZVBpY2tlciIsIm1vZGFsIiwiaGlkZSIsImRhdGVUaW1lUGlja2VyIiwidG9vbGJhciIsImFjdGlvbiIsImNsYXNzTmFtZSIsInRleHQiLCJjYW5jZWxUZXh0IiwiY29uZmlybVRleHQiLCJ0aGVuIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxXQUFXLG9CQUFZLHdCQUFaLENBQWpCLEMsQ0F4QkE7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxNQUFNQyxtQkFBbUIsb0JBQVksc0NBQVosQ0FBekI7O0FBRUE7OztBQUdBLE1BQU1DLFVBQVUsdUJBQVEsOEJBQVIsRUFBd0MsZ0dBQXhDLEVBQXNHO0FBQ3BIQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLHNGQUQyQixFQUUzQix1RUFGMkIsRUFHM0IsZ0VBSDJCLEVBSTNCLFFBSjJCLENBQWIsQ0FEb0c7QUFPcEhDLHNCQUFrQixJQUFJRCxRQUFKLENBQWEsQ0FDN0IsOEVBRDZCLEVBRTdCLG9FQUY2QixFQUc3QixzRUFINkIsRUFJN0IsT0FKNkIsQ0FBYixDQVBrRzs7QUFjcEhFLGVBQVcsSUFkeUc7QUFlcEhDLG1CQUFlLElBZnFHO0FBZ0JwSEMsaUJBQWEsd0JBaEJ1RztBQWlCcEhDLG9CQUFnQixJQWpCb0c7QUFrQnBIQyxzQkFBa0Isd0JBbEJrRztBQW1CcEhDLFlBQVEsSUFuQjRHO0FBb0JwSEMsa0JBQWMsQ0FwQnNHO0FBcUJwSEMsa0JBQWMsRUFyQnNHO0FBc0JwSEMsMEJBQXNCLEVBdEI4RjtBQXVCcEhDLGFBQVMsS0F2QjJHO0FBd0JwSEMsb0JBQWdCLElBeEJvRztBQXlCcEhDLGVBQVdqQixTQUFTaUIsU0F6QmdHO0FBMEJwSEMsc0JBQWtCbEIsU0FBU2tCLGdCQTFCeUY7QUEyQnBIQyxxQkFBaUJuQixTQUFTbUIsZUEzQjBGO0FBNEJwSEMseUJBQXFCcEIsU0FBU29CLG1CQTVC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InNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IF9XaWRnZXRCYXNlIGZyb20gJ2Rpaml0L19XaWRnZXRCYXNlJztcclxuaW1wb3J0IF9UZW1wbGF0ZWQgZnJvbSAnLi9fVGVtcGxhdGVkJztcclxuaW1wb3J0IF9BY3Rpb25NaXhpbiBmcm9tICcuL19BY3Rpb25NaXhpbic7XHJcbmltcG9ydCBfQ3VzdG9taXphdGlvbk1peGluIGZyb20gJy4vX0N1c3RvbWl6YXRpb25NaXhpbic7XHJcbmltcG9ydCBEYXRlVGltZVBpY2tlciBmcm9tICcuL0RhdGVUaW1lUGlja2VyJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgncmVsYXRpdmVEYXRlVGltZVBpY2tlcicpO1xyXG5jb25zdCBkdEZvcm1hdFJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3JlbGF0aXZlRGF0ZVRpbWVQaWNrZXJEYXRlVGltZUZvcm1hdCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5EYXRlVGltZVBpY2tlclxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlJlbGF0aXZlRGF0ZVRpbWVQaWNrZXInLCBbX1dpZGdldEJhc2UsIF9UZW1wbGF0ZWQsIF9BY3Rpb25NaXhpbiwgX0N1c3RvbWl6YXRpb25NaXhpbl0sIHtcclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicmVsYXRpdmUtZGF0ZXRpbWUtc2VsZWN0XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInJlbGF0aXZlRGF0ZVRpbWVOb2RlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwicmVsYXRpdmUtZGF0ZXRpbWUtc2VsZWN0X190aXRsZVwiPnslOiAkLnRpdGxlVGV4dCAlfTwvZGl2PicsXHJcbiAgICAnPHVsIGNsYXNzPVwic2ltcGxlTGlzdFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJsaXN0Tm9kZVwiPjwvdWw+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGxpc3RJdGVtVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwic2ltcGxlTGlzdF9faXRlbVwiIGRhdGEtdGltZT1cInslOiAkLnRpbWUgJX1cIiBkYXRhLWFjdGlvbj1cInNlbGVjdFwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cIml0ZW1fX3RleHQtLWxlZnRcIj48c3Bhbj57JTogJC50ZXh0TGVmdCAlfTwvc3Bhbj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJpdGVtX190ZXh0LS1yaWdodFwiPjxzcGFuPnslOiAkLnRleHRSaWdodCAlfTwvc3Bhbj48L2Rpdj4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuXHJcbiAgX2RlZmVycmVkOiBudWxsLFxyXG4gIF9zZWxlY3RlZFRpbWU6IG51bGwsXHJcbiAgX3dpZGdldE5hbWU6ICdyZWxhdGl2ZURhdGVUaW1lUGlja2VyJyxcclxuICBfZGF0ZVRpbWVNb2RhbDogbnVsbCxcclxuICBjdXN0b21pemF0aW9uU2V0OiAncmVsYXRpdmVEYXRlVGltZVBpY2tlcicsXHJcbiAgbGF5b3V0OiBudWxsLFxyXG4gIG1vcm5pbmdIb3VyczogOCxcclxuICBldmVuaW5nSG91cnM6IDE3LFxyXG4gIHNob3dUaGlzRXZlbmluZ1VudGlsOiAxMixcclxuICBpc01vZGFsOiBmYWxzZSxcclxuICBzaG93VGltZVBpY2tlcjogdHJ1ZSxcclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICBwaWNrRGF0ZVRpbWVUZXh0OiByZXNvdXJjZS5waWNrRGF0ZVRpbWVUZXh0LFxyXG4gIHRoaXNFdmVuaW5nVGV4dDogcmVzb3VyY2UudGhpc0V2ZW5pbmdUZXh0LFxyXG4gIHRvbW9ycm93TW9ybmluZ1RleHQ6IHJlc291cmNlLnRvbW9ycm93TW9ybmluZ1RleHQsXHJcbiAgdG9tb3Jyb3dBZnRlcm5vb25UZXh0OiByZXNvdXJjZS50b21vcnJvd0FmdGVybm9vblRleHQsXHJcbiAgbmV4dFdlZWtUZXh0OiByZXNvdXJjZS5uZXh0V2Vla1RleHQsXHJcbiAgbmV4dE1vbnRoVGV4dDogcmVzb3VyY2UubmV4dE1vbnRoVGV4dCxcclxuICBob3Vyc0Zvcm1hdDogZHRGb3JtYXRSZXNvdXJjZS5ob3Vyc0Zvcm1hdCxcclxuICBkYXlIb3Vyc0Zvcm1hdDogZHRGb3JtYXRSZXNvdXJjZS5kYXlIb3Vyc0Zvcm1hdCxcclxuICBob3Vyc0Zvcm1hdDI0OiBkdEZvcm1hdFJlc291cmNlLmhvdXJzRm9ybWF0MjQsXHJcbiAgZGF5SG91cnNGb3JtYXQyNDogZHRGb3JtYXRSZXNvdXJjZS5kYXlIb3Vyc0Zvcm1hdDI0LFxyXG5cclxuXHJcbiAgY3JlYXRlTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVMYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gW3tcclxuICAgICAgdGl0bGU6IHRoaXMudGl0bGVUZXh0LFxyXG4gICAgICBjaGlsZHJlbjogW3tcclxuICAgICAgICBsYWJlbDogdGhpcy50aGlzRXZlbmluZ1RleHQsXHJcbiAgICAgICAgdGltZTogbW9tZW50KClcclxuICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAuaG91cnModGhpcy5ldmVuaW5nSG91cnMpXHJcbiAgICAgICAgICAubWludXRlcygwKVxyXG4gICAgICAgICAgLnNlY29uZHMoMCksXHJcbiAgICAgICAgZm9ybWF0OiAoQXBwLmlzMjRIb3VyQ2xvY2soKSkgPyB0aGlzLmhvdXJzRm9ybWF0MjQgOiB0aGlzLmhvdXJzRm9ybWF0LFxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgbGFiZWw6IHRoaXMudG9tb3Jyb3dNb3JuaW5nVGV4dCxcclxuICAgICAgICB0aW1lOiBtb21lbnQoKVxyXG4gICAgICAgICAgLmNsb25lKClcclxuICAgICAgICAgIC5hZGQoMSwgJ2RheXMnKVxyXG4gICAgICAgICAgLmhvdXJzKHRoaXMubW9ybmluZ0hvdXJzKVxyXG4gICAgICAgICAgLm1pbnV0ZXMoMClcclxuICAgICAgICAgIC5zZWNvbmRzKDApLFxyXG4gICAgICAgIGZvcm1hdDogKEFwcC5pczI0SG91ckNsb2NrKCkpID8gdGhpcy5ob3Vyc0Zvcm1hdDI0IDogdGhpcy5ob3Vyc0Zvcm1hdCxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiB0aGlzLnRvbW9ycm93QWZ0ZXJub29uVGV4dCxcclxuICAgICAgICB0aW1lOiBtb21lbnQoKVxyXG4gICAgICAgICAgLmNsb25lKClcclxuICAgICAgICAgIC5hZGQoMSwgJ2RheXMnKVxyXG4gICAgICAgICAgLmhvdXJzKHRoaXMuZXZlbmluZ0hvdXJzKVxyXG4gICAgICAgICAgLm1pbnV0ZXMoMClcclxuICAgICAgICAgIC5zZWNvbmRzKDApLFxyXG4gICAgICAgIGZvcm1hdDogKEFwcC5pczI0SG91ckNsb2NrKCkpID8gdGhpcy5ob3Vyc0Zvcm1hdDI0IDogdGhpcy5ob3Vyc0Zvcm1hdCxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiB0aGlzLm5leHRXZWVrVGV4dCxcclxuICAgICAgICB0aW1lOiBtb21lbnQoKVxyXG4gICAgICAgICAgLmNsb25lKClcclxuICAgICAgICAgIC5zdGFydE9mKCd3ZWVrJylcclxuICAgICAgICAgIC5hZGQoNywgJ2RheXMnKVxyXG4gICAgICAgICAgLmhvdXJzKHRoaXMubW9ybmluZ0hvdXJzKVxyXG4gICAgICAgICAgLm1pbnV0ZXMoMClcclxuICAgICAgICAgIC5zZWNvbmRzKDApLFxyXG4gICAgICAgIGZvcm1hdDogKEFwcC5pczI0SG91ckNsb2NrKCkpID8gdGhpcy5kYXlIb3Vyc0Zvcm1hdDI0IDogdGhpcy5kYXlIb3Vyc0Zvcm1hdCxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGxhYmVsOiB0aGlzLm5leHRNb250aFRleHQsXHJcbiAgICAgICAgdGltZTogbW9tZW50KClcclxuICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAuc3RhcnRPZignbW9udGgnKVxyXG4gICAgICAgICAgLmFkZCgxLCAnbW9udGgnKVxyXG4gICAgICAgICAgLmhvdXJzKHRoaXMubW9ybmluZ0hvdXJzKVxyXG4gICAgICAgICAgLm1pbnV0ZXMoMClcclxuICAgICAgICAgIC5zZWNvbmRzKDApLFxyXG4gICAgICAgIGZvcm1hdDogKEFwcC5pczI0SG91ckNsb2NrKCkpID8gdGhpcy5kYXlIb3Vyc0Zvcm1hdDI0IDogdGhpcy5kYXlIb3Vyc0Zvcm1hdCxcclxuICAgICAgfV0sXHJcbiAgICB9XTtcclxuICB9LFxyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgZ2V0Q29udGVudDogZnVuY3Rpb24gZ2V0Q29udGVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZFRpbWU7XHJcbiAgfSxcclxuICBtYWtlSXRlbTogZnVuY3Rpb24gbWFrZUl0ZW0oeyBsYWJlbCwgdGltZSwgZm9ybWF0IH0pIHtcclxuICAgIGNvbnN0IGl0ZW0gPSAkKHRoaXMubGlzdEl0ZW1UZW1wbGF0ZS5hcHBseSh7IHRleHRMZWZ0OiBsYWJlbCwgdGV4dFJpZ2h0OiB0aW1lLmZvcm1hdChmb3JtYXQpIH0pKTtcclxuICAgIGl0ZW1bMF0udGltZSA9IHRpbWU7XHJcbiAgICAkKHRoaXMubGlzdE5vZGUpLmFwcGVuZChpdGVtKTtcclxuICB9LFxyXG4gIG1ha2VMaXN0SXRlbXM6IGZ1bmN0aW9uIG1ha2VMaXN0SXRlbXMoeyB0aXRsZSwgY2hpbGRyZW4gfSkge1xyXG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xyXG4gICAgaWYgKHRpdGxlID09PSB0aGlzLnRpdGxlVGV4dCkge1xyXG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IG1vbWVudCgpO1xyXG4gICAgICBpZiAoY3VycmVudFRpbWUuaG91cnMoKSA8PSB0aGlzLnNob3dUaGlzRXZlbmluZ1VudGlsKSB7XHJcbiAgICAgICAgdGhpcy5tYWtlSXRlbShjaGlsZHJlbltzdGFydEluZGV4XSk7XHJcbiAgICAgIH1cclxuICAgICAgc3RhcnRJbmRleCsrO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLm1ha2VJdGVtKGNoaWxkcmVuW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgcHJvY2Vzc0xheW91dDogZnVuY3Rpb24gcHJvY2Vzc0xheW91dCgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sYXlvdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5tYWtlTGlzdEl0ZW1zKHRoaXMubGF5b3V0W2ldKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KGV2dCkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWRUaW1lID0gZXZ0LiRzb3VyY2UudGltZTtcclxuICAgIGlmICh0aGlzLmlzTW9kYWwpIHtcclxuICAgICAgdGhpcy5fbW9kYWxOb2RlLnJlc29sdmVEZWZlcnJlZCgpO1xyXG4gICAgICB0aGlzLl9zZWxlY3RlZFRpbWUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB0aGlzLnNob3dUaW1lUGlja2VyID0gb3B0aW9ucy5zaG93VGltZVBpY2tlcjtcclxuICAgIHRoaXMubGF5b3V0ID0gdGhpcy5sYXlvdXQgfHwgdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUxheW91dCgpKTtcclxuICAgIGlmICghdGhpcy5saXN0Tm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5wcm9jZXNzTGF5b3V0KCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm47XHJcbiAgfSxcclxuICB0b0RhdGVUaW1lUGlja2VyOiBmdW5jdGlvbiB0b0RhdGVUaW1lUGlja2VyKCkge1xyXG4gICAgQXBwLm1vZGFsLmhpZGUoKTtcclxuICAgIGNvbnN0IGRhdGVUaW1lUGlja2VyID0gbmV3IERhdGVUaW1lUGlja2VyKHsgaXNNb2RhbDogdHJ1ZSB9KTtcclxuICAgIGNvbnN0IHRvb2xiYXIgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBhY3Rpb246ICdjYW5jZWwnLFxyXG4gICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICB0ZXh0OiByZXNvdXJjZS5jYW5jZWxUZXh0LFxyXG4gICAgICB9LCB7XHJcbiAgICAgICAgYWN0aW9uOiAncmVzb2x2ZScsXHJcbiAgICAgICAgY2xhc3NOYW1lOiAnYnV0dG9uLS1mbGF0IGJ1dHRvbi0tZmxhdC0tc3BsaXQnLFxyXG4gICAgICAgIHRleHQ6IHJlc291cmNlLmNvbmZpcm1UZXh0LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICAgIEFwcC5tb2RhbC5hZGQoZGF0ZVRpbWVQaWNrZXIsIHRvb2xiYXIsIHRoaXMub3B0aW9ucykudGhlbih0aGlzLl9kZWZlcnJlZC5yZXNvbHZlKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==