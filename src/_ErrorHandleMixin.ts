/**
 * @class argos._ErrorHandleMixin
 * General mixin for handling errors in a chainable fashion.
 * @alternateClassName _ErrorHandleMixin
 */
import _declare = require('dojo/_base/declare');
import lang = require('dojo/_base/lang');
import array = require('dojo/_base/array');

var __class = _declare('argos._ErrorHandleMixin', null, {
    /**
        * @property {Object}
        * Localized error messages. One general error message, and messages by HTTP status code.
        */
    errorText: {
        general: 'A server error occured.',
        status: {
        }
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
    createErrorHandlers: function() {
        return this.errorHandlers || [];
    },
    /**
        * Starts matching and executing errorHandlers.
        * @param {Error} error Error to pass to the errorHandlers
        */
    handleError: function(error) {
        if (!error) {
            return;
        }

        var matches, noop, getNext, len;

        noop = function() {};

        matches = array.filter((<any[]>this.errorHandlers), (handler) => {
            return handler.test && handler.test.call(this, error);
        });

        len = matches.length;

        getNext = (index) => {
            // next() chain has ended, return a no-op so calling next() in the last chain won't error
            if (index === len) {
                return noop;
            }

            // Return a closure with index and matches captured.
            // The handle function can call its "next" param to continue the chain.
            return () => {
                var nextHandler, nextFn;
                nextHandler = matches[index];
                nextFn = nextHandler && nextHandler.handle;

                nextFn.call(this, error, getNext(index + 1));
            };
        };

        if (len > 0 && matches[0].handle) {
            // Start the handle chain, the handle can call next() to continue the iteration
            matches[0].handle.call(this, error, getNext(1));
        }
    },
    /**
        * Gets the general error message, or the error message for the status code.
        */
    getErrorMessage: function(error) {
        var message = this.errorText.general;

        if (error) {
            message = this.errorText.status[error.status] || this.errorText.general;
        }

        return message;
    }
});

lang.setObject('Sage.Platform.Mobile._ErrorHandleMixin', __class, window);
export = <argos._ErrorHandleMixin>__class;
