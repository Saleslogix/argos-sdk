/* Copyright (c) 2015 Infor. All rights reserved.
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
import declare from 'dojo/_base/declare';
import OfflineManager from './OfflineManager';


/**
 * @class argos._DetailOfflineMixin
 * A mixin that provides the detail view offline specific methods and properties
 * @alternateClassName _DetailOfflineMixin
 */
export default declare('argos._DetailOfflineMixin', null, {

  onContentChange: function onContentChange() {
    if (this.enableOffline) {
      this.saveOffline();
    }
  },
  saveOffline: function saveOffline() {
    OfflineManager.saveDetailView(this).then(function success() {
    }, function err(error) {
      console.error(error);// eslint-disable-line
    });
  },
  getOfflineDescription: function getOfflineDescription() {
    return this.entry.$descriptor;
  },
  getOfflineIcon: function getOfflineIcon() {
    const model = this.getModel();
    return model.iconClass;
  },
});
