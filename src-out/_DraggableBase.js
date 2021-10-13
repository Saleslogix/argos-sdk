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
   * @class
   * @alias module:argos/_DraggableBase
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

  /**
   * @module argos/_DraggableBase
   */
  var __class = (0, _declare2.default)('argos._DraggableBase', null, /** @lends module:argos/_DraggableBase.prototype */{
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