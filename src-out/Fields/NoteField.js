define('argos/Fields/NoteField', ['module', 'exports', 'dojo/_base/declare', './TextAreaField', '../FieldManager'], function (module, exports, _declare, _TextAreaField, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TextAreaField2 = _interopRequireDefault(_TextAreaField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.NoteField
   * @classdesc The NoteField is a special case where an overly long text string should be inserted and
   * you want to take the user to another view for that specific input.
   *
   * The special part is that the it passes the value between its editor via an object with a
   * "Note" property., meaning the Edit View layout should have a field bound to the `noteProperty`
   * defined in this field ("Notes" by default").
   *
   * @example
   *     {
   *         name: 'FullDescription',
   *         property: 'FullDescription',
   *         label: this.fullDescriptionText,
   *         type: 'note',
   *         view: 'text_editor_edit'
   *     }
   * @extends argos.Fields.TextAreaField
   * @requires argos.FieldManager
   */
  var control = (0, _declare2.default)('argos.Fields.NoteField', [_TextAreaField2.default], {}); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  exports.default = _FieldManager2.default.register('note', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvTm90ZUZpZWxkLmpzIl0sIm5hbWVzIjpbImNvbnRyb2wiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLE1BQU1BLFVBQVUsdUJBQVEsd0JBQVIsRUFBa0MseUJBQWxDLEVBQW1ELEVBQW5ELENBQWhCLEMsQ0F2Q0E7Ozs7Ozs7Ozs7Ozs7OztvQkF5Q2UsdUJBQWFDLFFBQWIsQ0FBc0IsTUFBdEIsRUFBOEJELE9BQTlCLEMiLCJmaWxlIjoiTm90ZUZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgVGV4dEFyZWFGaWVsZCBmcm9tICcuL1RleHRBcmVhRmllbGQnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5Ob3RlRmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgTm90ZUZpZWxkIGlzIGEgc3BlY2lhbCBjYXNlIHdoZXJlIGFuIG92ZXJseSBsb25nIHRleHQgc3RyaW5nIHNob3VsZCBiZSBpbnNlcnRlZCBhbmRcclxuICogeW91IHdhbnQgdG8gdGFrZSB0aGUgdXNlciB0byBhbm90aGVyIHZpZXcgZm9yIHRoYXQgc3BlY2lmaWMgaW5wdXQuXHJcbiAqXHJcbiAqIFRoZSBzcGVjaWFsIHBhcnQgaXMgdGhhdCB0aGUgaXQgcGFzc2VzIHRoZSB2YWx1ZSBiZXR3ZWVuIGl0cyBlZGl0b3IgdmlhIGFuIG9iamVjdCB3aXRoIGFcclxuICogXCJOb3RlXCIgcHJvcGVydHkuLCBtZWFuaW5nIHRoZSBFZGl0IFZpZXcgbGF5b3V0IHNob3VsZCBoYXZlIGEgZmllbGQgYm91bmQgdG8gdGhlIGBub3RlUHJvcGVydHlgXHJcbiAqIGRlZmluZWQgaW4gdGhpcyBmaWVsZCAoXCJOb3Rlc1wiIGJ5IGRlZmF1bHRcIikuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ0Z1bGxEZXNjcmlwdGlvbicsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdGdWxsRGVzY3JpcHRpb24nLFxyXG4gKiAgICAgICAgIGxhYmVsOiB0aGlzLmZ1bGxEZXNjcmlwdGlvblRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ25vdGUnLFxyXG4gKiAgICAgICAgIHZpZXc6ICd0ZXh0X2VkaXRvcl9lZGl0J1xyXG4gKiAgICAgfVxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuVGV4dEFyZWFGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRNYW5hZ2VyXHJcbiAqL1xyXG5jb25zdCBjb250cm9sID0gZGVjbGFyZSgnYXJnb3MuRmllbGRzLk5vdGVGaWVsZCcsIFtUZXh0QXJlYUZpZWxkXSwge30pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdub3RlJywgY29udHJvbCk7XHJcbiJdfQ==