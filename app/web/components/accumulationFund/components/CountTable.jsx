import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Table } from 'antd';
import { toJS } from 'mobx';
export const COUNT_TABLE_HASH = Symbol('count');

@observer
class CountTable extends Component {
  state = {
    loading: false,
    list: [],
    draw: 1,
    length: 9999,
    count: 0
  };

  columns() {
    return [
      {
        title: '用户id',
        dataIndex: 'userId'
      },
      {
        title: '账户余额',
        dataIndex: 'balance'
      },
      {
        title: '公积金余额',
        dataIndex: 'fundBalance'
      },
      {
        title: '补贴账户余额',
        dataIndex: 'subsidyBalance'
      },
      {
        title: '补贴月缴存',
        dataIndex: 'subsidyIncome'
      },
      {
        title: '缴存状态',
        dataIndex: 'payStatus'
      },
      {
        title: '缴存企业名称',
        dataIndex: 'corporationName'
      },
      {
        title: '公司月缴额',
        dataIndex: 'corporationIncome'
      },
      {
        title: '个人月缴额',
        dataIndex: 'customerIncome'
      },
      {
        title: '缴存基数',
        dataIndex: 'baseNumber'
      },
      {
        title: '最新缴存日期',
        dataIndex: 'lastPayDate'
      },
      {
        title: '创建时间',
        dataIndex: 'createDate'
      },
      { title: '开户日期', dataIndex: 'beginDate' },
      {
        title: '最后更新时间',
        dataIndex: 'lastUpdateDate'
      }
    ];
  }

  async componentDidMount() {
    await this.fetchCount();
  }

  async fetchCount() {
    const { target, fetchCount, draw, length } = this.props;
    const { list } = await fetchCount(target.corporation_name, {
      draw,
      length
    });
    this.setState({ list });
  }

  render() {
    const { loading, list } = this.state;
    return (
      <div>
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

export default Form.create()(CountTable);
