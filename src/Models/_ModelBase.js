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
 * @class Sage.Platform.Mobile.Models._ModelBase
 * Model is the base class for all data models. It describes all the functions a model should support giving no implementation itself, merely a shell. The one function that `_Field` does provide that most fields leave untouched is `validate`.
 *
 * 
 * @alternateClassName _ModelBase
 */
define('Sage/Platform/Mobile/Models/_ModelBase', [
    'dojo/_base/declare',
    'dojo/_base/lang'

], function(
    declare,
    lang
) {

    return declare('Sage.Platform.Mobile.Models._ModelBase', null, {
        
         /**
         * @property {String}
         * The unique (within the current form) name of the model
         */
        name: 'baseModel',
        dispalyName: 'baseModel',
        displayNamePlural: 'baseModels',
        constructor: function(o) {
            lang.mixin(this, o);

        },
        init: function(){

         
        }
        
        
    });
});
