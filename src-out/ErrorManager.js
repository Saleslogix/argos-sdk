define('argos/ErrorManager', ['module', 'exports', 'dojo/_base/lang', 'dojo/_base/connect', './Utility', './I18n'], function (module, exports, _lang, _connect, _Utility, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  var _connect2 = _interopRequireDefault(_connect);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var resource = (0, _I18n2.default)('errorManager');
  var errors = [];

  try {
    if (window.localStorage) {
      errors = JSON.parse(window.localStorage.getItem('errorlog')) || [];
    }
  } catch (e) {} // eslint-disable-line
  /**
   * @class argos.ErrorManager
   * @classdesc ErrorManager is a singleton that parses and stores SData error responses into localStorage.
   * @singleton
   */
  var __class = _lang2.default.setObject('argos.ErrorManager', /** @lends argos.ErrorManager# */{
    // Localization

    /**
     * Text used in place of statusText for aborted errors.
     */
    abortedText: resource.abortedText,
    /**
     * Text put in place of the scope property to prevent circular references.
     */
    scopeSaveText: resource.scopeSaveText,

    /**
     * @property {Number}
     * Total amount of errors to keep
     */
    errorCacheSizeMax: 10,

    /**
     * Adds a custom error item and fires the onErrorAdd event
     * @param description Short title or description of the Error. Ex: Duplicate Found, Invalid Email
     * @param error Object The error object that will be JSON-stringified and stored for use.
     */
    addSimpleError: function addSimpleError(description, error) {
      var errorItem = {
        $key: new Date().getTime(),
        Date: moment().format(),
        Description: description,
        Error: typeof error === 'string' ? error : JSON.stringify(_Utility2.default.sanitizeForJson(error))
      };

      this.checkCacheSize();
      errors.push(errorItem);
      this.onErrorAdd();
      this.save();
    },

    /**
     * Adds a custom error item by combining error message/options for easier tech support
     * @param {Object} serverResponse Full response from server, status, responsetext, etc.
     * @param {Object} requestOptions GET or POST options sent, only records the URL at this time
     * @param {Object} viewOptions The View Options of the view in which the error occurred
     * @param {String} failType Either "failure" or "aborted" as each response has different properties
     */
    addError: function addError(serverResponse, requestOptions, viewOptions, failType) {
      if (typeof serverResponse === 'string' && arguments.length === 2) {
        this.addSimpleError.apply(this, arguments); //eslint-disable-line
        return;
      }

      var dateStamp = new Date().getTime();
      var errorItem = {
        $key: dateStamp,
        Date: moment().format(),
        Error: JSON.stringify(_Utility2.default.sanitizeForJson({
          serverResponse: serverResponse,
          requestOptions: requestOptions,
          viewOptions: viewOptions,
          failType: failType
        }))
      };

      this.checkCacheSize();
      errors.push(errorItem);
      this.onErrorAdd();
      this.save();
    },

    /**
     * Explicitly extract values due to how read-only objects are enforced
     * @param {Object} response XMLHttpRequest object sent back from server
     * @return {Object} Object with only relevant, standard properties
     */
    extractFailureResponse: function extractFailureResponse(response) {
      var failureResponse = {
        $descriptor: response.statusText,
        serverResponse: {
          readyState: response.readyState,
          responseXML: response.responseXML,
          status: response.status,
          responseType: response.responseType,
          withCredentials: response.withCredentials,
          responseText: response.responseText ? this.fromJsonArray(response.responseText) : '',
          statusText: response.statusText
        }
      };
      return failureResponse;
    },

    /**
     * Attempts to parse a json string into a javascript object
     * The need for this function is the fallback in case of failure
     * @param {String} json Json formatted string or array.
     * @return {Object} Javascript object from json string.
     */
    fromJsonArray: function fromJsonArray(_json) {
      var o = void 0;
      try {
        o = JSON.parse(_json);
        o = o[0];
      } catch (e) {
        o = {
          message: _json,
          severity: ''
        };
      }
      return o;
    },

    /**
     * Abort error is hardset due to exceptions from reading properties
     * FF 3.6: https://bugzilla.mozilla.org/show_bug.cgi?id=238559
     * @param {Object} response XMLHttpRequest object sent back from server
     * @return {Object} Object with hardset abort info
     */
    extractAbortResponse: function extractAbortResponse(response) {
      var abortResponse = {
        $descriptor: this.abortedText,
        serverResponse: {
          readyState: 4,
          responseXML: '',
          status: 0,
          responseType: '',
          withCredentials: response.withCredentials,
          responseText: '',
          statusText: this.abortedText
        }
      };
      return abortResponse;
    },

    /**
     * Prepares an object for JSON serialization by recursively discarding non value keys
     * @param {Object} obj Object to be JSON serialized
     * @return {Object} Cleaned object for for JSON serialization
     */
    serializeValues: function serializeValues(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          switch (_typeof(obj[key])) {//eslint-disable-line
            case 'undefined':
              obj[key] = 'undefined';
              break;
            case 'function':
              delete obj[key];
              break;
            case 'object':
              if (obj[key] === null) {
                obj[key] = 'null';
                break;
              }

              if (key === 'scope') {
                // eliminate recursive self call
                obj[key] = this.scopeSaveText;
                break;
              }
              obj[key] = this.serializeValues(obj[key]);
              break;
          }
        }
      }

      return obj;
    },

    /**
     * Ensures there is at least 1 open spot for a new error by checking against errorCacheSizeMax
     * and removing old errors as needed
     */
    checkCacheSize: function checkCacheSize() {
      var errLength = errors.length;
      var cacheSizeIndex = this.errorCacheSizeMax - 1;

      if (errLength > cacheSizeIndex) {
        this.removeError(0, errLength - cacheSizeIndex);
      }
    },

    /**
     * Retrieve a error item that has the specified key|value pair
     * @param {String} key Property of error item to check, such as errorDate or url
     * @param {Number/String} value Value of the key to match against
     * @return {Object} Returns the first error item in the match set or null if none found
     */
    getError: function getError(key, value) {
      var errorList = this.getAllErrors();

      for (var i = 0; i < errorList.length; i++) {
        if (errorList[i][key] === parseInt(value, 10)) {
          return errorList[i];
        }
      }

      return null;
    },

    /**
     * Returns a copy of all errors.
     * @return {Object[]} Array of error objects.
     */
    getAllErrors: function getAllErrors() {
      return _lang2.default.clone(errors);
    },

    /**
     * Removes the specified index from the error list.
     * @param {Number} index Index of error to remove.
     * @param {Number} amount Number of errors to remove from indexed point, if not provided defaults to 1.
     */
    removeError: function removeError(index, amount) {
      errors.splice(index, amount || 1);
    },

    /**
     * Publishes the `/app/refresh` event to notify that an error has been added
     */
    onErrorAdd: function onErrorAdd() {
      _connect2.default.publish('/app/refresh', [{
        resourceKind: 'errorlogs'
      }]);
    },

    /**
     * Attempts to save all errors into localStorage under the `errorlog` key.
     */
    save: function save() {
      try {
        if (window.localStorage) {
          window.localStorage.setItem('errorlog', JSON.stringify(errors));
        }
      } catch (e) {
        console.error(e); //eslint-disable-line
      }
    },
    showErrorDialog: function showErrorDialog(title, message, onOkay) {
      App.modal.disableClose = true;
      App.modal.showToolbar = true;
      App.modal.resolveDeferred(true);
      var promise = App.modal.createSimpleDialog({
        title: title ? title : 'alert',
        content: message,
        getContent: function getContent() {
          return;
        },
        rightButton: 'okay'
      });
      promise.then(function () {
        App.modal.disableClose = false;
        App.modal.hide();
        if (onOkay) {
          onOkay();
        }
      });
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});