/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import {
  Layout,
  Menu,
  Avatar,
  Modal,
  Dropdown,
  Icon,
  Breadcrumb,
  Button,
  message,
} from 'antd';
import { renderRoutes } from 'react-router-config';
import { observer, inject } from 'mobx-react';
import { MENUS } from 'enums/Menu';
import UpdatePasswordForm from 'components/common/UpdatePasswordForm';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

@inject(stores => ({
  store: stores.userStore,
}))
@observer
class MainContainer extends Component {
  static async fetch(stores) {
    const { userStore } = stores;
    const response = await Promise.all([]);
    return response;
  }

  state = {
    updatePasswordModalVisi: false,
    //  默认打开的父菜单
    defaultOpenKeys: [],
    //  默认选择的子菜单
    defaultSelectedKeys: [],
    //  面包屑映射
    BREADCRUMB: {},
    //  router渲染开关
    routerSwitch: false,
    //  菜单渲染开关
    menuSwitch: false,
  };

  async componentDidMount() {
    const { fetchUserSession, fetchMenus } = this.props.store;
    //const user = await fetchUserSession();
    //await fetchMenus(user.id);
    //const { currentMenu: MENUS } = this.props.store;
    const BREADCRUMB = {};
    //  面包屑映射
    MENUS.map(item => {
      if (item.link && item.label) {
        BREADCRUMB[item.link] = item.label;
      }
      if (item.children && item.children.length) {
        item.children.map(_item => {
          BREADCRUMB[_item.link] = _item.label;
        });
      }
    });
    //  菜单节点显示
    const { pathname } = this.props.location;
    const defaultSelectedKeys =
      pathname == '/home' || pathname == '/'
        ? ''
        : pathname.replace('/home', '');
    const defaultOpenKeys = this.getFatherPoint(defaultSelectedKeys);
    this.setState({
      defaultOpenKeys: [defaultOpenKeys],
      defaultSelectedKeys: [defaultSelectedKeys],
      BREADCRUMB,
      routerSwitch: true,
      menuSwitch: true,
    });
    //  获取信息后打开路由
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    console.log(pathname);
    const defaultSelectedKeys =
      pathname == '/home' || pathname == '/'
        ? ''
        : pathname.replace('/home', '');
    const defaultOpenKeys = this.getFatherPoint(defaultSelectedKeys);
    this.setState({
      defaultOpenKeys: [defaultOpenKeys],
      defaultSelectedKeys: [defaultSelectedKeys],
    });
  }

  /**
   * 菜单树dom
   */
  exportMenuTree = () => {
    // const { currentMenu: MENUS } = this.props.store;
    const subMenuList = [],
      { defaultOpenKeys, defaultSelectedKeys } = this.state;
    for (let i = 0; i < MENUS.length; i++) {
      if (MENUS[i].children && MENUS[i].children.length) {
        const menuList = [],
          children = MENUS[i].children;
        children.map(v => {
          menuList.push(
            <Menu.Item key={v.link == '#' ? v.id : v.link}>{v.label}</Menu.Item>
          );
        });
        subMenuList.push(
          <SubMenu
            key={MENUS[i].link == '#' ? MENUS[i].id : MENUS[i].link}
            title={
              <span>
                <Icon type={MENUS[i].anticon || 'setting'} />
                <span>{MENUS[i].label}</span>
              </span>
            }
          >
            {menuList}
          </SubMenu>
        );
      } else {
        subMenuList.push(
          <SubMenu
            key={MENUS[i].link == '#' ? MENUS[i].id : MENUS[i].link}
            title={
              <span>
                <Icon type={MENUS[i].anticon || 'setting'} />
                <span>{MENUS[i].label}</span>
              </span>
            }
          >
            {[]}
          </SubMenu>
        );
      }
    }
    return (
      <Menu
        theme="light"
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={defaultSelectedKeys}
        mode="inline"
        onClick={this.switchMenu}
      >
        {subMenuList}
      </Menu>
    );
  };

  /**
   * 菜单点击切换
   * @param {String} key
   */
  switchMenu = ({ key }) => {
    const { history } = this.props;
    this.setState({
      defaultSelectedKeys: [key],
    });
    history.push(`/home${key}`);
  };

