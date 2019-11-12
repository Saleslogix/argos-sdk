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

  var resource = (0, _I18n2.default)('pullToRefreshMixin');

  /**
   * @class argos._PullToRefreshMixin
   */
  var __class = (0, _declare2.default)('argos._PullToRefreshMixin', null, /** @lends argos._PullToRefreshMixin# */{
    /**
     * @property {Simplate}
     */
    pullRefreshBannerTemplate: new Simplate(['<div class="pull-to-refresh">{%! $.pullRefreshTemplate %}</div>']),

    /**
     * @property {Simplate}
     */
    pullRefreshTemplate: new Simplate(['<button type="button" class="btn-icon hide-focus">\n          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-down-arrow"></use>\n          </svg>\n      </button>\n      <p>{%= $$._getText("pullRefreshText") %}</p>']),

    /**
     * @property {Simplate}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUHVsbFRvUmVmcmVzaE1peGluLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsInB1bGxSZWZyZXNoQmFubmVyVGVtcGxhdGUiLCJTaW1wbGF0ZSIsInB1bGxSZWZyZXNoVGVtcGxhdGUiLCJwdWxsUmVsZWFzZVRlbXBsYXRlIiwicHVsbFJlZnJlc2hUZXh0IiwicHVsbFJlbGVhc2VUZXh0IiwiZW5hYmxlUHVsbFRvUmVmcmVzaCIsInB1bGxSZWZyZXNoQmFubmVyIiwic2Nyb2xsZXJOb2RlIiwiZHJhZ05vZGUiLCJhbmltYXRlQ2xzIiwiX2luaXRQb3NpdGlvbiIsInRvcCIsIl9nZXRUZXh0IiwicHJvcCIsInByb3RvdHlwZSIsImluaXRQdWxsVG9SZWZyZXNoIiwid2luZG93IiwiQXBwIiwic3VwcG9ydHNUb3VjaCIsIlJ4IiwiJCIsImFwcGx5IiwiZ2V0IiwiYmVmb3JlIiwic3R5bGUiLCJwb3NpdGlvbiIsInRvdWNoc3RhcnQiLCJPYnNlcnZhYmxlIiwiZnJvbUV2ZW50IiwiZmlsdGVyIiwiZXZ0Iiwic2hvdWxkU3RhcnQiLCJzaG91bGRTdGFydFB1bGxUb1JlZnJlc2giLCJyZXN1bHRzIiwidG91Y2hlcyIsIm1hcCIsImUiLCJjc3MiLCJyZW1vdmVDbGFzcyIsImJhbm5lckhlaWdodCIsImhlaWdodCIsInRvcENzcyIsInBhcnNlSW50IiwieSIsImNsaWVudFkiLCJ0b3VjaG1vdmUiLCJ0b3VjaGNhbmNlbCIsInRvdWNoZW5kIiwiZG9uZSIsIm1lcmdlIiwiZHJhZ2dpbmciLCJmbGF0TWFwIiwiZGF0YSIsImRpc3RhbmNlIiwibWF4RGlzdGFuY2UiLCJ3ZWlnaHQiLCJkIiwidGFrZVVudGlsIiwiZG8iLCJvdmVyZmxvd0Nzc1kiLCJvdmVyZmxvd0Nzc1giLCJ2aXNpYmlsaXR5IiwiYWRkQ2xhc3MiLCJvblB1bGxUb1JlZnJlc2hDb21wbGV0ZSIsIm9uUHVsbFRvUmVmcmVzaENhbmNlbCIsInN1YnNjcmliZSIsInByZXZl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LE9BQW5DO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZ0JBQUtmLGlCQUFMLENBQXVCNkQsU0FBdkIsR0FBbUMsTUFBS2xFLG1CQUFMLENBQXlCb0IsS0FBekIsT0FBbkM7QUFDRDtBQUNGLE9BZEQ7QUFlRCxLQTNMaUc7QUE0TGxHOzs7Ozs7QUFNQVcsOEJBQTBCLFNBQVNBLHdCQUFULENBQWtDekIsWUFBbEMsRUFBZ0Q7QUFDeEUsVUFBTTZELFlBQVk3RCxhQUFhNkQsU0FBL0IsQ0FEd0UsQ0FDOUI7QUFDMUMsYUFBT0EsY0FBYyxDQUFyQjtBQUNELEtBck1pRztBQXNNbEc7OztBQUdBTCw2QkFBeUIsU0FBU0EsdUJBQVQsR0FBbUMsQ0FBRSxDQXpNb0M7QUEwTWxHOzs7QUFHQUMsMkJBQXVCLFNBQVNBLHFCQUFULEdBQWlDLENBQUU7QUE3TXdDLEdBQXBGLENBQWhCOztvQkFnTmVsRSxPIiwiZmlsZSI6Il9QdWxsVG9SZWZyZXNoTWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3B1bGxUb1JlZnJlc2hNaXhpbicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fUHVsbFRvUmVmcmVzaE1peGluXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX1B1bGxUb1JlZnJlc2hNaXhpbicsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuX1B1bGxUb1JlZnJlc2hNaXhpbiMgKi8ge1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICovXHJcbiAgcHVsbFJlZnJlc2hCYW5uZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicHVsbC10by1yZWZyZXNoXCI+eyUhICQucHVsbFJlZnJlc2hUZW1wbGF0ZSAlfTwvZGl2PicsXHJcbiAgXSksXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICovXHJcbiAgcHVsbFJlZnJlc2hUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXNcIj5cclxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgPHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4bGluazpocmVmPVwiI2ljb24tZG93bi1hcnJvd1wiPjwvdXNlPlxyXG4gICAgICAgICAgPC9zdmc+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8cD57JT0gJCQuX2dldFRleHQoXCJwdWxsUmVmcmVzaFRleHRcIikgJX08L3A+YCxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKi9cclxuICBwdWxsUmVsZWFzZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaGlkZS1mb2N1c1wiPlxyXG4gICAgICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi11cC1hcnJvd1wiPjwvdXNlPlxyXG4gICAgICAgICAgPC9zdmc+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8cD57JT0gJCQuX2dldFRleHQoXCJwdWxsUmVsZWFzZVRleHRcIikgJX08L3A+YCxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCB0byBpbmRpY2F0ZSBhIHB1bGwgdG8gcmVmcmVzaFxyXG4gICAqL1xyXG4gIHB1bGxSZWZyZXNoVGV4dDogcmVzb3VyY2UucHVsbFJlZnJlc2hUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdG8gaW5kaWNhdGUgdGhlIHVzZXIgc2hvdWxkIHJlbGVhc2UgdG8gY2F1c2UgdGhlIHJlZnJlc2hcclxuICAgKi9cclxuICBwdWxsUmVsZWFzZVRleHQ6IHJlc291cmNlLnB1bGxSZWxlYXNlVGV4dCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVQdWxsVG9SZWZyZXNoIElmIHRydWUsIHdpbGwgZW5hYmxlIHRoZSB1c2VyIHRvIGRyYWcgZG93biBhbmQgcmVmcmVzaCB0aGUgbGlzdC4gRGVmYXVsdCBpcyB0cnVlLlxyXG4gICAqL1xyXG4gIGVuYWJsZVB1bGxUb1JlZnJlc2g6IHRydWUsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7RE9NTm9kZX1cclxuICAgKi9cclxuICBwdWxsUmVmcmVzaEJhbm5lcjogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtET01Ob2RlfVxyXG4gICAqL1xyXG4gIHNjcm9sbGVyTm9kZTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtET01Ob2RlfVxyXG4gICAqL1xyXG4gIGRyYWdOb2RlOiBudWxsLFxyXG5cclxuICBhbmltYXRlQ2xzOiAnYW5pbWF0ZScsXHJcblxyXG4gIF9pbml0UG9zaXRpb246IHtcclxuICAgIHRvcDogLTM1LFxyXG4gIH0sXHJcblxyXG4gIF9nZXRUZXh0OiBmdW5jdGlvbiBfZ2V0VGV4dChwcm9wKSB7XHJcbiAgICByZXR1cm4gX19jbGFzcy5wcm90b3R5cGVbcHJvcF07XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IHNjcm9sbGVyTm9kZSBUaGUgbm9kZSB0aGF0IHNjcm9sbHMgYW5kIHNob3VsZCBiZSBwdWxsZWQgb24gdG8gcmVmcmVzaC5cclxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGRyYWdOb2RlIFRoZSBub2RlIHRoYXQgdGhlIHVzZXIgd2lsbCBkcmFnLiBEZWZhdWx0cyB0byBzY3JvbGxlck5vZGUgaWYgbm90IHNwZWNpZmllZC5cclxuICAgKi9cclxuICBpbml0UHVsbFRvUmVmcmVzaDogZnVuY3Rpb24gaW5pdFB1bGxUb1JlZnJlc2goc2Nyb2xsZXJOb2RlLCBkcmFnTm9kZSkge1xyXG4gICAgaWYgKCF0aGlzLmVuYWJsZVB1bGxUb1JlZnJlc2ggfHwgIXdpbmRvdy5BcHAuc3VwcG9ydHNUb3VjaCgpIHx8ICFzY3JvbGxlck5vZGUgfHwgIVJ4KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZHJhZ05vZGUpIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZSA9IGRyYWdOb2RlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZSA9IGRyYWdOb2RlID0gc2Nyb2xsZXJOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHVsbFJlZnJlc2hCYW5uZXIgPSAkKHRoaXMucHVsbFJlZnJlc2hCYW5uZXJUZW1wbGF0ZS5hcHBseSh0aGlzKSkuZ2V0KDApO1xyXG4gICAgJChkcmFnTm9kZSkuYmVmb3JlKHRoaXMucHVsbFJlZnJlc2hCYW5uZXIpO1xyXG5cclxuICAgIC8vIFB1bGwgZG93biB0byByZWZyZXNoIHRvdWNoIGhhbmRsZXNcclxuICAgIHRoaXMuc2Nyb2xsZXJOb2RlID0gc2Nyb2xsZXJOb2RlO1xyXG5cclxuICAgIGNvbnN0IHN0eWxlID0ge1xyXG4gICAgICB0b3A6ICQoZHJhZ05vZGUpLnBvc2l0aW9uKCkudG9wLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB0b3VjaHN0YXJ0ID0gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnQoZHJhZ05vZGUsICd0b3VjaHN0YXJ0JylcclxuICAgICAgLmZpbHRlcigoZXZ0KSA9PiB7XHJcbiAgICAgICAgLy8gVGhlIGltcGxlbWVudG9yIG9mIHRoaXMgbWl4aW4gc2hvdWxkIGRldGVybWluZSB3aGF0IHNob3VsZFN0YXJ0UHVsbFRvUmVmcmVzaCBpcy5cclxuICAgICAgICBjb25zdCBzaG91bGRTdGFydCA9IHRoaXMuc2hvdWxkU3RhcnRQdWxsVG9SZWZyZXNoKHRoaXMuc2Nyb2xsZXJOb2RlKTtcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gc2hvdWxkU3RhcnQgJiYgZXZ0LnRvdWNoZXNbMF07XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5tYXAoKGUpID0+IHtcclxuICAgICAgICBjb25zdCBldnQgPSBlLnRvdWNoZXNbMF07XHJcbiAgICAgICAgJCh0aGlzLnB1bGxSZWZyZXNoQmFubmVyKS5jc3Moe1xyXG4gICAgICAgICAgdG9wOiBgJHt0aGlzLl9pbml0UG9zaXRpb24udG9wfXB4YCxcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoaXMuZHJhZ05vZGUpLnJlbW92ZUNsYXNzKHRoaXMuYW5pbWF0ZUNscyk7XHJcbiAgICAgICAgY29uc3QgYmFubmVySGVpZ2h0ID0gJCh0aGlzLnB1bGxSZWZyZXNoQmFubmVyKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgLy8gV2UgZmlsdGVyZWQgb3V0IGlmIHRoZSBkcmFnIHNob3VsZCBzdGFydCwgc28gd2UgYXJlIG1hcHBpbmcgdGhlIGluaXRpYWwgc3RhdGUgaGVyZS5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgYmFubmVySGVpZ2h0LFxyXG4gICAgICAgICAgdG9wQ3NzOiBzdHlsZS50b3AsXHJcbiAgICAgICAgICB0b3A6IHBhcnNlSW50KHN0eWxlLnRvcCwgMTApLFxyXG4gICAgICAgICAgeTogZXZ0LmNsaWVudFksXHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcbiAgICBjb25zdCB0b3VjaG1vdmUgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcmFnTm9kZSwgJ3RvdWNobW92ZScpO1xyXG4gICAgY29uc3QgdG91Y2hjYW5jZWwgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcmFnTm9kZSwgJ3RvdWNoY2FuY2VsJyk7XHJcbiAgICBjb25zdCB0b3VjaGVuZCA9IFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGRyYWdOb2RlLCAndG91Y2hlbmQnKTtcclxuICAgIGNvbnN0IGRvbmUgPSB0b3VjaGNhbmNlbC5tZXJnZSh0b3VjaGVuZCk7XHJcblxyXG4gICAgLy8gTWVyZ2UgdGhlIHRvdWNoc3RhcnQgYW5kIGRyYWdnaW5nIG9ic2VydmFibGVzXHJcbiAgICBjb25zdCBkcmFnZ2luZyA9IHRvdWNoc3RhcnQuZmxhdE1hcCgoZGF0YSkgPT4ge1xyXG4gICAgICBsZXQgZGlzdGFuY2U7IC8vIGN1cnJlbnQgZHJhZ2dlZCBkaXN0YW5jZVxyXG4gICAgICBsZXQgbWF4RGlzdGFuY2U7IC8vIHJlcXVpcmVkIGRpc3RhbmNlIHRvIHRyaWdnZXIgYSByZWZyZXNoXHJcbiAgICAgIHJldHVybiB0b3VjaG1vdmVcclxuICAgICAgICAubWFwKChldnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRvdWNoZXMgPSBldnQudG91Y2hlc1swXTtcclxuICAgICAgICAgIGNvbnN0IHdlaWdodCA9IDI7IC8vIHNsb3cgdGhlIGRyYWdcclxuICAgICAgICAgIGRpc3RhbmNlID0gKHRvdWNoZXMuY2xpZW50WSAtIGRhdGEueSkgLyB3ZWlnaHQ7XHJcbiAgICAgICAgICBtYXhEaXN0YW5jZSA9IGRhdGEuYmFubmVySGVpZ2h0ICsgMjA7XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBldnQsXHJcbiAgICAgICAgICAgIGRpc3RhbmNlLFxyXG4gICAgICAgICAgICBtYXhEaXN0YW5jZSxcclxuICAgICAgICAgICAgdG9wOiBkYXRhLnRvcCArIGRpc3RhbmNlLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5maWx0ZXIoKGQpID0+IHtcclxuICAgICAgICAgIC8vIFByZXZlbnQgdGhlIHVzZXIgZnJvbSBkcmFnZ2luZyB0aGUgcGFuZSBhYm92ZSBvdXIgc3RhcnRpbmcgcG9pbnRcclxuICAgICAgICAgIHJldHVybiBkLmRpc3RhbmNlID49IDA7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGFrZVVudGlsKGRvbmUuZG8oKCkgPT4ge1xyXG4gICAgICAgICAgLy8gVGhlIFwiZG9uZVwiIG9ic2VydmFibGUgaXMgYSBjb21iaW5hdGlvbiBvZiB0b3VjaCBlbmQgYW5kIHRvdWNoIGNhbmNlbC5cclxuICAgICAgICAgIC8vIFdlIHNob3VsZCByZXN0b3JlIHRoZSBVSSBzdGF0ZSBhbmQgaW52b2tlIGNhbGxiYWNrcyBoZXJlLlxyXG4gICAgICAgICAgJCh0aGlzLmRyYWdOb2RlKS5jc3Moe1xyXG4gICAgICAgICAgICB0b3A6IGRhdGEudG9wQ3NzLFxyXG4gICAgICAgICAgICAnb3ZlcmZsb3cteSc6IGRhdGEub3ZlcmZsb3dDc3NZLFxyXG4gICAgICAgICAgICAnb3ZlcmZsb3cteCc6IGRhdGEub3ZlcmZsb3dDc3NYLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkKHRoaXMucHVsbFJlZnJlc2hCYW5uZXIpLmNzcyh7XHJcbiAgICAgICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICB0b3A6IGAke3RoaXMuX2luaXRQb3NpdGlvbi50b3B9cHhgLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkKHRoaXMuZHJhZ05vZGUpLmFkZENsYXNzKHRoaXMuYW5pbWF0ZUNscyk7XHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgd2UgZHJhZ2dlZCBvdmVyIHRoZSB0aHJlc2hvbGQgKG1heERpc3RhbmNlKSxcclxuICAgICAgICAgIC8vIGlmIHNvLCBmaXJlIHRoZSBjYWxsYmFja3MgdGhlIHZpZXdzIHdpbGwgaW1wbGVtZW50LlxyXG4gICAgICAgICAgaWYgKGRpc3RhbmNlID4gbWF4RGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vblB1bGxUb1JlZnJlc2hDb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblB1bGxUb1JlZnJlc2hDYW5jZWwoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMaXN0ZW4gdG8gdGhlIFwiZHJhZ2dpbmdcIiBvYnNlcnZhYmxlIHdoaWNoIGlzIGEgY29tYmluYXRpb24gb2Ygb3VyIHRvdWNoXHJcbiAgICAvLyBzdGFydCBhbmQgdG91Y2ggZHJhZy4gVXBkYXRlIHRoZSBVSSB3aGlsZSBkcmFnZ2luZyBoZXJlLlxyXG4gICAgZHJhZ2dpbmcuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgIGRhdGEuZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICQodGhpcy5kcmFnTm9kZSkuY3NzKHtcclxuICAgICAgICB0b3A6IGAke2RhdGEudG9wfXB4YCxcclxuICAgICAgfSk7XHJcbiAgICAgICQodGhpcy5wdWxsUmVmcmVzaEJhbm5lcikuY3NzKHtcclxuICAgICAgICB2aXNpYmlsaXR5OiAndmlzaWJsZScsXHJcbiAgICAgICAgdG9wOiBgJHtkYXRhLnRvcCArIHRoaXMuX2luaXRQb3NpdGlvbi50b3B9cHhgLFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGRhdGEuZGlzdGFuY2UgPiBkYXRhLm1heERpc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5wdWxsUmVmcmVzaEJhbm5lci5pbm5lckhUTUwgPSB0aGlzLnB1bGxSZWxlYXNlVGVtcGxhdGUuYXBwbHkodGhpcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wdWxsUmVmcmVzaEJhbm5lci5pbm5lckhUTUwgPSB0aGlzLnB1bGxSZWZyZXNoVGVtcGxhdGUuYXBwbHkodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGVyaXZlZCBjbGFzcyBtdXN0IGltcGxlbWVudCB0aGlzIHRvIGRldGVybWluZSB3aGVuIHB1bGwgdG8gcmVmcmVzaCBzaG91bGQgc3RhcnQuIFRoaXMgaXMgY2FsbGVkIHdoZW4gb25Ub3VjaFN0YXJ0IGlzIGZpcmVkLlxyXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gc2Nyb2xsZXJOb2RlXHJcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBzY29sbGVyIG5vZGVcclxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBzaG91bGRTdGFydFB1bGxUb1JlZnJlc2g6IGZ1bmN0aW9uIHNob3VsZFN0YXJ0UHVsbFRvUmVmcmVzaChzY3JvbGxlck5vZGUpIHtcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHNjcm9sbGVyTm9kZS5zY3JvbGxUb3A7IC8vIEhvdyBmYXIgd2UgYXJlIHNjcm9sbGVkIGRvd24sIHRoaXMgc2hvdWxkIGJlIDAgYmVmb3JlIHdlIHN0YXJ0IGRyYWdnaW5nIHRoZSBwdWxsIHJlZnJlc2hcclxuICAgIHJldHVybiBzY3JvbGxUb3AgPT09IDA7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBGaXJlcyB3aGVuIHRoZSBwdWxsIHRvIHJlZnJlc2ggaXMgc3VjY2Vzc2Z1bC5cclxuICAgKi9cclxuICBvblB1bGxUb1JlZnJlc2hDb21wbGV0ZTogZnVuY3Rpb24gb25QdWxsVG9SZWZyZXNoQ29tcGxldGUoKSB7fSxcclxuICAvKipcclxuICAgKiBGaXJlcyB3aGVuIHRoZSBwdWxsIHRvIHJlZnJlc2ggaXMgY2FuY2VsZWQuXHJcbiAgICovXHJcbiAgb25QdWxsVG9SZWZyZXNoQ2FuY2VsOiBmdW5jdGlvbiBvblB1bGxUb1JlZnJlc2hDYW5jZWwoKSB7fSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=