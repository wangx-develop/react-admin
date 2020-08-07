import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import routes from './routes/index'

// import Login from './pages/login/login'
// import Admin from './pages/admin/admin'

export default class App extends React.Component {
  render() {
    return (
      <Router>
        {/* <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch> */}
        {routes.map((route, key) => {
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
      </Router>
    )
  }
}
