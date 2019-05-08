import * as React from 'react';
import { Select } from 'dashkit-ui';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import * as indexActions from '../../redux/list/effects';
import { RootState } from '../../redux/reducers';
import { WithRedux } from '../../redux/typings';

const { Option, OptionGroup } = Select;
const mapStateToProps = ({ list }: RootState) => {
  return {
    list,
  };
};
const mapDispatchToProps = {
  ...indexActions,
  ...routerActions,
};
type Props = WithRedux<typeof mapStateToProps, typeof mapDispatchToProps>;

class ListSelect extends React.Component<Props> {
  public render() {
    const { lineData, fromStation, toStation } = this.props.list;
    return (
      <div className="search-station-select">
        <Select
          placeholder="Starting Point"
          value={fromStation}
          onChange={this.handleStationChange.bind(this, 'fromStation')}
          className="from-station"
          prefix="circle"
          prefixClassName="prefix-from"
        >
          {Object.keys(lineData).map((lineKey) => (
            <OptionGroup label={lineKey} key={lineKey}>
              {lineData[lineKey].stations.map((station) => (
                <Option key={station} value={station} filterOption={this.filterOption}>
                  {station}
                </Option>
              ))}
            </OptionGroup>
          ))}
        </Select>
        <Select
          placeholder="Destination"
          value={toStation}
          onChange={this.handleStationChange.bind(this, 'toStation')}
          className="to-station"
          prefix="map-pin"
          prefixClassName="prefix-to"
        >
          {Object.keys(lineData).map((lineKey) => (
            <OptionGroup label={lineKey} key={lineKey}>
              {lineData[lineKey].stations.map((station) => (
                <Option key={station} value={station} filterOption={this.filterOption}>
                  {station}
                </Option>
              ))}
            </OptionGroup>
          ))}
        </Select>
      </div>
    );
  }

  private filterOption(inputValue: string, value: string) {
    return value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
  }

  private handleStationChange(key: string, value: any) {
    this.props.updateStation(value, key);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListSelect);
