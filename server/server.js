// 用nodemon来实时更新服务器， 不用手动重启 ！！！！
// nodemon server/server.js

// node端没有css,所以要用钩子做下处理， 要放在最前头！！！！
// cmrh.config.js就是csshook的配置文件
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
import { createStore, applyMiddleware,compose } from 'redux'
import { StaticRouter } from 'react-router-dom'
import reducers from '../src/reducer'

// import ReactDOMServer from 'react-dom/server'
import App from '../src/app'
import {renderToString, renderToStaticMarkup} from 'react-dom/server'
// 获取资源地址用于SSR插入css和图片
import staticPath from '../build/asset-manifest.json'
console.log(staticPath)

const path = require('path')

import React from 'react'

// function App() {
//     return <h1>ddddd</h1>
// }
console.log(<App/>)

// 需要安装 npm install body-parser --save
const bodyParser = require('body-parser')

// 需要安装 npm install cookie-parser --save
const cookieParser = require('cookie-parser')

const userRouter = require('./user')
const model = require('./model')
const Chat = model.getModel('chat')
//Chat.remove({},function(e,d){})
const app = express()

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
// 匹配user路由的前缀
app.use('/user', userRouter)
// 把所有请求设置为静态资源地址，通过其他的中间件转发路由实行拦截
app.use('/', express.static(path.resolve('build')))
// 路由过滤
app.use(function (req, res, next) {
    if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
        return next();
    }

    // --------服务端SSR--------- 目前图片有点问题，先不用
    // const store = createStore(reducers, compose(
    //     applyMiddleware(thunk)
    // ))
    // let context = {}
    // // 用renderToString来在服务端渲染
    // // 服务端用StaticRouter代替前端的BrowserRouter
    // const markup = renderToString(
    //     <Provider store={store}> 
    //         <StaticRouter location={req.url} context={context}> 
    //             <App />
    //         </StaticRouter>
    //     </Provider>
    // )
    // // 用index.html的骨架来在服务端渲染(SSR)
    // const pageHtml = `<!DOCTYPE html>
    // <html lang="en">
    //   <head>
    //     <meta charset="utf-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    //     <meta name="theme-color" content="#000000">
    //     <title>React App</title>
    //     <link rel="stylesheet" href="${staticPath['main.css']}"/>
    //   </head>
    //   <body>
    //     <noscript>
    //       You need to enable JavaScript to run this app.
    //     </noscript>
    //     <div id="root">${markup}</div>
    //     <script src="${staticPath['main.js']}"/>
    //   </body>
    // </html>`
    // return res.send(pageHtml)
    // --------服务端SSR---------

    return res.sendFile(path.resolve('build/index.html'))
})

// 设置路径
// app.use('/',express.static(path.resolve('build')))
// express 监听的端口 
// app.listen(5238, () => {
//     console.log("启动啦！！！！")
// })

// 用socket.io的时候要用server监听
server.listen(5238, () => {
    console.log("启动啦！！！！")
})