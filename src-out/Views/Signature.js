define('argos/Views/Signature', ['module', 'exports', 'dojo/_base/declare', 'dojo/window', '../Format', '../View', '../I18n'], function (module, exports, _declare, _window, _Format, _View, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _window2 = _interopRequireDefault(_window);

  var _Format2 = _interopRequireDefault(_Format);

  var _View2 = _interopRequireDefault(_View);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('signature');

  /**
   * @class argos.Views.Signature
   * @classdesc Signature View is a view tailored to present an HTML5 canvas that has signature-recording capabilities.
   * It goes hand-in-hand with {@link SignatureField SignatureField}
   * @extends argos.View
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

  var __class = (0, _declare2.default)('argos.Views.Signature', [_View2.default], /** @lends argos.Views.Signature# */{
    // Localization
    /**
     * @property {String}
     * Text shown in the top toolbar header
     */
    titleText: resource.titleText,
    /**
     * @property {String}
     * Text shown in the clear button
     */
    clearCanvasText: resource.clearCanvasText,
    /**
     * @property {String}
     * Text shown in the undo button
     */
    undoText: resource.undoText,

    // Templates
    /**
     * @property {Simplate}
     * Simplate that defines the HTML Markup
     *
     * * `$` => Signature view instance
     *
     */
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" data-title="{%: $.titleText %}" class="panel {%= $.cls %}">', '{%! $.canvasTemplate %}', '<div class="buttons">', '<button class="button" data-action="_undo"><span>{%: $.undoText %}</span></button>', '<button class="button" data-action="clearValue"><span>{%: $.clearCanvasText %}</span></button>', '</div>', '<div>']),
    /**
     * @property {Simplate}
     * Simplate that defines the canvas with a set width and height
     */
    canvasTemplate: new Simplate(['<canvas data-dojo-attach-point="signatureNode" width="{%: $.canvasNodeWidth %}" height="{%: $.canvasNodeHeight %}" data-dojo-attach-event="onmousedown:_penDown,onmousemove:_penMove,onmouseup:_penUp,ontouchstart:_penDown,ontouchmove:_penMove,ontouchend:_penUp"></canvas>']),
    /**
     * @property {HTMLElement}
     * The dojo-attach-point for the canvas element
     */
    signatureNode: null,

    // View Properties
    /**
     * @property {String}
     * The unique view id
     */
    id: 'signature_edit',
    /**
     * @property {Boolean}
     * Flag that may be used to control if the view is shown in configurable lists
     */
    expose: false,
    /**
     * @property {Number[][]}
     * Stores series of x,y coordinates in the format of: `[[0,0],[1,5]]`
     */
    signature: [],
    /**
     * @property {Number[][]}
     * Collection of the touchmove positions
     */
    trace: [],
    /**
     * @property {Object}
     * Stores where the last drawn point was
     */
    lastpos: {
      x: -1,
      y: -1
    },
    /**
     * @cfg {Object}
     * Stores the passed options for: `scale`, `lineWidth`, `penColor` and `drawColor`.
     */
    config: {
      scale: 1,
      lineWidth: 3,
      penColor: 'blue',
      drawColor: 'red'
    },
    /**
     * @property {Boolean}
     * Flag for determining if the pen is in "down" state.
     */
    isPenDown: false,
    /**
     * @property {Object}
     * The stored 2d context of the canvas node
     */
    context: null,
    /**
     * @property {Number[][]}
     * Used to temporarily store the signature
     */
    buffer: [],
    /**
     * @cfg {Number}
     * Starting default width of canvas, will be re-sized when the view is shown.
     */
    canvasNodeWidth: 360,
    /**
     * @cfg {Number}
     * Starting default height of canvas, will be re-sized when the view is shown.
     */
    canvasNodeHeight: 120,

    show: function show(options) {
      this.inherited(arguments);

      if (options && options.lineWidth) {
        this.config.lineWidth = options.lineWidth;
      }

      if (options && options.penColor) {
        this.config.penColor = options.penColor;
      }

      if (options && options.drawColor) {
        this.config.drawColor = options.drawColor;
      }

      this.signature = options && options.signature ? options.signature : [];

      this._sizeCanvas();
      this.context = this.signatureNode.getContext('2d');
      $(window).on('resize', this.onResize.bind(this));

      this.redraw(this.signature, this.signatureNode, this.config);
    },
    /**
     * Returns the optimized signature array as a JSON string
     * @return {String}
     */
    getValues: function getValues() {
      return JSON.stringify(this.optimizeSignature());
    },
    /**
     * Sets the current value and draws it.
     * @param {String} val JSON-stringified Number[][] of x-y coordinates
     * @param initial Unused.
     */
    setValue: function setValue(val /* , initial*/) {
      this.signature = val ? JSON.parse(val) : [];
      this.redraw(this.signature, this.signatureNode, this.config);
    },
    /**
     * Clears the value and saves the buffer
     */
    clearValue: function clearValue() {
      this.buffer = this.signature;
      this.setValue('', true);
    },
    /**
     * Returns pointer pixel coordinates [x,y] relative to canvas object
     * @param {Event} e
     * @return Number[]
     */
    _getCoords: function _getCoords(e) {
      var offset = $(this.signatureNode).position();
      return e.touches ? [e.touches[0].pageX - offset.left, e.touches[0].pageY - offset.top] : [e.clientX - offset.left, e.clientY - offset.top];
    },
    /**
     * Handler for `ontouchstart`, records the starting point and sets the state to down
     * @param {Event} e
     */
    _penDown: function _penDown(e) {
      this.isPenDown = true;
      this.lastpos = this._getCoords(e);
      this.context.lineWidth = this.config.lineWidth;
      this.context.strokeStyle = this.config.drawColor;
      e.preventDefault();
    },
    /**
     * Handler for `ontouchmove`, draws the lines between the last postition and current position
     * @param {Event} e
     */
    _penMove: function _penMove(e) {
      if (!this.isPenDown) {
        return;
      }

      this.pos = this._getCoords(e);
      e.preventDefault();
      this.context.beginPath();
      this.context.moveTo(this.lastpos[0], this.lastpos[1]);
      this.context.lineTo(this.pos[0], this.pos[1]);
      this.context.closePath();
      this.context.stroke();
      e.preventDefault();
      this.lastpos = this.pos;
      this.trace.push(this.pos);
    },
    /**
     * Handler for `ontouchend`, saves the final signature and redraws the canvas
     * @param e
     */
    _penUp: function _penUp(e) {
      e.preventDefault();
      this.isPenDown = false;
      if (this.trace.length) {
        this.signature.push(this.trace);
      }

      this.trace = [];
      this.context.strokeStyle = this.config.penColor;
      this.redraw(this.signature, this.signatureNode, this.config);
    },
    /**
     * Undoes the last pen down-to-pen up line by using the buffer
     */
    _undo: function _undo() {
      if (this.signature.length) {
        this.buffer = this.signature.pop();
        if (!this.signature.length) {
          this.buffer = [this.buffer];
        }
      } else if (this.buffer.length) {
        this.signature = this.buffer;
      }
      this.redraw(this.signature, this.signatureNode, this.config);
    },
    /**
     * Sets the canvas width/height based on the size of the window/screen
     */
    _sizeCanvas: function _sizeCanvas() {
      this.canvasNodeWidth = Math.floor(_window2.default.getBox().w * 0.92);

      this.canvasNodeHeight = Math.min(Math.floor(this.canvasNodeWidth * 0.5), _window2.default.getBox().h - $('.toolbar').get(0).offsetHeight);

      this.signatureNode.width = this.canvasNodeWidth;
      this.signatureNode.height = this.canvasNodeHeight;
    },
    /**
     * Calls {@link #_sizeCanvas _sizeCanvas} to size the canvas itself then it also scales the
     * drawn signature accordingly to the ratio.
     * @param e
     */
    onResize: function onResize() /* e*/{
      var oldWidth = this.canvasNodeWidth;
      var oldHeight = this.canvasNodeHeight;
      this._sizeCanvas();

      var newScale = Math.min(this.canvasNodeWidth / oldWidth, this.canvasNodeHeight / oldHeight);

      this.signature = this.rescale(newScale);
      this.redraw(this.signature, this.signatureNode, this.config);
    },
    /**
     * Calls {@link format#canvasDraw format.canvasDraw} which clears and draws the vectors
     * @param {Number[][]} vector The x-y coordinates of the points
     * @param {HTMLElement} canvas Canvas to be drawn to
     * @param {Object} options Options to be passed to canvasDraw
     */
    redraw: function redraw(vector, canvas, options) {
      _Format2.default.canvasDraw(vector, canvas, options);
    },
    /**
     * Loops through the vector points in the signature and applies the given scale ratio
     * @param {Number} scale Ratio in which to multiply the vector point
     * @return {Number[][]} Rescaled signature array
     */
    rescale: function rescale(scale) {
      var rescaled = [];
      for (var i = 0; i < this.signature.length; i++) {
        rescaled.push([]);
        for (var j = 0; j < this.signature[i].length; j++) {
          rescaled[i].push([this.signature[i][j][0] * scale, this.signature[i][j][1] * scale]);
        }
      }
      return rescaled;
    },
    /**
     * Loops the signature calling optimize on each pen down-to-pen up segment
     * @return {Number[][]} Optimized signature
     */
    optimizeSignature: function optimizeSignature() {
      var optimized = [];

      for (var i = 0; i < this.signature.length; i++) {
        optimized.push(this.optimize(this.signature[i]));
      }

      return optimized;
    },
    /**
     * Attempts to remove points by comparing the x/y variation between the two and
     * removing points within a certain threshold.
     * @param {Number[]} vector Array of x,y coordinates to optimize
     * @return {Number[]} Optimized array
     */
    optimize: function optimize(vector) {
      if (vector.length < 2) {
        return vector;
      }

      var result = [];
      var minA = 0.95;
      var maxL = 15.0; // 15.0, 10.0 works well
      var rootP = vector[0];
      var lastP = vector[1];
      var rootV = [lastP[0] - rootP[0], lastP[1] - rootP[1]];
      var rootL = Math.sqrt(rootV[0] * rootV[0] + rootV[1] * rootV[1]);

      for (var i = 2; i < vector.length; i++) {
        var currentP = vector[i];
        var currentV = [currentP[0] - rootP[0], currentP[1] - rootP[1]];
        var currentL = Math.sqrt(currentV[0] * currentV[0] + currentV[1] * currentV[1]);
        var dotProduct = (rootV[0] * currentV[0] + rootV[1] * currentV[1]) / (rootL * currentL);

        if (dotProduct < minA || currentL > maxL) {
          result.push(rootP);
          rootP = lastP;
          lastP = currentP;
          rootV = [lastP[0] - rootP[0], lastP[1] - rootP[1]];
          rootL = Math.sqrt(rootV[0] * rootV[0] + rootV[1] * rootV[1]);
        } else {
          lastP = currentP;
        }
      }

      result.push(lastP);

      return result;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9TaWduYXR1cmUuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwidGl0bGVUZXh0IiwiY2xlYXJDYW52YXNUZXh0IiwidW5kb1RleHQiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY2FudmFzVGVtcGxhdGUiLCJzaWduYXR1cmVOb2RlIiwiaWQiLCJleHBvc2UiLCJzaWduYXR1cmUiLCJ0cmFjZSIsImxhc3Rwb3MiLCJ4IiwieSIsImNvbmZpZyIsInNjYWxlIiwibGluZVdpZHRoIiwicGVuQ29sb3IiLCJkcmF3Q29sb3IiLCJpc1BlbkRvd24iLCJjb250ZXh0IiwiYnVmZmVyIiwiY2FudmFzTm9kZVdpZHRoIiwiY2FudmFzTm9kZUhlaWdodCIsInNob3ciLCJvcHRpb25zIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX3NpemVDYW52YXMiLCJnZXRDb250ZXh0IiwiJCIsIndpbmRvdyIsIm9uIiwib25SZXNpemUiLCJiaW5kIiwicmVkcmF3IiwiZ2V0VmFsdWVzIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9wdGltaXplU2lnbmF0dXJlIiwic2V0VmFsdWUiLCJ2YWwiLCJwYXJzZSIsImNsZWFyVmFsdWUiLCJfZ2V0Q29vcmRzIiwiZSIsIm9mZnNldCIsInBvc2l0aW9uIiwidG91Y2hlcyIsInBhZ2VYIiwibGVmdCIsInBhZ2VZIiwidG9wIiwiY2xpZW50WCIsImNsaWVudFkiLCJfcGVuRG93biIsInN0cm9rZVN0eWxlIiwicHJldmVudERlZmF1bHQiLCJfcGVuTW92ZSIsInBvcyIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsImNsb3NlUGF0aCIsInN0cm9rZSIsInB1c2giLCJfcGVuVXAiLCJsZW5ndGgiLCJfdW5kbyIsInBvcCIsIk1hdGgiLCJmbG9vciIsImdldEJveCIsInciLCJtaW4iLCJoIiwiZ2V0Iiwib2Zmc2V0SGVpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJvbGRXaWR0aCIsIm9sZEhlaWdodCIsIm5ld1NjYWxlIiwicmVzY2FsZSIsInZlY3RvciIsImNhbnZhcyIsImNhbnZhc0RyYXciLCJyZXNjYWxlZCIsImkiLCJqIiwib3B0aW1pemVkIiwib3B0aW1pemUiLCJyZXN1bHQiLCJtaW5BIiwibWF4TCIsInJvb3RQIiwibGFzdFAiLCJyb290ViIsInJvb3RMIiwic3FydCIsImN1cnJlbnRQIiwiY3VycmVudFYiLCJjdXJyZW50TCIsImRvdFByb2R1Y3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxNQUFNQSxXQUFXLG9CQUFZLFdBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7QUF4QkE7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxNQUFNQyxVQUFVLHVCQUFRLHVCQUFSLEVBQWlDLGdCQUFqQyxFQUF5QyxvQ0FBb0M7QUFDM0Y7QUFDQTs7OztBQUlBQyxlQUFXRixTQUFTRSxTQU51RTtBQU8zRjs7OztBQUlBQyxxQkFBaUJILFNBQVNHLGVBWGlFO0FBWTNGOzs7O0FBSUFDLGNBQVVKLFNBQVNJLFFBaEJ3RTs7QUFrQjNGO0FBQ0E7Ozs7Ozs7QUFPQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixtRkFEMkIsRUFFM0IseUJBRjJCLEVBRzNCLHVCQUgyQixFQUkzQixvRkFKMkIsRUFLM0IsZ0dBTDJCLEVBTTNCLFFBTjJCLEVBTzNCLE9BUDJCLENBQWIsQ0ExQjJFO0FBbUMzRjs7OztBQUlBQyxvQkFBZ0IsSUFBSUQsUUFBSixDQUFhLENBQzNCLCtRQUQyQixDQUFiLENBdkMyRTtBQTBDM0Y7Ozs7QUFJQUUsbUJBQWUsSUE5QzRFOztBQWdEM0Y7QUFDQTs7OztBQUlBQyxRQUFJLGdCQXJEdUY7QUFzRDNGOzs7O0FBSUFDLFlBQVEsS0ExRG1GO0FBMkQzRjs7OztBQUlBQyxlQUFXLEVBL0RnRjtBQWdFM0Y7Ozs7QUFJQUMsV0FBTyxFQXBFb0Y7QUFxRTNGOzs7O0FBSUFDLGFBQVM7QUFDUEMsU0FBRyxDQUFDLENBREc7QUFFUEMsU0FBRyxDQUFDO0FBRkcsS0F6RWtGO0FBNkUzRjs7OztBQUlBQyxZQUFRO0FBQ05DLGFBQU8sQ0FERDtBQUVOQyxpQkFBVyxDQUZMO0FBR05DLGdCQUFVLE1BSEo7QUFJTkMsaUJBQVc7QUFKTCxLQWpGbUY7QUF1RjNGOzs7O0FBSUFDLGVBQVcsS0EzRmdGO0FBNEYzRjs7OztBQUlBQyxhQUFTLElBaEdrRjtBQWlHM0Y7Ozs7QUFJQUMsWUFBUSxFQXJHbUY7QUFzRzNGOzs7O0FBSUFDLHFCQUFpQixHQTFHMEU7QUEyRzNGOzs7O0FBSUFDLHNCQUFrQixHQS9HeUU7O0FBaUgzRkMsVUFBTSxTQUFTQSxJQUFULENBQWNDLE9BQWQsRUFBdUI7QUFDM0IsV0FBS0MsU0FBTCxDQUFlQyxTQUFmOztBQUVBLFVBQUlGLFdBQVdBLFFBQVFULFNBQXZCLEVBQWtDO0FBQ2hDLGFBQUtGLE1BQUwsQ0FBWUUsU0FBWixHQUF3QlMsUUFBUVQsU0FBaEM7QUFDRDs7QUFFRCxVQUFJUyxXQUFXQSxRQUFRUixRQUF2QixFQUFpQztBQUMvQixhQUFLSCxNQUFMLENBQVlHLFFBQVosR0FBdUJRLFFBQVFSLFFBQS9CO0FBQ0Q7O0FBRUQsVUFBSVEsV0FBV0EsUUFBUVAsU0FBdkIsRUFBa0M7QUFDaEMsYUFBS0osTUFBTCxDQUFZSSxTQUFaLEdBQXdCTyxRQUFRUCxTQUFoQztBQUNEOztBQUVELFdBQUtULFNBQUwsR0FBa0JnQixXQUFXQSxRQUFRaEIsU0FBcEIsR0FBaUNnQixRQUFRaEIsU0FBekMsR0FBcUQsRUFBdEU7O0FBRUEsV0FBS21CLFdBQUw7QUFDQSxXQUFLUixPQUFMLEdBQWUsS0FBS2QsYUFBTCxDQUFtQnVCLFVBQW5CLENBQThCLElBQTlCLENBQWY7QUFDQUMsUUFBRUMsTUFBRixFQUFVQyxFQUFWLENBQWEsUUFBYixFQUF1QixLQUFLQyxRQUFMLENBQWNDLElBQWQsQ0FBbUIsSUFBbkIsQ0FBdkI7O0FBRUEsV0FBS0MsTUFBTCxDQUFZLEtBQUsxQixTQUFqQixFQUE0QixLQUFLSCxhQUFqQyxFQUFnRCxLQUFLUSxNQUFyRDtBQUNELEtBdkkwRjtBQXdJM0Y7Ozs7QUFJQXNCLGVBQVcsU0FBU0EsU0FBVCxHQUFxQjtBQUM5QixhQUFPQyxLQUFLQyxTQUFMLENBQWUsS0FBS0MsaUJBQUwsRUFBZixDQUFQO0FBQ0QsS0E5STBGO0FBK0kzRjs7Ozs7QUFLQUMsY0FBVSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixDQUFxQixjQUFyQixFQUFxQztBQUM3QyxXQUFLaEMsU0FBTCxHQUFpQmdDLE1BQU1KLEtBQUtLLEtBQUwsQ0FBV0QsR0FBWCxDQUFOLEdBQXdCLEVBQXpDO0FBQ0EsV0FBS04sTUFBTCxDQUFZLEtBQUsxQixTQUFqQixFQUE0QixLQUFLSCxhQUFqQyxFQUFnRCxLQUFLUSxNQUFyRDtBQUNELEtBdkowRjtBQXdKM0Y7OztBQUdBNkIsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxXQUFLdEIsTUFBTCxHQUFjLEtBQUtaLFNBQW5CO0FBQ0EsV0FBSytCLFFBQUwsQ0FBYyxFQUFkLEVBQWtCLElBQWxCO0FBQ0QsS0E5SjBGO0FBK0ozRjs7Ozs7QUFLQUksZ0JBQVksU0FBU0EsVUFBVCxDQUFvQkMsQ0FBcEIsRUFBdUI7QUFDakMsVUFBTUMsU0FBU2hCLEVBQUUsS0FBS3hCLGFBQVAsRUFBc0J5QyxRQUF0QixFQUFmO0FBQ0EsYUFBT0YsRUFBRUcsT0FBRixHQUFZLENBQ2pCSCxFQUFFRyxPQUFGLENBQVUsQ0FBVixFQUFhQyxLQUFiLEdBQXFCSCxPQUFPSSxJQURYLEVBRWpCTCxFQUFFRyxPQUFGLENBQVUsQ0FBVixFQUFhRyxLQUFiLEdBQXFCTCxPQUFPTSxHQUZYLENBQVosR0FHSCxDQUNGUCxFQUFFUSxPQUFGLEdBQVlQLE9BQU9JLElBRGpCLEVBRUZMLEVBQUVTLE9BQUYsR0FBWVIsT0FBT00sR0FGakIsQ0FISjtBQU9ELEtBN0swRjtBQThLM0Y7Ozs7QUFJQUcsY0FBVSxTQUFTQSxRQUFULENBQWtCVixDQUFsQixFQUFxQjtBQUM3QixXQUFLMUIsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFdBQUtSLE9BQUwsR0FBZSxLQUFLaUMsVUFBTCxDQUFnQkMsQ0FBaEIsQ0FBZjtBQUNBLFdBQUt6QixPQUFMLENBQWFKLFNBQWIsR0FBeUIsS0FBS0YsTUFBTCxDQUFZRSxTQUFyQztBQUNBLFdBQUtJLE9BQUwsQ0FBYW9DLFdBQWIsR0FBMkIsS0FBSzFDLE1BQUwsQ0FBWUksU0FBdkM7QUFDQTJCLFFBQUVZLGNBQUY7QUFDRCxLQXhMMEY7QUF5TDNGOzs7O0FBSUFDLGNBQVUsU0FBU0EsUUFBVCxDQUFrQmIsQ0FBbEIsRUFBcUI7QUFDN0IsVUFBSSxDQUFDLEtBQUsxQixTQUFWLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQsV0FBS3dDLEdBQUwsR0FBVyxLQUFLZixVQUFMLENBQWdCQyxDQUFoQixDQUFYO0FBQ0FBLFFBQUVZLGNBQUY7QUFDQSxXQUFLckMsT0FBTCxDQUFhd0MsU0FBYjtBQUNBLFdBQUt4QyxPQUFMLENBQWF5QyxNQUFiLENBQW9CLEtBQUtsRCxPQUFMLENBQWEsQ0FBYixDQUFwQixFQUFxQyxLQUFLQSxPQUFMLENBQWEsQ0FBYixDQUFyQztBQUNBLFdBQUtTLE9BQUwsQ0FBYTBDLE1BQWIsQ0FBb0IsS0FBS0gsR0FBTCxDQUFTLENBQVQsQ0FBcEIsRUFBaUMsS0FBS0EsR0FBTCxDQUFTLENBQVQsQ0FBakM7QUFDQSxXQUFLdkMsT0FBTCxDQUFhMkMsU0FBYjtBQUNBLFdBQUszQyxPQUFMLENBQWE0QyxNQUFiO0FBQ0FuQixRQUFFWSxjQUFGO0FBQ0EsV0FBSzlDLE9BQUwsR0FBZSxLQUFLZ0QsR0FBcEI7QUFDQSxXQUFLakQsS0FBTCxDQUFXdUQsSUFBWCxDQUFnQixLQUFLTixHQUFyQjtBQUNELEtBNU0wRjtBQTZNM0Y7Ozs7QUFJQU8sWUFBUSxTQUFTQSxNQUFULENBQWdCckIsQ0FBaEIsRUFBbUI7QUFDekJBLFFBQUVZLGNBQUY7QUFDQSxXQUFLdEMsU0FBTCxHQUFpQixLQUFqQjtBQUNBLFVBQUksS0FBS1QsS0FBTCxDQUFXeUQsTUFBZixFQUF1QjtBQUNyQixhQUFLMUQsU0FBTCxDQUFld0QsSUFBZixDQUFvQixLQUFLdkQsS0FBekI7QUFDRDs7QUFFRCxXQUFLQSxLQUFMLEdBQWEsRUFBYjtBQUNBLFdBQUtVLE9BQUwsQ0FBYW9DLFdBQWIsR0FBMkIsS0FBSzFDLE1BQUwsQ0FBWUcsUUFBdkM7QUFDQSxXQUFLa0IsTUFBTCxDQUFZLEtBQUsxQixTQUFqQixFQUE0QixLQUFLSCxhQUFqQyxFQUFnRCxLQUFLUSxNQUFyRDtBQUNELEtBM04wRjtBQTROM0Y7OztBQUdBc0QsV0FBTyxTQUFTQSxLQUFULEdBQWlCO0FBQ3RCLFVBQUksS0FBSzNELFNBQUwsQ0FBZTBELE1BQW5CLEVBQTJCO0FBQ3pCLGFBQUs5QyxNQUFMLEdBQWMsS0FBS1osU0FBTCxDQUFlNEQsR0FBZixFQUFkO0FBQ0EsWUFBSSxDQUFDLEtBQUs1RCxTQUFMLENBQWUwRCxNQUFwQixFQUE0QjtBQUMxQixlQUFLOUMsTUFBTCxHQUFjLENBQUMsS0FBS0EsTUFBTixDQUFkO0FBQ0Q7QUFDRixPQUxELE1BS08sSUFBSSxLQUFLQSxNQUFMLENBQVk4QyxNQUFoQixFQUF3QjtBQUM3QixhQUFLMUQsU0FBTCxHQUFpQixLQUFLWSxNQUF0QjtBQUNEO0FBQ0QsV0FBS2MsTUFBTCxDQUFZLEtBQUsxQixTQUFqQixFQUE0QixLQUFLSCxhQUFqQyxFQUFnRCxLQUFLUSxNQUFyRDtBQUNELEtBek8wRjtBQTBPM0Y7OztBQUdBYyxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLFdBQUtOLGVBQUwsR0FBdUJnRCxLQUFLQyxLQUFMLENBQVcsaUJBQUlDLE1BQUosR0FBYUMsQ0FBYixHQUFpQixJQUE1QixDQUF2Qjs7QUFFQSxXQUFLbEQsZ0JBQUwsR0FBd0IrQyxLQUFLSSxHQUFMLENBQ3RCSixLQUFLQyxLQUFMLENBQVcsS0FBS2pELGVBQUwsR0FBdUIsR0FBbEMsQ0FEc0IsRUFFdEIsaUJBQUlrRCxNQUFKLEdBQWFHLENBQWIsR0FBaUI3QyxFQUFFLFVBQUYsRUFBYzhDLEdBQWQsQ0FBa0IsQ0FBbEIsRUFBcUJDLFlBRmhCLENBQXhCOztBQUtBLFdBQUt2RSxhQUFMLENBQW1Cd0UsS0FBbkIsR0FBMkIsS0FBS3hELGVBQWhDO0FBQ0EsV0FBS2hCLGFBQUwsQ0FBbUJ5RSxNQUFuQixHQUE0QixLQUFLeEQsZ0JBQWpDO0FBQ0QsS0F2UDBGO0FBd1AzRjs7Ozs7QUFLQVUsY0FBVSxTQUFTQSxRQUFULEdBQWtCLE1BQVE7QUFDbEMsVUFBTStDLFdBQVcsS0FBSzFELGVBQXRCO0FBQ0EsVUFBTTJELFlBQVksS0FBSzFELGdCQUF2QjtBQUNBLFdBQUtLLFdBQUw7O0FBRUEsVUFBTXNELFdBQVdaLEtBQUtJLEdBQUwsQ0FDZixLQUFLcEQsZUFBTCxHQUF1QjBELFFBRFIsRUFFZixLQUFLekQsZ0JBQUwsR0FBd0IwRCxTQUZULENBQWpCOztBQUtBLFdBQUt4RSxTQUFMLEdBQWlCLEtBQUswRSxPQUFMLENBQWFELFFBQWIsQ0FBakI7QUFDQSxXQUFLL0MsTUFBTCxDQUFZLEtBQUsxQixTQUFqQixFQUE0QixLQUFLSCxhQUFqQyxFQUFnRCxLQUFLUSxNQUFyRDtBQUNELEtBelEwRjtBQTBRM0Y7Ozs7OztBQU1BcUIsWUFBUSxTQUFTQSxNQUFULENBQWdCaUQsTUFBaEIsRUFBd0JDLE1BQXhCLEVBQWdDNUQsT0FBaEMsRUFBeUM7QUFDL0MsdUJBQU82RCxVQUFQLENBQWtCRixNQUFsQixFQUEwQkMsTUFBMUIsRUFBa0M1RCxPQUFsQztBQUNELEtBbFIwRjtBQW1SM0Y7Ozs7O0FBS0EwRCxhQUFTLFNBQVNBLE9BQVQsQ0FBaUJwRSxLQUFqQixFQUF3QjtBQUMvQixVQUFNd0UsV0FBVyxFQUFqQjtBQUNBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUsvRSxTQUFMLENBQWUwRCxNQUFuQyxFQUEyQ3FCLEdBQTNDLEVBQWdEO0FBQzlDRCxpQkFBU3RCLElBQVQsQ0FBYyxFQUFkO0FBQ0EsYUFBSyxJQUFJd0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUtoRixTQUFMLENBQWUrRSxDQUFmLEVBQWtCckIsTUFBdEMsRUFBOENzQixHQUE5QyxFQUFtRDtBQUNqREYsbUJBQVNDLENBQVQsRUFBWXZCLElBQVosQ0FBaUIsQ0FDZixLQUFLeEQsU0FBTCxDQUFlK0UsQ0FBZixFQUFrQkMsQ0FBbEIsRUFBcUIsQ0FBckIsSUFBMEIxRSxLQURYLEVBRWYsS0FBS04sU0FBTCxDQUFlK0UsQ0FBZixFQUFrQkMsQ0FBbEIsRUFBcUIsQ0FBckIsSUFBMEIxRSxLQUZYLENBQWpCO0FBSUQ7QUFDRjtBQUNELGFBQU93RSxRQUFQO0FBQ0QsS0FwUzBGO0FBcVMzRjs7OztBQUlBaEQsdUJBQW1CLFNBQVNBLGlCQUFULEdBQTZCO0FBQzlDLFVBQU1tRCxZQUFZLEVBQWxCOztBQUVBLFdBQUssSUFBSUYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUsvRSxTQUFMLENBQWUwRCxNQUFuQyxFQUEyQ3FCLEdBQTNDLEVBQWdEO0FBQzlDRSxrQkFBVXpCLElBQVYsQ0FBZSxLQUFLMEIsUUFBTCxDQUFjLEtBQUtsRixTQUFMLENBQWUrRSxDQUFmLENBQWQsQ0FBZjtBQUNEOztBQUVELGFBQU9FLFNBQVA7QUFDRCxLQWpUMEY7QUFrVDNGOzs7Ozs7QUFNQUMsY0FBVSxTQUFTQSxRQUFULENBQWtCUCxNQUFsQixFQUEwQjtBQUNsQyxVQUFJQSxPQUFPakIsTUFBUCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQixlQUFPaUIsTUFBUDtBQUNEOztBQUVELFVBQU1RLFNBQVMsRUFBZjtBQUNBLFVBQU1DLE9BQU8sSUFBYjtBQUNBLFVBQU1DLE9BQU8sSUFBYixDQVBrQyxDQU9mO0FBQ25CLFVBQUlDLFFBQVFYLE9BQU8sQ0FBUCxDQUFaO0FBQ0EsVUFBSVksUUFBUVosT0FBTyxDQUFQLENBQVo7QUFDQSxVQUFJYSxRQUFRLENBQUNELE1BQU0sQ0FBTixJQUFXRCxNQUFNLENBQU4sQ0FBWixFQUFzQkMsTUFBTSxDQUFOLElBQVdELE1BQU0sQ0FBTixDQUFqQyxDQUFaO0FBQ0EsVUFBSUcsUUFBUTVCLEtBQUs2QixJQUFMLENBQVVGLE1BQU0sQ0FBTixJQUFXQSxNQUFNLENBQU4sQ0FBWCxHQUFzQkEsTUFBTSxDQUFOLElBQVdBLE1BQU0sQ0FBTixDQUEzQyxDQUFaOztBQUVBLFdBQUssSUFBSVQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixPQUFPakIsTUFBM0IsRUFBbUNxQixHQUFuQyxFQUF3QztBQUN0QyxZQUFNWSxXQUFXaEIsT0FBT0ksQ0FBUCxDQUFqQjtBQUNBLFlBQU1hLFdBQVcsQ0FBQ0QsU0FBUyxDQUFULElBQWNMLE1BQU0sQ0FBTixDQUFmLEVBQXlCSyxTQUFTLENBQVQsSUFBY0wsTUFBTSxDQUFOLENBQXZDLENBQWpCO0FBQ0EsWUFBTU8sV0FBV2hDLEtBQUs2QixJQUFMLENBQVVFLFNBQVMsQ0FBVCxJQUFjQSxTQUFTLENBQVQsQ0FBZCxHQUE0QkEsU0FBUyxDQUFULElBQWNBLFNBQVMsQ0FBVCxDQUFwRCxDQUFqQjtBQUNBLFlBQU1FLGFBQWEsQ0FBQ04sTUFBTSxDQUFOLElBQVdJLFNBQVMsQ0FBVCxDQUFYLEdBQXlCSixNQUFNLENBQU4sSUFBV0ksU0FBUyxDQUFULENBQXJDLEtBQXFESCxRQUFRSSxRQUE3RCxDQUFuQjs7QUFFQSxZQUFJQyxhQUFhVixJQUFiLElBQXFCUyxXQUFXUixJQUFwQyxFQUEwQztBQUN4Q0YsaUJBQU8zQixJQUFQLENBQVk4QixLQUFaO0FBQ0FBLGtCQUFRQyxLQUFSO0FBQ0FBLGtCQUFRSSxRQUFSO0FBQ0FILGtCQUFRLENBQUNELE1BQU0sQ0FBTixJQUFXRCxNQUFNLENBQU4sQ0FBWixFQUFzQkMsTUFBTSxDQUFOLElBQVdELE1BQU0sQ0FBTixDQUFqQyxDQUFSO0FBQ0FHLGtCQUFRNUIsS0FBSzZCLElBQUwsQ0FBVUYsTUFBTSxDQUFOLElBQVdBLE1BQU0sQ0FBTixDQUFYLEdBQXNCQSxNQUFNLENBQU4sSUFBV0EsTUFBTSxDQUFOLENBQTNDLENBQVI7QUFDRCxTQU5ELE1BTU87QUFDTEQsa0JBQVFJLFFBQVI7QUFDRDtBQUNGOztBQUVEUixhQUFPM0IsSUFBUCxDQUFZK0IsS0FBWjs7QUFFQSxhQUFPSixNQUFQO0FBQ0Q7QUF6VjBGLEdBQTdFLENBQWhCOztvQkE0VmU3RixPIiwiZmlsZSI6IlNpZ25hdHVyZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IHdpbiBmcm9tICdkb2pvL3dpbmRvdyc7XHJcbmltcG9ydCBmb3JtYXQgZnJvbSAnLi4vRm9ybWF0JztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi4vVmlldyc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdzaWduYXR1cmUnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuVmlld3MuU2lnbmF0dXJlXHJcbiAqIEBjbGFzc2Rlc2MgU2lnbmF0dXJlIFZpZXcgaXMgYSB2aWV3IHRhaWxvcmVkIHRvIHByZXNlbnQgYW4gSFRNTDUgY2FudmFzIHRoYXQgaGFzIHNpZ25hdHVyZS1yZWNvcmRpbmcgY2FwYWJpbGl0aWVzLlxyXG4gKiBJdCBnb2VzIGhhbmQtaW4taGFuZCB3aXRoIHtAbGluayBTaWduYXR1cmVGaWVsZCBTaWduYXR1cmVGaWVsZH1cclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRm9ybWF0XHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuVmlld3MuU2lnbmF0dXJlJywgW1ZpZXddLCAvKiogQGxlbmRzIGFyZ29zLlZpZXdzLlNpZ25hdHVyZSMgKi97XHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXIgaGVhZGVyXHJcbiAgICovXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgY2xlYXIgYnV0dG9uXHJcbiAgICovXHJcbiAgY2xlYXJDYW52YXNUZXh0OiByZXNvdXJjZS5jbGVhckNhbnZhc1RleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdW5kbyBidXR0b25cclxuICAgKi9cclxuICB1bmRvVGV4dDogcmVzb3VyY2UudW5kb1RleHQsXHJcblxyXG4gIC8vIFRlbXBsYXRlc1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gU2lnbmF0dXJlIHZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JTogJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cInBhbmVsIHslPSAkLmNscyAlfVwiPicsXHJcbiAgICAneyUhICQuY2FudmFzVGVtcGxhdGUgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXR0b25zXCI+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgZGF0YS1hY3Rpb249XCJfdW5kb1wiPjxzcGFuPnslOiAkLnVuZG9UZXh0ICV9PC9zcGFuPjwvYnV0dG9uPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cImJ1dHRvblwiIGRhdGEtYWN0aW9uPVwiY2xlYXJWYWx1ZVwiPjxzcGFuPnslOiAkLmNsZWFyQ2FudmFzVGV4dCAlfTwvc3Bhbj48L2J1dHRvbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPGRpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBjYW52YXMgd2l0aCBhIHNldCB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICovXHJcbiAgY2FudmFzVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGNhbnZhcyBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwic2lnbmF0dXJlTm9kZVwiIHdpZHRoPVwieyU6ICQuY2FudmFzTm9kZVdpZHRoICV9XCIgaGVpZ2h0PVwieyU6ICQuY2FudmFzTm9kZUhlaWdodCAlfVwiIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbm1vdXNlZG93bjpfcGVuRG93bixvbm1vdXNlbW92ZTpfcGVuTW92ZSxvbm1vdXNldXA6X3BlblVwLG9udG91Y2hzdGFydDpfcGVuRG93bixvbnRvdWNobW92ZTpfcGVuTW92ZSxvbnRvdWNoZW5kOl9wZW5VcFwiPjwvY2FudmFzPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBUaGUgZG9qby1hdHRhY2gtcG9pbnQgZm9yIHRoZSBjYW52YXMgZWxlbWVudFxyXG4gICAqL1xyXG4gIHNpZ25hdHVyZU5vZGU6IG51bGwsXHJcblxyXG4gIC8vIFZpZXcgUHJvcGVydGllc1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB1bmlxdWUgdmlldyBpZFxyXG4gICAqL1xyXG4gIGlkOiAnc2lnbmF0dXJlX2VkaXQnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFnIHRoYXQgbWF5IGJlIHVzZWQgdG8gY29udHJvbCBpZiB0aGUgdmlldyBpcyBzaG93biBpbiBjb25maWd1cmFibGUgbGlzdHNcclxuICAgKi9cclxuICBleHBvc2U6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyW11bXX1cclxuICAgKiBTdG9yZXMgc2VyaWVzIG9mIHgseSBjb29yZGluYXRlcyBpbiB0aGUgZm9ybWF0IG9mOiBgW1swLDBdLFsxLDVdXWBcclxuICAgKi9cclxuICBzaWduYXR1cmU6IFtdLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyW11bXX1cclxuICAgKiBDb2xsZWN0aW9uIG9mIHRoZSB0b3VjaG1vdmUgcG9zaXRpb25zXHJcbiAgICovXHJcbiAgdHJhY2U6IFtdLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFN0b3JlcyB3aGVyZSB0aGUgbGFzdCBkcmF3biBwb2ludCB3YXNcclxuICAgKi9cclxuICBsYXN0cG9zOiB7XHJcbiAgICB4OiAtMSxcclxuICAgIHk6IC0xLFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7T2JqZWN0fVxyXG4gICAqIFN0b3JlcyB0aGUgcGFzc2VkIG9wdGlvbnMgZm9yOiBgc2NhbGVgLCBgbGluZVdpZHRoYCwgYHBlbkNvbG9yYCBhbmQgYGRyYXdDb2xvcmAuXHJcbiAgICovXHJcbiAgY29uZmlnOiB7XHJcbiAgICBzY2FsZTogMSxcclxuICAgIGxpbmVXaWR0aDogMyxcclxuICAgIHBlbkNvbG9yOiAnYmx1ZScsXHJcbiAgICBkcmF3Q29sb3I6ICdyZWQnLFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgZm9yIGRldGVybWluaW5nIGlmIHRoZSBwZW4gaXMgaW4gXCJkb3duXCIgc3RhdGUuXHJcbiAgICovXHJcbiAgaXNQZW5Eb3duOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgc3RvcmVkIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcyBub2RlXHJcbiAgICovXHJcbiAgY29udGV4dDogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcltdW119XHJcbiAgICogVXNlZCB0byB0ZW1wb3JhcmlseSBzdG9yZSB0aGUgc2lnbmF0dXJlXHJcbiAgICovXHJcbiAgYnVmZmVyOiBbXSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtOdW1iZXJ9XHJcbiAgICogU3RhcnRpbmcgZGVmYXVsdCB3aWR0aCBvZiBjYW52YXMsIHdpbGwgYmUgcmUtc2l6ZWQgd2hlbiB0aGUgdmlldyBpcyBzaG93bi5cclxuICAgKi9cclxuICBjYW52YXNOb2RlV2lkdGg6IDM2MCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtOdW1iZXJ9XHJcbiAgICogU3RhcnRpbmcgZGVmYXVsdCBoZWlnaHQgb2YgY2FudmFzLCB3aWxsIGJlIHJlLXNpemVkIHdoZW4gdGhlIHZpZXcgaXMgc2hvd24uXHJcbiAgICovXHJcbiAgY2FudmFzTm9kZUhlaWdodDogMTIwLFxyXG5cclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5saW5lV2lkdGgpIHtcclxuICAgICAgdGhpcy5jb25maWcubGluZVdpZHRoID0gb3B0aW9ucy5saW5lV2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wZW5Db2xvcikge1xyXG4gICAgICB0aGlzLmNvbmZpZy5wZW5Db2xvciA9IG9wdGlvbnMucGVuQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kcmF3Q29sb3IpIHtcclxuICAgICAgdGhpcy5jb25maWcuZHJhd0NvbG9yID0gb3B0aW9ucy5kcmF3Q29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zaWduYXR1cmUgPSAob3B0aW9ucyAmJiBvcHRpb25zLnNpZ25hdHVyZSkgPyBvcHRpb25zLnNpZ25hdHVyZSA6IFtdO1xyXG5cclxuICAgIHRoaXMuX3NpemVDYW52YXMoKTtcclxuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuc2lnbmF0dXJlTm9kZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xyXG5cclxuICAgIHRoaXMucmVkcmF3KHRoaXMuc2lnbmF0dXJlLCB0aGlzLnNpZ25hdHVyZU5vZGUsIHRoaXMuY29uZmlnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIG9wdGltaXplZCBzaWduYXR1cmUgYXJyYXkgYXMgYSBKU09OIHN0cmluZ1xyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRWYWx1ZXM6IGZ1bmN0aW9uIGdldFZhbHVlcygpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9wdGltaXplU2lnbmF0dXJlKCkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSBhbmQgZHJhd3MgaXQuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbCBKU09OLXN0cmluZ2lmaWVkIE51bWJlcltdW10gb2YgeC15IGNvb3JkaW5hdGVzXHJcbiAgICogQHBhcmFtIGluaXRpYWwgVW51c2VkLlxyXG4gICAqL1xyXG4gIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWwvKiAsIGluaXRpYWwqLykge1xyXG4gICAgdGhpcy5zaWduYXR1cmUgPSB2YWwgPyBKU09OLnBhcnNlKHZhbCkgOiBbXTtcclxuICAgIHRoaXMucmVkcmF3KHRoaXMuc2lnbmF0dXJlLCB0aGlzLnNpZ25hdHVyZU5vZGUsIHRoaXMuY29uZmlnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgdmFsdWUgYW5kIHNhdmVzIHRoZSBidWZmZXJcclxuICAgKi9cclxuICBjbGVhclZhbHVlOiBmdW5jdGlvbiBjbGVhclZhbHVlKCkge1xyXG4gICAgdGhpcy5idWZmZXIgPSB0aGlzLnNpZ25hdHVyZTtcclxuICAgIHRoaXMuc2V0VmFsdWUoJycsIHRydWUpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBwb2ludGVyIHBpeGVsIGNvb3JkaW5hdGVzIFt4LHldIHJlbGF0aXZlIHRvIGNhbnZhcyBvYmplY3RcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXHJcbiAgICogQHJldHVybiBOdW1iZXJbXVxyXG4gICAqL1xyXG4gIF9nZXRDb29yZHM6IGZ1bmN0aW9uIF9nZXRDb29yZHMoZSkge1xyXG4gICAgY29uc3Qgb2Zmc2V0ID0gJCh0aGlzLnNpZ25hdHVyZU5vZGUpLnBvc2l0aW9uKCk7XHJcbiAgICByZXR1cm4gZS50b3VjaGVzID8gW1xyXG4gICAgICBlLnRvdWNoZXNbMF0ucGFnZVggLSBvZmZzZXQubGVmdCxcclxuICAgICAgZS50b3VjaGVzWzBdLnBhZ2VZIC0gb2Zmc2V0LnRvcCxcclxuICAgIF0gOiBbXHJcbiAgICAgIGUuY2xpZW50WCAtIG9mZnNldC5sZWZ0LFxyXG4gICAgICBlLmNsaWVudFkgLSBvZmZzZXQudG9wLFxyXG4gICAgXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGBvbnRvdWNoc3RhcnRgLCByZWNvcmRzIHRoZSBzdGFydGluZyBwb2ludCBhbmQgc2V0cyB0aGUgc3RhdGUgdG8gZG93blxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcclxuICAgKi9cclxuICBfcGVuRG93bjogZnVuY3Rpb24gX3BlbkRvd24oZSkge1xyXG4gICAgdGhpcy5pc1BlbkRvd24gPSB0cnVlO1xyXG4gICAgdGhpcy5sYXN0cG9zID0gdGhpcy5fZ2V0Q29vcmRzKGUpO1xyXG4gICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aDtcclxuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuY29uZmlnLmRyYXdDb2xvcjtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGBvbnRvdWNobW92ZWAsIGRyYXdzIHRoZSBsaW5lcyBiZXR3ZWVuIHRoZSBsYXN0IHBvc3RpdGlvbiBhbmQgY3VycmVudCBwb3NpdGlvblxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGVcclxuICAgKi9cclxuICBfcGVuTW92ZTogZnVuY3Rpb24gX3Blbk1vdmUoZSkge1xyXG4gICAgaWYgKCF0aGlzLmlzUGVuRG93bikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb3MgPSB0aGlzLl9nZXRDb29yZHMoZSk7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMubGFzdHBvc1swXSwgdGhpcy5sYXN0cG9zWzFdKTtcclxuICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5wb3NbMF0sIHRoaXMucG9zWzFdKTtcclxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRoaXMubGFzdHBvcyA9IHRoaXMucG9zO1xyXG4gICAgdGhpcy50cmFjZS5wdXNoKHRoaXMucG9zKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGBvbnRvdWNoZW5kYCwgc2F2ZXMgdGhlIGZpbmFsIHNpZ25hdHVyZSBhbmQgcmVkcmF3cyB0aGUgY2FudmFzXHJcbiAgICogQHBhcmFtIGVcclxuICAgKi9cclxuICBfcGVuVXA6IGZ1bmN0aW9uIF9wZW5VcChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLmlzUGVuRG93biA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMudHJhY2UubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2lnbmF0dXJlLnB1c2godGhpcy50cmFjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmFjZSA9IFtdO1xyXG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5jb25maWcucGVuQ29sb3I7XHJcbiAgICB0aGlzLnJlZHJhdyh0aGlzLnNpZ25hdHVyZSwgdGhpcy5zaWduYXR1cmVOb2RlLCB0aGlzLmNvbmZpZyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBVbmRvZXMgdGhlIGxhc3QgcGVuIGRvd24tdG8tcGVuIHVwIGxpbmUgYnkgdXNpbmcgdGhlIGJ1ZmZlclxyXG4gICAqL1xyXG4gIF91bmRvOiBmdW5jdGlvbiBfdW5kbygpIHtcclxuICAgIGlmICh0aGlzLnNpZ25hdHVyZS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5idWZmZXIgPSB0aGlzLnNpZ25hdHVyZS5wb3AoKTtcclxuICAgICAgaWYgKCF0aGlzLnNpZ25hdHVyZS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmJ1ZmZlciA9IFt0aGlzLmJ1ZmZlcl07XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5idWZmZXIubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2lnbmF0dXJlID0gdGhpcy5idWZmZXI7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZHJhdyh0aGlzLnNpZ25hdHVyZSwgdGhpcy5zaWduYXR1cmVOb2RlLCB0aGlzLmNvbmZpZyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjYW52YXMgd2lkdGgvaGVpZ2h0IGJhc2VkIG9uIHRoZSBzaXplIG9mIHRoZSB3aW5kb3cvc2NyZWVuXHJcbiAgICovXHJcbiAgX3NpemVDYW52YXM6IGZ1bmN0aW9uIF9zaXplQ2FudmFzKCkge1xyXG4gICAgdGhpcy5jYW52YXNOb2RlV2lkdGggPSBNYXRoLmZsb29yKHdpbi5nZXRCb3goKS53ICogMC45Mik7XHJcblxyXG4gICAgdGhpcy5jYW52YXNOb2RlSGVpZ2h0ID0gTWF0aC5taW4oXHJcbiAgICAgIE1hdGguZmxvb3IodGhpcy5jYW52YXNOb2RlV2lkdGggKiAwLjUpLFxyXG4gICAgICB3aW4uZ2V0Qm94KCkuaCAtICQoJy50b29sYmFyJykuZ2V0KDApLm9mZnNldEhlaWdodFxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnNpZ25hdHVyZU5vZGUud2lkdGggPSB0aGlzLmNhbnZhc05vZGVXaWR0aDtcclxuICAgIHRoaXMuc2lnbmF0dXJlTm9kZS5oZWlnaHQgPSB0aGlzLmNhbnZhc05vZGVIZWlnaHQ7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxscyB7QGxpbmsgI19zaXplQ2FudmFzIF9zaXplQ2FudmFzfSB0byBzaXplIHRoZSBjYW52YXMgaXRzZWxmIHRoZW4gaXQgYWxzbyBzY2FsZXMgdGhlXHJcbiAgICogZHJhd24gc2lnbmF0dXJlIGFjY29yZGluZ2x5IHRvIHRoZSByYXRpby5cclxuICAgKiBAcGFyYW0gZVxyXG4gICAqL1xyXG4gIG9uUmVzaXplOiBmdW5jdGlvbiBvblJlc2l6ZSgvKiBlKi8pIHtcclxuICAgIGNvbnN0IG9sZFdpZHRoID0gdGhpcy5jYW52YXNOb2RlV2lkdGg7XHJcbiAgICBjb25zdCBvbGRIZWlnaHQgPSB0aGlzLmNhbnZhc05vZGVIZWlnaHQ7XHJcbiAgICB0aGlzLl9zaXplQ2FudmFzKCk7XHJcblxyXG4gICAgY29uc3QgbmV3U2NhbGUgPSBNYXRoLm1pbihcclxuICAgICAgdGhpcy5jYW52YXNOb2RlV2lkdGggLyBvbGRXaWR0aCxcclxuICAgICAgdGhpcy5jYW52YXNOb2RlSGVpZ2h0IC8gb2xkSGVpZ2h0XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuc2lnbmF0dXJlID0gdGhpcy5yZXNjYWxlKG5ld1NjYWxlKTtcclxuICAgIHRoaXMucmVkcmF3KHRoaXMuc2lnbmF0dXJlLCB0aGlzLnNpZ25hdHVyZU5vZGUsIHRoaXMuY29uZmlnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHtAbGluayBmb3JtYXQjY2FudmFzRHJhdyBmb3JtYXQuY2FudmFzRHJhd30gd2hpY2ggY2xlYXJzIGFuZCBkcmF3cyB0aGUgdmVjdG9yc1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyW11bXX0gdmVjdG9yIFRoZSB4LXkgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50c1xyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNhbnZhcyBDYW52YXMgdG8gYmUgZHJhd24gdG9cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIHRvIGJlIHBhc3NlZCB0byBjYW52YXNEcmF3XHJcbiAgICovXHJcbiAgcmVkcmF3OiBmdW5jdGlvbiByZWRyYXcodmVjdG9yLCBjYW52YXMsIG9wdGlvbnMpIHtcclxuICAgIGZvcm1hdC5jYW52YXNEcmF3KHZlY3RvciwgY2FudmFzLCBvcHRpb25zKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIExvb3BzIHRocm91Z2ggdGhlIHZlY3RvciBwb2ludHMgaW4gdGhlIHNpZ25hdHVyZSBhbmQgYXBwbGllcyB0aGUgZ2l2ZW4gc2NhbGUgcmF0aW9cclxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgUmF0aW8gaW4gd2hpY2ggdG8gbXVsdGlwbHkgdGhlIHZlY3RvciBwb2ludFxyXG4gICAqIEByZXR1cm4ge051bWJlcltdW119IFJlc2NhbGVkIHNpZ25hdHVyZSBhcnJheVxyXG4gICAqL1xyXG4gIHJlc2NhbGU6IGZ1bmN0aW9uIHJlc2NhbGUoc2NhbGUpIHtcclxuICAgIGNvbnN0IHJlc2NhbGVkID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2lnbmF0dXJlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHJlc2NhbGVkLnB1c2goW10pO1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuc2lnbmF0dXJlW2ldLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgcmVzY2FsZWRbaV0ucHVzaChbXHJcbiAgICAgICAgICB0aGlzLnNpZ25hdHVyZVtpXVtqXVswXSAqIHNjYWxlLFxyXG4gICAgICAgICAgdGhpcy5zaWduYXR1cmVbaV1bal1bMV0gKiBzY2FsZSxcclxuICAgICAgICBdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc2NhbGVkO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgdGhlIHNpZ25hdHVyZSBjYWxsaW5nIG9wdGltaXplIG9uIGVhY2ggcGVuIGRvd24tdG8tcGVuIHVwIHNlZ21lbnRcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJbXVtdfSBPcHRpbWl6ZWQgc2lnbmF0dXJlXHJcbiAgICovXHJcbiAgb3B0aW1pemVTaWduYXR1cmU6IGZ1bmN0aW9uIG9wdGltaXplU2lnbmF0dXJlKCkge1xyXG4gICAgY29uc3Qgb3B0aW1pemVkID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpZ25hdHVyZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBvcHRpbWl6ZWQucHVzaCh0aGlzLm9wdGltaXplKHRoaXMuc2lnbmF0dXJlW2ldKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wdGltaXplZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEF0dGVtcHRzIHRvIHJlbW92ZSBwb2ludHMgYnkgY29tcGFyaW5nIHRoZSB4L3kgdmFyaWF0aW9uIGJldHdlZW4gdGhlIHR3byBhbmRcclxuICAgKiByZW1vdmluZyBwb2ludHMgd2l0aGluIGEgY2VydGFpbiB0aHJlc2hvbGQuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJbXX0gdmVjdG9yIEFycmF5IG9mIHgseSBjb29yZGluYXRlcyB0byBvcHRpbWl6ZVxyXG4gICAqIEByZXR1cm4ge051bWJlcltdfSBPcHRpbWl6ZWQgYXJyYXlcclxuICAgKi9cclxuICBvcHRpbWl6ZTogZnVuY3Rpb24gb3B0aW1pemUodmVjdG9yKSB7XHJcbiAgICBpZiAodmVjdG9yLmxlbmd0aCA8IDIpIHtcclxuICAgICAgcmV0dXJuIHZlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIGNvbnN0IG1pbkEgPSAwLjk1O1xyXG4gICAgY29uc3QgbWF4TCA9IDE1LjA7IC8vIDE1LjAsIDEwLjAgd29ya3Mgd2VsbFxyXG4gICAgbGV0IHJvb3RQID0gdmVjdG9yWzBdO1xyXG4gICAgbGV0IGxhc3RQID0gdmVjdG9yWzFdO1xyXG4gICAgbGV0IHJvb3RWID0gW2xhc3RQWzBdIC0gcm9vdFBbMF0sIGxhc3RQWzFdIC0gcm9vdFBbMV1dO1xyXG4gICAgbGV0IHJvb3RMID0gTWF0aC5zcXJ0KHJvb3RWWzBdICogcm9vdFZbMF0gKyByb290VlsxXSAqIHJvb3RWWzFdKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMjsgaSA8IHZlY3Rvci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBjdXJyZW50UCA9IHZlY3RvcltpXTtcclxuICAgICAgY29uc3QgY3VycmVudFYgPSBbY3VycmVudFBbMF0gLSByb290UFswXSwgY3VycmVudFBbMV0gLSByb290UFsxXV07XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRMID0gTWF0aC5zcXJ0KGN1cnJlbnRWWzBdICogY3VycmVudFZbMF0gKyBjdXJyZW50VlsxXSAqIGN1cnJlbnRWWzFdKTtcclxuICAgICAgY29uc3QgZG90UHJvZHVjdCA9IChyb290VlswXSAqIGN1cnJlbnRWWzBdICsgcm9vdFZbMV0gKiBjdXJyZW50VlsxXSkgLyAocm9vdEwgKiBjdXJyZW50TCk7XHJcblxyXG4gICAgICBpZiAoZG90UHJvZHVjdCA8IG1pbkEgfHwgY3VycmVudEwgPiBtYXhMKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2gocm9vdFApO1xyXG4gICAgICAgIHJvb3RQID0gbGFzdFA7XHJcbiAgICAgICAgbGFzdFAgPSBjdXJyZW50UDtcclxuICAgICAgICByb290ViA9IFtsYXN0UFswXSAtIHJvb3RQWzBdLCBsYXN0UFsxXSAtIHJvb3RQWzFdXTtcclxuICAgICAgICByb290TCA9IE1hdGguc3FydChyb290VlswXSAqIHJvb3RWWzBdICsgcm9vdFZbMV0gKiByb290VlsxXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGFzdFAgPSBjdXJyZW50UDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc3VsdC5wdXNoKGxhc3RQKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19