import {
  SET_MAX_VIEWPORTS,
  INSERT_HISTORY,
  SET_VIEWSET,
} from '../actions';

const initialSDKState = {
  maxviewports: 2,
  viewset: [],
  history: [],
};

export function sdk(state = initialSDKState, action) {
  const { type, payload, error, meta } = action; // eslint-disable-line
  switch (type) {
    case SET_MAX_VIEWPORTS:
      return Object.assign({}, state, {
        maxviewports: payload.max,
      });
    case SET_VIEWSET:
      return Object.assign({}, state, {
        viewset: payload.viewset,
      });
    case INSERT_HISTORY:
      return Object.assign({}, state, {
        history: [...state.history, payload.data],
      });
    default:
      return state;
  }
}
