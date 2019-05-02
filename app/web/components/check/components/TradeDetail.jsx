import React, { Component } from 'react';
import { Table, Modal, Button, message } from 'antd';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import EcommerceForm, {
  ECOMMERCE_FORM_HASH,
  ECOMMERCE_FORM_MODE_ADD,
  ECOMMERCE_FORM_MODE_UPDATE
} from 'components/ecommerce/components/EcommerceForm';

/**
 * coomon Components
 * 入库数据抽查-电商 交易详情
 */
@observer
class TradeDetail extends Component {
  state = {
    loading: false,
    savingLoad: false,
    list: [],
    edit: null,
    pendingFormModalVisiable: false,
    pendingFormMode: ECOMMERCE_FORM_MODE_ADD
  };

  async componentDidMount() {
    const { fetchTradeDetail, data } = this.props;
    const list = await fetchTradeDetail(data.userId);
    this.setState({ list });
  }

  columns() {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        width: 60,
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '交易时间',
        width: 120,
        dataIndex: 'tradeTime'
      },
      {
        title: '商户名',
        width: 80,
        dataIndex: 'otherSide',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(ECOMMERCE_FORM_HASH, r)}
            >
              {t}
            </a>
          );
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
        title: '行为标签类型',
        width: 130,
        dataIndex: 'behaviorLable'
      },
      {
        title: '交易状态',
        width: 60,
        dataIndex: 'tradeStatus'
      },
      {
        title: '状态',
        width: 60,
        dataIndex: 'status'
      }
    ];
  }

  @autobind
  async onSave() {
    const { check, editEcommerceData } = this.props;
    const { pendingFormMode } = this.state;
    const { form } = this.ecommerceForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      if (values.rearExpressionText) {
        const _check = await check(values);
        if (_check == 'ERROR') {
          return message.error('后置表达式有误');
        }
        values.rearExpression = values.rearExpressionText;
      }
      if (pendingFormMode == ECOMMERCE_FORM_MODE_UPDATE) {
        this.setState({ savingLoad: true });
        try {
          const data = await editEcommerceData(values);
          this.hideModal(ECOMMERCE_FORM_HASH);
          message.success(data);
        } finally {
          this.setState({ savingLoad: false });
        }
      } else {
        if (!batchKey.length) {
          return message.error('请选择需要处理的数据项');
        }
        try {
          const data = await doBatch(batchKey, false, values);
          message.success(data);
          this.hideModal(ECOMMERCE_FORM_HASH);
        } finally {
        }
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
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: false,
          pendingFormMode: ECOMMERCE_FORM_MODE_ADD,
          edit: null
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null) {
    console.log('[open]', hash);
    switch (hash) {
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: true,
          pendingFormMode: obj
            ? ECOMMERCE_FORM_MODE_UPDATE
            : ECOMMERCE_FORM_MODE_ADD,
          edit: { ...obj, keyword: obj ? obj.otherSide : undefined }
        });
        break;
      }
    }
  }

  render() {
    const {
      loading,
      list,
      edit,
      savingLoad,
      pendingFormModalVisiable,
      pendingFormMode
    } = this.state;
    const { fetchTagTree } = this.props;
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
          className="modal-ecommerce"
          title={'数据项'}
          width={900}
          destroyOnClose={true}
          visible={pendingFormModalVisiable}
          onCancel={() => this.hideModal(ECOMMERCE_FORM_HASH)}
          footer={[
            <Button
              key="back"
              onClick={() => this.hideModal(ECOMMERCE_FORM_HASH)}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.onSave}
            >
              保存
            </Button>
          ]}
        >
          <EcommerceForm
            data={edit}
            fetchTagTree={fetchTagTree}
            mode={pendingFormMode}
            wrappedComponentRef={instance => {
              this.ecommerceForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default TradeDetail;
