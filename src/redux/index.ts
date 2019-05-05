import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers, compose, Store } from 'redux';
import { rootReducer } from './reducers';

export const store: Store = createStore(
  combineReducers(rootReducer),
  compose(
    applyMiddleware(thunk),
    ...(window.__REDUX_DEVTOOLS_EXTENSION__
      ? [window.__REDUX_DEVTOOLS_EXTENSION__()]
      : []),
  ),
);
