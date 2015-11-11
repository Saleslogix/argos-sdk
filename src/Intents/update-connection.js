/**
 * Observable that fires when connection state changes.
 */
const updateConnection$ = new Rx.ReplaySubject(1);

/**
 * @param {Boolean} Connection state
 */
function updateConnectionState(state) {
  updateConnection$.onNext(state);
}

export { updateConnectionState, updateConnection$ };
