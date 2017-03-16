import declare from 'dojo/_base/declare';
import $ from 'jquery';

/**
 * @class argos.Dialogs.Toast
 * @alternateClassName Global Pop-up
 */
const __class = declare('argos.Dialogs.Toast', null, {
  containerNode: null,
  constructor: function constructor(options) {
    this.containerNode = options && options.containerNode;
  },
  add: function add(options = {}) {
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
  },
});

export default __class;
