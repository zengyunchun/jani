import axios from 'axios'

import io from 'socket.io-client'
const sockets = io('ws://localhost:5238')

// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_RECV = 'MSG_RECV'
// 标识已读
const MSG_READ = 'MSG_READ'

const initState = {
    chatmsg: [],
    users: {},
    unread: 0
}


export function chat(state = initState, action) {
    switch (action.type) {
        case MSG_LIST:
            return {
                ...state,
                chatmsg: action.payload.msgs,
                users: action.payload.users,
                unread: action.payload.msgs.filter(v => !v.read && v.to === action.payload.userid).length
            }
        case MSG_RECV:
            const n = action.payload.to === action.userid
            // 巧妙的解构写法来拼接消息队列
            // 先结构state, 里面的chatmsg又是由上一次的state.chatmsg解构后加上当前的payload, 这样就组成了一个记录历史的列表
            return {
                ...state,
                chatmsg: [
                    ...state.chatmsg,
                    action.payload
                ],
                unread: state.unread + n
            }
        case MSG_READ:
            const { from } = action.payload // 获取里面from的属性
            return {
                ...state,
                chatmsg: state.chatmsg.map(v => ({ ...v, read: v.from === from ? true : v.read })),
                unread: state.unread - action.payload.num
            }
        default:
            return state
    }
}

function msgList(msgs, users, userid) {
    return { type: MSG_LIST, payload: { msgs, users, userid } }
}



function msgRecv(msg, userid) {
    return { type: MSG_RECV, payload: msg, userid: userid }
}

function msgRead(from, userid, num) {
    return { type: MSG_READ, payload: { from, userid, num } }
}

// 发送消息
export function sendMsg({ from, to, msg }) {
    return dispatch => {
        sockets.emit('sendmsg', { from, to, msg })
    }
}

// 读取消息
export function readMsg(from) {
    return (dispatch, getState) => {
        axios.post('/user/readmsg', { from })
            .then(res => {
                const userid = getState().user._id
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(msgRead({ from, userid, num: res.data.num }))
                }
            })
    }
}

// 开启接受消息的事件监听
export function recvMsg(msg) {
    return (dispatch, getState) => {
        sockets.on('recvmsg', function (data) {
            const userid = getState().user._id
            // console.log("recvMsg: ", data)
            dispatch(msgRecv(data, userid))
        })
    }
}

// 获取消息队列
export function getMsgList() {
    return (dispatch, getState) => {
        axios.get('/user/getmsglist')
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    // console.log("getState is :", getState())
                    const userid = getState().user._id
                    dispatch(msgList(res.data.msgs, res.data.users, userid))
                }
            })
    }
} 