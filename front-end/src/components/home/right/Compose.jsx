import React from 'react'
import { connect } from 'react-redux'

class Compose extends React.Component {
    constructor(){
        super()
        this.state={
            composed : '',
            waiting:'',
            picmsg:[],
            picbase:[],
            picmsgvalue:''
        }

    }



    handleImage=(e)=>{
            this.setState({
                picmsg:e.target.files,
                picmsgvalue:e.target.value,
            })

            for(let i =0;i<e.target.files.length;i++){
                this.toBase64(e.target.files[i]).then(res=>{
                    let temp= this.state.picbase
                    temp.push(res)
                    this.setState({
                        picbase:temp
                    })
                })
            }
            // e.target.files.forEach(element=>{
            //     this.toBase64(element).then(res=>{
            //         let temp = this.state.picbase
            //         temp.push(res)
            //         this.setState({
            //             picbase:temp
            //         })
            //     })
            // })

        
    }

    handleChange=(e)=>{
        this.setState({
            composed:e.target.value,
            waiting:e.target.value

        })
    }
    sendMsg=(e)=>{
        const ts=new Date().getTime().toString()
        if (this.state.composed.length>=1 || this.state.picmsg.length){ 
            var msg,msg1;
            if(String(this.props.chat).length>5){
                if(this.state.picmsg.length){
                    //--------------------multiple pic messages--------------------//
                    this.state.picbase.forEach((element,index) => {
                        msg = {
                            to:this.props.chat,
                            payload:{
                                msgFrm:this.props.mydata.userid,
                                message:(index)?'':this.state.composed,
                                media:this.state.picmsg[index],
                                timestamp:new Date(),
                                flag:0
                            },
                            ts:ts
                        }
                        msg1 = {
                            to:this.props.chat,
                            payload:{
                                msgFrm:this.props.mydata.userid,
                                message:(index)?'':this.state.composed,
                                media:element,
                                timestamp:new Date(),
                                flag:0
                            },
                            ts:ts
                        }
                        this.setState({
                            composed:'',
                            picmsgvalue:''
                        })
                        this.props.addMessage(msg1)
                        this.props.sockets[this.props.mydata.phone].emit('chat-message',{

                            // grpid:(Number(this.props.chat)?null:),
                            token:localStorage.getItem('whatsapp').slice(1,-1),
                            msg:msg
                        })
                    });
                }
                //---------------- End multiple pic messages---------------------//
            else{
                msg = {
                    to:this.props.chat,
                    payload:{
                        msgFrm:this.props.mydata.userid,
                        message:this.state.composed,
                        media:'',
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
                        media:'',
                        timestamp:new Date(),
                        flag:0
                    },
                    ts:ts
                }
                this.props.addMessage(msg1)
      

                this.props.sockets[this.props.mydata.phone].emit('chat-message',{
    
                    // grpid:(Number(this.props.chat)?null:),
                    token:localStorage.getItem('whatsapp').slice(1,-1),
                    msg:msg
                })
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
            

            
            this.props.addMessage(msg1)
      

            this.props.sockets[this.props.mydata.phone].emit('chat-message',{

                // grpid:(Number(this.props.chat)?null:),
                token:localStorage.getItem('whatsapp').slice(1,-1),
                msg:msg
            })
        }
        this.setState({
            composed:'',
            picmsg:'',
            picbase:'',
            picmsgvalue:''
        })

    }}


        toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    sendMessage=(e)=>{
        if(e.keyCode===13){
            this.sendMsg()
        }
    }
    
    render() { 
        return ( 
            <div className='Compose'> 
                <i className="far fa-smile-beam"  onClick={this.triggerClick}></i>
                <input onKeyDown={this.sendMessage} type='text' name='compose' minLength='1' maxLength='512' value={this.state.composed} onChange={this.handleChange} placeholder='Compose message...'/>
                <input type='file' name='picmsg' onChange={this.handleImage} value={this.state.picmsgvalue}style={{paddingLeft:'1em',maxWidth:'16vw'}} multiple></input>
                <i className="far fa-paper-plane" onClick={this.sendMsg}></i>
            </div>
         );
    }
}

const mapStateToProps = (state) => { return { chat:state.chat, contacts:state.contacts,sockets:state.sockets }}

 
export default connect(mapStateToProps)(Compose);