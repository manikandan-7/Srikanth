import React from 'react'
import './HomeRight.css'
import ContactDetails from './ContactDetails'
import Compose from './Compose'
import MessageField from './MessageField'
import { connect } from 'react-redux'

// const jwt = require('jsonwebtoken')


class HomeRight extends React.Component {

    constructor(props){
        super(props)
        this.state={length:0,
            sockets:{},
            len:0,
            currentGrp:'',
            media:'',
            messages:{},
            search:'',
            isMedia:false
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

    fetch(this.props.host+'/initialfetch',{
        method:'POST',
        headers:{'Content-Type': 'application/json; charset=utf-8'},
        body:JSON.stringify({
            token:JSON.parse(localStorage.getItem('whatsapp')),
            to:this.state.currentchat.userid,
            start:start,
            msgid:this.props.messages[this.props.chat][0].msgid
        })
    })
    .then(res => res.json())
    .then(data => {
        var temp = this.props.messages
        // var temp = this.props.messages[element.phone]
        temp[element.phone] = data.reverse().concat(temp[element.phone])
        console.log(data.length)
        this.props.dispatch({
            type:'set-messages',
            data:temp
        })
        // console.log(element.phone,data)
})
}
componentWillReceiveProps(){
    this.setState({
        isMedia:false,
        search:'',
        searched:[],
        media:''
    })
    // alert('checking count')
}

addIncomingMessage=(msg)=>{
    console.log('recived',msg)
    var from;
    if(msg.to){
        console.log('recived private message')
        this.props.contacts.forEach(element =>{
            if(element.userid === msg.payload.msgFrm){
                from = element.phone
            }
        })
        var temp = this.state[from]
        
        if(!this.state[msg.to]){
            this.props.sockets[this.props.mydata.phone].emit('newchat',{
                token:JSON.parse(localStorage.getItem('whatsapp')),
                id:msg.payload.msgFrm
            })
            this.props.contacts.forEach(element =>{
                if(element.userid === msg.payload.msgFrm){
                    from = element.phone
                    temp = this.state[from]
                    if(!temp){
                        fetch(this.props.host+'/getgroups',{
                            method:'POST',
                            headers:{'Content-Type': 'application/json; charset=utf-8'},
                            body:JSON.stringify({
                                token: this.state.token
                            })   
                        }).then(res => res.json())
                        .then(res => {
                            console.log('testing',res)
                            res.status&&
                            res.groups.forEach(element=>{
                                console.log('push',element)
                                this.props.dispatch({
                                    type:'add-contact',
                                    data:element
                                })
                            })}).then(()=>{

                                temp.push(msg.payload)
                                this.setState({
                                    [from]:temp
                                })
                            })
                    }else{

                        temp.push(msg.payload)
                        this.setState({
                            [from]:temp
                        })
                    }
                }
            })
        }
        else{
            if(temp){
                temp.push(msg.payload)
                this.setState({
                    [from]:temp
                })
            }
        }
    }
    else if(this.props.mydata.userid!==msg.payload.msgFrm){
        

        temp = this.state[msg.grpto]
        msg.payload.message = String(msg.payload.message)
        console.log('recived group message',msg)
        temp.push(msg.payload)
        this.setState({
            [from]:temp
        })
    }
}


    addMessage=(msg)=>{
        if(msg.to){
            // var temp =(this.state[msg.to])?this.state[msg.to]:[]
            // temp.push(msg.payload)
            // setTimeout(() => {
                this.props.dispatch({
                    type:'add-message',
                    data:{
                        id:msg.to,
                        payload:msg.payload
                    }
                })
            // }, 100);
            
        }
        // else if(msg.grpto){
        //             temp = this.state[msg.grpto]?this.state[msg.grpto]:[]
        //             temp.push(msg.payload)
        //             setTimeout(() => {
        //                 this.setState({
        //                     [msg.grpto]:temp
        //                 })
        //             }, 100);
                    
        // }
        else{
            console.log('########## unable to determine message properties ############')
        }
    }
    setFlag2=(msg)=>{

    }

    setFlag=(msg)=>{
        console.log('chat msg res....',msg)
        var temp=(this.state[msg])?this.state[msg]:[]
        temp[temp.length-1].flag=1
        this.setState({
            [msg]:temp
        })
    }

    showMedia = ()=>{
        fetch(this.props.host+'/getmedia',{
            method:'POST',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                token: JSON.parse(localStorage.getItem('whatsapp')),
                id:this.props.chat
            })
            }).then(res=>res.json())
            .then(res=>{
                res =  (res.length)?res:[null]
                this.setState({
                    media:res,
                    isMedia:true
                })
        })
    }
    showChat=()=>{
        this.setState({
            media:[],
            isMedia:false
        })
    }
    search=(e)=>{

        this.setState({
            search:e
        },()=>{
            if(this.state.search.length){
                fetch(this.props.host+'/search',{
                    method:'POST',
                    headers:{'Content-Type': 'application/json; charset=utf-8'},
                    body:JSON.stringify({
                        token: JSON.parse(localStorage.getItem('whatsapp')),
                        id:this.props.chat,
                        search:this.state.search
                    })
                    }).then(res =>res.json())
                    .then(res=> {
                        (res.status)&&
                        this.setState({
                            searched:res.details
                        })
                    })
            }
        })
    }
    // componentWillReceiveProps(){
    //     alert('props in home right')
    // }
    // componentWillReceiveProps(){

    //     this.setState({
    //         messages:this.props.messages
    //     })
    // }
    render() {
        return ( 
            Number(this.props.onload) ?
            <div className='HomeRight'>
                <ContactDetails isMedia={this.state.isMedia} searchval={this.state.search} search={this.search} showMedia={this.showMedia} showChat={this.showChat} details={this.props.details} myid={this.props.mydata.userid} myphone={this.props.mydata.phone}/>
                <MessageField search={this.state.search} fetchMessages={this.fetchMessages} chat={this.props.chat} show={(this.state.search.length)?this.state.searched:this.props.messages[this.props.chat]} mydata={this.props.mydata} media={this.state.media}/>
                {!this.state.isMedia&&<Compose addMessage={this.addMessage} setFlag={this.setFlag} mydata={this.props.mydata} sockets={this.state.sockets}/>}
                
            </div>
            :
            <div className='HomeRight'><img src='/image.png' alt='' style={{width:'100%', height:'100%'}}></img></div>
         );
    }
}
const mapStateToProps = (state) => { return { contacts: state.contacts,chat: state.chat,sockets:state.sockets,host:state.host, messages:state.messages}}
export default connect(mapStateToProps)(HomeRight);