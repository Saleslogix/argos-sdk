// action Types
export const SET_MAX_VIEWPORTS = 'SET_MAX_VIEWPORTS';
export const SHOW_VIEW = 'SHOW_VIEW';
export const RESET_VIEWSET = 'RESET_VIEWSET';

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

export function showView(viewId, viewOptions, currentHash, currentViewId) {
  return {
    type: SHOW_VIEW,
    payload: {
      viewId,
      viewOptions,
      currentHash,
      currentViewId,
    },
  };
}

export function resetViewSet() {
  return {
    type: RESET_VIEWSET,
    payload: null,
  };
}
