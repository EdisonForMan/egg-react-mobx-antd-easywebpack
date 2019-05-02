import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import {
  Button,
  Table,
  Modal,
  DatePicker,
  Input,
  Select,
  Radio,
  message
} from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import EcommerceForm, {
  ECOMMERCE_FORM_HASH,
  ECOMMERCE_FORM_MODE_ADD,
  ECOMMERCE_FORM_MODE_UPDATE,
  ECOMMERCE_FORM_MODE_BATCH
} from './components/EcommerceForm';
import OtherSide, { OTHERSIDE_FORM_HASH } from './components/OtherSide';
import WebDetect, {
  WEBDETECT_HASH,
  WEBDETECT_STATUS_MAP
} from 'components/common/WebDetect';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.ecommercePendingDataStore
}))
@hoc({ name: '待处理数据-电商', className: 'page_ecommercePendingData' })
@observer
class EcommercePendingData extends Component {
  state = {
    pendingFormModalVisiable: false,
    pendingFormMode: ECOMMERCE_FORM_MODE_ADD,
    webFormModalVisiable: false,
    webFormModalTarget: null,
    otherSideModalVisiable: false,
    otherSideModalTarget: null,
    batch: [],
    batchKey: [],
    edit: null,
    statusOption: [
      { key: '-1', title: '全选' },
      { key: '1', title: '已处理' },
      { key: '0', title: '未处理' }
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
          <label>处理状态:</label>
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
          <label>商户:</label>
          <Input
            placeholder="输入要查询的商户"
            style={{ width: '140px' }}
            onChange={e => {
              _query.otherSide = e.target.value;
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
        <Button type="primary" icon="form" onClick={() => this.doBatch(false)}>
          批量入库
        </Button>
        <Button type="primary" icon="delete" onClick={() => this.doBatch(true)}>
          批量忽略
        </Button>
      </span>
    );
  }

  /**
   * 批量操作
   * @param {*} Ignore 是否忽略
   */
  @autobind
  doBatch(Ignore) {
    const { batch } = this.state;
    const { doBatch } = this.props.store;
    if (!batch.length) {
      return message.error('请选择需要处理的数据项');
    }
    if (Ignore) {
      Modal.confirm({
        title: `确定要批量忽略选中的数据吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await doBatch(batch, Ignore);
            message.info('操作成功');
          } finally {
          }
          this.fetchList();
        }
      });
    } else {
      this.openModal(ECOMMERCE_FORM_HASH, null, ECOMMERCE_FORM_MODE_BATCH);
    }
  }

  @autobind
  async onSave() {
    const { check, editEcommerceData, doBatch } = this.props.store;
    const { pendingFormMode, batchKey } = this.state;
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
      this.fetchList();
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
      case OTHERSIDE_FORM_HASH: {
        this.setState({
          otherSideModalVisiable: false,
          otherSideModalTarget: null
        });
        break;
      }
      case WEBDETECT_HASH: {
        this.setState({
          webFormModalVisiable: false,
          webFormModalTarget: null
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null, mode) {
    console.log('[open]', hash);
    switch (hash) {
      case ECOMMERCE_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: true,
          pendingFormMode: mode
            ? mode
            : obj
            ? ECOMMERCE_FORM_MODE_UPDATE
            : ECOMMERCE_FORM_MODE_ADD,
          edit: { ...obj, keyword: obj ? obj.otherSide : undefined }
        });
        break;
      }
      case OTHERSIDE_FORM_HASH: {
        this.setState({
          otherSideModalVisiable: true,
          otherSideModalTarget: obj
        });
        break;
      }
      case WEBDETECT_HASH: {
        this.setState({
          webFormModalVisiable: true,
          webFormModalTarget: obj
        });
        break;
      }
    }
  }

  columns() {
    return [
      {
        title: '商户',
        dataIndex: 'otherSide',
        render: (t, r) => {
          return r.status == '已处理' ? (
            t
          ) : (
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
        title: '网查结果',
        dataIndex: 'resultType',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(WEBDETECT_HASH, r)}
            >
              {WEBDETECT_STATUS_MAP[t] || ''}
            </a>
          );
        }
      },
      {
        title: '关联用户详情',
        dataIndex: 'id',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(OTHERSIDE_FORM_HASH, r)}
            >
              关联用户详情
            </a>
          );
        }
      },
      {
        title: '最后操作人员',
        dataIndex: 'operatorName'
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate'
      },
      {
        title: '处理状态',
        dataIndex: 'status'
      }
    ];
  }

  render() {
    const {
      loading,
      savingLoad,
      edit,
      pendingFormModalVisiable,
      pendingFormMode,
      otherSideModalVisiable,
      otherSideModalTarget,
      webFormModalTarget,
      webFormModalVisiable,
      batch
    } = this.state;
    const {
      list,
      _pageQuery,
      _query,
      fetchOtherSideList,
      fetchTradeList,
      fetchTagTree
    } = this.props.store;
    return (
      <div>
        <div className="action-container">
          <Radio.Group
            defaultValue="1"
            buttonStyle="solid"
            style={{ marginBottom: '6px', display: 'block' }}
            onChange={e => {
              _query.strategy = e.target.value;
              this.fetchList();
            }}
          >
            <Radio.Button value="1">密度策略</Radio.Button>
            <Radio.Button value="2">UserId策略</Radio.Button>
            <Radio.Button value="3">Title策略</Radio.Button>
          </Radio.Group>
          {this.searchLeft()}
        </div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              const batch = selectedRows.map(item => item.id);
              const batchKey = selectedRows.map(item => item.otherSide);
              this.setState({ batch, batchKey });
            },
            selectedRowKeys: batch,
            getCheckboxProps: record => ({
              disabled: record.status === '已处理'
            })
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
        <Modal
          className="modal-otherside"
          title="商户详情"
          width={700}
          destroyOnClose={true}
          visible={otherSideModalVisiable}
          onCancel={() => this.hideModal(OTHERSIDE_FORM_HASH)}
          footer={null}
        >
          <OtherSide
            fetchOtherSideList={fetchOtherSideList}
            fetchTradeList={fetchTradeList}
            target={otherSideModalTarget}
          />
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
          <WebDetect
            data={webFormModalTarget ? webFormModalTarget.otherSide : ''}
            dataType="OTHERSIDE"
          />
        </Modal>
      </div>
    );
  }
}

export default EcommercePendingData;
