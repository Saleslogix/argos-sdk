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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FcnJvck1hbmFnZXIuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJlcnJvcnMiLCJ3aW5kb3ciLCJsb2NhbFN0b3JhZ2UiLCJKU09OIiwicGFyc2UiLCJnZXRJdGVtIiwiZSIsIl9fY2xhc3MiLCJzZXRPYmplY3QiLCJhYm9ydGVkVGV4dCIsInNjb3BlU2F2ZVRleHQiLCJlcnJvckNhY2hlU2l6ZU1heCIsImFkZFNpbXBsZUVycm9yIiwiZGVzY3JpcHRpb24iLCJlcnJvciIsImVycm9ySXRlbSIsIiRrZXkiLCJEYXRlIiwiZ2V0VGltZSIsIm1vbWVudCIsImZvcm1hdCIsIkRlc2NyaXB0aW9uIiwiRXJyb3IiLCJzdHJpbmdpZnkiLCJzYW5pdGl6ZUZvckpzb24iLCJjaGVja0NhY2hlU2l6ZSIsInB1c2giLCJvbkVycm9yQWRkIiwic2F2ZSIsImFkZEVycm9yIiwic2VydmVyUmVzcG9uc2UiLCJyZXF1ZXN0T3B0aW9ucyIsInZpZXdPcHRpb25zIiwiZmFpbFR5cGUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhcHBseSIsImRhdGVTdGFtcCIsImV4dHJhY3RGYWlsdXJlUmVzcG9uc2UiLCJyZXNwb25zZSIsImZhaWx1cmVSZXNwb25zZSIsIiRkZXNjcmlwdG9yIiwic3RhdHVzVGV4dCIsInJlYWR5U3RhdGUiLCJyZXNwb25zZVhNTCIsInN0YXR1cyIsInJlc3BvbnNlVHlwZSIsIndpdGhDcmVkZW50aWFscyIsInJlc3BvbnNlVGV4dCIsImZyb21Kc29uQXJyYXkiLCJfanNvbiIsIm8iLCJtZXNzYWdlIiwic2V2ZXJpdHkiLCJleHRyYWN0QWJvcnRSZXNwb25zZSIsImFib3J0UmVzcG9uc2UiLCJzZXJpYWxpemVWYWx1ZXMiLCJvYmoiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImVyckxlbmd0aCIsImNhY2hlU2l6ZUluZGV4IiwicmVtb3ZlRXJyb3IiLCJnZXRFcnJvciIsInZhbHVlIiwiZXJyb3JMaXN0IiwiZ2V0QWxsRXJyb3JzIiwiaSIsInBhcnNlSW50IiwiY2xvbmUiLCJpbmRleCIsImFtb3VudCIsInNwbGljZSIsInB1Ymxpc2giLCJyZXNvdXJjZUtpbmQiLCJzZXRJdGVtIiwiY29uc29sZSIsInNob3dFcnJvckRpYWxvZyIsInRpdGxlIiwib25Pa2F5IiwiQXBwIiwibW9kYWwiLCJkaXNhYmxlQ2xvc2UiLCJzaG93VG9vbGJhciIsInJlc29sdmVEZWZlcnJlZCIsInByb21pc2UiLCJjcmVhdGVTaW1wbGVEaWFsb2ciLCJjb250ZW50IiwiZ2V0Q29udGVudCIsInJpZ2h0QnV0dG9uIiwidGhlbiIsImhpZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTUEsV0FBVyxvQkFBWSxjQUFaLENBQWpCO0FBQ0EsTUFBSUMsU0FBUyxFQUFiOztBQUVBLE1BQUk7QUFDRixRQUFJQyxPQUFPQyxZQUFYLEVBQXlCO0FBQ3ZCRixlQUFTRyxLQUFLQyxLQUFMLENBQVdILE9BQU9DLFlBQVAsQ0FBb0JHLE9BQXBCLENBQTRCLFVBQTVCLENBQVgsS0FBdUQsRUFBaEU7QUFDRDtBQUNGLEdBSkQsQ0FJRSxPQUFPQyxDQUFQLEVBQVUsQ0FBRSxDLENBQUE7QUFDZDs7Ozs7QUFLQSxNQUFNQyxVQUFVLGVBQUtDLFNBQUwsQ0FBZSxvQkFBZixFQUFxQyxpQ0FBaUM7QUFDcEY7O0FBRUE7OztBQUdBQyxpQkFBYVYsU0FBU1UsV0FOOEQ7QUFPcEY7OztBQUdBQyxtQkFBZVgsU0FBU1csYUFWNEQ7O0FBWXBGOzs7O0FBSUFDLHVCQUFtQixFQWhCaUU7O0FBa0JwRjs7Ozs7QUFLQUMsb0JBQWdCLFNBQVNBLGNBQVQsQ0FBd0JDLFdBQXhCLEVBQXFDQyxLQUFyQyxFQUE0QztBQUMxRCxVQUFNQyxZQUFZO0FBQ2hCQyxjQUFNLElBQUlDLElBQUosR0FBV0MsT0FBWCxFQURVO0FBRWhCRCxjQUFNRSxTQUFTQyxNQUFULEVBRlU7QUFHaEJDLHFCQUFhUixXQUhHO0FBSWhCUyxlQUFPLE9BQU9SLEtBQVAsS0FBaUIsUUFBakIsR0FB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VUssa0JBQVYsQ0FBNkI7QUFDM0NSLGVBQVFBLEtBQUQsR0FBVUEsS0FBVixHQUFrQixPQURrQjtBQUUzQ1MsaUJBQVNuQyxPQUZrQztBQUczQ29DLG9CQUFZLHNCQUFNO0FBQUU7QUFBUyxTQUhjO0FBSTNDQyxxQkFBYTtBQUo4QixPQUE3QixDQUFoQjtBQU1BSixjQUFRSyxJQUFSLENBQWEsWUFBTTtBQUNqQlYsWUFBSUMsS0FBSixDQUFVQyxZQUFWLEdBQXlCLEtBQXpCO0FBQ0FGLFlBQUlDLEtBQUosQ0FBVVUsSUFBVjtBQUNBLFlBQUlaLE1BQUosRUFBWTtBQUNWQTtBQUNEO0FBQ0YsT0FORDtBQU9EO0FBM1BtRixHQUF0RSxDQUFoQjs7b0JBOFBleEUsTyIsImZpbGUiOiJFcnJvck1hbmFnZXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBjb25uZWN0IGZyb20gJ2Rvam8vX2Jhc2UvY29ubmVjdCc7XHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4vVXRpbGl0eSc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2Vycm9yTWFuYWdlcicpO1xyXG5sZXQgZXJyb3JzID0gW107XHJcblxyXG50cnkge1xyXG4gIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICBlcnJvcnMgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZXJyb3Jsb2cnKSkgfHwgW107XHJcbiAgfVxyXG59IGNhdGNoIChlKSB7fS8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5FcnJvck1hbmFnZXJcclxuICogQGNsYXNzZGVzYyBFcnJvck1hbmFnZXIgaXMgYSBzaW5nbGV0b24gdGhhdCBwYXJzZXMgYW5kIHN0b3JlcyBTRGF0YSBlcnJvciByZXNwb25zZXMgaW50byBsb2NhbFN0b3JhZ2UuXHJcbiAqIEBzaW5nbGV0b25cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBsYW5nLnNldE9iamVjdCgnYXJnb3MuRXJyb3JNYW5hZ2VyJywgLyoqIEBsZW5kcyBhcmdvcy5FcnJvck1hbmFnZXIjICove1xyXG4gIC8vIExvY2FsaXphdGlvblxyXG5cclxuICAvKipcclxuICAgKiBUZXh0IHVzZWQgaW4gcGxhY2Ugb2Ygc3RhdHVzVGV4dCBmb3IgYWJvcnRlZCBlcnJvcnMuXHJcbiAgICovXHJcbiAgYWJvcnRlZFRleHQ6IHJlc291cmNlLmFib3J0ZWRUZXh0LFxyXG4gIC8qKlxyXG4gICAqIFRleHQgcHV0IGluIHBsYWNlIG9mIHRoZSBzY29wZSBwcm9wZXJ0eSB0byBwcmV2ZW50IGNpcmN1bGFyIHJlZmVyZW5jZXMuXHJcbiAgICovXHJcbiAgc2NvcGVTYXZlVGV4dDogcmVzb3VyY2Uuc2NvcGVTYXZlVGV4dCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9XHJcbiAgICogVG90YWwgYW1vdW50IG9mIGVycm9ycyB0byBrZWVwXHJcbiAgICovXHJcbiAgZXJyb3JDYWNoZVNpemVNYXg6IDEwLFxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgY3VzdG9tIGVycm9yIGl0ZW0gYW5kIGZpcmVzIHRoZSBvbkVycm9yQWRkIGV2ZW50XHJcbiAgICogQHBhcmFtIGRlc2NyaXB0aW9uIFNob3J0IHRpdGxlIG9yIGRlc2NyaXB0aW9uIG9mIHRoZSBFcnJvci4gRXg6IER1cGxpY2F0ZSBGb3VuZCwgSW52YWxpZCBFbWFpbFxyXG4gICAqIEBwYXJhbSBlcnJvciBPYmplY3QgVGhlIGVycm9yIG9iamVjdCB0aGF0IHdpbGwgYmUgSlNPTi1zdHJpbmdpZmllZCBhbmQgc3RvcmVkIGZvciB1c2UuXHJcbiAgICovXHJcbiAgYWRkU2ltcGxlRXJyb3I6IGZ1bmN0aW9uIGFkZFNpbXBsZUVycm9yKGRlc2NyaXB0aW9uLCBlcnJvcikge1xyXG4gICAgY29uc3QgZXJyb3JJdGVtID0ge1xyXG4gICAgICAka2V5OiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuICAgICAgRGF0ZTogbW9tZW50KCkuZm9ybWF0KCksXHJcbiAgICAgIERlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcclxuICAgICAgRXJyb3I6IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBlcnJvciA6IEpTT04uc3RyaW5naWZ5KHV0aWxpdHkuc2FuaXRpemVGb3JKc29uKGVycm9yKSksXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY2hlY2tDYWNoZVNpemUoKTtcclxuICAgIGVycm9ycy5wdXNoKGVycm9ySXRlbSk7XHJcbiAgICB0aGlzLm9uRXJyb3JBZGQoKTtcclxuICAgIHRoaXMuc2F2ZSgpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSBjdXN0b20gZXJyb3IgaXRlbSBieSBjb21iaW5pbmcgZXJyb3IgbWVzc2FnZS9vcHRpb25zIGZvciBlYXNpZXIgdGVjaCBzdXBwb3J0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNlcnZlclJlc3BvbnNlIEZ1bGwgcmVzcG9uc2UgZnJvbSBzZXJ2ZXIsIHN0YXR1cywgcmVzcG9uc2V0ZXh0LCBldGMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3RPcHRpb25zIEdFVCBvciBQT1NUIG9wdGlvbnMgc2VudCwgb25seSByZWNvcmRzIHRoZSBVUkwgYXQgdGhpcyB0aW1lXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZpZXdPcHRpb25zIFRoZSBWaWV3IE9wdGlvbnMgb2YgdGhlIHZpZXcgaW4gd2hpY2ggdGhlIGVycm9yIG9jY3VycmVkXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZhaWxUeXBlIEVpdGhlciBcImZhaWx1cmVcIiBvciBcImFib3J0ZWRcIiBhcyBlYWNoIHJlc3BvbnNlIGhhcyBkaWZmZXJlbnQgcHJvcGVydGllc1xyXG4gICAqL1xyXG4gIGFkZEVycm9yOiBmdW5jdGlvbiBhZGRFcnJvcihzZXJ2ZXJSZXNwb25zZSwgcmVxdWVzdE9wdGlvbnMsIHZpZXdPcHRpb25zLCBmYWlsVHlwZSkge1xyXG4gICAgaWYgKHR5cGVvZiBzZXJ2ZXJSZXNwb25zZSA9PT0gJ3N0cmluZycgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICB0aGlzLmFkZFNpbXBsZUVycm9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZVN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICBjb25zdCBlcnJvckl0ZW0gPSB7XHJcbiAgICAgICRrZXk6IGRhdGVTdGFtcCxcclxuICAgICAgRGF0ZTogbW9tZW50KCkuZm9ybWF0KCksXHJcbiAgICAgIEVycm9yOiBKU09OLnN0cmluZ2lmeSh1dGlsaXR5LnNhbml0aXplRm9ySnNvbih7XHJcbiAgICAgICAgc2VydmVyUmVzcG9uc2UsXHJcbiAgICAgICAgcmVxdWVzdE9wdGlvbnMsXHJcbiAgICAgICAgdmlld09wdGlvbnMsXHJcbiAgICAgICAgZmFpbFR5cGUsXHJcbiAgICAgIH0pKSxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jaGVja0NhY2hlU2l6ZSgpO1xyXG4gICAgZXJyb3JzLnB1c2goZXJyb3JJdGVtKTtcclxuICAgIHRoaXMub25FcnJvckFkZCgpO1xyXG4gICAgdGhpcy5zYXZlKCk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRXhwbGljaXRseSBleHRyYWN0IHZhbHVlcyBkdWUgdG8gaG93IHJlYWQtb25seSBvYmplY3RzIGFyZSBlbmZvcmNlZFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBYTUxIdHRwUmVxdWVzdCBvYmplY3Qgc2VudCBiYWNrIGZyb20gc2VydmVyXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3Qgd2l0aCBvbmx5IHJlbGV2YW50LCBzdGFuZGFyZCBwcm9wZXJ0aWVzXHJcbiAgICovXHJcbiAgZXh0cmFjdEZhaWx1cmVSZXNwb25zZTogZnVuY3Rpb24gZXh0cmFjdEZhaWx1cmVSZXNwb25zZShyZXNwb25zZSkge1xyXG4gICAgY29uc3QgZmFpbHVyZVJlc3BvbnNlID0ge1xyXG4gICAgICAkZGVzY3JpcHRvcjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgc2VydmVyUmVzcG9uc2U6IHtcclxuICAgICAgICByZWFkeVN0YXRlOiByZXNwb25zZS5yZWFkeVN0YXRlLFxyXG4gICAgICAgIHJlc3BvbnNlWE1MOiByZXNwb25zZS5yZXNwb25zZVhNTCxcclxuICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcclxuICAgICAgICByZXNwb25zZVR5cGU6IHJlc3BvbnNlLnJlc3BvbnNlVHlwZSxcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHJlc3BvbnNlLndpdGhDcmVkZW50aWFscyxcclxuICAgICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlLnJlc3BvbnNlVGV4dCA/IHRoaXMuZnJvbUpzb25BcnJheShyZXNwb25zZS5yZXNwb25zZVRleHQpIDogJycsXHJcbiAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gZmFpbHVyZVJlc3BvbnNlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGVtcHRzIHRvIHBhcnNlIGEganNvbiBzdHJpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0XHJcbiAgICogVGhlIG5lZWQgZm9yIHRoaXMgZnVuY3Rpb24gaXMgdGhlIGZhbGxiYWNrIGluIGNhc2Ugb2YgZmFpbHVyZVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBqc29uIEpzb24gZm9ybWF0dGVkIHN0cmluZyBvciBhcnJheS5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEphdmFzY3JpcHQgb2JqZWN0IGZyb20ganNvbiBzdHJpbmcuXHJcbiAgICovXHJcbiAgZnJvbUpzb25BcnJheTogZnVuY3Rpb24gZnJvbUpzb25BcnJheShfanNvbikge1xyXG4gICAgbGV0IG87XHJcbiAgICB0cnkge1xyXG4gICAgICBvID0gSlNPTi5wYXJzZShfanNvbik7XHJcbiAgICAgIG8gPSBvWzBdO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBvID0ge1xyXG4gICAgICAgIG1lc3NhZ2U6IF9qc29uLFxyXG4gICAgICAgIHNldmVyaXR5OiAnJyxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBvO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEFib3J0IGVycm9yIGlzIGhhcmRzZXQgZHVlIHRvIGV4Y2VwdGlvbnMgZnJvbSByZWFkaW5nIHByb3BlcnRpZXNcclxuICAgKiBGRiAzLjY6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTIzODU1OVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBYTUxIdHRwUmVxdWVzdCBvYmplY3Qgc2VudCBiYWNrIGZyb20gc2VydmVyXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3Qgd2l0aCBoYXJkc2V0IGFib3J0IGluZm9cclxuICAgKi9cclxuICBleHRyYWN0QWJvcnRSZXNwb25zZTogZnVuY3Rpb24gZXh0cmFjdEFib3J0UmVzcG9uc2UocmVzcG9uc2UpIHtcclxuICAgIGNvbnN0IGFib3J0UmVzcG9uc2UgPSB7XHJcbiAgICAgICRkZXNjcmlwdG9yOiB0aGlzLmFib3J0ZWRUZXh0LFxyXG4gICAgICBzZXJ2ZXJSZXNwb25zZToge1xyXG4gICAgICAgIHJlYWR5U3RhdGU6IDQsXHJcbiAgICAgICAgcmVzcG9uc2VYTUw6ICcnLFxyXG4gICAgICAgIHN0YXR1czogMCxcclxuICAgICAgICByZXNwb25zZVR5cGU6ICcnLFxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogcmVzcG9uc2Uud2l0aENyZWRlbnRpYWxzLFxyXG4gICAgICAgIHJlc3BvbnNlVGV4dDogJycsXHJcbiAgICAgICAgc3RhdHVzVGV4dDogdGhpcy5hYm9ydGVkVGV4dCxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gYWJvcnRSZXNwb25zZTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBQcmVwYXJlcyBhbiBvYmplY3QgZm9yIEpTT04gc2VyaWFsaXphdGlvbiBieSByZWN1cnNpdmVseSBkaXNjYXJkaW5nIG5vbiB2YWx1ZSBrZXlzXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBPYmplY3QgdG8gYmUgSlNPTiBzZXJpYWxpemVkXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBDbGVhbmVkIG9iamVjdCBmb3IgZm9yIEpTT04gc2VyaWFsaXphdGlvblxyXG4gICAqL1xyXG4gIHNlcmlhbGl6ZVZhbHVlczogZnVuY3Rpb24gc2VyaWFsaXplVmFsdWVzKG9iaikge1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZW9mIG9ialtrZXldKSB7Ly9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgICAgICBvYmpba2V5XSA9ICd1bmRlZmluZWQnO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICAgICAgZGVsZXRlIG9ialtrZXldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgICAgIGlmIChvYmpba2V5XSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIG9ialtrZXldID0gJ251bGwnO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnc2NvcGUnKSB7IC8vIGVsaW1pbmF0ZSByZWN1cnNpdmUgc2VsZiBjYWxsXHJcbiAgICAgICAgICAgICAgb2JqW2tleV0gPSB0aGlzLnNjb3BlU2F2ZVRleHQ7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2JqW2tleV0gPSB0aGlzLnNlcmlhbGl6ZVZhbHVlcyhvYmpba2V5XSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRW5zdXJlcyB0aGVyZSBpcyBhdCBsZWFzdCAxIG9wZW4gc3BvdCBmb3IgYSBuZXcgZXJyb3IgYnkgY2hlY2tpbmcgYWdhaW5zdCBlcnJvckNhY2hlU2l6ZU1heFxyXG4gICAqIGFuZCByZW1vdmluZyBvbGQgZXJyb3JzIGFzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGNoZWNrQ2FjaGVTaXplOiBmdW5jdGlvbiBjaGVja0NhY2hlU2l6ZSgpIHtcclxuICAgIGNvbnN0IGVyckxlbmd0aCA9IGVycm9ycy5sZW5ndGg7XHJcbiAgICBjb25zdCBjYWNoZVNpemVJbmRleCA9IHRoaXMuZXJyb3JDYWNoZVNpemVNYXggLSAxO1xyXG5cclxuICAgIGlmIChlcnJMZW5ndGggPiBjYWNoZVNpemVJbmRleCkge1xyXG4gICAgICB0aGlzLnJlbW92ZUVycm9yKDAsIGVyckxlbmd0aCAtIGNhY2hlU2l6ZUluZGV4KTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZXRyaWV2ZSBhIGVycm9yIGl0ZW0gdGhhdCBoYXMgdGhlIHNwZWNpZmllZCBrZXl8dmFsdWUgcGFpclxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgUHJvcGVydHkgb2YgZXJyb3IgaXRlbSB0byBjaGVjaywgc3VjaCBhcyBlcnJvckRhdGUgb3IgdXJsXHJcbiAgICogQHBhcmFtIHtOdW1iZXIvU3RyaW5nfSB2YWx1ZSBWYWx1ZSBvZiB0aGUga2V5IHRvIG1hdGNoIGFnYWluc3RcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgdGhlIGZpcnN0IGVycm9yIGl0ZW0gaW4gdGhlIG1hdGNoIHNldCBvciBudWxsIGlmIG5vbmUgZm91bmRcclxuICAgKi9cclxuICBnZXRFcnJvcjogZnVuY3Rpb24gZ2V0RXJyb3Ioa2V5LCB2YWx1ZSkge1xyXG4gICAgY29uc3QgZXJyb3JMaXN0ID0gdGhpcy5nZXRBbGxFcnJvcnMoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZXJyb3JMaXN0W2ldW2tleV0gPT09IHBhcnNlSW50KHZhbHVlLCAxMCkpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3JMaXN0W2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIGNvcHkgb2YgYWxsIGVycm9ycy5cclxuICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gQXJyYXkgb2YgZXJyb3Igb2JqZWN0cy5cclxuICAgKi9cclxuICBnZXRBbGxFcnJvcnM6IGZ1bmN0aW9uIGdldEFsbEVycm9ycygpIHtcclxuICAgIHJldHVybiBsYW5nLmNsb25lKGVycm9ycyk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGluZGV4IGZyb20gdGhlIGVycm9yIGxpc3QuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEluZGV4IG9mIGVycm9yIHRvIHJlbW92ZS5cclxuICAgKiBAcGFyYW0ge051bWJlcn0gYW1vdW50IE51bWJlciBvZiBlcnJvcnMgdG8gcmVtb3ZlIGZyb20gaW5kZXhlZCBwb2ludCwgaWYgbm90IHByb3ZpZGVkIGRlZmF1bHRzIHRvIDEuXHJcbiAgICovXHJcbiAgcmVtb3ZlRXJyb3I6IGZ1bmN0aW9uIHJlbW92ZUVycm9yKGluZGV4LCBhbW91bnQpIHtcclxuICAgIGVycm9ycy5zcGxpY2UoaW5kZXgsIGFtb3VudCB8fCAxKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBQdWJsaXNoZXMgdGhlIGAvYXBwL3JlZnJlc2hgIGV2ZW50IHRvIG5vdGlmeSB0aGF0IGFuIGVycm9yIGhhcyBiZWVuIGFkZGVkXHJcbiAgICovXHJcbiAgb25FcnJvckFkZDogZnVuY3Rpb24gb25FcnJvckFkZCgpIHtcclxuICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9yZWZyZXNoJywgW3tcclxuICAgICAgcmVzb3VyY2VLaW5kOiAnZXJyb3Jsb2dzJyxcclxuICAgIH1dKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBdHRlbXB0cyB0byBzYXZlIGFsbCBlcnJvcnMgaW50byBsb2NhbFN0b3JhZ2UgdW5kZXIgdGhlIGBlcnJvcmxvZ2Aga2V5LlxyXG4gICAqL1xyXG4gIHNhdmU6IGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZXJyb3Jsb2cnLCBKU09OLnN0cmluZ2lmeShlcnJvcnMpKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGUpOy8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvd0Vycm9yRGlhbG9nOiBmdW5jdGlvbiBzaG93RXJyb3JEaWFsb2codGl0bGUsIG1lc3NhZ2UsIG9uT2theSkge1xyXG4gICAgQXBwLm1vZGFsLmRpc2FibGVDbG9zZSA9IHRydWU7XHJcbiAgICBBcHAubW9kYWwuc2hvd1Rvb2xiYXIgPSB0cnVlO1xyXG4gICAgQXBwLm1vZGFsLnJlc29sdmVEZWZlcnJlZCh0cnVlKTtcclxuICAgIGNvbnN0IHByb21pc2UgPSBBcHAubW9kYWwuY3JlYXRlU2ltcGxlRGlhbG9nKHtcclxuICAgICAgdGl0bGU6ICh0aXRsZSkgPyB0aXRsZSA6ICdhbGVydCcsXHJcbiAgICAgIGNvbnRlbnQ6IG1lc3NhZ2UsXHJcbiAgICAgIGdldENvbnRlbnQ6ICgpID0+IHsgcmV0dXJuOyB9LFxyXG4gICAgICByaWdodEJ1dHRvbjogJ29rYXknLFxyXG4gICAgfSk7XHJcbiAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICAgIEFwcC5tb2RhbC5oaWRlKCk7XHJcbiAgICAgIGlmIChvbk9rYXkpIHtcclxuICAgICAgICBvbk9rYXkoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=