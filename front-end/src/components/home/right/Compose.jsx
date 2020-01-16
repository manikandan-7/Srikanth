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

const mapStateToProps = (state) => { return { chat:state.chat, contacts:state.contacts }}

 
export default connect(mapStateToProps)(Compose);