(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined));
	else if(typeof define === 'function' && define.amd)
		define(["moment"], factory);
	else if(typeof exports === 'object')
		exports["ICRMCommonSDK"] = factory(require("moment"));
	else
		root["ICRMCommonSDK"] = factory(root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_19__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility__ = __webpack_require__(16);
/* harmony export (immutable) */ exports["bigNumber"] = bigNumber;
/* harmony export (immutable) */ exports["decimalAdjust"] = decimalAdjust;
/* harmony export (immutable) */ exports["fixed"] = fixed;
/* harmony export (immutable) */ exports["percent"] = percent;

var bigNumberAbbrText = {
    billion: 'B',
    million: 'M',
    thousand: 'K',
};
function bigNumber(val) {
    var numParse = typeof val !== 'number' ? parseFloat(val) : val;
    var absVal = Math.abs(numParse);
    var text = bigNumberAbbrText;
    if (isNaN(numParse)) {
        return val;
    }
    var results = numParse.toString();
    if (absVal >= 1000000000) {
        numParse = numParse / 1000000000;
        numParse = decimalAdjust('round', numParse, -1);
        results = fixed(numParse, 1) + text.billion;
    }
    else if (absVal >= 1000000) {
        numParse = numParse / 1000000;
        numParse = decimalAdjust('round', numParse, -1);
        results = fixed(numParse, 1) + text.million;
    }
    else if (absVal >= 1000) {
        numParse = numParse / 1000;
        numParse = decimalAdjust('round', numParse, -1);
        results = fixed(numParse, 1) + text.thousand;
    }
    else {
        results = decimalAdjust('round', numParse, 2).toString();
    }
    return results;
}
/**
 * Decimal adjustment of a number.
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 *
 * @param {string}  type  The type of adjustment.
 * @param {number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {number} The adjusted value.
 */
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
/**
 * Takes a number and decimal place and floors the number to that place:
 *
 * `fixed(5.555, 0)` => `5`
 * `fixed(5.555, 2)` => `5.55`
 * `fixed(5.555, 5)` => `5.555`
 *
 * @param {number|string} val The value will be `parseFloat` before operating.
 * @param {number} d Number of decimals places to keep, defaults to 2 if not provided.
 * @return {number} Fixed number.
 */
function fixed(val, d) {
    if (typeof val !== 'number' && typeof val !== 'string') {
        return val;
    }
    var decimals = 2;
    if (typeof d === 'number') {
        decimals = d;
    }
    var m = Math.pow(10, decimals);
    var v = Math.floor(parseFloat(val) * m) / m;
    return v;
}
/**
 * Takes a decimal number, multiplies by 100 and adds the % sign with the number of palces to the right.
 *
 * `perecent(0.35)` => `'35.00%'`
 * `perecent(0.35, 0)` => `'35%'`
 * `percent(2.9950)` => `'299.50%'`
 * `percent(2.9950,0)` => `'300%'`
 *
 * @param {number|string} val The value will be `parseFloat` before operating.
 * @param {number|string} places If no value is given the default value will be set to 2.
 * @param {string} percentGroupSeparator string representing the separator for percent groups
 * @param {string} percentDecimalSeparator string representing the separator for decimals
 * @param {function: string} percentFormatter Takes the number as an argument and should return the
 *  formatted string with the percent symbol correctly placed, defaults to 'number%'
 * @return {string} Number as a percentage with % sign.
 */
function percent(val, places, percentFormatter, percentGroupSeparator, percentDecimalSeparator) {
    if (percentFormatter === void 0) { percentFormatter = function (number) { return number + "%"; }; }
    if (percentGroupSeparator === void 0) { percentGroupSeparator = ','; }
    if (percentDecimalSeparator === void 0) { percentDecimalSeparator = '.'; }
    var decimalPlaces = 2;
    if (typeof places === 'number') {
        decimalPlaces = places;
    }
    decimalPlaces = Math.floor(decimalPlaces);
    var intVal = 100 * (parseFloat(val) || 0.00);
    var v = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utility__["roundNumberTo"])(intVal, decimalPlaces);
    // get the whole number part
    var wp = (((intVal >= 0) ? Math.floor(v) : Math.ceil(v))).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + percentGroupSeparator.replace('\\.', '.'));
    var numberFormated;
    if (decimalPlaces < 1) {
        numberFormated = ("" + wp).replace(/ /g, '\u00A0'); // keep numbers from breaking
    }
    else {
        var dp = v % 1; // get the decimal part
        dp = dp.toPrecision(decimalPlaces + 1); // round to significant pecsion
        dp = dp.toString();
        var pos = (dp.indexOf('.') > -1 ? dp.indexOf('.') + 1 : 2);
        dp = dp.substr(pos, decimalPlaces); // get the whole decimal part
        numberFormated = ("" + wp + percentDecimalSeparator + dp).replace(/ /g, '\u00A0'); // keep numbers from breaking
    }
    return percentFormatter(numberFormated);
}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(exports, "isiOSDesktop", function() { return isiOSDesktop; });
/* harmony export (binding) */ __webpack_require__.d(exports, "getVectorMaxSize", function() { return getVectorMaxSize; });
/* harmony export (immutable) */ exports["canvasDraw"] = canvasDraw;
/* harmony export (immutable) */ exports["decode"] = decode;
/* harmony export (immutable) */ exports["encode"] = encode;
/* harmony export (immutable) */ exports["imageFromVector"] = imageFromVector;
/* harmony export (immutable) */ exports["link"] = link;
/* harmony export (immutable) */ exports["mail"] = mail;
/* harmony export (immutable) */ exports["nl2br"] = nl2br;
var isiOSDesktop = function () { return window.navigator['standalone']; };
var getVectorMaxSize = function getVectorMaxSize(v) {
    var w = 1;
    var h = 1;
    for (var i = 0; i < v.length; i++) {
        for (var j = 0; j < v[i].length; j++) {
            if (w < v[i][j][0]) {
                w = v[i][j][0];
            }
            if (h < v[i][j][1]) {
                h = v[i][j][1];
            }
        }
    }
    // maybe should return bounding box? (x,y,w,h)
    return {
        width: w,
        height: h,
    };
};
/**
 * Takes a 2D array of `[[x,y],[x,y]]` number coordinates and draws them onto the provided canvas
 * The first point marks where the "pen" starts, each sequential point is then "drawn to" as if holding a
 * pen on paper and moving the pen to the new point.
 * @param {number[][]} vector A series of x,y coordinates in the format of: `[[0,0],[1,5]]`
 * @param {HTMLElement} canvas The `<canvas>` element to be drawn on
 * @param {Object} options Canvas options: scale, lineWidth and penColor.
 */
