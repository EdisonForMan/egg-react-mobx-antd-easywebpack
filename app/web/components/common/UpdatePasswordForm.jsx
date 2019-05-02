import React, { Component } from 'react';
import { Form, Input } from 'antd';

const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class UpdatePasswordForm extends Component {
  state = {
    confirmDirty: false
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('passwordNew')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };
  render() {
    const { form, updateUser } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className="user-add-update-form">
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="username1"
          label="用户名"
        >
          {getFieldDecorator('username', {
            initialValue: updateUser.username,
            rules: [
              {
                required: true,
                message: 'The input is not valid username!'
              }
            ]
          })(
            <Input disabled placeholder="请输入用户名" style={{ width: 200 }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="passwordNew"
          label="新密码"
        >
          {getFieldDecorator('passwordNew', {
            rules: [
              {
                required: true,
                message: 'Please input your passwordNew!'
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              placeholder="请输入密码"
              style={{ width: 200 }}
              type="password"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="confirm"
          label="确认密码"
        >
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              placeholder="请输入密码"
              style={{ width: 200 }}
              type="password"
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UpdatePasswordForm);
