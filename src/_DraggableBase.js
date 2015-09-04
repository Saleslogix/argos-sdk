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
import array from 'dojo/_base/array';
import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import domGeom from 'dojo/dom-geometry';
import domStyle from 'dojo/dom-style';

/**
 * @class argos._DraggableBase
 * A base class used to enable draggable features
 */
const __class = declare('argos._DraggableBase', null, {
  _container: null,
  _source: null,
  _position: null,
  _previousElement: null,
  _nextElement: null,
  _type: null,
  _class: null,
  _isDragging: false,
  includeScroll: true, // This is the dojo includeScroll for dom-geometry
  allowScroll: true, // This tells the draggble object that the container should scroll when the source is brought to the top/bottom
  scrollSpeed: 2, // This is the scroll speed in pixels
  zIndex: null,

  applyInitialStyling: function applyInitialStyling() {
    const containerZ = domStyle.get(this._container, 'zIndex');
    if (!this.zIndex) {
      if (containerZ > 0) {
        domStyle.set(this._source, {
          zIndex: containerZ + 1,
        });
      } else {
        domStyle.set(this._source, {
          zIndex: 8000,
        });
      }
    } else {
      domStyle.set(this._source, {
        zIndex: this.zIndex,
      });
    }
    domStyle.set(this._source, {
      opacity: '0.3',
      position: 'absolute',
      width: domGeom.position(this._container, false).w + 'px',
      top: this._position.y - this._position.offset + 'px',
    });
    domStyle.set(this._container, {
      overflow: 'hidden',
    });
    this.applyStyling();
    return this;
  },
  applyStyling: function applyStyling() {
    if (this._previousElement) {
      this._previousElement.previousMargin = domStyle.get(this._previousElement, 'marginBottom');
      this.setMargins(this._previousElement, 'bottom');
    } else {
      this._nextElement.previousMargin = domStyle.get(this._nextElement, 'marginTop');
      this.setMargins(this._nextElement, 'top');
    }
    return this;
  },
  clearValues: function clearValues() {
    this._source = null;
    this._previousElement = null;
    this._nextElement = null;
    this._position = null;
    this._isDragging = false;
  },
  computeMovement: function computeMovement(touch = {}) {
    const sourceTop = touch.pageY - (this._position.h / 2);
    this.computePrevNext(this.getPositionOf(this._source).y);
    domStyle.set(this._source, {
      top: sourceTop - this._position.offset + 'px',
    });
    return this;
  },
  computePrevNext: function computePrevNext(sourceTop = {}) {
    const sourceBot = sourceTop + this._position.h;
    if (this._previousElement) {
      // This is the case where the selected element is the last element of the container
      const prevPosition = this.getPositionOf(this._previousElement);
      if (!(sourceTop > (prevPosition.y + (prevPosition.h / 2)))) {
        this.resetMargins(this._previousElement, 'bottom');
        this._nextElement = this._previousElement;
        this._previousElement = this._previousElement.previousSibling;
        if (this._previousElement === this._source) {
          this._previousElement = this._previousElement.previousSibling;
        }
        this.applyStyling();
      } else if (this._nextElement) {
        // This is the case where the selected element is between two elements in the container
        const nextPosition = this.getPositionOf(this._nextElement);
        if (!(sourceBot < (nextPosition.y + (nextPosition.h / 2)))) {
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
      const nextPosition = this.getPositionOf(this._nextElement);
      if (!(sourceBot < (nextPosition.y + (nextPosition.h / 2)))) {
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
  findSource: function findSource(element = {}) {
    if (this._class) {
      return this.findSourceFromClass(element);
    } else if (this._type) {
      return this.findSourceFromType(element);
    }
    return null;
  },
  findSourceFromType: function findSourceFromType(element = {}) {
    if (element === this._container) {
      return false;
    }
    if (element.localName === this._type) {
      return element;
    }
    return this.findSourceFromType(element.parentNode);
  },
  findSourceFromClass: function findSourceFromClass(element = {}) {
    if (element === this._container) {
      return false;
    }
    if (array.indexOf(element.classList, this._class) !== -1) {
      return element;
    }
    return this.findSourceFromType(element.parentNode);
  },
  getPositionOf: function getPositionOf(element = {}) {
    const position = domGeom.position(element, this.includeScroll);
    if (position.y !== element.offsetTop) {
      position.offset = position.y - element.offsetTop;
    } else {
      position.offset = 0;
    }
    return position;
  },
  onTouchStart: function onTouchStart(touch = {}) {
    this._source = this.findSource(touch.target);
    if (this._source) {
      this._position = this.getPositionOf(this._source);
      this._previousElement = this._source.previousSibling;
      this._nextElement = this._source.nextSibling;
    }
  },
  onTouchMove: function onTouchMove(touch = {}) {
    if (this._source) {
      const touchMovement = touch.changedTouches[0];
      if (touchMovement) {
        if (!this._isDragging) {
          this._isDragging = true;
          this.applyInitialStyling();
        }
        this.computeMovement(touchMovement);
      }
    }
  },
  onTouchEnd: function onTouchEnd(touch = {}) {
    if (this._source) {
      this.placeItem(touch)
          .removeStyling()
          .clearValues();
    }
  },
  placeItem: function placeItem() {
    this._source = this._container.removeChild(this._source);
    if (this._previousElement) {
      // This accounts for when the source is between two nodes or the last element in the container
      domConstruct.place(this._source, this._previousElement, 'after');
    } else {
      // This is the situation in which the source was placed as the first element of the container
      domConstruct.place(this._source, this._nextElement, 'before');
    }
    domStyle.set(this._source, {
      top: '',
    });
    return this;
  },
  removeStyling: function removeStyling() {
    domStyle.set(this._source, {
      opacity: '',
      zIndex: '',
      position: '',
      width: '',
    });
    domStyle.set(this._container, {
      overflow: '',
    });
    if (this._previousElement) {
      this.resetMargins(this._previousElement, 'bottom');
    } else {
      this.resetMargins(this._nextElement, 'top');
    }
    return this;
  },
  resetMargins: function resetMargins(element = {}, marginType = {}) {
    if (marginType === 'bottom') {
      domStyle.set(element, {
        marginBottom: element.previousMargin + 'px',
      });
    }else if (marginType === 'top') {
      domStyle.set(element, {
        marginTop: element.previousMargin + 'px',
      });
    }
    return this;
  },
  setClass: function setClass(className = {}) {
    this._class = className;
    return this;
  },
  setMargins: function setMargins(element = {}, marginType = {}) {
    let sourceMargins = domStyle.get(this._source, 'marginBottom') + domStyle.get(this._source, 'marginTop');
    if (!(sourceMargins > 0)) {
      sourceMargins = 0;
    }
    if (marginType === 'bottom') {
      domStyle.set(element, {
        marginBottom: element.previousMargin + sourceMargins + this._position.h + 'px',
      });
    }else if (marginType === 'top') {
      domStyle.set(element, {
        marginTop: element.previousMargin + sourceMargins + this._position.h + 'px',
      });
    }
    return this;
  },
  setType: function setType(type = {}) {
    this._type = type;
    return this;
  },
  setupDraggable: function setupDraggable(container = {}) {
    if (container) {
      this._container = container;
      this._container.addEventListener('touchstart', this.onTouchStart.bind(this), false);
      this._container.addEventListener('touchmove', this.onTouchMove.bind(this), false);
      this._container.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }
    return this;
  },
});

export default __class;
