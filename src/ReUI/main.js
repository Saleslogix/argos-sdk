import lang from 'dojo/_base/lang';
import on from 'dojo/on';
import dom from 'dojo/dom';
import domClass from 'dojo/dom-class';
import domAttr from 'dojo/dom-attr';
import DomHelper from './DomHelper';

const ReUI = {};
const R = ReUI;
const D = DomHelper;
const context = {
  page: false,
  transitioning: false,
  initialized: false,
  counter: 0,
  width: 0,
  height: 0,
  check: 0,
  history: [],
};

const config = window.reConfig || {};
R.DomHelper = DomHelper;

function formatHashForPage(page, options) {
  const segments = options && options.tag ? [page.id].concat(options.tag) : [page.id];
  return R.hashPrefix + segments.join(';');
}

function updateOrientationDom(value) {
  const currentOrient = R.rootEl.getAttribute('orient');
  if (value === currentOrient) {
    return;
  }

  R.rootEl.setAttribute('orient', value);

  if (value === 'portrait') {
    domClass.remove(R.rootEl, 'landscape');
    domClass.add(R.rootEl, 'portrait');
  } else if (value === 'landscape') {
    domClass.remove(R.rootEl, 'portrait');
    domClass.add(R.rootEl, 'landscape');
  } else {
    domClass.remove(R.rootEl, 'portrait');
    domClass.remove(R.rootEl, 'landscape');
  }
}

function extractInfoFromHash(hash) {
  let segments;
  let position;

  if (hash) {
    if (hash.indexOf(R.hashPrefix) === 0) {
      segments = hash.substr(R.hashPrefix.length).split(';');
    }

    return {
      hash: hash,
      page: segments[0],
      tag: segments.length <= 2 ? segments[1] : segments.slice(1),
    };
  }
  // no hash? IE9 can lose it on history.back()
  const el = R.getCurrentPage();
  if (el && el.id) {
    for (position = context.history.length - 1; position > 0; position--) {
      if (context.history[position].hash.match(el.id)) {
        break;
      }
    }
  }

  return context.history[position - 1];
}

function transitionComplete(page, o) {
  if (o.track !== false) {
    if (typeof page.id !== 'string' || page.id.length <= 0) {
      page.id = 'reui-' + (context.counter++);
    }

    context.hash = location.hash = formatHashForPage(page, o);

    if (o.trimmed !== true) {
      context.history.push({
        hash: context.hash,
        page: page.id,
        tag: o.tag,
        data: o.data,
      });
    }
  }

  context.transitioning = false;

  if (o.update !== false) {
    if (R.titleEl) {
      if (page.title) {
        R.titleEl.innerHTML = page.title;
      }

      const titleCls = page.getAttribute('titleCls') || page.getAttribute('ttlclass');
      if (titleCls) {
        R.titleEl.className = titleCls;
      }
    }
  }
}

function checkOrientationAndLocation() {
  // Check if screen dimensions changed. Ignore changes where only the height changes (the android keyboard will cause this)
  if (Math.abs(window.innerHeight - context.height) > 5 || Math.abs(window.innerWidth - context.width) > 5) {
    if (Math.abs(window.innerWidth - context.width) > 5) {
      R.setOrientation(window.innerHeight < window.innerWidth ? 'landscape' : 'portrait');
    } else {
      if (domClass.contains(R.rootEl, 'android-keyboard-up')) {
        domClass.remove(R.rootEl, 'android-keyboard-up');
      } else {
        domClass.add(R.rootEl, 'android-keyboard-up');
      }
    }

    context.height = window.innerHeight;
    context.width = window.innerWidth;
  }

  if (context.transitioning) {
    return;
  }

  if (context.hash !== location.hash) {
    // do reverse checking here, loop-and-trim will be done by show
    let reverse = false;
    let position;
    let info;
    for (position = context.history.length - 2; position >= 0; position--) {
      if (context.history[position].hash === location.hash) {
        info = context.history[position];
        reverse = true;
        break;
      }
    }

    info = info || extractInfoFromHash(location.hash);
    const page = info && dom.byId(info.page);

    // more often than not, data will only be needed when moving to a previous view (and restoring its state).

    if (page) {
      R.show(page, {
        external: true,
        reverse: reverse,
        tag: info && info.tag,
        data: info && info.data,
      });
    }
  }
}

