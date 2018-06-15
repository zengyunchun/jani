import React from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import AvatarSelector from '../../container/avatar-selector/avatar-selector'
import { connect } from 'react-redux'
import { update } from '../../redux/user.redux'
import { Redirect } from 'react-router-dom'


// connect([mapStateToProps], [mapDispatchToProps], [mergeProps],[options])
@connect(
    state => state.user,
    { update }
)

class BossInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            title: '',
            desc: '',
            company: '',
            salary: ''
        }
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    // 两种不同的绑定事件的方式
    // 1. 利用箭头函数传递this作用域
    onChange(key, val) {
        this.setState({
            [key]: val
        })
    }
    // 2. 手动绑定this作用域
    handleUpdate() {
        this.props.update(this.state)
    }

    render() {
        const pathname = this.props.location.pathname
        const redirect = this.props.redirectTo
        return (
            <div>
                {redirect && redirect !== pathname ? <Redirect to={this.props.redirectTo} /> : null}
                <NavBar mode="dark">Boss完善信息页面</NavBar>
                <AvatarSelector selectAvatar={(imgName) => this.setState({
                    avatar: imgName
                })}></AvatarSelector>
                <InputItem onChange={(v) => this.onChange('title', v)}>
                    招聘职位
                </InputItem>
                <InputItem onChange={(v) => this.onChange('company', v)}>
                    公司名称
                </InputItem>
                <InputItem onChange={(v) => this.onChange('salary', v)}>
                    职位薪资
                </InputItem>
                <TextareaItem
                    onChange={(v) => this.onChange('desc', v)}
                    rows={3}
                    title='职位要求'
                    autoHeight>
                </TextareaItem>
                <Button onClick={this.handleUpdate} type='primary'>保存</Button>
            </div>
        )
    }
}

export default BossInfo
