define('argos/Dropdown', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', './_Templated'], function (module, exports, _declare, _WidgetBase2, _Templated2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Dropdown
   */
  var __class = (0, _declare2.default)('argos.Dropdown', [_WidgetBase3.default, _Templated3.default], {
    widgetTemplate: new Simplate(['<div class="field">', '<label for="{%= $.id %}_dropdownNode" class="label">{%: $.label %}</label>', '<select id="{%= $.id %}_dropdownNode" class="dropdown {%: $.dropdownClass %}" data-dojo-attach-point="dropdownSelect"></select>', '</div>']),
    selectItemTemplate: new Simplate(['<option value="{%= $.value %}">', '{% if ($.text) { %}', '{%= $.text %}', '{% } else { %}', '{%= $.value %}', '{% } %}', '</option>']),

    dropdownClass: '',
    id: 'dropdown-template',
    multiSelect: false,
    onSelect: null,
    onSelectScope: null,
    _eventConnections: null,
    _list: null,
    _selected: null,
    items: null,
    itemMustExist: true,
    selectedItem: null,
    constructor: function constructor() {
      this._eventConnections = [];
      this.items = [];
    },
    createList: function createList(_ref) {
      var _this = this;

      var items = _ref.items,
          defaultValue = _ref.defaultValue;

      var itemFound = null;
      this.items = items ? items : [];
      this._defaultValue = defaultValue;

      items.forEach(function (item) {
        if (item.value === defaultValue) {
          itemFound = item;
        }
      }, this);
      if (this.itemMustExist && !itemFound) {
        itemFound = { key: -1, value: defaultValue, text: defaultValue };
        this.items.splice(0, 0, itemFound);
      }

      items.forEach(function (item) {
        var option = $(_this.selectItemTemplate.apply({
          key: item.key,
          value: item.value,
          text: item.text
        }, _this));
        $(_this.dropdownSelect).append(option);
      });

      $(this.dropdownSelect).dropdown({
        noSearch: true
      });
      if (itemFound) {
        this.setValue(itemFound.value);
      }
      if (this.onSelect) {
        $(this.dropdownSelect).on('change', this.onSelect.bind(this.onSelectScope || this));
      }
      return this;
    },
    destroy: function destroy() {
      this._eventConnections.forEach(function (evt) {
        evt.remove();
      });
      this._eventConnections = [];
      this.inherited(destroy, arguments);
    },
    findValue: function findValue(text) {
      var value = this._list.children.filter(function (element) {
        return element.innerText === text;
      });
      return value[0];
    },
    getSelected: function getSelected() {
      return this._selected;
    },
    getText: function getText() {
      var text = this.dropdownSelect.options[this.dropdownSelect.selectedIndex] ? this.dropdownSelect.options[this.dropdownSelect.selectedIndex].text : '';
      return text;
    },
    getValue: function getValue() {
      var value = this.dropdownSelect.options[this.dropdownSelect.selectedIndex].value;
      return value;
    },
    postCreate: function postCreate() {
      this.inherited(postCreate, arguments);
    },
    setValue: function setValue(value) {
      if (value === 0 || value) {
        this.dropdownSelect.value = value;
        $(this.dropdownSelect).data('dropdown').updated();
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ecm9wZG93bi5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInNlbGVjdEl0ZW1UZW1wbGF0ZSIsImRyb3Bkb3duQ2xhc3MiLCJpZCIsIm11bHRpU2VsZWN0Iiwib25TZWxlY3QiLCJvblNlbGVjdFNjb3BlIiwiX2V2ZW50Q29ubmVjdGlvbnMiLCJfbGlzdCIsIl9zZWxlY3RlZCIsIml0ZW1zIiwiaXRlbU11c3RFeGlzdCIsInNlbGVjdGVkSXRlbSIsImNvbnN0cnVjdG9yIiwiY3JlYXRlTGlzdCIsImRlZmF1bHRWYWx1ZSIsIml0ZW1Gb3VuZCIsIl9kZWZhdWx0VmFsdWUiLCJmb3JFYWNoIiwiaXRlbSIsInZhbHVlIiwia2V5IiwidGV4dCIsInNwbGljZSIsIm9wdGlvbiIsIiQiLCJhcHBseSIsImRyb3Bkb3duU2VsZWN0IiwiYXBwZW5kIiwiZHJvcGRvd24iLCJub1NlYXJjaCIsInNldFZhbHVlIiwib24iLCJiaW5kIiwiZGVzdHJveSIsImV2dCIsInJlbW92ZSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImZpbmRWYWx1ZSIsImNoaWxkcmVuIiwiZmlsdGVyIiwiZWxlbWVudCIsImlubmVyVGV4dCIsImdldFNlbGVjdGVkIiwiZ2V0VGV4dCIsIm9wdGlvbnMiLCJzZWxlY3RlZEluZGV4IiwiZ2V0VmFsdWUiLCJwb3N0Q3JlYXRlIiwiZGF0YSIsInVwZGF0ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7QUFHQSxNQUFNQSxVQUFVLHVCQUFRLGdCQUFSLEVBQTBCLDJDQUExQixFQUFxRDtBQUNuRUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixxQkFEMkIsRUFFM0IsNEVBRjJCLEVBRzNCLGlJQUgyQixFQUkzQixRQUoyQixDQUFiLENBRG1EO0FBT25FQyx3QkFBb0IsSUFBSUQsUUFBSixDQUFhLENBQy9CLGlDQUQrQixFQUUvQixxQkFGK0IsRUFHL0IsZUFI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KiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4vX1RlbXBsYXRlZCc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5Ecm9wZG93blxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkRyb3Bkb3duJywgW19XaWRnZXRCYXNlLCBfVGVtcGxhdGVkXSwge1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJmaWVsZFwiPicsXHJcbiAgICAnPGxhYmVsIGZvcj1cInslPSAkLmlkICV9X2Ryb3Bkb3duTm9kZVwiIGNsYXNzPVwibGFiZWxcIj57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8c2VsZWN0IGlkPVwieyU9ICQuaWQgJX1fZHJvcGRvd25Ob2RlXCIgY2xhc3M9XCJkcm9wZG93biB7JTogJC5kcm9wZG93bkNsYXNzICV9XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImRyb3Bkb3duU2VsZWN0XCI+PC9zZWxlY3Q+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHNlbGVjdEl0ZW1UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8b3B0aW9uIHZhbHVlPVwieyU9ICQudmFsdWUgJX1cIj4nLFxyXG4gICAgJ3slIGlmICgkLnRleHQpIHsgJX0nLFxyXG4gICAgJ3slPSAkLnRleHQgJX0nLFxyXG4gICAgJ3slIH0gZWxzZSB7ICV9JyxcclxuICAgICd7JT0gJC52YWx1ZSAlfScsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAnPC9vcHRpb24+JyxcclxuICBdKSxcclxuXHJcbiAgZHJvcGRvd25DbGFzczogJycsXHJcbiAgaWQ6ICdkcm9wZG93bi10ZW1wbGF0ZScsXHJcbiAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxyXG4gIG9uU2VsZWN0OiBudWxsLFxyXG4gIG9uU2VsZWN0U2NvcGU6IG51bGwsXHJcbiAgX2V2ZW50Q29ubmVjdGlvbnM6IG51bGwsXHJcbiAgX2xpc3Q6IG51bGwsXHJcbiAgX3NlbGVjdGVkOiBudWxsLFxyXG4gIGl0ZW1zOiBudWxsLFxyXG4gIGl0ZW1NdXN0RXhpc3Q6IHRydWUsXHJcbiAgc2VsZWN0ZWRJdGVtOiBudWxsLFxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX2V2ZW50Q29ubmVjdGlvbnMgPSBbXTtcclxuICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICB9LFxyXG4gIGNyZWF0ZUxpc3Q6IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoeyBpdGVtcywgZGVmYXVsdFZhbHVlIH0pIHtcclxuICAgIGxldCBpdGVtRm91bmQgPSBudWxsO1xyXG4gICAgdGhpcy5pdGVtcyA9IChpdGVtcykgPyBpdGVtcyA6IFtdO1xyXG4gICAgdGhpcy5fZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlO1xyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgIGl0ZW1Gb3VuZCA9IGl0ZW07XHJcbiAgICAgIH1cclxuICAgIH0sIHRoaXMpO1xyXG4gICAgaWYgKHRoaXMuaXRlbU11c3RFeGlzdCAmJiAhaXRlbUZvdW5kKSB7XHJcbiAgICAgIGl0ZW1Gb3VuZCA9IHsga2V5OiAtMSwgdmFsdWU6IGRlZmF1bHRWYWx1ZSwgdGV4dDogZGVmYXVsdFZhbHVlIH07XHJcbiAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKDAsIDAsIGl0ZW1Gb3VuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb24gPSAkKHRoaXMuc2VsZWN0SXRlbVRlbXBsYXRlLmFwcGx5KHtcclxuICAgICAgICBrZXk6IGl0ZW0ua2V5LFxyXG4gICAgICAgIHZhbHVlOiBpdGVtLnZhbHVlLFxyXG4gICAgICAgIHRleHQ6IGl0ZW0udGV4dCxcclxuICAgICAgfSwgdGhpcykpO1xyXG4gICAgICAkKHRoaXMuZHJvcGRvd25TZWxlY3QpLmFwcGVuZChvcHRpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh0aGlzLmRyb3Bkb3duU2VsZWN0KS5kcm9wZG93bih7XHJcbiAgICAgIG5vU2VhcmNoOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICBpZiAoaXRlbUZvdW5kKSB7XHJcbiAgICAgIHRoaXMuc2V0VmFsdWUoaXRlbUZvdW5kLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLm9uU2VsZWN0KSB7XHJcbiAgICAgICQodGhpcy5kcm9wZG93blNlbGVjdCkub24oJ2NoYW5nZScsIHRoaXMub25TZWxlY3QuYmluZCh0aGlzLm9uU2VsZWN0U2NvcGUgfHwgdGhpcykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5fZXZlbnRDb25uZWN0aW9ucy5mb3JFYWNoKChldnQpID0+IHtcclxuICAgICAgZXZ0LnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLl9ldmVudENvbm5lY3Rpb25zID0gW107XHJcbiAgICB0aGlzLmluaGVyaXRlZChkZXN0cm95LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgZmluZFZhbHVlOiBmdW5jdGlvbiBmaW5kVmFsdWUodGV4dCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9saXN0LmNoaWxkcmVuLmZpbHRlcigoZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gZWxlbWVudC5pbm5lclRleHQgPT09IHRleHQ7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB2YWx1ZVswXTtcclxuICB9LFxyXG4gIGdldFNlbGVjdGVkOiBmdW5jdGlvbiBnZXRTZWxlY3RlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcclxuICB9LFxyXG4gIGdldFRleHQ6IGZ1bmN0aW9uIGdldFRleHQoKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gKHRoaXMuZHJvcGRvd25TZWxlY3Qub3B0aW9uc1t0aGlzLmRyb3Bkb3duU2VsZWN0LnNlbGVjdGVkSW5kZXhdKSA/IHRoaXMuZHJvcGRvd25TZWxlY3Qub3B0aW9uc1t0aGlzLmRyb3Bkb3duU2VsZWN0LnNlbGVjdGVkSW5kZXhdLnRleHQgOiAnJztcclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH0sXHJcbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmRyb3Bkb3duU2VsZWN0Lm9wdGlvbnNbdGhpcy5kcm9wZG93blNlbGVjdC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9LFxyXG4gIHBvc3RDcmVhdGU6IGZ1bmN0aW9uIHBvc3RDcmVhdGUoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChwb3N0Q3JlYXRlLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09IDAgfHwgdmFsdWUpIHtcclxuICAgICAgdGhpcy5kcm9wZG93blNlbGVjdC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAkKHRoaXMuZHJvcGRvd25TZWxlY3QpLmRhdGEoJ2Ryb3Bkb3duJykudXBkYXRlZCgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19