import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Input, Select, message } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import WebDetect, {
  WEBDETECT_HASH,
  WEBDETECT_STATUS_MAP
} from 'components/common/WebDetect';
import CountTable, { COUNT_TABLE_HASH } from './components/CountTable';
import UnhandledForm, { UNHANDLED_FORM_HASH } from './components/UnhandledForm';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.accumulationFundUnhandledStore
}))
@hoc({ name: '待处理数据-公积金', className: 'page_accumulationFundUnhandled' })
@observer
class AccumulationFundUnhandled extends Component {
  state = {
    loading: false,
    savingLoad: false,
    unhandledFormModalVisiable: false,
    edit: null,
    countTableModalVisiable: false,
    countTableModalTarget: false,
    webFormModalVisiable: false,
    webFormModalTarget: null,
    statusOption: [
      { key: '-1', title: '全选' },
      { key: '0', title: '待处理' },
      { key: '1', title: '已入库' },
      { key: '2', title: '已忽略' }
    ],
    //  默认批量忽略
    status: '2',
    corporationNameList: []
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
    this.setState({ loading: false, corporationNameList: [] });
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const { statusOption } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>公司名:</label>
          <Input
            placeholder="输入公司名"
            style={{ width: '120px' }}
            onChange={e => {
              _query.corporationName = e.target.value;
            }}
          />
        </span>
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
        <Button type="primary" icon="stop" onClick={() => this.batchUpdate()}>
          批量忽略
        </Button>
      </span>
    );
  }

  /**
   * 对应hash关闭&开启modal
   * @param {*} hash
   */
  @autobind
  hideModal(hash) {
    switch (hash) {
      case UNHANDLED_FORM_HASH: {
        this.setState({
          unhandledFormModalVisiable: false,
          edit: null
        });
        break;
      }
      case COUNT_TABLE_HASH: {
        this.setState({
          countTableModalVisiable: false,
          countTableModalTarget: null
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
  openModal(hash, obj = null) {
    console.log('[open]', hash);
    switch (hash) {
      case UNHANDLED_FORM_HASH: {
        this.setState({
          unhandledFormModalVisiable: true,
          edit: obj
        });
        break;
      }
      case COUNT_TABLE_HASH: {
        this.setState({
          countTableModalVisiable: true,
          countTableModalTarget: obj
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

  @autobind
  async onSave() {
    const { form } = this.unhandledForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({
        savingLoad: true
      });
      try {
        await this.batchUpdate({
          corporationNameList: [values.corporationName],
          status: values.status
        });
        this.hideModal(UNHANDLED_FORM_HASH);
      } finally {
        this.setState({
          savingLoad: false
        });
      }
      this.fetchList();
    });
  }

  /**
   * 批量更新操作
   * @param {*} obj
   */
  @autobind
  async batchUpdate(obj) {
    const { corporationNameList, status } = this.state;
    const { batchUpdate } = this.props.store;
    const params =
      obj && Object.keys(obj).length ? obj : { corporationNameList, status };
    if (obj && obj.corporationNameList && obj.corporationNameList.length) {
      await batchUpdate(params);
      message.info('操作成功');
    } else if (!obj && corporationNameList.length) {
      Modal.confirm({
        title: '确定忽略选中的条目?',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          await batchUpdate(params);
          message.info('操作成功');
          await this.fetchList();
        }
      });
    } else {
      return message.error('请选择需要处理的数据项');
    }
    return;
  }

  columns() {
    const { statusOption } = this.state;
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'id'
      },
      {
        title: '公司名',
        dataIndex: 'corporation_name',
        render: (t, r) => {
          return r.status == 1 ? (
            <span>{t}</span>
          ) : (
            <a
              href="javascript:"
              onClick={() => this.openModal(UNHANDLED_FORM_HASH, r)}
            >
              {t}
            </a>
          );
        }
      },
      {
        title: '关联总用户数',
        dataIndex: 'hf_corp_user_cnt',
        render: (t, r) => {
          return (
            <a
              href="javascript:"
              onClick={() => this.openModal(COUNT_TABLE_HASH, r)}
            >
              {t}
            </a>
          );
        }
      },
      {
        title: '账号余额为0用户数占比',
        dataIndex: 'hf_corp_0_balance_user_cnt',
        render: (t, r) => {
          return `${t}/${(r.hf_corp_0_balance_user_per * 100).toFixed(0)}%`;
        }
      },
      {
        title: '账号异常用户数占比',
        dataIndex: 'hf_corp_abnormal_user_cnt',
        render: (t, r) => {
          return `${t}/${(r.hf_corp_abnormal_user_per * 100).toFixed(0)}%`;
        }
      },
      {
        title: '开户时间少于390天用户数占比',
        dataIndex: 'hf_corp_begindays_lt_390_user_cnt',
        render: (t, r) => {
          return `${t}/${(r.hf_corp_begindays_lt_390_user_per * 100).toFixed(
            0
          )}%`;
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
        dataIndex: 'status',
        render: t => {
          let status = '';
          statusOption.map(item => {
            if (item.key == t) {
              status = item.title;
            }
          });
          return status;
        }
      },
      {
        title: '操作者',
        dataIndex: 'operatorName'
      },
      {
        title: '更新时间',
        dataIndex: 'last_update_time'
      }
    ];
  }

  render() {
    const {
      loading,
      savingLoad,
      unhandledFormModalVisiable,
      edit,
      countTableModalVisiable,
      countTableModalTarget,
      webFormModalVisiable,
      webFormModalTarget,
      corporationNameList
    } = this.state;
    const { list, _pageQuery, fetchCount } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.corporation_name}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              const corporationNameList = selectedRows.map(item => {
                return item.corporation_name;
              });
              this.setState({
                corporationNameList
              });
            },
            selectedRowKeys: corporationNameList,
            getCheckboxProps: record => ({
              disabled: record.status == 1
            })
          }}
          onChange={(a, b, c) => {
            console.log(a, b, c);
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
          className="modal-hf"
          title={'更新数据项'}
          width={700}
          destroyOnClose={true}
          visible={unhandledFormModalVisiable}
          onCancel={() => this.hideModal(UNHANDLED_FORM_HASH)}
          footer={[
            <Button
              key="back"
              onClick={() => this.hideModal(UNHANDLED_FORM_HASH)}
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
          <UnhandledForm
            unhandled={edit}
            wrappedComponentRef={instance => {
              this.unhandledForm = instance;
            }}
          />
        </Modal>
        <Modal
          className="modal-count"
          title={'关联用户详情'}
          width={1400}
          destroyOnClose={true}
          visible={countTableModalVisiable}
          onCancel={() => this.hideModal(COUNT_TABLE_HASH)}
          footer={null}
        >
          <CountTable target={countTableModalTarget} fetchCount={fetchCount} />
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
            data={webFormModalTarget ? webFormModalTarget.corporation_name : ''}
            dataType="company"
          />
        </Modal>
      </div>
    );
  }
}

export default AccumulationFundUnhandled;