function canvasDraw(vector, canvas, options) {
    var context = canvas.getContext('2d');
    // Paint canvas white vs. clearing as on Android imageFromVector alpha pixels blacken
    // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    var scale = options && options.scale ? options.scale : 1;
    context.lineWidth = options && options.lineWidth ? options.lineWidth : 1;
    context.strokeStyle = options && options.penColor ? options.penColor : 'black';
    for (var trace in vector) {
        if (vector[trace].length > 1) {
            context.beginPath();
            context.moveTo(vector[trace][0][0] * scale, vector[trace][0][1] * scale);
            for (var i = 1; i < vector[trace].length; i++) {
                var x = vector[trace][i][0] * scale;
                var y = vector[trace][i][1] * scale;
                context.lineTo(x, y);
            }
            context.stroke();
        }
    }
}
/**
 * Takes an encoded string and returns a new string with the decoded string values
 * @param {string} val string to be decoded
 * @return {string} Decoded string
 */
function decode(val) {
    if (typeof val !== 'string') {
        return val;
    }
    return val
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
}
/**
 * Takes a decoded string and returns a new string with the encoded string values
 * @param {string} val string to be encoded
 * @return {string} Encoded string
 */
function encode(val) {
    if (typeof val !== 'string') {
        return val;
    }
    return val
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
/**
 * Returns the image data (or img element) for a series of vectors
 * @param {number[][]} vector A series of x,y coordinates in the format of: `[[0,0],[1,5]]`. These will be drawn sequentially as one line.
 * @param {Object} options Canvas options: scale, lineWidth and penColor.
 * @param {boolean} html Flag for returning image as a data-uri or as a stringified `<img>` element.
 * @return {string} The encoded data of the drawn image, optionally wrapped in `<img>` if html was passed as true
 */
function imageFromVector(vector, options, html) {
    if (options === void 0) { options = {}; }
    var canvasNode = document.createElement('canvas');
    var _vector;
    if (typeof vector === 'string' || vector instanceof String) {
        try {
            _vector = JSON.parse(vector);
        }
        catch (e) { } //eslint-disable-line
    }
    if (!(_vector instanceof Array) || _vector.length === 0) {
        _vector = [
            [],
        ]; // blank image.
    }
    var size = getVectorMaxSize(_vector);
    canvasNode.width = options.width || size.width;
    canvasNode.height = options.height || size.height;
    options.scale = Math.min(canvasNode.width / size.width, canvasNode.height / size.height);
    canvasDraw(_vector, canvasNode, options);
    var img = canvasNode.toDataURL('image/png');
    if (img.indexOf('data:image/png') !== 0) {
    }
    return html ? "<img src=\"" + img + "\" width=\"" + options.width + "\" height=\"" + options.height + "\" alt=\"" + (options.title || '') + "\" />" : img;
}
/**
 * Takes a url string and wraps it with an `<a>` element with `href=` pointing to the url.
 * @param {string} val Url string to be wrapped
 * @return {string} An `<a>` element as a string.
 */
function link(val, iOSDesktop) {
    if (iOSDesktop === void 0) { iOSDesktop = false; }
    // TODO: Figure out how to get iOSDesktop to default to isiOSDesktop without breaking unit tests
    if (typeof val !== 'string') {
        return val;
    }
    // Allowed schemes when fullscreen mode
    var allowedStandAloneSchemes = ['tel:', 'sms:', 'mailto:'];
    var allowStandAlone = allowedStandAloneSchemes.some(function (v) { return val.indexOf(v) > -1; });
    // Skip returning the href link if saved to iOS desktop
    if (!allowStandAlone && iOSDesktop) {
        return val;
    }
    // Check if the user specified a URI scheme,
    // does not include all URI Schemes
    var schemes = ['://', 'mailto:', 'tel:', 'sms:'];
    var scheme = schemes.filter(function (v) { return val.indexOf(v) > -1; })[0];
    if (scheme && scheme.length) {
        var index = val.indexOf(scheme) + scheme.length;
        return "<a target=\"_blank\" href=\"" + val + "\">" + val.substring(index) + "</a>";
    }
    // Specify a default URI scheme of http
    return "<a target=\"_blank\" href=\"http://" + val + "\">" + val + "</a>";
}
/**
 * Takes an email string and wraps it with an `<a>` element with `href="mailto:"` pointing to the email.
 * @param {string} val Email string to be wrapped
 * @return {string} An `<a>` element as a string.
 */
function mail(val) {
    if (typeof val !== 'string') {
        return val;
    }
    return "<a href=\"mailto:" + val + "\">" + val + "</a>";
}
/**
 * Takes a string and converts all new lines `\n` to HTML `<br>` elements.
 * @param {String} val String with newlines
 * @return {String} String with replaced `\n` with `<br>`
 */
function nl2br(val) {
    if (typeof val !== 'string') {
        return val;
    }
    return val.replace(/\n/g, '<br />');
}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__number__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["bool"] = bool;
/* harmony export (immutable) */ exports["collapseSpace"] = collapseSpace;
/* harmony export (immutable) */ exports["fileSize"] = fileSize;
/* harmony export (immutable) */ exports["isEmpty"] = isEmpty;
/* harmony export (immutable) */ exports["trim"] = trim;
/* harmony export (immutable) */ exports["yesNo"] = yesNo;

/**
 * Takes a boolean value and returns the string T or F for true or false
 * @param {boolean|string} val If string it tests if the string is `true` for true, else assumes false
 * @return {string} Defaulted to T for true, F for false.
 */
function bool(val, trueText, falseText) {
    if (trueText === void 0) { trueText = 'T'; }
    if (falseText === void 0) { falseText = 'F'; }
    var results = val;
    if (typeof val === 'string') {
        results = /^true$/i.test(val);
    }
    return results ? trueText : falseText;
}
/**
 * Removes spaces from the passed string.
 * @param {string} text string to remove spaces from
 * @return {string} string without spaces
 */
function collapseSpace(text) {
    return text.replace(/\s+/g, ' ').trim();
}
/**
 * Takes a file size and returns the string representation of it
 * @param {number} size file size
 * @return {string} String representation of the file size
 */
function fileSize(size, bytesText) {
    if (bytesText === void 0) { bytesText = 'bytes'; }
    var parsedSize = parseInt(size, 10);
    if (parsedSize === 0) {
        return '0 KB';
    }
    if (!parsedSize || parsedSize < 0) {
        return 'Unknown';
    }
    if (parsedSize < 1024) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__number__["fixed"])(Math.round(parsedSize)) + " " + bytesText;
    }
    else if ((parsedSize > 1024) && (parsedSize < (1024 * 1000))) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__number__["fixed"])(Math.round(parsedSize / 1024)) + " KB";
    }
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__number__["fixed"])(Math.round(parsedSize / (1024 * 1000))) + " MB";
}
/**
 * Checks whether a string isEmpty
 * @param {string} val string to check
 * @return {boolean} Value whether the string is empty or not
 */
function isEmpty(val) {
    if (typeof val !== 'string') {
        return !val;
    }
    return (val.length <= 0);
}
/**
 * Removes whitespace from from and end of string
 * @param {string} val string to be trimmed
 * @return {string} String without space on either end
 */
