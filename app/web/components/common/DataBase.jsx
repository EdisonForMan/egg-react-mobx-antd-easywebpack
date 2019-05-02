import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Form, Select, Input, Tabs } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

class TabsSQLList extends Component {
  static propTypes = {
    getFieldDecorator: PropTypes.func,
    index: PropTypes.string
  };
  getInitialValue = (type, name) => {
    const { dataSource, index } = this.props;

    if (dataSource && index) {
      return dataSource[type][index][name];
    }
    return undefined;
  };
  render() {
    const { getFieldDecorator, index, isDetail } = this.props;

    return (
      <Tabs type="card">
        <TabPane tab="dml" key="dml">
          <FormItem
            {...formItemLayout}
            label="执行sql"
            key={`executeSql-dml-${index}`}
          >
            {getFieldDecorator(`executeSql-dml-${index}`, {
              initialValue: this.getInitialValue('executeSql', 'dml')
            })(
              <TextArea
                row={4}
                disabled={isDetail}
                placeholder="请输入执行sql"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="回滚sql"
            key={`rollbackSql-dml-${index}`}
          >
            {getFieldDecorator(`rollbackSql-dml-${index}`, {
              initialValue: this.getInitialValue('rollbackSql', 'dml')
            })(
              <TextArea
                row={4}
                disabled={isDetail}
                placeholder="请输入回滚sql"
              />
            )}
          </FormItem>
        </TabPane>
        <TabPane tab="ddl" key="ddl">
          <FormItem
            {...formItemLayout}
            label="执行sql"
            key={`executeSql-ddl-${index}`}
          >
            {getFieldDecorator(`executeSql-ddl-${index}`, {
              initialValue: this.getInitialValue('executeSql', 'ddl')
            })(
              <TextArea
                row={4}
                disabled={isDetail}
                placeholder="请输入执行sql"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="回滚sql"
            key={`rollbackSql-ddl-${index}`}
          >
            {getFieldDecorator(`rollbackSql-ddl-${index}`, {
              initialValue: this.getInitialValue('rollbackSql', 'ddl')
            })(
              <TextArea
                row={4}
                disabled={isDetail}
                placeholder="请输入回滚sql"
              />
            )}
          </FormItem>
        </TabPane>
      </Tabs>
    );
  }
}

@inject(stores => ({
  store: stores.publicInfoStore
}))
@observer
export default class DataBase extends Component {
  static propTypes = {
    form: PropTypes.object,
    isDetail: PropTypes.bool,
    type: PropTypes.string,
    dataSource: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  };
  state = {
    activeKey: '',
    panes: [],
    selectedSQL: [],
    options: []
  };
  componentDidMount() {
    const { dataBaseList } = this.props.store;
    const list = toJS(dataBaseList);

    if (list && list.length > 0) {
      this.setState({ options: list });
    } else {
      this.queryDataBase();
    }

    const { dataSource } = this.props;
    if (dataSource && dataSource.executeSql && dataSource.rollbackSql) {
      const keys = Object.keys(dataSource.executeSql);
      keys &&
        keys.forEach(value => {
          this.renderTabPane(value);
        });
    }
  }
  queryDataBase = async () => {
    const data = await this.props.store.queryDataBase();
    this.setState({
      options: data
    });
  };
  editTabs = (targetKey, action) => this[action](targetKey);
  changeTabs = activeKey => this.setState({ activeKey });
  // 删除sql 并高亮展示最后一项
  remove = value => {
    const { panes, selectedSQL } = this.state;

    const newPanes = _.filter(panes, item => item.key !== value);
    const newSQL = selectedSQL.filter(item => item !== value);
    const last = newSQL[newSQL.length - 1];

    this.setDatabaseField(newSQL);
    this.setState({ panes: newPanes, selectedSQL: newSQL, activeKey: last });
  };
  add = value => this.renderTabPane(value, 'add');
  renderTabPane = (value, handleType) => {
    const { getFieldDecorator } = this.props.form;
    const { panes, selectedSQL } = this.state;
    const { isDetail, dataSource } = this.props;

    const componentKeys = {
      getFieldDecorator,
      index: value,
      isDetail
    };
    if (handleType !== 'add') {
      componentKeys.dataSource = dataSource;
    }

    const content = <TabsSQLList {...componentKeys} />;

    // 添加数据库tab
    panes.push({
      title: value,
      content,
      key: value
    });
    // 将选择的数据库值保存
    selectedSQL.push(value);

    this.setDatabaseField(selectedSQL);

    this.setState({ panes, activeKey: value, selectedSQL });
  };
  // 赋值选中的数据库名字
  setDatabaseField = list => {
    const { setFieldsValue } = this.props.form;

    const selectedDataBase = list.join('::');

    setFieldsValue({
      selectedDataBase
    });
  };
  render() {
    const { activeKey, panes, selectedSQL, options } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { isDetail } = this.props;

    return [
      <FormItem {...formItemLayout} label="数据库" key="dataBase">
        <Tabs
          hideAdd
          type="editable-card"
          onEdit={this.editTabs}
          onChange={this.changeTabs}
          activeKey={activeKey}
          tabBarExtraContent={
            <Select
              showSearch
              size="small"
              placeholder="请选择项目"
              style={{ width: '150px' }}
              onSelect={this.add}
              value={undefined}
              disabled={isDetail}
            >
              {options.map(name => (
                <Option key={name} disabled={selectedSQL.includes(name)}>
                  {name}
                </Option>
              ))}
            </Select>
          }
        >
          {panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      </FormItem>,
      <FormItem
        {...formItemLayout}
        label="选中的数据库"
        key="selectedDataBase"
        style={{ display: 'none' }}
      >
        {getFieldDecorator('selectedDataBase')(<Input />)}
      </FormItem>
    ];
  }
}
