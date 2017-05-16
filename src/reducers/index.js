import { SET_MAX_VIEWPORTS, SHOW_VIEW } from '../actions/index';
import { SET_CONNECTION_STATE } from '../actions/connection';
import { WINDOW_RESIZE, BREAKPOINTS } from '../actions/window';

const initialSDKState = {
  online: false,
  maxviewports: 3,
  viewset: [],
  history: [],
};

function showView(state, action) {
  const viewId = action.payload.viewId;
  const viewOptions = action.payload.viewOptions;
  const currentHash = action.payload.currentHash;
  const viewIndex = state.viewset.indexOf(viewId);

  let newViewSet;
  if (viewIndex > -1) {
    // The view already exists in the viewset, preserve up to that view, removing everything to the right
    newViewSet = [...state.viewset].slice(0, viewIndex + 1);
  } else if (state.viewset.length < state.maxviewports) {
    // Push new item on
    newViewSet = [...state.viewset, viewId];
  } else {
    // Insert the new id, shift all indexes to the left, removing the first
    newViewSet = [...state.viewset, viewId].slice(1);
  }
  return {
    ...state,
    viewset: newViewSet,
    history: [...state.history, {
      hash: currentHash,
      page: viewId,
      viewset: newViewSet,
      tag: viewOptions && viewOptions.tag || '',
      data: viewOptions && viewOptions.data || '',
    }],
  };
}

function windowResize(state, action) {
  const width = action.payload.width;
  let maxviewports = 1;

  if (width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.LARGE) {
    maxviewports = 2;
  } else if (width >= BREAKPOINTS.LARGE) {
    maxviewports = 3;
  }
  return {
    ...state,
    maxviewports,
  };
}

export function sdk(state = initialSDKState, action) {
  const { type, payload, error, meta } = action; // eslint-disable-line
  switch (type) {
    case SET_MAX_VIEWPORTS:
      return Object.assign({}, state, {
        maxviewports: payload.max,
      });
    case SHOW_VIEW:
      return showView(state, action);
    case SET_CONNECTION_STATE:
      return Object.assign({}, state, {
        online: payload.online,
      });
    case WINDOW_RESIZE:
      return windowResize(state, action);
    default:
      return state;
  }
}
