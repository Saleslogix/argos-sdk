import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import domClass from 'dojo/dom-class';
import domStyle from 'dojo/dom-style';
import query from 'dojo/query';
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
  progressBarTemplate: new Simplate([
    '<div class="busyIndicator__progress">',
      '<span class="busyIndicator__progress__label">{%: $.value %}</span>',
      '<div class="busyIndicator__progress__bar"></div>',
    '</div>',
  ]),

  _busyDeferred: null,
  _busyIndicator: null,
  _progressBar: null,
  currentProgress: null,
  id: 'busyIndicator-template',
  isAsync: true,
  label: resource.loadingText,
  totalProgress: null,
  progressText: resource.progressText,

  complete: function complete(result = {}) {
    domClass.remove(this._busyIndicator, 'busyIndicator--active');
    this._busyDeferred.resolve(result);
  },
  show: function show() {},
  start: function start(options = {}) {
    this._busyDeferred = new Deferred();

    const indicator = domConstruct.toDom(this.busyIndicatorTemplate.apply(this));
    domConstruct.place(indicator, this.busyIndicatorNode);
    this._busyIndicator = this.busyIndicatorNode.children[0];
    domClass.add(this._busyIndicator, 'busyIndicator--active');

    if (!this.isAsync || (options.isAsync !== undefined && !options.isAsync)) {
      const progressBar = domConstruct.toDom(this.progressBarTemplate.apply({value: options.label || this.progressText}, this));
      domConstruct.place(progressBar, this.busyIndicatorNode);
      this._progressBar = query('.busyIndicator__progress__bar', progressBar)[0];
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
