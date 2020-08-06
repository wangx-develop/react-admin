import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
// import ProductHome from './home'
// import ProductAddUpdate from './add-update'
// import ProductDetail from './detail'
import './product.less'

/**
 * 商品路由
 */
class Product extends Component {
  render() {
    return (
      <Switch>
        {this.props.routes.map((route, key) => {
          if (route.exact) {
            return (
              <Route
                key={key}
                exact
                path={route.path}
                render={(props) => (
                  <route.component {...props} routes={route.routes} />
                )}
              />
            )
          } else {
            return (
              <Route
                key={key}
                path={route.path}
                render={(props) => (
                  <route.component {...props} routes={route.routes} />
                )}
              />
            )
          }
        })}
        <Redirect to="/product"></Redirect>
      </Switch>
    )
  }
}

export default Product
