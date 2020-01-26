import React from 'react'
import HomeLeft from './left/HomeLeft'
import './Home.css'
import HomeRightContainer from './right/HomeRightContainer'
import { connect } from 'react-redux'
import io from 'socket.io-client'
// import { w3cwebsocket as W3CWebSocket } from "websocket";
const jwt= require('jsonwebtoken')
// const client = new W3CWebSocket('ws://localhost:8080/8072251714and9952568713');

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = { currentCard:'',
        token:JSON.parse(localStorage.getItem('whatsapp')),
        mydata:jwt.decode(JSON.parse(localStorage.getItem('whatsapp')))
         }
        
    }

    // componentDidMount() {

    //   }

    logout(){
        localStorage.removeItem('whatsapp')
    }
    componentDidMount(){

        this.createSocket()

        // fetch(this.props.host+'/getcontacts',{
        //     method:'POST',
        //     headers:{'Content-Type': 'application/json; charset=utf-8'},
        //     body:JSON.stringify({
        //         token: this.state.token
        //     })   
        // }).then(res=> res.json())
        // .then(data=> 
        // this.props.dispatch(
        //     {
        //     type:'update-contact',
        //     data:data
        // }
        //     ))

        // fetch(this.props.host+'/getgroups',{
        //     method:'POST',
        //     headers:{'Content-Type': 'application/json; charset=utf-8'},
        //     body:JSON.stringify({
        //         token: this.state.token
        //     })   
        // }).then(res => res.json())
        // .then(res => {
        //     console.log('testing',res)
        //     res.status&&
        //     res.groups.forEach(element=>{
        //         console.log('push',element)
        //         this.props.dispatch({
        //             type:'add-contact',
        //             data:element
        //         })
        //     })
        // })
    }

    handleInit=(data)=>{
        data.contacts.forEach(element=>{
            this.props.dispatch({
                type:'add-contact',
                data:element
            })
        })
        this.props.dispatch({
            type:'set-messages',
            data:data.messages
        })
    }

    createSocket(){

        this.props.dispatch(
            {
            type:'add-socket',
            id:this.state.mydata.phone,
            data:io.connect(`${this.props.host}/${this.state.mydata.phone}`)
        }
            )
            this.props.sockets[this.state.mydata.phone].on('initial-response',(data)=>{
                data.status &&
                this.handleInit(data.data)
            })
            this.props.sockets[this.state.mydata.phone].emit('init',{
                token:this.state.token
            })
           
            this.props.sockets[this.state.mydata.phone].on('newchat-response',(data)=>{
                // console.log('new chat response',data)
                (data.status)?
                this.props.dispatch({
                    type:'add-contact',
                    data:data.data
                }):
                alert(data.details)
            })
            this.props.sockets[this.state.mydata.phone].on('chat-message',(data)=>{
                // console.log('chat msg',data)
                this.addIncomingMessage(data)

                // this.props.sockets[this.state.mydata.phone].emit('i-recived',{phone:this.state.mydata.phone})
            })
            this.props.sockets[this.state.mydata.phone].on('create-group-response',data=>{
                console.log('response for create group',data)
                data.grp.admin=1
                if(data.status){
                    this.props.dispatch({
                        type:'add-contact',
                        data:data.grp
                    })
                }
            })
            this.props.sockets[this.state.mydata.phone].on('chat-message-response',(data)=>{
                // console.log('chat msg response',data)
                if(data.status){

                            // alert(this.props.chat)
                        }
            })
            // this.props.sockets[this.state.mydata.phone].on('set-flag-2',data=>{
            //     alert(data)
            // })
            this.props.sockets[this.state.mydata.phone].on('new-incoming-group',data=>{
                if(data.length){
                    this.props.dispatch({
                        type:'add-contact',
                        data:data
                    })
                }
            })
            this.props.sockets[this.state.mydata.phone].on('add-to-group-response',data=>{
                if(data.status){
                    alert('user added to group')
                }
                else{
                    alert(data.details)
                }
            })

    
    }

    render() { 
        
        return ( 
            <div className='Home'>
                <div className='HomeContainer'>
                    <HomeLeft mydata={this.state.mydata}/>
                    <HomeRightContainer mydata={this.state.mydata}/>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => { return { host:state.host, sockets:state.sockets}}
export default connect(mapStateToProps)(Home);