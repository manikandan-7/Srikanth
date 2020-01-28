import React from 'react'
import { connect } from 'react-redux'

class Message extends React.Component {
    state = {  }

    getIcon(status){
        switch(status){
            case 0:
                // console.log('not delevered message.jsx line 12')
                return <i class="far fa-clock"></i>
            case 1:
                // console.log('delevered message.jsx line 12')
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
        // alert('rendered')
        return ( 
            <div className={(this.props.myid === this.props.show.msgFrm ||this.props.myid === this.props.show.grpFrom)?'SentMessage':'RecivedMessage'}>
                <div className='MessageContent'>
                    <div style={{color:'blue'}}>{(this.props.show.grpFrom!==this.props.myid)&&this.props.show.groupFrm}</div>
                {this.props.show.media&&
                    <img src={(this.props.show.media>15)?`${this.props.host}/images/msg/${this.props.show.media}`:this.props.show.media} style={{maxWidth:'100%'}}/>
                }
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
const mapStateToProps = (state) => { return { host:state.host}}
 
export default connect(mapStateToProps) (Message);