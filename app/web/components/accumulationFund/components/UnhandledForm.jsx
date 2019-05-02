import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const UNHANDLED_FORM_HASH = Symbol('unhandled');

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class UnhandledForm extends Component {
  render() {
    const { form, unhandled } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    getFieldDecorator('id', { initialValue: unhandled ? unhandled.id : '' });
    return (
      <Form className="form-unhandled">
        <FormItem {...defaultItemProps} label="公司名称">
          {getFieldDecorator('corporationName', {
            initialValue: unhandled ? unhandled.corporation_name : '',
            rules: [
              {
                required: true,
                message: '请输入公司名称'
              }
            ]
          })(<Input placeholder="输入公司名称" disabled />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="状态">
          {getFieldDecorator('status', {
            initialValue: '1',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select>
              <Option value="1" key="1">
                已入库
              </Option>
              <Option value="2" key="0">
                已忽略
              </Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UnhandledForm);
