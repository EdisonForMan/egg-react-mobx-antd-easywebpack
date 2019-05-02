import React, { Component, PureComponent } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default obj => WrappedComponent =>
  class HOC extends PureComponent {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;

    componentWillMount() {
      console.log(`[OPEN]: ${getDisplayName(WrappedComponent)}`);
    }

    componentWillUnmount() {
      const { store } = this.props;
      store && store.reset && store.reset();
      // console.log(`[CLOSE]: ${getDisplayName(WrappedComponent)}`);
    }

    render() {
      const { history, name } = this.props;
      return (
        <div className={obj.className}>
          {obj.name && <div className="title">{obj.name}</div>}
          <div className="main-content">
            <WrappedComponent {...this.props} />
          </div>
        </div>
      );
    }
  };
