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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9EaWFsb2dzL1RvYXN0LmpzIl0sIm5hbWVzIjpbIlRvYXN0Iiwib3B0aW9ucyIsImNvbnRhaW5lck5vZGUiLCJzb2hvVG9hc3RPcHRpb25zIiwidGl0bGUiLCJtZXNzYWdlIiwicG9zaXRpb24iLCJ0aW1lb3V0IiwiY29udmVydGVkT3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsInRvYXN0VGltZSIsIiQiLCJ0b2FzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFrQk1BLEs7QUFDSixtQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQixXQUFLQyxhQUFMLEdBQXFCRCxXQUFXQSxRQUFRQyxhQUF4QztBQUNEOzs7OzRCQUVpQjtBQUFBLFlBQWRELE9BQWMsdUVBQUosRUFBSTs7QUFDaEIsWUFBTUUsbUJBQW1CO0FBQ3ZCQyxpQkFBTyxFQURnQjtBQUV2QkMsbUJBQVMsRUFGYztBQUd2QkMsb0JBQVUsV0FIYTtBQUl2QkMsbUJBQVM7QUFKYyxTQUF6Qjs7QUFPQTtBQUNBLFlBQU1DLG1CQUFtQkMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JQLGdCQUFsQixFQUFvQztBQUMzREMsaUJBQU9ILFFBQVFHLEtBRDRDO0FBRTNEQyxtQkFBU0osUUFBUUksT0FGMEM7QUFHM0RFLG1CQUFTTixRQUFRVTtBQUgwQyxTQUFwQyxDQUF6Qjs7QUFNQUMsVUFBRSxLQUFLVixhQUFQLEVBQXNCVyxLQUF0QixDQUE0QkwsZ0JBQTVCO0FBQ0Q7Ozs7OztvQkFHWVIsSyIsImZpbGUiOiJUb2FzdC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRGlhbG9ncy5Ub2FzdFxyXG4gKi9cclxuY2xhc3MgVG9hc3Qge1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuY29udGFpbmVyTm9kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5jb250YWluZXJOb2RlO1xyXG4gIH1cclxuXHJcbiAgYWRkKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3Qgc29ob1RvYXN0T3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgcG9zaXRpb246ICd0b3AgcmlnaHQnLFxyXG4gICAgICB0aW1lb3V0OiA2MDAwLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IG91ciB0b2FzdCBvcHRpb25zIHRvIHNvaG8uXHJcbiAgICBjb25zdCBjb252ZXJ0ZWRPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgc29ob1RvYXN0T3B0aW9ucywge1xyXG4gICAgICB0aXRsZTogb3B0aW9ucy50aXRsZSxcclxuICAgICAgbWVzc2FnZTogb3B0aW9ucy5tZXNzYWdlLFxyXG4gICAgICB0aW1lb3V0OiBvcHRpb25zLnRvYXN0VGltZSxcclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5jb250YWluZXJOb2RlKS50b2FzdChjb252ZXJ0ZWRPcHRpb25zKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRvYXN0O1xyXG4iXX0=