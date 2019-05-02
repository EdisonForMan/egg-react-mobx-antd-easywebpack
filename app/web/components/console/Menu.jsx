import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, Tag, message, Icon, Tabs } from 'antd';
const { TabPane } = Tabs;
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import MenuTree from './components/MenuTree';
import './Menu.less';

import MenuForm, {
  MENU_FORM_MODE_ADD,
  MENU_FORM_MODE_UPDATE
} from './components/MenuForm';
import hoc from 'components/HOC/pageHeader';

@inject(stores => ({
  store: stores.menuStore
}))
@hoc({ name: '菜单管理', className: 'page_menu' })
@observer
class MenuManagement extends Component {
  state = {
    loading: false,
    menuFormModalVisiable: false,
    menuFormMode: MENU_FORM_MODE_ADD,
    groups: null,
    savingLoad: false,
    editedMenu: null,
    treeTabAvailable: false,
    menuAll: []
  };

  componentDidMount() {
    this.fetchList();
  }

  async getBasicOption() {
    //  是否有options数据
    const { groups } = this.state;
    const { fetchBasicOption, fetchMenuAll } = this.props.store;
    if (groups) {
      return;
    } else {
      const data = await fetchBasicOption();
      const menuAll = await fetchMenuAll();
      this.setState({ groups: data, menuAll });
      return;
    }
  }

  @autobind
  onMenuSave() {
    const { menuFormMode, menuAll } = this.state;
    const { store } = this.props;
    const { form } = this.menuForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      //    前端判断link重复
      let pass = false;
      if (!values.id) {
        menuAll.map(v => {
          if (v.link == values.link) {
            pass = true;
          }
        });
      }
      if (pass) {
        return message.error('菜单链接已存在');
      }
      this.setState({ savingLoad: true });
      try {
        await store.saveMenu(values);
        this.hideMenuFormModal();
        message.success(
          `${menuFormMode === MENU_FORM_MODE_ADD ? '添加' : '更新'}用户组【${
            values.label
          }】成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.fetchList();
      //  更新后 也更新MenuTree的状态
      if (this.myRef) {
        this.myRef.wrappedInstance.doFilteMenuTree();
      }
    });
  }

  @autobind
  async showMenuFormModal(menu) {
    await this.getBasicOption();
    if (menu && menu.id) {
      this.setState({
        menuFormModalVisiable: true,
        menuFormMode: MENU_FORM_MODE_UPDATE,
        editedMenu: menu
      });
    } else {
      this.setState({ menuFormModalVisiable: true });
    }
  }

  @autobind
  hideMenuFormModal() {
    this.setState({
      menuFormModalVisiable: false,
      menuFormMode: MENU_FORM_MODE_ADD,
      editedMenu: null
    });
  }

  getColumnsMenu() {
    const cols = [
      {
        title: '编号',
        dataIndex: 'id',
        sorter: (a, b) => {}
      },
      {
        title: '菜单名称',
        dataIndex: 'label',
        sorter: (a, b) => {}
      },
      {
        title: '已授权用户组',
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
        title: '链接地址',
        dataIndex: 'link',
        sorter: (a, b) => {}
      },
      {
        title: '图标',
        dataIndex: 'iconNew',
        render: t => {
          return <Icon type={t} />;
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
                onClick={() => this.showMenuFormModal(r)}
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
      const list = await store.fetchMenuList();
    } finally {
      this.setState({
        loading: false,
        treeTabAvailable: true
      });
    }
  }

  @autobind
  async delete(r) {
    const { deleteMenu } = this.props.store;
    Modal.confirm({
      title: `确定要删除[${r.label}]菜单吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteMenu(r.id);
          message.info(`删除[${r.label}]菜单成功`);
        } finally {
          this.fetchList();
          //  更新后 也更新MenuTree的状态
          if (this.myRef) {
            this.myRef.wrappedInstance.doFilteMenuTree();
          }
        }
      }
    });
  }

  render() {
    const {
      menuFormMode,
      menuFormModalVisiable,
      editedMenu,
      savingLoad,
      loading,
      groups,
      treeTabAvailable
    } = this.state;

    const { menuList, _pageQuery, _query } = this.props.store;

    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="菜单列表" key="1">
            <div className="action-container">
              <span className="action-right-button">
                <Button
                  type="primary"
                  icon="plus"
                  onClick={this.showMenuFormModal}
                >
                  新增菜单
                </Button>
              </span>
            </div>
            <Table
              dataSource={toJS(menuList)}
              columns={this.getColumnsMenu()}
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
              className="modal-menu"
              title={`${
                menuFormMode === MENU_FORM_MODE_ADD ? '新增' : '编辑'
              }菜单`}
              width={700}
              destroyOnClose={true}
              visible={menuFormModalVisiable}
              onCancel={this.hideMenuFormModal}
              footer={[
                <Button key="back" onClick={this.hideMenuFormModal}>
                  取消
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={savingLoad}
                  onClick={this.onMenuSave}
                >
                  保存
                </Button>
              ]}
            >
              <MenuForm
                menu={editedMenu}
                mode={menuFormMode}
                groups={groups}
                wrappedComponentRef={instance => {
                  this.menuForm = instance;
                }}
              />
            </Modal>
          </TabPane>
          {treeTabAvailable ? (
            <TabPane tab="菜单排序" key="2">
              <MenuTree
                ref={inst => {
                  this.myRef = inst;
                }}
              />
            </TabPane>
          ) : (
            <TabPane tab="菜单排序" disabled key="2" />
          )}
        </Tabs>
      </div>
    );
  }
}

export default MenuManagement;
