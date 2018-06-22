import React from 'react'
import { Grid, List } from 'antd-mobile'
import PropTypes from 'prop-types'

class AvatarSelector extends React.Component {
    static PropTypes = {
        selectAvatar: PropTypes.func
    }


    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    render() {
        const avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
            .split(',')
            .map(v => ({
                icon: require(`../../img/${v}.png`),
                text: v
            }))
        const gridHeader = this.state.icon ? (
            <div>
                <span>已选择头像</span>
                <img style={{ width: 20 }} src={this.state.icon} alt="头像" />
            </div>) : '请选择头像'
        return (
            <div>
                <List
                    renderHeader={() => gridHeader}>
                    <Grid
                        data={avatarList}
                        onClick={elem => {
                            this.setState(elem)
                            this.props.selectAvatar(elem.text)
                        }}
                        columnNum={5} />
                </List>
            </div>
        )
    }
}

export default AvatarSelector
