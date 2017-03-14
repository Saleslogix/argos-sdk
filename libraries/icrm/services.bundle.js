(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ICRMServicesSDK"] = factory();
	else
		root["ICRMServicesSDK"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caching = __webpack_require__(1);

Object.keys(_caching).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _caching[key];
    }
  });
});

var _mingle = __webpack_require__(2);

Object.keys(_mingle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mingle[key];
    }
  });
});

var _picklist = __webpack_require__(3);

Object.keys(_picklist).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _picklist[key];
    }
  });
});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneralMessages = {
  MissingRequiredFunctionalityError: 'The store provided was not compatible with the generic storage service. the store needs to have the following methods methods: getItem, setItem, removeItem.',
  NoInputNothingSetWarning: 'Nothing was set, input was null.',

  NamespaceAndNameParameterError: 'namespaceOrKey is required to be a string value.'

};
var CachingServiceMessages = exports.CachingServiceMessages = {
  constructorError: GeneralMessages.MissingRequiredFunctionalityError,
  setCacheStorageError: GeneralMessages.MissingRequiredFunctionalityError,
  setCacheStorageWarning: GeneralMessages.NoInputNothingSetWarning,
  getItemError: GeneralMessages.NamespaceAndNameParameterError,
  setItemError: GeneralMessages.NamespaceAndNameParameterError,
  removeItemError: GeneralMessages.NamespaceAndNameParameterError
};

/**
 * Caching Service class to act as a wrapper for different web/browser data stores.
 * @class CachingService
 */

var CachingService = exports.CachingService = function () {
  /**
   * Initialize Sage.CachingService, a simple wrapper for different web/browser data stores.
   * @param {Object} storage  Will normally be either localStorage, or sessionStorage, but does not need to be.
   *      Though it must have the following functions:
   *                  getItem()
   *                  setItem()
   *                  removeItem()
   */
  function CachingService(storage /*= localStorage*/) {
    _classCallCheck(this, CachingService);

    this.setCacheStorage(storage);
  }

  /**
   * @function set the data store used by this class.
   *
   * @param {Object} storage  Will normally be either localStorage, or sessionStorage, but does not need to be.
   *      Though it must have the following functions:
   *                  getItem()
   *                  setItem()
   *                  removeItem()
   */


  _createClass(CachingService, [{
    key: 'setCacheStorage',
    value: function setCacheStorage(storage) {
      if (storage) {
        if (typeof storage.getItem === 'function' && typeof storage.setItem === 'function' && typeof storage.removeItem === 'function') {
          this._cacheStorage = storage;
        } else {
          throw new Error(CachingServiceMessages.setCacheStorageError);
        }
      } else {
        console.warn(CachingServiceMessages.setCacheStorageWarning); //eslint-disable-line
      }
    }

    /**
     * @function retrieve the data store used by this class.
     */

  }, {
    key: 'getCacheStorage',
    value: function getCacheStorage() {
      return this._cacheStorage;
    }

    /**
     * @function retrieve an item from the data store.
     *
     * @param {String} namespaceOrKey is either the key, or a descriptor of what is stored, used as part of the key to retrieve the item.
     * @param {String} name the name of the item stored, used with the namespace to form the key.
     */

  }, {
    key: 'getItem',
    value: function getItem(namespaceOrKey, name) {
      if (typeof namespaceOrKey === 'string' && typeof name === 'string') {
        return JSON.parse(this._cacheStorage.getItem(namespaceOrKey + '_' + name));
      } else if (typeof namespaceOrKey === 'string') {
        return this._cacheStorage.getItem('' + namespaceOrKey);
      }
      throw new Error(CachingServiceMessages.getItemError);
    }

    /**
     * @function save an item from the data store.
     *
     * @param {String} namespaceOrKey is either the key, or a descriptor of the item, used as part of the key to save the item.
     * @param {String} name the name of the item, used with the namespace to form the key.
     * @param {Object} item the item to be saved to the data store.
     */

  }, {
    key: 'setItem',
    value: function setItem(namespaceOrKey, name, item) {
      if (typeof namespaceOrKey === 'string' && typeof name === 'string') {
        /*
         * - should we allow nulls to be stored?
         * - do we need to JSON.strinfy(item)?
         */
        this._cacheStorage.setItem(namespaceOrKey + '_' + name, JSON.stringify(item));
      } else if (typeof namespaceOrKey === 'string') {
        // should we allow nulls to be stored?
        this._cacheStorage.setItem('' + namespaceOrKey, item);
      } else {
        throw new Error(CachingServiceMessages.setItemError);
      }
    }

    /**
     * @function remove an item from the data store.
     *
     * @param {String} namespaceOrKey is either the key, or a descriptor of what is stored, used as part of the key to remove the item.
     * @param {String} name the name of the item stored, used with the namespace to form the key.
     */

  }, {
    key: 'removeItem',
    value: function removeItem(namespaceOrKey, name) {
      if (typeof namespaceOrKey === 'string' && typeof name === 'string') {
        // should we allow nulls to be stored?
        this._cacheStorage.removeItem(namespaceOrKey + '_' + name);
      } else if (typeof namespaceOrKey === 'string') {
        // should we allow nulls to be stored?
        this._cacheStorage.removeItem('' + namespaceOrKey);
      } else {
        throw new Error(CachingServiceMessages.removeItemError);
      }
    }
  }]);

  return CachingService;
}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Mingle Service class to handle single sign on and other Ming.le functions
 * @class MingleService
 */
