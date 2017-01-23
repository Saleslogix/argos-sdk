/**
 * @class argos._PullToRefreshMixin
 * Mixin for pull to refresh actions
 * @alternateClassName _PullToRefreshMixin
 */
import declare from 'dojo/_base/declare';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domGeom from 'dojo/dom-geometry';
import domStyle from 'dojo/dom-style';
import getResource from './I18n';

import Rx from 'rxjs';

const resource = getResource('pullToRefreshMixin');

/**
 * @class argos._PullToRefreshMixin
 * Mixin for pull to refresh actions
 * @alternateClassName _PullToRefreshMixin
 */
const __class = declare('argos._PullToRefreshMixin', null, {
  /**
   * @property {Simplate}
   */
  pullRefreshBannerTemplate: new Simplate([
    '<div class="pull-to-refresh">{%! $.pullRefreshTemplate %}</div>',
  ]),

  /**
   * @property {Simplate}
   */
  pullRefreshTemplate: new Simplate([
    '<span class="fa fa-long-arrow-down"></span>{%= $$._getText("pullRefreshText") %}',
  ]),

  /**
   * @property {Simplate}
   */
  pullReleaseTemplate: new Simplate([
    '<span class="fa fa-long-arrow-up"></span>{%= $$._getText("pullReleaseText") %}',
  ]),

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

  animateCls: 'animate',

  _getText: function _getText(prop) {
    return __class.prototype[prop];
  },
  /**
   * @param {DOMNode} scrollerNode The node that scrollers and should be pulled on to refresh.
   */
  initPullToRefresh: function initPullToRefresh(scrollerNode) {
    if (!this.enablePullToRefresh || !window.App.supportsTouch() || !scrollerNode) {
      return;
    }

    this.pullRefreshBanner = domConstruct.toDom(this.pullRefreshBannerTemplate.apply(this));
    domConstruct.place(this.pullRefreshBanner, scrollerNode, 'before');

    // Pull down to refresh touch handles
    this.scrollerNode = scrollerNode;

    const touchstart = Rx.Observable.fromEvent(scrollerNode, 'touchstart')
      .filter((evt) => {
        // The implmentor of this mixin should determine what shouldStartPullToRefresh is.
        return this.shouldStartPullToRefresh(this.scrollerNode) && evt.touches[0];
      })
      .map((e) => {
        const evt = e.touches[0];
        domStyle.set(this.pullRefreshBanner, 'visibility', 'visible');
        domClass.remove(this.scrollerNode, this.animateCls);
        const bannerPos = domGeom.position(this.pullRefreshBanner);
        const style = domStyle.getComputedStyle(scrollerNode); // expensive

        // We filtered out if the drag should start, so we are mapping the initial state here.
        return {
          bannerHeight: bannerPos.h,
          topCss: style.top,
          overflowCssY: style.overflowY,
          overflowCssX: style.overflowX,
          top: parseInt(style.top, 10),
          y: evt.clientY,
        };
      });
    const touchmove = Rx.Observable.fromEvent(scrollerNode, 'touchmove');
    const touchcancel = Rx.Observable.fromEvent(scrollerNode, 'touchcancel');
    const touchend = Rx.Observable.fromEvent(scrollerNode, 'touchend');
    const done = touchcancel.merge(touchend);

    // Merge the touchstart and dragging observables
    const dragging = touchstart.flatMap((data) => {
      let distance; // current dragged distance
      let maxDistance; // required distance to trigger a refresh
      return touchmove
        .map((evt) => {
          const touches = evt.touches[0];
          const weight = 2; // slow the drag
          distance = (touches.clientY - data.y) / weight;
          maxDistance = data.bannerHeight + 20;
          return {
            evt,
            distance,
            maxDistance,
            top: data.top + distance,
          };
        })
        .filter((d) => {
          // Prevent the user from dragging the pane above our starting point
          return d.distance >= 0;
        })
        .takeUntil(done.do(() => {
          // The "done" observable is a combination of touch end and touch cancel.
          // We should restore the UI state and invoke callbacks here.
          domStyle.set(this.scrollerNode, {
            top: data.topCss,
            'overflow-y': data.overflowCssY,
            'overflow-x': data.overflowCssX,
          });

          domStyle.set(this.pullRefreshBanner, 'visibility', 'hidden');
          domClass.add(this.scrollerNode, this.animateCls);

          // Check if we dragged over the threshold (maxDistance),
          // if so, fire the callbacks the views will implement.
          if (distance > maxDistance) {
            this.onPullToRefreshComplete();
          } else {
            this.onPullToRefreshCancel();
          }
        }));
    });

    // Listen to the "dragging" observable which is a combination of our touch
    // start and touch drag. Update the UI while dragging here.
    dragging.subscribe((data) => {
      data.evt.preventDefault();
      domStyle.set(this.scrollerNode, {
        top: `${data.top}px`,
        overflow: 'hidden',
      });

      if (data.distance > data.maxDistance) {
        this.pullRefreshBanner.innerHTML = this.pullReleaseTemplate.apply(this);
      } else {
        this.pullRefreshBanner.innerHTML = this.pullRefreshTemplate.apply(this);
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
    const scrollTop = scrollerNode.scrollTop; // How far we are scrolled down, this should be 0 before we start dragging the pull refresh
    return scrollTop === 0;
  },
  /**
   * Fires when the pull to refresh is successful.
   */
  onPullToRefreshComplete: function onPullToRefreshComplete() {},
  /**
   * Fires when the pull to refresh is canceled.
   */
  onPullToRefreshCancel: function onPullToRefreshCancel() {},
});

export default __class;
