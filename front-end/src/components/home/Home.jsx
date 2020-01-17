import React from 'react'
import HomeLeft from './left/HomeLeft'
import './Home.css'
import HomeRightContainer from './right/HomeRightContainer'
import { connect } from 'react-redux'
// import { w3cwebsocket as W3CWebSocket } from "websocket";
const jwt= require('jsonwebtoken')
// const client = new W3CWebSocket('ws://localhost:8080/8072251714and9952568713');

class Home extends React.Component {
    constructor(){
        super()
        this.state = { currentCard:'',
        token:JSON.parse(localStorage.getItem('whatsapp')),
        myData:jwt.decode(JSON.parse(localStorage.getItem('whatsapp')))
         }
    }

    // componentWillMount() {
    //     client.onopen = () => {
    //       console.log('WebSocket Client Connected');
    //       client.send('hello')
    //     };
    //     client.onmessage = (message) => {
    //       console.log('recived',message);
    //     };
    //     // client.send('hello');
    //     client.onclose = ()=>{
    //         console.log('closed')
    //     }
    //   }

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