var MingleService = exports.MingleService = function () {
  /**
   * Instantiates the MingleService object
   * @param {Object} options Takes in a configuration object with the following structure:
   * {
   *    accessToken: string;
   *    application: Object; // Based on mobile's version of an application
   *    location: Object; // Based on the window.location
   *    mingleConfig: {
   *      mingleSettings: {
   *        ci: string;
   *        pu: string;
   *        oa: string;
   *      },
   *      mingleRedirectUrl: string;
   *    };
   *    redirectAction: function(url: string) => void;
   *    responseType: string; // Defaulted to 'token'
   * }
   */
  function MingleService() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MingleService);

    this.accessToken = options.accessToken || '';
    this.application = options.application || {};
    this.location = options.location || window.location;
    this.mingleConfig = options.mingleConfig || {};
    this.redirectAction = options.redirectAction || function redirect(url) {
      this.location.href = url;
    }.bind(this);
    this.responseType = options.responseType || 'token';
  }
  /**
   * @function Populates the access token based on the passed parameters
   * @param {Object} state The current state to be bound to the url request
   */


  _createClass(MingleService, [{
    key: 'redirectToMingle',
    value: function redirectToMingle(state) {
      var authorizationUrl = this.mingleConfig.mingleSettings.pu + this.mingleConfig.mingleSettings.oa;
      var redirectURI = this.mingleConfig.mingleRedirectUrl;
      var clientId = this.mingleConfig.mingleSettings.ci;
      var url = authorizationUrl + '?' + ('client_id=' + encodeURI(clientId) + '&') + ('redirect_uri=' + encodeURI(redirectURI) + '&') + ('response_type=' + encodeURI(this.responseType) + '&') + ('state=' + encodeURI(state) + '&') + 'include_granted_scopes=false';
      this.redirectAction(url);
    }
    /**
     * @function Refreshes the access token for Ming.le
     */

  }, {
    key: 'refreshAccessToken',
    value: function refreshAccessToken() {
      if (!this.application.isOnline()) {
        this.application.requiresMingleRefresh = true;
        return;
      }

      var hash = 'mingleRefresh'; // location.hash.substring(2);
      var state = '';
      if (hash) {
        state = '/redirectTo/' + hash;
      }
      this.redirectToMingle(state);
    }
    /**
     * @function Populates the access token based on the passed parameters
     * @param {Object} toast The toast service used by the application, expects a function 'add'
     *  that is passed the following object:
     *    {
     *      message: string;
     *      title: string;
     *      toastTime: number;
     *      showProgressBar: boolean;
     *    }
     * @param {string} refreshText The message to be displayed by the toast service
     * @param {string} refreshTitle The title of the toast to display when refreshing the token
     */

  }, {
    key: 'populateAccessToken',
    value: function populateAccessToken(toast) {
      var _this = this;

      var refreshText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Refreshing Ming.le token...';
      var refreshTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Ming.le';

      var hash = this.location.hash.substring(1);
      var result = void 0;
      if (hash) {
        result = hash.split('&').reduce(function (values, item) {
          var parts = item.split('=');
          values[parts[0]] = parts[1];
          return values;
        }, {});

        if (result.access_token) {
          this.accessToken = result.access_token;
          if (result.expires_in) {
            // result.expires_in = '420'; // Refresh Test
            setTimeout(function () {
              toast.add({ message: refreshText, title: refreshTitle, toastTime: 300 * 1000, showProgressBar: true });
              setTimeout(function () {
                _this.refreshAccessToken(_this.mingleConfig);
              }, 300 * 1000);
              // Show message to user before 5 minutes of refresh (300 seconds)
            }, (result.expires_in - 300) * 1000);
          }
        }
      }

      if (result) {
        if (result.access_token || result.error) {
          return result;
        }
      }

      this.redirectToMingle(hash);
    }
  }]);

  return MingleService;
}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Picklist Service class
 */
