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
            fetch('http://localhost:8080/newchat',{
                method:'POST',
                headers:{'Content-Type': 'application/json; charset=utf-8'},
                body:JSON.stringify({
                    token:JSON.parse(localStorage.getItem('whatsapp')),
                    phone:phone
                })
            }).then(res => res.json())
            .then(data => 
                (data.status)?
                this.props.dispatch({
                    type:'add-contact',
                    data:data.data
                }):
                alert(data.details))
        }
    }
    Logout=()=>{
        localStorage.removeItem('whatsapp')
        window.location.replace('/signup')
    }
    render() { 
        return ( 
            <div className='MyDetails'>
                <img className='ProfilePic' src={this.props.mydata.profile} alt='cant load'></img>
        <div className='PhoneNumber'>{this.props.mydata.phone}</div>
                <div className='MyDetailsIcon'>
                    <i onClick={this.SearchContact} className='far fa-comment-alt' > </i>
                    <i class="fas fa-ellipsis-v" onClick={this.Logout}></i>

                </div>
            </div>
        );
    }
}
 
export default connect()(MyDetails);