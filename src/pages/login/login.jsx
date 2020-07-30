import React from 'react'
import { Redirect } from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { reqLogin } from '../../api/index'
import { connect } from 'react-redux'
import { setIsLogin, setUserName } from '../../store/actionCreators.js'

/**
 * 登入路由组件
 */
class Login extends React.Component {
  onFinish = (event) => {
    this.refs.form
      .validateFields()
      .then(async (values) => {
        let { username, password } = values

        let res = await reqLogin({ username, password })
        let { status, msg } = res
        if (status === 0) {
          message.success('登入成功')
          sessionStorage.setItem('__config_center_token', 'true')
          sessionStorage.setItem('username', username)
          this.props.setIsLogin(true)
          this.props.setUserName(username)
          //  跳转管理页面
          this.props.history.replace('/')
        } else {
          message.error(msg)
        }
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
    const user = this.props.username
    console.log(user)
    if (user) {
      return <Redirect to="/" />
    }

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
const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsLogin(isLogin) {
      console.log(isLogin)
      const action = setIsLogin(isLogin)
      dispatch(action)
    },
    setUserName(username) {
      console.log(username)
      const action = setUserName(username)
      dispatch(action)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
