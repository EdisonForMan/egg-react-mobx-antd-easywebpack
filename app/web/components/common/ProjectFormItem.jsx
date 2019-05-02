import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Form, Select } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

@inject(stores => ({
  store: stores.publicInfoStore,
  userStore: stores.userStore
}))
@observer
export default class ProjectFormItem extends Component {
  state = {
    optionList: []
  };
  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    initialValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    form: PropTypes.object,
    formItemLayout: PropTypes.object
  };
  componentDidMount() {
    const optionList = toJS(this.props.store.projectList);
    if (optionList.length === 0) {
      this.queryProject();
    } else {
      this.setState({ optionList });
    }
  }
  queryProject = async () => {
    const { currentUser } = this.props.userStore;
    const result = await this.props.store.queryProject(currentUser.id);

    this.setState({
      optionList: result
    });
  };
  render() {
    const {
      label,
      name,
      initialValue,
      placeholder,
      disabled,
      required,
      form,
      formItemLayout
    } = this.props;
    const { getFieldDecorator } = form;

    const itemLayout = formItemLayout || layout;

    return (
      <FormItem {...formItemLayout} label={label || '项目'}>
        {getFieldDecorator(name, {
          initialValue,
          rules: [
            {
              required,
              message: placeholder || '请选择项目'
            }
          ]
        })(
          <Select
            allowClear
            showSearch
            disabled={disabled}
            placeholder={placeholder || '请选择项目'}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.optionList.map(value => (
              <Option key={value.id} value={value.id}>
                {value.projectEngName}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    );
  }
}
