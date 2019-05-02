import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Form, Input, Select, Icon, Divider } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const MENU_FORM_MODE_ADD = 'add';
export const MENU_FORM_MODE_UPDATE = 'update';
import icons from 'enums/Icon';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
};

@observer
class UserForm extends Component {
  state = {
    anticon: null
  };
  componentDidMount() {
    const { menu } = this.props;
    if (menu && menu.anticon) {
      this.setState({ anticon: menu.anticon });
    }
  }

  @autobind
  switchIcon(t, anticon) {
    this.setState({ anticon });
    this.props.form.setFieldsValue({ anticon });
  }
  render() {
    const { form, menu, mode, groups } = this.props;
    const { anticon } = this.state;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const isUpdate = mode === MENU_FORM_MODE_UPDATE;

    getFieldDecorator('id', { initialValue: menu ? menu.id : '' });
    getFieldDecorator('anticon', { initialValue: menu ? menu.anticon : '' });

    return (
      <Form className="form-menu">
        <FormItem {...defaultItemProps} label="菜单名">
          {getFieldDecorator('label', {
            initialValue: menu ? menu.label : '',
            rules: [
              {
                required: true,
                message: '请输入菜单名'
              }
            ]
          })(
            <Input
              placeholder="输入菜单名"
              autoComplete="off"
              readOnly={isUpdate}
            />
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="链接">
          {getFieldDecorator('link', {
            initialValue: menu ? menu.link : '',
            rules: [
              {
                required: true,
                message: '请输入链接'
              }
            ]
          })(<Input placeholder="输入链接" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="图标">
          {getFieldDecorator('anticon')(
            <div className="menu-icon-form">
              <div>
                <Icon type={anticon} />
              </div>
              <Divider dashed orientation="right" id="dashMenuIcon">
                选择图标
              </Divider>
              <div className="menu-icons">
                {icons.map((v, index) => {
                  return (
                    <Icon
                      type={v}
                      key={index}
                      onClick={target => this.switchIcon(target, v)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </FormItem>

        <FormItem {...defaultItemProps} label="用户组">
          {getFieldDecorator('groupIds', {
            initialValue:
              menu && menu.groups
                ? menu.groups.map(v => {
                    return v.id;
                  })
                : [],
            rules: [
              {
                required: true,
                message: '请选择用户组'
              }
            ]
          })(
            <Select mode="multiple" placeholder="选择用户组">
              {groups
                ? groups.map((v, index) => {
                    return (
                      <Option value={v.id} key={index}>
                        {v.name}
                      </Option>
                    );
                  })
                : []}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UserForm);
