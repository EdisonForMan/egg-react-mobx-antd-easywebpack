import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select, TreeSelect } from 'antd';
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
import autobind from 'autobind-decorator';
const { Option } = Select;
const { Item: FormItem } = Form;
export const ECOMMERCE_FORM_HASH = Symbol('ecommerce');
export const ECOMMERCE_FORM_MODE_ADD = 'add';
export const ECOMMERCE_FORM_MODE_UPDATE = 'update';
export const ECOMMERCE_FORM_MODE_BATCH = 'batch';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

@observer
class EcommerceForm extends Component {
  state = {
    //  树
    treeOption: <TreeSelect />,
    shallText: false,
    shallTree: true,
    _express: '1',
    //  状态
    expressionTypeOption: [
      { key: '1', title: '不良行为' },
      { key: '2', title: '交易类型' },
      { key: '3', title: '白名单' }
    ],
    behaviorLabelObjectOption: [
      { key: 'otherSide', title: 'otherSide' },
      { key: 'title', title: 'title' }
    ],
    rearExpressionOption: [
      {
        key: '#otherSide.contains(#keyword)',
        title: '包含'
      },
      { key: '#otherSide.equals(#keyword)', title: '等于' },
      { key: '#otherSide.startsWith(#keyword)', title: '作为开头' },
      { key: '#otherSide.endsWith(#keyword)', title: '作为结尾' },
      { key: '', title: '空' },
      { key: '自定义', title: '自定义' }
    ],
    enableOption: [
      { key: 'true', title: '生效' },
      { key: 'false', title: '失效' }
    ]
  };

  async componentWillMount() {
    const { expressionTypeOption, behaviorLabelObjectOption } = this.state;
    const { data } = this.props;
    //  判断后置表达式类型 获取树
    let _express = '1';
    if (data.rearExpressionCategory) {
      expressionTypeOption.map(item => {
        if (
          item.title == data.rearExpressionCategory ||
          item.key == data.rearExpressionCategory
        ) {
          _express = item.key;
        }
      });
    }
    //  后置表达式选项value
    let _behavior = 'otherSide';
    if (data.rearExpression) {
      behaviorLabelObjectOption.map(item => {
        if (data.rearExpression.includes(item.key)) {
          _behavior = item.key;
          this.changeObject(item.key);
        }
      });
    }
    if (_express == '3') {
      this.setState({ shallTree: false, _express, _behavior });
    } else {
      this.setState({ _express, _behavior });
    }
    await this.fetchTree(_express);
  }

  @autobind
  async changeTag(key) {
    const { setFieldsValue } = this.props.form;
    if (key == 3) {
      this.setState({ shallTree: false });
    } else {
      await this.fetchTree(key);
      setFieldsValue({
        labelId: undefined
      });
      this.setState({ shallTree: true });
    }
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
    const { form, data, mode, status } = this.props;
    const { getFieldDecorator } = form;
    const {
      treeOption,
      shallText,
      enableOption,
      shallTree,
      _express,
      _behavior
    } = this.state;
    const {
      expressionTypeOption,
      behaviorLabelObjectOption,
      rearExpressionOption
    } = this.state;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false
    };
    const isUpdate = mode === ECOMMERCE_FORM_MODE_UPDATE;
    const isBatch = mode === ECOMMERCE_FORM_MODE_BATCH;

    getFieldDecorator('id', { initialValue: data ? data.id : '' });
    getFieldDecorator('keywordId', {
      initialValue: data ? data.keywordId : undefined
    });
    getFieldDecorator('mappingId', {
      initialValue: data ? data.mappingId : undefined
    });

    return (
      <Form className="form-ecommerce">
        {!isBatch ? (
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
        ) : (
          undefined
        )}
        <FormItem {...defaultItemProps} label="后置表达式分类">
          {getFieldDecorator('expressionType', {
            initialValue: _express,
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
        {shallTree ? (
          <FormItem {...defaultItemProps} label="行为标签">
            {getFieldDecorator('labelId', {
              initialValue: data.lableId ? data.lableId.toString() : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择标签'
                }
              ]
            })(treeOption)}
          </FormItem>
        ) : (
          undefined
        )}
        <FormItem {...defaultItemProps} label="操作对象">
          {getFieldDecorator('behaviorLabelObject', {
            initialValue: _behavior,
            rules: [
              {
                required: true,
                message: '操作对象'
              }
            ]
          })(
            <Select
              onChange={value => {
                this.changeObject(value);
              }}
            >
              {behaviorLabelObjectOption.map(item => {
                return (
                  <Option value={item.key} key={item.key}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...defaultItemProps} label="后置表达式">
          {getFieldDecorator('rearExpression', {
            initialValue:
              data && (data.rearExpression || data.rearExpression == '')
                ? data.rearExpression
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
        {status && isUpdate ? (
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

export default Form.create()(EcommerceForm);
