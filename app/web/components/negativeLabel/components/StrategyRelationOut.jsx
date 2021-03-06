import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Input, Select, message } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import RelationNet, { RELATIONNET_TABLE_HASH } from './RelationNet';
import PendingForm, { PENDING_FORM_HASH } from './PendingForm';
import WebDetect, {
  WEBDETECT_HASH,
  WEBDETECT_STATUS_MAP
} from 'components/common/WebDetect';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.strategyRelationOutStore
}))
@hoc({ name: '', className: 'page_strategyRelationOut' })
@observer
class StrategyRelationOut extends Component {
  state = {
    loading: false,
    savingLoad: false,
    pendingFormModalVisiable: false,
    edit: null,
    webFormModalVisiable: false,
    webFormModalTarget: null,
    relationNetModalVisiable: false,
    relationNetModalTarget: null,
    batch: [],
    //  状态
    statusOption: [
      { key: '-1', title: '全选' },
      { key: 'WAIT', title: '待处理' },
      { key: 'PROCESSED', title: '已处理' },
      { key: 'IGNORED', title: '已忽略' }
    ],
    //  网查结果
    resultTypeOption: [
      { key: '-1', title: '全选' },
      { key: '0', title: '正常' },
      { key: '1', title: '可疑' },
      { key: '2', title: '非常可疑' }
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
    const { statusOption, resultTypeOption } = this.state;
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
          <label>网查结果:</label>
          <Select
            defaultValue={_query.resultType}
            style={{ width: '100px' }}
            onChange={val => {
              _query.resultType = val;
            }}
          >
            {resultTypeOption.map(item => {
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
            placeholder="输入手机号"
            style={{ width: '120px' }}
            type="number"
            onChange={e => {
              _query.mobileNum = e.target.value;
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
          批量处理
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
        title: '手机号',
        dataIndex: 'phoneNum',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(PENDING_FORM_HASH, r)}
            >
              {t}
            </a>
          );
        }
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
        const data = await doBatch(batch);
        message.info('操作成功');
        this.fetchList();
      }
    });
  }

  @autobind
  async onSave() {
    const { formMode } = this.state;
    const { saveData } = this.props.store;
    const { form } = this.pendingForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await saveData(values);
        this.hideModal(PENDING_FORM_HASH);
        message.success('更新数据项成功');
      } finally {
        this.setState({ savingLoad: false });
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
      case PENDING_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: false,
          edit: null
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
      case RELATIONNET_TABLE_HASH: {
        this.setState({
          relationNetModalVisiable: false,
          relationNetModalTarget: null
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null) {
    console.log('[open]', hash);
    switch (hash) {
      case PENDING_FORM_HASH: {
        this.setState({
          pendingFormModalVisiable: true,
          edit: { ...obj, data: obj ? obj.phoneNum : undefined }
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
      case RELATIONNET_TABLE_HASH: {
        this.setState({
          relationNetModalVisiable: true,
          relationNetModalTarget: obj
        });
        break;
      }
    }
  }

  render() {
    const {
      loading,
      savingLoad,
      pendingFormModalVisiable,
      edit,
      webFormModalVisiable,
      webFormModalTarget,
      relationNetModalVisiable,
      relationNetModalTarget,
      batch
    } = this.state;
    const { list, _pageQuery } = this.props.store;
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
          className="modal-pending"
          title={'编辑数据项'}
          width={700}
          destroyOnClose={true}
          visible={pendingFormModalVisiable}
          onCancel={() => this.hideModal(PENDING_FORM_HASH)}
          footer={[
            <Button
              key="back"
              onClick={() => this.hideModal(PENDING_FORM_HASH)}
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
          <PendingForm
            data={edit}
            dataType={'PHONE'}
            wrappedComponentRef={instance => {
              this.pendingForm = instance;
            }}
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
            data={webFormModalTarget ? webFormModalTarget.phoneNum : ''}
            dataType="PHONE"
          />
        </Modal>
        <Modal
          className="modal-relationnet"
          title={`手机号：${
            relationNetModalTarget ? relationNetModalTarget.phoneNum : ''
          }`}
          width={700}
          destroyOnClose={true}
          visible={relationNetModalVisiable}
          onCancel={() => this.hideModal(RELATIONNET_TABLE_HASH)}
          footer={null}
        >
          <RelationNet target={relationNetModalTarget} />
        </Modal>
      </div>
    );
  }
}

export default StrategyRelationOut;
