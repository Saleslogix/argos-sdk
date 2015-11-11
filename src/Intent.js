import {updateConnection$} from './Intents/update-connection';

/**
 * Returns an object with all intents.
 * @returns {Object}
 */
function intent() {
  return {
    updateConnection$,
  };
}

export { intent };
