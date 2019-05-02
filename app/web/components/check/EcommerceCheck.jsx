import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Input, message, Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import TradeDetail from './components/TradeDetail';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.ecommerceCheckStore,
  ecoStore: stores.ecommercePendingDataStore
}))
@hoc({ name: '电商抽查', className: 'page_ecommerceCheck' })
@observer
class EcommerceCheck extends Component {
  state = {
    loading: false,
    formModalVisiable: false,
    edit: null
  };

  @autobind
  async fetchList() {
    const { fetchDataList, _query } = this.props.store;
    if (!_query.ruleCode) {
      return message.error('请输入规则号');
    }
    this.setState({ loading: true });
    await fetchDataList();
    this.setState({ loading: false });
  }

  searchLeft() {
    const { _query } = this.props.store;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <Input
            placeholder="输入规则号"
            style={{ width: '140px' }}
            onChange={e => {
              _query.ruleCode = e.target.value;
            }}
          />
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
        dataIndex: 'id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '规则命中的UserId',
        dataIndex: 'userId'
      },
      {
        title: '交易明细',
        dataIndex: 'trade',
        render: (t, r) => {
          return (
            <a href="javascript:" onClick={() => this.showFormModal(r)}>
              交易明细
            </a>
          );
        }
      }
    ];
  }

  @autobind
  showFormModal(data) {
    if (data && data.userId) {
      this.setState({
        formModalVisiable: true,
        edit: data
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      edit: null
    });
  }

  render() {
    const { loading, edit, formModalVisiable } = this.state;
    const { list, fetchTradeDetail } = this.props.store;
    const { check, editEcommerceData, fetchTagTree } = this.props.ecoStore;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.userId}
          pagination={false}
          loading={loading}
        />
        <Modal
          className="modal-web"
          title={`${edit ? `[${edit.userId}]` : ''}交易详情`}
          width={1100}
          destroyOnClose={true}
          visible={formModalVisiable}
          onCancel={this.hideFormModal}
          footer={null}
        >
          <TradeDetail
            check={check}
            editEcommerceData={editEcommerceData}
            fetchTagTree={fetchTagTree}
            fetchTradeDetail={fetchTradeDetail}
            data={edit}
          />
        </Modal>
      </div>
    );
  }
}

export default EcommerceCheck;
