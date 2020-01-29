import React from 'react'
import { connect } from 'react-redux';

class ContactDetails extends React.Component {
    state = { search:'',color:'#f0f0f0' }
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

    invertHex = (col) => {
        const colors = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
        let inverseColor = '#'
        col.replace('#','').split('').forEach(i => {
          const index = colors.indexOf(i)
          inverseColor += colors.reverse()[index]
        })
        console.log(col,inverseColor)
        return inverseColor
      }

    changeColor=async(e)=>{
        this.setState({
            color:e.target.value
        },()=>{
            document.documentElement.style.setProperty('--bgColor',this.state.color);
            // document.documentElement.style.setProperty('--fontColor',this.invertHex(this.state.color));
            this.props.sockets[this.props.myphone].emit('set-theme',{
                token:JSON.parse(localStorage.getItem('whatsapp')),
                id:this.props.details.userid,
                theme:this.state.color
            })
            let temp = this.props.contacts
            temp.forEach((element,index)=>{
                console.log('.......',element.phone,this.props.chat)
                if(element.phone===this.props.chat){
                    temp[index].theme=this.state.color
                    console.log(temp[index])
                    this.props.dispatch({
                        type:'update-contact',
                        data:{contacts:temp}
                    })
                }
            })
        })
    }
    render() { 
        return ( 
            <div className='ContactDetails'>
                <img className='ProfilePic' src={(this.props.details.profile)?`${this.props.host}/images/${this.props.details.profile}`:this.props.host+'/images/nodp.jpeg'} alt='profile'></img>
                <div className='PhoneNumber' onDoubleClick={this.showMedia}>{(this.props.details.phone)?this.props.details.phone:this.props.details.name}</div>
                
                <div className='ContactDetailsIcon'>
                    {(this.props.searchval.length)?
                        <div className='searchCounter'>
                            <div className='arrows'>
                            <div onClick={this.props.prev}>▲</div>
                            <div onClick={this.props.next}>▼</div>
                            </div>
                            <div>{this.props.current}/{this.props.count}</div>

                        </div>:''}
                    
                {!this.props.isMedia ?<input className='searchChat' type='text' placeholder='search' onChange={this.search} value={this.props.searchval} ></input>:<button onClick={this.showChat}>back</button>}
                    {this.props.details.admin?<i className="fas fa-user-plus" onClick={this.addMembers}></i>:''}

                {this.props.details.phone&&<input type="color" name="favcolor" value={this.state.color} onChange={this.changeColor}/>}
                    {/* <i className="fas fa-ellipsis-v"></i> */}
                </div>
            </div>
         );
    }
}

const mapStateToProps = (state) => { return { sockets:state.sockets,contacts:state.contacts,host:state.host,chat:state.chat}}

export default connect(mapStateToProps)(ContactDetails);