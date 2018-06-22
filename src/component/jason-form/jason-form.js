import React from "react";

//自定义模拟实现connect
export default function jasonForm(Comp) {

    return class WrapperComp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {}
            this.handleChange = this.handleChange.bind(this)
        }

        handleChange(key, val) {
            this.setState({
                [key]: val
            })
        }

        render() {
            return <Comp handleChange={this.handleChange} state={this.state} {...this.props} ></Comp>
        }
    }
}