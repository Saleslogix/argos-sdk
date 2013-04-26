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
 * File Manager 
 */
define('Sage/Platform/Mobile/FileManager', [
    'dojo/_base/lang',
    'dojo/_base/declare',
    'dojo/number'
], function(
    lang,
    declare,
    dNumber
) {
    return declare('Sage.Platform.Mobile.FileManager', null, {
        unableToUploadText: '',
        unknownSizeText: 'unknown',
        largeFileWarningText: 'Warning: This request exceed the size limit set by your administrator and fail to upload.',
        largeFileWarningTitle: 'Warning',
        percentCompleteText: 'Uploading, please wait...',
        fileUploadOptions: { maxFileSize: 4000000 },
        _store: false,
        _totalProgress: 0,
        _files: [],
        _fileCount: 0,
        _filesUploadedCount: 0,
        _isUploading: false,


        constructor: function() {

        },

        isHTML5Supported:function(){
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                return true;
            }
            return false;
        },
        isFileSizeAllowed: function(files) {
            var l = 0;
            var maxfileSize = this.fileUploadOptions.maxFileSize;
            var title = this.largeFileWarningTitle;
            var msg = this.largeFileWarningText;
            for (var i = 0; i < files.length; i++) {
                if (files[i].size === 0) {
                    // do nothing.
                } else {
                    l += files[i].size || files[i].blob.length;
                }
            }
            if (l > (maxfileSize)) {
                //dialogs.showError(msg, title);
                return false;

            }
            return true;
        },
        uploadFile: function(file, url, progress, complete, error, scope, asPut) {
            if (!this.isFileSizeAllowed([file])) {
                return;
            }
            if (this.isHTML5Supported()) {
                this._uploadFileHTML5_asBinary(file, url, progress, complete, error, scope, asPut);
            } else {
                this._showUnableToUploadError();
            }
        },
        uploadFileHTML5: function(file, url, progress, complete, error, scope, asPut) {
            if (!this.isFileSizeAllowed([file])) {
                return;
            }
            if (this.isHTML5Supported()) {
                this._uploadFileHTML5_asBinary(file, url, progress, complete, error, scope, asPut);
            } else {
                this._showUnableToUploadError();
            }
        },
        _uploadFileHTML5: function(file, url, progress, complete, error, scope, asPut) {
            if (!this.isHTML5Supported() || !window.FormData) {
                this._showUnableToUploadError();
                return;
            }
            if (!url) {
                //assume Attachment SData url
                url = 'sdata/slx/system/-/attachments/file';
            }
            var fd = new FormData();
            //fd.append('filename*', encodeURI(file.name)); //Does not work
            fd.append('file_', file, encodeURI(file.name)); // Does not work
            //fd.name = encodeURI(file.name)
            var request = new XMLHttpRequest(), service = App.getService();

            request.open((asPut) ? 'PUT' : 'POST', url);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            if (service) {
                request.setRequestHeader('X-Authorization', service.createBasicAuthToken());
                request.setRequestHeader('X-Authorization-Mode', 'no-challenge');
            }

            if (complete) {
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        //console.log(JSON.parse(xhr.responseText.replace(/^\{\}&&/, '')));
                        if (Math.floor(request.status / 100) !== 2) {
                            if (error) {
                                error.call(scope || this, request);
                            }
                        } else {
                            complete.call(scope || this, request);
                        }
                    }
                };
            }
            if (progress) {
                request.upload.addEventListener('progress', function(e) {
                    progress.call(scope || this, e);
                });
            }
            request.send(fd);
        },
        _uploadFileHTML5_asBinary: function(file, url, progress, complete, error, scope, asPut) {
            if (!this.isHTML5Supported()) {
                this._showUnableToUploadError();
                return;
            }
            if (!url) {
                //assume Attachment SData url
                url = 'slxdata.ashx/slx/system/-/attachments/file';
            }
            var request = new XMLHttpRequest(), service = App.getService(), reader;
            request.open((asPut) ? 'PUT' : 'POST', url);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            if (service) {
                request.setRequestHeader('X-Authorization', service.createBasicAuthToken());
                request.setRequestHeader('X-Authorization-Mode', 'no-challenge');
            }

            reader = new FileReader();
            reader.onload = function(evt) {
                var binary = evt.target.result;
                var boundary = "---------------------------" + (new Date()).getTime();
                var dashdash = '--';
                var crlf = '\r\n';
                var msg = dashdash + boundary + crlf;
                //msg += 'Content-Disposition: form-data; '; //Will not work for raw binary
                msg += 'Content-Disposition: attachment; ';
                msg += 'name="file_"; ';
                msg += 'filename*="' + encodeURI(file.name) + '" ';
                msg += crlf;
                msg += 'Content-Type: ' + file.type;
                msg += crlf + crlf;
                msg += binary;
                msg += crlf;
                msg += dashdash + boundary + dashdash + crlf;

                if (complete) {
                    request.onreadystatechange = function() {
                        if (request.readyState === 4) {

                            //console.log(JSON.parse(xhr.responseText.replace(/^\{\}&&/, '')));
                            console.log('responseText: ' + request.responseText);

                            if (Math.floor(request.status / 100) !== 2) {
                                if (error) {
                                    error.call(scope || this, request);
                                }
                            } else {
                                complete.call(scope || this, request);
                            }
                        }
                    };
                }
                if (progress) {
                    request.upload.addEventListener('progress', function(e) {
                        progress.call(scope || this, e);
                    });
                }
                //request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary); //Will not work for raw binary
                request.setRequestHeader('Content-Type', 'multipart/attachment; boundary=' + boundary);
                if (request.sendAsBinary) {
                    request.sendAsBinary(msg);
                } else {
                    request.send(msg);
                }

            };
            reader.readAsBinaryString(file);
        },
        _showUnableToUploadError: function() {
            //dialogs.showError(this.unableToUploadText);
        },
        formatFileSize: function(size) {
            size = parseInt(size, 10);
            if (size === 0) {
                return '0 KB';
            }
            if (!size || size < 0) {
                return this.unknownSizeText;
            }
            if (size < 1024) {
                return '1 KB';
            }
            return dNumber.format(Math.round(size / 1024)) + ' KB';
        }
    });
});
