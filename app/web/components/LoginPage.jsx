import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, Form, Icon, Input, Button, message } from 'antd';
import bgHomeImage from '../images/bg.png';

const FormItem = Form.Item;
const { Header, Footer, Content } = Layout;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
};

/**
 * 获取参数from
 * @param {*} name
 */
const getQueryString = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return '/home';
};

@inject(stores => ({
  store: stores.userStore
}))
@observer
class NormalLoginForm extends Component {
  state = {
    loading: false
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { store, form } = this.props;
    const params = form.getFieldsValue();
    if (!(params.userName && params.password)) {
      return false;
    }
    this.setState({ loading: true });
    try {
      const result = await store.login(form.getFieldsValue());
      if (result) {
        message.info('登录成功');
        window.location.replace(getQueryString('from'));
      }
    } finally {
      this.setState({ loading: false });
    }
    return false;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="title">Content Manage System</div>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名'
              }
            ]
          })(
            <Input
              className="input"
              addonBefore={
                <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              placeholder="email/account"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入登录密码'
              }
            ]
          })(
            <Input
              className="input"
              addonBefore={
                <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              type="password"
              placeholder="password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Sign In
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

@inject('userStore')
@observer
class LoginPage extends Component {
  render() {
    return (
      <Layout
        style={{ height: '100%', overflow: 'hidden' }}
        className="login-page"
      >
        <Header>
          <div className="logo" />
        </Header>
        <Content>
          <img src={bgHomeImage} alt="" />
          <WrappedNormalLoginForm history={this.props.history} />
        </Content>
        <Footer>
          Copyright © Treefinance All Rights Reserved 浙ICP备 15026886号
          浙公网安备33010502000531号
        </Footer>
      </Layout>
    );
  }
}

export default LoginPage;
