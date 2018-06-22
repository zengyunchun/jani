import React from 'react'
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile'
import { getMsgList, sendMsg, recvMsg, readMsg } from '../../redux/chat.redux'
import { connect } from 'react-redux'
import { getChatId } from '../../util'

// import io from 'socket.io-client'
// const sockets = io('ws://localhost:5238')

@connect(
    state => state,
    { getMsgList, sendMsg, recvMsg, readMsg }
)
class Chat extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: "",
            msg: [],
        }
    }

    componentDidMount() {
        // 特别注意这里必须判断 ！！！！！！
        // 否则每次更新组件会导致recvMsg都去绑定一个socketid的事件，绑定很多事件
        // 被触发多次导致state被污染
        if (!this.props.chat.chatmsg.length) {
            // 获取聊天信息列表
            this.props.getMsgList()
            // 监听接受消息端口
            this.props.recvMsg()
        }
        // 通过url获取聊天对象的id
        //const to = this.props.match.params.user
        //this.props.readMsg(to)
        this.fixCarousel()
    }

    // 解决grid不能撑满的bug
    fixCarousel() {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'))
        }, 0)
    }

    componentWillUnmount() {
        // 通过url获取聊天对象的id
        const to = this.props.match.params.user
        // 退出的时候更新未读消息
        this.props.readMsg(to)
    }

    handleSubmit() {
        const from = this.props.user._id
        const to = this.props.match.params.user
        const msg = this.state.text
        console.log("信息： " + msg)
        this.props.sendMsg({ from, to, msg })
        //.emit('sendmsg',{text:this.state.text})
        this.setState({
            text: '',
            showEmoji: false
        })
    }

    render() {
        const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀 '
            .split(' ')
            .filter(v => v)
            .map(v => ({ text: v }))

        /* // this.props.match 可以获取url参数 */
        const userid = this.props.match.params.user
        const Item = List.Item
        const users = this.props.chat.users
        if (!users[userid]) {
            return null
        }
        console.log("chatmsg is: ")
        console.log(this.props.chat.chatmsg)
        const chatid = getChatId(userid, this.props.user._id)
        const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)
        return (
            <div id='chat-page'>
                <NavBar
                    // 这里Icon也是个组件可以引入
                    icon={<Icon type='left' />}
                    onLeftClick={() => {
                        this.props.history.goBack()
                    }}
                    modo='dart'>
                    {users[userid].name}
                </NavBar>
                {chatmsgs.map(v => {
                    const avatar = require(`../../img/${users[v.from].avatar}.png`)
                    return (v.from === userid) ? (
                        <List key={v._id}>
                            <Item
                                thumb={avatar}
                            >{v.content}</Item>
                        </List>
                    ) : (
                            <List key={v._id}>
                                <Item
                                    extra={<img src={avatar} alt="头像" />}
                                    className='chat-me'
                                >{v.content}</Item>
                            </List>
                        )
                    // return <p key={v._id}>{v.content}</p>
                })}
                <div className='stick-footer'>
                    <List>
                        <InputItem
                            placeholder='请输入'
                            value={this.state.text}
                            onChange={v => (
                                this.setState({ text: v })
                            )}
                            extra={
                                <div>
                                    <span
                                        role="img"
                                        style={{ marginRight: 15 }}
                                        onClick={() => {
                                            this.setState({
                                                showEmoji: !this.state.showEmoji
                                            })
                                            this.fixCarousel()
                                        }}>😀</span>
                                    <span onClick={() => this.handleSubmit()}>发送</span>
                                </div>
                            }>
                            信息</InputItem>
                    </List>
                    {this.state.showEmoji ? <Grid
                        data={emoji}
                        columnNum={9}
                        carouselMaxRow={4}
                        onClick={el => {
                            this.setState({
                                text: this.state.text + el.text
                            })
                        }}
                        isCarousel={true} ></Grid> : null}
                </div>
            </div>
        )
    }
}

export default Chat