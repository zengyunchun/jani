import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem,Radio, WhiteSpace, Button } from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import { register } from '../../redux/user.redux'
import  jasonForm  from "../../component/jason-form/jason-form";


// Store对象包含所有数据。如果想得到某个时点的数据，
// 就要对 Store 生成快照。这种时点的数据集合，就叫做 State
@connect(
    state => state.user,
    {register}
)
@jasonForm
class Register extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     user: "",
        //     pwd: '',
        //     repeatpwd:'',
        //     type: 'genius'
        // }
        this.handleRegister = this.handleRegister.bind(this)
    }

    componentDidMount  () {
        this.props.handleChange('type', 'genius')
    }

    // handleChange(key,val) {
    //     this.setState({
    //         [key]:val
    //     })
    // }

    handleRegister(){
        this.props.register(this.props.state)
    }
    render() {
        const RadioItem = Radio.RadioItem
        return (
            <div>
                {this.props.redirectTo ? <Redirect to={this.props.redirectTo}/>:null}
                <Logo></Logo>
                <h2>我是注册页</h2>          
                <List>    
                    {this.props.msg ? <p className='error-msg'>{this.props.msg}</p>:null}    
                    <InputItem 
                        onChange={v=>this.props.handleChange('user',v)} >用户</InputItem>
                    <WhiteSpace></WhiteSpace>
                    <InputItem 
                        type='password'
                        onChange={v=>this.props.handleChange('pwd',v)}>密码</InputItem>
                    <WhiteSpace></WhiteSpace>
                    <InputItem 
                        type='password'
                        onChange={v=>this.props.handleChange('repeatpwd',v)}>确认密码</InputItem>
                    <WhiteSpace></WhiteSpace>
                    <RadioItem 
                        checked={this.props.state.type === 'genius'}
                        onChange={()=>this.props.handleChange('type','genius')}>
                        牛人
                    </RadioItem>
                    <RadioItem 
                        checked={this.props.state.type === 'boss'}
                        onChange={()=>this.props.handleChange('type','boss')}>
                        BOSS
                    </RadioItem>
                    <Button type='primary' onClick={this.handleRegister}>注册</Button>
                </List>
            </div>

        )
    }
}

export default Register
