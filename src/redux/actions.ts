import { ActionsUnion } from './typings';
import { LocationChangeAction, RouterAction } from 'react-router-redux';
import * as indexActions from './list/actions';

const rootActions = {
  indexActions,
};

type AppActions = ActionsUnion<typeof rootActions>;
export type ReactRouterActions = RouterAction | LocationChangeAction;
export type RootAction = AppActions | ReactRouterActions;
