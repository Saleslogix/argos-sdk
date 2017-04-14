// action Types
export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';

/*

See: https://github.com/acdlite/flux-standard-action

An action MUST
+ be a plain JavaScript object.
+ have a type property.

 An action MAY
+ have an error property.
+ have a payload property.
+ have a meta property.

An action MUST NOT
+ include properties other than type, payload, error, and meta.
*/

// creators
export function setConnectionState(online) {
  return {
    type: SET_CONNECTION_STATE,
    payload: {
      online,
    },
  };
}
