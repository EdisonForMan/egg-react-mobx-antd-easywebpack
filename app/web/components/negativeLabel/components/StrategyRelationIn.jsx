import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Input, Select, message } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import RelationInUser, { RELATION_USER_HASH } from './RelationInUser';
import RelationNet, { RELATIONNET_TABLE_HASH } from './RelationNet';

import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.strategyRelationInStore
}))
@hoc({ name: '', className: 'page_strategyRelationIn' })
@observer
class StrategyRelationIn extends Component {
  state = {
    loading: false,
    relationUserModalVisiable: false,
    target: null,
    type: 'merchant',
    relationNetModalVisiable: false,
    relationNetModalTarget: null,
    batch: [],
    //  状态
    statusOption: [
      { key: '-1', title: '全选' },
      { key: 'WAIT', title: '待处理' },
      { key: 'DONE', title: '已处理' }
    ]
  };

  componentWillMount() {
    //  默认状态
    this.props.store._query.updateEnd = `${moment()
      .subtract(0, 'days')
      .format(dateFormat)}`;
    this.props.store._query.updateStart = `${moment()
      .subtract(7, 'days')
      .format(dateFormat)}`;
  }

  async componentDidMount() {
    await this.fetchList();
  }

  @autobind
  async fetchList() {
    const { fetchDataList } = this.props.store;
    this.setState({ loading: true });
    await fetchDataList();
    this.setState({ loading: false, batch: [] });
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const { statusOption } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>状态:</label>
          <Select
            defaultValue={_query.status}
            style={{ width: '100px' }}
            onChange={val => {
              _query.status = val;
            }}
          >
            {statusOption.map(item => {
              return (
                <Option value={item.key} key={item.key}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>数据项:</label>
          <Input
            placeholder="输入数据项"
            style={{ width: '120px' }}
            onChange={e => {
              _query.userId = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>日期:</label>
          <RangePicker
            style={{ width: '240px' }}
            defaultValue={[
              moment(moment().subtract(7, 'days'), dateFormat),
              moment(moment().subtract(0, 'days'), dateFormat)
            ]}
            onChange={(value, dateString) => {
              console.log('Formatted Selected Time: ', dateString);
              _query.updateStart = dateString[0];
              _query.updateEnd = dateString[1];
            }}
          />
        </span>
        <Button
          type="primary"
          icon="search"
          onClick={() => {
            _pageQuery.draw = 1;
            this.fetchList();
          }}
        >
          搜索
        </Button>
        <Button type="primary" icon="form" onClick={this.doBatch}>
          批量入库
        </Button>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: 'UserId',
        dataIndex: 'userid'
      },
      {
        title: '关系网络信息统计',
        dataIndex: '_id',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(RELATIONNET_TABLE_HASH, r)}
            >
              统计详情
            </a>
          );
        }
      },
      {
        title: '商户名',
        dataIndex: 'merchantName',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(RELATION_USER_HASH, r, 'merchant')}
            >
              {t}
            </a>
          );
        }
      },
      {
        title: 'QQ号',
        dataIndex: 'qqNum',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(RELATION_USER_HASH, r, 'qq')}
            >
              {t}
            </a>
          );
        }
      },
      {
        title: '手机号',
        dataIndex: 'phoneNum',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(RELATION_USER_HASH, r, 'phone')}
            >
              {t}
            </a>
          );
        }
      },
      {
        title: '处理状态',
        dataIndex: 'statusName'
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        render: t => t && moment(t).format('YYYY-MM-DD HH:mm:ss')
      }
    ];
  }

  /**
   * 批量操作
   */
  @autobind
  doBatch() {
    const { batch } = this.state;
    const { doBatch } = this.props.store;
    if (!batch.length) {
      return message.error('请选择需要处理的数据项');
    }
    Modal.confirm({
      title: `确定要批量处理选中的数据吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await doBatch(batch);
        message.info('操作成功');
        this.fetchList();
      }
    });
  }

  /**
   * 对应hash关闭&开启modal
   * @param {*} hash
   */
  @autobind
  hideModal(hash) {
    switch (hash) {
      case RELATIONNET_TABLE_HASH: {
        this.setState({
          relationNetModalVisiable: false,
          relationNetModalTarget: null
        });
        break;
      }
      case RELATION_USER_HASH: {
        this.setState({
          relationUserModalVisiable: false,
          target: null,
          type: 'merchant'
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null, type) {
    console.log('[open]', hash);
    switch (hash) {
      case RELATIONNET_TABLE_HASH: {
        this.setState({
          relationNetModalVisiable: true,
          relationNetModalTarget: obj
        });
        break;
      }
      case RELATION_USER_HASH: {
        this.setState({
          relationUserModalVisiable: true,
          target: obj,
          type
        });
        break;
      }
    }
  }

  render() {
    const {
      loading,
      relationNetModalVisiable,
      relationNetModalTarget,
      relationUserModalVisiable,
      target,
      type,
      batch
    } = this.state;
    const text = type == 'phone' ? '手机号' : type == 'qq' ? 'QQ号' : '商户名';
    const {
      list,
      _pageQuery,
      fetchLinkList,
      fetchLink_List,
      fetchWebResult,
      fetchTagTree,
      check,
      editEcommerceData,
      editRecord
    } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              const batch = selectedRows.map(item => item.id);
              this.setState({ batch });
            },
            selectedRowKeys: batch
          }}
          pagination={{
            current: _pageQuery.draw,
            total: _pageQuery.count,
            pageSize: _pageQuery.length,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
              _pageQuery.length = pageSize;
              _pageQuery.draw = 1;
              this.fetchList();
            },
            onChange: current => {
              _pageQuery.draw = current;
              this.fetchList();
            },
            showTotal: () => {
              return '共 ' + _pageQuery.count + ' 条数据';
            }
          }}
          loading={loading}
        />
        <Modal
          className="modal-relationnet"
          title={`userId：${
            relationNetModalTarget ? relationNetModalTarget.userid : ''
          }`}
          width={700}
          destroyOnClose={true}
          visible={relationNetModalVisiable}
          onCancel={() => this.hideModal(RELATIONNET_TABLE_HASH)}
          footer={null}
        >
          <RelationNet target={relationNetModalTarget} />
        </Modal>
        <Modal
          className="modal-relationin"
          title={`${text}详情`}
          width={900}
          destroyOnClose={true}
          visible={relationUserModalVisiable}
          onCancel={() => this.hideModal(RELATION_USER_HASH)}
          footer={null}
        >
          <RelationInUser
            fetchLinkList={fetchLinkList}
            fetchLink_List={fetchLink_List}
            fetchWebResult={fetchWebResult}
            fetchTagTree={fetchTagTree}
            check={check}
            editEcommerceData={editEcommerceData}
            editRecord={editRecord}
            type={type}
            target={target}
          />
        </Modal>
      </div>
    );
  }
}

export default StrategyRelationIn;
