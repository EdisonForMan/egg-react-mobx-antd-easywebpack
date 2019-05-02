import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select, TreeSelect } from 'antd';
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
import autobind from 'autobind-decorator';
const { Option } = Select;
const { Item: FormItem } = Form;
export const BILL_FORM_HASH = Symbol('bill');
export const BILL_FORM_MODE_ADD = 'add';
export const BILL_FORM_MODE_UPDATE = 'update';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class BillForm extends Component {
  state = {
    //  树
    treeOption: <TreeSelect />,
    shallText: false,
    //  状态
    expressionTypeOption: [
      { key: '1', title: '交易类型' },
      { key: '2', title: '来源类型' }
    ],
    rearExpressionOption: [
      {
        key: '#description.contains(#keyword)',
        title: '包含'
      },
      { key: '#description.equals(#keyword)', title: '等于' },
      { key: '#description.startsWith(#keyword)', title: '作为开头' },
      { key: '#description.endsWith(#keyword)', title: '作为结尾' },
      { key: '', title: '空' },
      { key: '自定义', title: '自定义' }
    ],
    enableOption: [
      { key: 'true', title: '生效' },
      { key: 'false', title: '失效' }
    ]
  };

  /**
   *  生成option
   * @param {*} data 树
   */
  fixTree(data) {
    const treeOption = data ? this.drawTree(data) : [];
    return (
      <TreeSelect
        style={{ width: 400 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="选择标签"
      >
        {treeOption}
      </TreeSelect>
    );
  }

  drawTree(data) {
    const treeOption = [];
    data.map(item => {
      const _treeOption =
        item.children && item.children.length
          ? this.drawTree(item.children)
          : [];
      treeOption.push(
        <TreeNode value={item.key} title={item.title} key={item.key}>
          {_treeOption}
        </TreeNode>
      );
    });
    return treeOption;
  }

  async componentWillMount() {
    const { data } = this.props;
    //  判断后置表达式类型 获取树
    await this.fetchTree(data.expressionType || '1');
  }

  @autobind
  async changeTag(key) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      behaviorLabelId: undefined
    });
    await this.fetchTree(key);
  }

  /**
   * 获取树
   * @param {*} expressionType
   */
  async fetchTree(expressionType) {
    const { fetchTagTree } = this.props;
    //  1 不良行为 2 交易类型
    const data = await fetchTagTree(expressionType);
    const treeOption = this.fixTree(data);
    this.setState({ treeOption });
  }

  @autobind
  changeObject(key) {
    const { rearExpressionOption } = this.state;
    const _rearExpressionOption = rearExpressionOption.map(item => {
      if (item.key.includes('.')) {
        item.key = `#${key}.${item.key.split('.')[1]}`;
      }
      return item;
    });
    this.setState({ rearExpressionOption: _rearExpressionOption });
  }

  render() {
    const { form, data, mode } = this.props;
    const { getFieldDecorator } = form;
    const { treeOption, shallText, enableOption } = this.state;
    const { expressionTypeOption, rearExpressionOption } = this.state;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const isUpdate = mode === BILL_FORM_MODE_UPDATE;

    getFieldDecorator('id', { initialValue: data ? data.id : '' });
    getFieldDecorator('keywordId', {
      initialValue: data ? data.keywordId : undefined
    });
    getFieldDecorator('mappingId', {
      initialValue: data ? data.mappingId : undefined
    });

    return (
      <Form className="form-bill">
        <FormItem {...defaultItemProps} label="数据项">
          {getFieldDecorator('keyword', {
            initialValue: data ? data.keyword : '',
            rules: [
              {
                required: true,
                message: '请输入数据项'
              }
            ]
          })(
            <Input
              placeholder="输入数据项"
              autoComplete="off"
              disabled={isUpdate}
            />
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="后置表达式分类">
          {getFieldDecorator('expressionType', {
            initialValue:
              data && data.expressionType
                ? data.expressionType.toString()
                : '1',
            rules: [
              {
                required: true,
                message: '请选择类型'
              }
            ]
          })(
            <Select
              onChange={value => {
                this.changeTag(value);
              }}
            >
              {expressionTypeOption.map(item => {
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
          {getFieldDecorator('behaviorLabelId', {
            initialValue:
              data && data.behaviorLabelId
                ? data.behaviorLabelId.toString()
                : undefined,
            rules: [
              {
                required: true,
                message: '请选择标签'
              }
            ]
          })(treeOption)}
        </FormItem>
        <FormItem {...defaultItemProps} label="后置表达式">
          {getFieldDecorator('expression', {
            initialValue:
              data && (data.expression || data.expression == '')
                ? data.expression
                : rearExpressionOption[0].key
          })(
            <Select
              onChange={value => {
                this.setState({ shallText: value == '自定义' });
              }}
            >
              {rearExpressionOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        {shallText ? (
          <FormItem {...defaultItemProps} label=" ">
            {getFieldDecorator('rearExpressionText', {
              initialValue: data ? data.rearExpressionText : undefined,
              rules: []
            })(<TextArea row={4} placeholder="请输入后置表达式" />)}
          </FormItem>
        ) : (
          undefined
        )}
        {isUpdate ? (
          <FormItem {...defaultItemProps} label="入库数据状态">
            {getFieldDecorator('enabled', {
              initialValue:
                data && data.enabled ? data.enabled.toString() : 'true',
              rules: [
                {
                  required: true,
                  message: '请选择状态'
                }
              ]
            })(
              <Select>
                {enableOption.map(item => {
                  return (
                    <Option value={item.key} key={item.key}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        ) : (
          undefined
        )}
      </Form>
    );
  }
}

export default Form.create()(BillForm);
