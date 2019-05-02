import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Form, Input, Select, Checkbox } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const USER_FORM_MODE_ADD = 'add';
export const USER_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class UserForm extends Component {
  render() {
    const { form, user, mode, groups } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };

    getFieldDecorator('userId', { initialValue: user ? user.id : '' });

    return (
      <Form className="form-user">
        <FormItem {...defaultItemProps} label="用户名">
          {getFieldDecorator('username', {
            initialValue: user ? user.username : '',
            rules: [
              {
                required: true,
                message: '请输入用户名'
              }
            ]
          })(<Input placeholder="输入用户名" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="姓名">
          {getFieldDecorator('name', {
            initialValue: user ? user.name : '',
            rules: [
              {
                required: true,
                message: '请输入姓名'
              }
            ]
          })(<Input placeholder="输入姓名" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="座机号">
          {getFieldDecorator('tel', {
            initialValue: user ? user.tel : ''
          })(<Input placeholder="输入座机号" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="复审员ID">
          {getFieldDecorator('reviewId', {
            initialValue: user ? user.reviewId : '',
            rules: [
              {
                required: true,
                message: '请输入ID'
              }
            ]
          })(<Input placeholder="输入复审员ID" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="用户组">
          {getFieldDecorator('groupIds', {
            initialValue:
              user && user.groups
                ? user.groups.map(v => {
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
        <FormItem {...defaultItemProps} label="是否激活">
          {getFieldDecorator('active', {
            valuePropName: 'checked',
            initialValue: user && user.active == 1 ? true : false
          })(<Checkbox />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UserForm);
