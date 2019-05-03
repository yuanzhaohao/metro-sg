import stations from './stations';
import { includes, forEach, isArray } from 'lodash';

export type LineItem = {
  isRoundLine?: boolean,
  stations: string[];
  transformStations: string[];
};

export type StationListType = string[];
export type HistoryType = string[];
export type ShortestRoutes = string[][];

const { lineData, stationData } = getOriginalData();
console.log('lineData', lineData);
// console.log('stationData', stationData);

function getOriginalData() {
  const lineData: {
    [key: string]: LineItem;
  } = {};
  const stationData: { [key: string]: string[] } = {};

  forEach(stations, (stationLines, stationKey) => {
    const stationLinesKeys = Object.keys(stationLines);
    const ccIndex = stationLinesKeys.indexOf('CC');
    const isCircleLine = ccIndex !== -1 && stationLinesKeys.indexOf('CE') !== -1;

    if (isCircleLine) {
      stationLinesKeys.splice(ccIndex, 1);
    }
    stationData[stationKey] = stationLinesKeys;

    forEach(stationLines, (stationLine, lineKey) => {
      const line = lineData[lineKey] || {
        stations: {},
        transformStations: [],
      };


      if (stationLinesKeys.length > 1) {
        line.transformStations.push(stationKey);
      }

      if (isArray(stationLine)) {
        for(let k of stationLine) {
          line.stations[k] = stationKey;
        }
        line.isRoundLine = true;
      } else {
        line.stations[stationLine] = stationKey;
      }

      lineData[lineKey] = line;
    });
  });

  forEach(lineData, (line) => {
    const stations = Object.keys(line.stations).map((k: any) => line.stations[k]);
    line.stations = Array.from(new Set(stations));
    line.transformStations = Array.from(new Set(line.transformStations));
  });

  // CC & CE line
  const ccList = lineData['CC'].stations;
  const ceList = lineData['CE'].stations;
  let intersection = ccList.filter(v => includes(ceList, v));
  lineData['CC'].stations = ccList.filter(v => !includes(intersection.slice(1), v));
  lineData['CC'].transformStations.concat(intersection.slice(0, 1));
  lineData['CE'].transformStations.concat(intersection.slice(0, 1));

  return {
    lineData,
    stationData,
  };
}


export function guideMetroRoutes(fromStation: string, toStation: string) {
  if (!stationData[fromStation]) {
    throw new Error(`${fromStation} is not foound!`);
  }
  if (!stationData[toStation]) {
    throw new Error(`${toStation} is not foound!`);
  }

  if (fromStation === toStation) {
    return fromStation;
  }
  const startLines = stationData[fromStation];
  const history: HistoryType = [];
  const shortestRoutes: ShortestRoutes = [];
  let minTransCount = 5;

  console.log(startLines);
  for (let line of startLines) {
    guideRoute(fromStation, toStation, line, [], history, 0);
  }

  shortestRoutes.sort(function(a, b) {
    return a.length - b.length;
  });
  console.log(shortestRoutes);
  return shortestRoutes.slice(0, 3);

  function guideRoute(
    startStation: string,
    endStation: string,
    lineKey: string,
    stationList: StationListType,
    history: HistoryType,
    transNum: number,
  ) {
    if (startStation === endStation) {
      return;
    }
    if (transNum > minTransCount) {
      return;
    }
    if (isSameLine(startStation, endStation, lineKey)) {
      const currentRoute = cutLine(startStation, endStation, lineKey);
      // const shortestRoute = Array.from(new Set(stationList.concat(currentRoute.join(',')).join(',').split(',')));
      const shortestRoute = stationList.concat(currentRoute.join(',')).join(',').split(',');

      shortestRoutes.push(shortestRoute);
      stationList.pop();
      return;
    }

    const transformStations = lineData[lineKey].transformStations.filter(v => v !== startStation);

    for (let station of transformStations) {
      const currentRoute = cutLine(startStation, station, lineKey);
      const currentRouteString = currentRoute.join(',');
      if (includes(history, currentRouteString)) {
        continue;
      }
      history.push(currentRouteString);

      const restLines = stationData[station].filter(v => v !== lineKey);
      for (let restLineKey of restLines) {
        stationList.push(currentRouteString);
        guideRoute(station, endStation, restLineKey, stationList.slice(), history, transNum + 1);
        stationList.pop();
      }
    }
  }
}

function isSameLine(startStation: string, endStation: string, lineKey: string) {
  const { stations } = lineData[lineKey];
  return includes(stations, startStation) && includes(stations, endStation);
}

function cutLine(startStation: string, endStation: string, lineKey: string) {
  const { stations, isRoundLine } = lineData[lineKey];
  const startIndex = stations.indexOf(startStation);
  const endIndex = stations.indexOf(endStation);
  const indexAbs = Math.abs(endIndex - startIndex);
  const length = stations.length;
  const max = Math.max(startIndex, endIndex);
  const min = Math.min(startIndex, endIndex);

  if (isRoundLine && indexAbs > length - indexAbs) {
    return (startIndex > endIndex
      ? stations.slice(max, length).concat(stations.slice(0, min + 1))
      : stations.slice(0, min + 1).reverse().concat(stations.slice(max, length).reverse())
    );
  }

  const result = stations.slice(min, max + 1);
  // if (startStation === 'Jurong East' && endStation === 'Buona Vista') {
  //   console.log(startIndex < endIndex, result);
  //   debugger
  // }
  return (startIndex > endIndex
    ? result.reverse()
    : result
  );
}
