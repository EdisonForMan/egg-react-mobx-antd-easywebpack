import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const WEB_FORM_MODE_ADD = 'add';
export const WEB_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class WebForm extends Component {
  /**
   * url检测
   */
  checkUrl = (rule, value, callback) => {
    let urlEnable = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/.test(
      value
    )
      ? undefined
      : 'url格式不正确';
    callback(urlEnable || undefined);
  };

  /**
   * number检测
   */
  checkNumber = (rule, value, callback) => {
    let number = isNaN(value) ? '请输入数字' : undefined;
    let numberEnable = value < 128 ? undefined : '不可超过127';
    callback(number || numberEnable || undefined);
  };

  render() {
    const { form, web, mode } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    //const isUpdate = mode === WEB_FORM_MODE_UPDATE;
    getFieldDecorator('id', { initialValue: web ? web.id : '' });

    return (
      <Form className="form-web">
        <FormItem {...defaultItemProps} label="类型">
          {getFieldDecorator('type', {
            initialValue: web ? web.type : 1,
            rules: [
              {
                required: true,
                message: '请输入正确类型'
              },
              {
                validator: this.checkNumber
              }
            ]
          })(<Input placeholder="输入类型" type="number" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="网站名称">
          {getFieldDecorator('platform', {
            initialValue: web ? web.platform : '',
            rules: [
              {
                required: true,
                message: '请输入网站名称'
              }
            ]
          })(<Input placeholder="输入网站名称" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="网址">
          {getFieldDecorator('web', {
            initialValue: web ? web.web : '',
            rules: [
              {
                required: true,
                message: '请输入网址'
              },
              {
                validator: this.checkUrl
              }
            ]
          })(<Input placeholder="输入网址" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="状态">
          {getFieldDecorator('status', {
            initialValue: web ? web.status.toString() : '1',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select>
              <Option value="1" key="1">
                正常
              </Option>
              <Option value="0" key="0">
                异常
              </Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(WebForm);
