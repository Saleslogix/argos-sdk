define('argos/Models/Adapter', ['module', 'exports', './Manager', './Types'], function (module, exports, _Manager, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Manager2 = _interopRequireDefault(_Manager);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    getModel: function getModel(entityName) {
      var Ctor = void 0;
      if (App.onLine) {
        Ctor = _Manager2.default.get(entityName, _Types2.default.SDATA);
      } else {
        Ctor = _Manager2.default.get(entityName, _Types2.default.OFFLINE);
      }

      return typeof Ctor === 'function' ? new Ctor() : false;
    }
  };
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Nb2RlbHMvQWRhcHRlci5qcyJdLCJuYW1lcyI6WyJnZXRNb2RlbCIsImVudGl0eU5hbWUiLCJDdG9yIiwiQXBwIiwib25MaW5lIiwiZ2V0IiwiU0RBVEEiLCJPRkZMSU5FIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBcUJlO0FBQ2JBLGNBQVUsU0FBU0EsUUFBVCxDQUFrQkMsVUFBbEIsRUFBOEI7QUFDdEMsVUFBSUMsYUFBSjtBQUNBLFVBQUlDLElBQUlDLE1BQVIsRUFBZ0I7QUFDZEYsZUFBTyxrQkFBUUcsR0FBUixDQUFZSixVQUFaLEVBQXdCLGdCQUFZSyxLQUFwQyxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0xKLGVBQU8sa0JBQVFHLEdBQVIsQ0FBWUosVUFBWixFQUF3QixnQkFBWU0sT0FBcEMsQ0FBUDtBQUNEOztBQUVELGFBQU8sT0FBT0wsSUFBUCxLQUFnQixVQUFoQixHQUE2QixJQUFJQSxJQUFKLEVBQTdCLEdBQTBDLEtBQWpEO0FBQ0Q7QUFWWSxHIiwiZmlsZSI6IkFkYXB0ZXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgTWFuYWdlciBmcm9tICcuL01hbmFnZXInO1xyXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi9UeXBlcyc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1vZGVscy5BZGFwdGVyXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZ2V0TW9kZWw6IGZ1bmN0aW9uIGdldE1vZGVsKGVudGl0eU5hbWUpIHtcclxuICAgIGxldCBDdG9yO1xyXG4gICAgaWYgKEFwcC5vbkxpbmUpIHtcclxuICAgICAgQ3RvciA9IE1hbmFnZXIuZ2V0KGVudGl0eU5hbWUsIE1PREVMX1RZUEVTLlNEQVRBKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEN0b3IgPSBNYW5hZ2VyLmdldChlbnRpdHlOYW1lLCBNT0RFTF9UWVBFUy5PRkZMSU5FKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHlwZW9mIEN0b3IgPT09ICdmdW5jdGlvbicgPyBuZXcgQ3RvcigpIDogZmFsc2U7XHJcbiAgfSxcclxufTtcclxuIl19