import * as React from 'react';
import { Card } from 'dashkit-ui';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import * as indexActions from '../../redux/list/effects';
import { RootState } from '../../redux/reducers';
import { WithRedux } from '../../redux/typings';
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

class ListRoute extends React.Component<Props> {
  render() {
    const { shortestRoutes } = this.props.list;
    return (
      shortestRoutes && shortestRoutes.length
        ? <Card.Collapse className="route-panel">
          {shortestRoutes.map((route, index) =>
            <Card key={route.join(',')} index={index}>
              <Card.Header>Route {index + 1}</Card.Header>
              <Card.Body>{route.join('->')}</Card.Body>
            </Card>
          )}
        </Card.Collapse>
        : null
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListRoute);
