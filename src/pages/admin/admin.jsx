import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import { Redirect, Route, Switch } from 'react-router-dom'

// import Home from '../home/home'
// import Category from '../category/category'
// import Product from '../product/product'
// import Role from '../role/role'
// import User from '../user/user'
// import Bar from '../charts/bar'
// import Line from '../charts/line'
// import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout

/**
 * 后台管理的路由组件
 */
class Admin extends Component {
  render() {
    const user = this.props.username
    // 如果内存没有存储user ==> 当前没有登陆
    if (!user) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to="/login" />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: 20, backgroundColor: '#fff' }}>
            {/* <Switch>
              <Redirect from="/" exact to="/home" />
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/user" component={User} />
              <Route path="/role" component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/charts/line" component={Line} />
            </Switch> */}
            <Switch>
              <Redirect from="/" exact to="/home" />
              {this.props.routes.map((route, key) => {
                return (
                  <Route
                    key={key}
                    path={route.path}
                    render={(props) => (
                      <route.component {...props} routes={route.routes} />
                    )}
                  />
                )
              })}
            </Switch>
          </Content>

          <Footer style={{ textAlign: 'center', color: '#cccccc' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

export default connect(mapStateToProps, null)(Admin)
