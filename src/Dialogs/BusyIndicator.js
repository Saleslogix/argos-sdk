import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import Deferred from 'dojo/Deferred';
import _Widget from 'dijit/_Widget';
import $ from 'jquery';
import _Templated from '../_Templated';
import getResource from '../I18n';

const resource = getResource('busyIndicator');

/**
 * @class argos.Dialogs.BusyIndicator
 */
const __class = declare('argos.Dialogs.BusyIndicator', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="busyIndicator__container {%: $.containerClass %}" aria-live="polite" data-dojo-attach-point="busyIndicatorNode">',
    '{%! $.busyIndicatorTemplate %}',
    '{%! $.progressBarTemplate %}',
    '</div>',
  ]),
  busyIndicatorTemplate: new Simplate([
    '<div class="busy-{%: $.size %}" style="height: 100%; width: 100%;">',
    '<div class="busy-indicator-container" aria-live="polite" role="status">',
    '<div class="busy-indicator active">',
    '<div class="bar one"></div>',
    '<div class="bar two"></div>',
    '<div class="bar three"></div>',
    '<div class="bar four"></div>',
    '<div class="bar five"></div>',
    '</div>',
    '<span data-dojo-attach-point="labelNode">{%: $.label %}</span>',
    '</div>',
    '</div>',
  ]),
  progressBarTemplate: new Simplate([
    '<div class="busyIndicator__progress" data-dojo-attach-point="progressNode">',
    '</div>',
  ]),
  progressLabelTemplate: new Simplate([
    '<span class="busyIndicator__progress__label">{%: $.progressText %}</span>',
  ]),
  barTemplate: new Simplate([
    '<div class="busyIndicator__progress__bar"></div>',
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
  size: '', // sm, xs, blank for normal
  totalProgress: null,

  complete: function complete(result = {}) {
    $(this.busyIndicatorNode).removeClass('busyIndicator--active');
    this._busyDeferred.resolve(result);
  },
  show: function show() {},
  start: function start(options = {}) {
    this._busyDeferred = new Deferred();

    $(this.busyIndicatorNode).addClass('busyIndicator--active');

    if (!this.isAsync || (options.isAsync !== undefined && !options.isAsync)) {
      this._progressBar = domConstruct.toDom(this.barTemplate.apply(this));
      this.progressLabelNode = domConstruct.toDom(this.progressLabelTemplate.apply(this));
      domConstruct.place(this.progressLabelNode, this.progressNode);
      domConstruct.place(this._progressBar, this.progressNode);
      this.currentProgress = options.current || 0;
      this.totalProgress = options.total || options.count || 0;
    }

    return this._busyDeferred.promise;
  },
  updateProgress: function updateProgress() {
    this.currentProgress = this.currentProgress + 1;
    if (this._progressBar) {
      $(this._progressBar).css({
        width: `${100 * this.currentProgress / this.totalProgress}%`,
      });
    }
  },
});

export default __class;
