define('argos/Dialogs/Toast', ['module', 'exports'], function (module, exports) {
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

  var Toast = function () {
    function Toast(options) {
      _classCallCheck(this, Toast);

      this.containerNode = options && options.containerNode;
    }

    _createClass(Toast, [{
      key: 'add',
      value: function add() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var sohoToastOptions = {
          title: '',
          message: '',
          position: 'top right',
          timeout: 6000
        };

        // Convert our toast options to soho.
        var convertedOptions = Object.assign({}, sohoToastOptions, {
          title: options.title,
          message: options.message,
          timeout: options.toastTime
        });

        $(this.containerNode).toast(convertedOptions);
      }
    }]);

    return Toast;
  }();

  exports.default = Toast;
  module.exports = exports['default'];
});