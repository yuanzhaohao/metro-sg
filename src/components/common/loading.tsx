import * as React from 'react';
import { Spin } from 'dashkit-ui';
import './loading.scss';

const Loading = () => (
  <div className="loading-container">
    <Spin text="Loading..." />
  </div>
);

export default Loading;
