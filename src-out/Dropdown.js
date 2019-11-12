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
      this.inherited(arguments);
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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ecm9wZG93bi5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInNlbGVjdEl0ZW1UZW1wbGF0ZSIsImRyb3Bkb3duQ2xhc3MiLCJpZCIsIm11bHRpU2VsZWN0Iiwib25TZWxlY3QiLCJvblNlbGVjdFNjb3BlIiwiX2V2ZW50Q29ubmVjdGlvbnMiLCJfbGlzdCIsIl9zZWxlY3RlZCIsIml0ZW1zIiwiaXRlbU11c3RFeGlzdCIsInNlbGVjdGVkSXRlbSIsImNvbnN0cnVjdG9yIiwiY3JlYXRlTGlzdCIsImRlZmF1bHRWYWx1ZSIsIml0ZW1Gb3VuZCIsIl9kZWZhdWx0VmFsdWUiLCJmb3JFYWNoIiwiaXRlbSIsInZhbHVlIiwia2V5IiwidGV4dCIsInNwbGljZSIsIm9wdGlvbiIsIiQiLCJhcHBseSIsImRyb3Bkb3duU2VsZWN0IiwiYXBwZW5kIiwiZHJvcGRvd24iLCJub1NlYXJjaCIsInNldFZhbHVlIiwib24iLCJiaW5kIiwiZGVzdHJveSIsImV2dCIsInJlbW92ZSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImZpbmRWYWx1ZSIsImNoaWxkcmVuIiwiZmlsdGVyIiwiZWxlbWVudCIsImlubmVyVGV4dCIsImdldFNlbGVjdGVkIiwiZ2V0VGV4dCIsIm9wdGlvbnMiLCJzZWxlY3RlZEluZGV4IiwiZ2V0VmFsdWUiLCJwb3N0Q3JlYXRlIiwiZGF0YSIsInVwZGF0ZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7QUFHQSxNQUFNQSxVQUFVLHVCQUFRLGdCQUFSLEVBQTBCLDJDQUExQixFQUFxRDtBQUNuRUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixxQkFEMkIsRUFFM0IsNEVBRjJCLEVBRzNCLGlJQUgyQixFQUkzQixRQUoyQixDQUFiLENBRG1EO0FBT25FQyx3QkFBb0IsSUFBSUQsUUFBSixDQUFhLENBQy9CLGlDQUQrQixFQUUvQixxQkFGK0IsRUFHL0IsZUFI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T0FGYSxDQUFkO0FBR0EsYUFBT0YsTUFBTSxDQUFOLENBQVA7QUFDRCxLQS9Fa0U7QUFnRm5Fd0IsaUJBQWEsU0FBU0EsV0FBVCxHQUF1QjtBQUNsQyxhQUFPLEtBQUtuQyxTQUFaO0FBQ0QsS0FsRmtFO0FBbUZuRW9DLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUMxQixVQUFNdkIsT0FBUSxLQUFLSyxjQUFMLENBQW9CbUIsT0FBcEIsQ0FBNEIsS0FBS25CLGNBQUwsQ0FBb0JvQixhQUFoRCxDQUFELEdBQW1FLEtBQUtwQixjQUFMLENBQW9CbUIsT0FBcEIsQ0FBNEIsS0FBS25CLGNBQUwsQ0FBb0JvQixhQUFoRCxFQUErRHpCLElBQWxJLEdBQXlJLEVBQXRKO0FBQ0EsYUFBT0EsSUFBUDtBQUNELEtBdEZrRTtBQXVGbkUwQixjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUIsVUFBTTVCLFFBQVEsS0FBS08sY0FBTCxDQUFvQm1CLE9BQXBCLENBQTRCLEtBQUtuQixjQUFMLENBQW9Cb0IsYUFBaEQsRUFBK0QzQixLQUE3RTtBQUNBLGFBQU9BLEtBQVA7QUFDRCxLQTFGa0U7QUEyRm5FNkIsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxXQUFLWixTQUFMLENBQWVDLFNBQWY7QUFDRCxLQTdGa0U7QUE4Rm5FUCxjQUFVLFNBQVNBLFFBQVQsQ0FBa0JYLEtBQWxCLEVBQXlCO0FBQ2pDLFVBQUlBLFVBQVUsQ0FBVixJQUFlQSxLQUFuQixFQUEwQjtBQUN4QixhQUFLTyxjQUFMLENBQW9CUCxLQUFwQixHQUE0QkEsS0FBNUI7QUFDQUssVUFBRSxLQUFLRSxjQUFQLEVBQXVCdUIsSUFBdkIsQ0FBNEIsVUFBNUIsRUFBd0NDLE9BQXhDO0FBQ0Q7QUFDRjtBQW5Ha0UsR0FBckQsQ0FBaEIsQyxDQXZCQTs7Ozs7Ozs7Ozs7Ozs7O29CQTZIZXJELE8iLCJmaWxlIjoiRHJvcGRvd24uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuL19UZW1wbGF0ZWQnO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRHJvcGRvd25cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5Ecm9wZG93bicsIFtfV2lkZ2V0QmFzZSwgX1RlbXBsYXRlZF0sIHtcclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiZmllbGRcIj4nLFxyXG4gICAgJzxsYWJlbCBmb3I9XCJ7JT0gJC5pZCAlfV9kcm9wZG93bk5vZGVcIiBjbGFzcz1cImxhYmVsXCI+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNlbGVjdCBpZD1cInslPSAkLmlkICV9X2Ryb3Bkb3duTm9kZVwiIGNsYXNzPVwiZHJvcGRvd24geyU6ICQuZHJvcGRvd25DbGFzcyAlfVwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJkcm9wZG93blNlbGVjdFwiPjwvc2VsZWN0PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBzZWxlY3RJdGVtVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPG9wdGlvbiB2YWx1ZT1cInslPSAkLnZhbHVlICV9XCI+JyxcclxuICAgICd7JSBpZiAoJC50ZXh0KSB7ICV9JyxcclxuICAgICd7JT0gJC50ZXh0ICV9JyxcclxuICAgICd7JSB9IGVsc2UgeyAlfScsXHJcbiAgICAneyU9ICQudmFsdWUgJX0nLFxyXG4gICAgJ3slIH0gJX0nLFxyXG4gICAgJzwvb3B0aW9uPicsXHJcbiAgXSksXHJcblxyXG4gIGRyb3Bkb3duQ2xhc3M6ICcnLFxyXG4gIGlkOiAnZHJvcGRvd24tdGVtcGxhdGUnLFxyXG4gIG11bHRpU2VsZWN0OiBmYWxzZSxcclxuICBvblNlbGVjdDogbnVsbCxcclxuICBvblNlbGVjdFNjb3BlOiBudWxsLFxyXG4gIF9ldmVudENvbm5lY3Rpb25zOiBudWxsLFxyXG4gIF9saXN0OiBudWxsLFxyXG4gIF9zZWxlY3RlZDogbnVsbCxcclxuICBpdGVtczogbnVsbCxcclxuICBpdGVtTXVzdEV4aXN0OiB0cnVlLFxyXG4gIHNlbGVjdGVkSXRlbTogbnVsbCxcclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9ldmVudENvbm5lY3Rpb25zID0gW107XHJcbiAgICB0aGlzLml0ZW1zID0gW107XHJcbiAgfSxcclxuICBjcmVhdGVMaXN0OiBmdW5jdGlvbiBjcmVhdGVMaXN0KHsgaXRlbXMsIGRlZmF1bHRWYWx1ZSB9KSB7XHJcbiAgICBsZXQgaXRlbUZvdW5kID0gbnVsbDtcclxuICAgIHRoaXMuaXRlbXMgPSAoaXRlbXMpID8gaXRlbXMgOiBbXTtcclxuICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnZhbHVlID09PSBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICBpdGVtRm91bmQgPSBpdGVtO1xyXG4gICAgICB9XHJcbiAgICB9LCB0aGlzKTtcclxuICAgIGlmICh0aGlzLml0ZW1NdXN0RXhpc3QgJiYgIWl0ZW1Gb3VuZCkge1xyXG4gICAgICBpdGVtRm91bmQgPSB7IGtleTogLTEsIHZhbHVlOiBkZWZhdWx0VmFsdWUsIHRleHQ6IGRlZmF1bHRWYWx1ZSB9O1xyXG4gICAgICB0aGlzLml0ZW1zLnNwbGljZSgwLCAwLCBpdGVtRm91bmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3Qgb3B0aW9uID0gJCh0aGlzLnNlbGVjdEl0ZW1UZW1wbGF0ZS5hcHBseSh7XHJcbiAgICAgICAga2V5OiBpdGVtLmtleSxcclxuICAgICAgICB2YWx1ZTogaXRlbS52YWx1ZSxcclxuICAgICAgICB0ZXh0OiBpdGVtLnRleHQsXHJcbiAgICAgIH0sIHRoaXMpKTtcclxuICAgICAgJCh0aGlzLmRyb3Bkb3duU2VsZWN0KS5hcHBlbmQob3B0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5kcm9wZG93blNlbGVjdCkuZHJvcGRvd24oe1xyXG4gICAgICBub1NlYXJjaDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgaWYgKGl0ZW1Gb3VuZCkge1xyXG4gICAgICB0aGlzLnNldFZhbHVlKGl0ZW1Gb3VuZC52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5vblNlbGVjdCkge1xyXG4gICAgICAkKHRoaXMuZHJvcGRvd25TZWxlY3QpLm9uKCdjaGFuZ2UnLCB0aGlzLm9uU2VsZWN0LmJpbmQodGhpcy5vblNlbGVjdFNjb3BlIHx8IHRoaXMpKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIHRoaXMuX2V2ZW50Q29ubmVjdGlvbnMuZm9yRWFjaCgoZXZ0KSA9PiB7XHJcbiAgICAgIGV2dC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5fZXZlbnRDb25uZWN0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGZpbmRWYWx1ZTogZnVuY3Rpb24gZmluZFZhbHVlKHRleHQpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fbGlzdC5jaGlsZHJlbi5maWx0ZXIoKGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQuaW5uZXJUZXh0ID09PSB0ZXh0O1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdmFsdWVbMF07XHJcbiAgfSxcclxuICBnZXRTZWxlY3RlZDogZnVuY3Rpb24gZ2V0U2VsZWN0ZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XHJcbiAgfSxcclxuICBnZXRUZXh0OiBmdW5jdGlvbiBnZXRUZXh0KCkge1xyXG4gICAgY29uc3QgdGV4dCA9ICh0aGlzLmRyb3Bkb3duU2VsZWN0Lm9wdGlvbnNbdGhpcy5kcm9wZG93blNlbGVjdC5zZWxlY3RlZEluZGV4XSkgPyB0aGlzLmRyb3Bkb3duU2VsZWN0Lm9wdGlvbnNbdGhpcy5kcm9wZG93blNlbGVjdC5zZWxlY3RlZEluZGV4XS50ZXh0IDogJyc7XHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9LFxyXG4gIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kcm9wZG93blNlbGVjdC5vcHRpb25zW3RoaXMuZHJvcGRvd25TZWxlY3Quc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfSxcclxuICBwb3N0Q3JlYXRlOiBmdW5jdGlvbiBwb3N0Q3JlYXRlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSAwIHx8IHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuZHJvcGRvd25TZWxlY3QudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgJCh0aGlzLmRyb3Bkb3duU2VsZWN0KS5kYXRhKCdkcm9wZG93bicpLnVwZGF0ZWQoKTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==