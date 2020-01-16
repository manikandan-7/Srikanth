import React from 'react'
import './HomeRight.css'
import ContactDetails from './ContactDetails'
import Compose from './Compose'
import MessageField from './MessageField'
import { connect } from 'react-redux'

class HomeRight extends React.Component {

    constructor(props){
        super(props)
        this.state={length:0}
    }

fetchMessages=async(element,start)=>{

    await this.props.mycontacts.contacts.forEach(element =>{
        console.log(element.phone,this.props.mycontacts.chat)
        if(element.phone === this.props.mycontacts.chat){
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
    this.props.mycontacts.contacts.forEach(element =>{
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
                length:this.props.mycontacts.contacts.length
            })
            console.log(element.phone,data)
    })
    })
}

    addMessage=(msg)=>{
        var temp = this.state[msg.to]
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
        if(this.state.length!==this.props.mycontacts.contacts.length){
            this.init()
        }
        
        console.log('rendered',this.props.mycontacts.contacts.length)
        return ( 
            this.props.onload ?
            <div className='HomeRight'>
                <ContactDetails details={this.props.details} />
                <MessageField fetchMessages={this.fetchMessages} chat={this.props.mycontacts.chat} show={this.state[this.props.mycontacts.chat]} mydata={this.props.mydata}/>
                <Compose addMessage={this.addMessage} setFlag={this.setFlag} mydata={this.props.mydata}/>
            </div>
            :
            <div className='HomeRight'><img src='/image.png' alt='' style={{width:'100%', height:'100%'}}></img></div>
         );
    }
}
const mapStateToProps = (state) => { return { mycontacts: state }}
export default connect(mapStateToProps)(HomeRight);