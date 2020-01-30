import React from 'react'
import { connect } from 'react-redux';

class ContactCard extends React.Component {
    state = { 
        
     }

    changeContactName=(e)=>{
        const contact = prompt('Enter new name for contact',e.name)
        if(contact==null){            
        }
        else{
            this.props.sockets[this.props.mydata.phone].emit('change-contact-name',{
                token:JSON.parse(localStorage.getItem('whatsapp')),
                id:e.userid,
                name:contact
            })
        }
    }

    selectMe=(e)=>{
        console.log('hii',this.props.details.phone)
        this.props.dispatch({
            type:'swap-contact',
            data:(this.props.details.phone)?this.props.details.phone:this.props.details.grpid
        })
        // this.props.contacts[this.props.details.phone]
        document.documentElement.style.setProperty('--bgColor',this.props.details.theme||'rgb(210, 210, 210)');
            // document.documentElement.style.setProperty('--fontColor',this.invertHex(this.state.color));
        if(this.props.details.userid) {
            fetch(this.props.host+'/markasread',{
                method:'POST',
                headers:{'Content-Type': 'application/json; charset=utf-8'},
                body:JSON.stringify({
                    token:JSON.parse(localStorage.getItem('whatsapp')),
                    to:this.props.details.userid
                })
            })
        }
        
    }
    render() { 
        console.log(this.props.updatedName,this.props.details.userid)
        return ( 
            <div className='ContactCard' onClick={this.selectMe} style={{backgroundColor:(this.props.chat===this.props.details.phone || this.props.chat===this.props.details.grpid)?'rgb(223, 221, 221)':'white'}}>
                <img src={(this.props.details.phone)?`${this.props.host}/images/${this.props.details.profile}`:`${this.props.host}/images/nodp.jpeg`} alt='profile'></img>
                <div>
                    <div className='Name'  onDoubleClick={(this.props.details.phone)&&(()=>this.changeContactName(this.props.details))} >
                        
                        {(this.props.updatedName[this.props.details.userid])||(this.props.details.phone)?this.props.details.name:this.props.details.name}
                    </div>
                    <div className='Preview'>
                        {console.log('..//??//..',this.props.messages[this.props.details.grpid])}
                        {(this.props.messages[this.props.details.phone])?this.props.messages[this.props.details.phone][this.props.messages[this.props.details.phone].length-1].message:(this.props.messages[this.props.details.grpid]!=undefined &&this.props.messages[this.props.details.grpid].length)?(this.props.messages[this.props.details.grpid][this.props.messages[this.props.details.grpid].length-1].message):''}
                    </div>

                </div>
            </div>
         );
    }
}
const mapStateToProps = (state) => { return {sockets:state.sockets,contacts:state.contacts, chat: state.chat,host:state.host,messages:state.messages }}
 
export default connect(mapStateToProps)(ContactCard);