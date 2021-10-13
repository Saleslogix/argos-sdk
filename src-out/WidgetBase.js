define('argos/WidgetBase', ['module', 'exports'], function (module, exports) {
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

  var WidgetBase = function () {
    function WidgetBase() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, WidgetBase);

      this.id = options.id || 'generic_widgetbase';
      this.srcNodeRef = null;
      this.domNode = null;
      this.containerNode = null;
      this.ownerDocument = null;
      this.title = '';
      this._started = false;
    }

    _createClass(WidgetBase, [{
      key: 'initSoho',
      value: function initSoho() {}
    }, {
      key: 'updateSoho',
      value: function updateSoho() {}
    }, {
      key: 'get',
      value: function get(prop) {
        console.warn('Attempting to get ' + prop);
      }
    }, {
      key: 'set',
      value: function set(prop, val) {
        console.warn('Attempting to set ' + prop + ' to ' + val);
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        console.warn('subscribe is deprecated.');
      }
    }, {
      key: 'postscript',
      value: function postscript(params, srcNodeRef) {
        this.create(params, srcNodeRef);
      }
    }, {
      key: 'create',
      value: function create(params, srcNodeRef) {
        this.srcNodeRef = $(srcNodeRef);
        this.params = params;
        this.postMixInProperties();

        var srcNodeRefDom = this.srcNodeRef.get(0);
        this.ownerDocument = this.ownerDocument || (srcNodeRefDom ? srcNodeRefDom.ownerDocument : document);

        this.buildRendering();
        this.postCreate();
      }
    }, {
      key: 'postMixInProperties',
      value: function postMixInProperties() {}
    }, {
      key: 'buildRendering',
      value: function buildRendering() {
        var root = null;
        if (this.widgetTemplate && this.widgetTemplate.constructor === Simplate) {
          var templateString = this.widgetTemplate.apply(this);
          root = $(templateString, this.ownerDocument);
        } else if (typeof this.widgetTemplate === 'string') {
          root = $(this.widgetTemplate, this.ownerDocument);
        } else if (this.widgetTemplate instanceof HTMLElement) {
          root = $(this.widgetTemplate).clone();
        }

        if (root.length > 1) {
          root.wrap('<div></div>');
        }

        this.domNode = root.get(0);
      }
    }, {
      key: 'postCreate',
      value: function postCreate() {}
    }, {
      key: 'startup',
      value: function startup() {}
    }, {
      key: 'resize',
      value: function resize() {}
    }, {
      key: 'destroy',
      value: function destroy(preserveDom) {}
    }, {
      key: 'destroyRecursive',
      value: function destroyRecursive(preserveDom) {}
    }, {
      key: 'destroyRendering',
      value: function destroyRendering(preserveDom) {}
    }, {
      key: 'destroyDescendants',
      value: function destroyDescendants(preserveDom) {}
    }, {
      key: 'uninitialize',
      value: function uninitialize() {}
    }, {
      key: 'toString',
      value: function toString() {}
    }, {
      key: 'getChildren',
      value: function getChildren() {}
    }, {
      key: 'getParent',
      value: function getParent() {}
    }, {
      key: 'placeAt',
      value: function placeAt(reference, position) {}
    }]);

    return WidgetBase;
  }();

  exports.default = WidgetBase;
  module.exports = exports['default'];
});