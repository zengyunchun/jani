

import { combineReducers } from 'redux'
import { user } from './redux/user.redux'
import { chatuser } from './redux/chatuser.redux'
import { chat } from './redux/chat.redux'

// 这里是合并所有的reducer来放在统一的根状态树里面
// 以后各处的dispatch都会被合并的reducer捕获
export default combineReducers({user, chatuser, chat})