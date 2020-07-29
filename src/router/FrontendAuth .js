import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import Login from '../pages/login/login'

export class FrontendAuth extends React.Component {
  render () {
    console.log("111");
    const {
      location: { pathname },
      config: { component, exact, routes } } = this.props;
    // const { component, exact } = config;
    const isLogin = sessionStorage.getItem('__config_center_token')

    // 如果该路由不用进行权限校验，登录状态下登陆页除外
    // 因为登陆后，无法跳转到登陆页
    // 这部分代码，是为了在非登陆状态下，访问不需要权限校验的路由

    // if (!config.auth && !isLogin) {
    //   return <Route exact={exact} path={pathname}
    //     render={props => {
    //       return (
    //         <component {...props} routes={routes} />
    //       )
    //     }}
    //   />
    // }

    if (isLogin) {

      // 如果是登陆状态，想要跳转到登陆，重定向到主页
      if (pathname === '/login') {
        return <Redirect to='/' />
      } else {
        console.log("登入");
        // 如果路由合法，就跳转到相应的路由
        return <Route exact={exact} path={pathname}
          render={props => {
            return (
              <component {...props} routes={routes} />
            )
          }}
        />
      }
    } else {
      console.log("未登入");
      // 非登陆状态下，当路由合法时且需要权限校验时，跳转到登陆页面，要求登陆
      return <Redirect to='/login' />
      // return <Route exact={exact} path='pathname'
      //   component={Login} />


    }
  }
}