/* 
 * See copyright file.
 */

/**
 * @class Sage.Platform.Mobile.Services._ServiceBase
 * The base class for all services.
 *
 * 
 * @alternateClassName _ServiceBase

 */
define('Sage/Platform/Mobile/Services/_ServiceBase', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'Sage/Platform/Mobile/Models/_ModelBase',

], function(
    declare,
    lang,
    _ModelBase
) {
    var store = {};
    return declare('Sage.Platform.Mobile.Services._ServiceBase', null, {
        
        store: store,
        
        /**
         * @property {String}
         * The unique (within the current form) name of the service
         */
        name: 'baseService',
        
        constructor: function(o) {
            lang.mixin(this, o);
        },
        init: function () {
            
        }       
        
    });
});
