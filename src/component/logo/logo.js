import React from 'react'
import logImg from  './job.png'
import './logo.css'


class Logo extends React.Component {
    render(){
        return (
            <div className='logo-container'>
                <img src={logImg} alt=""/>
            </div>
        )
    }
}

export  default Logo