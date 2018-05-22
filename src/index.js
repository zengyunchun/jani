import React from 'react'
import ReactDom from 'react-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'  // 用react-redux代替人工管理
import { createStore, applyMiddleware, compose } from 'redux'
import { BrowserRouter } from 'react-router-dom'

import reducers from './reducer'
import './config'
import './index.css'
import App from './app'

// 需要安装redux-devtools的扩展插件
// Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store
const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
))

ReactDom.render(
    (<Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>),
    document.getElementById('root')
)
// 学 7-2`