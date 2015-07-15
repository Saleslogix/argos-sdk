/**
 * @class argos._PullToRefreshMixin
 * Mixin for pull to refresh actions
 * @alternateClassName _PullToRefreshMixin
 */
define('argos/_PullToRefreshMixin', [
    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-geometry',
    'dojo/dom-style',
    'dojo/dom'
], function(
    declare,
    domClass,
    domConstruct,
    domGeom,
    domStyle,
    dom
) {
    var __class;

    __class = declare('argos._PullToRefreshMixin', null, {
        /**
         * @property {Simplate}
         */
        pullRefreshBannerTemplate: new Simplate([
            '<div class="pull-to-refresh">{%! $.pullRefreshTemplate %}</div>'
        ]),

        /**
         * @property {Simplate}
         */
        pullRefreshTemplate: new Simplate([
            '<span class="fa fa-long-arrow-down"></span>{%= $$._getText("pullRefreshText") %}'
        ]),

        /**
         * @property {Simplate}
         */
        pullReleaseTemplate: new Simplate([
            '<span class="fa fa-long-arrow-up"></span>{%= $$._getText("pullReleaseText") %}'
        ]),

        /**
         * @property {String}
         * Text to indicate a pull to refresh
         */
        pullRefreshText: 'Pull down to refresh...',
        /**
         * @property {String}
         * Text to indicate the user should release to cause the refresh
         */
        pullReleaseText: 'Release to refresh...',

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

        _getText: function(prop) {
            return __class.prototype[prop];
        },

        /**
         * @param {DOMNode} scrollerNode The node that scrollers and should be pulled on to refresh.
         */
        initPullToRefresh: function(scrollerNode) {
            if (!this.enablePullToRefresh || !window.App.supportsTouch() || !scrollerNode) {
                return;
            }

            this.pullRefreshBanner = domConstruct.toDom(this.pullRefreshBannerTemplate.apply(this));
            domConstruct.place(this.pullRefreshBanner, scrollerNode, 'before');

            // Pull down to refresh touch handles
            this.scrollerNode = scrollerNode;

            var touchstart = Rx.Observable.fromEvent(scrollerNode, 'touchstart')
                .filter(function(evt) {
                    return this.shouldStartPullToRefresh(this.scrollerNode) && evt.touches[0];
                }.bind(this))
                .map(function(evt) {
                    evt = evt.touches[0];
                    domStyle.set(this.pullRefreshBanner, 'visibility', 'visible');
                    domClass.remove(this.scrollerNode, this.animateCls);
                    var bannerPos = domGeom.position(this.pullRefreshBanner)
                    , style = domStyle.getComputedStyle(scrollerNode); // expensive

                    return {
                        bannerHeight: bannerPos.h,
                        topCss: style.top,
                        overflowCss: style.overflow,
                        top: parseInt(style.top, 10),
                        y: evt.clientY
                    };
                }.bind(this))
            , touchmove = Rx.Observable.fromEvent(scrollerNode, 'touchmove')
            , touchcancel = Rx.Observable.fromEvent(scrollerNode, 'touchcancel')
            , touchend = Rx.Observable.fromEvent(scrollerNode, 'touchend')
            , done = touchcancel.merge(touchend)
            , dragging = touchstart.flatMap(function(data) {
                var distance, maxDistance;
                return touchmove
                    .map(function(evt) {
                        var touches = evt.touches[0];
                        distance = (touches.clientY - data.y) / 2;
                        maxDistance = data.bannerHeight + 20
                        return {
                            evt: evt,
                            distance: distance,
                            maxDistance: maxDistance,
                            top: data.top + distance
                        };
                    }.bind(this))
                    .filter(function(data) {
                        return data.distance >= 0;
                    })
                    .takeUntil(done.map(function doneMap(){
                        // Restore our original scroller styles
                        domStyle.set(this.scrollerNode, {
                            'top': data.topCss,
                            'overflow': data.overflowCss
                        });

                        domStyle.set(this.pullRefreshBanner, 'visibility', 'hidden');
                        domClass.add(this.scrollerNode, this.animateCls);

                        if (distance > maxDistance) {
                            this.onPullToRefreshComplete();
                        } else {
                            this.onPullToRefreshCancel();
                        }
                    }.bind(this)));
            }.bind(this));

            dragging.subscribe(function onNext(data) {
                data.evt.preventDefault();
                domStyle.set(this.scrollerNode, {
                    'top': data.top + 'px',
                    'overflow': 'hidden'
                });

                if (data.distance > data.maxDistance) {
                    this.pullRefreshBanner.innerHTML = this.pullReleaseTemplate.apply(this);
                } else {
                    this.pullRefreshBanner.innerHTML = this.pullRefreshTemplate.apply(this);
                }
            }.bind(this));
        },

        /**
         * Derived class must implement this to determine when pull to refresh should start. This is called when onTouchStart is fired.
         * @param {DOMNode} scrollerNode
         * Reference to the scoller node
         * @returns {Boolean}
         */
        shouldStartPullToRefresh: function(scrollerNode) {
            var scrollTop;
            scrollTop = scrollerNode.scrollTop; // How far we are scrolled down, this should be 0 before we start dragging the pull refresh
            return scrollTop === 0;
        },

        /**
         * Fires when the pull to refresh is successful.
         */
        onPullToRefreshComplete: function() {
        },

        /**
         * Fires when the pull to refresh is canceled.
         */
        onPullToRefreshCancel: function() {
        }
    });

    return __class;
});
