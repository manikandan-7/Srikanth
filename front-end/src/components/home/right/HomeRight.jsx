import React from 'react'
import './HomeRight.css'
import ContactDetails from './ContactDetails'
import Compose from './Compose'
import MessageField from './MessageField'
import { connect } from 'react-redux'
import io from 'socket.io-client'

// const jwt = require('jsonwebtoken')
// const io = window.socket;
// fetch('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.dev.js').then(res => io=res)

class HomeRight extends React.Component {

    constructor(props){
        super(props)
        this.state={length:0,
            sockets:{}
        }
    }



fetchMessages=async(element,start)=>{

    await this.props.contacts.forEach(element =>{
        console.log(element.phone,this.props.chat)
        if(element.phone === this.props.chat){
            this.setState({
                currentchat:element
            })
        }
    })

    fetch('http://localhost:8080/initialfetch',{
        method:'POST',
        headers:{'Content-Type': 'application/json; charset=utf-8'},
        body:JSON.stringify({
            token:JSON.parse(localStorage.getItem('whatsapp')),
            to:this.state.currentchat.userid,
            start:start,
            msgid:element.msgid
        })
    })
    .then(res => res.json())
    .then(data => {
        var temp = this.state[element.phone]
        temp = data.reverse().concat(temp)
        console.log(data.length)
        this.setState({
            [element.phone]:temp
        })
        // console.log(element.phone,data)
})
}

init=()=>{

    console.log('mounted', this.props.mycontacts)
    this.props.contacts.forEach(element =>{
        console.log(element,'inloop')
        fetch('http://localhost:8080/initialfetch',{
            method:'POST',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                token:JSON.parse(localStorage.getItem('whatsapp')),
                to:element.userid,
                start:0
            })
        })
        .then(res => res.json())
        .then(data => {
            this.setState({
                [element.phone]:data.reverse(),
                length:this.props.contacts.length
            })
            console.log(element.phone,data)
    })
    })

    //socket establishing
    // var sockets = {}
        // var sockets = this.state.sockets
        // sockets[socketId]=new W3CWebSocket('ws://localhost:8080/'+socketId)
    this.props.contacts.forEach(element=>{
        // var socketId='hhhh'
        var socketId=(Number(element.phone)<Number(this.props.mydata.phone))?String(element.phone)+'and'+String(this.props.mydata.phone):
        String(this.props.mydata.phone)+'and'+String(element.phone)
        this.props.dispatch(
            {
            type:'add-socket',
            id:socketId,
            data:io.connect(`http://localhost:8080/${socketId}`)
        }
            )
 
    })
    //-------------------------------------------------------------------------//
    Object.keys(this.props.sockets).forEach(element=>{

        this.props.sockets[element].on('chat-message',(data)=>{
            this.addIncomingMessage(data)
        console.log(data)
        })

    })
    //-----------------------------------------------------------------------//
//         var socket = io.connect(`http://localhost:8080/8072251714and9090909090`);
// socket.emit('message', {status:true});
// socket.on('chat-message',(data)=>{
//     console.log(data)
// })


}
addIncomingMessage=(msg)=>{
    var from;
    this.props.contacts.forEach(element =>{
        if(element.userid === msg.payload.msgFrm){
            from = element.phone
        }
    })
    var temp = this.state[from]
    temp.push(msg.payload)
    this.setState({
        [from]:temp
    })
}


    addMessage=(msg)=>{
        // try{
        //     msg=JSON.parse(msg)
        //     console.log('executed try')
        // }
        // catch{
        //     msg=msg
        //     console.log('executed catch')
        // }
        var temp =this.state[msg.to]
        temp.push(msg.payload)
        this.setState({
            [msg.to]:temp
        })
    }

    setFlag=(msg)=>{
        var temp=this.state[msg]
        temp[temp.length-1].flag=1
        this.setState({
            [msg]:temp
        })
    }
    render() {
        
        if(this.state.length!==this.props.contacts.length){
            this.init()
        }
        
        console.log('rendered',this.props.contacts.length)
        return ( 
            this.props.onload ?
            <div className='HomeRight'>
                <ContactDetails details={this.props.details} />
                <MessageField fetchMessages={this.fetchMessages} chat={this.props.chat} show={this.state[this.props.chat]} mydata={this.props.mydata}/>
                <Compose addMessage={this.addMessage} setFlag={this.setFlag} mydata={this.props.mydata} sockets={this.state.sockets}/>
            </div>
            :
            <div className='HomeRight'><img src='/image.png' alt='' style={{width:'100%', height:'100%'}}></img></div>
         );
    }
}
const mapStateToProps = (state) => { return { contacts: state.contacts,chat: state.chat,sockets:state.sockets}}
export default connect(mapStateToProps)(HomeRight);