import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { connect } from 'react-redux'
import { formateDate } from '../../utils/dateUtils'

/**
 * 角色路由
 */
class Role extends Component {
  state = {
    roles: [], //所有觉得的列表
    role: {}, //选中的role
    isShowAdd: false, //是否显示添加界面
    isShowAuth: false, //是否显示设置权限界面
  }
  constructor(props) {
    super(props)
    this.addForm = React.createRef()
    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time),
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => formateDate(auth_time),
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  onRow = (role) => {
    return {
      // 点击行
      onClick: (event) => {
        this.setState({ role })
      },
    }
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      message.success('获取角色列表成功')
      const roles = result.data
      this.setState({ roles })
    } else {
      message.error('获取角色列表失败')
    }
  }

  /**
   * 添加角色
   */
  addRole = async () => {
    try {
      // 隐藏确认框
      this.setState({ isShowAdd: false })
      //搜集输入数据
      const validateFields = this.addForm.current.form.current.validateFields
      const value = await validateFields()
      const { roleName } = value

      this.addForm.current.form.current.resetFields()

      //请求添加
      const result = await reqAddRole(roleName)
      if (result.status === 0) {
        //根据结果提示更新列表显示
        message.success('添加角色成功')
        const role = result.data
        // let roles = [...this.state.roles]
        // roles = roles.push(role)
        // this.setState({ roles })
        //更新roles状态：基于原本的状态数据更新
        this.setState((state) => ({
          roles: [...this.state.roles, role],
        }))
        // this.getRoles()
      } else {
        message.error('添加角色失败')
      }

      //根据结果提示更新列表显示
    } catch (error) {
      message.error(error.errorFields[0].errors[0])
    }
  }

  /**
   * 更新角色
   */
  UpdateRole = async () => {
    // 获取最新的数据
    this.setState({
      isShowAuth: false,
    })
    const role = this.state.role
    const menus = this.auth.current.getMenus()

    role.menus = menus
    role.auth_name = this.props.username
    console.log(role)
    //请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success('设置角色权限成功')
      // this.getRoles()
      this.setState({
        roles: [...this.state.roles],
      })
    } else {
      message.error('设置角色权限失败')
    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state

    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        &nbsp;&nbsp;
        <Button
          disabled={!role._id}
          type="primary"
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }}
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.addForm.current.form.current.resetFields()
          }}
        >
          <AddForm ref={this.addForm} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.UpdateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

export default connect(mapStateToProps, null)(Role)
