/* Copyright (c) 2014, SalesLogix, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