function transition(from, to, o) {
  function complete() {
    transitionComplete(to, o);

    domClass.remove(R.rootEl, 'transition');

    context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
    on.emit(from, 'aftertransition', {
      out: true,
      tag: o.tag,
      data: o.data,
      bubbles: true,
      cancelable: true,
    });
    on.emit(to, 'aftertransition', {
      out: false,
      tag: o.tag,
      data: o.data,
      bubbles: true,
      cancelable: true,
    });

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
    on.emit(to, 'show', {
      tag: o.tag,
      data: o.data,
      bubbles: true,
      cancelable: true,
    });
  }

  on.emit(from, 'beforetransition', {
    out: true,
    tag: o.tag,
    data: o.data,
    bubbles: true,
    cancelable: true,
  });
  on.emit(to, 'beforetransition', {
    out: false,
    tag: o.tag,
    data: o.data,
    bubbles: true,
    cancelable: true,
  });

  D.unselect(from);
  D.select(to);
  complete();
}

lang.mixin(ReUI, {
  rootEl: false,
  titleEl: false,
  pageTitleId: 'pageTitle',
  hashPrefix: '#_',
  checkStateEvery: 100,
  context: context,

  init: function init() {
    if (context.initialized) {
      return;
    }

    context.initialized = true;
    R.rootEl = R.rootEl || document.body;
    R.titleEl = R.titleEl || dom.byId(R.pageTitleId);

    context.check = window.setInterval(checkOrientationAndLocation, R.checkStateEvery);
  },

  resetHistory: function resetHistory() {
    const length = context.history.length;
    history.go(-length);
    context.history = [];
  },

  /**
   * Called when the screen orientation changes.
   */
  setOrientation: function setOrientation(value) {
    updateOrientationDom(value);
  },

  /**
   * @deprecated
   */
  getCurrentPage: function getCurrentPage() {
    return context.page;
  },

  /**
   * @deprecated
   */
  back: function back() {
    history.back();
  },

  /**
   * Temporarily disables the location and orientation checking.
   */
  disableLocationCheck: function disableLocationCheck() {
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
  show: function show(p, o = {}) {
    if (context.transitioning) {
      return;
    }

    const page = typeof p === 'string' ? dom.byId(p) : p;

    if (!page) {
      return;
    }

    if (context.hash === formatHashForPage(page, o)) {
      return;
    }

    context.transitioning = true;

    if (o.track !== false) {
      const count = context.history.length;
      const hash = formatHashForPage(page, o);
      let position = -1;

      // do loop and trim
      for (position = count - 1; position >= 0; position--) {
        if (context.history[position].hash === hash) {
          break;
        }
      }

      if ((position > -1) && (position === (count - 2))) {
        // Added check if history item is just one back.

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
          position = (count - 1) + o.returnTo;
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

    on.emit(page, 'load', {
      bubbles: false,
      cancelable: true,
    });

    const from = context.page;

    if (from) {
      on.emit(from, 'blur', {
        bubbles: false,
        cancelable: true,
      });
    }

    context.page = page; // Keep for backwards compat

    on.emit(page, 'focus', {
      bubbles: false,
      cancelable: true,
    });

    if (from && domAttr.get(page, 'selected') !== 'true') {
      if (o.reverse) {
        on.emit(page, 'unload', {
          bubbles: false,
          cancelable: true,
        });
      }

      window.setTimeout(transition, R.checkStateEvery, from, page, o);
    } else {
      on.emit(page, 'beforetransition', {
        out: false,
        tag: o.tag,
        data: o.data,
        bubbles: true,
        cancelable: true,
      });

      D.select(page);

      transitionComplete(page, o);

      on.emit(page, 'aftertransition', {
        out: false,
        tag: o.tag,
        data: o.data,
        bubbles: true,
        cancelable: true,
      });
    }
  },
}, config);

window.ReUI = ReUI;
export default ReUI;