function trim(val) {
    return val.replace(/^\s+|\s+$/g, '');
}
/**
 * Takes a boolean value and returns the string Yes or No for true or false
 * @param {boolean|string} val If string it tests if the string is `true` for true, else assumes false
 * @return {string} Yes for true, No for false.
 */
function yesNo(val, yesText, noText) {
    if (yesText === void 0) { yesText = 'Yes'; }
    if (noText === void 0) { noText = 'No'; }
    var results = val;
    if (typeof val === 'string') {
        results = /^true$/i.test(val);
    }
    return results ? yesText : noText;
}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony export (immutable) */ exports["isDateString"] = isDateString;
/* harmony export (immutable) */ exports["toBoolean"] = toBoolean;
/* harmony export (immutable) */ exports["toDateFromString"] = toDateFromString;
/* harmony export (immutable) */ exports["toIsoStringFromDate"] = toIsoStringFromDate;
/* harmony export (immutable) */ exports["toJsonStringFromDate"] = toJsonStringFromDate;

var trueRE = /^(true|T)$/i;
var isoDate = /(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|(-|\+)(\d{2}):(\d{2})))?/;
var jsonDate = /\/Date\((-?\d+)(?:(-|\+)(\d{2})(\d{2}))?\)\//;
function pad(n) {
    return n < 10 ? "0" + n : n;
}
/**
 * Takes a string and checks to see if it is an ISO formatted date or a JSON-string date
 *
 * ISO Date: `'2012-08-28'` or `'2012-05-28T08:30:00Z'`
 * JSON-string: `'/Date(1346189868885)/'`
 *
 * @param {string} value String to be checked to see if it's a date.
 * @return {boolean} True if it matches ISO or JSON formats, false if not a string or doesn't match.
 */
function isDateString(value) {
    if (typeof value !== 'string') {
        return false;
    }
    return isoDate.test(value) || jsonDate.test(value);
}
/**
 * Takes a string and checks to see if it is `true` or `T`, else returns false
 * @param {string} value String bool value
 * @return {boolean} Returns true if string is `true` or `T`.
 */
function toBoolean(value) {
    return trueRE.test(value);
}
/**
 * Takes a string and tests it to see if its an ISO 8601 string or a JSON-string.
 * If a match is found it is parsed into a Date object and returned, else the original value is returned.
 * @param {string} value String in the ISO 8601 format `'2012-08-28T08:30:00Z'` or JSON-string format `'/Date(milliseconds)/'`
 * @return {Date} Date object from string or original object if not convertable.
 */
function toDateFromString(v) {
    var value = v;
    if (typeof value !== 'string') {
        return value;
    }
    var match;
    var utc;
    if ((match = jsonDate.exec(value))) {
        utc = new Date(parseInt(match[1], 10));
        // todo: may not be needed
        /*
        if (match[2])
        {
            h = parseInt(match[3]);
            m = parseInt(match[4]);
    
            if (match[2] === '-')
                utc.addMinutes((h * 60) + m);
            else
                utc.addMinutes(-1 * ((h * 60) + m));
        }
        */
        value = utc;
    }
    else if ((match = isoDate.exec(value))) {
        utc = __WEBPACK_IMPORTED_MODULE_0_moment__(new Date(Date.UTC(parseInt(match[1], 10), parseInt(match[2], 10) - 1, // zero based
        parseInt(match[3], 10), parseInt(match[4] || 0, 10), parseInt(match[5] || 0, 10), parseInt(match[6] || 0, 10))));
        if (match[8] && match[8] !== 'Z') {
            var h = parseInt(match[10], 10);
            var m = parseInt(match[11], 10);
            if (match[9] === '-') {
                utc.add({
                    minutes: ((h * 60) + m),
                });
            }
            else {
                utc.add({
                    minutes: (-1 * ((h * 60) + m)),
                });
            }
        }
        value = utc.toDate();
    }
    return value;
}
/**
 * Takes a Date object and converts it to a ISO 8601 formatted string
 * @param {Date} value Date to be formatted
 * @return {string} ISO 8601 formatted date string
 */
function toIsoStringFromDate(value) {
    // adapted from: https://developer.mozilla.org/en/JavaScript/Reference/global_objects/date
    return value.getUTCFullYear() + "-" + pad(value.getUTCMonth() + 1) + "-" + pad(value.getUTCDate()) + "T" + pad(value.getUTCHours()) + ":" + pad(value.getUTCMinutes()) + ":" + pad(value.getUTCSeconds()) + "Z";
}
/**
 * Takes a Date object and returns it in JSON-string format: `'/Date(milliseconds)/'`
 * @param {Date} value Date to stringify
 * @return {string} JSON string: `'/Date(milliseconds)/'`
 */
function toJsonStringFromDate(value) {
    return "/Date(" + value.getTime() + ")/";
}
var Convert = {
    isDateString: isDateString,
    toBoolean: toBoolean,
    toDateFromString: toDateFromString,
    toIsoStringFromDate: toIsoStringFromDate,
    toJsonStringFromDate: toJsonStringFromDate,
};
// if (window) {
//   window['Jupiter'] = Object.assign({}, window['Jupiter'], { Convert })
// }
/* harmony default export */ exports["default"] = Convert;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(exports, "userActivityFormatText", function() { return userActivityFormatText; });
/* harmony export (immutable) */ exports["userActivityStatus"] = userActivityStatus;
var userActivityFormatText = {
    asUnconfirmed: 'Unconfirmed',
    asAccepted: 'Accepted',
    asDeclned: 'Declined',
};
/**
 * Converts the passed type using the passed string format,
 * defaults to English
 * @param {string} val string to conver to human readable value
 * @return {string}
 */
function userActivityStatus(val, activityFormatText) {
    return (activityFormatText && activityFormatText[val])
        || userActivityFormatText[val]
        || '';
}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__html__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__string__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(exports, "addressCultureFormats", function() { return addressCultureFormats; });
/* harmony export (binding) */ __webpack_require__.d(exports, "countryCultures", function() { return countryCultures; });
/* harmony export (immutable) */ exports["addressItems"] = addressItems;
/* harmony export (immutable) */ exports["address"] = address;
/* harmony export (immutable) */ exports["resolveAddressCulture"] = resolveAddressCulture;
/* harmony export (immutable) */ exports["replaceAddressPart"] = replaceAddressPart;


/**
 * Address Culture Formats as defined by crm.Format.address
 * http://msdn.microsoft.com/en-us/library/cc195167.aspx
 */
var addressCultureFormats = {
    en: 'a1|a2|a3|m, R p|C',
    'en-GB': 'a1|a2|a3|M|P|C',
    fr: 'a1|a2|a3|p M|C',
    de: 'a1|a2|a3|p m|C',
    it: 'a1|a2|a3|p m Z|C',
    ru: 'a1|a2|a3|p m|C',
};
/**
 * Country name to culture identification
 * http://msdn.microsoft.com/en-us/goglobal/bb896001.aspx
 */
