import { OriginStationData, LineData, StationData, ShortestRoutes } from '../typings';
import { ActionTypes } from './constants';
import { RootAction } from '../actions';
import { getOriginData, guideMetroRoutes } from '../../lib/metro';

export type ListState = {
  isLoading: boolean;
  isError: boolean;
  data?: OriginStationData;
  lineData: LineData,
  stationData: StationData,
  shortestRoutes?: ShortestRoutes
};
const initialState: ListState = {
  isLoading: false,
  isError: false,
  lineData: {},
  stationData: {},
};

export default function (state = initialState, action: RootAction) {
  switch(action.type) {
    case ActionTypes.FETCH_STATION_DATA: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ActionTypes.FETCH_STATION_DATA_FULFILLED: {
      const { data } = action;
      const { lineData, stationData } = getOriginData(data);

      return {
        ...state,
        isLoading: false,
        lineData,
        stationData,
      };
    }
    case ActionTypes.FETCH_STATION_DATA_REJECTED: {
      return {
        ...state,
        isError: true,
      };
    }
    case ActionTypes.GET_METRO_ROUTES: {
      const { to, from } = action;
      const { lineData, stationData } = state;
      const shortestRoutes = guideMetroRoutes(lineData, stationData, from, to);
      return {
        ...state,
        shortestRoutes,
      };
    }
    default:
      return state;
  }
};
