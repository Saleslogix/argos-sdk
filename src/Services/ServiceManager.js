/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
 * @class Sage.Platform.Mobile.Services.ServiceManager
 * Service Manager is a registry for all services types that are used in the application
 * @alternateClassName ServiceManager
 * @singleton
 */
define('Sage/Platform/Mobile/Services/ServiceManager', [
    'dojo/_base/lang',
     'dojo/promise/all',
    'dojo/when',
    'dojo/_base/Deferred'

], function(
    lang,
    all,
    when,
    Deferred
) {
    var store = {};
    return lang.setObject('Sage.Platform.Mobile.Services.ServiceManager', {
        /**
         * @property {Object}
         * The type map that translates string type names to constructor functions
         */
        store: store,
       
        /**
         * Retrieves a constructor for the given service name
         * @param name Unique name of the service
         * @return {Function} Constructor for the given service name
         */
        register: function (name, ctor) {
            this.store[name] = { ctor: ctor, instance: null };
            return ctor;
        },
        init: function() {

           
        },
        get: function (name) {
            var instance, service;
            instance = null;
            service = this.store[name];
            if (service) {
                if (!service.instance) {
                    service.instance = new service.ctor();
                    service.instance.init();
                } 
                instance = service.instance;                
            }            
            return instance;
        }
        
    });
});
