import React from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

/**
 * 登入路由组件
 */
class Login extends React.Component {
  onFinish = (event) => {
    console.log(event.username)
    console.log(event.password)
    this.refs.form
      .validateFields()
      .then((values) => {
        console.log(values)
      })
      .catch((errorInfo) => {
        console.log('错误：' + errorInfo)
      })
  }

  /*
  自定义验证密码
  */
  validatorUser = () => ({
    validator(rule, value) {
      if (!value) {
        return Promise.reject('请输入密码')
      } else if (value.length < 4) {
        return Promise.reject('密码长度不能小于4')
      } else if (value.length > 12) {
        return Promise.reject('密码长度不能大于12')
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return Promise.reject('只允许英文数字下划线')
      }
      return Promise.resolve()
    },
  })

  render() {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登入</h2>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.onFinish}
            ref="form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, whitespace: true, message: '请输入用户名!' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名最多12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '只允许英文数字下划线' },
                // this.validatorUser,
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item name="password" rules={[this.validatorUser]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登入
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default Login
