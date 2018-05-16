import React from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

@connect(
    state => state
)

class Msg extends React.Component {

    getLast(arra) {
        return arra[arra.length - 1]
    }

    render() {
        const Item = List.Item
        const Brief = Item.Brief
        const userid = this.props.user._id
        const userinfo = this.props.chat.users

        const msgGroup = {}
        // 根据id拼接聊天对象
        this.props.chat.chatmsg.forEach(v => {
            msgGroup[v.chatid] = msgGroup[v.chatid] || []
            msgGroup[v.chatid].push(v)
        });
        // Object.values把对象的值获取组成一个数组
        const chatList = Object.values(msgGroup).sort((a,b)=>{
            // 用时间戳排序生成用户最新聊天顺序
            // 这样最近发送信息的用户可以被置顶显示
            const a_last = this.getLast(a).create_time
            const b_last = this.getLast(b).create_time
            return b_last - a_last
        })
        return (
            <div>
                {/* 遍历聊天数组列表根据人名生成消息简介 */}
                {chatList.map(v => {
                    const lastItem = this.getLast(v)
                    const targetid = v[0].from == userid ? v[0].to : v[0].from
                    const name = userinfo[targetid] && userinfo[targetid].name
                    const avatar = userinfo[targetid] && userinfo[targetid].avatar
                    const unreadnum = v.filter(v=>!v.read && v.to === userid).length
                    return (
                        <List key={lastItem._id}  >
                            <Item
                                onClick={()=>{
                                    this.props.history.push(`/chat/${targetid}`)
                                }}
                                arrow="horizontal"
                                extra={<Badge text={unreadnum}/>}
                                thumb={require(`../../img/${avatar}.png`)}>
                                {lastItem.content}
                                <Brief>{name}</Brief>
                            </Item>
                        </List>
                    )
                })}
            </div>
        )
    }
}

export default Msg