import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Layout, Divider, Tree, message, Modal } from 'antd';
const { Sider, Content } = Layout;
const { confirm } = Modal;
const { TreeNode } = Tree;
import './MenuTree.less';

@inject(stores => ({
  menuStore: stores.menuStore
}))
@observer
class MenuTree extends Component {
  state = {
    _menuList: [],
    unHandleMenuList: [],
    handleMenuTree: []
  };
  componentDidMount() {
    this.doFilteMenuTree();
  }

  //  分拣菜单
  async doFilteMenuTree() {
    const { fetchMenuAll, fetchMenuOption } = this.props.menuStore;
    const __menuList_unhandle = await fetchMenuAll();
    const _menuList = __menuList_unhandle.map(v => {
      return {
        id: v.id,
        title: v.label || 'unknown',
        anticon: v.anticon || '',
        key: v.link || ''
      };
    });

    //  获取菜单树
    const handleMenuTree = await fetchMenuOption();
    //  菜单id数组
    let mList = [..._menuList].map(v => {
      return v.id;
    });
    //  如果id在树里找到,则再数组剔除
    const __HandleMenuTree = handleMenuTree.map(v => {
      let _root = {};
      const index = mList.indexOf(v.id);
      if (index > -1) {
        mList.splice(index, 1);
        _menuList.map(item => {
          if (v.id == item.id) {
            _root = { ...item };
          }
        });
      }
      _root.children = [];
      if (v.children && v.children.length) {
        v.children.map(cv => {
          const index = mList.indexOf(cv.id);
          if (index > -1) {
            mList.splice(index, 1);
            _menuList.map(_item => {
              if (cv.id == _item.id) {
                _root.children.push({ ..._item });
              }
            });
          }
        });
      }
      return _root;
    });
    //  生成未加入树的菜单数组
    const unHandleMenuList = mList.map(v => {
      let tMenu;
      _menuList.map(d => {
        if (d.id == v) tMenu = d;
      });
      return tMenu;
    });
    this.setState({
      _menuList,
      unHandleMenuList,
      handleMenuTree: __HandleMenuTree
    });
  }

  /**
   * 从未处理菜单->处理菜单
   * @param {*} id
   */
  @autobind
  moveToHandleMenuTree(id) {
    const { unHandleMenuList, handleMenuTree } = this.state;
    let targetMenu, rindex;
    unHandleMenuList.map((r, index) => {
      if (r.id == id) {
        targetMenu = r;
        rindex = index;
      }
    });
    unHandleMenuList.splice(rindex, 1);
    handleMenuTree.push(targetMenu);
    this.setState({
      unHandleMenuList: [...unHandleMenuList],
      handleMenuTree: [...handleMenuTree]
    });
  }

  /**
   * 从处理菜单->未处理菜单(有children一并带走)
   * @param {*} id
   */
  @autobind
  removeFromTree(id) {
    const { unHandleMenuList, handleMenuTree } = this.state;
    let targetMenus = [],
      rindex = -1;
    let _handleMenuTree = handleMenuTree.map((r, index) => {
      if (r.id == id) {
        if (r.children && r.children.length) {
          targetMenus = targetMenus.concat(r.children);
        }
        delete r.children;
        targetMenus.push(r);
        rindex = index;
      } else if (r.children && r.children.length) {
        let target_index = -1;
        r.children.map((_r, _index) => {
          if (_r.id == id) {
            targetMenus.push(_r);
            target_index = _index;
          }
        });
        if (target_index > -1) {
          r.children.splice(target_index, 1);
        }
      }
      return r;
    });
    if (rindex > -1) {
      handleMenuTree.splice(rindex, 1);
    }
    this.setState({
      unHandleMenuList: [...unHandleMenuList, ...targetMenus],
      handleMenuTree: [...handleMenuTree]
    });
  }

  /**
   * 画未处理菜单
   */
  @autobind
  unHandleMenuListDom() {
    const { unHandleMenuList } = this.state;
    return unHandleMenuList.map(v => {
      const leftIcon = v.anticon ? (
        <span className="uhm-left">
          <Icon type={v.anticon} />
        </span>
      ) : (
        <span />
      );
      return (
        <div key={v.id} className="unHandleMenu">
          {leftIcon}
          <i>
            {v.title} ({v.key})
          </i>
          <span
            className="uhm-right"
            onClick={() => this.moveToHandleMenuTree(v.id)}
          >
            <Icon type="arrow-right" theme="outlined" />
          </span>
        </div>
      );
    });
  }

