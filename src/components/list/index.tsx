import * as React from 'react';
import { connect } from 'react-redux';
import * as indexActions from '../../redux/index/actions';
import { guideMetroRoutes } from '../../lib/metro';

import './style.scss';

class List extends React.Component {
  componentDidMount() {
    // const routes = guideMetroRoutes('Kent Ridge', 'Changi Airport');
    const routes = guideMetroRoutes('Jurong East', 'Kent Ridge');
    console.log(routes);
    this.props.fetchStationDataAction();
  }

  render() {
    return (
      <div className="index-container">
      </div>
    );
  }
};

function mapStateToProps({ index }) {
  return {
    index,
  };
}

export default connect(mapStateToProps, indexActions)(List);