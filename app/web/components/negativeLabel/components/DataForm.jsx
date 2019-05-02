import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const DATA_FORM_MODE_ADD = 'add';
export const DATA_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class DataForm extends Component {
  render() {
    const {
      form,
      data,
      dataTagOption,
      dataTypeOption,
      cautionLevelOption,
      statusOption
    } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const _statusOption = statusOption.slice(1);
    const _dataTagOption = dataTagOption.slice(1);
    const _dataTypeOption = dataTypeOption.slice(1);
    const _cautionLevelOption = cautionLevelOption.slice(1);
    getFieldDecorator('id', { initialValue: data ? data.id : '' });

    return (
      <Form className="form-data">
        <FormItem {...defaultItemProps} label="数据项">
          {getFieldDecorator('data', {
            initialValue: data ? data.data : '',
            rules: [
              {
                required: true,
                message: '请输入类型'
              }
            ]
          })(<Input placeholder="输入数据项" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="备注">
          {getFieldDecorator('dataTwo', {
            initialValue: data ? data.dataTwo : ''
          })(<Input placeholder="输入数据备注" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="数据类型">
          {getFieldDecorator('dataType', {
            initialValue: data ? data.dataType : 'PHONE',
            rules: [
              {
                required: true,
                message: '请选择类型'
              }
            ]
          })(
            <Select>
              {_dataTypeOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="属性">
          {getFieldDecorator('cautionLevel', {
            initialValue: data ? data.cautionLevel : 'WHITE',
            rules: [
              {
                required: true,
                message: '请选择属性'
              }
            ]
          })(
            <Select>
              {_cautionLevelOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="行为标签">
          {getFieldDecorator('dataTag', {
            initialValue: data ? data.dataTag : 'QZ',
            rules: [
              {
                required: true,
                message: '请选择行为标签'
              }
            ]
          })(
            <Select>
              {_dataTagOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="状态">
          {getFieldDecorator('status', {
            initialValue: data ? data.status.toString() : 'true',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select>
              {_statusOption.map(item => {
                return (
                  <Option value={item.key} key={item.key.toString()}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(DataForm);
