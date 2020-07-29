import Admin from '../pages/admin/admin'
import Login from '../pages/login/login'

let routes = [
  {
    path: "/",
    component: Admin,
    exact: true,
    auth: true
  },
  {
    path: "/login",
    component: Login
  },
  // {
  //   path: "/user",
  //   component: User,
  //   routes: [
  //     {
  //       path: "/user/",
  //       component: UserList
  //     }, {
  //       path: "/user/add",
  //       component: UserAdd
  //     }
  //   ]
  // },
  // {
  //   path: "/news",
  //   component: News
  // }
]
export default routes;