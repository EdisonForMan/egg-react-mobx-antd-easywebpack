import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Select } from 'antd';
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.negativeLabelCheckStore
}))
@hoc({ name: '负面标签抽查', className: 'page_negativeLabelCheck' })
@observer
class NegativeLabelCheck extends Component {
  state = {
    loading: false,
    //  业务类型
    businessTypeOption: [
      { key: 'QQ号', title: 'QQ号' },
      { key: 'QQ群', title: 'QQ群号' },
      { key: '通讯录', title: '通讯录' },
      { key: '通话记录', title: '通话记录' }
    ],
    //  负面标签
    dataTypeOption: [
      { key: 'QZ', title: '欺诈' },
      { key: 'XY', title: '信用' },
      { key: 'SD', title: '涉赌' },
      { key: 'XD', title: '吸毒' },
      { key: 'TX', title: '套现' },
      { key: 'ZJ', title: '中介' },
      { key: 'CP', title: '彩票' },
      { key: 'CS', title: '催收' },
      { key: 'GLD', title: '高利贷' },
      { key: '', title: '无' }
    ]
  };

  async componentDidMount() {
    await this.fetchList();
  }

  @autobind
  async fetchList() {
    const { fetchDataList } = this.props.store;
    this.setState({ loading: true });
    await fetchDataList();
    this.setState({ loading: false });
  }

  searchLeft() {
    const { _query } = this.props.store;
    const { businessTypeOption, dataTypeOption } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>业务类型:</label>
          <Select
            defaultValue={_query.businessType}
            style={{ width: '100px' }}
            onChange={val => {
              _query.businessType = val;
            }}
          >
            {businessTypeOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>负面标签:</label>
          <Select
            defaultValue={_query.dataTag}
            style={{ width: '100px' }}
            onChange={val => {
              _query.dataTag = val;
            }}
          >
            {dataTypeOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <Button type="primary" icon="search" onClick={this.fetchList}>
          查询
        </Button>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '序号',
        dataIndex: 'otherSide',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '数据项',
        dataIndex: 'data'
      },
      {
        title: '业务类型',
        dataIndex: 'businessType'
      },
      {
        title: '负面标签',
        dataIndex: 'dataTag'
      },
      {
        title: '0-24小时命中次数',
        dataIndex: 'count24'
      },
      {
        title: '24-48小时命中次数',
        dataIndex: 'count48'
      },
      {
        title: '48-72小时命中次数',
        dataIndex: 'count72'
      }
    ];
  }

  render() {
    const { loading } = this.state;
    const { list } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
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

export default NegativeLabelCheck;
