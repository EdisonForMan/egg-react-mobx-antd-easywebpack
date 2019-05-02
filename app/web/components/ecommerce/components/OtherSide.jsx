import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Table, Modal } from 'antd';
import moment from 'moment';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import TradeDetail from './TradeDetail';
export const OTHERSIDE_FORM_HASH = Symbol('otherside');

/**
 * coomon Components
 */
@observer
class OtherSide extends Component {
  state = {
    loading: false,
    list: [],
    visible: false,
    _target: null
  };

  async componentDidMount() {
    const { target, fetchOtherSideList } = this.props;
    this.setState({ loading: true });
    const list = await fetchOtherSideList(target.otherSide);
    this.setState({ list, loading: false });
  }

  columns() {
    return [
      {
        title: '序号',
        dataIndex: '_id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '用户ID',
        dataIndex: 'userId'
      },
      {
        title: '姓名',
        dataIndex: 'userName'
      },
      {
        title: '导入时间',
        dataIndex: 'createDate',
        render: t => t && moment(t).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '交易详情',
        dataIndex: '_trade',
        render: (t, r) => {
          return (
            <a href="javascript:" onClick={() => this.showFormModal(r)}>
              点击查询
            </a>
          );
        }
      }
    ];
  }

  @autobind
  showFormModal(r) {
    this.setState({
      visible: true,
      _target: r
    });
  }

  @autobind
  hideFormModal() {
    this.setState({
      visible: false,
      _target: null
    });
  }

  render() {
    const { loading, list, visible, _target } = this.state;
    const { fetchTradeList } = this.props;
    return (
      <div>
        <div className="action-container" />
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
          loading={loading}
        />
        <Modal
          className="modal-detail"
          title="交易详情"
          width={1100}
          destroyOnClose={true}
          visible={visible}
          onCancel={this.hideFormModal}
          footer={null}
        >
          <TradeDetail
            target={_target}
            fetchTradeList={fetchTradeList}
            wrappedComponentRef={instance => {
              this.webForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default OtherSide;
