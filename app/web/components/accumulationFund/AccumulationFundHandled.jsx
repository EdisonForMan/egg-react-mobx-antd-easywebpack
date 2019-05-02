import React, { Component } from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, DatePicker, Input, Select, message } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import HandledForm, {
  HANDLED_FORM_MODE_ADD,
  HANDLED_FORM_MODE_UPDATE
} from './components/HandledForm';
import hoc from 'components/HOC/pageHeader';
const dateFormat = 'YYYY-MM-DD';

@inject(stores => ({
  store: stores.accumulationFundHandledStore
}))
@hoc({ name: '已入库数据-公积金', className: 'page_accumulationFundHandled' })
@observer
class AccumulationFundHandled extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formModalVisiable: false,
    formMode: HANDLED_FORM_MODE_ADD,
    edit: null,
    refresh: false,
    statusOption: [
      { key: '-1', title: '全选' },
      { key: '0', title: '失效' },
      { key: '1', title: '生效' }
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
    this.setState({ loading: false });
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const { statusOption, refresh } = this.state;
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
        <Button
          type="primary"
          icon="sync"
          disabled={refresh}
          onClick={this.redo}
        >
          {refresh ? '重跑中..' : '一键重跑'}
        </Button>
        <Button type="primary" icon="plus" onClick={this.showFormModal}>
          创建
        </Button>
      </span>
    );
  }

  columns() {
    const { statusOption } = this.state;
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'id',
        render: (t, r, index) => {
          return ++index;
        }
      },
      {
        title: '公司名',
        dataIndex: 'corporation_name',
        render: (t, r) => {
          return (
            <a href="javascript:" onClick={() => this.showFormModal(r)}>
              {t}
            </a>
          );
        }
      },
      {
        title: '状态',
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
        title: '更新时间',
        dataIndex: 'last_update_time'
      }
    ];
  }

  @autobind
  async redo() {
    const { redo } = this.props.store;
    Modal.confirm({
      title: '确定要一键重跑吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        this.setState({
          refresh: true
        });
        try {
          await redo();
          message.info('重跑操作成功');
        } finally {
          this.setState({
            refresh: false
          });
        }
        this.fetchList();
      }
    });
  }

  @autobind
  async onSave() {
    const { formMode } = this.state;
    const { saveHandled } = this.props.store;
    const { form } = this.handledForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await saveHandled(values);
        this.hideFormModal();
        message.success(
          `${formMode == HANDLED_FORM_MODE_ADD ? '添加' : '更新'}公司成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  @autobind
  showFormModal(handled) {
    if (handled && handled.id) {
      this.setState({
        formModalVisiable: true,
        formMode: HANDLED_FORM_MODE_UPDATE,
        edit: handled
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      formMode: HANDLED_FORM_MODE_ADD,
      edit: null
    });
  }

  render() {
    const {
      loading,
      savingLoad,
      edit,
      formMode,
      formModalVisiable
    } = this.state;
    const { list, _pageQuery } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.id}
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
          className="modal-handled"
          title={'更新数据项'}
          width={700}
          destroyOnClose={true}
          visible={formModalVisiable}
          onCancel={this.hideFormModal}
          footer={[
            <Button key="back" onClick={this.hideFormModal}>
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
          <HandledForm
            handled={edit}
            mode={formMode}
            wrappedComponentRef={instance => {
              this.handledForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default AccumulationFundHandled;
