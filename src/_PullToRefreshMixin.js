import declare from 'dojo/_base/declare';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domGeom from 'dojo/dom-geometry';
import domStyle from 'dojo/dom-style';

let __class;
const resource = window.localeContext.getEntitySync('pullToRefreshMixin').attributes;

/**
 * @class argos._PullToRefreshMixin
 * Mixin for pull to refresh actions
 * @alternateClassName _PullToRefreshMixin
 */
__class = declare('argos._PullToRefreshMixin', null, {
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

  _onTouchStartHandle: null,
  _onTouchEndHandle: null,
  _onTouchMoveHandle: null,
  _onTouchCancelHandle: null,

  _getText: function _getText(prop) {
    return __class.prototype[prop];
  },

  /**
   * @static
   * @property {Object}
   * Stores the current pull to refresh data. Do not store object refs here, this structure is static.
   */
  pullToRefresh: {
    originalTop: '0px',
    originalOverflowY: '',
    originalOverflowX: '',
    bannerHeight: 0,
    scrollerHeight: 0,
    scrollerWidth: 0,
    dragTop: 0,
    pulling: false,
    dragStartX: 0,
    dragStartY: 0,
    lastX: 0,
    lastY: 0,
    results: false,
    animateCls: 'animate',
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
    this._onTouchStartHandle = this.connect(scrollerNode, 'ontouchstart', this._onTouchStart.bind(this));
    this._onTouchMoveHandle = this.connect(scrollerNode, 'ontouchmove', this._onTouchMove.bind(this));
    this._onTouchCancelHandle = this.connect(scrollerNode, 'ontouchcancel', this._onEndTouchDrag.bind(this));
    this._onTouchEndHandle = this.connect(scrollerNode, 'ontouchend', this._onEndTouchDrag.bind(this));
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

  _onTouchStart: function _onTouchStart(evt) {
    this.pullToRefresh.pulling = false;
    this.pullToRefresh.results = false;

    const scrollerNode = this.scrollerNode;

    if (!scrollerNode) {
      return;
    }

    if (this.shouldStartPullToRefresh(scrollerNode)) {
      const position = domGeom.position(scrollerNode);
      const bannerPos = domGeom.position(this.pullRefreshBanner);
      const style = domStyle.getComputedStyle(scrollerNode); // expensive
      this.pullToRefresh.bannerHeight = bannerPos.h;
      this.pullToRefresh.scrollerHeight = position.h;
      this.pullToRefresh.scrollerWidth = position.w;
      this.pullToRefresh.originalTop = style.top;
      this.pullToRefresh.originalOverflowY = style.overflowY;
      this.pullToRefresh.originalOverflowX = style.overflowX;
      this.pullToRefresh.dragTop = parseInt(style.top, 10);
      this.pullToRefresh.dragStartY = this.pullToRefresh.lastY = evt.clientY;
      this.pullToRefresh.dragStartX = this.pullToRefresh.lastX = evt.clientX;

      this.pullToRefresh.pulling = true;

      domStyle.set(this.pullRefreshBanner, 'visibility', 'visible');
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    const PULL_PADDING = 20;

    const scrollerNode = this.scrollerNode;

    if (!this.pullToRefresh.pulling || !scrollerNode) {
      return;
    }

    domClass.remove(scrollerNode, this.pullToRefresh.animateCls);

    // distance from last drag
    let distance = evt.clientY - this.pullToRefresh.lastY;

    const MAX_DISTANCE = this.pullToRefresh.bannerHeight + PULL_PADDING;

    // slow down the pull down speed a bit, the user has to drag a bit futher, but it feels a bit more smooth
    distance = distance / 2;

    if (distance >= 0) {
      evt.preventDefault();
      let top = this.pullToRefresh.dragTop;

      top = top + distance;
      domStyle.set(scrollerNode, {
        'top': top + 'px',
        'overflow-y': 'hidden',
        'overflow-x': 'hidden',
      });

      if (distance > MAX_DISTANCE) {
        // The user has pulled down the max distance required to trigger a refresh
        this.pullToRefresh.results = true;
        this.pullRefreshBanner.innerHTML = this.pullReleaseTemplate.apply(this);
      } else {
        // The user pulled down, but not far enough to trigger a refresh
        this.pullToRefresh.results = false;
        this.pullRefreshBanner.innerHTML = this.pullRefreshTemplate.apply(this);
      }
    }
  },
  _onEndTouchDrag: function _onEndTouchDrag() {
    const scrollerNode = this.scrollerNode;

    if (!this.pullRefreshBanner || !scrollerNode || !this.pullToRefresh.pulling) {
      return;
    }

    // Restore our original scroller styles
    domStyle.set(scrollerNode, {
      'top': this.pullToRefresh.originalTop,
      'overflow-y': this.pullToRefresh.originalOverflowY,
      'overflow-x': this.pullToRefresh.originalOverflowX,
    });

    domStyle.set(this.pullRefreshBanner, 'visibility', 'hidden');

    domClass.add(scrollerNode, this.pullToRefresh.animateCls);

    // Trigger a refresh
    if (this.pullToRefresh.results) {
      this.onPullToRefreshComplete();
    } else {
      this.onPullToRefreshCancel();
    }

    this.pullToRefresh.pulling = false;
    this.pullToRefresh.results = false;
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
