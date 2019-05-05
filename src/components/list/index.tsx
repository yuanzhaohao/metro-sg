import * as React from 'react';
import { Select } from 'dashkit-ui';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import * as indexActions from '../../redux/list/index';
import { RootState } from '../../redux/reducers';
import { WithRedux } from '../../redux/typings';
import './style.scss';

const { Option, OptionGroup } = Select;
const mapStateToProps = ({ list }: RootState) => {
  return {
    list,
  };
}
const mapDispatchToProps = {
  ...indexActions,
  ...routerActions,
};
type Props = WithRedux<typeof mapStateToProps, typeof mapDispatchToProps>;

class List extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchStationData();
    console.log(this.props.list);
  }

  render() {
    const { stationData } = this.props.list;
    return (
      <div className="index-container">
        <Select>
          {Object.keys(stationData).map(station =>
            <Option key={station} value={station}>{station}</Option>
          )}
        </Select>
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List);
