define('argos/_LegacySDataDetailMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/string', './ErrorManager'], function (module, exports, _declare, _string, _ErrorManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _string2 = _interopRequireDefault(_string);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos._LegacySDataDetailMixin
   * @classdesc Enables legacy SData operations for the Detail view.
   *
   */
  var __class = (0, _declare2.default)('argos._LegacySDataDetailMixin', null, /** @lends argos._LegacySDataDetailMixin# */{
    /**
     * Initiates the SData request.
     */
    requestData: function requestData() {
      var request = this.createRequest();

      if (request) {
        request.read({
          success: this.onRequestDataSuccess,
          failure: this.onRequestDataFailure,
          aborted: this.onRequestDataAborted,
          scope: this
        });
      }
    },
    /**
     * Creates Sage.SData.Client.SDataSingleResourceRequest instance and sets a number of known properties.
     *
     * List of properties used `this.property/this.options.property`:
     *
     * `/key`, `resourceKind`, `querySelect`, `queryInclude`, `queryOrderBy`, and `contractName`
     *
     * @return {Object} Sage.SData.Client.SDataSingleResourceRequest instance.
     */
    createRequest: function createRequest() {
      var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());

      /* test for complex selector */
      /* todo: more robust test required? */
      if (/(\s+)/.test(this.options.key)) {
        request.setResourceSelector(this.options.key);
      } else {
        request.setResourceSelector('\'' + this.options.key + '\'');
      }

      if (this.resourceKind) {
        request.setResourceKind(this.resourceKind);
      }

      if (this.querySelect) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, this.querySelect.join(','));
      }

      if (this.queryInclude) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, this.queryInclude.join(','));
      }

      if (this.queryOrderBy) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, this.queryOrderBy);
      }

      if (this.contractName) {
        request.setContractName(this.contractName);
      }

      return request;
    },
    /**
     * Saves the SData response to `this.entry` and invokes {@link #processLayout processLayout} by passing the customized
     * layout definition. If no entry is provided, empty the screen.
     * @param {Object} entry SData response
     */
    processEntry: function processEntry(entry) {
      this.entry = entry;

      if (this.entry) {
        this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
        if (this.isTabbed) {
          this.createTabs(this.tabs);
          this.placeDetailHeader(this.entry);
        }
      } else {
        this.set('detailContent', '');
      }
    },
    /**
     * Handler when a request to SData is successful
     * @param {Object} entry The SData response
     */
    onRequestDataSuccess: function onRequestDataSuccess(entry) {
      this.processEntry(entry);
      $(this.domNode).removeClass('panel-loading');
      this.isRefreshing = false;
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataFailure: function onRequestDataFailure(response, o) {
      if (response && response.status === 404) {
        $(this.contentNode).append(this.notAvailableTemplate.apply(this));
      } else {
        alert(_string2.default.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
        _ErrorManager2.default.addError('failure', response);
      }

      $(this.domNode).removeClass('panel-loading');
      this.isRefreshing = false;
    },
    /**
     * Handler when an a request is aborted from an SData endpoint.
     *
     * Clears the `this.options` object which will by default force a refresh of the view.
     *
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataAborted: function onRequestDataAborted(response /* , o*/) {
      this.options = false; // force a refresh
      _ErrorManager2.default.addError('aborted', response);
      $(this.domNode).removeClass('panel-loading');
      this.isRefreshing = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGVnYWN5U0RhdGFEZXRhaWxNaXhpbi5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwicmVxdWVzdERhdGEiLCJyZXF1ZXN0IiwiY3JlYXRlUmVxdWVzdCIsInJlYWQiLCJzdWNjZXNzIiwib25SZXF1ZXN0RGF0YVN1Y2Nlc3MiLCJmYWlsdXJlIiwib25SZXF1ZXN0RGF0YUZhaWx1cmUiLCJhYm9ydGVkIiwib25SZXF1ZXN0RGF0YUFib3J0ZWQiLCJzY29wZSIsIlNhZ2UiLCJTRGF0YSIsIkNsaWVudCIsIlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0IiwiZ2V0U2VydmljZSIsInRlc3QiLCJvcHRpb25zIiwia2V5Iiwic2V0UmVzb3VyY2VTZWxlY3RvciIsInJlc291cmNlS2luZCIsInNldFJlc291cmNlS2luZCIsInF1ZXJ5U2VsZWN0Iiwic2V0UXVlcnlBcmciLCJTRGF0YVVyaSIsIlF1ZXJ5QXJnTmFtZXMiLCJTZWxlY3QiLCJqb2luIiwicXVlcnlJbmNsdWRlIiwiSW5jbHVkZSIsInF1ZXJ5T3JkZXJCeSIsIk9yZGVyQnkiLCJjb250cmFjdE5hbWUiLCJzZXRDb250cmFjdE5hbWUiLCJwcm9jZXNzRW50cnkiLCJlbnRyeSIsInByb2Nlc3NMYXlvdXQiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZUxheW91dCIsImlzVGFiYmVkIiwiY3JlYXRlVGFicyIsInRhYnMiLCJwbGFjZURldGFpbEhlYWRlciIsInNldCIsIiQiLCJkb21Ob2RlIiwicmVtb3ZlQ2xhc3MiLCJpc1JlZnJlc2hpbmciLCJyZXNwb25zZSIsIm8iLCJzdGF0dXMiLCJjb250ZW50Tm9kZSIsImFwcGVuZCIsIm5vdEF2YWlsYWJsZVRlbXBsYXRlIiwiYXBwbHkiLCJhbGVydCIsInN1YnN0aXR1dGUiLCJyZXF1ZXN0RXJyb3JUZXh0IiwiYWRkRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7OztBQUtBLE1BQU1BLFVBQVUsdUJB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QUFTQSxvQkFBVCxDQUE4QnlDLFFBQTlCLEVBQXdDQyxDQUF4QyxFQUEyQztBQUMvRCxVQUFJRCxZQUFZQSxTQUFTRSxNQUFULEtBQW9CLEdBQXBDLEVBQXlDO0FBQ3ZDTixVQUFFLEtBQUtPLFdBQVAsRUFBb0JDLE1BQXBCLENBQTJCLEtBQUtDLG9CQUFMLENBQTBCQyxLQUExQixDQUFnQyxJQUFoQyxDQUEzQjtBQUNELE9BRkQsTUFFTztBQUNMQyxjQUFNLGlCQUFPQyxVQUFQLENBQWtCLEtBQUtDLGdCQUF2QixFQUF5QyxDQUFDVCxRQUFELEVBQVdDLENBQVgsQ0FBekMsQ0FBTixFQURLLENBQzJEO0FBQ2hFLCtCQUFhUyxRQUFiLENBQXNCLFNBQXRCLEVBQWlDVixRQUFqQztBQUNEOztBQUVESixRQUFFLEtBQUtDLE9BQVAsRUFBZ0JDLFdBQWhCLENBQTRCLGVBQTVCO0FBQ0EsV0FBS0MsWUFBTCxHQUFvQixLQUFwQjtBQUNELEtBcEd3RztBQXFHekc7Ozs7Ozs7O0FBUUF0QywwQkFBc0IsU0FBU0Esb0JBQVQsQ0FBOEJ1QyxRQUE5QixDQUFzQyxRQUF0QyxFQUFnRDtBQUNwRSxXQUFLL0IsT0FBTCxHQUFlLEtBQWYsQ0FEb0UsQ0FDOUM7QUFDdEIsNkJBQWF5QyxRQUFiLENBQXNCLFNBQXRCLEVBQWlDVixRQUFqQztBQUNBSixRQUFFLEtBQUtDLE9BQVAsRUFBZ0JDLFdBQWhCLENBQTRCLGVBQTVCO0FBQ0EsV0FBS0MsWUFBTCxHQUFvQixLQUFwQjtBQUNEO0FBbEh3RyxHQUEzRixDQUFoQixDLENBeEJBOzs7Ozs7Ozs7Ozs7Ozs7b0JBNkllaEQsTyIsImZpbGUiOiJfTGVnYWN5U0RhdGFEZXRhaWxNaXhpbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX0xlZ2FjeVNEYXRhRGV0YWlsTWl4aW5cclxuICogQGNsYXNzZGVzYyBFbmFibGVzIGxlZ2FjeSBTRGF0YSBvcGVyYXRpb25zIGZvciB0aGUgRGV0YWlsIHZpZXcuXHJcbiAqXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX0xlZ2FjeVNEYXRhRGV0YWlsTWl4aW4nLCBudWxsLCAvKiogQGxlbmRzIGFyZ29zLl9MZWdhY3lTRGF0YURldGFpbE1peGluIyAqL3tcclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuY3JlYXRlUmVxdWVzdCgpO1xyXG5cclxuICAgIGlmIChyZXF1ZXN0KSB7XHJcbiAgICAgIHJlcXVlc3QucmVhZCh7XHJcbiAgICAgICAgc3VjY2VzczogdGhpcy5vblJlcXVlc3REYXRhU3VjY2VzcyxcclxuICAgICAgICBmYWlsdXJlOiB0aGlzLm9uUmVxdWVzdERhdGFGYWlsdXJlLFxyXG4gICAgICAgIGFib3J0ZWQ6IHRoaXMub25SZXF1ZXN0RGF0YUFib3J0ZWQsXHJcbiAgICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVNpbmdsZVJlc291cmNlUmVxdWVzdCBpbnN0YW5jZSBhbmQgc2V0cyBhIG51bWJlciBvZiBrbm93biBwcm9wZXJ0aWVzLlxyXG4gICAqXHJcbiAgICogTGlzdCBvZiBwcm9wZXJ0aWVzIHVzZWQgYHRoaXMucHJvcGVydHkvdGhpcy5vcHRpb25zLnByb3BlcnR5YDpcclxuICAgKlxyXG4gICAqIGAva2V5YCwgYHJlc291cmNlS2luZGAsIGBxdWVyeVNlbGVjdGAsIGBxdWVyeUluY2x1ZGVgLCBgcXVlcnlPcmRlckJ5YCwgYW5kIGBjb250cmFjdE5hbWVgXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0IGluc3RhbmNlLlxyXG4gICAqL1xyXG4gIGNyZWF0ZVJlcXVlc3Q6IGZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3QoKSB7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFNhZ2UuU0RhdGEuQ2xpZW50LlNEYXRhU2luZ2xlUmVzb3VyY2VSZXF1ZXN0KHRoaXMuZ2V0U2VydmljZSgpKTtcclxuXHJcbiAgICAvKiB0ZXN0IGZvciBjb21wbGV4IHNlbGVjdG9yICovXHJcbiAgICAvKiB0b2RvOiBtb3JlIHJvYnVzdCB0ZXN0IHJlcXVpcmVkPyAqL1xyXG4gICAgaWYgKC8oXFxzKykvLnRlc3QodGhpcy5vcHRpb25zLmtleSkpIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZVNlbGVjdG9yKHRoaXMub3B0aW9ucy5rZXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZVNlbGVjdG9yKGAnJHt0aGlzLm9wdGlvbnMua2V5fSdgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgcmVxdWVzdC5zZXRSZXNvdXJjZUtpbmQodGhpcy5yZXNvdXJjZUtpbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0KSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5TZWxlY3QsIHRoaXMucXVlcnlTZWxlY3Quam9pbignLCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUluY2x1ZGUpIHtcclxuICAgICAgcmVxdWVzdC5zZXRRdWVyeUFyZyhTYWdlLlNEYXRhLkNsaWVudC5TRGF0YVVyaS5RdWVyeUFyZ05hbWVzLkluY2x1ZGUsIHRoaXMucXVlcnlJbmNsdWRlLmpvaW4oJywnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlPcmRlckJ5KSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0UXVlcnlBcmcoU2FnZS5TRGF0YS5DbGllbnQuU0RhdGFVcmkuUXVlcnlBcmdOYW1lcy5PcmRlckJ5LCB0aGlzLnF1ZXJ5T3JkZXJCeSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgIHJlcXVlc3Quc2V0Q29udHJhY3ROYW1lKHRoaXMuY29udHJhY3ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNhdmVzIHRoZSBTRGF0YSByZXNwb25zZSB0byBgdGhpcy5lbnRyeWAgYW5kIGludm9rZXMge0BsaW5rICNwcm9jZXNzTGF5b3V0IHByb2Nlc3NMYXlvdXR9IGJ5IHBhc3NpbmcgdGhlIGN1c3RvbWl6ZWRcclxuICAgKiBsYXlvdXQgZGVmaW5pdGlvbi4gSWYgbm8gZW50cnkgaXMgcHJvdmlkZWQsIGVtcHR5IHRoZSBzY3JlZW4uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IFNEYXRhIHJlc3BvbnNlXHJcbiAgICovXHJcbiAgcHJvY2Vzc0VudHJ5OiBmdW5jdGlvbiBwcm9jZXNzRW50cnkoZW50cnkpIHtcclxuICAgIHRoaXMuZW50cnkgPSBlbnRyeTtcclxuXHJcbiAgICBpZiAodGhpcy5lbnRyeSkge1xyXG4gICAgICB0aGlzLnByb2Nlc3NMYXlvdXQodGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUxheW91dCgpKSwgdGhpcy5lbnRyeSk7XHJcbiAgICAgIGlmICh0aGlzLmlzVGFiYmVkKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUYWJzKHRoaXMudGFicyk7XHJcbiAgICAgICAgdGhpcy5wbGFjZURldGFpbEhlYWRlcih0aGlzLmVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXQoJ2RldGFpbENvbnRlbnQnLCAnJyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYSByZXF1ZXN0IHRvIFNEYXRhIGlzIHN1Y2Nlc3NmdWxcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgVGhlIFNEYXRhIHJlc3BvbnNlXHJcbiAgICovXHJcbiAgb25SZXF1ZXN0RGF0YVN1Y2Nlc3M6IGZ1bmN0aW9uIG9uUmVxdWVzdERhdGFTdWNjZXNzKGVudHJ5KSB7XHJcbiAgICB0aGlzLnByb2Nlc3NFbnRyeShlbnRyeSk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYW4gZXJyb3Igb2NjdXJzIHdoaWxlIHJlcXVlc3QgZGF0YSBmcm9tIHRoZSBTRGF0YSBlbmRwb2ludC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gbyBUaGUgb3B0aW9ucyB0aGF0IHdlcmUgcGFzc2VkIHdoZW4gY3JlYXRpbmcgdGhlIEFqYXggcmVxdWVzdC5cclxuICAgKi9cclxuICBvblJlcXVlc3REYXRhRmFpbHVyZTogZnVuY3Rpb24gb25SZXF1ZXN0RGF0YUZhaWx1cmUocmVzcG9uc2UsIG8pIHtcclxuICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZCh0aGlzLm5vdEF2YWlsYWJsZVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFsZXJ0KHN0cmluZy5zdWJzdGl0dXRlKHRoaXMucmVxdWVzdEVycm9yVGV4dCwgW3Jlc3BvbnNlLCBvXSkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcignZmFpbHVyZScsIHJlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIHdoZW4gYW4gYSByZXF1ZXN0IGlzIGFib3J0ZWQgZnJvbSBhbiBTRGF0YSBlbmRwb2ludC5cclxuICAgKlxyXG4gICAqIENsZWFycyB0aGUgYHRoaXMub3B0aW9uc2Agb2JqZWN0IHdoaWNoIHdpbGwgYnkgZGVmYXVsdCBmb3JjZSBhIHJlZnJlc2ggb2YgdGhlIHZpZXcuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gbyBUaGUgb3B0aW9ucyB0aGF0IHdlcmUgcGFzc2VkIHdoZW4gY3JlYXRpbmcgdGhlIEFqYXggcmVxdWVzdC5cclxuICAgKi9cclxuICBvblJlcXVlc3REYXRhQWJvcnRlZDogZnVuY3Rpb24gb25SZXF1ZXN0RGF0YUFib3J0ZWQocmVzcG9uc2UvKiAsIG8qLykge1xyXG4gICAgdGhpcy5vcHRpb25zID0gZmFsc2U7IC8vIGZvcmNlIGEgcmVmcmVzaFxyXG4gICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKCdhYm9ydGVkJywgcmVzcG9uc2UpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19