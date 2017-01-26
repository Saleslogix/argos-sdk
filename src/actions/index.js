// action Types
export const SET_MAX_VIEWPORTS = 'SET_MAX_VIEWPORTS';
export const INSERT_HISTORY = 'INSERT_HISTORY';
export const SET_VIEWSET = 'SET_VIEWSET';

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
export function setMaxViewPorts(max) {
  return {
    type: SET_MAX_VIEWPORTS,
    payload: {
      max,
    },
  };
}

export function setViewSet(viewset) {
  return {
    type: SET_VIEWSET,
    payload: {
      viewset,
    },
  };
}

export function insertHistory(data) {
  return {
    type: INSERT_HISTORY,
    payload: {
      data,
    },
  };
}
