import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, WingBlank, WhiteSpace,Button} from 'antd-mobile'
import {login} from '../../redux/user.redux'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import  jasonForm  from "../../component/jason-form/jason-form";

@connect(
    state => state.user,
    {login}
)
@jasonForm
class Login extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     user:'',
        //     pwd:'',
        // }
        this.register = this.register.bind(this)
        this.hanleLogin = this.hanleLogin.bind(this)
    }
    // handleChange(key,val) {
    //     this.setState({
    //         [key]:val
    //     })
    // }
    hanleLogin() {
        this.props.login(this.props.state)
    }
    register() {
        this.props.history.push('/register')
    }

    render(){
        return (
            <div>
                {this.props.redirectTo && this.props.redirectTo !== '/login' ? <Redirect to={this.props.redirectTo}/>:null}
                <Logo></Logo>
                <h2>我是登陆页</h2>
                <WingBlank>
                <List>      
                    {this.props.msg ? <p className='error-msg'>{this.props.msg}</p>:null}    
                    <InputItem onChange={v=>this.props.handleChange('user',v)}>用户</InputItem>
                <WhiteSpace></WhiteSpace>                    
                    <InputItem type='password' onChange={v=>this.props.handleChange('pwd',v)}>密码</InputItem>
                </List>
                <Button onClick={this.hanleLogin} type='primary'>登录</Button>
                <WhiteSpace></WhiteSpace>
                <Button onClick={this.register} type='primary'>注册</Button>
            </WingBlank>
            </div>
    )}
}

export  default Login