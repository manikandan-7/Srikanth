import React from 'react'
import { connect } from 'react-redux';

class ContactCard extends React.Component {
    state = {  }

    selectMe=(e)=>{
        console.log('hii',this.props.details.phone)
        this.props.dispatch({
            type:'swap-contact',
            data:(this.props.details.phone)?this.props.details.phone:this.props.details.grpid
        })
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
        
        return ( 
            <div className='ContactCard' onClick={this.selectMe} style={{backgroundColor:(this.props.chat===this.props.details.phone || this.props.chat===this.props.details.grpid)?'grey':'white'}}>
                <img src={(this.props.details.phone)?`${this.props.host}/images/${this.props.details.profile}`:`${this.props.host}/images/nodp.jpeg`} alt='profile'></img>
                <div>
                    <div className='Name'>
                        
                        {(this.props.details.phone)?this.props.details.phone:this.props.details.name}
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
const mapStateToProps = (state) => { return { chat: state.chat,host:state.host,messages:state.messages }}
 
export default connect(mapStateToProps)(ContactCard);