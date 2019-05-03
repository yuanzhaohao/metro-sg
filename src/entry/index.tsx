import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/index';
import dynamic from '../lib/dynamic';

const List = dynamic(() => import('../components/list'));

import './index.scss';

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="app-content">
        <Switch>
          <Route exact path="/" component={List} />
          <Route exact path="/:startStation/:endStation" component={List} />
          <Route exact path="*" component={List} />
        </Switch>
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);