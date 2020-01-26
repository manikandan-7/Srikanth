import React from 'react'
import { connect } from 'react-redux'

class Compose extends React.Component {
    constructor(){
        super()
        this.state={
            composed : '',
            waiting:'',
            picmsg:'',
            picbase:'',
            picmsgvalue:''
        }

    }



    handleImage=(e)=>{
            this.setState({
                picmsg:e.target.files[0],
                picmsgvalue:e.target.value,
            })

        this.toBase64(e.target.files[0]).then(res=>{
            this.setState({
                picbase:res
            })
        })
        
    }

    handleChange=(e)=>{
        this.setState({
            composed:e.target.value,
            waiting:e.target.value

        })
    }
    sendMsg=(e)=>{
        const ts=new Date().getTime().toString()
        if (this.state.composed.length>=1 || this.state.picmsg){ 
            var msg,msg1;
            if(String(this.props.chat).length>5){
                msg = {
                    to:this.props.chat,
                    payload:{
                        msgFrm:this.props.mydata.userid,
                        message:this.state.composed,
                        media:this.state.picmsg,
                        timestamp:new Date(),
                        flag:0
                    },
                    ts:ts
                }
                msg1 = {
                    to:this.props.chat,
                    payload:{
                        msgFrm:this.props.mydata.userid,
                        message:this.state.composed,
                        media:this.state.picbase,
                        timestamp:new Date(),
                        flag:0
                    },
                    ts:ts
                }
            }
            else{
                msg = {
                    grpto:this.props.chat,
                    payload:{
                        msgFrm:this.props.mydata.userid,
                        phone:this.props.mydata.phone,
                        message:this.state.composed,
                        media:this.state.picmsg,
                        timestamp:new Date(),
                        flag:0
                    },
                    ts:ts
                }
                msg1 = {
                    grpto:this.props.chat,
                    payload:{
                        msgFrm:this.props.mydata.userid,
                        message:this.state.composed,
                        media:this.state.picbase,
                        timestamp:new Date(),
                        flag:0
                    },
                    ts:ts
                }
            }

            
            this.props.addMessage(msg1)
            this.setState({
                composed:'',
                picmsg:'',
                picbase:'',
                picmsgvalue:''
            })

            this.props.sockets[this.props.mydata.phone].emit('chat-message',{

                // grpid:(Number(this.props.chat)?null:),
                token:localStorage.getItem('whatsapp').slice(1,-1),
                msg:msg
            })
     

    }}


        toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    
    render() { 
        return ( 
            <div className='Compose'> 
                <i className="far fa-smile-beam"  onClick={this.triggerClick}></i>
                <input type='text' name='compose' minLength='1' maxLength='512' value={this.state.composed} onChange={this.handleChange} placeholder='Compose message...'/>
                <input type='file' name='picmsg' onChange={this.handleImage} value={this.state.picmsgvalue}style={{paddingLeft:'1em',maxWidth:'16vw'}}></input>
                <i className="far fa-paper-plane" onClick={this.sendMsg}></i>
            </div>
         );
    }
}

const mapStateToProps = (state) => { return { chat:state.chat, contacts:state.contacts,sockets:state.sockets }}

 
export default connect(mapStateToProps)(Compose);