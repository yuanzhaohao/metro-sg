import Axios, { AxiosResponse } from 'axios';

const axios = Axios.create({
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'x-csrf-token',
});

export function getJSON<T>(
  url: string,
): Promise<T> {
  return axios
    .get(url)
    .then(function returnJson<T>(response: AxiosResponse<T>) {
      return response.data;
    });
}