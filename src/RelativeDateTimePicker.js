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
import DateTimePicker from './DateTimePicker';
import Modal from './Modal';

const resource = window.localeContext.getEntitySync('relativeDateTimePicker').attributes;

const __class = declare('argos.RelativeDateTimePicker', [_Widget, _Templated, _ActionMixin], {
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
  _modal: null,
  isModal: false,
  titleText: resource.titleText,
  pickDateTimeText: resource.pickDateTimeText,
  thisEveningText: resource.thisEveningText,
  tomorrowMorningText: resource.tomorrowMorningText,
  tomorrowAfternoonText: resource.tomorrowAfternoonText,
  nextWeekText: resource.nextWeekText,
  nextMonthText: resource.nextMonthText,


  init: function init() {
    this.inherited(arguments);
  },
  getContent: function getContent() {
    return this._selectedTime;
  },
  hideChildModals: function hideChildModals() {
    return;
  },
  makeItem: function makeItem(tLeft, time, displayAs) {
    const item = domConstruct.toDom(this.listItemTemplate.apply({ textLeft: tLeft, textRight: time.format(displayAs) }));
    item.time = time;
    domConstruct.place(item, this.listNode);
  },
  makeListItems: function makeListItems() {
    let tempTime = moment();
    if (tempTime.hours() <= 12) {
      tempTime = moment().clone().hours(15).minutes(0).seconds(0);
      this.makeItem(this.thisEveningText, tempTime, 'h:mm A');
    }
    tempTime = moment().clone().add(1, 'days').hours(8).minutes(0).seconds(0);
    this.makeItem(this.tomorrowMorningText, tempTime, 'h:mm A');
    tempTime = tempTime.clone().add(7, 'hours');
    this.makeItem(this.tomorrowAfternoonText, tempTime, 'h:mm A');
    tempTime = moment().clone().startOf('week').add(7, 'days').hours(8).minutes(0);
    this.makeItem(this.nextWeekText, tempTime, 'ddd h:mm A');
    tempTime = moment().clone().startOf('month').add(1, 'month').hours(8).minutes(0);
    this.makeItem(this.nextMonthText, tempTime, 'ddd h:mm A');
    return this;
  },
  select: function select(evt) {
    this._selectedTime = evt.$source.time;
    if (this.isModal) {
      this._modalNode.resolveDeferred();
      this._selectedTime = null;
    }
  },
  show: function show() {
    if (!this.listNode.children.length) {
      this.makeListItems();
    }
    return;
  },
  toDateTimePicker: function toDateTimePicker() {
    this.hideModal();
    if (!this.modal) {
      const dateTimePicker = new DateTimePicker({ isModal: true });
      this.modal = new Modal({ id: 'date-time-modal ' + this.id, disableParentScroll: false });
      this.modal.placeModal(this.domNode.offsetParent)
            .setContentObject(dateTimePicker);
    }
    this.modal.showModal().then(this.resolveDeferred.bind(this));
    // this.destroy();
  },
});

export default __class;
