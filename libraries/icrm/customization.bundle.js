(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@infor/icrm-js-common"));
	else if(typeof define === 'function' && define.amd)
		define(["@infor/icrm-js-common"], factory);
	else if(typeof exports === 'object')
		exports["ICRMCustomizationSDK"] = factory(require("@infor/icrm-js-common"));
	else
		root["ICRMCustomizationSDK"] = factory(root["ICRMCommonSDK"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.normalizeCustomizationSet = normalizeCustomizationSet;
exports.getCustomizationSetKey = getCustomizationSetKey;
exports.createCustomizedLayout = createCustomizedLayout;
exports.compileCustomizedLayout = compileCustomizedLayout;

var _icrmJsCommon = __webpack_require__(1);

/**
 * @function CustomizationMixin
 * Customization Mixin is a general purpose Customization Engine. It takes a customization object and
 * a layout object and applies the customization defined to the layout.
 *
 * A customization object has the following properties:
 *
 * * `at`: `function(item)` - passes the current item in the list, the function should return true if this is the item being modified (or is at where you want to insert something).
 * * `at`: `{Number}` - May optionally define the index of the item instead of a function.
 * * `type`: `{String}` - enum of `insert`, `modify`, `replace` or `remove` that indicates the type of customization.
 * * `where`: `{String}` - enum of `before` or `after` only needed when type is `insert`.
 * * `value`: `{Object}` - the entire object to create (insert or replace) or the values to overwrite (modify), not needed for remove.
 * * `value`: `{Object[]}` - if inserting you may pass an array of items to create.
 *
 * @alternateClassName _CustomizationMixin
 */
function expand(expression) {
  if (typeof expression === 'function') {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return expression.apply(this, args);
  }

  return expression;
}

function normalizeCustomizationSet(customizationSet, customizationSubSet) {
  if (customizationSubSet) {
    return customizationSet + '/' + customizationSubSet;
  }

  return customizationSet;
}

function getCustomizationSetKey(customizationSet, id, customizationSubSet) {
  customizationSet = normalizeCustomizationSet(customizationSet, customizationSubSet);
  var key = customizationSet + '#' + id;
  return key;
}

function createCustomizedLayout(layout, customizations, customizationSet, id, customizationSubSet) {
  customizationSet = normalizeCustomizationSet(customizationSet, customizationSubSet);

  if (customizations && customizations.length > 0) {
    return compileCustomizedLayout(customizations, layout, null); //eslint-disable-line
  }

  return layout;
}

function compileCustomizedLayout(customizations, layout, parent) {
  var customizationCount = customizations.length;
  var layoutCount = layout.length;
  var applied = {};
  var output = void 0;

  if (Array.isArray(layout)) {
    output = [];
    for (var i = 0; i < layoutCount; i++) {
      var row = layout[i];

      /* for compatibility */
      // will modify the underlying row
      if (typeof row.name === 'undefined' && typeof row.property === 'string') {
        row.name = row.property;
      }

      var insertRowsBefore = [];
      var insertRowsAfter = [];

      for (var j = 0; j < customizationCount; j++) {
        if (applied[j]) {
          continue; // todo: allow a customization to be applied to a layout more than once?
        }

        var customization = customizations[j];
        var stop = false;

        if (expand(customization.at, row, parent, i, layoutCount, customization)) {
          switch (customization.type) {//eslint-disable-line
            case 'remove':
              // full stop
              stop = true;
              row = null;
              break;
            case 'replace':
              // full stop
              stop = true;
              row = expand(customization.value, row);
              break;
            case 'modify':
              // make a shallow copy if we haven't already
              if (row === layout[i]) {
                row = Object.assign({}, row);
              }

              row = Object.assign(row, expand(customization.value, row));
              break;
            case 'insert':
              //eslint-disable-line
              var insertRowsTarget = customization.where !== 'before' ? insertRowsAfter : insertRowsBefore;
              var expandedValue = expand(customization.value, row);

              if (Array.isArray(expandedValue)) {
                insertRowsTarget.push.apply(insertRowsTarget, expandedValue); //eslint-disable-line
              } else {
                insertRowsTarget.push(expandedValue);
              }

              break;
          }

          applied[j] = true;
        }

        if (stop) {
          break;
        }
      }

      output.push.apply(output, insertRowsBefore); //eslint-disable-line

      if (row) {
        var children = row.children && 'children' || row.as && 'as';
        if (children) {
          // make a shallow copy if we haven't already
          if (row === layout[i]) {
            row = Object.assign({}, row);
          }

          row[children] = compileCustomizedLayout(customizations, row[children], row);
        }

        output.push(row);
      }
      output.push.apply(output, insertRowsAfter); //eslint-disable-line
    }
    /*
     for any non-applied, insert only, customizations, if they have an `or` property that expands into a true expression
     the value is applied at the end of the parent group that the `or` property (ideally) matches.
    */
    for (var k = 0; k < customizationCount; k++) {
      if (applied[k]) {
        continue;
      }

      var _customization = customizations[k];

      if (_customization.type === 'insert' && (expand(_customization.or, parent, _customization) || _customization.at === true)) {
        output.push(expand(_customization.value, null));
      }
    }
  } else if (typeof layout === 'function') {
    return compileCustomizedLayout(customizations, layout.call(this), name);
  } else if ((typeof layout === 'undefined' ? 'undefined' : _typeof(layout)) === 'object' && layout !== null) {
    output = {};

    for (var _name in layout) {
      if (Array.isArray(layout[_name])) {
        output[_name] = compileCustomizedLayout(customizations, layout[_name], _name);
      } else {
        output[_name] = layout[_name];
      }
    }
  }

  return output;
}

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(0);

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    }
  });
});

/***/ }
/******/ ]);
});
//# sourceMappingURL=customization.bundle.js.map