  /**
   * 根据子节点key寻找父节点key
   * @param key <String> 菜单key
   */
  getFatherPoint = key => {
    // const { currentMenu: MENUS } = this.props.store;
    let target = null;
    [...MENUS].map(item => {
      item.children &&
        item.children.map(_item => {
          if (_item.link == key) {
            target = item.link;
          }
        });
    });
    return target;
  };

  /**
   * 面包屑dom
   */
  returnBreadcrumb = () => {
    const { defaultSelectedKeys, BREADCRUMB } = this.state;
    //  _m表示首页
    const arr = [''];
    //  加入父节点
    arr.push(this.getFatherPoint(defaultSelectedKeys[0]));
    //  加入子节点
    arr.push(defaultSelectedKeys[0]);
    return arr.length ? (
      <Breadcrumb>
        {arr.map((v, index) => {
          if (v) {
            return BREADCRUMB[v] ? (
              <Breadcrumb.Item key={`breadcrumb-${index}`}>
                {BREADCRUMB[v] || '未知页面'}
              </Breadcrumb.Item>
            ) : (
              undefined
            );
          } else if (v == '' && index == 0) {
            return (
              <Breadcrumb.Item key={`breadcrumb-${index}`}>
                Home
              </Breadcrumb.Item>
            );
          }
        })}
      </Breadcrumb>
    ) : (
      <div />
    );
  };

  @autobind
  logout() {
    Modal.confirm({
      title: '确定将登出吗?',
      onOk: async () => {
        await this.props.store.logout();
        window.location.replace(`/login`);
      },
      okText: '确认',
      cancelText: '取消',
    });
  }

  @autobind
  updatePassword() {
    const { currentUser } = this.props.store;
    this.updatePasswordForm.props.form.validateFieldsAndScroll(
      async (error, values) => {
        if (error) {
          message.error('条件错误');
        } else {
          const { passwordOld, passwordNew } = values;
          await this.props.store.updatePassword({
            userId: currentUser.id,
            password: passwordNew,
          });
          message.info(`密码修改成功`);
          setTimeout(() => {
            window.location.replace(`/login`);
          }, 800);
        }
      }
    );
  }

  @autobind
  closeUpdatePasswordModal() {
    this.setState({ updatePasswordModalVisi: false });
  }

  userMenu() {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.setState({ updatePasswordModalVisi: true })}>
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.logout}>登出</a>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { updatePasswordModalVisi, routerSwitch, menuSwitch } = this.state;
    const { route, location, store } = this.props;

    return (
      <Layout className="page-main" style={{ display: 'flex' }}>
        <Header style={{ padding: 0 }}>
          <div className="logo">Content Manage System</div>
          <div className="avater-user">
            <span style={{ color: '#fff' }}>
              hi , {store.currentUser.username || 'unknows'}
            </span>
            <Dropdown overlay={this.userMenu()}>
              <a>
                <Avatar>ADMIN</Avatar>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Layout style={{ flexDirection: 'row' }}>
          <Sider width={200} style={{ background: '#fff' }}>
            {menuSwitch ? this.exportMenuTree() : undefined}
          </Sider>
          <Content style={{ overflowY: 'auto' }}>
            {routerSwitch ? this.returnBreadcrumb() : undefined}
            {routerSwitch ? (
              <div id="main-content">{renderRoutes(route.routes)}</div>
            ) : (
              undefined
            )}
            <Footer
              style={{ textAlign: 'center', padding: '12px 12px 2px 12px' }}
            >
              ©2019 Created by GaobangShao
            </Footer>
          </Content>
        </Layout>
        <Modal
          className="update-password-modal"
          title="修改密码"
          visible={updatePasswordModalVisi}
          width={400}
          onCancel={this.closeUpdatePasswordModal}
          footer={[
            <Button key="back" onClick={this.closeUpdatePasswordModal}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.updatePassword}>
              提交
            </Button>,
          ]}
        >
          <UpdatePasswordForm
            wrappedComponentRef={instance => {
              this.updatePasswordForm = instance;
            }}
            updateUser={store.currentUser}
          />
        </Modal>
      </Layout>
    );
  }
}

export default MainContainer;
