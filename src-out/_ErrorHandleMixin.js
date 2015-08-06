define('argos/_ErrorHandleMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/array'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseArray) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _array = _interopRequireDefault(_dojo_baseArray);

  /**
   * @class argos._ErrorHandleMixin
   * General mixin for handling errors in a chainable fashion.
   * @alternateClassName _ErrorHandleMixin
   */
  var __class = (0, _declare['default'])('argos._ErrorHandleMixin', null, {
    /**
     * @property {Object}
     * Localized error messages. One general error message, and messages by HTTP status code.
     */
    errorText: {
      general: 'A server error occured.',
      status: {}
    },
    /**
     * @property {Object}
     * Http Error Status codes. See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
     */
    HTTP_STATUS: {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTH_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      REQUEST_ENTITY_TOO_LARGE: 413,
      REQUEST_URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      REQUESTED_RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417
    },
    /**
     * @property {Array} errorHandlers
     * Array of objects that should contain a name string property, test function, and handle function.
     *
     */
    errorHandlers: null,

    /**
     * @return {Array} Returns an array of error handlers
     */
    createErrorHandlers: function createErrorHandlers() {
      return this.errorHandlers || [];
    },
    /**
     * Starts matching and executing errorHandlers.
     * @param {Error} error Error to pass to the errorHandlers
     */
    handleError: function handleError(error) {
      if (!error) {
        return;
      }

      function noop() {}

      var matches = _array['default'].filter(this.errorHandlers, (function filter(handler) {
        return handler.test && handler.test.call(this, error);
      }).bind(this));

      var len = matches.length;

      var getNext = (function getNext(index) {
        // next() chain has ended, return a no-op so calling next() in the last chain won't error
        if (index === len) {
          return noop;
        }

        // Return a closure with index and matches captured.
        // The handle function can call its "next" param to continue the chain.
        return (function next() {
          var nextHandler = matches[index];
          var nextFn = nextHandler && nextHandler.handle;

          nextFn.call(this, error, getNext(index + 1));
        }).bind(this);
      }).bind(this);

      if (len > 0 && matches[0].handle) {
        // Start the handle chain, the handle can call next() to continue the iteration
        matches[0].handle.call(this, error, getNext(1));
      }
    },
    /**
     * Gets the general error message, or the error message for the status code.
     */
    getErrorMessage: function getErrorMessage(error) {
      var message = this.errorText.general;

      if (error) {
        message = this.errorText.status[error.status] || this.errorText.general;
      }

      return message;
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile._ErrorHandleMixin', __class);
  module.exports = __class;
});
