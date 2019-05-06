import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Tag, message, Input } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

import UserForm, {
  USER_FORM_MODE_ADD,
  USER_FORM_MODE_UPDATE
} from './components/UserForm';
import PasswordForm from './components/PasswordForm';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.userStore
}))
@hoc({ name: 'User Management', className: 'page_user' })
@observer
class UserManagement extends Component {
  state = {
    loading: false,
    userFormModalVisiable: false,
    passwordFormModalVisiable: false,
    userFormMode: USER_FORM_MODE_ADD,
    groups: null,
    savingLoad: false,
    editedUser: null
  };

  async componentDidMount() {
    // await this.fetchList();
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    return (
      <span className="action-left-search">
        {/* <span className="action-left-search-single">
          <label>用户名:</label>
          <Input
            placeholder="输入用户名"
            style={{ width: '200px' }}
            onChange={e => {
              _query.search_username = e.target.value;
            }}
            onPressEnter={this.fetchList}
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
        </Button> */}
        <Button type="primary" icon="plus" onClick={this.showUserFormModal}>
          add
        </Button>
      </span>
    );
  }

  async getBasicOption() {
    //  是否有options数据
    const { groups } = this.state;
    const { fetchBasicOption } = this.props.store;
    if (groups) {
      return;
    } else {
      const rgroup = await fetchBasicOption();
      this.setState({
        groups: rgroup
      });
      return;
    }
  }

  @autobind
  onUserSave() {
    const { userFormMode } = this.state;
    const { store } = this.props;
    const { form } = this.userForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await store.saveUser(values);
        this.hideUserFormModal();
        message.success(
          `${userFormMode === USER_FORM_MODE_ADD ? '添加' : '更新'}用户【${
            values.username
          }】成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
    });
  }

  @autobind
  async showUserFormModal(user) {
    await this.getBasicOption();
    if (user && user.id) {
      this.setState({
        userFormModalVisiable: true,
        userFormMode: USER_FORM_MODE_UPDATE,
        editedUser: user
      });
    } else {
      this.setState({ userFormModalVisiable: true });
    }
  }

  @autobind
  hideUserFormModal() {
    this.setState({
      userFormModalVisiable: false,
      userFormMode: USER_FORM_MODE_ADD,
      editedUser: null
    });
  }

  @autobind
  onPasswordSave() {
    const { editedUser } = this.state;
    const { store } = this.props;
    const { form } = this.passwordForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await store.adminUpdatePassword({
          password: values.password,
          userId: editedUser.id
        });
        this.hidePasswordFormModal();
        message.success(`用户【${editedUser.username}】密码修改成功`);
      } finally {
        this.setState({ savingLoad: false });
      }
    });
  }

  @autobind
  showPasswordFormModal(user) {
    this.setState({ passwordFormModalVisiable: true, editedUser: user });
  }

  @autobind
  hidePasswordFormModal() {
    this.setState({ passwordFormModalVisiable: false, editedUser: null });
  }

  getColumnsUser() {
    const cols = [
      {
        title: '编号',
        width: 60,
        dataIndex: 'id'
      },
      {
        title: '激活',
        dataIndex: 'active',
        width: 60,
        render: t => <i>{t == 1 ? '是' : '否'}</i>
      },
      {
        title: '用户名',
        width: 100,
        dataIndex: 'username'
      },
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '座机号',
        dataIndex: 'tel'
      },
      {
        title: '复审员ID',
        dataIndex: 'reviewId'
      },
      {
        title: '所在用户组',
        dataIndex: 'groups',
        render: t => {
          return t
            ? t.map((v, index) => {
                return (
                  <Tag
                    color={v.name == '超级管理员' ? 'red' : 'cyan'}
                    key={index}
                  >
                    {v.name}
                  </Tag>
                );
              })
            : [];
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
                onClick={() => this.showUserFormModal(r)}
                style={{ marginBottom: '8px' }}
              >
                编辑
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => this.showPasswordFormModal(r)}
              >
                修改密码
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
      const list = await store.fetchUserList();
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      userFormMode,
      userFormModalVisiable,
      passwordFormModalVisiable,
      editedUser,
      savingLoad,
      loading,
      groups
    } = this.state;
    const { userList, _pageQuery } = this.props.store;

    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(userList)}
          columns={this.getColumnsUser()}
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
          className="modal-user"
          title={`${userFormMode === USER_FORM_MODE_ADD ? '新增' : '更新'}用户`}
          width={700}
          destroyOnClose={true}
          visible={userFormModalVisiable}
          onCancel={this.hideUserFormModal}
          footer={[
            <Button key="back" onClick={this.hideUserFormModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.onUserSave}
            >
              保存
            </Button>
          ]}
        >
          <UserForm
            user={editedUser}
            mode={userFormMode}
            groups={groups}
            wrappedComponentRef={instance => {
              this.userForm = instance;
            }}
          />
        </Modal>
        <Modal
          className="modal-passwprd"
          title={'修改密码'}
          width={500}
          destroyOnClose={true}
          visible={passwordFormModalVisiable}
          onCancel={this.hidePasswordFormModal}
          footer={[
            <Button key="back" onClick={this.hidePasswordFormModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.onPasswordSave}
            >
              保存
            </Button>
          ]}
        >
          <PasswordForm
            user={editedUser}
            wrappedComponentRef={instance => {
              this.passwordForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default UserManagement;
