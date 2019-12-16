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