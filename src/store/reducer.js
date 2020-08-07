import * as types from './actionTypes'
import { deepCopy } from '../utils/utils'

//默认的数据
const defaultState = {
  username: sessionStorage.getItem('username') || '',
  isLogin: sessionStorage.getItem('__config_center_token') || false,
}

export default (state = defaultState, action) => {
  // switch (action.type) {
  //   case types.SET_IS_LOGIN:
  //     const stateCopy = deepCopy(state)
  //     stateCopy.isLogin = action.isLogin
  //     console.log(stateCopy)
  //     return stateCopy
  //   case types.SET_USERNAME:
  //     stateCopy = deepCopy(state)
  //     stateCopy.user = action.user
  //     console.log(stateCopy)
  //     return stateCopy
  //   default:
  //     return state
  // }

  if (action.type === types.SET_IS_LOGIN) {
    const stateCopy = deepCopy(state)
    stateCopy.isLogin = action.isLogin
    return stateCopy
  } else if (action.type === types.SET_USERNAME) {
    const stateCopy = deepCopy(state)
    stateCopy.username = action.username
    return stateCopy
  } else {
    return state
  }
}
