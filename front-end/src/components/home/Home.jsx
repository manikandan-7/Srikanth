import React from 'react'
import HomeLeft from './left/HomeLeft'
import './Home.css'
import HomeRightContainer from './right/HomeRightContainer'
import { connect } from 'react-redux'
const jwt= require('jsonwebtoken')

class Home extends React.Component {
    constructor(){
        super()
        this.state = { currentCard:'',
        token:JSON.parse(localStorage.getItem('whatsapp')),
        myData:jwt.decode(JSON.parse(localStorage.getItem('whatsapp')))
         }
    }
    logout(){
        localStorage.removeItem('whatsapp')
    }
    componentDidMount(){

        fetch('http://localhost:8080/getcontacts',{
            method:'POST',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                token: this.state.token
            })   
        }).then(res=> res.json())
        .then(data=> 
        this.props.dispatch(
            {
            type:'update-contact',
            data:data
        }
            ))
        
    }
    render() { 
        
        return ( 
            <div className='Home'>
                <div className='HomeContainer'>
                    <HomeLeft mydata={this.state.myData}/>
                    <HomeRightContainer mydata={this.state.myData}/>
                    </div>
            </div>
        );
    }
}

 
export default connect()(Home);