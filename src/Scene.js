import {
  insertHistory,
  setViewSet,
} from './actions';

/*
Viewsets (visible) | history

Two viewports:
[ 1 ] | [ { viewset: [ 1 ], viewports: 1 } ] <-- 1 viewport, go full screen (viewports < maxviewports)
[ 1, 2 ] | [{ viewset: [ 1 ], viewports: 1 }, { viewset: [ 1, 2 ], viewports: 2 } ] <-- 2 viewports, go split (viewports === maxviewports)
[ 2, 3 ] | [{ viewset: [ 1 ], viewports: 1 }, { viewset: [ 1, 2 ], viewports: 2 }, { viewset: [ 2, 3 ], viewports: 2 } ] <-- shift view 2 left and push 3 on
-- Window resize, max viewport set to 1 --
[ 2, 3 ] | [ { viewset: [ 1 ], viewports: 1 },
             { viewset: [ 1 , 2], viewports: 2 },
             { viewset: [ 2, 3 ], viewports: 1 } ] <-- Render the right most N item(s) in the viewset where N is the viewport

Assume the rest of the history is an object containing the viewset and viewports
-- User hits back
[ 1, 2 ] | [ 1, 2 ] <-- Still 1 viewport
-- User maxes Window
[ 1, 2 ] | [ 1, 2 ] <-- no history changes, just render N right most supported views

Three viewports:
[ 1 ] | [ 1 ]
[ 1, 2 ] | [ 1, 2 ] <-- Expand 2 to fill the remaining available viewports (viewports < maxviewports)
[ 1, 2, 3 ] | [ 1, 2, 3] <-- 3 way split
[ 2, 3, 4 ] | [ 1, 2, 3, 4 ] <-- Right N viewports rendered where N = maxviewports
-- User hits back
[ 1, 2, 3 ] | [ 1, 2, 3 ]
-- User hits back
[ 1, 2 ] | [1, 2]
-- User hits back
[1 ] | [ 1 ] <-- viewport filled again

A view might want to indicate a new viewset should be created in the middle of navigating:
[ 1 ] | [ 1 ]
[ 1, 2 ] | [ 1, 2 ]
[ 3 ] | [ { viewset: [ 1 ], viewports: 1 },
          { viewset: [ 1, 2 ], viewports: 2 },
          { viewset: [ 3 ], viewports: 1 } ] <-- New viewset triggered, viewports reset to 1
[ 3, 4 ] | [ 1, 2, 3, 4 ]
-- User hits back
[ 3 ] | [ 1, 2, 3 ]
*/
export default class Scene {
  constructor(store) {
    this.store = store;
  }

  _select(id, value) {
    const domNode = document.getElementById(id);
    if (domNode) {
      domNode.setAttribute('selected', value);
    }
  }

  _setSelectedState(views, state) {
    views.forEach(id => this._select(id, state));
  }

  show(view, options) {
    const store = this.store;
    const state = store.getState();
    const {
      sdk: {
        viewset,
        maxviewports,
      },
    } = state;

    const viewIndex = viewset.indexOf(view.id);
    let newViewSet;
    let removedViews = [];

    if (viewIndex > -1) {
      // The view already exists in the viewset, preserve up to that view, removing everything to the right
      newViewSet = [...viewset].slice(0, viewIndex + 1);
      removedViews = viewset.slice(viewIndex + 1);
    } else if (viewset.length < maxviewports) {
      // Push new item on
      newViewSet = [...viewset, view.id];
    } else {
      // Insert the new id, shift all indexes to the left, removing the first
      newViewSet = [...viewset, view.id].slice(1);
      removedViews = viewset.slice(0, 1);
    }

    console.dir(removedViews);
    this._setSelectedState(removedViews, false);
    const currentHash = window && window.location.hash || '';

    const data = {
      hash: currentHash,
      page: view.id,
      viewset: newViewSet,
      tag: options && options.tag || '',
      data: options && options.data || '',
    };

    store.dispatch(setViewSet(newViewSet));
    store.dispatch(insertHistory(data));
    this._select(view.id, true);
  }
}
