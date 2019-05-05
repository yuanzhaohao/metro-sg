import { ThunkAction } from 'redux-thunk';
import { RootAction } from './actions';
import { RootState } from './reducers';

export type AnyFunction<R = any> = (...args: any[]) => R;

export type SideEffect<T> = ThunkAction<Promise<T>, RootState, {}, RootAction>;

export type ConvertThunkMethods<A extends {}> = {
  [K in keyof A]: A[K] extends (
    ...args: infer T
  ) => ThunkAction<infer R, any, any, any>
    ? (...args: T) => R
    : A[K]
};

export type WithRedux<
  S extends (obj: {}) => {},
  A extends {} = {}
> = ReturnType<S> & ConvertThunkMethods<A>;

type ActionsUnionSingleReducer<T extends { [key: string]: AnyFunction }> = {
  [K in keyof T]: ReturnType<T[K]>
}[keyof T];

export type ActionsUnion<
  T extends { [reducerKey: string]: { [actionKey: string]: AnyFunction } }
> = { [K in keyof T]: ActionsUnionSingleReducer<T[K]> }[keyof T];

export type OriginStationData = {
  [key: string]: { [key: string]: number | number[] }
};

export type LineItem = {
  isRoundLine?: boolean,
  stations: string[];
  transformStations: string[];
};

export type LineData = {
  [key: string]: LineItem;
};

export type StationData = { [key: string]: string[] };

export type ShortestRoutes = string[][];
