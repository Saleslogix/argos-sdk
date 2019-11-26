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
      this.inherited(show, arguments);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9TaWduYXR1cmUuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwidGl0bGVUZXh0IiwiY2xlYXJDYW52YXNUZXh0IiwidW5kb1RleHQiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY2FudmFzVGVtcGxhdGUiLCJzaWduYXR1cmVOb2RlIiwiaWQiLCJleHBvc2UiLCJzaWduYXR1cmUiLCJ0cmFjZSIsImxhc3Rwb3MiLCJ4IiwieSIsImNvbmZpZyIsInNjYWxlIiwibGluZVdpZHRoIiwicGVuQ29sb3IiLCJkcmF3Q29sb3IiLCJpc1BlbkRvd24iLCJjb250ZXh0IiwiYnVmZmVyIiwiY2FudmFzTm9kZVdpZHRoIiwiY2FudmFzTm9kZUhlaWdodCIsInNob3ciLCJvcHRpb25zIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX3NpemVDYW52YXMiLCJnZXRDb250ZXh0IiwiJCIsIndpbmRvdyIsIm9uIiwib25SZXNpemUiLCJiaW5kIiwicmVkcmF3IiwiZ2V0VmFsdWVzIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9wdGltaXplU2lnbmF0dXJlIiwic2V0VmFsdWUiLCJ2YWwiLCJwYXJzZSIsImNsZWFyVmFsdWUiLCJfZ2V0Q29vcmRzIiwiZSIsIm9mZnNldCIsInBvc2l0aW9uIiwidG91Y2hlcyIsInBhZ2VYIiwibGVmdCIsInBhZ2VZIiwidG9wIiwiY2xpZW50WCIsImNsaWVudFkiLCJfcGVuRG93biIsInN0cm9rZVN0eWxlIiwicHJldmVudERlZmF1bHQiLCJfcGVuTW92ZSIsInBvcyIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImxpbmVUbyIsImNsb3NlUGF0aCIsInN0cm9rZSIsInB1c2giLCJfcGVuVXAiLCJsZW5ndGgiLCJfdW5kbyIsInBvcCIsIk1hdGgiLCJmbG9vciIsImdldEJveCIsInciLCJtaW4iLCJoIiwiZ2V0Iiwib2Zmc2V0SGVpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJvbGRXaWR0aCIsIm9sZEhlaWdodCIsIm5ld1NjYWxlIiwicmVzY2FsZSIsInZlY3RvciIsImNhbnZhcyIsImNhbnZhc0RyYXciLCJyZXNjYWxlZCIsImkiLCJqIiwib3B0aW1pemVkIiwib3B0aW1pemUiLCJyZXN1bHQiLCJtaW5BIiwibWF4TCIsInJvb3RQIiwibGFzdFAiLCJyb290ViIsInJvb3RMIiwic3FydCIsImN1cnJlbnRQIiwiY3VycmVudFYiLCJjdXJyZW50TCIsImRvdFByb2R1Y3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxNQUFNQSxXQUFXLG9CQUFZLFdBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7QUF4QkE7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxNQUFNQyxVQUFVLHVCQUFRLHVCQUFSLEVBQWlDLGdCQUFqQyxFQUF5QyxvQ0FBb0M7QUFDM0Y7QUFDQTs7OztBQUlBQyxlQUFXRixTQUFTRSxTQU51RTtBQU8zRjs7OztBQUlBQyxxQkFBaUJILFNBQVNHLGVBWGlFO0FBWTNGOzs7O0FBSUFDLGNBQVVKLFNBQVNJLFFBaEJ3RTs7QUFrQjNGO0FBQ0E7Ozs7Ozs7QUFPQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixtRkFEMkIsRUFFM0IseUJBRjJCLEVBRzNCLHVCQUgyQixFQUkzQixvRkFKMkIsRUFLM0IsZ0dBTDJCLEVBTTNCLFFBTjJCLEVBTzNCLE9BUDJCLENBQWIsQ0ExQjJFO0FBbUMzRjs7OztBQUlBQyxvQkFBZ0IsSUFBSUQsUUFBSixDQUFhLENBQzNCLCtRQUQyQixDQUFiLENBdkMyRTtBQTBDM0Y7Ozs7QUFJQUUsbUJBQWUsSUE5QzRFOztBQWdEM0Y7QUFDQTs7OztBQUlBQyxRQUFJLGdCQXJEdUY7QUFzRDNGOzs7O0FBSUFDLFlBQVEsS0ExRG1GO0FBMkQzRjs7OztBQUlBQyxlQUFXLEVBL0RnRjtBQWdFM0Y7Ozs7QUFJQUMsV0FBTyxFQXBFb0Y7QUFxRTNGOzs7O0FBSUFDLGFBQVM7QUFDUEMsU0FBRyxDQUFDLENBREc7QUFFUEMsU0FBRyxDQUFDO0FBRkcsS0F6RWtG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QUE3RSxDQUFoQjs7b0JBNFZlN0YsTyIsImZpbGUiOiJTaWduYXR1cmUuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCB3aW4gZnJvbSAnZG9qby93aW5kb3cnO1xyXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4uL0Zvcm1hdCc7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4uL1ZpZXcnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnc2lnbmF0dXJlJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlZpZXdzLlNpZ25hdHVyZVxyXG4gKiBAY2xhc3NkZXNjIFNpZ25hdHVyZSBWaWV3IGlzIGEgdmlldyB0YWlsb3JlZCB0byBwcmVzZW50IGFuIEhUTUw1IGNhbnZhcyB0aGF0IGhhcyBzaWduYXR1cmUtcmVjb3JkaW5nIGNhcGFiaWxpdGllcy5cclxuICogSXQgZ29lcyBoYW5kLWluLWhhbmQgd2l0aCB7QGxpbmsgU2lnbmF0dXJlRmllbGQgU2lnbmF0dXJlRmllbGR9XHJcbiAqIEBleHRlbmRzIGFyZ29zLlZpZXdcclxuICogQHJlcXVpcmVzIGFyZ29zLkZvcm1hdFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlZpZXdzLlNpZ25hdHVyZScsIFtWaWV3XSwgLyoqIEBsZW5kcyBhcmdvcy5WaWV3cy5TaWduYXR1cmUjICove1xyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHRvcCB0b29sYmFyIGhlYWRlclxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIGNsZWFyIGJ1dHRvblxyXG4gICAqL1xyXG4gIGNsZWFyQ2FudmFzVGV4dDogcmVzb3VyY2UuY2xlYXJDYW52YXNUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHVuZG8gYnV0dG9uXHJcbiAgICovXHJcbiAgdW5kb1RleHQ6IHJlc291cmNlLnVuZG9UZXh0LFxyXG5cclxuICAvLyBUZW1wbGF0ZXNcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IFNpZ25hdHVyZSB2aWV3IGluc3RhbmNlXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBkYXRhLXRpdGxlPVwieyU6ICQudGl0bGVUZXh0ICV9XCIgY2xhc3M9XCJwYW5lbCB7JT0gJC5jbHMgJX1cIj4nLFxyXG4gICAgJ3slISAkLmNhbnZhc1RlbXBsYXRlICV9JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cImJ1dHRvblwiIGRhdGEtYWN0aW9uPVwiX3VuZG9cIj48c3Bhbj57JTogJC51bmRvVGV4dCAlfTwvc3Bhbj48L2J1dHRvbj4nLFxyXG4gICAgJzxidXR0b24gY2xhc3M9XCJidXR0b25cIiBkYXRhLWFjdGlvbj1cImNsZWFyVmFsdWVcIj48c3Bhbj57JTogJC5jbGVhckNhbnZhc1RleHQgJX08L3NwYW4+PC9idXR0b24+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxkaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgY2FudmFzIHdpdGggYSBzZXQgd2lkdGggYW5kIGhlaWdodFxyXG4gICAqL1xyXG4gIGNhbnZhc1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxjYW52YXMgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInNpZ25hdHVyZU5vZGVcIiB3aWR0aD1cInslOiAkLmNhbnZhc05vZGVXaWR0aCAlfVwiIGhlaWdodD1cInslOiAkLmNhbnZhc05vZGVIZWlnaHQgJX1cIiBkYXRhLWRvam8tYXR0YWNoLWV2ZW50PVwib25tb3VzZWRvd246X3BlbkRvd24sb25tb3VzZW1vdmU6X3Blbk1vdmUsb25tb3VzZXVwOl9wZW5VcCxvbnRvdWNoc3RhcnQ6X3BlbkRvd24sb250b3VjaG1vdmU6X3Blbk1vdmUsb250b3VjaGVuZDpfcGVuVXBcIj48L2NhbnZhcz4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9XHJcbiAgICogVGhlIGRvam8tYXR0YWNoLXBvaW50IGZvciB0aGUgY2FudmFzIGVsZW1lbnRcclxuICAgKi9cclxuICBzaWduYXR1cmVOb2RlOiBudWxsLFxyXG5cclxuICAvLyBWaWV3IFByb3BlcnRpZXNcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdW5pcXVlIHZpZXcgaWRcclxuICAgKi9cclxuICBpZDogJ3NpZ25hdHVyZV9lZGl0JyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZyB0aGF0IG1heSBiZSB1c2VkIHRvIGNvbnRyb2wgaWYgdGhlIHZpZXcgaXMgc2hvd24gaW4gY29uZmlndXJhYmxlIGxpc3RzXHJcbiAgICovXHJcbiAgZXhwb3NlOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcltdW119XHJcbiAgICogU3RvcmVzIHNlcmllcyBvZiB4LHkgY29vcmRpbmF0ZXMgaW4gdGhlIGZvcm1hdCBvZjogYFtbMCwwXSxbMSw1XV1gXHJcbiAgICovXHJcbiAgc2lnbmF0dXJlOiBbXSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcltdW119XHJcbiAgICogQ29sbGVjdGlvbiBvZiB0aGUgdG91Y2htb3ZlIHBvc2l0aW9uc1xyXG4gICAqL1xyXG4gIHRyYWNlOiBbXSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBTdG9yZXMgd2hlcmUgdGhlIGxhc3QgZHJhd24gcG9pbnQgd2FzXHJcbiAgICovXHJcbiAgbGFzdHBvczoge1xyXG4gICAgeDogLTEsXHJcbiAgICB5OiAtMSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge09iamVjdH1cclxuICAgKiBTdG9yZXMgdGhlIHBhc3NlZCBvcHRpb25zIGZvcjogYHNjYWxlYCwgYGxpbmVXaWR0aGAsIGBwZW5Db2xvcmAgYW5kIGBkcmF3Q29sb3JgLlxyXG4gICAqL1xyXG4gIGNvbmZpZzoge1xyXG4gICAgc2NhbGU6IDEsXHJcbiAgICBsaW5lV2lkdGg6IDMsXHJcbiAgICBwZW5Db2xvcjogJ2JsdWUnLFxyXG4gICAgZHJhd0NvbG9yOiAncmVkJyxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFnIGZvciBkZXRlcm1pbmluZyBpZiB0aGUgcGVuIGlzIGluIFwiZG93blwiIHN0YXRlLlxyXG4gICAqL1xyXG4gIGlzUGVuRG93bjogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHN0b3JlZCAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMgbm9kZVxyXG4gICAqL1xyXG4gIGNvbnRleHQ6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtOdW1iZXJbXVtdfVxyXG4gICAqIFVzZWQgdG8gdGVtcG9yYXJpbHkgc3RvcmUgdGhlIHNpZ25hdHVyZVxyXG4gICAqL1xyXG4gIGJ1ZmZlcjogW10sXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7TnVtYmVyfVxyXG4gICAqIFN0YXJ0aW5nIGRlZmF1bHQgd2lkdGggb2YgY2FudmFzLCB3aWxsIGJlIHJlLXNpemVkIHdoZW4gdGhlIHZpZXcgaXMgc2hvd24uXHJcbiAgICovXHJcbiAgY2FudmFzTm9kZVdpZHRoOiAzNjAsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7TnVtYmVyfVxyXG4gICAqIFN0YXJ0aW5nIGRlZmF1bHQgaGVpZ2h0IG9mIGNhbnZhcywgd2lsbCBiZSByZS1zaXplZCB3aGVuIHRoZSB2aWV3IGlzIHNob3duLlxyXG4gICAqL1xyXG4gIGNhbnZhc05vZGVIZWlnaHQ6IDEyMCxcclxuXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhvcHRpb25zKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChzaG93LCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGluZVdpZHRoKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmxpbmVXaWR0aCA9IG9wdGlvbnMubGluZVdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucGVuQ29sb3IpIHtcclxuICAgICAgdGhpcy5jb25maWcucGVuQ29sb3IgPSBvcHRpb25zLnBlbkNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZHJhd0NvbG9yKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmRyYXdDb2xvciA9IG9wdGlvbnMuZHJhd0NvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2lnbmF0dXJlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5zaWduYXR1cmUpID8gb3B0aW9ucy5zaWduYXR1cmUgOiBbXTtcclxuXHJcbiAgICB0aGlzLl9zaXplQ2FudmFzKCk7XHJcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLnNpZ25hdHVyZU5vZGUuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLnJlZHJhdyh0aGlzLnNpZ25hdHVyZSwgdGhpcy5zaWduYXR1cmVOb2RlLCB0aGlzLmNvbmZpZyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBvcHRpbWl6ZWQgc2lnbmF0dXJlIGFycmF5IGFzIGEgSlNPTiBzdHJpbmdcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzOiBmdW5jdGlvbiBnZXRWYWx1ZXMoKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5vcHRpbWl6ZVNpZ25hdHVyZSgpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIGRyYXdzIGl0LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWwgSlNPTi1zdHJpbmdpZmllZCBOdW1iZXJbXVtdIG9mIHgteSBjb29yZGluYXRlc1xyXG4gICAqIEBwYXJhbSBpbml0aWFsIFVudXNlZC5cclxuICAgKi9cclxuICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodmFsLyogLCBpbml0aWFsKi8pIHtcclxuICAgIHRoaXMuc2lnbmF0dXJlID0gdmFsID8gSlNPTi5wYXJzZSh2YWwpIDogW107XHJcbiAgICB0aGlzLnJlZHJhdyh0aGlzLnNpZ25hdHVyZSwgdGhpcy5zaWduYXR1cmVOb2RlLCB0aGlzLmNvbmZpZyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDbGVhcnMgdGhlIHZhbHVlIGFuZCBzYXZlcyB0aGUgYnVmZmVyXHJcbiAgICovXHJcbiAgY2xlYXJWYWx1ZTogZnVuY3Rpb24gY2xlYXJWYWx1ZSgpIHtcclxuICAgIHRoaXMuYnVmZmVyID0gdGhpcy5zaWduYXR1cmU7XHJcbiAgICB0aGlzLnNldFZhbHVlKCcnLCB0cnVlKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgcG9pbnRlciBwaXhlbCBjb29yZGluYXRlcyBbeCx5XSByZWxhdGl2ZSB0byBjYW52YXMgb2JqZWN0XHJcbiAgICogQHBhcmFtIHtFdmVudH0gZVxyXG4gICAqIEByZXR1cm4gTnVtYmVyW11cclxuICAgKi9cclxuICBfZ2V0Q29vcmRzOiBmdW5jdGlvbiBfZ2V0Q29vcmRzKGUpIHtcclxuICAgIGNvbnN0IG9mZnNldCA9ICQodGhpcy5zaWduYXR1cmVOb2RlKS5wb3NpdGlvbigpO1xyXG4gICAgcmV0dXJuIGUudG91Y2hlcyA/IFtcclxuICAgICAgZS50b3VjaGVzWzBdLnBhZ2VYIC0gb2Zmc2V0LmxlZnQsXHJcbiAgICAgIGUudG91Y2hlc1swXS5wYWdlWSAtIG9mZnNldC50b3AsXHJcbiAgICBdIDogW1xyXG4gICAgICBlLmNsaWVudFggLSBvZmZzZXQubGVmdCxcclxuICAgICAgZS5jbGllbnRZIC0gb2Zmc2V0LnRvcCxcclxuICAgIF07XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBgb250b3VjaHN0YXJ0YCwgcmVjb3JkcyB0aGUgc3RhcnRpbmcgcG9pbnQgYW5kIHNldHMgdGhlIHN0YXRlIHRvIGRvd25cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXHJcbiAgICovXHJcbiAgX3BlbkRvd246IGZ1bmN0aW9uIF9wZW5Eb3duKGUpIHtcclxuICAgIHRoaXMuaXNQZW5Eb3duID0gdHJ1ZTtcclxuICAgIHRoaXMubGFzdHBvcyA9IHRoaXMuX2dldENvb3JkcyhlKTtcclxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLmNvbmZpZy5saW5lV2lkdGg7XHJcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbmZpZy5kcmF3Q29sb3I7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBgb250b3VjaG1vdmVgLCBkcmF3cyB0aGUgbGluZXMgYmV0d2VlbiB0aGUgbGFzdCBwb3N0aXRpb24gYW5kIGN1cnJlbnQgcG9zaXRpb25cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBlXHJcbiAgICovXHJcbiAgX3Blbk1vdmU6IGZ1bmN0aW9uIF9wZW5Nb3ZlKGUpIHtcclxuICAgIGlmICghdGhpcy5pc1BlbkRvd24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucG9zID0gdGhpcy5fZ2V0Q29vcmRzKGUpO1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLmxhc3Rwb3NbMF0sIHRoaXMubGFzdHBvc1sxXSk7XHJcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMucG9zWzBdLCB0aGlzLnBvc1sxXSk7XHJcbiAgICB0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLmxhc3Rwb3MgPSB0aGlzLnBvcztcclxuICAgIHRoaXMudHJhY2UucHVzaCh0aGlzLnBvcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBgb250b3VjaGVuZGAsIHNhdmVzIHRoZSBmaW5hbCBzaWduYXR1cmUgYW5kIHJlZHJhd3MgdGhlIGNhbnZhc1xyXG4gICAqIEBwYXJhbSBlXHJcbiAgICovXHJcbiAgX3BlblVwOiBmdW5jdGlvbiBfcGVuVXAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdGhpcy5pc1BlbkRvd24gPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLnRyYWNlLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNpZ25hdHVyZS5wdXNoKHRoaXMudHJhY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudHJhY2UgPSBbXTtcclxuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuY29uZmlnLnBlbkNvbG9yO1xyXG4gICAgdGhpcy5yZWRyYXcodGhpcy5zaWduYXR1cmUsIHRoaXMuc2lnbmF0dXJlTm9kZSwgdGhpcy5jb25maWcpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVW5kb2VzIHRoZSBsYXN0IHBlbiBkb3duLXRvLXBlbiB1cCBsaW5lIGJ5IHVzaW5nIHRoZSBidWZmZXJcclxuICAgKi9cclxuICBfdW5kbzogZnVuY3Rpb24gX3VuZG8oKSB7XHJcbiAgICBpZiAodGhpcy5zaWduYXR1cmUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuYnVmZmVyID0gdGhpcy5zaWduYXR1cmUucG9wKCk7XHJcbiAgICAgIGlmICghdGhpcy5zaWduYXR1cmUubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5idWZmZXIgPSBbdGhpcy5idWZmZXJdO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuYnVmZmVyLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNpZ25hdHVyZSA9IHRoaXMuYnVmZmVyO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWRyYXcodGhpcy5zaWduYXR1cmUsIHRoaXMuc2lnbmF0dXJlTm9kZSwgdGhpcy5jb25maWcpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY2FudmFzIHdpZHRoL2hlaWdodCBiYXNlZCBvbiB0aGUgc2l6ZSBvZiB0aGUgd2luZG93L3NjcmVlblxyXG4gICAqL1xyXG4gIF9zaXplQ2FudmFzOiBmdW5jdGlvbiBfc2l6ZUNhbnZhcygpIHtcclxuICAgIHRoaXMuY2FudmFzTm9kZVdpZHRoID0gTWF0aC5mbG9vcih3aW4uZ2V0Qm94KCkudyAqIDAuOTIpO1xyXG5cclxuICAgIHRoaXMuY2FudmFzTm9kZUhlaWdodCA9IE1hdGgubWluKFxyXG4gICAgICBNYXRoLmZsb29yKHRoaXMuY2FudmFzTm9kZVdpZHRoICogMC41KSxcclxuICAgICAgd2luLmdldEJveCgpLmggLSAkKCcudG9vbGJhcicpLmdldCgwKS5vZmZzZXRIZWlnaHRcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5zaWduYXR1cmVOb2RlLndpZHRoID0gdGhpcy5jYW52YXNOb2RlV2lkdGg7XHJcbiAgICB0aGlzLnNpZ25hdHVyZU5vZGUuaGVpZ2h0ID0gdGhpcy5jYW52YXNOb2RlSGVpZ2h0O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbHMge0BsaW5rICNfc2l6ZUNhbnZhcyBfc2l6ZUNhbnZhc30gdG8gc2l6ZSB0aGUgY2FudmFzIGl0c2VsZiB0aGVuIGl0IGFsc28gc2NhbGVzIHRoZVxyXG4gICAqIGRyYXduIHNpZ25hdHVyZSBhY2NvcmRpbmdseSB0byB0aGUgcmF0aW8uXHJcbiAgICogQHBhcmFtIGVcclxuICAgKi9cclxuICBvblJlc2l6ZTogZnVuY3Rpb24gb25SZXNpemUoLyogZSovKSB7XHJcbiAgICBjb25zdCBvbGRXaWR0aCA9IHRoaXMuY2FudmFzTm9kZVdpZHRoO1xyXG4gICAgY29uc3Qgb2xkSGVpZ2h0ID0gdGhpcy5jYW52YXNOb2RlSGVpZ2h0O1xyXG4gICAgdGhpcy5fc2l6ZUNhbnZhcygpO1xyXG5cclxuICAgIGNvbnN0IG5ld1NjYWxlID0gTWF0aC5taW4oXHJcbiAgICAgIHRoaXMuY2FudmFzTm9kZVdpZHRoIC8gb2xkV2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzTm9kZUhlaWdodCAvIG9sZEhlaWdodFxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnNpZ25hdHVyZSA9IHRoaXMucmVzY2FsZShuZXdTY2FsZSk7XHJcbiAgICB0aGlzLnJlZHJhdyh0aGlzLnNpZ25hdHVyZSwgdGhpcy5zaWduYXR1cmVOb2RlLCB0aGlzLmNvbmZpZyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxscyB7QGxpbmsgZm9ybWF0I2NhbnZhc0RyYXcgZm9ybWF0LmNhbnZhc0RyYXd9IHdoaWNoIGNsZWFycyBhbmQgZHJhd3MgdGhlIHZlY3RvcnNcclxuICAgKiBAcGFyYW0ge051bWJlcltdW119IHZlY3RvciBUaGUgeC15IGNvb3JkaW5hdGVzIG9mIHRoZSBwb2ludHNcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjYW52YXMgQ2FudmFzIHRvIGJlIGRyYXduIHRvXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyB0byBiZSBwYXNzZWQgdG8gY2FudmFzRHJhd1xyXG4gICAqL1xyXG4gIHJlZHJhdzogZnVuY3Rpb24gcmVkcmF3KHZlY3RvciwgY2FudmFzLCBvcHRpb25zKSB7XHJcbiAgICBmb3JtYXQuY2FudmFzRHJhdyh2ZWN0b3IsIGNhbnZhcywgb3B0aW9ucyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBMb29wcyB0aHJvdWdoIHRoZSB2ZWN0b3IgcG9pbnRzIGluIHRoZSBzaWduYXR1cmUgYW5kIGFwcGxpZXMgdGhlIGdpdmVuIHNjYWxlIHJhdGlvXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlIFJhdGlvIGluIHdoaWNoIHRvIG11bHRpcGx5IHRoZSB2ZWN0b3IgcG9pbnRcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJbXVtdfSBSZXNjYWxlZCBzaWduYXR1cmUgYXJyYXlcclxuICAgKi9cclxuICByZXNjYWxlOiBmdW5jdGlvbiByZXNjYWxlKHNjYWxlKSB7XHJcbiAgICBjb25zdCByZXNjYWxlZCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpZ25hdHVyZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICByZXNjYWxlZC5wdXNoKFtdKTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnNpZ25hdHVyZVtpXS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHJlc2NhbGVkW2ldLnB1c2goW1xyXG4gICAgICAgICAgdGhpcy5zaWduYXR1cmVbaV1bal1bMF0gKiBzY2FsZSxcclxuICAgICAgICAgIHRoaXMuc2lnbmF0dXJlW2ldW2pdWzFdICogc2NhbGUsXHJcbiAgICAgICAgXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXNjYWxlZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIExvb3BzIHRoZSBzaWduYXR1cmUgY2FsbGluZyBvcHRpbWl6ZSBvbiBlYWNoIHBlbiBkb3duLXRvLXBlbiB1cCBzZWdtZW50XHJcbiAgICogQHJldHVybiB7TnVtYmVyW11bXX0gT3B0aW1pemVkIHNpZ25hdHVyZVxyXG4gICAqL1xyXG4gIG9wdGltaXplU2lnbmF0dXJlOiBmdW5jdGlvbiBvcHRpbWl6ZVNpZ25hdHVyZSgpIHtcclxuICAgIGNvbnN0IG9wdGltaXplZCA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaWduYXR1cmUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgb3B0aW1pemVkLnB1c2godGhpcy5vcHRpbWl6ZSh0aGlzLnNpZ25hdHVyZVtpXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpbWl6ZWQ7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBBdHRlbXB0cyB0byByZW1vdmUgcG9pbnRzIGJ5IGNvbXBhcmluZyB0aGUgeC95IHZhcmlhdGlvbiBiZXR3ZWVuIHRoZSB0d28gYW5kXHJcbiAgICogcmVtb3ZpbmcgcG9pbnRzIHdpdGhpbiBhIGNlcnRhaW4gdGhyZXNob2xkLlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyW119IHZlY3RvciBBcnJheSBvZiB4LHkgY29vcmRpbmF0ZXMgdG8gb3B0aW1pemVcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJbXX0gT3B0aW1pemVkIGFycmF5XHJcbiAgICovXHJcbiAgb3B0aW1pemU6IGZ1bmN0aW9uIG9wdGltaXplKHZlY3Rvcikge1xyXG4gICAgaWYgKHZlY3Rvci5sZW5ndGggPCAyKSB7XHJcbiAgICAgIHJldHVybiB2ZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBjb25zdCBtaW5BID0gMC45NTtcclxuICAgIGNvbnN0IG1heEwgPSAxNS4wOyAvLyAxNS4wLCAxMC4wIHdvcmtzIHdlbGxcclxuICAgIGxldCByb290UCA9IHZlY3RvclswXTtcclxuICAgIGxldCBsYXN0UCA9IHZlY3RvclsxXTtcclxuICAgIGxldCByb290ViA9IFtsYXN0UFswXSAtIHJvb3RQWzBdLCBsYXN0UFsxXSAtIHJvb3RQWzFdXTtcclxuICAgIGxldCByb290TCA9IE1hdGguc3FydChyb290VlswXSAqIHJvb3RWWzBdICsgcm9vdFZbMV0gKiByb290VlsxXSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDI7IGkgPCB2ZWN0b3IubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY3VycmVudFAgPSB2ZWN0b3JbaV07XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRWID0gW2N1cnJlbnRQWzBdIC0gcm9vdFBbMF0sIGN1cnJlbnRQWzFdIC0gcm9vdFBbMV1dO1xyXG4gICAgICBjb25zdCBjdXJyZW50TCA9IE1hdGguc3FydChjdXJyZW50VlswXSAqIGN1cnJlbnRWWzBdICsgY3VycmVudFZbMV0gKiBjdXJyZW50VlsxXSk7XHJcbiAgICAgIGNvbnN0IGRvdFByb2R1Y3QgPSAocm9vdFZbMF0gKiBjdXJyZW50VlswXSArIHJvb3RWWzFdICogY3VycmVudFZbMV0pIC8gKHJvb3RMICogY3VycmVudEwpO1xyXG5cclxuICAgICAgaWYgKGRvdFByb2R1Y3QgPCBtaW5BIHx8IGN1cnJlbnRMID4gbWF4TCkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHJvb3RQKTtcclxuICAgICAgICByb290UCA9IGxhc3RQO1xyXG4gICAgICAgIGxhc3RQID0gY3VycmVudFA7XHJcbiAgICAgICAgcm9vdFYgPSBbbGFzdFBbMF0gLSByb290UFswXSwgbGFzdFBbMV0gLSByb290UFsxXV07XHJcbiAgICAgICAgcm9vdEwgPSBNYXRoLnNxcnQocm9vdFZbMF0gKiByb290VlswXSArIHJvb3RWWzFdICogcm9vdFZbMV0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxhc3RQID0gY3VycmVudFA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXN1bHQucHVzaChsYXN0UCk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==