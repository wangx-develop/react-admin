import { SET_IS_LOGIN, SET_USERNAME } from './actionTypes'

export const setIsLogin = (isLogin) => ({
  type: SET_IS_LOGIN,
  isLogin,
})

export const setUserName = (username) => ({
  type: SET_USERNAME,
  username,
})
