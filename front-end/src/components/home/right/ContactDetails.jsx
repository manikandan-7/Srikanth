import React from 'react'
import { connect } from 'react-redux';

class ContactDetails extends React.Component {
    state = { search:'' }
    addMembers=()=>{
        if(this.props.details.grpid && Boolean(this.props.details.admin)){
            var phone = prompt('Enter phone number of person to add')
            if(phone)
            this.props.sockets[this.props.myphone].emit('add-member-to-group',{
                grpid:this.props.details.grpid,
                token:JSON.parse(localStorage.getItem('whatsapp')),
                phone:phone
            })
        }
    }
    showChat=()=>{
        this.props.showChat()
    }
    showMedia =() =>{
        this.props.showMedia()
    }
    search=(e)=>{
        this.props.search(e.target.value)
    }
    render() { 
        return ( 
            <div className='ContactDetails' onDoubleClick={this.showMedia} >
                <img className='ProfilePic' src={(this.props.details.profile)?`${this.props.host}/images/${this.props.details.profile}`:this.props.host+'/images/nodp.jpeg'} alt='profile'></img>
                <div className='PhoneNumber'>{(this.props.details.phone)?this.props.details.phone:this.props.details.name}</div>
                
                <div className='ContactDetailsIcon'>
                {!this.props.isMedia ?<input type='text' placeholder='search' onChange={this.search} value={this.props.searchval} ></input>:<button onClick={this.showChat}>back</button>}
                    <i className="fas fa-paperclip" onClick={this.addMembers}></i>
                    <i className="fas fa-ellipsis-v"></i>
                </div>
            </div>
         );
    }
}

const mapStateToProps = (state) => { return { sockets:state.sockets,host:state.host}}

export default connect(mapStateToProps)(ContactDetails);