// 用nodemon来实时更新服务器， 不用手动重启 ！！！！
// nodemon server/server.js

import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'
assethook({
    extensions: ['png']
})

import express from 'express'
// 用babel-node后可以在node服务端使用jsx语法
// const express = require('express')

import thunk from 'redux-thunk'
import { Provider } from 'react-redux'  // 用react-redux代替人工管理
import { createStore, applyMiddleware } from 'redux'
import { StaticRouter } from 'react-router-dom'
import {reducers} from '../src/reducer'

import ReactDOMServer from 'react-dom/server'
//import App from '../src/app'
// import {renderToString, renderToStaticMarkup} from 'react-dom'

const path = require('path')

import React from 'react'

// function App() {
//     return <h1>dddd</h1>
// }
// console.log(App())
// 需要安装 npm install body-parser --save
const bodyParser = require('body-parser')

// 需要安装 npm install cookie-parser --save
const cookieParser = require('cookie-parser')

const userRouter = require('./user')
const model = require('./model')
const Chat = model.getModel('chat')
//Chat.remove({},function(e,d){})
const app = express();

// 引入socket.io做实时聊天, 并且和express关联起来
const server  = require('http').Server(app)
const io = require('socket.io')(server)

// 建立链接后监听所有请求
io.on('connection', function(socket) {
    console.log("链接上啦~！！！！！")
    // emit 'sendmsg'的信息这里都可以监听到
    socket.on('sendmsg',function(data) {
        console.log("data is : ")
        console.log(data)
        const {from, to , msg} = data
        const chatid = [from, to].sort().join('_')
        Chat.create({chatid, from, to ,content: msg}, function (err, doc) {
        console.log("doc is: ")
        console.log(doc)
        console.log(doc._doc)
            
            io.emit('recvmsg', Object.assign({}, doc._doc))
        })
        //console.log(data)
        // 发送信息到 'recvmsg'
        //io.emit('recvmsg', data)
    })
})

// 使用cookieParser的中间件
app.use(cookieParser())
// 使用cookieParser的中间件
app.use(bodyParser.json())
app.use('/user', userRouter)

// 路由过滤
// app.use(function (req, res, next) {
//     if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
//         return next();
//     }
//     const store = createStore(reducers, compose(
//         applyMiddleware(thunk)
//     ))
//     const markup = ReactDOMServer.renderToString(
//         <Provider store={store}>
//             <StaticRouter
//                 location={req.url}
//                 context={context}
//                 >
//                 <App />
//             </StaticRouter>
//         </Provider>
//     )
//     return res.sendFile(path.resolve('build/index.html'))
// })

// 设置路径
// app.use('/',express.static(path.resolve('build')))
// express 监听的端口 
// app.listen(2356, () => {
//     console.log("启动啦！！！！")
// })

// 用socket.io的时候要用server监听
server.listen(2356, () => {
    console.log("启动啦！！！！")
})