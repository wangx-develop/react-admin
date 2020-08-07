import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

//可以加入多个中间件（thunk只是其中之一）
const enhancer = composeEnhancers(applyMiddleware(thunk))

const store = createStore(reducer, enhancer)

export default store
