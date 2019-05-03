import * as React from 'react';
import LoadingCircle from '../components/common/loading-circle';

export type DynamicImportCallback<P> = () => Promise<{
  default: React.ComponentType<P>;
}>;

export type DynamicImportState<P> = {
  component: React.ComponentType<P> | null;
};

export default function dynamic<P>(importComponent: DynamicImportCallback<P>) {
  return class DynamicComponent extends React.Component<P, DynamicImportState<P>> {
    constructor(props: P) {
      super(props);
      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component,
      });
    }

    render() {
      return (
        this.state.component
          ? <this.state.component {...this.props} />
          : <div className="loading-page">
            <LoadingCircle type="light" />
          </div>
      );
    }
  }
}