var countryCultures = {
    USA: 'en',
    'United States': 'en',
    'United States of America': 'en',
    US: 'en',
    'United Kingdom': 'en-GB',
    UK: 'en-GB',
    Britain: 'en-GB',
    England: 'en-GB',
    Russia: 'ru',
    Россия: 'ru',
    Italy: 'it',
    Italia: 'it',
    France: 'fr',
    Germany: 'de',
    Deutschland: 'de',
};
function addressItems(addr, fmt) {
    function isEmpty(line) {
        var filterSymbols = line.replace(/,|\(|\)|\.|>|-|<|;|:|'|"|\/|\?|\[|\]|{|}|_|=|\+|\\|\||!|@|#|\$|%|\^|&|\*|`|~/g, '').trim();
        return filterSymbols === '';
    }
    if (!fmt) {
        var culture = resolveAddressCulture(addr);
        fmt = addressCultureFormats[culture] || addressCultureFormats.en;
    }
    var lines = (fmt.indexOf('|') === -1) ? [fmt] : fmt.split('|');
    return lines.map(function (line) { return replaceAddressPart(line, addr); })
        .filter(function (line) { return !isEmpty(line); })
        .map(function (line) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__html__["encode"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__string__["collapseSpace"])(line)); });
}
/**
Converts the given value using the provided format, joining with the separator character
If no format given, will use predefined format for the addresses Country (or en-US as final fallback)
<pre>
Format    Description                                    Example
------    -----------------------------------------    -----------------------
  s         Salutation (Attention, Name)                ATTN: Mr. Bob
  S         Salutation Uppercase                        ATTN: MR. BOB
  a1        Address Line 1                              555 Oak Ave
  a2        Address Line 2                                #2038
  a3        Address Line 3
  m        Municipality (City, town, hamlet)            Phoenix
  M        Municipality Uppercase                        PHOENIX
  z        County (parish, providence)                    Maricopa
  Z         County Uppercase                            MARICOPA
  r        Region (State, area)                        AZ
  R        Region Uppercase                            AZ
  p         Postal Code (ZIP code)                        85021
  P         Postal Code Uppercase                        85021
  c         Country                                     France
  C         Country Uppercase                            FRANCE

  |        separator                                    as defined by separator variable
  </pre>
  @param {Object} addr Address Entity containing all the SData properties
  @param {boolean} asText If set to true returns text only, if false returns anchor link to google maps
  @param {string|boolean} separator If false - separates with html <br>,
                      if true - separates with line return,
                      if defined as string - uses string to separate
  @param {string} fmt Address format to use, may also pass a culture string to use predefined format
  @return {string} Formatted address
*/
function address(addr, asText, separator, fmt) {
    if (!addr) {
        return '';
    }
    var parts = addressItems(addr, fmt);
    if (asText) {
        if (separator === true) {
            separator = '\n';
        }
        return parts.join(separator || '<br />');
    }
    return "<a href=\"javascript:App.showMapForAddress('" + encodeURIComponent(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__html__["decode"])(parts.join(' '))) + "');\">" + parts.join('<br />') + "</a>";
}
function resolveAddressCulture(_a) {
    var Country = _a.Country;
    return countryCultures[Country] || 'en';
}
function replaceAddressPart(fmt, o) {
    return fmt.replace(/s|S|a1|a2|a3|a4|m|M|z|Z|r|R|p|P|c|C/g, function (part) {
        switch (part) {
            case 's':
                return o.Salutation || '';
            case 'S':
                return (o.Salutation && o.Salutation.toUpperCase()) || '';
            case 'a1':
                return o.Address1 || '';
            case 'a2':
                return o.Address2 || '';
            case 'a3':
                return o.Address3 || '';
            case 'a4':
                return o.Address4 || '';
            case 'm':
                return o.City || '';
            case 'M':
                return (o.City && o.City.toUpperCase()) || '';
            case 'z':
                return o.County || '';
            case 'Z':
                return (o.County && o.County.toUpperCase()) || '';
            case 'r':
                return o.State || '';
            case 'R':
                return (o.State && o.State.toUpperCase()) || '';
            case 'p':
                return o.PostalCode || '';
            case 'P':
                return (o.PostalCode && o.PostalCode.toUpperCase()) || '';
            case 'c':
                return o.Country || '';
            case 'C':
                return (o.Country && o.Country.toUpperCase()) || '';
        }
    });
}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["currency"] = currency;
/* harmony export (immutable) */ exports["fixedLocale"] = fixedLocale;
/* harmony export (immutable) */ exports["multiCurrency"] = multiCurrency;
function currency(_val, currencyDecimalSeparator, currencyGroupSeparator) {
    if (currencyDecimalSeparator === void 0) { currencyDecimalSeparator = '.'; }
    if (currencyGroupSeparator === void 0) { currencyGroupSeparator = ','; }
    var val = _val;
    if (isNaN(val) || val === null) {
        return val;
    }
    if (typeof val === 'string') {
        val = parseFloat(val);
    }
    var v = val.toFixed(2); // only 2 decimal places
    var f = Math.floor(parseFloat((100 * (v - Math.floor(v))).toPrecision(2))); // for fractional part, only need 2 significant digits
    var first = (Math.floor(v)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + currencyGroupSeparator.replace('\\.', '.'));
    var last = (f.toString().length < 2) ? "0" + f.toString() : f.toString();
    return ("" + first + currencyDecimalSeparator + last).replace(/ /g, '\u00A0'); // keep numbers from breaking
}
function fixedLocale(_val, _d, numberGroupSeparator, numberDecimalSeparator) {
    if (numberGroupSeparator === void 0) { numberGroupSeparator = ','; }
    if (numberDecimalSeparator === void 0) { numberDecimalSeparator = '.'; }
    var val = _val;
    var d = _d;
    var p;
    var v;
    var f;
    var fVal;
    var num;
    if (isNaN(val) || val === null) {
        return val;
    }
    if (typeof val === 'string') {
        val = parseFloat(val);
    }
    if (typeof d !== 'number') {
        d = 2;
    }
    if (d > 0) {
        p = Math.pow(10, d);
        v = val.toFixed(d); // only d decimal places
        f = Math.floor(parseFloat((p * (v - Math.floor(v))).toPrecision(d))); // for fractional part, only need d significant digits
        if (f === 0) {
            f = (String(p)).slice(1);
        }
    }
    else {
        p = Math.pow(10, 0);
        v = (Math.round(val * p) / p);
        f = 0;
    }
    num = Math.floor(v).toString();
    num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + numberGroupSeparator.replace('\\.', '.'));
    if (d > 0) {
        var frac = (f.toString().length < d) ? '' : f.toString();
        fVal = "" + num + numberDecimalSeparator + frac;
    }
    else {
        fVal = num;
    }
    return fVal.replace(/ /g, '\u00A0'); // keep numbers from breaking
}
function multiCurrency(val, code) {
    return currency(val) + " " + code;
}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__convert__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__number__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["date"] = date;
/* harmony export (immutable) */ exports["relativeDate"] = relativeDate;
/* harmony export (immutable) */ exports["timespan"] = timespan;



