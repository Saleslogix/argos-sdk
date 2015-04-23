/* Copyright (c) 2014 Infor. All rights reserved.
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
 * @class Sage.Platform.Mobile._ModelBase
 * A base model class for views to consume
 * @alternateClassName _ModelBase
 */
define('argos/_ModelBase', [
    'dojo/_base/declare',
    'dojo/Evented',
    'dojo/Stateful'
], function(declare, Evented, Stateful) {

    return declare('argos._ModelBase', [Evented, Stateful], {
        metadata: null,
        _metadataGetter: function() {
            return this.metadata;
        },
        _metadataSetter: function(value) {
            this.metadata = value;
        },
        getEntry: function(options) {
        }
    });
});
