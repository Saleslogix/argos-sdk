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

  const resource = (0, _I18n2.default)('relativeDateTimePicker'); /* Copyright 2017 Infor
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

  /**
   * @module argos/RelativeDateTimePicker
   */

  const dtFormatResource = (0, _I18n2.default)('relativeDateTimePickerDateTimeFormat');

  /**
   * @class
   * @alias module:argos/RelativeDateTimePicker
   * @extends module:argos/_Templated
   * @mixes module:argos/_CustomizationMixin
   */
  const __class = (0, _declare2.default)('argos.RelativeDateTimePicker', [_WidgetBase3.default, _Templated3.default, _CustomizationMixin3.default], /** @lends module:argos/RelativeDateTimePicker.prototype */{
    _ActionMixin: null,
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

    postCreate: function postCreate() {
      this._ActionMixin = new _ActionMixin3.default();
      this._ActionMixin.postCreate(this);
    },

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
    makeItem: function makeItem({ label, time, format }) {
      const item = $(this.listItemTemplate.apply({ textLeft: label, textRight: time.format(format) }));
      item[0].time = time;
      $(this.listNode).append(item);
    },
    makeListItems: function makeListItems({ title, children }) {
      let startIndex = 0;
      if (title === this.titleText) {
        const currentTime = moment();
        if (currentTime.hours() <= this.showThisEveningUntil) {
          this.makeItem(children[startIndex]);
        }
        startIndex++;
      }
      for (let i = startIndex; i < children.length; i++) {
        this.makeItem(children[i]);
      }
      return this;
    },
    processLayout: function processLayout() {
      for (let i = 0; i < this.layout.length; i++) {
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
    show: function show(options = {}) {
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
      const dateTimePicker = new _DateTimePicker2.default({ isModal: true });
      const toolbar = [{
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