define('argos/_ActionMixin', ['module', 'exports', 'dojo/_base/declare'], function (module, exports, _declare) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos._ActionMixin
   * @classdesc _ActionMixin provides a click listener to the `domNode` of view it is mixed into.
   *
   * When a click event is caught by the handler it finds the closest element with `data-action`
   * and fires that function in the context of the view. When calling the function it passes a `params`
   * object with the following:
   *
   * @example
   *     {
   *         $event: 'Original click event',
   *         $src: 'The HTML node that initiated the event'
   *     }
   *
   * and then it mixes it all the `data-` attributes from the node into the params object.
   *
   */
  var __class = (0, _declare2.default)('argos._ActionMixin', null, /** @lends argos._ActionMixin# */{
    /**
     * @property {String}
     * Comma separated (no spaces) list of events to listen to
     */
    actionsFrom: 'click',
    /**
     * Extends the dijit Widget `postCreate` to connect to all events defined in `actionsFrom`.
     */
    postCreate: function postCreate() {
      var _this = this;

      // todo: add delegation
      this.actionsFrom.split(',').forEach(function (evt) {
        $(_this.domNode).on(evt, _this._initiateActionFromEvent.bind(_this));
      });
    },
    /**
     * Verifies that the given HTML element is within our view.
     * @param {HTMLElement} el
     * @return {Boolean}
     */
    _isValidElementForAction: function _isValidElementForAction(el) {
      var contained = this.domNode.contains ? this.domNode !== el && this.domNode.contains(el) : !!(this.domNode.compareDocumentPosition(el) & 16);

      return this.domNode === el || contained;
    },
    /**
     * Takes an event and fires the closest valid `data-action` with the attached `data-` attributes
     * @param {Event} evt
     */
    _initiateActionFromEvent: function _initiateActionFromEvent(evt) {
      var el = $(evt.target).closest('[data-action]').get(0);
      var action = $(el).attr('data-action');

      if (action && this._isValidElementForAction(el) && this.hasAction(action, evt, el)) {
        var parameters = this._getParametersForAction(action, evt, el);
        this.invokeAction(action, parameters, evt, el);
        evt.stopPropagation();
      }
    },
    /**
     * Extracts the `data-` attributes of an element and adds `$event` and `$source` being the two originals values.
     * @param {String} name Name of the action/function being fired.
     * @param {Event} evt The original event
     * @param {HTMLElement} el The node that has the `data-action` attribute
     * @return {Object} Object with the original event and source along with all the `data-` attributes in pascal case.
     */
    _getParametersForAction: function _getParametersForAction(name, evt, el) {
      var parameters = {
        $event: evt,
        $source: el
      };

      function replace($0, $1, $2) {
        return $1.toUpperCase() + $2;
      }

      for (var i = 0, attrLen = el.attributes.length; i < attrLen; i++) {
        var attributeName = el.attributes[i].name;
        if (/^((?=data-action)|(?!data))/.test(attributeName)) {
          continue;
        }

        /* transform hyphenated names to pascal case, minus the data segment, to be in line with HTML5 dataset naming conventions */
        /* see: http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data */
        /* todo: remove transformation and use dataset when browser support is there */
        var parameterName = attributeName.substr('data-'.length).replace(/-(\w)(\w+)/g, replace);
        parameters[parameterName] = $(el).attr(attributeName);
      }

      return parameters;
    },
    /**
     * Determines if the view contains a function with the given name
     * @param {String} name Name of function being tested.
     * @param evt
     * @param el
     * @return {Boolean}
     */
    hasAction: function hasAction(name /* , evt, el*/) {
      return typeof this[name] === 'function';
    },
    /**
     * Calls the given function name in the context of the view passing
     * the {@link #_getParametersForAction parameters gathered} and the event and element.
     * @param {String} name Name of function being invoked.
     * @param {Object} parameters Collection of `data-` attributes from the element.
     * @param {Event} evt The event that fired
     * @param {HTMLElement} el The HTML element that has the `data-action`
     */
    invokeAction: function invokeAction(name, parameters, evt, el) {
      return this[name].apply(this, [parameters, evt, el]);
    }
  }); /* Copyright 2017 Infor
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *    http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fQWN0aW9uTWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImFjdGlvbnNGcm9tIiwicG9zdENyZWF0ZSIsInNwbGl0IiwiZm9yRWFjaCIsImV2dCIsIiQiLCJkb21Ob2RlIiwib24iLCJfaW5pdGlhdGVBY3Rpb25Gcm9tRXZlbnQiLCJiaW5kIiwiX2lzVmFsaWRFbGVtZW50Rm9yQWN0aW9uIiwiZWwiLCJjb250YWluZWQiLCJjb250YWlucyIsImNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIiwidGFyZ2V0IiwiY2xvc2VzdCIsImdldCIsImFjdGlvbiIsImF0dHIiLCJoYXNBY3Rpb24iLCJwYXJhbWV0ZXJzIiwiX2dldFBhcmFtZXRlcnNGb3JBY3Rpb24iLCJpbnZva2VBY3Rpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJuYW1lIiwiJGV2ZW50IiwiJHNvdXJjZSIsInJlcGxhY2UiLCIkMCIsIiQxIiwiJDIiLCJ0b1VwcGVyQ2FzZSIsImkiLCJhdHRyTGVuIiwiYXR0cmlidXRlcyIsImxlbmd0aCIsImF0dHJpYnV0ZU5hbWUiLCJ0ZXN0IiwicGFyYW1ldGVyTmFtZSIsInN1YnN0ciIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBa0JBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFNQSxVQUFVLHVCQUFRLG9CQUFSLEVBQThCLElBQTlCLEVBQW9DLGlDQUFpQztBQUNuRjs7OztBQUlBQyxpQkFBYSxPQUxzRTtBQU1uRjs7O0FBR0FDLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFBQTs7QUFDaEM7QUFDQSxXQUFLRCxXQUFMLENBQWlCRSxLQUFqQixDQUF1QixHQUF2QixFQUE0QkMsT0FBNUIsQ0FBb0MsVUFBQ0MsR0FBRCxFQUFTO0FBQzNDQyxVQUFFLE1BQUtDLE9BQVAsRUFBZ0JDLEVBQWhCLENBQW1CSCxHQUFuQixFQUF3QixNQUFLSSx3QkFBTCxDQUE4QkMsSUFBOUIsT0FBeEI7QUFDRCxPQUZEO0FBR0QsS0Fka0Y7QUFl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Q0FBaEIsQyxDQW5DQTs7Ozs7Ozs7Ozs7Ozs7O29CQWlJZVosTyIsImZpbGUiOiJfQWN0aW9uTWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX0FjdGlvbk1peGluXHJcbiAqIEBjbGFzc2Rlc2MgX0FjdGlvbk1peGluIHByb3ZpZGVzIGEgY2xpY2sgbGlzdGVuZXIgdG8gdGhlIGBkb21Ob2RlYCBvZiB2aWV3IGl0IGlzIG1peGVkIGludG8uXHJcbiAqXHJcbiAqIFdoZW4gYSBjbGljayBldmVudCBpcyBjYXVnaHQgYnkgdGhlIGhhbmRsZXIgaXQgZmluZHMgdGhlIGNsb3Nlc3QgZWxlbWVudCB3aXRoIGBkYXRhLWFjdGlvbmBcclxuICogYW5kIGZpcmVzIHRoYXQgZnVuY3Rpb24gaW4gdGhlIGNvbnRleHQgb2YgdGhlIHZpZXcuIFdoZW4gY2FsbGluZyB0aGUgZnVuY3Rpb24gaXQgcGFzc2VzIGEgYHBhcmFtc2BcclxuICogb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZzpcclxuICpcclxuICogQGV4YW1wbGVcclxuICogICAgIHtcclxuICogICAgICAgICAkZXZlbnQ6ICdPcmlnaW5hbCBjbGljayBldmVudCcsXHJcbiAqICAgICAgICAgJHNyYzogJ1RoZSBIVE1MIG5vZGUgdGhhdCBpbml0aWF0ZWQgdGhlIGV2ZW50J1xyXG4gKiAgICAgfVxyXG4gKlxyXG4gKiBhbmQgdGhlbiBpdCBtaXhlcyBpdCBhbGwgdGhlIGBkYXRhLWAgYXR0cmlidXRlcyBmcm9tIHRoZSBub2RlIGludG8gdGhlIHBhcmFtcyBvYmplY3QuXHJcbiAqXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX0FjdGlvbk1peGluJywgbnVsbCwgLyoqIEBsZW5kcyBhcmdvcy5fQWN0aW9uTWl4aW4jICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIENvbW1hIHNlcGFyYXRlZCAobm8gc3BhY2VzKSBsaXN0IG9mIGV2ZW50cyB0byBsaXN0ZW4gdG9cclxuICAgKi9cclxuICBhY3Rpb25zRnJvbTogJ2NsaWNrJyxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBkaWppdCBXaWRnZXQgYHBvc3RDcmVhdGVgIHRvIGNvbm5lY3QgdG8gYWxsIGV2ZW50cyBkZWZpbmVkIGluIGBhY3Rpb25zRnJvbWAuXHJcbiAgICovXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIC8vIHRvZG86IGFkZCBkZWxlZ2F0aW9uXHJcbiAgICB0aGlzLmFjdGlvbnNGcm9tLnNwbGl0KCcsJykuZm9yRWFjaCgoZXZ0KSA9PiB7XHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5vbihldnQsIHRoaXMuX2luaXRpYXRlQWN0aW9uRnJvbUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBWZXJpZmllcyB0aGF0IHRoZSBnaXZlbiBIVE1MIGVsZW1lbnQgaXMgd2l0aGluIG91ciB2aWV3LlxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBfaXNWYWxpZEVsZW1lbnRGb3JBY3Rpb246IGZ1bmN0aW9uIF9pc1ZhbGlkRWxlbWVudEZvckFjdGlvbihlbCkge1xyXG4gICAgY29uc3QgY29udGFpbmVkID0gdGhpcy5kb21Ob2RlLmNvbnRhaW5zID8gdGhpcy5kb21Ob2RlICE9PSBlbCAmJiB0aGlzLmRvbU5vZGUuY29udGFpbnMoZWwpIDogISEodGhpcy5kb21Ob2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsKSAmIDE2KTtcclxuXHJcbiAgICByZXR1cm4gKHRoaXMuZG9tTm9kZSA9PT0gZWwpIHx8IGNvbnRhaW5lZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGFuIGV2ZW50IGFuZCBmaXJlcyB0aGUgY2xvc2VzdCB2YWxpZCBgZGF0YS1hY3Rpb25gIHdpdGggdGhlIGF0dGFjaGVkIGBkYXRhLWAgYXR0cmlidXRlc1xyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxyXG4gICAqL1xyXG4gIF9pbml0aWF0ZUFjdGlvbkZyb21FdmVudDogZnVuY3Rpb24gX2luaXRpYXRlQWN0aW9uRnJvbUV2ZW50KGV2dCkge1xyXG4gICAgY29uc3QgZWwgPSAkKGV2dC50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWFjdGlvbl0nKS5nZXQoMCk7XHJcbiAgICBjb25zdCBhY3Rpb24gPSAkKGVsKS5hdHRyKCdkYXRhLWFjdGlvbicpO1xyXG5cclxuICAgIGlmIChhY3Rpb24gJiYgdGhpcy5faXNWYWxpZEVsZW1lbnRGb3JBY3Rpb24oZWwpICYmIHRoaXMuaGFzQWN0aW9uKGFjdGlvbiwgZXZ0LCBlbCkpIHtcclxuICAgICAgY29uc3QgcGFyYW1ldGVycyA9IHRoaXMuX2dldFBhcmFtZXRlcnNGb3JBY3Rpb24oYWN0aW9uLCBldnQsIGVsKTtcclxuICAgICAgdGhpcy5pbnZva2VBY3Rpb24oYWN0aW9uLCBwYXJhbWV0ZXJzLCBldnQsIGVsKTtcclxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0cmFjdHMgdGhlIGBkYXRhLWAgYXR0cmlidXRlcyBvZiBhbiBlbGVtZW50IGFuZCBhZGRzIGAkZXZlbnRgIGFuZCBgJHNvdXJjZWAgYmVpbmcgdGhlIHR3byBvcmlnaW5hbHMgdmFsdWVzLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGFjdGlvbi9mdW5jdGlvbiBiZWluZyBmaXJlZC5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIG9yaWdpbmFsIGV2ZW50XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIG5vZGUgdGhhdCBoYXMgdGhlIGBkYXRhLWFjdGlvbmAgYXR0cmlidXRlXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3Qgd2l0aCB0aGUgb3JpZ2luYWwgZXZlbnQgYW5kIHNvdXJjZSBhbG9uZyB3aXRoIGFsbCB0aGUgYGRhdGEtYCBhdHRyaWJ1dGVzIGluIHBhc2NhbCBjYXNlLlxyXG4gICAqL1xyXG4gIF9nZXRQYXJhbWV0ZXJzRm9yQWN0aW9uOiBmdW5jdGlvbiBfZ2V0UGFyYW1ldGVyc0ZvckFjdGlvbihuYW1lLCBldnQsIGVsKSB7XHJcbiAgICBjb25zdCBwYXJhbWV0ZXJzID0ge1xyXG4gICAgICAkZXZlbnQ6IGV2dCxcclxuICAgICAgJHNvdXJjZTogZWwsXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlcGxhY2UoJDAsICQxLCAkMikge1xyXG4gICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKSArICQyO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBhdHRyTGVuID0gZWwuYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBhdHRyTGVuOyBpKyspIHtcclxuICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGVsLmF0dHJpYnV0ZXNbaV0ubmFtZTtcclxuICAgICAgaWYgKC9eKCg/PWRhdGEtYWN0aW9uKXwoPyFkYXRhKSkvLnRlc3QoYXR0cmlidXRlTmFtZSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyogdHJhbnNmb3JtIGh5cGhlbmF0ZWQgbmFtZXMgdG8gcGFzY2FsIGNhc2UsIG1pbnVzIHRoZSBkYXRhIHNlZ21lbnQsIHRvIGJlIGluIGxpbmUgd2l0aCBIVE1MNSBkYXRhc2V0IG5hbWluZyBjb252ZW50aW9ucyAqL1xyXG4gICAgICAvKiBzZWU6IGh0dHA6Ly9kZXYudzMub3JnL2h0bWw1L3NwZWMvZWxlbWVudHMuaHRtbCNlbWJlZGRpbmctY3VzdG9tLW5vbi12aXNpYmxlLWRhdGEgKi9cclxuICAgICAgLyogdG9kbzogcmVtb3ZlIHRyYW5zZm9ybWF0aW9uIGFuZCB1c2UgZGF0YXNldCB3aGVuIGJyb3dzZXIgc3VwcG9ydCBpcyB0aGVyZSAqL1xyXG4gICAgICBjb25zdCBwYXJhbWV0ZXJOYW1lID0gYXR0cmlidXRlTmFtZS5zdWJzdHIoJ2RhdGEtJy5sZW5ndGgpLnJlcGxhY2UoLy0oXFx3KShcXHcrKS9nLCByZXBsYWNlKTtcclxuICAgICAgcGFyYW1ldGVyc1twYXJhbWV0ZXJOYW1lXSA9ICQoZWwpLmF0dHIoYXR0cmlidXRlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcmFtZXRlcnM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB2aWV3IGNvbnRhaW5zIGEgZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gbmFtZVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgZnVuY3Rpb24gYmVpbmcgdGVzdGVkLlxyXG4gICAqIEBwYXJhbSBldnRcclxuICAgKiBAcGFyYW0gZWxcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGhhc0FjdGlvbjogZnVuY3Rpb24gaGFzQWN0aW9uKG5hbWUvKiAsIGV2dCwgZWwqLykge1xyXG4gICAgcmV0dXJuICh0eXBlb2YgdGhpc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxscyB0aGUgZ2l2ZW4gZnVuY3Rpb24gbmFtZSBpbiB0aGUgY29udGV4dCBvZiB0aGUgdmlldyBwYXNzaW5nXHJcbiAgICogdGhlIHtAbGluayAjX2dldFBhcmFtZXRlcnNGb3JBY3Rpb24gcGFyYW1ldGVycyBnYXRoZXJlZH0gYW5kIHRoZSBldmVudCBhbmQgZWxlbWVudC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIGZ1bmN0aW9uIGJlaW5nIGludm9rZWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQ29sbGVjdGlvbiBvZiBgZGF0YS1gIGF0dHJpYnV0ZXMgZnJvbSB0aGUgZWxlbWVudC5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWRcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBUaGUgSFRNTCBlbGVtZW50IHRoYXQgaGFzIHRoZSBgZGF0YS1hY3Rpb25gXHJcbiAgICovXHJcbiAgaW52b2tlQWN0aW9uOiBmdW5jdGlvbiBpbnZva2VBY3Rpb24obmFtZSwgcGFyYW1ldGVycywgZXZ0LCBlbCkge1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV0uYXBwbHkodGhpcywgW3BhcmFtZXRlcnMsIGV2dCwgZWxdKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==