/**
 * Takes a date and format string and returns the formatted date as a string.
 * @param {Date|string} val Date to be converted. If string is passed it is converted to a date using {@link convert#toDateFromString Converts toDateFromString}.
 * @param {string} fmt Format string following [datejs formatting](http://code.google.com/p/datejs/wiki/FormatSpecifiers).
 * @param {boolean} utc If a date should be in UTC time set this flag to true to counter-act javascripts built-in timezone applier.
 * @return {string} Date formatted as a string.
 */
function date(val, fmt, utc, shortDateFormatText) {
    if (fmt === void 0) { fmt = 'M/D/YYYY'; }
    if (shortDateFormatText === void 0) { shortDateFormatText = 'M/D/YYYY'; }
    var dateValue;
    if (val instanceof Date) {
        dateValue = val;
    }
    else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__convert__["isDateString"])(val)) {
        dateValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__convert__["toDateFromString"])(val);
    }
    else {
        dateValue = null;
    }
    if (dateValue) {
        dateValue = __WEBPACK_IMPORTED_MODULE_0_moment__(dateValue);
        if (utc) {
            dateValue = dateValue.subtract({
                minutes: dateValue.utcOffset(),
            });
        }
        return dateValue.format(fmt || shortDateFormatText);
    }
    return val;
}
function relativeDate(_date, timeless) {
    var date = __WEBPACK_IMPORTED_MODULE_0_moment__(_date);
    if (!date || !date.isValid()) {
        throw new Error('Invalid date passed into Format.relativeDate');
    }
    if (timeless) {
        // utc
        date = date.subtract({
            minutes: date.utcOffset(),
        });
    }
    return date.fromNow();
}
/**
 * Takes a number of minutes and turns it into the string: `'n hours m minutes'`
 * @param {number|string} val Number of minutes, will be `parseFloat` before operations and fixed to 2 decimal places
 * @param {string} hoursText string to display next to an hour value greater than one, defaults to 'hours'
 * @param {string} hourText string to display next to an hour value equal to one, defaults to 'hour'
 * @param {string} minutesText string to display next to a minute value greater than one, defaults to 'minutes'
 * @param {string} minuteText string to display next to a minute value of one, defualts to 'minute'
 * @return {string} A string representation of the minutes as `'n hours m minutes'`
 */
function timespan(val, hoursText, hourText, minutesText, minuteText) {
    if (hoursText === void 0) { hoursText = 'hours'; }
    if (hourText === void 0) { hourText = 'hour'; }
    if (minutesText === void 0) { minutesText = 'minutes'; }
    if (minuteText === void 0) { minuteText = 'minute'; }
    var v = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__number__["fixed"])(val);
    if (isNaN(v) || !v) {
        return '';
    }
    var hrs = Math.floor(v / 60);
    var mins = v % 60;
    if (hrs) {
        hrs = hrs > 1 ? hrs + " " + hoursText : hrs + " " + hourText;
    }
    if (mins) {
        mins = mins > 1 ? mins + " " + minutesText : mins + " " + minuteText;
    }
    if (hrs && mins) {
        return hrs + " " + mins;
    }
    else if (hrs === 0) {
        return mins;
    }
    return hrs;
}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["formatUserInitial"] = formatUserInitial;
/* harmony export (immutable) */ exports["formatByUser"] = formatByUser;
/* harmony export (immutable) */ exports["nameLF"] = nameLF;
/* harmony export (immutable) */ exports["resolveFirstLast"] = resolveFirstLast;
/**
 * Takes a string input and converts name to First amd Last initials
 * `Lee Hogan` -> `LH`
 * @param {string} val
 * @returns {string}
 */
/**
 * Takes a string input and converts name to First amd Last initials
 * `Lee Hogan` -> `LH`
 * @param {string} val
 * @returns {string}
 */ function formatUserInitial(user) {
    var firstLast = resolveFirstLast(user);
    var initials = [firstLast[0].substr(0, 1)];
    if (firstLast[1]) {
        initials.push(firstLast[1].substr(0, 1));
    }
    return initials.join('').toUpperCase();
}
/**
 * Takes a string input and the user name to First amd Last name
 * `Hogan, Lee` -> `Lee Hogan`
 * @param {string} val
 * @returns {string}
 */
function formatByUser(user) {
    var name = resolveFirstLast(user);
    return name.join(' ');
}
/**
 * Attempts to convert the passed Object to the nameLF format
 * will return the last name or first name if both do not exist
 * @param {Object} val object containing the LastName and
 *  FirstName properties
 * @returns {string}
 */
function nameLF(val) {
    if (!val) {
        return '';
    }
    if (val.LastName && val.FirstName) {
        return val.LastName + ", " + val.FirstName;
    }
    return val.LastName ? val.LastName : val.FirstName;
}
/**
 * Takes a string input and the user name to First amd Last name
 * `Hogan, Lee` -> `Lee Hogan`
 * @param {string} val
 * @returns {string}
 */
function resolveFirstLast(name) {
    var firstLast = [];
    if (name.indexOf(' ') !== -1) {
        var names = name.split(' ');
        if (names[0].indexOf(',') !== -1) {
            firstLast = [names[1], names[0].slice(0, -1)];
        }
        else {
            firstLast = [names[0], names[1]];
        }
    }
    else {
        firstLast = [name];
    }
    return firstLast;
}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(exports, "phoneFormat", function() { return phoneFormat; });
/* harmony export (immutable) */ exports["alphaToPhoneNumeric"] = alphaToPhoneNumeric;
/* harmony export (immutable) */ exports["phone"] = phone;
var phoneLettersMap = [{
        test: /[ABC]/gi,
        val: '2',
    }, {
        test: /[DEF]/gi,
        val: '3',
    }, {
        test: /[GHI]/gi,
        val: '4',
    }, {
        test: /[JKL]/gi,
        val: '5',
    }, {
        test: /[MNO]/gi,
        val: '6',
    }, {
        test: /[PQRS]/gi,
        val: '7',
    }, {
        test: /[TUV]/gi,
        val: '8',
    }, {
        test: /[WXYZwyz]/g,
        val: '9',
    }];
/**
 * @property {Object[]}
 * Array of objects that have the keys `test` and `format` where `test` is a RegExp that
 * matches the phone grouping and `format` is the string format to be replaced.
 *
 * The RegExp may have capture groups but when you are defining the format strings use:
 *
 * * `${0}` - original value
 * * `${1}` - cleaned value
 * * `${2}` - entire match (against clean value)
 * * `${3..n}` - match groups (against clean value)
 *
 * The `clean value` is taking the inputted numbers/text and removing any non-number
 * and non-"x" and it replaces A-Z to their respective phone number character.
 *
 * The three default formatters are:
 * * `nnn-nnnn`
 * * `(nnn)-nnn-nnnn`
 * * `(nnn)-nnn-nnnxnnnn`
 *
 * If you plan to override this value make sure you include the default ones provided.
 *
 */
