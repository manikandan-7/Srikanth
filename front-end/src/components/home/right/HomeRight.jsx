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
            isMedia:false,
            recived:true,
            current:0
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
    console.log('recived props in home right')
    this.setState({
        isMedia:false,
        search:'',
        searched:[],
        media:''
    })
    // alert('checking count')
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
                this.setState({
                    recived:!this.state.recived
                })
            // }, 100);
            
        }
        else if(msg.grpto){
        //             temp = this.state[msg.grpto]?this.state[msg.grpto]:[]
        //             temp.push(msg.payload)
        //             setTimeout(() => {
        //                 this.setState({
        //                     [msg.grpto]:temp
        //                 })
        //             }, 100); 
        this.setState({
            recived:true
        })
        // setTimeout(() => {
            // alert(msg.grpto)
                this.props.dispatch({
                    type:'add-message',
                    data:{
                        id:msg.grpto,
                        payload:msg.payload
                    }
                })
            // }, 100);

                    
        }
        else{
            console.log('########## unable to determine message properties ############')
        }
    }
    setFlag2=(msg)=>{

    }
    next =()=>{
        this.setState({
            current:(this.state.current+1<=this.state.count)?this.state.current+1:this.state.current
        },this.repeted())
    }
    prev=()=>{
        this.setState({
            current:(this.state.current-1>=1)?this.state.current-1:this.state.current
        },this.repeted())
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
        this.setState({
            search:''
        })
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

    repeted =()=>{
        if(this.state.count-this.state.current){
        fetch(this.props.host+'/searchten',{
            method:'POST',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                token: JSON.parse(localStorage.getItem('whatsapp')),
                id:this.props.chat,
                search:this.state.msgids[this.state.current].msgid
            })
        }).then(res => res.json())
        .then(data => {
            this.setState({
                searched:data.details
            })
        })}
        else{
            this.setState({
                searched:[]
            })
        }
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
                            msgids:res.details,
                            count:res.details.length,
                            current:(res.details.length)?1:0
                            // searched:res.details
                        },()=>{
                            (this.state.count)&&
                            fetch(this.props.host+'/searchten',{
                                method:'POST',
                                headers:{'Content-Type': 'application/json; charset=utf-8'},
                                body:JSON.stringify({
                                    token: JSON.parse(localStorage.getItem('whatsapp')),
                                    id:this.props.chat,
                                    search:this.state.msgids[this.state.current-1].msgid
                                })
                            }).then(res => res.json())
                            .then(data => {
                                this.setState({
                                    searched:data.details
                                })
                            })
                        })
                    })
            }
            else{
                this.setState({
                    searched:[]
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
        console.log('rendered',this.props.messages[this.props.chat])
        return ( 
            Number(this.props.onload) ?
            <div className='HomeRight'>
                <ContactDetails next ={this.next} prev={this.prev} current={this.state.current} count={this.state.count} isMedia={this.state.isMedia} searchval={this.state.search} search={this.search} showMedia={this.showMedia} showChat={this.showChat} details={this.props.details} myid={this.props.mydata.userid} myphone={this.props.mydata.phone}/>
                <MessageField rerender = {this.props.rerender} recived={this.state.recived} search={this.state.search} fetchMessages={this.fetchMessages} chat={this.props.chat} show={(this.state.search.length)?this.state.searched:this.props.messages[this.props.chat]} mydata={this.props.mydata} media={this.state.media}/>
                {!this.state.isMedia&&<Compose addMessage={this.addMessage} setFlag={this.setFlag} mydata={this.props.mydata} sockets={this.state.sockets}/>}
                
            </div>
            :
            <div className='HomeRight'><img src='/image.png' alt='' style={{width:'100%', height:'100%'}}></img></div>
         );
    }
}
const mapStateToProps = (state) => { return { contacts: state.contacts,chat: state.chat,sockets:state.sockets,host:state.host, messages:state.messages}}
export default connect(mapStateToProps)(HomeRight); 