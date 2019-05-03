import * as React from 'react';
import LoadingCircle from './loading-circle';

type Props = {
  type?: 'light' | 'dark';
};

class Loading extends React.Component<Props> {
  static defaultProps = {
    type: 'dark',
  }

  render() {
    const { type } = this.props;
    return (
      <div className="loading-container">
        <LoadingCircle type={type} />
        <span className="loading-text">正在加载...</span>
      </div>
    );
  }
};



export default Loading;