var phoneFormat = [{
        test: /^\+.*/,
        format: function (args) { return args[0]; },
    }, {
        test: /^(\d{3})(\d{3,4})$/,
        format: function (args) { return args[3] + "-" + args[4]; },
    }, {
        test: /^(\d{3})(\d{3})(\d{2,4})$/,
        format: function (args) { return "(" + args[3] + ")-" + args[4] + "-" + args[5]; },
    }, {
        test: /^(\d{3})(\d{3})(\d{2,4})([^0-9]{1,}.*)$/,
        format: function (args) { return "(" + args[3] + ")-" + args[4] + "-" + args[5] + args[6]; },
    }, {
        test: /^(\d{11,})(.*)$/,
        format: function (args) { return args[1]; },
    }];
/**
 * Takes a string input and converts A-Z to their respective phone number character
 * `1800CALLME` -> `1800225563`
 * @param val
 * @returns {string}
 */
function alphaToPhoneNumeric(val) {
    if (val === void 0) { val = ""; }
    var phoneVal = val || '';
    for (var i = 0; i < phoneLettersMap.length; i++) {
        phoneVal = phoneVal.replace(phoneLettersMap[i].test, phoneLettersMap[i].val);
    }
    return phoneVal;
}
/**
 * Takes a string phone input and attempts to match it against the predefined
 * phone formats - if a match is found it is returned formatted if not it is returned
 * as is.
 * @param val {string} String inputted phone number to format
 * @param asLink {boolean} True to put the phone in an anchor element pointing to a tel: uri
 * @returns {string}
 */
function phone(val, asLink) {
    if (val === void 0) { val = ''; }
    if (asLink === void 0) { asLink = false; }
    var phoneVal = alphaToPhoneNumeric(val);
    var formatters = phoneFormat;
    var clean = /^\+/.test(phoneVal) ? phoneVal : phoneVal.replace(/[^0-9x]/ig, '');
    var formattedMatch;
    for (var i = 0; i < formatters.length; i++) {
        var formatter = formatters[i];
        var match = void 0;
        if (match = formatter.test.exec(clean)) {
            formattedMatch = formatter.format([phoneVal, clean].concat(match));
        }
    }
    if (formattedMatch) {
        return asLink ? "<a href=\"tel:" + clean + "\">" + formattedMatch + "</a>" : formattedMatch;
    }
    return phoneVal;
}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["getRealActivityId"] = getRealActivityId;
/** Parses the activity ID
 * @param {string} activityId
 * A string with the activity id seperated by a semi-colon
 * @returns {string}
 */
/** Parses the activity ID
 * @param {string} activityId
 * A string with the activity id seperated by a semi-colon
 * @returns {string}
 */ function getRealActivityId(activityId) {
    var id = activityId;
    if (activityId) {
        if (activityId.indexOf(';') > 0) {
            id = activityId.substring(0, 12);
        }
        else {
            id = activityId;
        }
    }
    return id;
}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["memoize"] = memoize;
/* harmony export (immutable) */ exports["getValue"] = getValue;
/* harmony export (immutable) */ exports["setValue"] = setValue;
var nameToPathCache = {};
var nameToPath = function nameToPath(name) {
    if (typeof name !== 'string' || name === '.' || name === '') {
        return []; // '', for compatibility
    }
    if (nameToPathCache[name]) {
        return nameToPathCache[name];
    }
    var parts = name.split('.');
    var path = [];
    for (var i = 0; i < parts.length; i++) {
        var match = parts[i].match(/([a-zA-Z0-9_$]+)\[([^\]]+)\]/);
        if (match) {
            path.push(match[1]);
            if (/^\d+$/.test(match[2])) {
                path.push(parseInt(match[2], 10));
            }
            else {
                path.push(match[2]);
            }
        }
        else {
            path.push(parts[i]);
        }
    }
    nameToPathCache[name] = path.reverse();
    return nameToPathCache[name];
};
function memoize(fn, keyFn) {
    var cache = {};
    var _keyFn = keyFn || (function (value) {
        return value;
    });
    return function cached() {
        var key = _keyFn.apply(this, arguments);
        if (cache[key]) {
            return cache[key];
        }
        cache[key] = fn.apply(this, arguments);
        return cache[key];
    };
}
function getValue(o, name, defaultValue) {
    var path = nameToPath(name).slice(0);
    var current = o;
    while (current && path.length > 0) {
        var key = path.pop();
        if (typeof current[key] !== 'undefined') {
            current = current[key];
        }
        else {
            return typeof defaultValue !== 'undefined' ? defaultValue : null;
        }
    }
    return current;
}
function setValue(o, name, val) {
    var current = o;
    var path = nameToPath(name).slice(0);
    while ((typeof current !== 'undefined') && path.length > 1) {
        var key = path.pop();
        var next = path[path.length - 1];
        if (typeof current[key] !== 'undefined') {
            current = current[key] = current[key];
        }
        else if (typeof next === 'number') {
            current = current[key] = [];
        }
        else {
            current = current[key] = {};
        }
    }
    if (typeof path[0] !== 'undefined') {
        current[path[0]] = val;
    }
    return o;
}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["dojoDeclare"] = dojoDeclare;
function recursiveDeclare(tokens, depthLeft, val) {
    if (depthLeft > 0) {
        var property = tokens[tokens.length - depthLeft];
        var obj = {};
        obj[property] = recursiveDeclare(tokens, depthLeft - 1, val);
        return obj;
    }
    return val;
}
/**
 * Function to allow mobile to adapt the new framework without
 * a major code re-factor by utilizing the existing dojo.declare
 * functionality and providing it through this functionality
 *
 * MUST FIGURE OUT HOW TO HANDLE CALLS TO this.inherited(arguments) TO
 * CHAIN FUNCTION CALLS TO PARENT
 */
function dojoDeclare(moduleString, mixins, newObj) {
    if (newObj === void 0) { newObj = {}; }
    var tokens = moduleString.split('.');
    // Expect mixins to be a factory function for the class
    var mixedObj = Object.assign.apply(Object, [{}].concat(mixins.map(function (mixin) {
        if (typeof mixin === 'function') {
            return mixin();
        }
        return mixin;
    }), [newObj]));
    return recursiveDeclare(tokens, tokens.length, mixedObj);
}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["base64ArrayBuffer"] = base64ArrayBuffer;
/* harmony export (immutable) */ exports["getFileExtension"] = getFileExtension;
function base64ArrayBuffer(arrayBuffer) {
    var base64 = '';
    var chunk;
    var a;
    var b;
    var c;
    var d;
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + "==";
    }
    else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + "=";
    }
    return base64;
}
/** Gets the extension for a file.
 * @param {String} fileName
 * The file name including the extension
 * @returns {String}
 * Returns the file extension, if fileName is null or undefined, returns the string '.'
 */
