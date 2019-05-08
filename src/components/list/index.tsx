import * as React from 'react';
import { Button, Message, Spin, Icon } from 'dashkit-ui';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import * as indexActions from '../../redux/list/effects';
import { RootState } from '../../redux/reducers';
import { WithRedux } from '../../redux/typings';
import ListSelect from './list-select';
import ListRoute from './list-route';
import './style.scss';

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

class List extends React.Component<Props> {
  public componentDidMount() {
    const { data, isLoading } = this.props.list;
    if (!data && !isLoading) {
      this.props.fetchStationData();
    }
  }

  public render() {
    const { isLoading } = this.props.list;
    return (
      <Spin wrapperClassName="index-container" spinning={isLoading}>
        <div className="search-panel">
          <ListSelect />
          <Button className="search-btn" onClick={this.handleSearch} type="primary" icon="search">
            Search
          </Button>
        </div>

        <ListRoute />
      </Spin>
    );
  }

  public handleSearch = () => {
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List);
