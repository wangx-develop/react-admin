import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item

// 添加分类的form组件
class AuthForm extends Component {
  state = {
    treeData: [], //树的数据
    checkedKeys: [], //选中的数组
  }

  static propTypes = {
    role: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { menus } = this.props.role
    this.state = {
      checkedKeys: menus,
    }
  }

  setInput = (e) => {
    e.persist()
    this.setState({ roleName: e.target.value })
  }

  // 选中某个node时的回调
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys })
  }

  getTreeNodes = (treeData, menuList) => {
    menuList.map((item, key) => {
      treeData.push({
        title: item.title,
        key: item.key,
      })
      if (item.children) {
        let subtreeData = []
        this.getTreeNodes(subtreeData, item.children)
        treeData[key].children = subtreeData
      }
    })
  }

  /**为父组件提交获取最新的menus */
  getMenus = () => {
    return this.state.checkedKeys
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.role !== nextProps.role) {

    // }
    this.setState({ checkedKeys: nextProps.role.menus })
  }

  componentWillMount() {
    let data = []
    this.getTreeNodes(data, menuList)

    const treeData = [
      {
        title: '平台权限',
        key: '0-0',
        children: data,
      },
    ]

    this.setState({ treeData })
  }

  render() {
    const { role } = this.props
    const { treeData, checkedKeys } = this.state
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label的宽度
      wrapperCol: { span: 15 }, //指定右侧包裹的宽度
    }

    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        />
      </div>
    )
  }
}

export default AuthForm
