import { getJSON } from '../../lib/agent';

export function fetchStationDataAction() {
  return async function(dispatch) {
    const resp = await getJSON(`/mock-api/stations.json`);
    if (resp) {
      dispatch({
        type: 'FETCH_STATION_DATA_SUCCESS',
        payload: resp,
      });
    } else {
      dispatch({
        type: 'FETCH_STATION_DATA_FAIL',
      });
    }
  }
}