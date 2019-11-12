define('argos/Fields/BooleanField', ['module', 'exports', 'dojo/_base/declare', './_Field', '../FieldManager'], function (module, exports, _declare, _Field, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Field2 = _interopRequireDefault(_Field);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.BooleanField
   * @classdesc The Boolean Field is used for true/false values and is visualized as a toggle or light switch.
   *
   * @example
   *     {
   *         name: 'IsLead',
   *         property: 'IsLead',
   *         label: this.isLeadText,
   *         type: 'boolean'
   *     }
   *
   * @extends argos.Fields._Field
   * @requires argos.FieldManager
   */
  var control = (0, _declare2.default)('argos.Fields.BooleanField', [_Field2.default], /** @lends argos.Fields.BooleanField# */{
    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['\n      <div class="switch">\n        <input\n          data-dojo-attach-point="toggleNode"\n          type="checkbox" {% if($.checked) { %}checked{% } %}\n          id="{%= $.id %}_{%= $.name %}"\n          name="{%= $.name %}" class="switch" />\n        <label for="{%= $.id %}_{%= $.name %}">{%: $.label %}</label>\n      </div>\n    ']),
    /**
     * @property {HTMLElement}
     * The div node that holds the toggled attribute
     */
    toggleNode: null,

    /**
     * @property {Boolean}
     * Local value used to reset toggle node if the field is disabled
     */
    toggleValue: false,

    /**
     * @property {Boolean}
     * When clearing the boolean field it sets the fields value to `this.checked`
     */
    checked: false,

    /**
     * Value used during dirty/modified comparison
     */
    originalValue: null,

    initSoho: function initSoho() {
      $(this.toggleNode).on('click', this._onClick.bind(this));
    },
    /**
     * Fires with the toggle switch is pressed and sets the value to
     * the opposite of the current value
     * @param {Event} evt The click/tap event
     */
    _onClick: function _onClick() /* evt*/{
      if (this.isDisabled()) {
        this.toggleNode.checked = this.toggleValue;
        return;
      }

      var toggledValue = this.getValue();
      this.setValue(toggledValue);
    },
    /**
     * Returns the current toggled state
     * @return {Boolean}
     */
    getValue: function getValue() {
      return this.toggleNode.checked;
    },
    /**
     * Sets the toggled attribute of the field and applies the needed styling.
     *
     * It also directly fires the {@link _Field#onChange onChange} event.
     *
     * @param {Boolean/String/Number} val If string is passed it will use `'true'` or `'t'` for true. If number then 0 for true.
     * @param {Boolean} initial If true sets the value as the original value and is later used for dirty/modified detection.
     */
    setValue: function setValue(val, initial) {
      var newVal = typeof val === 'string' ? /^(true|t|0)$/i.test(val) : !!val;

      if (initial) {
        this.originalValue = newVal;
      }

      this.toggleValue = newVal;
      this.toggleNode.checked = newVal;
      this.onChange(newVal, this);
    },
    /**
     * Sets the value back to `this.checked` as the initial value. If true is passed it sets
     * `this.checked` as a dirty/modified value.
     * @param {Boolean} flag Signifies if the cleared value should be set as modified (true) or initial (false/undefined)
     */
    clearValue: function clearValue(flag) {
      var initial = flag !== true;
      this.setValue(this.checked, initial);
    },
    /**
     * Determines if the field has been modified from it's original value
     * @return {Boolean}
     */
    isDirty: function isDirty() {
      return this.originalValue !== this.getValue();
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

  exports.default = _FieldManager2.default.register('boolean', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvQm9vbGVhbkZpZWxkLmpzIl0sIm5hbWVzIjpbImNvbnRyb2wiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwidG9nZ2xlTm9kZSIsInRvZ2dsZVZhbHVlIiwiY2hlY2tlZCIsIm9yaWdpbmFsVmFsdWUiLCJpbml0U29obyIsIiQiLCJvbiIsIl9vbkNsaWNrIiwiYmluZCIsImlzRGlzYWJsZWQiLCJ0b2dnbGVkVmFsdWUiLCJnZXRWYWx1ZSIsInNldFZhbHVlIiwidmFsIiwiaW5pdGlhbCIsIm5ld1ZhbCIsInRlc3QiLCJvbkNoYW5nZSIsImNsZWFyVmFsdWUiLCJmbGFnIiwiaXNEaXJ0eSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsTUFBTUEsVUFBVSx1QkFBUSwyQkFBUixFQUFxQyxpQkFBckMsRUFBOEMsd0NBQXdDO0FBQ3BHOzs7Ozs7OztBQVFBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLHFWQUFiLENBVG9GO0FBb0JwRzs7OztBQUlBQyxnQkFBWSxJQXhCd0Y7O0FBMEJwRzs7OztBQUlBQyxpQkFBYSxLQTlCdUY7O0FBZ0NwRzs7OztBQUlBQyxhQUFTLEtBcEMyRjs7QUFzQ3BHOzs7QUFHQUMsbUJBQWUsSUF6Q3FGOztBQTJDcEdDLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QkMsUUFBRSxLQUFLTCxVQUFQLEVBQW1CTSxFQUFuQixDQUFzQixPQUF0QixFQUErQixLQUFLQyxRQUFMLENBQWNDLElBQWQsQ0FBbUIsSUFBbkIsQ0FBL0I7QUFDRCxLQTdDbUc7QUE4Q3BHOzs7OztBQUtBRCxjQUFVLFNBQVNBLFFBQVQsR0FBa0IsUUFBVTtBQUNwQyxVQUFJLEtBQUtFLFVBQUwsRUFBSixFQUF1QjtBQUNyQixhQUFLVCxVQUFMLENBQWdCRSxPQUFoQixHQUEwQixLQUFLRCxXQUEvQjtBQUNBO0FBQ0Q7O0FBRUQsVUFBTVMsZUFBZSxLQUFLQyxRQUFMLEVBQXJCO0FBQ0EsV0FBS0MsUUFBTCxDQUFjRixZQUFkO0FBQ0QsS0EzRG1HO0FBNERwRzs7OztBQUlBQyxjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUIsYUFBTyxLQUFLWCxVQUFMLENBQWdCRSxPQUF2QjtBQUNELEtBbEVtRztBQW1FcEc7Ozs7Ozs7O0FBUUFVLGNBQVUsU0FBU0EsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLE9BQXZCLEVBQWdDO0FBQ3hDLFVBQU1DLFNBQVMsT0FBT0YsR0FBUCxLQUFlLFFBQWYsR0FBMEIsZ0JBQWdCRyxJQUFoQixDQUFxQkgsR0FBckIsQ0FBMUIsR0FBc0QsQ0FBQyxDQUFDQSxHQUF2RTs7QUFFQSxVQUFJQyxPQUFKLEVBQWE7QUFDWCxhQUFLWCxhQUFMLEdBQXFCWSxNQUFyQjtBQUNEOztBQUVELFdBQUtkLFdBQUwsR0FBbUJjLE1BQW5CO0FBQ0EsV0FBS2YsVUFBTCxDQUFnQkUsT0FBaEIsR0FBMEJhLE1BQTFCO0FBQ0EsV0FBS0UsUUFBTCxDQUFjRixNQUFkLEVBQXNCLElBQXRCO0FBQ0QsS0FyRm1HO0FBc0ZwRzs7Ozs7QUFLQUcsZ0JBQVksU0FBU0EsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDcEMsVUFBTUwsVUFBVUssU0FBUyxJQUF6QjtBQUNBLFdBQUtQLFFBQUwsQ0FBYyxLQUFLVixPQUFuQixFQUE0QlksT0FBNUI7QUFDRCxLQTlGbUc7QUErRnBHOzs7O0FBSUFNLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUMxQixhQUFRLEtBQUtqQixhQUFMLEtBQXVCLEtBQUtRLFFBQUwsRUFBL0I7QUFDRDtBQXJHbUcsR0FBdEYsQ0FBaEIsQyxDQWxDQTs7Ozs7Ozs7Ozs7Ozs7O29CQTBJZSx1QkFBYVUsUUFBYixDQUFzQixTQUF0QixFQUFpQ3hCLE9BQWpDLEMiLCJmaWxlIjoiQm9vbGVhbkZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgRmllbGQgZnJvbSAnLi9fRmllbGQnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5Cb29sZWFuRmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgQm9vbGVhbiBGaWVsZCBpcyB1c2VkIGZvciB0cnVlL2ZhbHNlIHZhbHVlcyBhbmQgaXMgdmlzdWFsaXplZCBhcyBhIHRvZ2dsZSBvciBsaWdodCBzd2l0Y2guXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ0lzTGVhZCcsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdJc0xlYWQnLFxyXG4gKiAgICAgICAgIGxhYmVsOiB0aGlzLmlzTGVhZFRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAqICAgICB9XHJcbiAqXHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5fRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5Cb29sZWFuRmllbGQnLCBbRmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLkZpZWxkcy5Cb29sZWFuRmllbGQjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBmaWVsZHMgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IEZpZWxkIGluc3RhbmNlXHJcbiAgICogKiBgJCRgID0+IE93bmVyIFZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW2BcclxuICAgICAgPGRpdiBjbGFzcz1cInN3aXRjaFwiPlxyXG4gICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRvZ2dsZU5vZGVcIlxyXG4gICAgICAgICAgdHlwZT1cImNoZWNrYm94XCIgeyUgaWYoJC5jaGVja2VkKSB7ICV9Y2hlY2tlZHslIH0gJX1cclxuICAgICAgICAgIGlkPVwieyU9ICQuaWQgJX1feyU9ICQubmFtZSAlfVwiXHJcbiAgICAgICAgICBuYW1lPVwieyU9ICQubmFtZSAlfVwiIGNsYXNzPVwic3dpdGNoXCIgLz5cclxuICAgICAgICA8bGFiZWwgZm9yPVwieyU9ICQuaWQgJX1feyU9ICQubmFtZSAlfVwiPnslOiAkLmxhYmVsICV9PC9sYWJlbD5cclxuICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9XHJcbiAgICogVGhlIGRpdiBub2RlIHRoYXQgaG9sZHMgdGhlIHRvZ2dsZWQgYXR0cmlidXRlXHJcbiAgICovXHJcbiAgdG9nZ2xlTm9kZTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIExvY2FsIHZhbHVlIHVzZWQgdG8gcmVzZXQgdG9nZ2xlIG5vZGUgaWYgdGhlIGZpZWxkIGlzIGRpc2FibGVkXHJcbiAgICovXHJcbiAgdG9nZ2xlVmFsdWU6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogV2hlbiBjbGVhcmluZyB0aGUgYm9vbGVhbiBmaWVsZCBpdCBzZXRzIHRoZSBmaWVsZHMgdmFsdWUgdG8gYHRoaXMuY2hlY2tlZGBcclxuICAgKi9cclxuICBjaGVja2VkOiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogVmFsdWUgdXNlZCBkdXJpbmcgZGlydHkvbW9kaWZpZWQgY29tcGFyaXNvblxyXG4gICAqL1xyXG4gIG9yaWdpbmFsVmFsdWU6IG51bGwsXHJcblxyXG4gIGluaXRTb2hvOiBmdW5jdGlvbiBpbml0U29obygpIHtcclxuICAgICQodGhpcy50b2dnbGVOb2RlKS5vbignY2xpY2snLCB0aGlzLl9vbkNsaWNrLmJpbmQodGhpcykpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRmlyZXMgd2l0aCB0aGUgdG9nZ2xlIHN3aXRjaCBpcyBwcmVzc2VkIGFuZCBzZXRzIHRoZSB2YWx1ZSB0b1xyXG4gICAqIHRoZSBvcHBvc2l0ZSBvZiB0aGUgY3VycmVudCB2YWx1ZVxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgY2xpY2svdGFwIGV2ZW50XHJcbiAgICovXHJcbiAgX29uQ2xpY2s6IGZ1bmN0aW9uIF9vbkNsaWNrKC8qIGV2dCovKSB7XHJcbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkKCkpIHtcclxuICAgICAgdGhpcy50b2dnbGVOb2RlLmNoZWNrZWQgPSB0aGlzLnRvZ2dsZVZhbHVlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlZFZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xyXG4gICAgdGhpcy5zZXRWYWx1ZSh0b2dnbGVkVmFsdWUpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0b2dnbGVkIHN0YXRlXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50b2dnbGVOb2RlLmNoZWNrZWQ7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0b2dnbGVkIGF0dHJpYnV0ZSBvZiB0aGUgZmllbGQgYW5kIGFwcGxpZXMgdGhlIG5lZWRlZCBzdHlsaW5nLlxyXG4gICAqXHJcbiAgICogSXQgYWxzbyBkaXJlY3RseSBmaXJlcyB0aGUge0BsaW5rIF9GaWVsZCNvbkNoYW5nZSBvbkNoYW5nZX0gZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW4vU3RyaW5nL051bWJlcn0gdmFsIElmIHN0cmluZyBpcyBwYXNzZWQgaXQgd2lsbCB1c2UgYCd0cnVlJ2Agb3IgYCd0J2AgZm9yIHRydWUuIElmIG51bWJlciB0aGVuIDAgZm9yIHRydWUuXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBpbml0aWFsIElmIHRydWUgc2V0cyB0aGUgdmFsdWUgYXMgdGhlIG9yaWdpbmFsIHZhbHVlIGFuZCBpcyBsYXRlciB1c2VkIGZvciBkaXJ0eS9tb2RpZmllZCBkZXRlY3Rpb24uXHJcbiAgICovXHJcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbCwgaW5pdGlhbCkge1xyXG4gICAgY29uc3QgbmV3VmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyAvXih0cnVlfHR8MCkkL2kudGVzdCh2YWwpIDogISF2YWw7XHJcblxyXG4gICAgaWYgKGluaXRpYWwpIHtcclxuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gbmV3VmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9nZ2xlVmFsdWUgPSBuZXdWYWw7XHJcbiAgICB0aGlzLnRvZ2dsZU5vZGUuY2hlY2tlZCA9IG5ld1ZhbDtcclxuICAgIHRoaXMub25DaGFuZ2UobmV3VmFsLCB0aGlzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHZhbHVlIGJhY2sgdG8gYHRoaXMuY2hlY2tlZGAgYXMgdGhlIGluaXRpYWwgdmFsdWUuIElmIHRydWUgaXMgcGFzc2VkIGl0IHNldHNcclxuICAgKiBgdGhpcy5jaGVja2VkYCBhcyBhIGRpcnR5L21vZGlmaWVkIHZhbHVlLlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZmxhZyBTaWduaWZpZXMgaWYgdGhlIGNsZWFyZWQgdmFsdWUgc2hvdWxkIGJlIHNldCBhcyBtb2RpZmllZCAodHJ1ZSkgb3IgaW5pdGlhbCAoZmFsc2UvdW5kZWZpbmVkKVxyXG4gICAqL1xyXG4gIGNsZWFyVmFsdWU6IGZ1bmN0aW9uIGNsZWFyVmFsdWUoZmxhZykge1xyXG4gICAgY29uc3QgaW5pdGlhbCA9IGZsYWcgIT09IHRydWU7XHJcbiAgICB0aGlzLnNldFZhbHVlKHRoaXMuY2hlY2tlZCwgaW5pdGlhbCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBmaWVsZCBoYXMgYmVlbiBtb2RpZmllZCBmcm9tIGl0J3Mgb3JpZ2luYWwgdmFsdWVcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzRGlydHk6IGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMub3JpZ2luYWxWYWx1ZSAhPT0gdGhpcy5nZXRWYWx1ZSgpKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkTWFuYWdlci5yZWdpc3RlcignYm9vbGVhbicsIGNvbnRyb2wpO1xyXG4iXX0=