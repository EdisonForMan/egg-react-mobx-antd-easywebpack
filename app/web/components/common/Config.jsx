import React, { Component } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Divider,
  Tooltip,
  AutoComplete,
  Card
} from 'antd';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { Option } = AutoComplete;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

// 配置信息表单项
class ConfigItem extends Component {
  static propTypes = {
    getFieldDecorator: PropTypes.func.isRequired,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isDetail: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.object]),
    modalData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };
  render() {
    const {
      getFieldDecorator,
      index,
      isDetail,
      data,
      modalData,
      moduleList
    } = this.props;
    const isDisabled =
      (modalData &&
        !modalData.auditor &&
        modalData.stauts == 6 &&
        modalData.type == 6) ||
      false;

    return (
      <Card key={index} bordered>
        <Row type="flex" align="middle">
          <Col span={11}>
            <FormItem {...formItemLayout} label="module">
              {getFieldDecorator(`module-${index}`, {
                initialValue: data.module,
                rules: [
                  {
                    required: true,
                    message: '请输入module'
                  }
                ]
              })(
                <AutoComplete disabled={isDetail} placeholder="module">
                  {moduleList.map(value => (
                    <Option key={value}>{value}</Option>
                  ))}
                </AutoComplete>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="value">
              {getFieldDecorator(`value-${index}`, {
                initialValue: data.value
              })(
                <Input
                  disabled={isDetail && !isDisabled}
                  placeholder="请输入value"
                />
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label="key">
              {getFieldDecorator(`key-${index}`, {
                initialValue: data.key,
                rules: [
                  {
                    required: true,
                    message: '请输入key'
                  }
                ]
              })(<Input disabled={isDetail} placeholder="key" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="note">
              {getFieldDecorator(`description-${index}`, {
                initialValue: data.description
              })(<Input disabled={isDetail} placeholder="请输入note" />)}
            </FormItem>
          </Col>
          <Col span={2}>
            <Tooltip title="删除配置项">
              <Button
                type="danger"
                shape="circle"
                icon="minus"
                size="small"
                onClick={() => this.props.delConfig(index)}
                disabled={isDetail}
                style={{
                  marginBottom: '25px',
                  marginLeft: '10px'
                }}
              />
            </Tooltip>
          </Col>
        </Row>
      </Card>
    );
  }
}

@inject(stores => ({
  store: stores.publicInfoStore
}))
@observer
export default class Config extends Component {
  state = {
    count: 0,
    configList: {},
    moduleList: []
  };
  static propTypes = {
    isDetail: PropTypes.bool,
    dataSource: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    form: PropTypes.object.isRequired
  };
  componentDidMount() {
    const { dataSource, projectId } = this.props;
    if (dataSource && Object.keys(dataSource).length > 0) {
      const { diamondConfigList } = dataSource;

      this.renderConfig(diamondConfigList.length, diamondConfigList);
    }

    if (!dataSource || JSON.stringify(dataSource) === '{}' || projectId) {
      this.queryCreateModuleList(projectId);
    } else {
      this.queryModuleList(dataSource);
    }
  }
  // 项目id 更新时
  componentWillReceiveProps(prev) {
    const { dataSource } = this.props;
    if (!prev.projectId) {
      return;
    }

    if (!dataSource.projectId) {
      this.queryCreateModuleList(prev.projectId);
    } else if (dataSource.projectId != prev.projectId) {
      this.queryModuleList({ id: dataSource.id, projectId: prev.projectId });
    }
  }
  // 新增时获取module list
  queryCreateModuleList = async projectId => {
    if (!projectId) {
      return;
    }
    const { data } = await this.props.store.queryCreateModuleList(projectId);

    this.setState({ moduleList: data });
  };
  // 编辑时获取 module list
  queryModuleList = async ({ id, projectId }) => {
    const { data } = await this.props.store.queryModuleList(id, projectId);

    this.setState({ moduleList: data });
  };
  // 新增配置项
  addConfig = () => this.renderConfig(this.state.count + 1);
  // 使用 omit 方法删除对象的属性
  delConfig = index => {
    const { configList } = this.state;
    const newList = _.omit(configList, [index]);

    this.setState({
      configList: newList,
      count: this.state.count - 1
    });
  };
  // 渲染配置项
  renderConfig = (number, dataList) => {
    const { count, configList, moduleList } = this.state;
    const { form, isDetail, dataSource } = this.props;

    if (dataList) {
      dataList.forEach(value => {
        const index = value.key + value.module + value.description;
        configList[index] = (
          <ConfigItem
            getFieldDecorator={form.getFieldDecorator}
            isDetail={isDetail}
            data={value}
            key={index}
            index={index}
            delConfig={this.delConfig}
            modalData={dataSource}
            moduleList={moduleList}
          />
        );
      });
    } else {
      const length = number || count;
      for (let i = 0; i < length; i++) {
        configList[i] = (
          <ConfigItem
            getFieldDecorator={form.getFieldDecorator}
            isDetail={isDetail}
            data={{}}
            key={i}
            index={i}
            delConfig={this.delConfig}
            modalData={dataSource}
            moduleList={moduleList}
          />
        );
      }
      this.setState({ count: length });
    }

    this.setState({ configList });
  };
  render() {
    const { isDetail } = this.props;
    const { configList } = this.state;

    return (
      <div>
        {!isDetail ? (
          <Divider dashed orientation="left">
            添加配置项
            <Tooltip title="添加配置项">
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                size="small"
                style={{ marginLeft: '15px' }}
                onClick={this.addConfig}
                disabled={isDetail}
              />
            </Tooltip>
          </Divider>
        ) : (
          <Divider dashed orientation="left">
            配置项
          </Divider>
        )}
        <Row>
          {_.map(configList, (value, key) => (
            <Col span={24} key={key} style={{ marginBottom: '8px' }}>
              {value}
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}
