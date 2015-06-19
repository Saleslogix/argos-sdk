import domConstruct = require('dojo/dom-construct');
import _declare = require('dojo/_base/declare');
import query = require('dojo/query');
import parser = require('dojo/parser');
import array = require('dojo/_base/array');
import lang = require('dojo/_base/lang');
import registry = require('dijit/registry');
import wai = require('dijit/_base/wai');
import _TemplatedMixin = require('dijit/_TemplatedMixin');

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
 * @class argos._Templated
 */

/**
* _Templated serves as an override for dijit Widgets to enable the use of
* Simplates for templates.
*
* @alternateClassName _Templated
*/
var __class = _declare('argos._Templated', [_TemplatedMixin], {
    _stringRepl: function(tmpl) {
        return tmpl;
    },
    /**
        * Processes `this.widgetTemplate` or `this.contentTemplate`
        */
    buildRendering: function() {
        var root;

        if (this.widgetTemplate && this.contentTemplate) {
            throw new Error('Both "widgetTemplate" and "contentTemplate" cannot be specified at the same time.');
        }

        if (this.contentTemplate) {
            this.templateString = ['<div>', this.contentTemplate.apply(this), '</div>'].join('');
        } else if (this.widgetTemplate) {
            this.templateString = this.widgetTemplate.apply(this);
            root = domConstruct.toDom(this.templateString);

            if (root.nodeType === 11) {
                this.templateString = ['<div>', this.templateString, '</div>'].join('');
            }
        }

        this.inherited(arguments);
    }
});


lang.setObject('Sage.Platform.Mobile._Templated', __class, window);
export = <argos._Templated>__class;
