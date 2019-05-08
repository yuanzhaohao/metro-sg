import Axios, { AxiosResponse } from 'axios';
import { AnyFunction } from '../redux/typings';

export function createAction<T extends string, AC extends AnyFunction<{ type: T }>>(
  actionCreator: AC,
): AC {
  return actionCreator;
}

const axios = Axios.create({
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'x-csrf-token',
});

export function getJSON<T>(url: string): Promise<T> {
  return axios.get(url).then(function returnJson<T>(response: AxiosResponse<T>) {
    return response.data;
  });
}
