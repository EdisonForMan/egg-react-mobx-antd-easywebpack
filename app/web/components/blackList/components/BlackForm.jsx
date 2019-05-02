import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const BLACK_FORM_MODE_ADD = 'add';
export const BLACK_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class BlackForm extends Component {
  /**
   * url检测
   */
  checkIdCard = (rule, value, callback) => {
    if (!value) return callback(undefined);
    let IdCardEnable = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
      ? undefined
      : '身份证格式不正确';
    callback(IdCardEnable || undefined);
  };

  /**
   * url检测
   */
  checkUrl = (rule, value, callback) => {
    if (!value) return callback(undefined);
    let urlEnable = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/.test(
      value
    )
      ? undefined
      : '网站格式 http(s)://';
    callback(urlEnable || undefined);
  };

  /**
   * 手机号检测
   */
  checkMobile = (rule, value, callback) => {
    if (!value) return callback(undefined);
    let MobileEnable = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
      value
    )
      ? undefined
      : '手机号码格式不正确';
    callback(MobileEnable || undefined);
  };

  render() {
    const { form, black, mode } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const isUpdate = mode === BLACK_FORM_MODE_UPDATE;
    getFieldDecorator('id', { initialValue: black ? black.id : '' });

    return (
      <Form className="form-black">
        <FormItem {...defaultItemProps} label="姓名">
          {getFieldDecorator('name', {
            initialValue: black ? black.name : ''
          })(<Input placeholder="输入姓名" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="身份证">
          {getFieldDecorator('idcard', {
            initialValue: black ? black.idcard : '',
            rules: [
              {
                validator: this.checkIdCard
              }
            ]
          })(<Input placeholder="输入身份证" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="性别">
          {getFieldDecorator('sex', {
            initialValue: black ? black.sex.toString() : ''
          })(
            <Select>
              <Option value={null} key="_" />
              <Option value="男" key="1">
                男
              </Option>
              <Option value="女" key="0">
                女
              </Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="QQ号码">
          {getFieldDecorator('qq', {
            initialValue: black ? black.qq : ''
          })(<Input type="number" placeholder="输入QQ号码" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="手机">
          {getFieldDecorator('mobile', {
            initialValue: black ? black.mobile : '',
            rules: [
              {
                validator: this.checkMobile
              }
            ]
          })(<Input placeholder="输入手机号码" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="手机2">
          {getFieldDecorator('mobile2', {
            initialValue: black ? black.mobile2 : '',
            rules: [
              {
                validator: this.checkMobile
              }
            ]
          })(<Input placeholder="输入手机号码" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="手机3">
          {getFieldDecorator('mobile3', {
            initialValue: black ? black.mobile3 : '',
            rules: [
              {
                validator: this.checkMobile
              }
            ]
          })(<Input placeholder="输入手机号码" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="来源">
          {getFieldDecorator('platform', {
            initialValue: black ? black.platform : '',
            rules: [
              {
                required: true,
                message: '请输入来源'
              }
            ]
          })(<Input placeholder="输入来源" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="网站">
          {getFieldDecorator('website', {
            initialValue: black ? black.website : '',
            rules: [
              {
                validator: this.checkUrl
              }
            ]
          })(<Input placeholder="输入网站" />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(BlackForm);
