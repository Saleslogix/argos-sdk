define('argos/_DraggableBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/dom-geometry'], function (module, exports, _declare, _domGeometry) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _domGeometry2 = _interopRequireDefault(_domGeometry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos._DraggableBase
   * @classdesc A base class used to enable draggable features
   */
  /* Copyright 2017 Infor
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

  var __class = (0, _declare2.default)('argos._DraggableBase', null, {
    _container: null,
    _isScrolling: null,
    _scrollingTouch: null,
    _scrollDirection: null,
    _scroller: null, // Used if the scroller is not equivalent to the container
    _scrollerPos: null,
    _source: null,
    _position: null,
    _previousElement: null,
    _nextElement: null,
    _type: null,
    _class: null,
    _parentTypeToDrag: null, // This is used when the draggable class is a child of the parent that is desired to drag (ex. a button within a div)
    _parentClassToDrag: null,
    _isDragging: false,
    includeScroll: false, // This is the dojo includeScroll for dom-geometry
    allowScroll: true, // This tells the draggable object that the container should scroll when the source is brought to the top/bottom
    scrollSpeed: 15, // This is the scroll speed in pixels
    scrollInterval: 16, // This is the scrolling interval in ms, using 16 you will get approximately 60fps (1000ms/60frames ~ 16.67ms/frame)
    scrollAt: 0.15, // This is a percentage to tell the draggable value to scroll once it reaches +-scrollAt of the container height
    zIndex: null,

    // TODO: Need to add functionality for scrolling, using scrollSpeed and checking allowScroll

    accountForAnimation: function accountForAnimation() {
      if (this._previousElement) {
        return this._position.h - $(this._previousElement).css('margin-bottom').replace('px', '') + this._source.previousMarginBottom + this._source.previousMarginTop;
      }
      if (this._nextElement) {
        return this._position.h - $(this._nextElement).css('margin-top').replace('px', '') + this._source.previousMarginBottom + this._source.previousMarginTop;
      }
      return 0;
    },
    applyInitialStyling: function applyInitialStyling() {
      var containerZ = $(this._container).css('zIndex');
      var containerHeight = $(this._container).css('height');
      if (!this.zIndex) {
        if (containerZ > 0) {
          $(this._source).css({
            zIndex: containerZ + 1
          });
        } else {
          $(this._source).css({
            zIndex: 8000
          });
        }
      } else {
        $(this._source).css({
          zIndex: this.zIndex
        });
      }
      $(this._source).css({
        opacity: '0.6',
        position: 'absolute',
        width: $(this._source).css('width'),
        top: this._position.y - this._position.offset + 'px'
      });
      if (this._scroller) {
        $(this._scroller).css({
          overflow: 'hidden'
        });
      } else {
        $(this._container).css({
          overflow: 'hidden'
        });
      }
      $(this._container).css({
        height: containerHeight + this._position.h + 'px'
      });
      this.applyStyling();
      return this;
    },
    applyStyling: function applyStyling() {
      if (!this.isScrolling) {
        if (this._previousElement) {
          this._previousElement.previousMargin = $(this._previousElement).css('margin-bottom').replace('px', '');
          this.setMargins(this._previousElement, 'bottom');
        } else {
          this._nextElement.previousMargin = $(this._nextElement).css('margin-top').replace('px', '');
          this.setMargins(this._nextElement, 'top');
        }
      }
      return this;
    },
    checkAtTop: function checkAtTop(sourceTop) {
      if (sourceTop <= this._scrollerPos.offset) {
        if (this._scroller) {
          if (this._scroller.scrollTop <= 0) {
            return true;
          }
          return false;
        }
        if (this._container.scrollTop <= 0) {
          return true;
        }
      }
      return false;
    },
    checkScroll: function checkScroll() {
      var touch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (touch.pageY - this._scrollerPos.offset > this._scrollerPos.h * (1 - this.scrollAt)) {
        this._scrollingTouch = touch;
        if (!this._isScrolling) {
          this._scrollDirection = 'down';
          this._isScrolling = setInterval(this.scrollTimer.bind(this), this.scrollInterval);
        }
      } else if (touch.pageY < this._scrollerPos.h * this.scrollAt + this._scrollerPos.offset) {
        this._scrollingTouch = touch;
        if (!this._isScrolling) {
          this._scrollDirection = 'up';
          this._isScrolling = setInterval(this.scrollTimer.bind(this), this.scrollInterval);
        }
      } else {
        this.clearScrollTimer();
      }
      return this;
    },
    clearScrollTimer: function clearScrollTimer() {
      if (this._isScrolling) {
        clearInterval(this._isScrolling);
        this._isScrolling = null;
        this._scrollDirection = null;
      }
    },
    clearValues: function clearValues() {
      this._source = null;
      this._previousElement = null;
      this._nextElement = null;
      this._position = null;
      this._isDragging = false;
      if (this._scroller) {
        $(this._scroller).css({
          overflow: 'auto'
        });
      } else {
        $(this._container).css({
          overflow: 'auto'
        });
      }
      $(this._container).css({
        height: ''
      });
      this.clearScrollTimer();
    },
    computeMovement: function computeMovement(_ref) {
      var pageY = _ref.pageY;

      var sourceTop = pageY - this._position.h / 2;
      if (this.checkAtTop(sourceTop)) {
        sourceTop = this._position.offset;
      }
      this.computePrevNext(sourceTop);
      $(this._source).css({
        top: sourceTop - this._position.offset + 'px'
      });
      this._position = this.getPositionOf(this._source);
      return this;
    },
    computePrevNext: function computePrevNext(sourceTop) {
      var sourceBot = sourceTop + this._position.h;
      if (this._previousElement) {
        // This is the case where the selected element is the last element of the container
        var prevPosition = this.getPositionOf(this._previousElement);
        if (!(sourceTop > prevPosition.y + prevPosition.h / 2)) {
          this.resetMargins(this._previousElement, 'bottom');
          this._nextElement = this._previousElement;
          this._previousElement = this._previousElement.previousSibling;
          if (this._previousElement === this._source) {
            this._previousElement = this._previousElement.previousSibling;
          }
          this.applyStyling();
        } else if (this._nextElement) {
          // This is the case where the selected element is between two elements in the container
          var nextPosition = this.getPositionOf(this._nextElement);
          if (!(sourceBot < nextPosition.y + nextPosition.h / 2 + this.accountForAnimation())) {
            this.resetMargins(this._previousElement, 'bottom');
            this._previousElement = this._nextElement;
            this._nextElement = this._nextElement.nextSibling;
            if (this._nextElement === this._source) {
              this._nextElement = this._nextElement.nextSibling;
            }
            this.applyStyling();
          }
        }
      } else {
        // This is the case where the selected element is the first in the container
        var _nextPosition = this.getPositionOf(this._nextElement);
        if (!(sourceBot < _nextPosition.y + _nextPosition.h / 2 + this.accountForAnimation())) {
          this.resetMargins(this._nextElement, 'top');
          this._previousElement = this._nextElement;
          this._nextElement = this._nextElement.nextSibling;
          if (this._nextElement === this._source) {
            this._nextElement = this._nextElement.nextSibling;
          }
          this.applyStyling();
        }
      }
    },
    findByClass: function findByClass() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var byClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (element === this._container) {
        return false;
      }
      if ($(element).hasClass(byClass)) {
        return element;
      }
      return this.findByClass(element.parentNode, byClass);
    },
    findByType: function findByType() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var byType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (element === this._container) {
        return null;
      }
      if (element.localName === byType) {
        return element;
      }
      return this.findByType(element.parentNode, byType);
    },
    findSource: function findSource() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var source = void 0;
      if (this._class) {
        source = this.findByClass(element, this._class);
        if (source && this._parentClassToDrag) {
          source = this.findByClass(element, this._parentClassToDrag);
        } else if (source && this._parentTypeToDrag) {
          source = this.findByType(element, this._parentTypeToDrag);
        }
      } else if (this._type) {
        source = this.findByType(element, this._type);
        if (source && this._parentClassToDrag) {
          source = this.findByClass(element, this._parentClassToDrag);
        } else if (source && this._parentTypeToDrag) {
          source = this.findByType(element, this._parentTypeToDrag);
        }
      }
      return source;
    },
    getPositionOf: function getPositionOf() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var position = _domGeometry2.default.position(element, this.includeScroll);
      if (position.y !== element.offsetTop) {
        position.offset = position.y - element.offsetTop;
      } else {
        position.offset = 0;
      }
      return position;
    },
    onTouchStart: function onTouchStart() {
      var touch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._source = this.findSource(touch.target);
      if (!this._scrollerPos) {
        if (this._scroller) {
          this._scrollerPos = this.getPositionOf(this._scroller);
        } else {
          this._scrollerPos = this.getPositionOf(this._container);
        }
      }
      if (this._source) {
        this._source.previousMarginBottom = $(this._source).css('margin-bottom').replace('px', '');
        this._source.previousMarginTop = $(this._source).css('margin-top').replace('px', '');
        this._position = this.getPositionOf(this._source);
        this._previousElement = this._source.previousSibling;
        this._nextElement = this._source.nextSibling;
        touch.preventDefault();
      }
    },
    onTouchMove: function onTouchMove() {
      var touch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._source) {
        var touchMovement = void 0;
        if (touch.type === 'mousemove') {
          touchMovement = touch;
        } else {
          touchMovement = touch.changedTouches[0];
        }
        if (touchMovement) {
          if (!this._isDragging) {
            this._isDragging = true;
            this.applyInitialStyling();
          }
          this.checkScroll(touchMovement);
          this.computeMovement(touchMovement);
        }
      }
    },
    onTouchEnd: function onTouchEnd() {
      var touch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._source) {
        this.placeItem(touch).removeStyling().clearValues();
      }
    },
    placeItem: function placeItem() {
      this._source = this._container.removeChild(this._source);
      if (this._previousElement) {
        // This accounts for when the source is between two nodes or the last element in the container
        $(this._previousElement).after(this._source);
      } else {
        // This is the situation in which the source was placed as the first element of the container
        $(this._nextElement).before(this._source);
      }
      $(this._source).css({
        top: ''
      });
      return this;
    },
    removeStyling: function removeStyling() {
      $(this._source).css({
        opacity: '',
        zIndex: '',
        position: '',
        width: ''
      });
      $(this._container).css({
        overflow: ''
      });
      if (this._previousElement) {
        this.resetMargins(this._previousElement, 'bottom');
      } else {
        this.resetMargins(this._nextElement, 'top');
      }
      return this;
    },
    resetMargins: function resetMargins() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var marginType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (marginType === 'bottom') {
        $(element).css({
          'margin-bottom': element.previousMargin + 'px'
        });
      } else if (marginType === 'top') {
        $(element).css({
          'margin-top': element.previousMargin + 'px'
        });
      }
      return this;
    },
    scrollSmooth: function scrollSmooth() {
      var toScroll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var currentScrollTop = toScroll.scrollTop;
      if (speed < 0) {
        if (currentScrollTop >= Math.abs(speed)) {
          toScroll.scrollTop = currentScrollTop + speed;
          this.computeMovement(this._scrollingTouch);
        } else {
          toScroll.scrollTop = 0;
          this.clearScrollTimer();
        }
      } else {
        if (toScroll.scrollHeight - currentScrollTop - toScroll.offsetHeight >= speed) {
          toScroll.scrollTop = currentScrollTop + speed;
          this.computeMovement(this._scrollingTouch);
        } else {
          toScroll.scrollTop = toScroll.scrollHeight - toScroll.offsetHeight + this._position.h;
          this.clearScrollTimer();
        }
      }
    },
    scrollTimer: function scrollTimer() {
      var scrollSpeed = 0;
      if (this._scrollDirection === 'down' && this._source.offsetTop < this._container.lastChild.offsetTop + this._position.h && this._source !== this._container.lastChild) {
        var x = (this._scrollingTouch.pageY - this._scrollerPos.offset - this._scrollerPos.h * (1 - this.scrollAt)) / (this._scrollerPos.h * this.scrollAt); // (this._scrollerPos.h - this._scrollerPos.h * (1 - this.scrollAt))
        if (x < 0) {
          x = 0;
        }
        scrollSpeed = x * x * this.scrollSpeed;
        if (this._scroller) {
          this.scrollSmooth(this._scroller, scrollSpeed);
        } else {
          this.scrollSmooth(this._container, scrollSpeed);
        }
      } else if (this._scrollDirection === 'up' && this._position.y > this._container.firstChild.offsetTop) {
        // (this._scroller.scrollTop > 0 || this._container.scrollTop > 0)
        var _x15 = 1 - (this._scrollingTouch.pageY - this._scrollerPos.offset) / (this._scrollerPos.h * this.scrollAt);
        if (_x15 < 0) {
          _x15 = 1;
        }
        scrollSpeed = -1 * _x15 * _x15 * this.scrollSpeed;
        if (this._scroller) {
          this.scrollSmooth(this._scroller, scrollSpeed);
        } else {
          this.scrollSmooth(this._container, scrollSpeed);
        }
      }
    },
    setClass: function setClass() {
      var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._class = className;
      return this;
    },
    setMargins: function setMargins() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var marginType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var sourceMargins = this._source.previousMarginBottom + this._source.previousMarginTop;
      if (!(sourceMargins > 0)) {
        sourceMargins = 0;
      }
      if (marginType === 'bottom') {
        $(element).css({
          'margin-bottom': element.previousMargin + sourceMargins + this._position.h + 'px'
        });
      } else if (marginType === 'top') {
        $(element).css({
          'margin-top': element.previousMargin + sourceMargins + this._position.h + 'px'
        });
      }
      return this;
    },
    setParentTypeToDrag: function setParentTypeToDrag() {
      var parentType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._parentTypeToDrag = parentType;
      return this;
    },
    setParentClassToDrag: function setParentClassToDrag() {
      var parentClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._parentClassToDrag = parentClass;
    },
    setType: function setType() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._type = type;
      return this;
    },
    setupDraggable: function setupDraggable() {
      var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var scroller = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (container) {
        this._container = container;
        if (scroller) {
          this._scroller = scroller;
        }
        this._container.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this._container.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this._container.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        this._container.addEventListener('touchcancel', this.onTouchEnd.bind(this), false);
        this._container.addEventListener('mousedown', this.onTouchStart.bind(this), false);
        this._container.addEventListener('mousemove', this.onTouchMove.bind(this), false);
        this._container.addEventListener('mouseup', this.onTouchEnd.bind(this), false);
      }
      return this;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRHJhZ2dhYmxlQmFzZS5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwiX2NvbnRhaW5lciIsIl9pc1Njcm9sbGluZyIsIl9zY3JvbGxpbmdUb3VjaCIsIl9zY3JvbGxEaXJlY3Rpb24iLCJfc2Nyb2xsZXIiLCJfc2Nyb2xsZXJQb3MiLCJfc291cmNlIiwiX3Bvc2l0aW9uIiwiX3ByZXZpb3VzRWxlbWVudCIsIl9uZXh0RWxlbWVudCIsIl90eXBlIiwiX2NsYXNzIiwiX3BhcmVudFR5cGVUb0RyYWciLCJfcGFyZW50Q2xhc3NUb0RyYWciLCJfaXNEcmFnZ2luZyIsImluY2x1ZGVTY3JvbGwiLCJhbGxvd1Njcm9sbCIsInNjcm9sbFNwZWVkIiwic2Nyb2xsSW50ZXJ2YWwiLCJzY3JvbGxBdCIsInpJbmRleCIsImFjY291bnRGb3JBbmltYXRpb24iLCJoIiwiJCIsImNzcyIsInJlcGxhY2UiLCJwcmV2aW91c01hcmdpbkJvdHRvbSIsInByZXZpb3VzTWFyZ2luVG9wIiwiYXBwbHlJbml0aWFsU3R5bGluZyIsImNvbnRhaW5lcloiLCJjb250YWluZXJIZWlnaHQiLCJvcGFjaXR5IiwicG9zaXRpb24iLCJ3aWR0aCIsInRvcCIsInkiLCJvZmZzZXQiLCJvdmVyZmxvdyIsImhlaWdodCIsImFwcGx5U3R5bGluZyIsImlzU2Nyb2xsaW5nIiwicHJldmlvdXNNYXJnaW4iLCJzZXRNYXJnaW5zIiwiY2hlY2tBdFRvcCIsInNvdXJjZVRvcCIsInNjcm9sbFRvcCIsImNoZWNrU2Nyb2xsIiwidG91Y2giLCJwYWdlWSIsInNldEludGVydmFsIiwic2Nyb2xsVGltZXIiLCJiaW5kIiwiY2xlYXJTY3JvbGxUaW1lciIsImNsZWFySW50ZXJ2YWwiLCJjbGVhclZhbHVlcyIsImNvbXB1dGVNb3ZlbWVudCIsImNvbXB1dGVQcmV2TmV4dCIsImdldFBvc2l0aW9uT2YiLCJzb3VyY2VCb3QiLCJwcmV2UG9zaXRpb24iLCJyZXNldE1hcmdpbnMiLCJwcmV2aW91c1NpYmxpbmciLCJuZXh0UG9zaXRpb24iLCJuZXh0U2libGluZyIsImZpbmRCeUNsYXNzIiwiZWxlbWVudCIsImJ5Q2xhc3MiLCJoYXNDbGFzcyIsInBhcmVudE5vZGUiLCJmaW5kQnlUeXBlIiwiYnlUeXBlIiwibG9jYWxOYW1lIiwiZmluZFNvdXJjZSIsInNvdXJjZSIsIm9mZnNldFRvcCIsIm9uVG91Y2hTdGFydCIsInRhcmdldCIsInByZXZlbnREZWZhdWx0Iiwib25Ub3VjaE1vdmUiLCJ0b3VjaE1vdmVtZW50IiwidHlwZSIsImNoYW5nZWRUb3VjaGVzIiwib25Ub3VjaEVuZCIsInBsYWNlSXRlbSIsInJlbW92ZVN0eWxpbmciLCJyZW1vdmVDaGlsZCIsImFmdGVyIiwiYmVmb3JlIiwibWFyZ2luVHlwZSIsInNjcm9sbFNtb290aCIsInRvU2Nyb2xsIiwic3BlZWQiLCJjdXJyZW50U2Nyb2xsVG9wIiwiTWF0aCIsImFicyIsInNjcm9sbEhlaWdodCIsIm9mZnNldEhlaWdodCIsImxhc3RDaGlsZCIsIngiLCJmaXJzdENoaWxkIiwic2V0Q2xhc3MiLCJjbGFzc05hbWUiLCJzb3VyY2VNYXJnaW5zIiwic2V0UGFyZW50VHlwZVRvRHJhZyIsInBhcmVudFR5cGUiLCJzZXRQYXJlbnRDbGFzc1RvRHJhZyIsInBhcmVudENsYXNzIiwic2V0VHlwZSIsInNldHVwRHJhZ2dhYmxlIiwiY29udGFpbmVyIiwic2Nyb2xsZXIiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7QUFuQkE7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNQSxVQUFVLHVCQUFRLHNCQUFSLEVBQWdDLElBQWhDLEVBQXNDO0FBQ3BEQyxnQkFBWSxJQUR3QztBQUVwREMsa0JBQWMsSUFGc0M7QUFHcERDLHFCQUFpQixJQUhtQztBQUlwREMsc0JBQWtCLElBSmtDO0FBS3BEQyxlQUFXLElBTHlDLEVBS25DO0FBQ2pCQyxrQkFBYyxJQU5zQztBQU9wREMsYUFBUyxJQVAyQztBQVFwREMsZUFBVyxJ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VUFBTCxDQUFnQi9CLElBQWhCLENBQXFCLElBQXJCLENBQWhELEVBQTRFLEtBQTVFO0FBQ0EsYUFBS25ELFVBQUwsQ0FBZ0IrRyxnQkFBaEIsQ0FBaUMsV0FBakMsRUFBOEMsS0FBS3BDLFlBQUwsQ0FBa0J4QixJQUFsQixDQUF1QixJQUF2QixDQUE5QyxFQUE0RSxLQUE1RTtBQUNBLGFBQUtuRCxVQUFMLENBQWdCK0csZ0JBQWhCLENBQWlDLFdBQWpDLEVBQThDLEtBQUtqQyxXQUFMLENBQWlCM0IsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBOUMsRUFBMkUsS0FBM0U7QUFDQSxhQUFLbkQsVUFBTCxDQUFnQitHLGdCQUFoQixDQUFpQyxTQUFqQyxFQUE0QyxLQUFLN0IsVUFBTCxDQUFnQi9CLElBQWhCLENBQXFCLElBQXJCLENBQTVDLEVBQXdFLEtBQXhFO0FBQ0Q7QUFDRCxhQUFPLElBQVA7QUFDRDtBQXBhbUQsR0FBdEMsQ0FBaEI7O29CQXVhZXBELE8iLCJmaWxlIjoiX0RyYWdnYWJsZUJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgZG9tR2VvbSBmcm9tICdkb2pvL2RvbS1nZW9tZXRyeSc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fRHJhZ2dhYmxlQmFzZVxyXG4gKiBAY2xhc3NkZXNjIEEgYmFzZSBjbGFzcyB1c2VkIHRvIGVuYWJsZSBkcmFnZ2FibGUgZmVhdHVyZXNcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fRHJhZ2dhYmxlQmFzZScsIG51bGwsIHtcclxuICBfY29udGFpbmVyOiBudWxsLFxyXG4gIF9pc1Njcm9sbGluZzogbnVsbCxcclxuICBfc2Nyb2xsaW5nVG91Y2g6IG51bGwsXHJcbiAgX3Njcm9sbERpcmVjdGlvbjogbnVsbCxcclxuICBfc2Nyb2xsZXI6IG51bGwsIC8vIFVzZWQgaWYgdGhlIHNjcm9sbGVyIGlzIG5vdCBlcXVpdmFsZW50IHRvIHRoZSBjb250YWluZXJcclxuICBfc2Nyb2xsZXJQb3M6IG51bGwsXHJcbiAgX3NvdXJjZTogbnVsbCxcclxuICBfcG9zaXRpb246IG51bGwsXHJcbiAgX3ByZXZpb3VzRWxlbWVudDogbnVsbCxcclxuICBfbmV4dEVsZW1lbnQ6IG51bGwsXHJcbiAgX3R5cGU6IG51bGwsXHJcbiAgX2NsYXNzOiBudWxsLFxyXG4gIF9wYXJlbnRUeXBlVG9EcmFnOiBudWxsLCAvLyBUaGlzIGlzIHVzZWQgd2hlbiB0aGUgZHJhZ2dhYmxlIGNsYXNzIGlzIGEgY2hpbGQgb2YgdGhlIHBhcmVudCB0aGF0IGlzIGRlc2lyZWQgdG8gZHJhZyAoZXguIGEgYnV0dG9uIHdpdGhpbiBhIGRpdilcclxuICBfcGFyZW50Q2xhc3NUb0RyYWc6IG51bGwsXHJcbiAgX2lzRHJhZ2dpbmc6IGZhbHNlLFxyXG4gIGluY2x1ZGVTY3JvbGw6IGZhbHNlLCAvLyBUaGlzIGlzIHRoZSBkb2pvIGluY2x1ZGVTY3JvbGwgZm9yIGRvbS1nZW9tZXRyeVxyXG4gIGFsbG93U2Nyb2xsOiB0cnVlLCAvLyBUaGlzIHRlbGxzIHRoZSBkcmFnZ2FibGUgb2JqZWN0IHRoYXQgdGhlIGNvbnRhaW5lciBzaG91bGQgc2Nyb2xsIHdoZW4gdGhlIHNvdXJjZSBpcyBicm91Z2h0IHRvIHRoZSB0b3AvYm90dG9tXHJcbiAgc2Nyb2xsU3BlZWQ6IDE1LCAvLyBUaGlzIGlzIHRoZSBzY3JvbGwgc3BlZWQgaW4gcGl4ZWxzXHJcbiAgc2Nyb2xsSW50ZXJ2YWw6IDE2LCAvLyBUaGlzIGlzIHRoZSBzY3JvbGxpbmcgaW50ZXJ2YWwgaW4gbXMsIHVzaW5nIDE2IHlvdSB3aWxsIGdldCBhcHByb3hpbWF0ZWx5IDYwZnBzICgxMDAwbXMvNjBmcmFtZXMgfiAxNi42N21zL2ZyYW1lKVxyXG4gIHNjcm9sbEF0OiAwLjE1LCAvLyBUaGlzIGlzIGEgcGVyY2VudGFnZSB0byB0ZWxsIHRoZSBkcmFnZ2FibGUgdmFsdWUgdG8gc2Nyb2xsIG9uY2UgaXQgcmVhY2hlcyArLXNjcm9sbEF0IG9mIHRoZSBjb250YWluZXIgaGVpZ2h0XHJcbiAgekluZGV4OiBudWxsLFxyXG5cclxuICAvLyBUT0RPOiBOZWVkIHRvIGFkZCBmdW5jdGlvbmFsaXR5IGZvciBzY3JvbGxpbmcsIHVzaW5nIHNjcm9sbFNwZWVkIGFuZCBjaGVja2luZyBhbGxvd1Njcm9sbFxyXG5cclxuICBhY2NvdW50Rm9yQW5pbWF0aW9uOiBmdW5jdGlvbiBhY2NvdW50Rm9yQW5pbWF0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24uaCAtICQodGhpcy5fcHJldmlvdXNFbGVtZW50KS5jc3MoJ21hcmdpbi1ib3R0b20nKS5yZXBsYWNlKCdweCcsICcnKSArIHRoaXMuX3NvdXJjZS5wcmV2aW91c01hcmdpbkJvdHRvbSArIHRoaXMuX3NvdXJjZS5wcmV2aW91c01hcmdpblRvcDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9uZXh0RWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24uaCAtICQodGhpcy5fbmV4dEVsZW1lbnQpLmNzcygnbWFyZ2luLXRvcCcpLnJlcGxhY2UoJ3B4JywgJycpICsgdGhpcy5fc291cmNlLnByZXZpb3VzTWFyZ2luQm90dG9tICsgdGhpcy5fc291cmNlLnByZXZpb3VzTWFyZ2luVG9wO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIDA7XHJcbiAgfSxcclxuICBhcHBseUluaXRpYWxTdHlsaW5nOiBmdW5jdGlvbiBhcHBseUluaXRpYWxTdHlsaW5nKCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyWiA9ICQodGhpcy5fY29udGFpbmVyKS5jc3MoJ3pJbmRleCcpO1xyXG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gJCh0aGlzLl9jb250YWluZXIpLmNzcygnaGVpZ2h0Jyk7XHJcbiAgICBpZiAoIXRoaXMuekluZGV4KSB7XHJcbiAgICAgIGlmIChjb250YWluZXJaID4gMCkge1xyXG4gICAgICAgICQodGhpcy5fc291cmNlKS5jc3Moe1xyXG4gICAgICAgICAgekluZGV4OiBjb250YWluZXJaICsgMSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuX3NvdXJjZSkuY3NzKHtcclxuICAgICAgICAgIHpJbmRleDogODAwMCxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCh0aGlzLl9zb3VyY2UpLmNzcyh7XHJcbiAgICAgICAgekluZGV4OiB0aGlzLnpJbmRleCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuX3NvdXJjZSkuY3NzKHtcclxuICAgICAgb3BhY2l0eTogJzAuNicsXHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB3aWR0aDogJCh0aGlzLl9zb3VyY2UpLmNzcygnd2lkdGgnKSxcclxuICAgICAgdG9wOiBgJHt0aGlzLl9wb3NpdGlvbi55IC0gdGhpcy5fcG9zaXRpb24ub2Zmc2V0fXB4YCxcclxuICAgIH0pO1xyXG4gICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICQodGhpcy5fc2Nyb2xsZXIpLmNzcyh7XHJcbiAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQodGhpcy5fY29udGFpbmVyKS5jc3Moe1xyXG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuX2NvbnRhaW5lcikuY3NzKHtcclxuICAgICAgaGVpZ2h0OiBgJHtjb250YWluZXJIZWlnaHQgKyB0aGlzLl9wb3NpdGlvbi5ofXB4YCxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hcHBseVN0eWxpbmcoKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgYXBwbHlTdHlsaW5nOiBmdW5jdGlvbiBhcHBseVN0eWxpbmcoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNTY3JvbGxpbmcpIHtcclxuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzRWxlbWVudC5wcmV2aW91c01hcmdpbiA9ICQodGhpcy5fcHJldmlvdXNFbGVtZW50KS5jc3MoJ21hcmdpbi1ib3R0b20nKS5yZXBsYWNlKCdweCcsICcnKTtcclxuICAgICAgICB0aGlzLnNldE1hcmdpbnModGhpcy5fcHJldmlvdXNFbGVtZW50LCAnYm90dG9tJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fbmV4dEVsZW1lbnQucHJldmlvdXNNYXJnaW4gPSAkKHRoaXMuX25leHRFbGVtZW50KS5jc3MoJ21hcmdpbi10b3AnKS5yZXBsYWNlKCdweCcsICcnKTtcclxuICAgICAgICB0aGlzLnNldE1hcmdpbnModGhpcy5fbmV4dEVsZW1lbnQsICd0b3AnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBjaGVja0F0VG9wOiBmdW5jdGlvbiBjaGVja0F0VG9wKHNvdXJjZVRvcCkge1xyXG4gICAgaWYgKHNvdXJjZVRvcCA8PSB0aGlzLl9zY3JvbGxlclBvcy5vZmZzZXQpIHtcclxuICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyLnNjcm9sbFRvcCA8PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLl9jb250YWluZXIuc2Nyb2xsVG9wIDw9IDApIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgY2hlY2tTY3JvbGw6IGZ1bmN0aW9uIGNoZWNrU2Nyb2xsKHRvdWNoID0ge30pIHtcclxuICAgIGlmICh0b3VjaC5wYWdlWSAtIHRoaXMuX3Njcm9sbGVyUG9zLm9mZnNldCA+ICh0aGlzLl9zY3JvbGxlclBvcy5oICogKDEgLSB0aGlzLnNjcm9sbEF0KSkpIHtcclxuICAgICAgdGhpcy5fc2Nyb2xsaW5nVG91Y2ggPSB0b3VjaDtcclxuICAgICAgaWYgKCF0aGlzLl9pc1Njcm9sbGluZykge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbERpcmVjdGlvbiA9ICdkb3duJztcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGluZyA9IHNldEludGVydmFsKHRoaXMuc2Nyb2xsVGltZXIuYmluZCh0aGlzKSwgdGhpcy5zY3JvbGxJbnRlcnZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodG91Y2gucGFnZVkgPCB0aGlzLl9zY3JvbGxlclBvcy5oICogdGhpcy5zY3JvbGxBdCArIHRoaXMuX3Njcm9sbGVyUG9zLm9mZnNldCkge1xyXG4gICAgICB0aGlzLl9zY3JvbGxpbmdUb3VjaCA9IHRvdWNoO1xyXG4gICAgICBpZiAoIXRoaXMuX2lzU2Nyb2xsaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsRGlyZWN0aW9uID0gJ3VwJztcclxuICAgICAgICB0aGlzLl9pc1Njcm9sbGluZyA9IHNldEludGVydmFsKHRoaXMuc2Nyb2xsVGltZXIuYmluZCh0aGlzKSwgdGhpcy5zY3JvbGxJbnRlcnZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2xlYXJTY3JvbGxUaW1lcigpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBjbGVhclNjcm9sbFRpbWVyOiBmdW5jdGlvbiBjbGVhclNjcm9sbFRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuX2lzU2Nyb2xsaW5nKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faXNTY3JvbGxpbmcpO1xyXG4gICAgICB0aGlzLl9pc1Njcm9sbGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3Njcm9sbERpcmVjdGlvbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjbGVhclZhbHVlczogZnVuY3Rpb24gY2xlYXJWYWx1ZXMoKSB7XHJcbiAgICB0aGlzLl9zb3VyY2UgPSBudWxsO1xyXG4gICAgdGhpcy5fcHJldmlvdXNFbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuX25leHRFbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuX3Bvc2l0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAkKHRoaXMuX3Njcm9sbGVyKS5jc3Moe1xyXG4gICAgICAgIG92ZXJmbG93OiAnYXV0bycsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCh0aGlzLl9jb250YWluZXIpLmNzcyh7XHJcbiAgICAgICAgb3ZlcmZsb3c6ICdhdXRvJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuX2NvbnRhaW5lcikuY3NzKHtcclxuICAgICAgaGVpZ2h0OiAnJyxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jbGVhclNjcm9sbFRpbWVyKCk7XHJcbiAgfSxcclxuICBjb21wdXRlTW92ZW1lbnQ6IGZ1bmN0aW9uIGNvbXB1dGVNb3ZlbWVudCh7IHBhZ2VZIH0pIHtcclxuICAgIGxldCBzb3VyY2VUb3AgPSBwYWdlWSAtICh0aGlzLl9wb3NpdGlvbi5oIC8gMik7XHJcbiAgICBpZiAodGhpcy5jaGVja0F0VG9wKHNvdXJjZVRvcCkpIHtcclxuICAgICAgc291cmNlVG9wID0gdGhpcy5fcG9zaXRpb24ub2Zmc2V0O1xyXG4gICAgfVxyXG4gICAgdGhpcy5jb21wdXRlUHJldk5leHQoc291cmNlVG9wKTtcclxuICAgICQodGhpcy5fc291cmNlKS5jc3Moe1xyXG4gICAgICB0b3A6IGAke3NvdXJjZVRvcCAtIHRoaXMuX3Bvc2l0aW9uLm9mZnNldH1weGAsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbk9mKHRoaXMuX3NvdXJjZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNvbXB1dGVQcmV2TmV4dDogZnVuY3Rpb24gY29tcHV0ZVByZXZOZXh0KHNvdXJjZVRvcCkge1xyXG4gICAgY29uc3Qgc291cmNlQm90ID0gc291cmNlVG9wICsgdGhpcy5fcG9zaXRpb24uaDtcclxuICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZW1lbnQpIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSB3aGVyZSB0aGUgc2VsZWN0ZWQgZWxlbWVudCBpcyB0aGUgbGFzdCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcclxuICAgICAgY29uc3QgcHJldlBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbk9mKHRoaXMuX3ByZXZpb3VzRWxlbWVudCk7XHJcbiAgICAgIGlmICghKHNvdXJjZVRvcCA+IChwcmV2UG9zaXRpb24ueSArIChwcmV2UG9zaXRpb24uaCAvIDIpKSkpIHtcclxuICAgICAgICB0aGlzLnJlc2V0TWFyZ2lucyh0aGlzLl9wcmV2aW91c0VsZW1lbnQsICdib3R0b20nKTtcclxuICAgICAgICB0aGlzLl9uZXh0RWxlbWVudCA9IHRoaXMuX3ByZXZpb3VzRWxlbWVudDtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0VsZW1lbnQgPSB0aGlzLl9wcmV2aW91c0VsZW1lbnQucHJldmlvdXNTaWJsaW5nO1xyXG4gICAgICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZW1lbnQgPT09IHRoaXMuX3NvdXJjZSkge1xyXG4gICAgICAgICAgdGhpcy5fcHJldmlvdXNFbGVtZW50ID0gdGhpcy5fcHJldmlvdXNFbGVtZW50LnByZXZpb3VzU2libGluZztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hcHBseVN0eWxpbmcoKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0RWxlbWVudCkge1xyXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGNhc2Ugd2hlcmUgdGhlIHNlbGVjdGVkIGVsZW1lbnQgaXMgYmV0d2VlbiB0d28gZWxlbWVudHMgaW4gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgIGNvbnN0IG5leHRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25PZih0aGlzLl9uZXh0RWxlbWVudCk7XHJcbiAgICAgICAgaWYgKCEoc291cmNlQm90IDwgbmV4dFBvc2l0aW9uLnkgKyBuZXh0UG9zaXRpb24uaCAvIDIgKyB0aGlzLmFjY291bnRGb3JBbmltYXRpb24oKSkpIHtcclxuICAgICAgICAgIHRoaXMucmVzZXRNYXJnaW5zKHRoaXMuX3ByZXZpb3VzRWxlbWVudCwgJ2JvdHRvbScpO1xyXG4gICAgICAgICAgdGhpcy5fcHJldmlvdXNFbGVtZW50ID0gdGhpcy5fbmV4dEVsZW1lbnQ7XHJcbiAgICAgICAgICB0aGlzLl9uZXh0RWxlbWVudCA9IHRoaXMuX25leHRFbGVtZW50Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHRoaXMuX25leHRFbGVtZW50ID09PSB0aGlzLl9zb3VyY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dEVsZW1lbnQgPSB0aGlzLl9uZXh0RWxlbWVudC5uZXh0U2libGluZztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuYXBwbHlTdHlsaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUaGlzIGlzIHRoZSBjYXNlIHdoZXJlIHRoZSBzZWxlY3RlZCBlbGVtZW50IGlzIHRoZSBmaXJzdCBpbiB0aGUgY29udGFpbmVyXHJcbiAgICAgIGNvbnN0IG5leHRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25PZih0aGlzLl9uZXh0RWxlbWVudCk7XHJcbiAgICAgIGlmICghKHNvdXJjZUJvdCA8IG5leHRQb3NpdGlvbi55ICsgbmV4dFBvc2l0aW9uLmggLyAyICsgdGhpcy5hY2NvdW50Rm9yQW5pbWF0aW9uKCkpKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldE1hcmdpbnModGhpcy5fbmV4dEVsZW1lbnQsICd0b3AnKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0VsZW1lbnQgPSB0aGlzLl9uZXh0RWxlbWVudDtcclxuICAgICAgICB0aGlzLl9uZXh0RWxlbWVudCA9IHRoaXMuX25leHRFbGVtZW50Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgIGlmICh0aGlzLl9uZXh0RWxlbWVudCA9PT0gdGhpcy5fc291cmNlKSB7XHJcbiAgICAgICAgICB0aGlzLl9uZXh0RWxlbWVudCA9IHRoaXMuX25leHRFbGVtZW50Lm5leHRTaWJsaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFwcGx5U3R5bGluZygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBmaW5kQnlDbGFzczogZnVuY3Rpb24gZmluZEJ5Q2xhc3MoZWxlbWVudCA9IHt9LCBieUNsYXNzID0ge30pIHtcclxuICAgIGlmIChlbGVtZW50ID09PSB0aGlzLl9jb250YWluZXIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKCQoZWxlbWVudCkuaGFzQ2xhc3MoYnlDbGFzcykpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5maW5kQnlDbGFzcyhlbGVtZW50LnBhcmVudE5vZGUsIGJ5Q2xhc3MpO1xyXG4gIH0sXHJcbiAgZmluZEJ5VHlwZTogZnVuY3Rpb24gZmluZEJ5VHlwZShlbGVtZW50ID0ge30sIGJ5VHlwZSA9IHt9KSB7XHJcbiAgICBpZiAoZWxlbWVudCA9PT0gdGhpcy5fY29udGFpbmVyKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKGVsZW1lbnQubG9jYWxOYW1lID09PSBieVR5cGUpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5maW5kQnlUeXBlKGVsZW1lbnQucGFyZW50Tm9kZSwgYnlUeXBlKTtcclxuICB9LFxyXG4gIGZpbmRTb3VyY2U6IGZ1bmN0aW9uIGZpbmRTb3VyY2UoZWxlbWVudCA9IHt9KSB7XHJcbiAgICBsZXQgc291cmNlO1xyXG4gICAgaWYgKHRoaXMuX2NsYXNzKSB7XHJcbiAgICAgIHNvdXJjZSA9IHRoaXMuZmluZEJ5Q2xhc3MoZWxlbWVudCwgdGhpcy5fY2xhc3MpO1xyXG4gICAgICBpZiAoc291cmNlICYmIHRoaXMuX3BhcmVudENsYXNzVG9EcmFnKSB7XHJcbiAgICAgICAgc291cmNlID0gdGhpcy5maW5kQnlDbGFzcyhlbGVtZW50LCB0aGlzLl9wYXJlbnRDbGFzc1RvRHJhZyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoc291cmNlICYmIHRoaXMuX3BhcmVudFR5cGVUb0RyYWcpIHtcclxuICAgICAgICBzb3VyY2UgPSB0aGlzLmZpbmRCeVR5cGUoZWxlbWVudCwgdGhpcy5fcGFyZW50VHlwZVRvRHJhZyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5fdHlwZSkge1xyXG4gICAgICBzb3VyY2UgPSB0aGlzLmZpbmRCeVR5cGUoZWxlbWVudCwgdGhpcy5fdHlwZSk7XHJcbiAgICAgIGlmIChzb3VyY2UgJiYgdGhpcy5fcGFyZW50Q2xhc3NUb0RyYWcpIHtcclxuICAgICAgICBzb3VyY2UgPSB0aGlzLmZpbmRCeUNsYXNzKGVsZW1lbnQsIHRoaXMuX3BhcmVudENsYXNzVG9EcmFnKTtcclxuICAgICAgfSBlbHNlIGlmIChzb3VyY2UgJiYgdGhpcy5fcGFyZW50VHlwZVRvRHJhZykge1xyXG4gICAgICAgIHNvdXJjZSA9IHRoaXMuZmluZEJ5VHlwZShlbGVtZW50LCB0aGlzLl9wYXJlbnRUeXBlVG9EcmFnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNvdXJjZTtcclxuICB9LFxyXG4gIGdldFBvc2l0aW9uT2Y6IGZ1bmN0aW9uIGdldFBvc2l0aW9uT2YoZWxlbWVudCA9IHt9KSB7XHJcbiAgICBjb25zdCBwb3NpdGlvbiA9IGRvbUdlb20ucG9zaXRpb24oZWxlbWVudCwgdGhpcy5pbmNsdWRlU2Nyb2xsKTtcclxuICAgIGlmIChwb3NpdGlvbi55ICE9PSBlbGVtZW50Lm9mZnNldFRvcCkge1xyXG4gICAgICBwb3NpdGlvbi5vZmZzZXQgPSBwb3NpdGlvbi55IC0gZWxlbWVudC5vZmZzZXRUb3A7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb3NpdGlvbi5vZmZzZXQgPSAwO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gIH0sXHJcbiAgb25Ub3VjaFN0YXJ0OiBmdW5jdGlvbiBvblRvdWNoU3RhcnQodG91Y2ggPSB7fSkge1xyXG4gICAgdGhpcy5fc291cmNlID0gdGhpcy5maW5kU291cmNlKHRvdWNoLnRhcmdldCk7XHJcbiAgICBpZiAoIXRoaXMuX3Njcm9sbGVyUG9zKSB7XHJcbiAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbGVyUG9zID0gdGhpcy5nZXRQb3NpdGlvbk9mKHRoaXMuX3Njcm9sbGVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9zY3JvbGxlclBvcyA9IHRoaXMuZ2V0UG9zaXRpb25PZih0aGlzLl9jb250YWluZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fc291cmNlKSB7XHJcbiAgICAgIHRoaXMuX3NvdXJjZS5wcmV2aW91c01hcmdpbkJvdHRvbSA9ICQodGhpcy5fc291cmNlKS5jc3MoJ21hcmdpbi1ib3R0b20nKS5yZXBsYWNlKCdweCcsICcnKTtcclxuICAgICAgdGhpcy5fc291cmNlLnByZXZpb3VzTWFyZ2luVG9wID0gJCh0aGlzLl9zb3VyY2UpLmNzcygnbWFyZ2luLXRvcCcpLnJlcGxhY2UoJ3B4JywgJycpO1xyXG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25PZih0aGlzLl9zb3VyY2UpO1xyXG4gICAgICB0aGlzLl9wcmV2aW91c0VsZW1lbnQgPSB0aGlzLl9zb3VyY2UucHJldmlvdXNTaWJsaW5nO1xyXG4gICAgICB0aGlzLl9uZXh0RWxlbWVudCA9IHRoaXMuX3NvdXJjZS5uZXh0U2libGluZztcclxuICAgICAgdG91Y2gucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9uVG91Y2hNb3ZlOiBmdW5jdGlvbiBvblRvdWNoTW92ZSh0b3VjaCA9IHt9KSB7XHJcbiAgICBpZiAodGhpcy5fc291cmNlKSB7XHJcbiAgICAgIGxldCB0b3VjaE1vdmVtZW50O1xyXG4gICAgICBpZiAodG91Y2gudHlwZSA9PT0gJ21vdXNlbW92ZScpIHtcclxuICAgICAgICB0b3VjaE1vdmVtZW50ID0gdG91Y2g7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdG91Y2hNb3ZlbWVudCA9IHRvdWNoLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0b3VjaE1vdmVtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0RyYWdnaW5nKSB7XHJcbiAgICAgICAgICB0aGlzLl9pc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuYXBwbHlJbml0aWFsU3R5bGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoZWNrU2Nyb2xsKHRvdWNoTW92ZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZU1vdmVtZW50KHRvdWNoTW92ZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBvblRvdWNoRW5kOiBmdW5jdGlvbiBvblRvdWNoRW5kKHRvdWNoID0ge30pIHtcclxuICAgIGlmICh0aGlzLl9zb3VyY2UpIHtcclxuICAgICAgdGhpcy5wbGFjZUl0ZW0odG91Y2gpXHJcbiAgICAgICAgLnJlbW92ZVN0eWxpbmcoKVxyXG4gICAgICAgIC5jbGVhclZhbHVlcygpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxhY2VJdGVtOiBmdW5jdGlvbiBwbGFjZUl0ZW0oKSB7XHJcbiAgICB0aGlzLl9zb3VyY2UgPSB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5fc291cmNlKTtcclxuICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZW1lbnQpIHtcclxuICAgICAgLy8gVGhpcyBhY2NvdW50cyBmb3Igd2hlbiB0aGUgc291cmNlIGlzIGJldHdlZW4gdHdvIG5vZGVzIG9yIHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGNvbnRhaW5lclxyXG4gICAgICAkKHRoaXMuX3ByZXZpb3VzRWxlbWVudCkuYWZ0ZXIodGhpcy5fc291cmNlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFRoaXMgaXMgdGhlIHNpdHVhdGlvbiBpbiB3aGljaCB0aGUgc291cmNlIHdhcyBwbGFjZWQgYXMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxyXG4gICAgICAkKHRoaXMuX25leHRFbGVtZW50KS5iZWZvcmUodGhpcy5fc291cmNlKTtcclxuICAgIH1cclxuICAgICQodGhpcy5fc291cmNlKS5jc3Moe1xyXG4gICAgICB0b3A6ICcnLFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHJlbW92ZVN0eWxpbmc6IGZ1bmN0aW9uIHJlbW92ZVN0eWxpbmcoKSB7XHJcbiAgICAkKHRoaXMuX3NvdXJjZSkuY3NzKHtcclxuICAgICAgb3BhY2l0eTogJycsXHJcbiAgICAgIHpJbmRleDogJycsXHJcbiAgICAgIHBvc2l0aW9uOiAnJyxcclxuICAgICAgd2lkdGg6ICcnLFxyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMuX2NvbnRhaW5lcikuY3NzKHtcclxuICAgICAgb3ZlcmZsb3c6ICcnLFxyXG4gICAgfSk7XHJcbiAgICBpZiAodGhpcy5fcHJldmlvdXNFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMucmVzZXRNYXJnaW5zKHRoaXMuX3ByZXZpb3VzRWxlbWVudCwgJ2JvdHRvbScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yZXNldE1hcmdpbnModGhpcy5fbmV4dEVsZW1lbnQsICd0b3AnKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgcmVzZXRNYXJnaW5zOiBmdW5jdGlvbiByZXNldE1hcmdpbnMoZWxlbWVudCA9IHt9LCBtYXJnaW5UeXBlID0ge30pIHtcclxuICAgIGlmIChtYXJnaW5UeXBlID09PSAnYm90dG9tJykge1xyXG4gICAgICAkKGVsZW1lbnQpLmNzcyh7XHJcbiAgICAgICAgJ21hcmdpbi1ib3R0b20nOiBgJHtlbGVtZW50LnByZXZpb3VzTWFyZ2lufXB4YCxcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKG1hcmdpblR5cGUgPT09ICd0b3AnKSB7XHJcbiAgICAgICQoZWxlbWVudCkuY3NzKHtcclxuICAgICAgICAnbWFyZ2luLXRvcCc6IGAke2VsZW1lbnQucHJldmlvdXNNYXJnaW59cHhgLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgc2Nyb2xsU21vb3RoOiBmdW5jdGlvbiBzY3JvbGxTbW9vdGgodG9TY3JvbGwgPSB7fSwgc3BlZWQgPSB7fSkge1xyXG4gICAgY29uc3QgY3VycmVudFNjcm9sbFRvcCA9IHRvU2Nyb2xsLnNjcm9sbFRvcDtcclxuICAgIGlmIChzcGVlZCA8IDApIHtcclxuICAgICAgaWYgKGN1cnJlbnRTY3JvbGxUb3AgPj0gTWF0aC5hYnMoc3BlZWQpKSB7XHJcbiAgICAgICAgdG9TY3JvbGwuc2Nyb2xsVG9wID0gY3VycmVudFNjcm9sbFRvcCArIHNwZWVkO1xyXG4gICAgICAgIHRoaXMuY29tcHV0ZU1vdmVtZW50KHRoaXMuX3Njcm9sbGluZ1RvdWNoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0b1Njcm9sbC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTY3JvbGxUaW1lcigpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodG9TY3JvbGwuc2Nyb2xsSGVpZ2h0IC0gY3VycmVudFNjcm9sbFRvcCAtIHRvU2Nyb2xsLm9mZnNldEhlaWdodCA+PSBzcGVlZCkge1xyXG4gICAgICAgIHRvU2Nyb2xsLnNjcm9sbFRvcCA9IGN1cnJlbnRTY3JvbGxUb3AgKyBzcGVlZDtcclxuICAgICAgICB0aGlzLmNvbXB1dGVNb3ZlbWVudCh0aGlzLl9zY3JvbGxpbmdUb3VjaCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdG9TY3JvbGwuc2Nyb2xsVG9wID0gdG9TY3JvbGwuc2Nyb2xsSGVpZ2h0IC0gdG9TY3JvbGwub2Zmc2V0SGVpZ2h0ICsgdGhpcy5fcG9zaXRpb24uaDtcclxuICAgICAgICB0aGlzLmNsZWFyU2Nyb2xsVGltZXIoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2Nyb2xsVGltZXI6IGZ1bmN0aW9uIHNjcm9sbFRpbWVyKCkge1xyXG4gICAgbGV0IHNjcm9sbFNwZWVkID0gMDtcclxuICAgIGlmICh0aGlzLl9zY3JvbGxEaXJlY3Rpb24gPT09ICdkb3duJyAmJiB0aGlzLl9zb3VyY2Uub2Zmc2V0VG9wIDwgdGhpcy5fY29udGFpbmVyLmxhc3RDaGlsZC5vZmZzZXRUb3AgKyB0aGlzLl9wb3NpdGlvbi5oICYmIHRoaXMuX3NvdXJjZSAhPT0gdGhpcy5fY29udGFpbmVyLmxhc3RDaGlsZCkge1xyXG4gICAgICBsZXQgeCA9ICh0aGlzLl9zY3JvbGxpbmdUb3VjaC5wYWdlWSAtIHRoaXMuX3Njcm9sbGVyUG9zLm9mZnNldCAtIHRoaXMuX3Njcm9sbGVyUG9zLmggKiAoMSAtIHRoaXMuc2Nyb2xsQXQpKSAvICh0aGlzLl9zY3JvbGxlclBvcy5oICogdGhpcy5zY3JvbGxBdCk7IC8vICh0aGlzLl9zY3JvbGxlclBvcy5oIC0gdGhpcy5fc2Nyb2xsZXJQb3MuaCAqICgxIC0gdGhpcy5zY3JvbGxBdCkpXHJcbiAgICAgIGlmICh4IDwgMCkge1xyXG4gICAgICAgIHggPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIHNjcm9sbFNwZWVkID0geCAqIHggKiB0aGlzLnNjcm9sbFNwZWVkO1xyXG4gICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbFNtb290aCh0aGlzLl9zY3JvbGxlciwgc2Nyb2xsU3BlZWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsU21vb3RoKHRoaXMuX2NvbnRhaW5lciwgc2Nyb2xsU3BlZWQpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbERpcmVjdGlvbiA9PT0gJ3VwJyAmJiB0aGlzLl9wb3NpdGlvbi55ID4gdGhpcy5fY29udGFpbmVyLmZpcnN0Q2hpbGQub2Zmc2V0VG9wKSB7IC8vICh0aGlzLl9zY3JvbGxlci5zY3JvbGxUb3AgPiAwIHx8IHRoaXMuX2NvbnRhaW5lci5zY3JvbGxUb3AgPiAwKVxyXG4gICAgICBsZXQgeCA9IDEgLSAoKHRoaXMuX3Njcm9sbGluZ1RvdWNoLnBhZ2VZIC0gdGhpcy5fc2Nyb2xsZXJQb3Mub2Zmc2V0KSAvICh0aGlzLl9zY3JvbGxlclBvcy5oICogdGhpcy5zY3JvbGxBdCkpO1xyXG4gICAgICBpZiAoeCA8IDApIHtcclxuICAgICAgICB4ID0gMTtcclxuICAgICAgfVxyXG4gICAgICBzY3JvbGxTcGVlZCA9IC0xICogeCAqIHggKiB0aGlzLnNjcm9sbFNwZWVkO1xyXG4gICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbFNtb290aCh0aGlzLl9zY3JvbGxlciwgc2Nyb2xsU3BlZWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsU21vb3RoKHRoaXMuX2NvbnRhaW5lciwgc2Nyb2xsU3BlZWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXRDbGFzczogZnVuY3Rpb24gc2V0Q2xhc3MoY2xhc3NOYW1lID0ge30pIHtcclxuICAgIHRoaXMuX2NsYXNzID0gY2xhc3NOYW1lO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXRNYXJnaW5zOiBmdW5jdGlvbiBzZXRNYXJnaW5zKGVsZW1lbnQgPSB7fSwgbWFyZ2luVHlwZSA9IHt9KSB7XHJcbiAgICBsZXQgc291cmNlTWFyZ2lucyA9IHRoaXMuX3NvdXJjZS5wcmV2aW91c01hcmdpbkJvdHRvbSArIHRoaXMuX3NvdXJjZS5wcmV2aW91c01hcmdpblRvcDtcclxuICAgIGlmICghKHNvdXJjZU1hcmdpbnMgPiAwKSkge1xyXG4gICAgICBzb3VyY2VNYXJnaW5zID0gMDtcclxuICAgIH1cclxuICAgIGlmIChtYXJnaW5UeXBlID09PSAnYm90dG9tJykge1xyXG4gICAgICAkKGVsZW1lbnQpLmNzcyh7XHJcbiAgICAgICAgJ21hcmdpbi1ib3R0b20nOiBgJHtlbGVtZW50LnByZXZpb3VzTWFyZ2luICsgc291cmNlTWFyZ2lucyArIHRoaXMuX3Bvc2l0aW9uLmh9cHhgLFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAobWFyZ2luVHlwZSA9PT0gJ3RvcCcpIHtcclxuICAgICAgJChlbGVtZW50KS5jc3Moe1xyXG4gICAgICAgICdtYXJnaW4tdG9wJzogYCR7ZWxlbWVudC5wcmV2aW91c01hcmdpbiArIHNvdXJjZU1hcmdpbnMgKyB0aGlzLl9wb3NpdGlvbi5ofXB4YCxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHNldFBhcmVudFR5cGVUb0RyYWc6IGZ1bmN0aW9uIHNldFBhcmVudFR5cGVUb0RyYWcocGFyZW50VHlwZSA9IHt9KSB7XHJcbiAgICB0aGlzLl9wYXJlbnRUeXBlVG9EcmFnID0gcGFyZW50VHlwZTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgc2V0UGFyZW50Q2xhc3NUb0RyYWc6IGZ1bmN0aW9uIHNldFBhcmVudENsYXNzVG9EcmFnKHBhcmVudENsYXNzID0ge30pIHtcclxuICAgIHRoaXMuX3BhcmVudENsYXNzVG9EcmFnID0gcGFyZW50Q2xhc3M7XHJcbiAgfSxcclxuICBzZXRUeXBlOiBmdW5jdGlvbiBzZXRUeXBlKHR5cGUgPSB7fSkge1xyXG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHNldHVwRHJhZ2dhYmxlOiBmdW5jdGlvbiBzZXR1cERyYWdnYWJsZShjb250YWluZXIgPSB7fSwgc2Nyb2xsZXIgPSB7fSkge1xyXG4gICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgIGlmIChzY3JvbGxlcikge1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbGVyID0gc2Nyb2xsZXI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==