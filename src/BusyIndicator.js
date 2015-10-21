import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import domClass from 'dojo/dom-class';
import Deferred from 'dojo/Deferred';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';

const resource = window.localeContext.getEntitySync('busyIndicator').attributes;

const __class = declare('argos/BusyIndicator', [ _Widget, _Templated ], {
  widgetTemplate: new Simplate([
    '<div class="busyIndicator__container" aria-live="polite" data-dojo-attach-point="busyIndicatorNode">',
    '</div>',
  ]),
  busyIndicatorTemplate: new Simplate([
      '<div class="busyIndicator">',
        '<div class="busyIndicator__bar busyIndicator__bar--one"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--two"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--three"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--four"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--five"></div>',
      '</div>',
      '<span class="busyIndicator__label">{%: $.label %}</span>',
  ]),

  _busyDeferred: null,
  _busyIndicator: null,
  id: 'busyIndicator-template',
  isAsync: true,
  label: resource.loadingText,

  complete: function complete() {
    domClass.remove(this._busyIndicator, 'busyIndicator--active');
  },
  show: function show() {},
  start: function start() {
    this._busyDeferred = new Deferred();
    this._busyDeferred.then(this.complete.bind(this));

    const indicator = domConstruct.toDom(this.busyIndicatorTemplate.apply(this));
    domConstruct.place(indicator, this.busyIndicatorNode);
    this._busyIndicator = this.busyIndicatorNode.children[0];
    domClass.add(this._busyIndicator, 'busyIndicator--active');

    return this._busyDeferred;
  },
});

export default __class;
