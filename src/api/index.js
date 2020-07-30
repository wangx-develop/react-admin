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
 * 添加用户
 */
export const reqAddUser = (user) =>
  ajax(BASE + '/manage/user/add', user, 'POST')

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
 * 添加分类
 */
export const reqAddCategorys = ({ parentId, categoryName }) =>
  ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

/**
 * 更新分类
 */
export const reqUpdateCategorys = ({ categoryId, categoryName }) =>
  ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')
