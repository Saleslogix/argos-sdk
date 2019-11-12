define('argos/Fields/TextAreaField', ['module', 'exports', 'dojo/_base/declare', './TextField', '../FieldManager'], function (module, exports, _declare, _TextField, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.TextAreaField
   * @classdesc The TextAreaField extends the base TextField by changing the input element to
   * an `<textarea>` element with a configurable amount of visible rows.
   *
   * @example
   *     {
   *         name: 'Description',
   *         property: 'Description',
   *         label: this.descriptionText,
   *         type: 'textarea',
   *         rows: 6
   *     }
   * @extends argos.Fields.TextField
   * @requires argos.FieldManager
   */
  var control = (0, _declare2.default)('argos.Fields.TextAreaField', [_TextField2.default], /** @lends argos.Fields.TextAreaField# */{
    /**
     * @cfg {Number}
     * Number of rows to show visually, does not constrain input.
     */
    rows: 4,
    /**
     * @property {Boolean}
     * Overrides default to hide the clear button.
     */
    enableClearButton: false,
    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['<label for="{%= $.name %}">{%: $.label %}</label>', '<textarea data-dojo-attach-point="inputNode" name="{%= $.name %}" rows="{%: $.rows %}" {% if ($.readonly) { %} readonly {% } %}></textarea>']),
    setValue: function setValue() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var initial = arguments[1];

      if (initial) {
        this.originalValue = val;
      }

      this.previousValue = false;
      // IE/Edge shows null values in Text Area Fields, check that we're not setting displayed value as null
      this.set('inputValue', val === null ? '' : val);
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  exports.default = _FieldManager2.default.register('textarea', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvVGV4dEFyZWFGaWVsZC5qcyJdLCJuYW1lcyI6WyJjb250cm9sIiwicm93cyIsImVuYWJsZUNsZWFyQnV0dG9uIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInNldFZhbHVlIiwidmFsIiwiaW5pdGlhbCIsIm9yaWdpbmFsVmFsdWUiLCJwcmV2aW91c1ZhbHVlIiwic2V0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLE1BQU1BLFVBQVUsdUJBQVEsNEJBQVIsRUFBc0MscUJBQXRDLEVBQW1ELHlDQUF5QztBQUMxRzs7OztBQUlBQyxVQUFNLENBTG9HO0FBTTFHOzs7O0FBSUFDLHVCQUFtQixLQVZ1RjtBQVcxRzs7Ozs7Ozs7QUFRQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixtREFEMkIsRUFFM0IsNklBRjJCLENBQWIsQ0FuQjBGO0FBdUIxR0MsY0FBVSxTQUFTQSxRQUFULEdBQXFDO0FBQUEsVUFBbkJDLEdBQW1CLHVFQUFiLEVBQWE7QUFBQSxVQUFUQyxPQUFTOztBQUM3QyxVQUFJQSxPQUFKLEVBQWE7QUFDWCxhQUFLQyxhQUFMLEdBQXFCRixHQUFyQjtBQUNEOztBQUVELFdBQUtHLGFBQUwsR0FBcUIsS0FBckI7QUFDQTtBQUNBLFdBQUtDLEdBQUwsQ0FBUyxZQUFULEVBQXVCSixRQUFRLElBQVIsR0FBZSxFQUFmLEdBQW9CQSxHQUEzQztBQUNEO0FBL0J5RyxHQUE1RixDQUFoQixDLENBbkNBOzs7Ozs7Ozs7Ozs7Ozs7b0JBcUVlLHVCQUFhSyxRQUFiLENBQXNCLFVBQXRCLEVBQWtDWCxPQUFsQyxDIiwiZmlsZSI6IlRleHRBcmVhRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBUZXh0RmllbGQgZnJvbSAnLi9UZXh0RmllbGQnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5UZXh0QXJlYUZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIFRleHRBcmVhRmllbGQgZXh0ZW5kcyB0aGUgYmFzZSBUZXh0RmllbGQgYnkgY2hhbmdpbmcgdGhlIGlucHV0IGVsZW1lbnQgdG9cclxuICogYW4gYDx0ZXh0YXJlYT5gIGVsZW1lbnQgd2l0aCBhIGNvbmZpZ3VyYWJsZSBhbW91bnQgb2YgdmlzaWJsZSByb3dzLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgICAge1xyXG4gKiAgICAgICAgIG5hbWU6ICdEZXNjcmlwdGlvbicsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdEZXNjcmlwdGlvbicsXHJcbiAqICAgICAgICAgbGFiZWw6IHRoaXMuZGVzY3JpcHRpb25UZXh0LFxyXG4gKiAgICAgICAgIHR5cGU6ICd0ZXh0YXJlYScsXHJcbiAqICAgICAgICAgcm93czogNlxyXG4gKiAgICAgfVxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuVGV4dEZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICovXHJcbmNvbnN0IGNvbnRyb2wgPSBkZWNsYXJlKCdhcmdvcy5GaWVsZHMuVGV4dEFyZWFGaWVsZCcsIFtUZXh0RmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLkZpZWxkcy5UZXh0QXJlYUZpZWxkIyAqL3tcclxuICAvKipcclxuICAgKiBAY2ZnIHtOdW1iZXJ9XHJcbiAgICogTnVtYmVyIG9mIHJvd3MgdG8gc2hvdyB2aXN1YWxseSwgZG9lcyBub3QgY29uc3RyYWluIGlucHV0LlxyXG4gICAqL1xyXG4gIHJvd3M6IDQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIE92ZXJyaWRlcyBkZWZhdWx0IHRvIGhpZGUgdGhlIGNsZWFyIGJ1dHRvbi5cclxuICAgKi9cclxuICBlbmFibGVDbGVhckJ1dHRvbjogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIGZpZWxkcyBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gRmllbGQgaW5zdGFuY2VcclxuICAgKiAqIGAkJGAgPT4gT3duZXIgVmlldyBpbnN0YW5jZVxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxhYmVsIGZvcj1cInslPSAkLm5hbWUgJX1cIj57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8dGV4dGFyZWEgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImlucHV0Tm9kZVwiIG5hbWU9XCJ7JT0gJC5uYW1lICV9XCIgcm93cz1cInslOiAkLnJvd3MgJX1cIiB7JSBpZiAoJC5yZWFkb25seSkgeyAlfSByZWFkb25seSB7JSB9ICV9PjwvdGV4dGFyZWE+JyxcclxuICBdKSxcclxuICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodmFsID0gJycsIGluaXRpYWwpIHtcclxuICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByZXZpb3VzVmFsdWUgPSBmYWxzZTtcclxuICAgIC8vIElFL0VkZ2Ugc2hvd3MgbnVsbCB2YWx1ZXMgaW4gVGV4dCBBcmVhIEZpZWxkcywgY2hlY2sgdGhhdCB3ZSdyZSBub3Qgc2V0dGluZyBkaXNwbGF5ZWQgdmFsdWUgYXMgbnVsbFxyXG4gICAgdGhpcy5zZXQoJ2lucHV0VmFsdWUnLCB2YWwgPT09IG51bGwgPyAnJyA6IHZhbCk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZE1hbmFnZXIucmVnaXN0ZXIoJ3RleHRhcmVhJywgY29udHJvbCk7XHJcbiJdfQ==