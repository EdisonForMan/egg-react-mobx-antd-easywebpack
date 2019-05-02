import React, { Component } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import { observer, inject } from 'mobx-react';
import hoc from 'components/HOC/pageHeader';
import StrategyKeyword from './components/StrategyKeyword';
import StrategyDensity from './components/StrategyDensity';
import StrategyRelationIn from './components/StrategyRelationIn';
import StrategyRelationOut from './components/StrategyRelationOut';

@inject(stores => ({
  store: stores.negativeLabelPendingDataStore
}))
@hoc({ name: '待处理数据', className: 'page_negativeLabelPendingData' })
@observer
class NegativeLabelPendingData extends Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="敏感词策略" key="1">
            <StrategyKeyword />
          </TabPane>
          <TabPane tab="密度策略" key="2">
            <StrategyDensity />
          </TabPane>
          <TabPane tab="关系网络策略-注册用户" key="3">
            <StrategyRelationIn />
          </TabPane>
          <TabPane tab="关系网络策略-场外用户" key="4">
            <StrategyRelationOut />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default NegativeLabelPendingData;
