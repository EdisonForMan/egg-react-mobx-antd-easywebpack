import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const HANDLED_FORM_HASH = Symbol('handled');
export const HANDLED_FORM_MODE_ADD = 'add';
export const HANDLED_FORM_MODE_UPDATE = 'update';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class HandledForm extends Component {
  render() {
    const { form, handled, mode } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const isUpdate = mode === HANDLED_FORM_MODE_UPDATE;
    getFieldDecorator('id', { initialValue: handled ? handled.id : '' });
    return (
      <Form className="form-handled">
        <FormItem {...defaultItemProps} label="公司名称">
          {getFieldDecorator('corporationName', {
            initialValue: handled ? handled.corporation_name : '',
            rules: [
              {
                required: true,
                message: '请输入公司名称'
              }
            ]
          })(<Input placeholder="输入公司名称" disabled={isUpdate} />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="状态">
          {getFieldDecorator('status', {
            initialValue: handled ? handled.status.toString() : '1',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select>
              <Option value="1" key="1">
                生效
              </Option>
              <Option value="0" key="0">
                失效
              </Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(HandledForm);
