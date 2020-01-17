import React from 'react'
import { connect } from 'react-redux';

class ContactCard extends React.Component {
    state = {  }

    selectMe=(e)=>{
        console.log('hii',this.props.details.phone)
        this.props.dispatch({
            type:'swap-contact',
            data:this.props.details.phone
        })

        fetch('http://localhost:8080/markasread',{
            method:'POST',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                token:JSON.parse(localStorage.getItem('whatsapp')),
                to:this.props.details.userid
            })
        })
    }
    render() { 
        return ( 
            <div className='ContactCard' onClick={this.selectMe} style={{backgroundColor:(this.props.chat===this.props.details.phone)?'grey':'white'}}>
                <img src={this.props.details.profile} alt='profile'></img>
                <div>
                    <div className='Name'>
                        {this.props.details.phone}
                    </div>
                    <div className='Preview'>
                        {this.props.details.name}
                    </div>

                </div>
            </div>
         );
    }
}
const mapStateToProps = (state) => { return { chat: state.chat }}
 
export default connect(mapStateToProps)(ContactCard);