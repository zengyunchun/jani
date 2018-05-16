import React from 'react'
import {NavBar} from 'antd-mobile'
import {connect} from 'react-redux'
import NavLinkBar from '../navlink/navlink'
import {Switch, Route} from 'react-router-dom'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../../component/msg/msg'
import {getMsgList, recvMsg} from '../../redux/chat.redux'


// function Boss() {
//     return <h2>Boss首页</h2>
// }

// function Genius() {
//     return <h2>牛人列44</h2>
// }

// function Msg() {
//     return <h2>消息中西2222</h2>
// }
// function User() {
//     return <h2>个人中心111</h2>
// }

@connect(
    state=>state,
    {getMsgList, recvMsg}
)
class Dashboard extends React.Component{
    componentDidMount () {
        // 特别注意这里必须判断 ！！！！！！
        // 否则每次更新组件会导致recvMsg都去绑定一个socketid的事件，绑定很多事件
        // 被触发多次导致state被污染
        if (!this.props.chat.chatmsg.length) {
            this.props.getMsgList()
            this.props.recvMsg()
        }
    }
    
    render(){
        console.log(this.props)
        const pathname = this.props.location.pathname
        console.log(this.pathname)
        const user = this.props.user
        const navList = [
            {
                path: '/boss',
                text: '牛人',
                icon: 'boss',
                title: '牛人列表',
                component: Boss,
                hide:user.type =='genius'
            },
            {
                path: '/genius',
                text: 'Boss',
                icon: 'job',
                title: 'Boss列表',
                component: Genius,
                hide:user.type =='boss'
            },
            {
                path: '/msg',
                text: '消息',
                icon: 'msg',
                title: '消息列表',
                component: Msg,
            },
            {
                path: '/me',
                text: '我',
                icon: 'user',
                title: '个人中心',
                component: User
            }
        ]
        
        return (
            <div>
                <NavBar className='fixd-header' mode='dart'>{navList.find(v=>v.path==pathname).title}</NavBar>
				<div style={{marginTop:45}}>
                        {/* 注意这里switch是react中的不是anti控件, 用来命中一条 */}
						<Switch>
							{navList.map(v=>(
								<Route key={v.path} path={v.path} component={v.component}></Route>
							))}
						</Switch>
				</div>
				<NavLinkBar data={navList}></NavLinkBar>
            </div>
        )
    }
}

export  default Dashboard 