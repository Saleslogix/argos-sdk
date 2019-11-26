define('argos/Fields/SignatureField', ['module', 'exports', 'dojo/_base/declare', '../Format', './EditorField', '../FieldManager', '../I18n'], function (module, exports, _declare, _Format, _EditorField, _FieldManager, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Format2 = _interopRequireDefault(_Format);

  var _EditorField2 = _interopRequireDefault(_EditorField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('signatureField');

  /**
   * @class argos.Fields.SignatureField
   * @classdesc The SignatureField uses an HTML5 canvas element to render previews of the signature vector
   * provided by it's editor view {@link SignatureView SignatureView}.
   *
   * @example
   *     {
   *         name: 'Signature',
   *         property: 'Signature',
   *         label: this.signatureText,
   *         type: 'signature'
   *     }
   * @extends argos.Fields.EditorField
   * @requires argos.FieldManager
   * @requires argos.Views.SignatureView
   * @requires argos.Format
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

  var control = (0, _declare2.default)('argos.Fields.SignatureField', [_EditorField2.default], /** @lends argos.Fields.SignatureField# */{
    // Localization
    /**
     * @property {String}
     * Text used for ARIA label
     */
    signatureLabelText: resource.signatureLabelText,
    /**
     * @property {String}
     * Text used within button
     */
    signatureText: resource.signatureText,

    /**
     * @property {Number[][]}
     * A series of x,y coordinates in the format of: `[[0,0],[1,5]]`
     */
    signature: [],
    /**
     * @cfg {Object}
     * If overriding this value make sure to set all the values:
     *
     * key          default         description
     * ---------   ---------        ---------------------------------
     * scale       1                Ratio in which the vector to canvas should be drawn
     * lineWidth   1                Stroke thickness of the line
     * penColor    'blue'           Color of line. Accepts HTML safe string names or hex.
     * width       180              Width of signature preview in field
     * height      50               Height of signature preview in field
     */
    config: {
      scale: 1,
      lineWidth: 1,
      penColor: 'blue',
      width: 180,
      height: 50
    },
    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['<label for="{%= $.name %}">{%: $.label %}</label>', '<button class="button simpleSubHeaderButton" aria-label="{%: $.signatureLabelText %}"><span aria-hidden="true">{%: $.signatureText %}</span></button>', '<img data-dojo-attach-point="signatureNode" src="" width="{%: $.config.width %}" height="{%: $.config.height %}" alt="" />', '<input data-dojo-attach-point="inputNode" type="hidden">']),
    /**
     * Extends the {@link EditorField#createNavigationOptions parent} implementation by
     * also passing the `signature` array.
     * @return {Object} Navigation options
     */
    createNavigationOptions: function createNavigationOptions() {
      var options = this.inherited(createNavigationOptions, arguments);
      options.signature = this.signature;
      return options;
    },
    /**
     * Complete override that gets the editor view, gets the values and calls set value on the field
     */
    getValuesFromView: function getValuesFromView() {
      var app = this.app;
      var view = app && app.getPrimaryActiveView && app.getPrimaryActiveView();
      if (view) {
        var value = view.getValues();
        this.currentValue = this.validationValue = value;
        this.setValue(this.currentValue, false);
      }
    },
    /**
     * Sets the signature value by using {@link format#imageFromVector format.imageFromVector}
     * to the img node and setting the array directly to `originalValue`.
     * @param val
     * @param initial
     */
    setValue: function setValue(val, initial) {
      if (initial) {
        this.originalValue = val;
      }

      this.currentValue = val;
      $(this.inputNode).css('value', val || '');

      try {
        this.signature = JSON.parse(val);
      } catch (e) {
        this.signature = [];
      }

      if (!this.signature || Array !== this.signature.constructor) {
        this.signature = [];
      }

      this.signatureNode.src = _Format2.default.imageFromVector(this.signature, this.config, false);
    },
    /**
     * Clears the value set to the hidden field
     */
    clearValue: function clearValue() {
      this.setValue('', true);
    },
    /**
     * Since the EditorField calls `formatValue` during {@link EditorField#complete complete}
     * we need to override to simply return the value given.
     * @param val
     * @return {Array/String}
     */
    formatValue: function formatValue(val) {
      return val;
    }
  });

  exports.default = _FieldManager2.default.register('signature', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvU2lnbmF0dXJlRmllbGQuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJjb250cm9sIiwic2lnbmF0dXJlTGFiZWxUZXh0Iiwic2lnbmF0dXJlVGV4dCIsInNpZ25hdHVyZSIsImNvbmZpZyIsInNjYWxlIiwibGluZVdpZHRoIiwicGVuQ29sb3IiLCJ3aWR0aCIsImhlaWdodCIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyIsIm9wdGlvbnMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRWYWx1ZXNGcm9tVmlldyIsImFwcCIsInZpZXciLCJnZXRQcmltYXJ5QWN0aXZlVmlldyIsInZhbHVlIiwiZ2V0VmFsdWVzIiwiY3VycmVudFZhbHVlIiwidmFsaWRhdGlvblZhbHVlIiwic2V0VmFsdWUiLCJ2YWwiLCJpbml0aWFsIiwib3JpZ2luYWxWYWx1ZSIsIiQiLCJpbnB1dE5vZGUiLCJjc3MiLCJKU09OIiwicGFyc2UiLCJlIiwiQXJyYXkiLCJjb25zdHJ1Y3RvciIsInNpZ25hdHVyZU5vZGUiLCJzcmMiLCJpbWFnZUZyb21WZWN0b3IiLCJjbGVhclZhbHVlIiwiZm9ybWF0VmFsdWUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1BLFdBQVcsb0JBQVksZ0JBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7QUF5Q0EsTUFBTUMsVUFBVSx1QkFBUSw2QkFBUixFQUF1Qyx1QkFBdkMsRUFBc0QsMENBQTBDO0FBQzlHO0FBQ0E7Ozs7QUFJQUMsd0JBQW9CRixTQUFTRSxrQkFOaUY7QUFPOUc7Ozs7QUFJQUMsbUJBQWVILFNBQVNHLGFBWHNGOztBQWE5Rzs7OztBQUlBQyxlQUFXLEVBakJtRztBQWtCOUc7Ozs7Ozs7Ozs7OztBQVlBQyxZQUFRO0FBQ05DLGFBQU8sQ0FERDtBQUVOQyxpQkFBVyxDQUZMO0FBR05DLGdCQUFVLE1BSEo7QUFJTkMsYUFBTyxHQUpEO0FBS05DLGNBQVE7QUFMRixLQTlCc0c7QUFxQzlHOzs7Ozs7OztBQVFBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLG1EQUQyQixFQUUzQix1SkFGMkIsRUFHM0IsNEhBSDJCLEVBSTNCLDBEQUoyQixDQUFiLENBN0M4RjtBQW1EOUc7Ozs7O0FBS0FDLDZCQUF5QixTQUFTQSx1QkFBVCxHQUFtQztBQUMxRCxVQUFNQyxVQUFVLEtBQUtDLFNBQUwsQ0FBZUYsdUJBQWYsRUFBd0NHLFNBQXhDLENBQWhCO0FBQ0FGLGNBQVFWLFNBQVIsR0FBb0IsS0FBS0EsU0FBekI7QUFDQSxhQUFPVSxPQUFQO0FBQ0QsS0E1RDZHO0FBNkQ5Rzs7O0FBR0FHLHVCQUFtQixTQUFTQSxpQkFBVCxHQUE2QjtBQUM5QyxVQUFNQyxNQUFNLEtBQUtBLEdBQWpCO0FBQ0EsVUFBTUMsT0FBT0QsT0FBT0EsSUFBSUUsb0JBQVgsSUFBbUNGLElBQUlFLG9CQUFKLEVBQWhEO0FBQ0EsVUFBSUQsSUFBSixFQUFVO0FBQ1IsWUFBTUUsUUFBUUYsS0FBS0csU0FBTCxFQUFkO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQixLQUFLQyxlQUFMLEdBQXVCSCxLQUEzQztBQUNBLGFBQUtJLFFBQUwsQ0FBYyxLQUFLRixZQUFuQixFQUFpQyxLQUFqQztBQUNEO0FBQ0YsS0F4RTZHO0FBeUU5Rzs7Ozs7O0FBTUFFLGNBQVUsU0FBU0EsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLE9BQXZCLEVBQWdDO0FBQ3hDLFVBQUlBLE9BQUosRUFBYTtBQUNYLGFBQUtDLGFBQUwsR0FBcUJGLEdBQXJCO0FBQ0Q7O0FBRUQsV0FBS0gsWUFBTCxHQUFvQkcsR0FBcEI7QUFDQUcsUUFBRSxLQUFLQyxTQUFQLEVBQWtCQyxHQUFsQixDQUFzQixPQUF0QixFQUErQkwsT0FBTyxFQUF0Qzs7QUFFQSxVQUFJO0FBQ0YsYUFBS3RCLFNBQUwsR0FBaUI0QixLQUFLQyxLQUFMLENBQVdQLEdBQVgsQ0FBakI7QUFDRCxPQUZELENBRUUsT0FBT1EsQ0FBUCxFQUFVO0FBQ1YsYUFBSzlCLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7QUFFRCxVQUFJLENBQUMsS0FBS0EsU0FBTixJQUFtQitCLFVBQVUsS0FBSy9CLFNBQUwsQ0FBZWdDLFdBQWhELEVBQTZEO0FBQzNELGFBQUtoQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0Q7O0FBRUQsV0FBS2lDLGFBQUwsQ0FBbUJDLEdBQW5CLEdBQXlCLGlCQUFPQyxlQUFQLENBQXVCLEtBQUtuQyxTQUE1QixFQUF1QyxLQUFLQyxNQUE1QyxFQUFvRCxLQUFwRCxDQUF6QjtBQUNELEtBbEc2RztBQW1HOUc7OztBQUdBbUMsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxXQUFLZixRQUFMLENBQWMsRUFBZCxFQUFrQixJQUFsQjtBQUNELEtBeEc2RztBQXlHOUc7Ozs7OztBQU1BZ0IsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQmYsR0FBckIsRUFBMEI7QUFDckMsYUFBT0EsR0FBUDtBQUNEO0FBakg2RyxHQUFoRyxDQUFoQjs7b0JBb0hlLHVCQUFhZ0IsUUFBYixDQUFzQixXQUF0QixFQUFtQ3pDLE9BQW5DLEMiLCJmaWxlIjoiU2lnbmF0dXJlRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBmb3JtYXQgZnJvbSAnLi4vRm9ybWF0JztcclxuaW1wb3J0IEVkaXRvckZpZWxkIGZyb20gJy4vRWRpdG9yRmllbGQnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdzaWduYXR1cmVGaWVsZCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5GaWVsZHMuU2lnbmF0dXJlRmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgU2lnbmF0dXJlRmllbGQgdXNlcyBhbiBIVE1MNSBjYW52YXMgZWxlbWVudCB0byByZW5kZXIgcHJldmlld3Mgb2YgdGhlIHNpZ25hdHVyZSB2ZWN0b3JcclxuICogcHJvdmlkZWQgYnkgaXQncyBlZGl0b3IgdmlldyB7QGxpbmsgU2lnbmF0dXJlVmlldyBTaWduYXR1cmVWaWV3fS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogICAgIHtcclxuICogICAgICAgICBuYW1lOiAnU2lnbmF0dXJlJyxcclxuICogICAgICAgICBwcm9wZXJ0eTogJ1NpZ25hdHVyZScsXHJcbiAqICAgICAgICAgbGFiZWw6IHRoaXMuc2lnbmF0dXJlVGV4dCxcclxuICogICAgICAgICB0eXBlOiAnc2lnbmF0dXJlJ1xyXG4gKiAgICAgfVxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuRWRpdG9yRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuVmlld3MuU2lnbmF0dXJlVmlld1xyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRm9ybWF0XHJcbiAqL1xyXG5jb25zdCBjb250cm9sID0gZGVjbGFyZSgnYXJnb3MuRmllbGRzLlNpZ25hdHVyZUZpZWxkJywgW0VkaXRvckZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuU2lnbmF0dXJlRmllbGQjICove1xyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBmb3IgQVJJQSBsYWJlbFxyXG4gICAqL1xyXG4gIHNpZ25hdHVyZUxhYmVsVGV4dDogcmVzb3VyY2Uuc2lnbmF0dXJlTGFiZWxUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCB3aXRoaW4gYnV0dG9uXHJcbiAgICovXHJcbiAgc2lnbmF0dXJlVGV4dDogcmVzb3VyY2Uuc2lnbmF0dXJlVGV4dCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtOdW1iZXJbXVtdfVxyXG4gICAqIEEgc2VyaWVzIG9mIHgseSBjb29yZGluYXRlcyBpbiB0aGUgZm9ybWF0IG9mOiBgW1swLDBdLFsxLDVdXWBcclxuICAgKi9cclxuICBzaWduYXR1cmU6IFtdLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge09iamVjdH1cclxuICAgKiBJZiBvdmVycmlkaW5nIHRoaXMgdmFsdWUgbWFrZSBzdXJlIHRvIHNldCBhbGwgdGhlIHZhbHVlczpcclxuICAgKlxyXG4gICAqIGtleSAgICAgICAgICBkZWZhdWx0ICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAtLS0tLS0tLS0gICAtLS0tLS0tLS0gICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqIHNjYWxlICAgICAgIDEgICAgICAgICAgICAgICAgUmF0aW8gaW4gd2hpY2ggdGhlIHZlY3RvciB0byBjYW52YXMgc2hvdWxkIGJlIGRyYXduXHJcbiAgICogbGluZVdpZHRoICAgMSAgICAgICAgICAgICAgICBTdHJva2UgdGhpY2tuZXNzIG9mIHRoZSBsaW5lXHJcbiAgICogcGVuQ29sb3IgICAgJ2JsdWUnICAgICAgICAgICBDb2xvciBvZiBsaW5lLiBBY2NlcHRzIEhUTUwgc2FmZSBzdHJpbmcgbmFtZXMgb3IgaGV4LlxyXG4gICAqIHdpZHRoICAgICAgIDE4MCAgICAgICAgICAgICAgV2lkdGggb2Ygc2lnbmF0dXJlIHByZXZpZXcgaW4gZmllbGRcclxuICAgKiBoZWlnaHQgICAgICA1MCAgICAgICAgICAgICAgIEhlaWdodCBvZiBzaWduYXR1cmUgcHJldmlldyBpbiBmaWVsZFxyXG4gICAqL1xyXG4gIGNvbmZpZzoge1xyXG4gICAgc2NhbGU6IDEsXHJcbiAgICBsaW5lV2lkdGg6IDEsXHJcbiAgICBwZW5Db2xvcjogJ2JsdWUnLFxyXG4gICAgd2lkdGg6IDE4MCxcclxuICAgIGhlaWdodDogNTAsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgZmllbGRzIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBGaWVsZCBpbnN0YW5jZVxyXG4gICAqICogYCQkYCA9PiBPd25lciBWaWV3IGluc3RhbmNlXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGFiZWwgZm9yPVwieyU9ICQubmFtZSAlfVwiPnslOiAkLmxhYmVsICV9PC9sYWJlbD4nLFxyXG4gICAgJzxidXR0b24gY2xhc3M9XCJidXR0b24gc2ltcGxlU3ViSGVhZGVyQnV0dG9uXCIgYXJpYS1sYWJlbD1cInslOiAkLnNpZ25hdHVyZUxhYmVsVGV4dCAlfVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPnslOiAkLnNpZ25hdHVyZVRleHQgJX08L3NwYW4+PC9idXR0b24+JyxcclxuICAgICc8aW1nIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJzaWduYXR1cmVOb2RlXCIgc3JjPVwiXCIgd2lkdGg9XCJ7JTogJC5jb25maWcud2lkdGggJX1cIiBoZWlnaHQ9XCJ7JTogJC5jb25maWcuaGVpZ2h0ICV9XCIgYWx0PVwiXCIgLz4nLFxyXG4gICAgJzxpbnB1dCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaW5wdXROb2RlXCIgdHlwZT1cImhpZGRlblwiPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIEVkaXRvckZpZWxkI2NyZWF0ZU5hdmlnYXRpb25PcHRpb25zIHBhcmVudH0gaW1wbGVtZW50YXRpb24gYnlcclxuICAgKiBhbHNvIHBhc3NpbmcgdGhlIGBzaWduYXR1cmVgIGFycmF5LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gTmF2aWdhdGlvbiBvcHRpb25zXHJcbiAgICovXHJcbiAgY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnM6IGZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zKCkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuaW5oZXJpdGVkKGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zLCBhcmd1bWVudHMpO1xyXG4gICAgb3B0aW9ucy5zaWduYXR1cmUgPSB0aGlzLnNpZ25hdHVyZTtcclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ29tcGxldGUgb3ZlcnJpZGUgdGhhdCBnZXRzIHRoZSBlZGl0b3IgdmlldywgZ2V0cyB0aGUgdmFsdWVzIGFuZCBjYWxscyBzZXQgdmFsdWUgb24gdGhlIGZpZWxkXHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzRnJvbVZpZXc6IGZ1bmN0aW9uIGdldFZhbHVlc0Zyb21WaWV3KCkge1xyXG4gICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcbiAgICBjb25zdCB2aWV3ID0gYXBwICYmIGFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldyAmJiBhcHAuZ2V0UHJpbWFyeUFjdGl2ZVZpZXcoKTtcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gdmlldy5nZXRWYWx1ZXMoKTtcclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY3VycmVudFZhbHVlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBzaWduYXR1cmUgdmFsdWUgYnkgdXNpbmcge0BsaW5rIGZvcm1hdCNpbWFnZUZyb21WZWN0b3IgZm9ybWF0LmltYWdlRnJvbVZlY3Rvcn1cclxuICAgKiB0byB0aGUgaW1nIG5vZGUgYW5kIHNldHRpbmcgdGhlIGFycmF5IGRpcmVjdGx5IHRvIGBvcmlnaW5hbFZhbHVlYC5cclxuICAgKiBAcGFyYW0gdmFsXHJcbiAgICogQHBhcmFtIGluaXRpYWxcclxuICAgKi9cclxuICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodmFsLCBpbml0aWFsKSB7XHJcbiAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSB2YWw7XHJcbiAgICAkKHRoaXMuaW5wdXROb2RlKS5jc3MoJ3ZhbHVlJywgdmFsIHx8ICcnKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnNpZ25hdHVyZSA9IEpTT04ucGFyc2UodmFsKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhpcy5zaWduYXR1cmUgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuc2lnbmF0dXJlIHx8IEFycmF5ICE9PSB0aGlzLnNpZ25hdHVyZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICB0aGlzLnNpZ25hdHVyZSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2lnbmF0dXJlTm9kZS5zcmMgPSBmb3JtYXQuaW1hZ2VGcm9tVmVjdG9yKHRoaXMuc2lnbmF0dXJlLCB0aGlzLmNvbmZpZywgZmFsc2UpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2xlYXJzIHRoZSB2YWx1ZSBzZXQgdG8gdGhlIGhpZGRlbiBmaWVsZFxyXG4gICAqL1xyXG4gIGNsZWFyVmFsdWU6IGZ1bmN0aW9uIGNsZWFyVmFsdWUoKSB7XHJcbiAgICB0aGlzLnNldFZhbHVlKCcnLCB0cnVlKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNpbmNlIHRoZSBFZGl0b3JGaWVsZCBjYWxscyBgZm9ybWF0VmFsdWVgIGR1cmluZyB7QGxpbmsgRWRpdG9yRmllbGQjY29tcGxldGUgY29tcGxldGV9XHJcbiAgICogd2UgbmVlZCB0byBvdmVycmlkZSB0byBzaW1wbHkgcmV0dXJuIHRoZSB2YWx1ZSBnaXZlbi5cclxuICAgKiBAcGFyYW0gdmFsXHJcbiAgICogQHJldHVybiB7QXJyYXkvU3RyaW5nfVxyXG4gICAqL1xyXG4gIGZvcm1hdFZhbHVlOiBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWwpIHtcclxuICAgIHJldHVybiB2YWw7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZE1hbmFnZXIucmVnaXN0ZXIoJ3NpZ25hdHVyZScsIGNvbnRyb2wpO1xyXG4iXX0=