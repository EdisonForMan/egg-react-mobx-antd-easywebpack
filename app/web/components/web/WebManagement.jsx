import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Input, Select, message } from 'antd';
const { Option } = Select;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import WebForm, {
  WEB_FORM_MODE_ADD,
  WEB_FORM_MODE_UPDATE
} from './components/WebForm';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.webManagementStore
}))
@hoc({ name: '网站管理', className: 'page_webManagement' })
@observer
class WebManagement extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formModalVisiable: false,
    formMode: WEB_FORM_MODE_ADD,
    edit: null,
    statusOption: [
      { key: '-1', title: '全选' },
      { key: '1', title: '正常' },
      { key: '0', title: '异常' }
    ]
  };

  async componentDidMount() {
    await this.fetchList();
  }

  @autobind
  async fetchList() {
    const { fetchWebList } = this.props.store;
    this.setState({ loading: true });
    await fetchWebList();
    this.setState({ loading: false });
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const { statusOption } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>网站名称:</label>
          <Input
            placeholder="输入网站名"
            style={{ width: '120px' }}
            onChange={e => {
              _query.platform = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>网址:</label>
          <Input
            placeholder="输入网址"
            style={{ width: '200px' }}
            onChange={e => {
              _query.web = e.target.value;
            }}
          />
        </span>
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
          新增网站
        </Button>
      </span>
    );
  }

  columns() {
    return [
      {
        title: '序号',
        width: 80,
        dataIndex: 'id'
      },
      {
        title: '类型',
        width: 80,
        dataIndex: 'type'
      },
      {
        title: '网站名称',
        dataIndex: 'platform'
      },
      {
        title: '网址',
        dataIndex: 'web',
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
        width: 100,
        dataIndex: 'status',
        render: data => {
          return data == 1 ? '正常' : '异常';
        }
      }
    ];
  }

  @autobind
  async onSave() {
    const { formMode } = this.state;
    const { saveWeb } = this.props.store;
    const { form } = this.webForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await saveWeb(values);
        this.hideFormModal();
        message.success(
          `${formMode == WEB_FORM_MODE_ADD ? '添加' : '更新'}网站【${
            values.platform
          }】成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  @autobind
  showFormModal(web) {
    if (web && web.id) {
      this.setState({
        formModalVisiable: true,
        formMode: WEB_FORM_MODE_UPDATE,
        edit: web
      });
    } else {
      this.setState({ formModalVisiable: true });
    }
  }

  @autobind
  hideFormModal() {
    this.setState({
      formModalVisiable: false,
      formMode: WEB_FORM_MODE_ADD,
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
          className="modal-web"
          title={`${formMode === WEB_FORM_MODE_ADD ? '新增' : '更新'}网站`}
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
          <WebForm
            web={edit}
            mode={formMode}
            wrappedComponentRef={instance => {
              this.webForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default WebManagement;
