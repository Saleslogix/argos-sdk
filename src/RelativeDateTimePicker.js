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

/**
 * @class argos.DateTimePicker
 * @alternateClassName Date Time Select
 */
import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import _ActionMixin from './_ActionMixin';
import _CustomizationMixin from './_CustomizationMixin';
import DateTimePicker from './DateTimePicker';
import Modal from './Modal';

const resource = window.localeContext.getEntitySync('relativeDateTimePicker').attributes;

const __class = declare('argos.RelativeDateTimePicker', [_Widget, _Templated, _ActionMixin, _CustomizationMixin], {
  widgetTemplate: new Simplate([
    '<div class="relative-datetime-select" data-dojo-attach-point="relativeDateTimeNode">',
      '<div class="relative-datetime-select__title">{%: $.titleText %}</div>',
      '<ul class="simpleList" data-dojo-attach-point="listNode"></ul>',
    '</div>',
  ]),
  listItemTemplate: new Simplate([
    '<li class="simpleList__item" data-time="{%: $.time %}" data-action="select">',
      '<div class="item__text--left">{%: $.textLeft %}</div>',
      '<div class="item__text--right">{%: $.textRight %}</div>',
    '</li>',
  ]),

  _deferred: null,
  _selectedTime: null,
  _widgetName: 'relativeDateTimePicker',
  _dateTimeModal: null,
  customizationSet: 'relativeDateTimePicker',
  layout: null,
  morningHours: 8,
  eveningHours: 15,
  showThisEveningUntil: 12,
  isModal: false,
  titleText: resource.titleText,
  pickDateTimeText: resource.pickDateTimeText,
  thisEveningText: resource.thisEveningText,
  tomorrowMorningText: resource.tomorrowMorningText,
  tomorrowAfternoonText: resource.tomorrowAfternoonText,
  nextWeekText: resource.nextWeekText,
  nextMonthText: resource.nextMonthText,


  createLayout: function createLayout() {
    return [{
      title: this.titleText,
      children: [{
        label: this.thisEveningText,
        time: moment().clone().add(1, 'days').hours(this.morningHours).minutes(0).seconds(0),
        format: 'h:mm A',
      }, {
        label: this.tomorrowMorningText,
        time: moment().clone().add(1, 'days').hours(this.morningHours).minutes(0).seconds(0),
        format: 'h:mm A',
      }, {
        label: this.tomorrowAfternoonText,
        time: moment().clone().startOf('week').add(7, 'days').hours(this.morningHours).minutes(0),
        format: 'h:mm A',
      }, {
        label: this.nextWeekText,
        time: moment().clone().startOf('week').add(7, 'days').hours(this.morningHours).minutes(0),
        format: 'ddd h:mm A',
      }, {
        label: this.nextMonthText,
        time: moment().clone().startOf('month').add(1, 'month').hours(this.morningHours).minutes(0),
        format: 'ddd h:mm A',
      }],
    }];
  },
  init: function init() {
    this.inherited(arguments);
  },
  getContent: function getContent() {
    return this._selectedTime;
  },
  hideChildModals: function hideChildModals() {
    if (this._dateTimeModal) {
      this._dateTimeModal.hideModal();
    }
    return;
  },
  makeItem: function makeItem({label, time, format}) {
    const item = domConstruct.toDom(this.listItemTemplate.apply({ textLeft: label, textRight: time.format(format) }));
    item.time = time;
    domConstruct.place(item, this.listNode);
  },
  makeListItems: function makeListItems({title, children}) {
    let startIndex = 0;
    if (title === this.titleText) {
      const currentTime = moment();
      if (currentTime.hours() <= this.showThisEveningUntil) {
        this.makeItem(children[startIndex]);
        startIndex++;
      }
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
  show: function show() {
    this.layout = this.layout || this._createCustomizedLayout(this.createLayout());
    if (!this.listNode.children.length) {
      this.processLayout();
    }
    return;
  },
  toDateTimePicker: function toDateTimePicker() {
    this.hideModal();
    if (!this._dateTimeModal) {
      const dateTimePicker = new DateTimePicker({ isModal: true });
      this._dateTimeModal = new Modal({ id: 'date-time-modal ' + this.id });
      this._dateTimeModal.placeModal(this.domNode.offsetParent)
            .setContentObject(dateTimePicker);
    }
    this._dateTimeModal.showModal().then(this.resolveDeferred.bind(this));
  },
});

export default __class;
