define('argos/_Templated', ['exports', 'module', 'dojo/dom-construct', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_TemplatedMixin'], function (exports, module, _dojoDomConstruct, _dojo_baseDeclare, _dojo_baseLang, _dijit_TemplatedMixin) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _TemplatedMixin2 = _interopRequireDefault(_dijit_TemplatedMixin);

  /**
   * @class argos._Templated
   * _Templated serves as an override for dijit Widgets to enable the use of
   * Simplates for templates.
   *
   * @alternateClassName _Templated
   */
  var __class = (0, _declare['default'])('argos._Templated', [_TemplatedMixin2['default']], {
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
        var root = _domConstruct['default'].toDom(this.templateString);

        if (root.nodeType === 11) {
          this.templateString = ['<div>', this.templateString, '</div>'].join('');
        }
      }

      this.inherited(arguments);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile._Templated', __class);
  module.exports = __class;
});
