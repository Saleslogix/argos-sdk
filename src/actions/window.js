// action Types
export const WINDOW_RESIZE = 'WINDOW_RESIZE';

// $breakpoint-phone: 320px;
// $breakpoint-phone-to-tablet: 768px;
// $breakpoint-tablet-to-desktop: 1160px;
// $breakpoint-desktop-to-extralarge: 1440px;
export const BREAKPOINTS = {
  PHONE: 320,
  TABLET: 768,
  DESKTOP: 1160,
  LARGE: 1440,
};

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
export function windowResize(width, height) {
  return {
    type: WINDOW_RESIZE,
    payload: {
      width,
      height,
    },
  };
}
