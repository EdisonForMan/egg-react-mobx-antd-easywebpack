import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'antd';
const Option = Select.Option;
const { Item: FormItem } = Form;
export const PENDING_FORM_HASH = Symbol('pending');

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class PendingForm extends Component {
  state = {
    //  状态
    statusOption: [
      { key: 'PROCESSED', title: '已入库' },
      { key: 'IGNORED', title: '已忽略' }
    ],
    //  业务类型
    businessTypeOption: [
      { key: '通讯录', title: '通讯录' },
      { key: 'QQ好友', title: 'QQ好友' },
      { key: 'QQ群', title: 'QQ群' },
      { key: '通话记录', title: '通话记录' },
      { key: '关系网络', title: '关系网络' }
    ],
    //   属性
    cautionLevelOption: [
      { key: 'WHITE', title: '白' },
      { key: 'GREY', title: '灰' },
      { key: 'BLACK', title: '黑' }
    ],
    //  行为标签
    dataTagOption: [
      { key: 'QZ', title: '欺诈' },
      { key: 'XY', title: '信用' },
      { key: 'SD', title: '涉赌' },
      { key: 'XD', title: '吸毒' },
      { key: 'TX', title: '套现' },
      { key: 'ZJ', title: '中介' },
      { key: 'CP', title: '彩票' },
      { key: 'CS', title: '催收' },
      { key: 'GLD', title: '高利贷' },
      { key: 'NULL', title: '无' }
    ]
  };

  render() {
    const { form, data, nostatus } = this.props;
    const {
      businessTypeOption,
      cautionLevelOption,
      dataTagOption,
      statusOption
    } = this.state;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    getFieldDecorator('id', { initialValue: data ? data.id : '' });
    getFieldDecorator('dataTwo', { initialValue: data ? data.dataTwo : '' });
    getFieldDecorator('dataType', {
      initialValue: data ? data.dataType : undefined
    });

    return (
      <Form className="form-data">
        <FormItem {...defaultItemProps} label="数据项">
          {getFieldDecorator('data', {
            initialValue: data ? data.data : '',
            rules: [
              {
                required: true,
                message: '请输入数据项'
              }
            ]
          })(<Input placeholder="输入数据项" autoComplete="off" disabled />)}
        </FormItem>
        <FormItem {...defaultItemProps} label="业务类型">
          {getFieldDecorator('businessType', {
            initialValue:
              data && data.businessType ? data.businessType : '关系网络',
            rules: [
              {
                required: true,
                message: '请选择类型'
              }
            ]
          })(
            <Select disabled>
              {businessTypeOption.map(item => {
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
            initialValue:
              data && data.cautionLevel ? data.cautionLevel : 'WHITE',
            rules: [
              {
                required: true,
                message: '请选择属性'
              }
            ]
          })(
            <Select>
              {cautionLevelOption.map(item => {
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
            initialValue: data && data.dataTag ? data.dataTag : 'QZ',
            rules: [
              {
                required: true,
                message: '请选择行为标签'
              }
            ]
          })(
            <Select>
              {dataTagOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        {nostatus ? (
          undefined
        ) : (
          <FormItem {...defaultItemProps} label="状态">
            {getFieldDecorator('status', {
              initialValue: 'PROCESSED',
              rules: [
                {
                  required: true,
                  message: '请选择状态'
                }
              ]
            })(
              <Select>
                {statusOption.map(item => {
                  return (
                    <Option value={item.key} key={item.key}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        )}
      </Form>
    );
  }
}

export default Form.create()(PendingForm);
