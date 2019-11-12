define('argos/Views/FileSelect', ['module', 'exports', 'dojo/_base/declare', '../I18n', '../View', '../Fields/TextField'], function (module, exports, _declare, _I18n, _View) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _I18n2 = _interopRequireDefault(_I18n);

  var _View2 = _interopRequireDefault(_View);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var resource = (0, _I18n2.default)('fileSelect');

  /**
   * @class argos.Views.FileSelect
   * @classdesc File Select View is a view for selection files capabilities.
   * @extends argos.View
   */
  var __class = (0, _declare2.default)('argos.Views.FileSelect', [_View2.default], /** @lends argos.Views.FileSelect# */{
    // Localization
    titleText: resource.titleText,
    addFileText: resource.addFileText,
    uploadText: resource.uploadText,
    cancelText: resource.cancelText,
    selectFileText: resource.selectFileText,
    loadingText: resource.loadingText,
    descriptionText: resource.descriptionText,
    bytesText: resource.bytesText,
    notSupportedText: resource.notSupportedText,

    /**
     * @property {Simplate}
     * The template used to render the loading message when the view is requesting more data.
     *
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      loadingText         The text to display while loading.
     */
    loadingTemplate: new Simplate(['<li><label id="progress-label">{%= $.loadingText %}</label></li>', '<li class="progress">\n      <div class="progress-bar" id="progressbar" aria-labelledby="progress-label"></div>\n    </li>']),

    /**
     * @property {Simplate}
     * The template that displays when HTML5 file api is not supported.
     */
    notSupportedTemplate: new Simplate(['<h2>{%= $$.notSupportedText %}</h2>']),

    /**
     * @property {Simplate}
     * Simplate that defines the HTML Markup
     *
     * * `$` => File Select view instance
     *
     */
    widgetTemplate: new Simplate(['<div style="padding-top: 10px;" data-title="{%: $.titleText %}" class="panel twelve columns {%= $.cls %}">', '<br>', // TODO: all views should be placed in .row -> .columns
    '<div data-dojo-attach-point="fileArea" class="file-area">', '<div class="field" data-dojo-attach-point="fileWrapper">\n      <label class="fileupload" data-dojo-attach-point="fileupload">\n          <span class="audible">{%: $.addFileText %}</span>\n          <input type="file" data-dojo-attach-point="btnFileSelect" name="file-input" size="71" />\n      </label>\n    </div>', '</div>', '<ul class="list-content" data-dojo-attach-point="contentNode"></ul>', '<div class="buttons">', '<div><button id="fileSelect-btn-upload" data-dojo-attach-point="btnUploadFiles" class="btn-primary" data-action="onUploadFiles"><span>{%: $.uploadText %}</span></button>', '<button id="fileSelect-btn-cancel" class="btn" data-action="cancelSelect"><span>{%: $.cancelText %}</span></button><div>', '</div>', '</div>']),
    /**
     * @property {Simplate} fileTemplate
     */
    fileTemplate: new Simplate(['<li class="row {%= $.cls %}" data-property="{%= $.property || $.name %}">', '<p class="file-name">{%: $.fileName %}</p>', '<label>{%: $$.descriptionText %}</label>', '<input id="{%=  $.name %}" type="text" value="{%=  $.description %}">', '</li>']),

    signatureNode: null,
    id: 'fileSelect_edit',
    btnFileSelect: null,
    _files: null,
    _formParts: [],

    /**
     * @constructs
     */
    constructor: function constructor() {},
    postCreate: function postCreate() {
      this.inherited(arguments);
      $(this.domNode).removeClass('list-loading');
    },
    /**
     * Extends the @{link Sage.Platlform.Mobile.View} show to clear out the onchange event of the file input.
     * The onchange event will only fire once per file, so we must re-insert the dom node and re-attach the event.
     * @extends show
     */
    show: function show() /* options*/{
      this.inherited(arguments);

      if (!App.supportsFileAPI()) {
        $(this.domNode).empty().append(this.notSupportedTemplate.apply({}, this));
        return;
      }

      this._files = [];

      // Reset the input or the onchange will not fire if the same file is uploaded multiple times.
      if ($(this.fileupload).data('fileupload')) {
        $(this.fileupload).data('fileupload').destroy();
      }

      $(this.fileupload).fileupload();

      this.btnFileSelect.onchange = function onchange(e) {
        this._onSelectFile(e);
      }.bind(this);

      this.contentNode.innerHTML = '';
      $(this.fileArea).show();
      $(this.btnUploadFiles).show();
      this.onUpdateProgress('0');
    },
    _browesForFiles: function _browesForFiles() /* file*/{
      this.btnFileSelect.click();
    },
    removeFile: function removeFile() /* fileId*/{},
    /**
     * Returns an array of objects with the properties of: file, fileName, and description.
     * @returns {Array}
     */
    getFileItems: function getFileItems() {
      var fileItems = [];
      var files = this._files;
      var description = '';
      for (var i = 0; i < files.length; i++) {
        description = this._getFileDescription(i);
        fileItems.push({
          file: files[i],
          fileName: files[i].name,
          description: description
        });
      }
      return fileItems;
    },
    _getFileDescription: function _getFileDescription(fileIndex) {
      var n = document.getElementById('File_' + fileIndex);
      var desc = void 0;

      if (n) {
        desc = n.value;
      }
      return desc;
    },
    _onSelectFile: function _onSelectFile() {
      var files = this.btnFileSelect.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          this._files.push(files[i]);
        }
        this._buildForm(files);
      }
      $(this.btnUploadFiles).show();
      $(this.fileArea).hide();
    },
    _addFile: function _addFile(file, index) {
      var filelength = this._getFileLength(file);
      var data = {
        name: 'File_' + index,
        fileName: file.name + '  (' + filelength + ')',
        description: this._getDefaultDescription(file.name)
      };
      $(this.contentNode).append(this.fileTemplate.apply(data, this));
    },
    _getFileLength: function _getFileLength(file) {
      var filelength = 0;
      if (file.size === 0) {
        filelength = 0;
      } else {
        filelength = file.size || file.blob.length;
      }
      if (filelength === 0) {
        filelength += '0 ' + this.bytesTextBytes;
      } else {
        if (filelength) {
          if (filelength > 1024) {
            if (filelength > 1048576) {
              filelength = Math.round(filelength / 1048576) + ' MB';
            } else {
              filelength = Math.round(filelength / 1024) + ' KB';
            }
          } else {
            filelength += ' ' + this.bytesTextBytesBytes;
          }
        }
      }
      return filelength;
    },
    _buildForm: function _buildForm(files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        this._addFile(file, i);
      }
    },
    _getDefaultDescription: function _getDefaultDescription(filename) {
      return filename.replace(/\.[\w]*/, '');
    },
    /**
     * Handles the display when the user clicks upload.
     */
    onUploadFiles: function onUploadFiles() {
      $(this.btnUploadFiles).hide();
      var tpl = this.loadingTemplate.apply(this);
      $(this.domNode).addClass('list-loading');
      $(this.contentNode).prepend(tpl);
      $('#progressbar', this.contentNode).progress();
    },
    cancelSelect: function cancelSelect() {},
    /**
     * Handles the display when progress events are recieved.
     */
    onUpdateProgress: function onUpdateProgress(msg) {
      var progressbar = $('#progressbar', this.contentNode);
      if (progressbar.length) {
        if (!(msg instanceof Array) && !isNaN(msg.replace('%', ''))) {
          progressbar.data('progress').update(msg.replace('%', ''));
        }
        $('#progress-label', this.contentNode).text(this.loadingText + ' ' + msg);
      }
    },
    /**
     * Handles the display when the upload fails.
     */
    onUpdateFailed: function onUpdateFailed(msg) {
      this.onUpdateProgress(msg);
      $(this.domNode).removeClass('list-loading');
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9GaWxlU2VsZWN0LmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsInRpdGxlVGV4dCIsImFkZEZpbGVUZXh0IiwidXBsb2FkVGV4dCIsImNhbmNlbFRleHQiLCJzZWxlY3RGaWxlVGV4dCIsImxvYWRpbmdUZXh0IiwiZGVzY3JpcHRpb25UZXh0IiwiYnl0ZXNUZXh0Iiwibm90U3VwcG9ydGVkVGV4dCIsImxvYWRpbmdUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibm90U3VwcG9ydGVkVGVtcGxhdGUiLCJ3aWRnZXRUZW1wbGF0ZSIsImZpbGVUZW1wbGF0ZSIsInNpZ25hdHVyZU5vZGUiLCJpZCIsImJ0bkZpbGVTZWxlY3QiLCJfZmlsZXMiLCJfZm9ybVBhcnRzIiwiY29uc3RydWN0b3IiLCJwb3N0Q3JlYXRlIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiJCIsImRvbU5vZGUiLCJyZW1vdmVDbGFzcyIsInNob3ciLCJBcHAiLCJzdXBwb3J0c0ZpbGVBUEkiLCJlbXB0eSIsImFwcGVuZCIsImFwcGx5IiwiZmlsZXVwbG9hZCIsImRhdGEiLCJkZXN0cm95Iiwib25jaGFuZ2UiLCJlIiwiX29uU2VsZWN0RmlsZSIsImJpbmQiLCJjb250ZW50Tm9kZSIsImlubmVySFRNTCIsImZpbGVBcmVhIiwiYnRuVXBsb2FkRmlsZXMiLCJvblVwZGF0ZVByb2dyZXNzIiwiX2Jyb3dlc0ZvckZpbGVzIiwiY2xpY2siLCJyZW1vdmVGaWxlIiwiZ2V0RmlsZUl0ZW1zIiwiZmlsZUl0ZW1zIiwiZmlsZXMiLCJkZXNjcmlwdGlvbiIsImkiLCJsZW5ndGgiLCJfZ2V0RmlsZURlc2NyaXB0aW9uIiwicHVzaCIsImZpbGUiLCJmaWxlTmFtZSIsIm5hbWUiLCJmaWxlSW5kZXgiLCJuIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImRlc2MiLCJ2YWx1ZSIsIl9idWlsZEZvcm0iLCJoaWRlIiwiX2FkZEZpbGUiLCJpbmRleCIsImZpbGVsZW5ndGgiLCJfZ2V0RmlsZUxlbmd0aCIsIl9nZXREZWZhdWx0RGVzY3JpcHRpb24iLCJzaXplIiwiYmxvYiIsImJ5dGVzVGV4dEJ5dGVzIiwiTWF0aCIsInJvdW5kIiwiYnl0ZXNUZXh0Qnl0ZXNCeXRlcyIsImZpbGVuYW1lIiwicmVwbGFjZSIsIm9uVXBsb2FkRmlsZXMiLCJ0cGwiLCJhZGRDbGFzcyIsInByZXBlbmQiLCJwcm9ncmVzcyIsImNhbmNlbFNlbGVjdCIsIm1zZyIsInByb2dyZXNzYmFyIiwiQXJyYXkiLCJpc05hTiIsInVwZGF0ZSIsInRleHQiLCJvblVwZGF0ZUZhaWxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxVQUFVLHVCQUFRLHdCQUFSLEVBQWtDLGdCQUFsQyxFQUEwQyxxQ0FBcUM7QUFDN0Y7QUFDQUMsZUFBV0YsU0FBU0UsU0FGeUU7QUFHN0ZDLGlCQUFhSCxTQUFTRyxXQUh1RTtBQUk3RkMsZ0JBQVlKLFNBQVNJLFVBSndFO0FBSzdGQyxnQkFBWUwsU0FBU0ssVUFMd0U7QUFNN0ZDLG9CQUFnQk4sU0FBU00sY0FOb0U7QUFPN0ZDLGlCQUFhUCxTQUFTTyxXQVB1RTtBQVE3RkMscUJBQWlCUixTQUFTUSxlQVJtRTtBQVM3RkMsZUFBV1QsU0FBU1MsU0FUeUU7QUFVN0ZDLHNCQUFrQlYsU0FBU1UsZ0JBVmtFOztBQVk3Rjs7Ozs7Ozs7OztBQVVBQyxxQkFBaUIsSUFBSUMsUUFBSixDQUFhLENBQzVCLGtFQUQ0QiwrSEFBYixDQXRCNEU7O0FBNkI3Rjs7OztBQUlBQywwQkFBc0IsSUFBSUQsUUFBSixDQUFhLENBQ2pDLHFDQURpQyxDQUFiLENBakN1RTs7QUFxQzdGOzs7Ozs7O0FBT0FFLG9CQUFnQixJQUFJRixRQUFKLENBQWEsQ0FDM0IsNEdBRDJCLEVBRTNCLE1BRjJCLEVBRW5CO0FBQ1IsK0RBSDJCLGlVQVUzQixRQVYyQixFQVcz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M0IsQ0FBWjtBQUNBUixRQUFFLEtBQUtDLE9BQVAsRUFBZ0J5RCxRQUFoQixDQUF5QixjQUF6QjtBQUNBMUQsUUFBRSxLQUFLZ0IsV0FBUCxFQUFvQjJDLE9BQXBCLENBQTRCRixHQUE1QjtBQUNBekQsUUFBRSxjQUFGLEVBQWtCLEtBQUtnQixXQUF2QixFQUFvQzRDLFFBQXBDO0FBQ0QsS0FuTjRGO0FBb043RkMsa0JBQWMsU0FBU0EsWUFBVCxHQUF3QixDQUFFLENBcE5xRDtBQXFON0Y7OztBQUdBekMsc0JBQWtCLFNBQVNBLGdCQUFULENBQTBCMEMsR0FBMUIsRUFBK0I7QUFDL0MsVUFBTUMsY0FBYy9ELEVBQUUsY0FBRixFQUFrQixLQUFLZ0IsV0FBdkIsQ0FBcEI7QUFDQSxVQUFJK0MsWUFBWWxDLE1BQWhCLEVBQXdCO0FBQ3RCLFlBQUksRUFBRWlDLGVBQWVFLEtBQWpCLEtBQTJCLENBQUNDLE1BQU1ILElBQUlQLE9BQUosQ0FBWSxHQUFaLEVBQWlCLEVBQWpCLENBQU4sQ0FBaEMsRUFBNkQ7QUFDM0RRLHNCQUFZckQsSUFBWixDQUFpQixVQUFqQixFQUE2QndELE1BQTdCLENBQW9DSixJQUFJUCxPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQixDQUFwQztBQUNEO0FBQ0R2RCxVQUFFLGlCQUFGLEVBQXFCLEtBQUtnQixXQUExQixFQUF1Q21ELElBQXZDLENBQStDLEtBQUtyRixXQUFwRCxTQUFtRWdGLEdBQW5FO0FBQ0Q7QUFDRixLQWhPNEY7QUFpTzdGOzs7QUFHQU0sb0JBQWdCLFNBQVNBLGNBQVQsQ0FBd0JOLEdBQXhCLEVBQTZCO0FBQzNDLFdBQUsxQyxnQkFBTCxDQUFzQjBDLEdBQXRCO0FBQ0E5RCxRQUFFLEtBQUtDLE9BQVAsRUFBZ0JDLFdBQWhCLENBQTRCLGNBQTVCO0FBQ0Q7QUF2TzRGLEdBQS9FLENBQWhCOztvQkEwT2UxQixPIiwiZmlsZSI6IkZpbGVTZWxlY3QuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcblxyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4uL1ZpZXcnO1xyXG5pbXBvcnQgJy4uL0ZpZWxkcy9UZXh0RmllbGQnO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZmlsZVNlbGVjdCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5WaWV3cy5GaWxlU2VsZWN0XHJcbiAqIEBjbGFzc2Rlc2MgRmlsZSBTZWxlY3QgVmlldyBpcyBhIHZpZXcgZm9yIHNlbGVjdGlvbiBmaWxlcyBjYXBhYmlsaXRpZXMuXHJcbiAqIEBleHRlbmRzIGFyZ29zLlZpZXdcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5WaWV3cy5GaWxlU2VsZWN0JywgW1ZpZXddLCAvKiogQGxlbmRzIGFyZ29zLlZpZXdzLkZpbGVTZWxlY3QjICove1xyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIGFkZEZpbGVUZXh0OiByZXNvdXJjZS5hZGRGaWxlVGV4dCxcclxuICB1cGxvYWRUZXh0OiByZXNvdXJjZS51cGxvYWRUZXh0LFxyXG4gIGNhbmNlbFRleHQ6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgc2VsZWN0RmlsZVRleHQ6IHJlc291cmNlLnNlbGVjdEZpbGVUZXh0LFxyXG4gIGxvYWRpbmdUZXh0OiByZXNvdXJjZS5sb2FkaW5nVGV4dCxcclxuICBkZXNjcmlwdGlvblRleHQ6IHJlc291cmNlLmRlc2NyaXB0aW9uVGV4dCxcclxuICBieXRlc1RleHQ6IHJlc291cmNlLmJ5dGVzVGV4dCxcclxuICBub3RTdXBwb3J0ZWRUZXh0OiByZXNvdXJjZS5ub3RTdXBwb3J0ZWRUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgbG9hZGluZyBtZXNzYWdlIHdoZW4gdGhlIHZpZXcgaXMgcmVxdWVzdGluZyBtb3JlIGRhdGEuXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgbG9hZGluZ1RleHQgICAgICAgICBUaGUgdGV4dCB0byBkaXNwbGF5IHdoaWxlIGxvYWRpbmcuXHJcbiAgICovXHJcbiAgbG9hZGluZ1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaT48bGFiZWwgaWQ9XCJwcm9ncmVzcy1sYWJlbFwiPnslPSAkLmxvYWRpbmdUZXh0ICV9PC9sYWJlbD48L2xpPicsXHJcbiAgICBgPGxpIGNsYXNzPVwicHJvZ3Jlc3NcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLWxhYmVsbGVkYnk9XCJwcm9ncmVzcy1sYWJlbFwiPjwvZGl2PlxyXG4gICAgPC9saT5gLFxyXG4gIF0pLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIHdoZW4gSFRNTDUgZmlsZSBhcGkgaXMgbm90IHN1cHBvcnRlZC5cclxuICAgKi9cclxuICBub3RTdXBwb3J0ZWRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8aDI+eyU9ICQkLm5vdFN1cHBvcnRlZFRleHQgJX08L2gyPicsXHJcbiAgXSksXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gRmlsZSBTZWxlY3QgdmlldyBpbnN0YW5jZVxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBzdHlsZT1cInBhZGRpbmctdG9wOiAxMHB4O1wiIGRhdGEtdGl0bGU9XCJ7JTogJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cInBhbmVsIHR3ZWx2ZSBjb2x1bW5zIHslPSAkLmNscyAlfVwiPicsXHJcbiAgICAnPGJyPicsIC8vIFRPRE86IGFsbCB2aWV3cyBzaG91bGQgYmUgcGxhY2VkIGluIC5yb3cgLT4gLmNvbHVtbnNcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJmaWxlQXJlYVwiIGNsYXNzPVwiZmlsZS1hcmVhXCI+JyxcclxuICAgIGA8ZGl2IGNsYXNzPVwiZmllbGRcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZmlsZVdyYXBwZXJcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzPVwiZmlsZXVwbG9hZFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJmaWxldXBsb2FkXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImF1ZGlibGVcIj57JTogJC5hZGRGaWxlVGV4dCAlfTwvc3Bhbj5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJidG5GaWxlU2VsZWN0XCIgbmFtZT1cImZpbGUtaW5wdXRcIiBzaXplPVwiNzFcIiAvPlxyXG4gICAgICA8L2xhYmVsPlxyXG4gICAgPC9kaXY+YCxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzx1bCBjbGFzcz1cImxpc3QtY29udGVudFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJjb250ZW50Tm9kZVwiPjwvdWw+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPicsXHJcbiAgICAnPGRpdj48YnV0dG9uIGlkPVwiZmlsZVNlbGVjdC1idG4tdXBsb2FkXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImJ0blVwbG9hZEZpbGVzXCIgY2xhc3M9XCJidG4tcHJpbWFyeVwiIGRhdGEtYWN0aW9uPVwib25VcGxvYWRGaWxlc1wiPjxzcGFuPnslOiAkLnVwbG9hZFRleHQgJX08L3NwYW4+PC9idXR0b24+JyxcclxuICAgICc8YnV0dG9uIGlkPVwiZmlsZVNlbGVjdC1idG4tY2FuY2VsXCIgY2xhc3M9XCJidG5cIiBkYXRhLWFjdGlvbj1cImNhbmNlbFNlbGVjdFwiPjxzcGFuPnslOiAkLmNhbmNlbFRleHQgJX08L3NwYW4+PC9idXR0b24+PGRpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfSBmaWxlVGVtcGxhdGVcclxuICAgKi9cclxuICBmaWxlVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwicm93IHslPSAkLmNscyAlfVwiIGRhdGEtcHJvcGVydHk9XCJ7JT0gJC5wcm9wZXJ0eSB8fCAkLm5hbWUgJX1cIj4nLFxyXG4gICAgJzxwIGNsYXNzPVwiZmlsZS1uYW1lXCI+eyU6ICQuZmlsZU5hbWUgJX08L3A+JyxcclxuICAgICc8bGFiZWw+eyU6ICQkLmRlc2NyaXB0aW9uVGV4dCAlfTwvbGFiZWw+JyxcclxuICAgICc8aW5wdXQgaWQ9XCJ7JT0gICQubmFtZSAlfVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJ7JT0gICQuZGVzY3JpcHRpb24gJX1cIj4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuXHJcbiAgc2lnbmF0dXJlTm9kZTogbnVsbCxcclxuICBpZDogJ2ZpbGVTZWxlY3RfZWRpdCcsXHJcbiAgYnRuRmlsZVNlbGVjdDogbnVsbCxcclxuICBfZmlsZXM6IG51bGwsXHJcbiAgX2Zvcm1QYXJ0czogW10sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RzXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKCkge30sXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ2xpc3QtbG9hZGluZycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgQHtsaW5rIFNhZ2UuUGxhdGxmb3JtLk1vYmlsZS5WaWV3fSBzaG93IHRvIGNsZWFyIG91dCB0aGUgb25jaGFuZ2UgZXZlbnQgb2YgdGhlIGZpbGUgaW5wdXQuXHJcbiAgICogVGhlIG9uY2hhbmdlIGV2ZW50IHdpbGwgb25seSBmaXJlIG9uY2UgcGVyIGZpbGUsIHNvIHdlIG11c3QgcmUtaW5zZXJ0IHRoZSBkb20gbm9kZSBhbmQgcmUtYXR0YWNoIHRoZSBldmVudC5cclxuICAgKiBAZXh0ZW5kcyBzaG93XHJcbiAgICovXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdygvKiBvcHRpb25zKi8pIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKCFBcHAuc3VwcG9ydHNGaWxlQVBJKCkpIHtcclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLmVtcHR5KCkuYXBwZW5kKHRoaXMubm90U3VwcG9ydGVkVGVtcGxhdGUuYXBwbHkoe30sIHRoaXMpKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2ZpbGVzID0gW107XHJcblxyXG4gICAgLy8gUmVzZXQgdGhlIGlucHV0IG9yIHRoZSBvbmNoYW5nZSB3aWxsIG5vdCBmaXJlIGlmIHRoZSBzYW1lIGZpbGUgaXMgdXBsb2FkZWQgbXVsdGlwbGUgdGltZXMuXHJcbiAgICBpZiAoJCh0aGlzLmZpbGV1cGxvYWQpLmRhdGEoJ2ZpbGV1cGxvYWQnKSkge1xyXG4gICAgICAkKHRoaXMuZmlsZXVwbG9hZCkuZGF0YSgnZmlsZXVwbG9hZCcpLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuZmlsZXVwbG9hZCkuZmlsZXVwbG9hZCgpO1xyXG5cclxuICAgIHRoaXMuYnRuRmlsZVNlbGVjdC5vbmNoYW5nZSA9IGZ1bmN0aW9uIG9uY2hhbmdlKGUpIHtcclxuICAgICAgdGhpcy5fb25TZWxlY3RGaWxlKGUpO1xyXG4gICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuY29udGVudE5vZGUuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAkKHRoaXMuZmlsZUFyZWEpLnNob3coKTtcclxuICAgICQodGhpcy5idG5VcGxvYWRGaWxlcykuc2hvdygpO1xyXG4gICAgdGhpcy5vblVwZGF0ZVByb2dyZXNzKCcwJyk7XHJcbiAgfSxcclxuICBfYnJvd2VzRm9yRmlsZXM6IGZ1bmN0aW9uIF9icm93ZXNGb3JGaWxlcygvKiBmaWxlKi8pIHtcclxuICAgIHRoaXMuYnRuRmlsZVNlbGVjdC5jbGljaygpO1xyXG4gIH0sXHJcbiAgcmVtb3ZlRmlsZTogZnVuY3Rpb24gcmVtb3ZlRmlsZSgvKiBmaWxlSWQqLykge30sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggdGhlIHByb3BlcnRpZXMgb2Y6IGZpbGUsIGZpbGVOYW1lLCBhbmQgZGVzY3JpcHRpb24uXHJcbiAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAqL1xyXG4gIGdldEZpbGVJdGVtczogZnVuY3Rpb24gZ2V0RmlsZUl0ZW1zKCkge1xyXG4gICAgY29uc3QgZmlsZUl0ZW1zID0gW107XHJcbiAgICBjb25zdCBmaWxlcyA9IHRoaXMuX2ZpbGVzO1xyXG4gICAgbGV0IGRlc2NyaXB0aW9uID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGRlc2NyaXB0aW9uID0gdGhpcy5fZ2V0RmlsZURlc2NyaXB0aW9uKGkpO1xyXG4gICAgICBmaWxlSXRlbXMucHVzaCh7XHJcbiAgICAgICAgZmlsZTogZmlsZXNbaV0sXHJcbiAgICAgICAgZmlsZU5hbWU6IGZpbGVzW2ldLm5hbWUsXHJcbiAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbGVJdGVtcztcclxuICB9LFxyXG4gIF9nZXRGaWxlRGVzY3JpcHRpb246IGZ1bmN0aW9uIF9nZXRGaWxlRGVzY3JpcHRpb24oZmlsZUluZGV4KSB7XHJcbiAgICBjb25zdCBuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYEZpbGVfJHtmaWxlSW5kZXh9YCk7XHJcbiAgICBsZXQgZGVzYztcclxuXHJcbiAgICBpZiAobikge1xyXG4gICAgICBkZXNjID0gbi52YWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBkZXNjO1xyXG4gIH0sXHJcbiAgX29uU2VsZWN0RmlsZTogZnVuY3Rpb24gX29uU2VsZWN0RmlsZSgpIHtcclxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5idG5GaWxlU2VsZWN0LmZpbGVzO1xyXG4gICAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuX2ZpbGVzLnB1c2goZmlsZXNbaV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2J1aWxkRm9ybShmaWxlcyk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuYnRuVXBsb2FkRmlsZXMpLnNob3coKTtcclxuICAgICQodGhpcy5maWxlQXJlYSkuaGlkZSgpO1xyXG4gIH0sXHJcbiAgX2FkZEZpbGU6IGZ1bmN0aW9uIF9hZGRGaWxlKGZpbGUsIGluZGV4KSB7XHJcbiAgICBjb25zdCBmaWxlbGVuZ3RoID0gdGhpcy5fZ2V0RmlsZUxlbmd0aChmaWxlKTtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG5hbWU6IGBGaWxlXyR7aW5kZXh9YCxcclxuICAgICAgZmlsZU5hbWU6IGAke2ZpbGUubmFtZX0gICgke2ZpbGVsZW5ndGh9KWAsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLl9nZXREZWZhdWx0RGVzY3JpcHRpb24oZmlsZS5uYW1lKSxcclxuICAgIH07XHJcbiAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZCh0aGlzLmZpbGVUZW1wbGF0ZS5hcHBseShkYXRhLCB0aGlzKSk7XHJcbiAgfSxcclxuICBfZ2V0RmlsZUxlbmd0aDogZnVuY3Rpb24gX2dldEZpbGVMZW5ndGgoZmlsZSkge1xyXG4gICAgbGV0IGZpbGVsZW5ndGggPSAwO1xyXG4gICAgaWYgKGZpbGUuc2l6ZSA9PT0gMCkge1xyXG4gICAgICBmaWxlbGVuZ3RoID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZpbGVsZW5ndGggPSBmaWxlLnNpemUgfHwgZmlsZS5ibG9iLmxlbmd0aDtcclxuICAgIH1cclxuICAgIGlmIChmaWxlbGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGZpbGVsZW5ndGggKz0gYDAgJHt0aGlzLmJ5dGVzVGV4dEJ5dGVzfWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoZmlsZWxlbmd0aCkge1xyXG4gICAgICAgIGlmIChmaWxlbGVuZ3RoID4gMTAyNCkge1xyXG4gICAgICAgICAgaWYgKGZpbGVsZW5ndGggPiAxMDQ4NTc2KSB7XHJcbiAgICAgICAgICAgIGZpbGVsZW5ndGggPSBgJHtNYXRoLnJvdW5kKGZpbGVsZW5ndGggLyAxMDQ4NTc2KX0gTUJgO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmlsZWxlbmd0aCA9IGAke01hdGgucm91bmQoZmlsZWxlbmd0aCAvIDEwMjQpfSBLQmA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGVsZW5ndGggKz0gYCAke3RoaXMuYnl0ZXNUZXh0Qnl0ZXNCeXRlc31gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbGVsZW5ndGg7XHJcbiAgfSxcclxuICBfYnVpbGRGb3JtOiBmdW5jdGlvbiBfYnVpbGRGb3JtKGZpbGVzKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcclxuICAgICAgdGhpcy5fYWRkRmlsZShmaWxlLCBpKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9nZXREZWZhdWx0RGVzY3JpcHRpb246IGZ1bmN0aW9uIF9nZXREZWZhdWx0RGVzY3JpcHRpb24oZmlsZW5hbWUpIHtcclxuICAgIHJldHVybiBmaWxlbmFtZS5yZXBsYWNlKC9cXC5bXFx3XSovLCAnJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBkaXNwbGF5IHdoZW4gdGhlIHVzZXIgY2xpY2tzIHVwbG9hZC5cclxuICAgKi9cclxuICBvblVwbG9hZEZpbGVzOiBmdW5jdGlvbiBvblVwbG9hZEZpbGVzKCkge1xyXG4gICAgJCh0aGlzLmJ0blVwbG9hZEZpbGVzKS5oaWRlKCk7XHJcbiAgICBjb25zdCB0cGwgPSB0aGlzLmxvYWRpbmdUZW1wbGF0ZS5hcHBseSh0aGlzKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgICAkKHRoaXMuY29udGVudE5vZGUpLnByZXBlbmQodHBsKTtcclxuICAgICQoJyNwcm9ncmVzc2JhcicsIHRoaXMuY29udGVudE5vZGUpLnByb2dyZXNzKCk7XHJcbiAgfSxcclxuICBjYW5jZWxTZWxlY3Q6IGZ1bmN0aW9uIGNhbmNlbFNlbGVjdCgpIHt9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgdGhlIGRpc3BsYXkgd2hlbiBwcm9ncmVzcyBldmVudHMgYXJlIHJlY2lldmVkLlxyXG4gICAqL1xyXG4gIG9uVXBkYXRlUHJvZ3Jlc3M6IGZ1bmN0aW9uIG9uVXBkYXRlUHJvZ3Jlc3MobXNnKSB7XHJcbiAgICBjb25zdCBwcm9ncmVzc2JhciA9ICQoJyNwcm9ncmVzc2JhcicsIHRoaXMuY29udGVudE5vZGUpO1xyXG4gICAgaWYgKHByb2dyZXNzYmFyLmxlbmd0aCkge1xyXG4gICAgICBpZiAoIShtc2cgaW5zdGFuY2VvZiBBcnJheSkgJiYgIWlzTmFOKG1zZy5yZXBsYWNlKCclJywgJycpKSkge1xyXG4gICAgICAgIHByb2dyZXNzYmFyLmRhdGEoJ3Byb2dyZXNzJykudXBkYXRlKG1zZy5yZXBsYWNlKCclJywgJycpKTtcclxuICAgICAgfVxyXG4gICAgICAkKCcjcHJvZ3Jlc3MtbGFiZWwnLCB0aGlzLmNvbnRlbnROb2RlKS50ZXh0KGAke3RoaXMubG9hZGluZ1RleHR9ICR7bXNnfWApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgZGlzcGxheSB3aGVuIHRoZSB1cGxvYWQgZmFpbHMuXHJcbiAgICovXHJcbiAgb25VcGRhdGVGYWlsZWQ6IGZ1bmN0aW9uIG9uVXBkYXRlRmFpbGVkKG1zZykge1xyXG4gICAgdGhpcy5vblVwZGF0ZVByb2dyZXNzKG1zZyk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ2xpc3QtbG9hZGluZycpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19