function getFileExtension(fileName) {
    if (!fileName) {
        return '.';
    }
    return fileName.substr(fileName.lastIndexOf('.'));
}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(exports, "aggregateLookup", function() { return aggregateLookup; });
/* harmony export (immutable) */ exports["expand"] = expand;
/* harmony export (immutable) */ exports["joinFields"] = joinFields;
/**
 * Lookup table for the aggregate functions used by DashboardWidget
 */
/**
 * Lookup table for the aggregate functions used by DashboardWidget
 */ var aggregateLookup = {
    'calcProfit': function calcProfit(fn, widget, data) {
        var revenue = data[0];
        var cost = data[1];
        return fn.call(widget, revenue, cost);
    },
    'calcMargin': function calcMargin(fn, widget, data) {
        var revenue = data[0];
        var cost = data[1];
        return fn.call(widget, revenue, cost);
    },
    'calcYoYRevenue': function calcYoYRevenue(fn, widget, data) {
        var pastYear = data[0];
        var between = data[1];
        return fn.call(widget, pastYear, between);
    },
    'calcYoYProfit': function calcYoYProfit(fn, widget, data) {
        return fn.call(widget, data[0], data[2], data[1], data[3]);
    },
    'calcYoYMargin': function calcYoYMargin(fn, widget, data) {
        return fn.call(widget, data[0], data[2], data[1], data[3]);
    },
    'sum': function sum(fn, widget, data) {
        return fn.call(widget, data);
    },
};
function expand(scope, expression) {
    if (typeof expression === 'function') {
        return expression.apply(scope, Array.prototype.slice.call(arguments, 2));
    }
    return expression;
}
/**
 * @function
 * Utility function to join fields within a Simplate template.
 */
function joinFields(seperator, fields) {
    var results = fields.filter(function (item) { return item !== null && typeof item !== 'undefined' && item !== ''; });
    return results.join(seperator);
}
/**
 * @params
 * mappedLookups: Array of lookup names that must match the model names
 * mappedProperties: Array of the properties on the entry with the searched id
 * fields: Array of field names from the edit view
 * scope: 'this' of the edit view
 * @return
 * Returns a promise that is resolved once all entries are returned
 */
