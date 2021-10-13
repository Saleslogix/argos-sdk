define('argos/_Templated', ['module', 'exports', 'dojo/_base/declare', 'dijit/_TemplatedMixin'], function (module, exports, _declare, _TemplatedMixin2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TemplatedMixin3 = _interopRequireDefault(_TemplatedMixin2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/_Templated
   * @mixin
   * @classdesc _Templated serves as an override for dijit Widgets to enable the use of
   * Simplates for templates it also holds the function to pull the resource strings from l20n.
   */
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
   * @module argos/_Templated
   */
  const __class = (0, _declare2.default)('argos._Templated', [_TemplatedMixin3.default], /** @lends module:argos/_Templated.prototype */{

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
        const root = $(this.templateString);

        if (root.length > 1) {
          this.templateString = ['<div>', this.templateString, '</div>'].join('');
        }
      }

      this.inherited(buildRendering, arguments);
    },
    startup: function startup() {
      this.inherited(startup, arguments);
      setTimeout(() => {
        this.initSoho();
      }, 1);
    },
    initSoho: function initSoho() {},
    updateSoho: function updateSoho() {}
  });

  exports.default = __class;
  module.exports = exports['default'];
});