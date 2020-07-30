import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import logo from '../../assets/images/logo.png'
import { Menu } from 'antd'
// import {
//   AppstoreOutlined,
//   MenuUnfoldOutlined,
//   PieChartOutlined,
//   MailOutlined,
// } from '@ant-design/icons'

import menuList from '../../config/menuConfig'

const { SubMenu } = Menu

class LeftNav extends Component {
  /**
   * map实现
   */
  getMenuNodes_map = (menuList) => {
    //得到当前理由请求路径
    const path = this.props.location.pathname
    return menuList.map((Item) => {
      if (!Item.children) {
        return (
          <Menu.Item key={Item.key} icon={<Item.icon />}>
            <Link to={Item.key}>{Item.title}</Link>
          </Menu.Item>
        )
      } else {
        // 查找与当前请求路径匹配的子Item
        console.log(path)
        console.log(Item.children)
        const cItem = Item.children.find((cItem) => cItem.key === path)

        if (cItem) {
          this.openKey = Item.key
        }
        console.log('1')
        return (
          <SubMenu key={Item.key} icon={<Item.icon />} title={Item.title}>
            {this.getMenuNodes_map(Item.children)}
          </SubMenu>
        )
      }
    })
  }

  /**
   * reduce实现
   */
  getMenuNodes = (menuList) => {
    return menuList.reduce((pre, Item) => {
      if (!Item.children) {
        //向pre中添加<Menu.Item>
        pre.push(() => (
          <Menu.Item key={Item.key} icon={<Item.icon />}>
            <Link to={Item.key}>{Item.title}</Link>
          </Menu.Item>
        ))
      } else {
        //或者添加<SubMenu/>
        pre.push(() => (
          <SubMenu key={Item.key} icon={<Item.icon />} title={Item.title}>
            {this.getMenuNodes(Item.children)}
          </SubMenu>
        ))
      }

      return pre
    }, [])
  }

  /*第一次render之前执行一次
  为第一个render()准备数据（必须同步的）
   */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes_map(menuList)
  }

  render() {
    //得到当前理由请求路径
    const path = this.props.location.pathname

    //得到需要打开的单项的key
    const openKey = this.openKey

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
            <Link to="/home">首页</Link>
          </Menu.Item>

          <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
            <Menu.Item key="/category" icon={<AppstoreOutlined />}>
              <Link to="/category">品类管理</Link>
            </Menu.Item>
            <Menu.Item key="/product" icon={<MenuUnfoldOutlined />}>
              <Link to="/product">商品管理</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/user" icon={<PieChartOutlined />}>
            <Link to="/user">用户管理 </Link>
          </Menu.Item>

          <Menu.Item key="/role" icon={<PieChartOutlined />}>
            <Link to="/role">角色管理</Link>
          </Menu.Item> */}
          {/* {menuList.map((Item) => {
            if (Item.children) {
              return (
                <SubMenu key={Item.key} icon={<Item.icon />} title={Item.title}>
                  {Item.children.map((children) => {
                    return (
                      <Menu.Item key={children.key} icon={<children.icon />}>
                        <Link to={children.key}>{children.title}</Link>
                      </Menu.Item>
                    )
                  })}
                </SubMenu>
              )
            } else {
              return (
                <Menu.Item key={Item.key} icon={<Item.icon />}>
                  <Link to={Item.key}>{Item.title}</Link>
                </Menu.Item>
              )
            }
          })} */}
          {this.menuNodes}
          {/* {this.getMenuNodes(menuList)} */}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)
