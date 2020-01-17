import React from 'react'

class ContactDetails extends React.Component {
    state = {  }
    render() { 
        return ( 
            <div className='ContactDetails'>
                <img className='ProfilePic' src={this.props.details.profile} alt='profile'></img>
                <div className='PhoneNumber'>{this.props.details.phone}</div>
                <div className='ContactDetailsIcon'>
                    <i className="fas fa-paperclip"></i>
                    <i className="fas fa-ellipsis-v"></i>
                </div>
            </div>
         );
    }
}
 
export default ContactDetails;