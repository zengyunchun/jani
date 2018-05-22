

import React from 'react'
import UserCard from '../usercard/usercard'
import {connect} from 'react-redux'
import {getUserList} from '../../redux/chatuser.redux'

@connect(
    // 组件将会监听 Redux store 的变化。
    // 任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。
    // 该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并。
    state=>state.chatuser, 
    //1. 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，
    //   而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的 props 中。
    //2. 如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，
    //   这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起
    {getUserList}
)

class Boss extends React.Component{

    // 用connect来装饰component的时候就可以不用构造函数了
    // constructor(props) {
    //     super(props);
    //     this.state={
    //         data:[]
    //     }
    // }
    
    componentDidMount() {
        this.props.getUserList('genius')
    }

    render () {
        return (
            <UserCard userList={this.props.userList}></UserCard>
        )
    }
}


export default Boss