var PickListService = exports.PickListService = function () {
  /**
   * Initialize Sage.PickListService
   * @param {Object} storage
   * @param {Object} service
   */
  function PickListService() {
    var storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var service = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, PickListService);

    this._storage = storage;
    this._service = service;
    this._uri = {};
    this._storageNameSpace = 'PickListData';
    this._storagePropertyDataTypeNameSpace = 'PickListData_PropertyDataType';
    this._storageFormDataTypeNameSpace = 'PickListData_FormDataType';
  }
  /** CRUD **/
  /** Create **/
  /**
   * @function create a picklist header record.
   * @param {PickListObject} header
   * @param {Function} callback defines how to react to a repsonse that is successful.
   * @param {Function} onError defines how to react to a repsonse that is an error.
   * @param {Object} scope provides access to variables needed inside the response.
   */


  _createClass(PickListService, [{
    key: 'createHeader',
    value: function createHeader(header, callback, onError, scope) {
      this._notImplemented('createHeader', { header: header, callback: callback, onError: onError, scope: scope });
    }
    /**
     * @function create a picklist item record.
     * @param {String} headerId refers to a picklist header by its id.
     * @param {PickListItemObject} item
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'createItemByHeaderID',
    value: function createItemByHeaderID(headerId, item, callback, onError, scope) {
      this.createItemByHeaderKey(headerId, true, item, callback, onError, scope);
    }
    /**
     * @function create a picklist item record.
     * @param {String} headerName refers to a picklist header by its name.
     * @param {PickListItemObject} item
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'createItemByHeaderName',
    value: function createItemByHeaderName(headerName, item, callback, onError, scope) {
      this.createItemByHeaderKey(headerName, false, item, callback, onError, scope);
    }
    /**
     * @function create a picklist item record.
     * @param {String} headerKey refers to a picklist by either the Id or Name value.
     * @param {Boolean} isId true ? the headerKey is an Id : the headerKey is a Name
     * @param {PickListItemObject} item
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'createItemByHeaderKey',
    value: function createItemByHeaderKey(headerKey, isId, item, callback, onError, scope) {
      this._notImplemented('createItemByHeaderKey', { headerKey: headerKey, isId: isId, item: item, callback: callback, onError: onError, scope: scope });
    }
    /**
     * @function create a picklist item record.
     * @param {String} headerId refers to a picklist header by its id.
     * @param {PickListItemObject[]} itemArr
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'createItemsByHeaderID',
    value: function createItemsByHeaderID(headerId, itemArr, callback, onError, scope) {
      this.createItemsByHeaderKey(headerId, true, itemArr, callback, onError, scope);
    }
    /**
     * @function create a picklist item record.
     * @param {String} headerName refers to a picklist header by its name.
     * @param {PickListItemObject[]} itemArr
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'createItemsByHeaderName',
    value: function createItemsByHeaderName(headerName, itemArr, callback, onError, scope) {
      this.createItemsByHeaderKey(headerName, false, itemArr, callback, onError, scope);
    }
    /**
     * @function create a picklist item record.
     * @param {String} headerKey refers to a picklist by either the Id or Name value.
     * @param {Boolean} isId true ? the headerKey is an Id : the headerKey is a Name
     * @param {PickListItemObject[]} itemArr
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'createItemsByHeaderKey',
    value: function createItemsByHeaderKey(headerKey, isId, itemArr, callback, onError, scope) {
      this._notImplemented('createItemsByHeaderKey', { headerKey: headerKey, isId: isId, itemArr: itemArr, callback: callback, onError: onError, scope: scope });
    }

    /** Request **/
    /** header and items **/
    /**
     * @function get one picklist(this first found) record with items.
     * @param {String} name refers to the name property of a picklist header.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'getFirstByName',
    value: function getFirstByName(name, callback, onError, scope) {
      return this.getFirstByKey(name, false, true, callback, onError, scope);
    }
    /**
     * @function get one picklist(this first found) record with items.
     * @param {String} id refers to the id property of a picklist header.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'getFirstById',
    value: function getFirstById(id, callback, onError, scope) {
      return this.getFirstByKey(id, false, false, callback, onError, scope);
    }
    /**
     * @function get one picklist(this first found) record with items.
     * @param {String} key refers to a picklist by either the Id or Name value.
     * @param {Boolean} isId if true, then the key is an Id, else the key is a Name.
     * @param {Boolean} useCache if true, then cache the response of the request, else don't cache the response.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'getFirstByKey',
    value: function getFirstByKey(key, isId, useCache, callback, onError, scope) {
      var _this = this,
          _arguments = arguments;

      var cachedResult = useCache ? this._storage.getItem(this._storageNameSpace, key) : null;
      if (cachedResult) {
        callback(cachedResult);
      } else {
        var options = this._buildOutOptions(scope, true);
        options.where = this._isNameOrID(isId, key);
        return {
          options: options,
          handlers: {
            success: function success(result) {
              if (result && result.$resources && result.$resources.length > 0) {
                result = result.$resources[0];
              }
              if (useCache) {
                _this._storage.setItem(_this._storageNameSpace, key, result);
              }
              if (typeof callback === 'function') {
                callback(result);
              } else {
                console.log('picklistservice getByName success: %o', _arguments); //eslint-disable-line
              }
            },
            failure: function failure(response) {
              if (typeof onError === 'function') {
                onError(response);
              } else {
                console.log('picklistservice getByName failure: %o', _arguments); //eslint-disable-line
              }
            },
            scope: { passedIn: scope }
          }
        };
      }
    }
    /**
     * @function get a list of picklists record with items.
     * @param {String[]} nameArr refers to the name property of a picklist header.
     * @param {Boolean} useCache if true, then cache the response of the request, else don't cache the response.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'getAllByName',
    value: function getAllByName(nameArr, useCache, callback, onError, scope) {
      this.getAllByKey(nameArr, false, useCache, callback, onError, scope);
    }
    /**
     * @function get a list of picklists record with items.
     * @param {String[]} idArr refers to the id property of a picklist header.
     * @param {Boolean} useCache if true, then cache the response of the request, else don't cache the response.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'getAllById',
    value: function getAllById(idArr, useCache, callback, onError, scope) {
      this.getAllByKey(idArr, true, useCache, callback, onError, scope);
    }
    /**
     * @function get a list of picklists record with items.
     * @param {String} keyArr refers to a picklist by either the Id or Name value.
     * @param {Boolean} isId if true, then the key is an Id, else the key is a Name.
     * @param {Boolean} useCache if true, then cache the response of the request, else don't cache the response.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'getAllByKey',
    value: function getAllByKey(keyArr, isId, useCache, callback, onError, scope) {
      this._notImplemented('getAllByKey', { keyArr: keyArr, isId: isId, useCache: useCache, callback: callback, onError: onError, scope: scope });
    }

    /** Update **/
    /**
     * @function update a picklist record.
     * @param {PickListObject} pickList
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'update',
    value: function update(pickList, callback, onError, scope) {
      this._notImplemented('update', { pickList: pickList, callback: callback, onError: onError, scope: scope });
    }

    /** Delete **/
    /** header and items **/
    /**
     * @function remove a picklist header and its items record.
     * @param {String} name refers to the name property of a picklist header.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteByName',
    value: function deleteByName(name, callback, onError, scope) {
      this.deleteByKey(name, false, callback, onError, scope);
    }
    /**
     * @function remove a picklist header and its items record.
     * @param {String} name refers to the id property of a picklist header.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteById',
    value: function deleteById(id, callback, onError, scope) {
      this.deleteByKey(id, true, callback, onError, scope);
    }
    /**
     * @function remove a picklist header and its items record.
     * @param {String} key refers to a picklist by either the Id or Name value.
     * @param {Boolean} isId if true, then the key is an Id, else the key is a Name.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key, isId, callback, onError, scope) {
      this._notImplemented('deleteByKey', { key: key, isId: isId, callback: callback, onError: onError, scope: scope });
    }

    /** No just header delete, because that would produce "orphaned" picklist items **/

    /** just items **/
    /**
     * @function remove a picklist item record.
     * @param {String} name refers to the name property of a picklist header.
     * @param {String} code refers to the code property of a picklist item.
     * @param {String} language refers to the language property of a picklist item.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteItemByHeaderName',
    value: function deleteItemByHeaderName(name, code, language, callback, onError, scope) {
      this.deleteItemByHeaderKey(name, false, code, language, callback, onError, scope);
    }
    /**
     * @function remove a picklist item record.
     * @param {String} id refers to the id property of a picklist header.
     * @param {String} code refers to the code property of a picklist item.
     * @param {String} language refers to the language property of a picklist item.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteItemByHeaderId',
    value: function deleteItemByHeaderId(id, code, language, callback, onError, scope) {
      this.deleteItemByHeaderKey(id, true, code, language, callback, onError, scope);
    }
    /**
     * @function remove a picklist item record.
     * @param {String} key refers to the id or name property of a picklist header.
     * @param {Boolean} isId if true, then the key is an Id, else the key is a Name.
     * @param {String} code refers to the code property of a picklist item.
     * @param {String} language refers to the language property of a picklist item.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteItemByHeaderKey',
    value: function deleteItemByHeaderKey(key, isId, code, language, callback, onError, scope) {
      this._notImplemented('deleteItemByHeaderKey', { key: key, isId: isId, code: code, language: language, callback: callback, onError: onError, scope: scope });
    }
    /**
     * @function remove a picklist item record.
     * @param {String} key refers to the id property of a picklist item.
     * @param {Function} callback defines how to react to a repsonse that is successful.
     * @param {Function} onError defines how to react to a repsonse that is an error.
     * @param {Object} scope provides access to variables needed inside the response.
     */

  }, {
    key: 'deleteItemById',
    value: function deleteItemById(id, callback, onError, scope) {
      this._notImplemented('deleteItemById', { id: id, callback: callback, onError: onError, scope: scope });
    }

    /** Getting PickList DataTypeData information */

  }, {
    key: 'getPickListDataTypeDataFromEntityProperty',
    value: function getPickListDataTypeDataFromEntityProperty(entityName, propertyName, callback, onError, scope) {
      var _this2 = this,
          _arguments2 = arguments;

      var cachedResult = this._storage.getItem(this._storagePropertyDataTypeNameSpace, entityName + '_' + propertyName);
      if (cachedResult) {
        callback(cachedResult);
      } else {
        return {
          options: {
            select: ['DataTypeData'],
            resourceKind: 'entities(\'' + entityName + '\')/properties',
            service: 'metadata',
            language: scope.language || this._getBrowserLanguage(false),
            include: ['DataTypeData'],
            where: 'propertyName eq \'' + propertyName + '\''
          },
          handlers: {
            success: function success(result) {
              if (result && result.$resources && result.$resources.length > 0) {
                result = result.$resources[0];
              }
              _this2.parent._storage.setItem(_this2.parent._storageDataTypeNameSpace, entityName + '_' + propertyName, result);
              if (typeof callback === 'function') {
                callback(result);
              } else {
                console.log('picklistservice getPickListDataTypeDataFromEntityProperty success: %o', _arguments2); //eslint-disable-line
              }
            },
            failure: function failure(response) {
              if (typeof onError === 'function') {
                onError(response);
              } else {
                console.log('picklistservice getPickListDataTypeDataFromEntityProperty failure: %o', _arguments2); //eslint-disable-line
              }
            },
            scope: { parent: this, passedIn: scope }
          }
        };
      }
    }
  }, {
    key: 'getPickListDataTypeDataFromForm',
    value: function getPickListDataTypeDataFromForm(formName) {
      var pickListName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments[2];

      var _this3 = this,
          _arguments3 = arguments;

      var onError = arguments[3];
      var scope = arguments[4];

      var cachedResult = this._storage.getItem(this._storageFormDataTypeNameSpace, pickListName ? formName + '_' + pickListName : '' + formName);
      if (cachedResult) {
        callback(cachedResult);
      } else {
        return {
          options: {
            resourceKind: 'forms(\'' + formName + '\')',
            service: 'metadata',
            language: scope.language || this._getBrowserLanguage(false)
          },
          handlers: {
            success: function success(result) {
              if (result && result.$resources && result.$resources.length > 0) {
                result = result.$resources[0];
              }
              _this3.parent._storage.setItem(_this3.parent._storageFormDataTypeNameSpace, pickListName ? formName + '_' + pickListName : '' + formName, result);
              if (typeof callback === 'function') {
                callback(result);
              } else {
                console.log('picklistservice getPickListDataTypeDataFromForm success: %o', _arguments3); //eslint-disable-line
              }
            },
            failure: function failure(response) {
              if (typeof onError === 'function') {
                onError(response);
              } else {
                console.log('picklistservice getPickListDataTypeDataFromForm failure: %o', _arguments3); //eslint-disable-line
              }
            },
            scope: { parent: this, passedIn: scope }
          }
        };
      }
    }
    /** Caching **/
    /**
     * @function removes a cached item.
     * @param {String} name reference to an item that has been cached.
     *
     * --Uses the storage value provided in the constructor.
     */

  }, {
    key: 'clearCache',
    value: function clearCache(name) {
      if (typeof name === 'string') {
        var item = this._storage.getItem(this._storageNameSpace, name);
        if (item) {
          this._storage.removeItem(this._storageNameSpace, name);
        }
      } else {
        console.warn('argument needs to be a String.'); //eslint-disable-line
      }
    }

    /** MISC **/
    /**
     * @function clones the this class.
     */

  }, {
    key: 'deepClone',
    value: function deepClone() {
      return JSON.parse(JSON.stringify(this));
    }
    /**
     * @function build up a request
     * @param {Object} obj needs to contain the functions:
     *                      setResourceKind()
     *                      setQueryArg()
     *
     * @param {Object} options can contain
     *                      {
     *                          where: String?
     *                          select: String?
     *                          include: Boolean?
     *                          language: String?
     *                          storageMode: {CODE, ID, TEXT}
     *                      }
     */

  }, {
    key: 'setUpRequest',
    value: function setUpRequest(obj, options) {
      /* though this could be a static function, that does not seem right since it is not much use outside this scope*/ //eslint-disable-line 
      if (obj && options) {
        if (typeof obj.setResourceKind === 'function' && typeof obj.setQueryArg === 'function') {
          obj.setResourceKind(options.resourceKind);

          if (options.where && options.where.length > 0) {
            obj.setQueryArg('where', options.where);
          }
          if (options.select && options.select.length > 0) {
            obj.setQueryArg('select', options.select.join(','));
          }
          if (options.include && options.include.length > 0) {
            obj.setQueryArg('include', options.include.join(','));
          }
          if (options.language) {
            obj.setQueryArg('language', options.language);
          }
          if (options.storageMode) {
            obj.setQueryArg('storageMode', options.storageMode);
          }
        } else {
          console.warn('argument is the wrong type: %o', obj); //eslint-disable-line
        }
      } else {
        console.warn('arguments cannot be null'); //eslint-disable-line
      }
      return obj;
    }

    /* ** private functions **/

  }, {
    key: '_buildHash',
    value: function _buildHash(results) {
      this._notImplemented('_buildHash', { results: results });
    }
  }, {
    key: '_returnOption',
    value: function _returnOption(optionName, callback, onError, scope) {
      this._notImplemented('_returnOption', { optionName: optionName, callback: callback, onError: onError, scope: scope });
    }
  }, {
    key: '_isNameOrID',
    value: function _isNameOrID(isId, key) {
      /* though this could be a static function, that does not seem right since it is not much use outside this scope*/ //eslint-disable-line
      if (typeof isId === 'boolean' && typeof key === 'string') {
        return isId ? 'id eq \'' + key + '\'' : 'name eq \'' + key + '\'';
      }
      throw new Error('isId needs to be a boolean; key needs to be a string');
    }
  }, {
    key: '_buildOutOptions',
    value: function _buildOutOptions() {
      var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var includeItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var optionsObj = {
        select: ['Id', 'name', 'allowMultiples', 'valueMustExist', 'required', 'alphaSorted', 'noneEditable', 'defaultLanguage', 'defaultCode',
        // Include modifyDate to ensure that local storage data stays current.
        'modifyDate'],
        resourceKind: 'picklists',
        service: this._service,
        language: scope.language || this._getBrowserLanguage(false)
      };
      if (includeItems) {
        optionsObj.include = ['items'];
        optionsObj.select.push('items/text');
        optionsObj.select.push('items/code');
        optionsObj.select.push('items/number');
        optionsObj.select.push('items/filter');
        optionsObj.select.push('items/languageCode');
      }
      if (scope.pickListServiceOptions) {
        if (scope.pickListServiceOptions.filter) {
          optionsObj.filter = scope.pickListServiceOptions.filter;
        }

        if (scope.pickListServiceOptions.storageMode) {
          optionsObj.storageMode = scope.pickListServiceOptions.storageMode;
        }
      }
      return optionsObj;
    }
  }, {
    key: '_breakDownALanguageCodeIntoFallBackParts',
    value: function _breakDownALanguageCodeIntoFallBackParts() {
      var strLangCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      /* though this could be a static function, it is a private helper function that works strictly within the scope of _getBrowserLanguage*/ //eslint-disable-line
      var userLangs = strLangCode.split('-');
      var potentialLanguage = [];
      for (var i = 0; i < userLangs.length; i++) {
        var strVal = '';
        for (var j = 0; j <= i; j++) {
          strVal = strVal + (strVal.length > 0 ? '_' : '') + userLangs[j];
        }
        potentialLanguage.push(strVal);
      }
      return potentialLanguage;
    }
  }, {
    key: '_getBrowserLanguage',
    value: function _getBrowserLanguage() {
      var includeFallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var languageFromCookie = this._getLanguageFromCookie();
      var userLang = languageFromCookie || this._getFromLanguageFromNavigator();
      if (!userLang) {
        console.warn('no browser language found, will assume en-en for the rest.'); /* give warning because something went wrong... or in test enviroment */ //eslint-disable-line
        userLang = 'en-en';
      }
      if (includeFallbacks) {
        var languagePlusFallBacks = this._breakDownALanguageCodeIntoFallBackParts(userLang);
        return languagePlusFallBacks;
      }
      return userLang;
    }
  }, {
    key: '_getFromLanguageFromNavigator',
    value: function _getFromLanguageFromNavigator() {
      /* does not need to reference this, it is a helper for _getBrowserLanguage */ //eslint-disable-line
      if (typeof navigator !== 'undefined') {
        return navigator.userLanguage || navigator.browserLanguage || navigator.language;
      }
      console.warn('no navigator object found. hardcoding language to en-en'); /* give warning because something went wrong... or in test enviroment */ //eslint-disable-line
      return null;
    }
  }, {
    key: '_getLanguageFromCookie',
    value: function _getLanguageFromCookie() {
      var languageFromCookie = null;
      var cookieLangaugeKey = 'SLXLanguageSetting';
      if (typeof window !== 'undefined' && window.document && window.document.cookie) {
        if (typeof window.document.cookie.getCookie === 'function') {
          languageFromCookie = window.document.cookie.getCookie(cookieLangaugeKey);
        } else {
          var cookies = window.document.cookie.split(';');
          cookies.forEach(function (cookie) {
            cookie = cookie.trim();
            if (cookie.startsWith(cookieLangaugeKey)) {
              cookie = cookie.replace('' + cookieLangaugeKey, '').trim(); // remove the key part of the cookie and any spaces
              cookie = cookie.replace('=', '').trim(); // because there may or may not be a space between the key and '=', then remove now.
              languageFromCookie = cookie;
            }
          }, this);
        }
      } else {
        console.warn('no window/window.document/window.document.cookie object found'); /* give warning because something went wrong... or in test enviroment */ //eslint-disable-line
      }
      return languageFromCookie;
    }
  }, {
    key: '_notImplemented',
    value: function _notImplemented(functionName, params) {
      /* a function to give the unimplemented functions a call to hush lint errors*/ //eslint-disable-line
      throw new Error('%s with parameters %o is not implemented', functionName, params);
    }
  }]);

  return PickListService;
}();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _src = __webpack_require__(0);

Object.keys(_src).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _src[key];
    }
  });
});

/***/ }
/******/ ]);
});
//# sourceMappingURL=services.bundle.js.map