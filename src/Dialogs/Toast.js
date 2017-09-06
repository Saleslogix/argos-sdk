/**
 * @class argos.Dialogs.Toast
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
