import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const KEYWORD_FORM_MODE_ADD = 'add';
export const KEYWORD_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class KeywordForm extends Component {
  state = {
    _keywordOption: [],
    _keywordTypeValue: null
  };

  async componentWillMount() {
    const { keyword, keyword_no_phone_list, keyword_phone_list } = this.props;
    this.setState({
      _keywordOption: keyword
        ? keyword.businessType == '通讯录敏感词'
          ? keyword_phone_list
          : keyword_no_phone_list
        : keyword_no_phone_list,
      _keywordTypeValue: keyword.keywordType
    });
  }

  /**
   * 【特殊情况】select改变时触发
   * @param key businessType
   */
  onChange = key => {
    const { setFieldsValue } = this.props.form;
    const { _keywordTypeValue } = this.state;
    const { keyword_no_phone_list, keyword_phone_list } = this.props;
    const _keywordOption =
      key == '通讯录敏感词' ? keyword_phone_list : keyword_no_phone_list;
    const _keywordMap = _keywordOption.map(item => {
      return item.key;
    });
    this.setState({ _keywordOption });
    setFieldsValue({
      keywordType:
        _keywordMap.indexOf(_keywordTypeValue) > 0
          ? _keywordTypeValue
          : _keywordMap[0]
    });
  };

  render() {
    const {
      form,
      keyword,
      deprecatedOption,
      statusOption,
      businessOption,
      graveOption,
      keyword_no_phone_list
    } = this.props;
    const { _keywordOption: __keywordOption } = this.state;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const _keywordOption = __keywordOption.length
      ? __keywordOption
      : keyword_no_phone_list;
    const _deprecatedOption = deprecatedOption.slice(1);
    const _statusOption = statusOption.slice(1);
    const _businessOption = businessOption.slice(1);
    const _graveOption = graveOption.slice(1);
    getFieldDecorator('id', { initialValue: keyword ? keyword.id : '' });

    return (
      <Form className="form-keyword">
        <FormItem {...defaultItemProps} label="敏感词">
          {getFieldDecorator('keyword', {
            initialValue: keyword ? keyword.keyword : '',
            rules: [
              {
                required: true,
                message: '请输入类型'
              }
            ]
          })(<Input placeholder="输入敏感词" autoComplete="off" />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="敏感词状态">
          {getFieldDecorator('deprecated', {
            initialValue: keyword ? keyword.deprecated.toString() : 'false',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select>
              {_deprecatedOption.map(item => {
                return (
                  <Option value={item.key} key={item.key.toString()}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="过滤方式">
          {getFieldDecorator('status', {
            initialValue: keyword ? keyword.status : 'WAIT',
            rules: [
              {
                required: true,
                message: '请选择方式'
              }
            ]
          })(
            <Select>
              {_statusOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="业务类型">
          {getFieldDecorator('businessType', {
            initialValue: keyword ? keyword.businessType : 'Basis',
            rules: [
              {
                required: true,
                message: '请选择业务类型'
              }
            ]
          })(
            <Select onChange={key => this.onChange(key)}>
              {_businessOption.map(item => {
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
          {getFieldDecorator('graveLevel', {
            initialValue: keyword ? keyword.graveLevel : 'WHITE',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select>
              {_graveOption.map(item => {
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
          {getFieldDecorator('keywordType', {
            initialValue: keyword ? keyword.keywordType : 'NULL',
            rules: [
              {
                required: true,
                message: '请选择状态'
              }
            ]
          })(
            <Select
              onChange={key => {
                this.setState({ _keywordTypeValue: key });
              }}
            >
              {_keywordOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
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

export default Form.create()(KeywordForm);
