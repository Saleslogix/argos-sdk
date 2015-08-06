define('argos/Views/FileSelect', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/has', 'dojo/dom-construct', 'dojo/dom-class', 'dojo/dom', '../Fields/TextField', '../View'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoHas, _dojoDomConstruct, _dojoDomClass, _dojoDom, _FieldsTextField, _View) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _has = _interopRequireDefault(_dojoHas);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _dom = _interopRequireDefault(_dojoDom);

  var _View2 = _interopRequireDefault(_View);

  /**
   * @class argos.Views.FileSelect
   * File Select View is a view for selection files capabilities.
   *
   * @alternateClassName FileSelect
   * @extends argos.View
   */
  var __class = (0, _declare['default'])('argos.Views.FileSelect', [_View2['default']], {
    // Localization
    titleText: 'File Select',
    addFileText: 'Click or Tap here to add a file.',
    uploadText: 'Upload',
    cancelText: 'Cancel',
    selectFileText: 'Select file',
    loadingText: 'Uploading...',
    descriptionText: 'description',
    bytesText: 'bytes',
    notSupportedText: 'Adding attachments is not supported by your device.',

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
    loadingTemplate: new Simplate(['<li class="list-loading-indicator"><div id="fileselect-upload-progress">{%= $.loadingText %}</div></li>']),

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
    widgetTemplate: new Simplate(['<div title="{%: $.titleText %}" class="panel {%= $.cls %}">', '<div  data-dojo-attach-point="fileArea" class="file-area">', '<div class="file-wrapper">', '<div class="file-wrap" data-dojo-attach-point="fileWrapper">', '<input type="file" data-dojo-attach-point="btnFileSelect" size="71" accept="*/*">', '</div>', '{%: $.addFileText %}', '</div>', '</div>', '<ul class="list-content"  data-dojo-attach-point="contentNode"></ul>', '<div class="buttons">', '<div><button id="fileSelect-btn-upload" data-dojo-attach-point="btnUploadFiles" class="button inline" data-action="onUploadFiles"><span>{%: $.uploadText %}</span></button>', '<button id="fileSelect-btn-cancel" class="button inline" data-action="cancelSelect"><span>{%: $.cancelText %}</span></button><div>', '</div>', '</div>']),
    /**
     * @property {Simplate} fileTemplate
     */
    fileTemplate: new Simplate(['<li class="row {%= $.cls %}" data-property="{%= $.property || $.name %}">', '<div class="file-name">{%: $.fileName %}</div>', '<div class="file-label"><label>{%: $$.descriptionText %}</label></div>', '<div class="file-text">', '<input id="{%=  $.name %}" type="text" value="{%=  $.description %}">', '</div>', '</li>']),

    signatureNode: null,
    id: 'fileSelect_edit',
    btnFileSelect: null,
    _files: null,
    _formParts: [],

    /**
     * @constructor
     */
    constructor: function constructor() {},
    postCreate: function postCreate() {
      this.inherited(arguments);
      _domClass['default'].remove(this.domNode, 'list-loading');
    },
    /**
     * Extends the @{link Sage.Platlform.Mobile.View} show to clear out the onchange event of the file input.
     * The onchange event will only fire once per file, so we must re-insert the dom node and re-attach the event.
     * @extends show
     */
    show: function show() {
      this.inherited(arguments);

      if (!(0, _has['default'])('html5-file-api')) {
        _domConstruct['default'].place(this.notSupportedTemplate.apply({}, this), this.domNode, 'only');
        return;
      }

      this._files = [];

      // Reset the input or the onchange will not fire if the same file is uploaded multiple times.
      // Unfortunately IE does not allow you to reset the value of a file input, so we have to clone the node and re-insert it.
      var node = this.btnFileSelect.cloneNode();

      _domConstruct['default'].destroy(this.btnFileSelect);
      this.fileWrapper.appendChild(node);
      this.btnFileSelect = node;

      this.btnFileSelect.onchange = (function onchange(e) {
        this._onSelectFile(e);
      }).bind(this);

      this.contentNode.innerHTML = '';
      _domClass['default'].remove(this.fileArea, 'display-none');
      _domClass['default'].remove(this.btnUploadFiles, 'display-none');
      this.onUpdateProgress('');
    },
    _browesForFiles: function _browesForFiles() {
      this.btnFileSelect.click();
    },
    removeFile: function removeFile() {},
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
      var n = _dom['default'].byId('File_' + fileIndex);
      var desc = undefined;

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
      _domClass['default'].remove(this.btnUploadFiles, 'display-none');
      _domClass['default'].add(this.fileArea, 'display-none');
    },
    _addFile: function _addFile(file, index) {
      var filelength = this._getFileLength(file);
      var data = {
        name: 'File_' + index,
        fileName: file.name + '  (' + filelength + ')',
        description: this._getDefaultDescription(file.name)
      };
      _domConstruct['default'].place(this.fileTemplate.apply(data, this), this.contentNode, 'last');
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
      _domClass['default'].add(this.btnUploadFiles, 'display-none');
      var tpl = this.loadingTemplate.apply(this);
      _domClass['default'].add(this.domNode, 'list-loading');
      _domConstruct['default'].place(tpl, this.contentNode, 'first');
    },
    cancelSelect: function cancelSelect() {},
    /**
     * Handles the display when progress events are recieved.
     */
    onUpdateProgress: function onUpdateProgress(msg) {
      var n = _dom['default'].byId('fileselect-upload-progress');
      if (n) {
        n.innerHTML = this.loadingText + ' ' + msg;
      }
    },
    /**
     * Handles the display when the upload fails.
     */
    onUpdateFailed: function onUpdateFailed(msg) {
      this.onUpdateProgress(msg);
      _domClass['default'].remove(this.domNode, 'list-loading');
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Views.FileSelect', __class);
  module.exports = __class;
});
/*options*/ /*file*/ /*fileId*/
