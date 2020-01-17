import React from 'react'
import { connect } from 'react-redux'

class Compose extends React.Component {
    constructor(){
        super()
        this.state={
            composed : '',
            waiting:''
        }
    }

    handleChange=(e)=>{
        this.setState({
            composed:e.target.value,
            waiting:e.target.value

        })
    }
    sendMsg=(e)=>{
        if (this.state.composed.length>=1){ 
            var msg = {
                to:this.props.chat,
                payload:{
                    msgFrm:this.props.mydata.userid,
                    message:this.state.composed,
                    timestamp:new Date(),
                    flag:0
                }
            }
            this.props.addMessage(msg)
            this.setState({
                composed:''
            })

            //socket
            var socketId=(Number(this.props.chat)<Number(this.props.mydata.phone))?String(this.props.chat)+'and'+String(this.props.mydata.phone):
            String(this.props.mydata.phone)+'and'+String(this.props.chat)
// var socketId='hhhh'
            const client = this.props.sockets[socketId]
            // client.on('connect', function () { 
            //     console.log('connected',socketId)
            client.emit('message', msg);
            console.log('emited',socketId)
        // });
            // console.log('client',client)
            // client.onopen = () => {
            //     client.send('heeeyyy')
            //     console.log('WebSocket Client Connected');
            //   };
            //   client.onmessage = (message) => {
            //     console.log('recived',message);
            //   };
            //   client.send('hello');
            //   client.onclose = ()=>{
            //       console.log('closed')
            //   }


        fetch('http://localhost:8080/newmessage',{
            method:'POST',
            mode:'cors',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                'phone':this.props.chat,
                'token':localStorage.getItem('whatsapp').slice(1,-1),
                'message':this.state.waiting
            })
        }

        ).then(res => res.json())
        .then(data => {
            this.setState({
                waiting:''
            })
            console.log('log...',data)
            if(data.status){

                this.props.setFlag(this.props.chat)
            }
        })
    }}

    render() { 
        return ( 
            <div className='Compose'>
                <i className="far fa-smile-beam"></i>
                <input type='text' name='compose' minLength='1' maxLength='512' value={this.state.composed} onChange={this.handleChange} placeholder='Compose message...'/>
                <i className="far fa-paper-plane" onClick={this.sendMsg}></i>
            </div>
         );
    }
}

const mapStateToProps = (state) => { return { chat:state.chat, contacts:state.contacts,sockets:state.sockets }}

 
export default connect(mapStateToProps)(Compose);