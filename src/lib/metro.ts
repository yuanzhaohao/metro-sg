import { includes, forEach, isArray } from 'lodash-es';
import { OriginStationData, LineData, StationData, ShortestRoutes } from '../redux/typings';

export type StationListType = string[][];
export type HistoryType = {
  [key: string]: boolean;
};

export function guideMetroRoutes(
  lineData: LineData,
  stationData: StationData,
  fromStation: string,
  toStation: string,
) {
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
  const shortestRoutes: ShortestRoutes = [];
  const minTransCount = 5;
  let history: HistoryType | null = {};

  for (const line of startLines) {
    guideRoute(fromStation, toStation, line, [], history, 0);
  }

  shortestRoutes.sort((a, b) => {
    return a.length - b.length;
  });
  history = null;
  return shortestRoutes.slice(0, 3);

  function guideRoute(
    startStation: string,
    endStation: string,
    lineKey: string,
    stationList: StationListType,
    history: HistoryType,
    transNum: number,
  ) {
    if (transNum > minTransCount) {
      return;
    }
    if (isSameLine(lineData, startStation, endStation, lineKey)) {
      const currentRoute = cutLine(lineData, startStation, endStation, lineKey);

      stationList.push(currentRoute);
      const shortestRoute = stationList.reduce((accumulator, currentValue) =>
        accumulator.concat(currentValue),
      );
      shortestRoutes.push(Array.from(new Set(shortestRoute)));

      stationList.splice(stationList.indexOf(currentRoute), 1);
      return;
    }

    const transformStations = lineData[lineKey].transformStations.filter((v) => v !== startStation);

    forEach(transformStations, (station) => {
      const currentRoute = cutLine(lineData, startStation, station, lineKey);
      const historyKey = [startStation, station, lineKey].join(',');
      const newStationList = stationList.slice();
      if (history[historyKey]) {
        newStationList.splice(newStationList.indexOf(currentRoute), 1);
        return;
      }
      history[historyKey] = true;

      const restLines = stationData[station].filter((v) => v !== lineKey);
      forEach(restLines, (restLineKey) => {
        const newTransNum = transNum + 1;

        newStationList.push(currentRoute);
        guideRoute(station, endStation, restLineKey, newStationList, history, newTransNum);
        newStationList.splice(newStationList.indexOf(currentRoute), 1);
      });
    });
  }
}

export function getOriginData(originData: OriginStationData) {
  const lineData: LineData = {};
  const stationData: StationData = {};

  forEach(originData, (stationLines, stationKey) => {
    const stationLinesKeys = Object.keys(stationLines);
    const isCircleLine = includes(stationLinesKeys, 'CC') && includes(stationLinesKeys, 'CE');

    if (isCircleLine) {
      stationLinesKeys.splice(stationLinesKeys.indexOf('CC'), 1);
    }
    stationData[stationKey] = stationLinesKeys;

    forEach(stationLines, (stationLine, lineKey) => {
      // const stationLine = stationLines[lineKey];
      const line = lineData[lineKey] || {
        stations: {},
        transformStations: [],
      };

      if (stationLinesKeys.length > 1) {
        line.transformStations.push(stationKey);
      }

      if (isArray(stationLine)) {
        for (const k of stationLine) {
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
  const ccList = lineData.CC.stations;
  const ceList = lineData.CE.stations;
  const intersection = ccList.filter((v) => includes(ceList, v));
  lineData.CC.stations = ccList.filter((v) => !includes(intersection.slice(1), v));
  lineData.CC.transformStations = lineData.CC.transformStations
    .filter((v) => includes(lineData.CC.stations, v))
    .concat(intersection.slice(0, 1));
  lineData.CE.transformStations = lineData.CE.transformStations.concat(intersection.slice(0, 1));

  return {
    lineData,
    stationData,
  };
}

function isSameLine(lineData: LineData, startStation: string, endStation: string, lineKey: string) {
  const { stations } = lineData[lineKey];
  return includes(stations, startStation) && includes(stations, endStation);
}

function cutLine(lineData: LineData, startStation: string, endStation: string, lineKey: string) {
  const { stations, isRoundLine } = lineData[lineKey];
  const startIndex = stations.indexOf(startStation);
  const endIndex = stations.indexOf(endStation);
  const indexAbs = Math.abs(endIndex - startIndex);
  const length = stations.length;
  const max = Math.max(startIndex, endIndex);
  const min = Math.min(startIndex, endIndex);

  if (isRoundLine && indexAbs > length - indexAbs) {
    return startIndex > endIndex
      ? stations.slice(max, length).concat(stations.slice(0, min + 1))
      : stations
          .slice(0, min + 1)
          .reverse()
          .concat(stations.slice(max, length).reverse());
  }

  const result = stations.slice(min, max + 1);
  return startIndex > endIndex ? result.reverse() : result;
}
