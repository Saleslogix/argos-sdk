import Rx from 'rxjs';
import { connection } from './Models/Connection';

/**
 * Collects intents/actions and returns a combined Observable for all the state
 * models.
 * @param {Object} actions Object of all intents.
 */
function model(actions) {
  const connection$ = connection(actions.updateConnection$);
  return Rx.Observable.combineLatest(connection$, (connectionState) => {
    return {
      connectionState,
    };
  });
}

export {
  model,
};
