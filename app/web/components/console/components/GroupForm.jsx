import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Form, Input, Select, Tree } from 'antd';
const TreeNode = Tree.TreeNode;
const { Option } = Select;
const { Item: FormItem } = Form;
export const GROUP_FORM_MODE_ADD = 'add';
export const GROUP_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
};

@observer
class GroupForm extends Component {
  constructor() {
    super();
    this.state = {
      selTree: [],
      menuIdList_: []
    };
  }

  componentDidMount() {
    this.treeRender();
  }

  treeRender() {
    const group_menus =
      this.props.group && this.props.group.menus ? this.props.group.menus : [];
    const option_menus = this.props.menus;
    const fatherMenus = option_menus.map(item => item.id.toString());
    let menuIdList_ = [];
    group_menus.map(v => {
      if (fatherMenus.indexOf(v.id.toString()) == -1) {
        menuIdList_.push(v.id.toString());
      }
    });
    this.props.form.setFieldsValue({
      menuIds: group_menus.map(v => v.id.toString())
    });
    //获取dom<TreeNode> Array
    const treeNodeDomData = [];
    for (let i = 0, len = option_menus.length; i < len; i++) {
      const treeNodeChildrenData = [];
      if (option_menus[i].children && option_menus[i].children.length > 0) {
        const selTreeChild = option_menus[i].children;
        selTreeChild.map((d, index) => {
          treeNodeChildrenData.push(<TreeNode title={d.label} key={d.id} />);
        });
      }
      treeNodeDomData.push(
        <TreeNode title={option_menus[i].label} key={option_menus[i].id}>
          {treeNodeChildrenData}
        </TreeNode>
      );
    }
    this.setState({
      selTree: (
        <Tree
          checkable
          onCheck={this.onCheck}
          defaultCheckedKeys={menuIdList_}
          defaultExpandAll={true}
        >
          {treeNodeDomData}
        </Tree>
      )
    });
  }

  onCheck = selectMenuId => {
    const option_menus = this.props.menus;
    let menuIdList_ = new Set();
    for (let i = 0; i < option_menus.length; i++) {
      if (selectMenuId.indexOf(option_menus[i].id.toString()) > -1) {
        menuIdList_.add(option_menus[i].id.toString());
      }
      if (option_menus[i].children && option_menus[i].children.length) {
        let option_menus_child = option_menus[i].children;
        option_menus_child.map(d => {
          if (selectMenuId.indexOf(d.id.toString()) > -1) {
            menuIdList_.add(d.id.toString());
            menuIdList_.add(option_menus[i].id.toString());
          }
        });
      }
    }
    this.props.form.setFieldsValue({
      menuIds: [...menuIdList_]
    });
  };

  render() {
    const { form, mode, group, menus } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const isUpdate = mode === GROUP_FORM_MODE_UPDATE;

    getFieldDecorator('groupId', { initialValue: group ? group.groupId : '' });

    return (
      <Form className="form-user">
        <FormItem {...defaultItemProps} label="用户组名称">
          {getFieldDecorator('groupName', {
            initialValue: group ? group.groupName : '',
            rules: [
              {
                required: true,
                message: '请输入用户组名称'
              }
            ]
          })(<Input placeholder="请输入用户组名称" autoComplete="off" />)}
        </FormItem>
        <FormItem className="unshowKeys" {...defaultItemProps} label="关联菜单">
          {getFieldDecorator('menuIds', {
            rules: []
          })(<div>{this.state.selTree}</div>)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(GroupForm);
