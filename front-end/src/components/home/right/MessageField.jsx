import React from 'react'
import Message from './Message'

class MessageField extends React.Component {

    constructor(){
        super()
        this.state={}
    }

    

    scrolling=(e)=>{
        // console.log(e.target.scrollHeight,e.target.scrollTop,e.target.offsetHeight,e.target.offsetTop)
        if(e.target.scrollTop===0){
            console.log('have to fetch')
            this.props.fetchMessages({
                userid:(this.props.show[0].msgFrm!==this.props.myid)?this.props.show[0].msgTo:this.props.show[0].msgFrm,
                msgid:this.props.show[0].msgid,
                phone:this.props.chat
            },
            this.props.show.length-1)
        }
        // console.log(e.target)
    }
    
    render() { 
        
        return ( 
            <div className='MessageField' onScroll={this.scrolling}>
                {
                this.props.show &&
                this.props.show.map(element=>
                    <Message show={element} myid={this.props.mydata.userid}/>
                    
                )}
            </div>
         );
    }
}
 


export default  MessageField;