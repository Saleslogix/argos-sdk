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
      var options = this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvU2lnbmF0dXJlRmllbGQuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJjb250cm9sIiwic2lnbmF0dXJlTGFiZWxUZXh0Iiwic2lnbmF0dXJlVGV4dCIsInNpZ25hdHVyZSIsImNvbmZpZyIsInNjYWxlIiwibGluZVdpZHRoIiwicGVuQ29sb3IiLCJ3aWR0aCIsImhlaWdodCIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyIsIm9wdGlvbnMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRWYWx1ZXNGcm9tVmlldyIsImFwcCIsInZpZXciLCJnZXRQcmltYXJ5QWN0aXZlVmlldyIsInZhbHVlIiwiZ2V0VmFsdWVzIiwiY3VycmVudFZhbHVlIiwidmFsaWRhdGlvblZhbHVlIiwic2V0VmFsdWUiLCJ2YWwiLCJpbml0aWFsIiwib3JpZ2luYWxWYWx1ZSIsIiQiLCJpbnB1dE5vZGUiLCJjc3MiLCJKU09OIiwicGFyc2UiLCJlIiwiQXJyYXkiLCJjb25zdHJ1Y3RvciIsInNpZ25hdHVyZU5vZGUiLCJzcmMiLCJpbWFnZUZyb21WZWN0b3IiLCJjbGVhclZhbHVlIiwiZm9ybWF0VmFsdWUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1BLFdBQVcsb0JBQVksZ0JBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7QUF5Q0EsTUFBTUMsVUFBVSx1QkFBUSw2QkFBUixFQUF1Qyx1QkFBdkMsRUFBc0QsMENBQTBDO0FBQzlHO0FBQ0E7Ozs7QUFJQUMsd0JBQW9CRixTQUFTRSxrQkFOaUY7QUFPOUc7Ozs7QUFJQUMsbUJBQWVILFNBQVNHLGFBWHNGOztBQWE5Rzs7OztBQUlBQyxlQUFXLEVBakJtRztBQWtCOUc7Ozs7Ozs7Ozs7OztBQVlBQyxZQUFRO0FBQ05DLGFBQU8sQ0FERDtBQUVOQyxpQkFBVyxDQUZMO0FBR05DLGdCQUFVLE1BSEo7QUFJTkMsYUFBTyxHQUpEO0FBS05DLGNBQVE7QUFMRixLQTlCc0c7QUFxQzlHOzs7Ozs7OztBQVFBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLG1EQUQyQixFQUUzQix1SkFGMkIsRUFHM0IsNEhBSDJCLEVBSTNCLDBEQUoyQixDQUFiLENBN0M4RjtBQW1EOUc7Ozs7O0FBS0FDLDZCQUF5QixTQUFTQSx1QkFBVCxHQUFtQztBQUMxRCxVQUFNQyxVQUFVLEtBQUtDLFNBQUwsQ0FBZUMsU0FBZixDQUFoQjtBQUNBRixjQUFRVixTQUFSLEdBQW9CLEtBQUtBLFNBQXpCO0FBQ0EsYUFBT1UsT0FBUDtBQUNELEtBNUQ2RztBQTZEOUc7OztBQUdBRyx1QkFBbUIsU0FBU0EsaUJBQVQsR0FBNkI7QUFDOUMsVUFBTUMsTUFBTSxLQUFLQSxHQUFqQjtBQUNBLFVBQU1DLE9BQU9ELE9BQU9BLElBQUlFLG9CQUFYLElBQW1DRixJQUFJRSxvQkFBSixFQUFoRDtBQUNBLFVBQUlELElBQUosRUFBVTtBQUNSLFlBQU1FLFFBQVFGLEtBQUtHLFNBQUwsRUFBZDtBQUNBLGFBQUtDLFlBQUwsR0FBb0IsS0FBS0MsZUFBTCxHQUF1QkgsS0FBM0M7QUFDQSxhQUFLSSxRQUFMLENBQWMsS0FBS0YsWUFBbkIsRUFBaUMsS0FBakM7QUFDRDtBQUNGLEtBeEU2RztBQXlFOUc7Ozs7OztBQU1BRSxjQUFVLFNBQVNBLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCQyxPQUF2QixFQUFnQztBQUN4QyxVQUFJQSxPQUFKLEVBQWE7QUFDWCxhQUFLQyxhQUFMLEdBQXFCRixHQUFyQjtBQUNEOztBQUVELFdBQUtILFlBQUwsR0FBb0JHLEdBQXBCO0FBQ0FHLFFBQUUsS0FBS0MsU0FBUCxFQUFrQkMsR0FBbEIsQ0FBc0IsT0FBdEIsRUFBK0JMLE9BQU8sRUFBdEM7O0FBRUEsVUFBSTtBQUNGLGFBQUt0QixTQUFMLEdBQWlCNEIsS0FBS0MsS0FBTCxDQUFXUCxHQUFYLENBQWpCO0FBQ0QsT0FGRCxDQUVFLE9BQU9RLENBQVAsRUFBVTtBQUNWLGFBQUs5QixTQUFMLEdBQWlCLEVBQWpCO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDLEtBQUtBLFNBQU4sSUFBbUIrQixVQUFVLEtBQUsvQixTQUFMLENBQWVnQyxXQUFoRCxFQUE2RDtBQUMzRCxhQUFLaEMsU0FBTCxHQUFpQixFQUFqQjtBQUNEOztBQUVELFdBQUtpQyxhQUFMLENBQW1CQyxHQUFuQixHQUF5QixpQkFBT0MsZUFBUCxDQUF1QixLQUFLbkMsU0FBNUIsRUFBdUMsS0FBS0MsTUFBNUMsRUFBb0QsS0FBcEQsQ0FBekI7QUFDRCxLQWxHNkc7QUFtRzlHOzs7QUFHQW1DLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsV0FBS2YsUUFBTCxDQUFjLEVBQWQsRUFBa0IsSUFBbEI7QUFDRCxLQXhHNkc7QUF5RzlHOzs7Ozs7QUFNQWdCLGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUJmLEdBQXJCLEVBQTBCO0FBQ3JDLGFBQU9BLEdBQVA7QUFDRDtBQWpINkcsR0FBaEcsQ0FBaEI7O29CQW9IZSx1QkFBYWdCLFFBQWIsQ0FBc0IsV0FBdEIsRUFBbUN6QyxPQUFuQyxDIiwiZmlsZSI6IlNpZ25hdHVyZUZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4uL0Zvcm1hdCc7XHJcbmltcG9ydCBFZGl0b3JGaWVsZCBmcm9tICcuL0VkaXRvckZpZWxkJztcclxuaW1wb3J0IEZpZWxkTWFuYWdlciBmcm9tICcuLi9GaWVsZE1hbmFnZXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnc2lnbmF0dXJlRmllbGQnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLlNpZ25hdHVyZUZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIFNpZ25hdHVyZUZpZWxkIHVzZXMgYW4gSFRNTDUgY2FudmFzIGVsZW1lbnQgdG8gcmVuZGVyIHByZXZpZXdzIG9mIHRoZSBzaWduYXR1cmUgdmVjdG9yXHJcbiAqIHByb3ZpZGVkIGJ5IGl0J3MgZWRpdG9yIHZpZXcge0BsaW5rIFNpZ25hdHVyZVZpZXcgU2lnbmF0dXJlVmlld30uXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ1NpZ25hdHVyZScsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdTaWduYXR1cmUnLFxyXG4gKiAgICAgICAgIGxhYmVsOiB0aGlzLnNpZ25hdHVyZVRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ3NpZ25hdHVyZSdcclxuICogICAgIH1cclxuICogQGV4dGVuZHMgYXJnb3MuRmllbGRzLkVkaXRvckZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICogQHJlcXVpcmVzIGFyZ29zLlZpZXdzLlNpZ25hdHVyZVZpZXdcclxuICogQHJlcXVpcmVzIGFyZ29zLkZvcm1hdFxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5TaWduYXR1cmVGaWVsZCcsIFtFZGl0b3JGaWVsZF0sIC8qKiBAbGVuZHMgYXJnb3MuRmllbGRzLlNpZ25hdHVyZUZpZWxkIyAqL3tcclxuICAvLyBMb2NhbGl6YXRpb25cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHVzZWQgZm9yIEFSSUEgbGFiZWxcclxuICAgKi9cclxuICBzaWduYXR1cmVMYWJlbFRleHQ6IHJlc291cmNlLnNpZ25hdHVyZUxhYmVsVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHVzZWQgd2l0aGluIGJ1dHRvblxyXG4gICAqL1xyXG4gIHNpZ25hdHVyZVRleHQ6IHJlc291cmNlLnNpZ25hdHVyZVRleHQsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyW11bXX1cclxuICAgKiBBIHNlcmllcyBvZiB4LHkgY29vcmRpbmF0ZXMgaW4gdGhlIGZvcm1hdCBvZjogYFtbMCwwXSxbMSw1XV1gXHJcbiAgICovXHJcbiAgc2lnbmF0dXJlOiBbXSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtPYmplY3R9XHJcbiAgICogSWYgb3ZlcnJpZGluZyB0aGlzIHZhbHVlIG1ha2Ugc3VyZSB0byBzZXQgYWxsIHRoZSB2YWx1ZXM6XHJcbiAgICpcclxuICAgKiBrZXkgICAgICAgICAgZGVmYXVsdCAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICogLS0tLS0tLS0tICAgLS0tLS0tLS0tICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiBzY2FsZSAgICAgICAxICAgICAgICAgICAgICAgIFJhdGlvIGluIHdoaWNoIHRoZSB2ZWN0b3IgdG8gY2FudmFzIHNob3VsZCBiZSBkcmF3blxyXG4gICAqIGxpbmVXaWR0aCAgIDEgICAgICAgICAgICAgICAgU3Ryb2tlIHRoaWNrbmVzcyBvZiB0aGUgbGluZVxyXG4gICAqIHBlbkNvbG9yICAgICdibHVlJyAgICAgICAgICAgQ29sb3Igb2YgbGluZS4gQWNjZXB0cyBIVE1MIHNhZmUgc3RyaW5nIG5hbWVzIG9yIGhleC5cclxuICAgKiB3aWR0aCAgICAgICAxODAgICAgICAgICAgICAgIFdpZHRoIG9mIHNpZ25hdHVyZSBwcmV2aWV3IGluIGZpZWxkXHJcbiAgICogaGVpZ2h0ICAgICAgNTAgICAgICAgICAgICAgICBIZWlnaHQgb2Ygc2lnbmF0dXJlIHByZXZpZXcgaW4gZmllbGRcclxuICAgKi9cclxuICBjb25maWc6IHtcclxuICAgIHNjYWxlOiAxLFxyXG4gICAgbGluZVdpZHRoOiAxLFxyXG4gICAgcGVuQ29sb3I6ICdibHVlJyxcclxuICAgIHdpZHRoOiAxODAsXHJcbiAgICBoZWlnaHQ6IDUwLFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIGZpZWxkcyBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gRmllbGQgaW5zdGFuY2VcclxuICAgKiAqIGAkJGAgPT4gT3duZXIgVmlldyBpbnN0YW5jZVxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxhYmVsIGZvcj1cInslPSAkLm5hbWUgJX1cIj57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIHNpbXBsZVN1YkhlYWRlckJ1dHRvblwiIGFyaWEtbGFiZWw9XCJ7JTogJC5zaWduYXR1cmVMYWJlbFRleHQgJX1cIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj57JTogJC5zaWduYXR1cmVUZXh0ICV9PC9zcGFuPjwvYnV0dG9uPicsXHJcbiAgICAnPGltZyBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwic2lnbmF0dXJlTm9kZVwiIHNyYz1cIlwiIHdpZHRoPVwieyU6ICQuY29uZmlnLndpZHRoICV9XCIgaGVpZ2h0PVwieyU6ICQuY29uZmlnLmhlaWdodCAlfVwiIGFsdD1cIlwiIC8+JyxcclxuICAgICc8aW5wdXQgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImlucHV0Tm9kZVwiIHR5cGU9XCJoaWRkZW5cIj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHtAbGluayBFZGl0b3JGaWVsZCNjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyBwYXJlbnR9IGltcGxlbWVudGF0aW9uIGJ5XHJcbiAgICogYWxzbyBwYXNzaW5nIHRoZSBgc2lnbmF0dXJlYCBhcnJheS5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE5hdmlnYXRpb24gb3B0aW9uc1xyXG4gICAqL1xyXG4gIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zOiBmdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gICAgb3B0aW9ucy5zaWduYXR1cmUgPSB0aGlzLnNpZ25hdHVyZTtcclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ29tcGxldGUgb3ZlcnJpZGUgdGhhdCBnZXRzIHRoZSBlZGl0b3IgdmlldywgZ2V0cyB0aGUgdmFsdWVzIGFuZCBjYWxscyBzZXQgdmFsdWUgb24gdGhlIGZpZWxkXHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzRnJvbVZpZXc6IGZ1bmN0aW9uIGdldFZhbHVlc0Zyb21WaWV3KCkge1xyXG4gICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcbiAgICBjb25zdCB2aWV3ID0gYXBwICYmIGFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldyAmJiBhcHAuZ2V0UHJpbWFyeUFjdGl2ZVZpZXcoKTtcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gdmlldy5nZXRWYWx1ZXMoKTtcclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY3VycmVudFZhbHVlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBzaWduYXR1cmUgdmFsdWUgYnkgdXNpbmcge0BsaW5rIGZvcm1hdCNpbWFnZUZyb21WZWN0b3IgZm9ybWF0LmltYWdlRnJvbVZlY3Rvcn1cclxuICAgKiB0byB0aGUgaW1nIG5vZGUgYW5kIHNldHRpbmcgdGhlIGFycmF5IGRpcmVjdGx5IHRvIGBvcmlnaW5hbFZhbHVlYC5cclxuICAgKiBAcGFyYW0gdmFsXHJcbiAgICogQHBhcmFtIGluaXRpYWxcclxuICAgKi9cclxuICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodmFsLCBpbml0aWFsKSB7XHJcbiAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSB2YWw7XHJcbiAgICAkKHRoaXMuaW5wdXROb2RlKS5jc3MoJ3ZhbHVlJywgdmFsIHx8ICcnKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnNpZ25hdHVyZSA9IEpTT04ucGFyc2UodmFsKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhpcy5zaWduYXR1cmUgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuc2lnbmF0dXJlIHx8IEFycmF5ICE9PSB0aGlzLnNpZ25hdHVyZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICB0aGlzLnNpZ25hdHVyZSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2lnbmF0dXJlTm9kZS5zcmMgPSBmb3JtYXQuaW1hZ2VGcm9tVmVjdG9yKHRoaXMuc2lnbmF0dXJlLCB0aGlzLmNvbmZpZywgZmFsc2UpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2xlYXJzIHRoZSB2YWx1ZSBzZXQgdG8gdGhlIGhpZGRlbiBmaWVsZFxyXG4gICAqL1xyXG4gIGNsZWFyVmFsdWU6IGZ1bmN0aW9uIGNsZWFyVmFsdWUoKSB7XHJcbiAgICB0aGlzLnNldFZhbHVlKCcnLCB0cnVlKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNpbmNlIHRoZSBFZGl0b3JGaWVsZCBjYWxscyBgZm9ybWF0VmFsdWVgIGR1cmluZyB7QGxpbmsgRWRpdG9yRmllbGQjY29tcGxldGUgY29tcGxldGV9XHJcbiAgICogd2UgbmVlZCB0byBvdmVycmlkZSB0byBzaW1wbHkgcmV0dXJuIHRoZSB2YWx1ZSBnaXZlbi5cclxuICAgKiBAcGFyYW0gdmFsXHJcbiAgICogQHJldHVybiB7QXJyYXkvU3RyaW5nfVxyXG4gICAqL1xyXG4gIGZvcm1hdFZhbHVlOiBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWwpIHtcclxuICAgIHJldHVybiB2YWw7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZE1hbmFnZXIucmVnaXN0ZXIoJ3NpZ25hdHVyZScsIGNvbnRyb2wpO1xyXG4iXX0=