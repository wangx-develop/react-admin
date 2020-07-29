import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import Login from './pages/login/login'
// import Admin from './pages/admin/admin'
import routes from './router/index'

export default class App extends React.Component {
  render () {
    return (
      <Router>
        {/* <Switch>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/" component={Admin}></Route>
        </Switch> */}
        <Switch>
          {routes.map((route, key) => {
            if (route.exact) {
              return (
                <Route
                  exact
                  key={key}
                  path={route.path}
                  render={props => {
                    return (
                      <route.component {...props} routes={route.routes} />
                    )
                  }}
                />
              )
            } else {
              return (
                <Route
                  key={key}
                  path={route.path}
                  render={props => {
                    return (
                      <route.component {...props} routes={route.routes} />
                    )
                  }}
                />
              )
            }
          })}
        </Switch>

      </Router>
    )
  }
}
