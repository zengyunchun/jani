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

// ----------------------- thunk实现源码 ------------------------
// ES6
// function createThunkMiddleware(extraArgument) {
//     return ({ dispatch, getState }) => next => action => {
//       if (typeof action === 'function') {
//         return action(dispatch, getState, extraArgument);
//       }
//       return next(action);
//     };
//   }
  
//   const thunk = createThunkMiddleware();
//   thunk.withExtraArgument = createThunkMiddleware;
  
//   export default thunk;

//  // ES5
//   function createThunkMiddleware(extraArgument) {
//     return function (_ref) {
//       var dispatch = _ref.dispatch,
//           getState = _ref.getState;
//       return function (next) {
//         return function (action) {
//           if (typeof action === "function") {
//             return action(dispatch, getState, extraArgument);
//           }
//           return next();
//         };
//       };
//     };
//   }

// ----------------------- thunk实现源码 ------------------------

// ----------------------- applyMiddleware实现源码 ------------------------
// function applyMiddleware(...middlewares) {
//     return (createStore) => (...args) => {
//       const store = createStore(...args)
//       let dispatch = store.dispatch
//       let chain = []
  
//       const middlewareAPI = {
//         getState: store.getState,
//         dispatch: (...args) => dispatch(...args)
//       }
//       chain = middlewares.map(middleware => middleware(middlewareAPI))
//       dispatch = compose(...chain)(store.dispatch)
  
//       return {
//         ...store,
//         dispatch
//       }
//     }
//   }
// ----------------------- applyMiddleware实现源码 ------------------------


// ----------------------- compose 实现源码 ------------------------
// ES6
// function compose(...funcs) {
//     if (funcs.length === 0) {
//       return arg => arg
//     }
  
//     if (funcs.length === 1) {
//       return funcs[0]
//     }      
  
//     return funcs.reduce((a, b) => (...args) => a(b(...args)))
//   }

//  // ES5
//  function compose() {
//     for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
//       funcs[_key] = arguments[_key];
//     }
  
//     if (funcs.length === 0) {
//       return function (arg) {
//         return arg;
//       };
//     }
  
//     if (funcs.length === 1) {
//       return funcs[0];
//     }
  
//     return funcs.reduce(function (a, b) {
//       return function () {
//         return a(b.apply(undefined, arguments));
//       };
//     });
//   }

// ----------------------- compose 实现源码 ------------------------





// 需要安装redux-devtools的扩展插件
// Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store
const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
))

// Provider只是把store存在了context中，并没有做太多事情
ReactDom.render(
    (<Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>),
    document.getElementById('root')
)
// 学 7-2`