define('argos/_ActionMixin', ['module', 'exports'], function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _ActionMixin = function () {
    function _ActionMixin() {
      _classCallCheck(this, _ActionMixin);

      this.actionsFrom = 'click';
      this.container = null;
    }

    _createClass(_ActionMixin, [{
      key: 'postCreate',
      value: function postCreate(container) {
        var _this = this;

        // todo: add delegation
        if (!container) {
          return;
        }

        this.container = container;
        this.actionsFrom = this.container.actionsFrom || this.actionsFrom;
        this.actionsFrom.split(',').forEach(function (evt) {
          $(_this.container.domNode).on(evt, _this._initiateActionFromEvent.bind(_this));
        });
      }
    }, {
      key: '_isValidElementForAction',
      value: function _isValidElementForAction(el) {
        var domNode = this.container.domNode;
        var contained = domNode.contains ? domNode !== el && domNode.contains(el) : !!(domNode.compareDocumentPosition(el) & 16);

        return domNode === el || contained;
      }
    }, {
      key: '_initiateActionFromEvent',
      value: function _initiateActionFromEvent(evt) {
        var el = $(evt.target).closest('[data-action]').get(0);
        var action = $(el).attr('data-action');

        if (action && this._isValidElementForAction(el) && this.onCheckAction(action, evt, el)) {
          var parameters = this._getParametersForAction(action, evt, el);
          this.onInvokeAction(action, parameters, evt, el);
          evt.stopPropagation();
        }
      }
    }, {
      key: '_getParametersForAction',
      value: function _getParametersForAction(name, evt, el) {
        var parameters = {
          $event: evt,
          $source: el
        };

        function replace($0, $1, $2) {
          return $1.toUpperCase() + $2;
        }

        for (var i = 0, attrLen = el.attributes.length; i < attrLen; i++) {
          var attributeName = el.attributes[i].name;
          if (/^((?=data-action)|(?!data))/.test(attributeName)) {
            continue;
          }

          /* transform hyphenated names to pascal case, minus the data segment, to be in line with HTML5 dataset naming conventions */
          /* see: http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data */
          /* todo: remove transformation and use dataset when browser support is there */
          var parameterName = attributeName.substr('data-'.length).replace(/-(\w)(\w+)/g, replace);
          parameters[parameterName] = $(el).attr(attributeName);
        }

        return parameters;
      }
    }, {
      key: 'onCheckAction',
      value: function onCheckAction(name, evt, el) {
        return this.hasAction(name, evt, el);
      }
    }, {
      key: 'hasAction',
      value: function hasAction(name /* , evt, el*/) {
        return typeof this.container[name] === 'function';
      }
    }, {
      key: 'onInvokeAction',
      value: function onInvokeAction(name, parameters, evt, el) {
        this.invokeAction(name, parameters, evt, el);
      }
    }, {
      key: 'invokeAction',
      value: function invokeAction(name, parameters, evt, el) {
        return this.container[name].apply(this.container, [parameters, evt, el]);
      }
    }]);

    return _ActionMixin;
  }();

  exports.default = _ActionMixin;
  module.exports = exports['default'];
});