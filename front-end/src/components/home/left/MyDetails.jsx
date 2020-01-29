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
            // this.props.sockets[this.props.mydata.phone].emit('add-contact',{
            //     token:JSON.parse(localStorage.getItem('whatsapp')),
            //     phone:phone
            // })
        }
    }


    updateProfile=(e)=>{
        this.setState({
            newDp:e.target.files[0]
        },()=>{
            this.props.sockets[this.props.mydata.phone].emit('update-dp',{dp:this.state.newDp,
            phone:this.props.mydata.phone})
        })
    }

    //------------------------------------------------------
    // onClick={this.createGroup}
    //--------------------------------------------------------

    updateName=()=>{
        let name = prompt('Enter new name')
        if(name!=null){
            this.props.sockets[this.props.mydata.phone].emit('change-name',{
                token:JSON.parse(localStorage.getItem('whatsapp')),
                name:name
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
                <div className='dp'>

                <label for='file-input'>

                <img className='ProfilePic' src={`${this.props.host}/images/${this.props.mydata.profile}?${new Date().toLocaleString()}`} alt='cant load' ></img>

            </label>
            <input id='file-input' type='file' onChange={this.updateProfile}></input>
                </div>
        <div className='PhoneNumber' onClick={this.updateName}>{this.props.mydata.phone}</div>
                <div className='MyDetailsIcon'>
                <i class="fa fa-users" aria-hidden="true" onClick={this.createGroup}></i>
                    <i onClick={this.SearchContact} className='far fa-comment-alt' > </i>
                    <i class="fas fa-sign-out-alt" onClick={this.Logout}></i>

                </div>
            </div>
        );
    }
}
 const mapStateToProps = (state) => { return { sockets:state.sockets, host:state.host}}

export default connect(mapStateToProps)(MyDetails);