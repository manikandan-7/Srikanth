import React from 'react'

class Message extends React.Component {
    state = {  }

    getIcon(status){
        switch(status){
            case 0:
                return <i class="far fa-clock"></i>
            case 1:
                return <i className="fas fa-check"></i>
            case 2:
                return <i class="fas fa-check-double"></i>
            case 3:
                return <i class="fas fa-check-double" style={{color:'#3a97ea'}}></i>
            default:
                return ''
        }
    }

    render() { 
        return ( 
            <div className={(this.props.myid === this.props.show.msgFrm)?'SentMessage':'RecivedMessage'}>
                <div className='MessageContent'>
                    {this.props.show.message}
                </div>
                <div className='MessageTime'>
                    {new Date(this.props.show.timestamp).toLocaleString()}
                    {
                        (this.props.myid === this.props.show.msgFrm) &&
                            this.getIcon(this.props.show.flag)
                        // (this.props.show.flag)?
                        //     <i className="fas fa-check"></i>:<i class="far fa-clock"></i>
                            }
                </div>
            </div>
         );
    }
}
 
export default Message;