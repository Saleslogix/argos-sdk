// action Types
export const SET_MAX_VIEWPORTS = 'SET_MAX_VIEWPORTS';
export const INSERT_HISTORY = 'INSERT_HISTORY';


// creators
export function setMaxViewPorts(max) {
  return {
    type: SET_MAX_VIEWPORTS,
    max,
  };
}

export function insertHistory(data) {
  return {
    type: INSERT_HISTORY,
    data,
  };
}
