import React, { Component } from 'react';
import { Table } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

/**
 * coomon Components
 * 待处理数据-电商 交易详情
 */
@observer
class TradeDetail extends Component {
  state = {
    loading: false,
    list: []
  };

  async componentDidMount() {
    const { target, fetchTradeList } = this.props;
    const list = await fetchTradeList(target.userId);
    this.setState({ list });
  }

  columns() {
    return [
      {
        title: '序号',
        width: 60,
        dataIndex: '_id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: 'title',
        dataIndex: 'title'
      },
      {
        title: '交易金额',
        width: 90,
        dataIndex: 'amount'
      },
      {
        title: '交易时间',
        width: 120,
        dataIndex: 'tradeTime'
      },
      {
        title: '交易状态',
        width: 60,
        dataIndex: 'tradeStatus'
      },
      {
        title: '交易类型',
        width: 90,
        dataIndex: 'tradeType'
      },
      {
        title: '交易类型分类',
        width: 80,
        dataIndex: 'txType'
      },
      {
        title: '行为标签分类',
        width: 130,
        dataIndex: 'behaviorLable'
      },
      {
        title: '商户名',
        width: 80,
        dataIndex: 'otherSide'
      },
      {
        title: '状态',
        width: 60,
        dataIndex: 'status'
      }
    ];
  }

  render() {
    const { loading, list } = this.state;
    return (
      <div>
        <div className="action-container" />
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
          loading={loading}
        />
      </div>
    );
  }
}

export default TradeDetail;
