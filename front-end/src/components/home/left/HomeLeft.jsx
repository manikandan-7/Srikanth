import React from 'react'
import './HomeLeft.css'
import MyDetails from './MyDetails'
import SearchContact from './SearchContact'
import ContactList from './ContactList'

class HomeLeft extends React.Component {
    state = { search:'',updatedName:'' }

    handleChange=(e)=>{
        this.setState({
            search:e
        })
    }
    componentWillReceiveProps(){
        console.log('recived props')
        this.setState({
            updatedName:this.props.updatedName
        })
    }
    render() { 
        console.log('home..----,',this.state.updatedName)
        return ( 
            <div className='HomeLeft'>
                <MyDetails rerender={this.props.rerender} mydata={this.props.mydata}/>
                <SearchContact handleChange={this.handleChange} search={this.state.search}/>
                <ContactList updatedName={this.state.updatedName} rerender={this.props.rerender} mydata = {this.props.mydata} search={this.state.search}/>

            </div>
         );
    }
}
 
export default HomeLeft;