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
        mydata:jwt.decode(JSON.parse(localStorage.getItem('whatsapp'))),
        rerender:true,
        updatedName:{}
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
            this.props.sockets[this.state.mydata.phone].on('change-contact-name-response',(data)=>{
                if(data.status){
                    console.log(data)
                    let temp = this.state.updatedName
                    temp[data.desc.id]=data.desc.name
                    this.setState({
                        updatedName:temp
                    })
                    alert('contact name updated successfully')
                }
                else{
                    alert(data.details)
                }
            })
            this.props.sockets[this.state.mydata.phone].emit('init',{
                token:this.state.token
            })
           this.props.sockets[this.state.mydata.phone].on('change-name-response',(data)=>{
               if(!data.status){
                   alert(data.details)
               }
               else{
                   alert('name changed successfully')
               }
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
            this.props.sockets[this.state.mydata.phone].on('update-dp-response',(data)=>{
                if(data.status){
                    alert('profile updated')
                    this.setState({
                        rerender:!this.state.rerender
                    })
                    // window.location.reload()
                }
                else{
                    alert('profile update failure')
                }
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
                            let temp = this.props.messages
                            for(let i=0;i<temp[this.props.chat].length;i++){
                                if(temp[this.props.chat][i].flag===0){
                                    temp[this.props.chat][i].flag=1
                                }
                                if(i===temp[this.props.chat].length-1){
                                    this.props.dispatch({
                                        type:'set-contact',
                                        data:temp
                                    })
                                }
                            }
                            // temp[this.props.chat][temp[this.props.chat].length-1].flag=1
                            // temp[-1].flag=1

                            
                            setTimeout(() => {
                                
                            this.setState({
                                rerender:!this.state.rerender
                            })
                            }, 100);
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


    addIncomingMessage=(msg)=>{
        console.log('recived',msg)
        var from;
        if(msg.to){
            console.log('recived private message')
            this.props.contacts.forEach(element =>{
                if(element.userid === msg.payload.msgFrm){
                    from = element.phone
                    let temp = this.props.messages
                    temp[from].push(msg.payload)
                    // alert('dispatching')
                    this.props.dispatch({
                        type:'add-message',
                        data:{
                            id:from,
                            payload:msg.payload
                        }
                    })
                    this.setState({
                        rerender:!this.state.rerender
                    })
                }
            })



            // var temp = this.props.contacts[from]
            
            // if(!this.props.messages[msg.to]){
            //     this.props.sockets[this.state.mydata.phone].emit('newchat',{
            //         token:JSON.parse(localStorage.getItem('whatsapp')),
            //         id:msg.payload.msgFrm
            //     })
            //     this.props.contacts.forEach(element =>{
            //         if(element.userid === msg.payload.msgFrm){
            //             from = element.phone
            //             temp = this.props.contacts[from]
            //             if(!temp){
            //                 fetch(this.props.host+'/getgroups',{
            //                     method:'POST',
            //                     headers:{'Content-Type': 'application/json; charset=utf-8'},
            //                     body:JSON.stringify({
            //                         token: this.state.token
            //                     })   
            //                 }).then(res => res.json())
            //                 .then(res => {
            //                     console.log('testing',res)
            //                     res.status&&
            //                     res.groups.forEach(element=>{
            //                         console.log('push',element)
            //                         this.props.dispatch({
            //                             type:'add-contact',
            //                             data:element
            //                         })
            //                     })})
            //             }else{
    
            //                 temp.push(msg.payload)
            //                 this.setState({
            //                     [from]:temp
            //                 })
            //             }
            //         }
            //     })
            // }
            // else{
            //     if(temp){
            //         temp.push(msg.payload)
            //         this.setState({
            //             [from]:temp
            //         })
            //     }
            // }
        }
        else{
            from = msg.grpto
            this.props.dispatch({
                type:'add-message',
                data:{
                    id:from,
                    payload:msg.payload
                }
            })
            this.setState({
                rerender:!this.state.rerender
            })
        }
        // else if(this.state.mydata.userid!==msg.payload.msgFrm){
            
    
        //     temp = this.state[msg.grpto]
        //     msg.payload.message = String(msg.payload.message)
        //     console.log('recived group message',msg)
        //     temp.push(msg.payload)
        //     this.setState({
        //         [from]:temp
        //     })
        // }
    }
    


    render() { 
        
        return ( 
            <div className='Home'>
                <div className='HomeContainer'>
                    <HomeLeft updatedName={this.state.updatedName} rerender={this.state.rerender} mydata={this.state.mydata}/>
                    <HomeRightContainer rerender={this.state.rerender} mydata={this.state.mydata}/>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => { return { host:state.host,chat:state.chat,messages:state.messages,contacts:state.contacts, sockets:state.sockets}}
export default connect(mapStateToProps)(Home);