define('Sage/Platform/Mobile/ReUI/main', [
    'dojo/_base/lang',
    'dojo/on',
    'dojo/hash',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/query',
    './DomHelper'
], function(
    lang,
    on,
    dojoHash,
    dom,
    domClass,
    domAttr,
    domStyle,
    query,
    DomHelper
) {
    var ReUI = {};

    ReUI.DomHelper = DomHelper;

    var R = ReUI,
        D = DomHelper;

    var transitionComplete = function(page, o) {
        if (o.track !== false) {
            if (typeof page.id !== 'string' || page.id.length <= 0) {
                page.id = 'reui-' + (context.counter++);
            }

            context.hash = dojoHash();

            if (o.trimmed !== true) {
                App.history.push({
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

    var transition = function(from, to, o) {
        function complete() {
            transitionComplete(to, o);

            domClass.remove(R.rootEl, 'transition');

            context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
            on.emit(from, 'aftertransition', {out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true});
            on.emit(to, 'aftertransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});

            if (o.complete) {
                o.complete(from, to, o);
            }
        }

        context.transitioning = true;

        window.clearInterval(context.check);
        domClass.add(R.rootEl, 'transition');

        // dispatch an 'show' event to let the page be aware that is being show as the result of an external
        // event (i.e. browser back/forward navigation).
        if (o.external) {
            on.emit(to, 'show', {tag: o.tag, data: o.data, bubbles: true, cancelable: true});
        }

        on.emit(from, 'beforetransition', {out: true, tag: o.tag, data: o.data, bubbles: true, cancelable: true});
        on.emit(to, 'beforetransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});

        D.unselect(from);
        D.select(to);
        complete();
    };

    var updateOrientationDom = function(value) {
        var currentOrient = R.rootEl.getAttribute('orient');
        if (value === currentOrient) {
            return;
        }

        R.rootEl.setAttribute('orient', value);

        if (value == 'portrait') {
            domClass.remove(R.rootEl, 'landscape');
            domClass.add(R.rootEl, 'portrait');
        } else if (value == 'landscape') {
            domClass.remove(R.rootEl, 'portrait');
            domClass.add(R.rootEl, 'landscape');
        } else {
            domClass.remove(R.rootEl, 'portrait');
            domClass.remove(R.rootEl, 'landscape');
        }
    };

    var checkOrientationAndLocation = function() {
        // Check if screen dimensions changed. Ignore changes where only the height changes (the android keyboard will cause this)
        if (Math.abs(window.innerHeight - context.height) > 5 || Math.abs(window.innerWidth - context.width) > 5) {
            if (Math.abs(window.innerWidth - context.width) > 5) {
                R.setOrientation(context.height < context.width ? 'landscape' : 'portrait');
            }

            context.height = window.innerHeight;
            context.width = window.innerWidth;
        }
    };

    var context = {
        page: false,
        transitioning: false,
        initialized: false,
        counter: 0,
        width: 0,
        height: 0,
        check: 0
    };

    var config = window.reConfig || {};

    lang.mixin(ReUI, {
        rootEl: false,
        titleEl: false,
        pageTitleId: 'pageTitle',
        checkStateEvery: 250,
        context: context,

        init: function() {
            if (context.initialized) {
                return;
            }

            context.initialized = true;

            R.rootEl = R.rootEl || document.body;
            R.titleEl = R.titleEl || dom.byId(R.pageTitleId);

            context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
        },

        /**
         * Called when the screen orientation changes.
         */
        setOrientation: function(value) {
            updateOrientationDom(value);
        },

        /**
         * @deprecated
         */
        getCurrentPage: function() {
            return App.getCurrentPage();
        },

        /**
         * @deprecated
         */
        back: function() {
            history.back();
        },

        /**
         * Temporarily disables the location and orientation checking.
        */
        disableLocationCheck: function() {
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
        show: function(page, o) {
            if (context.transitioning) {
                return;
            }

            var count, position, from;

            o = o || {};

            page = typeof page === 'string'
                ? dom.byId(page)
                : page;

            if (!page) {
                return;
            }

            context.transitioning = true;

            if (o.track !== false) {
                count = App.history.length;
                position = -1;

                // do loop and trim
                for (position = count - 1; position >= 0; position--) {
                    if (App.history[position].page === page.id) {
                        break;
                    }
                }

                if ((position > -1) && (position === (count-2))) {
                     //Added check if history item is just one back.

                    App.history = App.history.splice(0, position + 1);

                    // indicate that App.history has already been taken care of (i.e. nothing needs to be pushed).
                    o.trimmed = true;
                } else if (o.returnTo) {
                    if (typeof o.returnTo === 'function') {
                        for (position = count - 1; position >= 0; position--) {
                            if (o.returnTo(App.history[position])) {
                                break;
                            }
                        }
                    } else if (o.returnTo < 0) {
                        position = (count - 1) + o.returnTo;
                    }

                    if (position > -1) {
                        // we fix up the history, but do not flag as trimmed, since we do want the new view to be pushed.
                        App.history = App.history.splice(0, position + 1);
                    }
                }
            }

            // don't auto-scroll by default if reversing
            if (o.reverse && typeof o.scroll === 'undefined') {
                o.scroll = !o.reverse;
            }

            on.emit(page, 'load', {bubbles: false, cancelable: true});

            from = App.getCurrentPage();

            if (from) {
                on.emit(from, 'blur', {bubbles: false, cancelable: true});
            }

            context.page = page; // Keep for backwards compat
            App.setCurrentPage(page);

            on.emit(page, 'focus', {bubbles: false, cancelable: true});

            if (from && domAttr.get(page, 'selected') !== 'true') {
                if (o.reverse) {
                    on.emit(page, 'unload', {bubbles: false, cancelable: true});
                }

                window.setTimeout(transition, 0, from, page, o);
            } else {
                on.emit(page, 'beforetransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});

                D.select(page);

                transitionComplete(page, o);

                on.emit(page, 'aftertransition', {out: false, tag: o.tag, data: o.data, bubbles: true, cancelable: true});
            }
        }
    }, config);

    window.ReUI = ReUI;
    return ReUI;
});

