import axios from 'axios'
import {getRedirectPath} from '../util'

const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOAD_DATA = 'LOAD_DATA'
const LOGOUT = 'LOGOUT'

const ERROR_MSG = 'ERROR_MSG'

const initState = {
    redirectTo:'',
    isAuth :false,
    msg: '',
    user: '',
    pwd: '',
    type: ''
}

export function user(state = initState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {...state, msg:'', redirectTo:getRedirectPath(action.payload), ...action.payload }
        case LOAD_DATA:
            return {...state, ...action.payload}  
        case ERROR_MSG:
            return {...state, isAuth: false, msg: action.msg}
        case LOGOUT:
            return {...initState, redirectTo:'/login'}
        default:
            return state;
    }

}

// State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。
// 所以，State 的变化必须是 View 导致的。
// Action 就是 View 发出的通知，表示 State 应该要发生变化了
function errorMsg(msg) {
    return {msg, type : ERROR_MSG}
}


// View 要发送多少种消息，就会有多少种 Action。
// 如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。
// function registerSuccess(data) {
//     // action的名字是：REGISTER_SUCCESS， 携带的信息是：data
//     return {type: AUTH_SUCCESS, payload:data}
// }
// function loginSuccess(data) {
//     // action的名字是：REGISTER_SUCCESS， 携带的信息是：data
//     return {type: AUTH_SUCCESS, payload:data}
// }

function authSuccess(obj) {
    // action的名字是：authSuccess， 携带的信息是：data
    // 用解构的方法去过滤pwd, 不传到前端 
     const {pwd, ...data} = obj
    return {type: AUTH_SUCCESS, payload:data}
}

export function loadData(userinfo){
	return { type:LOAD_DATA, payload:userinfo}
}

export function logoutSubmit() {
    return { type:LOGOUT }
}

export function update(data) {
    return dispatch => {
     axios.post('user/update', data)
        .then(res=>{
            if (res.status === 200 && res.data.code === 0){
                dispatch(authSuccess(res.data.data))
            } else {
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}

export function login({user, pwd}) {
    if (!user || !pwd) {
        return errorMsg('用户密码必须输入')
    }
    return dispatch => {
        axios.post('/user/login', {user, pwd})
        .then(res=>{
            if (res.status === 200 && res.data.code === 0){
                dispatch(authSuccess(res.data.data))
            } else {
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}

export function register({user, pwd, repeatpwd, type}) {
    if (!user || !pwd || !type) {
        return errorMsg('用户名密码不能为空')
    }
    if (pwd !== repeatpwd) {
        return errorMsg('密码和确认密码不同')
    }
    // 这里dispatch其实是react-thunk中间件传参数过来的，
    // 为了处理action中的异步问题
    return dispatch => {
        axios.post('/user/register', {user, pwd, type})
        .then(res=>{
            if (res.status === 200 && res.data.code === 0){
                dispatch(authSuccess(res.data.data))
            } else {
                dispatch(errorMsg(res.data.msg))
            }
        })
    }
}