<<<<<<< HEAD
define('argos/ReUI/main', ['exports', 'module', 'dojo/_base/lang', 'dojo/on', 'dojo/dom', 'dojo/dom-class', 'dojo/dom-attr', 'dojo/dom-style', 'dojo/query', './DomHelper'], function (exports, module, _dojo_baseLang, _dojoOn, _dojoDom, _dojoDomClass, _dojoDomAttr, _dojoDomStyle, _dojoQuery, _DomHelper) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _on = _interopRequireDefault(_dojoOn);

    var _dom = _interopRequireDefault(_dojoDom);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    var _domStyle = _interopRequireDefault(_dojoDomStyle);

    var _query = _interopRequireDefault(_dojoQuery);

    var _DomHelper2 = _interopRequireDefault(_DomHelper);

    var ReUI, R, D, transition, config, context, extractInfoFromHash, formatHashForPage, updateOrientationDom, checkOrientationAndLocation, transitionComplete;

    ReUI = {};

    ReUI.DomHelper = _DomHelper2['default'];

    R = ReUI;
    D = _DomHelper2['default'];

    transitionComplete = function (page, o) {
=======
define('argos/ReUI/main', [
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/query',
    './DomHelper'
], function(
    lang,
    on,
    dom,
    domClass,
    domAttr,
    domStyle,
    query,
    DomHelper
) {
    var ReUI,
        R,
        D,
        transition,
        config,
        context,
        extractInfoFromHash,
        formatHashForPage,
        updateOrientationDom,
        checkOrientationAndLocation,
        transitionComplete;

    ReUI = {};

    ReUI.DomHelper = DomHelper;

    R = ReUI;
    D = DomHelper;

    transitionComplete = function(page, o) {
>>>>>>> develop
        if (o.track !== false) {
            if (typeof page.id !== 'string' || page.id.length <= 0) {
                page.id = 'reui-' + context.counter++;
            }

            context.hash = location.hash = formatHashForPage(page, o);

            if (o.trimmed !== true) {
                context.history.push({
                    hash: context.hash,
                    page: page.id,
                    tag: o.tag,
                    data: o.data
                });
            }
        }

        context.transitioning = false;

        if (o.update !== false) {
            if (R.titleEl) {
                if (page.title) {
                    R.titleEl.innerHTML = page.title;
                }

                var titleCls = page.getAttribute('titleCls') || page.getAttribute('ttlclass');
                if (titleCls) {
                    R.titleEl.className = titleCls;
                }
            }
        }
    };

<<<<<<< HEAD
    transition = function (from, to, o) {
        function complete() {
            transitionComplete(to, o);

            _domClass['default'].remove(R.rootEl, 'transition');

            context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
            _on['default'].emit(from, 'aftertransition', { out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
            _on['default'].emit(to, 'aftertransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
=======
    transition = function(from, to, o) {
        function complete() {
            transitionComplete(to, o);

            domClass.remove(R.rootEl, 'transition');

            context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
            on.emit(from, 'aftertransition', { out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
            on.emit(to, 'aftertransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
>>>>>>> develop

            if (o.complete) {
                o.complete(from, to, o);
            }
        }

        context.transitioning = true;

        window.clearInterval(context.check);
<<<<<<< HEAD
        _domClass['default'].add(R.rootEl, 'transition');
=======
        domClass.add(R.rootEl, 'transition');
>>>>>>> develop

        // dispatch an 'show' event to let the page be aware that is being show as the result of an external
        // event (i.e. browser back/forward navigation).
        if (o.external) {
            _on['default'].emit(to, 'show', { tag: o.tag, data: o.data, bubbles: true, cancelable: true });
        }

<<<<<<< HEAD
        _on['default'].emit(from, 'beforetransition', { out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
        _on['default'].emit(to, 'beforetransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
=======
        on.emit(from, 'beforetransition', { out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
        on.emit(to, 'beforetransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
>>>>>>> develop

        D.unselect(from);
        D.select(to);
        complete();
    };

<<<<<<< HEAD
    extractInfoFromHash = function (hash) {
        var segments = [],
            position,
            el;
=======
    extractInfoFromHash = function(hash) {
        var segments = [], position, el;
>>>>>>> develop
        if (hash) {
            if (hash.indexOf(R.hashPrefix) === 0) {
                segments = hash.substr(R.hashPrefix.length).split(';');
            }

            return {
                hash: hash,
                page: segments[0],
                tag: segments.length <= 2 ? segments[1] : segments.slice(1)
            };
        } else {
            // no hash? IE9 can lose it on history.back()
            el = R.getCurrentPage();
            if (el && el.id) {
                for (position = context.history.length - 1; position > 0; position--) {
                    if (context.history[position].hash.match(el.id)) {
                        break;
                    }
                }
            }

            return context.history[position - 1];

        }

        return false;
    };

<<<<<<< HEAD
    formatHashForPage = function (page, options) {
        var segments = options && options.tag ? [page.id].concat(options.tag) : [page.id];
        return R.hashPrefix + segments.join(';');
    };

    updateOrientationDom = function (value) {
=======
    formatHashForPage = function(page, options) {
        var segments = options && options.tag
            ? [page.id].concat(options.tag)
            : [page.id];
        return R.hashPrefix + segments.join(';');
    };

    updateOrientationDom = function(value) {
>>>>>>> develop
        var currentOrient = R.rootEl.getAttribute('orient');
        if (value === currentOrient) {
            return;
        }

        R.rootEl.setAttribute('orient', value);

        if (value === 'portrait') {
<<<<<<< HEAD
            _domClass['default'].remove(R.rootEl, 'landscape');
            _domClass['default'].add(R.rootEl, 'portrait');
        } else if (value === 'landscape') {
            _domClass['default'].remove(R.rootEl, 'portrait');
            _domClass['default'].add(R.rootEl, 'landscape');
        } else {
            _domClass['default'].remove(R.rootEl, 'portrait');
            _domClass['default'].remove(R.rootEl, 'landscape');
        }
    };

    checkOrientationAndLocation = function () {
        var reverse, info, page, position;
=======
            domClass.remove(R.rootEl, 'landscape');
            domClass.add(R.rootEl, 'portrait');
        } else if (value === 'landscape') {
            domClass.remove(R.rootEl, 'portrait');
            domClass.add(R.rootEl, 'landscape');
        } else {
            domClass.remove(R.rootEl, 'portrait');
            domClass.remove(R.rootEl, 'landscape');
        }
    };

    checkOrientationAndLocation = function() {
        var reverse,
            info,
            page,
            position;
>>>>>>> develop

        // Check if screen dimensions changed. Ignore changes where only the height changes (the android keyboard will cause this)
        if (Math.abs(window.innerHeight - context.height) > 5 || Math.abs(window.innerWidth - context.width) > 5) {
            if (Math.abs(window.innerWidth - context.width) > 5) {
                R.setOrientation(window.innerHeight < window.innerWidth ? 'landscape' : 'portrait');
            }

            context.height = window.innerHeight;
            context.width = window.innerWidth;
        }

        if (context.transitioning) {
            return;
        }

        if (context.hash !== location.hash) {
            // do reverse checking here, loop-and-trim will be done by show
            reverse = false;

            for (position = context.history.length - 2; position >= 0; position--) {
                if (context.history[position].hash === location.hash) {
                    info = context.history[position];
                    reverse = true;
                    break;
                }
            }

            info = info || extractInfoFromHash(location.hash);
<<<<<<< HEAD
            page = info && _dom['default'].byId(info.page);
=======
            page = info && dom.byId(info.page);
>>>>>>> develop

            // more often than not, data will only be needed when moving to a previous view (and restoring its state).

            if (page) {
                R.show(page, { external: true, reverse: reverse, tag: info && info.tag, data: info && info.data });
            }
        }
    };

    context = {
        page: false,
        transitioning: false,
        initialized: false,
        counter: 0,
        width: 0,
        height: 0,
        check: 0,
        history: []
    };

    config = window.reConfig || {};

<<<<<<< HEAD
    _lang['default'].mixin(ReUI, {
=======
    lang.mixin(ReUI, {
>>>>>>> develop
        rootEl: false,
        titleEl: false,
        pageTitleId: 'pageTitle',
        hashPrefix: '#_',
        checkStateEvery: 100,
        context: context,

<<<<<<< HEAD
        init: function init() {
=======
        init: function() {
>>>>>>> develop
            if (context.initialized) {
                return;
            }

            context.initialized = true;

            R.rootEl = R.rootEl || document.body;
<<<<<<< HEAD
            R.titleEl = R.titleEl || _dom['default'].byId(R.pageTitleId);
=======
            R.titleEl = R.titleEl || dom.byId(R.pageTitleId);
>>>>>>> develop

            context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
        },

        /**
         * Called when the screen orientation changes.
         */
<<<<<<< HEAD
        setOrientation: function setOrientation(value) {
=======
        setOrientation: function(value) {
>>>>>>> develop
            updateOrientationDom(value);
        },

        /**
         * @deprecated
         */
<<<<<<< HEAD
        getCurrentPage: function getCurrentPage() {
=======
        getCurrentPage: function() {
>>>>>>> develop
            return context.page;
        },

        /**
         * @deprecated
         */
<<<<<<< HEAD
        back: function back() {
=======
        back: function() {
>>>>>>> develop
            history.back();
        },

        /**
         * Temporarily disables the location and orientation checking.
        */
<<<<<<< HEAD
        disableLocationCheck: function disableLocationCheck() {
=======
        disableLocationCheck: function() {
>>>>>>> develop
            if (context.check) {
                window.clearInterval(context.check);
            }
        },

        /**
         * Available Options:
         *   horizontal: True if the transition is horizontal, False otherwise.
         *   reverse: True if the transition is a reverse transition (right/down), False otherwise.
         *   track: False if the transition should not be tracked in history, True otherwise.
         *   update: False if the transition should not update title and back button, True otherwise.
         *   scroll: False if the transition should not scroll to the top, True otherwise.
        */
<<<<<<< HEAD
        show: function show(page, o) {
=======
        show: function(page, o) {
>>>>>>> develop
            if (context.transitioning) {
                return;
            }

            var count, hash, position, from;

            o = o || {};
<<<<<<< HEAD
            page = typeof page === 'string' ? _dom['default'].byId(page) : page;
=======
            page = typeof page === 'string'
                ? dom.byId(page)
                : page;
>>>>>>> develop

            if (!page) {
                return;
            }

            if (context.hash === formatHashForPage(page, o)) {
                return;
            }

            context.transitioning = true;

            if (o.track !== false) {
                count = context.history.length;
                hash = formatHashForPage(page, o);
                position = -1;

                // do loop and trim
                for (position = count - 1; position >= 0; position--) {
                    if (context.history[position].hash === hash) {
                        break;
                    }
                }

<<<<<<< HEAD
                if (position > -1 && position === count - 2) {
=======
                if ((position > -1) && (position === (count - 2))) {
>>>>>>> develop
                    //Added check if history item is just one back.

                    context.history = context.history.splice(0, position + 1);

                    context.hash = hash;

                    // indicate that context.history has already been taken care of (i.e. nothing needs to be pushed).
                    o.trimmed = true;
                    // trim up the browser history
                    // if the requested hash does not equal the current location hash, trim up history.
                    // location hash will not match requested hash when show is called directly, but will match
                    // for detected location changes (i.e. the back button).
                    if (location.hash !== hash) {
                        history.go(position - (count - 1));
                    }
                } else if (o.returnTo) {
                    if (typeof o.returnTo === 'function') {
                        for (position = count - 1; position >= 0; position--) {
                            if (o.returnTo(context.history[position])) {
                                break;
                            }
                        }
                    } else if (o.returnTo < 0) {
<<<<<<< HEAD
                        position = count - 1 + o.returnTo;
=======
                        position = (count - 1) + o.returnTo;
>>>>>>> develop
                    }

                    if (position > -1) {
                        // we fix up the history, but do not flag as trimmed, since we do want the new view to be pushed.
                        context.history = context.history.splice(0, position + 1);

                        context.hash = context.history[context.history.length - 1] && context.history[context.history.length - 1].hash;

                        if (location.hash !== hash) {
                            history.go(position - (count - 1));
                        }
                    }
                }
            }

            // don't auto-scroll by default if reversing
            if (o.reverse && typeof o.scroll === 'undefined') {
                o.scroll = !o.reverse;
            }

<<<<<<< HEAD
            _on['default'].emit(page, 'load', { bubbles: false, cancelable: true });
=======
            on.emit(page, 'load', { bubbles: false, cancelable: true });
>>>>>>> develop

            from = context.page;

            if (from) {
                _on['default'].emit(from, 'blur', { bubbles: false, cancelable: true });
            }

            context.page = page; // Keep for backwards compat

<<<<<<< HEAD
            _on['default'].emit(page, 'focus', { bubbles: false, cancelable: true });

            if (from && _domAttr['default'].get(page, 'selected') !== 'true') {
=======
            on.emit(page, 'focus', { bubbles: false, cancelable: true });

            if (from && domAttr.get(page, 'selected') !== 'true') {
>>>>>>> develop
                if (o.reverse) {
                    _on['default'].emit(page, 'unload', { bubbles: false, cancelable: true });
                }

                window.setTimeout(transition, R.checkStateEvery, from, page, o);
            } else {
<<<<<<< HEAD
                _on['default'].emit(page, 'beforetransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
=======
                on.emit(page, 'beforetransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
>>>>>>> develop

                D.select(page);

                transitionComplete(page, o);

<<<<<<< HEAD
                _on['default'].emit(page, 'aftertransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
=======
                on.emit(page, 'aftertransition', { out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true });
>>>>>>> develop
            }
        }
    }, config);

    window.ReUI = ReUI;
    module.exports = ReUI;
});

