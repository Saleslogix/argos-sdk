import on from 'dojo/on';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import React from 'react';
import { Provider } from 'react-redux';
import page from 'page';

export default class ViewComponent extends React.Component {
  // Mounting lifecycle
  // See: https://facebook.github.io/react/docs/react-component.html
  constructor(props) {
    super(props);
    // todo: use proptype validation
    this.id = props.id;
    this.route = props.route || this.id;
    this._started = false;
    this.currentHash = '';
    this.title = props.title || '';
  }

  componentWillMount() {
  }

  render() {
    console.dir(this.props);
    console.dir(this.state);
    return (
      <Provider
        store={this.props.store}
        >
          <div
            title={this.props.title}
            ref={(div) => { this.domNode = div; }}>
            {this.props.children}
          </div>
      </Provider>
    );
  }

  componentDidMount() {
  }

  // Updating lifecycle
  componentWillReceiveProps(nextProps) {// eslint-disable-line
  }

  shouldComponentUpdate(nextProps, nextState) {// eslint-disable-line
    return true;
  }

  componentWillUpdate(nextProps, nextState) {// eslint-disable-line
  }

  componentDidUpdate(prevProps, prevState) {// eslint-disable-line
  }

  // Unmounting lifecycle
  componentWillUnmount() {
  }

  // Legacy
  onShow() {
  }

  init() {

  }

  placeAt() {
    this._started = true;
  }

  refreshRequiredFor(options) {// eslint-disable-line
  }

  getTag() {
  }

  getRoute() {
    if ((typeof this.route === 'string' && this.route.length > 0) || this.route instanceof RegExp) {
      return this.route;
    }

    return this.id;
  }

  buildRoute() {
    return this.id;
  }

  routeLoad(ctx, next) {
    next();
  }

  routeShow(ctx, next) {// eslint-disable-line
    this.open();
  }

  getContext() {
    return {
      id: this.id,
    };
  }

  show(options, transitionOptions) {
    if (this.onShow(this) === false) {
      return;
    }

    if (this.refreshRequiredFor(options)) {
      this.refreshRequired = true;
    }

    this.options = options || this.options || {};

    const tag = this.getTag();
    const data = this.getContext();

    const newOptions = Object.assign(transitionOptions || {}, {
      tag,
      data,
    });
    this._transitionOptions = newOptions;
    page(this.buildRoute());
  }

  open() {
    const p = this.domNode.parentNode;
    const options = this._transitionOptions || {};

    if (!p) {
      return;
    }

    App.setPrimaryTitle(this.title);

    if (options.track !== false) {
      const count = App.context.history.length;
      const hash = location.hash;
      let position = -1;

      // do loop and trim
      for (position = count - 1; position >= 0; position--) {
        if (App.context.history[position].hash === hash) {
          break;
        }
      }

      if ((position > -1) && (position === (count - 2))) {
        // Added check if history item is just one back.

        App.context.history = App.context.history.splice(0, position + 1);

        this.currentHash = hash;

        // indicate that context.history has already been taken care of (i.e. nothing needs to be pushed).
        options.trimmed = true;
        // trim up the browser history
        // if the requested hash does not equal the current location hash, trim up history.
        // location hash will not match requested hash when show is called directly, but will match
        // for detected location changes (i.e. the back button).
      } else if (options.returnTo) {
        if (typeof options.returnTo === 'function') {
          for (position = count - 1; position >= 0; position--) {
            if (options.returnTo(App.context.history[position])) {
              break;
            }
          }
        } else if (options.returnTo < 0) {
          position = (count - 1) + options.returnTo;
        }

        if (position > -1) {
          // we fix up the history, but do not flag as trimmed, since we do want the new view to be pushed.
          App.context.history = App.context.history.splice(0, position + 1);

          this.currentHash = App.context.history[App.context.history.length - 1] && App.context.history[App.context.history.length - 1].hash;
        }
      }
    }

    // don't auto-scroll by default if reversing
    if (options.reverse && typeof options.scroll === 'undefined') {
      options.scroll = !options.reverse;
    }

    on.emit(p, 'load', {
      bubbles: false,
      cancelable: true,
    });

    const from = App.getCurrentPage();

    if (from) {
      on.emit(from, 'blur', {
        bubbles: false,
        cancelable: true,
      });
    }

    App.setCurrentPage(p);

    on.emit(p, 'focus', {
      bubbles: false,
      cancelable: true,
    });

    if (from && domAttr.get(p, 'selected') !== 'true') {
      if (options.reverse) {
        on.emit(p, 'unload', {
          bubbles: false,
          cancelable: true,
        });
      }

      window.setTimeout(this.transition.bind(this), App.checkOrientationTime, from, p, options);
    } else {
      on.emit(p, 'beforetransition', {
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });

      this.select(p);

      this.transitionComplete(p, options);

      on.emit(p, 'aftertransition', {
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });
    }
  }

  transition(from, to, options) {
    function complete() {
      this.transitionComplete(to, options);
      domClass.remove(document.body, 'transition');

      App.startOrientationCheck();
      on.emit(from, 'aftertransition', {
        out: true,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });
      on.emit(to, 'aftertransition', {
        out: false,
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });

      if (options.complete) {
        options.complete(from, to, options);
      }
    }

    App.stopOrientationCheck();
    domClass.add(document.body, 'transition');

    // dispatch an 'show' event to let the page be aware that is being show as the result of an external
    // event (i.e. browser back/forward navigation).
    if (options.external) {
      on.emit(to, 'show', {
        tag: options.tag,
        data: options.data,
        bubbles: true,
        cancelable: true,
      });
    }

    on.emit(from, 'beforetransition', {
      out: true,
      tag: options.tag,
      data: options.data,
      bubbles: true,
      cancelable: true,
    });
    on.emit(to, 'beforetransition', {
      out: false,
      tag: options.tag,
      data: options.data,
      bubbles: true,
      cancelable: true,
    });

    this.unselect(from);
    this.select(to);
    complete.apply(this);
  }

  transitionComplete(_page, options) {
    if (options.track !== false) {
      this.currentHash = location.hash;

      if (options.trimmed !== true) {
        App.context.history.push({
          hash: this.currentHash,
          page: this.id,
          tag: options.tag,
          data: options.data,
        });
      }
    }
  }

  select(node) {
    domAttr.set(node, 'selected', 'true');
  }

  unselect(node) {
    domAttr.remove(node, 'selected');
  }
}
