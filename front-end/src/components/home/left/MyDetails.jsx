import React from 'react'
import { connect } from 'react-redux'

class MyDetails extends React.Component {
    state = {  }
    SearchContact=()=>{
        var phone = prompt('Enter Phone number to search')
        if (phone===null){
        }
        else if(String(Number(phone)).length<5){
            alert('invalid phone number')
        }
        else {
            // fetch('http://localhost:8080/newchat',{
            //     method:'POST',
            //     headers:{'Content-Type': 'application/json; charset=utf-8'},
            //     body:JSON.stringify({
            //         token:JSON.parse(localStorage.getItem('whatsapp')),
            //         phone:phone
            //     })
            // }).then(res => res.json())
            // .then(data => 
            //     (data.status)?
            //     this.props.dispatch({
            //         type:'add-contact',
            //         data:data.data
            //     }):
            //     alert(data.details))
            this.props.sockets[this.props.mydata.phone].emit('newchat',{
                token:JSON.parse(localStorage.getItem('whatsapp')),
                phone:phone
            })
        }
    }
    createGroup=()=>{
        var grp = prompt('Enter group name to create')
        if(grp==null){            
        }
        else{
            this.props.sockets[this.props.mydata.phone].emit('create-group',{
                token:JSON.parse(localStorage.getItem('whatsapp')),
                group:grp
            })
        }
    }
    Logout=()=>{
        localStorage.removeItem('whatsapp')
        window.location.replace('/signup')
    }
    render() { 
        return ( 
            <div className='MyDetails'>
                <img className='ProfilePic' src={`${this.props.host}/images/${this.props.mydata.profile}`} alt='cant load' onClick={this.createGroup}></img>
        <div className='PhoneNumber'>{this.props.mydata.phone}</div>
                <div className='MyDetailsIcon'>
                    <i onClick={this.SearchContact} className='far fa-comment-alt' > </i>
                    <i class="fas fa-ellipsis-v" onClick={this.Logout}></i>

                </div>
            </div>
        );
    }
}
 const mapStateToProps = (state) => { return { sockets:state.sockets, host:state.host}}

export default connect(mapStateToProps)(MyDetails);