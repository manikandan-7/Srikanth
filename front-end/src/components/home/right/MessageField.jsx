import React from 'react'
import Message from './Message'
import { connect } from 'react-redux'
import Datestamp from './Datestamp'

class MessageField extends React.Component {

    constructor(props){
        super(props)
        this.state={show:[],dates:[],trigger:true}
        
    }

    
    

    // componentDidUpdate(){
    //     this.setState({
    //         show:this.props.show
    //     })
    // }
    scrolling=(e)=>{
        // console.log(e.target.scrollHeight,e.target.scrollTop,e.target.offsetHeight,e.target.offsetTop)
        if(e.target.scrollTop===0){
            console.log('have to fetch')
            this.props.show[0] && String(this.props.chat).length>5 &&
            this.props.fetchMessages({
                userid:(this.props.show[0].msgFrm!==this.props.myid)?this.props.show[0].msgTo:this.props.show[0].msgFrm,
                msgid:this.props.show[0].msgid,
                phone:this.props.chat
            },
            this.props.show.length-1)
        }
        // console.log(e.target)
    }
    // componentWillReceiveProps(){
    //     alert('update')
    // }
    isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
          someDate.getMonth() === today.getMonth() &&
          someDate.getFullYear() === today.getFullYear()
      }
      isYesterday = (someDate) => {
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return someDate.getDate() === yesterday.getDate() &&
          someDate.getMonth() === yesterday.getMonth() &&
          someDate.getFullYear() === yesterday.getFullYear()
      }
      checkdates=(ts)=>{
        //   alert(this.state.dates)
            if(!this.state.dates.includes(new Date(ts).setHours(0,0,0,0))){
                console.log('inside if',this.state.trigger)
                let temp = this.state.dates
                temp.push(new Date(ts).setHours(0,0,0,0))
                this.setState({
                    dateset:true,
                    dates:temp,
                    trigger:true
                })
                console.log(new Date(ts).setHours(0,0,0,0))
                return new Date(ts).setHours(0,0,0,0)
            }
            else{
                
                // if(this.state.trigger){
                //     console.log('inside else if', this.state.trigger)
                //     this.state.trigger=false
                // }
                // this.setState({
                //     dateset:false
                // })
            }
      }
      
    
    render() { 
        let dates=[]
        // alert(this.)
        
        return ( 
            <div className='MessageField' onScroll={this.scrolling}>
                {
                (this.props.media.length)?
                    (this.props.media[0])?
                <div className='showMedia'>{
                this.props.media.map(element=>
                    
                    <img src={`${this.props.host}/images/msg/${element}`} alt=""/>
                    
                    )}
                    </div>:'no media found'
                :
                this.props.show &&
                this.props.show.map(element=>
                    // (this.checkdates(element.timestamp).length)?'element':''||
                    // <div>
                    // <Datestamp date={
                    //    (this.state.trigger)? new Date(element.timestamp).setHours(0,0,0,0):undefined}>
                    //     </Datestamp>
                    <Message rerender={this.props.rerender} show={element} myid={this.props.mydata.userid}/>
                    // </div>
                )}
            </div>
         );
    }
}
 
const mapStateToProps = (state) => { return { host:state.host, messages:state.messages}}

export default connect(mapStateToProps) (MessageField);