import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Table, Modal, Button, message } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import WebDetect, {
  WEBDETECT_HASH,
  WEBDETECT_STATUS_MAP
} from 'components/common/WebDetect';
import EcommerceForm, {
  ECOMMERCE_FORM_HASH
} from 'components/ecommerce/components/EcommerceForm';
import PendingForm, { PENDING_FORM_HASH } from './PendingForm';
import './RelationUser.less';
export const RELATION_USER_HASH = Symbol('relationIn');

@observer
class RelationInUser extends Component {
  state = {
    savingLoad: false,
    loading: false,
    _loading: false,
    list: [],
    _list: [],
    webFormModalVisiable: false,
    webResult: undefined,
    text: undefined,
    _text: undefined,
    __text: undefined,
    data: undefined,
    dataType: undefined,
    typeHash: {
      merchant: '商户',
      qq: 'qq',
      phone: '通讯录'
    },
    columns: {
      merchant: [
        {
          title: '序号',
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
          dataIndex: 'amount'
        },
        {
          title: '交易时间',
          dataIndex: 'tradeTime'
        },
        {
          title: '交易状态',
          dataIndex: 'tradeStatus'
        },
        {
          title: '交易类型',
          dataIndex: 'tradeType'
        },
        {
          title: '交易类型分类',
          dataIndex: 'txType'
        },
        {
          title: '行为标签分类',
          dataIndex: 'behaviorLable'
        },
        {
          title: '商户名',
          dataIndex: 'otherSide'
        },
        {
          title: '状态',
          dataIndex: 'status'
        }
      ],
      phone: [
        {
          title: '序号',
          dataIndex: '_id',
          render: (t, r, index) => {
            return ++index;
          }
        },
        {
          title: '通讯录',
          dataIndex: 'phoneNum'
        },
        {
          title: '通讯录备注',
          dataIndex: 'name'
        }
      ],
      qq: [
        {
          title: '序号',
          dataIndex: '_id',
          render: (t, r, index) => {
            return ++index;
          }
        },
        {
          title: '数据项',
          dataIndex: 'qqNum'
        },
        {
          title: '数据项分类',
          dataIndex: 'name'
        },
        {
          title: '分类',
          dataIndex: 'dataTypeName'
        }
      ]
    },
    focusTarget: null
  };

  async componentDidMount() {
    const { target, type, fetchWebResult } = this.props;
    const text = type == 'phone' ? '通讯录' : type == 'qq' ? 'QQ' : '商户';
    const _text = type == 'phone' ? '通讯录' : type == 'qq' ? 'QQ' : '交易';
    const __text = type == 'phone' ? '手机号' : type == 'qq' ? 'QQ' : '商户名';
    const data =
      type == 'phone'
        ? target.phoneNum
        : type == 'qq'
        ? target.qqNum
        : target.merchantName;
    const dataType =
      type == 'phone' ? 'PHONE' : type == 'qq' ? 'QQ' : 'TaobaoAcc';
    const webResult = await fetchWebResult(data, dataType);
    await this.fetchList();
    await this.fetch_List(target);
    this.setState({
      text,
      _text,
      __text,
      data,
      dataType,
      webResult
    });
  }

  /**
   * 关联用户列表
   */
  async fetchList() {
    const { fetchLinkList, type, target } = this.props;
    const _list = await fetchLinkList(type, target.userid);
    const list = _list.map(item => {
      return { userid: item };
    });
    this.setState({ list });
  }

  /**
   * 交易详情列表
   * @param {*} target
   */
  async fetch_List(target) {
    const { fetchLink_List, type } = this.props;
    const _list = await fetchLink_List(type, target.userid);
    this.setState({ _list, focusTarget: target });
  }

