import React, { PureComponent } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

/**
 * 添加用户和修改用户
 */
const Item = Form.Item
const Option = Select.Option

// 添加分类的form组件
class UserForm extends PureComponent {
  state = {
    roleName: '',
  }
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

  static propTypes = {
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  }

  render() {
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label的宽度
      wrapperCol: { span: 15 }, //指定右侧包裹的宽度
    }

    const { roles } = this.props
    const user = this.props.user || {}

    return (
      <Form
        key={user ? user._id : ''}
        {...formItemLayout}
        ref={this.form}
        initialValues={user}
      >
        <Item
          name="username"
          label="用户名称"
          rules={[{ required: true, message: '请输入用户名称!' }]}
        >
          <Input placeholder="请输入用户名称"></Input>
        </Item>
        {user._id ? null : (
          <Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input type="password" placeholder="请输入密码"></Input>
          </Item>
        )}

        <Item
          name="phone"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号!' }]}
        >
          <Input placeholder="请输入手机号"></Input>
        </Item>
        <Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱!' }]}
        >
          <Input placeholder="请输入邮箱"></Input>
        </Item>
        <Item
          name="role_id"
          label="角色"
          rules={[{ required: true, message: '请输入用户名称!' }]}
        >
          <Select placeholder="请选择角色">
            {roles.map((role) => {
              return (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              )
            })}
          </Select>
        </Item>
      </Form>
    )
  }
}

export default UserForm
