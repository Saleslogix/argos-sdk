define('argos/WidgetBase', ['module', 'exports'], function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var WidgetBase = function () {
    function WidgetBase() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, WidgetBase);

      this.id = options.id || 'generic_widgetbase';
      this.srcNodeRef = null;
      this.domNode = null;
      this.containerNode = null;
      this.ownerDocument = null;
      this.title = '';
      this._started = false;
    }

    _createClass(WidgetBase, [{
      key: 'initSoho',
      value: function initSoho() {}
    }, {
      key: 'updateSoho',
      value: function updateSoho() {}
    }, {
      key: 'get',
      value: function get(prop) {
        console.warn('Attempting to get ' + prop);
      }
    }, {
      key: 'set',
      value: function set(prop, val) {
        console.warn('Attempting to set ' + prop + ' to ' + val);
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        console.warn('subscribe is deprecated.');
      }
    }, {
      key: 'postscript',
      value: function postscript(params, srcNodeRef) {
        this.create(params, srcNodeRef);
      }
    }, {
      key: 'create',
      value: function create(params, srcNodeRef) {
        this.srcNodeRef = $(srcNodeRef);
        this.params = params;
        this.postMixInProperties();

        var srcNodeRefDom = this.srcNodeRef.get(0);
        this.ownerDocument = this.ownerDocument || (srcNodeRefDom ? srcNodeRefDom.ownerDocument : document);

        this.buildRendering();
        this.postCreate();
      }
    }, {
      key: 'postMixInProperties',
      value: function postMixInProperties() {}
    }, {
      key: 'buildRendering',
      value: function buildRendering() {
        var root = null;
        if (this.widgetTemplate && this.widgetTemplate.constructor === Simplate) {
          var templateString = this.widgetTemplate.apply(this);
          root = $(templateString, this.ownerDocument);
        } else if (typeof this.widgetTemplate === 'string') {
          root = $(this.widgetTemplate, this.ownerDocument);
        } else if (this.widgetTemplate instanceof HTMLElement) {
          root = $(this.widgetTemplate).clone();
        }

        if (root.length > 1) {
          root.wrap('<div></div>');
        }

        this.domNode = root.get(0);
      }
    }, {
      key: 'postCreate',
      value: function postCreate() {}
    }, {
      key: 'startup',
      value: function startup() {}
    }, {
      key: 'resize',
      value: function resize() {}
    }, {
      key: 'destroy',
      value: function destroy(preserveDom) {}
    }, {
      key: 'destroyRecursive',
      value: function destroyRecursive(preserveDom) {}
    }, {
      key: 'destroyRendering',
      value: function destroyRendering(preserveDom) {}
    }, {
      key: 'destroyDescendants',
      value: function destroyDescendants(preserveDom) {}
    }, {
      key: 'uninitialize',
      value: function uninitialize() {}
    }, {
      key: 'toString',
      value: function toString() {}
    }, {
      key: 'getChildren',
      value: function getChildren() {}
    }, {
      key: 'getParent',
      value: function getParent() {}
    }, {
      key: 'placeAt',
      value: function placeAt(reference, position) {}
    }]);

    return WidgetBase;
  }();

  exports.default = WidgetBase;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9XaWRnZXRCYXNlLmpzIl0sIm5hbWVzIjpbIldpZGdldEJhc2UiLCJvcHRpb25zIiwiaWQiLCJzcmNOb2RlUmVmIiwiZG9tTm9kZSIsImNvbnRhaW5lck5vZGUiLCJvd25lckRvY3VtZW50IiwidGl0bGUiLCJfc3RhcnRlZCIsInByb3AiLCJjb25zb2xlIiwid2FybiIsInZhbCIsInBhcmFtcyIsImNyZWF0ZSIsIiQiLCJwb3N0TWl4SW5Qcm9wZXJ0aWVzIiwic3JjTm9kZVJlZkRvbSIsImdldCIsImRvY3VtZW50IiwiYnVpbGRSZW5kZXJpbmciLCJwb3N0Q3JlYXRlIiwicm9vdCIsIndpZGdldFRlbXBsYXRlIiwiY29uc3RydWN0b3IiLCJTaW1wbGF0ZSIsInRlbXBsYXRlU3RyaW5nIiwiYXBwbHkiLCJIVE1MRWxlbWVudCIsImNsb25lIiwibGVuZ3RoIiwid3JhcCIsInByZXNlcnZlRG9tIiwicmVmZXJlbmNlIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUJNQSxVO0FBQ0osMEJBQTBCO0FBQUEsVUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUN4QixXQUFLQyxFQUFMLEdBQVVELFFBQVFDLEVBQVIsSUFBYyxvQkFBeEI7QUFDQSxXQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxXQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFdBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0EsV0FBS0MsUUFBTCxHQUFnQixLQUFoQjtBQUNEOzs7O2lDQUVVLENBQ1Y7OzttQ0FFWSxDQUNaOzs7MEJBRUdDLEksRUFBTTtBQUNSQyxnQkFBUUMsSUFBUix3QkFBa0NGLElBQWxDO0FBQ0Q7OzswQkFFR0EsSSxFQUFNRyxHLEVBQUs7QUFDYkYsZ0JBQVFDLElBQVIsd0JBQWtDRixJQUFsQyxZQUE2Q0csR0FBN0M7QUFDRDs7O2tDQUVXO0FBQ1ZGLGdCQUFRQyxJQUFSLENBQWEsMEJBQWI7QUFDRDs7O2lDQUVVRSxNLEVBQVFWLFUsRUFBWTtBQUM3QixhQUFLVyxNQUFMLENBQVlELE1BQVosRUFBb0JWLFVBQXBCO0FBQ0Q7Ozs2QkFFTVUsTSxFQUFRVixVLEVBQVk7QUFDekIsYUFBS0EsVUFBTCxHQUFrQlksRUFBRVosVUFBRixDQUFsQjtBQUNBLGFBQUtVLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQUtHLG1CQUFMOztBQUVBLFlBQU1DLGdCQUFnQixLQUFLZCxVQUFMLENBQWdCZSxHQUFoQixDQUFvQixDQUFwQixDQUF0QjtBQUNBLGFBQUtaLGFBQUwsR0FBcUIsS0FBS0EsYUFBTCxLQUF1QlcsZ0JBQWdCQSxjQUFjWCxhQUE5QixHQUE4Q2EsUUFBckUsQ0FBckI7O0FBRUEsYUFBS0MsY0FBTDtBQUNBLGFBQUtDLFVBQUw7QUFDRDs7OzRDQUVxQixDQUNyQjs7O3VDQUVnQjtBQUNmLFlBQUlDLE9BQU8sSUFBWDtBQUNBLFlBQUksS0FBS0MsY0FBTCxJQUF1QixLQUFLQSxjQUFMLENBQW9CQyxXQUFwQixLQUFvQ0MsUUFBL0QsRUFBeUU7QUFDdkUsY0FBTUMsaUJBQWlCLEtBQUtILGNBQUwsQ0FBb0JJLEtBQXBCLENBQTBCLElBQTFCLENBQXZCO0FBQ0FMLGlCQUFPUCxFQUFFVyxjQUFGLEVBQWtCLEtBQUtwQixhQUF2QixDQUFQO0FBQ0QsU0FIRCxNQUdPLElBQUksT0FBTyxLQUFLaUIsY0FBWixLQUErQixRQUFuQyxFQUE2QztBQUNsREQsaUJBQU9QLEVBQUUsS0FBS1EsY0FBUCxFQUF1QixLQUFLakIsYUFBNUIsQ0FBUDtBQUNELFNBRk0sTUFFQSxJQUFJLEtBQUtpQixjQUFMLFlBQStCSyxXQUFuQyxFQUFnRDtBQUNyRE4saUJBQU9QLEVBQUUsS0FBS1EsY0FBUCxFQUF1Qk0sS0FBdkIsRUFBUDtBQUNEOztBQUVELFlBQUlQLEtBQUtRLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNuQlIsZUFBS1MsSUFBTCxDQUFVLGFBQVY7QUFDRDs7QUFFRCxhQUFLM0IsT0FBTCxHQUFla0IsS0FBS0osR0FBTCxDQUFTLENBQVQsQ0FBZjtBQUNEOzs7bUNBRVksQ0FDWjs7O2dDQUVTLENBQ1Q7OzsrQkFFUSxDQUNSOzs7OEJBRU9jLFcsRUFBYSxDQUNwQjs7O3VDQUVnQkEsVyxFQUFhLENBQzdCOzs7dUNBRWdCQSxXLEVBQWEsQ0FDN0I7Ozt5Q0FFa0JBLFcsRUFBYSxDQUMvQjs7O3FDQUVjLENBQ2Q7OztpQ0FFVSxDQUNWOzs7b0NBRWEsQ0FDYjs7O2tDQUVXLENBQ1g7Ozs4QkFFT0MsUyxFQUFXQyxRLEVBQVUsQ0FDNUI7Ozs7OztvQkFHWWxDLFUiLCJmaWxlIjoiV2lkZ2V0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qIGVzbGludC1kaXNhYmxlICovIC8vIFRPRE86IFJlbW92ZSB0aGlzIGxhdGVyXHJcblxyXG5jbGFzcyBXaWRnZXRCYXNlIHtcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkIHx8ICdnZW5lcmljX3dpZGdldGJhc2UnO1xyXG4gICAgdGhpcy5zcmNOb2RlUmVmID0gbnVsbDtcclxuICAgIHRoaXMuZG9tTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmNvbnRhaW5lck5vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5vd25lckRvY3VtZW50ID0gbnVsbDtcclxuICAgIHRoaXMudGl0bGUgPSAnJztcclxuICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGluaXRTb2hvKCkge1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlU29obygpIHtcclxuICB9XHJcblxyXG4gIGdldChwcm9wKSB7XHJcbiAgICBjb25zb2xlLndhcm4oYEF0dGVtcHRpbmcgdG8gZ2V0ICR7cHJvcH1gKTtcclxuICB9XHJcblxyXG4gIHNldChwcm9wLCB2YWwpIHtcclxuICAgIGNvbnNvbGUud2FybihgQXR0ZW1wdGluZyB0byBzZXQgJHtwcm9wfSB0byAke3ZhbH1gKTtcclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSgpIHtcclxuICAgIGNvbnNvbGUud2Fybignc3Vic2NyaWJlIGlzIGRlcHJlY2F0ZWQuJyk7XHJcbiAgfVxyXG5cclxuICBwb3N0c2NyaXB0KHBhcmFtcywgc3JjTm9kZVJlZikge1xyXG4gICAgdGhpcy5jcmVhdGUocGFyYW1zLCBzcmNOb2RlUmVmKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShwYXJhbXMsIHNyY05vZGVSZWYpIHtcclxuICAgIHRoaXMuc3JjTm9kZVJlZiA9ICQoc3JjTm9kZVJlZik7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMucG9zdE1peEluUHJvcGVydGllcygpO1xyXG5cclxuICAgIGNvbnN0IHNyY05vZGVSZWZEb20gPSB0aGlzLnNyY05vZGVSZWYuZ2V0KDApO1xyXG4gICAgdGhpcy5vd25lckRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50IHx8IChzcmNOb2RlUmVmRG9tID8gc3JjTm9kZVJlZkRvbS5vd25lckRvY3VtZW50IDogZG9jdW1lbnQpO1xyXG5cclxuICAgIHRoaXMuYnVpbGRSZW5kZXJpbmcoKTtcclxuICAgIHRoaXMucG9zdENyZWF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcG9zdE1peEluUHJvcGVydGllcygpIHtcclxuICB9XHJcblxyXG4gIGJ1aWxkUmVuZGVyaW5nKCkge1xyXG4gICAgbGV0IHJvb3QgPSBudWxsO1xyXG4gICAgaWYgKHRoaXMud2lkZ2V0VGVtcGxhdGUgJiYgdGhpcy53aWRnZXRUZW1wbGF0ZS5jb25zdHJ1Y3RvciA9PT0gU2ltcGxhdGUpIHtcclxuICAgICAgY29uc3QgdGVtcGxhdGVTdHJpbmcgPSB0aGlzLndpZGdldFRlbXBsYXRlLmFwcGx5KHRoaXMpO1xyXG4gICAgICByb290ID0gJCh0ZW1wbGF0ZVN0cmluZywgdGhpcy5vd25lckRvY3VtZW50KTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMud2lkZ2V0VGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJvb3QgPSAkKHRoaXMud2lkZ2V0VGVtcGxhdGUsIHRoaXMub3duZXJEb2N1bWVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMud2lkZ2V0VGVtcGxhdGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICByb290ID0gJCh0aGlzLndpZGdldFRlbXBsYXRlKS5jbG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyb290Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgcm9vdC53cmFwKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZG9tTm9kZSA9IHJvb3QuZ2V0KDApO1xyXG4gIH1cclxuXHJcbiAgcG9zdENyZWF0ZSgpIHtcclxuICB9XHJcblxyXG4gIHN0YXJ0dXAoKSB7XHJcbiAgfVxyXG5cclxuICByZXNpemUoKSB7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KHByZXNlcnZlRG9tKSB7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95UmVjdXJzaXZlKHByZXNlcnZlRG9tKSB7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95UmVuZGVyaW5nKHByZXNlcnZlRG9tKSB7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95RGVzY2VuZGFudHMocHJlc2VydmVEb20pIHtcclxuICB9XHJcblxyXG4gIHVuaW5pdGlhbGl6ZSgpIHtcclxuICB9XHJcblxyXG4gIHRvU3RyaW5nKCkge1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2hpbGRyZW4oKSB7XHJcbiAgfVxyXG5cclxuICBnZXRQYXJlbnQoKSB7XHJcbiAgfVxyXG5cclxuICBwbGFjZUF0KHJlZmVyZW5jZSwgcG9zaXRpb24pIHtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdpZGdldEJhc2U7XHJcbiJdfQ==