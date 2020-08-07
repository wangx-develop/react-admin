import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { formateDate } from '../../utils/dateUtils'
import LinkButtom from '../../components/linkButtom'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'

/**
 * 用户路由
 */
class User extends Component {
  state = {
    users: [], //所有用户列表
    roles: [], //所有角色列表
    isShow: false, //是否显示确认框
  }

  constructor(props) {
    super(props)
    this.userForm = React.createRef()
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate,
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        // render: (role_id) =>
        //   this.state.roles.find((role) => role._id === role_id).name,
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButtom onClick={() => this.showUpdate(user)}>修改</LinkButtom>
            <LinkButtom onClick={() => this.deleteUser(user)}>删除</LinkButtom>
          </span>
        ),
      },
    ]
  }

  /**
   * 根据role的数组，生成包含所有角色名的对象{_id的值:角色名}
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})

    //保存
    this.roleNames = roleNames
  }

  /**
   * 添加或更新用户
   */
  addOrUpdateUser = async () => {
    try {
      this.setState({ isShow: false })
      const validateFields = this.userForm.current.form.current.validateFields
      const user = await validateFields()
      //如果是更新，需要给user指定_id属性
      if (this.user) {
        user._id = this.user._id
      }
      console.log(user)

      this.userForm.current.form.current.resetFields()

      // 提交请求
      const result = await reqAddOrUpdateUser(user)
      if (result.status === 0) {
        message.success(`{${this.user ? '修改' : '添加'}用户成功`)
        this.getUsers()
      } else {
        message.error(`{${this.user ? '修改' : '添加'}用户失败`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 获取用户列表
   */
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles,
      })
    }
  }

  /**
   * 删除指定用户
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `是否确认删除${user.username}?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        }
      },
    })
  }

  /**
  显示添加界面
   */
  showAdd = () => {
    this.user = null
    this.setState({ isShow: true })
  }

  //显示修改界面
  showUpdate = (user) => {
    this.user = user
    this.setState({
      isShow: true,
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    )
    const { users, isShow, roles } = this.state
    const user = this.user

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={user ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.userForm.current.form.current.resetFields()
            this.setState({ isShow: false })
          }}
        >
          <UserForm ref={this.userForm} roles={roles} user={user} />
        </Modal>
      </Card>
    )
  }
}

export default User
