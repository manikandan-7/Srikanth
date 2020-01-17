import React from 'react'
import HomeRight from './HomeRight';
import { connect } from 'react-redux';

class HomeRightContainer extends React.Component {
    // constructor(){
    //     super()
    //     this.state={
    //         current:[]
    //     }
    // }
    // componentWillReceiveProps(){
    //     console.log('recived props',this.props.mycontacts)

    //     this.props.mycontacts.contacts.forEach(element => {
    //         console.log(element.phone)
    //         this.setState({
    //             [element.phone]:[]
    //         })
    //     })
    // }
// componentDidMount(){

//     this.props.dispatch({
            
//         type:'update-chat',
//         data:['hiiii']
    
// })
// }
render() { 
        var temp = this.props.details.contacts
        for (var i=0;i<temp.length;i++){
            if(temp[i].phone === this.props.details.chat){
                temp=temp[i]
                break
            }
        }
        
        return (
            
                // this.props.details.chat.length ?
                <HomeRight details={temp} mydata={this.props.mydata} onload={this.props.details.chat.length}/>
                // :
                // <HomeRight onload={false}/>
                // <div className='HomeRight'><img src='/image.png' alt='' style={{width:'100%', height:'100%'}}></img></div>
            )
        // return ( 
        //     <HomeRight details={temp}/>
        //  );
    }
}

const mapStateToProps = (state) => { return { details:state }}

export default connect(mapStateToProps)(HomeRightContainer);