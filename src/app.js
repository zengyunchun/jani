import React from 'react'
import Login from './container/login/login'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import Register from './container/register/register'
import Chat from "./component/chat/chat"

// 把所有的公用组件单独放到App中
class App extends React.Component {

    render() {
        return (
            <div>
                <AuthRouter></AuthRouter>
                <Switch>
                    <Route path='/bossinfo' component={BossInfo}></Route>
                    <Route path='/geniusinfo' component={GeniusInfo}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/register' component={Register}></Route>
                    <Route path='/chat/:user' component={Chat}></Route>
                    <Route component={Dashboard}></Route>
                </Switch>
            </div>
        )
    }
}

export default App