import { SET_MAX_VIEWPORTS, INSERT_HISTORY, SET_VIEWSET } from '../actions/index';
import { SET_CONNECTION_STATE } from '../actions/connection';

const initialSDKState = {
  online: false,
  viewports: 1,
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
    case SET_CONNECTION_STATE:
      return Object.assign({}, state, {
        online: payload.online,
      });
    default:
      return state;
  }
}
