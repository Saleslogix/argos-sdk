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
import domConstruct from 'dojo/dom-construct';
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _TemplatedMixin from 'dijit/_TemplatedMixin';

/**
 * @class argos._Templated
 * _Templated serves as an override for dijit Widgets to enable the use of
 * Simplates for templates it also holds the function to pull the resource strings from l20n.
 *
 * @alternateClassName _Templated
 */
const __class = declare('argos._Templated', [_TemplatedMixin], {

  _stringRepl: function _stringRepl(tmpl) {
    return tmpl;
  },
  /**
   * Processes `this.widgetTemplate` or `this.contentTemplate`
   */
  buildRendering: function buildRendering() {
    if (this.widgetTemplate && this.contentTemplate) {
      throw new Error('Both "widgetTemplate" and "contentTemplate" cannot be specified at the same time.');
    }

    if (this.contentTemplate) {
      this.templateString = ['<div>', this.contentTemplate.apply(this), '</div>'].join('');
    } else if (this.widgetTemplate) {
      this.templateString = this.widgetTemplate.apply(this);
      const root = domConstruct.toDom(this.templateString);

      if (root.nodeType === 11) {
        this.templateString = ['<div>', this.templateString, '</div>'].join('');
      }
    }

    this.inherited(arguments);
  },
});

lang.setObject('Sage.Platform.Mobile._Templated', __class);
export default __class;
