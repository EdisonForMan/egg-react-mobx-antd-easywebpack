import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Form, Input } from 'antd';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

@observer
class PasswordForm extends Component {
  render() {
    const { form, user } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };

    return (
      <Form className="form-password">
        <FormItem {...defaultItemProps} label="用户名">
          {getFieldDecorator('username', {})(
            <div>{user ? user.username : ''}</div>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="密码">
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '密码不可为空'
              }
            ]
          })(
            <Input type="password" placeholder="输入密码" autoComplete="off" />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(PasswordForm);
