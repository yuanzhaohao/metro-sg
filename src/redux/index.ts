import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';

// export const store = applyMiddleware(thunk)(createStore);
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
);