  onDragEnter = info => {
    // expandedKeys 需要受控时设置
    this.setState({
      expandedKeys: info.expandedKeys
    });
  };

  /**
   * 画处理的菜单树
   */
  @autobind
  handleMenuTreeDom() {
    const { handleMenuTree } = this.state;
    const arr = handleMenuTree.map(v => {
      return v.id.toString();
    });
    return (
      <Tree
        className="draggable-tree"
        draggable
        expandedKeys={arr}
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
      >
        {this.loop(handleMenuTree)}
      </Tree>
    );
  }

  /**
   * 菜单树loop输出dom
   * @param {*} data
   */
  @autobind
  loop(data) {
    return data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.id}
            title={
              <div>
                <Icon type={item.anticon} className="title-left-icon" />
                {item.title}
                <Icon
                  onClick={() => this.removeFromTree(item.id)}
                  type="close-circle"
                  theme="outlined"
                  className="title-right-icon"
                />
              </div>
            }
          >
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          title={
            <div>
              <Icon type={item.anticon} className="title-left-icon" />
              {item.title}
              <Icon
                onClick={() => this.removeFromTree(item.id)}
                type="close-circle"
                theme="outlined"
                className="title-right-icon"
              />
            </div>
          }
        />
      );
    });
  }

  /**
   * 拖拽需要的loop用于查找目标obj
   * @param {*} data
   * @param {*} key
   * @param {*} callback
   */
  @autobind
  goMenuLoop(data, key, callback) {
    data.forEach((item, index, arr) => {
      if (item.id == key) {
        return callback(item, index, arr);
      }
      if (item.children) {
        return this.goMenuLoop(item.children, key, callback);
      }
    });
  }

  /**
   * 拖拽触发
   * @param {*} info
   */
  @autobind
  onDrop(info) {
    const { goMenuLoop } = this;
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const data = [...this.state.handleMenuTree];
    const initData = JSON.parse(JSON.stringify(data));
    let dragObj,
      dropObj,
      isFirstLevel = false;
    //找到被拖拽菜单
    goMenuLoop(data, dragKey, (item, index, arr) => {
      dragObj = item;
    });
    //找到目标菜单
    goMenuLoop(data, dropKey, (item, index, arr) => {
      dropObj = item;
      data.map(v => {
        if (v.id == dropObj.id) {
          isFirstLevel = true;
        }
      });
    });
    if (
      (info.dropToGap && !isFirstLevel && dragObj.children) ||
      (!info.dropToGap && dragObj.children)
    ) {
      return this.setState({
        handleMenuTree: initData
      });
    }
    // 开始修改数据
    if (info.dropToGap) {
      let ar;
      let i;
      goMenuLoop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
      });
      goMenuLoop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } else {
      goMenuLoop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
      });
      //只作用在第一层
      if (isFirstLevel) {
        goMenuLoop(data, dropKey, item => {
          item.children = item.children || [];
          item.children.push(dragObj);
        });
      } else {
        let ar;
        let i;
        goMenuLoop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        ar.splice(i + 1, 0, dragObj);
      }
    }
    this.setState({
      handleMenuTree: data
    });
  }

  @autobind
  async saveMenuStore() {
    const { handleMenuTree } = this.state;
    const { saveMenuStore } = this.props.menuStore;
    let menuStore = handleMenuTree.map(v => {
      let menu = { id: +v.id };
      if (v.children && v.children.length) {
        let children = v.children.map(r => {
          return { id: +r.id };
        });
        menu.children = children;
      }
      return menu;
    });
    confirm({
      title: '确认保存该菜单关系?',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        console.log(menuStore);
        await saveMenuStore(JSON.stringify(menuStore));
        message.success(`保存菜单成功`);
      }
    });
  }

  render() {
    return (
      <div className="components_menuTree">
        <div className="action-container">
          <span className="action-right-button">
            <Button type="primary" onClick={this.saveMenuStore}>
              保存菜单
            </Button>
            <Button type="primary" onClick={() => this.doFilteMenuTree()}>
              重置
            </Button>
          </span>
        </div>
        <Layout>
          <Sider width="40%" style={{ background: '#fff' }}>
            <span>未排序</span>
            <Divider dashed style={{ margin: '10px 0' }} />
            {this.unHandleMenuListDom()}
          </Sider>
          <Layout style={{ paddingLeft: '30px', background: '#fff' }}>
            <span>已排序</span>
            <Divider dashed style={{ margin: '10px 0' }} />
            <div className="menuDragTree">{this.handleMenuTreeDom()}</div>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default MenuTree;
