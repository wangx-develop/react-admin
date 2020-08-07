import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

const BASE = ''

// export function reqLogin({username,password}){
//     return ajax('/login' , {username,password},'POST')
// }

/**
 * 登入
 */
export const reqLogin = ({ username, password }) =>
  ajax(BASE + '/login', { username, password }, 'POST')

/**
 * jsonp请求 天气
 */
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=苏州&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        //失败
        message.err('获取天气信息失败')
      }
    })
  })
}

/**
 * 获取分类列表
 */
export const reqCategorys = (parentId) =>
  ajax('/manage/category/list', { parentId }, 'GET')

/**
 * 获取一个分类
 */
export const reqGetCategoryName = (categoryId) =>
  ajax(BASE + '/manage/category/info', { categoryId }, 'GET')

/**
 * 添加分类
 */
export const reqAddCategorys = ({ parentId, categoryName }) =>
  ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

/**
 * 更新分类
 */
export const reqUpdateCategorys = ({ categoryId, categoryName }) =>
  ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

/**
 * 获取商品列表
 */
export const reqProducts = (pageNum, pageSize) =>
  ajax(
    BASE + '/manage/product/list',
    {
      pageNum,
      pageSize,
    },
    'GET'
  )

/**
 * 搜索商品分页列表
 */
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(
    BASE + '/manage/product/search',
    { pageNum, pageSize, [searchType]: searchName },
    'GET'
  )

/**
 * 更新商品的状态(1:在售 2:已下架)
 */
export const reqUpdateStatus = (productId, status) =>
  ajax(
    BASE + '/manage/product/updateStatus',
    {
      productId,
      status,
    },
    'POST'
  )

/**
 * 删除图片
 */
export const reqDeleteImg = (name) =>
  ajax(BASE + '/manage/img/delete', { name }, 'POST')

/**
 * 添加/更新商品
 */
export const reqAddOrUpdateProduct = (product) =>
  ajax(
    BASE + '/manage/product/' + (product._id ? 'update' : 'add'),
    product,
    'POST'
  )

/**
 * 获取所有角色的列表
 */

export const reqRoles = () => ajax(BASE + '/manage/role/list')

/**
 * 添加角色
 */
export const reqAddRole = (roleName) =>
  ajax(BASE + '/manage/role/add', { roleName }, 'POST')

/**
 * 更新角色
 */
export const reqUpdateRole = (role) =>
  ajax(BASE + '/manage/role/update', role, 'POST')

/**
 * 获取用户列表
 */
export const reqUsers = () => ajax(BASE + '/manage/user/list')

/**
 * 删除用户
 */
export const reqDeleteUser = (userId) =>
  ajax(BASE + '/manage/user/delete', { userId }, 'POST')

/**
 * 添加用户
 */
export const reqAddOrUpdateUser = (user) =>
  ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
