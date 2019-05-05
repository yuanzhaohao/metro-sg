import { Middleware } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => Middleware;
  }
}
