
import axios from 'axios'

const USER_LIST = 'USER_LIST'


const initState = {
    userList: []
}

export function chatuser(state=initState, action){
    switch (action.type) {
        case USER_LIST:
            return {...state, userList:action.payload}            
        default:
            return state
    }
}

// 这是一个action creator
function userList(data) {
    return { type:USER_LIST, payload: data}
}

// 
export function getUserList(type) {
    return dispatch=>{
        axios.get(`/user/list?type=${type}`)
            .then(res => {
                if (res.data.code === 0 ) {
                    dispatch(userList(res.data.data))
                    // 用dispactch代替setState来统一管理state, 
                    // 注意这里是通过一个action creator(userList)来创建一个action
                    // 之后会被reducer(chatuser)捕获到， 返回新的state来更新状态，最后渲染dom
                    // this.setState({data:res.data.data})
                }
        })
    }
}