import {connection} from './Models/Connection';

function model(actions) {
  const connection$ = connection(actions.updateConnection$);
  return Rx.Observable.combineLatest(connection$, (connectionState) => {
    return {
      connectionState,
    };
  });
}

export {
  model
};
