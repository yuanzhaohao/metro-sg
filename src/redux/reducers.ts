import { RouterState, routerReducer } from 'react-router-redux';
import { ListState, default as ListReducer } from './list/reducer';

export type RootState = {
  router: RouterState;
  list: ListState;
};

export const rootReducer = {
  router: routerReducer,
  list: ListReducer,
}