  columns() {
    const { type } = this.props;
    const { typeHash } = this.state;
    return [
      {
        title: '序号',
        dataIndex: '_id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '关联用户ID',
        dataIndex: 'userid'
      },
      {
        title: `关联用户${typeHash[type]}信息`,
        dataIndex: '__hash',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => {
                this.fetch_List(r);
              }}
            >
              {typeHash[type]}详情
            </a>
          );
        }
      }
    ];
  }

  @autobind
  async onSave() {
    const { check, editEcommerceData, editRecord, target } = this.props;
    const { dataType } = this.state;
    const { form } = this._form.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      if (values.rearExpressionText) {
        const _check = await check(values);
        if (_check == 'ERROR') {
          return message.error('后置表达式有误');
        }
      }
      this.setState({ savingLoad: true });
      try {
        if (dataType == 'TaobaoAcc') {
          await editEcommerceData({
            ...values,
            dataType,
            id: target.id
          });
        } else {
          await editRecord({ ...values, dataType, id: target.id });
        }
        this.hideModal(ECOMMERCE_FORM_HASH);
        message.success('更新数据项成功');
      } finally {
        this.setState({ savingLoad: false });
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
      case WEBDETECT_HASH: {
        this.setState({
          webFormModalVisiable: false,
          webFormModalTarget: null
        });
        break;
      }
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: false,
          edit: null
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null) {
    console.log('[open]', hash);
    const { data } = this.state;
    switch (hash) {
      case WEBDETECT_HASH: {
        this.setState({
          webFormModalVisiable: true,
          webFormModalTarget: obj
        });
        break;
      }
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: true,
          edit: { data: data, keyword: data }
        });
        break;
      }
    }
  }

  /**
   * 返回对应的表格字段
   * @param {*} type 类型
   */
  _columns(type) {
    const { columns } = this.state;
    return columns[type] || [];
  }

  render() {
    const {
      savingLoad,
      list,
      _list,
      loading,
      _loading,
      webFormModalVisiable,
      text,
      _text,
      __text,
      data,
      dataType,
      pendingFormModalVisiable,
      edit,
      webResult,
      focusTarget
    } = this.state;
    const { target, type, fetchTagTree } = this.props;

    return (
      <div>
        <div className="relationTitle">
          <span>UserId : {target.userid}</span>
          <span>
            {__text} :{' '}
            <a
              href="javascript:"
              onClick={() => this.openModal(ECOMMERCE_FORM_HASH, target)}
            >
              {data}
            </a>
          </span>
          <span>
            本人{text}信息 :{' '}
            {
              <a href="javascript:" onClick={() => this.fetch_List(target)}>
                {_text}详情
              </a>
            }
          </span>
          <span>
            本人{__text}网查结果 :{' '}
            <a
              href="javascript:"
              onClick={() => this.openModal(WEBDETECT_HASH, target)}
            >
              {webResult
                ? webResult.resultType == 0
                  ? '正常'
                  : webResult.resultType == 1
                  ? '可疑'
                  : webResult.resultType == 2
                  ? '非常可疑'
                  : ''
                : ''}
            </a>
          </span>
        </div>
        <h3>{text}关联的有效用户</h3>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
          loading={loading}
        />
        <div className="relation_table">
          <span>UserId : {focusTarget ? focusTarget.userid : undefined}</span>
        </div>
        <Table
          dataSource={toJS(_list)}
          columns={this._columns(type)}
          rowKey={r => r.id}
          loading={_loading}
        />
        <Modal
          className="modal-ecommerce"
          title={'数据项'}
          width={800}
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
          {dataType == 'TaobaoAcc' ? (
            <EcommerceForm
              data={edit}
              fetchTagTree={fetchTagTree}
              wrappedComponentRef={instance => {
                this._form = instance;
              }}
            />
          ) : (
            <PendingForm
              data={edit}
              dataType={dataType}
              nostatus={true}
              wrappedComponentRef={instance => {
                this._form = instance;
              }}
            />
          )}
        </Modal>
        <Modal
          className="modal-web"
          title={'网查结果'}
          width={700}
          destroyOnClose={true}
          visible={webFormModalVisiable}
          onCancel={() => this.hideModal(WEBDETECT_HASH)}
          footer={null}
        >
          <WebDetect data={data} dataType={dataType} />
        </Modal>
      </div>
    );
  }
}

export default RelationInUser;
