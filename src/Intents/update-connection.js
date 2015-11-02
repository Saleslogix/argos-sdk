const updateConnection$ = new Rx.ReplaySubject(1);

function updateConnectionState(state) {
  updateConnection$.onNext(state);
}

export { updateConnectionState, updateConnection$ };
