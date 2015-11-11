import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import domClass from 'dojo/dom-class';
import domStyle from 'dojo/dom-style';
import query from 'dojo/query';
import Deferred from 'dojo/Deferred';
import _Widget from 'dijit/_Widget';
import _Templated from '../_Templated';

const resource = window.localeContext.getEntitySync('busyIndicator').attributes;

const __class = declare('argos.Dialogs.BusyIndicator', [ _Widget, _Templated ], {
  widgetTemplate: new Simplate([
    '<div class="busyIndicator__container {%: $.containerClass %}" aria-live="polite" data-dojo-attach-point="busyIndicatorNode">',
      '{%! $.busyIndicatorTemplate %}',
    '</div>',
  ]),
  busyIndicatorTemplate: new Simplate([
      '<div class="busyIndicator busyIndicator--{%: $.size %}">',
        '<div class="busyIndicator__bar busyIndicator__bar--{%: $.size %} busyIndicator__bar--one"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--{%: $.size %} busyIndicator__bar--two"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--{%: $.size %} busyIndicator__bar--three"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--{%: $.size %} busyIndicator__bar--four"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--{%: $.size %} busyIndicator__bar--five"></div>',
      '</div>',
      '<span class="busyIndicator__label" data-dojo-attach-point="labelNode">{%: $.label %}</span>',
  ]),
  progressBarTemplate: new Simplate([
    '<div class="busyIndicator__progress">',
      '<span class="busyIndicator__progress__label" data-dojo-attach-point="progressLabelNode">{%: $.progressText %}</span>',
      '<div class="busyIndicator__progress__bar" data-dojo-attach-point="_progressBar"></div>',
    '</div>',
  ]),

  _busyDeferred: null,
  _busyIndicator: null,
  _progressBar: null,
  containerClass: null,
  currentProgress: null,
  id: 'busyIndicator-template',
  isAsync: true,
  label: resource.loadingText,
  progressLabelNode: null,
  progressText: resource.progressText,
  size: 'large',
  totalProgress: null,

  complete: function complete(result = {}) {
    domClass.remove(this.busyIndicatorNode, 'busyIndicator--active');
    this._busyDeferred.resolve(result);
  },
  show: function show() {},
  start: function start(options = {}) {
    this._busyDeferred = new Deferred();

    domClass.add(this.busyIndicatorNode, 'busyIndicator--active');

    if (!this.isAsync || (options.isAsync !== undefined && !options.isAsync)) {
      const progressBar = domConstruct.toDom(this.progressBarTemplate.apply(this));
      domConstruct.place(progressBar, this.busyIndicatorNode);
      this._progressBar = query('.busyIndicator__progress__bar', progressBar)[0];
      this.progressLabelNode = query('.busyIndicator__progress__label', progressBar)[0];
      this.currentProgress = options.current || 0;
      this.totalProgress = options.total || options.count || 0;
    }

    return this._busyDeferred.promise;
  },
  updateProgress: function updateProgress() {
    this.currentProgress = this.currentProgress + 1;
    if (this._progressBar) {
      domStyle.set(this._progressBar, {
        width: `${100 * this.currentProgress / this.totalProgress}%`,
      });
    }
  },
});

export default __class;
