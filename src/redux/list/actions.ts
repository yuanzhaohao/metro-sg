import { createAction } from '../../lib/utils';
import { OriginStationData } from '../typings';
import { ActionTypes } from './constants';

export const actionStationData = createAction(() => ({
  type: ActionTypes.FETCH_STATION_DATA,
}));

export const actionStationDataFullfilled = createAction(
  (data: OriginStationData) => ({
    type: ActionTypes.FETCH_STATION_DATA_FULFILLED,
    data,
  }),
);

export const actionStationDataRejected = createAction(() => ({
  type: ActionTypes.FETCH_STATION_DATA_REJECTED,
}));

export const actionMetroRoutes = createAction(
  (from: string, to: string) => ({
    type: ActionTypes.GET_METRO_ROUTES,
    from,
    to,
  }),
);
