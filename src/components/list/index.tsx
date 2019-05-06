import * as React from 'react';
import { Select, Button, Message, Spin } from 'dashkit-ui';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import * as indexActions from '../../redux/list/effects';
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
  }

  render() {
    const { lineData, shortestRoutes, isLoading, fromStation, toStation } = this.props.list;
    console.log(shortestRoutes);
    return (
      <Spin wrapperClassName="top-panel" spinning={isLoading}>
        <Select
          placeholder="Starting Point"
          value={fromStation}
          onChange={this.handleStationChange.bind(this, 'fromStation')}
          className="from-station"
        >
          {Object.keys(lineData).map(lineKey =>
            <OptionGroup label={lineKey} key={lineKey}>
              {lineData[lineKey].stations.map(station =>
                <Option key={station} value={station} filterOption={this.filterOption}>{station}</Option>
              )}
            </OptionGroup>
          )}
        </Select>
        <Select
          placeholder="Destination"
          value={toStation}
          onChange={this.handleStationChange.bind(this, 'toStation')}
          className="to-station"
        >
          {Object.keys(lineData).map(lineKey =>
            <OptionGroup label={lineKey} key={lineKey}>
              {lineData[lineKey].stations.map(station =>
                <Option key={station} value={station} filterOption={this.filterOption}>{station}</Option>
              )}
            </OptionGroup>
          )}
        </Select>

        <Button className="search-btn" onClick={this.handleSearch} type="primary">Search</Button>
      </Spin>
    );
  }

  filterOption(inputValue: string, value: string) {
    return value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
  }

  handleStationChange(key: string, value: any) {
    this.props.updateStation(value, key);
  }

  handleSearch = () => {
    const { fromStation, toStation } = this.props.list;
    if (!fromStation) {
      Message.info('Please choose starting point');
      return;
    }

    if (!toStation) {
      Message.info('Please choose destination');
      return;
    }

    if (fromStation === toStation) {
      Message.info('Please choose different stations');
      return;
    }

    this.props.getMetroRoutes(fromStation, toStation);
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List);
