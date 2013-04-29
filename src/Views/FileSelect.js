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

/**
 * File Select View is a view for selection files capabilities.
 *
 * It goes hand-in-hand with File Manager}
 */
define('Sage/Platform/Mobile/Views/FileSelect', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/window',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-class',
    'Sage/Platform/Mobile/FileManager',
    'Sage/Platform/Mobile/Fields/TextField',
    'Sage/Platform/Mobile/View'
], function(
    declare,
    lang,
    win,
    domConstruct,
    domAttr,
    domClass,
    FileManager,
    TextField,
    View
) {

    return declare('Sage.Platform.Mobile.Views.FileSelect', [View], {
        // Localization
        titleText: 'File Select',
        addFileText: 'Click or Tap here to add a file.',
        okText: 'Upload',
        cancelText: 'Cancel',
        selectFileText:'Select file', 
        loadingText: 'Uploading...',

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
        loadingTemplate: new Simplate([
            '<li class="list-loading-indicator"><div>{%= $.loadingText %}</div></li>'
        ]),

        /**
         * @property {Simplate}
         * Simplate that defines the HTML Markup
         *
         * * `$` => File Select view instance
         *
         */
        widgetTemplate: new Simplate([
            '<div title="{%: $.titleText %}" class="panel {%= $.cls %}">',
                '<div class="file-area">',
                    '<div class="file-wrapper">',
                        '<div class="file-wrap">',
                            '<input type="file" data-dojo-attach-point="btnFileSelect" size="71" accept="*/*">',
                        '</div>',
                        '{%: $.addFileText %}',
                    '</div>',
                '</div>',
                '<ul class="list-content"  data-dojo-attach-point="contentNode"></ul>',
                '<div class="buttons">',
                    '<div><button class="button inline" data-action="okSelect"><span>{%: $.okText %}</span></button>',
                    '<button class="button inline" data-action="cancelSelect"><span>{%: $.cancelText %}</span></button><div>',
                '</div>',
            '</div>',
        ]),
        fileTemplate: new Simplate([
            '<li class="row {%= $.cls %}" data-property="{%= $.property || $.name %}">',
                '<h4>{%: $.fileName %}<h4>',
            '</li>'
        ]),

        signatureNode: null,
        id: 'fileSelect_edit',
        fileManager: null,
        btnFileSelect: null,
        _files:null,
        _formParts: [],
        constructor: function() {
            this._fileManager = new FileManager();
        },
        postCreate: function() {
            this.inherited(arguments);
            this.btnFileSelect.onchange = lang.hitch(this, function(e){
                this._onSelectFile(e);
            });

            domClass.remove(this.domNode, 'list-loading');
        },
        show: function(options) {
            this.inherited(arguments);
            this._files = [];
            this.contentNode.innerHTML = "";
        },
        _browesForFiles: function(file) {
            this.btnFileSelect.click();
        },
        removeFile: function(fileId) {

        },
        getFiles: function (){
        
        },
        _onSelectFile: function(e){
            var files = this.btnFileSelect.files;
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    this._files.push(files[i]);
                }
                this._buildForm(files);
            }
        },
        _addFile: function (file, index){
            var filelength = this._getFileLength(file);
            var data = {
                name: 'File_' + index,
                fileName: file.name + "  (" + filelength + ")",
                description: this._getDefaultDescription(file.name)
            };
            var rowNode = domConstruct.place(this.fileTemplate.apply(data, this), this.contentNode, 'last');
        },
        _getFileLength: function(file) {
            var filelength = 0;
            if (file.size === 0) {
                filelength = 0;
            }
            else {
                filelength = file.size || file.blob.length;
            }
            if (filelength === 0) {
                filelength += "0 Bytes";
            }
            else {
                if (filelength) {
                    if (filelength > 1024) {
                        if (filelength > 1048576) {
                            filelength = Math.round(filelength / 1048576) + " MB";
                        } else {
                            filelength = Math.round(filelength / 1024) + " KB";
                        }
                    } else {
                        filelength += " Bytes";
                    }
                }
            }
            return filelength;
        },
        _buildForm: function(files) {
           for (var i = 0; i < files.length; i++) {
               var file = files[i];
               this._addFile(file, i);
              
           }
       },
       _uploadFile: function(file) {
            if (file) {
                var url = dString.substitute(this._uploadUrlFmt, [this.attachment.$key]);
                //Only Support by HTML5
                //fileUtility.uploadFileHTML5(file,
                //    url,
                //    false,
                //    this._newFileUploaded,
                //    this._requestFail,
                //    this,
                //    true);
            }
        },
        _getDefaultDescription: function (filename) {
            return filename.replace(/\.[\w]*/, '');
        },
        okSelect: function() {
            var tpl = this.loadingTemplate.apply(this);
            domClass.add(this.domNode, 'list-loading');
            domConstruct.place(tpl, this.contentNode, 'first');
        },
        cancelSelect: function() {
        }
    });
});

