import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Input, Select, message } from 'antd';
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import BlackForm, {
  BLACK_FORM_MODE_ADD,
  BLACK_FORM_MODE_UPDATE
} from './components/BlackForm';
import hoc from 'components/HOC/pageHeader';
import { desensitization } from 'utils/utils';

@inject(stores => ({
  store: stores.blackListManagementStore
}))
@hoc({ name: '黑名单管理', className: 'page_blackManagement' })
@observer
class BlackListManagement extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formModalVisiable: false,
    formMode: undefined,
    edit: null,
    //  状态
    queryTypeOption: [
      { key: '', title: '全选' },
      { key: 'NAME', title: '姓名' },
      { key: 'IDCARD', title: '身份证' },
      { key: 'MOBILE', title: '手机' },
      { key: 'QQ', title: 'QQ' },
      { key: 'PLATFORM', title: '来源' }
    ],
    batch: []
  };

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
    const { queryTypeOption } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>查询字段:</label>
          <Select
            defaultValue={_query.queryType}
            style={{ width: '100px' }}
            onChange={val => {
              _query.queryType = val;
            }}
          >
            {queryTypeOption.map(item => {
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
            placeholder="输入要查询的数据项"
            style={{ width: '200px' }}
            onChange={e => {
              _query.value = e.target.value;
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
        <Button type="primary" icon="plus" onClick={this.showFormModal}>
          新增
        </Button>
        <Button type="danger" icon="delete" onClick={() => this.batchDelete()}>
          删除
        </Button>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '身份证',
        dataIndex: 'idcard'
      },
      {
        title: '性别',
        dataIndex: 'sex'
      },
      {
        title: 'QQ号码',
        dataIndex: 'qq'
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        render: t => {
          return <span>{desensitization(t)}</span>;
        }
      },
      {
        title: '手机2',
        dataIndex: 'mobile2',
        render: t => {
          return <span>{desensitization(t)}</span>;
        }
      },
      {
        title: '手机3',
        dataIndex: 'mobile3',
        render: t => {
          return <span>{desensitization(t)}</span>;
        }
      },
      {
        title: '来源',
        dataIndex: 'platform'
      },
      {
        title: '网站',
        dataIndex: 'website'
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: '140px',
        render: (t, r) => {
          return (
            <div>
              <Button
                type="primary"
                size="small"
                onClick={() => this.showFormModal(r)}
                style={{ marginRight: '8px' }}
              >
                编辑
              </Button>
              <Button
                type="danger"
                size="small"
                onClick={() => this.batchDelete(r.id)}
              >
                删除
              </Button>
            </div>
          );
        }
      }
    ];
  }

  @autobind
  async onSave() {
    const { formMode } = this.state;
    const { saveBlack } = this.props.store;
    const { form } = this.blackForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      if (
        !values.qq &&
        !values.mobile &&
        !values.mobile2 &&
        !values.mobile3 &&
        !values.idcard
      ) {
        return message.error('身份证、qq、手机至少一项不为空');
      }
      this.setState({ savingLoad: true });
      try {
        await saveBlack(values);
        this.hideFormModal();
        message.success(
          `${formMode == BLACK_FORM_MODE_ADD ? '添加' : '更新'}数据项成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  /**
   *  删除函数 如果有id代入 则为单个删除
   * @param {*} id
   */
  @autobind
  batchDelete(id) {
    const { batch } = this.state;
    const _batch = id ? [id] : batch;
    if (!_batch.length) {
      return message.error('请选择需要处理的数据项');
    }
    const { deleteBlack } = this.props.store;
    Modal.confirm({
      title: '确定删除选中的条目?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await deleteBlack(_batch);
        message.success(`删除成功`);
        this.fetchList();
      }
    });
  }

  @autobind
  showFormModal(black) {
    if (black && black.id) {
      this.setState({
        formModalVisiable: true,
        formMode: BLACK_FORM_MODE_UPDATE,
        edit: black
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      formMode: BLACK_FORM_MODE_ADD,
      edit: null
    });
  }

  tableChangeHandle(a, b, c) {
    console.log(this);
  }

  render() {
    const {
      loading,
      savingLoad,
      edit,
      formMode,
      formModalVisiable,
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
              this.setState({ batch: selectedRowKeys });
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
          className="modal-black"
          title={`${formMode === BLACK_FORM_MODE_ADD ? '新增' : '更新'}数据`}
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
          <BlackForm
            black={edit}
            mode={formMode}
            wrappedComponentRef={instance => {
              this.blackForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default BlackListManagement;
