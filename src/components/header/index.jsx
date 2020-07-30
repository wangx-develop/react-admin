import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './index.less'
import { reqWeather } from '../../api/index'
import { formateDate } from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'
import { Modal } from 'antd'
import { setIsLogin, setUserName } from '../../store/actionCreators'

const { confirm } = Modal

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), //当前时间
    dayPictureUrl: '', //天气图片
    weather: '', //天气文本
  }

  getTime = () => {
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }

  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather('苏州')
    this.setState({ dayPictureUrl, weather })
  }

  getTitle = () => {
    //当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find((cItem) => {
          return cItem.key === path
        })
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  loginOut = () => {
    confirm({
      content: '是否退出',
      onOk: () => {
        console.log('OK')
        this.props.setIsLogin(false)
        this.props.setUserName('')
        sessionStorage.removeItem('__config_center_token')
        sessionStorage.removeItem('username')
        this.props.history.replace('/login')
      },
      onCancel: () => {
        console.log('Cancel')
      },
    })
  }

  /**
   * 第一次render()之后执行一次
   * 一般在此执行异步操作：发ajax请求/启动定时器
   */
  componentDidMount() {
    //获取当前时间
    this.getTime()

    //获取当前天气
    this.getWeather()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { currentTime, dayPictureUrl, weather } = this.state
    const title = this.getTitle()

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{this.props.username}</span>
          <a href="#!" onClick={this.loginOut}>
            退出
          </a>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsLogin(isLogin) {
      console.log(isLogin)
      const action = setIsLogin(isLogin)
      dispatch(action)
    },
    setUserName(username) {
      console.log(username)
      const action = setUserName(username)
      dispatch(action)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header))
