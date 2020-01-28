import React from 'react'
import './HomeLeft.css'
import MyDetails from './MyDetails'
import SearchContact from './SearchContact'
import ContactList from './ContactList'

class HomeLeft extends React.Component {
    state = { search:'' }

    handleChange=(e)=>{
        this.setState({
            search:e
        })
    }
    render() { 
        return ( 
            <div className='HomeLeft'>
                <MyDetails mydata={this.props.mydata}/>
                <SearchContact handleChange={this.handleChange} search={this.state.search}/>
                <ContactList rerender={this.props.rerender} search={this.state.search}/>

            </div>
         );
    }
}
 
export default HomeLeft;