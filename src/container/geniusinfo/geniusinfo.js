import React from 'react'
import  { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import AvatarSelector from '../../container/avatar-selector/avatar-selector'
import {connect} from 'react-redux'
import {update} from '../../redux/user.redux'
import {Redirect} from 'react-router-dom'

@connect(
    state=>state.user,
    {update}
)

class GeniusInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            title:"",
            desc:""
        }    
        this.handleUpdate = this.handleUpdate.bind(this)
    }
    
    onChange(key, val) {
        this.setState({
            [key]:val
        })
    }

    handleUpdate() {
        this.props.update(this.state)
    }

    render (){
        const pathname = this.props.location.pathname
        const redirect = this.props.redirectTo
        return (
            <div>
                {redirect && redirect !== pathname ? <Redirect to={this.props.redirectTo}/>:null}
                <NavBar mode="dark">牛人完善信息页面</NavBar>
                <AvatarSelector selectAvatar={(imgName)=>this.setState({
                    avatar:imgName
                })}></AvatarSelector>
                <InputItem onChange={(v)=>this.onChange('title',v)}>
                 求职岗位
                </InputItem>
                <TextareaItem 
                onChange={(v)=>this.onChange('desc',v)}
                rows={3}
                title='个人简介'
                autoHeight>
                </TextareaItem>
                <Button onClick={ this.handleUpdate} type='primary'>保存</Button>
            </div>
        )
    }
}

export default GeniusInfo
