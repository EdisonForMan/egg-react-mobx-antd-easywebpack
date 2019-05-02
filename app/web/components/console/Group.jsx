import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Tag, message } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

import GroupForm, {
  GROUP_FORM_MODE_ADD,
  GROUP_FORM_MODE_UPDATE
} from './components/GroupForm';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.groupStore
}))
@hoc({ name: '用户组管理', className: 'page_group' })
@observer
class GroupManagement extends Component {
  state = {
    loading: false,
    groupFormModalVisiable: false,
    groupFormMode: GROUP_FORM_MODE_ADD,
    menus: null,
    savingLoad: false,
    editedGroup: null
  };

  componentDidMount() {
    this.fetchList();
  }

  async getBasicOption() {
    //  是否有options数据
    const { menus } = this.state;
    const { fetchBasicOption } = this.props.store;
    if (menus) {
      return;
    } else {
      const data = await fetchBasicOption();
      this.setState({ menus: data });
      return;
    }
  }

  @autobind
  onGroupSave() {
    const { groupFormMode } = this.state;
    const { store } = this.props;
    const { form } = this.groupForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      this.setState({ savingLoad: true });
      try {
        await store.saveGroup(values);
        this.hideGroupFormModal();
        message.success(
          `${groupFormMode === GROUP_FORM_MODE_ADD ? '添加' : '更新'}用户组【${
            values.groupName
          }】成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  @autobind
  async showGroupFormModal(group) {
    await this.getBasicOption();
    if (group && group.groupId) {
      this.setState({
        groupFormModalVisiable: true,
        groupFormMode: GROUP_FORM_MODE_UPDATE,
        editedGroup: group
      });
    } else {
      this.setState({ groupFormModalVisiable: true });
    }
  }

  @autobind
  hideGroupFormModal() {
    this.setState({
      groupFormModalVisiable: false,
      groupFormMode: GROUP_FORM_MODE_ADD,
      editedGroup: null
    });
  }

  getColumnsGroup() {
    const cols = [
      {
        title: '编号',
        width: 60,
        dataIndex: 'groupId'
      },
      {
        title: '用户组',
        width: 120,
        dataIndex: 'groupName'
      },
      {
        title: '菜单权限',
        dataIndex: 'email',
        render: (t, r) => {
          return r.menus
            ? r.menus.map((v, index) => {
                return (
                  <Tag color={v.isAdminOnly == 1 ? 'red' : 'cyan'} key={index}>
                    {v.label}
                  </Tag>
                );
              })
            : undefined;
        }
      },
      {
        title: '操作',
        render: (t, r) => {
          return (
            <div className="operator">
              <Button
                type="primary"
                size="small"
                onClick={() => this.showGroupFormModal(r)}
              >
                编辑
              </Button>
            </div>
          );
        }
      }
    ];
    return cols;
  }

  @autobind
  async fetchList() {
    const { store } = this.props;
    this.setState({ loading: true });
    try {
      const list = await store.fetchGroupList();
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      groupFormMode,
      groupFormModalVisiable,
      editedGroup,
      savingLoad,
      loading,
      menus
    } = this.state;

    const { groupList, _pageQuery } = this.props.store;

    return (
      <div>
        <div className="action-container">
          <span className="action-right-button">
            <Button
              type="primary"
              icon="plus"
              onClick={this.showGroupFormModal}
            >
              新增用户组
            </Button>
          </span>
        </div>
        <Table
          dataSource={toJS(groupList)}
          columns={this.getColumnsGroup()}
          rowKey={r => r.groupId}
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
          className="modal-group"
          title={`${
            groupFormMode === GROUP_FORM_MODE_ADD ? '新增' : '编辑'
          }用户组`}
          width={700}
          destroyOnClose={true}
          visible={groupFormModalVisiable}
          onCancel={this.hideGroupFormModal}
          footer={[
            <Button key="back" onClick={this.hideGroupFormModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.onGroupSave}
            >
              保存
            </Button>
          ]}
        >
          <GroupForm
            group={editedGroup}
            mode={groupFormMode}
            menus={menus}
            wrappedComponentRef={instance => {
              this.groupForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default GroupManagement;