// TODO: Implement once models are functioning
// export function setFieldsFromIds(mappedLookups = [], mappedProperties = [], fields = [], scope, entry = {}) {
//   const promises = [];
//   fields.forEach((f, index) => {
//     const temp = scope.options.entry ? scope.options.entry[f] : null;
//     const value = entry[f] || scope.entry[f] || temp;
//     if (!value) {
//       return;
//     }
//     const model = Adapter.getModel(MODEL_NAMES[mappedLookups[index].toUpperCase()]);
//     if (!model) {
//       console.warn('Unable to locate model for ' + f);
//       return;
//     }
//     model.init();
//     const options = {
//       async: false,
//       queryModelName: 'detail',
//       query: `${mappedProperties[index]} eq "${value}"`,
//     };
//     const promise = model.getEntries(null, options);
//     promises.push(promise);
//     promise.then((entries) => {
//       const returned = entries[0];
//       if (returned) {
//         scope.fields[mappedLookups[index]].setSelection(returned);
//         scope.fields[mappedLookups[index]].onChange(scope.fields[mappedLookups[index]].currentSelection, scope.fields[mappedLookups[index]]);
//       }
//     });
//   });
//   return Promise.all(promises);
// }


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["debounce"] = debounce;
function debounce(fn, wait) {
    var handle = null;
    return function debounced() {
        window.clearTimeout(handle);
        var context = this;
        var args = arguments;
        handle = window.setTimeout(function () {
            fn.apply(context, args);
        }, wait);
    };
}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dojo_declare__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__file__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__function__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__http__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__math__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__string__ = __webpack_require__(18);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "getRealActivityId", function() { return __WEBPACK_IMPORTED_MODULE_0__activity__["getRealActivityId"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "memoize", function() { return __WEBPACK_IMPORTED_MODULE_1__data__["memoize"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "getValue", function() { return __WEBPACK_IMPORTED_MODULE_1__data__["getValue"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "setValue", function() { return __WEBPACK_IMPORTED_MODULE_1__data__["setValue"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "dojoDeclare", function() { return __WEBPACK_IMPORTED_MODULE_2__dojo_declare__["dojoDeclare"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "base64ArrayBuffer", function() { return __WEBPACK_IMPORTED_MODULE_3__file__["base64ArrayBuffer"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "getFileExtension", function() { return __WEBPACK_IMPORTED_MODULE_3__file__["getFileExtension"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "aggregateLookup", function() { return __WEBPACK_IMPORTED_MODULE_4__function__["aggregateLookup"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "expand", function() { return __WEBPACK_IMPORTED_MODULE_4__function__["expand"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "joinFields", function() { return __WEBPACK_IMPORTED_MODULE_4__function__["joinFields"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "debounce", function() { return __WEBPACK_IMPORTED_MODULE_5__http__["debounce"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "roundNumberTo", function() { return __WEBPACK_IMPORTED_MODULE_6__math__["roundNumberTo"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "sanitizeForJson", function() { return __WEBPACK_IMPORTED_MODULE_7__string__["sanitizeForJson"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "stripQueryArgs", function() { return __WEBPACK_IMPORTED_MODULE_7__string__["stripQueryArgs"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "trimText", function() { return __WEBPACK_IMPORTED_MODULE_7__string__["trimText"]; });
// export * from './math';








var Utility = Object.assign({}, __WEBPACK_IMPORTED_MODULE_0__activity__, __WEBPACK_IMPORTED_MODULE_1__data__, __WEBPACK_IMPORTED_MODULE_2__dojo_declare__, __WEBPACK_IMPORTED_MODULE_3__file__, __WEBPACK_IMPORTED_MODULE_4__function__, __WEBPACK_IMPORTED_MODULE_5__http__, __WEBPACK_IMPORTED_MODULE_6__math__, __WEBPACK_IMPORTED_MODULE_7__string__);
// if (window) {
//   window['Jupiter'] = Object.assign({}, window['Jupiter'], { Utility })
// }








/* harmony default export */ exports["default"] = Utility;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["roundNumberTo"] = roundNumberTo;
function roundNumberTo(number, precision) {
    var k = Math.pow(10, precision);
    return Math.round(number * k) / k;
}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["sanitizeForJson"] = sanitizeForJson;
/* harmony export (immutable) */ exports["stripQueryArgs"] = stripQueryArgs;
/* harmony export (immutable) */ exports["trimText"] = trimText;
/**
 * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
 * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
 * @return {Object} Object ready to be JSON.stringified.
 */
/**
 * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
 * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
 * @return {Object} Object ready to be JSON.stringified.
 */ function sanitizeForJson(obj) {
    var type;
    obj.__visited__ = true;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            try {
                type = typeof obj[key];
            }
            catch (e) {
                delete obj[key];
                continue;
            }
            switch (type) {
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
                        obj[key] = 'null';
                        break;
                    }
                    // break circular references
                    if (obj[key].__visited__) {
                        obj[key] = 'null';
                        break;
                    }
                    obj[key] = sanitizeForJson(obj[key]);
                    break;
                case 'string':
                    try {
                        obj[key] = JSON.parse(obj[key]);
                        if (typeof obj[key] === 'object') {
                            obj[key] = sanitizeForJson(obj[key]);
                        }
                    }
                    catch (e) { } //eslint-disable-line
                    break;
            }
        }
    }
    delete obj.__visited__;
    return obj;
}
function stripQueryArgs(url) {
    if (url === void 0) { url = ''; }
    var idx = url.indexOf('?');
    if (idx > -1) {
        return url.substr(0, idx);
    }
    return url;
}
function trimText(text, wordCount) {
    if (text === void 0) { text = ''; }
    if (wordCount === void 0) { wordCount = 0; }
    var words = text.split(' ');
    if (words.length > wordCount) {
        var intermediate = words.slice(0, wordCount);
        if (intermediate[wordCount - 1].endsWith('.')) {
            intermediate[wordCount - 1] = intermediate[wordCount - 1].slice(0, -1);
        }
        var value = intermediate.join(' ') + " ...";
        return value;
    }
    return text;
}


/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_19__;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__convert__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__format__ = __webpack_require__(21);
/* harmony reexport (module object) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__convert__; });
/* harmony reexport (module object) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__utility__; });
/* harmony reexport (module object) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__format__; });
/**
 * @module
 * @description
 * Common API
 */






/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__activity__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__address__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__currency__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__date__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__html__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__name__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__number__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__phone__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__string__ = __webpack_require__(2);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "userActivityFormatText", function() { return __WEBPACK_IMPORTED_MODULE_0__activity__["userActivityFormatText"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "userActivityStatus", function() { return __WEBPACK_IMPORTED_MODULE_0__activity__["userActivityStatus"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "addressCultureFormats", function() { return __WEBPACK_IMPORTED_MODULE_1__address__["addressCultureFormats"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "countryCultures", function() { return __WEBPACK_IMPORTED_MODULE_1__address__["countryCultures"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "addressItems", function() { return __WEBPACK_IMPORTED_MODULE_1__address__["addressItems"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "address", function() { return __WEBPACK_IMPORTED_MODULE_1__address__["address"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "resolveAddressCulture", function() { return __WEBPACK_IMPORTED_MODULE_1__address__["resolveAddressCulture"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "replaceAddressPart", function() { return __WEBPACK_IMPORTED_MODULE_1__address__["replaceAddressPart"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "currency", function() { return __WEBPACK_IMPORTED_MODULE_2__currency__["currency"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "fixedLocale", function() { return __WEBPACK_IMPORTED_MODULE_2__currency__["fixedLocale"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "multiCurrency", function() { return __WEBPACK_IMPORTED_MODULE_2__currency__["multiCurrency"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "date", function() { return __WEBPACK_IMPORTED_MODULE_3__date__["date"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "relativeDate", function() { return __WEBPACK_IMPORTED_MODULE_3__date__["relativeDate"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "timespan", function() { return __WEBPACK_IMPORTED_MODULE_3__date__["timespan"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "isiOSDesktop", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["isiOSDesktop"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "getVectorMaxSize", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["getVectorMaxSize"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "canvasDraw", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["canvasDraw"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "decode", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["decode"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "encode", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["encode"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "imageFromVector", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["imageFromVector"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "link", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["link"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "mail", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["mail"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "nl2br", function() { return __WEBPACK_IMPORTED_MODULE_4__html__["nl2br"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "formatUserInitial", function() { return __WEBPACK_IMPORTED_MODULE_5__name__["formatUserInitial"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "formatByUser", function() { return __WEBPACK_IMPORTED_MODULE_5__name__["formatByUser"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "nameLF", function() { return __WEBPACK_IMPORTED_MODULE_5__name__["nameLF"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "resolveFirstLast", function() { return __WEBPACK_IMPORTED_MODULE_5__name__["resolveFirstLast"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "bigNumber", function() { return __WEBPACK_IMPORTED_MODULE_6__number__["bigNumber"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "decimalAdjust", function() { return __WEBPACK_IMPORTED_MODULE_6__number__["decimalAdjust"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "fixed", function() { return __WEBPACK_IMPORTED_MODULE_6__number__["fixed"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "percent", function() { return __WEBPACK_IMPORTED_MODULE_6__number__["percent"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "phoneFormat", function() { return __WEBPACK_IMPORTED_MODULE_7__phone__["phoneFormat"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "alphaToPhoneNumeric", function() { return __WEBPACK_IMPORTED_MODULE_7__phone__["alphaToPhoneNumeric"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "phone", function() { return __WEBPACK_IMPORTED_MODULE_7__phone__["phone"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "bool", function() { return __WEBPACK_IMPORTED_MODULE_8__string__["bool"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "collapseSpace", function() { return __WEBPACK_IMPORTED_MODULE_8__string__["collapseSpace"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "fileSize", function() { return __WEBPACK_IMPORTED_MODULE_8__string__["fileSize"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "isEmpty", function() { return __WEBPACK_IMPORTED_MODULE_8__string__["isEmpty"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "trim", function() { return __WEBPACK_IMPORTED_MODULE_8__string__["trim"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "yesNo", function() { return __WEBPACK_IMPORTED_MODULE_8__string__["yesNo"]; });









var Format = Object.assign({}, __WEBPACK_IMPORTED_MODULE_0__activity__, __WEBPACK_IMPORTED_MODULE_1__address__, __WEBPACK_IMPORTED_MODULE_2__currency__, __WEBPACK_IMPORTED_MODULE_3__date__, __WEBPACK_IMPORTED_MODULE_4__html__, __WEBPACK_IMPORTED_MODULE_5__name__, __WEBPACK_IMPORTED_MODULE_6__number__, __WEBPACK_IMPORTED_MODULE_7__phone__, __WEBPACK_IMPORTED_MODULE_8__string__);
// if (window) {
//   window['Jupiter'] = Object.assign({}, window['Jupiter'], { Format });
// }









/* harmony default export */ exports["default"] = Format;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index__ = __webpack_require__(20);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "convert", function() { return __WEBPACK_IMPORTED_MODULE_0__src_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "utility", function() { return __WEBPACK_IMPORTED_MODULE_0__src_index__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "format", function() { return __WEBPACK_IMPORTED_MODULE_0__src_index__["c"]; });
/**
 * @module
 * @description
 * Common API
 */



/***/ }
/******/ ]);
});
//# sourceMappingURL=common.bundle.js.map