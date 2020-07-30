import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// export function reqLogin({username,password}){
//     return ajax('/login' , {username,password},'POST')
// }

/**
 * 登入
 */
export const reqLogin = ({ username, password }) =>
  ajax('/login', { username, password }, 'POST')

/**
 * 添加用户
 */
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

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
