import { Message } from 'dashkit-ui';
import * as actions from './actions';
import { getJSON } from '../../lib/utils';
import { SideEffect, OriginStationData } from '../typings';

export function fetchStationData(): SideEffect<void> {
  return async (dispatch) => {
    dispatch(actions.actionStationData());

    try {
      const resp = await getJSON<OriginStationData>(`/mock-api/stations.json`);
      if (resp) {
        dispatch(actions.actionStationDataFullfilled(resp));
      } else {
        dispatch(actions.actionStationDataRejected());
      }
    } catch (err) {
      Message.error('Failure to fetch station data!');
      dispatch(actions.actionStationDataRejected());
    }
  };
}

export function getMetroRoutes(from: string, to: string): SideEffect<void> {
  return async (dispatch) => {
    dispatch(actions.actionMetroRoutes(from, to));
  }
}

export function updateStation(value: string, key: string): SideEffect<void> {
  return async (dispatch) => {
    dispatch(actions.actionUpdateStation(value, key));
  }
}
