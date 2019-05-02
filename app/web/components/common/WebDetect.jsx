import React, { Component } from 'react';
import { Table } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
export const WEBDETECT_HASH = Symbol('webdetect');
export const WEBDETECT_STATUS_MAP = {
  '0': '正常',
  '1': '可疑',
  '2': '非常可疑'
};

/**
 * coomon Components
 * 网查结果modal
 */
@inject(stores => ({
  store: stores.webDetectStore
}))
@observer
class WebDetect extends Component {
  state = {
    loading: false,
    list: [],
    key: ''
  };

  async componentDidMount() {
    const { data, dataType } = this.props;
    const { WebDetect } = this.props.store;
    const { description, mingzhong_words } = await WebDetect(data, dataType);
    let list = [];
    description.split('description:').map(item => {
      if (item) {
        list.push({ text: item });
      }
    });
    this.setState({
      list,
      key: mingzhong_words
    });
  }

  columns() {
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: '_id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '明细',
        dataIndex: 'text'
      }
    ];
  }

  render() {
    const { loading, list, key } = this.state;
    const { data } = this.props;
    return (
      <div>
        <div style={{ lineHeight: '40px' }}>
          <span style={{ marginRight: '20px' }}>数据项：{data}</span>
          <span>命中关键字：{key}</span>
        </div>
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

export default WebDetect;
