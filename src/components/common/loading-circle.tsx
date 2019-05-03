import * as React from 'react';
import * as classNames from 'classnames';
import './loading.scss';

type Props = {
  type?: 'light' | 'dark';
};

class LoadingCircle extends React.Component<Props> {
  static defaultProps = {
    type: 'dark',
  }

  render() {
    const { type } = this.props;
    return (
      <div className="loading-circle">
        {Array.from(new Array(12), (val, index) => index + 1).map((val) =>
          <div key={val} className={classNames('circle', {
            'light': type === 'light',
          })}></div>
        )}
      </div>
    );
  }
};



export default LoadingCircle;