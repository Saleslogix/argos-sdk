define('argos/_PullToRefreshMixin', ['module', 'exports', 'dojo/_base/declare', './I18n'], function (module, exports, _declare, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  /**
   * @module argos/_PullToRefreshMixin
   */
  var resource = (0, _I18n2.default)('pullToRefreshMixin');

  /**
   * @class
   * @alias module:argos/_PullToRefreshMixin
   * @mixin
   */
  var __class = (0, _declare2.default)('argos._PullToRefreshMixin', null, /** @lends module:argos/_PullToRefreshMixin.prototype */{
    /**
     * @property {external:Simplate}
     * @memberof module:argos/_PullToRefreshMixin
     * @static
     */
    pullRefreshBannerTemplate: new Simplate(['<div class="pull-to-refresh">{%! $.pullRefreshTemplate %}</div>']),

    /**
     * @property {Simplate}
     * @memberof module:argos/_PullToRefreshMixin
     * @static
     */
    pullRefreshTemplate: new Simplate(['<button type="button" class="btn-icon hide-focus">\n          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-down-arrow"></use>\n          </svg>\n      </button>\n      <p>{%= $$._getText("pullRefreshText") %}</p>']),

    /**
     * @property {Simplate}
     * @memberof module:argos/_PullToRefreshMixin
     * @static
     */
    pullReleaseTemplate: new Simplate(['<button type="button" class="btn-icon hide-focus">\n          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-up-arrow"></use>\n          </svg>\n      </button>\n      <p>{%= $$._getText("pullReleaseText") %}</p>']),

    /**
     * @property {String}
     * Text to indicate a pull to refresh
     */
    pullRefreshText: resource.pullRefreshText,
    /**
     * @property {String}
     * Text to indicate the user should release to cause the refresh
     */
    pullReleaseText: resource.pullReleaseText,

    /**
     * @property {Boolean} enablePullToRefresh If true, will enable the user to drag down and refresh the list. Default is true.
     */
    enablePullToRefresh: true,

    /**
     * @property {DOMNode}
     */
    pullRefreshBanner: null,

    /**
     * @property {DOMNode}
     */
    scrollerNode: null,

    /**
     * @property {DOMNode}
     */
    dragNode: null,

    animateCls: 'animate',

    _initPosition: {
      top: -35
    },

    _getText: function _getText(prop) {
      return __class.prototype[prop];
    },
    /**
     * @param {DOMNode} scrollerNode The node that scrolls and should be pulled on to refresh.
     * @param {DOMNode} dragNode The node that the user will drag. Defaults to scrollerNode if not specified.
     */
    initPullToRefresh: function initPullToRefresh(scrollerNode, dragNode) {
      var _this = this;

      if (!this.enablePullToRefresh || !window.App.supportsTouch() || !scrollerNode || !Rx) {
        return;
      }

      if (dragNode) {
        this.dragNode = dragNode;
      } else {
        this.dragNode = dragNode = scrollerNode;
      }

      this.pullRefreshBanner = $(this.pullRefreshBannerTemplate.apply(this)).get(0);
      $(dragNode).before(this.pullRefreshBanner);

      // Pull down to refresh touch handles
      this.scrollerNode = scrollerNode;

      var style = {
        top: $(dragNode).position().top
      };

      var touchstart = Rx.Observable.fromEvent(dragNode, 'touchstart').filter(function (evt) {
        // The implementor of this mixin should determine what shouldStartPullToRefresh is.
        var shouldStart = _this.shouldStartPullToRefresh(_this.scrollerNode);
        var results = shouldStart && evt.touches[0];
        return results;
      }).map(function (e) {
        var evt = e.touches[0];
        $(_this.pullRefreshBanner).css({
          top: _this._initPosition.top + 'px'
        });
        $(_this.dragNode).removeClass(_this.animateCls);
        var bannerHeight = $(_this.pullRefreshBanner).height();

        // We filtered out if the drag should start, so we are mapping the initial state here.
        return {
          bannerHeight: bannerHeight,
          topCss: style.top,
          top: parseInt(style.top, 10),
          y: evt.clientY
        };
      });
      var touchmove = Rx.Observable.fromEvent(dragNode, 'touchmove');
      var touchcancel = Rx.Observable.fromEvent(dragNode, 'touchcancel');
      var touchend = Rx.Observable.fromEvent(dragNode, 'touchend');
      var done = touchcancel.merge(touchend);

      // Merge the touchstart and dragging observables
      var dragging = touchstart.flatMap(function (data) {
        var distance = void 0; // current dragged distance
        var maxDistance = void 0; // required distance to trigger a refresh
        return touchmove.map(function (evt) {
          var touches = evt.touches[0];
          var weight = 2; // slow the drag
          distance = (touches.clientY - data.y) / weight;
          maxDistance = data.bannerHeight + 20;
          return {
            evt: evt,
            distance: distance,
            maxDistance: maxDistance,
            top: data.top + distance
          };
        }).filter(function (d) {
          // Prevent the user from dragging the pane above our starting point
          return d.distance >= 0;
        }).takeUntil(done.do(function () {
          // The "done" observable is a combination of touch end and touch cancel.
          // We should restore the UI state and invoke callbacks here.
          $(_this.dragNode).css({
            top: data.topCss,
            'overflow-y': data.overflowCssY,
            'overflow-x': data.overflowCssX
          });
          $(_this.pullRefreshBanner).css({
            visibility: 'hidden',
            top: _this._initPosition.top + 'px'
          });
          $(_this.dragNode).addClass(_this.animateCls);

          // Check if we dragged over the threshold (maxDistance),
          // if so, fire the callbacks the views will implement.
          if (distance > maxDistance) {
            _this.onPullToRefreshComplete();
          } else {
            _this.onPullToRefreshCancel();
          }
        }));
      });

      // Listen to the "dragging" observable which is a combination of our touch
      // start and touch drag. Update the UI while dragging here.
      dragging.subscribe(function (data) {
        data.evt.preventDefault();
        $(_this.dragNode).css({
          top: data.top + 'px'
        });
        $(_this.pullRefreshBanner).css({
          visibility: 'visible',
          top: data.top + _this._initPosition.top + 'px'
        });
        if (data.distance > data.maxDistance) {
          _this.pullRefreshBanner.innerHTML = _this.pullReleaseTemplate.apply(_this);
        } else {
          _this.pullRefreshBanner.innerHTML = _this.pullRefreshTemplate.apply(_this);
        }
      });
    },
    /**
     * Derived class must implement this to determine when pull to refresh should start. This is called when onTouchStart is fired.
     * @param {DOMNode} scrollerNode
     * Reference to the scoller node
     * @returns {Boolean}
     */
    shouldStartPullToRefresh: function shouldStartPullToRefresh(scrollerNode) {
      var scrollTop = scrollerNode.scrollTop; // How far we are scrolled down, this should be 0 before we start dragging the pull refresh
      return scrollTop === 0;
    },
    /**
     * Fires when the pull to refresh is successful.
     */
    onPullToRefreshComplete: function onPullToRefreshComplete() {},
    /**
     * Fires when the pull to refresh is canceled.
     */
    onPullToRefreshCancel: function onPullToRefreshCancel() {}
  });

  exports.default = __class;
  module.exports = exports['default'];
});