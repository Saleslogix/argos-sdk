/* Copyright 2017 Infor
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

/**
 * @module argos/Dialogs/Toast
 */

/**
 * @class
 * @alias module:argos/Dialogs/Toast
 */
class Toast {
  constructor(options) {
    this.containerNode = options && options.containerNode;
  }

  add(options = {}) {
    const sohoToastOptions = {
      title: '',
      message: '',
      position: 'top right',
      timeout: 6000,
    };

    // Convert our toast options to soho.
    const convertedOptions = Object.assign({}, sohoToastOptions, {
      title: options.title,
      message: options.message,
      timeout: options.toastTime,
    });

    $(this.containerNode).toast(convertedOptions);
  }
}

export default Toast;
