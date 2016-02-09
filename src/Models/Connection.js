/**
 * Model function that takes an action/intent and returns an Observable.
 * @param {Observable} updateConnection$ intent
 * @returns {Observable}
 */
function connection(updateConnection$) {
  return updateConnection$
    .distinctUntilChanged();
}

export { connection };
