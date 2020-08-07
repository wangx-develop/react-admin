import Login from '../pages/login/login'
import Admin from '../pages/admin/admin'
import User from '../pages/user/user'
import Product from '../pages/product/product'
import Home from '../pages/home/home'
import Category from '../pages/category/category'

import Role from '../pages/role/role'

import Bar from '../pages/charts/bar'
import Line from '../pages/charts/line'
import Pie from '../pages/charts/pie'

import ProductHome from '../pages/product/home'
import ProductAddUpdate from '../pages/product/add-update'
import ProductDetail from '../pages/product/detail'

let routes = [
  {
    path: '/',
    component: Admin,
    exact: true,
    routes: [
      {
        path: '/user',
        component: User,
      },
      {
        path: '/product',
        component: Product,
        routes: [
          {
            path: '/product',
            component: ProductHome,
            exact: true,
          },
          {
            path: '/product/addupdate',
            component: ProductAddUpdate,
          },
          {
            path: '/product/detail',
            component: ProductDetail,
          },
        ],
      },
      {
        path: '/home',
        component: Home,
      },
      {
        path: '/category',
        component: Category,
      },
      {
        path: '/role',
        component: Role,
      },
      {
        path: '/charts/bar',
        component: Bar,
      },
      {
        path: '/charts/line',
        component: Line,
      },
      {
        path: '/charts/pie',
        component: Pie,
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
]

export default routes
