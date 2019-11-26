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
      this.inherited(postCreate, arguments);
      $(this.domNode).removeClass('list-loading');
    },
    /**
     * Extends the @{link Sage.Platlform.Mobile.View} show to clear out the onchange event of the file input.
     * The onchange event will only fire once per file, so we must re-insert the dom node and re-attach the event.
     * @extends show
     */
    show: function show() /* options*/{
      this.inherited(show, arguments);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9GaWxlU2VsZWN0LmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsInRpdGxlVGV4dCIsImFkZEZpbGVUZXh0IiwidXBsb2FkVGV4dCIsImNhbmNlbFRleHQiLCJzZWxlY3RGaWxlVGV4dCIsImxvYWRpbmdUZXh0IiwiZGVzY3JpcHRpb25UZXh0IiwiYnl0ZXNUZXh0Iiwibm90U3VwcG9ydGVkVGV4dCIsImxvYWRpbmdUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibm90U3VwcG9ydGVkVGVtcGxhdGUiLCJ3aWRnZXRUZW1wbGF0ZSIsImZpbGVUZW1wbGF0ZSIsInNpZ25hdHVyZU5vZGUiLCJpZCIsImJ0bkZpbGVTZWxlY3QiLCJfZmlsZXMiLCJfZm9ybVBhcnRzIiwiY29uc3RydWN0b3IiLCJwb3N0Q3JlYXRlIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiJCIsImRvbU5vZGUiLCJyZW1vdmVDbGFzcyIsInNob3ciLCJBcHAiLCJzdXBwb3J0c0ZpbGVBUEkiLCJlbXB0eSIsImFwcGVuZCIsImFwcGx5IiwiZmlsZXVwbG9hZCIsImRhdGEiLCJkZXN0cm95Iiwib25jaGFuZ2UiLCJlIiwiX29uU2VsZWN0RmlsZSIsImJpbmQiLCJjb250ZW50Tm9kZSIsImlubmVySFRNTCIsImZpbGVBcmVhIiwiYnRuVXBsb2FkRmlsZXMiLCJvblVwZGF0ZVByb2dyZXNzIiwiX2Jyb3dlc0ZvckZpbGVzIiwiY2xpY2siLCJyZW1vdmVGaWxlIiwiZ2V0RmlsZUl0ZW1zIiwiZmlsZUl0ZW1zIiwiZmlsZXMiLCJkZXNjcmlwdGlvbiIsImkiLCJsZW5ndGgiLCJfZ2V0RmlsZURlc2NyaXB0aW9uIiwicHVzaCIsImZpbGUiLCJmaWxlTmFtZSIsIm5hbWUiLCJmaWxlSW5kZXgiLCJuIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImRlc2MiLCJ2YWx1ZSIsIl9idWlsZEZvcm0iLCJoaWRlIiwiX2FkZEZpbGUiLCJpbmRleCIsImZpbGVsZW5ndGgiLCJfZ2V0RmlsZUxlbmd0aCIsIl9nZXREZWZhdWx0RGVzY3JpcHRpb24iLCJzaXplIiwiYmxvYiIsImJ5dGVzVGV4dEJ5dGVzIiwiTWF0aCIsInJvdW5kIiwiYnl0ZXNUZXh0Qnl0ZXNCeXRlcyIsImZpbGVuYW1lIiwicmVwbGFjZSIsIm9uVXBsb2FkRmlsZXMiLCJ0cGwiLCJhZGRDbGFzcyIsInByZXBlbmQiLCJwcm9ncmVzcyIsImNhbmNlbFNlbGVjdCIsIm1zZyIsInByb2dyZXNzYmFyIiwiQXJyYXkiLCJpc05hTiIsInVwZGF0ZSIsInRleHQiLCJvblVwZGF0ZUZhaWxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxVQUFVLHVCQUFRLHdCQUFSLEVBQWtDLGdCQUFsQyxFQUEwQyxxQ0FBcUM7QUFDN0Y7QUFDQUMsZUFBV0YsU0FBU0UsU0FGeUU7QUFHN0ZDLGlCQUFhSCxTQUFTRyxXQUh1RTtBQUk3RkMsZ0JBQVlKLFNBQVNJLFVBSndFO0FBSzdGQyxnQkFBWUwsU0FBU0ssVUFMd0U7QUFNN0ZDLG9CQUFnQk4sU0FBU00sY0FOb0U7QUFPN0ZDLGlCQUFhUCxTQUFTTyxXQVB1RTtBQVE3RkMscUJBQWlCUixTQUFTUSxlQVJtRTtBQVM3RkMsZUFBV1QsU0FBU1MsU0FUeUU7QUFVN0ZDLHNCQUFrQlYsU0FBU1UsZ0JBVmtFOztBQVk3Rjs7Ozs7Ozs7OztBQVVBQyxxQkFBaUIsSUFBSUMsUUFBSixDQUFhLENBQzVCLGtFQUQ0QiwrSEFBYixDQXRCNEU7O0FBNkI3Rjs7OztBQUlBQywwQkFBc0IsSUFBSUQsUUFBSixDQUFhLENBQ2pDLHFDQURpQyxDQUFiLENBakN1RTs7QUFxQzdGOzs7Ozs7O0FBT0FFLG9CQUFnQixJQUFJRixRQUFKLENBQWEsQ0FDM0IsNEdBRDJCLEVBRTNCLE1BRjJCLEVBRW5CO0FBQ1IsK0RBSDJCLGlVQVUzQixRQVYyQixFQVcz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dCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuXHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi4vVmlldyc7XHJcbmltcG9ydCAnLi4vRmllbGRzL1RleHRGaWVsZCc7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdmaWxlU2VsZWN0Jyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlZpZXdzLkZpbGVTZWxlY3RcclxuICogQGNsYXNzZGVzYyBGaWxlIFNlbGVjdCBWaWV3IGlzIGEgdmlldyBmb3Igc2VsZWN0aW9uIGZpbGVzIGNhcGFiaWxpdGllcy5cclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlZpZXdzLkZpbGVTZWxlY3QnLCBbVmlld10sIC8qKiBAbGVuZHMgYXJnb3MuVmlld3MuRmlsZVNlbGVjdCMgKi97XHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgYWRkRmlsZVRleHQ6IHJlc291cmNlLmFkZEZpbGVUZXh0LFxyXG4gIHVwbG9hZFRleHQ6IHJlc291cmNlLnVwbG9hZFRleHQsXHJcbiAgY2FuY2VsVGV4dDogcmVzb3VyY2UuY2FuY2VsVGV4dCxcclxuICBzZWxlY3RGaWxlVGV4dDogcmVzb3VyY2Uuc2VsZWN0RmlsZVRleHQsXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIGRlc2NyaXB0aW9uVGV4dDogcmVzb3VyY2UuZGVzY3JpcHRpb25UZXh0LFxyXG4gIGJ5dGVzVGV4dDogcmVzb3VyY2UuYnl0ZXNUZXh0LFxyXG4gIG5vdFN1cHBvcnRlZFRleHQ6IHJlc291cmNlLm5vdFN1cHBvcnRlZFRleHQsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSBsb2FkaW5nIG1lc3NhZ2Ugd2hlbiB0aGUgdmlldyBpcyByZXF1ZXN0aW5nIG1vcmUgZGF0YS5cclxuICAgKlxyXG4gICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIHVzZXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAqXHJcbiAgICogICAgICBuYW1lICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICogICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogICAgICBsb2FkaW5nVGV4dCAgICAgICAgIFRoZSB0ZXh0IHRvIGRpc3BsYXkgd2hpbGUgbG9hZGluZy5cclxuICAgKi9cclxuICBsb2FkaW5nVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpPjxsYWJlbCBpZD1cInByb2dyZXNzLWxhYmVsXCI+eyU9ICQubG9hZGluZ1RleHQgJX08L2xhYmVsPjwvbGk+JyxcclxuICAgIGA8bGkgY2xhc3M9XCJwcm9ncmVzc1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzc2JhclwiIGFyaWEtbGFiZWxsZWRieT1cInByb2dyZXNzLWxhYmVsXCI+PC9kaXY+XHJcbiAgICA8L2xpPmAsXHJcbiAgXSksXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgd2hlbiBIVE1MNSBmaWxlIGFwaSBpcyBub3Qgc3VwcG9ydGVkLlxyXG4gICAqL1xyXG4gIG5vdFN1cHBvcnRlZFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxoMj57JT0gJCQubm90U3VwcG9ydGVkVGV4dCAlfTwvaDI+JyxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBGaWxlIFNlbGVjdCB2aWV3IGluc3RhbmNlXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IHN0eWxlPVwicGFkZGluZy10b3A6IDEwcHg7XCIgZGF0YS10aXRsZT1cInslOiAkLnRpdGxlVGV4dCAlfVwiIGNsYXNzPVwicGFuZWwgdHdlbHZlIGNvbHVtbnMgeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8YnI+JywgLy8gVE9ETzogYWxsIHZpZXdzIHNob3VsZCBiZSBwbGFjZWQgaW4gLnJvdyAtPiAuY29sdW1uc1xyXG4gICAgJzxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImZpbGVBcmVhXCIgY2xhc3M9XCJmaWxlLWFyZWFcIj4nLFxyXG4gICAgYDxkaXYgY2xhc3M9XCJmaWVsZFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJmaWxlV3JhcHBlclwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJmaWxldXBsb2FkXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImZpbGV1cGxvYWRcIj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiPnslOiAkLmFkZEZpbGVUZXh0ICV9PC9zcGFuPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImJ0bkZpbGVTZWxlY3RcIiBuYW1lPVwiZmlsZS1pbnB1dFwiIHNpemU9XCI3MVwiIC8+XHJcbiAgICAgIDwvbGFiZWw+XHJcbiAgICA8L2Rpdj5gLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPHVsIGNsYXNzPVwibGlzdC1jb250ZW50XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImNvbnRlbnROb2RlXCI+PC91bD4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXR0b25zXCI+JyxcclxuICAgICc8ZGl2PjxidXR0b24gaWQ9XCJmaWxlU2VsZWN0LWJ0bi11cGxvYWRcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiYnRuVXBsb2FkRmlsZXNcIiBjbGFzcz1cImJ0bi1wcmltYXJ5XCIgZGF0YS1hY3Rpb249XCJvblVwbG9hZEZpbGVzXCI+PHNwYW4+eyU6ICQudXBsb2FkVGV4dCAlfTwvc3Bhbj48L2J1dHRvbj4nLFxyXG4gICAgJzxidXR0b24gaWQ9XCJmaWxlU2VsZWN0LWJ0bi1jYW5jZWxcIiBjbGFzcz1cImJ0blwiIGRhdGEtYWN0aW9uPVwiY2FuY2VsU2VsZWN0XCI+PHNwYW4+eyU6ICQuY2FuY2VsVGV4dCAlfTwvc3Bhbj48L2J1dHRvbj48ZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9IGZpbGVUZW1wbGF0ZVxyXG4gICAqL1xyXG4gIGZpbGVUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGkgY2xhc3M9XCJyb3cgeyU9ICQuY2xzICV9XCIgZGF0YS1wcm9wZXJ0eT1cInslPSAkLnByb3BlcnR5IHx8ICQubmFtZSAlfVwiPicsXHJcbiAgICAnPHAgY2xhc3M9XCJmaWxlLW5hbWVcIj57JTogJC5maWxlTmFtZSAlfTwvcD4nLFxyXG4gICAgJzxsYWJlbD57JTogJCQuZGVzY3JpcHRpb25UZXh0ICV9PC9sYWJlbD4nLFxyXG4gICAgJzxpbnB1dCBpZD1cInslPSAgJC5uYW1lICV9XCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cInslPSAgJC5kZXNjcmlwdGlvbiAlfVwiPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG5cclxuICBzaWduYXR1cmVOb2RlOiBudWxsLFxyXG4gIGlkOiAnZmlsZVNlbGVjdF9lZGl0JyxcclxuICBidG5GaWxlU2VsZWN0OiBudWxsLFxyXG4gIF9maWxlczogbnVsbCxcclxuICBfZm9ybVBhcnRzOiBbXSxcclxuXHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3IoKSB7fSxcclxuICBwb3N0Q3JlYXRlOiBmdW5jdGlvbiBwb3N0Q3JlYXRlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQocG9zdENyZWF0ZSwgYXJndW1lbnRzKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBAe2xpbmsgU2FnZS5QbGF0bGZvcm0uTW9iaWxlLlZpZXd9IHNob3cgdG8gY2xlYXIgb3V0IHRoZSBvbmNoYW5nZSBldmVudCBvZiB0aGUgZmlsZSBpbnB1dC5cclxuICAgKiBUaGUgb25jaGFuZ2UgZXZlbnQgd2lsbCBvbmx5IGZpcmUgb25jZSBwZXIgZmlsZSwgc28gd2UgbXVzdCByZS1pbnNlcnQgdGhlIGRvbSBub2RlIGFuZCByZS1hdHRhY2ggdGhlIGV2ZW50LlxyXG4gICAqIEBleHRlbmRzIHNob3dcclxuICAgKi9cclxuICBzaG93OiBmdW5jdGlvbiBzaG93KC8qIG9wdGlvbnMqLykge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc2hvdywgYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZiAoIUFwcC5zdXBwb3J0c0ZpbGVBUEkoKSkge1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuZW1wdHkoKS5hcHBlbmQodGhpcy5ub3RTdXBwb3J0ZWRUZW1wbGF0ZS5hcHBseSh7fSwgdGhpcykpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZmlsZXMgPSBbXTtcclxuXHJcbiAgICAvLyBSZXNldCB0aGUgaW5wdXQgb3IgdGhlIG9uY2hhbmdlIHdpbGwgbm90IGZpcmUgaWYgdGhlIHNhbWUgZmlsZSBpcyB1cGxvYWRlZCBtdWx0aXBsZSB0aW1lcy5cclxuICAgIGlmICgkKHRoaXMuZmlsZXVwbG9hZCkuZGF0YSgnZmlsZXVwbG9hZCcpKSB7XHJcbiAgICAgICQodGhpcy5maWxldXBsb2FkKS5kYXRhKCdmaWxldXBsb2FkJykuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgICQodGhpcy5maWxldXBsb2FkKS5maWxldXBsb2FkKCk7XHJcblxyXG4gICAgdGhpcy5idG5GaWxlU2VsZWN0Lm9uY2hhbmdlID0gZnVuY3Rpb24gb25jaGFuZ2UoZSkge1xyXG4gICAgICB0aGlzLl9vblNlbGVjdEZpbGUoZSk7XHJcbiAgICB9LmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5jb250ZW50Tm9kZS5pbm5lckhUTUwgPSAnJztcclxuICAgICQodGhpcy5maWxlQXJlYSkuc2hvdygpO1xyXG4gICAgJCh0aGlzLmJ0blVwbG9hZEZpbGVzKS5zaG93KCk7XHJcbiAgICB0aGlzLm9uVXBkYXRlUHJvZ3Jlc3MoJzAnKTtcclxuICB9LFxyXG4gIF9icm93ZXNGb3JGaWxlczogZnVuY3Rpb24gX2Jyb3dlc0ZvckZpbGVzKC8qIGZpbGUqLykge1xyXG4gICAgdGhpcy5idG5GaWxlU2VsZWN0LmNsaWNrKCk7XHJcbiAgfSxcclxuICByZW1vdmVGaWxlOiBmdW5jdGlvbiByZW1vdmVGaWxlKC8qIGZpbGVJZCovKSB7fSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCB0aGUgcHJvcGVydGllcyBvZjogZmlsZSwgZmlsZU5hbWUsIGFuZCBkZXNjcmlwdGlvbi5cclxuICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICovXHJcbiAgZ2V0RmlsZUl0ZW1zOiBmdW5jdGlvbiBnZXRGaWxlSXRlbXMoKSB7XHJcbiAgICBjb25zdCBmaWxlSXRlbXMgPSBbXTtcclxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5fZmlsZXM7XHJcbiAgICBsZXQgZGVzY3JpcHRpb24gPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZGVzY3JpcHRpb24gPSB0aGlzLl9nZXRGaWxlRGVzY3JpcHRpb24oaSk7XHJcbiAgICAgIGZpbGVJdGVtcy5wdXNoKHtcclxuICAgICAgICBmaWxlOiBmaWxlc1tpXSxcclxuICAgICAgICBmaWxlTmFtZTogZmlsZXNbaV0ubmFtZSxcclxuICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmlsZUl0ZW1zO1xyXG4gIH0sXHJcbiAgX2dldEZpbGVEZXNjcmlwdGlvbjogZnVuY3Rpb24gX2dldEZpbGVEZXNjcmlwdGlvbihmaWxlSW5kZXgpIHtcclxuICAgIGNvbnN0IG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgRmlsZV8ke2ZpbGVJbmRleH1gKTtcclxuICAgIGxldCBkZXNjO1xyXG5cclxuICAgIGlmIChuKSB7XHJcbiAgICAgIGRlc2MgPSBuLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlc2M7XHJcbiAgfSxcclxuICBfb25TZWxlY3RGaWxlOiBmdW5jdGlvbiBfb25TZWxlY3RGaWxlKCkge1xyXG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmJ0bkZpbGVTZWxlY3QuZmlsZXM7XHJcbiAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5fZmlsZXMucHVzaChmaWxlc1tpXSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fYnVpbGRGb3JtKGZpbGVzKTtcclxuICAgIH1cclxuICAgICQodGhpcy5idG5VcGxvYWRGaWxlcykuc2hvdygpO1xyXG4gICAgJCh0aGlzLmZpbGVBcmVhKS5oaWRlKCk7XHJcbiAgfSxcclxuICBfYWRkRmlsZTogZnVuY3Rpb24gX2FkZEZpbGUoZmlsZSwgaW5kZXgpIHtcclxuICAgIGNvbnN0IGZpbGVsZW5ndGggPSB0aGlzLl9nZXRGaWxlTGVuZ3RoKGZpbGUpO1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbmFtZTogYEZpbGVfJHtpbmRleH1gLFxyXG4gICAgICBmaWxlTmFtZTogYCR7ZmlsZS5uYW1lfSAgKCR7ZmlsZWxlbmd0aH0pYCxcclxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuX2dldERlZmF1bHREZXNjcmlwdGlvbihmaWxlLm5hbWUpLFxyXG4gICAgfTtcclxuICAgICQodGhpcy5jb250ZW50Tm9kZSkuYXBwZW5kKHRoaXMuZmlsZVRlbXBsYXRlLmFwcGx5KGRhdGEsIHRoaXMpKTtcclxuICB9LFxyXG4gIF9nZXRGaWxlTGVuZ3RoOiBmdW5jdGlvbiBfZ2V0RmlsZUxlbmd0aChmaWxlKSB7XHJcbiAgICBsZXQgZmlsZWxlbmd0aCA9IDA7XHJcbiAgICBpZiAoZmlsZS5zaXplID09PSAwKSB7XHJcbiAgICAgIGZpbGVsZW5ndGggPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZmlsZWxlbmd0aCA9IGZpbGUuc2l6ZSB8fCBmaWxlLmJsb2IubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgaWYgKGZpbGVsZW5ndGggPT09IDApIHtcclxuICAgICAgZmlsZWxlbmd0aCArPSBgMCAke3RoaXMuYnl0ZXNUZXh0Qnl0ZXN9YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChmaWxlbGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGZpbGVsZW5ndGggPiAxMDI0KSB7XHJcbiAgICAgICAgICBpZiAoZmlsZWxlbmd0aCA+IDEwNDg1NzYpIHtcclxuICAgICAgICAgICAgZmlsZWxlbmd0aCA9IGAke01hdGgucm91bmQoZmlsZWxlbmd0aCAvIDEwNDg1NzYpfSBNQmA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmaWxlbGVuZ3RoID0gYCR7TWF0aC5yb3VuZChmaWxlbGVuZ3RoIC8gMTAyNCl9IEtCYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmlsZWxlbmd0aCArPSBgICR7dGhpcy5ieXRlc1RleHRCeXRlc0J5dGVzfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmlsZWxlbmd0aDtcclxuICB9LFxyXG4gIF9idWlsZEZvcm06IGZ1bmN0aW9uIF9idWlsZEZvcm0oZmlsZXMpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xyXG4gICAgICB0aGlzLl9hZGRGaWxlKGZpbGUsIGkpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2dldERlZmF1bHREZXNjcmlwdGlvbjogZnVuY3Rpb24gX2dldERlZmF1bHREZXNjcmlwdGlvbihmaWxlbmFtZSkge1xyXG4gICAgcmV0dXJuIGZpbGVuYW1lLnJlcGxhY2UoL1xcLltcXHddKi8sICcnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgdGhlIGRpc3BsYXkgd2hlbiB0aGUgdXNlciBjbGlja3MgdXBsb2FkLlxyXG4gICAqL1xyXG4gIG9uVXBsb2FkRmlsZXM6IGZ1bmN0aW9uIG9uVXBsb2FkRmlsZXMoKSB7XHJcbiAgICAkKHRoaXMuYnRuVXBsb2FkRmlsZXMpLmhpZGUoKTtcclxuICAgIGNvbnN0IHRwbCA9IHRoaXMubG9hZGluZ1RlbXBsYXRlLmFwcGx5KHRoaXMpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdsaXN0LWxvYWRpbmcnKTtcclxuICAgICQodGhpcy5jb250ZW50Tm9kZSkucHJlcGVuZCh0cGwpO1xyXG4gICAgJCgnI3Byb2dyZXNzYmFyJywgdGhpcy5jb250ZW50Tm9kZSkucHJvZ3Jlc3MoKTtcclxuICB9LFxyXG4gIGNhbmNlbFNlbGVjdDogZnVuY3Rpb24gY2FuY2VsU2VsZWN0KCkge30sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgZGlzcGxheSB3aGVuIHByb2dyZXNzIGV2ZW50cyBhcmUgcmVjaWV2ZWQuXHJcbiAgICovXHJcbiAgb25VcGRhdGVQcm9ncmVzczogZnVuY3Rpb24gb25VcGRhdGVQcm9ncmVzcyhtc2cpIHtcclxuICAgIGNvbnN0IHByb2dyZXNzYmFyID0gJCgnI3Byb2dyZXNzYmFyJywgdGhpcy5jb250ZW50Tm9kZSk7XHJcbiAgICBpZiAocHJvZ3Jlc3NiYXIubGVuZ3RoKSB7XHJcbiAgICAgIGlmICghKG1zZyBpbnN0YW5jZW9mIEFycmF5KSAmJiAhaXNOYU4obXNnLnJlcGxhY2UoJyUnLCAnJykpKSB7XHJcbiAgICAgICAgcHJvZ3Jlc3NiYXIuZGF0YSgncHJvZ3Jlc3MnKS51cGRhdGUobXNnLnJlcGxhY2UoJyUnLCAnJykpO1xyXG4gICAgICB9XHJcbiAgICAgICQoJyNwcm9ncmVzcy1sYWJlbCcsIHRoaXMuY29udGVudE5vZGUpLnRleHQoYCR7dGhpcy5sb2FkaW5nVGV4dH0gJHttc2d9YCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBkaXNwbGF5IHdoZW4gdGhlIHVwbG9hZCBmYWlscy5cclxuICAgKi9cclxuICBvblVwZGF0ZUZhaWxlZDogZnVuY3Rpb24gb25VcGRhdGVGYWlsZWQobXNnKSB7XHJcbiAgICB0aGlzLm9uVXBkYXRlUHJvZ3Jlc3MobXNnKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=